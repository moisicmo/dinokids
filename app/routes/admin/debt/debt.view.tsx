import { useDebtStore } from '@/hooks';
import { StudentsWithDebtTable } from '.';

const debtView = () => {
  const { dataStudentsWithDebt, getStudentsWithDebt } = useDebtStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Deudas</h2>
      </div>

      <StudentsWithDebtTable
        dataStudentsWithDebt={dataStudentsWithDebt}
        onRefresh={getStudentsWithDebt}
      />
    </>
  );
};

export default debtView;
