'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface ClickableTableRowProps {
  href: string
  children: ReactNode
  className?: string
}

export function ClickableTableRow({ href, children, className = '' }: ClickableTableRowProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('[role="combobox"]') ||
      target.closest('[data-radix-select-viewport]')
    ) {
      return
    }
    router.push(href)
  }

  return (
    <tr onClick={handleClick} className={`cursor-pointer ${className}`}>
      {children}
    </tr>
  )
}
