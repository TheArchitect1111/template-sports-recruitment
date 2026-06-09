export default function AthleteStatsCard({ athlete }) {
  const stats = [
    ['Height', athlete.height],
    ['Weight', athlete.weight],
    ['Wingspan', athlete.wingspan],
    ['GPA', athlete.gpa],
    ['SAT / ACT', athlete.testScore || 'Not provided']
  ]

  return (
    <section className="athleteStatsCard" aria-label="Athlete stats">
      {stats.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}
