export default function DocumentSection({ athlete }) {
  const documents = [
    ['Transcript', athlete.transcriptUrl],
    ['Evaluation', athlete.evaluationUrl],
    ['Additional Files', athlete.additionalFilesUrl]
  ].filter(([, url]) => Boolean(url))

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
        <p>No public documents have been added yet.</p>
      )}
    </section>
  )
}
