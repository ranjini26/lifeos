import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  FileText, 
  Target, 
  Brain,
  Sparkles,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { AuthService } from '../services/supabase';

type Tab = 'dashboard' | 'tasks' | 'calendar' | 'notes' | 'habits' | 'reflection';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  copilotOpen, 
  setCopilotOpen 
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'reflection', label: 'Reflection', icon: Brain },
  ] as const;

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="glassmorphism-strong border-b border-white/40 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">LifeOS</h1>
              <p className="text-xs text-slate-700 font-medium hidden sm:block">Personal Productivity</p>
            </div>
          </motion.div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2 glassmorphism rounded-2xl p-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'text-slate-900 shadow-lg'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl border border-white/60 shadow-lg"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* AI Copilot Toggle */}
            <motion.button
              onClick={() => setCopilotOpen(!copilotOpen)}
              className={`p-3 rounded-2xl transition-all duration-300 backdrop-blur-xl border shadow-lg ${
                copilotOpen 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200 shadow-glow-purple' 
                  : 'glassmorphism border-white/40 hover:bg-white/80'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="AI Copilot"
            >
              <Brain className="w-5 h-5 text-slate-800" />
            </motion.button>

            {/* User Menu */}
            <div className="relative group">
              <motion.button
                className="p-3 rounded-2xl glassmorphism border-white/40 hover:bg-white/80 transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="User Menu"
              >
                <User className="w-5 h-5 text-slate-800" />
              </motion.button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 glassmorphism rounded-2xl border border-white/50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white/60 transition-all duration-200">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden flex items-center justify-between mt-4 glassmorphism rounded-2xl p-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`relative p-3 rounded-xl transition-all duration-300 flex-1 flex flex-col items-center justify-center space-y-1 ${
                  activeTab === tab.id
                    ? 'text-slate-900'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl border border-white/60"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-xs font-medium relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;