import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const user = JSON.parse(userStorage);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Bus API
export const busAPI = {
  search: (params) => api.get('/buses/search', { params }),
  getBusDetails: (id) => api.get(`/buses/bus/${id}`),
  getScheduleDetails: (id) => api.get(`/buses/schedule/${id}`),
};

// Booking API
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings'),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  processPayment: (data) => api.post('/bookings/payment', data),
};

// Admin API
export const adminAPI = {
  // Buses
  createBus: (data) => api.post('/admin/buses', data),
  updateBus: (id, data) => api.put(`/admin/buses/${id}`, data),
  deleteBus: (id) => api.delete(`/admin/buses/${id}`),
  getAllBuses: () => api.get('/admin/buses'),
  // Schedules
  createSchedule: (data) => api.post('/admin/schedules', data),
  updateSchedule: (id, data) => api.put(`/admin/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/admin/schedules/${id}`),
  getAllSchedules: () => api.get('/admin/schedules'),
  // Bookings
  getAllBookings: () => api.get('/admin/bookings'),
};

export default api;
