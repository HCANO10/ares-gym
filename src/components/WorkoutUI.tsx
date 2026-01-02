'use client';

import React, { useState } from 'react';
import { generateWorkout, WorkoutPlan } from '../lib/workoutEngine';
import { WorkoutConfig } from '../types/gym';

const ZONES = {
    Superior: ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Antebrazos'],
    Inferior: ['Cuádriceps', 'Femoral', 'Glúteos', 'Gemelo'],
    Core: ['Abs', 'Lumbar']
};

export default function WorkoutUI() {
    const [availableTime, setAvailableTime] = useState<number>(45);
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [includeWarmup, setIncludeWarmup] = useState<boolean>(true);
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);

    const handleZoneToggle = (zone: string) => {
        setSelectedZones(prev =>
            prev.includes(zone)
                ? prev.filter(z => z !== zone)
                : [...prev, zone]
        );
    };

    // Load state from local storage on mount
    React.useEffect(() => {
        const savedData = localStorage.getItem('aresgym_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.availableTime) setAvailableTime(parsed.availableTime);
                if (parsed.selectedZones) setSelectedZones(parsed.selectedZones);
                if (parsed.includeWarmup !== undefined) setIncludeWarmup(parsed.includeWarmup);
                if (parsed.plan) setPlan(parsed.plan);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
    }, []);

    const handleGenerate = () => {
        try {
            const config: WorkoutConfig = {
                availableTime,
                selectedZones,
                includeWarmup
            };
            const result = generateWorkout(config);
            setPlan(result);

            // Save to local storage
            localStorage.setItem('aresgym_data', JSON.stringify({
                availableTime,
                selectedZones,
                includeWarmup,
                plan: result
            }));

        } catch (error) {
            console.error(error);
            alert("¡Ups! Algo salió mal calculando tu rutina");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-6 bg-white min-h-screen sm:min-h-0 sm:rounded-xl sm:shadow-lg sm:my-8 text-gray-800">
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">AresGym Planner</h1>

            {/* Configuration Section */}
            <div className="space-y-4">
                {/* Time Input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Tiempo de Entrenamiento (min)</label>
                    <input
                        type="number"
                        value={availableTime}
                        onChange={(e) => setAvailableTime(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        min="10"
                    />
                </div>

                {/* Warmup Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Incluir Calentamiento</span>
                    <button
                        onClick={() => setIncludeWarmup(!includeWarmup)}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${includeWarmup ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${includeWarmup ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                {/* Zone Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium">Zonas Musculares</label>

                    {Object.entries(ZONES).map(([category, zones]) => (
                        <div key={category} className="border border-gray-200 rounded-lg p-3">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">{category}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {zones.map(zone => (
                                    <label key={zone} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedZones.includes(zone)}
                                            onChange={() => handleZoneToggle(zone)}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{zone}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={selectedZones.length === 0}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${selectedZones.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                        }`}
                >
                    {selectedZones.length === 0 ? 'Selecciona al menos una zona' : 'GENERAR RUTINA'}
                </button>
            </div>

            {/* Results Section */}
            {plan && (
                <div className="mt-8 border-t pt-6 animation-fade-in">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold">Tu Rutina</h2>
                        <div className="text-right text-sm text-gray-600">
                            <p>Tiempo: <span className="font-bold text-blue-600">{plan.tiempo_estimado_final} min</span></p>
                            <p>Series: <span className="font-bold text-blue-600">{plan.series_totales}</span></p>
                        </div>
                    </div>

                    {plan.warnings.length > 0 && (
                        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 text-sm rounded-lg">
                            {plan.warnings.map((w, i) => <p key={i}>⚠️ {w}</p>)}
                        </div>
                    )}

                    <div className="space-y-3">
                        {plan.exercises.map((ex, idx) => (
                            <div key={`${ex.id}-${idx}`} className="bg-white border-l-4 border-blue-500 shadow-sm p-4 rounded-r-lg flex justify-between items-center group hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase">
                                            {ex.subZone}
                                        </span>
                                        {ex.priority === 1 && (
                                            <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                                                Compuesto
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg">{ex.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize">{ex.equipment?.replace('_', ' ')}</p>
                                </div>
                                <div className="text-center bg-gray-50 p-2 rounded-lg min-w-[3.5rem]">
                                    <span className="block text-2xl font-bold text-blue-600 leading-none">{ex.series}</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Series</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {plan.exercises.length === 0 && plan.warnings.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No se generaron ejercicios.</p>
                    )}
                </div>
            )}
        </div>
    );
}
