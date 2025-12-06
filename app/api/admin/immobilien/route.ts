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

export async function GET() {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Immobilien' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.titel || !body.slug) {
      return NextResponse.json(
        { error: 'Titel und Slug sind erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const row = mapPropertyToRow(body)

    const { data, error } = await supabase
      .from('properties')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error creating property:', error)
      return NextResponse.json(
        { error: error.message || 'Fehler beim Erstellen' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}
