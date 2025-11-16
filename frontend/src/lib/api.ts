const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const getToken = () => localStorage.getItem('token');

export const api = {
  auth: {
    signup: async (email: string, password: string, full_name: string, role: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, role }),
      });
      return response.json();
    },

    signin: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
  },

  doctors: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/doctors`);
      return response.json();
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    verify: async (id: string, approve: boolean) => {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ approve }),
      });
      return response.json();
    },
  },

  appointments: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  notifications: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.json();
    },

    markAsRead: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.json();
    },
  },
};
