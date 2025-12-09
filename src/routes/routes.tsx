import type { RouteObject } from 'react-router-dom'
import { About, Home } from '@/pages'
import { AppLayout } from '@/components/layouts'
import { Protected } from '@/features/auth'
import { TestsPage } from '@/features/tests'
import { Quran } from '@/features/quran'
import { Tasbeeh } from '@/features/tasbeeh'
import { PrayerTimes } from '@/features/prayer'
import { Qibla } from '@/features/qibla'
import { Calender } from '@/features/calender'
import { Login, Signup, ForgotPassword, ResendVerification, Profile } from '@/features/auth/pages'
import { Hadith, HadithCollection, HadithBook, HadithDetail } from '@/features/hadith'
import { Dua, DuaDetail } from '@/features/dua'

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
    path: '/hadith',
    element: (
      <AppLayout>
        <Protected>
          <Hadith />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/hadith/:collectionName',
    element: (
      <AppLayout>
        <Protected>
          <HadithCollection />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/hadith/:collectionName/books/:bookNumber',
    element: (
      <AppLayout>
        <Protected>
          <HadithBook />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/hadith/:collectionName/hadiths/:hadithNumber',
    element: (
      <AppLayout>
        <Protected>
          <HadithDetail />
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
    path: '/dua',
    element: (
      <AppLayout>
        <Protected>
          <Dua />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/dua/:id',
    element: (
      <AppLayout>
        <Protected>
          <DuaDetail />
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
    path: '/qibla',
    element: (
      <AppLayout>
        <Protected>
          <Qibla />
        </Protected>
      </AppLayout>
    ),
  },
  {
    path: '/calendar',
    element: (
      <AppLayout>
        <Protected>
          <Calender />
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
