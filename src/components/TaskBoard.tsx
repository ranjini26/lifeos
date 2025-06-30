import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Calendar, User } from 'lucide-react';
import TTSButton from './TTSButton';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'todo' | 'inprogress' | 'review' | 'done';
  dueDate?: string;
  assignee?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface TaskBoardProps {
  tasks?: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks: propTasks = [], setTasks: propSetTasks }) => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: 'from-slate-100 to-slate-200',
      tasks: [
        {
          id: '1',
          title: 'Design homepage mockup',
          description: 'Create initial wireframes and visual design',
          priority: 'high',
          dueDate: '2024-01-15',
          assignee: 'You'
        },
        {
          id: '2',
          title: 'Write blog post',
          description: 'Article about productivity tips',
          priority: 'medium',
          dueDate: '2024-01-18'
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'from-blue-100 to-cyan-200',
      tasks: [
        {
          id: '3',
          title: 'Implement user authentication',
          description: 'Add login and registration functionality',
          priority: 'high',
          assignee: 'You'
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: 'from-yellow-100 to-orange-200',
      tasks: [
        {
          id: '4',
          title: 'Code review for API endpoints',
          description: 'Review pull request #42',
          priority: 'medium',
          dueDate: '2024-01-14'
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'from-green-100 to-emerald-200',
      tasks: [
        {
          id: '5',
          title: 'Setup development environment',
          description: 'Configure local development setup',
          priority: 'low'
        }
      ]
    }
  ]);

  // Sync with global tasks from props
  useEffect(() => {
    if (propTasks && propTasks.length > 0) {
      console.log('📋 TaskBoard - Syncing with global tasks:', propTasks);
      
      setColumns(prevColumns => 
        prevColumns.map(column => {
          if (column.id === 'todo') {
            // Add new tasks from props to the todo column
            const newTasks = propTasks.filter(task => 
              !column.tasks.some(existingTask => existingTask.id === task.id)
            );
            
            if (newTasks.length > 0) {
              console.log('✅ TaskBoard - Adding new tasks to todo column:', newTasks);
              return {
                ...column,
                tasks: [...newTasks, ...column.tasks]
              };
            }
          }
          return column;
        })
      );
    }
  }, [propTasks]);

  // Listen for new tasks from voice commands via events
  useEffect(() => {
    const handleNewTask = (event: CustomEvent) => {
      const { title, description = '', priority = 'medium' } = event.detail;
      
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        priority,
        assignee: 'You'
      };

      console.log('📋 TaskBoard - Adding new task via event:', newTask);

      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === 'todo' 
            ? { ...column, tasks: [newTask, ...column.tasks] }
            : column
        )
      );

      // Update global tasks if setter is provided
      if (propSetTasks) {
        propSetTasks(prevTasks => [newTask, ...prevTasks]);
      }

      // Show success notification
      showTaskAddedNotification(title);
    };

    // Listen for custom events from voice commands
    window.addEventListener('addTask', handleNewTask as EventListener);

    return () => {
      window.removeEventListener('addTask', handleNewTask as EventListener);
    };
  }, [propSetTasks]);

  const showTaskAddedNotification = (taskTitle: string) => {
    // Create and show a notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 font-medium max-w-sm transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div>
          <div class="font-semibold">Task Created!</div>
          <div class="text-sm opacity-90">${taskTitle}</div>
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

  const addTask = (title: string, description: string = '', priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      priority,
      assignee: 'You'
    };

    console.log('📋 TaskBoard - Adding task via function:', newTask);

    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === 'todo' 
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column
      )
    );

    // Update global tasks if setter is provided
    if (propSetTasks) {
      propSetTasks(prevTasks => [newTask, ...prevTasks]);
    }

    showTaskAddedNotification(title);
    return newTask;
  };

  // Expose addTask function globally for voice commands
  useEffect(() => {
    (window as any).addTaskToBoard = addTask;
    console.log('🌐 TaskBoard - Global addTaskToBoard function registered');
    return () => {
      delete (window as any).addTaskToBoard;
      console.log('🌐 TaskBoard - Global addTaskToBoard function unregistered');
    };
  }, [propSetTasks]);

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Task Board</h2>
        <p className="text-slate-700">Manage your tasks with a Kanban-style board</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism rounded-2xl p-4 h-fit"
            data-column={column.id}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`}></div>
                <h3 className="font-semibold text-slate-900">{column.title}</h3>
                <span className="text-xs text-slate-700 bg-white/80 px-2 py-1 rounded-full border border-white/60">
                  {column.tasks.length}
                </span>
              </div>
              <button 
                onClick={() => {
                  const title = prompt('Enter task title:');
                  if (title) {
                    addTask(title);
                  }
                }}
                className="p-1 hover:bg-white/60 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group p-4 rounded-xl glassmorphism-light border border-white/50 hover:bg-white/90 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-slate-900 font-medium text-sm leading-tight flex-1 mr-2">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TTSButton 
                        text={`Task: ${task.title}. ${task.description}`}
                        size="sm"
                      />
                      <button className="p-1 hover:bg-white/60 rounded-md transition-colors">
                        <MoreVertical className="w-3 h-3 text-slate-700" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 text-xs mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {task.assignee && (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{task.assignee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button 
              onClick={() => {
                const title = prompt('Enter task title:');
                if (title) {
                  addTask(title);
                }
              }}
              className="w-full mt-4 p-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-all duration-200 text-sm"
            >
              + Add a task
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;