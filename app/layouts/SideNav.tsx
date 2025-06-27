import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { menu } from '@/utils/menu';
import logo from '@/assets/images/logo.png';
import { SideNavCustom } from '@/components';

export const SideNav = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { pathname } = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const updateSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const content = (
    <nav className="w-[190px] h-full p-4 shadow-md overflow-y-auto">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-24 mb-4" />
        <ul className="w-full space-y-2">
          {menu().map((item) => (
            <li key={item.title}>
              {item.path ? (
                <SideNavCustom
                  active={pathname === item.path}
                  icon={item.icon}
                  path={item.path}
                  title={item.title}
                />
              ) : (
                <>
                  <p className="text-sm font-semibold uppercase px-3 mb-1">{item.title}</p>
                  {item.group?.map((element: any) => (
                    <SideNavCustom
                      key={element.title}
                      active={pathname === element.path}
                      icon={element.icon}
                      path={element.path}
                      title={element.title}
                    />
                  ))}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  // 👉 Sidebar permanente en pantallas grandes
  if (isLargeScreen) {
    return (
      <aside className="h-screen bg-white w-[190px] shadow-md">
        {content}
      </aside>
    );
  }

  // 👉 Sidebar móvil deslizante con overlay
  return (
    <>
      {!isLargeScreen && open && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose}></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white w-[190px] transform ${open ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
      >
        {content}
      </aside>
    </>
  );
};
