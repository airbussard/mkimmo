'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.id} className={cn('relative', index !== steps.length - 1 && 'flex-1')}>
            <div className="flex items-center">
              <div
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  currentStep > step.id
                    ? 'border-primary-600 bg-primary-600'
                    : currentStep === step.id
                    ? 'border-primary-600 bg-white'
                    : 'border-secondary-300 bg-white'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      currentStep === step.id ? 'text-primary-600' : 'text-secondary-400'
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    'ml-4 h-0.5 flex-1 transition-colors',
                    currentStep > step.id ? 'bg-primary-600' : 'bg-secondary-200'
                  )}
                />
              )}
            </div>
            <div className="mt-2 hidden md:block">
              <p
                className={cn(
                  'text-xs font-medium',
                  currentStep >= step.id ? 'text-primary-600' : 'text-secondary-500'
                )}
              >
                {step.title}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 md:hidden">
        <p className="text-sm font-medium text-primary-600">
          Schritt {currentStep} von {steps.length}: {steps[currentStep - 1]?.title}
        </p>
      </div>
    </nav>
  )
}
