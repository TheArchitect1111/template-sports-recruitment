export function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID

  return { apiKey, baseId, tableId }
}

export function normalizeApplicant(payload) {
  return {
    'Athlete Name': payload.athleteName,
    'Parent Name': payload.parentName,
    Email: payload.email,
    Phone: payload.phone,
    Sport: payload.sport,
    Position: payload.position,
    'Graduation Year': payload.graduationYear,
    City: payload.city,
    Province: payload.province,
    'Current Team': payload.currentTeam,
    Height: payload.height,
    Weight: payload.weight,
    'GPA or Average': payload.gpa,
    'Highlight URL': payload.highlightUrl,
    Goals: payload.goals,
    Source: 'Canadian Prospects Recruitment',
    'Submitted At': new Date().toISOString()
  }
}

export async function createAirtableRecord(fields) {
  const { apiKey, baseId, tableId } = getAirtableConfig()
  if (!apiKey || !baseId || !tableId) {
    return { skipped: true, reason: 'Airtable credentials are incomplete' }
  }

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error?.message || 'Airtable submission failed')
  }

  return { skipped: false, id: body.id }
}

export async function listAirtableRecords() {
  const { apiKey, baseId, tableId } = getAirtableConfig()
  if (!apiKey || !baseId || !tableId) {
    return { skipped: true, records: [] }
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}?maxRecords=25&sort%5B0%5D%5Bfield%5D=Submitted%20At&sort%5B0%5D%5Bdirection%5D=desc`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      cache: 'no-store'
    }
  )

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error?.message || 'Unable to load Airtable records')
  }

  return { skipped: false, records: body.records || [] }
}

export async function notifyMake(fields) {
  if (!process.env.MAKE_WEBHOOK_URL) {
    return { skipped: true }
  }

  const response = await fetch(process.env.MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields)
  })

  if (!response.ok) {
    throw new Error('Make webhook failed')
  }

  return { skipped: false }
}

export async function sendConfirmationEmail(fields) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !fields.Email) {
    return { skipped: true }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Canadian Prospects <onboarding@resend.dev>',
      to: [fields.Email],
      subject: 'Canadian Prospects profile received',
      html: `
        <p>Hi ${fields['Athlete Name'] || 'there'},</p>
        <p>Your Canadian Prospects Recruitment profile has been received.</p>
        <p>Our team will review the details and follow up with next steps.</p>
      `
    })
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.message || 'Resend email failed')
  }

  return { skipped: false, id: body.id }
}
