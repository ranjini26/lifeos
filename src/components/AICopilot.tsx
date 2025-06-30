import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  X, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  RefreshCw,
  Wand2,
  Clock,
  CheckCircle
} from 'lucide-react';
import { aiService, AISuggestion, UserContext } from '../services/supabase';

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
  userContext: UserContext;
}

const AICopilot: React.FC<AICopilotProps> = ({ isOpen, onClose, userContext }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'improve' | 'plan'>('suggestions');
  const [taskToImprove, setTaskToImprove] = useState('');
  const [improvedTask, setImprovedTask] = useState<any>(null);
  const [dailyPlan, setDailyPlan] = useState<any>(null);

  const iconMap = {
    'lightbulb': Lightbulb,
    'target': Target,
    'trending-up': TrendingUp,
    'calendar': Calendar,
    'zap': Zap,
    'brain': Brain
  };

  const typeColors = {
    'task_improvement': 'from-blue-100 to-cyan-100 border-blue-200',
    'planning_tip': 'from-green-100 to-emerald-100 border-green-200',
    'productivity_insight': 'from-purple-100 to-pink-100 border-purple-200',
    'habit_suggestion': 'from-orange-100 to-yellow-100 border-orange-200'
  };

  const priorityColors = {
    'high': 'text-red-700 bg-red-100 border-red-200',
    'medium': 'text-yellow-700 bg-yellow-100 border-yellow-200',
    'low': 'text-green-700 bg-green-100 border-green-200'
  };

  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      generateSuggestions();
    }
  }, [isOpen]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const newSuggestions = await aiService.generateSuggestions(userContext);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const improveTask = async () => {
    if (!taskToImprove.trim()) return;
    
    setIsLoading(true);
    try {
      const improved = await aiService.improveTask(taskToImprove, '');
      setImprovedTask(improved);
    } catch (error) {
      console.error('Failed to improve task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDailyPlan = async () => {
    setIsLoading(true);
    try {
      const plan = await aiService.generateDailyPlan(userContext);
      setDailyPlan(plan);
    } catch (error) {
      console.error('Failed to generate daily plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'suggestions', label: 'Smart Suggestions', icon: Sparkles },
    { id: 'improve', label: 'Improve Task', icon: Wand2 },
    { id: 'plan', label: 'Daily Plan', icon: Calendar }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Copilot Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 glassmorphism-strong border-l border-white/40 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">AI Copilot</h2>
                    <p className="text-xs text-slate-700">Your intelligent assistant</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-800" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-1 mt-4 glassmorphism-light rounded-lg p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                        activeTab === tab.id
                          ? 'text-slate-900'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTabCopilot"
                          className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-md border border-white/50"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                      <Icon className="w-3 h-3" />
                      <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 font-medium">Smart Suggestions</h3>
                    <button
                      onClick={generateSuggestions}
                      disabled={isLoading}
                      className="p-2 hover:bg-white/60 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-slate-800 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl glassmorphism-light border border-white/50 animate-pulse">
                          <div className="h-4 bg-slate-300 rounded mb-2"></div>
                          <div className="h-3 bg-slate-300 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suggestions.map((suggestion) => {
                        const Icon = iconMap[suggestion.icon as keyof typeof iconMap] || Lightbulb;
                        return (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl bg-gradient-to-r ${typeColors[suggestion.type]} border backdrop-blur-sm hover:bg-white/80 transition-all duration-200`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-lg glassmorphism-light">
                                <Icon className="w-4 h-4 text-slate-800" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-slate-900 font-medium text-sm">{suggestion.title}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[suggestion.priority]}`}>
                                    {suggestion.priority}
                                  </span>
                                </div>
                                <p className="text-slate-800 text-xs leading-relaxed mb-2">
                                  {suggestion.content}
                                </p>
                                {suggestion.actionable && (
                                  <button className="text-xs text-purple-600 hover:text-purple-800 transition-colors">
                                    Take action →
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'improve' && (
                <div className="space-y-4">
                  <h3 className="text-slate-900 font-medium">Improve Task</h3>
                  
                  <div className="space-y-3">
                    <textarea
                      value={taskToImprove}
                      onChange={(e) => setTaskToImprove(e.target.value)}
                      placeholder="Enter a task you'd like to improve..."
                      className="w-full px-4 py-3 rounded-xl glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-purple-400/50 focus:outline-none resize-none"
                      rows={3}
                    />
                    
                    <button
                      onClick={improveTask}
                      disabled={isLoading || !taskToImprove.trim()}
                      className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      Improve Task
                    </button>
                  </div>

                  {improvedTask && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl glassmorphism-light border border-white/50"
                    >
                      <h4 className="text-slate-900 font-medium mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Improved Task
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-700 block mb-1">Title</label>
                          <p className="text-slate-900 text-sm">{improvedTask.improvedTitle}</p>
                        </div>
                        
                        <div>
                          <label className="text-xs text-slate-700 block mb-1">Description</label>
                          <p className="text-slate-800 text-sm">{improvedTask.improvedDescription}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="text-xs text-slate-700 block mb-1">Priority</label>
                            <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[improvedTask.suggestedPriority as keyof typeof priorityColors]}`}>
                              {improvedTask.suggestedPriority}
                            </span>
                          </div>
                          <div>
                            <label className="text-xs text-slate-700 block mb-1">Estimated Time</label>
                            <span className="text-slate-900 text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {improvedTask.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 font-medium">Daily Plan</h3>
                    <button
                      onClick={generateDailyPlan}
                      disabled={isLoading}
                      className="p-2 hover:bg-white/60 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-slate-800 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl glassmorphism-light border border-white/50 animate-pulse">
                        <div className="h-4 bg-slate-300 rounded mb-2"></div>
                        <div className="h-3 bg-slate-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  ) : dailyPlan ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200">
                        <h4 className="text-slate-900 font-medium mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                          Morning Focus
                        </h4>
                        <p className="text-slate-800 text-sm">{dailyPlan.morningFocus}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
                        <h4 className="text-slate-900 font-medium mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-blue-600" />
                          Afternoon Goals
                        </h4>
                        <p className="text-slate-800 text-sm">{dailyPlan.afternoonGoals}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
                        <h4 className="text-slate-900 font-medium mb-2 flex items-center">
                          <Brain className="w-4 h-4 mr-2 text-purple-600" />
                          Evening Reflection
                        </h4>
                        <p className="text-slate-800 text-sm">{dailyPlan.eveningReflection}</p>
                      </div>

                      <div className="p-4 rounded-xl glassmorphism-light border border-white/50">
                        <h4 className="text-slate-900 font-medium mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                          Key Priorities
                        </h4>
                        <ul className="space-y-2">
                          {dailyPlan.keyPriorities.map((priority: string, index: number) => (
                            <li key={index} className="text-slate-800 text-sm flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-2"></div>
                              {priority}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={generateDailyPlan}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Generate Daily Plan
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AICopilot;