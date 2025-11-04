
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Exercise } from './types';
import Summary from './components/Summary';
import ExerciseForm from './components/ExerciseForm';
import ExerciseList from './components/ExerciseList';
import { DumbbellIcon } from './components/icons/DumbbellIcon';

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    try {
      const savedExercises = localStorage.getItem('fitTrackExercises');
      return savedExercises ? JSON.parse(savedExercises) : [];
    } catch (error) {
      console.error("Could not parse exercises from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fitTrackExercises', JSON.stringify(exercises));
  }, [exercises]);

  const addExercise = useCallback((exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now(),
    };
    setExercises(prevExercises => [newExercise, ...prevExercises]);
  }, []);

  const deleteExercise = useCallback((id: number) => {
    setExercises(prevExercises => prevExercises.filter(ex => ex.id !== id));
  }, []);

  const { totalDuration, totalCalories } = useMemo(() => {
    return exercises.reduce(
      (acc, curr) => {
        acc.totalDuration += curr.duration;
        acc.totalCalories += curr.calories;
        return acc;
      },
      { totalDuration: 0, totalCalories: 0 }
    );
  }, [exercises]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center space-x-4 mb-8">
          <div className="bg-green-500 p-3 rounded-full">
            <DumbbellIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">FitTrack</h1>
            <p className="text-gray-400">Your personal exercise logger.</p>
          </div>
        </header>

        <main className="space-y-8">
          <Summary totalDuration={totalDuration} totalCalories={totalCalories} />
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Log New Exercise</h2>
            <ExerciseForm onAddExercise={addExercise} />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
             <h2 className="text-2xl font-semibold mb-4 text-green-400">Activity History</h2>
            <ExerciseList exercises={exercises} onDeleteExercise={deleteExercise} />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Stay strong, stay consistent. 💪</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
