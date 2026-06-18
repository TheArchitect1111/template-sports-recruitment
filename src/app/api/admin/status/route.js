import { NextResponse } from 'next/server'
import { getAdminAuthError, isValidAdminPassword } from '../../../../lib/adminAuth'
import { updateAirtableStatus } from '../../../../lib/integrations'

const allowedStatuses = ['New', 'Reviewing', 'Contacted', 'Placed', 'Closed']

export async function POST(request) {
  const { password, id, status } = await request.json()

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: getAdminAuthError() }, { status: 401 })
  }

  if (!id || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Valid record ID and status are required' }, { status: 400 })
  }

  try {
    const result = await updateAirtableStatus(id, status)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to update status' }, { status: 500 })
  }
}
