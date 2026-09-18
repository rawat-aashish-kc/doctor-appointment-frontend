import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[var(--accent)] text-white hover:bg-[#255a4f] disabled:opacity-50',
  secondary: 'border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--panel)] disabled:opacity-50',
  danger: 'bg-[var(--flag-soft)] text-[var(--flag)] hover:bg-[#e9d2ca] disabled:opacity-50',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-[4px] px-4 py-2 text-sm font-medium transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
    />
  )
}
