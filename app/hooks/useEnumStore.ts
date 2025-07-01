import { DayOfWeek, TypeDebt } from '@/models';

export const useEnums = () => {

  const dayOptions = Object.entries(DayOfWeek).map(([key, value]) => ({
    key,
    label: value,
  }));
  const getDayLabel = (day: string) => {
    const found = dayOptions.find(d => d.key === day);
    return found?.label ?? day;
  };

  const TypeDebtOptions = Object.entries(TypeDebt).map(([key, value]) => ({
    key,
    label: value,
  }));
  const getTypeDebt = (day: TypeDebt):string => {
    const found = TypeDebtOptions.find(d => d.key === day);
    return found?.label ?? day;
  };

  const getTypeDebtClass = (type: TypeDebt):string => {
    const value = getTypeDebt(type);
    switch (value) {
      case TypeDebt.INSCRIPTION:
        return 'bg-blue-100 text-blue-800';
      case TypeDebt.MONTH:
        return 'bg-green-100 text-green-800';
      case TypeDebt.BOOKING:
        return 'bg-red-100 text-red-800';
      case TypeDebt.PER_SESSION:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    getDayLabel,

    getTypeDebt,
    getTypeDebtClass,
  };

}