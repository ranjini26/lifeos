import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, Tag, Star, MoreVertical } from 'lucide-react';
import TTSButton from './TTSButton';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesProps {
  notes?: Note[];
  setNotes?: React.Dispatch<React.SetStateAction<Note[]>>;
}

const Notes: React.FC<NotesProps> = ({ notes: propNotes = [], setNotes: propSetNotes }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Ideas',
      content: 'Brainstorming session results:\n\n1. AI-powered task management\n2. Voice-controlled productivity app\n3. Collaborative workspace platform\n\nNext steps: Research market validation for each idea.',
      tags: ['brainstorming', 'projects', 'ai'],
      starred: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '2',
      title: 'Meeting Notes - Q1 Planning',
      content: 'Key decisions made:\n\n- Focus on user experience improvements\n- Allocate 40% of resources to new features\n- Launch beta in March\n\nAction items:\n[] Create detailed roadmap\n[] Set up beta user group\n[] Design new onboarding flow',
      tags: ['meetings', 'planning', 'q1'],
      starred: false,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: '3',
      title: 'Learning Resources',
      content: 'Courses to take:\n\n1. Advanced React Patterns\n2. System Design Fundamentals\n3. Machine Learning Basics\n\nBooks to read:\n- "Designing Data-Intensive Applications"\n- "Clean Architecture"\n- "The Pragmatic Programmer"',
      tags: ['learning', 'development', 'books'],
      starred: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-11')
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync with global notes from props
  useEffect(() => {
    if (propNotes && propNotes.length > 0) {
      console.log('📝 Notes - Syncing with global notes:', propNotes);
      
      // Add new notes from props
      const newNotes = propNotes.filter(note => 
        !notes.some(existingNote => existingNote.id === note.id)
      );
      
      if (newNotes.length > 0) {
        console.log('✅ Notes - Adding new notes:', newNotes);
        setNotes(prevNotes => [...newNotes, ...prevNotes]);
        // Auto-select the first new note
        if (newNotes[0]) {
          setSelectedNote(newNotes[0]);
        }
      }
    }
  }, [propNotes]);

  // Listen for new notes from voice commands via events
  useEffect(() => {
    const handleNewNote = (event: CustomEvent) => {
      const { content, title } = event.detail;
      
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title || `Voice Note ${new Date().toLocaleDateString()}`,
        content,
        tags: [],
        starred: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('📝 Notes - Adding new note via event:', newNote);

      setNotes(prevNotes => [newNote, ...prevNotes]);
      setSelectedNote(newNote);
      
      // Update global notes if setter is provided
      if (propSetNotes) {
        propSetNotes(prevNotes => [newNote, ...prevNotes]);
      }
      
      // Show success notification
      showNoteAddedNotification(newNote.title);
    };

    // Listen for custom events from voice commands
    window.addEventListener('addNote', handleNewNote as EventListener);

    return () => {
      window.removeEventListener('addNote', handleNewNote as EventListener);
    };
  }, [propSetNotes]);

  const showNoteAddedNotification = (noteTitle: string) => {
    // Create and show a notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 font-medium max-w-sm transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div>
          <div class="font-semibold">Note Created!</div>
          <div class="text-sm opacity-90">${noteTitle}</div>
        </div>
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

  const addNote = (content: string, title?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || `Voice Note ${new Date().toLocaleDateString()}`,
      content,
      tags: [],
      starred: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📝 Notes - Adding note via function:', newNote);

    setNotes(prevNotes => [newNote, ...prevNotes]);
    setSelectedNote(newNote);
    
    // Update global notes if setter is provided
    if (propSetNotes) {
      propSetNotes(prevNotes => [newNote, ...prevNotes]);
    }
    
    showNoteAddedNotification(newNote.title);
    return newNote;
  };

  // Expose addNote function globally for voice commands
  useEffect(() => {
    (window as any).addNoteToBoard = addNote;
    console.log('🌐 Notes - Global addNoteToBoard function registered');
    return () => {
      delete (window as any).addNoteToBoard;
      console.log('🌐 Notes - Global addNoteToBoard function unregistered');
    };
  }, [propSetNotes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleStar = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Notes</h2>
        <p className="text-slate-700">Capture and organize your thoughts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <div className="glassmorphism rounded-2xl p-4 h-full flex flex-col">
            {/* Search and Add */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
                />
              </div>
              <button 
                onClick={() => {
                  const content = prompt('Enter note content:');
                  if (content) {
                    addNote(content);
                  }
                }}
                className="p-2 hover:bg-white/60 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-800" />
              </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedNote?.id === note.id
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200'
                      : 'glassmorphism-light border border-white/50 hover:bg-white/90'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-slate-900 font-medium text-sm leading-tight flex-1 mr-2">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <TTSButton 
                        text={`${note.title}. ${note.content}`}
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(note.id);
                        }}
                        className="p-1 hover:bg-white/60 rounded-md transition-colors"
                      >
                        <Star className={`w-3 h-3 ${note.starred ? 'text-yellow-500 fill-current' : 'text-slate-500'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 text-xs mb-3 line-clamp-2">
                    {note.content.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full border border-blue-200">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs text-slate-500">+{note.tags.length - 2}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          <div className="glassmorphism rounded-2xl p-6 h-full flex flex-col">
            {selectedNote ? (
              <>
                {/* Note Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <input
                      type="text"
                      value={selectedNote.title}
                      className="text-xl font-bold text-slate-900 bg-transparent border-none focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <TTSButton 
                      text={`${selectedNote.title}. ${selectedNote.content}`}
                      size="md"
                      variant="default"
                    />
                    <button
                      onClick={() => toggleStar(selectedNote.id)}
                      className="p-2 hover:bg-white/60 rounded-lg transition-colors"
                    >
                      <Star className={`w-5 h-5 ${selectedNote.starred ? 'text-yellow-500 fill-current' : 'text-slate-500'}`} />
                    </button>
                    <button className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-slate-700" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-700" />
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map((tag) => (
                      <span key={tag} className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Note Content */}
                <div className="flex-1">
                  <textarea
                    value={selectedNote.content}
                    className="w-full h-full p-4 rounded-lg glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none resize-none"
                    placeholder="Start writing..."
                    readOnly
                  />
                </div>

                {/* Note Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/30">
                  <div className="text-sm text-slate-600">
                    Created {formatDate(selectedNote.createdAt)}
                  </div>
                  <div className="text-sm text-slate-600">
                    Updated {formatDate(selectedNote.updatedAt)}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No note selected</h3>
                  <p className="text-slate-700">Choose a note from the list to view and edit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;