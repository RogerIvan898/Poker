import { api } from '../axios';

export const authApi = {
  login: (initData: string) =>
    api.post<null>('/auth', { initData }).then(res => res.data),
};
