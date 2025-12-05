'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  lat: number
  lng: number
  titel?: string
  className?: string
}

export function PropertyMap({ lat, lng, titel, className = 'h-[300px]' }: PropertyMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`bg-secondary-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-secondary-400">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Karte wird geladen...</span>
        </div>
      </div>
    )
  }

  // Dynamischer Import von Leaflet nur auf Client-Seite
  const MapContainer = require('react-leaflet').MapContainer
  const TileLayer = require('react-leaflet').TileLayer
  const Marker = require('react-leaflet').Marker
  const Popup = require('react-leaflet').Popup

  // Leaflet CSS importieren
  require('leaflet/dist/leaflet.css')

  // Fix für Leaflet Marker Icons
  const L = require('leaflet')
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          {titel && <Popup>{titel}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  )
}
