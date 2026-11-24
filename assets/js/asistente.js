/* Asistente del perfil: un clasificador de intención que corre en el navegador.

   Modelo: TF-IDF de n-gramas de caracteres + regresión logística multinomial, entrenado con
   scikit-learn y exportado a assets/data/asistente-modelo.json. Aquí se repite, paso a paso,
   la misma transformación que hace scikit-learn, y se devuelve el texto de la intención ganadora.
   No genera texto: si ninguna intención supera el umbral, dice que no sabe. */
(function (raiz) {
  'use strict';

  // 1. Normalizar: minúsculas, sin tildes, solo letras y números
  function normalizar(t) {
    return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  // 2. N-gramas de caracteres dentro de cada palabra, con un espacio a cada lado (analyzer="char_wb")
  function ngramas(texto, min, max) {
    var out = [], palabras = texto.split(' ');
    for (var p = 0; p < palabras.length; p++) {
      if (!palabras[p]) continue;
      var w = ' ' + palabras[p] + ' ';
      for (var n = min; n <= max; n++) {
        var i = 0;
        out.push(w.slice(0, n));
        while (i + n < w.length) { i++; out.push(w.slice(i, i + n)); }
        if (i === 0) break;                      // palabra más corta que n: se cuenta una sola vez
      }
    }
    return out;
  }
  // 3. Vector TF-IDF (tf sublineal, norma 2) -> 4. puntajes lineales -> 5. softmax
  function predecir(m, pregunta) {
    var g = ngramas(normalizar(pregunta), m.ngramas[0], m.ngramas[1]), cuenta = {}, i, k;
    for (i = 0; i < g.length; i++) if (m.vocabulario[g[i]]) cuenta[g[i]] = (cuenta[g[i]] || 0) + 1;
    var idx = [], val = [], norma = 0;
    for (k in cuenta) {
      var v = (1 + Math.log(cuenta[k])) * m.vocabulario[k][1];
      idx.push(m.vocabulario[k][0]); val.push(v); norma += v * v;
    }
    norma = Math.sqrt(norma) || 1;
    var z = m.sesgos.slice(), c, maximo = -Infinity, suma = 0;
    for (c = 0; c < z.length; c++) {
      for (i = 0; i < idx.length; i++) z[c] += m.pesos[c][idx[i]] * (val[i] / norma);
      if (z[c] > maximo) maximo = z[c];
    }
    var prob = z.map(function (x) { var e = Math.exp(x - maximo); suma += e; return e; });
    var orden = prob.map(function (e, j) { return { clase: m.clases[j], p: e / suma }; });
    orden.sort(function (a, b) { return b.p - a.p; });
    return { orden: orden, conocidos: idx.length };
  }
  function responder(m, pregunta) {
    var r = predecir(m, pregunta), top = r.orden[0];
    var sabe = r.conocidos > 0 && top.clase !== 'fuera' && top.p >= m.umbral;
    return { sabe: sabe, clase: top.clase, p: top.p, orden: r.orden };
  }

  var API = { normalizar: normalizar, ngramas: ngramas, predecir: predecir, responder: responder };
  if (typeof module !== 'undefined' && module.exports) { module.exports = API; return; }   // para probarlo en Node
  raiz.AsistentePerfil = API;

  /* ---------- Interfaz ---------- */
  function iniciar() {
    var form = document.getElementById('pf-form');
    if (!form) return;
    var entrada = document.getElementById('pf-pregunta'), caja = document.getElementById('pf-respuesta');
    var tema = document.getElementById('pf-tema'), texto = document.getElementById('pf-texto');
    var barras = document.getElementById('pf-barras'), ficha = document.getElementById('pf-ficha');
    var modelo = null, escribiendo = null;
    var base = (document.querySelector('script[src*="asistente.js"]').getAttribute('src') || '').replace(/js\/asistente\.js.*$/, '');

    fetch(base + 'data/asistente-modelo.json').then(function (r) { return r.json(); }).then(function (m) {
      modelo = m;
      var f = m.ficha;
      ficha.textContent = 'Modelo: ' + m.tipo + ' · entrenado con ' + f.preguntas_entrenamiento + ' preguntas · ' +
        f.exactitud_prueba_pct.toString().replace('.', ',') + ' % de acierto en ' + f.preguntas_prueba +
        ' preguntas que nunca vio · ' + Object.keys(m.vocabulario).length + ' n-gramas · sin servidor';
    }).catch(function () { ficha.textContent = 'No se pudo cargar el modelo. Recarga la página.'; });

    function escribir(el, t) {
      clearInterval(escribiendo);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = t; return; }
      var i = 0; el.textContent = '';
      escribiendo = setInterval(function () { i += 3; el.textContent = t.slice(0, i); if (i >= t.length) clearInterval(escribiendo); }, 16);
    }
    function preguntar(q) {
      if (!modelo || !q.trim()) return;
      var r = responder(modelo, q);
      caja.hidden = false;
      if (r.sabe) {
        tema.textContent = modelo.entradas[r.clase].titulo;
        escribir(texto, modelo.entradas[r.clase].respuesta);
      } else {
        tema.textContent = 'Fuera de mi perfil';
        escribir(texto, 'Eso no está entre lo que sé responder. Este modelo solo conoce mi perfil: mi trabajo, mis proyectos, mi formación, mi empresa y mi plan hasta 2030. Prueba con una de las preguntas sugeridas.');
      }
      // Las tres intenciones más probables, tal como las calculó el modelo
      barras.innerHTML = '';
      r.orden.slice(0, 3).forEach(function (o) {
        var nombre = o.clase === 'fuera' ? 'Fuera de tema' : modelo.entradas[o.clase].titulo;
        var d = document.createElement('div'); d.className = 'pf-barra';
        d.innerHTML = '<div><span></span><b></b></div><i><u></u></i>';
        d.querySelector('span').textContent = nombre;
        d.querySelector('b').textContent = Math.round(o.p * 100) + ' %';
        barras.appendChild(d);
        requestAnimationFrame(function () { requestAnimationFrame(function () { d.querySelector('u').style.width = Math.max(2, o.p * 100) + '%'; }); });
      });
    }
    form.addEventListener('submit', function (ev) { ev.preventDefault(); preguntar(entrada.value); });
    document.getElementById('pf-sugerencias').addEventListener('click', function (ev) {
      if (ev.target.tagName !== 'BUTTON') return;
      entrada.value = ev.target.textContent; preguntar(entrada.value);
    });
    // Enlace directo: /about/?p=tu+pregunta#asistente
    var inicial = new URLSearchParams(location.search).get('p');
    if (inicial) { entrada.value = inicial; var espera = setInterval(function () { if (modelo) { clearInterval(espera); preguntar(inicial); } }, 100); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})(typeof window !== 'undefined' ? window : this);
