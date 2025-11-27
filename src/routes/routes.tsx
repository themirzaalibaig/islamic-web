import type { RouteObject } from 'react-router-dom'
import { About, Home } from '@/pages'
import { AppLayout } from '@/components/layouts'
import { Protected } from '@/features/auth'
import { TestsPage } from '@/features/tests'
import { Quran } from '@/features/quran'
import { Tasbeeh } from '@/features/tasbeeh'
import { PrayerTimes } from '@/features/prayer'
import { Login, Signup, ForgotPassword, ResendVerification, Profile } from '@/features/auth/pages'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AppLayout>
        <Protected>
          <Home />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/quran',
    element: (
      <AppLayout>
        <Protected>
          <Quran />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/tasbeeh',
    element: (
      <AppLayout>
        <Protected>
          <Tasbeeh />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/prayer-times',
    element: (
      <AppLayout>
        <Protected>
          <PrayerTimes />
        </Protected>
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
        <Protected>
          <TestsPage />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/verify-email',
    element: <ResendVerification />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]
