import type { PropsWithChildren } from 'react'
import { ErrorBoundary } from '@/components/system'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Header, Sidebar } from './'

export const AppLayout = ({ children }: PropsWithChildren) => (
  <SidebarProvider>
    <Sidebar />
    <SidebarInset className='h-screen'>
      <Header />
      <main className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </SidebarInset>
  </SidebarProvider>
)
