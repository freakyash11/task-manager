// src/types/index.ts
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  topic?: string;
  completed: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateTasksRequest {
  topic: string;
}

export interface GenerateTasksResponse {
  tasks: string[];
}