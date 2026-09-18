import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        {doctor ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-900">{doctor.name}</h1>
            <p className="mb-6 text-indigo-600">{doctor.specialization}</p>
          </>
        ) : (
          <p className="mb-6 text-gray-500">Loading doctor…</p>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            min={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mb-4 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />

          <h2 className="mb-2 text-sm font-medium text-gray-700">Available slots</h2>
          {loadingSlots ? (
            <p className="text-sm text-gray-500">Loading slots…</p>
          ) : (
            <SlotPicker slots={slots} selected={selected} onSelect={setSelected} />
          )}

          {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            onClick={handleBook}
            disabled={!selected || booking}
            className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {booking ? 'Booking…' : selected ? `Book ${selected}` : 'Select a slot'}
          </button>
        </div>
      </div>
    </div>
  )
}
