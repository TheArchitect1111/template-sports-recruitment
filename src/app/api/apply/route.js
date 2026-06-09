import { NextResponse } from 'next/server'
import { getAirtableConfig, updateAthleteProfileFields } from '../../../lib/airtable'
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
    const { baseId, tableId } = getAirtableConfig()
    const airtableResult = await createAirtableRecord(airtableFields)
    const profileResult = airtableResult?.id
      ? await updateAthleteProfileFields(airtableResult.id, payload)
      : { skipped: true, reason: 'Airtable record was not created' }
    const results = await Promise.allSettled([notifyMake({ ...fields, ...profileResult }), sendConfirmationEmail(fields)])

    const integrations = [
      { airtable: airtableResult },
      { profile: profileResult },
      ...results.map((result) =>
        result.status === 'fulfilled'
          ? result.value
          : { skipped: false, ok: false, error: result.reason?.message || 'Integration failed' }
      )
    ]

    return NextResponse.json({
      success: true,
      profileId: airtableResult?.id || null,
      profileSlug: profileResult?.slug || null,
      profileUrl: profileResult?.profileUrl || null,
      airtableDestination: {
        baseId,
        tableId
      },
      integrations
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 })
  }
}
