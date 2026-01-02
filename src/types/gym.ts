export interface Exercise {
    id: string;
    name: string;
    subZone: string;
    equipment: string;
    estimated_time_per_set: number; // in seconds
    priority: 1 | 2; // 1: Compound, 2: Isolation
    image_url: string;
    reps_range: string;
}

export type ExperienceLevel = 'principiante' | 'intermedio' | 'avanzado';

export interface UserProfile {
    name: string;
    surname: string;
    email: string;
    weight: number; // kg
    height: number; // cm
    experience: ExperienceLevel;
}

export interface WorkoutSession {
    id: string;
    date: string; // ISO string 2024-01-01
    totalTime: number; // seconds
    calories: number;
    completedExercises: string[]; // List of accumulated exercise names or IDs
}

export interface NutritionTargets {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
}

export interface WorkoutConfig {
    availableTime: number; // in minutes
    selectedZones: string[];
    includeWarmup: boolean;
    userProfile?: UserProfile; // Optional for backward compatibility/initial load
}
