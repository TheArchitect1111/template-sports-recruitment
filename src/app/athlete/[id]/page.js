import { notFound } from 'next/navigation'
import AthleteProfileCard from '../../../components/athlete/AthleteProfileCard'
import { getAthleteByIdOrSlug } from '../../../lib/airtable'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const athlete = await getAthleteByIdOrSlug(id).catch(() => null)

  if (!athlete) {
    return {
      title: 'Athlete Not Found | Canadian Prospects Recruitment'
    }
  }

  return {
    title: `${athlete.name} | Canadian Prospects Recruitment`,
    description: `${athlete.name} recruiting profile for ${athlete.position}, ${athlete.gradYear}, ${athlete.school}.`,
    alternates: {
      canonical: athlete.profileUrl
    }
  }
}

export default async function AthletePage({ params }) {
  const { id } = await params
  const athlete = await getAthleteByIdOrSlug(id)

  if (!athlete) {
    notFound()
  }

  return (
    <main className="athletePage">
      <AthleteProfileCard athlete={athlete} />
    </main>
  )
}
