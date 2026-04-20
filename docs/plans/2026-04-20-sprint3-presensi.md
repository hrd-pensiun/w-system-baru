# Sprint 3 — Presensi (Attendance) Implementation Plan

> **Goal:** Build the real, working Presensi (Attendance) module — replacing the mockup with live Supabase data, server actions, and functional CRUD UI.

**Architecture:** Same pattern as Sprint 1 & 2 — Server Actions + Supabase + DataTable + shadcn/ui v4.

**DB tables needed (new):**
1. `employee_attendances` — clock-in/out records, geolocation, status
2. `attendance_settings` — per-branch settings (geofence, work calendar, late tolerance)

**Existing tables referenced:** employees, hr_work_shifts, hr_work_calendars, branches

---

## Task 1: Migration 004 — Create attendance tables + RLS + seed

**Objective:** Create DB tables for attendance in Supabase.

**Tables:**

### employee_attendances
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| tenant_id | uuid (FK tenants) | RLS |
| employee_id | uuid (FK employees) | |
| branch_id | uuid (FK branches, nullable) | |
| date | date | Attendance date |
| clock_in | time | |
| clock_out | time | nullable |
| clock_in_lat | float8 | nullable |
| clock_in_lng | float8 | nullable |
| clock_out_lat | float8 | nullable |
| clock_out_lng | float8 | nullable |
| status | text | hadir, terlambat, izin, sakit, cuti, alpha, dinas_luar |
| late_minutes | int | default 0 |
| early_leave_minutes | int | default 0 |
| work_hours | numeric(5,2) | Calculated total work hours |
| notes | text | nullable |
| is_active | bool | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| created_by | uuid | nullable (FK auth.users) |
| updated_by | uuid | nullable |
| deleted_at | timestamptz | nullable |

### attendance_settings
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| tenant_id | uuid (FK tenants) | |
| branch_id | uuid (FK branches, nullable) | null = default for all |
| work_shift_id | uuid (FK hr_work_shifts, nullable) | Default shift |
| work_calendar_id | uuid (FK hr_work_calendars, nullable) | |
| late_tolerance_minutes | int | default 15 |
| early_leave_tolerance_minutes | int | default 0 |
| geofence_radius_meters | int | default 100 |
| require_photo | bool | default false |
| require_location | bool | default true |
| auto_clock_out | bool | default false |
| is_active | bool | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| created_by | uuid | nullable |
| updated_by | uuid | nullable |
| deleted_at | timestamptz | nullable |

**RLS:** Same pattern — tenant_id isolation using `get_current_tenant_id()`.

---

## Task 2: Update database.types.ts

Add `employee_attendances` and `attendance_settings` type definitions.

---

## Task 3: Create server actions

- `src/app/(dashboard)/hr/presensi/actions.ts`

Actions:
1. `getAttendances(filters?)` — list with employee join, filter by date, status
2. `getAttendanceById(id)`
3. `createAttendance(data)` — clock in
4. `updateAttendance(id, data)` — clock out, update status
5. `deleteAttendance(id)` — soft delete
6. `getAttendanceSettings()`
7. `updateAttendanceSettings(id, data)`

---

## Task 4: Create Presensi UI page

- `src/app/(dashboard)/hr/presensi/page.tsx` — server component, fetches today's attendance
- `src/app/(dashboard)/hr/presensi/attendance-tab.tsx` — client, DataTable + create/edit
- `src/app/(dashboard)/hr/presensi/settings-tab.tsx` — client, attendance settings form

Tabs: Riwayat Presensi | Pengaturan

Features:
- Date range filter
- Status filter (hadir, terlambat, sakit, cuti, alpha)
- Stats cards: Hadir, Terlambat, Izin/Sakit, Alpha
- Manual clock-in/out entry
- Attendance settings per branch

---

## Task 5: Build verification + push

1. `npx next build` — all routes compile
2. Git commit + push
3. Verify live deployment