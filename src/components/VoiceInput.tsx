import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Square, Brain, Loader2, CheckCircle, AlertCircle, Ear, Search, Calendar, FileText, Target, BarChart3 } from 'lucide-react';
import { TaskService, NotesService, HabitsService, ReflectionService, CalendarService } from '../services/supabase';

interface VoiceInputProps {
  isOpen: boolean;
  onToggle: () => void;
  onTranscriptComplete?: (transcript: string, type: 'note' | 'task') => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
  addEventListener(type: 'start', listener: () => void): void;
  addEventListener(type: 'end', listener: () => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    addTaskGlobally?: (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => any;
    addNoteGlobally?: (content: string, title?: string) => any;
  }
}

const VoiceInput: React.FC<VoiceInputProps> = ({ isOpen, onToggle, onTranscriptComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isWakeWordListening, setIsWakeWordListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fridayState, setFridayState] = useState<'idle' | 'wake_listening' | 'greeting' | 'listening' | 'processing' | 'responding' | 'confirming' | 'searching'>('idle');
  const [fridayMessage, setFridayMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFloatingStatus, setShowFloatingStatus] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wakeWordRecognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const silenceTimeoutRef = useRef<NodeJS.Timeout>();
  const statusTimeoutRef = useRef<NodeJS.Timeout>();
  const finalTranscriptRef = useRef<string>('');
  const isProcessingRef = useRef<boolean>(false);
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout>();

  // Wake words that will trigger FRIDAY
  const wakeWords = [
    'hey friday',
    'friday',
    'hey friday',
    'ok friday',
    'hello friday',
    'hi friday'
  ];

  // Enhanced response templates with data execution capabilities
  const responseTemplates = {
    wakeWordDetected: [
      "Yes? How can I assist you today?",
      "I'm here! What would you like me to help you with?",
      "Hello! Ready to help optimize your productivity. What's on your mind?",
      "At your service! What can I do for you?",
      "I'm listening! How may I assist you today?"
    ],
    greeting: [
      "Good day! I'm FRIDAY, your personal productivity assistant. I can create tasks, take notes, search your data, and provide insights. How may I assist you today?",
      "Hello! FRIDAY at your service. I can help you manage tasks, find information, analyze your productivity, and much more. What would you like me to do?",
      "Greetings! I'm ready to help optimize your productivity. I can access all your data, create new items, and provide intelligent insights. What's on your agenda?",
      "Welcome back! FRIDAY here, standing by to assist with your tasks, notes, habits, and any data you need. How can I help?"
    ],
    taskCreated: [
      "Task successfully added to your board. I've prioritized it based on the urgency indicators in your request.",
      "Excellent! I've created that task and placed it in your workflow. Anything else you'd like me to handle?",
      "Task logged and ready for action. I've analyzed the content and set an appropriate priority level.",
      "Perfect! Your task has been added to the system. I'm monitoring your productivity patterns to optimize scheduling."
    ],
    noteCreated: [
      "Note captured and stored securely. I've indexed it for easy retrieval when you need it.",
      "Information logged successfully. I've categorized this note based on its content for better organization.",
      "Note saved to your knowledge base. The data is now searchable and cross-referenced with your other notes.",
      "Excellent! I've preserved that information and made it accessible across your productivity suite."
    ],
    dataFound: [
      "I found relevant information in your data. Here's what I discovered:",
      "Based on your request, I've located the following items in your system:",
      "I've searched through your productivity data and found these matches:",
      "Here are the results from your personal knowledge base:"
    ],
    noDataFound: [
      "I couldn't find any matching information in your current data. Would you like me to create something new instead?",
      "No results found for that query. Perhaps you'd like me to help you create new content related to this topic?",
      "I've searched through all your data but didn't find matches. Shall I help you add new information about this?",
      "Nothing found in your current system. Would you like me to start tracking this topic for you?"
    ],
    dataAnalysis: [
      "I've analyzed your productivity data and here's what I found:",
      "Based on your patterns and data, here are the insights:",
      "After reviewing your information, I can provide these observations:",
      "I've processed your data and discovered these trends:"
    ],
    processing: [
      "Analyzing your request and searching through your data...",
      "Processing your command and accessing your productivity information...",
      "Evaluating your request and cross-referencing with your stored data...",
      "Searching your knowledge base and preparing the optimal response..."
    ],
    listening: [
      "I'm listening attentively. You can ask me to find information, create tasks, take notes, or analyze your data.",
      "Ready to receive your instructions. I can search, create, update, or analyze anything in your system.",
      "Standing by for your command. I have access to all your tasks, notes, habits, and calendar data.",
      "Listening mode activated. Ask me to find, create, or analyze anything in your productivity system."
    ],
    error: [
      "I apologize, but I encountered a processing error. Could you please rephrase your request?",
      "My systems experienced a brief interruption. Please try your command again.",
      "I'm having difficulty processing that request. Could you provide more specific details?",
      "There seems to be a communication issue. Please repeat your instruction."
    ],
    help: [
      "I'm your comprehensive productivity assistant. I can: 1) Create and manage tasks with smart prioritization, 2) Take and organize notes with automatic categorization, 3) Search through all your data using natural language, 4) Analyze your productivity patterns and provide insights, 5) Manage your calendar and habits, 6) Answer questions about your stored information. Try saying things like 'find my notes about meetings', 'create a high priority task', 'what are my habits this week', or 'show me my productivity trends'.",
      "My capabilities include full data access and manipulation across your productivity suite. I can search for specific information, create new content, analyze patterns, and provide intelligent insights. I understand natural language queries like 'find tasks due tomorrow', 'show me notes with the tag project', or 'what's my habit completion rate'. I can also execute complex commands like 'create a task to follow up on the client meeting next week' or 'find all notes from last month about the marketing campaign'.",
      "I'm designed to be your intelligent productivity companion with complete system access. I can retrieve any information you've stored, create new items with smart categorization, analyze your productivity data for insights, and help you make data-driven decisions. My natural language processing allows you to speak conversationally - just tell me what you need, and I'll understand whether you want to find, create, update, or analyze your data."
    ]
  };

  const getRandomResponse = (category: keyof typeof responseTemplates): string => {
    const templates = responseTemplates[category];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Main recognition for commands
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        console.log('🎤 Speech recognition result event triggered');
        
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcript;
            console.log('✅ Final transcript piece:', transcript);
          } else {
            interimTranscript += transcript;
            console.log('⏳ Interim transcript:', transcript);
          }
        }

