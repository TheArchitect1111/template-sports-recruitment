import { NextResponse } from 'next/server'

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://cpr-site.vercel.app'
}

async function sendResetEmail({ email, name, portal }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || 'Canadian Prospects <onboarding@resend.dev>'
  const adminEmail = process.env.ADMIN_EMAIL || process.env.CPR_ADMIN_EMAIL

  if (!apiKey || !adminEmail) {
    return { skipped: true, reason: 'Email delivery is not configured' }
  }

  const requester = [name, email].filter(Boolean).join(' - ') || 'Not provided'
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [adminEmail],
      subject: `CPR password reset request${name ? `: ${name}` : ''}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border-top:6px solid #cc0000;border-radius:12px;overflow:hidden;">
            <div style="background:#0a0a0a;color:#ffffff;padding:22px 24px;">
              <h1 style="margin:0;font-size:22px;">Canadian Prospects Recruitment</h1>
              <p style="margin:6px 0 0;color:#d1d5db;">Password reset request</p>
            </div>
            <div style="padding:24px;color:#111827;line-height:1.6;">
              <p><strong>Requester:</strong> ${requester}</p>
              <p><strong>Portal:</strong> ${portal || 'CPR Admin Portal'}</p>
              <p><strong>Login page:</strong> <a href="${getSiteUrl()}/portal">${getSiteUrl()}/portal</a></p>
              <p>Please verify the requester and provide the current admin password or update the Vercel <strong>ADMIN_PASSWORD</strong> environment variable.</p>
            </div>
          </div>
        </div>
      `
    })
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { skipped: false, ok: false, error: body.message || 'Unable to send reset request' }
  }

  return { skipped: false, ok: true, id: body.id }
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}))
  const email = String(payload.email || '').trim()
  const name = String(payload.name || '').trim()
  const portal = String(payload.portal || 'CPR Admin Portal').trim()

  if (!email && !name) {
    return NextResponse.json({ error: 'Enter your name or email so CPR can identify the account.' }, { status: 400 })
  }

  const delivery = await sendResetEmail({ email, name, portal })

  return NextResponse.json({
    ok: true,
    delivery,
    message: delivery.ok
      ? 'Password reset request sent to CPR administration.'
      : 'Password reset request received. Contact CPR administration if you do not hear back shortly.'
  })
}
