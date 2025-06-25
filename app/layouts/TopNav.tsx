import { Menu } from 'lucide-react'; // ✅ Importa el icono
import { useRef, useEffect } from "react";

interface TopNavProps {
  onNavOpen: () => void;
}

export const TopNav = ({ onNavOpen }: TopNavProps) => {
  const avatarRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Aquí podrías usar un popover o menú contextual
  }, []);

  return (
    <header className="sticky top-0 w-full border-b border-gray-50border-gray-50">
      <div className="px-4 py-2 h-[56px] flex items-center justify-between">

        {/* Menú hamburguesa y título/logo */}
          <button
            onClick={onNavOpen}
            className="lg:hidden text-gray-700text-white focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

        {/* Área derecha: íconos, avatar, etc. */}
        <div className="flex items-center gap-4">
          {/* Placeholder para íconos adicionales */}
          {/* <Bell className="w-5 h-5 text-gray-500 dark:text-gray-300" /> */}
        </div>
      </div>
    </header>
  );
};
