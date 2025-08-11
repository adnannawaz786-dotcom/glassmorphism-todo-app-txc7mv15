/* EXPORTS: useTodos */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'glassmorphism-todos';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadTodos = () => {
      try {
        const storedTodos = localStorage.getItem(STORAGE_KEY);
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos);
          setTodos(parsedTodos);
        }
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [todos, isLoading]);

  // Generate unique ID for new todos
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add new todo
  const addTodo = (text, priority = 'medium') => {
    if (!text || text.trim() === '') return false;

    const newTodo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    return true;
  };

  // Delete todo by ID
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  };

  // Edit todo text
  const editTodo = (id, newText) => {
    if (!newText || newText.trim() === '') return false;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              text: newText.trim(),
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
    return true;
  };

  // Update todo priority
  const updateTodoPriority = (id, priority) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              priority,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  };

  // Reorder todos (for drag and drop)
  const reorderTodos = (startIndex, endIndex) => {
    const result = Array.from(todos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTodos(result);
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  // Clear all todos
  const clearAll = () => {
    setTodos([]);
  };

  // Mark all todos as completed/uncompleted
  const toggleAll = () => {
    const hasIncomplete = todos.some(todo => !todo.completed);
    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: hasIncomplete,
        updatedAt: new Date().toISOString()
      }))
    );
  };

  // Filter todos based on completion status
  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply completion filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get todo statistics
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate
    };
  };

  // Get todos by priority
  const getTodosByPriority = () => {
    const high = todos.filter(todo => todo.priority === 'high' && !todo.completed);
    const medium = todos.filter(todo => todo.priority === 'medium' && !todo.completed);
    const low = todos.filter(todo => todo.priority === 'low' && !todo.completed);

    return { high, medium, low };
  };

  return {
    // State
    todos,
    filter,
    searchQuery,
    isLoading,

    // Actions
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    updateTodoPriority,
    reorderTodos,
    clearCompleted,
    clearAll,
    toggleAll,

    // Filters and search
    setFilter,
    setSearchQuery,
    getFilteredTodos,

    // Utilities
    getStats,
    getTodosByPriority
  };
};

export { useTodos };