import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { FOOTER_NAVIGATION, COMPANY_INFO } from '@/config/navigation'
import { APP_VERSION } from '@/config/version'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary-900 text-secondary-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Unternehmen Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{COMPANY_INFO.name}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary-400" />
                <div>
                  <p>{COMPANY_INFO.strasse}</p>
                  <p>
                    {COMPANY_INFO.plz} {COMPANY_INFO.ort}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <a href={`tel:${COMPANY_INFO.telefon}`} className="hover:text-primary-400 transition-colors">
                  {COMPANY_INFO.telefon}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary-400 transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Unternehmen Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_NAVIGATION.unternehmen.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_NAVIGATION.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_NAVIGATION.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-sm text-secondary-400">
          <p>
            &copy; {currentYear} {COMPANY_INFO.name}. Alle Rechte vorbehalten.
          </p>
          <p className="mt-1 text-secondary-500 text-xs">
            Version {APP_VERSION}
          </p>
        </div>
      </div>
    </footer>
  )
}
