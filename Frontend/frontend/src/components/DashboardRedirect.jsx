


import { Link } from 'react-router-dom';
import React from 'react';
import { Navigate } from 'react-router-dom';
import DonorDashboard from '../Pages/Dashboards/DonorDashboard';
import CharityDashboard from '../Pages/Dashboards/CharityDashboard';
import AdminDashboard from '../Pages/Admin/AdminDashboard';

const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "donor":
      return <DonorDashboard />;
    case "charity":
      return <CharityDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

export default DashboardRedirect;
