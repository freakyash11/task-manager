// src/components/TaskGenerator.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useGenerateTasks } from '@/hooks/useGemini';
import { useCreateTask } from '@/hooks/useTasks';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TaskGenerator() {
  const [topic, setTopic] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const generateMutation = useGenerateTasks();
  const createTaskMutation = useCreateTask();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setError(null);
    
    try {
      const result = await generateMutation.mutateAsync({ topic });
      if (result.tasks && result.tasks.length > 0) {
        setGeneratedTasks(result.tasks);
        setSelectedTasks(new Set());
      } else {
        setError('No tasks were generated. Please try a different topic.');
      }
    } catch (error: any) {
      console.error('Task generation error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('API Key')) {
        setError('AI service is not properly configured. Please contact the administrator.');
      } else if (error.message?.includes('Unauthorized')) {
        setError('You need to be signed in to generate tasks.');
      } else {
        setError('Failed to generate tasks. Please try again later.');
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate tasks',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSelected = async () => {
    if (selectedTasks.size === 0) return;
    
    const tasksToSave = Array.from(selectedTasks).map(index => ({
      title: generatedTasks[index],
      topic,
      category: 'Learning',
    }));

    setIsSaving(true);
    setError(null);
    
    try {
      // Save tasks one by one to better handle errors
      for (const task of tasksToSave) {
        try {
          await createTaskMutation.mutateAsync(task);
        } catch (taskError: any) {
          console.error('Error saving task:', task, taskError);
          throw new Error(`Failed to save task: ${task.title.substring(0, 20)}... - ${taskError.message}`);
        }
      }
      
      toast({
        title: 'Success',
        description: `${tasksToSave.length} tasks saved successfully!`,
      });
      
      setGeneratedTasks([]);
      setSelectedTasks(new Set());
      setTopic('');
      setError(null);
    } catch (error: any) {
      console.error('Save tasks error:', error);
      
      setError('Some tasks could not be saved. Please try again.');
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to save tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Learning Tasks</CardTitle>
        <CardDescription>
          Enter a topic to generate AI-powered learning tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a topic (e.g., Learn Python)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={!topic.trim() || generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Generate
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {generateMutation.isPending && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {generatedTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Generated Tasks:</h3>
            {generatedTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`task-${index}`}
                  checked={selectedTasks.has(index)}
                  onCheckedChange={(checked) => {
                    const newSelected = new Set(selectedTasks);
                    if (checked) {
                      newSelected.add(index);
                    } else {
                      newSelected.delete(index);
                    }
                    setSelectedTasks(newSelected);
                  }}
                />
                <label htmlFor={`task-${index}`} className="text-sm">
                  {task}
                </label>
              </div>
            ))}
            
            {selectedTasks.size > 0 && (
              <Button 
                onClick={handleSaveSelected}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {`Save Selected (${selectedTasks.size})`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}