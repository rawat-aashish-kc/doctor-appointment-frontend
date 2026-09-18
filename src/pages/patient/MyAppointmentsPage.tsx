import { useEffect, useState } from 'react'
import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
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
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader title="My Appointments" />
        {loading ? (
          <p className="text-sm text-[var(--ink)]/60">Loading…</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-[var(--ink)]/60">You have no appointments yet.</p>
        ) : (
          <div className="border-t border-[var(--line)]">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between gap-4 border-b border-[var(--line)] py-4"
              >
                <div>
                  <p className="text-lg text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {appt.doctor.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--ink)]/60">
                    {appt.appointment_date}
                    <br />
                    {appt.start_time}–{appt.end_time}
                  </p>
                  <div className="mt-2">
                    <Badge status={appt.status} />
                  </div>
                </div>
                {appt.status === 'booked' && !isPast(appt) && (
                  <Button
                    variant="danger"
                    onClick={() => handleCancel(appt.id)}
                    disabled={cancellingId === appt.id}
                  >
                    {cancellingId === appt.id ? 'Cancelling…' : 'Cancel'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
