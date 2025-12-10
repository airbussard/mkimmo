'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ErsteinschaetzungData } from './types'
import { User, Mail, Phone, MessageSquare, ArrowLeft, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Step5Props {
  data: ErsteinschaetzungData
  updateData: (data: Partial<ErsteinschaetzungData>) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function Step5Kontakt({ data, updateData, onSubmit, onBack, isSubmitting }: Step5Props) {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  const isValid = data.vorname && data.nachname && data.email && isValidEmail && data.datenschutz

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <User className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900">Ihre Kontaktdaten</h2>
        <p className="text-secondary-600 mt-2">
          Um Ihre personalisierte Ersteinschätzung zu erhalten, geben Sie bitte Ihre Kontaktdaten an.
          Wir melden uns zeitnah bei Ihnen.
        </p>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-primary-800">
          <strong>Hinweis:</strong> Ihre Daten werden vertraulich behandelt und nur zur Bearbeitung
          Ihrer Anfrage verwendet. Sie erhalten keine unerwünschte Werbung.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vorname" className="flex items-center gap-2">
              <User className="w-4 h-4 text-secondary-500" />
              Vorname *
            </Label>
            <Input
              id="vorname"
              type="text"
              placeholder="Ihr Vorname"
              value={data.vorname}
              onChange={(e) => updateData({ vorname: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nachname">Nachname *</Label>
            <Input
              id="nachname"
              type="text"
              placeholder="Ihr Nachname"
              value={data.nachname}
              onChange={(e) => updateData({ nachname: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-secondary-500" />
            E-Mail-Adresse *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ihre@email.de"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefon" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-secondary-500" />
            Telefonnummer
          </Label>
          <Input
            id="telefon"
            type="tel"
            placeholder="z.B. 0241 12345678"
            value={data.telefon}
            onChange={(e) => updateData({ telefon: e.target.value })}
          />
          <p className="text-xs text-secondary-500">Optional, für Rückfragen</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nachricht" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-secondary-500" />
            Nachricht / Hinweise
          </Label>
          <Textarea
            id="nachricht"
            placeholder="Gibt es besondere Umstände oder zusätzliche Informationen, die wir berücksichtigen sollten?"
            value={data.nachricht}
            onChange={(e) => updateData({ nachricht: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
          <Checkbox
            id="datenschutz"
            checked={data.datenschutz}
            onCheckedChange={(checked) => updateData({ datenschutz: checked === true })}
          />
          <label htmlFor="datenschutz" className="text-sm text-secondary-700 cursor-pointer">
            Ich habe die{' '}
            <Link href="/datenschutz" target="_blank" className="text-primary-600 hover:underline">
              Datenschutzerklärung
            </Link>{' '}
            gelesen und bin mit der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage
            einverstanden. *
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} size="lg" disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <Button onClick={onSubmit} disabled={!isValid || isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Kostenlose Ersteinschätzung anfordern
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
