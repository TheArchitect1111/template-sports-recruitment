'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const statuses = ['New', 'Reviewing', 'Contacted', 'Placed', 'Closed']

function getAthleteName(fields) {
  return `${fields['First Name'] || ''} ${fields['Last Name'] || ''}`.trim() || 'Unnamed athlete'
}

function getProfileHref(record) {
  const fields = record.fields || {}
  if (fields['Profile Slug']) {
    return `/athlete/${fields['Profile Slug']}`
  }

  return `/athlete/${record.id}`
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [records, setRecords] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sportFilter, setSportFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')

  const sports = useMemo(() => {
    const values = records.map((record) => record.fields.Sport).filter(Boolean)
    return ['All', ...Array.from(new Set(values))]
  }, [records])

  const filteredRecords = useMemo(() => {
    const term = search.toLowerCase()

    return records.filter((record) => {
      const fields = record.fields
      const athleteName = getAthleteName(fields)
      const matchesSearch = !term || [athleteName, fields.Email, fields.Sport]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
      const matchesSport = sportFilter === 'All' || fields.Sport === sportFilter
      const matchesStatus = statusFilter === 'All' || (fields.Status || 'New') === statusFilter

      return matchesSearch && matchesSport && matchesStatus
    })
  }, [records, search, sportFilter, statusFilter])

  const loadRecords = async (event) => {
    event?.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Unable to load athletes')
      }

      setRecords(result.records || [])
      setMessage(result.skipped ? 'Airtable is not configured yet.' : '')
    } catch (error) {
      setMessage(error.message)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    setMessage('')

    try {
      const response = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, id, status })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Unable to update status')
      }

      setRecords((current) =>
        current.map((record) =>
          record.id === id ? { ...record, fields: { ...record.fields, Status: status } } : record
        )
      )
    } catch (error) {
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

      <section className="adminShell loginHero">
        <div className="loginBrandPanel">
          <span className="cprLogo largeLogo" aria-label="CPR logo">
            <span>CPR</span>
          </span>
          <div>
            <p className="eyebrow">Admin portal</p>
            <h1>Welcome, CPR team</h1>
            <p className="heroCopy">Log in to review athletes, manage profile status, and keep recruitment records organized.</p>
          </div>
        </div>

        <div className="adminPanel loginCard adminLoginCard">
          <div>
            <p className="eyebrow">Secure access</p>
            <h2>Athlete table</h2>
            <p className="panelCopy">No username is required. Enter the current CPR admin password to load athlete records from Airtable.</p>
          </div>

          <form onSubmit={loadRecords} className="adminLogin">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              required
            />
            <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in to Admin Portal'}</button>
          </form>

          <div className="loginHelpLinks">
            <Link href="/admin/forgot-password">Need a fresh password?</Link>
            <Link href="/apply">Sign up / submit athlete profile</Link>
          </div>

          <div className="adminToolbar">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search athlete, email, school"
            />
            <select value={sportFilter} onChange={(event) => setSportFilter(event.target.value)}>
              {sports.map((sport) => <option key={sport}>{sport}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {['All', ...statuses].map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>

          {message && <p className="formMessage error">{message}</p>}

          <table className="athleteTable">
            <thead>
              <tr>
                <th>Athlete</th>
                <th>Sport</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const fields = record.fields
                const status = fields.Status || 'New'

                return (
                  <tr key={record.id}>
                    <td>
                      <Link href={getProfileHref(record)}>{getAthleteName(fields)}</Link>
                      <div>{fields.Email || 'No email'}</div>
                    </td>
                    <td>{fields.Sport || 'TBD'}</td>
                    <td>{fields.Email || 'TBD'}</td>
                    <td>{fields.Phone || 'TBD'}</td>
                    <td>{fields['Date of Birth'] || 'TBD'}</td>
                    <td>
                      <div className="statusControl">
                        <span className="statusPill">{status}</span>
                        <select value={status} onChange={(event) => updateStatus(record.id, event.target.value)}>
                          {statuses.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
