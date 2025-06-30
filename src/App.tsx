import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import Calendar from './components/Calendar';
import Notes from './components/Notes';
import Habits from './components/Habits';
import Reflection from './components/Reflection';
import AICopilot from './components/AICopilot';
import VoiceInput from './components/VoiceInput';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import { AuthService } from './services/supabase';
import { UserContext } from './services/supabase';
import { ExternalLink } from 'lucide-react';

type Tab = 'dashboard' | 'tasks' | 'calendar' | 'notes' | 'habits' | 'reflection';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'review' | 'done';
  dueDate?: string;
  assignee?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [voiceInputOpen, setVoiceInputOpen] = useState(false);
  
  // Global state for tasks and notes
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  // Mock user context - in a real app, this would come from your Supabase data
  const userContext: UserContext = {
    tasks: [
      { title: 'Design homepage mockup', description: 'Create initial wireframes', priority: 'high', status: 'todo' },
      { title: 'Write blog post', description: 'Article about productivity', priority: 'medium', status: 'todo' },
      { title: 'Implement user auth', description: 'Add login functionality', priority: 'high', status: 'inprogress' }
    ],
    notes: [
      { title: 'Project Ideas', content: 'AI-powered task management app', tags: ['brainstorming', 'ai'] },
      { title: 'Meeting Notes', content: 'Q1 planning session outcomes', tags: ['meetings', 'planning'] }
    ],
    habits: [
      { name: 'Morning Exercise', streak: 12, completionRate: 85 },
      { name: 'Read 30 Minutes', streak: 8, completionRate: 90 },
      { name: 'Meditation', streak: 5, completionRate: 70 }
    ],
    recentActivity: ['Added new task', 'Completed habit', 'Created note'],
    timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening',
    dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
  };

  // Global task creation function
  const addTask = (title: string, description: string = '', priority: 'low' | 'medium' | 'high' = 'medium') => {
    console.log('🚀 App.tsx - Adding task globally:', { title, description, priority });
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'todo',
      assignee: 'You'
    };

    console.log('✅ App.tsx - Created new task object:', newTask);
    
    setTasks(prevTasks => {
      const updatedTasks = [newTask, ...prevTasks];
      console.log('📋 App.tsx - Updated tasks array:', updatedTasks);
      return updatedTasks;
    });

    // Show success notification
    showNotification(`Task "${title}" created successfully!`, 'success');
    
    // Switch to tasks tab to show the new task
    setActiveTab('tasks');
    
    return newTask;
  };

  // Global note creation function
  const addNote = (content: string, title?: string) => {
    console.log('🚀 App.tsx - Adding note globally:', { content, title });
    
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || `Voice Note ${new Date().toLocaleDateString()}`,
      content: content.trim(),
      tags: [],
      starred: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('✅ App.tsx - Created new note object:', newNote);
    
    setNotes(prevNotes => {
      const updatedNotes = [newNote, ...prevNotes];
      console.log('📝 App.tsx - Updated notes array:', updatedNotes);
      return updatedNotes;
    });

    // Show success notification
    showNotification(`Note "${newNote.title}" created successfully!`, 'success');
    
    // Switch to notes tab to show the new note
    setActiveTab('notes');
    
    return newNote;
  };

  // Notification system
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' 
      ? 'from-emerald-400 to-teal-500' 
      : 'from-red-400 to-pink-500';
    
    notification.className = `fixed top-4 right-4 bg-gradient-to-r ${bgColor} text-white px-6 py-3 rounded-2xl shadow-lg z-50 font-medium max-w-sm transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  };

  // Expose global functions
  useEffect(() => {
    console.log('🌐 App.tsx - Registering global functions');
    (window as any).addTaskGlobally = addTask;
    (window as any).addNoteGlobally = addNote;
    
    return () => {
      console.log('🌐 App.tsx - Unregistering global functions');
      delete (window as any).addTaskGlobally;
      delete (window as any).addNoteGlobally;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl === 'your_supabase_project_url' || 
            supabaseKey === 'your_supabase_anon_key') {
          // Skip auth initialization if Supabase is not configured
          console.warn('Supabase not configured, running in demo mode');
          if (mounted) {
            setUser({ id: 'demo-user', email: 'demo@example.com' }); // Demo user
            setLoading(false);
          }
          return;
        }

        // Try to get current user with a more robust approach
        try {
          const currentUser = await AuthService.getCurrentUser();
          if (mounted) {
            setUser(currentUser);
            setLoading(false);
          }
        } catch (authError) {
          console.warn('Auth service unavailable, falling back to demo mode:', authError);
          if (mounted) {
            // Fall back to demo mode instead of showing error
            setUser({ id: 'demo-user', email: 'demo@example.com' });
            setLoading(false);
            setError(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          // Instead of showing error, fall back to demo mode
          console.warn('Auth failed, running in demo mode');
          setUser({ id: 'demo-user', email: 'demo@example.com' }); // Demo user
          setLoading(false);
          setError(null);
        }
      }
    };

    initializeAuth();

    // Only set up auth listener if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    let subscription: any = null;
    
    if (supabaseUrl && supabaseKey && 
        supabaseUrl !== 'your_supabase_project_url' && 
        supabaseKey !== 'your_supabase_anon_key') {
      try {
        // Listen for auth changes with error handling
        const { data: { subscription: authSubscription } } = AuthService.onAuthStateChange((user) => {
          if (mounted) {
            setUser(user);
            setLoading(false);
            setError(null);
          }
        });
        subscription = authSubscription;
      } catch (error) {
        console.warn('Could not set up auth listener:', error);
      }
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleVoiceTranscript = (transcript: string, type: 'note' | 'task') => {
    console.log('🎤 App.tsx - Voice transcript received:', { transcript, type });
    
    // Process the voice command
    if (type === 'task') {
      addTask(transcript);
    } else {
      addNote(transcript);
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setLoading(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskBoard tasks={tasks} setTasks={setTasks} />;
      case 'calendar':
        return <Calendar />;
      case 'notes':
        return <Notes notes={notes} setNotes={setNotes} />;
      case 'habits':
        return <Habits />;
      case 'reflection':
        return <Reflection />;
      default:
        return <Dashboard />;
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <motion.div
              className="w-8 h-8 bg-white rounded-lg"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <p className="text-slate-600 mb-2">Loading LifeOS...</p>
          {error && (
            <div className="mt-4">
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show auth if requested or no user
  if (showAuth || (!user || (user.id === 'demo-user' && showAuth))) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc=')] opacity-40"></div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-500 ease-out ${copilotOpen ? 'lg:mr-96' : ''}`}>
          <Header 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            copilotOpen={copilotOpen}
            setCopilotOpen={setCopilotOpen}
          />
          
          <main className="p-4 sm:p-6 lg:p-8 pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Built with Bolt.new Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-4 right-4 z-30"
          >
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 glassmorphism rounded-full border border-white/50 hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Built with Bolt.new
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-700 transition-colors" />
            </a>
          </motion.div>
        </div>

        {/* AI Copilot */}
        <AICopilot 
          isOpen={copilotOpen} 
          onClose={() => setCopilotOpen(false)}
          userContext={userContext}
        />

        {/* Voice Input */}
        <VoiceInput 
          isOpen={voiceInputOpen}
          onToggle={() => setVoiceInputOpen(!voiceInputOpen)}
          onTranscriptComplete={handleVoiceTranscript}
        />
      </div>
    </div>
  );
}

export default App;