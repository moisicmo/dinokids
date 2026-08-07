import { HandCoins, Menu, Printer, ShoppingCart } from 'lucide-react';
import { useAuthStore, useBranchStore, useCartStore, useCashBoxStore, usePermissionStore, usePopover, usePrintStore } from '@/hooks';
import noimage from '@/assets/images/profile.png';
import { AccountPopover } from './account.popover';
import { CashBoxPopover } from './cashbox.popover';
import { useEffect, useState } from 'react';
import { Profile } from './profile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TypeAction, TypeSubject } from '@/models';

interface Props {
  onNavOpen: () => void;
  onTapCart: () => void;
}

export const TopNav = (props: Props) => {
  const {
    onNavOpen,
    onTapCart,
  } = props;
  const accountPopover = usePopover();
  const cashBoxPopover = usePopover();

  const { branchesUser, branchSelect, setBranchSelect, isSuperAdmin } = useAuthStore();
  const { getAllBranches } = useBranchStore();
  const { cart } = useCartStore();
  const { format, setFormat } = usePrintStore();
  const { active: cashBoxActive, fetchActive: fetchCashBoxActive } = useCashBoxStore();
  const { hasPermission } = usePermissionStore();
  const canViewCashBox = hasPermission(TypeAction.read, TypeSubject.cashBox);
  const [dialogProfile, setdialogProfile] = useState<boolean>(false);
  const [allBranches, setAllBranches] = useState<{ id: string; name: string }[]>([]);


  useEffect(() => {
    if (isSuperAdmin) {
      getAllBranches().then(setAllBranches).catch(() => {});
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (canViewCashBox && branchSelect?.id) fetchCashBoxActive(branchSelect.id);
  }, [canViewCashBox, branchSelect?.id]);

  useEffect(() => {
    if (!canViewCashBox) return;
    const handler = () => { if (branchSelect?.id) fetchCashBoxActive(branchSelect.id); };
    window.addEventListener('cashbox-state-changed', handler);
    return () => window.removeEventListener('cashbox-state-changed', handler);
  }, [canViewCashBox, branchSelect?.id]);

  return (
<>
    <header className="sticky top-0 w-full bg-card z-30 shadow-sm">
      <div className="px-4 py-2 h-[56px] flex items-center justify-between">
        {/* Botón menú hamburguesa */}
        <div className="lg:hidden">
          <button
            onClick={onNavOpen}
            className="text-foreground focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Este div ocupa el espacio izquierdo cuando el botón está oculto */}
        <div className="hidden lg:block w-6 h-6"></div>
        <div className="relative flex items-center gap-4">

          <Select
            onValueChange={(value) => {
              if (value === 'all') {
                setBranchSelect(null as any);
                window.location.reload();
                return;
              }
              const list = isSuperAdmin ? allBranches : branchesUser;
              const branch = list.find(b => b.id === value);
              if (branch) {
                setBranchSelect(branch as any);
                window.location.reload();
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={branchSelect?.name || "Seleccionar sucursal"} />
            </SelectTrigger>

            <SelectContent>
              {isSuperAdmin && <SelectItem value="all">Todas las sucursales</SelectItem>}
              {(isSuperAdmin ? allBranches : branchesUser).map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Selector de formato de impresión */}
          <div className="hidden min-[480px]:flex items-center gap-1 bg-muted rounded-full p-1">
            <Printer className="w-3.5 h-3.5 text-muted-foreground ml-1" />
            <button
              type="button"
              onClick={() => setFormat('rollo')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                format === 'rollo'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Formato rollo (ticket)"
            >
              Rollo
            </button>
            <button
              type="button"
              onClick={() => setFormat('carta')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                format === 'carta'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Formato carta (A4)"
            >
              Carta
            </button>
          </div>
          {/* Botón de caja */}
          {canViewCashBox && (
            <div
              ref={cashBoxPopover.anchorRef as React.RefObject<HTMLDivElement>}
              className="relative"
            >
              <button
                type="button"
                onClick={cashBoxPopover.handleToggle}
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition relative ${cashBoxActive ? 'text-secondary-600' : 'text-muted-foreground'}`}
                aria-label="Caja"
              >
                <HandCoins size={24} />
                <span
                  className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${cashBoxActive ? 'bg-secondary-600 animate-pulse' : 'bg-muted-foreground'}`}
                />
              </button>
            </div>
          )}
          {/* Botón del carrito */}
          <div className="relative">
            <button
              type="button"
              onClick={onTapCart}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition relative text-foreground"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={24} />
              {/* Badge de cantidad */}
              {
                cart.length != 0 &&
                <span className="absolute -top-1 -right-1 bg-error-1000 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              }
            </button>
          </div>
          {/* Avatar */}
          <div
            ref={accountPopover.anchorRef as React.RefObject<HTMLDivElement>}
            onClick={accountPopover.handleOpen}
            className="cursor-pointer w-11 h-11 rounded-full overflow-hidden border border-border"
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
        onTapSettings={() => setdialogProfile(true)}
      />
      {canViewCashBox && (
        <CashBoxPopover
          anchorEl={cashBoxPopover.anchorRef.current}
          open={cashBoxPopover.open}
          onClose={cashBoxPopover.handleClose}
        />
      )}
    </header>
    {
      dialogProfile &&
      <Profile
        handleClose={() => setdialogProfile(false)}
      />
    }
</>
  );
};
