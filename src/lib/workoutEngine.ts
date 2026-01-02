import { Exercise, WorkoutConfig, UserProfile } from '../types/gym';
import exercisesData from '../data/exercises.json';

// Ensure the data is treated as typed
const exercises: Exercise[] = exercisesData as unknown as Exercise[];

export interface GeneratedExercise extends Exercise {
    series: number;
    reps: string;
    recommendedWeight?: number; // kg
}

export interface WorkoutPlan {
    exercises: GeneratedExercise[];
    series_totales: number;
    tiempo_estimado_final: number; // in minutes
    caloriasTotales: number;
    warnings: string[];
}

const WARMUP_DURATION_SECONDS = 5 * 60; // 5 minutes allocated for Warmup logic
const SET_DURATION_SECONDS = 120; // Standard block for calculation

// Weight Calculation Helpers
function calculateWeight(exercise: Exercise, profile: UserProfile): number {
    if (exercise.subZone === 'Warmup') return 0;
    if (exercise.equipment === 'bodyweight') return 0;

    let multiplier = 0;
    const { experience, weight } = profile;

    // Logic: Multipliers based on requested V2 PRO specs
    // Using implied logic: The prompt gave 0.5, 0.8, 1.2 as general examples.
    // We will apply this to Compound Upper.
    // Legs usually handle more, Isolation less.

    // Pecho/Espalda/Hombro (Upper Compound)
    if (['Pecho', 'Espalda', 'Hombro'].includes(exercise.subZone)) {
        if (experience === 'principiante') multiplier = 0.5;
        else if (experience === 'intermedio') multiplier = 0.8;
        else multiplier = 1.2; // Updated to 1.2 as requested
    }
    // Piernas (Lower Compound) - Scaling up slightly from the base request for realism
    else if (['Cuádriceps', 'Femoral', 'Glúteos'].includes(exercise.subZone)) {
        if (experience === 'principiante') multiplier = 0.6; // slightly more than upper
        else if (experience === 'intermedio') multiplier = 1.0;
        else multiplier = 1.4;
    }
    // Brazos/Aislamiento
    else {
        if (experience === 'principiante') multiplier = 0.2;
        else if (experience === 'intermedio') multiplier = 0.3;
        else multiplier = 0.4;
    }

    const rawWeight = weight * multiplier;
    return Math.round(rawWeight / 2.5) * 2.5;
}

export function generateWorkout(config: WorkoutConfig): WorkoutPlan {
    const warnings: string[] = [];
    const planExercises: GeneratedExercise[] = [];

    // 1. Initial validations
    if (config.availableTime < 10 && config.selectedZones.length > 2) {
        warnings.push("Tiempo insuficiente.");
    }

    if (config.selectedZones.length === 0) {
        return {
            exercises: [],
            series_totales: 0,
            tiempo_estimado_final: 0,
            caloriasTotales: 0,
            warnings: ["No se han seleccionado zonas."]
        };
    }

    let remainingTimeSeconds = config.availableTime * 60;

    // 2. Warmup Logic
    if (config.includeWarmup) {
        const warmupExercises = exercises.filter(e => e.subZone === 'Warmup');
        if (warmupExercises.length > 0) {
            const randomWarmup = warmupExercises[Math.floor(Math.random() * warmupExercises.length)];
            planExercises.push({
                ...randomWarmup,
                series: 1,
                reps: randomWarmup.reps_range || "15-20",
                recommendedWeight: 0
            });
            remainingTimeSeconds -= WARMUP_DURATION_SECONDS;
        } else {
            warnings.push("No warmups found.");
        }
    }

    if (remainingTimeSeconds <= 0) {
        remainingTimeSeconds = 60;
    }

    // 3. Zone Distribution
    const numberOfZones = config.selectedZones.length;
    const timePerZoneSeconds = remainingTimeSeconds / numberOfZones;

    // 4. Exercise Selection per Zone
    for (const zone of config.selectedZones) {
        const zoneExercises = exercises.filter(e => e.subZone === zone);

        if (zoneExercises.length === 0) {
            warnings.push(`No exercises for: ${zone}`);
            continue;
        }

        let calculatedSeries = Math.floor(timePerZoneSeconds / SET_DURATION_SECONDS);
        if (calculatedSeries < 1) calculatedSeries = 1;

        let numExercisesToPick = 1;
        if (calculatedSeries >= 9) numExercisesToPick = 3;
        else if (calculatedSeries >= 5) numExercisesToPick = 2;

        if (zoneExercises.length < numExercisesToPick) {
            numExercisesToPick = zoneExercises.length;
        }

        const shuffled = [...zoneExercises].sort(() => 0.5 - Math.random());
        const selectedExercises = shuffled.slice(0, numExercisesToPick);

        const baseSeriesPerExercise = Math.floor(calculatedSeries / numExercisesToPick);
        let remainderSeries = calculatedSeries % numExercisesToPick;

        for (const exercise of selectedExercises) {
            let seriesForThis = baseSeriesPerExercise;
            if (remainderSeries > 0) {
                seriesForThis++;
                remainderSeries--;
            }

            if (seriesForThis > 0) {
                // Calculate Weight if user profile exists
                let weightVal = 0;
                if (config.userProfile) {
                    weightVal = calculateWeight(exercise, config.userProfile);
                }

                planExercises.push({
                    ...exercise,
                    series: seriesForThis,
                    reps: exercise.reps_range || "8-12",
                    recommendedWeight: weightVal
                });
            }
        }
    }

    // 5. Final Calculations
    const totalSeries = planExercises.reduce((acc, curr) => acc + curr.series, 0);

    const totalTimeSeconds = planExercises.reduce((acc, curr) => {
        return acc + (curr.series * curr.estimated_time_per_set);
    }, 0);

    const tiempoEstimadoFinal = Math.round(totalTimeSeconds / 60);

    // Calorie Calculation: METs * Weight * Time(hours)
    // METs ~ 6.0 for vigorous weight lifting
    const userWeight = config.userProfile?.weight || 75; // fallback 75kg
    const durationHours = tiempoEstimadoFinal / 60;
    const caloriasTotales = Math.round(6.0 * userWeight * durationHours);

    return {
        exercises: planExercises,
        series_totales: totalSeries,
        tiempo_estimado_final: tiempoEstimadoFinal,
        caloriasTotales,
        warnings
    };
}
