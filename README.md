# AresGym APP

## Descripción
Aplicación web diseñada para optimizar el tiempo de entrenamiento en el gimnasio. Genera rutinas automáticas basadas en el tiempo disponible y las zonas musculares seleccionadas, priorizando la variedad y la eficiencia.

## Stack Técnico
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Lógica**: Algoritmo personalizado de distribución de carga (`src/lib/workoutEngine.ts`)

## Taxonomía de Zonas (11 Subzonas)
El sistema organiza los ejercicios en 3 grandes grupos para facilitar la selección:

### Superior
- **Pecho**: Press de banca, aperturas...
- **Espalda**: Dominadas, remos...
- **Hombro**: Press militar, elevaciones...
- **Bíceps**: Curls diversos...
- **Tríceps**: Fondos, poleas...
- **Antebrazos**: Paseo de granjero, curls de muñeca...

### Inferior
- **Cuádriceps**: Sentadillas, prensa...
- **Femoral**: Peso muerto rumano, curls...
- **Glúteos**: Hip thrust, patadas...
- **Gemelo**: Elevaciones...

### Core
- **Abs**: Crunches, planchas...
- **Lumbar**: Hiperextensiones...

## Lógica de Generación de Rutinas
El motor de entrenamiento (`src/lib/workoutEngine.ts`) sigue estas reglas:
1.  **Cálculo de Series**: `Tiempo Total por Zona / 120 segundos`.
2.  **Distribución de Volumen**:
    *   **≤ 4 series**: Se selecciona 1 ejercicio.
    *   **5 - 8 series**: Se distribuyen entre 2 ejercicios.
    *   **≥ 9 series**: Se distribuyen entre 3 ejercicios.
3.  **Calentamiento**: Si se activa, se reservan 5 minutos iniciales para un ejercicio de movilidad/activación.

## Comandos
```bash
npm run dev   # Iniciar servidor de desarrollo
npm run build # Construir para producción
npm start     # Iniciar servidor de producción
```
