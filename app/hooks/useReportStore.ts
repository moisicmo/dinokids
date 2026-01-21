import { coffeApi } from '@/services';
import { useErrorStore } from './useError';
import { usePrintStore } from './usePrint';
import { usePermissionStore } from './usePermissionStore';
import { TypeAction, TypeSubject } from '@/models';


export const useReportStore = () => {
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { handleXlsx } = usePrintStore();

  const getReportInscriptions = async () => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/inscription');
      await handleXlsx(res.data.xlsxBase64);

    } catch (error) {
      throw handleError(error);
    }
  }

  const getReportDebts = async () => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/debt');
      await handleXlsx(res.data.xlsxBase64);

    } catch (error) {
      throw handleError(error);
    }
  }

  return {
    getReportInscriptions,
    getReportDebts,
  }
}