/* EXPORTS: FILTER_TYPES, PRIORITY_LEVELS, CATEGORIES, TODO_STATUS, ANIMATION_VARIANTS, GLASSMORPHISM_CLASSES, STORAGE_KEYS, DEFAULT_SETTINGS, DRAG_TYPES, KEYBOARD_SHORTCUTS, VALIDATION_RULES */

const FILTER_TYPES = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  HIGH_PRIORITY: 'high_priority',
  MEDIUM_PRIORITY: 'medium_priority',
  LOW_PRIORITY: 'low_priority'
};

const PRIORITY_LEVELS = {
  HIGH: {
    value: 'high',
    label: 'High Priority',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    icon: '🔥'
  },
  MEDIUM: {
    value: 'medium',
    label: 'Medium Priority',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: '⚡'
  },
  LOW: {
    value: 'low',
    label: 'Low Priority',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: '🌱'
  }
};

const CATEGORIES = {
  WORK: {
    value: 'work',
    label: 'Work',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    icon: '💼'
  },
  PERSONAL: {
    value: 'personal',
    label: 'Personal',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    icon: '🏠'
  },
  HEALTH: {
    value: 'health',
    label: 'Health',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    icon: '💪'
  },
  FINANCE: {
    value: 'finance',
    label: 'Finance',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    icon: '💰'
  },
  EDUCATION: {
    value: 'education',
    label: 'Education',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    icon: '📚'
  },
  SHOPPING: {
    value: 'shopping',
    label: 'Shopping',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    icon: '🛒'
  }
};

const TODO_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  },
  modal: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.2
      }
    }
  },
  slideIn: {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }
};

const GLASSMORPHISM_CLASSES = {
  card: 'backdrop-blur-md bg-white/10 border border-white/20 shadow-lg',
  cardHover: 'hover:bg-white/20 hover:border-white/30 transition-all duration-300',
  input: 'backdrop-blur-md bg-white/5 border border-white/20 placeholder:text-white/60',
  button: 'backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20',
  modal: 'backdrop-blur-xl bg-white/10 border border-white/20',
  sidebar: 'backdrop-blur-lg bg-white/5 border-r border-white/10',
  header: 'backdrop-blur-lg bg-white/10 border-b border-white/20',
  dropdown: 'backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-white/20'
};

const STORAGE_KEYS = {
  TODOS: 'glassmorphism_todos',
  SETTINGS: 'glassmorphism_settings',
  FILTERS: 'glassmorphism_filters'
};

const DEFAULT_SETTINGS = {
  theme: 'auto',
  showCompleted: true,
  defaultPriority: 'medium',
  defaultCategory: 'personal',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

const DRAG_TYPES = {
  TODO_ITEM: 'TODO_ITEM'
};

const KEYBOARD_SHORTCUTS = {
  ADD_TODO: 'ctrl+n',
  SEARCH: 'ctrl+f',
  TOGGLE_COMPLETED: 'ctrl+d',
  DELETE_TODO: 'delete',
  EDIT_TODO: 'enter',
  ESCAPE: 'escape'
};

const VALIDATION_RULES = {
  TODO_TITLE: {
    minLength: 1,
    maxLength: 200,
    required: true
  },
  TODO_DESCRIPTION: {
    maxLength: 1000,
    required: false
  },
  SEARCH_QUERY: {
    minLength: 1,
    maxLength: 100
  }
};

export {
  FILTER_TYPES,
  PRIORITY_LEVELS,
  CATEGORIES,
  TODO_STATUS,
  ANIMATION_VARIANTS,
  GLASSMORPHISM_CLASSES,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DRAG_TYPES,
  KEYBOARD_SHORTCUTS,
  VALIDATION_RULES
};