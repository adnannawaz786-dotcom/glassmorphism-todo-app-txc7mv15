/* EXPORTS: validateTodo, validateTodoUpdate, validateTodoQuery */

const validateTodo = (req, res, next) => {
  const { title, description, priority, category, dueDate } = req.body;

  // Validation errors array
  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (title.trim().length === 0) {
    errors.push('Title cannot be empty');
  } else if (title.trim().length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Description validation (optional)
  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string');
    } else if (description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
  }

  // Priority validation (optional)
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      errors.push('Priority must be one of: low, medium, high, urgent');
    }
  }

  // Category validation (optional)
  if (category !== undefined) {
    if (typeof category !== 'string') {
      errors.push('Category must be a string');
    } else if (category.length > 50) {
      errors.push('Category must be less than 50 characters');
    }
  }

  // Due date validation (optional)
  if (dueDate !== undefined) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Sanitize and normalize data
  req.body = {
    title: title.trim(),
    description: description ? description.trim() : '',
    priority: priority || 'medium',
    category: category ? category.trim() : 'general',
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    completed: false
  };

  next();
};

const validateTodoUpdate = (req, res, next) => {
  const { title, description, priority, category, dueDate, completed } = req.body;
  const errors = [];

  // At least one field should be provided for update
  if (!title && !description && priority === undefined && !category && !dueDate && completed === undefined) {
    errors.push('At least one field must be provided for update');
  }

  // Title validation (if provided)
  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push('Title must be a string');
    } else if (title.trim().length === 0) {
      errors.push('Title cannot be empty');
    } else if (title.trim().length > 200) {
      errors.push('Title must be less than 200 characters');
    }
  }

  // Description validation (if provided)
  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string');
    } else if (description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
  }

  // Priority validation (if provided)
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      errors.push('Priority must be one of: low, medium, high, urgent');
    }
  }

  // Category validation (if provided)
  if (category !== undefined) {
    if (typeof category !== 'string') {
      errors.push('Category must be a string');
    } else if (category.length > 50) {
      errors.push('Category must be less than 50 characters');
    }
  }

  // Due date validation (if provided)
  if (dueDate !== undefined) {
    if (dueDate !== null) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date or null');
      }
    }
  }

  // Completed validation (if provided)
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed must be a boolean');
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Sanitize and normalize update data
  const updateData = {};
  
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (priority !== undefined) updateData.priority = priority;
  if (category !== undefined) updateData.category = category.trim();
  if (dueDate !== undefined) {
    updateData.dueDate = dueDate ? new Date(dueDate).toISOString() : null;
  }
  if (completed !== undefined) updateData.completed = completed;

  req.body = updateData;
  next();
};

const validateTodoQuery = (req, res, next) => {
  const { search, category, priority, completed, sortBy, sortOrder, page, limit } = req.query;
  const errors = [];

  // Search validation (optional)
  if (search !== undefined && typeof search !== 'string') {
    errors.push('Search query must be a string');
  }

  // Category validation (optional)
  if (category !== undefined && typeof category !== 'string') {
    errors.push('Category filter must be a string');
  }

  // Priority validation (optional)
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      errors.push('Priority filter must be one of: low, medium, high, urgent');
    }
  }

  // Completed validation (optional)
  if (completed !== undefined) {
    if (completed !== 'true' && completed !== 'false') {
      errors.push('Completed filter must be "true" or "false"');
    }
  }

  // Sort by validation (optional)
  if (sortBy !== undefined) {
    const validSortFields = ['title', 'createdAt', 'updatedAt', 'dueDate', 'priority'];
    if (!validSortFields.includes(sortBy)) {
      errors.push('Sort by must be one of: title, createdAt, updatedAt, dueDate, priority');
    }
  }

  // Sort order validation (optional)
  if (sortOrder !== undefined) {
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      errors.push('Sort order must be "asc" or "desc"');
    }
  }

  // Page validation (optional)
  if (page !== undefined) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push('Page must be a positive integer');
    }
  }

  // Limit validation (optional)
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a positive integer between 1 and 100');
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Query validation failed',
      errors: errors
    });
  }

  // Normalize query parameters
  req.query = {
    search: search || '',
    category: category || '',
    priority: priority || '',
    completed: completed ? completed === 'true' : undefined,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10
  };

  next();
};

export { validateTodo, validateTodoUpdate, validateTodoQuery };