export default function DocumentSection({ athlete }) {
  const profile = athlete || {}
  const documents = [
    ['Transcript', profile.transcriptUrl],
    ['Evaluation', profile.evaluationUrl],
    ['Additional Files', profile.additionalFilesUrl]
  ].filter(([, url]) => typeof url === 'string' && url.trim())

  return (
    <section className="athleteSection">
      <h2>Documents</h2>
      {documents.length ? (
        <div className="documentGrid">
          {documents.map(([label, url]) => (
            <a key={label} className="documentLink" href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p>Not Provided</p>
      )}
    </section>
  )
}
