import { useLocation } from 'react-router';
import logo from '@/assets/images/logo.png';
import { SideNavCustom } from '@/components';
import { useMenu } from '@/hooks/useMenuStore';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  isLargeScreen: boolean;
}

export const SideNav = (props: Props) => {
  const { open, onClose, isLargeScreen } = props;
  const { pathname } = useLocation();
  const { user, roleUser, branchSelect } = useAuthStore();
  const menuItems = useMenu();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const filteredMenuItems = !branchSelect
    ? menuItems.filter((item) => item.path === '/admin/dashboard')
    : menuItems;

  const content = (
    <nav className="w-[220px] h-full flex flex-col overflow-hidden">

      {/* ── Header limpio ── */}
      <div className="flex flex-col items-center px-4 pt-5 pb-4 border-b border-gray-100">
        <img src={logo} alt="Logo" className="w-20 mb-3" />
        <p className="font-semibold text-sm text-gray-800 leading-tight text-center">{user as string}</p>
        {roleUser?.name && (
          <span
            className="mt-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: '#6BA539' }}
          >
            {roleUser.name}
          </span>
        )}
      </div>

      {/* ── Navegación ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 bg-white">
        {filteredMenuItems.map((item) => {
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

          if (item.group) {
            const isExpanded = expandedMenus[item.title];
            const isActive = item.group.some((sub) => sub.path === pathname);

            return (
              <div key={item.title} className="space-y-0.5">
                <SideNavCustom
                  title={item.title}
                  icon={item.icon}
                  active={isActive}
                  onClick={() => toggleMenu(item.title)}
                  rightIcon={
                    <ChevronRight
                      className={cn('h-3.5 w-3.5 transition-transform duration-200', isExpanded && 'rotate-90')}
                    />
                  }
                />
                {isExpanded && (
                  <div className="ml-5 pl-3 border-l border-gray-100 space-y-0.5">
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
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-400 text-center">DinoKids © {new Date().getFullYear()}</p>
      </div>
    </nav>
  );

  if (isLargeScreen) {
    return (
      <aside className="h-screen fixed top-0 left-0 shadow-sm z-40 bg-white border-r border-gray-100">
        {content}
      </aside>
    );
  }

  return (
    <>
      {!isLargeScreen && open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 w-[220px] bg-white shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {content}
      </aside>
    </>
  );
};
