'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ErsteinschaetzungData, MIKROLAGEN, INFRASTRUKTUR } from './types'
import { MapPin, Building2, ArrowLeft, ArrowRight } from 'lucide-react'

interface Step4Props {
  data: ErsteinschaetzungData
  updateData: (data: Partial<ErsteinschaetzungData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step4Lage({ data, updateData, onNext, onBack }: Step4Props) {
  const isValid = data.mikrolage

  const toggleInfrastruktur = (value: string) => {
    const current = data.infrastruktur || []
    const updated = current.includes(value)
      ? current.filter((i) => i !== value)
      : [...current, value]
    updateData({ infrastruktur: updated })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <MapPin className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900">Lagekriterien</h2>
        <p className="text-secondary-600 mt-2">
          Die Lage ist einer der wichtigsten Faktoren für die Immobilienbewertung.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="mikrolage" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary-500" />
            Mikrolage (Umgebung) *
          </Label>
          <Select
            value={data.mikrolage}
            onValueChange={(value) => updateData({ mikrolage: value })}
          >
            <SelectTrigger id="mikrolage">
              <SelectValue placeholder="Wie bewerten Sie die direkte Umgebung?" />
            </SelectTrigger>
            <SelectContent>
              {MIKROLAGEN.map((lage) => (
                <SelectItem key={lage.value} value={lage.value}>
                  {lage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-secondary-500">
            Berücksichtigen Sie Nachbarschaft, Straßenbild, Lärm, etc.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="makrolage" className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-secondary-500" />
            Makrolage (Region/Stadtteil)
          </Label>
          <Input
            id="makrolage"
            type="text"
            placeholder="z.B. Eschweiler-Zentrum, Aachen-Süd"
            value={data.makrolage}
            onChange={(e) => updateData({ makrolage: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <Label>Infrastruktur in der Nähe</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INFRASTRUKTUR.map((item) => (
              <label
                key={item.value}
                className="flex items-center space-x-2 p-3 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={data.infrastruktur?.includes(item.value)}
                  onCheckedChange={() => toggleInfrastruktur(item.value)}
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
