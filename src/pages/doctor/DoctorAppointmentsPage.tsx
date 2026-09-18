import { useEffect, useState } from 'react'
import { NavBar } from '../../components/NavBar'
import { api, unwrap } from '../../lib/api'
import type { Appointment } from '../../types'

export function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Appointment[]>('/doctor/appointments')
      .then((res) => setAppointments(unwrap(res)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">My Appointments</h1>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">You have no appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-gray-900">{appt.patient?.name}</p>
                <p className="text-sm text-gray-500">{appt.patient?.email}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {appt.appointment_date} · {appt.start_time}–{appt.end_time}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
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
