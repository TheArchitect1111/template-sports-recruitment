'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const supportEmail = 'mikecrpglobal@mississaugamagic.com'

function cleanProfileInput(value) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  try {
    const url = new URL(trimmed)
    return url.pathname.split('/').filter(Boolean).pop() || ''
  } catch {
    return trimmed
      .replace(/^https?:\/\/[^/]+\//i, '')
      .replace(/^\/?(athlete|profile|portal\/family)\//i, '')
      .replace(/^\/+|\/+$/g, '')
  }
}

export default function PortalPage() {
  const router = useRouter()
  const [profileInput, setProfileInput] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const profileId = cleanProfileInput(profileInput)

    if (!profileId) {
      setError('Enter an athlete profile link, ID, or slug.')
      return
    }

    router.push(`/portal/family/${encodeURIComponent(profileId)}`)
  }

  return (
    <main className="familyHubPage">
      <header className="familyHubHeader">
        <Link className="familyHubLogo" href="/">CPR</Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/apply">Apply</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="familyHero">
        <p className="eyebrow">CPR Family Hub</p>
        <h1>One place for recruiting next steps.</h1>
        <p>
          Open a private family view using the athlete profile link, Airtable record ID, or profile slug provided by CPR.
        </p>

        <form className="familyLookup" onSubmit={handleSubmit}>
          <label htmlFor="profileLookup">Athlete profile link or ID</label>
          <div>
            <input
              id="profileLookup"
              value={profileInput}
              onChange={(event) => {
                setProfileInput(event.target.value)
                setError('')
              }}
              placeholder="Paste profile link or record ID"
            />
            <button type="submit">Open Hub</button>
          </div>
          {error ? <p className="formMessage error">{error}</p> : null}
        </form>

        <div className="familyHeroActions">
          <Link className="primaryAction" href="/apply">Submit or update athlete info</Link>
          <a className="secondaryAction" href={`mailto:${supportEmail}?subject=${encodeURIComponent('CPR Family Hub access help')}`}>Need your hub link?</a>
        </div>
      </section>

      <section className="familyGrid" aria-label="Family Hub options">
        {[
          ['Athlete Profile', 'Review the coach-ready profile CPR is building and sharing.'],
          ['Recruiting Status', 'See where the athlete stands and what needs attention next.'],
          ['Documents', 'Track transcripts, evaluations, forms, and supporting files.'],
          ['Messages', 'Ask CPR questions and request updates from one place.'],
          ['Events & Camps', 'Keep track of showcases, camps, webinars, and registration opportunities.'],
          ['Payments', 'View agreement and payment status as CPR wires the deeper portal tools.']
        ].map(([title, body]) => (
          <article className="familyCard" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
