import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'ru'],
  catalogs: [
    {
      path: '<rootDir>/src/shared/lib/i18n/locales/{locale}/messages',
      include: ['src'],
    },
  ],
});
