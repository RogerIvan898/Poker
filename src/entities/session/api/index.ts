import { api } from 'shared/api';

export const authApi = {
  login: (initData: string) => api.post<null>('/auth/login', { initData }),
  getMe: () => api.get<null>('/auth/me'),
};
