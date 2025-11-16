import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string) {
    const response = await this.client.post('/api/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  // Context endpoints
  async getContext() {
    const response = await this.client.get('/api/context');
    return response.data;
  }

  async updateGeneralContext(context: any) {
    const response = await this.client.post('/api/context/general', context);
    return response.data;
  }

  async updateSpecificContext(context: any) {
    const response = await this.client.post('/api/context/specific', context);
    return response.data;
  }

  // Schedule endpoints
  async generateSchedule(params: {
    type: 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
    additionalRequirements?: string;
  }) {
    const response = await this.client.post('/api/schedules/generate', params);
    return response.data;
  }

  async getSchedules(type?: 'weekly' | 'monthly', limit?: number) {
    const response = await this.client.get('/api/schedules', {
      params: { type, limit },
    });
    return response.data;
  }

  async getSchedule(id: string) {
    const response = await this.client.get(`/api/schedules/${id}`);
    return response.data;
  }

  async updateScheduleStatus(id: string, status: 'draft' | 'finalized') {
    const response = await this.client.patch(`/api/schedules/${id}/status`, {
      status,
    });
    return response.data;
  }

  async deleteSchedule(id: string) {
    const response = await this.client.delete(`/api/schedules/${id}`);
    return response.data;
  }

  // Export endpoints
  async downloadSchedulePDF(id: string) {
    const response = await this.client.get(`/api/export/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async emailSchedule(id: string, email: string) {
    const response = await this.client.post(`/api/export/${id}/email`, {
      email,
    });
    return response.data;
  }
}

export const api = new ApiClient();

