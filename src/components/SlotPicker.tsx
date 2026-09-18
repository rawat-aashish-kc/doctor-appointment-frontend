import type { Slot } from '../types'

interface SlotPickerProps {
  slots: Slot[]
  selected: string | null
  onSelect: (startTime: string) => void
}

export function SlotPicker({ slots, selected, onSelect }: SlotPickerProps) {
  if (slots.length === 0) {
    return <p className="text-sm text-[var(--ink)]/60">No available slots for this date.</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          key={slot.start_time}
          onClick={() => onSelect(slot.start_time)}
          className={`rounded-[4px] border px-3 py-2 text-sm font-medium transition-colors ${
            selected === slot.start_time
              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
              : 'border-[var(--line)] bg-transparent text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]'
          }`}
        >
          {slot.start_time}
        </button>
      ))}
    </div>
  )
}
