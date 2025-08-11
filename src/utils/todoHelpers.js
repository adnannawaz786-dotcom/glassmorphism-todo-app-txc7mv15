/* EXPORTS: filterTodos, sortTodos, searchTodos, validateTodo, generateId, formatDate, getTodoStats, getFilteredAndSortedTodos */

/**
 * Filter todos based on status
 * @param {Array} todos - Array of todo items
 * @param {string} filter - Filter type: 'all', 'active', 'completed'
 * @returns {Array} Filtered todos
 */
const filterTodos = (todos, filter) => {
  if (!todos || !Array.isArray(todos)) return [];
  
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'all':
    default:
      return todos;
  }
};

/**
 * Sort todos based on criteria
 * @param {Array} todos - Array of todo items
 * @param {string} sortBy - Sort criteria: 'date', 'priority', 'alphabetical', 'status'
 * @param {string} sortOrder - Sort order: 'asc', 'desc'
 * @returns {Array} Sorted todos
 */
const sortTodos = (todos, sortBy = 'date', sortOrder = 'desc') => {
  if (!todos || !Array.isArray(todos)) return [];
  
  const sortedTodos = [...todos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
        break;
      case 'alphabetical':
        comparison = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        break;
      case 'status':
        comparison = a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        break;
      default:
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sortedTodos;
};

/**
 * Search todos by title and description
 * @param {Array} todos - Array of todo items
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered todos matching search term
 */
const searchTodos = (todos, searchTerm) => {
  if (!todos || !Array.isArray(todos)) return [];
  if (!searchTerm || searchTerm.trim() === '') return todos;
  
  const term = searchTerm.toLowerCase().trim();
  
  return todos.filter(todo => {
    const titleMatch = todo.title.toLowerCase().includes(term);
    const descriptionMatch = todo.description && todo.description.toLowerCase().includes(term);
    const categoryMatch = todo.category && todo.category.toLowerCase().includes(term);
    
    return titleMatch || descriptionMatch || categoryMatch;
  });
};

/**
 * Validate todo object
 * @param {Object} todo - Todo object to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
const validateTodo = (todo) => {
  const errors = [];
  
  if (!todo) {
    errors.push('Todo object is required');
    return { isValid: false, errors };
  }
  
  if (!todo.title || typeof todo.title !== 'string' || todo.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (todo.title && todo.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  if (todo.description && todo.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }
  
  if (todo.priority && !['low', 'medium', 'high'].includes(todo.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }
  
  if (todo.dueDate && isNaN(new Date(todo.dueDate).getTime())) {
    errors.push('Due date must be a valid date');
  }
  
  if (typeof todo.completed !== 'undefined' && typeof todo.completed !== 'boolean') {
    errors.push('Completed must be a boolean value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate unique ID for todos
 * @returns {string} Unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'relative'
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  switch (format) {
    case 'relative':
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return minutes <= 0 ? 'Just now' : `${minutes} minutes ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
      } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)} days ago`;
      } else {
        return dateObj.toLocaleDateString();
      }
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
  }
};

/**
 * Get statistics about todos
 * @param {Array} todos - Array of todo items
 * @returns {Object} Statistics object
 */
const getTodoStats = (todos) => {
  if (!todos || !Array.isArray(todos)) {
    return {
      total: 0,
      completed: 0,
      active: 0,
      completionRate: 0,
      overdue: 0,
      byPriority: { high: 0, medium: 0, low: 0 },
      byCategory: {}
    };
  }
  
  const now = new Date();
  const stats = {
    total: todos.length,
    completed: 0,
    active: 0,
    completionRate: 0,
    overdue: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    byCategory: {}
  };
  
  todos.forEach(todo => {
    // Completion status
    if (todo.completed) {
      stats.completed++;
    } else {
      stats.active++;
    }
    
    // Overdue check
    if (!todo.completed && todo.dueDate && new Date(todo.dueDate) < now) {
      stats.overdue++;
    }
    
    // Priority distribution
    const priority = todo.priority || 'low';
    if (stats.byPriority[priority] !== undefined) {
      stats.byPriority[priority]++;
    }
    
    // Category distribution
    const category = todo.category || 'Uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  });
  
  // Calculate completion rate
  stats.completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  return stats;
};

/**
 * Get filtered and sorted todos (combines filter, search, and sort)
 * @param {Array} todos - Array of todo items
 * @param {Object} options - Options object with filter, search, sort properties
 * @returns {Array} Processed todos
 */
const getFilteredAndSortedTodos = (todos, options = {}) => {
  const {
    filter = 'all',
    searchTerm = '',
    sortBy = 'date',
    sortOrder = 'desc'
  } = options;
  
  let processedTodos = [...(todos || [])];
  
  // Apply search filter
  if (searchTerm) {
    processedTodos = searchTodos(processedTodos, searchTerm);
  }
  
  // Apply status filter
  processedTodos = filterTodos(processedTodos, filter);
  
  // Apply sorting
  processedTodos = sortTodos(processedTodos, sortBy, sortOrder);
  
  return processedTodos;
};

export { filterTodos, sortTodos, searchTodos, validateTodo, generateId, formatDate, getTodoStats, getFilteredAndSortedTodos };