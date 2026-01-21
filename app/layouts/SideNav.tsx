import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

import logo from '@/assets/images/logo.png';
import { SideNavCustom } from '@/components';
import { useMenu } from '@/hooks/useMenuStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  isLargeScreen: boolean;
}

export const SideNav = ({ open, onClose, isLargeScreen }: Props) => {
  const { pathname } = useLocation();
  const menuItems = useMenu();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  // Abrir automáticamente el menú activo
useEffect(() => {
  const next: Record<string, boolean> = {};

  menuItems.forEach((item) => {
    if (item.group) {
      const isActive = item.group.some(
        (sub) => sub.path === pathname
      );
      if (isActive) {
        next[item.title] = true;
      }
    }
  });

  if (Object.keys(next).length) {
    setExpandedMenus((prev) => ({ ...prev, ...next }));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pathname]);


  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const content = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-center">
        <img src={logo} alt="Logo" className="h-14" />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            // ITEM SIMPLE
            if (item.path) {
              return (
                <SideNavCustom
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  path={item.path}
                  active={pathname === item.path}
                />
              );
            }

            // ITEM CON SUBMENÚ
            if (item.group) {
              const isExpanded = expandedMenus[item.title];
              const isActive = item.group.some(
                (sub) => sub.path === pathname
              );

              return (
                <div key={item.title} className="space-y-1">
                  <SideNavCustom
                    title={item.title}
                    icon={item.icon}
                    active={isActive}
                    onClick={() => toggleMenu(item.title)}
                    rightIcon={
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    }
                  />

                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {item.group.map((sub) => (
                        <SideNavCustom
                          key={sub.title}
                          title={sub.title}
                          path={sub.path}
                          active={pathname === sub.path}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>
      </ScrollArea>
    </div>
  );

  // Desktop
  if (isLargeScreen) {
    return (
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-56 lg:flex-col border-r bg-background">
        {content}
      </aside>
    );
  }

  // Mobile
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-56 bg-background border-r shadow-lg transition-transform duration-200 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {content}
      </aside>
    </>
  );
};
