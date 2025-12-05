'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAIN_NAVIGATION, COMPANY_INFO } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/Logo MK Immobilien.png"
              alt={COMPANY_INFO.name}
              width={252}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {MAIN_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
              >
                {item.titel}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild>
              <Link href="/kontakt">Kontakt aufnehmen</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary-600 hover:text-primary-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col space-y-4 pt-4">
            {MAIN_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.titel}
              </Link>
            ))}
            <Button asChild className="w-full">
              <Link href="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                Kontakt aufnehmen
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
