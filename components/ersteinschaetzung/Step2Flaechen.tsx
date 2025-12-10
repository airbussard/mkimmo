'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ErsteinschaetzungData, BESONDERHEITEN } from './types'
import { Ruler, Grid3X3, DoorOpen, ArrowLeft, ArrowRight } from 'lucide-react'

interface Step2Props {
  data: ErsteinschaetzungData
  updateData: (data: Partial<ErsteinschaetzungData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step2Flaechen({ data, updateData, onNext, onBack }: Step2Props) {
  const isValid = data.wohnflaeche && data.anzahlZimmer

  const toggleBesonderheit = (value: string) => {
    const current = data.besonderheiten || []
    const updated = current.includes(value)
      ? current.filter((b) => b !== value)
      : [...current, value]
    updateData({ besonderheiten: updated })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Ruler className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900">Wohn- & Nutzflächen</h2>
        <p className="text-secondary-600 mt-2">
          Geben Sie uns Details zu den Flächen und Ausstattungsmerkmalen.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wohnflaeche" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-secondary-500" />
              Wohnfläche (m²) *
            </Label>
            <Input
              id="wohnflaeche"
              type="number"
              placeholder="z.B. 120"
              value={data.wohnflaeche}
              onChange={(e) => updateData({ wohnflaeche: e.target.value })}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grundstuecksflaeche">Grundstücksfläche (m²)</Label>
            <Input
              id="grundstuecksflaeche"
              type="number"
              placeholder="z.B. 500"
              value={data.grundstuecksflaeche}
              onChange={(e) => updateData({ grundstuecksflaeche: e.target.value })}
              min="0"
            />
            <p className="text-xs text-secondary-500">Falls zutreffend</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anzahlZimmer" className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-secondary-500" />
            Anzahl Zimmer *
          </Label>
          <Input
            id="anzahlZimmer"
            type="number"
            placeholder="z.B. 4"
            value={data.anzahlZimmer}
            onChange={(e) => updateData({ anzahlZimmer: e.target.value })}
            min="1"
            step="0.5"
          />
          <p className="text-xs text-secondary-500">Ohne Küche und Bad</p>
        </div>

        <div className="space-y-3">
          <Label>Besonderheiten & Ausstattung</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BESONDERHEITEN.map((item) => (
              <label
                key={item.value}
                className="flex items-center space-x-2 p-3 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={data.besonderheiten?.includes(item.value)}
                  onCheckedChange={() => toggleBesonderheit(item.value)}
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <Button onClick={onNext} disabled={!isValid} size="lg">
          Weiter
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
