import { redirect } from 'next/navigation'

export default async function LegacyProfilePage({ params }) {
  const { id } = await params
  redirect(`/athlete/${id}`)
}
