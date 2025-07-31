// src/services/endpoints.js
// Typed endpoint wrappers for backend API
import api, { get, post, put, del } from './api';

// AUTH
export const login = (payload) => post('/auth/login', payload);
export const register = (payload) => post('/auth/register', payload);
export const getProfile = () => get('/auth/profile');

// CHARITIES
export const getApprovedCharities = (fields) => get('/charities/', { headers: fields ? { 'X-Fields': fields } : {} });
export const getCharityDetails = (charity_id, fields) => get(`/charities/${charity_id}`, { headers: fields ? { 'X-Fields': fields } : {} });
export const applyForCharity = (payload, fields) => post('/charities/apply', payload, { headers: fields ? { 'X-Fields': fields } : {} });

// DONATIONS
export const makeDonation = (payload) => post('/donations/', payload);
export const getDonationHistory = () => get('/donations/history');

// STORIES
export const getStories = () => get('/stories/');
export const postStory = (payload) => post('/stories/', payload);
export const getStory = (story_id) => get(`/stories/${story_id}`);
export const updateStory = (story_id, payload) => put(`/stories/${story_id}`, payload);
export const deleteStory = (story_id) => del(`/stories/${story_id}`);

// USERS
export const getUserList = () => get('/users/');
export const getUserDetail = (user_id) => get(`/users/${user_id}`);
export const updateUserDetail = (user_id, payload) => put(`/users/${user_id}`, payload);
export const deleteUserDetail = (user_id) => del(`/users/${user_id}`);

// ADMIN
export const getAdminDashboard = () => get('/admin/dashboard');
export const getAdminActivities = () => get('/admin/activities');
export const getPermissionRequests = () => get('/admin/permission-requests');
export const approvePermissionRequest = (request_id) => post(`/admin/permission-requests/${request_id}/approve`);
export const rejectPermissionRequest = (request_id) => post(`/admin/permission-requests/${request_id}/reject`);
export const getAdminSettings = () => get('/admin/settings');
export const updateAdminSettings = (payload) => put('/admin/settings', payload);

// BENEFICIARIES
export const getCharityBeneficiaries = (charity_id, fields) => get(`/beneficiaries/charities/${charity_id}/beneficiaries`, { headers: fields ? { 'X-Fields': fields } : {} });
export const createBeneficiary = (charity_id, payload, fields) => post(`/beneficiaries/charities/${charity_id}/beneficiaries`, payload, { headers: fields ? { 'X-Fields': fields } : {} });
export const getBeneficiary = (beneficiary_id, fields) => get(`/beneficiaries/${beneficiary_id}`, { headers: fields ? { 'X-Fields': fields } : {} });
export const updateBeneficiary = (beneficiary_id, payload, fields) => put(`/beneficiaries/${beneficiary_id}`, payload, { headers: fields ? { 'X-Fields': fields } : {} });
export const deleteBeneficiary = (beneficiary_id) => del(`/beneficiaries/${beneficiary_id}`);

// INVENTORY
export const getCharityInventory = (charity_id, fields) => get(`/inventory/charities/${charity_id}/inventory`, { headers: fields ? { 'X-Fields': fields } : {} });
export const createInventoryItem = (charity_id, payload, fields) => post(`/inventory/charities/${charity_id}/inventory`, payload, { headers: fields ? { 'X-Fields': fields } : {} });
export const getInventoryItem = (item_id, fields) => get(`/inventory/${item_id}`, { headers: fields ? { 'X-Fields': fields } : {} });
export const updateInventoryItem = (item_id, payload, fields) => put(`/inventory/${item_id}`, payload, { headers: fields ? { 'X-Fields': fields } : {} });
export const deleteInventoryItem = (item_id) => del(`/inventory/${item_id}`);

// HEALTH
export const healthCheck = () => get('/health/');
export const detailedHealthCheck = () => get('/health/detailed');
export const livenessCheck = () => get('/health/live');
export const readinessCheck = () => get('/health/ready');
