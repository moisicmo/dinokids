import { coffeApi } from '@/services';
import { useErrorStore, usePermissionStore } from '..';
import { TypeAction, TypeSubject } from '@/models';


export const useReportStore = () => {
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();

  const getReportInscriptions = async (startDate: string, endDate: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/inscription', {
        params: { startDate, endDate },
      });
      return res.data as { xlsxBase64: string; data: any[] };
    } catch (error) {
      throw handleError(error);
    }
  };

  const getReportDebts = async (startDate: string, endDate: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/debt', {
        params: { startDate, endDate },
      });
      return res.data as { xlsxBase64: string; data: any[] };
    } catch (error) {
      throw handleError(error);
    }
  };

  const getReportAttendance = async (startDate: string, endDate: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/attendance', {
        params: { startDate, endDate },
      });
      return res.data as { xlsxBase64: string; data: any[] };
    } catch (error) {
      throw handleError(error);
    }
  };

  const getReportFinancial = async (startDate: string, endDate: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/financial', {
        params: { startDate, endDate },
      });
      return res.data as { xlsxBase64: string; data: any[] };
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    getReportInscriptions,
    getReportDebts,
    getReportAttendance,
    getReportFinancial,
  };
};