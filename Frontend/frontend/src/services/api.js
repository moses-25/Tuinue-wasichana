
import axios from "./axiosInstance";

// -------- AUTH --------
export const registerUser = async (userData) => {
  const response = await axios.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);
  return response.data; // contains token, user info, etc.
};

// -------- CHARITIES --------
export const getCharities = async () => {
  const response = await axios.get("/charities");
  return response.data;
};

export const getCharityDetails = async (id) => {
  const response = await axios.get(`/charities/${id}`);
  return response.data;
};

export const applyCharity = async (charityData) => {
  const response = await axios.post("/charities/apply", charityData);
  return response.data;
};

// -------- DONATIONS --------
export const createDonation = async (donationData) => {
  const response = await axios.post("/donations", donationData);
  return response.data;
};

export const getDonationsByUser = async () => {
  const response = await axios.get("/donations/user");
  return response.data;
};

// -------- STORIES --------
export const getStories = async () => {
  const response = await axios.get("/stories");
  return response.data;
};

export const getStoryDetails = async (id) => {
  const response = await axios.get(`/stories/${id}`);
  return response.data;
};

// -------- ADMIN --------
export const getPendingCharityApplications = async () => {
  const response = await axios.get("/admin/charity-approvals");
  return response.data;
};

export const approveCharityApplication = async (id) => {
  const response = await axios.post(`/admin/charity-approvals/${id}/approve`);
  return response.data;
};
