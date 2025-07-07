import { coffeApi } from '@/services';
import { useErrorStore } from './useError';
import { usePrintStore } from './usePrint';


export const useReportStore = () => {
  const { handleError } = useErrorStore();
  const { handleXlsx } = usePrintStore();

  const getReportInscriptions = async () => {
    try {
      const res = await coffeApi.get('/report/inscription');
      await handleXlsx(res.data.xlsxBase64);

    } catch (error) {
      throw handleError(error);
    }
  }

  const getReportDebts = async () => {
    try {
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