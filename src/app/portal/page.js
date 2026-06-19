import Link from 'next/link'

const supportEmail = 'mikecrpglobal@mississaugamagic.com'

const guideSections = [
  ['Recruiting Basics', 'Understand the recruiting timeline, coach communication, exposure, evaluations, and realistic next steps.'],
  ['NCAA Readiness', 'Learn what families should know about registration, eligibility, transcripts, core courses, GPA, and amateurism.'],
  ['Scholarships & Costs', 'Get clear guidance on athletic scholarships, academic awards, travel costs, event fees, and planning ahead.'],
  ['Film & Exposure', 'Understand what quality film looks like, how exposure events work, and how coaches evaluate prospects.'],
  ['Parent Checklist', 'Know the common family actions: transcripts, forms, payment questions, consultation scheduling, and updates.'],
  ['Ask CPR', 'Contact CPR when your family needs help understanding the process or deciding what to do next.']
]

const roadmap = [
  'Create the athlete profile',
  'Prepare film and academic information',
  'Attend exposure events',
  'Begin coach outreach',
  'Track interest and responses',
  'Evaluate opportunities',
  'Commit, sign, and prepare'
]

export default function PortalPage() {
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
        <h1>A parent guide to the recruiting process.</h1>
        <p>
          This hub is an optional informational resource for parents, guardians, and family members.
          It is separate from the player profile and does not display, connect, or share athlete profile data.
        </p>

        <div className="familyHeroActions">
          <Link className="primaryAction" href="/apply">Opt in during application</Link>
          <a className="secondaryAction" href={`mailto:${supportEmail}?subject=${encodeURIComponent('CPR Family Hub question')}`}>Ask CPR</a>
        </div>
      </section>

      <section className="familyStatusPanel">
        <div className="familyStatusItem">
          <span>Purpose</span>
          <strong>Parent education</strong>
        </div>
        <div className="familyStatusItem">
          <span>Access</span>
          <strong>Optional welcome-email link</strong>
        </div>
        <div className="familyStatusItem">
          <span>Data sharing</span>
          <strong>No athlete profile connection</strong>
        </div>
      </section>

      <section className="familyDashboardGrid" aria-label="Family Hub guide sections">
        {guideSections.map(([title, body]) => (
          <article className="familyCard" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="familyGrid familyRoadmapGuide" aria-label="Recruiting roadmap">
        <article className="familyCard familyCardWide">
          <p className="eyebrow">Recruiting Roadmap</p>
          <h2>What families can expect</h2>
          <ol className="familyRoadmapList">
            {roadmap.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </article>
        <article className="familyCard">
          <p className="eyebrow">Need clarity?</p>
          <h2>Ask CPR</h2>
          <p>Use this hub to understand the process. For athlete-specific updates, contact CPR directly.</p>
          <a className="module-help" href={`mailto:${supportEmail}?subject=${encodeURIComponent('CPR Family Hub support')}`}>Contact CPR</a>
        </article>
      </section>
    </main>
  )
}
