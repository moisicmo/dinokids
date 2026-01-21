import { AxiosError } from 'axios';
import { useAlertStore } from '.';

export const useErrorStore = () => {
  const { showError } = useAlertStore();

  const handleError = (error: any) => {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 401:
          showError('Oops', error.response?.data.message);
          break;
        default:
          showError('Oops', error.response?.data.message);
          break;
      }
    } else {
      throw error;
    }
  };
  return {
    handleError,
  };
};
