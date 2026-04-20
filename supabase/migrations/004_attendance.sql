-- Migration 004: Employee Attendance + Attendance Settings
-- Sprint 3: Presensi module

-- ──────────────────────────────────────────────
-- 1. employee_attendances
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employee_attendances (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id   UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  branch_id     UUID REFERENCES branches(id) ON DELETE SET NULL,
  date          DATE NOT NULL,
  clock_in      TIME,
  clock_out     TIME,
  clock_in_lat  DOUBLE PRECISION,
  clock_in_lng  DOUBLE PRECISION,
  clock_out_lat DOUBLE PRECISION,
  clock_out_lng DOUBLE PRECISION,
  status        TEXT NOT NULL DEFAULT 'hadir'
                CHECK (status IN ('hadir','terlambat','izin','sakit','cuti','alpha','dinas_luar')),
  late_minutes       INTEGER NOT NULL DEFAULT 0,
  early_leave_minutes INTEGER NOT NULL DEFAULT 0,
  work_hours    NUMERIC(5,2) DEFAULT 0,
  notes         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID,
  updated_by    UUID,
  deleted_at    TIMESTAMPTZ
);

-- Unique: one attendance per employee per date
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendances_emp_date
  ON employee_attendances (employee_id, date)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attendances_tenant
  ON employee_attendances (tenant_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attendances_date
  ON employee_attendances (date)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 2. attendance_settings
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance_settings (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id                   UUID REFERENCES branches(id) ON DELETE SET NULL,
  work_shift_id               UUID REFERENCES hr_work_shifts(id) ON DELETE SET NULL,
  work_calendar_id            UUID REFERENCES hr_work_calendars(id) ON DELETE SET NULL,
  late_tolerance_minutes      INTEGER NOT NULL DEFAULT 15,
  early_leave_tolerance_minutes INTEGER NOT NULL DEFAULT 0,
  geofence_radius_meters      INTEGER NOT NULL DEFAULT 100,
  require_photo               BOOLEAN NOT NULL DEFAULT false,
  require_location            BOOLEAN NOT NULL DEFAULT true,
  auto_clock_out              BOOLEAN NOT NULL DEFAULT false,
  is_active                   BOOLEAN NOT NULL DEFAULT true,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                  UUID,
  updated_by                  UUID,
  deleted_at                  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_att_settings_tenant
  ON attendance_settings (tenant_id)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 3. RLS Policies
-- ──────────────────────────────────────────────
ALTER TABLE employee_attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_settings ENABLE ROW LEVEL SECURITY;

-- employee_attendances
CREATE POLICY "att_select" ON employee_attendances
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "att_insert" ON employee_attendances
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "att_update" ON employee_attendances
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

CREATE POLICY "att_delete" ON employee_attendances
  FOR DELETE USING (tenant_id = get_current_tenant_id());

-- attendance_settings
CREATE POLICY "aset_select" ON attendance_settings
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "aset_insert" ON attendance_settings
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "aset_update" ON attendance_settings
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

CREATE POLICY "aset_delete" ON attendance_settings
  FOR DELETE USING (tenant_id = get_current_tenant_id());

-- ──────────────────────────────────────────────
-- 4. Seed Data
-- ──────────────────────────────────────────────
-- Default attendance setting for tenant 00000000-0000-0000-0000-000000000001
INSERT INTO attendance_settings (
  tenant_id, late_tolerance_minutes, early_leave_tolerance_minutes,
  geofence_radius_meters, require_photo, require_location, auto_clock_out, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  15, 0, 100, false, true, false,
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6'
);

-- Sample attendance data for the 3 seeded employees
-- Using employee IDs from the seed in migration 003
DO $$
DECLARE
  emp1 UUID; emp2 UUID; emp3 UUID;
  shift_id UUID;
  admin_uuid UUID := '5d44f3f6-574f-4d2e-b636-2853a3e198b6';
  tid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  SELECT id INTO emp1 FROM employees WHERE nik = 'WS-2024-001' AND tenant_id = tid LIMIT 1;
  SELECT id INTO emp2 FROM employees WHERE nik = 'WS-2024-002' AND tenant_id = tid LIMIT 1;
  SELECT id INTO emp3 FROM employees WHERE nik = 'WS-2025-001' AND tenant_id = tid LIMIT 1;

  IF emp1 IS NOT NULL THEN
    -- Last 5 working days of attendance
    INSERT INTO employee_attendances (tenant_id, employee_id, date, clock_in, clock_out, status, late_minutes, work_hours, notes, created_by) VALUES
      (tid, emp1, '2026-04-14', '08:00', '17:05', 'hadir',  0, 9.08, NULL, admin_uuid),
      (tid, emp1, '2026-04-15', '08:02', '17:00', 'hadir',  0, 8.97, NULL, admin_uuid),
      (tid, emp1, '2026-04-16', '08:20', '17:00', 'terlambat', 20, 8.67, 'Macet', admin_uuid),
      (tid, emp1, '2026-04-17', '08:00', '17:10', 'hadir',  0, 9.17, NULL, admin_uuid),
      (tid, emp1, '2026-04-18', '08:05', '17:00', 'hadir',  5, 8.92, NULL, admin_uuid);
  END IF;

  IF emp2 IS NOT NULL THEN
    INSERT INTO employee_attendances (tenant_id, employee_id, date, clock_in, clock_out, status, late_minutes, work_hours, notes, created_by) VALUES
      (tid, emp2, '2026-04-14', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid),
      (tid, emp2, '2026-04-15', '08:15', '17:00', 'terlambat', 15, 8.75, 'Terlambat 15 mnt', admin_uuid),
      (tid, emp2, '2026-04-16', NULL,    NULL,    'sakit',  0, 0, 'Demam', admin_uuid),
      (tid, emp2, '2026-04-17', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid),
      (tid, emp2, '2026-04-18', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid);
  END IF;

  IF emp3 IS NOT NULL THEN
    INSERT INTO employee_attendances (tenant_id, employee_id, date, clock_in, clock_out, status, late_minutes, work_hours, notes, created_by) VALUES
      (tid, emp3, '2026-04-14', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid),
      (tid, emp3, '2026-04-15', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid),
      (tid, emp3, '2026-04-16', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid),
      (tid, emp3, '2026-04-17', NULL,    NULL,    'izin',   0, 0, 'Urusan keluarga', admin_uuid),
      (tid, emp3, '2026-04-18', '08:00', '17:00', 'hadir',  0, 9.00, NULL, admin_uuid);
  END IF;
END $$;