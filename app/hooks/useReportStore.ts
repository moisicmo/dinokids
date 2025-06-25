import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import { setDashboard } from '@/store';
import { useErrorStore } from './useError';
import type { DashboardModel } from '@/models';
// import Swal from 'sweetalert2';
// import { saveAs } from 'file-saver';

interface RootState {
  reports: {
    dashboard: DashboardModel;
  };
}

export const useReportStore = () => {
  const { dashboard } = useSelector((state: RootState) => state.reports);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();

  const getDashboard = async () => {
    try {
      const { data } = await coffeApi.get('/report/dashboard');
      console.log(data);
      dispatch(setDashboard(data));
    } catch (error) {
      throw handleError(error);
    }
  }

  // const getReport = async (body: object) => {
  //   console.log('OBTENIENDO ORDENES PARA REPORTE');
  //   const { data } = await coffeApi.post('/report', body);
  //   console.log(data);
  //   dispatch(setReportdata({ reportData: data.orders }));
  // }

  // const getReportXlsx = async (body: object) => {
  //   console.log('OBTENIENDO ORDENES EN XLSX');
  //   const { data } = await coffeApi.post('/report/xlsx', body);
  //   console.log(data);

  //   // Decodificar la cadena Base64 a un objeto Uint8Array
  //   const byteCharacters = atob(data.document);
  //   const byteArray = Uint8Array.from(byteCharacters, char => char.charCodeAt(0));

  //   // Crear un Blob a partir del objeto Uint8Array
  //   const blob = new Blob([byteArray], { type: 'application/xlsx' });

  //   // Extraer la extensión del tipo MIME y construir el nombre del archivo
  //   const fileExtension = blob.type.split('/')[1];
  //   const fileName = data.fileName || 'reporte'; // Establecer un nombre predeterminado si data.fileName no está definido
  //   const fullFileName = `${fileName}.${fileExtension}`;

  //   // Guardar el archivo XLSX en el cliente
  //   saveAs(blob, fullFileName);

  //   Swal.fire('Reporte generado correctamente', '', 'success');
  // };



  return {
    //* Propiedades
    dashboard,
    // reportData,
    //* Métodos
    getDashboard,
    // getReport,
    // getReportXlsx,
  }
}