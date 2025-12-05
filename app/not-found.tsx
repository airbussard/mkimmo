import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Seite nicht gefunden</h2>
        <p className="text-muted-foreground mb-8">
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Zur Startseite
          </Link>
        </Button>
      </div>
    </div>
  )
}
