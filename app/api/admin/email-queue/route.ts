import { NextRequest, NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import type { EmailQueueStatus } from '@/types/email'

export async function GET(request: NextRequest) {
  try {
    const emailService = new SupabaseEmailService()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') as EmailQueueStatus | null
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 100

    // Get stats and items in parallel
    const [stats, items] = await Promise.all([
      emailService.getQueueStats(),
      emailService.getQueueItems({ status: status || undefined, limit }),
    ])

    return NextResponse.json({
      stats,
      items,
    })
  } catch (error) {
    console.error('[Email Queue API] GET error:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
