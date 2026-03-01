# 📊 Insight Lab: La Historia del Crédito Contada por sus Tasas de Interés

> **Insight Lab** es un ecosistema interactivo e inteligente diseñado para el análisis visual avanzado de un portafolio de créditos, procesando poco más de **1 millón de registros transaccionales**.

---

## 💡 Descripción del Proyecto
El dashboard permite tomar decisiones estratégicas basadas en el comportamiento histórico y actual del crédito en el mercado financiero. Mediante una interfaz moderna, transformamos datos complejos en una narrativa visual accionable.

*(Nota: Las imágenes de previsualización corresponden al diseño final del dashboard)*



---

## 👥 Equipo del Proyecto
Este proyecto fue desarrollado colaborativamente por:
* **Adolfo Ramírez Moreno** - Desarrollador de Visualizaciones
* **Gisell Gutierrez Fernandez** - Analista de Datos
* **Miguel Londoño** - Diseñador Web & Data Engineer

---

## 🚀 Ecosistema Tecnológico
Construido con tecnologías modernas y escalables orientadas al alto rendimiento:

* **Frontend:** `Next.js`, `React`, `Tailwind CSS v3` (Estética Glassmorphism / Dark Mode).
* **Gráficos:** `Recharts` (Gráficos interactivos SVG).
* **Backend / DB:** `Supabase` (PostgreSQL avanzado con API REST).
* **Pipeline de Datos:** `Python` (`pandas`, `httpx` para ETL y limpieza de datos).
* **Calidad:** Implementación de tableros de auditoría (`audit_logs`) para asegurar la trazabilidad.



---

## 📂 Arquitectura del Dashboard
La plataforma cuenta con una barra de navegación lateral para transicionar entre cuatro perspectivas:

### 1. Generalidades
Vista introductoria con la cobertura del proyecto:
* **Volumen de Datos:** +1.01 Millones de registros analizados.
* **Cobertura Temporal:** Enero 2023 - Marzo 2024.
* **Glosario Visual:** Explicación técnica de iconografía (Montos, Tasas, Operaciones y Ticket Promedio).

### 2. Dashboard Principal (Centro de Mando)
* **KPIs:** Tasas Efectivas Mín/Máx, Volumen de Desembolso y Ticket Promedio.
* **Rankings:** Concentración del volumen por Entidad Financiera.
* **Garantías:** Relación entre volumen y modalidad (SG, FNG, IDÓNEA).
* **Distribución SMLV:** Histograma estratificado según el Salario Mínimo Legal Vigente.



### 3. Distribución de Créditos
Enfoque demográfico corporativo:
* **Segmentación:** Tamaño de la Empresa (Micro, Pequeña, Mediana, Gran Empresa).
* **Tipo de Persona:** Mapa de distribución entre Persona Natural vs. Jurídica.



### 4. Documentación (Data Quality)
* **Modelado Relacional:** Esquema transaccional `credit_data` y auditoría `audit_logs`.
* **Gestión de Riesgos:** Estrategias de mitigación para anomalías, formatos de fecha y limpieza ETL (estandarizado a `snake_case`).

---

## 🛠 Instalación y Configuración Local

1. **Clonar el Repositorio**
   ```bash
   git clone [https://github.com/MiguelData2030/DATA_STORYTELLING.git](https://github.com/MiguelData2030/DATA_STORYTELLING.git)
   cd DATA_STORYTELLING
