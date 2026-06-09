import { NextResponse } from 'next/server'
import { listAirtableRecords } from '../../../../lib/integrations'

export async function POST(request) {
  const { password } = await request.json()

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await listAirtableRecords()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to load leads' }, { status: 500 })
  }
}
