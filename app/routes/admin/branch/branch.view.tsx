import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { TypeAction, TypeSubject, type BranchModel } from '@/models';
import { BranchCreate, BranchTable } from '.';
import { Button } from '@/components';
import { useBranchStore, usePermissionStore } from '@/hooks';
import Swal from 'sweetalert2';

const branchView = () => {
  const { dataBranch, getBranches, createBranch, updateBranch, deleteBranch } = useBranchStore();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<BranchModel | null>(null);
  const { hasPermission } = usePermissionStore();

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  const handleCreate = async (body: Parameters<typeof createBranch>[0]) => {
    await createBranch(body);
    handleDialog(false);
    const result = await Swal.fire({
      title: '¿Asignar sucursal a un usuario?',
      text: 'La sucursal fue creada. ¿Deseas ir a Staffs para asignarla a un usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ir a Staffs',
      cancelButtonText: 'No por ahora',
      confirmButtonColor: '#B0008E',
    });
    if (result.isConfirmed) navigate('/admin/staff');
  };

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sucursales</h2>
        {
          hasPermission(TypeAction.create, TypeSubject.branch) &&
          <Button
            onClick={() => handleDialog(true)}
          >Nueva Sucursal</Button>
        }
      </div>

      {/* Tabla de branch */}
      <BranchTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataBranch={dataBranch}
        onRefresh={getBranches}
        onDelete={deleteBranch}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <BranchCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
          onCreate={handleCreate}
          onUpdate={updateBranch}
        />
      )}
    </>
  );
};

export default branchView