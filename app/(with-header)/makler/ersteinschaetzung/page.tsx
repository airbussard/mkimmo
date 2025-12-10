'use client'

import { useState } from 'react'
import { Stepper } from '@/components/ersteinschaetzung/Stepper'
import { Step1Basisdaten } from '@/components/ersteinschaetzung/Step1Basisdaten'
import { Step2Flaechen } from '@/components/ersteinschaetzung/Step2Flaechen'
import { Step3Nutzung } from '@/components/ersteinschaetzung/Step3Nutzung'
import { Step4Lage } from '@/components/ersteinschaetzung/Step4Lage'
import { Step5Kontakt } from '@/components/ersteinschaetzung/Step5Kontakt'
import { ErsteinschaetzungData } from '@/components/ersteinschaetzung/types'
import { submitErsteinschaetzung } from '@/lib/services/ersteinschaetzung'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  { id: 1, title: 'Basisdaten', description: 'Immobilientyp & Standort' },
  { id: 2, title: 'Flächen', description: 'Größe & Ausstattung' },
  { id: 3, title: 'Nutzung', description: 'Aktuelle Nutzung' },
  { id: 4, title: 'Lage', description: 'Lagekriterien' },
  { id: 5, title: 'Kontakt', description: 'Ihre Daten' },
]

const initialData: ErsteinschaetzungData = {
  immobilientyp: '',
  plz: '',
  ort: '',
  baujahr: '',
  zustand: '',
  wohnflaeche: '',
  grundstuecksflaeche: '',
  anzahlZimmer: '',
  besonderheiten: [],
  nutzung: '',
  jahresnettokaltmiete: '',
  mikrolage: '',
  makrolage: '',
  infrastruktur: [],
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  nachricht: '',
  datenschutz: false,
}

export default function ErsteinschaetzungPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ErsteinschaetzungData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateData = (data: Partial<ErsteinschaetzungData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    const result = await submitErsteinschaetzung(formData)

    setIsSubmitting(false)

    if (result.success) {
      setIsSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setError(result.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-[60vh]">
        <section className="bg-gradient-to-b from-secondary-50 to-white py-16 md:py-24 flex-1">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Vielen Dank für Ihre Anfrage!
              </h1>
              <p className="text-lg text-secondary-600 mb-8">
                Wir haben Ihre Daten erhalten und werden uns schnellstmöglich bei Ihnen melden,
                um Ihnen eine fundierte Ersteinschätzung für Ihre Immobilie zu geben.
              </p>
              <Card className="bg-primary-50 border-primary-200 mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary-900 mb-2">Was passiert jetzt?</h3>
                  <ul className="text-left text-primary-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">1.</span>
                      <span>Wir prüfen Ihre Angaben und analysieren die aktuelle Marktlage.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Ein Experte meldet sich innerhalb von 1-2 Werktagen bei Ihnen.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Sie erhalten eine unverbindliche Ersteinschätzung Ihres Immobilienwerts.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/makler">
                    <Home className="w-4 h-4 mr-2" />
                    Zur Startseite
                  </Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/makler/immobilien">
                    Immobilien entdecken
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Kostenlose Ersteinschätzung
            </h1>
            <p className="text-lg text-secondary-600">
              Erhalten Sie eine professionelle Einschätzung des Werts Ihrer Immobilie.
              Kostenlos und unverbindlich.
            </p>
          </div>

          {/* Stepper */}
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6 md:p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                {currentStep === 1 && (
                  <Step1Basisdaten data={formData} updateData={updateData} onNext={handleNext} />
                )}
                {currentStep === 2 && (
                  <Step2Flaechen
                    data={formData}
                    updateData={updateData}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Nutzung
                    data={formData}
                    updateData={updateData}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Lage
                    data={formData}
                    updateData={updateData}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Kontakt
                    data={formData}
                    updateData={updateData}
                    onSubmit={handleSubmit}
                    onBack={handleBack}
                    isSubmitting={isSubmitting}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
