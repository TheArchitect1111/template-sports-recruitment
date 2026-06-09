function getEmbedUrl(url) {
  if (!url || typeof url !== 'string') return ''

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace('/', '')}`
    }
  } catch {
    return ''
  }

  return ''
}

export default function VideoSection({ url }) {
  const embedUrl = getEmbedUrl(url)
  const hasUrl = typeof url === 'string' && url.trim()

  return (
    <section className="athleteSection">
      <h2>Highlight Video</h2>
      {embedUrl ? (
        <iframe
          className="videoEmbed"
          src={embedUrl}
          title="Athlete highlight video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : hasUrl ? (
        <a className="documentLink" href={url} target="_blank" rel="noreferrer">Open highlight video</a>
      ) : (
        <p>Not Provided</p>
      )}
    </section>
  )
}
