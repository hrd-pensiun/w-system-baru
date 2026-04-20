# Sprint 1 — Master Data HR Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build the real, working Master Data HR module — replacing the mockup with live Supabase data, server actions, and functional CRUD UI.

**Architecture:** Next.js 16 App Router with Server Actions for mutations, Supabase for data, `@tanstack/react-table` DataTable component for listing, shadcn/ui v4 (base-ui) components for UI.

**Tech Stack:** Next.js 16, Supabase (client + server), TanStack Table, shadcn/ui v4, Tailwind, TypeScript

**DB tables already exist:** `user_profiles`, `hr_departments`, `hr_positions`, `hr_job_grades`, `hr_work_shifts`, `hr_work_calendars`, `hr_city_umr`, `hr_salary_matrix`, `hr_bpjs_configs`, `hr_pph21_configs`, `hr_ter_brackets`, `hr_salary_components`, `hr_overtime_rules`, `hr_leave_types`

**Existing shared components:** `DataTable`, `PageHeader`, `StatusBadge`, `EmptyState`, `ConfirmDialog`, `LoadingSkeleton`

**Mockup reference:** `/Users/book/Projects/w-system-baru/src/app/(dashboard)/mockups/phase-1/master-data/page.tsx`

---

## Task 1: Update database.types.ts with all HR master table types

**Objective:** Ensure TypeScript types for all 10 HR master tables are complete and accurate in `database.types.ts`.

**Files:**
- Modify: `src/types/database.types.ts`

**Verify:** Build passes: `cd /Users/book/Projects/w-system-baru && npx next build 2>&1 | tail -5`

---

## Task 2: Create server action — getCurrentUserTenant()

**Objective:** Utility server action that returns the current user's tenant_id, entity_id, branch_id from `user_profiles`. All other server actions need this for RLS.

**Files:**
- Create: `src/app/(dashboard)/hr/lib/get-current-user.ts`

**Step 1:** Write the function using `createClient()` from `@/lib/supabase/server`. Query `auth.getUser()`, then `user_profiles` where `auth_user_id = user.id` and `deleted_at IS NULL`. Return `{ tenantId, entityId, branchId, userId, name, email, gradeId, departmentId, positionId }`.

**Step 2:** Verify build passes.

---

## Task 3: Create server actions for Karyawan (user_profiles CRUD)

**Objective:** Full CRUD server actions for `user_profiles` (employee data).

**Files:**
- Create: `src/app/(dashboard)/hr/karyawan/actions.ts`

**Actions:**
1. `getEmployees(page, pageSize, search?, status?, departmentId?, gradeId?)` — paginated list with joins to `hr_departments`, `hr_positions`, `hr_job_grades`. Returns `PaginatedResponse<EmployeeRow>`.
2. `getEmployeeById(id)` — single employee with all relations.
3. `createEmployee(data)` — insert into `user_profiles`. Auto-generate `employee_id` format (EMP-YYYYMM-XXX).
4. `updateEmployee(id, data)` — update user_profile.
5. `deactivateEmployee(id)` — soft-delete (set `deleted_at = now()`, `is_active = false`).

**Returns:** `ActionResult<T>` from `@/types/shared`.

**Verify:** Build passes.

---

## Task 4: Create server actions for Departments, Positions, Grades

**Objective:** CRUD server actions for the 3 reference tables.

**Files:**
- Create: `src/app/(dashboard)/hr/karyawan/actions-master.ts`

**Actions:**
1. `getDepartments(tenantId)` — list all active departments for dropdowns.
2. `getPositions(tenantId)` — list all active positions.
3. `getGrades(tenantId)` — list all active grades.
4. `createDepartment(data)`, `updateDepartment(id, data)`, `deactivateDepartment(id)`
5. `createPosition(data)`, `updatePosition(id, data)`, `deactivatePosition(id)`
6. `createGrade(data)`, `updateGrade(id, data)`, `deactivateGrade(id)`

**Verify:** Build passes.

---

## Task 5: Create server actions for Work Shifts

**Objective:** CRUD server actions for `hr_work_shifts`.

**Files:**
- Create: `src/app/(dashboard)/hr/karyawan/actions-shifts.ts`

**Actions:**
1. `getShifts(tenantId)` — list all shifts.
2. `createShift(data)`, `updateShift(id, data)`, `deactivateShift(id)`

**Verify:** Build passes.

---

## Task 6: Create the Karyawan list page — real data

**Objective:** Replace mockup with real Karyawan list page using DataTable + TanStack Table columns + server actions.

**Files:**
- Create: `src/app/(dashboard)/hr/karyawan/page.tsx` — server component, calls `getEmployees()` and `getDepartments()` and `getGrades()` for filter dropdowns.
- Create: `src/app/(dashboard)/hr/karyawan/columns.tsx` — column definitions for employee table (NIK, Nama, Jabatan, Departemen, Grade, Tgl Masuk, Status, Actions).
- Create: `src/app/(dashboard)/hr/karyawan/karyawan-table.tsx` — client component wrapping `DataTable` with filters (status, department).

**Verify:** Navigate to `/hr/karyawan` — data loads from Supabase.

---

## Task 7: Create Employee form dialog (Create + Edit)

**Objective:** Dialog form for add/edit employee. Reuses `Dialog` from shadcn.

