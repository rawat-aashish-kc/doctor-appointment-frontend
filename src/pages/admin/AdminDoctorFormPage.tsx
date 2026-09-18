import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { NavBar } from '../../components/NavBar'
import { PageHeader } from '../../components/PageHeader'
import { api, unwrap } from '../../lib/api'
import type { Doctor } from '../../types'

const INPUT_CLASSES =
  'w-full rounded-[4px] border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none'
const LABEL_CLASSES = 'mb-1 block text-sm font-medium text-[var(--ink)]'

export function AdminDoctorFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api
      .get<Doctor>(`/admin/doctors/${id}`)
      .then((res) => {
        const doctor = unwrap(res)
        setName(doctor.name)
        setSpecialization(doctor.specialization)
        setEmail(doctor.email ?? '')
        setPhone(doctor.phone ?? '')
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (isEdit) {
        await api.put(`/admin/doctors/${id}`, { name, specialization, email, phone: phone || null })
      } else {
        await api.post('/admin/doctors', { name, specialization, email, phone: phone || null, password })
      }
      navigate('/admin/doctors')
    } catch {
      setError('Could not save doctor. Please check the form and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--panel)]">
      <NavBar />
      <div className="mx-auto max-w-lg px-4 py-8">
        <PageHeader title={isEdit ? 'Edit doctor' : 'Add doctor'} />
        {loading ? (
          <p className="text-[var(--ink)]/60">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-[4px] border border-[var(--line)] bg-white p-6">
            {error && (
              <p className="rounded-[4px] bg-[var(--flag-soft)] px-3 py-2 text-sm text-[var(--flag)]">{error}</p>
            )}
            <div>
              <label className={LABEL_CLASSES}>Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASSES} />
            </div>
            <div>
              <label className={LABEL_CLASSES}>Specialization</label>
              <input
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <label className={LABEL_CLASSES}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASSES}
              />
            </div>
            {!isEdit && (
              <div>
                <label className={LABEL_CLASSES}>Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={INPUT_CLASSES}
                />
              </div>
            )}
            <div>
              <label className={LABEL_CLASSES}>Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT_CLASSES} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
