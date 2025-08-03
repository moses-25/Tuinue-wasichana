// Emergency logout utility for when backend is unavailable
export const emergencyLogout = () => {
  // Clear all localStorage items related to auth
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
  
  // Force page reload to reset all state
  window.location.href = '/';
};

// Add to window for emergency access from browser console
if (typeof window !== 'undefined') {
  window.emergencyLogout = emergencyLogout;
}