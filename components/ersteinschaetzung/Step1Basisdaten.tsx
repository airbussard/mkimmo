'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ErsteinschaetzungData, IMMOBILIENTYPEN, ZUSTAENDE } from './types'
import { Home, MapPin, Calendar, Wrench, ArrowRight } from 'lucide-react'

interface Step1Props {
  data: ErsteinschaetzungData
  updateData: (data: Partial<ErsteinschaetzungData>) => void
  onNext: () => void
}

export function Step1Basisdaten({ data, updateData, onNext }: Step1Props) {
  const isValid = data.immobilientyp && data.plz && data.ort && data.baujahr && data.zustand

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Home className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900">Basisdaten zur Immobilie</h2>
        <p className="text-secondary-600 mt-2">
          Beginnen wir mit den grundlegenden Informationen zu Ihrer Immobilie.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="immobilientyp" className="flex items-center gap-2">
            <Home className="w-4 h-4 text-secondary-500" />
            Immobilientyp *
          </Label>
          <Select
            value={data.immobilientyp}
            onValueChange={(value) => updateData({ immobilientyp: value })}
          >
            <SelectTrigger id="immobilientyp">
              <SelectValue placeholder="Bitte wählen" />
            </SelectTrigger>
            <SelectContent>
              {IMMOBILIENTYPEN.map((typ) => (
                <SelectItem key={typ.value} value={typ.value}>
                  {typ.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plz" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary-500" />
              Postleitzahl *
            </Label>
            <Input
              id="plz"
              type="text"
              placeholder="z.B. 52249"
              value={data.plz}
              onChange={(e) => updateData({ plz: e.target.value })}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ort">Ort *</Label>
            <Input
              id="ort"
              type="text"
              placeholder="z.B. Eschweiler"
              value={data.ort}
              onChange={(e) => updateData({ ort: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="baujahr" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary-500" />
            Baujahr *
          </Label>
          <Input
            id="baujahr"
            type="number"
            placeholder="z.B. 1985"
            value={data.baujahr}
            onChange={(e) => updateData({ baujahr: e.target.value })}
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zustand" className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-secondary-500" />
            Zustand *
          </Label>
          <Select value={data.zustand} onValueChange={(value) => updateData({ zustand: value })}>
            <SelectTrigger id="zustand">
              <SelectValue placeholder="Bitte wählen" />
            </SelectTrigger>
            <SelectContent>
              {ZUSTAENDE.map((zustand) => (
                <SelectItem key={zustand.value} value={zustand.value}>
                  {zustand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={onNext} disabled={!isValid} size="lg">
          Weiter
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
