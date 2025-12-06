'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Slide {
  image: string
  title: string
  subtitle?: string
  cta?: {
    text: string
    href: string
    icon?: React.ReactNode
  }
  ctaSecondary?: {
    text: string
    href: string
  }
}

interface HeroSliderProps {
  slides: Slide[]
  autoPlayInterval?: number
  height?: string
}

export function HeroSlider({
  slides,
  autoPlayInterval = 5000,
  height = 'h-[60vh] md:h-[70vh]'
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, slides.length, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, slides.length, goToSlide])

  useEffect(() => {
    if (autoPlayInterval <= 0) return
    const interval = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlayInterval, nextSlide])

  if (slides.length === 0) return null

  return (
    <section className={`relative ${height} w-full overflow-hidden`}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div
                className={`max-w-3xl mx-auto text-center text-white transition-all duration-700 ${
                  index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                )}
                {(slide.cta || slide.ctaSecondary) && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {slide.cta && (
                      <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8">
                        <Link href={slide.cta.href}>
                          {slide.cta.icon}
                          {slide.cta.text}
                        </Link>
                      </Button>
                    )}
                    {slide.ctaSecondary && (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="text-base md:text-lg px-6 md:px-8 border-white text-white hover:bg-white/10 bg-transparent"
                      >
                        <Link href={slide.ctaSecondary.href}>
                          {slide.ctaSecondary.text}
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Gehe zu Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
