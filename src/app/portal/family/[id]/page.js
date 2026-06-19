import Link from 'next/link'
import { createProfileUrl, getAirtableConfig, getAthleteByIdOrSlug } from '../../../../lib/airtable'

export const dynamic = 'force-dynamic'

const supportEmail = 'mikecrpglobal@mississaugamagic.com'

function hasAirtableEnvironment() {
  const { apiKey, baseId, tableId } = getAirtableConfig()
  return Boolean(apiKey && baseId && tableId)
}

function getField(fields, names, fallback = 'Not posted yet') {
  for (const name of names) {
    const value = fields?.[name]
    if (Array.isArray(value) && value.length) {
      return value.map((item) => item?.url || item?.name || item).join(', ')
    }
    if (value) {
      return value
    }
  }

  return fallback
}

function createSampleAthlete(id) {
  return {
    id,
    slug: id,
    profileUrl: createProfileUrl(id),
    fields: {},
    name: 'Sample Athlete',
    sport: 'Basketball',
    position: 'Guard',
    gradYear: '2026',
    school: 'Canadian Prospects Recruitment',
    cityProvince: 'Mississauga, Ontario',
    videoUrl: '',
    transcriptUrl: '',
    evaluationUrl: '',
    additionalFilesUrl: '',
    status: 'New Prospect'
  }
}

async function getAthleteForFamilyHub(id) {
  if (!hasAirtableEnvironment()) {
    return createSampleAthlete(id)
  }

  try {
    return await getAthleteByIdOrSlug(id)
  } catch {
    return null
  }
}

function supportHref(athlete, topic) {
  return `mailto:${supportEmail}?subject=${encodeURIComponent(`CPR Family Hub: ${topic}`)}&body=${encodeURIComponent(`Athlete: ${athlete?.name || 'Not provided'}\nProfile ID: ${athlete?.id || 'Not provided'}\n\nQuestion:`)}`
}

function StatusItem({ label, value }) {
  return (
    <div className="familyStatusItem">
      <span>{label}</span>
      <strong>{value || 'Not posted yet'}</strong>
    </div>
  )
}

function FamilyHubNotFound() {
  return (
    <main className="familyHubPage">
      <section className="familyHero familyHeroCompact">
        <p className="eyebrow">Family Hub</p>
        <h1>We could not find that athlete hub.</h1>
        <p>Check the profile link or contact CPR and we will send the correct family access link.</p>
        <div className="familyHeroActions">
          <Link className="primaryAction" href="/portal">Try another profile</Link>
          <a className="secondaryAction" href={`mailto:${supportEmail}?subject=${encodeURIComponent('CPR Family Hub access help')}`}>Contact CPR</a>
        </div>
      </section>
    </main>
  )
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const athlete = await getAthleteForFamilyHub(id)
  const name = athlete?.name || 'Athlete'

  return {
    title: `${name} Family Hub | Canadian Prospects Recruitment`,
    description: `Family recruiting dashboard for ${name}.`
  }
}

export default async function FamilyHubProfilePage({ params }) {
  const { id } = await params
  const athlete = await getAthleteForFamilyHub(id)

  if (!athlete) {
    return <FamilyHubNotFound />
  }

  const profilePath = `/athlete/${athlete.id || id}`
  const fields = athlete.fields || {}
  const agreementStatus = getField(fields, ['Fee Agreement Status', 'Agreement Status', 'Payment Status'], 'Pending CPR update')
  const nextStep = getField(fields, ['Next Step', 'Next Steps', 'Recruiting Next Step'], 'CPR will post the next action here.')

  return (
    <main className="familyHubPage">
      <header className="familyHubHeader">
        <Link className="familyHubLogo" href="/">CPR</Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/portal">Family Hub</Link>
          <Link href={profilePath}>Profile</Link>
        </nav>
      </header>

      <section className="familyHero familyHeroCompact">
        <p className="eyebrow">Family Hub</p>
        <h1>{athlete.name || 'Athlete'} recruiting dashboard</h1>
        <p>{athlete.position || 'Athlete'} · Class of {athlete.gradYear || 'TBD'} · {athlete.school || 'School not posted yet'}</p>
        <div className="familyHeroActions">
          <Link className="primaryAction" href={profilePath}>View public profile</Link>
          <a className="secondaryAction" href={supportHref(athlete, 'Question for CPR')}>Ask CPR</a>
        </div>
      </section>

      <section className="familyStatusPanel">
        <StatusItem label="Recruiting status" value={athlete.status || 'New Prospect'} />
        <StatusItem label="Next step" value={nextStep} />
        <StatusItem label="Agreement / payment" value={agreementStatus} />
      </section>

      <section className="familyDashboardGrid">
        <article className="familyCard familyCardWide">
          <p className="eyebrow">Athlete snapshot</p>
          <h2>{athlete.name || 'Athlete profile'}</h2>
          <div className="familyDetailGrid">
            <StatusItem label="Sport" value={athlete.sport || 'Basketball'} />
            <StatusItem label="Position" value={athlete.position} />
            <StatusItem label="Grad year" value={athlete.gradYear} />
            <StatusItem label="Location" value={athlete.cityProvince} />
          </div>
        </article>

        <article className="familyCard">
          <p className="eyebrow">Film</p>
          <h2>Highlight video</h2>
          <p>{athlete.videoUrl ? 'Film is connected to the athlete profile.' : 'No highlight video is posted yet.'}</p>
          {athlete.videoUrl ? <a className="module-help" href={athlete.videoUrl}>Open film</a> : <a className="module-help" href={supportHref(athlete, 'Highlight video update')}>Send film update</a>}
        </article>

        <article className="familyCard">
          <p className="eyebrow">Documents</p>
          <h2>Recruiting files</h2>
          <p>Transcript: {athlete.transcriptUrl ? 'Posted' : 'Not posted yet'}</p>
          <p>Evaluation: {athlete.evaluationUrl ? 'Posted' : 'Not posted yet'}</p>
          <p>Additional files: {athlete.additionalFilesUrl ? 'Posted' : 'Not posted yet'}</p>
          <a className="module-help" href={supportHref(athlete, 'Document update')}>Request document update</a>
        </article>

        <article className="familyCard">
          <p className="eyebrow">Messages</p>
          <h2>Ask CPR</h2>
          <p>Send questions about profile updates, coach outreach, documents, events, payments, or next steps.</p>
          <a className="module-help" href={supportHref(athlete, 'Family question')}>Send message</a>
        </article>

        <article className="familyCard">
          <p className="eyebrow">Events & camps</p>
          <h2>Upcoming opportunities</h2>
          <p>CPR can post showcases, camps, webinars, deadlines, and registration links here.</p>
          <a className="module-help" href={supportHref(athlete, 'Event or camp question')}>Ask about events</a>
        </article>
      </section>
    </main>
  )
}
