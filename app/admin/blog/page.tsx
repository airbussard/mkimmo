export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, FileText, Pencil, Trash2, Eye, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabaseBlogService } from '@/lib/services/supabase/SupabaseBlogService'
import { BLOG_POST_STATUS_NAMEN } from '@/types/blog'
import { DeleteBlogPostButton } from '@/components/admin/DeleteBlogPostButton'

function getStatusColor(status: string): string {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function AdminBlogPage() {
  const blogService = new SupabaseBlogService()
  const [posts, categories] = await Promise.all([
    blogService.getAll(),
    blogService.getCategories(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Blog</h1>
          <p className="text-secondary-600 mt-1">
            {posts.length} Artikel, {categories.length} Kategorien
          </p>
        </div>
        <Link href="/admin/blog/neu">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neuer Artikel
          </Button>
        </Link>
      </div>

      {/* Categories Quick View */}
      {categories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary-600" />
              Kategorien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Alle Artikel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Keine Artikel vorhanden
              </h3>
              <p className="text-secondary-600 mb-4">
                Erstellen Sie Ihren ersten Blog-Artikel.
              </p>
              <Link href="/admin/blog/neu">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ersten Artikel schreiben
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Titel
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Kategorie
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Autor
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Datum
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-secondary-600">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-secondary-100 hover:bg-secondary-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {post.titel}
                          </p>
                          <p className="text-sm text-secondary-500 truncate max-w-xs">
                            {post.kurzBeschreibung}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-700">
                        {post.kategorie?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-secondary-700">
                        {post.autor || '-'}
                      </td>
                      <td className="py-3 px-4 text-secondary-700">
                        {post.veroeffentlichtAm
                          ? formatDate(post.veroeffentlichtAm)
                          : formatDate(post.erstelltAm)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {BLOG_POST_STATUS_NAMEN[post.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/makler/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                            title="Ansehen"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Bearbeiten"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeleteBlogPostButton
                            postId={post.id}
                            postTitle={post.titel}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
