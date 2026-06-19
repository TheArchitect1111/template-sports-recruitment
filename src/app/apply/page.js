'use client'

import Link from 'next/link'
import { useState } from 'react'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  sport: '',
  position: '',
  height: '',
  weight: '',
  wingspan: '',
  gpa: '',
  satScore: '',
  currentSchool: '',
  graduationYear: '',
  cityProvince: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  bio: '',
  strengths: '',
  highlightVideoUrl: '',
  profilePhotoUrl: '',
  photoUpload: '',
  transcriptUpload: '',
  gameplayVideoUpload: '',
  paymentAgreement: false,
  nilInterest: false,
  termsAgreement: false,
  digitalSignature: ''
}

const sportOptions = ['Basketball', 'Football', 'Baseball', 'Soccer', 'Volleyball', 'Track', 'Other']
const supportEmail = 'mikecrpglobal@mississaugamagic.com'

const textFields = [
  ['firstName', 'First name', 'text', true],
  ['lastName', 'Last name', 'text', true],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone', 'tel', true],
  ['dateOfBirth', 'Date of birth', 'date', true],
  ['position', 'Position', 'text', true],
  ['height', 'Height', 'text', false],
  ['weight', 'Weight', 'text', false],
  ['wingspan', 'Wingspan', 'text', false],
  ['gpa', 'GPA', 'text', false],
  ['satScore', 'SAT score', 'text', false],
  ['currentSchool', 'Current school', 'text', true],
  ['graduationYear', 'Graduation year', 'text', true],
  ['cityProvince', 'City/province', 'text', true],
  ['parentName', 'Parent name', 'text', true],
  ['parentEmail', 'Parent email', 'email', true],
  ['parentPhone', 'Parent phone', 'tel', true],
  ['highlightVideoUrl', 'Highlight video URL', 'url', false],
  ['profilePhotoUrl', 'Profile photo URL', 'url', false]
]

export default function ApplyPage() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [profileUrl, setProfileUrl] = useState('')

  const updateField = (event) => {
    const { name, type, value, checked, files } = event.target
    const nextValue = type === 'checkbox' ? checked : type === 'file' ? files?.[0]?.name || '' : value
    setForm((current) => ({ ...current, [name]: nextValue }))
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')
    setProfileUrl('')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }

      setStatus('success')
      setMessage(result.profileUrl ? 'Application submitted. Public profile created.' : `Application submitted. Profile ID: ${result.profileId || 'pending'}`)
      setProfileUrl(result.profileUrl || '')
      setForm(initialForm)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <main>
      <header className="siteHeader">
        <Link className="brand" href="/">
          <span className="brandMark">CPR</span>
          <span className="brandText">
            <strong>CANADIAN PROSPECTS RECRUITMENT</strong>
            <small>FINDING OPPORTUNITY. BUILDING FUTURES.</small>
          </span>
        </Link>
        <nav className="topNav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/apply">Apply</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="applyShell">
        <div className="applyHero">
          <p className="eyebrow">Application</p>
          <h1>Athlete recruitment profile</h1>
          <p className="heroCopy">
            Complete the athlete profile and fee agreement so Canadian Prospects can evaluate placement opportunities.
          </p>
        </div>

        <form onSubmit={submitForm} className="profileForm">
          <section className="formSection">
            <div className="sectionIntro">
              <p className="eyebrow">Section 1</p>
              <h2>Athlete Profile</h2>
            </div>
            <div className="formGrid">
              {textFields.map(([name, label, type, required]) => (
                <label key={name}>
                  {label}
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={updateField}
                    required={required}
                  />
                </label>
              ))}

              <label>
                Sport
                <select name="sport" value={form.sport} onChange={updateField} required>
                  <option value="">Select sport</option>
                  {sportOptions.map((sport) => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </label>

              <label className="wide">
                Bio
                <textarea name="bio" value={form.bio} onChange={updateField} rows="5" />
              </label>
              <label className="wide">
                Strengths
                <textarea name="strengths" value={form.strengths} onChange={updateField} rows="5" />
              </label>
              <label>
                Photo upload
                <input type="file" name="photoUpload" accept="image/*" onChange={updateField} />
              </label>
              <label>
                Transcript upload
                <input type="file" name="transcriptUpload" accept=".pdf,.png,.jpg,.jpeg" onChange={updateField} />
              </label>
              <label>
                Gameplay video upload
                <input type="file" name="gameplayVideoUpload" accept="video/*" onChange={updateField} />
              </label>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionIntro">
              <p className="eyebrow">Section 2</p>
              <h2>Fee Agreement</h2>
            </div>
            <div className="formGrid">
              <label className="checkRow wide">
                <input
                  type="checkbox"
                  name="paymentAgreement"
                  checked={form.paymentAgreement}
                  onChange={updateField}
                  required
                />
                <span>I acknowledge the recruitment service fee is 3 payments of $500 each.</span>
              </label>
              <label className="checkRow wide">
                <input
                  type="checkbox"
                  name="nilInterest"
                  checked={form.nilInterest}
                  onChange={updateField}
                />
                <span>I am interested in NIL education and brand opportunity guidance.</span>
              </label>
              <label className="checkRow wide">
                <input
                  type="checkbox"
                  name="termsAgreement"
                  checked={form.termsAgreement}
                  onChange={updateField}
                  required
                />
                <span>I agree to the Canadian Prospects Recruitment terms and consent to athlete profile review.</span>
              </label>
              <label className="wide">
                Digital signature
                <input
                  name="digitalSignature"
                  value={form.digitalSignature}
                  onChange={updateField}
                  required
                />
              </label>
              <div className="formActions">
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit application'}
                </button>
                <a className="secondaryAction" href={`mailto:${supportEmail}?subject=${encodeURIComponent('CPR help: athlete application')}`}>
                  Need help?
                </a>
                {message && <p className={`formMessage ${status}`}>{message}</p>}
                {profileUrl && (
                  <p className="formMessage success">
                    Public profile: <a href={profileUrl}>{profileUrl}</a>
                  </p>
                )}
              </div>
            </div>
          </section>
        </form>
      </section>
    </main>
  )
}
