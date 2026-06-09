import Link from 'next/link'
import { getAirtableRecord } from '../../../lib/integrations'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }) {
  const { id } = await params
  const profile = await getAirtableRecord(id).catch(() => null)
  const fields = profile?.record?.fields || {}
  const athleteName = fields['Athlete Name'] || `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim() || 'Athlete profile'

  return (
    <main>
      <header className="siteHeader">
        <Link className="brand" href="/">
          <span className="brandMark">CPR</span>
          <span>Canadian Prospects Recruitment</span>
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
            <p className="eyebrow">Player profile</p>
            <h1>{athleteName}</h1>
            <div className="profileMeta">
              <span>{fields.Sport || 'Sport pending'} | {fields.Position || 'Position pending'}</span>
              <span>{fields['Current School'] || 'School pending'} | Class of {fields['Graduation Year'] || 'TBD'}</span>
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
              <strong>Measurements</strong>
              <p>Height: {fields.Height || 'TBD'}</p>
              <p>Weight: {fields.Weight || 'TBD'}</p>
              <p>Wingspan: {fields.Wingspan || 'TBD'}</p>
            </article>
            <article className="profilePanel">
              <strong>Academics</strong>
              <p>GPA: {fields.GPA || 'TBD'}</p>
              <p>SAT: {fields['SAT Score'] || 'TBD'}</p>
              <p>Location: {fields['City/Province'] || 'TBD'}</p>
            </article>
            <article className="profilePanel">
              <strong>Status</strong>
              <p>{fields.Status || 'New'}</p>
              <p>Profile ID: {id}</p>
            </article>
            <article className="profilePanel wide">
              <strong>Bio</strong>
              <p>{fields.Bio || 'Bio pending.'}</p>
            </article>
            <article className="profilePanel wide">
              <strong>Strengths</strong>
              <p>{fields.Strengths || 'Strengths pending.'}</p>
            </article>
          </div>
        )}
      </section>
    </main>
  )
}
