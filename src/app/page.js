import Link from 'next/link'

const stats = [
  ['200+', 'Athletes Placed'],
  ['50+', 'University Partners'],
  ['98%', 'Satisfaction Rate'],
  ['10+', 'Years Experience']
]

const steps = [
  ['01', 'Apply', 'Submit your athletic, academic, and family contact profile.'],
  ['02', 'Evaluate', 'Our recruiting team reviews fit, film, grades, and readiness.'],
  ['03', 'Position', 'We shape your player card, profile, and outreach plan.'],
  ['04', 'Connect', 'Qualified athletes are introduced to aligned college programs.'],
  ['05', 'Commit', 'Families receive guidance through offers, visits, and next steps.']
]

const testimonials = [
  {
    quote: 'Canadian Prospects helped us understand the recruiting process and gave my son a clear plan.',
    name: 'Marcus R.',
    role: 'Parent of 2025 guard'
  },
  {
    quote: 'The profile, film notes, and coach outreach made a real difference in my recruitment.',
    name: 'Aaliyah M.',
    role: 'Placed athlete'
  },
  {
    quote: 'They bring organized information, reliable athletes, and families who are prepared.',
    name: 'Coach D.',
    role: 'University partner'
  }
]

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <Link className="brand" href="/">
          <span className="brandMark">CPR</span>
          <span>Canadian Prospects Recruitment</span>
        </Link>
        <nav className="topNav" aria-label="Main navigation">
          <Link href="/apply">Apply</Link>
          <a href="#process">Process</a>
          <a href="#testimonials">Stories</a>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="homeHero">
        <div className="heroCopyBlock">
          <p className="eyebrow">Canada to campus pathway</p>
          <h1>Canadian Prospects Recruitment</h1>
          <p className="heroCopy">
            A dark, direct recruitment platform for athletes ready to build a profile, verify fit, and connect with the right college programs.
          </p>
          <div className="heroActions">
            <Link className="primaryAction" href="/apply">Start application</Link>
            <a className="secondaryAction" href="#process">View process</a>
          </div>
        </div>

        <aside className="playerCard" aria-label="Featured player card">
          <div className="cardHeader">
            <span>Prospect card</span>
            <strong>Elite evaluation</strong>
          </div>
          <div className="playerAvatar">23</div>
          <h2>Jordan Blake</h2>
          <p>6 ft 3 in guard, Class of 2027</p>
          <div className="playerMetrics">
            <span><strong>3.8</strong> GPA</span>
            <span><strong>42%</strong> 3PT</span>
            <span><strong>ON</strong> Canada</span>
          </div>
        </aside>
      </section>

      <section className="statsBar" aria-label="Recruitment stats">
        {stats.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section id="process" className="sectionBand">
        <div className="sectionIntro">
          <p className="eyebrow">5 step process</p>
          <h2>From first profile to college conversation.</h2>
        </div>
        <div className="processGrid">
          {steps.map(([number, title, body]) => (
            <article key={title} className="processStep">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="sectionBand testimonials">
        <div className="sectionIntro">
          <p className="eyebrow">Testimonials</p>
          <h2>Families, athletes, and coaches trust the system.</h2>
        </div>
        <div className="testimonialGrid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonialCard">
              <p>{item.quote}</p>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="ctaBand">
        <div>
          <p className="eyebrow">Ready for review</p>
          <h2>Build your recruitment profile today.</h2>
        </div>
        <Link className="primaryAction" href="/apply">Apply now</Link>
      </section>

      <footer className="footer">
        <span>Canadian Prospects Recruitment</span>
        <span>Built for athlete placement, coach outreach, and family clarity.</span>
      </footer>
    </main>
  )
}
