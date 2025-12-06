import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Check if user is authenticated
async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Map frontend property data to database row format
function mapPropertyToRow(property: Record<string, unknown>) {
  const row: Record<string, unknown> = {}

  if (property.titel !== undefined) row.title = property.titel
  if (property.slug !== undefined) row.slug = property.slug
  if (property.typ !== undefined) row.type = property.typ
  if (property.status !== undefined) row.status = property.status
  if (property.preis !== undefined) row.price = property.preis
  if (property.hervorgehoben !== undefined) row.featured = property.hervorgehoben
  if (property.beschreibung !== undefined) row.description = property.beschreibung
  if (property.merkmale !== undefined) row.features = property.merkmale
  if (property.bilder !== undefined) row.images = property.bilder

  const adresse = property.adresse as Record<string, unknown> | undefined
  if (adresse) {
    row.address = {
      street: adresse.strasse ?? '',
      houseNumber: adresse.hausnummer ?? '',
      zip: adresse.plz ?? '',
      city: adresse.ort ?? '',
      bundesland: adresse.bundesland ?? 'nordrhein-westfalen',
      coordinates: adresse.koordinaten ?? null,
    }
  }

  const details = property.details as Record<string, unknown> | undefined
  if (details || property.preistyp !== undefined || property.kurzBeschreibung !== undefined) {
    row.details = {
      livingArea: details?.wohnflaeche ?? 0,
      plotArea: details?.grundstuecksflaeche ?? null,
      rooms: details?.zimmer ?? 0,
      bedrooms: details?.schlafzimmer ?? 0,
      bathrooms: details?.badezimmer ?? 0,
      floor: details?.etage ?? null,
      floors: details?.etagen ?? null,
      yearBuilt: details?.baujahr ?? null,
      lastRenovation: details?.letzteSanierung ?? null,
      heating: details?.heizung ?? 'gas',
      energyCertificate: details?.energieausweis ?? null,
      parkingSpaces: details?.stellplaetze ?? null,
      balcony: details?.balkon ?? false,
      terrace: details?.terrasse ?? false,
      garden: details?.garten ?? false,
      elevator: details?.aufzug ?? false,
      basement: details?.keller ?? false,
      furnished: details?.moebliert ?? false,
      priceType: property.preistyp ?? 'kauf',
      shortDescription: property.kurzBeschreibung ?? '',
    }
  }

  return row
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return NextResponse.json(
        { error: 'Immobilie nicht gefunden' },
        { status: 404 }
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

  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createAdminClient()
    const row = mapPropertyToRow(body)

    const { data, error } = await supabase
      .from('properties')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating property:', error)
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

  try {
    const { id } = await params
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting property:', error)
      return NextResponse.json(
        { error: error.message || 'Fehler beim Löschen' },
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
