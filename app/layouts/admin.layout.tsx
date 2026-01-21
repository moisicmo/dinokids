import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ProtectedRoute } from './protected.layout';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { CartDrawer } from './cart/cart.nav';
import { CartView } from './cart';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [openNav, setOpenNav] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const updateSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (openNav) setOpenNav(false);
    if (cartOpen) setCartOpen(false);
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Botón para abrir sidebar en móvil */}
        {!isLargeScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenNav(true)}
            className="lg:hidden fixed top-3 left-3 z-40 h-9 w-9 rounded-md bg-background shadow-sm border"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Sidebar */}
        <SideNav
          open={openNav}
          onClose={() => setOpenNav(false)}
          isLargeScreen={isLargeScreen}
        />

        {/* Main content */}
        <div className={cn(
          "min-h-screen transition-all duration-200",
          isLargeScreen ? "lg:ml-56" : ""
        )}>
          {/* Top Navbar - Siempre visible pero más delgado */}
          <TopNav
            onNavOpen={() => setOpenNav(true)}
            onTapCart={() => setCartOpen(true)}
            // className={cn(
            //   isLargeScreen ? "lg:ml-56" : "",
            //   "sticky top-0 z-30"
            // )}
          />

          {/* Contenido principal */}
          <main className="p-4 lg:p-5">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>

          {/* Drawer del carrito */}
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}>
            <CartView onClose={() => setCartOpen(false)} />
          </CartDrawer>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;