import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { onLogin, onLogout, setBranch, setBranchesUser, setRoleUser, setUserProfile, setUserId, setIsSuperAdmin } from '@/store';
import { useAppSelector, useErrorStore } from '..';
import type { AuthModel, AuthRequest, BranchModel, ValidatePinRequest, UpdateProfileRequest, UpdatePasswordRequest, ForgotPasswordRequest } from '@/models';
import { useState } from 'react';

export interface validateEmail {
  idUser: string;
  key: string;
  email: string;
}

// localStorage puede quedar con datos corruptos de una sesión previa a un cambio de shape
// (ej. un JSON.stringify(undefined) guardado como el string literal "undefined") — un
// JSON.parse roto acá tumbaba checkAuthToken entero sin try/catch, dejando al usuario sin
// sidebar hasta volver a loguearse manualmente. Nunca debe tirar.
const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const decodeTokenProfile = (token: string): { name: string; lastName: string; email: string; userId: string } => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return {
      name: payload.name ?? '',
      lastName: payload.lastName ?? '',
      email: payload.email ?? '',
      userId: payload.sub ?? payload.id ?? payload.userId ?? '',
    };
  } catch {
    return { name: '', lastName: '', email: '', userId: '' };
  }
};


export const useAuthStore = () => {
  const { status, user, userId, userProfile, roleUser, branchesUser, branchSelect, isSuperAdmin } = useAppSelector(state => state.auth);
  const [showValidateEmail, setShowValidateEmail] = useState<validateEmail | null>(null);

  const dispatch = useDispatch();
  const { handleError } = useErrorStore();

  const startLogin = async (body: AuthRequest): Promise<boolean> => {
    try {
      const { data }: { data: AuthModel } = await coffeApi.post('/auth', body);
      const user = `${data.name} ${data.lastName}`;
      const role = data.role;
      const userIdStr = String(data.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', user);
      localStorage.setItem('userId', userIdStr);
      localStorage.setItem('role', JSON.stringify(role));
      localStorage.setItem('branches', JSON.stringify(data.branches));
      localStorage.setItem('superStaff', JSON.stringify(!!data.superStaff));
      dispatch(onLogin(user));
      dispatch(setUserId(userIdStr));
      dispatch(setUserProfile({ name: data.name, lastName: data.lastName, email: data.email ?? '' }));
      dispatch(setRoleUser({ role }));
      dispatch(setBranchesUser({ branches: data.branches }));
      dispatch(setIsSuperAdmin(!!data.superStaff));
      setBranchSelect(data.branches[0]);
      return true;
    } catch (error: any) {
      dispatch(onLogout());

      const data = error?.response?.data;

      if (data?.key === 'validar correo') {
        setShowValidateEmail({
          idUser: data.idUser,
          key: data.key,
          email: data.email,
        });
        sendPin(data.idUser);
        return false;
      }
      handleError(error);
      return false;
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      const profile = decodeTokenProfile(token);
      dispatch(onLogin(user));
      dispatch(setUserProfile(profile));
      // userId – prefer localStorage fallback, use decoded sub as backup
      const storedUserId = localStorage.getItem('userId') ?? profile.userId;
      if (storedUserId) dispatch(setUserId(storedUserId));
      // rol
      const role = safeJsonParse(localStorage.getItem('role'));
      if (role != null) {
        dispatch(setRoleUser({ role }));
      }
      //branches
      const branches = safeJsonParse<BranchModel[]>(localStorage.getItem('branches'));
      if (branches != null) {
        dispatch(setBranchesUser({ branches }));
      }
      // branch select
      const branchSelect = safeJsonParse<BranchModel>(localStorage.getItem('branchSelect'));
      if (branchSelect != null) {
        dispatch(setBranch({ branch: branchSelect }));
      }
      // superStaff
      dispatch(setIsSuperAdmin(safeJsonParse<boolean>(localStorage.getItem('superStaff')) ?? false));
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

  const forgotPassword = async (body: ForgotPasswordRequest): Promise<{ idUser: string; email: string }> => {
    const { data } = await coffeApi.post('/auth/forgot-password', body);
    return data;
  };

  const updateProfile = async (body: UpdateProfileRequest) => {
    const { data } = await coffeApi.patch('/auth/profile', body);
    const newName = `${body.name} ${body.lastName}`;
    localStorage.setItem('user', newName);
    dispatch(onLogin(newName));
    dispatch(setUserProfile({ name: body.name, lastName: body.lastName, email: body.email ?? '' }));
    return data;
  };

  const updatePassword = async (body: UpdatePasswordRequest) => {
    const { data } = await coffeApi.patch('/auth/password', body);
    return data;
  };

  const setBranchSelect = (branch: BranchModel) => {
    if (branch == null) {
      localStorage.removeItem('branchSelect');
      dispatch(setBranch({ branch: null as any }));
      return;
    }
    localStorage.setItem('branchSelect', JSON.stringify(branch));
    dispatch(setBranch({ branch }));
  };


  return {
    //* Propiedades
    status,
    user,
    userId,
    userProfile,
    roleUser,
    showValidateEmail,
    branchesUser,
    branchSelect,
    isSuperAdmin,
    //* Métodos
    startLogin,
    checkAuthToken,
    setShowValidateEmail,
    sendPin,
    validatePin,
    setBranchSelect,
    forgotPassword,
    updateProfile,
    updatePassword,
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
