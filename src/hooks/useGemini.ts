// src/hooks/useGemini.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGenerateTasks() {
  return useMutation({
    mutationFn: api.generateTasks,
  });
}