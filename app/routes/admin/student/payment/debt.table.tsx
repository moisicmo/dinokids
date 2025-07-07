import { useState, useEffect } from 'react';
import type { DebtModel, FormPaymentModel } from "@/models";
import { useDebtStore, useEnums, usePopover } from "@/hooks";
import { CalendarClock } from "lucide-react";
import { ActionButtons } from "@/components";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PaymentCreate, PaymentTable } from "..";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  studentId: string;
}

export const DebtTable = (props: Props) => {
  const {
    studentId
  } = props;

  const { dataDebtByStudent, getDebtsByStudent } = useDebtStore();
  const { getTypeDebt, getTypeDebtClass } = useEnums();
  const [Debt, setDebt] = useState<FormPaymentModel | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const handleSelect = async (debt: DebtModel) => {
    if (debt.payments.length === 0) return;
    if (expandedId === debt.id) {
      // Si ya está abierto, ciérralo
      setExpandedId(null);
      return;
    }
    setExpandedId(debt.id);
  };

  useEffect(() => {
    getDebtsByStudent(studentId);
  }, [])

  return (
    <>
      <p className="text-sm text-gray-900">Deudas:</p>
      {dataDebtByStudent.total > 0 ? (
        <Table className='mb-3'>
          <TableHeader>
            <TableRow>
              <TableHead>Razon</TableHead>
              <TableHead>Monto total</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Asignación</TableHead>
              <TableHead>Fécha creado</TableHead>
              <TableHead>Fécha de vencimiento</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataDebtByStudent.data.map(debt => (
              <React.Fragment key={debt.id}>
                <TableRow>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeDebtClass(debt.type)}`}>
                      {getTypeDebt(debt.type)}
                    </span>
                  </TableCell>
                  <TableCell>{`${debt.totalAmount} Bs`}</TableCell>
                  <TableCell>{`${debt.remainingBalance} Bs`}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {format(new Date(debt.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}
                  </TableCell>
                  <TableCell>
                    {debt.dueDate ? format(new Date(debt.dueDate), 'dd-MMMM-yyyy', { locale: es }) : '—'}
                  </TableCell>
                  <TableCell className="sticky right-0 z-10 bg-white">
                    <ActionButtons
                      item={debt}
                      onSelect={() => handleSelect(debt)}
                      isSelected={expandedId === debt.id}
                      onPayment={() => {
                        const request: FormPaymentModel = {
                          debt,
                          amount: debt.remainingBalance,
                          dueDate: null,
                        };
                        setDebt(request);
                      }}
                      isPopoverOpen={Debt?.debt.id == debt.id}
                    >
                      {Debt && (
                        <PaymentCreate item={Debt} onClose={() => setDebt(null)} />
                      )}
                    </ActionButtons>

                  </TableCell>
                </TableRow>
                {expandedId === debt.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={7} className="p-0">
                      <PaymentTable payments={debt.payments} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-gray-500">Sin deudas registradas.</p>
      )}
    </>
  )
}
