/// <reference types="vite/client" />

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData: string;
      };
    };
  }

  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
}

export {};
