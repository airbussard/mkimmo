import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import {
  Building2,
  FileText,
  MessageSquare,
  Home,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getStats() {
  const supabase = createAdminClient()

  // Parallele Abfragen für Performance
  const [propertiesRes, blogRes, requestsRes, managedRes] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('id', { count: 'exact', head: true }).eq('status', 'neu'),
    supabase.from('managed_properties').select('id', { count: 'exact', head: true }),
  ])

  return {
    immobilien: propertiesRes.count ?? 0,
    blogPosts: blogRes.count ?? 0,
    anfragen: requestsRes.count ?? 0,
    hvObjekte: managedRes.count ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const stats = await getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-1">
          Willkommen zurück, {user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Immobilien</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.immobilien}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Blog-Artikel</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.blogPosts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Neue Anfragen</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.anfragen}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">HV-Objekte</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.hvObjekte}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Schnellzugriff
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/immobilien/neu"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <Building2 className="h-5 w-5 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">
                Neue Immobilie anlegen
              </span>
            </a>
            <a
              href="/admin/blog/neu"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <FileText className="h-5 w-5 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">
                Neuen Blog-Artikel schreiben
              </span>
            </a>
            <a
              href="/admin/anfragen"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-900">
                Anfragen bearbeiten
              </span>
            </a>
          </CardContent>
        </Card>

        {/* Statistik-Hinweis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Statistiken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-secondary-600">
              <p><strong>{stats.immobilien}</strong> Immobilien im Portfolio</p>
              <p><strong>{stats.blogPosts}</strong> Blog-Artikel veröffentlicht</p>
              <p><strong>{stats.anfragen}</strong> neue Anfragen zu bearbeiten</p>
              <p><strong>{stats.hvObjekte}</strong> Objekte in der Hausverwaltung</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
