import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_HOST_BACKEND } = getEnvVariables();

// Creamos una función que devuelve la instancia de axios con el host deseado
const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL: `${baseURL}/api`
  });

  instance.interceptors.request.use((request) => {
    const token = localStorage.getItem(`token`);
    const branchSelect = localStorage.getItem('branchSelect');
    if (token) request.headers.set('Authorization', `Bearer ${token}`);
    if (branchSelect) request.headers.set('branch-select', JSON.parse(branchSelect).id);
    return request;
  });

  return instance;
};

export const coffeApi = createAxiosInstance(VITE_HOST_BACKEND);
