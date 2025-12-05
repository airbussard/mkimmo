'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAIN_NAVIGATION, COMPANY_INFO, NavItem } from '@/config/navigation'
import { cn } from '@/lib/utils'

function NavItemWithDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
      >
        {item.titel}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={item.href}
        className="flex items-center gap-1 text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
      >
        {item.titel}
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </Link>

      {/* Dropdown Menu */}
      <div
        className={cn(
          'absolute left-0 top-full pt-2 w-56 opacity-0 invisible transition-all duration-200',
          isOpen && 'opacity-100 visible'
        )}
      >
        <div className="bg-white rounded-lg shadow-lg border border-secondary-200 py-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 transition-colors"
            >
              <span className="font-medium">{child.titel}</span>
              {child.beschreibung && (
                <span className="block text-xs text-secondary-400 mt-0.5">{child.beschreibung}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/Logo MK Immobilien.png"
              alt={COMPANY_INFO.name}
              width={360}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {MAIN_NAVIGATION.map((item) => (
              <NavItemWithDropdown key={item.href} item={item} />
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
            mobileMenuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col space-y-2 pt-4">
            {MAIN_NAVIGATION.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.titel}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-1.5 text-sm text-secondary-500 transition-colors hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.titel}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                  Kontakt aufnehmen
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
