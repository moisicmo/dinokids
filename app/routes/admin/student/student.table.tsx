import { useEffect, useState } from 'react';
import { type DebtModel, type FormPaymentModel, type StudentModel } from '@/models';
import { useDebounce, useEnums, useDebtStore, useStudentStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { CalendarClock } from 'lucide-react';
import { PaymentCreate } from '.';

interface Props {
  handleEdit: (student: StudentModel) => void;
  limitInit?: number;
  itemSelect?: (student: StudentModel) => void;
}

export const StudentTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataStudent, getStudents, deleteStudent } = useStudentStore();
  const { getDebtsByStudent } = useDebtStore();
  const { getTypeDebt, getTypeDebtClass } = useEnums();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [Debt, setDebt] = useState<FormPaymentModel | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [Debts, setDebts] = useState<DebtModel[]>([]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataStudent.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataStudent.total, rowsPerPage]);

  useEffect(() => {
    getStudents(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  const handleSelect = async (id: string) => {
    if (expandedId === id) {
      // Si ya está abierto, ciérralo
      setExpandedId(null);
      setDebts([]);
      return;
    }

    const data = await getDebtsByStudent(id);
    setDebts(data);
    setExpandedId(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar estudiante..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Número de documento</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Colegio</th>
              <th className="px-6 py-3">Grado</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataStudent.data.map((item) => (
              <React.Fragment key={item.userId}>
                <tr className="border-b hover:bg-gray-50 group">
                  {/* Fila principal */}
                  <td className="px-6 py-3">{item.code}</td>
                  <td className="px-6 py-3">{item.user.numberDocument}</td>
                  <td className="px-6 py-3">{`${item.user.name} ${item.user.lastName}`}</td>
                  <td className="px-6 py-3">{item.user.email}</td>
                  <td className="px-6 py-3">{item.school}</td>
                  <td className="px-6 py-3">{`${item.grade}º ${item.educationLevel}`}</td>
                  <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                    <ActionButtons
                      item={item}
                      onSelect={handleSelect}
                      onEdit={handleEdit}
                      onDelete={deleteStudent}
                      isSelected={expandedId === item.userId}
                    />
                  </td>
                </tr>
                {expandedId === item.userId && (
                  <tr className="bg-transparent">
                    <td colSpan={12} className="px-0" style={{ padding: 0 }}>
                      <div className="w-full  bg-gray-50 p-4 rounded-b-md shadow-md">
                        {Debts.length > 0 ? (
                          <table className="w-full  text-sm text-left">
                            <thead>
                              <tr className="text-gray-600 text-xs bg-gray-100">
                                <th className="px-4 py-2">Razon</th>
                                <th className="px-4 py-2">Monto total</th>
                                <th className="px-4 py-2">Saldo</th>
                                <th className="px-4 py-2">Asignación</th>
                                <th className="px-4 py-2">Fecha creado</th>
                                <th className="px-4 py-2">Fecha de vencimiento</th>
                                <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Debts.map((debt) => (
                                <tr key={debt.id}>
                                  <td className="px-4 py-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeDebtClass(debt.type)}`}>
                                      {getTypeDebt(debt.type)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">{`${debt.totalAmount} Bs`}</td>
                                  <td className="px-4 py-2">{`${debt.remainingBalance} Bs`}</td>
                                  <td className="px-6 py-3">
                                    {debt.inscription.assignmentRooms.map((assignmentRoom) => (
                                      <div
                                        key={assignmentRoom.id}
                                        className="border border-gray-200 rounded-md px-3 py-1 shadow-sm bg-gray-50"
                                      >
                                        <p className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                                          <CalendarClock className="w-4 h-4 text-gray-500" />
                                          {`${assignmentRoom.room.branch.name} - ${assignmentRoom.room.name} - ${assignmentRoom.room.specialty.name}`}
                                        </p>
                                      </div>
                                    ))}
                                  </td>
                                  <td className="px-6 py-3">
                                    {format(new Date(debt.createdAt), 'dd-MMMM-yyyy', { locale: es })}
                                  </td>
                                  <td className="px-4 py-2">{debt.dueDate ? format(new Date(debt.dueDate), 'dd-MM-yyyy') : '—'}</td>
                                  <td className="px-6 py-3 sticky right-0">
                                    <ActionButtons
                                      item={debt}
                                      onPayment={(_) => {
                                        const request: FormPaymentModel = {
                                          debt,
                                          amount: 0.0,
                                          dueDate: null
                                        }
                                        setDebt(request)
                                        setOpenDrawer(true);
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-sm text-gray-500">Sin deudas registradas.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataStudent.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(1);
        }}
      />

      {(openDrawer && Debt) && (
        <PaymentCreate
          open={openDrawer}
          handleClose={() => setOpenDrawer(false)}
          item={Debt}
        />
      )}
    </div>
  );
};


