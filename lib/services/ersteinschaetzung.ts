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
  const besonderheitenList = data.besonderheiten.length > 0
    ? data.besonderheiten.map(b => `  - ${getLabelForValue(BESONDERHEITEN, b)}`).join('\n')
    : '  Keine'

  const infrastrukturList = data.infrastruktur.length > 0
    ? data.infrastruktur.map(i => `  - ${getLabelForValue(INFRASTRUKTUR, i)}`).join('\n')
    : '  Keine Angaben'

  const sections = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '       IMMOBILIEN-ERSTEINSCHAETZUNG',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'BASISDATEN',
    '─────────────────────────────────────────',
    `Immobilientyp:  ${getLabelForValue(IMMOBILIENTYPEN, data.immobilientyp)}`,
    `Standort:       ${data.plz} ${data.ort}`,
    `Baujahr:        ${data.baujahr}`,
    `Zustand:        ${getLabelForValue(ZUSTAENDE, data.zustand)}`,
    '',
    'FLAECHEN & AUSSTATTUNG',
    '─────────────────────────────────────────',
    `Wohnflaeche:    ${data.wohnflaeche} m2`,
    data.grundstuecksflaeche ? `Grundstueck:    ${data.grundstuecksflaeche} m2` : null,
    `Zimmer:         ${data.anzahlZimmer}`,
    '',
    'Besonderheiten:',
    besonderheitenList,
    '',
    'NUTZUNG',
    '─────────────────────────────────────────',
    `Aktuell:        ${getLabelForValue(NUTZUNGSARTEN, data.nutzung)}`,
    data.nutzung === 'vermietet' ? `Jahreskaltmiete: ${data.jahresnettokaltmiete} EUR` : null,
    '',
    'LAGE',
    '─────────────────────────────────────────',
    `Mikrolage:      ${getLabelForValue(MIKROLAGEN, data.mikrolage)}`,
    data.makrolage ? `Makrolage:      ${data.makrolage}` : null,
    '',
    'Infrastruktur:',
    infrastrukturList,
    '',
    'ZUSAETZLICHE HINWEISE',
    '─────────────────────────────────────────',
    data.nachricht || 'Keine zusaetzlichen Hinweise angegeben.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ]

  return sections.filter(Boolean).join('\n')
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
          immobilientyp: getLabelForValue(IMMOBILIENTYPEN, data.immobilientyp),
          plz: data.plz,
          ort: data.ort,
          baujahr: data.baujahr,
          zustand: getLabelForValue(ZUSTAENDE, data.zustand),
          wohnflaeche: `${data.wohnflaeche} m2`,
          grundstuecksflaeche: data.grundstuecksflaeche ? `${data.grundstuecksflaeche} m2` : null,
          anzahlZimmer: data.anzahlZimmer,
          besonderheiten: getLabelsForValues(BESONDERHEITEN, data.besonderheiten),
          nutzung: getLabelForValue(NUTZUNGSARTEN, data.nutzung),
          jahresnettokaltmiete: data.jahresnettokaltmiete ? `${data.jahresnettokaltmiete} EUR` : null,
          mikrolage: getLabelForValue(MIKROLAGEN, data.mikrolage),
          makrolage: data.makrolage || null,
          infrastruktur: getLabelsForValues(INFRASTRUKTUR, data.infrastruktur),
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
