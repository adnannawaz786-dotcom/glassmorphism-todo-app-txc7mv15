/* EXPORTS: todoApi */

const API_BASE_URL = 'http://localhost:3001/api';

// Simulate API delay for better UX demonstration
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage key for todos
const TODOS_STORAGE_KEY = 'glassmorphism_todos';

// Generate unique ID for todos
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get todos from localStorage
const getTodosFromStorage = () => {
  try {
    const stored = localStorage.getItem(TODOS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading todos from storage:', error);
    return [];
  }
};

// Save todos to localStorage
const saveTodosToStorage = (todos) => {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to storage:', error);
    throw new Error('Failed to save todos');
  }
};

// API service object
const todoApi = {
  // Get all todos
  async getTodos() {
    await delay(300);
    try {
      const todos = getTodosFromStorage();
      return {
        success: true,
        data: todos,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch todos',
      };
    }
  },

  // Create a new todo
  async createTodo(todoData) {
    await delay(200);
    try {
      const todos = getTodosFromStorage();
      const newTodo = {
        id: generateId(),
        title: todoData.title.trim(),
        description: todoData.description?.trim() || '',
        completed: false,
        priority: todoData.priority || 'medium',
        category: todoData.category || 'general',
        dueDate: todoData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTodos = [...todos, newTodo];
      saveTodosToStorage(updatedTodos);

      return {
        success: true,
        data: newTodo,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create todo',
      };
    }
  },

  // Update an existing todo
  async updateTodo(id, updates) {
    await delay(200);
    try {
      const todos = getTodosFromStorage();
      const todoIndex = todos.findIndex(todo => todo.id === id);

      if (todoIndex === -1) {
        return {
          success: false,
          error: 'Todo not found',
        };
      }

      const updatedTodo = {
        ...todos[todoIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = updatedTodo;
      saveTodosToStorage(updatedTodos);

      return {
        success: true,
        data: updatedTodo,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update todo',
      };
    }
  },

  // Delete a todo
  async deleteTodo(id) {
    await delay(200);
    try {
      const todos = getTodosFromStorage();
      const filteredTodos = todos.filter(todo => todo.id !== id);

      if (filteredTodos.length === todos.length) {
        return {
          success: false,
          error: 'Todo not found',
        };
      }

      saveTodosToStorage(filteredTodos);

      return {
        success: true,
        data: { id },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete todo',
      };
    }
  },

  // Toggle todo completion status
  async toggleTodo(id) {
    await delay(150);
    try {
      const todos = getTodosFromStorage();
      const todoIndex = todos.findIndex(todo => todo.id === id);

      if (todoIndex === -1) {
        return {
          success: false,
          error: 'Todo not found',
        };
      }

      const updatedTodo = {
        ...todos[todoIndex],
        completed: !todos[todoIndex].completed,
        updatedAt: new Date().toISOString(),
      };

      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = updatedTodo;
      saveTodosToStorage(updatedTodos);

      return {
        success: true,
        data: updatedTodo,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to toggle todo',
      };
    }
  },

  // Bulk update todos (for drag and drop reordering)
  async reorderTodos(reorderedTodos) {
    await delay(100);
    try {
      const todosWithTimestamp = reorderedTodos.map(todo => ({
        ...todo,
        updatedAt: new Date().toISOString(),
      }));

      saveTodosToStorage(todosWithTimestamp);

      return {
        success: true,
        data: todosWithTimestamp,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to reorder todos',
      };
    }
  },

  // Search todos
  async searchTodos(query) {
    await delay(100);
    try {
      const todos = getTodosFromStorage();
      const searchQuery = query.toLowerCase().trim();

      if (!searchQuery) {
        return {
          success: true,
          data: todos,
        };
      }

      const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery) ||
        todo.description.toLowerCase().includes(searchQuery) ||
        todo.category.toLowerCase().includes(searchQuery)
      );

      return {
        success: true,
        data: filteredTodos,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search todos',
      };
    }
  },

  // Get todos by filter
  async getFilteredTodos(filter) {
    await delay(100);
    try {
      const todos = getTodosFromStorage();
      let filteredTodos = todos;

      switch (filter) {
        case 'active':
          filteredTodos = todos.filter(todo => !todo.completed);
          break;
        case 'completed':
          filteredTodos = todos.filter(todo => todo.completed);
          break;
        case 'high-priority':
          filteredTodos = todos.filter(todo => todo.priority === 'high');
          break;
        case 'overdue':
          filteredTodos = todos.filter(todo => {
            if (!todo.dueDate) return false;
            return new Date(todo.dueDate) < new Date() && !todo.completed;
          });
          break;
        case 'all':
        default:
          filteredTodos = todos;
          break;
      }

      return {
        success: true,
        data: filteredTodos,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to filter todos',
      };
    }
  },

  // Get todo statistics
  async getTodoStats() {
    await delay(50);
    try {
      const todos = getTodosFromStorage();
      const total = todos.length;
      const completed = todos.filter(todo => todo.completed).length;
      const active = total - completed;
      const overdue = todos.filter(todo => {
        if (!todo.dueDate) return false;
        return new Date(todo.dueDate) < new Date() && !todo.completed;
      }).length;

      const stats = {
        total,
        completed,
        active,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get todo statistics',
      };
    }
  },
};

export { todoApi };