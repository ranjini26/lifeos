import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, X, Target, TrendingUp, Calendar, Flame, Award, BarChart3 } from 'lucide-react';

interface HabitEntry {
  date: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  streak: number;
  entries: HabitEntry[];
  color: string;
  target: number; // days per week
  icon: string;
}

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Exercise',
      description: '30 minutes of cardio or strength training',
      streak: 12,
      target: 5,
      color: 'from-green-400 to-emerald-500',
      icon: '💪',
      entries: [
        { date: '2024-01-15', completed: true },
        { date: '2024-01-14', completed: true },
        { date: '2024-01-13', completed: false },
        { date: '2024-01-12', completed: true },
        { date: '2024-01-11', completed: true },
        { date: '2024-01-10', completed: true },
        { date: '2024-01-09', completed: true }
      ]
    },
    {
      id: '2',
      name: 'Read 30 Minutes',
      description: 'Read books, articles, or educational content',
      streak: 8,
      target: 7,
      color: 'from-blue-400 to-cyan-500',
      icon: '📚',
      entries: [
        { date: '2024-01-15', completed: true },
        { date: '2024-01-14', completed: true },
        { date: '2024-01-13', completed: true },
        { date: '2024-01-12', completed: false },
        { date: '2024-01-11', completed: true },
        { date: '2024-01-10', completed: true },
        { date: '2024-01-09', completed: true }
      ]
    },
    {
      id: '3',
      name: 'Meditation',
      description: '10 minutes of mindfulness practice',
      streak: 5,
      target: 7,
      color: 'from-purple-400 to-pink-500',
      icon: '🧘',
      entries: [
        { date: '2024-01-15', completed: false },
        { date: '2024-01-14', completed: true },
        { date: '2024-01-13', completed: true },
        { date: '2024-01-12', completed: true },
        { date: '2024-01-11', completed: false },
        { date: '2024-01-10', completed: true },
        { date: '2024-01-09', completed: true }
      ]
    },
    {
      id: '4',
      name: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      streak: 3,
      target: 7,
      color: 'from-cyan-400 to-blue-500',
      icon: '💧',
      entries: [
        { date: '2024-01-15', completed: true },
        { date: '2024-01-14', completed: true },
        { date: '2024-01-13', completed: true },
        { date: '2024-01-12', completed: false },
        { date: '2024-01-11', completed: false },
        { date: '2024-01-10', completed: true },
        { date: '2024-01-09', completed: false }
      ]
    },
    {
      id: '5',
      name: 'Write Journal',
      description: 'Reflect on the day and write thoughts',
      streak: 7,
      target: 5,
      color: 'from-orange-400 to-red-500',
      icon: '✍️',
      entries: [
        { date: '2024-01-15', completed: true },
        { date: '2024-01-14', completed: true },
        { date: '2024-01-13', completed: false },
        { date: '2024-01-12', completed: true },
        { date: '2024-01-11', completed: true },
        { date: '2024-01-10', completed: false },
        { date: '2024-01-09', completed: true }
      ]
    }
  ]);

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const existingEntry = habit.entries.find(entry => entry.date === date);
        if (existingEntry) {
          return {
            ...habit,
            entries: habit.entries.map(entry =>
              entry.date === date ? { ...entry, completed: !entry.completed } : entry
            )
          };
        } else {
          return {
            ...habit,
            entries: [...habit.entries, { date, completed: true }]
          };
        }
      }
      return habit;
    }));
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getCompletionRate = (habit: Habit) => {
    const weekDates = getWeekDates();
    const completedThisWeek = weekDates.filter(date =>
      habit.entries.some(entry => entry.date === date && entry.completed)
    ).length;
    return Math.round((completedThisWeek / habit.target) * 100);
  };

  const isCompletedOnDate = (habit: Habit, date: string) => {
    const entry = habit.entries.find(entry => entry.date === date);
    return entry ? entry.completed : false;
  };

  const weekDates = getWeekDates();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalHabits = habits.length;
  const avgCompletion = Math.round(habits.reduce((acc, habit) => acc + getCompletionRate(habit), 0) / totalHabits);
  const bestStreak = Math.max(...habits.map(h => h.streak));
  const todayCompleted = habits.filter(habit => 
    isCompletedOnDate(habit, new Date().toISOString().split('T')[0])
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Habit Tracker</h2>
        <p className="text-slate-700">Build consistency and track your daily habits</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-slate-700">This week</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{avgCompletion}%</div>
            <div className="text-sm text-slate-700">Average completion</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-red-100">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-slate-700">Best streak</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{bestStreak}</div>
            <div className="text-sm text-slate-700">Days in a row</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-slate-700">Today</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{todayCompleted}/{totalHabits}</div>
            <div className="text-sm text-slate-700">Completed today</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-slate-700">Active habits</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{totalHabits}</div>
            <div className="text-sm text-slate-700">Being tracked</div>
          </div>
        </motion.div>
      </div>

      {/* Habits List */}
      <div className="glassmorphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
            Your Habits
          </h3>
          <button className="p-2 hover:bg-white/60 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Week Header */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4 text-sm font-medium text-slate-700">Habit</div>
          <div className="col-span-8 grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center text-xs font-medium text-slate-700">
                <div>{day}</div>
                <div className="text-slate-500">
                  {new Date(weekDates[index]).getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div className="space-y-4">
          {habits.map((habit, habitIndex) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: habitIndex * 0.1 }}
              className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl glassmorphism-light border border-white/50 hover:bg-white/90 transition-all duration-200"
            >
              {/* Habit Info */}
              <div className="col-span-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{habit.icon}</span>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${habit.color}`}></div>
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">{habit.name}</h4>
                    <p className="text-slate-700 text-sm">{habit.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-600 flex items-center">
                        <Flame className="w-3 h-3 mr-1 text-orange-500" />
                        {habit.streak} days
                      </span>
                      <span className="text-xs text-slate-600">
                        Target: {habit.target}/week
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {getCompletionRate(habit)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week Grid */}
              <div className="col-span-8 grid grid-cols-7 gap-2">
                {weekDates.map((date, dateIndex) => {
                  const isCompleted = isCompletedOnDate(habit, date);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <motion.button
                      key={date}
                      onClick={() => toggleHabit(habit.id, date)}
                      className={`
                        w-8 h-8 rounded-lg border-2 transition-all duration-200 relative
                        ${isCompleted 
                          ? `bg-gradient-to-r ${habit.color} border-transparent shadow-lg` 
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                        }
                        ${isToday ? 'ring-2 ring-blue-400/50' : ''}
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (habitIndex * 0.1) + (dateIndex * 0.05) }}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400 mx-auto" />
                      )}
                      {isToday && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Habit */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: habits.length * 0.1 + 0.3 }}
          className="w-full mt-6 p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add a new habit</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Habits;