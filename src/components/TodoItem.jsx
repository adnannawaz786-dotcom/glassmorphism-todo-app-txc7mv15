/* EXPORTS: TodoItem as default */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useTodo } from '../context/TodoContext';

const TodoItem = ({ todo, index, dragHandleProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const { updateTodo, deleteTodo, toggleTodo } = useTodo();

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      updateTodo(todo.id, { text: editText.trim() });
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-white/60 hover:text-white/80" />
        </div>

        <div className="flex items-center gap-3 ml-6">
          {/* Checkbox */}
          <div className="flex-shrink-0">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="data-[state=checked]:bg-white/20 data-[state=checked]:border-white/40 border-white/30 rounded-md"
            />
          </div>

          {/* Todo Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleEdit}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40"
                autoFocus
              />
            ) : (
              <motion.p
                initial={false}
                animate={{
                  opacity: todo.completed ? 0.6 : 1,
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}
                className="text-white text-sm md:text-base break-words cursor-pointer"
                onClick={() => !todo.completed && setIsEditing(true)}
              >
                {todo.text}
              </motion.p>
            )}

            {/* Todo metadata */}
            <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
              <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
              {todo.priority && (
                <>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    todo.priority === 'high' 
                      ? 'bg-red-500/20 text-red-200' 
                      : todo.priority === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-200'
                      : 'bg-green-500/20 text-green-200'
                  }`}>
                    {todo.priority}
                  </span>
                </>
              )}
              {todo.category && (
                <>
                  <span>•</span>
                  <span className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full text-xs">
                    {todo.category}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 hover:bg-green-500/20 text-green-200 hover:text-green-100"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-200 hover:text-red-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={todo.completed}
                  className="h-8 w-8 p-0 hover:bg-blue-500/20 text-blue-200 hover:text-blue-100 disabled:opacity-30"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTodo(todo.id)}
                  className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-200 hover:text-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Glassmorphism glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export { TodoItem as default };