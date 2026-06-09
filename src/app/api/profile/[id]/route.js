import { NextResponse } from 'next/server'
import { getAirtableRecord } from '../../../../lib/integrations'

export async function GET(_request, { params }) {
  const { id } = await params

  try {
    const result = await getAirtableRecord(id)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to load profile' }, { status: 500 })
  }
}
