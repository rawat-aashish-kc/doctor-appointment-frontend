import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-2xl text-[var(--ink)]">{title}</h1>
      {action}
    </div>
  )
}
