import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ProtectedRoute } from './protected.layout';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    if (openNav) setOpenNav(false);
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <SideNav open={openNav} onClose={() => setOpenNav(false)} />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Top Navbar */}
          <TopNav onNavOpen={() => setOpenNav(true)} />

          {/* Contenido principal */}
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>

        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
