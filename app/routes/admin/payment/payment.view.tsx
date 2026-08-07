import { PaymentTable } from '.';

const PaymentView = () => {


  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Pagos</h2>
      </div>

      <PaymentTable
      />
    </>
  );
};

export default PaymentView;