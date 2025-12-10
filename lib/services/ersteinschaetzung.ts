import { ErsteinschaetzungData, IMMOBILIENTYPEN, ZUSTAENDE, NUTZUNGSARTEN, MIKROLAGEN, BESONDERHEITEN, INFRASTRUKTUR } from '@/components/ersteinschaetzung/types'

interface SubmitResult {
  success: boolean
  error?: string
}

function getLabelForValue(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label || value
}

function getLabelsForValues(options: { value: string; label: string }[], values: string[]): string {
  return values.map((v) => getLabelForValue(options, v)).join(', ') || '-'
}

function formatErsteinschaetzungMessage(data: ErsteinschaetzungData): string {
  const lines = [
    '=== IMMOBILIEN-ERSTEINSCHÄTZUNG ===',
    '',
    '📍 BASISDATEN',
    `Immobilientyp: ${getLabelForValue(IMMOBILIENTYPEN, data.immobilientyp)}`,
    `Standort: ${data.plz} ${data.ort}`,
    `Baujahr: ${data.baujahr}`,
    `Zustand: ${getLabelForValue(ZUSTAENDE, data.zustand)}`,
    '',
    '📐 FLÄCHEN & AUSSTATTUNG',
    `Wohnfläche: ${data.wohnflaeche} m²`,
    data.grundstuecksflaeche ? `Grundstücksfläche: ${data.grundstuecksflaeche} m²` : null,
    `Anzahl Zimmer: ${data.anzahlZimmer}`,
    `Besonderheiten: ${getLabelsForValues(BESONDERHEITEN, data.besonderheiten)}`,
    '',
    '🏠 NUTZUNG',
    `Aktuelle Nutzung: ${getLabelForValue(NUTZUNGSARTEN, data.nutzung)}`,
    data.nutzung === 'vermietet' ? `Jahresnettokaltmiete: ${data.jahresnettokaltmiete} EUR` : null,
    '',
    '📍 LAGE',
    `Mikrolage: ${getLabelForValue(MIKROLAGEN, data.mikrolage)}`,
    data.makrolage ? `Makrolage: ${data.makrolage}` : null,
    `Infrastruktur: ${getLabelsForValues(INFRASTRUKTUR, data.infrastruktur)}`,
    '',
    '💬 ZUSÄTZLICHE HINWEISE',
    data.nachricht || 'Keine zusätzlichen Hinweise',
  ]

  return lines.filter(Boolean).join('\n')
}

export async function submitErsteinschaetzung(data: ErsteinschaetzungData): Promise<SubmitResult> {
  try {
    const message = formatErsteinschaetzungMessage(data)

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'makler_ersteinschaetzung',
        name: `${data.vorname} ${data.nachname}`,
        email: data.email,
        phone: data.telefon || undefined,
        message: message,
        metadata: {
          // Alle strukturierten Daten für spätere Auswertung
          immobilientyp: data.immobilientyp,
          plz: data.plz,
          ort: data.ort,
          baujahr: data.baujahr,
          zustand: data.zustand,
          wohnflaeche: data.wohnflaeche,
          grundstuecksflaeche: data.grundstuecksflaeche || null,
          anzahlZimmer: data.anzahlZimmer,
          besonderheiten: data.besonderheiten,
          nutzung: data.nutzung,
          jahresnettokaltmiete: data.jahresnettokaltmiete || null,
          mikrolage: data.mikrolage,
          makrolage: data.makrolage || null,
          infrastruktur: data.infrastruktur,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Fehler beim Senden der Anfrage',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting Ersteinschätzung:', error)
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    }
  }
}
