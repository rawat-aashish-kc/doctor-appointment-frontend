import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './pages/patient/LoginPage'
import { RegisterPage } from './pages/patient/RegisterPage'
import { DoctorListPage } from './pages/patient/DoctorListPage'
import { DoctorDetailPage } from './pages/patient/DoctorDetailPage'
import { MyAppointmentsPage } from './pages/patient/MyAppointmentsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDoctorListPage } from './pages/admin/AdminDoctorListPage'
import { AdminDoctorFormPage } from './pages/admin/AdminDoctorFormPage'
import { AdminAvailabilityPage } from './pages/admin/AdminAvailabilityPage'
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage'
import { DoctorLoginPage } from './pages/doctor/DoctorLoginPage'
import { DoctorAppointmentsPage } from './pages/doctor/DoctorAppointmentsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute role="patient">
              <DoctorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <ProtectedRoute role="patient">
              <DoctorDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute role="patient">
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="admin">
              <AdminDoctorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors/new"
          element={
            <ProtectedRoute role="admin">
              <AdminDoctorFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <AdminDoctorFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors/:id/availability"
          element={
            <ProtectedRoute role="admin">
              <AdminAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="admin">
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/doctor/login" element={<DoctorLoginPage />} />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute role="doctor">
              <DoctorAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
