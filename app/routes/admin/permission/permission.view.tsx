import { useCallback, useState } from 'react';
import type { PermissionModel } from '@/models';
import { PermissionCreate, PermissionTable } from '.';
import { Button } from '@/components';
import { usePermissionStore } from '@/hooks';

const permissionView = () => {
    const { dataPermission, getPermissions,createPermission, updatePermission, deletePermission } = usePermissionStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<PermissionModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Permisos</h2>
        <Button
          onClick={() => handleDialog(true)}
        >
          Nuevo Permiso
        </Button>
      </div>

      {/* Tabla de role */}
      <PermissionTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataRole={dataPermission}
        onRefresh={getPermissions}
        onDelete={deletePermission}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <PermissionCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createPermission}
          onUpdate={updatePermission}
        />
      )}
    </>
  );
};

export default permissionView;