
import { generateWorkout } from './lib/workoutEngine';
import { WorkoutConfig } from './types/gym';

// Mock simulation of the user request
const config: WorkoutConfig = {
    availableTime: 45, // minutes
    selectedZones: ["Pecho", "Tríceps"], // Note: Using the names as they appear in the JSON (verified via file reading: "Pecho", "Tríceps")
    includeWarmup: true
};

console.log("--- SIMULACIÓN DE ENTRENAMIENTO: ARES GYM M1 ---");
console.log("Configtación:", JSON.stringify(config, null, 2));

try {
    const plan = generateWorkout(config);

    console.log("\n--- RESULTADO GENERADO ---");
    console.log(`Tiempo Estimado Final: ${plan.tiempo_estimado_final} min`);
    console.log(`Series Totales: ${plan.series_totales}`);
    if (plan.warnings.length > 0) {
        console.log("Advertencias:", plan.warnings);
    }

    console.log("\n--- DETALLE DE EJERCICIOS ---");
    plan.exercises.forEach((ex, idx) => {
        console.log(`${idx + 1}. [${ex.subZone}] ${ex.name}`);
        console.log(`   Series: ${ex.series} | Tiempo/Serie: ${ex.estimated_time_per_set}s | Equipo: ${ex.equipment}`);
    });

} catch (error) {
    console.error("Error durante la simulación:", error);
}
