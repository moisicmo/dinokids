import { useCallback } from 'react';

export const usePrintStore = () => {

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

  return { handlePdf };
};
