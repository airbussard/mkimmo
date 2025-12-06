import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artikel nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Error fetching blog post:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { titel, slug, inhalt, kurzBeschreibung, autor, bild, kategorieId, status } = body

    const supabase = createAdminClient()

    // Get existing post to check if status is changing to published
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('status')
      .eq('id', id)
      .single()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (titel !== undefined) updateData.title = titel
    if (slug !== undefined) updateData.slug = slug
    if (inhalt !== undefined) updateData.content = inhalt
    if (kurzBeschreibung !== undefined) updateData.excerpt = kurzBeschreibung
    if (autor !== undefined) updateData.author = autor
    if (bild !== undefined) updateData.image = bild
    if (kategorieId !== undefined) updateData.category_id = kategorieId || null
    if (status !== undefined) {
      updateData.status = status
      // Set published_at if changing to published
      if (status === 'published' && existing?.status !== 'published') {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select('*, blog_categories(*)')
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return NextResponse.json(
        { error: error.message || 'Fehler beim Aktualisieren' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json(
        { error: 'Fehler beim Löschen' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}
