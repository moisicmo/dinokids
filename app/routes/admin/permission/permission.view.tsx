import { PermissionTable } from '.';
import { usePermissionStore } from '@/hooks';

// Catálogo de solo lectura — el backend nunca expuso create/update/delete
// para Permission (PermissionController solo tiene @Get), es intencional:
// los permisos son estructurales y se administran desde el seed, no desde
// el panel. Lo que sí se edita acá es qué permisos tiene cada Rol
// (routes/admin/role), este listado es solo la referencia.
const permissionView = () => {
  const { dataPermission, getPermissions } = usePermissionStore();

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Permisos</h2>
      </div>

      {/* Tabla de permisos */}
      <PermissionTable
        dataRole={dataPermission}
        onRefresh={getPermissions}
      />
    </>
  );
};

export default permissionView;
