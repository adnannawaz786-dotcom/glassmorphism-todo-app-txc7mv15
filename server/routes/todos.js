/* EXPORTS: router (default) */

const express = require('express');
const router = express.Router();

// In-memory storage for todos (replace with database in production)
let todos = [
  {
    id: 1,
    text: 'Welcome to your glassmorphism todo app',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'medium',
    category: 'personal'
  },
  {
    id: 2,
    text: 'Try dragging and dropping todos',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'low',
    category: 'work'
  }
];

let nextId = 3;

// GET /api/todos - Get all todos
router.get('/', (req, res) => {
  try {
    const { filter, search, category, priority } = req.query;
    let filteredTodos = [...todos];

    // Filter by completion status
    if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (filter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => 
        todo.text.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (category && category !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.category === category);
    }

    // Priority filter
    if (priority && priority !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.priority === priority);
    }

    // Sort by creation date (newest first)
    filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
router.post('/', (req, res) => {
  try {
    const { text, priority = 'medium', category = 'personal' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Todo text is required'
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Todo text must be less than 500 characters'
      });
    }

    const validPriorities = ['low', 'medium', 'high'];
    const validCategories = ['personal', 'work', 'shopping', 'health', 'other'];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be low, medium, or high'
      });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const newTodo = {
      id: nextId++,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority,
      category
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
router.put('/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { text, completed, priority, category } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const todo = todos[todoIndex];

    // Validate text if provided
    if (text !== undefined) {
      if (text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Todo text cannot be empty'
        });
      }
      if (text.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Todo text must be less than 500 characters'
        });
      }
      todo.text = text.trim();
    }

    // Validate and update other fields
    if (completed !== undefined) {
      todo.completed = Boolean(completed);
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority. Must be low, medium, or high'
        });
      }
      todo.priority = priority;
    }

    if (category !== undefined) {
      const validCategories = ['personal', 'work', 'shopping', 'health', 'other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
      todo.category = category;
    }

    todo.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: todo,
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
router.delete('/:id', (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
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

// PUT /api/todos/reorder - Reorder todos for drag and drop
router.put('/reorder', (req, res) => {
  try {
    const { todoIds } = req.body;

    if (!Array.isArray(todoIds)) {
      return res.status(400).json({
        success: false,
        message: 'todoIds must be an array'
      });
    }

    // Validate all IDs exist
    const existingIds = todos.map(todo => todo.id);
    const invalidIds = todoIds.filter(id => !existingIds.includes(id));
    
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid todo IDs: ${invalidIds.join(', ')}`
      });
    }

    // Reorder todos based on provided IDs
    const reorderedTodos = todoIds.map(id => 
      todos.find(todo => todo.id === id)
    ).filter(Boolean);

    todos = reorderedTodos;

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

// DELETE /api/todos/completed - Delete all completed todos
router.delete('/completed', (req, res) => {
  try {
    const completedTodos = todos.filter(todo => todo.completed);
    todos = todos.filter(todo => !todo.completed);

    res.json({
      success: true,
      data: {
        deletedCount: completedTodos.length,
        deletedTodos: completedTodos
      },
      message: `${completedTodos.length} completed todos deleted`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete completed todos',
      error: error.message
    });
  }
});

module.exports = router;