/* EXPORTS: TodoFilters */

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTodoContext } from '../context/TodoContext';

const TodoFilters = () => {
  const { filter, setFilter, todos } = useTodoContext();

  const filters = [
    {
      key: 'all',
      label: 'All',
      count: todos.length
    },
    {
      key: 'active',
      label: 'Active',
      count: todos.filter(todo => !todo.completed).length
    },
    {
      key: 'completed',
      label: 'Completed',
      count: todos.filter(todo => todo.completed).length
    }
  ];

  const getFilterVariant = (filterKey) => {
    return filter === filterKey ? 'default' : 'ghost';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2 p-4"
    >
      <div className="flex items-center gap-2 w-full justify-center sm:justify-start">
        {filters.map((filterItem) => (
          <motion.div
            key={filterItem.key}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={getFilterVariant(filterItem.key)}
              size="sm"
              onClick={() => setFilter(filterItem.key)}
              className={`
                relative backdrop-blur-md border transition-all duration-300
                ${filter === filterItem.key 
                  ? 'bg-white/20 border-white/30 text-white shadow-lg' 
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:text-white'
                }
                hover:shadow-lg hover:shadow-white/10
                active:scale-95
              `}
            >
              <span className="flex items-center gap-2">
                {filterItem.label}
                <Badge 
                  variant="secondary"
                  className={`
                    ml-1 px-2 py-0.5 text-xs backdrop-blur-sm
                    ${filter === filterItem.key
                      ? 'bg-white/30 text-white border-white/20'
                      : 'bg-white/20 text-white/70 border-white/10'
                    }
                  `}
                >
                  {filterItem.count}
                </Badge>
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* Active filter indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full text-center mt-2"
      >
        <span className="text-xs text-white/60 backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Showing {filter === 'all' ? 'all' : filter} tasks
        </span>
      </motion.div>
    </motion.div>
  );
};

export { TodoFilters };