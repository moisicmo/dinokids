import { coffeApi } from '@/services';
import { useErrorStore, usePermissionStore } from '.';
import { TypeAction, TypeSubject, type AttendanceModel, type AttendanceRequest } from '@/models';
import { useState } from 'react';

export const useAttendanceStore = () => {
  const [dataAttendance, setDataAttendance] = useState<AttendanceModel | null>(null);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const baseUrl = 'attendance';

  const setAttendance = async (body: AttendanceRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.attendance);
      console.log(body);
      const res = await coffeApi.post(`/${baseUrl}`, body);
      const { data, meta } = res.data;
      console.log(res.data);
      // const payload: BaseResponse<SpecialtyModel> = {
      //   ...meta,
      //   data,
      // };
      setDataAttendance(res.data);
    } catch (error) {
      throw handleError(error);
    }
  };

  const clearData = () => {
    setDataAttendance(null);
  }

  return {
    //* Propiedades
    dataAttendance,
    //* Métodos
    setAttendance,
    clearData,
  };
};
