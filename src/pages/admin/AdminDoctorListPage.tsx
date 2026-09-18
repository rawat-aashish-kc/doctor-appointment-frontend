import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
import { api, unwrap } from '../../lib/api'
import { DAY_LABELS, WEEK_ORDER } from '../../lib/days'
import type { Doctor } from '../../types'

const LINK_BUTTON = 'rounded-[4px] border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--panel)]'
const LINK_BUTTON_PRIMARY = 'rounded-[4px] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#255a4f]'

export function AdminDoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function load() {
    api
      .get<Doctor[]>('/admin/doctors')
      .then((res) => setDoctors(unwrap(res)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this doctor? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/admin/doctors/${id}`)
      load()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--panel)]">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          title="Doctors"
          action={
            <Link to="/admin/doctors/new" className={LINK_BUTTON_PRIMARY}>
              Add doctor
            </Link>
          }
        />

        {loading ? (
          <p className="text-[var(--ink)]/60">Loading…</p>
        ) : doctors.length === 0 ? (
          <p className="text-[var(--ink)]/60">No doctors yet. Add one to get started.</p>
        ) : (
          <div className="divide-y divide-[var(--line)] rounded-[4px] border border-[var(--line)] bg-white">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {doctor.name}
                    </h2>
                    <p className="text-sm text-[var(--accent)]">{doctor.specialization}</p>
                    {(doctor.email || doctor.phone) && (
                      <p className="text-sm text-[var(--ink)]/50">
                        {[doctor.email, doctor.phone].filter(Boolean).join('  ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/doctors/${doctor.id}/availability`} className={LINK_BUTTON}>
                      Manage availability
                    </Link>
                    <Link to={`/admin/doctors/${doctor.id}/breaks`} className={LINK_BUTTON}>
                      Manage breaks
                    </Link>
                    <Link to={`/admin/doctors/${doctor.id}/edit`} className={LINK_BUTTON}>
                      Edit
                    </Link>
                    <Button
                      type="button"
                      variant="danger"
                      disabled={deletingId === doctor.id}
                      onClick={() => handleDelete(doctor.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs">
                  {WEEK_ORDER.map((day) => {
                    const periods = doctor.availabilities?.filter((a) => a.day_of_week === day) ?? []
                    return (
                      <div
                        key={day}
                        className={`rounded-[4px] px-1 py-2 ${
                          periods.length > 0
                            ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                            : 'bg-[var(--panel)] text-[var(--ink)]/40'
                        }`}
                      >
                        <div className="font-medium">{DAY_LABELS[day].slice(0, 3)}</div>
                        <div className="mt-0.5 leading-tight">
                          {periods.length > 0
                            ? periods.map((p) => `${p.start_time}–${p.end_time}`).join(', ')
                            : '—'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
