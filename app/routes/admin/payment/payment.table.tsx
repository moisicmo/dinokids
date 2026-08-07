import { useEffect, useMemo, useState } from 'react';
import { usePaymentStore, useDebounce, useEnums } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Receipt } from 'lucide-react';
import type { PaymentModel } from '@/models';

interface Props {
  limitInit?: number;
}

export const PaymentTable = (props: Props) => {
  const {
    limitInit = 10,
  } = props;

  const { dataPayment, getPayments, getInvoicePdf } = usePaymentStore();
  // const { getTypePayment, getTypePaymentClass } = useEnums();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { getTypeDebt, getTypeDebtClass } = useEnums();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataPayment.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataPayment.total, rowsPerPage]);

  useEffect(() => {
    getPayments(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  // Un carrito de pago puede cobrar varias deudas de un tirón — todas comparten
  // un mismo Invoice. Se agrupan por invoice.id para que el comprobante (que
  // ya cubre todos los pagos del carrito) aparezca en una sola fila.
  const groupedPayments = useMemo(() => {
    const groups = new Map<string, {
      key: string;
      invoiceId?: string;
      code: string;
      amount: number;
      payMethod: string;
      reasons: string[];
      createdAt: string | Date;
      payments: PaymentModel[];
    }>();

    dataPayment.data.forEach((item) => {
      const key = item.invoice?.id ?? item.id;
      const reason = getTypeDebt(item.debt.type);
      const existing = groups.get(key);

      if (existing) {
        existing.amount += item.amount;
        if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
        existing.payments.push(item);
      } else {
        groups.set(key, {
          key,
          invoiceId: item.invoice?.id,
          code: item.invoice?.code ?? item.id,
          amount: item.amount,
          payMethod: item.payMethod,
          reasons: [reason],
          createdAt: item.createdAt,
          payments: [item],
        });
      }
    });

    return Array.from(groups.values());
  }, [dataPayment.data, getTypeDebt]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar pago..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método de pago</TableHead>
            <TableHead>Razon</TableHead>
            <TableHead>Fécha de pago</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedPayments.map(group => (
            <TableRow key={group.key}>
              <TableCell>{group.code}</TableCell>
              <TableCell>{group.payMethod}</TableCell>
              <TableCell>{`${group.amount} Bs`}</TableCell>
              <TableCell>
                {group.payments.length > 1 ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="detail" className="border-0">
                      <AccordionTrigger className="py-1 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {group.payments.length} pagos: {group.reasons.join(', ')}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {group.payments.map((payment) => (
                          <div key={payment.id} className="border-l-2 border-primary pl-3 py-1">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm font-medium">{getTypeDebt(payment.debt.type)}</span>
                              <span className="text-sm font-semibold">{`${payment.amount} Bs`}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {payment.payMethod} · {format(new Date(payment.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  group.reasons.join(', ')
                )}
              </TableCell>
              <TableCell>
                {format(new Date(group.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}
              </TableCell>
              <TableCell>
                <ActionButtons
                  item={{ id: group.key }}
                  onDownload={group.invoiceId ? () => getInvoicePdf(group.invoiceId!) : undefined}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Controles de paginación */}
      <PaginationControls
        total={dataPayment.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};
