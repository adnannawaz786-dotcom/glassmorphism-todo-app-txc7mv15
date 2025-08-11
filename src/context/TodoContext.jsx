/* EXPORTS: TodoProvider, useTodos */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

// Action types
const TODO_ACTIONS = {
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  REORDER_TODOS: 'REORDER_TODOS',
  SET_FILTER: 'SET_FILTER',
  SET_SEARCH: 'SET_SEARCH',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Filter types
const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// Initial state
const initialState = {
  todos: [],
  filter: FILTERS.ALL,
  searchTerm: '',
  loading: false,
  error: null
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case TODO_ACTIONS.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
        loading: false,
        error: null
      };

    case TODO_ACTIONS.ADD_TODO:
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority || 'medium',
        category: action.payload.category || 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
        error: null
      };

    case TODO_ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? {
                ...todo,
                ...action.payload.updates,
                updatedAt: new Date().toISOString()
              }
            : todo
        ),
        error: null
      };

    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        error: null
      };

    case TODO_ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? {
                ...todo,
                completed: !todo.completed,
                updatedAt: new Date().toISOString()
              }
            : todo
        ),
        error: null
      };

    case TODO_ACTIONS.REORDER_TODOS:
      return {
        ...state,
        todos: action.payload,
        error: null
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    case TODO_ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchTerm: action.payload
      };

    case TODO_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case TODO_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Local storage key
const STORAGE_KEY = 'glassmorphism-todos';

const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        dispatch({ type: TODO_ACTIONS.SET_TODOS, payload: parsedTodos });
      } else {
        dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({ 
        type: TODO_ACTIONS.SET_ERROR, 
        payload: 'Failed to load todos from storage' 
      });
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    } catch (error) {
      dispatch({ 
        type: TODO_ACTIONS.SET_ERROR, 
        payload: 'Failed to save todos to storage' 
      });
    }
  }, [state.todos]);

  // Action creators
  const addTodo = (todoData) => {
    if (!todoData.text || todoData.text.trim() === '') {
      dispatch({ 
        type: TODO_ACTIONS.SET_ERROR, 
        payload: 'Todo text cannot be empty' 
      });
      return;
    }
    dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: todoData });
  };

  const updateTodo = (id, updates) => {
    dispatch({ 
      type: TODO_ACTIONS.UPDATE_TODO, 
      payload: { id, updates } 
    });
  };

  const deleteTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.DELETE_TODO, payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.TOGGLE_TODO, payload: id });
  };

  const reorderTodos = (newTodos) => {
    dispatch({ type: TODO_ACTIONS.REORDER_TODOS, payload: newTodos });
  };

  const setFilter = (filter) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: filter });
  };

  const setSearchTerm = (searchTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_SEARCH, payload: searchTerm });
  };

  const clearError = () => {
    dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: null });
  };

  // Computed values
  const getFilteredTodos = () => {
    let filtered = state.todos;

    // Apply search filter
    if (state.searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        todo.category.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (state.filter) {
      case FILTERS.ACTIVE:
        return filtered.filter(todo => !todo.completed);
      case FILTERS.COMPLETED:
        return filtered.filter(todo => todo.completed);
      default:
        return filtered;
    }
  };

  const getTodoStats = () => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const value = {
    // State
    todos: state.todos,
    filter: state.filter,
    searchTerm: state.searchTerm,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    setFilter,
    setSearchTerm,
    clearError,
    
    // Computed values
    filteredTodos: getFilteredTodos(),
    stats: getTodoStats(),
    
    // Constants
    FILTERS,
    PRIORITIES: ['low', 'medium', 'high'],
    CATEGORIES: ['general', 'work', 'personal', 'shopping', 'health']
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export { TodoProvider, useTodos };