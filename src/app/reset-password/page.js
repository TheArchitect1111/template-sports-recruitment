'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submitReset = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, portal: 'CPR Admin Portal' })
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to request reset')
      }

      setMessage(result.message || 'Password reset request sent.')
      setForm({ name: '', email: '' })
    } catch (resetError) {
      setError(resetError.message)
    } finally {
      setLoading(false)
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

      <section className="loginHero">
        <div className="loginBrandPanel">
          <span className="cprLogo largeLogo" aria-label="CPR logo">
            <span>CPR</span>
          </span>
          <p className="eyebrow">CPR admin access</p>
          <h1>Start fresh with admin access</h1>
          <p className="heroCopy">There is no username to recover. Send a request and CPR administration can issue a fresh admin password.</p>
        </div>

        <form onSubmit={submitReset} className="loginCard">
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Request fresh password'}</button>
          {message && <p className="formMessage success">{message}</p>}
          {error && <p className="formMessage error">{error}</p>}
          <div className="loginHelpLinks">
            <Link href="/admin">Back to login</Link>
            <Link href="/apply">Need an athlete profile? Sign up</Link>
          </div>
        </form>
      </section>
    </main>
  )
}