        if (finalTranscript) {
          console.log('📝 Adding final transcript:', finalTranscript);
          finalTranscriptRef.current += ' ' + finalTranscript;
          setTranscript(prev => prev + ' ' + finalTranscript);
          setInterimTranscript('');
          
          // Clear any existing silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Set a shorter timeout to process the command after user stops speaking
          silenceTimeoutRef.current = setTimeout(() => {
            const fullCommand = finalTranscriptRef.current.trim();
            console.log('⏰ Silence timeout triggered, processing command:', fullCommand);
            if (fullCommand && !isProcessingRef.current) {
              processVoiceCommand(fullCommand);
            }
          }, 1500);
        } else {
          setInterimTranscript(interimTranscript);
          
          // Reset silence timeout when user is still speaking
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
        }
      });

      recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
        console.error('❌ Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        setFridayState('idle');
        hideFloatingStatus();
        isProcessingRef.current = false;
      });

      recognition.addEventListener('end', () => {
        console.log('🔚 Speech recognition ended');
        setIsRecording(false);
        setInterimTranscript('');
        
        // If we have accumulated transcript and we're still in listening state, process it
        if (finalTranscriptRef.current.trim() && fridayState === 'listening' && !isProcessingRef.current) {
          console.log('🔄 Processing final transcript on end:', finalTranscriptRef.current);
          processVoiceCommand(finalTranscriptRef.current.trim());
        }
      });

      recognition.addEventListener('start', () => {
        console.log('🎙️ Speech recognition started');
        setIsRecording(true);
        isProcessingRef.current = false;
      });

      // Wake word recognition setup
      wakeWordRecognitionRef.current = new SpeechRecognition();
      const wakeWordRecognition = wakeWordRecognitionRef.current;
      wakeWordRecognition.continuous = true;
      wakeWordRecognition.interimResults = true;
      wakeWordRecognition.lang = 'en-US';

      wakeWordRecognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript.toLowerCase().trim();
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + ' ' + interimTranscript).toLowerCase().trim();
        console.log('👂 Wake word listening:', fullTranscript);

        // Check for wake words
        const detectedWakeWord = wakeWords.find(wakeWord => 
          fullTranscript.includes(wakeWord) || 
          fullTranscript.endsWith(wakeWord) ||
          fullTranscript.startsWith(wakeWord)
        );

        if (detectedWakeWord) {
          console.log('🎯 Wake word detected:', detectedWakeWord);
          onWakeWordDetected();
        }
      });

      wakeWordRecognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
        console.warn('⚠️ Wake word recognition error:', event.error);
        // Don't show error for wake word recognition, just restart it
        if (wakeWordEnabled) {
          setTimeout(() => {
            startWakeWordListening();
          }, 2000);
        }
      });

      wakeWordRecognition.addEventListener('end', () => {
        console.log('🔚 Wake word recognition ended');
        setIsWakeWordListening(false);
        // Restart wake word listening if it's enabled
        if (wakeWordEnabled && fridayState === 'wake_listening') {
          setTimeout(() => {
            startWakeWordListening();
          }, 1000);
        }
      });

      wakeWordRecognition.addEventListener('start', () => {
        console.log('👂 Wake word recognition started');
        setIsWakeWordListening(true);
      });

    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (wakeWordRecognitionRef.current) {
        wakeWordRecognitionRef.current.abort();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
    };
  }, []);

  // Start wake word listening when component mounts
  useEffect(() => {
    if (isSupported && !wakeWordEnabled) {
      enableWakeWordListening();
    }
  }, [isSupported]);

  const enableWakeWordListening = () => {
    console.log('🔊 Enabling wake word listening...');
    setWakeWordEnabled(true);
    setFridayState('wake_listening');
    startWakeWordListening();
  };

  const disableWakeWordListening = () => {
    console.log('🔇 Disabling wake word listening...');
    setWakeWordEnabled(false);
    setFridayState('idle');
    if (wakeWordRecognitionRef.current) {
      wakeWordRecognitionRef.current.stop();
    }
    setIsWakeWordListening(false);
  };

  const startWakeWordListening = () => {
    if (!wakeWordRecognitionRef.current || !wakeWordEnabled) return;

    try {
      console.log('👂 Starting wake word listening...');
      wakeWordRecognitionRef.current.start();
    } catch (error) {
      console.warn('⚠️ Failed to start wake word listening:', error);
      // Retry after a delay
      setTimeout(() => {
        if (wakeWordEnabled) {
          startWakeWordListening();
        }
      }, 2000);
    }
  };

  const onWakeWordDetected = async () => {
    console.log('🎯 Wake word detected! Activating FRIDAY...');
    
    // Stop wake word listening temporarily
    if (wakeWordRecognitionRef.current) {
      wakeWordRecognitionRef.current.stop();
    }
    
    setFridayState('greeting');
    const wakeResponse = getRandomResponse('wakeWordDetected');
    setFridayMessage(wakeResponse);
    setShowFloatingStatus(true);
    
    await playFridayAudio(wakeResponse);
    
    // After greeting, start listening for commands
    setTimeout(() => {
      startListening();
    }, 500);
  };

  // Enhanced audio level animation
  useEffect(() => {
    if (isRecording || isWakeWordListening) {
      const animate = () => {
        const baseLevel = isRecording ? 20 + Math.random() * 30 : 5 + Math.random() * 10;
        const spike = Math.random() > 0.7 ? Math.random() * 50 : 0;
        setAudioLevel(Math.min(100, baseLevel + spike));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isWakeWordListening]);

  // Timer for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const showFloatingStatusWithTimeout = (message: string, duration: number = 3000) => {
    setFridayMessage(message);
    setShowFloatingStatus(true);
    
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    
    statusTimeoutRef.current = setTimeout(() => {
      hideFloatingStatus();
    }, duration);
  };

  const hideFloatingStatus = () => {
    console.log('🫥 Hiding floating status');
    setShowFloatingStatus(false);
    setFridayMessage('');
    setTranscript('');
    setInterimTranscript('');
    setSearchResults([]);
    setIsSearching(false);
    finalTranscriptRef.current = '';
    isProcessingRef.current = false;
    
    // Return to wake word listening if enabled
    if (wakeWordEnabled) {
      setFridayState('wake_listening');
      setTimeout(() => {
        startWakeWordListening();
      }, 1000);
    } else {
      setFridayState('idle');
    }
    
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  const playFridayAudio = async (text: string): Promise<void> => {
    return new Promise(async (resolve) => {
      try {
        setIsPlayingAudio(true);
        console.log('🔊 Playing FRIDAY audio:', text);
        
        // Try to use ElevenLabs TTS first
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          
          if (supabaseUrl && supabaseKey && 
              supabaseUrl !== 'your_supabase_project_url' && 
              supabaseKey !== 'your_supabase_anon_key') {
            
            const apiUrl = `${supabaseUrl}/functions/v1/text-to-speech`;
            
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                text, 
                options: {
                  voice_id: 'wDsJlOXPqcvIUKdLXjDs', // Your specified voice ID
                  voice_settings: {
                    stability: 0.6,
                    similarity_boost: 0.8,
                    style: 0.2,
                    use_speaker_boost: true
                  }
                }
              })
            });

            if (response.ok) {
              const audioBlob = await response.blob();
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              
              audio.onended = () => {
                console.log('🔇 ElevenLabs audio ended');
                setIsPlayingAudio(false);
                URL.revokeObjectURL(audioUrl);
                resolve();
              };

              audio.onerror = () => {
                console.log('❌ ElevenLabs audio error, falling back to browser TTS');
                URL.revokeObjectURL(audioUrl);
                fallbackToSpeechSynthesis(text, resolve);
              };

              await audio.play();
              return;
            }
          }
        } catch (error) {
          console.log('❌ ElevenLabs TTS failed, using fallback:', error);
        }
        
        // Fallback to browser speech synthesis
        fallbackToSpeechSynthesis(text, resolve);
        
      } catch (error) {
        console.error('❌ TTS error:', error);
        setIsPlayingAudio(false);
        resolve();
      }
    });
  };

  const fallbackToSpeechSynthesis = (text: string, resolve: () => void) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        console.log('🔇 Browser speech ended');
        setIsPlayingAudio(false);
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('❌ Speech synthesis error:', error);
        setIsPlayingAudio(false);
        resolve();
      };

      speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
      resolve();
    }
  };

  const initiateGreeting = async () => {
    console.log('👋 Initiating greeting...');
    setFridayState('greeting');
    const greetingText = getRandomResponse('greeting');
    setFridayMessage(greetingText);
    setShowFloatingStatus(true);
    
    await playFridayAudio(greetingText);
    
    // After greeting is complete, automatically start listening
    console.log('✅ Greeting complete, starting to listen...');
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const startListening = async () => {
    console.log('👂 Starting to listen...');
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition is not available');
      showFloatingStatusWithTimeout('Speech recognition is not available', 3000);
      return;
    }

    try {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      finalTranscriptRef.current = '';
      setRecordingTime(0);
      setFridayState('listening');
      const listeningMessage = getRandomResponse('listening');
      setFridayMessage(listeningMessage);
      setShowFloatingStatus(true);
      isProcessingRef.current = false;
      
      // Clear any existing timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      recognitionRef.current.start();
    } catch (err) {
      console.error('❌ Failed to start recording:', err);
      setError('Failed to start recording');
      setIsRecording(false);
      setFridayState('idle');
      showFloatingStatusWithTimeout('Failed to start recording', 3000);
    }
  };

  const stopListening = () => {
    console.log('🛑 Stopping listening...');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    setIsRecording(false);
  };

  // Enhanced data search and retrieval functions
  const searchUserData = async (query: string, dataType?: string): Promise<any[]> => {
    console.log('🔍 Searching user data for:', query, 'Type:', dataType);
    setIsSearching(true);
    
    const results: any[] = [];
    const lowerQuery = query.toLowerCase();
    
    try {
      // Get current user ID (demo user for now)
      const userId = 'demo-user';
      
      // Search tasks if not specified or if tasks are requested
      if (!dataType || dataType.includes('task')) {
        try {
          const tasks = await TaskService.getTasks(userId);
          const matchingTasks = tasks.filter((task: any) => 
            task.title.toLowerCase().includes(lowerQuery) ||
            task.description.toLowerCase().includes(lowerQuery) ||
            task.priority.toLowerCase().includes(lowerQuery) ||
            task.status.toLowerCase().includes(lowerQuery)
          );
          results.push(...matchingTasks.map((task: any) => ({ ...task, type: 'task' })));
        } catch (error) {
          console.warn('Could not search tasks:', error);
        }
      }
      
      // Search notes if not specified or if notes are requested
      if (!dataType || dataType.includes('note')) {
        try {
          const notes = await NotesService.getNotes(userId);
          const matchingNotes = notes.filter((note: any) => 
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
          );
          results.push(...matchingNotes.map((note: any) => ({ ...note, type: 'note' })));
        } catch (error) {
          console.warn('Could not search notes:', error);
        }
      }
      
      // Search habits if not specified or if habits are requested
      if (!dataType || dataType.includes('habit')) {
        try {
          const habits = await HabitsService.getHabits(userId);
          const matchingHabits = habits.filter((habit: any) => 
            habit.name.toLowerCase().includes(lowerQuery) ||
            habit.description.toLowerCase().includes(lowerQuery)
          );
          results.push(...matchingHabits.map((habit: any) => ({ ...habit, type: 'habit' })));
        } catch (error) {
          console.warn('Could not search habits:', error);
        }
      }
      
      // Search reflections if not specified or if reflections are requested
      if (!dataType || dataType.includes('reflection')) {
        try {
          const reflections = await ReflectionService.getReflections(userId);
          const matchingReflections = reflections.filter((reflection: any) => 
            reflection.notes.toLowerCase().includes(lowerQuery) ||
            reflection.gratitude.some((item: string) => item.toLowerCase().includes(lowerQuery)) ||
            reflection.wins.some((item: string) => item.toLowerCase().includes(lowerQuery)) ||
            reflection.challenges.some((item: string) => item.toLowerCase().includes(lowerQuery))
          );
          results.push(...matchingReflections.map((reflection: any) => ({ ...reflection, type: 'reflection' })));
        } catch (error) {
          console.warn('Could not search reflections:', error);
        }
      }
      
      // Search calendar events if not specified or if calendar is requested
      if (!dataType || dataType.includes('calendar') || dataType.includes('event')) {
        try {
          const events = await CalendarService.getEvents(userId);
          const matchingEvents = events.filter((event: any) => 
            event.title.toLowerCase().includes(lowerQuery) ||
            event.description.toLowerCase().includes(lowerQuery) ||
            (event.location && event.location.toLowerCase().includes(lowerQuery))
          );
          results.push(...matchingEvents.map((event: any) => ({ ...event, type: 'calendar' })));
        } catch (error) {
          console.warn('Could not search calendar events:', error);
        }
      }
      
    } catch (error) {
      console.error('Error searching user data:', error);
    } finally {
      setIsSearching(false);
    }
    
    console.log('🔍 Search results:', results);
    return results;
  };

  const analyzeProductivityData = async (): Promise<string> => {
    console.log('📊 Analyzing productivity data...');
    
    try {
      const userId = 'demo-user';
      
      // Get all data for analysis
      const [tasks, notes, habits, reflections] = await Promise.all([
        TaskService.getTasks(userId).catch(() => []),
        NotesService.getNotes(userId).catch(() => []),
        HabitsService.getHabits(userId).catch(() => []),
        ReflectionService.getReflections(userId).catch(() => [])
      ]);
      
      // Analyze task completion
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task.status === 'done').length;
      const highPriorityTasks = tasks.filter((task: any) => task.priority === 'high').length;
      const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Analyze notes activity
      const totalNotes = notes.length;
      const recentNotes = notes.filter((note: any) => {
        const noteDate = new Date(note.updated_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate > weekAgo;
      }).length;
      
      // Analyze habits
      const totalHabits = habits.length;
      
      // Analyze reflections
      const recentReflections = reflections.filter((reflection: any) => {
        const reflectionDate = new Date(reflection.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reflectionDate > weekAgo;
      }).length;
      
      // Generate insights
      const insights = [
        `You have ${totalTasks} total tasks with a ${taskCompletionRate}% completion rate.`,
        highPriorityTasks > 0 ? `You have ${highPriorityTasks} high-priority tasks that need attention.` : 'Great job! No high-priority tasks are pending.',
        `You've created ${recentNotes} notes in the past week, showing ${recentNotes > 5 ? 'high' : recentNotes > 2 ? 'moderate' : 'low'} documentation activity.`,
        `You're tracking ${totalHabits} habits for personal development.`,
        recentReflections > 0 ? `You've completed ${recentReflections} reflections this week, showing good self-awareness.` : 'Consider adding daily reflections to track your progress.',
        taskCompletionRate > 80 ? 'Excellent productivity! You\'re completing most of your tasks.' : 
        taskCompletionRate > 60 ? 'Good productivity, but there\'s room for improvement.' : 
        'Your task completion rate could use some attention. Consider prioritizing and breaking down large tasks.'
      ];
      
      return insights.join(' ');
      
    } catch (error) {
      console.error('Error analyzing productivity data:', error);
      return 'I encountered an issue while analyzing your productivity data. Please try again later.';
    }
  };

  const processVoiceCommand = async (command: string) => {
    if (isProcessingRef.current) {
      console.log('⚠️ Already processing a command, skipping...');
      return;
    }

    isProcessingRef.current = true;
    console.log('🧠 Processing voice command:', command);
    setFridayState('processing');
    const processingMessage = getRandomResponse('processing');
    setFridayMessage(processingMessage);
    stopListening();

    try {
      const lowerCommand = command.toLowerCase().trim();
      let response = '';
      let success = false;

      console.log('🔍 Analyzing command:', lowerCommand);

      // Help commands
      if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
        response = getRandomResponse('help');
        success = true;
        await respondToUser(response);
        return;
      }

      // Data search and retrieval commands
      if (lowerCommand.includes('find') || lowerCommand.includes('search') || lowerCommand.includes('show me') || lowerCommand.includes('get') || lowerCommand.includes('what are')) {
        console.log('🔍 Processing search command');
        setFridayState('searching');
        setFridayMessage('Searching through your data...');
        
        // Determine what to search for
        let searchQuery = '';
        let dataType = '';
        
        // Extract search terms
        if (lowerCommand.includes('find')) {
          searchQuery = lowerCommand.split('find')[1]?.trim() || '';
        } else if (lowerCommand.includes('search')) {
          searchQuery = lowerCommand.split('search')[1]?.trim() || '';
        } else if (lowerCommand.includes('show me')) {
          searchQuery = lowerCommand.split('show me')[1]?.trim() || '';
        } else if (lowerCommand.includes('get')) {
          searchQuery = lowerCommand.split('get')[1]?.trim() || '';
        } else if (lowerCommand.includes('what are')) {
          searchQuery = lowerCommand.split('what are')[1]?.trim() || '';
        }
        
        // Determine data type
        if (lowerCommand.includes('task')) dataType = 'task';
        else if (lowerCommand.includes('note')) dataType = 'note';
        else if (lowerCommand.includes('habit')) dataType = 'habit';
        else if (lowerCommand.includes('reflection')) dataType = 'reflection';
        else if (lowerCommand.includes('calendar') || lowerCommand.includes('event')) dataType = 'calendar';
        
        // Clean up search query
        searchQuery = searchQuery.replace(/^(my|all|the)\s+/, '').replace(/\s+(task|note|habit|reflection|calendar|event)s?.*$/, '').trim();
        
        if (!searchQuery && dataType) {
          searchQuery = dataType; // If no specific query, search for all items of that type
        }
        
        console.log('🔍 Search query:', searchQuery, 'Data type:', dataType);
        
        const results = await searchUserData(searchQuery, dataType);
        setSearchResults(results);
        
        if (results.length > 0) {
          response = `${getRandomResponse('dataFound')} I found ${results.length} item${results.length > 1 ? 's' : ''} matching your request.`;
          success = true;
        } else {
          response = getRandomResponse('noDataFound');
          success = true;
        }
        
        await respondToUser(response);
        return;
      }

      // Productivity analysis commands
      if (lowerCommand.includes('analyze') || lowerCommand.includes('insights') || lowerCommand.includes('productivity') || lowerCommand.includes('how am i doing') || lowerCommand.includes('my progress')) {
        console.log('📊 Processing analysis command');
        setFridayState('processing');
        setFridayMessage('Analyzing your productivity data...');
        
        const analysis = await analyzeProductivityData();
        response = `${getRandomResponse('dataAnalysis')} ${analysis}`;
        success = true;
        await respondToUser(response);
        return;
      }

      // Task creation commands (explicit)
      if (lowerCommand.includes('create task') || lowerCommand.includes('add task') || lowerCommand.includes('new task')) {
        const extractedContent = extractTaskFromCommand(command);
        console.log('📋 Extracted task title:', extractedContent);
        if (extractedContent) {
          success = await executeTaskCreation(extractedContent);
          if (success) {
            response = getRandomResponse('taskCreated');
          }
        }
      }
      // Note creation commands (explicit)
      else if (lowerCommand.includes('create note') || lowerCommand.includes('add note') || lowerCommand.includes('new note') || lowerCommand.includes('take note')) {
        const extractedContent = extractNoteFromCommand(command);
        console.log('📝 Extracted note content:', extractedContent);
        if (extractedContent) {
          success = await executeNoteCreation(extractedContent);
          if (success) {
            response = getRandomResponse('noteCreated');
          }
        }
      }
      // Auto-detection for implicit commands
      else {
        console.log('🤖 Auto-detecting intent for command:', command);
        
        // Enhanced task detection with more sophisticated patterns
        const taskIndicators = {
          urgency: ['urgent', 'asap', 'immediately', 'today', 'tomorrow', 'deadline', 'due'],
          actions: ['call', 'email', 'send', 'buy', 'purchase', 'schedule', 'book', 'reserve'],
          obligations: ['need to', 'have to', 'must', 'should', 'remind me', 'remember to'],
          work: ['meeting', 'project', 'report', 'presentation', 'review', 'finish', 'complete'],
          personal: ['dentist', 'doctor', 'appointment', 'groceries', 'shopping', 'bills']
        };
        
        let taskScore = 0;
        
        // Calculate task probability score
        Object.values(taskIndicators).forEach(indicators => {
          indicators.forEach(indicator => {
            if (lowerCommand.includes(indicator)) {
              taskScore++;
            }
          });
        });
        
        // Additional context clues
        if (lowerCommand.match(/\b(at|on|by)\s+\d/)) taskScore += 2; // Time references
        if (lowerCommand.includes('?')) taskScore -= 1; // Questions are less likely to be tasks
        if (lowerCommand.length < 20) taskScore += 1; // Short commands often tasks
        
        console.log('📊 Task probability score:', taskScore);
        
        if (taskScore >= 2) {
          success = await executeTaskCreation(command);
          if (success) {
            response = getRandomResponse('taskCreated');
          }
          console.log('✅ Auto-detected as task');
        } else {
          success = await executeNoteCreation(command);
          if (success) {
            response = getRandomResponse('noteCreated');
          }
          console.log('✅ Auto-detected as note');
        }
      }

      // Provide confirmation or error response
      if (success) {
        await confirmAction(response);
      } else {
        response = getRandomResponse('error');
        await respondToUser(response);
      }

    } catch (error) {
      console.error('❌ Error processing voice command:', error);
      const errorResponse = getRandomResponse('error');
      await respondToUser(errorResponse);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const executeTaskCreation = async (content: string): Promise<boolean> => {
    try {
      const priority = determinePriority(content);
      console.log('📋 Creating task with priority:', priority);
      
      // Method 1: Try global function first (from App.tsx)
      if (window.addTaskGlobally) {
        try {
          const newTask = window.addTaskGlobally(content, '', priority);
          console.log('✅ Task added via global function:', newTask);
          return true;
        } catch (error) {
          console.warn('⚠️ Global function failed:', error);
        }
      }
      
      // Method 2: Dispatch custom event as fallback
      try {
        const taskEvent = new CustomEvent('addTask', {
          detail: { 
            title: content, 
            description: '', 
            priority,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(taskEvent);
        console.log('✅ Task event dispatched:', taskEvent.detail);
        return true;
      } catch (error) {
        console.warn('⚠️ Event dispatch failed:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating task:', error);
      return false;
    }
  };

  const executeNoteCreation = async (content: string): Promise<boolean> => {
    try {
      console.log('📝 Creating note');
      
      // Method 1: Try global function first (from App.tsx)
      if (window.addNoteGlobally) {
        try {
          const newNote = window.addNoteGlobally(content);
          console.log('✅ Note added via global function:', newNote);
          return true;
        } catch (error) {
          console.warn('⚠️ Global function failed:', error);
        }
      }
      
      // Method 2: Dispatch custom event as fallback
      try {
        const noteEvent = new CustomEvent('addNote', {
          detail: { 
            content: content, 
            title: `Voice Note ${new Date().toLocaleDateString()}`,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(noteEvent);
        console.log('✅ Note event dispatched:', noteEvent.detail);
        return true;
      } catch (error) {
        console.warn('⚠️ Event dispatch failed:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating note:', error);
      return false;
    }
  };

  const determinePriority = (content: string): 'low' | 'medium' | 'high' => {
    const lowerContent = content.toLowerCase();
    
    // High priority indicators
    const highPriorityWords = ['urgent', 'asap', 'immediately', 'critical', 'important', 'deadline', 'today'];
    if (highPriorityWords.some(word => lowerContent.includes(word))) {
      return 'high';
    }
    
    // Low priority indicators
    const lowPriorityWords = ['maybe', 'sometime', 'eventually', 'when possible', 'if time'];
    if (lowPriorityWords.some(word => lowerContent.includes(word))) {
      return 'low';
    }
    
    // Default to medium
    return 'medium';
  };

  const extractTaskFromCommand = (command: string): string => {
    const patterns = [
      /create task (.+)/i,
      /add task (.+)/i,
      /new task (.+)/i,
      /task (.+)/i
    ];

    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return command.replace(/(create task|add task|new task|task)\s*/i, '').trim();
  };

  const extractNoteFromCommand = (command: string): string => {
    const patterns = [
      /create note (.+)/i,
      /add note (.+)/i,
      /new note (.+)/i,
      /take note (.+)/i,
      /note (.+)/i
    ];

    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return command.replace(/(create note|add note|new note|take note|note)\s*/i, '').trim();
  };

  const confirmAction = async (response: string) => {
    console.log('✅ Confirming action:', response);
    setFridayState('confirming');
    setFridayMessage(response);
    await playFridayAudio(response);
    
    // Hide status after confirmation
    setTimeout(() => {
      hideFloatingStatus();
    }, 4000);
  };

  const respondToUser = async (response: string) => {
    console.log('💬 Responding to user:', response);
    setFridayState('responding');
    setFridayMessage(response);
    await playFridayAudio(response);
    
    // Hide status after response
    setTimeout(() => {
      hideFloatingStatus();
    }, 4000);
  };

  // Handle mic button click - start the entire flow
  const handleMicClick = () => {
    console.log('🎤 Mic button clicked. Current state:', fridayState);
    if (fridayState === 'idle' || fridayState === 'wake_listening') {
      // Start the greeting and listening flow
      initiateGreeting();
    } else if (isRecording) {
      // Stop listening if currently recording
      stopListening();
    } else {
      // If in any other state, reset to idle
      hideFloatingStatus();
    }
  };

  const toggleWakeWordListening = () => {
    if (wakeWordEnabled) {
      disableWakeWordListening();
    } else {
      enableWakeWordListening();
    }
  };

  const getFridayStateIcon = () => {
    switch (fridayState) {
      case 'wake_listening':
        return <Ear className="w-8 h-8 text-blue-300" />;
      case 'greeting':
      case 'responding':
        return <Volume2 className="w-8 h-8 text-blue-400" />;
      case 'listening':
        return <Mic className="w-8 h-8 text-green-400" />;
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-8 h-8 text-purple-400" />
          </motion.div>
        );
      case 'searching':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Search className="w-8 h-8 text-cyan-400" />
          </motion.div>
        );
      case 'confirming':
        return <CheckCircle className="w-8 h-8 text-emerald-400" />;
      default:
        return <Mic className="w-8 h-8 text-slate-400" />;
    }
  };

  const getFridayStateColor = () => {
    switch (fridayState) {
      case 'wake_listening':
        return 'from-blue-300 to-cyan-400';
      case 'greeting':
      case 'responding':
        return 'from-blue-400 to-cyan-500';
      case 'listening':
        return 'from-green-400 to-emerald-500';
      case 'processing':
        return 'from-purple-400 to-pink-500';
      case 'searching':
        return 'from-cyan-400 to-blue-500';
      case 'confirming':
        return 'from-emerald-400 to-green-500';
      default:
        return 'from-pink-400 via-purple-400 to-blue-400';
    }
  };

  const getStateDescription = () => {
    switch (fridayState) {
      case 'wake_listening':
        return 'Listening for "Hey FRIDAY"';
      case 'greeting':
        return 'Greeting';
      case 'listening':
        return 'Listening';
      case 'processing':
        return 'Processing';
      case 'searching':
        return 'Searching Data';
      case 'responding':
        return 'Responding';
      case 'confirming':
        return 'Confirmed';
      default:
        return 'Ready';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'note':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'habit':
        return <Target className="w-4 h-4 text-purple-500" />;
      case 'reflection':
        return <Brain className="w-4 h-4 text-orange-500" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-red-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatResultContent = (result: any) => {
    switch (result.type) {
      case 'task':
        return `${result.title} - ${result.priority} priority, ${result.status}`;
      case 'note':
        return `${result.title}: ${result.content.substring(0, 100)}...`;
      case 'habit':
        return `${result.name} - ${result.description}`;
      case 'reflection':
        return `Reflection from ${new Date(result.date).toLocaleDateString()}: ${result.notes.substring(0, 100)}...`;
      case 'calendar':
        return `${result.title} - ${new Date(result.start_time).toLocaleDateString()}`;
      default:
        return JSON.stringify(result).substring(0, 100);
    }
  };

  const currentTranscript = transcript + interimTranscript;

  return (
    <>
      {/* Floating Voice Button */}
      <motion.button
        onClick={handleMicClick}
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center transition-all duration-300 ${
          fridayState !== 'idle' 
            ? `bg-gradient-to-r ${getFridayStateColor()} pulse-soft` 
            : 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 shadow-glow-pink'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={fridayState !== 'idle' ? { 
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.4)',
            '0 0 0 20px rgba(59, 130, 246, 0)',
          ]
        } : {}}
        transition={fridayState !== 'idle' ? { 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeOut"
        } : { duration: 0.2 }}
      >
        {getFridayStateIcon()}
      </motion.button>

      {/* Wake Word Toggle Button */}
      <motion.button
        onClick={toggleWakeWordListening}
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 translate-x-20 w-12 h-12 rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 ${
          wakeWordEnabled 
            ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' 
            : 'bg-white/80 text-slate-600 hover:bg-white/90'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={wakeWordEnabled ? 'Disable wake word detection' : 'Enable wake word detection'}
      >
        <Ear className="w-5 h-5" />
      </motion.button>

      {/* Wake Word Status Indicator */}
      <AnimatePresence>
        {wakeWordEnabled && fridayState === 'wake_listening' && !showFloatingStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30"
          >
            <div className="glassmorphism rounded-xl px-4 py-2 shadow-lg border border-white/50">
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
                <span>Say "Hey FRIDAY" to activate</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Status Card */}
      <AnimatePresence>
        {showFloatingStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 max-w-lg w-full mx-4"
          >
            <div className="glassmorphism rounded-2xl p-4 shadow-2xl border border-white/50 max-h-96 overflow-y-auto">
              {/* Error Message */}
              {error && (
                <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* FRIDAY Status */}
              <div className="text-center mb-4">
                <div className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                  fridayState === 'wake_listening' ? 'text-blue-600' :
                  fridayState === 'greeting' || fridayState === 'responding' ? 'text-blue-700' :
                  fridayState === 'listening' ? 'text-green-700' :
                  fridayState === 'processing' ? 'text-purple-700' :
                  fridayState === 'searching' ? 'text-cyan-700' :
                  fridayState === 'confirming' ? 'text-emerald-700' :
                  'text-slate-700'
                }`}>
                  FRIDAY - {getStateDescription()}
                  {(fridayState === 'listening' || fridayState === 'wake_listening') && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-2"
                    >
                      ●
                    </motion.span>
                  )}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {fridayMessage || (fridayState === 'wake_listening' ? 'Listening for wake word...' : 'Ready to assist you...')}
                </p>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search Results ({searchResults.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {searchResults.slice(0, 5).map((result, index) => (
                      <div key={index} className="p-3 rounded-lg bg-white/60 border border-white/40">
                        <div className="flex items-start space-x-2">
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                              {result.type}
                            </div>
                            <div className="text-sm text-slate-800 leading-tight">
                              {formatResultContent(result)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 5 && (
                      <div className="text-xs text-slate-600 text-center py-2">
                        And {searchResults.length - 5} more results...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recording Interface */}
              {isRecording && (
                <div className="mt-4 space-y-3">
                  {/* Audio Visualizer */}
                  <div className="flex items-center justify-center space-x-1 h-8">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-green-400 to-emerald-500 rounded-full"
                        animate={{
                          height: [
                            4 + (audioLevel / 100) * 8 + Math.sin(Date.now() / 200 + i) * 3,
                            4 + (audioLevel / 100) * 16 + Math.sin(Date.now() / 200 + i) * 5,
                            4 + (audioLevel / 100) * 8 + Math.sin(Date.now() / 200 + i) * 3
                          ]
                        }}
                        transition={{
                          duration: 0.3,
                          repeat: Infinity,
                          delay: i * 0.05,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-slate-800">
                      {formatTime(recordingTime)}
                    </div>
                  </div>

                  {/* Live Transcript */}
                  {currentTranscript && (
                    <div className="p-3 rounded-xl bg-green-50/50 border border-green-200/50">
                      <div className="text-xs text-green-600 mb-1 font-medium">You said:</div>
                      <div className="text-slate-800 text-sm leading-relaxed">
                        {transcript}
                        <span className="text-slate-600 italic">{interimTranscript}</span>
                        <motion.span 
                          className="text-green-500"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          |
                        </motion.span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wake Word Listening Indicator */}
              {fridayState === 'wake_listening' && isWakeWordListening && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-blue-400 rounded-full"
                  />
                  <span className="text-xs text-slate-600">Listening for "Hey FRIDAY"</span>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={hideFloatingStatus}
                className="absolute top-2 right-2 p-1 hover:bg-white/60 rounded-lg transition-colors"
              >
                <div className="w-4 h-4 text-slate-500">×</div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceInput;