import { NextResponse } from 'next/server'

const DEFAULT_FROM = 'Canadian Prospects <onboarding@resend.dev>'

function cleanEnv(value) {
  const text = String(value || '').trim()
  if (!text || text === '""' || text === "''") return ''
  return text.replace(/^['"]|['"]$/g, '').trim()
}

function getSiteUrl() {
  return cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) || 'https://cpr-site.vercel.app'
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!apiKey || !to) return { skipped: true, reason: 'Email delivery is not configured' }

  const send = (from) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  })

  const preferredFrom = cleanEnv(process.env.RESEND_FROM_EMAIL) || DEFAULT_FROM
  let response = await send(preferredFrom)
  let body = await response.json().catch(() => ({}))

  const message = String(body.message || '')
  if (!response.ok && preferredFrom !== DEFAULT_FROM && message.toLowerCase().includes('domain is not verified')) {
    console.warn('[cpr-password-reset] preferred sender rejected; retrying default sender', { status: response.status })
    response = await send(DEFAULT_FROM)
    body = await response.json().catch(() => ({}))
  }

  if (!response.ok) {
    return { skipped: false, ok: false, status: response.status, error: body.message || 'Resend email failed' }
  }

  return { skipped: false, ok: true, id: body.id, status: response.status }
}

function buildAdminEmail({ name, email, portal }) {
  const requester = [name, email].filter(Boolean).join(' - ') || 'Not provided'
  return `
    <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-top:6px solid #cc0000;border-radius:12px;overflow:hidden;">
        <div style="background:#0a0a0a;color:#ffffff;padding:22px 24px;">
          <h1 style="margin:0;font-size:22px;">Canadian Prospects Recruitment</h1>
          <p style="margin:6px 0 0;color:#d1d5db;">Password reset request</p>
        </div>
        <div style="padding:24px;color:#111827;line-height:1.6;">
          <p><strong>Requester:</strong> ${escapeHtml(requester)}</p>
          <p><strong>Portal:</strong> ${escapeHtml(portal || 'CPR Admin Portal')}</p>
          <p><strong>Login page:</strong> <a href="${getSiteUrl()}/admin">${getSiteUrl()}/admin</a></p>
          <p>Please verify the requester and provide the current admin password or update the Vercel <strong>ADMIN_PASSWORD</strong> environment variable.</p>
        </div>
      </div>
    </div>
  `
}

function buildRequesterEmail({ name }) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-top:6px solid #cc0000;border-radius:12px;overflow:hidden;">
        <div style="background:#0a0a0a;color:#ffffff;padding:22px 24px;">
          <h1 style="margin:0;font-size:22px;">Canadian Prospects Recruitment</h1>
          <p style="margin:6px 0 0;color:#d1d5db;">Reset request received</p>
        </div>
        <div style="padding:24px;color:#111827;line-height:1.6;">
          <p>Hi ${escapeHtml(name || 'there')},</p>
          <p>Your CPR admin password reset request was received and sent to CPR administration.</p>
          <p>For security, CPR does not send the admin password automatically. Administration will verify access and follow up.</p>
          <p><strong>Login page:</strong> <a href="${getSiteUrl()}/admin">${getSiteUrl()}/admin</a></p>
        </div>
      </div>
    </div>
  `
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}))
  const email = String(payload.email || '').trim()
  const name = String(payload.name || '').trim()
  const portal = String(payload.portal || 'CPR Admin Portal').trim()
  const adminEmail = cleanEnv(process.env.ADMIN_EMAIL) || cleanEnv(process.env.CPR_ADMIN_EMAIL)

  console.log('[cpr-password-reset] request received', { hasName: Boolean(name), hasEmail: Boolean(email), hasAdminEmail: Boolean(adminEmail) })

  if (!email && !name) {
    return NextResponse.json({ error: 'Enter your name or email so CPR can identify the account.' }, { status: 400 })
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  const adminDelivery = await sendEmail({
    to: adminEmail,
    subject: `CPR password reset request${name ? `: ${name}` : ''}`,
    html: buildAdminEmail({ name, email, portal }),
    replyTo: email || undefined
  })

  const requesterDelivery = email
    ? await sendEmail({
        to: email,
        subject: 'CPR password reset request received',
        html: buildRequesterEmail({ name })
      })
    : { skipped: true, reason: 'No requester email provided' }

  console.log('[cpr-password-reset] delivery result', {
    adminOk: Boolean(adminDelivery.ok),
    adminSkipped: Boolean(adminDelivery.skipped),
    requesterOk: Boolean(requesterDelivery.ok),
    requesterSkipped: Boolean(requesterDelivery.skipped)
  })

  return NextResponse.json({
    ok: Boolean(adminDelivery.ok || requesterDelivery.ok),
    delivery: { admin: adminDelivery, requester: requesterDelivery },
    message: adminDelivery.ok || requesterDelivery.ok
      ? 'Password reset request sent. Check your email for confirmation and CPR administration will follow up.'
      : 'Password reset request received, but email delivery is not configured. Contact CPR administration directly.'
  })
}
