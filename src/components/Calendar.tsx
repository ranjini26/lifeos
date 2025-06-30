import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Video, Coffee } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const events = [
    {
      id: 1,
      title: 'Team Standup',
      time: '9:00 AM',
      endTime: '9:30 AM',
      date: new Date().toDateString(),
      color: 'from-blue-400 to-cyan-400',
      type: 'meeting',
      icon: Users
    },
    {
      id: 2,
      title: 'Client Meeting',
      time: '2:00 PM',
      endTime: '3:00 PM',
      date: new Date().toDateString(),
      color: 'from-purple-400 to-pink-400',
      location: 'Conference Room A',
      type: 'meeting',
      icon: Video
    },
    {
      id: 3,
      title: 'Project Review',
      time: '4:30 PM',
      endTime: '5:30 PM',
      date: new Date().toDateString(),
      color: 'from-orange-400 to-red-400',
      type: 'review',
      icon: Users
    },
    {
      id: 4,
      title: 'Coffee with Sarah',
      time: '11:00 AM',
      endTime: '12:00 PM',
      date: new Date(Date.now() + 86400000).toDateString(),
      color: 'from-green-400 to-emerald-400',
      location: 'Local Café',
      type: 'personal',
      icon: Coffee
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasEvents = (date: Date | null) => {
    if (!date) return false;
    return events.some(event => event.date === date.toDateString());
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => event.date === date.toDateString());
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todaysEvents = getEventsForDate(selectedDate);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Calendar</h2>
        <p className="text-slate-700">Schedule and manage your events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="glassmorphism rounded-2xl p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-800" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-800" />
                </button>
              </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={`
                    p-2 text-center text-sm rounded-lg transition-all duration-200 relative min-h-[40px] flex flex-col items-center justify-center
                    ${day ? 'hover:bg-white/60' : ''}
                    ${isToday(day) ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-slate-900 font-bold border border-orange-200' : ''}
                    ${isSelected(day) && !isToday(day) ? 'ring-2 ring-blue-400/50 bg-blue-50' : ''}
                    ${day && !isToday(day) && !isSelected(day) ? 'text-slate-800' : ''}
                    ${!day ? 'text-transparent' : ''}
                  `}
                  whileHover={day ? { scale: 1.05 } : {}}
                  whileTap={day ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  {day?.getDate()}
                  {day && hasEvents(day) && (
                    <div className="flex space-x-1 mt-1">
                      {getEventsForDate(day).slice(0, 3).map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${event.color}`}
                        ></div>
                      ))}
                      {getEventsForDate(day).length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h3>
              <button className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <Plus className="w-4 h-4 text-slate-800" />
              </button>
            </div>
            
            <div className="space-y-3">
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl glassmorphism-light border border-white/50 hover:bg-white/90 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${event.color} mt-1.5`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon className="w-4 h-4 text-slate-700" />
                            <h4 className="text-slate-900 font-medium text-sm">{event.title}</h4>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-slate-700">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{event.time} - {event.endTime}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                              event.type === 'personal' ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-sm">No events scheduled</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Add an event
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Add Event */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Add</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Event title"
                className="w-full px-4 py-2 rounded-lg glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  className="px-4 py-2 rounded-lg glassmorphism-light border border-white/50 text-slate-900 focus:border-blue-400/50 focus:outline-none"
                />
                <input
                  type="time"
                  className="px-4 py-2 rounded-lg glassmorphism-light border border-white/50 text-slate-900 focus:border-blue-400/50 focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Location (optional)"
                className="w-full px-4 py-2 rounded-lg glassmorphism-light border border-white/50 text-slate-900 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
              />
              <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-200">
                Add Event
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming</h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-xl glassmorphism-light border border-white/50"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${event.color}`}></div>
                    <Icon className="w-4 h-4 text-slate-700" />
                    <div className="flex-1">
                      <div className="text-slate-900 font-medium text-sm">{event.title}</div>
                      <div className="text-slate-600 text-xs">{event.time}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;