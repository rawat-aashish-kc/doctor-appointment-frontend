# Doctor Appointment Booking — Frontend

React + TypeScript + Tailwind frontend for a clinic appointment booking system. Talks to the [backend API](../doctor-appointment-backend) over Sanctum bearer tokens.

## Requirements

- Node.js 20+
- The backend running locally (see its README) — this app is useless without it.

## Setup

```bash
npm install
cp .env.example .env
```

`.env` just needs the backend's API base URL (already correct by default if you're running the backend on its default port):

```
VITE_API_URL=http://localhost:8000/api/v1
```

Start the dev server:

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Portals — who logs in where

This app has three separate login pages, one per role. There's no single shared login — go straight to the portal you need:

| Portal | Login URL | Who it's for | How to get an account |
|---|---|---|---|
| **Patient** | `http://localhost:5173/login` | Patients booking/managing their own appointments | Self-register at `http://localhost:5173/register` |
| **Admin** | `http://localhost:5173/admin/login` | Clinic staff managing doctors, availability, breaks, and viewing all appointments | Seeded — see backend README for the admin credentials |
| **Doctor** | `http://localhost:5173/doctor/login` | Doctors viewing their own appointment list (read-only) | Created by an admin when the doctor is added (email+password set at that time) — see backend README for sample seeded doctor logins |

Each portal only exposes what that role can do — e.g. a doctor account can't reach `/admin/*`, and a patient can't see other patients' appointments. Logging in redirects you to that portal's home page automatically; the root `/` redirects to the patient login.

## Build

```bash
npm run build   # type-checks + production build to dist/
npm run lint
```

## Project structure

```
src/
  pages/patient/   patient portal pages
  pages/admin/     admin portal pages
  pages/doctor/    doctor portal pages
  components/      shared UI primitives (Button, Badge, PageHeader, NavBar, SlotPicker)
  context/         auth state (token, current user, role)
  lib/             axios client + small helpers
  types/           shared TypeScript types matching the API's response shapes
```
