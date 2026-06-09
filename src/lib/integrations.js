export function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID

  return { apiKey, baseId, tableId }
}

export function normalizeApplicant(payload) {
  return {
    'First Name': payload.firstName,
    'Last Name': payload.lastName,
    Email: payload.email,
    Phone: payload.phone,
    'Date of Birth': payload.dateOfBirth,
    Sport: payload.sport,
    Position: payload.position,
    Height: payload.height,
    Weight: payload.weight,
    Wingspan: payload.wingspan,
    GPA: payload.gpa,
    'SAT Score': payload.satScore,
    'Current School': payload.currentSchool,
    'Graduation Year': payload.graduationYear,
    'City/Province': payload.cityProvince,
    'Parent Name': payload.parentName,
    'Parent Email': payload.parentEmail,
    'Parent Phone': payload.parentPhone,
    Bio: payload.bio,
    Strengths: payload.strengths,
    'Highlight Video URL': payload.highlightVideoUrl,
    'Photo Upload': payload.photoUpload,
    'Transcript Upload': payload.transcriptUpload,
    'Gameplay Video Upload': payload.gameplayVideoUpload,
    'Fee Agreement': payload.paymentAgreement ? 'Acknowledged 3 payments of $500 each' : 'Not acknowledged',
    'NIL Interest': payload.nilInterest ? 'Yes' : 'No',
    'Terms Agreement': payload.termsAgreement ? 'Agreed' : 'Not agreed',
    'Digital Signature': payload.digitalSignature,
    Status: 'New',
    Source: 'Canadian Prospects Recruitment',
    'Submitted At': new Date().toISOString()
  }
}

export function normalizeAirtableApplicant(payload) {
  return {
    'First Name': payload.firstName,
    'Last Name': payload.lastName,
    Email: payload.email,
    Phone: payload.phone,
    'Date of Birth': payload.dateOfBirth,
    Sport: payload.sport
  }
}

function getAirtableUrl(path = '', query = '') {
  const { baseId, tableId } = getAirtableConfig()
  return `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}${path}${query}`
}

async function airtableFetch(path, options = {}, query = '') {
  const { apiKey, baseId, tableId } = getAirtableConfig()
  if (!apiKey || !baseId || !tableId) {
    return { skipped: true, records: [] }
  }

  const response = await fetch(getAirtableUrl(path, query), {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    cache: options.cache || 'no-store'
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error?.message || 'Airtable request failed')
  }

  return body
}

export async function createAirtableRecord(fields) {
  const result = await airtableFetch('', {
    method: 'POST',
    body: JSON.stringify({ fields })
  })

  if (result.skipped) {
    return { skipped: true, reason: 'Airtable credentials are incomplete' }
  }

  return { skipped: false, id: result.id }
}

export async function listAirtableRecords() {
  const query = '?maxRecords=100'
  const result = await airtableFetch('', {}, query)

  if (result.skipped) {
    return { skipped: true, records: [] }
  }

  return { skipped: false, records: result.records || [] }
}

export async function getAirtableRecord(id) {
  const result = await airtableFetch(`/${id}`)

  if (result.skipped) {
    return { skipped: true, record: null }
  }

  return { skipped: false, record: result }
}

export async function updateAirtableStatus(id, status) {
  return {
    skipped: true,
    reason: `Status was not updated in Airtable because the current table does not include a Status field. Requested status: ${status}`,
    record: { id, fields: {} }
  }
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
      subject: 'Canadian Prospects application received',
      html: `
        <p>Hi ${fields['First Name'] || 'there'},</p>
        <p>Your Canadian Prospects Recruitment application has been received.</p>
        <p>Our team will review your profile, film, academics, and fee agreement details.</p>
      `
    })
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.message || 'Resend email failed')
  }

  return { skipped: false, id: body.id }
}
