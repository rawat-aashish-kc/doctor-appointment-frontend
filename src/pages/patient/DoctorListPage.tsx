import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
import { api, unwrap } from '../../lib/api'
import type { Doctor } from '../../types'

export function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Doctor[]>('/doctors')
      .then((res) => setDoctors(unwrap(res)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader title="Doctors" />
        {loading ? (
          <p className="text-sm text-[var(--ink)]/60">Loading…</p>
        ) : doctors.length === 0 ? (
          <p className="text-sm text-[var(--ink)]/60">No doctors available yet.</p>
        ) : (
          <div className="border-t border-[var(--line)]">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctors/${doctor.id}`}
                className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-4 transition-colors hover:bg-[var(--panel)]"
              >
                <div>
                  <h2 className="text-lg text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {doctor.name}
                  </h2>
                  {doctor.email && <p className="mt-1 text-sm text-[var(--ink)]/60">{doctor.email}</p>}
                </div>
                <span className="whitespace-nowrap text-sm text-[var(--accent)]">{doctor.specialization}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
