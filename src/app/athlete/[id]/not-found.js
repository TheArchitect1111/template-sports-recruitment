import Link from 'next/link'

export default function AthleteNotFound() {
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