**Files:**
- Create: `src/app/(dashboard)/hr/karyawan/employee-form.tsx` — client component with `<Dialog>` containing form fields: name, email, phone, npwp, department (select), position (select), grade (select), join_date, employment_status, etc. On submit calls `createEmployee` or `updateEmployee` server action, then `router.refresh()`.

**Verify:** Add employee → appears in list. Edit employee → changes saved.

---

## Task 8: Create Departments, Positions, Grades management tabs

**Objective:** Tabs below Karyawan list for managing departments, positions, grades with inline CRUD dialogs.

**Files:**
- Create: `src/app/(dashboard)/hr/karyawan/departements-tab.tsx` — client component with DataTable + add/edit dialog.
- Create: `src/app/(dashboard)/hr/karyawan/positions-tab.tsx`
- Create: `src/app/(dashboard)/hr/karyawan/grades-tab.tsx`
- Update: `src/app/(dashboard)/hr/karyawan/page.tsx` — add Tabs component with 4 tabs: Karyawan, Departemen, Jabatan, Grade.

**Verify:** Each tab shows real data and CRUD works.

---

## Task 9: Create Work Shifts management page

**Objective:** Dedicated page for managing work shifts under Settings or as a separate route.

**Files:**
- Create: `src/app/(dashboard)/hr/shift-kerja/page.tsx` — server component.
- Create: `src/app/(dashboard)/hr/shift-kerja/columns.tsx`
- Create: `src/app/(dashboard)/hr/shift-kerja/shift-form.tsx`

**Verify:** `/hr/shift-kerja` shows shifts, CRUD works.

---

## Task 10: Create HR Config pages (BPJS, PPh21, TER, Salary Components, Overtime Rules, Leave Types, City UMR, Salary Matrix)

**Objective:** Configuration pages for all HR master data that was seeded in migration 002. These are read-mostly with edit capability.

**Files:**

**BPJS Configs:**
- Create: `src/app/(dashboard)/hr/config/bpjs/page.tsx`
- Create: `src/app/(dashboard)/hr/config/bpjs/actions.ts`
- Create: `src/app/(dashboard)/hr/config/bpjs/bpjs-form.tsx`

**PPh21 Configs:**
- Create: `src/app/(dashboard)/hr/config/pph21/page.tsx`
- Create: `src/app/(dashboard)/hr/config/pph21/actions.ts`
- Create: `src/app/(dashboard)/hr/config/pph21/pph21-form.tsx`

**TER Brackets:**
- Create: `src/app/(dashboard)/hr/config/ter/page.tsx`
- Create: `src/app/(dashboard)/hr/config/ter/actions.ts`

**Salary Components:**
- Create: `src/app/(dashboard)/hr/config/salary-components/page.tsx`
- Create: `src/app/(dashboard)/hr/config/salary-components/actions.ts`
- Create: `src/app/(dashboard)/hr/config/salary-components/component-form.tsx`

**Overtime Rules:**
- Create: `src/app/(dashboard)/hr/config/overtime-rules/page.tsx`
- Create: `src/app/(dashboard)/hr/config/overtime-rules/actions.ts`
- Create: `src/app/(dashboard)/hr/config/overtime-rules/overtime-form.tsx`

**Leave Types:**
- Create: `src/app/(dashboard)/hr/config/leave-types/page.tsx`
- Create: `src/app/(dashboard)/hr/config/leave-types/actions.ts`
- Create: `src/app/(dashboard)/hr/config/leave-types/leave-type-form.tsx`

**City UMR:**
- Create: `src/app/(dashboard)/hr/config/city-umr/page.tsx`
- Create: `src/app/(dashboard)/hr/config/city-umr/actions.ts`
- Create: `src/app/(dashboard)/hr/config/city-umr/umr-form.tsx`

**Salary Matrix:**
- Create: `src/app/(dashboard)/hr/config/salary-matrix/page.tsx`
- Create: `src/app/(dashboard)/hr/config/salary-matrix/actions.ts`
- Create: `src/app/(dashboard)/hr/config/salary-matrix/matrix-form.tsx`

**Verify:** Each config page loads data, edit dialogs work.

---

## Task 11: Update Sidebar navigation

**Objective:** Add all new HR routes to sidebar navigation under the HR group.

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

**Changes:** Update HR nav group to include:
- `/hr/karyawan` → Karyawan
- `/hr/shift-kerja` → Shift Kerja
- `/hr/config/bpjs` → Konfigurasi BPJS
- `/hr/config/pph21` → Konfigurasi PPh21
- `/hr/config/ter` → TER Brackets
- `/hr/config/salary-components` → Komponen Gaji
- `/hr/config/overtime-rules` → Aturan Lembur
- `/hr/config/leave-types` → Jenis Cuti
- `/hr/config/city-umr` → UMR Kota
- `/hr/config/salary-matrix` → Matriks Gaji

**Verify:** All sidebar links work and navigate to correct pages.

---

## Task 12: Final build verification + commit

**Objective:** Ensure everything compiles clean, test full flow, commit.

**Steps:**
1. `npx next build` — all routes compile without error.
2. `git add -A && git commit -m "feat: Sprint 1 — Master Data HR (real data, CRUD, config pages)"`
3. `git push` — deploy to Vercel.

**Verify:** All pages load on Vercel, sidebar navigation works, CRUD operations functional.
