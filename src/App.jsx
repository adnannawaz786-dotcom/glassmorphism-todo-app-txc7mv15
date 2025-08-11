/* EXPORTS: default (App component) */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Check, Edit2, Trash2, GripVertical } from 'lucide-react';

// Todo Context
const TodoContext = createContext();

const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
};

// Todo Provider Component
const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const reorderTodos = (startIndex, endIndex) => {
    const result = Array.from(todos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTodos(result);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const value = {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
    draggedItem,
    setDraggedItem
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

// Todo Input Component
const TodoInput = () => {
  const [inputValue, setInputValue] = useState('');
  const { addTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="relative mb-8"
    >
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-6 py-4 pr-16 text-white placeholder-white/60 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </motion.form>
  );
};

// Filter and Search Component
const FilterControls = () => {
  const { filter, setFilter, searchTerm, setSearchTerm } = useTodos();

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col sm:flex-row gap-4 mb-6"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-12 pr-4 py-3 text-white placeholder-white/60 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
        />
      </div>
      
      <div className="flex gap-2">
        {filters.map(({ key, label }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(key)}
            className={`px-4 py-3 rounded-xl backdrop-blur-md border transition-all duration-200 ${
              filter === key
                ? 'bg-white/30 border-white/40 text-white'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
            }`}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Todo Item Component
const TodoItem = ({ todo, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const { toggleTodo, deleteTodo, editTodo } = useTodos();

  const handleEdit = () => {
    if (editValue.trim() && editValue !== todo.text) {
      editTodo(todo.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditValue(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      draggable
      className="group p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-200 cursor-move"
    >
      <div className="flex items-center gap-4">
        <GripVertical className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleTodo(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-green-500/80 border-green-500/80'
              : 'border-white/40 hover:border-white/60'
          }`}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 text-white bg-white/20 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
              autoFocus
            />
          ) : (
            <span
              className={`text-white transition-all duration-200 ${
                todo.completed ? 'line-through opacity-60' : ''
              }`}
            >
              {todo.text}
            </span>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => deleteTodo(todo.id)}
            className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Todo List Component
const TodoList = () => {
  const { todos } = useTodos();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 text-white/60"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg">No tasks yet. Add one above!</p>
          </motion.div>
        ) : (
          todos.map((todo, index) => (
            <TodoItem key={todo.id} todo={todo} index={index} />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Stats Component
const TodoStats = () => {
  const { allTodos } = useTodos();
  
  const totalTasks = allTodos.length;
  const completedTasks = allTodos.filter(todo => todo.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="mt-8 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
    >
      <div className="flex justify-between items-center text-white/80 text-sm">
        <span>Total: {totalTasks}</span>
        <span>Active: {activeTasks}</span>
        <span>Completed: {completedTasks}</span>
      </div>
    </motion.div>
  );
};

// Main App Component
const App = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto pt-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Glassmorphism Todo
            </h1>
            <p className="text-white/70 text-lg">
              A beautiful, modern task manager
            </p>
          </motion.div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <TodoInput />
            <FilterControls />
            <TodoList />
            <TodoStats />
          </div>
        </motion.div>
      </div>
    </TodoProvider>
  );
};

export default App;