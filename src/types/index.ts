export type Role = 'admin' | 'patient' | 'doctor'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Doctor {
  id: number
  name: string
  specialization: string
  email: string | null
  phone: string | null
  availabilities?: DoctorAvailability[]
  breaks?: DoctorBreak[]
}

export interface DoctorAvailability {
  id: number
  day_of_week: number
  start_time: string
  end_time: string
}

export interface DoctorBreak {
  id: number
  break_date: string
  start_time: string
  end_time: string
}

export type AppointmentStatus = 'booked' | 'cancelled'

export interface Appointment {
  id: number
  doctor: Doctor
  patient?: User
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
}

export interface Slot {
  start_time: string
  end_time: string
}

export interface SlotsResponse {
  date: string
  slots: Slot[]
}

export interface AuthResponse {
  user: User
  token: string
}
