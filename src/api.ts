const API_BASE = import.meta.env.VITE_API_URL || '';

/** 将相对路径转为完整 URL（前后端分离时媒体从 API 域名加载） */
export function getMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/') && API_BASE) return API_BASE.replace(/\/$/, '') + url;
  return url;
}

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return res.json();
}

// Auth
export async function login(password: string): Promise<{ success: boolean; token: string }> {
  const result = await request<{ success: boolean; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  if (result.token) {
    localStorage.setItem('authToken', result.token);
  }
  return result;
}

export function logout(): void {
  localStorage.removeItem('authToken');
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('authToken');
}

// Videos
export const videosApi = {
  getAll: () => request<Video[]>('/api/videos'),
  like: (id: string) => request<{ count: number }>(`/api/videos/${id}/like`, { method: 'POST' }),
  create: (video: Omit<Video, 'id'>) => request<Video>('/api/videos', {
    method: 'POST',
    body: JSON.stringify(video),
  }),
  update: (id: string, video: Partial<Video>) => request<Video>(`/api/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(video),
  }),
  delete: (id: string) => request<void>(`/api/videos/${id}`, { method: 'DELETE' }),
};

// Photos
export const photosApi = {
  getAll: () => request<Photo[]>('/api/photos'),
  like: (id: string) => request<{ count: number }>(`/api/photos/${id}/like`, { method: 'POST' }),
  create: (photo: Omit<Photo, 'id'>) => request<Photo>('/api/photos', {
    method: 'POST',
    body: JSON.stringify(photo),
  }),
  update: (id: string, photo: Partial<Photo>) => request<Photo>(`/api/photos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(photo),
  }),
  delete: (id: string) => request<void>(`/api/photos/${id}`, { method: 'DELETE' }),
};

// Quotes
export const quotesApi = {
  getAll: () => request<Quote[]>('/api/quotes'),
  like: (id: string) => request<{ count: number }>(`/api/quotes/${id}/like`, { method: 'POST' }),
  create: (quote: Omit<Quote, 'id'>) => request<Quote>('/api/quotes', {
    method: 'POST',
    body: JSON.stringify(quote),
  }),
  update: (id: string, quote: Partial<Quote>) => request<Quote>(`/api/quotes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(quote),
  }),
  delete: (id: string) => request<void>(`/api/quotes/${id}`, { method: 'DELETE' }),
};

// Tasks
export const tasksApi = {
  getAll: () => request<TasksData>('/api/tasks'),
  create: (task: Omit<Task, 'id' | 'position'>) => request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  updateAll: (tasks: TasksData) => request<TasksData>('/api/tasks', {
    method: 'PUT',
    body: JSON.stringify(tasks),
  }),
  delete: (id: string) => request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
};

// Messages（留言板，无需登录）
export const messagesApi = {
  getAll: () => request<Message[]>('/api/messages'),
  like: (id: string) => request<{ count: number }>(`/api/messages/${id}/like`, { method: 'POST' }),
  create: (msg: { nickname: string; content: string }) => request<Message>('/api/messages', {
    method: 'POST',
    body: JSON.stringify(msg),
  }),
  delete: (id: string) => request<void>(`/api/messages/${id}`, { method: 'DELETE' }),
};

// Visits（访问量）
export const visitsApi = {
  get: () => request<{ count: number }>('/api/visits'),
  increment: () => request<{ count: number }>('/api/visits', { method: 'POST' }),
};

// Expenses
export const expensesApi = {
  getAll: () => request<Expense[]>('/api/expenses'),
  create: (expense: Omit<Expense, 'id' | 'createdAt'>) => request<Expense>('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  }),
  delete: (id: string) => request<void>(`/api/expenses/${id}`, { method: 'DELETE' }),
};

import type { Video, Photo, Quote, Task, TasksData, Expense, Message } from './types';

// File upload
export async function uploadVideoFiles(video?: File, thumbnail?: File): Promise<{ videoUrl?: string; thumbnail?: string }> {
  const formData = new FormData();
  if (video) formData.append('video', video);
  if (thumbnail) formData.append('thumbnail', thumbnail);
  
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}/api/upload/video`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function uploadPhotos(photos: File[]): Promise<{ images: string[] }> {
  const formData = new FormData();
  photos.forEach(photo => formData.append('photos', photo));
  
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}/api/upload/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
