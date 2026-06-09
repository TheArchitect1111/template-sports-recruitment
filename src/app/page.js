import Link from 'next/link'

const processSteps = [
  ['Apply', 'Start with a complete athlete profile and family contact details.'],
  ['Upload', 'Add film, photos, transcripts, report cards, awards, and documents.'],
  ['Agreement', 'Review the service agreement and sign digitally.'],
  ['Recruiting', 'Our team prepares outreach for aligned college programs.'],
  ['Opportunities', 'Track coach interest, next steps, and school fit.']
]

const uploads = [
  'Mixtapes/Game Film',
  'YouTube Links',
  'Photos',
  'Teams',
  'Transcripts',
  'Report Cards',
  'Awards',
  'Other Documents'
]

const features = [
  'Coach contact tracking',
  'School fit pipeline',
  'Document review status',
  'Application progress',
  'Film package readiness',
  'Family update dashboard'
]

const stats = [
  ['500+', 'Athletes Assisted'],
  ['1000+', 'Coach Contacts Made'],
  ['250+', 'Schools Reached'],
  ['$25M+', 'in Scholarship Opportunities']
]

const stories = [
  {
    quote: 'CPR helped me organize my film, understand coach communication, and find the right academic fit.',
    name: 'Liam O.',
    school: 'University of Illinois'
  },
  {
    quote: 'The process gave my family clarity. I knew what to upload, who was reviewing me, and what came next.',
    name: 'Noah W.',
    school: 'Syracuse University'
  },
  {
    quote: 'Canadian Prospects helped me turn interest into real conversations with schools that matched my goals.',
    name: 'Mason B.',
    school: 'University of Kentucky'
  }
]

function CprLogo() {
  return (
    <span className="cprLogo" aria-label="CPR logo">
      <span>CPR</span>
    </span>
  )
}

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <Link className="brand" href="/">
          <CprLogo />
          <span className="brandText">
            <strong>CANADIAN PROSPECTS RECRUITMENT</strong>
            <small>FINDING OPPORTUNITY. BUILDING FUTURES.</small>
          </span>
        </Link>
        <nav className="topNav" aria-label="Main navigation">
          <a href="#process">Process</a>
          <a href="#showcase">Showcase</a>
          <a href="#tracking">Tracking</a>
          <a href="#stories">Stories</a>
          <Link href="/apply">Apply</Link>
        </nav>
      </header>

      <section className="homeHero">
        <div className="heroCopyBlock">
          <p className="eyebrow">Canadian basketball recruitment</p>
          <h1>
            YOUR NEXT <span>OPPORTUNITY</span> STARTS HERE.
          </h1>
          <p className="heroCopy">
            We help Canadian student-athletes get noticed by college coaches and find the right school to compete and succeed.
          </p>
          <div className="heroActions">
            <Link className="primaryAction" href="/apply">APPLY NOW</Link>
            <a className="secondaryAction" href="#showcase">WATCH VIDEO</a>
          </div>
        </div>

        <div className="heroPhoto" aria-label="Basketball player photo placeholder">
          <div className="photoBadge">
            <strong>CPR</strong>
            <span>Prospect Ready</span>
          </div>
        </div>
      </section>

      <section id="process" className="processSection">
        <div className="sectionIntro centered">
          <p className="eyebrow">How it works</p>
          <h2>OUR RECRUITMENT PROCESS</h2>
        </div>
        <div className="processGrid">
          {processSteps.map(([title, body], index) => (
            <article key={title} className="processStep">
              <span className="processIcon">{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="showcase" className="showcaseSection">
        <div className="sectionIntro">
          <p className="eyebrow">Athlete showcase</p>
          <h2>Build a profile coaches can review fast.</h2>
        </div>
        <div className="showcaseGrid">
          <div className="uploadGrid">
            {uploads.map((item) => (
              <article key={item} className="uploadTile">
                <span>+</span>
                <strong>{item}</strong>
              </article>
            ))}
          </div>

          <aside className="sampleProfile">
            <div className="sampleTop">
              <div className="sampleAvatar">JT</div>
              <div>
                <p className="eyebrow">Sample profile</p>
                <h3>Jayden Thompson</h3>
                <span>Point Guard</span>
              </div>
            </div>
            <div className="sampleStats">
              <span><strong>6&apos;2&quot;</strong> Height</span>
              <span><strong>175lbs</strong> Weight</span>
              <span><strong>2026</strong> Class</span>
              <span><strong>3.8</strong> GPA</span>
              <span><strong>1180</strong> SAT</span>
              <span><strong>PG</strong> Position</span>
            </div>
            <div className="sampleDetails">
              <p><strong>Team:</strong> Mississauga Magic U18 AAA</p>
              <p><strong>High School:</strong> Lorne Park SS</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="tracking" className="trackingSection">
        <div className="trackingCopy">
          <p className="eyebrow">Recruiting intelligence</p>
          <h2>WE TRACK. YOU STAY INFORMED.</h2>
          <p>
            Families can see what is complete, what is pending, and where the recruiting conversation is moving.
          </p>
          <div className="featureGrid">
            {features.map((feature) => (
              <article key={feature} className="featureBox">{feature}</article>
            ))}
          </div>
        </div>

        <aside className="dashboardMockup" aria-label="Dashboard screenshot placeholder">
          <div className="mockupHeader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="mockupBody">
            <div className="mockupChart"></div>
            <div className="mockupList">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </aside>
      </section>

      <section className="statsMapSection" aria-label="Recruitment stats">
        <div className="canadaMap" aria-label="Canada map graphic">
          <svg viewBox="0 0 560 260" role="img">
            <path d="M34 105l42-48 41 28 33-58 54 44 39-48 38 54 54-47 32 61 65-23 18 60 66 11-26 48-82-2-40 42-72-32-58 39-51-42-62 23-29-55-64 5z" />
            <path d="M102 139l36-26 39 18 52-24 38 25 45-18 56 30 62-8" />
          </svg>
        </div>
        <div className="statsBar">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="stories" className="storiesSection">
        <div className="sectionIntro centered">
          <p className="eyebrow">Success stories</p>
          <h2>Student-athletes finding the right fit.</h2>
        </div>
        <div className="testimonialGrid">
          {stories.map((item) => (
            <article key={item.name} className="testimonialCard">
              <p>&quot;{item.quote}&quot;</p>
              <strong>{item.name}</strong>
              <span>{item.school}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="ctaBand">
        <div>
          <p className="eyebrow">Start today</p>
          <h2>READY TO TAKE THE NEXT STEP?</h2>
        </div>
        <Link className="secondaryAction lightAction" href="/apply">Apply Now</Link>
      </section>

      <footer className="footer">
        <div>
          <CprLogo />
          <p>
            Canadian Prospects Recruitment helps Canadian student-athletes organize profiles, reach coaches, and pursue the right school fit.
          </p>
        </div>
        <div>
          <strong>Quick Links</strong>
          <Link href="/apply">Apply</Link>
          <a href="#process">Process</a>
          <a href="#stories">Success Stories</a>
        </div>
        <div>
          <strong>Resources</strong>
          <a href="#showcase">Upload Types</a>
          <a href="#tracking">Tracking</a>
          <Link href="/admin">Admin Portal</Link>
        </div>
        <div>
          <strong>Contact Us</strong>
          <span>mmagicman3223@gmail.com</span>
          <span>@prospects.ca</span>
          <span>Mississauga Ontario</span>
        </div>
      </footer>
    </main>
  )
}
