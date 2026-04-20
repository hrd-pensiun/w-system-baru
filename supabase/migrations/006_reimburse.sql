-- Migration 006: Reimburse & Perjalanan Dinas
-- Sprint 5: Reimburse & Perdin module

-- ──────────────────────────────────────────────
-- 1. employee_reimbursements
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employee_reimbursements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  category        TEXT NOT NULL
                  CHECK (category IN ('medis','transport','makan','perdin','lainnya')),
  description     TEXT,
  amount          NUMERIC(12,2) NOT NULL,
  receipt_url     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','paid')),
  approved_by     UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at     TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reimburse_tenant
  ON employee_reimbursements (tenant_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_reimburse_employee
  ON employee_reimbursements (employee_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_reimburse_status
  ON employee_reimbursements (tenant_id, status)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 2. business_trips (Perjalanan Dinas)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_trips (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  destination     TEXT NOT NULL,
  purpose         TEXT,
  departure_date  DATE NOT NULL,
  return_date     DATE NOT NULL,
  budget          NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_cost     NUMERIC(12,2) DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','approved','selesai','dibatalkan')),
  approved_by     UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at     TIMESTAMPTZ,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_perdin_tenant
  ON business_trips (tenant_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_perdin_employee
  ON business_trips (employee_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_perdin_status
  ON business_trips (tenant_id, status)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 3. RLS Policies
-- ──────────────────────────────────────────────
ALTER TABLE employee_reimbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reimburse_select" ON employee_reimbursements
  FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "reimburse_insert" ON employee_reimbursements
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "reimburse_update" ON employee_reimbursements
  FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "reimburse_delete" ON employee_reimbursements
  FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "perdin_select" ON business_trips
  FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "perdin_insert" ON business_trips
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "perdin_update" ON business_trips
  FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "perdin_delete" ON business_trips
  FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- ──────────────────────────────────────────────
-- 4. Seed Data (reuse 3 existing employees: OFFSET 0,1,2)
-- ──────────────────────────────────────────────
-- Employee refs: emp0=OFFSET 0, emp1=OFFSET 1, emp2=OFFSET 2

INSERT INTO employee_reimbursements (id, tenant_id, employee_id, category, description, amount, status, approved_by, approved_at, paid_at, notes, created_by) VALUES
('c0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'medis', 'Biaya pemeriksaan dokter dan obat', 850000, 'approved',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-04-10T09:00:00+07:00', '2025-04-15T10:00:00+07:00',
  'Klaim rutin bulanan', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'transport', 'Taksi bandara Soekarno-Hatta PP', 450000, 'pending',
  NULL, NULL, NULL,
  'Meeting dengan klien', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'makan', 'Makan siang meeting klien PT Maju', 275000, 'approved',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-04-08T14:00:00+07:00', NULL,
  'Vendor lunch meeting', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'medis', 'Rawat jalan RS Bunda — lab & konsultasi', 1500000, 'approved',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-04-03T10:00:00+07:00', NULL,
  'Rawat jalan', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'transport', 'Sewa kendaraan dinas ke Surabaya', 2200000, 'rejected',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', NULL, NULL,
  'Klaim tidak memenuhi ketentuan', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'lainnya', 'Pulsa & internet kerja remote 1 bulan', 350000, 'paid',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-03-25T10:00:00+07:00', '2025-03-28T09:00:00+07:00',
  'Remote work support', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'makan', 'Catering workshop tim internal', 1800000, 'paid',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-03-20T11:00:00+07:00', '2025-03-22T09:00:00+07:00',
  'Workshop internal', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('c0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'transport', 'Parkir & tol perjalanan klien Jakarta', 420000, 'pending',
  NULL, NULL, NULL,
  'Klaim transport klien', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- ── Business Trips Seed ──
INSERT INTO business_trips (id, tenant_id, employee_id, destination, purpose, departure_date, return_date, budget, actual_cost, status, approved_by, approved_at, notes, created_by) VALUES
('d0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Surabaya', 'Meeting dengan klien PT Surabaya Maju', '2025-04-14', '2025-04-16', 5000000, 4800000, 'approved',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-04-12T10:00:00+07:00',
  'Perdin 3 hari', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('d0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'Bandung', 'Training leadership batch 2', '2025-04-21', '2025-04-22', 2500000, 0, 'draft',
  NULL, NULL,
  'Training 2 hari', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('d0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'Semarang', 'Audit cabang Semarang', '2025-04-07', '2025-04-09', 4500000, 4200000, 'selesai',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-04-05T09:00:00+07:00',
  'Audit 3 hari', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('d0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Yogyakarta', 'Site visit proyek baru', '2025-04-01', '2025-04-03', 3500000, 4100000, 'selesai',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-03-28T14:00:00+07:00',
  'Over budget karena upgrade hotel', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('d0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'Bali', 'Conference tech summit 2025', '2025-03-25', '2025-03-28', 7000000, 0, 'dibatalkan',
  NULL, NULL,
  'Dibatalkan karena jadwal berubah', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('d0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'Medan', 'Opening cabang baru Medan', '2025-03-10', '2025-03-13', 8000000, 7700000, 'selesai',
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', '2025-03-08T09:00:00+07:00',
  'Perdin 4 hari', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');