import Link from 'next/link'

const stats = [
  ['500+', 'Athletes Assisted'],
  ['1,000+', 'Coach Contacts Made'],
  ['250+', 'Schools Reached'],
  ['$25M+', 'in Scholarship Opportunities']
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
          <span className="brandText">
            <strong>CANADIAN PROSPECTS RECRUITMENT</strong>
            <small>FINDING OPPORTUNITY. BUILDING FUTURES.</small>
          </span>
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
          <p className="eyebrow">Basketball recruitment pathway</p>
          <h1>Canadian Prospects Recruitment</h1>
          <p className="heroCopy">
            A dark, direct recruitment platform for athletes ready to build a profile, verify fit, and connect with the right college programs.
          </p>
          <div className="heroActions">
            <Link className="primaryAction" href="/apply">Start application</Link>
            <a className="secondaryAction" href="#process">View process</a>
          </div>
        </div>

        <aside className="playerCard" aria-label="Featured basketball player card">
          <div className="cardHeader">
            <span>Basketball prospect card</span>
            <strong>Elite court evaluation</strong>
          </div>
          <div className="basketballVisual">
            <span>23</span>
          </div>
          <h2>Jordan Blake</h2>
          <p>6 ft 3 in point guard, Class of 2027</p>
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
        <span>mmagicman3223@gmail.com</span>
        <span>Instagram @prospects.ca</span>
        <span>Mississauga Ontario</span>
      </footer>
    </main>
  )
}
