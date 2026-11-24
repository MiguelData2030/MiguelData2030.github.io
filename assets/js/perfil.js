/* Página "Acerca de mí": red neuronal 3D, texto rotativo, contadores, aparición al hacer scroll
   y tarjetas con inclinación 3D. Sin librerías. */
(function () {
  'use strict';
  var QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Red 3D: nodos sobre una esfera, unidos por aristas, con señales que viajan ---------- */
  function red(canvas) {
    var ctx = canvas.getContext('2d');
    var N = 110, nodos = [], aristas = [], pulsos = [];
    var ancho = 0, alto = 0, dpr = 1, rotY = 0, rotX = 0.35, objX = 0, objY = 0, visible = true, ultimo = 0;

    // Puntos repartidos de forma uniforme en la esfera (espiral de Fibonacci)
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * Math.PI * (3 - Math.sqrt(5));
      nodos.push({ x: Math.cos(t) * r, y: y, z: Math.sin(t) * r, capa: i % 3 });
    }
    // La esfera es rígida: las aristas se calculan una sola vez
    for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) {
      var dx = nodos[a].x - nodos[b].x, dy = nodos[a].y - nodos[b].y, dz = nodos[a].z - nodos[b].z;
      if (dx * dx + dy * dy + dz * dz < 0.17) aristas.push([a, b]);
    }
    var COLOR = ['91,157,255', '139,123,255', '45,212,167'];

    function medir() {
      var caja = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = caja.width; alto = caja.height;
      canvas.width = Math.round(ancho * dpr); canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function proyectar(n, cy, sy, cx, sx, R, ox, oy) {
      var x = n.x * cy + n.z * sy, z = -n.x * sy + n.z * cy;      // giro en Y
      var y = n.y * cx - z * sx; z = n.y * sx + z * cx;           // giro en X
      var k = 2.6 / (2.6 + z);                                    // perspectiva
      return { x: ox + x * R * k, y: oy + y * R * k, z: z, k: k };
    }
    function dibujar(dt) {
      rotY += dt * 0.00012 + (objX - rotY % 1) * 0;               // giro constante
      var gy = rotY + objX * 0.5, gx = rotX + objY * 0.35;
      var cy = Math.cos(gy), sy = Math.sin(gy), cx = Math.cos(gx), sx = Math.sin(gx);
      var estrecho = ancho < 760;
      var R = Math.min(alto * 0.46, ancho * (estrecho ? 0.55 : 0.30));
      var ox = estrecho ? ancho * 0.78 : ancho * 0.80, oy = alto * (estrecho ? 0.30 : 0.44);
      var p = nodos.map(function (n) { return proyectar(n, cy, sy, cx, sx, R, ox, oy); });

      ctx.clearRect(0, 0, ancho, alto);
      ctx.lineWidth = 1;
      for (var i = 0; i < aristas.length; i++) {
        var u = p[aristas[i][0]], v = p[aristas[i][1]], prof = (2 - (u.z + v.z)) / 4;   // 0 atrás, 1 adelante
        ctx.strokeStyle = 'rgba(120,150,210,' + (0.04 + prof * 0.16).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(v.x, v.y); ctx.stroke();
      }
      // Señales: un punto brillante que recorre una arista, como una activación
      if (!QUIETO && pulsos.length < 14 && Math.random() < 0.12) pulsos.push({ a: Math.floor(Math.random() * aristas.length), t: 0, dir: Math.random() < 0.5 });
      for (var j = pulsos.length - 1; j >= 0; j--) {
        var q = pulsos[j]; q.t += dt * 0.0011;
        if (q.t >= 1) { pulsos.splice(j, 1); continue; }
        var e = aristas[q.a], s = p[q.dir ? e[0] : e[1]], f = p[q.dir ? e[1] : e[0]];
        var px = s.x + (f.x - s.x) * q.t, py = s.y + (f.y - s.y) * q.t, frente = (1 - (s.z + f.z) / 2) / 2;
        ctx.fillStyle = 'rgba(45,212,167,' + (0.25 + frente * 0.75).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(px, py, 1.6 + frente * 1.4, 0, 6.2832); ctx.fill();
      }
      for (var m = 0; m < N; m++) {
        var d = p[m], cerca = (1 - d.z) / 2;
        ctx.fillStyle = 'rgba(' + COLOR[nodos[m].capa] + ',' + (0.18 + cerca * 0.8).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(d.x, d.y, (0.9 + cerca * 2.1) * d.k, 0, 6.2832); ctx.fill();
      }
    }
    function cuadro(t) {
      if (!visible) { ultimo = 0; return; }
      var dt = ultimo ? Math.min(t - ultimo, 50) : 16; ultimo = t;
      dibujar(dt);
      requestAnimationFrame(cuadro);
    }
    medir();
    window.addEventListener('resize', function () { medir(); if (QUIETO) dibujar(0); });
    if (QUIETO) { dibujar(0); return; }
    // El ratón inclina la esfera
    canvas.parentElement.addEventListener('pointermove', function (ev) {
      var c = canvas.getBoundingClientRect();
      objX = ((ev.clientX - c.left) / c.width - 0.5) * 1.2; objY = ((ev.clientY - c.top) / c.height - 0.5) * 1.2;
    });
    // Solo se anima mientras está en pantalla
    new IntersectionObserver(function (es) {
      var antes = visible; visible = es[0].isIntersecting;
      if (visible && !antes) requestAnimationFrame(cuadro);
    }).observe(canvas);
    requestAnimationFrame(cuadro);
  }

  /* ---------- 2. Texto que se escribe y se borra ---------- */
  function rotar(el) {
    var frases = ['sistemas de IA generativa', 'modelos de Machine Learning', 'logística inteligente', 'agentes de IA'];
    if (QUIETO) return;
    var i = 0, largo = frases[0].length, borrando = true;
    function paso() {
      var f = frases[i];
      largo += borrando ? -1 : 1;
      el.textContent = f.slice(0, largo);
      var espera = borrando ? 28 : 55;
      if (!borrando && largo === f.length) { borrando = true; espera = 2200; }
      else if (borrando && largo === 0) { borrando = false; i = (i + 1) % frases.length; espera = 300; }
      setTimeout(paso, espera);
    }
    setTimeout(paso, 2400);
  }

  /* ---------- 3. Contadores ---------- */
  function contar(el) {
    var fin = parseInt(el.getAttribute('data-cuenta'), 10), t0 = null;
    if (QUIETO) return;
    el.textContent = '0';
    function paso(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  /* ---------- 4. Aparición al hacer scroll ---------- */
  function aparecer() {
    var els = document.querySelectorAll('.pf-aparece');
    if (!('IntersectionObserver' in window) || QUIETO) { els.forEach(function (e) { e.classList.add('pf-visible'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pf-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(e); });
  }

  /* ---------- 5. Tarjetas que se inclinan hacia el ratón ---------- */
  function inclinar(el) {
    if (QUIETO || !window.matchMedia('(hover: hover)').matches) return;
    el.addEventListener('pointermove', function (ev) {
      var c = el.getBoundingClientRect(), x = (ev.clientX - c.left) / c.width - 0.5, y = (ev.clientY - c.top) / c.height - 0.5;
      el.style.transitionDelay = '0ms';
      el.style.transform = 'rotateY(' + (x * 9).toFixed(2) + 'deg) rotateX(' + (-y * 9).toFixed(2) + 'deg) translateZ(6px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }

  function iniciar() {
    var c = document.getElementById('pf-red'); if (c) red(c);
    var r = document.getElementById('pf-rota'); if (r) rotar(r);
    document.querySelectorAll('[data-cuenta]').forEach(contar);
    aparecer();
    document.querySelectorAll('.pf-3d').forEach(inclinar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
