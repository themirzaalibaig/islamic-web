import type { PropsWithChildren } from 'react'
import { ErrorBoundary } from '@/components/system'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Header, Sidebar } from './'
import { AccessibilityComponet, Chatbot, ChatbotProvider } from '@/components/custom'
import { FiqahDialog } from '@/components/custom/FiqahDialog'

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <ChatbotProvider>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="h-screen">
          <Header />
          <main className="flex-1 p-4 app-scrollbar">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <AccessibilityComponet />
        </SidebarInset>
        <FiqahDialog />
        <Chatbot />
      </SidebarProvider>
    </ChatbotProvider>
  )
}
