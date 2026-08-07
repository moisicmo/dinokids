import axios from 'axios';
import { showLoadingOverlay, hideLoadingOverlay } from '@/store/alertUI';
import { getEnvVariables } from '../helpers';

const { VITE_HOST_BACKEND } = getEnvVariables();

const MUTATION_METHODS = new Set(['post', 'patch', 'put', 'delete']);

const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL: `${baseURL}/api`,
  });

  // ── Request: auth headers + loading para mutaciones ──
  instance.interceptors.request.use((request) => {
    const token = localStorage.getItem('token');
    const branchSelect = localStorage.getItem('branchSelect');
    if (token) request.headers.set('Authorization', `Bearer ${token}`);
    if (branchSelect) request.headers.set('branch-select', JSON.parse(branchSelect).id);

    if (MUTATION_METHODS.has(request.method?.toLowerCase() ?? '')) {
      showLoadingOverlay('Procesando...');
    }

    return request;
  });

  // ── Response: cerrar loading antes de que el hook muestre success/error ──
  instance.interceptors.response.use(
    (response) => {
      if (MUTATION_METHODS.has(response.config.method?.toLowerCase() ?? '')) {
        hideLoadingOverlay();
      }
      return response;
    },
    (error) => {
      if (MUTATION_METHODS.has(error.config?.method?.toLowerCase() ?? '')) {
        hideLoadingOverlay();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const coffeApi = createAxiosInstance(VITE_HOST_BACKEND);
