import axios, { type AxiosResponse } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const role = localStorage.getItem('role')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = role === 'admin' ? '/admin/login' : role === 'doctor' ? '/doctor/login' : '/login'
    }
    return Promise.reject(error)
  },
)

// Laravel Eloquent API Resources wrap payloads in a top-level "data" key;
// plain JsonResponse endpoints (slots, auth) do not.
export function unwrap<T>(response: AxiosResponse<{ data: T } | T>): T {
  const body = response.data as { data?: T }
  return body && typeof body === 'object' && 'data' in body ? (body.data as T) : (response.data as T)
}
