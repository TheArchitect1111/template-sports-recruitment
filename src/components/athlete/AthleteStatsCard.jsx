export default function AthleteStatsCard({ athlete }) {
  const profile = athlete || {}
  const stats = [
    ['Height', profile.height],
    ['Weight', profile.weight],
    ['Wingspan', profile.wingspan],
    ['GPA', profile.gpa],
    ['SAT / ACT', profile.testScore]
  ]

  return (
    <section className="athleteStatsCard" aria-label="Athlete stats">
      {stats.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value || 'Not Provided'}</strong>
        </div>
      ))}
    </section>
  )
}
