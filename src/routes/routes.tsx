import type { RouteObject } from 'react-router-dom'
import { About, Home } from '@/pages'
import { AppLayout } from '@/components/layouts'
import { Protected } from '@/features/auth'
import { TestsPage } from '@/features/tests'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    path: '/about',
    element: (
      <AppLayout>
        <Protected>
          <About />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/tests',
    element: (
      <AppLayout>
        <TestsPage />
      </AppLayout>
    ),
  },
]
