import { NextResponse } from 'next/server'
import {
  createAirtableRecord,
  normalizeApplicant,
  notifyMake,
  sendConfirmationEmail
} from '../../../lib/integrations'

export async function POST(request) {
  try {
    const payload = await request.json()

    if (!payload.athleteName || !payload.email || !payload.sport) {
      return NextResponse.json(
        { error: 'Athlete name, email, and sport are required' },
        { status: 400 }
      )
    }

    const fields = normalizeApplicant(payload)
    const results = await Promise.allSettled([
      createAirtableRecord(fields),
      notifyMake(fields),
      sendConfirmationEmail(fields)
    ])

    const failed = results.find((result) => result.status === 'rejected')
    if (failed) {
      return NextResponse.json({ error: failed.reason.message }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      integrations: results.map((result) => result.value)
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 })
  }
}
