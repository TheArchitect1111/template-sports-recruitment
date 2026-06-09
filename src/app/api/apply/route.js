import { NextResponse } from 'next/server'
import {
  createAirtableRecord,
  normalizeAirtableApplicant,
  normalizeApplicant,
  notifyMake,
  sendConfirmationEmail
} from '../../../lib/integrations'

export async function POST(request) {
  try {
    const payload = await request.json()

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.sport) {
      return NextResponse.json(
        { error: 'First name, last name, email, and sport are required' },
        { status: 400 }
      )
    }

    if (!payload.paymentAgreement || !payload.termsAgreement || !payload.digitalSignature) {
      return NextResponse.json(
        { error: 'Fee agreement, terms agreement, and digital signature are required' },
        { status: 400 }
      )
    }

    const fields = normalizeApplicant(payload)
    const airtableFields = normalizeAirtableApplicant(payload)
    const results = await Promise.allSettled([
      createAirtableRecord(airtableFields),
      notifyMake(fields),
      sendConfirmationEmail(fields)
    ])

    const failed = results.find((result) => result.status === 'rejected')
    if (failed) {
      return NextResponse.json({ error: failed.reason.message }, { status: 502 })
    }

    const integrations = results.map((result) => result.value)
    const airtableResult = integrations.find((result) => Object.hasOwn(result, 'id'))

    return NextResponse.json({
      success: true,
      profileId: airtableResult?.id || null,
      integrations
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 })
  }
}
