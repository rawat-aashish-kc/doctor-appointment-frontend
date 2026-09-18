import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { NavBar } from '../../components/NavBar'
import { SlotPicker } from '../../components/SlotPicker'
import { api, unwrap } from '../../lib/api'
import type { Appointment, Doctor, Slot, SlotsResponse } from '../../types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [date, setDate] = useState(today())
  const [slots, setSlots] = useState<Slot[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Doctor[]>('/doctors').then((res) => {
      const found = unwrap(res).find((d) => String(d.id) === id)
      setDoctor(found ?? null)
    })
  }, [id])

  const fetchSlots = useCallback(() => {
    if (!id) return
    api
      .get<SlotsResponse>(`/doctors/${id}/slots`, { params: { date } })
      .then((res) => {
        setSlots(unwrap(res).slots)
        setSelected(null)
      })
      .finally(() => setLoadingSlots(false))
  }, [id, date])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  async function handleBook() {
    if (!id || !selected) return
    setError(null)
    setBooking(true)
    try {
      await api.post<Appointment>('/appointments', {
        doctor_id: Number(id),
        appointment_date: date,
        start_time: selected,
      })
      navigate('/appointments')
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      setError(
        status === 422
          ? 'That slot was just booked by someone else. Please pick another.'
          : 'Could not book this appointment. Please try again.',
      )
      fetchSlots()
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-xl px-4 py-8">
        {doctor ? (
          <div className="mb-6">
            <h1 className="text-2xl text-[var(--ink)]">{doctor.name}</h1>
            <p className="mt-1 text-sm text-[var(--accent)]">{doctor.specialization}</p>
          </div>
        ) : (
          <p className="mb-6 text-sm text-[var(--ink)]/60">Loading doctor…</p>
        )}

        <div className="border-t border-[var(--line)] pt-6">
          <label className="mb-1 block text-sm font-medium text-[var(--ink)]">Date</label>
          <input
            type="date"
            min={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mb-6 rounded-[4px] border border-[var(--line)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
          />

          <h2 className="mb-3 text-sm font-medium text-[var(--ink)]">Available slots</h2>
          {loadingSlots ? (
            <p className="text-sm text-[var(--ink)]/60">Loading slots…</p>
          ) : (
            <SlotPicker slots={slots} selected={selected} onSelect={setSelected} />
          )}

          {error && (
            <p className="mt-4 rounded-[4px] bg-[var(--flag-soft)] px-3 py-2 text-sm text-[var(--flag)]">{error}</p>
          )}

          <Button onClick={handleBook} disabled={!selected || booking} className="mt-6 w-full">
            {booking ? 'Booking…' : selected ? `Book ${selected}` : 'Select a slot'}
          </Button>
        </div>
      </div>
    </div>
  )
}
