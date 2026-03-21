import { coffeApi } from '@/services';
import { useErrorStore, usePermissionStore } from '.';
import { TypeAction, TypeSubject, type AttendanceModel, type AttendanceRequest, type AttendanceSearchResult } from '@/models';
import { useState } from 'react';

export const useAttendanceStore = () => {
  const [dataAttendance, setDataAttendance] = useState<AttendanceModel | null>(null);
  const [searchResults, setSearchResults] = useState<AttendanceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const baseUrl = 'attendance';

  const searchStudents = async (q: string, branchId: string) => {
    if (!q || q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      requirePermission(TypeAction.create, TypeSubject.attendance);
      setIsSearching(true);
      const res = await coffeApi.get(`/${baseUrl}/search`, { params: { q: q.trim(), branchId } });
      setSearchResults(res.data ?? []);
    } catch (error) {
      throw handleError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const setAttendance = async (body: AttendanceRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.attendance);
      const res = await coffeApi.post(`/${baseUrl}`, body);
      setDataAttendance(res.data);
      setSearchResults([]);
    } catch (error) {
      throw handleError(error);
    }
  };

  const clearData = () => {
    setDataAttendance(null);
    setSearchResults([]);
  };

  return {
    //* Propiedades
    dataAttendance,
    searchResults,
    isSearching,
    //* Métodos
    setAttendance,
    searchStudents,
    clearData,
  };
};
