export function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID

  return { apiKey, baseId, tableId }
}

function normalizeSchoolYear(value) {
  const text = String(value || '').trim()
  if (/^grade\s+\d{1,2}$/i.test(text)) {
    return text.replace(/^grade/i, 'Grade')
  }

  if (/^\d{1,2}$/.test(text)) {
    return `Grade ${text}`
  }

  return text
}

const sportOptions = ['Basketball', 'Football', 'Baseball', 'Soccer', 'Volleyball', 'Track', 'Other']
const REQUIRED_AIRTABLE_FIELDS = [
  { name: 'First Name', type: 'singleLineText' },
  { name: 'Last Name', type: 'singleLineText' },
  { name: 'Email', type: 'email' },
  { name: 'Phone', type: 'phoneNumber' },
  { name: 'Date of Birth', type: 'singleLineText' },
  { name: 'Sport', type: 'singleSelect', options: { choices: sportOptions.map((name) => ({ name })) } },
  { name: 'Position', type: 'singleLineText' },
  { name: 'Height', type: 'singleLineText' },
  { name: 'Weight', type: 'singleLineText' },
  { name: 'Wingspan', type: 'singleLineText' },
  { name: 'School', type: 'singleLineText' },
  { name: 'Grad Year', type: 'singleLineText' },
  { name: 'GPA', type: 'singleLineText' },
  { name: 'SAT / ACT', type: 'singleLineText' },
  { name: 'Bio', type: 'multilineText' },
  { name: 'Strengths', type: 'multilineText' },
  { name: 'Highlight Video', type: 'url' },
  { name: 'Photo URL', type: 'url' },
  { name: 'Status', type: 'singleSelect', options: { choices: ['New', 'Reviewing', 'Contacted', 'Placed', 'Closed'].map((name) => ({ name })) } }
]
const AIRTABLE_FIELD_ALIASES = {
  School: ['Current School'],
  'Grad Year': ['Graduation Year', 'Grade', 'School Year'],
  'SAT / ACT': ['SAT Score', 'ACT Score'],
  'Highlight Video': ['Highlight Video URL'],
  'Photo URL': ['Photo Upload', 'Athlete Photo', 'Photo']
}

function normalizeSport(value) {
  const text = String(value || '').trim()
  const match = sportOptions.find((sport) => sport.toLowerCase() === text.toLowerCase())
  return match || 'Other'
}

function normalizeNumber(value) {
  const text = String(value || '').trim()
  if (!text) {
    return ''
  }

  const match = text.match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : text
}

export function normalizeApplicant(payload) {
  const schoolYear = normalizeSchoolYear(payload.graduationYear)
  const sport = normalizeSport(payload.sport)

  return {
    'First Name': payload.firstName,
    'Last Name': payload.lastName,
    Email: payload.email,
    Phone: payload.phone,
    'Date of Birth': payload.dateOfBirth,
    Sport: sport,
    Position: payload.position,
    Height: payload.height,
    Weight: normalizeNumber(payload.weight),
    Wingspan: payload.wingspan,
    GPA: normalizeNumber(payload.gpa),
    'SAT / ACT': normalizeNumber(payload.satScore),
    School: payload.currentSchool,
    'Grad Year': schoolYear,
    Grade: schoolYear,
    'School Year': schoolYear,
    Classification: schoolYear,
    'City/Province': payload.cityProvince,
    'Parent Name': payload.parentName,
    'Parent Email': payload.parentEmail,
    'Parent Phone': payload.parentPhone,
    Bio: payload.bio,
    Strengths: payload.strengths,
    'Highlight Video': payload.highlightVideoUrl,
    'Photo URL': payload.profilePhotoUrl,
    'Photo Upload': payload.photoUpload,
    'Transcript Upload': payload.transcriptUpload,
    'Gameplay Video Upload': payload.gameplayVideoUpload,
    'Fee Agreement': payload.paymentAgreement ? 'Acknowledged 3 payments of $500 each' : 'Not acknowledged',
    'NIL Interest': payload.nilInterest ? 'Yes' : 'No',
    'Family Portal Opt-In': payload.familyPortalOptIn ? 'Yes' : 'No',
    'Terms Agreement': payload.termsAgreement ? 'Agreed' : 'Not agreed',
    'Digital Signature': payload.digitalSignature,
    Status: 'New',
    Source: 'Canadian Prospects Recruitment',
    'Submitted At': new Date().toISOString()
  }
}

