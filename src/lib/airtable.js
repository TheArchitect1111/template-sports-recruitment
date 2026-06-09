const PROFILE_SLUG_FIELD = 'Profile Slug'
const PROFILE_URL_FIELD = 'Profile URL'
const PUBLIC_FIELD = 'Public'
const PROFILE_SITE_URL = process.env.PROFILE_SITE_URL || 'https://template-sports-recruitment.vercel.app'

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
  return `${PROFILE_SITE_URL.replace(/\/$/, '')}/athlete/${slugOrId}`
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
    const error = new Error(body.error?.message || 'Airtable request failed')
    error.status = response.status
    error.code = body.error?.type
    error.airtableBody = body
    throw error
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
    const error = new Error(body.error?.message || 'Airtable metadata request failed')
    error.status = response.status
    error.code = body.error?.type
    error.airtableBody = body
    throw error
  }

  return body
}

function isAirtableNotFound(error) {
  return error?.status === 404 || error?.code === 'MODEL_ID_NOT_FOUND'
}

function escapeFormulaValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export async function getAthleteById(id) {
  try {
    const record = await airtableRequest(`/${id}`)
    return normalizeAthleteRecord(record)
  } catch (error) {
    if (isAirtableNotFound(error)) {
      return null
    }

    throw error
  }
}

export async function getAthleteBySlug(slug) {
  const cleanSlug = String(slug || '').trim().toLowerCase()
  const formula = encodeURIComponent(`LOWER({${PROFILE_SLUG_FIELD}}) = '${escapeFormulaValue(cleanSlug)}'`)

  try {
    const result = await airtableRequest('', {}, `?maxRecords=1&filterByFormula=${formula}`)
    const record = result.records?.[0]
    if (record) {
      return normalizeAthleteRecord(record)
    }
  } catch (error) {
    if (!/Unknown field name/i.test(error.message || '')) {
      throw error
    }
  }

  const athletes = await getAllAthletes()
  return athletes.find((athlete) => athlete.slug === cleanSlug) || null
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

  const requiredFields = [
    { name: PROFILE_SLUG_FIELD, type: 'singleLineText' },
    { name: PROFILE_URL_FIELD, type: 'url' },
    { name: PUBLIC_FIELD, type: 'checkbox', options: { icon: 'check', color: 'greenBright' } }
  ]

  for (const field of requiredFields) {
    if (!existingFields.has(field.name)) {
      const body = {
        name: field.name,
        type: field.type
      }

      if (field.options) {
        body.options = field.options
      }

      await airtableMetaRequest(`/tables/${table.id}/fields`, {
        method: 'POST',
        body: JSON.stringify(body)
      })
      created.push(field.name)
    }
  }

  return { skipped: false, created }
}

async function patchAthleteProfileFields(recordId, fields) {
  const record = await airtableRequest(`/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields })
  })

  return record
}

function isUnknownFieldError(error) {
  return /Unknown field name/i.test(error?.message || '')
}

export async function updateAthleteProfileFields(recordId, payload) {
  const slug = createAthleteSlug(payload.firstName, payload.lastName, recordId)
  const profileUrl = createProfileUrl(slug)
  const profileFields = {
    [PROFILE_SLUG_FIELD]: slug,
    [PROFILE_URL_FIELD]: profileUrl,
    [PUBLIC_FIELD]: true
  }

  try {
    const record = await patchAthleteProfileFields(recordId, profileFields)
    return {
      skipped: false,
      id: record.id,
      slug,
      profileUrl
    }
  } catch (firstError) {
    try {
      if (isUnknownFieldError(firstError)) {
        await ensureProfileFields()
      }

      const record = await patchAthleteProfileFields(recordId, profileFields)
      return {
        skipped: false,
        id: record.id,
        slug,
        profileUrl
      }
    } catch (secondError) {
      try {
        const record = await patchAthleteProfileFields(recordId, {
          [PROFILE_SLUG_FIELD]: slug,
          [PROFILE_URL_FIELD]: profileUrl
        })
        return {
          skipped: false,
          id: record.id,
          slug,
          profileUrl,
          publicSkipped: true,
          publicReason: secondError.message
        }
      } catch (thirdError) {
        return {
          skipped: true,
          reason: thirdError.message,
          slug,
          profileUrl
        }
      }
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
