import type { Slot } from '../types'

interface SlotPickerProps {
  slots: Slot[]
  selected: string | null
  onSelect: (startTime: string) => void
}

export function SlotPicker({ slots, selected, onSelect }: SlotPickerProps) {
  if (slots.length === 0) {
    return <p className="text-sm text-gray-500">No available slots for this date.</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          key={slot.start_time}
          onClick={() => onSelect(slot.start_time)}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
            selected === slot.start_time
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          {slot.start_time}
        </button>
      ))}
    </div>
  )
}
