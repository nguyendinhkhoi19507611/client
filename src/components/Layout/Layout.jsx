// client/src/components/Layout/Layout.jsx - Main layout component
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;