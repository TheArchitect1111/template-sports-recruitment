/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

const campImages = [
  '1000240202.jpg',
  '1000240262.jpg',
  '1000240198.jpg',
  '1000240243.jpg',
  '1000240220.jpg',
  '1000240208.jpg',
  '1000240244.jpg',
  '1000240260.jpg',
  '1000240258.jpg',
  '1000240210.jpg'
].map((name) => `/cpr-home/camps/${name}`)

const playToWinImages = [
  '1000240212.jpg',
  '1000240214 (1).jpg',
  '1000240214.jpg',
  '1000240216.jpg',
  '1000240218.jpg',
  '1000240222.jpg',
  '1000240224.jpg',
  '1000240228.jpg',
  '1000240230.jpg',
  '1000240232.jpg',
  '1000240234.jpg',
  '1000240264.jpg',
  '1000240268.jpg',
  '1000240266.jpg'
].map((name) => `/cpr-home/play-to-win/${name}`)

const processSteps = [
  ['1. APPLY', 'Complete your application and create your player profile.'],
  ['2. UPLOAD', 'Upload your mixtapes, YouTube links, pictures, teams and documents.'],
  ['3. AGREEMENT', 'Review and complete the Fee Structure Agreement to activate your profile.'],
  ['4. RECRUITING', 'We send your profile to coaches and track responses.'],
  ['5. OPPORTUNITIES', 'We present real opportunities and guide you every step of the way.']
]

const uploadTiles = [
  'Mixtapes / Game Film',
  'YouTube Links',
  'Photos',
  'Teams',
  'Transcripts',
  'Report Cards',
  'Awards & Achievements',
  'Other Documents'
]

const trackingFeatures = [
  ['Coach Outreach', 'We send your profile to the right coaches and programs.'],
  ['Opportunity Management', 'We help you manage interest, visits and offers.'],
  ['Response Tracking', 'Track opens, views and responses from coaches.'],
  ['Real-Time Updates', 'Your dashboard keeps you updated every step of the way.'],
  ['School Interest', 'See which schools are interested in you.'],
  ['Secure & Private', 'Your information is safe and only shared with coaches.']
]

const supportEmail = 'mikecrpglobal@mississaugamagic.com'

const platformModules = [
  ['Player Profiles', 'Professional athlete pages with film, academics, achievements and coach-ready details.', 'profile'],
  ['Coach Outreach', 'Coach directory, share links, response tracking and follow-up management.', 'outreach'],
  ['Resource Hub', 'Guides, documents, templates and recruiting education for families and athletes.', 'resource'],
  ['Event & Camp Hub', 'Showcases, webinars, camps and registration opportunities in one place.', 'event'],
  ['Parent Portal', 'Optional informational guide for families learning the recruiting process.', 'portal'],
  ['Pulse Dashboard', 'Visibility into applications, engagement, profile readiness, outreach and conversions.', 'pulse']
]

const stats = [
  ['500+', 'ATHLETES ASSISTED'],
  ['1,000+', 'COACH CONTACTS MADE'],
  ['250+', 'SCHOOLS REACHED'],
  ['$25M+', 'IN SCHOLARSHIP OPPORTUNITIES']
]

function RotatingImageStack({ images, label }) {
  return (
    <div className="rotatingImageStack" aria-label={label}>
      {images.map((src, index) => (
        <img key={src} src={src} alt="" aria-hidden="true" style={{ '--image-index': index }} />
      ))}
    </div>
  )
}

function SimpleIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0v18M3 12h18" />
    </svg>
  )
}

function PlatformIcon({ type }) {
  const paths = {
    profile: ['M4 20a7 7 0 0116 0', 'M12 12a4 4 0 100-8 4 4 0 000 8z'],
    outreach: ['M3 11l18-8-6 18-3-7-9-3z', 'M12 14l9-11'],
    resource: ['M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z', 'M8 7h7M8 11h7M8 15h5'],
    event: ['M7 3v4M17 3v4M4 8h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z', 'M8 12h3M13 12h3M8 16h3'],
    portal: ['M4 5h16v14H4V5z', 'M8 9h8M8 13h5M9 19v2h6v-2'],
    pulse: ['M3 12h4l2-5 4 10 3-6h5', 'M12 3a9 9 0 110 18 9 9 0 010-18z']
  }

  return (
    <svg className="platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(paths[type] || paths.profile).map((path) => <path key={path} d={path} />)}
    </svg>
  )
}

