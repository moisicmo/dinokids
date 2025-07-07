import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEnums } from "@/hooks";
import type { PaymentModel } from "@/models";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


interface Props {
  payments: PaymentModel[]
}

export const PaymentTable = (props: Props) => {
  const {
    payments,
  } = props;
  const { getPayMethod } = useEnums();
  return (
    <>
      <p className="text-sm text-gray-900">Pagos:</p>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Método de pago</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fécha de pago</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{getPayMethod(item.payMethod)}</TableCell>
              <TableCell>{`${item.amount} Bs`}</TableCell>
              <TableCell>
                {format(new Date(item.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
