/* EXPORTS: TodoStats */

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Target, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';

const TodoStats = ({ todos = [] }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTodos,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Completed',
      value: completedTodos,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      label: 'Pending',
      value: pendingTodos,
      icon: Circle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      label: 'Progress',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`
            backdrop-blur-xl bg-white/10 border ${stat.borderColor}
            hover:bg-white/15 transition-all duration-300
            hover:scale-105 hover:shadow-lg hover:shadow-white/10
          `}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`
                  p-2 rounded-lg ${stat.bgColor} ${stat.borderColor} border
                `}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <motion.span 
                  className={`text-2xl font-bold ${stat.color}`}
                  key={stat.value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-sm text-white/70 font-medium">
                {stat.label}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export { TodoStats };