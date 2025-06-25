import { Outlet, useLocation } from 'react-router';
import { ProtectedRoute } from './protected.layout';
import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';
import { SideNav } from './SideNav';

const AdminLayout = () => {

  const { pathname } = useLocation();
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    if (openNav) setOpenNav(false);
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <SideNav open={openNav} onClose={() => setOpenNav(false)} />
        {/* Sidebar */}

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <TopNav onNavOpen={() => setOpenNav(true)} />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );

};

export default AdminLayout;
