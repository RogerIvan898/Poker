import type { AxiosRequestConfig } from 'axios';

import { api } from './axios';

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then(res => res.data),
  post: <T>(url: string, data: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then(res => res.data),
};
