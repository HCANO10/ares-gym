
import { generateWorkout } from './lib/workoutEngine';
import { WorkoutConfig } from './types/gym';

// Updated test for V2 Logic
const config: WorkoutConfig = {
    availableTime: 60, // 60 minutes
    selectedZones: ["Pecho", "Espalda"],
    includeWarmup: true
};

console.log("--- SIMULACIÓN DE LOGICA V2: CALORÍAS Y REPS ---");
console.log("Configtación:", JSON.stringify(config, null, 2));

try {
    const plan = generateWorkout(config);

    console.log("\n--- RESULTADO GENERADO ---");
    console.log(`Tiempo Estimado Final: ${plan.tiempo_estimado_final} min`);
    console.log(`Calorías Totales: ${plan.caloriasTotales} kcal (Esperado: ~360)`);
    console.log(`Series Totales: ${plan.series_totales}`);

    console.log("\n--- DETALLE DE EJERCICIOS (VERIFICAR REPS) ---");
    plan.exercises.forEach((ex, idx) => {
        console.log(`${idx + 1}. [${ex.subZone}] ${ex.name}`);
        console.log(`   Series: ${ex.series} | Reps: ${ex.reps} | Img: ${ex.image_url ? 'Yes' : 'No'}`);
    });

} catch (error) {
    console.error("Error durante la simulación:", error);
}
