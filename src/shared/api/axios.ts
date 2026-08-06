import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

let inMemoryAccessToken: string | null = null;
let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  config.headers['X-Requested-With'] = 'TelegramMiniApp';

  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      if (isRefreshing) {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(
            err instanceof Error ? err : new Error(String(err))
          );
        }
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${API_URL}/refresh`,
          {},
          {
            withCredentials: true,
            headers: { 'X-Requested-With': 'TelegramMiniApp' },
          }
        );

        setAccessToken(data.accessToken);

        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);

        const finalError =
          refreshError instanceof Error
            ? refreshError
            : new Error(String(refreshError));

        processQueue(finalError, null);

        return Promise.reject(finalError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
