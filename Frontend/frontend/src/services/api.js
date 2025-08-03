// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tuinue-wasichana-api-amem.onrender.com/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.includeAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false,
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  },
};

// Charity API
export const charityAPI = {
  // Get all approved charities (public)
  getCharities: async () => {
    return apiRequest('/charities/', { includeAuth: false });
  },

  // Get specific charity details
  getCharityDetails: async (charityId) => {
    return apiRequest(`/charities/${charityId}`, { includeAuth: false });
  },

  // Apply for charity status (donor only)
  applyForCharity: async (applicationData) => {
    return apiRequest('/charities/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  // Admin: Get all charity applications
  getCharityApplications: async () => {
    return apiRequest('/charities/applications');
  },

  // Admin: Approve charity application
  approveCharityApplication: async (applicationId) => {
    return apiRequest(`/charities/applications/${applicationId}/approve`, {
      method: 'POST',
    });
  },

  // Admin: Reject charity application
  rejectCharityApplication: async (applicationId) => {
    return apiRequest(`/charities/applications/${applicationId}/reject`, {
      method: 'POST',
    });
  },

  // Admin: Get all charities
  getAllCharities: async (status = null) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/charities/admin/charities${query}`);
  },

  // Admin: Delete charity
  deleteCharity: async (charityId) => {
    return apiRequest(`/charities/admin/charities/${charityId}`, {
      method: 'DELETE',
    });
  },

  // Charity: Get my donors
  getMyDonors: async () => {
    return apiRequest('/charities/my-charity/donors');
  },

  // Charity: Get my donations
  getMyDonations: async () => {
    return apiRequest('/charities/my-charity/donations');
  },
};

// Donation API
export const donationAPI = {
  // Make a donation
  makeDonation: async (donationData) => {
    return apiRequest('/donations/', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },

  // Get donation history
  getDonationHistory: async () => {
    return apiRequest('/donations/history');
  },

  // Initiate M-Pesa payment
  initiateMpesaPayment: async (paymentData) => {
    return apiRequest('/donations/mpesa/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Check M-Pesa payment status
  checkMpesaStatus: async (transactionId) => {
    return apiRequest(`/donations/mpesa/status/${transactionId}`);
  },
};

// Stories API (assuming it exists based on routes)
export const storiesAPI = {
  getStories: async () => {
    return apiRequest('/stories/', { includeAuth: false });
  },

  createStory: async (storyData) => {
    return apiRequest('/stories/', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },

  getStoriesByCharity: async (charityId) => {
    return apiRequest(`/stories/charity/${charityId}`, { includeAuth: false });
  },
};

// Users API (Admin only)
export const usersAPI = {
  // Admin: Get all users
  getAllUsers: async () => {
    return apiRequest('/users/');
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    return apiRequest('/health', { includeAuth: false });
  },
};

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Get recent activities
  getRecentActivities: async () => {
    return apiRequest('/admin/activities');
  },

  // Get charity applications (alias for charityAPI.getCharityApplications)
  getCharityApplications: async () => {
    return apiRequest('/charities/applications');
  },

  // Approve charity application
  approveCharityApplication: async (applicationId) => {
    return apiRequest(`/admin/charities/${applicationId}/approve`, {
      method: 'POST',
    });
  },

  // Reject charity application
  rejectCharityApplication: async (applicationId, reason) => {
    return apiRequest(`/admin/charities/${applicationId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// Utility functions
export const apiUtils = {
  // Store auth data
  storeAuthData: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userData', JSON.stringify(user));
  },

  // Get stored user data
  getStoredUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },
};

export default {
  authAPI,
  charityAPI,
  donationAPI,
  storiesAPI,
  usersAPI,
  healthAPI,
  adminAPI,
  apiUtils,
};