/* EXPORTS: default (Express server) */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-domain.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for todos (replace with database in production)
let todos = [
  {
    id: '1',
    text: 'Welcome to your glassmorphism todo app',
    completed: false,
    priority: 'medium',
    category: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Try dragging todos to reorder them',
    completed: false,
    priority: 'low',
    category: 'tips',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to generate unique IDs
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// API Routes

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const { search, filter, category } = req.query;
    let filteredTodos = [...todos];

    // Apply search filter
    if (search) {
      filteredTodos = filteredTodos.filter(todo =>
        todo.text.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply completion filter
    if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (filter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }

    // Apply category filter
    if (category && category !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.category === category);
    }

    res.json({
      success: true,
      data: filteredTodos,
      total: filteredTodos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message
    });
  }
});

// POST /api/todos - Create new todo
app.post('/api/todos', (req, res) => {
  try {
    const { text, priority = 'medium', category = 'general' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Todo text is required'
      });
    }

    const newTodo = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.unshift(newTodo);

    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    });
  }
});

// PUT /api/todos/:id - Update todo
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, priority, category } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...(text !== undefined && { text: text.trim() }),
      ...(completed !== undefined && { completed }),
      ...(priority !== undefined && { priority }),
      ...(category !== undefined && { category }),
      updatedAt: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;

    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message
    });
  }
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    res.json({
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message
    });
  }
});

// PUT /api/todos/reorder - Reorder todos (for drag and drop)
app.put('/api/todos/reorder', (req, res) => {
  try {
    const { todoIds } = req.body;

    if (!Array.isArray(todoIds)) {
      return res.status(400).json({
        success: false,
        message: 'todoIds must be an array'
      });
    }

    // Reorder todos based on provided IDs
    const reorderedTodos = todoIds.map(id => {
      const todo = todos.find(t => t.id === id);
      return todo ? { ...todo, updatedAt: new Date().toISOString() } : null;
    }).filter(Boolean);

    // Add any todos that weren't in the reorder list
    const missingTodos = todos.filter(todo => !todoIds.includes(todo.id));
    todos = [...reorderedTodos, ...missingTodos];

    res.json({
      success: true,
      data: todos,
      message: 'Todos reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reorder todos',
      error: error.message
    });
  }
});

// GET /api/todos/stats - Get todo statistics
app.get('/api/todos/stats', (req, res) => {
  try {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const categories = [...new Set(todos.map(todo => todo.category))];

    res.json({
      success: true,
      data: {
        total,
        completed,
        active,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo API server running on port ${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;