export function normalizeAirtableApplicant(payload) {
  const schoolYear = normalizeSchoolYear(payload.graduationYear)
  const sport = normalizeSport(payload.sport)

  return removeEmptyFields({
    'First Name': payload.firstName,
    'Last Name': payload.lastName,
    Email: payload.email,
    Phone: payload.phone,
    'Date of Birth': payload.dateOfBirth,
    Sport: sport,
    Position: payload.position,
    Height: payload.height,
    Weight: normalizeNumber(payload.weight),
    Wingspan: payload.wingspan,
    School: payload.currentSchool,
    'Grad Year': schoolYear,
    GPA: normalizeNumber(payload.gpa),
    'SAT / ACT': normalizeNumber(payload.satScore),
    Bio: payload.bio,
    Strengths: payload.strengths,
    'Highlight Video': payload.highlightVideoUrl,
    'Photo URL': payload.profilePhotoUrl
  })
}

function removeEmptyFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
  )
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
    const error = new Error(body.error?.message || 'Airtable request failed')
    error.status = response.status
    error.code = body.error?.type
    error.airtableBody = body
    throw error
  }

  return body
}

async function airtableMetaFetch(path, options = {}) {
  const { apiKey, baseId } = getAirtableConfig()
  if (!apiKey || !baseId) {
    return { skipped: true }
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

async function ensureApplicationFields() {
  const { tableId } = getAirtableConfig()
  const base = await airtableMetaFetch('/tables')
  if (base.skipped) {
    return { skipped: true, reason: 'Airtable credentials are incomplete' }
  }

  const table = base.tables?.find((item) => item.id === tableId || item.name === tableId)
  if (!table) {
    return { skipped: true, reason: 'Airtable table metadata was not found' }
  }

  const existingFields = new Set((table.fields || []).map((field) => field.name))
  const created = []

  for (const field of REQUIRED_AIRTABLE_FIELDS) {
    if (existingFields.has(field.name)) {
      continue
    }

    const body = {
      name: field.name,
      type: field.type
    }

    if (field.options) {
      body.options = field.options
    }

    await airtableMetaFetch(`/tables/${table.id}/fields`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
    created.push(field.name)
  }

  return { skipped: false, created }
}

function getUnknownFieldName(error) {
  const match = String(error?.message || '').match(/Unknown field name: "([^"]+)"/i)
  return match?.[1] || ''
}

function getInvalidValueFieldName(error) {
  const message = String(error?.message || '')
  const quotedMatch = message.match(/Field "([^"]+)" cannot accept the provided value/i)
  const attachmentMatch = message.match(/Invalid attachment for field ([^:]+):/i)
  return quotedMatch?.[1] || attachmentMatch?.[1] || ''
}

function getRetryableFieldName(error) {
  return getUnknownFieldName(error) || getInvalidValueFieldName(error)
}

function stripRetryableField(fields, error) {
  const fieldName = getRetryableFieldName(error)
  if (!fieldName || !(fieldName in fields)) {
    return null
  }

  const nextFields = { ...fields }
  delete nextFields[fieldName]
  return nextFields
}

function remapUnknownField(fields, error, attemptedAliases) {
  const fieldName = getUnknownFieldName(error)
  const canonicalField = AIRTABLE_FIELD_ALIASES[fieldName]
    ? fieldName
    : Object.keys(AIRTABLE_FIELD_ALIASES).find((key) => AIRTABLE_FIELD_ALIASES[key].includes(fieldName))
  const aliases = AIRTABLE_FIELD_ALIASES[canonicalField] || []
  const value = fields[fieldName]
  const startIndex = canonicalField === fieldName ? 0 : aliases.indexOf(fieldName) + 1

  for (const alias of aliases.slice(startIndex)) {
    if (!attemptedAliases.has(`${canonicalField}:${alias}`) && !(alias in fields)) {
      const nextFields = { ...fields }
      delete nextFields[fieldName]
      nextFields[alias] = value
      attemptedAliases.add(`${canonicalField}:${alias}`)
      return { fields: nextFields, from: canonicalField, to: alias }
    }
  }

  return null
}

export async function createAirtableRecord(fields) {
  try {
    const result = await airtableFetch('', {
      method: 'POST',
      body: JSON.stringify({ fields })
    })

    if (result.skipped) {
      return { skipped: true, reason: 'Airtable credentials are incomplete' }
    }

    return { skipped: false, id: result.id, droppedFields: [] }
  } catch (firstError) {
    try {
      await ensureApplicationFields()
      const result = await airtableFetch('', {
        method: 'POST',
        body: JSON.stringify({ fields })
      })

      return { skipped: false, id: result.id, droppedFields: [] }
    } catch (schemaError) {
      let retryFields = { ...fields }
      const droppedFields = []
      const remappedFields = []
      const attemptedAliases = new Set()
      let lastError = getRetryableFieldName(schemaError) ? schemaError : firstError

      for (let index = 0; index < Object.keys(fields).length; index += 1) {
        const remapped = remapUnknownField(retryFields, lastError, attemptedAliases)
        const strippedFields = remapped?.fields || stripRetryableField(retryFields, lastError)
        if (!strippedFields) {
          throw lastError
        }

        const droppedField = getRetryableFieldName(lastError)
        if (remapped) {
          remappedFields.push(`${remapped.from} -> ${remapped.to}`)
        } else {
          droppedFields.push(droppedField)
        }
        retryFields = strippedFields

        const result = await airtableFetch('', {
          method: 'POST',
          body: JSON.stringify({ fields: retryFields })
        }).catch((error) => {
          lastError = error
          return null
        })

        if (result) {
          return { skipped: false, id: result.id, droppedFields, remappedFields }
        }
      }

      throw lastError
    }
  }
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
  const patchStatus = () => airtableFetch(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { Status: status } })
  })

  try {
    const record = await patchStatus()
    return { skipped: false, record }
  } catch (firstError) {
    if (!/Unknown field name/i.test(firstError.message || '')) {
      throw firstError
    }

    await ensureApplicationFields()
    const record = await patchStatus()
    return { skipped: false, record }
  }
}

