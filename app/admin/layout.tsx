import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Auth-Check wird von Middleware gemacht - hier kein Redirect!
  // Wenn kein User, rendere nur children (für Login-Seite)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        <AdminSidebar user={user} />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
