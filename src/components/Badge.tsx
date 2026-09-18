interface BadgeProps {
  status: 'booked' | 'cancelled'
}

const STATUS_CLASSES: Record<BadgeProps['status'], string> = {
  booked: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  cancelled: 'bg-[var(--flag-soft)] text-[var(--flag)]',
}

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`inline-block rounded-[4px] px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}>
      {status}
    </span>
  )
}
