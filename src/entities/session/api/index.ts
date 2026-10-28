import { http } from 'shared/api';

export const authApi = {
  login: (initData: string) => http.post<null>('/auth/login', { initData }),
  getMe: () => http.get<null>('/auth/me'),
};
