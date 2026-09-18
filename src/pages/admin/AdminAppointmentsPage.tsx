import { useEffect, useState } from 'react'
import { Badge } from '../../components/Badge'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
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
    <div className="min-h-screen bg-[var(--panel)]">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader title="All appointments" />
        {loading ? (
          <p className="text-[var(--ink)]/60">Loading…</p>
        ) : appointments.length === 0 ? (
          <p className="text-[var(--ink)]/60">No appointments yet.</p>
        ) : (
          <div className="divide-y divide-[var(--line)] rounded-[4px] border border-[var(--line)] bg-white">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-[10rem]">
                  <p className="font-medium text-[var(--ink)]">{appt.patient?.name}</p>
                  <p className="text-sm text-[var(--ink)]/50">{appt.patient?.email}</p>
                </div>
                <div className="min-w-[10rem]">
                  <p className="font-medium text-[var(--ink)]">{appt.doctor.name}</p>
                  <p className="text-sm text-[var(--accent)]">{appt.doctor.specialization}</p>
                </div>
                <div className="text-sm text-[var(--ink)]/60">
                  <div>{appt.appointment_date}</div>
                  <div>
                    {appt.start_time}–{appt.end_time}
                  </div>
                </div>
                <Badge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
