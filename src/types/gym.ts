export interface Exercise {
    id: string;
    name: string;
    subZone: string;
    equipment: string;
    estimated_time_per_set: number; // in seconds
    priority: 1 | 2; // 1: Compound, 2: Isolation
}

export interface WorkoutConfig {
    availableTime: number; // in minutes
    selectedZones: string[];
    includeWarmup: boolean;
}
