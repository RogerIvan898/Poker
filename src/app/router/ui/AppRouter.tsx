import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '../config/routes';

export const AppRouter = () => (
  <Suspense fallback={<div>Загрузка страницы...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);
