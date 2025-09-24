import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import { onLogin, onLogout, setRoleUser } from '@/store';
import { useErrorStore } from '.';
import type { AuthModel, AuthRequest, ValidatePinRequest } from '@/models';
import { useState } from 'react';

export interface validateEmail {
  idUser: string;
  key: string;
  email: string;
}


export const useAuthStore = () => {
  const { status, user } = useSelector((state: any) => state.auth);
  const [showValidateEmail, setShowValidateEmail] = useState<validateEmail | null>(null);

  const dispatch = useDispatch();
  const { handleError } = useErrorStore();

  const startLogin = async (body: AuthRequest) => {
    try {
      const { data }: { data: AuthModel } = await coffeApi.post('/auth', body);
      console.log(data);
      const user = `${data.name} ${data.lastName}`;
      const role = data.role;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', user);
      localStorage.setItem('role', JSON.stringify(role));
      dispatch(onLogin(user));
      dispatch(setRoleUser({ role }));
    } catch (error: any) {
      console.log(error);
      dispatch(onLogout());

      const data = error?.response?.data;

      if (data?.key === 'validar correo') {
        console.log("🚀 data que llega del backend:", data);
        setShowValidateEmail({
          idUser: data.idUser,
          key: data.key,
          email: data.email,
        });
        sendPin(data.idUser);
      }


      throw handleError(error);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      dispatch(onLogin(user));
      return true;
    } else {
      localStorage.clear();
      dispatch(onLogout());
      return false;
    }
  };

  const sendPin = async (idUser: string) => {
    const resp = await coffeApi.get(`/auth/sendPin/${idUser}`);
    console.log(resp.data);
  }


  const validatePin = async (body: ValidatePinRequest) => {
    const resp = await coffeApi.post(`/auth/validatePin`, body);
    console.log(resp.data);
  }

  return {
    //* Propiedades
    status,
    user,
    showValidateEmail,
    //* Métodos
    startLogin,
    checkAuthToken,
    setShowValidateEmail,
    sendPin,
    validatePin,
  };
};

export const useLogoutStore = () => {
  const dispatch = useDispatch();
  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };
  return {
    startLogout,
  };
};
