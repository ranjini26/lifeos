import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Calendar,
  Star,
  Smile,
  Meh,
  Frown,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';
import TTSButton from './TTSButton';

interface ReflectionEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'difficult';
  gratitude: string[];
  wins: string[];
  challenges: string[];
  tomorrow: string[];
  energy: number; // 1-10
  notes: string;
}

const Reflection: React.FC = () => {
  const [entries, setEntries] = useState<ReflectionEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      mood: 'great',
      gratitude: ['Productive team meeting', 'Beautiful weather', 'Completed major milestone'],
      wins: ['Shipped new feature', 'Got positive user feedback', 'Maintained exercise routine'],
      challenges: ['Time management', 'Email overload'],
      tomorrow: ['Start new project phase', 'Schedule one-on-ones', 'Plan weekend activities'],
      energy: 8,
      notes: 'Great day overall. Feeling motivated and energized. The team collaboration was exceptional today.'
    }
  ]);

  const [currentEntry, setCurrentEntry] = useState<Partial<ReflectionEntry>>({
    mood: 'good',
    gratitude: [''],
    wins: [''],
    challenges: [''],
    tomorrow: [''],
    energy: 7,
    notes: ''
  });

  const moodOptions = [
    { value: 'great', icon: Smile, color: 'from-green-400 to-emerald-500', label: 'Great' },
    { value: 'good', icon: Smile, color: 'from-blue-400 to-cyan-500', label: 'Good' },
    { value: 'okay', icon: Meh, color: 'from-yellow-400 to-orange-500', label: 'Okay' },
    { value: 'difficult', icon: Frown, color: 'from-red-400 to-pink-500', label: 'Difficult' }
  ];

  const prompts = [
    {
      title: "What are you grateful for today?",
      icon: Heart,
      key: 'gratitude',
      color: 'from-pink-400 to-rose-500'
    },
    {
      title: "What were your wins today?",
      icon: Star,
      key: 'wins',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: "What challenges did you face?",
      icon: Target,
      key: 'challenges',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: "What will you focus on tomorrow?",
      icon: Lightbulb,
      key: 'tomorrow',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const updateArrayField = (field: string, index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const saveEntry = () => {
    const newEntry: ReflectionEntry = {
      ...currentEntry,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    } as ReflectionEntry;

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setCurrentEntry({
      mood: 'good',
      gratitude: [''],
      wins: [''],
      challenges: [''],
      tomorrow: [''],
      energy: 7,
      notes: ''
    });
  };

  const getWeeklyStats = () => {
    const lastWeek = entries.slice(0, 7);
    const avgEnergy = lastWeek.reduce((acc, entry) => acc + entry.energy, 0) / lastWeek.length || 0;
    const moodCounts = lastWeek.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { avgEnergy, moodCounts, entriesCount: lastWeek.length };
  };

  const formatEntryForTTS = (entry: ReflectionEntry) => {
    const sections = [
      `Reflection for ${new Date(entry.date).toLocaleDateString()}`,
      `Mood: ${entry.mood}`,
      `Energy level: ${entry.energy} out of 10`,
      entry.gratitude.length > 0 ? `Grateful for: ${entry.gratitude.join(', ')}` : '',
      entry.wins.length > 0 ? `Wins: ${entry.wins.join(', ')}` : '',
      entry.challenges.length > 0 ? `Challenges: ${entry.challenges.join(', ')}` : '',
      entry.tomorrow.length > 0 ? `Tomorrow's focus: ${entry.tomorrow.join(', ')}` : '',
      entry.notes ? `Additional notes: ${entry.notes}` : ''
    ].filter(Boolean);
    
    return sections.join('. ');
  };

  const stats = getWeeklyStats();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Daily Reflection</h2>
        <p className="text-slate-700">Take a moment to reflect on your day and plan ahead</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Weekly Stats */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              This Week
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-700 text-sm">Average Energy</span>
                  <span className="text-slate-900 font-medium">{stats.avgEnergy.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.avgEnergy / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <span className="text-slate-700 text-sm block mb-2">Mood Distribution</span>
                <div className="space-y-2">
                  {moodOptions.map((mood) => {
                    const count = stats.moodCounts[mood.value] || 0;
                    const percentage = stats.entriesCount > 0 ? (count / stats.entriesCount) * 100 : 0;
                    const Icon = mood.icon;
                    
                    return (
                      <div key={mood.value} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-slate-700" />
                        <span className="text-xs text-slate-700 w-16">{mood.label}</span>
                        <div className="flex-1 bg-slate-300 rounded-full h-1">
                          <div 
                            className={`bg-gradient-to-r ${mood.color} h-1 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-700 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              Recent Entries
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {entries.slice(0, 5).map((entry) => {
                const moodConfig = moodOptions.find(m => m.value === entry.mood);
                const MoodIcon = moodConfig?.icon || Smile;
                
                return (
                  <div key={entry.id} className="group p-3 rounded-xl glassmorphism-light border border-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-900 font-medium text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <TTSButton 
                          text={formatEntryForTTS(entry)}
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="flex items-center space-x-2">
                          <MoodIcon className="w-4 h-4 text-slate-700" />
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-slate-700">{entry.energy}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-700 text-xs line-clamp-2">
                      {entry.notes || 'No notes for this day'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reflection Form */}
        <div className="lg:col-span-2">
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-orange-500" />
              Today's Reflection
            </h3>

            <div className="space-y-6">
              {/* Mood Selection */}
              <div>
                <label className="block text-slate-900 font-medium mb-3">How are you feeling today?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {moodOptions.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        onClick={() => setCurrentEntry(prev => ({ ...prev, mood: mood.value as any }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          currentEntry.mood === mood.value
                            ? `bg-gradient-to-r ${mood.color}/20 border-white/50`
                            : 'border-white/30 hover:border-white/50'
                        }`}
                      >
                        <Icon className="w-6 h-6 text-slate-800 mx-auto mb-2" />
                        <span className="text-slate-800 text-sm">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-slate-900 font-medium mb-3">
                  Energy Level: {currentEntry.energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.energy}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Reflection Prompts */}
              {prompts.map((prompt) => {
                const Icon = prompt.icon;
                const values = (currentEntry[prompt.key as keyof typeof currentEntry] as string[]) || [''];
                
                return (
                  <div key={prompt.key}>
                    <label className="block text-slate-900 font-medium mb-3 flex items-center">
                      <Icon className="w-5 h-5 mr-2" />
                      {prompt.title}
                    </label>
                    <div className="space-y-2">
                      {values.map((value, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateArrayField(prompt.key, index, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
                            placeholder={`Add ${prompt.title.toLowerCase().replace('?', '')}...`}
                          />
                          {values.length > 1 && (
                            <button
                              onClick={() => removeArrayItem(prompt.key, index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem(prompt.key)}
                        className={`text-sm px-3 py-1 rounded-lg bg-gradient-to-r ${prompt.color}/10 text-slate-700 hover:text-slate-900 transition-colors`}
                      >
                        + Add another
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Notes */}
              <div>
                <label className="block text-slate-900 font-medium mb-3">Additional thoughts</label>
                <textarea
                  value={currentEntry.notes}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none resize-none"
                  placeholder="Any other thoughts about your day..."
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveEntry}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-200"
              >
                Save Today's Reflection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reflection;