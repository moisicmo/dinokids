import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import {
  setMonthlyFee,
  setAddMonthlyFee,
  setUpdateMonthlyFee,
  setDeleteMonthlyFee,
} from '@/store';
import { useAlertStore, useErrorStore } from '.';

export const useMonthlyFeeStore = () => {
  const { monthlyFees } = useSelector((state: any) => state.monthlyFees);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();

  const getMonthlyFee = async () => {
    try {
      const { data } = await coffeApi.get('/monthlyfee');
      console.log(data);
      dispatch(setMonthlyFee({ monthlyFees: data.monthlyFees }));
    } catch (error) {
      throw handleError(error);
    }
  };
const createMonthlyFee = async (body: object) => {
  try {
    const { data } = await coffeApi.post('/monthlyfee/', body);
    console.log(data);

    const byteCharacters = atob(data.document.pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const pdfURL = window.URL.createObjectURL(blob);

    // Importa print-js dinámicamente SOLO en el cliente
    if (typeof window !== 'undefined') {
      const printJS = (await import('print-js')).default;
      printJS(pdfURL);
    }

    if (data.message === 'create') {
      dispatch(setAddMonthlyFee({ monthlyFee: data }));
    } else {
      dispatch(setUpdateMonthlyFee({ monthlyFee: data }));
    }

    showSuccess('Cuota Mensual creado correctamente');
    
  } catch (error) {
    throw handleError(error);
  }
};

  const createMonthlyFeeInscription = async (body: object) => {
    try {
      const { data } = await coffeApi.post('/monthlyfee/inscription/', body);
      console.log("MONTHLYFEE INSCRIPTION STORE: ", data);
      dispatch(setAddMonthlyFee({ monthlyFee: data }));
      // PDF
      const byteCharacters = atob(data.document.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfURL = window.URL.createObjectURL(blob);
          if (typeof window !== 'undefined') {
      const printJS = (await import('print-js')).default;
      printJS(pdfURL);
    }


      showSuccess('Cuota de Inscripcion creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateMonthlyFee = async (id: number, body: object) => {
    try {
      const { data } = await coffeApi.patch(`/monthlyfee/${id}`, body);
      console.log(data);
      dispatch(setUpdateMonthlyFee({ monthlyFee: data }));
      showSuccess('Cuotal mensual editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteMonthlyFee = async (id: number) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/monthlyfee/${id}`);
        dispatch(setDeleteMonthlyFee({ id }));
        showSuccess('cuota Mensual eliminado correctamente');
      } else {
        showError('Cancelado', 'La Cuota Mensual esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    monthlyFees,
    //* Métodos
    getMonthlyFee,
    createMonthlyFee,
    createMonthlyFeeInscription,
    updateMonthlyFee,
    deleteMonthlyFee,
  };
};
