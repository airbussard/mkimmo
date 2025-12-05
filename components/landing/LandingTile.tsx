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
        'bg-gradient-to-br from-primary-600 to-primary-800',
        'rounded-2xl shadow-lg transition-all duration-300',
        'hover:shadow-2xl hover:scale-[1.02] hover:from-primary-700 hover:to-primary-900',
        'min-h-[300px] md:min-h-[400px]'
      )}
    >
      <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 text-center text-white">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
          <Icon className="w-10 h-10" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">{titel}</h2>
        <p className="text-white/80 mb-6 max-w-xs">{beschreibung}</p>

        <div className="inline-flex items-center text-sm font-medium group-hover:underline">
          Mehr erfahren
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
