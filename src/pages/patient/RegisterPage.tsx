import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button'

export function RegisterPage() {
  const { registerPatient } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await registerPatient(name, email, password, passwordConfirmation)
      navigate('/doctors')
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Could not create account. Please check your details.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl text-[var(--ink)]">Create account</h1>
        {error && <p className="mb-4 rounded-[4px] bg-[var(--flag-soft)] px-3 py-2 text-sm text-[var(--flag)]">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]/80">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--line)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--line)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]/80">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--line)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]/80">Confirm password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--line)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating account…' : 'Register'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-[var(--ink)]/60">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--accent)] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
