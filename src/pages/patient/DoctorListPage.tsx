import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../../components/NavBar'
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Doctors</h1>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">No doctors available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctors/${doctor.id}`}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <h2 className="text-lg font-medium text-gray-900">{doctor.name}</h2>
                <p className="text-sm text-indigo-600">{doctor.specialization}</p>
                {doctor.email && <p className="mt-2 text-sm text-gray-500">{doctor.email}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
