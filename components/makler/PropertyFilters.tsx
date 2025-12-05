'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useFilterStore } from '@/store/filterStore'
import { PROPERTY_TYPE_NAMEN, PropertyType } from '@/types/property'

export function PropertyFilters() {
  const { filters, searchQuery, setFilter, setSearchQuery, clearFilters } = useFilterStore()

  const hasActiveFilters =
    searchQuery ||
    filters.typ ||
    filters.preisMin ||
    filters.preisMax ||
    filters.ort ||
    filters.zimmerMin

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Suchfeld */}
        <div className="lg:col-span-2">
          <Label htmlFor="search" className="text-sm mb-1.5 block">
            Suche
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Titel, Ort oder Beschreibung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Objektart */}
        <div>
          <Label htmlFor="typ" className="text-sm mb-1.5 block">
            Objektart
          </Label>
          <Select
            value={filters.typ || 'alle'}
            onValueChange={(value) =>
              setFilter('typ', value === 'alle' ? undefined : (value as PropertyType))
            }
          >
            <SelectTrigger id="typ">
              <SelectValue placeholder="Alle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle</SelectItem>
              {Object.entries(PROPERTY_TYPE_NAMEN).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preis bis */}
        <div>
          <Label htmlFor="preisMax" className="text-sm mb-1.5 block">
            Preis bis
          </Label>
          <Select
            value={filters.preisMax?.toString() || 'alle'}
            onValueChange={(value) =>
              setFilter('preisMax', value === 'alle' ? undefined : parseInt(value))
            }
          >
            <SelectTrigger id="preisMax">
              <SelectValue placeholder="Alle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle</SelectItem>
              <SelectItem value="100000">bis 100.000 €</SelectItem>
              <SelectItem value="200000">bis 200.000 €</SelectItem>
              <SelectItem value="300000">bis 300.000 €</SelectItem>
              <SelectItem value="500000">bis 500.000 €</SelectItem>
              <SelectItem value="750000">bis 750.000 €</SelectItem>
              <SelectItem value="1000000">bis 1.000.000 €</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Zimmer ab */}
        <div>
          <Label htmlFor="zimmerMin" className="text-sm mb-1.5 block">
            Zimmer ab
          </Label>
          <Select
            value={filters.zimmerMin?.toString() || 'alle'}
            onValueChange={(value) =>
              setFilter('zimmerMin', value === 'alle' ? undefined : parseInt(value))
            }
          >
            <SelectTrigger id="zimmerMin">
              <SelectValue placeholder="Alle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle</SelectItem>
              <SelectItem value="1">ab 1</SelectItem>
              <SelectItem value="2">ab 2</SelectItem>
              <SelectItem value="3">ab 3</SelectItem>
              <SelectItem value="4">ab 4</SelectItem>
              <SelectItem value="5">ab 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter zurücksetzen */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </div>
  )
}
