import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ConsentState, ConsentValue } from '@/types/consent'

interface ConsentActions {
  acceptAll: () => void
  denyAll: () => void
  setConsent: (key: keyof Omit<ConsentState, 'hasInteracted'>, value: ConsentValue) => void
  setInteracted: () => void
}

type ConsentStore = ConsentState & ConsentActions

const defaultDenied: Omit<ConsentState, 'hasInteracted'> = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted', // Immer erforderlich
}

const allGranted: Omit<ConsentState, 'hasInteracted'> = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'granted',
  security_storage: 'granted',
}

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set) => ({
      hasInteracted: false,
      ...defaultDenied,
      acceptAll: () =>
        set({
          hasInteracted: true,
          ...allGranted,
        }),
      denyAll: () =>
        set({
          hasInteracted: true,
          ...defaultDenied,
        }),
      setConsent: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
          hasInteracted: true,
        })),
      setInteracted: () => set({ hasInteracted: true }),
    }),
    {
      name: 'mkimmo-consent',
    }
  )
)
