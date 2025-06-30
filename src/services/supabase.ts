import { supabase } from '../lib/supabase';

export interface UserContext {
  tasks: Array<{
    title: string;
    description: string;
    priority: string;
    status: string;
  }>;
  notes: Array<{
    title: string;
    content: string;
    tags: string[];
  }>;
  habits: Array<{
    name: string;
    streak: number;
    completionRate: number;
  }>;
  recentActivity: string[];
  timeOfDay: string;
  dayOfWeek: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  content: string;
  type: 'task_improvement' | 'planning_tip' | 'productivity_insight' | 'habit_suggestion';
  priority: 'high' | 'medium' | 'low';
  icon: string;
  actionable: boolean;
}

export interface ImprovedTask {
  improvedTitle: string;
  improvedDescription: string;
  suggestedPriority: string;
  estimatedTime: string;
}

export interface DailyPlan {
  morningFocus: string;
  afternoonGoals: string;
  eveningReflection: string;
  keyPriorities: string[];
}

// Demo data for fallback
const DEMO_TASKS = [
  {
    id: 'demo-task-1',
    user_id: 'demo-user',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal for the marketing team',
    priority: 'high',
    status: 'inprogress',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    assignee: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-task-2',
    user_id: 'demo-user',
    title: 'Review team feedback',
    description: 'Go through the feedback from last week\'s sprint review',
    priority: 'medium',
    status: 'todo',
    due_date: null,
    assignee: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_NOTES = [
  {
    id: 'demo-note-1',
    user_id: 'demo-user',
    title: 'Meeting Notes - Q1 Planning',
    content: 'Key points from today\'s planning session:\n- Focus on user experience improvements\n- Allocate resources for mobile optimization\n- Schedule follow-up meetings',
    tags: ['meeting', 'planning', 'q1'],
    starred: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-note-2',
    user_id: 'demo-user',
    title: 'Ideas for Product Enhancement',
    content: 'Brainstorming session results:\n- Dark mode toggle\n- Advanced search functionality\n- Integration with third-party tools',
    tags: ['ideas', 'product', 'enhancement'],
    starred: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_HABITS = [
  {
    id: 'demo-habit-1',
    user_id: 'demo-user',
    name: 'Morning Exercise',
    description: '30 minutes of cardio or strength training',
    target_days_per_week: 5,
    color: 'from-green-400 to-emerald-500',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-habit-2',
    user_id: 'demo-user',
    name: 'Read for 20 minutes',
    description: 'Daily reading to expand knowledge and vocabulary',
    target_days_per_week: 7,
    color: 'from-blue-400 to-cyan-500',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_REFLECTIONS = [
  {
    id: 'demo-reflection-1',
    user_id: 'demo-user',
    date: new Date().toISOString().split('T')[0],
    mood: 'good',
    energy_level: 7,
    gratitude: ['Productive team meeting', 'Beautiful weather', 'Good coffee'],
    wins: ['Completed major task', 'Helped a colleague'],
    challenges: ['Time management', 'Email overload'],
    tomorrow_focus: ['Start new project', 'Organize workspace'],
    notes: 'Overall a good day with steady progress on key objectives.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_EVENTS = [
  {
    id: 'demo-event-1',
    user_id: 'demo-user',
    title: 'Team Standup',
    description: 'Daily team synchronization meeting',
    start_time: new Date(Date.now() + 3600000).toISOString(),
    end_time: new Date(Date.now() + 5400000).toISOString(),
    location: 'Conference Room A',
    color: 'from-blue-400 to-cyan-400',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class AuthService {
  static async getCurrentUser() {
    try {
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 3000)
      );

      const authPromise = supabase.auth.getUser();
      
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn('Auth error:', error);
        return null;
      }
      
      return data?.user || null;
    } catch (error) {
      console.warn('Failed to get current user:', error);
      // Don't throw the error, just return null to allow fallback to demo mode
      return null;
    }
  }

  static async signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create user profile if user was created
      if (data.user) {
        try {
          await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName || null
            });
        } catch (profileError) {
          console.warn('Could not create user profile:', profileError);
          // Don't fail the signup if profile creation fails
        }
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: any) => void) {
    try {
      return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
      });
    } catch (error) {
      console.warn('Could not set up auth state listener:', error);
      // Return a mock subscription object to prevent errors
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  }
}

// Database services
export class TaskService {
  static async getTasks(userId: string) {
    // Return demo data if using demo user
    if (userId === 'demo-user') {
      return DEMO_TASKS;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  static async createTask(task: any) {
    // Don't attempt to create tasks for demo user
    if (task.user_id === 'demo-user') {
      const newTask = {
        ...task,
        id: `demo-task-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      DEMO_TASKS.unshift(newTask);
      return newTask;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(id: string, updates: any) {
    // Handle demo task updates
    if (id.startsWith('demo-task-')) {
      const taskIndex = DEMO_TASKS.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        DEMO_TASKS[taskIndex] = { ...DEMO_TASKS[taskIndex], ...updates, updated_at: new Date().toISOString() };
        return DEMO_TASKS[taskIndex];
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(id: string) {
    // Handle demo task deletion
    if (id.startsWith('demo-task-')) {
      const taskIndex = DEMO_TASKS.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        DEMO_TASKS.splice(taskIndex, 1);
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export class NotesService {
  static async getNotes(userId: string) {
    // Return demo data if using demo user
    if (userId === 'demo-user') {
      return DEMO_NOTES;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async createNote(note: any) {
    // Don't attempt to create notes for demo user
    if (note.user_id === 'demo-user') {
      const newNote = {
        ...note,
        id: `demo-note-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      DEMO_NOTES.unshift(newNote);
      return newNote;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([note])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  static async updateNote(id: string, updates: any) {
    // Handle demo note updates
    if (id.startsWith('demo-note-')) {
      const noteIndex = DEMO_NOTES.findIndex(n => n.id === id);
      if (noteIndex !== -1) {
        DEMO_NOTES[noteIndex] = { ...DEMO_NOTES[noteIndex], ...updates, updated_at: new Date().toISOString() };
        return DEMO_NOTES[noteIndex];
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async deleteNote(id: string) {
    // Handle demo note deletion
    if (id.startsWith('demo-note-')) {
      const noteIndex = DEMO_NOTES.findIndex(n => n.id === id);
      if (noteIndex !== -1) {
        DEMO_NOTES.splice(noteIndex, 1);
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}

// Export NotesService as NoteService for backward compatibility
export const NoteService = NotesService;

export class HabitsService {
  static async getHabits(userId: string) {
    // Return demo data if using demo user
    if (userId === 'demo-user') {
      return DEMO_HABITS;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
  }

  static async createHabit(habit: any) {
    // Don't attempt to create habits for demo user
    if (habit.user_id === 'demo-user') {
      const newHabit = {
        ...habit,
        id: `demo-habit-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      DEMO_HABITS.unshift(newHabit);
      return newHabit;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([habit])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  }

  static async getHabitEntries(habitId: string) {
    // Return empty array for demo habits
    if (habitId.startsWith('demo-habit-')) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('habit_id', habitId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching habit entries:', error);
      return [];
    }
  }

  static async toggleHabitEntry(habitId: string, date: string, completed: boolean) {
    // Don't attempt to toggle entries for demo habits
    if (habitId.startsWith('demo-habit-')) {
      return {
        id: `demo-entry-${Date.now()}`,
        habit_id: habitId,
        date,
        completed,
        created_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .upsert({
          habit_id: habitId,
          date,
          completed
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling habit entry:', error);
      throw error;
    }
  }
}

export class ReflectionService {
  static async getReflections(userId: string) {
    // Return demo data if using demo user
    if (userId === 'demo-user') {
      return DEMO_REFLECTIONS;
    }

    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching reflections:', error);
      return [];
    }
  }

  static async createOrUpdateReflection(reflection: any) {
    // Don't attempt to save reflections for demo user
    if (reflection.user_id === 'demo-user') {
      const existingIndex = DEMO_REFLECTIONS.findIndex(r => r.date === reflection.date);
      if (existingIndex !== -1) {
        DEMO_REFLECTIONS[existingIndex] = { ...reflection, updated_at: new Date().toISOString() };
        return DEMO_REFLECTIONS[existingIndex];
      } else {
        const newReflection = {
          ...reflection,
          id: `demo-reflection-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        DEMO_REFLECTIONS.unshift(newReflection);
        return newReflection;
      }
    }

    try {
      const { data, error } = await supabase
        .from('reflections')
        .upsert(reflection)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving reflection:', error);
      throw error;
    }
  }
}

export class CalendarService {
  static async getEvents(userId: string) {
    // Return demo data if using demo user
    if (userId === 'demo-user') {
      return DEMO_EVENTS;
    }

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  static async createEvent(event: any) {
    // Don't attempt to create events for demo user
    if (event.user_id === 'demo-user') {
      const newEvent = {
        ...event,
        id: `demo-event-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      DEMO_EVENTS.push(newEvent);
      return newEvent;
    }

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  static async updateEvent(id: string, updates: any) {
    // Handle demo event updates
    if (id.startsWith('demo-event-')) {
      const eventIndex = DEMO_EVENTS.findIndex(e => e.id === id);
      if (eventIndex !== -1) {
        DEMO_EVENTS[eventIndex] = { ...DEMO_EVENTS[eventIndex], ...updates, updated_at: new Date().toISOString() };
        return DEMO_EVENTS[eventIndex];
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  static async deleteEvent(id: string) {
    // Handle demo event deletion
    if (id.startsWith('demo-event-')) {
      const eventIndex = DEMO_EVENTS.findIndex(e => e.id === id);
      if (eventIndex !== -1) {
        DEMO_EVENTS.splice(eventIndex, 1);
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}

export class AIService {
  static async generateSuggestions(userContext: UserContext): Promise<AISuggestion[]> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_project_url' || 
          supabaseKey === 'your_supabase_anon_key') {
        throw new Error('Supabase not configured');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/ai-suggestions`;
      
      const headers = {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userContext })
      });

      if (!response.ok) {
        throw new Error(`AI suggestions request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Return fallback suggestions
      return [
        {
          id: '1',
          title: 'Focus on High Priority Tasks',
          content: 'Consider tackling your high-priority tasks first thing in the morning when your energy is highest.',
          type: 'productivity_insight',
          priority: 'high',
          icon: 'target',
          actionable: true
        },
        {
          id: '2',
          title: 'Take Regular Breaks',
          content: 'Remember to take short breaks every 25-30 minutes to maintain focus and productivity.',
          type: 'planning_tip',
          priority: 'medium',
          icon: 'zap',
          actionable: true
        }
      ];
    }
  }

  static async improveTask(taskTitle: string, taskDescription: string): Promise<ImprovedTask> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_project_url' || 
          supabaseKey === 'your_supabase_anon_key') {
        throw new Error('Supabase not configured');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/improve-task`;
      
      const headers = {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          taskTitle, 
          taskDescription 
        })
      });

      if (!response.ok) {
        throw new Error(`Task improvement request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error improving task:', error);
      // Return fallback improved task
      return {
        improvedTitle: taskTitle || 'Improved Task',
        improvedDescription: taskDescription || 'This task has been enhanced with better clarity and actionable steps.',
        suggestedPriority: 'medium',
        estimatedTime: '30 minutes'
      };
    }
  }

  static async generateDailyPlan(userContext: UserContext): Promise<DailyPlan> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_project_url' || 
          supabaseKey === 'your_supabase_anon_key') {
        throw new Error('Supabase not configured');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/generate-daily-plan`;
      
      const headers = {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userContext })
      });

      if (!response.ok) {
        throw new Error(`Daily plan generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating daily plan:', error);
      // Return fallback daily plan
      return {
        morningFocus: 'Start your day by reviewing your top 3 priorities and tackling the most important task first.',
        afternoonGoals: 'Focus on collaborative work and meetings. Use this time for tasks that require communication.',
        eveningReflection: 'Review what you accomplished today and prepare for tomorrow by organizing your workspace.',
        keyPriorities: [
          'Complete high-priority tasks',
          'Review and respond to important communications',
          'Make progress on long-term projects'
        ]
      };
    }
  }
}

export class TTSService {
  static async textToSpeech(text: string, options?: any): Promise<string> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_project_url' || 
          supabaseKey === 'your_supabase_anon_key') {
        throw new Error('Supabase not configured for TTS');
      }

      const apiUrl = `${supabaseUrl}/functions/v1/text-to-speech`;
      
      const headers = {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, options })
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      // Fallback: Use browser's built-in speech synthesis
      return this.fallbackTTS(text);
    }
  }

  private static fallbackTTS(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 0.8;
          
          utterance.onstart = () => {
            // Create a dummy audio URL for consistency
            const dummyBlob = new Blob([''], { type: 'audio/wav' });
            resolve(URL.createObjectURL(dummyBlob));
          };
          
          utterance.onerror = (error) => {
            reject(new Error('Speech synthesis failed'));
          };
          
          speechSynthesis.speak(utterance);
        } else {
          reject(new Error('Speech synthesis not supported'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Export instances for backward compatibility
export const aiService = AIService;
export const ttsService = TTSService;