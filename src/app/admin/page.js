'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [records, setRecords] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const loadRecords = async (event) => {
    event.preventDefault()
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
        throw new Error(result.error || 'Unable to load leads')
      }

      setRecords(result.records || [])
      setMessage(result.skipped ? 'Airtable API key is not configured yet.' : '')
    } catch (error) {
      setMessage(error.message)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="adminShell">
      <section className="adminPanel">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Recruitment leads</h1>
        </div>

        <form onSubmit={loadRecords} className="adminLogin">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Load leads'}</button>
        </form>

        {message && <p className="formMessage error">{message}</p>}

        <div className="leadList">
          {records.map((record) => (
            <article key={record.id} className="leadCard">
              <strong>{record.fields['Athlete Name'] || 'Unnamed athlete'}</strong>
              <span>{record.fields.Sport || 'Sport TBD'} - {record.fields.Position || 'Position TBD'}</span>
              <span>{record.fields.Email || 'No email'}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