function helpHref(topic) {
  return `mailto:${supportEmail}?subject=${encodeURIComponent(`CPR help: ${topic}`)}`
}

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <img src="/cpr-logo.png" alt="Canadian Prospects Recruitment" className="nav-logo" />
          <div className="nav-brand display">
            <div className="b1">CANADIAN PROSPECTS</div>
            <div className="b2">RECRUITMENT</div>
            <div className="b3">FINDING OPPORTUNITY. BUILDING FUTURES.</div>
          </div>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#top" className="active">HOME</a>
            <a href="#about-us">ABOUT US</a>
            <a href="#how-it-works">HOW IT WORKS</a>
            <a href="#success-stories">SUCCESS STORIES</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">CONTACT</a>
            <Link className="btn" href="/apply">APPLY NOW</Link>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="display">
              YOUR NEXT<br />
              <span className="l2">OPPORTUNITY</span><br />
              STARTS HERE.
            </h1>
            <p>We help Canadian student-athletes get noticed by college coaches and find the right school to compete and succeed.</p>
            <div className="hero-btns">
              <Link className="btn" href="/apply">APPLY NOW</Link>
              <a className="btn btn-outline" href="https://youtu.be/iqietCwnCxc">WATCH VIDEO</a>
            </div>
          </div>
          <div className="hero-img" style={{ backgroundImage: "url('/hero-committed.jpg')" }}></div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="sec-head">
            <h2 className="display">OUR <span className="red">RECRUITMENT</span> PROCESS</h2>
            <p>We make the recruiting process simple, organized and effective.</p>
          </div>
          <div className="process-grid">
            {processSteps.map(([title, body], index) => (
              <div className="process-card" key={title}>
                <SimpleIcon />
                <h3 className="display">{title}</h3>
                <p>{body}</p>
                {index < processSteps.length - 1 && <span className="arrow">›</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="about-us" style={{ paddingTop: 0 }}>
        <div className="container duo">
          <div className="panel">
            <h2 className="display"><span className="red">SHOWCASE</span> YOUR TALENT</h2>
            <p className="sub">Submit everything coaches need to evaluate you.</p>
            <div className="tile-grid">
              {uploadTiles.map((tile) => (
                <div className={`tile ${tile.includes('YouTube') || tile.includes('Awards') ? 'hot' : ''}`} key={tile}>
                  <SimpleIcon />
                  <span>{tile}</span>
                </div>
              ))}
            </div>
            <Link className="btn" href="/apply">START YOUR APPLICATION</Link>
          </div>

          <div className="panel panel-dark">
            <h2 className="display">WHAT <span style={{ color: 'var(--red-bright)' }}>COACHES</span> RECEIVE</h2>
            <p className="sub">A professional profile with the information they need.</p>
            <div className="profile-card">
              <div className="profile-top">
                <img src="/jayden-photo.png" alt="Jayden Thompson" />
                <div>
                  <h3 className="display">JAYDEN THOMPSON</h3>
                  <p className="profile-meta">Point Guard | 6&apos;2&quot; | 175 lbs | Class of 2026</p>
                  <p className="profile-team">Mississauga Magic U18 AAA</p>
                  <table className="profile-rows">
                    <tbody>
                      <tr><td>GPA</td><td>3.8</td></tr>
                      <tr><td>SAT (Est.)</td><td>1180</td></tr>
                      <tr><td>Position</td><td>PG</td></tr>
                      <tr><td>High School</td><td>Lorne Park SS</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="hl-label display">HIGHLIGHT VIDEO</div>
              <div className="hl-strip">
                <img src="/video-main.png" alt="Highlight" />
                <img src="/video-2.png" alt="Highlight" />
                <img src="/video-3.png" alt="Highlight" />
              </div>
            </div>
            <div className="panel-cta">
              <a className="btn" href="/athletes/jayden-thompson">VIEW SAMPLE PROFILE</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section track">
        <div className="container track-grid">
          <div>
            <h2 className="display">WE <span className="red">TRACK</span>. YOU STAY INFORMED.</h2>
            <p className="lead">We manage the outreach. You see the results.</p>
            <div className="feat-grid">
              {trackingFeatures.map(([title, body]) => (
                <div className="feat" key={title}>
                  <SimpleIcon />
                  <div>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <img src="/dashboard.png" alt="Recruitment Dashboard" />
        </div>
      </section>

      <section className="section platform-section" id="platform">
        <div className="container">
          <div className="sec-head">
            <h2 className="display">CPR <span className="red">PLATFORM</span> ENGINE</h2>
            <p>The CPR site is being shaped as the working template for athlete, parent, coach and organization portals.</p>
          </div>
          <div className="platform-grid">
            {platformModules.map(([title, body, icon]) => (
              <div className="platform-card" key={title}>
                <div className="platform-icon-wrap">
                  <PlatformIcon type={icon} />
                </div>
                <h3 className="display">{title}</h3>
                <p>{body}</p>
                <a className="module-help" href={helpHref(title)}>Get help with {title}</a>
              </div>
            ))}
          </div>
          <div className="platform-actions">
            <Link className="btn" href="/portal">OPEN FAMILY GUIDE</Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          {stats.map(([value, label]) => (
            <div className="stat" key={label}>
              <div className="v display">{value}</div>
              <div className="l">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="camps" className="photoStorySection legacyPhotoStory">
        <div className="container legacyPhotoGrid">
          <div className="photoStoryCopy">
            <p className="eyebrow">Camps and exposure</p>
            <h2 className="display">CAMPS THAT PUT DEVELOPMENT IN MOTION.</h2>
            <p>
              CPR connects young athletes to competitive basketball environments where effort, coaching, exposure,
              and confidence can turn potential into opportunity.
            </p>
          </div>
          <RotatingImageStack images={campImages} label="Rotating CPR camp photos" />
        </div>
      </section>

      <section id="play-to-win" className="photoStorySection legacyPhotoStory lightStory">
        <div className="container legacyPhotoGrid reverse">
          <RotatingImageStack images={playToWinImages} label="Rotating CPR championship and achievement photos" />
          <div className="photoStoryCopy">
            <p className="eyebrow">A Play To Win!</p>
            <h2 className="display">WINNING IS A STANDARD, NOT A SLOGAN.</h2>
            <p>
              From local championships to university-level achievement, CPR highlights the habits, proof, and
              competitive mindset that help players pursue bigger stages.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="success-stories">
        <div className="container">
          <div className="sec-head">
            <h2 className="display">SUCCESS STORIES</h2>
          </div>
          <div className="stories-grid">
            <div className="story proof">
              <img src="/proof-canada.jpg" alt="CPR athlete competing for Team Canada." className="proof-img" />
              <p className="proof-cap">CPR athlete competing for Team Canada.</p>
            </div>
            <div className="story proof">
              <img src="/proof-champion.jpg" alt="From CPR to a conference championship." className="proof-img" />
              <p className="proof-cap">From CPR to a conference championship.</p>
            </div>
            <div className="story proof">
              <img src="/proof-team.jpg" alt="CPR athletes showcasing at the next level." className="proof-img" />
              <p className="proof-cap">CPR athletes showcasing at the next level.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2 className="display">READY TO TAKE THE NEXT STEP?</h2>
              <p>Start your application today and take control of your future.</p>
            </div>
            <Link className="btn btn-white" href="/apply">APPLY NOW</Link>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/cpr-logo.png" alt="CPR logo" />
              <div>
                <div className="t display">CANADIAN PROSPECTS RECRUITMENT</div>
                <p>We connect Canadian student-athletes with opportunities to play basketball at the next level.</p>
              </div>
            </div>
            <div>
              <h5 className="display">QUICK LINKS</h5>
              <ul>
                <li><a href="#about-us">About Us</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#success-stories">Success Stories</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="display">RESOURCES</h5>
              <ul>
                <li><Link href="/apply">For Athletes</Link></li>
                <li><Link href="/apply">For Parents</Link></li>
                <li><Link href="/apply">NCAA Recruiting Guide</Link></li>
                <li><Link href="/apply">Fee Agreement</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="display">CONTACT US</h5>
              <div className="contact-row"><a href={`mailto:${supportEmail}`}>{supportEmail}</a></div>
              <div className="contact-row"><a href={helpHref('general site support')}>Get help with any CPR feature</a></div>
              <div className="contact-row"><a href="https://instagram.com/mississaugamagic">@mississaugamagic</a></div>
              <div className="contact-row"><span>Mississauga, Ontario</span></div>
            </div>
          </div>
          <div className="copyright">
            <span>© 2026 Canadian Prospects Recruitment. All Rights Reserved.</span>
            <span><a href="#top">Privacy Policy</a><a href="#top">Terms of Service</a></span>
          </div>
        </div>
      </footer>
    </>
  )
}
