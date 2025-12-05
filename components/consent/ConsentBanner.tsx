'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useConsentStore } from '@/store/consentStore'
import { CONSENT_CATEGORIES } from '@/types/consent'
import { cn } from '@/lib/utils'

export function ConsentBanner() {
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { hasInteracted, acceptAll, denyAll, setConsent, ...consentValues } = useConsentStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Google Consent Mode v2 aktualisieren
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      // @ts-expect-error gtag wird von Google Analytics bereitgestellt
      if (window.gtag) {
        // @ts-expect-error gtag wird von Google Analytics bereitgestellt
        window.gtag('consent', 'update', {
          analytics_storage: consentValues.analytics_storage,
          ad_storage: consentValues.ad_storage,
          ad_user_data: consentValues.ad_user_data,
          ad_personalization: consentValues.ad_personalization,
        })
      }
    }
  }, [consentValues, mounted])

  if (!mounted || hasInteracted) {
    return null
  }

  const handleAcceptAll = () => {
    acceptAll()
    setShowSettings(false)
  }

  const handleDenyAll = () => {
    denyAll()
    setShowSettings(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Cookie-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Wir verwenden Cookies und ähnliche Technologien, um Ihnen ein optimales Website-Erlebnis zu bieten.
            Einige sind für den Betrieb der Website erforderlich, andere helfen uns, die Website zu verbessern.
            Weitere Informationen finden Sie in unserer{' '}
            <Link href="/datenschutz" className="text-primary-600 hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>

          {showSettings && (
            <div className="space-y-4 mb-4 p-4 bg-secondary-50 rounded-lg">
              {CONSENT_CATEGORIES.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor={category.id} className="font-medium">
                      {category.name}
                      {category.erforderlich && (
                        <span className="ml-2 text-xs text-muted-foreground">(erforderlich)</span>
                      )}
                    </Label>
                    <p className="text-xs text-muted-foreground">{category.beschreibung}</p>
                  </div>
                  <Switch
                    id={category.id}
                    checked={consentValues[category.id] === 'granted'}
                    onCheckedChange={(checked) =>
                      setConsent(category.id, checked ? 'granted' : 'denied')
                    }
                    disabled={category.erforderlich}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDenyAll}>
              Nur Notwendige
            </Button>
            <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? 'Einstellungen ausblenden' : 'Einstellungen'}
            </Button>
            <Button onClick={handleAcceptAll}>Alle akzeptieren</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
