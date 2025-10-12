import { coffeApi } from '@/services';
import { useErrorStore } from '.';
import { type AttendanceModel, type AttendanceRequest } from '@/models';
import { useState } from 'react';

export const useAttendanceStore = () => {
  const [dataAttendance, setDataAttendance] = useState<AttendanceModel|null>(null);
  const { handleError } = useErrorStore();
  const baseUrl = 'attendance';

  const setAttendance = async (body: AttendanceRequest) => {
    try {
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
