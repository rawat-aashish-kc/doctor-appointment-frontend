import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../../components/NavBar'
import { api, unwrap } from '../../lib/api'
import { DAY_LABELS, WEEK_ORDER } from '../../lib/days'
import type { Doctor } from '../../types'

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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Doctors &amp; Availability</h1>
          <Link
            to="/admin/doctors/new"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Doctor
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">No doctors yet. Add one to get started.</p>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{doctor.name}</h2>
                    <p className="text-sm text-indigo-600">{doctor.specialization}</p>
                    {(doctor.email || doctor.phone) && (
                      <p className="text-sm text-gray-500">
                        {[doctor.email, doctor.phone].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/doctors/${doctor.id}/availability`}
                      className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Manage availability
                    </Link>
                    <Link
                      to={`/admin/doctors/${doctor.id}/edit`}
                      className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      disabled={deletingId === doctor.id}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
                  {WEEK_ORDER.map((day) => {
                    const availability = doctor.availabilities?.find((a) => a.day_of_week === day)
                    return (
                      <div
                        key={day}
                        className={`rounded-md px-1 py-2 ${
                          availability ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        <div className="font-medium">{DAY_LABELS[day].slice(0, 3)}</div>
                        <div className="mt-0.5">
                          {availability ? `${availability.start_time}–${availability.end_time}` : '—'}
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
