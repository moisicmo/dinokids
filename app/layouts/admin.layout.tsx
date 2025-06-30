import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ProtectedRoute } from './protected.layout';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [openNav, setOpenNav] = useState(false);

  const SIDENAV_WIDTH = 190;
  const [isLargeScreen, setIsLargeScreen] = useState(false);


  useEffect(() => {
    const updateSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (openNav) setOpenNav(false);
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <SideNav
          open={openNav}
          onClose={() => setOpenNav(false)}
          isLargeScreen={isLargeScreen}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Top Navbar */}
          <TopNav onNavOpen={() => setOpenNav(true)} />

          {/* Contenido principal */}
          <main
            className="flex-1 p-3 overflow-y-auto"
            style={{ paddingLeft: isLargeScreen ? `${SIDENAV_WIDTH}px` : undefined }}
          >
            <Outlet />
          </main>



        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
