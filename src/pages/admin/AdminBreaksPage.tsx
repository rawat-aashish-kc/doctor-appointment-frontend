import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
import { api, unwrap } from '../../lib/api'
import type { Doctor } from '../../types'

export function AdminBreaksPage() {
  const { id } = useParams<{ id: string }>()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [breakDate, setBreakDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    if (!id) return
    api
      .get<Doctor>(`/admin/doctors/${id}`)
      .then((res) => setDoctor(unwrap(res)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (startTime >= endTime) {
      setError('End time must be after start time.')
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/admin/doctors/${id}/breaks`, {
        break_date: breakDate,
        start_time: startTime,
        end_time: endTime,
      })
      setBreakDate('')
      setStartTime('')
      setEndTime('')
      load()
    } catch {
      setError('Could not add break. Check the date and times and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(breakId: number) {
    if (!id) return
    setDeletingId(breakId)
    try {
      await api.delete(`/admin/doctors/${id}/breaks/${breakId}`)
      load()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--panel)]">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader title="Breaks" />
        {doctor && <p className="mb-6 text-[var(--ink)]/60">{doctor.name}</p>}

        {loading ? (
          <p className="text-[var(--ink)]/60">Loading…</p>
        ) : (
          <>
            <div className="mb-6 divide-y divide-[var(--line)] rounded-[4px] border border-[var(--line)] bg-white">
              {(doctor?.breaks?.length ?? 0) === 0 ? (
                <p className="px-4 py-3 text-sm text-[var(--ink)]/60">No breaks added yet.</p>
              ) : (
                doctor?.breaks?.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="text-sm text-[var(--ink)]">
                      <span className="font-medium">{b.break_date}</span>
                      <span className="ml-2 text-[var(--flag)]">
                        {b.start_time.slice(0, 5)}–{b.end_time.slice(0, 5)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      disabled={deletingId === b.id}
                      onClick={() => handleDelete(b.id)}
                    >
                      {deletingId === b.id ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAdd} className="space-y-3 rounded-[4px] border border-[var(--line)] bg-white p-4">
              {error && (
                <p className="rounded-[4px] bg-[var(--flag-soft)] px-3 py-2 text-sm text-[var(--flag)]">{error}</p>
              )}
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--ink)]">Date</label>
                  <input
                    type="date"
                    required
                    value={breakDate}
                    onChange={(e) => setBreakDate(e.target.value)}
                    className="rounded-[4px] border border-[var(--line)] px-2 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--ink)]">Start</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="rounded-[4px] border border-[var(--line)] px-2 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--ink)]">End</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded-[4px] border border-[var(--line)] px-2 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Adding…' : 'Add break'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
