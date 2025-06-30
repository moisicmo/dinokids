import { Menu } from 'lucide-react';
import { usePopover } from '@/hooks';
import noimage from '@/assets/images/profile.png';
import { AccountPopover } from './account.popover';

interface TopNavProps {
  onNavOpen: () => void;
}

export const TopNav = ({ onNavOpen }: TopNavProps) => {
  const accountPopover = usePopover();

  return (
    <header className="sticky top-0 w-full bg-white z-30 shadow-sm">
      <div className="px-4 py-2 h-[56px] flex items-center justify-between">
        {/* Botón menú hamburguesa */}
        <div className="lg:hidden">
          <button
            onClick={onNavOpen}
            className="text-gray-700 focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Este div ocupa el espacio izquierdo cuando el botón está oculto */}
        <div className="hidden lg:block w-6 h-6"></div>

        {/* Avatar */}
        <div className="relative flex items-center gap-4">
          <div
            ref={accountPopover.anchorRef}
            onClick={accountPopover.handleOpen}
            className="cursor-pointer w-11 h-11 rounded-full overflow-hidden border border-gray-300"
          >
            <img
              src={noimage}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>


      {/* Popover */}
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
        onTapSettings={() => console.log('Abrir configuraciones')}
      />
    </header>
  );
};
