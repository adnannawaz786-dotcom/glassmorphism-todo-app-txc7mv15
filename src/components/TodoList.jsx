/* EXPORTS: TodoList */

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const TodoList = () => {
  const { 
    todos, 
    filteredTodos, 
    filter, 
    reorderTodos,
    searchQuery 
  } = useTodoContext();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    reorderTodos(sourceIndex, destinationIndex);
  };

  const getFilteredCount = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed).length;
      case 'completed':
        return todos.filter(todo => todo.completed).length;
      default:
        return todos.length;
    }
  };

  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No todos found matching "${searchQuery}"`;
    }
    
    switch (filter) {
      case 'active':
        return 'No active todos. Add a new task to get started!';
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      default:
        return 'Your todo list is empty. Add your first task!';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* List Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-white/90">
            {filter === 'all' ? 'All Tasks' : 
             filter === 'active' ? 'Active Tasks' : 
             'Completed Tasks'}
          </h2>
          <Badge 
            variant="secondary" 
            className="bg-white/10 text-white/80 border-white/20"
          >
            {getFilteredCount()} {getFilteredCount() === 1 ? 'task' : 'tasks'}
          </Badge>
        </div>
        
        {searchQuery && (
          <div className="text-sm text-white/60">
            Searching for: "{searchQuery}"
          </div>
        )}
      </div>

      {/* Todo List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-3 transition-all duration-200 ${
                snapshot.isDraggingOver ? 'bg-white/5 rounded-lg p-2' : ''
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { 
                              duration: 0.2,
                              delay: index * 0.05 
                            }
                          }}
                          exit={{ 
                            opacity: 0, 
                            y: -20, 
                            scale: 0.95,
                            transition: { duration: 0.15 }
                          }}
                          layout
                          className={`transform transition-all duration-200 ${
                            snapshot.isDragging ? 
                            'rotate-2 scale-105 shadow-2xl z-50' : 
                            'hover:scale-[1.01]'
                          }`}
                        >
                          <TodoItem
                            todo={todo}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                          />
                        </motion.div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 p-12 text-center">
                      <div className="space-y-4">
                        <div className="text-6xl opacity-20">📝</div>
                        <h3 className="text-xl font-medium text-white/80">
                          {getEmptyMessage()}
                        </h3>
                        {!searchQuery && filter === 'all' && (
                          <p className="text-white/50 text-sm">
                            Use the form above to create your first todo item.
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Drag Instructions */}
      {filteredTodos.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/40 text-sm mt-6"
        >
          💡 Tip: Drag and drop todos to reorder them
        </motion.div>
      )}
    </div>
  );
};

export default TodoList;