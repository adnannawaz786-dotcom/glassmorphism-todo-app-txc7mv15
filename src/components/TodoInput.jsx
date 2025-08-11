/* EXPORTS: TodoInput */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import PropTypes from 'prop-types';

const MAX_INPUT_LENGTH = 200;

const TodoInput = ({ onAddTodo, isLoading = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (inputValue.trim().length > MAX_INPUT_LENGTH) {
      setError(`Todo must be ${MAX_INPUT_LENGTH} characters or less`);
      return;
    }
    
    try {
      setError('');
      await onAddTodo(inputValue.trim());
      setInputValue('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_LENGTH) {
      setInputValue(value);
      setError('');
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      setIsExpanded(false);
      setError('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setIsExpanded(false);
      setError('');
      e.target.blur();
    }
  };

  const isNearLimit = inputValue.length > MAX_INPUT_LENGTH * 0.8;
  const isOverLimit = inputValue.length > MAX_INPUT_LENGTH;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            scale: isExpanded ? 1.02 : 1,
            boxShadow: isExpanded 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
          className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done?"
                disabled={isLoading}
                maxLength={MAX_INPUT_LENGTH}
                className="w-full bg-transparent border-0 text-white placeholder:text-white/60 text-lg focus:ring-0 focus:outline-none p-0"
              />
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 w-full origin-left"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isOverLimit}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <Plus className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isExpanded ? 1 : 0, 
              height: isExpanded ? 'auto' : 0 
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Press Enter to add, Esc to cancel</span>
                <span className={`text-xs transition-colors ${
                  isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-white/60'
                }`}>
                  {inputValue.length}/{MAX_INPUT_LENGTH}
                </span>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          animate={{
            opacity: isExpanded ? 1 : 0,
            scale: isExpanded ? 1 : 0.95
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm"
        />
      </form>
    </motion.div>
  );
};

TodoInput.propTypes = {
  onAddTodo: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export { TodoInput };