'use client'

import { useState } from 'react'

const initialForm = {
  athleteName: '',
  parentName: '',
  email: '',
  phone: '',
  sport: '',
  position: '',
  graduationYear: '',
  city: '',
  province: '',
  currentTeam: '',
  height: '',
  weight: '',
  gpa: '',
  highlightUrl: '',
  goals: ''
}

export default function Home() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }

      setStatus('success')
      setMessage('Profile received. Our recruiting team will review it and follow up shortly.')
      setForm(initialForm)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brandMark">CP</span>
            <span>Canadian Prospects</span>
          </div>
          <a href="#apply" className="navButton">Apply</a>
        </nav>

        <div className="heroContent">
          <p className="eyebrow">Recruitment intake</p>
          <h1>Canadian Prospects Recruitment</h1>
          <p className="heroCopy">
            Build a complete athlete profile for evaluation, coach follow-up, and next-step placement.
          </p>
          <div className="heroActions">
            <a href="#apply" className="primaryAction">Start profile</a>
            <a href="/admin" className="secondaryAction">Admin</a>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Recruitment priorities">
        <div>
          <strong>01</strong>
          <span>Academic fit</span>
        </div>
        <div>
          <strong>02</strong>
          <span>Athletic profile</span>
        </div>
        <div>
          <strong>03</strong>
          <span>Coach outreach</span>
        </div>
        <div>
          <strong>04</strong>
          <span>Placement plan</span>
        </div>
      </section>

      <section id="apply" className="application">
        <div className="sectionIntro">
          <p className="eyebrow">Athlete profile</p>
          <h2>Tell us who we are recruiting.</h2>
        </div>

        <form onSubmit={submitForm} className="profileForm">
          <label>
            Athlete name
            <input name="athleteName" value={form.athleteName} onChange={updateField} required />
          </label>
          <label>
            Parent or guardian
            <input name="parentName" value={form.parentName} onChange={updateField} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={updateField} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={updateField} />
          </label>
          <label>
            Sport
            <input name="sport" value={form.sport} onChange={updateField} required />
          </label>
          <label>
            Position
            <input name="position" value={form.position} onChange={updateField} />
          </label>
          <label>
            Graduation year
            <input name="graduationYear" value={form.graduationYear} onChange={updateField} />
          </label>
          <label>
            City
            <input name="city" value={form.city} onChange={updateField} />
          </label>
          <label>
            Province
            <input name="province" value={form.province} onChange={updateField} />
          </label>
          <label>
            Current team
            <input name="currentTeam" value={form.currentTeam} onChange={updateField} />
          </label>
          <label>
            Height
            <input name="height" value={form.height} onChange={updateField} />
          </label>
          <label>
            Weight
            <input name="weight" value={form.weight} onChange={updateField} />
          </label>
          <label>
            GPA or average
            <input name="gpa" value={form.gpa} onChange={updateField} />
          </label>
          <label>
            Highlight video URL
            <input type="url" name="highlightUrl" value={form.highlightUrl} onChange={updateField} />
          </label>
          <label className="wide">
            Recruiting goals
            <textarea name="goals" value={form.goals} onChange={updateField} rows="5" />
          </label>

          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Submit profile'}
          </button>

          {message && <p className={`formMessage ${status}`}>{message}</p>}
        </form>
      </section>
    </main>
  )
}
