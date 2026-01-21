import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import { onLogin, onLogout, setBranch, setBranchesUser, setRoleUser } from '@/store';
import { useAppSelector, useErrorStore } from '.';
import type { AuthModel, AuthRequest, BranchModel, ValidatePinRequest } from '@/models';
import { useState } from 'react';

export interface validateEmail {
  idUser: string;
  key: string;
  email: string;
}


export const useAuthStore = () => {
  const { status, user, roleUser, branchesUser, branchSelect } = useAppSelector(state => state.auth);
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
      localStorage.setItem('branches', JSON.stringify(data.branches));
      localStorage.setItem('branchSelect', JSON.stringify(data.branches[0]));
      dispatch(onLogin(user));
      dispatch(setRoleUser({ role }));
      dispatch(setBranchesUser({ branches: data.branches }));
      setBranchSelect(data.branches[0]);
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
      // rol
      const role = localStorage.getItem('role');
      if (role != null){
        dispatch(setRoleUser({ role: JSON.parse(role) }));
      }
      //branches
      const branches = localStorage.getItem('branches');
      if (branches != null) {
        dispatch(setBranchesUser({ branches: JSON.parse(branches) }));
      }
      // branch select
      const branchSelect = localStorage.getItem('branchSelect');
      if (branchSelect != null) {
        dispatch(setBranch({ branch: JSON.parse(branchSelect) }));
      }
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

  const setBranchSelect = (branch: BranchModel) => {
    localStorage.setItem('branchSelect', JSON.stringify(branch));
    dispatch(setBranch({ branch }));
  }

  return {
    //* Propiedades
    status,
    user,
    roleUser,
    showValidateEmail,
    branchesUser,
    branchSelect,
    //* Métodos
    startLogin,
    checkAuthToken,
    setShowValidateEmail,
    sendPin,
    validatePin,
    setBranchSelect,
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
