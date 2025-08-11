/* EXPORTS: TodoSearch */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const TodoSearch = ({ searchTerm, onSearchChange, totalTodos, filteredCount }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mb-6"
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search 
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  isFocused ? 'text-blue-400' : 'text-white/60'
                }`}
                size={20}
              />
              
              <Input
                type="text"
                placeholder="Search todos..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              />
              
              {localSearchTerm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-6 w-6 p-0 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <X size={14} />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          
          {localSearchTerm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  Search results for "{localSearchTerm}"
                </span>
                <span className="text-white/50">
                  {filteredCount} of {totalTodos} todos
                </span>
              </div>
              
              {filteredCount === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-center py-2"
                >
                  <span className="text-white/40 text-sm">
                    No todos found matching your search
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: localSearchTerm ? 1 : 0 }}
        className="mt-2 text-center"
      >
        <span className="text-xs text-white/40">
          Press Escape to clear search
        </span>
      </motion.div>
    </motion.div>
  );
};

export { TodoSearch };