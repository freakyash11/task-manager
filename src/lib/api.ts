// src/lib/api.ts
import { Task, GenerateTasksRequest, GenerateTasksResponse } from '@/types';

const API_BASE = '/api';

// Helper function to handle API errors
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    // Try to get detailed error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    } catch (jsonError) {
      // If can't parse JSON, throw generic error with status
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
  }
  return response.json();
}

export const api = {
  // Gemini API
  generateTasks: async (data: GenerateTasksRequest): Promise<GenerateTasksResponse> => {
    const response = await fetch(`${API_BASE}/gemini/generate-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  // Tasks API
  getTasks: async (params?: { category?: string; completed?: boolean }): Promise<Task[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.completed !== undefined) searchParams.set('completed', params.completed.toString());
    
    const response = await fetch(`${API_BASE}/tasks?${searchParams}`);
    return handleApiResponse(response);
  },

  createTask: async (task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return handleApiResponse(response);
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleApiResponse(response);
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse(response);
  },

  toggleTask: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleApiResponse(response);
  },

  syncUser: async (): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/sync`, {
      method: 'POST',
    });
    return handleApiResponse(response);
  },
};