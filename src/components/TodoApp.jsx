/* EXPORTS: TodoApp */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Check, X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' });
  const [draggedItem, setDraggedItem] = useState(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todo = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTodos([todo, ...todos]);
    setNewTodo({ title: '', description: '', priority: 'medium' });
    setIsAddDialogOpen(false);
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Start editing todo
  const startEdit = (todo) => {
    setEditingTodo({ ...todo });
  };

  // Save edited todo
  const saveEdit = () => {
    if (!editingTodo.title.trim()) return;
    
    setTodos(todos.map(todo => 
      todo.id === editingTodo.id ? editingTodo : todo
    ));
    setEditingTodo(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTodo(null);
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'active':
        return !todo.completed && matchesSearch;
      case 'completed':
        return todo.completed && matchesSearch;
      case 'high':
        return todo.priority === 'high' && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  // Drag and drop handlers
  const handleDragStart = (e, todo) => {
    setDraggedItem(todo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTodo) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetTodo.id) return;

    const draggedIndex = todos.findIndex(todo => todo.id === draggedItem.id);
    const targetIndex = todos.findIndex(todo => todo.id === targetTodo.id);
    
    const newTodos = [...todos];
    newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedItem);
    
    setTodos(newTodos);
    setDraggedItem(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Glassmorphism Todo</h1>
          <p className="text-white/70">Organize your tasks with style</p>
        </motion.div>

        {/* Controls */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Filter */}
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>

              {/* Add Todo Button */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Todo
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-md bg-gray-900/90 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Todo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Todo title..."
                      value={newTodo.title}
                      onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Textarea
                      placeholder="Description (optional)..."
                      value={newTodo.description}
                      onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Select value={newTodo.priority} onValueChange={(value) => setNewTodo({ ...newTodo, priority: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addTodo} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                      Add Todo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{todos.length}</div>
              <div className="text-white/70">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{todos.filter(t => t.completed).length}</div>
              <div className="text-white/70">Completed</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{todos.filter(t => !t.completed).length}</div>
              <div className="text-white/70">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                whileHover={{ scale: 1.01 }}
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, todo)}
                className="cursor-move"
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-4">
                    {editingTodo?.id === todo.id ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Input
                          value={editingTodo.title}
                          onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                        <Textarea
                          value={editingTodo.description}
                          onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit} className="bg-green-500 hover:bg-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} className="border-white/20">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-white/30" />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleTodo(todo.id)}
                          className={`p-1 ${todo.completed ? 'text-green-400' : 'text-white/50'}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <h3 className={`font-medium ${todo.completed ? 'line-through text-white/50' : 'text-white'}`}>
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className={`text-sm mt-1 ${todo.completed ? 'text-white/30' : 'text-white/70'}`}>
                              {todo.description}
                            </p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(todo.priority)}>
                          {todo.priority}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(todo)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-white/50 text-lg">
                {searchTerm || filter !== 'all' ? 'No todos match your criteria' : 'No todos yet. Add your first task!'}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;