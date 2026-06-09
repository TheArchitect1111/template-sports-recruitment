'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const statuses = ['New', 'Reviewing', 'Contacted', 'Placed', 'Closed']

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
      const athleteName = fields['Athlete Name'] || ''
      const matchesSearch = !term || [athleteName, fields.Email, fields.Position, fields['Current School']]
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

      <section className="adminShell">
        <div className="adminPanel">
          <div>
            <p className="eyebrow">Admin portal</p>
            <h1>Athlete table</h1>
            <p className="heroCopy">Filter athletes, review profile links, and manage recruitment status from Airtable.</p>
          </div>

          <form onSubmit={loadRecords} className="adminLogin">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              required
            />
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Load athletes'}</button>
          </form>

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
                <th>School</th>
                <th>Grad</th>
                <th>Parent</th>
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
                      <Link href={`/profile/${record.id}`}>{fields['Athlete Name'] || 'Unnamed athlete'}</Link>
                      <div>{fields.Email || 'No email'}</div>
                    </td>
                    <td>{fields.Sport || 'TBD'} | {fields.Position || 'TBD'}</td>
                    <td>{fields['Current School'] || 'TBD'}</td>
                    <td>{fields['Graduation Year'] || 'TBD'}</td>
                    <td>{fields['Parent Name'] || 'TBD'}</td>
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
