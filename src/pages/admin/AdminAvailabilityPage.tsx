import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavBar } from '../../components/NavBar'
import { api, unwrap } from '../../lib/api'
import { DAY_LABELS, WEEK_ORDER } from '../../lib/days'
import type { Doctor } from '../../types'

interface DayRow {
  start_time: string
  end_time: string
}

type WeekState = Record<number, DayRow>

function emptyWeek(): WeekState {
  const week: WeekState = {}
  for (const day of WEEK_ORDER) {
    week[day] = { start_time: '', end_time: '' }
  }
  return week
}

export function AdminAvailabilityPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [week, setWeek] = useState<WeekState>(emptyWeek())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api
      .get<Doctor>(`/admin/doctors/${id}`)
      .then((res) => {
        const loadedDoctor = unwrap(res)
        setDoctor(loadedDoctor)
        const next = emptyWeek()
        for (const availability of loadedDoctor.availabilities ?? []) {
          next[availability.day_of_week] = {
            start_time: availability.start_time.slice(0, 5),
            end_time: availability.end_time.slice(0, 5),
          }
        }
        setWeek(next)
      })
      .finally(() => setLoading(false))
  }, [id])

  function updateDay(day: number, field: keyof DayRow, value: string) {
    setWeek((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const availabilities = WEEK_ORDER.filter((day) => week[day].start_time && week[day].end_time).map(
      (day) => ({
        day_of_week: day,
        start_time: week[day].start_time,
        end_time: week[day].end_time,
      }),
    )

    const invalidRow = availabilities.find((row) => row.start_time >= row.end_time)
    if (invalidRow) {
      setError('End time must be after start time for every day.')
      return
    }

    setSubmitting(true)
    try {
      await api.put(`/admin/doctors/${id}/availability`, { availabilities })
      navigate('/admin/doctors')
    } catch {
      setError('Could not save availability. Please check the times and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">Weekly Availability</h1>
        {doctor && <p className="mb-6 text-indigo-600">{doctor.name}</p>}

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {WEEK_ORDER.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium text-gray-700">{DAY_LABELS[day]}</span>
                <input
                  type="time"
                  value={week[day].start_time}
                  onChange={(e) => updateDay(day, 'start_time', e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="time"
                  value={week[day].end_time}
                  onChange={(e) => updateDay(day, 'end_time', e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                {(week[day].start_time || week[day].end_time) && (
                  <button
                    type="button"
                    onClick={() => setWeek((prev) => ({ ...prev, [day]: { start_time: '', end_time: '' } }))}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Clear
                  </button>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save Availability'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
