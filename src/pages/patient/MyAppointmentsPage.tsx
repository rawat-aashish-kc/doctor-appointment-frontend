import { useEffect, useState } from 'react'
import { NavBar } from '../../components/NavBar'
import { api, unwrap } from '../../lib/api'
import type { Appointment } from '../../types'

function isPast(appointment: Appointment): boolean {
  return new Date(`${appointment.appointment_date}T${appointment.start_time}`) < new Date()
}

export function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  function load() {
    api
      .get<Appointment[]>('/appointments')
      .then((res) => setAppointments(unwrap(res)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCancel(id: number) {
    setCancellingId(id)
    try {
      await api.delete(`/appointments/${id}`)
      load()
    } finally {
      setCancellingId(null)
    }
  }

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
              <div
                key={appt.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{appt.doctor.name}</p>
                  <p className="text-sm text-gray-500">
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
                {appt.status === 'booked' && !isPast(appt) && (
                  <button
                    onClick={() => handleCancel(appt.id)}
                    disabled={cancellingId === appt.id}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    {cancellingId === appt.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
