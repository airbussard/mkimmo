import Link from 'next/link'
import { Building2, Home, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LandingTileProps {
  titel: string
  beschreibung: string
  href: string
  icon: 'makler' | 'hausverwaltung'
}

export function LandingTile({ titel, beschreibung, href, icon }: LandingTileProps) {
  const Icon = icon === 'makler' ? Home : Building2

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col items-center justify-center p-8 md:p-12',
        'bg-white border border-secondary-200',
        'rounded-2xl shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02] hover:border-primary-300',
        'min-h-[300px] md:min-h-[400px]'
      )}
    >
      <div className="relative z-10 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-100 group-hover:bg-primary-100 transition-colors">
          <Icon className="w-10 h-10 text-secondary-600 group-hover:text-primary-600 transition-colors" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-secondary-900">{titel}</h2>
        <p className="text-secondary-600 mb-6 max-w-xs">{beschreibung}</p>

        <div className="inline-flex items-center text-sm font-medium text-primary-600 group-hover:underline">
          Mehr erfahren
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
