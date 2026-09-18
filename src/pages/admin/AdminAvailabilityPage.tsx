import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
import { api, unwrap } from '../../lib/api'
import { DAY_LABELS, WEEK_ORDER } from '../../lib/days'
import type { Doctor } from '../../types'

interface PeriodRow {
  start_time: string
  end_time: string
}

type WeekState = Record<number, PeriodRow[]>

function emptyWeek(): WeekState {
  const week: WeekState = {}
  for (const day of WEEK_ORDER) {
    week[day] = []
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
          next[availability.day_of_week] = [
            ...next[availability.day_of_week],
            {
              start_time: availability.start_time.slice(0, 5),
              end_time: availability.end_time.slice(0, 5),
            },
          ]
        }
        setWeek(next)
      })
      .finally(() => setLoading(false))
  }, [id])

  function updatePeriod(day: number, index: number, field: keyof PeriodRow, value: string) {
    setWeek((prev) => {
      const periods = prev[day].map((period, i) => (i === index ? { ...period, [field]: value } : period))
      return { ...prev, [day]: periods }
    })
  }

  function addPeriod(day: number) {
    setWeek((prev) => ({ ...prev, [day]: [...prev[day], { start_time: '', end_time: '' }] }))
  }

  function removePeriod(day: number, index: number) {
    setWeek((prev) => ({ ...prev, [day]: prev[day].filter((_, i) => i !== index) }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const availabilities = WEEK_ORDER.flatMap((day) =>
      week[day]
        .filter((period) => period.start_time && period.end_time)
        .map((period) => ({ day_of_week: day, start_time: period.start_time, end_time: period.end_time })),
    )

    const invalidRow = availabilities.find((row) => row.start_time >= row.end_time)
    if (invalidRow) {
      setError('End time must be after start time for every period.')
      return
    }

    setSubmitting(true)
    try {
      await api.put(`/admin/doctors/${id}/availability`, { availabilities })
      navigate('/admin/doctors')
    } catch {
      setError('Could not save availability. Check for overlapping periods and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--panel)]">
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader title="Weekly availability" />
        {doctor && <p className="mb-6 text-[var(--ink)]/60">{doctor.name}</p>}

        {loading ? (
          <p className="text-[var(--ink)]/60">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="rounded-[4px] bg-[var(--flag-soft)] px-3 py-2 text-sm text-[var(--flag)]">{error}</p>
            )}
            <div className="divide-y divide-[var(--line)] rounded-[4px] border border-[var(--line)] bg-white">
              {WEEK_ORDER.map((day) => (
                <div key={day} className="flex flex-wrap items-start gap-3 px-4 py-3">
                  <span className="w-24 pt-1.5 text-sm font-medium text-[var(--ink)]">{DAY_LABELS[day]}</span>
                  <div className="flex flex-1 flex-col gap-2">
                    {week[day].map((period, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={period.start_time}
                          onChange={(e) => updatePeriod(day, index, 'start_time', e.target.value)}
                          className="rounded-[4px] border border-[var(--line)] px-2 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        />
                        <span className="text-sm text-[var(--ink)]/50">to</span>
                        <input
                          type="time"
                          value={period.end_time}
                          onChange={(e) => updatePeriod(day, index, 'end_time', e.target.value)}
                          className="rounded-[4px] border border-[var(--line)] px-2 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removePeriod(day, index)}
                          className="text-sm text-[var(--ink)]/40 hover:text-[var(--flag)]"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addPeriod(day)}
                      className="self-start text-sm text-[var(--accent)] hover:underline"
                    >
                      Add period
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Saving…' : 'Save availability'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
