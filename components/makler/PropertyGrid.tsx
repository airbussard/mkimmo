'use client'

import { useMemo } from 'react'
import { PropertyCard } from './PropertyCard'
import { Property } from '@/types/property'
import { useFilterStore } from '@/store/filterStore'

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const { filters, searchQuery } = useFilterStore()

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Textsuche
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          property.titel.toLowerCase().includes(query) ||
          property.beschreibung.toLowerCase().includes(query) ||
          property.adresse.ort.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Filter
      if (filters.typ && property.typ !== filters.typ) return false
      if (filters.preisMin && property.preis < filters.preisMin) return false
      if (filters.preisMax && property.preis > filters.preisMax) return false
      if (filters.ort && !property.adresse.ort.toLowerCase().includes(filters.ort.toLowerCase()))
        return false
      if (filters.zimmerMin && property.details.zimmer < filters.zimmerMin) return false
      if (filters.flaecheMin && property.details.wohnflaeche < filters.flaecheMin) return false
      if (filters.status && property.status !== filters.status) return false

      return true
    })
  }, [properties, filters, searchQuery])

  if (filteredProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Keine Immobilien gefunden, die Ihren Kriterien entsprechen.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {filteredProperties.length} Immobilie{filteredProperties.length !== 1 ? 'n' : ''} gefunden
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}
