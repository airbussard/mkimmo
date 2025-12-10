'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ErsteinschaetzungData, NUTZUNGSARTEN } from './types'
import { Users, Euro, ArrowLeft, ArrowRight } from 'lucide-react'

interface Step3Props {
  data: ErsteinschaetzungData
  updateData: (data: Partial<ErsteinschaetzungData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step3Nutzung({ data, updateData, onNext, onBack }: Step3Props) {
  const isValid = data.nutzung && (data.nutzung !== 'vermietet' || data.jahresnettokaltmiete)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Users className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900">Nutzung & Mietsituation</h2>
        <p className="text-secondary-600 mt-2">
          Wie wird die Immobilie aktuell genutzt?
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary-500" />
            Aktuelle Nutzung *
          </Label>
          <RadioGroup
            value={data.nutzung}
            onValueChange={(value) => updateData({ nutzung: value })}
            className="grid gap-3"
          >
            {NUTZUNGSARTEN.map((nutzung) => (
              <label
                key={nutzung.value}
                className="flex items-center space-x-3 p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
              >
                <RadioGroupItem value={nutzung.value} />
                <span className="font-medium">{nutzung.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {data.nutzung === 'vermietet' && (
          <div className="space-y-2 p-4 bg-secondary-50 rounded-lg">
            <Label htmlFor="jahresnettokaltmiete" className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-secondary-500" />
              Jahresnettokaltmiete (EUR) *
            </Label>
            <Input
              id="jahresnettokaltmiete"
              type="number"
              placeholder="z.B. 12000"
              value={data.jahresnettokaltmiete}
              onChange={(e) => updateData({ jahresnettokaltmiete: e.target.value })}
              min="0"
            />
            <p className="text-xs text-secondary-500">
              Die jährliche Kaltmiete ohne Nebenkosten
            </p>
          </div>
        )}
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
