import { useEffect, useState } from 'react'
import { NavBar } from '../../components/NavBar'
import { api, unwrap } from '../../lib/api'
import type { Appointment } from '../../types'

export function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Appointment[]>('/admin/appointments')
      .then((res) => setAppointments(unwrap(res)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">All Appointments</h1>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{appt.patient?.name}</p>
                  <p className="text-sm text-gray-500">{appt.patient?.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appt.doctor.name}</p>
                  <p className="text-sm text-indigo-600">{appt.doctor.specialization}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {appt.appointment_date} · {appt.start_time}–{appt.end_time}
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    appt.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
