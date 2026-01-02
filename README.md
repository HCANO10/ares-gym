# 🏛️ AresGym V3 PRO - Tu Entrenador Inteligente PWA

AresGym es una plataforma de alto rendimiento diseñada para optimizar cada segundo en el gimnasio. A diferencia de las calculadoras genéricas, AresGym utiliza biometría en tiempo real para recomendarte cargas, gestionar tus descansos y monitorizar tu progreso metabólico.

## 🚀 Características Principales

### 🏋️ Modo Entrenamiento "Focus"
Interfaz optimizada para el rack. Al iniciar tu sesión, la app entra en un estado de alta concentración:
- **Check-in de Series**: Marca cada serie completada con un toque.
- **Cronómetro de Descanso Automático**: Temporizador de 90s inteligente que se dispara al terminar cada serie.
- **Métricas en Vivo**: Visualización en tiempo real de calorías quemadas y tiempo transcurrido.

### 🧬 Inteligencia Biométrica (V2 PRO Engine)
- **Perfil de Usuario**: Sistema de registro con persistencia en localStorage (Nombre, Email, Peso, Altura y Nivel).
- **Smart Weight Recommendation**: Algoritmo que sugiere el peso ideal para cada ejercicio basándose en tu peso corporal y nivel de experiencia (Principiante/Intermedio/Avanzado).
- **Gasto Energético Real (METs)**: Cálculo de calorías basado en la fórmula metabólica específica para entrenamiento de fuerza vigoroso.

### 📅 Ecosistema de Progreso y Consistencia
- **Calendario de Rachas (Streaks)**: Visualización mensual de tus entrenamientos con iconos de fuego (🔥) para motivar la disciplina.
- **Historial Detallado**: Registro de sesiones pasadas con desglose de ejercicios y gasto calórico.
- **Exportación de Resumen**: Generación automática de reportes de entrenamiento listos para enviar por Email.

### 📚 Ares Academy
Biblioteca completa de ejercicios con:
- **Guías Visuales (GIFs)**: Técnica correcta para cada movimiento.
- **Pesos Sugeridos Instantáneos**: Consulta cuánto deberías levantar en cualquier ejercicio sin necesidad de generar una rutina.

## 🛠️ Stack Tecnológico
- **Frontend**: React.js con Vite / Next.js.
- **Estética**: Tailwind CSS (Arquitectura Glassmorphism & Dark Mode).
- **Lenguaje**: TypeScript para una lógica de datos robusta.
- **Persistencia**: LocalStorage API (Privacidad total).
- **Despliegue**: Vercel.

## ⚙️ Lógica de Cálculo (Business Rules)

| Grupo Muscular | Multiplicador (Peso Corporal) |
| :--- | :--- |
| **Empuje** (Pecho/Hombro) | 0.5x (P) / 0.8x (I) / 1.2x (A) |
| **Tracción** (Espalda) | 0.6x (P) / 0.9x (I) / 1.3x (A) |
| **Pierna** (Sentadilla) | 0.7x (P) / 1.1x (I) / 1.5x (A) |

**Fórmula de Calorías (METs):**
`Calorías = 6.0 * Peso_Usuario * (Tiempo_Entreno / 60)`

## 👤 Autor
**Hugo Cano** - Desarrollador y Visionario de AresGym
[GitHub Profile](#)

Desarrollado con ❤️ para guerreros que buscan la excelencia física y tecnológica.
