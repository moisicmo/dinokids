import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setFormat as setFormatAction, type PdfFormat } from '@/store';
import { useAppSelector } from '..';

export type { PdfFormat } from '@/store';

export const usePrintStore = () => {
  const dispatch = useDispatch();
  const format = useAppSelector((state) => state.print.format);

  const setFormat = useCallback((f: PdfFormat) => {
    dispatch(setFormatAction(f));
  }, [dispatch]);

  const handlePdf = useCallback(async (pdfBase64: string) => {
    try {
      if (!pdfBase64) {
        console.error('PDF base64 vacío o inválido');
        return;
      }

      // Decodificar base64
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      // Crear Blob PDF
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfURL = URL.createObjectURL(blob);

      // Importar print-js solo en entorno navegador
      if (typeof window !== 'undefined') {
        const printJS = (await import('print-js')).default;
        printJS(pdfURL);

        // Limpieza del ObjectURL después de un tiempo
        setTimeout(() => {
          URL.revokeObjectURL(pdfURL);
        }, 5000);
      }

    } catch (error) {
      console.error('Error al manejar el PDF:', error);
    }
  }, []);

  const handleXlsx = useCallback((xlsxBase64: string, fileName = 'reporte.xlsx') => {
    try {
      if (!xlsxBase64) {
        console.error('XLSX base64 vacío o inválido');
        return;
      }

      const byteCharacters = atob(xlsxBase64);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const xlsxURL = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = xlsxURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(xlsxURL);
      }, 5000);

    } catch (error) {
      console.error('Error al manejar el XLSX:', error);
    }
  }, []);

  return { handlePdf, handleXlsx, format, setFormat };
};
