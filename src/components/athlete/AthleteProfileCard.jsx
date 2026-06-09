/* eslint-disable @next/next/no-img-element */
import AthleteStatsCard from './AthleteStatsCard'
import DocumentSection from './DocumentSection'
import RecruitmentStatusBadge from './RecruitmentStatusBadge'
import VideoSection from './VideoSection'

export default function AthleteProfileCard({ athlete }) {
  return (
    <article className="athleteProfile">
      <header className="athleteHero">
        <div className="athleteHeroText">
          <RecruitmentStatusBadge status={athlete.status} />
          <h1>{athlete.name}</h1>
          <div className="athleteMeta">
            <span>{athlete.position}</span>
            <span>{athlete.gradYear}</span>
            <span>{athlete.school}</span>
            <span>{athlete.cityProvince}</span>
          </div>
        </div>
        <div className="athletePhoto">
          {athlete.photoUrl ? (
            <img src={athlete.photoUrl} alt={`${athlete.name} profile`} />
          ) : (
            <span>{athlete.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
          )}
        </div>
      </header>

      <AthleteStatsCard athlete={athlete} />

      <section className="athleteProfileGrid">
        <section className="athleteSection">
          <h2>Athlete Bio</h2>
          <p>{athlete.bio || 'This athlete bio is being prepared by Canadian Prospects Recruitment.'}</p>
        </section>

        <section className="athleteSection">
          <h2>Strengths and Scouting Notes</h2>
          <p>{athlete.strengths || 'Strengths and scouting notes will be added as the profile is reviewed.'}</p>
        </section>
      </section>

      <VideoSection url={athlete.videoUrl} />
      <DocumentSection athlete={athlete} />
    </article>
  )
}
