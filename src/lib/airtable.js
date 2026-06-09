const PROFILE_SLUG_FIELD = 'Profile Slug'
const PROFILE_URL_FIELD = 'Profile URL'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://template-sports-recruitment.vercel.app'

export function getAirtableConfig() {
  return {
    apiKey: process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableId: process.env.AIRTABLE_TABLE_ID
  }
}

export function createAthleteSlug(firstName, lastName, fallback = '') {
  const source = `${firstName || ''} ${lastName || ''}`.trim() || fallback
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createProfileUrl(slugOrId) {
  return `${SITE_URL.replace(/\/$/, '')}/athlete/${slugOrId}`
}

function airtableUrl(path = '', query = '') {
  const { baseId, tableId } = getAirtableConfig()
  return `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}${path}${query}`
}

async function airtableRequest(path, options = {}, query = '') {
  const { apiKey, baseId, tableId } = getAirtableConfig()
  if (!apiKey || !baseId || !tableId) {
    throw new Error('Airtable credentials are not configured')
  }

  const response = await fetch(airtableUrl(path, query), {
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

async function airtableMetaRequest(path, options = {}) {
  const { apiKey, baseId } = getAirtableConfig()
  if (!apiKey || !baseId) {
    throw new Error('Airtable credentials are not configured')
  }

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    cache: 'no-store'
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error?.message || 'Airtable metadata request failed')
  }

  return body
}

export async function getAthleteById(id) {
  const record = await airtableRequest(`/${id}`)
  return normalizeAthleteRecord(record)
}

export async function getAthleteBySlug(slug) {
  const formula = encodeURIComponent(`{${PROFILE_SLUG_FIELD}} = '${String(slug).replace(/'/g, "\\'")}'`)
  const result = await airtableRequest('', {}, `?maxRecords=1&filterByFormula=${formula}`)
  const record = result.records?.[0]
  return record ? normalizeAthleteRecord(record) : null
}

export async function getAllAthletes() {
  const result = await airtableRequest('', {}, '?maxRecords=100')
  return (result.records || []).map(normalizeAthleteRecord)
}

export async function getAthleteByIdOrSlug(idOrSlug) {
  if (/^rec[a-zA-Z0-9]+$/.test(idOrSlug)) {
    return getAthleteById(idOrSlug)
  }

  return getAthleteBySlug(idOrSlug)
}

export async function ensureProfileFields() {
  const { tableId } = getAirtableConfig()
  const base = await airtableMetaRequest('/tables')
  const table = base.tables?.find((item) => item.id === tableId || item.name === tableId)

  if (!table) {
    return { skipped: true, reason: 'Airtable table metadata was not found' }
  }

  const existingFields = new Set((table.fields || []).map((field) => field.name))
  const created = []

  for (const fieldName of [PROFILE_SLUG_FIELD, PROFILE_URL_FIELD]) {
    if (!existingFields.has(fieldName)) {
      await airtableMetaRequest(`/tables/${table.id}/fields`, {
        method: 'POST',
        body: JSON.stringify({
          name: fieldName,
          type: 'singleLineText'
        })
      })
      created.push(fieldName)
    }
  }

  return { skipped: false, created }
}

export async function updateAthleteProfileFields(recordId, payload) {
  const slug = createAthleteSlug(payload.firstName, payload.lastName, recordId)
  const profileUrl = createProfileUrl(slug)

  try {
    await ensureProfileFields()
    const record = await airtableRequest(`/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          [PROFILE_SLUG_FIELD]: slug,
          [PROFILE_URL_FIELD]: profileUrl
        }
      })
    })

    return {
      skipped: false,
      id: record.id,
      slug,
      profileUrl
    }
  } catch (error) {
    return {
      skipped: true,
      reason: error.message,
      slug,
      profileUrl
    }
  }
}

export function normalizeAthleteRecord(record) {
  const fields = record.fields || {}
  const firstName = fields['First Name'] || ''
  const lastName = fields['Last Name'] || ''
  const slug = fields[PROFILE_SLUG_FIELD] || createAthleteSlug(firstName, lastName, record.id)

  return {
    id: record.id,
    slug,
    profileUrl: fields[PROFILE_URL_FIELD] || createProfileUrl(slug),
    fields,
    name: `${firstName} ${lastName}`.trim() || 'Athlete Profile',
    position: fields.Position || fields['Primary Position'] || 'Position TBD',
    gradYear: fields['Graduation Year'] || fields.Grade || fields['School Year'] || 'Grad Year TBD',
    school: fields['Current School'] || fields.School || 'School TBD',
    cityProvince: fields['City/Province'] || fields.City || fields.Province || 'Location TBD',
    photoUrl: fields['Athlete Photo'] || fields.Photo || fields['Photo URL'] || '',
    height: fields.Height || 'TBD',
    weight: fields.Weight || 'TBD',
    wingspan: fields.Wingspan || 'TBD',
    gpa: fields.GPA || 'TBD',
    testScore: fields['SAT Score'] || fields['ACT Score'] || fields['SAT / ACT'] || '',
    bio: fields.Bio || fields.Biography || '',
    strengths: fields.Strengths || fields['Scouting Notes'] || '',
    videoUrl: fields['Highlight Video URL'] || fields['Highlight Video'] || '',
    transcriptUrl: fields.Transcript || fields['Transcript URL'] || '',
    evaluationUrl: fields.Evaluation || fields['Evaluation URL'] || '',
    additionalFilesUrl: fields['Additional Files'] || fields['Additional Files URL'] || '',
    status: fields.Status || 'New Prospect'
  }
}
