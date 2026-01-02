'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { generateWorkout, WorkoutPlan, GeneratedExercise } from '../lib/workoutEngine';
import { WorkoutConfig, UserProfile, ExperienceLevel, WorkoutSession } from '../types/gym';
import exercisesData from '../data/exercises.json';

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */
const Icons = {
    // Navigation
    Dumbbell: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m0-16.875l-2.25 1.313M3 14.25v2.25l2.25 1.313" />
        </svg>
    ),
    Calendar: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008H14.25V15zm0 2.25h.008v.008H14.25v-.008zM16.5 15h.008v.008H16.5V15zm0 2.25h.008v.008H16.5v-.008z" />
        </svg>
    ),
    Book: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    ),
    User: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    ),
    // Utility
    Flame: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
    ),
    Search: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    ),
    Clock: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Check: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    )
};

/* -------------------------------------------------------------------------- */
/*                            SUB-COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

// --- ACADEMY TAB ---
const TabAcademy = ({ userProfile }: { userProfile: UserProfile | null }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // In strict mode exercisesData might mean reading from json directly if available or passed down. 
    // Assuming exercisesData is available from import.
    const filtered = exercisesData.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.subZone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calc simple weight suggestions locally for display
    const getWeight = (ex: any) => {
        if (!userProfile) return 0;
        // Simple mock of the engine logic strictly for display
        let m = 0.3; // base default
        if (['Pecho', 'Espalda', 'Hombro'].includes(ex.subZone)) m = 0.8;
        if (['Cuádriceps', 'Femoral', 'Glúteos'].includes(ex.subZone)) m = 1.0;

        switch (userProfile.experience) {
            case 'principiante': m *= 0.7; break;
            case 'avanzado': m *= 1.3; break;
        }
        return Math.round((userProfile.weight * m) / 2.5) * 2.5;
    };

    return (
        <div className="pt-6 pb-24 px-4 space-y-6">
            <h2 className="text-3xl font-black text-white">Academia</h2>
            <div className="relative">
                <Icons.Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Buscar ejercicio..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(ex => (
                    <div key={ex.id} className="bg-zinc-900 rounded-2xl p-4 flex space-x-4 border border-zinc-800/50">
                        <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                            <img src={ex.image_url} alt={ex.name} className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded-full">{ex.subZone}</span>
                            <h3 className="font-bold text-white leading-tight mt-1">{ex.name}</h3>
                            <div className="mt-2 text-xs text-zinc-500 flex items-center space-x-2">
                                <span>Est: {getWeight(ex)}kg</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- PROGRESS TAB ---
const TabProgress = () => {
    const [history, setHistory] = useState<WorkoutSession[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('ares_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // Calculate streak
    const streak = useMemo(() => {
        // Mock simple logic: Consecutive days
        // In real app execute comprehensive date diff
        return history.length;
    }, [history]);

    // Calendar Grid Mockup (Current Month)
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const isDayActive = (day: number) => {
        // Need real year/month check, simply checking existence of date string for demo
        // Assuming current month is representative
        const now = new Date();
        const check = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return history.some(h => h.date === check);
    };

    return (
        <div className="pt-6 pb-24 px-4 space-y-8">
            <h2 className="text-3xl font-black text-white">Tu Progreso</h2>

            {/* Streak Card */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-xl shadow-orange-900/20 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold uppercase opacity-80">Racha Actual</span>
                    <div className="text-4xl font-black">{streak} <span className="text-lg font-medium">días</span></div>
                </div>
                <Icons.Flame className="w-12 h-12 text-white/50" />
            </div>

            {/* Calendar */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h3 className="font-bold text-zinc-400 mb-4 uppercase text-xs tracking-wider">Este Mes</h3>
                <div className="grid grid-cols-7 gap-2">
                    {daysInMonth.map(d => {
                        const active = isDayActive(d);
                        return (
                            <div key={d} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold relative ${active ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-zinc-950 text-zinc-600'}`}>
                                {d}
                                {active && <Icons.Flame className="w-3 h-3 absolute -top-1 -right-1 text-orange-500 fill-orange-500" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* History List */}
            <div>
                <h3 className="font-bold text-white mb-4">Historial Reciente</h3>
                <div className="space-y-3">
                    {history.slice().reverse().map((sess, i) => (
                        <div key={i} className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center border border-zinc-800">
                            <div>
                                <div className="font-bold text-white">{sess.date}</div>
                                <div className="text-xs text-zinc-500">{sess.calories} kcal • {Math.floor(sess.totalTime / 60)} min</div>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-zinc-500 text-sm">Aún no hay entrenamientos.</p>}
                </div>
            </div>
        </div>
    );
};

// --- PROFILE TAB ---
const TabProfile = ({ userProfile, setUserProfile }: { userProfile: UserProfile | null, setUserProfile: (p: UserProfile) => void }) => {
    // Nutrition Helpers
    const getMaintenance = () => userProfile ? Math.round(userProfile.weight * 33) : 2000;
    const getMacros = () => {
        if (!userProfile) return { p: 0, f: 0, c: 0 };
        const p = Math.round(userProfile.weight * 2);
        const f = Math.round(userProfile.weight * 0.8);
        const calP = p * 4;
        const calF = f * 9;
        const remainder = getMaintenance() - calP - calF;
        const c = Math.round(remainder / 4);
        return { p, f, c };
    };
    const macros = getMacros();

    return (
        <div className="pt-6 pb-24 px-4 space-y-8">
            <h2 className="text-3xl font-black text-white">Perfil</h2>

            {/* Bio Card */}
            {userProfile && (
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                        {userProfile.name.charAt(0)}{userProfile.surname.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-white">{userProfile.name} {userProfile.surname}</h3>
                        <p className="text-sm text-zinc-400 capitalize">{userProfile.experience} • {userProfile.weight}kg</p>
                    </div>
                </div>
            )}

            {/* Nutrition Card */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-violet-500/20">
                <h3 className="font-bold text-violet-400 uppercase text-xs tracking-wider mb-4">Objetivos Nutricionales</h3>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-4xl font-black text-white">{getMaintenance()}</span>
                        <span className="text-sm text-zinc-500 ml-1">kcal/día</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-950 p-3 rounded-xl text-center">
                        <span className="block text-emerald-400 font-bold text-xl">{macros.p}g</span>
                        <span className="text-[10px] uppercase text-zinc-600 font-bold">Proteína</span>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded-xl text-center">
                        <span className="block text-yellow-400 font-bold text-xl">{macros.f}g</span>
                        <span className="text-[10px] uppercase text-zinc-600 font-bold">Grasas</span>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded-xl text-center">
                        <span className="block text-blue-400 font-bold text-xl">{macros.c}g</span>
                        <span className="text-[10px] uppercase text-zinc-600 font-bold">Carbos</span>
                    </div>
                </div>
                <p className="mt-4 text-[10px] text-zinc-600 leading-relaxed text-center">
                    Cálculo basado en 2g proteína/kg, 0.8g grasa/kg y el resto en carbohidratos para mantenimiento estimado.
                </p>
            </div>

            {/* Disclaimer or dummy settings */}
            <div className="text-center text-xs text-zinc-600 pt-8">
                Ares Gym V3.0 Pro Version
            </div>
        </div>
    );
};


/* -------------------------------------------------------------------------- */
/*                            ROOT COMPONENT                                  */
/* -------------------------------------------------------------------------- */
export default function WorkoutUI() {
    // --- Global State ---
    const [activeTab, setActiveTab] = useState<'train' | 'progress' | 'academy' | 'profile'>('train');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // --- Training Internal State ---
    const [availableTime, setAvailableTime] = useState<number>(45);
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [includeWarmup, setIncludeWarmup] = useState<boolean>(true);
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [activeMode, setActiveMode] = useState<boolean>(false);
    const [sessionTime, setSessionTime] = useState<number>(0);
    const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});
    const [restTimer, setRestTimer] = useState<number | null>(null);
    const [showSummary, setShowSummary] = useState<boolean>(false);

    // Refs
    const sessionInterval = useRef<NodeJS.Timeout | null>(null);
    const restInterval = useRef<NodeJS.Timeout | null>(null);

    // --- Load Data ---
    useEffect(() => {
        const savedProfile = localStorage.getItem('ares_user_account');
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));

        // Load plan
        const savedData = localStorage.getItem('aresgym_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.availableTime) setAvailableTime(parsed.availableTime);
                if (parsed.selectedZones) setSelectedZones(parsed.selectedZones);
                if (parsed.plan) setPlan(parsed.plan);
            } catch (e) { }
        }
    }, []);

    // --- Actions ---
    const handleGenerate = () => {
        if (!userProfile) { alert("Completa tu perfil primero"); setActiveTab('profile'); return; }
        const config: WorkoutConfig = { availableTime, selectedZones, includeWarmup, userProfile };
        const result = generateWorkout(config);
        setPlan(result);
        localStorage.setItem('aresgym_data', JSON.stringify({ ...config, plan: result }));
        setCompletedSets({});
        setActiveMode(false);
        setTimeout(() => document.getElementById('workout-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        const newProfile: UserProfile = {
            name: data.get('name') as string || 'Atleta',
            surname: data.get('surname') as string || '',
            email: data.get('email') as string || '',
            height: Number(data.get('height')),
            weight: Number(data.get('weight')),
            experience: data.get('experience') as ExperienceLevel
        };
        setUserProfile(newProfile);
        localStorage.setItem('ares_user_account', JSON.stringify(newProfile));
    };

    const handleFinish = () => {
        // Save to History
        if (plan) {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

            const session: WorkoutSession = {
                id: Date.now().toString(),
                date: dateStr,
                totalTime: sessionTime,
                calories: plan.caloriasTotales, // should ideally adjust by ratio of completion but simplified
                completedExercises: []
            };

            const existingHistory = JSON.parse(localStorage.getItem('ares_history') || '[]');
            existingHistory.push(session);
            localStorage.setItem('ares_history', JSON.stringify(existingHistory));
        }

        setActiveMode(false);
        setShowSummary(true);
    };

    // --- Timers ---
    useEffect(() => {
        if (activeMode) sessionInterval.current = setInterval(() => setSessionTime(t => t + 1), 1000);
        else if (sessionInterval.current) clearInterval(sessionInterval.current);
        return () => { if (sessionInterval.current) clearInterval(sessionInterval.current); };
    }, [activeMode]);

    useEffect(() => {
        if (restTimer !== null && restTimer > 0) restInterval.current = setTimeout(() => setRestTimer(t => t! - 1), 1000);
        else if (restTimer === 0) { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => { }); setRestTimer(null); }
        return () => { if (restInterval.current) clearTimeout(restInterval.current); };
    }, [restTimer]);


    /* ------------------------------ RENDER: TRAINING TAB ------------------------------ */
    const renderTraining = () => {
        if (showSummary) return (
            <div className="p-8 h-full flex flex-col items-center justify-center space-y-6 pt-20">
                <h2 className="text-3xl font-black text-white">¡Entrenamiento Terminado!</h2>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-zinc-900 p-4 rounded-xl text-center border border-zinc-800">
                        <span className="block text-zinc-500 text-xs">TIEMPO</span>
                        <span className="text-2xl font-bold text-white">{Math.floor(sessionTime / 60)}m</span>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl text-center border border-zinc-800">
                        <span className="block text-zinc-500 text-xs">CALORÍAS</span>
                        <span className="text-2xl font-bold text-orange-500">{plan?.caloriasTotales}</span>
                    </div>
                </div>
                <button className="w-full py-4 bg-orange-600 rounded-xl font-bold text-white shadow-lg" onClick={() => {
                    const date = new Date().toLocaleDateString();
                    const subject = `Resumen Entrenamiento AresGym - ${date}`;
                    const body = `Resumen Entreno:\nTiempo: ${Math.floor(sessionTime / 60)}min\nCalorias: ${plan?.caloriasTotales}`;
                    window.location.href = `mailto:${userProfile?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}>Enviar Resumen Email</button>
                <button className="text-zinc-500 underline" onClick={() => setShowSummary(false)}>Volver</button>
            </div>
        );

        if (activeMode) return (
            <div className="pt-4 pb-24 px-4 h-full bg-black min-h-screen">
                {/* Active Mode Header */}
                <div className="flex justify-between items-end mb-6 sticky top-0 bg-black/80 backdrop-blur z-20 py-2 border-b border-zinc-800">
                    <div>
                        <span className="text-red-500 text-xs font-bold uppercase animate-pulse">● En Vivo</span>
                        <div className="text-4xl font-mono font-black text-white">{Math.floor(sessionTime / 60).toString().padStart(2, '0')}:{(sessionTime % 60).toString().padStart(2, '0')}</div>
                    </div>
                    <button onClick={handleFinish} className="bg-red-600/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all">Terminar</button>
                </div>

                {/* Rest Timer Overlay */}
                {restTimer && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-orange-600 text-white p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(234,88,12,0.5)] flex flex-col items-center">
                        <span className="text-xs font-bold uppercase tracking-widest mb-1">Descanso</span>
                        <span className="text-6xl font-black font-mono mb-4">{restTimer}</span>
                        <button onClick={() => setRestTimer(null)} className="bg-black/20 px-4 py-2 rounded-full text-sm font-bold">Saltar</button>
                    </div>
                )}

                {/* List */}
                <div className="space-y-4">
                    {plan?.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <h3 className="font-bold text-white text-lg">{ex.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {Array.from({ length: ex.series }).map((_, sIdx) => {
                                    const done = completedSets[ex.id]?.includes(sIdx);
                                    return (
                                        <button key={sIdx} onClick={() => {
                                            setCompletedSets(prev => {
                                                const current = prev[ex.id] || [];
                                                if (current.includes(sIdx)) return { ...prev, [ex.id]: current.filter(i => i !== sIdx) };
                                                setRestTimer(90);
                                                return { ...prev, [ex.id]: [...current, sIdx] };
                                            })
                                        }} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${done ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                            {done ? <Icons.Check className="w-5 h-5" /> : sIdx + 1}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <div className="pt-6 pb-24 px-4 space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white italic">ARES GYM <span className="text-orange-600">V3</span></h1>
                        <p className="text-zinc-500 text-xs">Entrena inteligente.</p>
                    </div>
                    {userProfile ?
                        <div onClick={() => setActiveTab('profile')} className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">{userProfile.name[0]}</div>
                        : <button onClick={() => setActiveTab('profile')} className="text-xs text-blue-400 font-bold">Crear Perfil</button>
                    }
                </header>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
                    {/* Zones */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Zonas</label>
                        <div className="flex flex-wrap gap-2">
                            {['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Cuádriceps', 'Femoral', 'Abs'].map(z => (
                                <button key={z} onClick={() => setSelectedZones(p => p.includes(z) ? p.filter(x => x !== z) : [...p, z])}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedZones.includes(z) ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                                    {z}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Time */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Tiempo: {availableTime} min</label>
                        <input type="range" min="15" max="90" step="15" value={availableTime} onChange={e => setAvailableTime(Number(e.target.value))} className="w-full accent-blue-600 bg-zinc-800 appearance-none h-2 rounded-full" />
                    </div>
                    <button onClick={handleGenerate} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20">GENERAR RUTINA</button>
                </div>

                {plan && (
                    <div id="workout-results" className="space-y-6 animate-in slide-in-from-bottom-5">
                        <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <div>
                                <span className="block text-zinc-500 text-[10px] uppercase font-bold">Total</span>
                                <span className="text-xl font-black text-white">{plan.tiempo_estimado_final} min</span>
                            </div>
                            <div>
                                <span className="block text-zinc-500 text-[10px] uppercase font-bold text-right">Calorías</span>
                                <span className="text-xl font-black text-orange-500">{plan.caloriasTotales}</span>
                            </div>
                        </div>

                        <button onClick={() => setActiveMode(true)} className="w-full py-4 bg-orange-600 rounded-xl font-black text-white uppercase tracking-wider shadow-lg shadow-orange-900/30 flex items-center justify-center space-x-2">
                            <Icons.Dumbbell className="w-6 h-6" />
                            <span>Iniciar Modo Activo</span>
                        </button>

                        <div className="space-y-3">
                            {plan.exercises.map((ex, i) => (
                                <div key={i} className="bg-zinc-900 p-1 rounded-xl flex space-x-4 pr-4 overflow-hidden border border-zinc-800">
                                    <div className="w-20 bg-zinc-800 shrink-0"><img src={ex.image_url} className="w-full h-full object-cover opacity-70" /></div>
                                    <div className="py-2 flex-1">
                                        <h4 className="font-bold text-white">{ex.name}</h4>
                                        <p className="text-xs text-zinc-500 mb-2">{ex.series} series x {ex.reps}</p>
                                        <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded font-bold">{ex.recommendedWeight}kg</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    /* -------------------------------------------------------------------------- */
    /*                                   MAIN RENDER                              */
    /* -------------------------------------------------------------------------- */

    // If Active Mode is ON, we hide tabs to focus user, unless summary
    const hideTabs = activeMode && !showSummary;

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500/30">

            {/* Content Area */}
            <main className="">
                {activeTab === 'train' && renderTraining()}
                {activeTab === 'academy' && <TabAcademy userProfile={userProfile} />}
                {activeTab === 'progress' && <TabProgress />}
                {activeTab === 'profile' &&
                    (!userProfile ? (
                        <div className="p-8 pt-20">
                            <h2 className="text-2xl font-bold mb-6">Bienvenido a Ares V3</h2>
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <input name="name" placeholder="Nombre" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl" required />
                                <input name="surname" placeholder="Apellido" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl" required />
                                <input name="email" placeholder="Email" type="email" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="weight" placeholder="Peso (kg)" type="number" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl" required />
                                    <input name="height" placeholder="Altura (cm)" type="number" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl" required />
                                </div>
                                <select name="experience" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                                    <option value="principiante">Principiante</option>
                                    <option value="intermedio">Intermedio</option>
                                    <option value="avanzado">Avanzado</option>
                                </select>
                                <button className="w-full bg-purple-600 py-3 rounded-xl font-bold">Crear Cuenta</button>
                            </form>
                        </div>
                    ) : (
                        <TabProfile userProfile={userProfile} setUserProfile={setUserProfile} />
                    ))
                }
            </main>

            {/* Bottom Nav */}
            {!hideTabs && (
                <div className="fixed bottom-0 left-0 w-full bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-900 flex justify-around py-4 pb-6 z-50">
                    <button onClick={() => setActiveTab('train')} className={`flex flex-col items-center space-y-1 ${activeTab === 'train' ? 'text-orange-500' : 'text-zinc-600'}`}>
                        <Icons.Dumbbell className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Entrenar</span>
                    </button>
                    <button onClick={() => setActiveTab('academy')} className={`flex flex-col items-center space-y-1 ${activeTab === 'academy' ? 'text-blue-500' : 'text-zinc-600'}`}>
                        <Icons.Book className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Academia</span>
                    </button>
                    <button onClick={() => setActiveTab('progress')} className={`flex flex-col items-center space-y-1 ${activeTab === 'progress' ? 'text-red-500' : 'text-zinc-600'}`}>
                        <Icons.Calendar className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Progreso</span>
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center space-y-1 ${activeTab === 'profile' ? 'text-purple-500' : 'text-zinc-600'}`}>
                        <Icons.User className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Perfil</span>
                    </button>
                </div>
            )}
        </div>
    );
}
