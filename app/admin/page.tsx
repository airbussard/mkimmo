import { createClient } from '@/lib/supabase/server'
import {
  Building2,
  FileText,
  MessageSquare,
  Home,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // TODO: Echte Daten aus Supabase laden wenn Tabellen existieren
  const stats = {
    immobilien: 6,
    blogPosts: 4,
    anfragen: 0,
    hvObjekte: 3,
  }

  const recentActivity = [
    { type: 'info', message: 'Dashboard initialisiert', time: 'Gerade' },
  ]

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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Letzte Aktivitäten
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-secondary-500 text-center py-4">
                Keine aktuellen Aktivitäten
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary-50"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-secondary-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Phase 1 abgeschlossen</h3>
              <p className="text-sm text-blue-700 mt-1">
                Admin-Authentifizierung ist eingerichtet. Als nächstes: Datenbank-Tabellen
                in Supabase anlegen und Immobilien-Verwaltung implementieren (Phase 2).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
