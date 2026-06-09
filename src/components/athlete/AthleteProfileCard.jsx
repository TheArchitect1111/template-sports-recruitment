/* eslint-disable @next/next/no-img-element */
import AthleteStatsCard from './AthleteStatsCard'
import DocumentSection from './DocumentSection'
import RecruitmentStatusBadge from './RecruitmentStatusBadge'
import VideoSection from './VideoSection'

export default function AthleteProfileCard({ athlete }) {
  const profile = athlete || {}
  const name = profile.name || 'Not Provided'
  const initials = name === 'Not Provided'
    ? 'CP'
    : name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

  return (
    <article className="athleteProfile">
      <header className="athleteHero">
        <div className="athleteHeroText">
          <RecruitmentStatusBadge status={profile.status} />
          <h1>{name}</h1>
          <div className="athleteMeta">
            <span>{profile.position || 'Not Provided'}</span>
            <span>{profile.gradYear || 'Not Provided'}</span>
            <span>{profile.school || 'Not Provided'}</span>
            <span>{profile.cityProvince || 'Not Provided'}</span>
          </div>
        </div>
        <div className="athletePhoto">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={`${name} profile`} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </header>

      <AthleteStatsCard athlete={profile} />

      <section className="athleteSection">
        <h2>Athlete Details</h2>
        <div className="athleteDetailGrid">
          <div>
            <span>Sport</span>
            <strong>{profile.sport || 'Not Provided'}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>{profile.phone || 'Not Provided'}</strong>
          </div>
          <div>
            <span>Date of Birth</span>
            <strong>{profile.dateOfBirth || 'Not Provided'}</strong>
          </div>
        </div>
      </section>

      <section className="athleteProfileGrid">
        <section className="athleteSection">
          <h2>Athlete Bio</h2>
          <p>{profile.bio || 'Not Provided'}</p>
        </section>

        <section className="athleteSection">
          <h2>Strengths and Scouting Notes</h2>
          <p>{profile.strengths || 'Not Provided'}</p>
        </section>
      </section>

      <VideoSection url={profile.videoUrl} />
      <DocumentSection athlete={profile} />
    </article>
  )
}
