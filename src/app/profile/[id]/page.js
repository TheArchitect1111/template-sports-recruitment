import Link from 'next/link'
import { getAirtableRecord } from '../../../lib/integrations'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }) {
  const { id } = await params
  const profile = await getAirtableRecord(id).catch(() => null)
  const fields = profile?.record?.fields || {}
  const athleteName = `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim() || 'Athlete profile'

  return (
    <main>
      <header className="siteHeader">
        <Link className="brand" href="/">
          <span className="brandMark">CPR</span>
          <span className="brandText">
            <strong>CANADIAN PROSPECTS RECRUITMENT</strong>
            <small>FINDING OPPORTUNITY. BUILDING FUTURES.</small>
          </span>
        </Link>
        <nav className="topNav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/apply">Apply</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="profileShell">
        <div className="profileHero">
          <div className="profileNumber">{fields['Jersey Number'] || 'CP'}</div>
          <div>
            <p className="eyebrow">Basketball player profile</p>
            <h1>{athleteName}</h1>
            <div className="profileMeta">
              <span>{fields.Sport || 'Sport pending'}</span>
              <span>{fields.Email || 'Email pending'} | {fields.Phone || 'Phone pending'}</span>
            </div>
          </div>
        </div>

        {!profile ? (
          <article className="profilePanel">
            <h2>Profile unavailable</h2>
            <p>We could not load this athlete profile from Airtable.</p>
          </article>
        ) : (
          <div className="profileGrid">
            <article className="profilePanel">
              <strong>Contact</strong>
              <p>Email: {fields.Email || 'TBD'}</p>
              <p>Phone: {fields.Phone || 'TBD'}</p>
              <p>Date of Birth: {fields['Date of Birth'] || 'TBD'}</p>
            </article>
            <article className="profilePanel">
              <strong>Recruiting</strong>
              <p>Sport: {fields.Sport || 'TBD'}</p>
              <p>First Name: {fields['First Name'] || 'TBD'}</p>
              <p>Last Name: {fields['Last Name'] || 'TBD'}</p>
            </article>
            <article className="profilePanel">
              <strong>Status</strong>
              <p>{fields.Status || 'New'}</p>
              <p>Profile ID: {id}</p>
            </article>
            <article className="profilePanel wide">
              <strong>Profile note</strong>
              <p>This public profile currently reflects the fields available in the Athlete Intake table.</p>
            </article>
          </div>
        )}
      </section>
    </main>
  )
}
