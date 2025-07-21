
import React from 'react';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="header">
        <h1>Tuinue Wasichana</h1>
        <nav>
          <a href="/admin">Admin Dashboard</a>
          <a href="/logout">Logout</a>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2025 Tuinue Wasichana. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
