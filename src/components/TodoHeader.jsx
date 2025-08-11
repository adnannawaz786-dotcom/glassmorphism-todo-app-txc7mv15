/* EXPORTS: TodoHeader */

import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useTodo } from '../context/TodoContext';

const TodoHeader = ({ onAddNew }) => {
  const { todos } = useTodo();

  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = todos.filter(todo => !todo.completed && !todo.overdue).length;
  const overdueTodos = todos.filter(todo => todo.overdue).length;
  const totalTodos = todos.length;

  const stats = [
    {
      icon: CheckCircle,
      label: 'Completed',
      value: completedTodos,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pendingTodos,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: AlertCircle,
      label: 'Overdue',
      value: overdueTodos,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  const completionPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight"
          >
            My Tasks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            Stay organized and productive
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={onAddNew}
            size="lg"
            className="bg-white/20 hover:bg-white/30 border border-white/20 text-white backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
        </motion.div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {totalTodos > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm font-medium">
                  Overall Progress
                </span>
                <span className="text-white font-semibold">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-white/60">
                <span>{completedTodos} completed</span>
                <span>{totalTodos} total tasks</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State Message */}
      {totalTodos === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <div className="p-8 text-center">
              <div className="mb-4">
                <CheckCircle className="w-12 h-12 text-white/40 mx-auto" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                No tasks yet
              </h3>
              <p className="text-white/60 text-sm">
                Create your first task to get started with your productivity journey
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export { TodoHeader };