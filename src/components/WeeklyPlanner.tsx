import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const WeeklyPlanner: React.FC = () => {
  const router = useRouter();
  const [plan] = useState({
    workouts: [
      { day: 1, workoutId: 1, completed: false, note: '' },
      { day: 2, workoutId: 2, completed: false, note: '' },
      { day: 3, workoutId: -1, completed: false, note: 'Rest Day' },
      { day: 4, workoutId: 3, completed: false, note: '' },
      { day: 5, workoutId: 4, completed: false, note: '' },
      { day: 6, workoutId: 5, completed: false, note: '' },
      { day: 7, workoutId: 6, completed: false, note: '' },
    ],
  });

  const handleDayClick = (day: number, workoutId: number | null) => {
    if (workoutId === -1) return;
    
    if (workoutId) {
      router.push(`/workout/${workoutId}`);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {plan.workouts.map((workout) => {
        const isRestDay = workout.workoutId === -1;
        return (
          <div
            key={workout.day}
            onClick={() => handleDayClick(workout.day, workout.workoutId)}
            className={`p-4 rounded-lg text-center cursor-pointer transition ${
              isRestDay 
                ? "bg-gray-100 cursor-not-allowed" 
                : workout.completed 
                  ? "bg-green-100" 
                  : "bg-white hover:bg-pink-50"
            }`}
          >
            <div className="font-semibold mb-2">Day {workout.day}</div>
            {isRestDay ? (
              <div className="text-gray-500">
                <div className="font-medium">Rest Day</div>
                <div className="text-sm mt-1">{workout.note}</div>
              </div>
            ) : workout.workoutId ? (
              <div>
                <div className="font-medium">
                  {workouts.find((w) => w.id === workout.workoutId)?.title || "Loading..."}
                </div>
                {workout.note && (
                  <div className="text-sm text-gray-600 mt-1">{workout.note}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No workout</div>
            )}
            {workout.completed && (
              <div className="text-green-600 text-sm mt-2">Completed</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyPlanner; 