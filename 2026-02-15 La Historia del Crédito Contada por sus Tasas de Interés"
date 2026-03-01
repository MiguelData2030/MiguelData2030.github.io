# 📊 Insight Lab: La Historia del Crédito Contada por sus Tasas de Interés

**Insight Lab** es un ecosistema analítico de alto rendimiento diseñado para la visualización inteligente de datos financieros. Este proyecto procesa más de **1 millón de registros transaccionales**, transformando datos crudos en una narrativa visual que permite entender el comportamiento del crédito, las tasas de interés y los volúmenes de desembolso en el mercado colombiano.

![Vista General del Dashboard](https://raw.githubusercontent.com/MiguelData2030/DATA_STORYTELLING/main/assets/image_6b922e.jpg)

---

## 🚀 Ecosistema Tecnológico y Construcción

La arquitectura se diseñó bajo un enfoque de **Enterprise Data Analytics**, separando la capa de procesamiento (ETL), almacenamiento y visualización para garantizar escalabilidad:

### 1. Ingesta y ETL (Python)
El pipeline de datos fue construido en **Python**, utilizando bibliotecas como `pandas` y `httpx`.
* **Limpieza Profunda:** Se implementó una lógica de "Saneamiento de Datos" para corregir anomalías numéricas y discrepancias tipográficas (ej. estandarización de categorías como "Gran Empresa").
* **Normalización:** Conversión obligatoria de cabeceras a `snake_case` y formateo estricto de fechas a `YYYY-MM-DD`.
* **Carga Automatizada:** Los datos procesados se inyectan en la base de datos mediante una API REST, garantizando la integridad referencial.

### 2. Infraestructura y Backend (Supabase)
Se utilizó **Supabase** como motor de base de datos relacional (PostgreSQL):
* **Modelo Relacional:** Estructura optimizada para consultas rápidas sobre la tabla principal `credit_data`.
* **Trazabilidad:** Implementación de tablas de auditoría (`audit_logs`) que registran cada inserción y cambio en el sistema.

### 3. Frontend y Visualización (Next.js & Tailwind)
La interfaz se desarrolló con un enfoque en la experiencia de usuario (UX) avanzada:
* **Framework:** `Next.js` y `React` para una navegación fluida y renderizado eficiente.
* **Estética:** Diseño **Glassmorphism** en modo oscuro (Dark Mode) utilizando `Tailwind CSS v3`.
* **Interactividad:** Los gráficos fueron creados con `Recharts`, permitiendo visualizaciones dinámicas en formato SVG que responden a los filtros del usuario.

---

## 📂 Arquitectura Funcional del Dashboard

El ecosistema se divide en perspectivas estratégicas que cubren todo el ciclo de vida del análisis de crédito:

### 🔵 Centro de Mando Cuantitativo (Dashboard Principal)
En esta sección se visualizan los indicadores clave de rendimiento (KPIs) en tiempo real:
* **Métricas de Impacto:** Tasa Efectiva promedio (47.79%), Volumen Total Desembolsado ($10.5B), Créditos Activos y Ticket Promedio por operación.
* **Análisis Competitivo:** Ranking de entidades financieras por volumen de mercado.
* **Segmentación de Riesgo:** Relación entre el volumen desembolsado y el tipo de garantía (FNG, Idónea, etc.).

![Análisis de Productos y SMLV](https://raw.githubusercontent.com/MiguelData2030/DATA_STORYTELLING/main/assets/image_6b91eb.jpg)

### 🔵 Participación y Estrategia de Producto
* **Comportamiento del Mercado:** Desglose de montos desembolsados y tasas ponderadas por tipo de producto (Empresarial, Crédito Popular Productivo, etc.).
* **Distribución SMLV:** Histograma que clasifica el crédito según el rango de monto basado en el Salario Mínimo Legal Vigente, permitiendo identificar si el mercado está compuesto por micro o macrocréditos.

### 🔵 Calidad de Datos (Data Quality)
Para asegurar que las decisiones se tomen sobre datos confiables, se incluyó un módulo de documentación técnica:
* **Riesgos Identificados:** Manejo de valores nulos y formatos de fecha inconsistentes de fuentes externas (Excel).
* **Estrategias de Mitigación:** Coerción de tipos obligatoria y manejo robusto de errores en los scripts de migración.

![Documentación y Calidad de Datos](https://raw.githubusercontent.com/MiguelData2030/DATA_STORYTELLING/main/assets/image_6b8f21.jpg)

---

## 🛠️ Instalación y Configuración Local

1. **Clonar el Repositorio**
   ```bash
   git clone [https://github.com/MiguelData2030/DATA_STORYTELLING.git](https://github.com/MiguelData2030/DATA_STORYTELLING.git)
   cd DATA_STORYTELLING
