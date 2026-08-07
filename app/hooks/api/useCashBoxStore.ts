import { coffeApi } from '@/services';
import { useErrorStore, usePermissionStore } from '..';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type CashBoxActiveModel, type CashBoxSessionDetailModel, type CashBoxSessionItemModel, type CashBoxSummaryModel, type OpenCashBoxRequest } from '@/models';
import { useState } from 'react';

export const useCashBoxStore = () => {
  const [active, setActive] = useState<CashBoxActiveModel | null | undefined>(undefined);
  const [summary, setSummary] = useState<CashBoxSummaryModel | null>(null);
  const [dataHistory, setDataHistory] = useState<BaseResponse<CashBoxSessionItemModel>>(InitBaseResponse);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const baseUrl = 'cash-box';

  // Sin requirePermission a propósito — cualquier staff que vaya a cobrar
  // necesita saber si hay caja abierta, sin importar si administra la caja.
  const fetchActive = async (branchId: string) => {
    try {
      const { data } = await coffeApi.get(`/${baseUrl}/active`, { params: { branchId } });
      setActive(data ?? null);
      return data;
    } catch (error) {
      setActive(null);
      throw handleError(error);
    }
  };

  const fetchSummary = async (branchId: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.cashBox);
      const { data } = await coffeApi.get(`/${baseUrl}/summary`, { params: { branchId } });
      setSummary(data ?? null);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  };

  const openBox = async (branchId: string, body: OpenCashBoxRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.cashBox);
      setLoading(true);
      await coffeApi.post(`/${baseUrl}/open`, body, { params: { branchId } });
      await fetchActive(branchId);
      window.dispatchEvent(new Event('cashbox-state-changed'));
    } catch (error) {
      throw handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const closeBox = async (branchId: string) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.cashBox);
      setLoading(true);
      await coffeApi.post(`/${baseUrl}/close`, {}, { params: { branchId } });
      await fetchActive(branchId);
      window.dispatchEvent(new Event('cashbox-state-changed'));
    } catch (error) {
      throw handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (branchId: string, page: number = 1, limit: number = 10) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.cashBox);
      const { data, meta } = await coffeApi.get(`/${baseUrl}/history`, { params: { branchId, page, limit } }).then((r) => r.data);
      const payload: BaseResponse<CashBoxSessionItemModel> = { ...meta, data };
      setDataHistory(payload);
      return payload;
    } catch (error) {
      throw handleError(error);
    }
  };

  const getSessionDetail = async (id: string): Promise<CashBoxSessionDetailModel> => {
    try {
      requirePermission(TypeAction.read, TypeSubject.cashBox);
      const { data } = await coffeApi.get(`/${baseUrl}/sessions/${id}`);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    active,
    summary,
    dataHistory,
    loading,
    //* Métodos
    fetchActive,
    fetchSummary,
    openBox,
    closeBox,
    getHistory,
    getSessionDetail,
  };
};
