-- Migration 008: Payroll (Periode Payroll & Slip Gaji)
-- Sprint 7: Payroll processing module

-- ──────────────────────────────────────────────
-- 1. payroll_periods
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payroll_periods (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_month    INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year     INTEGER NOT NULL,
  title           TEXT NOT NULL,
  entity_name     TEXT,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','processing','approved','paid','cancelled')),
  total_bruto     NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_netto     NUMERIC(15,2) NOT NULL DEFAULT 0,
  employee_count  INTEGER NOT NULL DEFAULT 0,
  pay_date        DATE,
  approved_by     UUID,
  approved_at     TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ,
  UNIQUE(tenant_id, period_month, period_year)
);
CREATE INDEX IF NOT EXISTS idx_payroll_periods_tenant ON payroll_periods(tenant_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 2. payroll_slips
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payroll_slips (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_id       UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_nik    TEXT,
  employee_name   TEXT,
  job_grade       TEXT,
  department      TEXT,
  position        TEXT,
  -- Pendapatan
  gaji_pokok      NUMERIC(15,2) NOT NULL DEFAULT 0,
  tunjangan_jabatan NUMERIC(15,2) NOT NULL DEFAULT 0,
  tunjangan_transport NUMERIC(15,2) NOT NULL DEFAULT 0,
  tunjangan_makan NUMERIC(15,2) NOT NULL DEFAULT 0,
  tunjangan_lainnya NUMERIC(15,2) NOT NULL DEFAULT 0,
  lembur_amount   NUMERIC(15,2) NOT NULL DEFAULT 0,
  reimburse_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_pendapatan NUMERIC(15,2) NOT NULL DEFAULT 0,
  -- Potongan
  jht_karyawan    NUMERIC(15,2) NOT NULL DEFAULT 0,
  jp_karyawan     NUMERIC(15,2) NOT NULL DEFAULT 0,
  bpjs_kes_karyawan NUMERIC(15,2) NOT NULL DEFAULT 0,
  pph21           NUMERIC(15,2) NOT NULL DEFAULT 0,
  potongan_lainnya NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_potongan  NUMERIC(15,2) NOT NULL DEFAULT 0,
  -- Hasil
  thp             NUMERIC(15,2) NOT NULL DEFAULT 0,
  -- Pajak method
  tax_method      TEXT NOT NULL DEFAULT 'gross'
                  CHECK (tax_method IN ('gross','gross_up','ter')),
  ptkp_status     TEXT,
  -- Status
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','approved','paid')),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payroll_slips_tenant ON payroll_slips(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payroll_slips_period ON payroll_slips(period_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payroll_slips_employee ON payroll_slips(employee_id) WHERE deleted_at IS NULL;

-- ════════════════════════════════════════════════
-- RLS POLICIES
-- ════════════════════════════════════════════════
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_slips ENABLE ROW LEVEL SECURITY;

-- payroll_periods
CREATE POLICY "payroll_periods_select" ON payroll_periods FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "payroll_periods_insert" ON payroll_periods FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "payroll_periods_update" ON payroll_periods FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "payroll_periods_delete" ON payroll_periods FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- payroll_slips
CREATE POLICY "payroll_slips_select" ON payroll_slips FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "payroll_slips_insert" ON payroll_slips FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "payroll_slips_update" ON payroll_slips FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "payroll_slips_delete" ON payroll_slips FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- ════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════
-- Tenant: 00000000-0000-0000-0000-000000000001

-- Payroll Periods
INSERT INTO payroll_periods (id, tenant_id, period_month, period_year, title, entity_name, status, total_bruto, total_netto, employee_count, pay_date, approved_by, notes, created_by) VALUES
('e0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 3, 2025, 'Gaji Maret 2025', 'PT W.System Indonesia', 'paid', 156500000, 121268000, 8, '2025-03-31', '5d44f3f6-574f-4d2e-b636-2853a3e198b6', 'Payroll Maret selesai', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('e0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 4, 2025, 'Gaji April 2025', 'PT W.System Indonesia', 'approved', 152300000, 118058000, 8, '2025-04-30', '5d44f3f6-574f-4d2e-b636-2853a3e198b6', 'Menunggu pembayaran', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('e0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 5, 2025, 'Gaji Mei 2025', 'PT W.System Indonesia', 'draft', 0, 0, 0, NULL, NULL, 'Belum digenerate', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Payroll Slips for March 2025 (period_id = e0000001-...001)
INSERT INTO payroll_slips (id, tenant_id, period_id, employee_id, employee_nik, employee_name, job_grade, department, position, gaji_pokok, tunjangan_jabatan, tunjangan_transport, tunjangan_makan, tunjangan_lainnya, lembur_amount, reimburse_amount, total_pendapatan, jht_karyawan, jp_karyawan, bpjs_kes_karyawan, pph21, potongan_lainnya, total_potongan, thp, tax_method, ptkp_status, status, created_by) VALUES
('e0000002-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'WS-2022-001', 'Ahmad Rizal', 'M1/3', 'Engineering', 'Frontend Developer',
  15000000, 2000000, 500000, 750000, 0, 450000, 0, 18700000,
  300000, 150000, 150000, 1230000, 0, 1830000, 16870000,
  'gross', 'TK/0', 'paid', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('e0000002-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'WS-2022-002', 'Nina Sari', 'M2/1', 'Design', 'UI/UX Designer',
  18000000, 2500000, 600000, 750000, 0, 0, 0, 21850000,
  370000, 185000, 150000, 1625000, 0, 2330000, 19520000,
  'gross_up', 'K/1', 'paid', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('e0000002-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'WS-2022-003', 'Budi Santoso', 'S1/4', 'Engineering', 'Backend Developer',
  10000000, 1500000, 400000, 500000, 0, 0, 350000, 12750000,
  200000, 100000, 100000, 650000, 0, 1050000, 11700000,
  'ter', 'K/2', 'paid', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Payroll Slips for April 2025 (period_id = e0000001-...002)
INSERT INTO payroll_slips (id, tenant_id, period_id, employee_id, employee_nik, employee_name, job_grade, department, position, gaji_pokok, tunjangan_jabatan, tunjangan_transport, tunjangan_makan, tunjangan_lainnya, lembur_amount, reimburse_amount, total_pendapatan, jht_karyawan, jp_karyawan, bpjs_kes_karyawan, pph21, potongan_lainnya, total_potongan, thp, tax_method, ptkp_status, status, created_by) VALUES
('e0000002-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000002',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'WS-2022-001', 'Ahmad Rizal', 'M1/3', 'Engineering', 'Frontend Developer',
  15000000, 2000000, 500000, 750000, 0, 0, 0, 18250000,
  300000, 150000, 150000, 1200000, 0, 1800000, 16450000,
  'gross', 'TK/0', 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('e0000002-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000002',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'WS-2022-002', 'Nina Sari', 'M2/1', 'Design', 'UI/UX Designer',
  18000000, 2500000, 600000, 750000, 0, 0, 0, 21850000,
  370000, 185000, 150000, 1625000, 0, 2330000, 19520000,
  'gross_up', 'K/1', 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');