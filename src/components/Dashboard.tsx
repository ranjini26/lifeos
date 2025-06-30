import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  FileText, 
  Target,
  TrendingUp,
  Clock,
  Zap,
  Plus,
  BarChart3,
  Activity,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Sample data to make everything visible
  const todaysTasks = [
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Finish the quarterly project proposal for the marketing team',
      priority: 'high',
      progress: 75,
      dueTime: '2:00 PM'
    },
    {
      id: 2,
      title: 'Team standup meeting',
      description: 'Daily sync with the development team',
      priority: 'medium',
      progress: 0,
      dueTime: '10:00 AM'
    },
    {
      id: 3,
      title: 'Review quarterly goals',
      description: 'Analyze Q4 performance and set Q1 objectives',
      priority: 'medium',
      progress: 30,
      dueTime: '4:00 PM'
    }
  ];

  const recentNotes = [
    {
      id: 1,
      title: 'Meeting Notes - Q1 Planning',
      preview: 'Key decisions made during the quarterly planning session...',
      tags: ['meeting', 'planning'],
      starred: true
    },
    {
      id: 2,
      title: 'Product Ideas',
      preview: 'Brainstorming session results for new features...',
      tags: ['ideas', 'product'],
      starred: false
    }
  ];

  const habitProgress = [
    { name: 'Morning Exercise', completed: 5, target: 7, streak: 12 },
    { name: 'Read 30 Minutes', completed: 6, target: 7, streak: 8 },
    { name: 'Meditation', completed: 4, target: 7, streak: 5 }
  ];

  const upcomingEvents = [
    { time: '10:00 AM', title: 'Team Standup', type: 'meeting' },
    { time: '2:00 PM', title: 'Client Call', type: 'call' },
    { time: '4:00 PM', title: 'Project Review', type: 'review' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-shadow">
          Welcome back! Ready to conquer today?
        </h2>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Here's your productivity overview for {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="glassmorphism p-6 sm:p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-soft">
              <CheckSquare className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium bg-white/80 px-3 py-1 rounded-full border border-white/60">Today</span>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-slate-900">8/12</div>
            <div className="text-sm text-slate-700 font-medium">Tasks completed</div>
            <div className="w-full bg-slate-300 rounded-full h-3">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full shadow-sm" style={{ width: '67%' }}></div>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-6 sm:p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-soft">
              <Target className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium bg-white/80 px-3 py-1 rounded-full border border-white/60">This week</span>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-slate-900">5/7</div>
            <div className="text-sm text-slate-700 font-medium">Habits maintained</div>
            <div className="w-full bg-slate-300 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full shadow-sm" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-6 sm:p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-soft">
              <TrendingUp className="w-7 h-7 text-purple-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium bg-white/80 px-3 py-1 rounded-full border border-white/60">This month</span>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-slate-900">92%</div>
            <div className="text-sm text-slate-700 font-medium">Productivity score</div>
            <div className="w-full bg-slate-300 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full shadow-sm" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-6 sm:p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-100 shadow-soft">
              <Activity className="w-7 h-7 text-orange-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium bg-white/80 px-3 py-1 rounded-full border border-white/60">Today</span>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-slate-900">6.2h</div>
            <div className="text-sm text-slate-700 font-medium">Focus time</div>
            <div className="w-full bg-slate-300 rounded-full h-3">
              <div className="bg-gradient-to-r from-orange-400 to-yellow-500 h-3 rounded-full shadow-sm" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Focus */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <div className="glassmorphism p-6 sm:p-8 rounded-3xl h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-blue-500" />
                Today's Focus
              </h3>
              <button className="p-2 rounded-xl glassmorphism-light hover:bg-white/90 transition-all duration-200">
                <Plus className="w-5 h-5 text-slate-800" />
              </button>
            </div>
            <div className="space-y-4">
              {todaysTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: task.id * 0.1 }}
                  className="p-5 rounded-2xl glassmorphism-light border border-white/50 hover:bg-white/90 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-900 font-semibold text-lg">{task.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                        {task.dueTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 mb-4">{task.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-slate-300 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full shadow-sm transition-all duration-500" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{task.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-1 space-y-6"
        >
          {/* Quick Actions */}
          <div className="glassmorphism p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <motion.button 
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/50 text-left hover:from-orange-100 hover:to-pink-100 transition-all duration-300 group shadow-soft"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-medium">Add new task</span>
                  <CheckSquare className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                </div>
              </motion.button>
              <motion.button 
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-left hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group shadow-soft"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-medium">Schedule event</span>
                  <CalendarIcon className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
              </motion.button>
              <motion.button 
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 text-left hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 group shadow-soft"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-medium">Create note</span>
                  <FileText className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Habit Progress */}
          <div className="glassmorphism p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Habit Progress
            </h3>
            <div className="space-y-4">
              {habitProgress.map((habit, index) => (
                <motion.div
                  key={habit.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-medium text-sm">{habit.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-600">{habit.completed}/{habit.target}</span>
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-300 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full shadow-sm transition-all duration-500" 
                      style={{ width: `${(habit.completed / habit.target) * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glassmorphism p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-purple-500" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-xl glassmorphism-light border border-white/50"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                  <div className="flex-1">
                    <div className="text-slate-900 font-medium text-sm">{event.title}</div>
                    <div className="text-slate-600 text-xs">{event.time}</div>
                  </div>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {event.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Notes */}
          <div className="glassmorphism p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Recent Notes
            </h3>
            <div className="space-y-3">
              {recentNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl glassmorphism-light border border-white/50 hover:bg-white/80 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-slate-900 font-medium text-sm flex-1">{note.title}</span>
                    {note.starred && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current ml-2" />
                    )}
                  </div>
                  <p className="text-slate-600 text-xs mb-2 line-clamp-2">{note.preview}</p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;