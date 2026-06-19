import { NextResponse } from 'next/server'
import { getAthleteByIdOrSlug } from '../../../../lib/airtable'

export async function GET(_request, { params }) {
  const { id } = await params

  try {
    const athlete = await getAthleteByIdOrSlug(id)
    if (!athlete) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ skipped: false, record: athlete })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to load profile' }, { status: 500 })
  }
}
