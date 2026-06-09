import Link from 'next/link'
import AthleteProfileCard from '../../../components/athlete/AthleteProfileCard'
import { createProfileUrl, getAirtableConfig, getAthleteByIdOrSlug } from '../../../lib/airtable'

export const dynamic = 'force-dynamic'

function hasAirtableEnvironment() {
  const { apiKey, baseId, tableId } = getAirtableConfig()
  return Boolean(apiKey && baseId && tableId)
}

function createSampleAthlete(id) {
  return {
    id,
    slug: id,
    profileUrl: createProfileUrl(id),
    fields: {},
    name: 'Sample Athlete',
    sport: 'Basketball',
    phone: 'Not Provided',
    dateOfBirth: 'Not Provided',
    position: 'Guard',
    gradYear: '2026',
    school: 'Canadian Prospects Recruitment',
    cityProvince: 'Mississauga, Ontario',
    photoUrl: '',
    height: '6 ft 2 in',
    weight: '175 lbs',
    wingspan: 'Not Provided',
    gpa: '3.8',
    testScore: 'Not Provided',
    bio: 'Sample profile shown because Airtable environment variables are not configured.',
    strengths: 'Profile data will appear here once Airtable is configured.',
    videoUrl: '',
    transcriptUrl: '',
    evaluationUrl: '',
    additionalFilesUrl: '',
    status: 'New Prospect'
  }
}

async function getAthleteForPage(id) {
  if (!hasAirtableEnvironment()) {
    return createSampleAthlete(id)
  }

  try {
    return await getAthleteByIdOrSlug(id)
  } catch (error) {
    return null
  }
}

function ProfileNotFound() {
  return (
    <main className="athletePage athleteNotFound">
      <section className="athleteSection">
        <p className="eyebrow">Profile not found</p>
        <h1>Athlete profile unavailable.</h1>
        <p>The requested athlete profile does not exist or is not available for public viewing.</p>
        <Link className="primaryAction" href="/apply">Apply Now</Link>
      </section>
    </main>
  )
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const athlete = await getAthleteForPage(id).catch(() => null)

  if (!athlete) {
    return {
      title: 'Athlete Not Found | Canadian Prospects Recruitment'
    }
  }

  const name = athlete.name || 'Not Provided'
  const position = athlete.position || 'Not Provided'
  const gradYear = athlete.gradYear || 'Not Provided'
  const school = athlete.school || 'Not Provided'

  return {
    title: `${name} | Canadian Prospects Recruitment`,
    description: `${name} recruiting profile for ${position}, ${gradYear}, ${school}.`,
    alternates: {
      canonical: athlete.profileUrl
    }
  }
}

export default async function AthletePage({ params }) {
  const { id } = await params
  const athlete = await getAthleteForPage(id)

  if (!athlete) {
    return <ProfileNotFound />
  }

  return (
    <main className="athletePage">
      <AthleteProfileCard athlete={athlete} />
    </main>
  )
}
