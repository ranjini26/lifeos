import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, Lightbulb, TrendingUp, Calendar, MessageCircle } from 'lucide-react';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'suggestion',
      content: "Based on your recent activity, you might want to schedule that client meeting you've been putting off. I noticed it's been in your notes for 3 days.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: Calendar
    },
    {
      id: '2',
      type: 'insight',
      content: "Your productivity score increased by 15% this week! You've been most productive between 9-11 AM. Consider scheduling important tasks during this window.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: TrendingUp
    },
    {
      id: '3',
      type: 'idea',
      content: "I noticed you're working on similar projects. Would you like me to create a template to streamline your workflow?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      icon: Lightbulb
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      icon: MessageCircle
    };
    
    setMessages([newMessage, ...messages]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'response',
        content: "I understand you'd like help with that. Let me analyze your current tasks and suggest the best approach...",
        timestamp: new Date(),
        icon: Brain
      };
      setMessages(prev => [aiResponse, ...prev]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'suggestion':
        return 'from-orange-400/10 to-pink-400/10 border-orange-400/20';
      case 'insight':
        return 'from-blue-400/10 to-cyan-400/10 border-blue-400/20';
      case 'idea':
        return 'from-purple-400/10 to-pink-400/10 border-purple-400/20';
      case 'user':
        return 'from-green-400/10 to-emerald-400/10 border-green-400/20';
      default:
        return 'from-white/5 to-white/10 border-white/10';
    }
  };

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
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-pink-900/20 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                    <p className="text-xs text-white/60">Your productivity companion</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const Icon = message.icon;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl bg-gradient-to-r ${getMessageStyle(message.type)} border backdrop-blur-sm`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-xs text-white/60 mt-2">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-orange-400/50 focus:outline-none backdrop-blur-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISidebar;