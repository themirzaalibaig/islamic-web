import { AppLayout } from '@/components/layouts'
import { Protected } from '@/features/auth'

export const Profile = () => {
  return (
    <AppLayout>
      <Protected>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings here.</p>
        </div>
      </Protected>
    </AppLayout>
  )
}

