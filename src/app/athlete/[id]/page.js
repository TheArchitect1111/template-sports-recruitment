import { notFound } from 'next/navigation'
import AthleteProfileCard from '../../../components/athlete/AthleteProfileCard'
import { createProfileUrl, getAthleteByIdOrSlug } from '../../../lib/airtable'

export const dynamic = 'force-dynamic'

function isAirtableAccessError(error) {
  return error?.status === 403 || error?.code === 'INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND'
}

function createFallbackAthlete(id) {
  const nameFromSlug = /^rec[a-zA-Z0-9]+$/.test(id)
    ? 'Not Provided'
    : id
        .split('-')
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(' ')

  return {
    id,
    slug: id,
    profileUrl: createProfileUrl(id),
    fields: {},
    name: nameFromSlug || 'Not Provided',
    sport: 'Not Provided',
    phone: 'Not Provided',
    dateOfBirth: 'Not Provided',
    position: 'Not Provided',
    gradYear: 'Not Provided',
    school: 'Not Provided',
    cityProvince: 'Not Provided',
    photoUrl: '',
    height: 'Not Provided',
    weight: 'Not Provided',
    wingspan: 'Not Provided',
    gpa: 'Not Provided',
    testScore: 'Not Provided',
    bio: 'Not Provided',
    strengths: 'Not Provided',
    videoUrl: '',
    transcriptUrl: '',
    evaluationUrl: '',
    additionalFilesUrl: '',
    status: 'New Prospect'
  }
}

async function getAthleteForPage(id) {
  try {
    return await getAthleteByIdOrSlug(id)
  } catch (error) {
    if (isAirtableAccessError(error)) {
      return createFallbackAthlete(id)
    }

    throw error
  }
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
    notFound()
  }

  return (
    <main className="athletePage">
      <AthleteProfileCard athlete={athlete} />
    </main>
  )
}
