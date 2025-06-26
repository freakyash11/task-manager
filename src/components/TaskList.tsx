// src/components/TaskList.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks, useToggleTask, useDeleteTask } from '@/hooks/useTasks';
import { Edit, Trash2, Filter } from 'lucide-react';
import { Task } from '@/types';

export default function TaskList() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filters = filter === 'all' ? undefined : { completed: filter === 'completed' };
  const { data: tasks = [], isLoading } = useTasks(filters);
  
  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();

  const categories = Array.from(new Set(tasks.map(task => task.category).filter(Boolean)));

  const filteredTasks = tasks.filter(task => 
    categoryFilter === 'all' || task.category === categoryFilter
  );

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          My Tasks
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            {categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No tasks found. Generate some tasks to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task}
                onToggle={() => toggleTaskMutation.mutate(task.id)}
                onDelete={() => deleteTaskMutation.mutate(task.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TaskItem({ 
  task, 
  onToggle, 
  onDelete 
}: { 
  task: Task; 
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg">
      <Checkbox
        checked={task.completed}
        onCheckedChange={onToggle}
      />
      
      <div className="flex-1">
        <p className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="flex gap-1 mt-1">
          {task.category && (
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          )}
          {task.topic && (
            <Badge variant="outline" className="text-xs">
              {task.topic}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}