export async function notifyMake(fields) {
  if (!process.env.MAKE_WEBHOOK_URL) {
    return { skipped: true }
  }

  try {
    const response = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })

    if (!response.ok) {
      return { skipped: false, ok: false, status: response.status, error: 'Make webhook failed' }
    }

    return { skipped: false, ok: true }
  } catch (error) {
    return { skipped: false, ok: false, error: error.message || 'Make webhook failed' }
  }
}

export async function sendConfirmationEmail(fields) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || 'Canadian Prospects <onboarding@resend.dev>'
  const adminEmail = process.env.ADMIN_EMAIL || process.env.CPR_ADMIN_EMAIL
  const recipientEmails = Array.from(new Set([fields.Email, fields['Parent Email']].filter(Boolean)))

  if (!apiKey || recipientEmails.length === 0) {
    return { skipped: true }
  }

  try {
    const athleteName = `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim() || 'Athlete'
    const profileUrl = fields.profileUrl || ''
    const familyPortalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.PROFILE_SITE_URL || 'https://cpr-site.vercel.app'}/portal`
    const familyPortalHtml = fields['Family Portal Opt-In'] === 'Yes'
      ? `<p style="margin-top:18px;">You also requested access to the CPR Family Hub. This is a separate informational guide for parents and families. It does not connect to, share, or change the athlete's public player profile.</p>
         <p><a href="${familyPortalUrl}" style="display:inline-block;background:#111111;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700;">Open CPR Family Hub</a></p>
         <p style="font-size:13px;color:#555;">Family Hub link: <a href="${familyPortalUrl}">${familyPortalUrl}</a></p>`
      : ''
    const profileLinkHtml = profileUrl
      ? `<p><a href="${profileUrl}" style="display:inline-block;background:#cc0000;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700;">View athlete profile</a></p>
         <p style="font-size:13px;color:#555;">Profile link: <a href="${profileUrl}">${profileUrl}</a></p>`
      : '<p>Your public profile link is being prepared and will be available once the athlete record is created.</p>'
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border-top:6px solid #cc0000;border-radius:12px;overflow:hidden;">
          <div style="background:#0a0a0a;color:#ffffff;padding:22px 24px;">
            <h1 style="margin:0;font-size:22px;letter-spacing:0.04em;">Canadian Prospects Recruitment</h1>
            <p style="margin:6px 0 0;color:#d1d5db;">Finding opportunity. Building futures.</p>
          </div>
          <div style="padding:24px;color:#111827;line-height:1.6;">
            <p>Hi ${fields['First Name'] || 'there'},</p>
            <p>Your Canadian Prospects Recruitment application has been received.</p>
            <p>Our team will review your profile, film, academics, and fee agreement details.</p>
            ${profileLinkHtml}
            ${familyPortalHtml}
            <p style="margin-top:24px;">Thank you,<br />Canadian Prospects Recruitment</p>
          </div>
        </div>
      </div>
    `

    const sends = [
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: recipientEmails,
          subject: 'Canadian Prospects application received',
          html: emailHtml
        })
      })
    ]

    if (adminEmail) {
      sends.push(fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [adminEmail],
          subject: `New CPR athlete application: ${athleteName}`,
          html: `
            <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
              <div style="max-width:620px;margin:0 auto;background:#ffffff;border-top:6px solid #cc0000;border-radius:12px;overflow:hidden;">
                <div style="background:#0a0a0a;color:#ffffff;padding:22px 24px;">
                  <h1 style="margin:0;font-size:22px;">New CPR Athlete Application</h1>
                </div>
                <div style="padding:24px;color:#111827;line-height:1.6;">
                  <p><strong>Athlete:</strong> ${athleteName}</p>
                  <p><strong>Sport:</strong> ${fields.Sport || 'Not provided'}</p>
                  <p><strong>Email:</strong> ${fields.Email || 'Not provided'}</p>
                  <p><strong>Parent:</strong> ${fields['Parent Name'] || 'Not provided'} ${fields['Parent Email'] ? `(${fields['Parent Email']})` : ''}</p>
                  <p><strong>Family Hub Opt-In:</strong> ${fields['Family Portal Opt-In'] || 'No'}</p>
                  ${profileUrl ? `<p><strong>Profile:</strong> <a href="${profileUrl}">${profileUrl}</a></p>` : ''}
                </div>
              </div>
            </div>
          `
        })
      }))
    }

    const responses = await Promise.all(sends)
    const bodies = await Promise.all(responses.map((response) => response.json().catch(() => ({}))))
    const failedIndex = responses.findIndex((response) => !response.ok)
    if (failedIndex !== -1) {
      return {
        skipped: false,
        ok: false,
        status: responses[failedIndex].status,
        error: bodies[failedIndex].message || 'Resend email failed'
      }
    }

    return {
      skipped: false,
      ok: true,
      ids: bodies.map((body) => body.id).filter(Boolean),
      recipients: recipientEmails,
      adminNotified: Boolean(adminEmail)
    }
  } catch (error) {
    return { skipped: false, ok: false, error: error.message || 'Resend email failed' }
  }
}
