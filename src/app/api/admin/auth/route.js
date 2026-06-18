import { NextResponse } from 'next/server'
import { getAdminAuthError, isValidAdminPassword } from '../../../../lib/adminAuth'

export async function POST(request) {
  const { password } = await request.json()

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: getAdminAuthError() }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
