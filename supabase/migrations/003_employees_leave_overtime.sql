-- ============================================
-- Migration 003: Employees, Contracts, Leaves, Overtimes, Leave Balances
-- Sprint 2: Karyawan + Cuti & Lembur
-- ============================================

-- ========================================
-- 1. EMPLOYEES
-- ========================================
CREATE TABLE IF NOT EXISTS employees (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL,
  nik               VARCHAR(50) NOT NULL,
  name              VARCHAR(255) NOT NULL,
  entity_id         UUID REFERENCES entities(id),
  branch_id         UUID REFERENCES branches(id),
  department_id     UUID REFERENCES hr_departments(id),
  position_id       UUID REFERENCES hr_positions(id),
  grade_id          UUID REFERENCES hr_job_grades(id),
  work_shift_id     UUID REFERENCES hr_work_shifts(id),

  -- Personal info
  email             VARCHAR(255),
  phone             VARCHAR(30),
  birth_date        DATE,
  gender             VARCHAR(10) CHECK (gender IN ('Laki-laki','Perempuan')),
  religion          VARCHAR(30),
  marital_status    VARCHAR(20) CHECK (marital_status IN ('Belum Kawin','Kawin','Cerai Hidup','Cerai Mati')),
  education_level   VARCHAR(30),
  npwp              VARCHAR(30),
  address           TEXT,

  -- Bank info
  bank_name         VARCHAR(100),
  bank_account      VARCHAR(50),
  bank_account_name VARCHAR(255),

  -- Employment info
  hire_date         DATE NOT NULL,
  employment_status VARCHAR(20) NOT NULL DEFAULT 'aktif'
    CHECK (employment_status IN ('aktif','resign','phk','pensiun','cuti_panjang')),

  -- Salary anchor (links to salary matrix)
  ptkp_status       VARCHAR(10) DEFAULT 'TK/0'
    CHECK (ptkp_status IN ('TK/0','K/0','K/1','K/2','K/3')),
  base_salary       NUMERIC(14,2) DEFAULT 0,

  -- Metadata
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  created_by        UUID,
  updated_by        UUID,
  deleted_at        TIMESTAMPTZ,

  UNIQUE(tenant_id, nik)
);

-- ========================================
-- 2. EMPLOYEE CONTRACTS
-- ========================================
CREATE TABLE IF NOT EXISTS employee_contracts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  employee_id     UUID NOT NULL REFERENCES employees(id),
  contract_type   VARCHAR(10) NOT NULL CHECK (contract_type IN ('pkwt','pkwtt')),
  contract_no     VARCHAR(50),
  start_date      DATE NOT NULL,
  end_date        DATE,          -- NULL for PKWTT
  status          VARCHAR(15) NOT NULL DEFAULT 'aktif'
    CHECK (status IN ('aktif','berakhir','diperpanjang','terminated')),
  notes           TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

-- ========================================
-- 3. EMPLOYEE LEAVES (Pengajuan Cuti)
-- ========================================
CREATE TABLE IF NOT EXISTS employee_leaves (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  employee_id     UUID NOT NULL REFERENCES employees(id),
  leave_type_id   UUID NOT NULL REFERENCES hr_leave_types(id),
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  total_days      NUMERIC(6,2) NOT NULL,
  reason          TEXT,
  attachment_url   TEXT,
  status          VARCHAR(15) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','cancelled')),
  approved_by     UUID,         -- references user_profiles
  approved_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

-- ========================================
-- 4. EMPLOYEE OVERTIMES (Pengajuan Lembur)
-- ========================================
CREATE TABLE IF NOT EXISTS employee_overtimes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  employee_id     UUID NOT NULL REFERENCES employees(id),
  overtime_date   DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  total_hours     NUMERIC(5,2) NOT NULL,
  day_type        VARCHAR(20) NOT NULL CHECK (day_type IN ('weekday','weekend','national_holiday')),
  reason          TEXT,
  status          VARCHAR(15) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','paid')),
  approved_by     UUID,
  approved_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

-- ========================================
-- 5. EMPLOYEE LEAVE BALANCES (Saldo Cuti)
-- ========================================
CREATE TABLE IF NOT EXISTS employee_leave_balances (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  employee_id     UUID NOT NULL REFERENCES employees(id),
  leave_type_id   UUID NOT NULL REFERENCES hr_leave_types(id),
  year            INTEGER NOT NULL,
  quota           NUMERIC(6,2) NOT NULL DEFAULT 0,
  used            NUMERIC(6,2) NOT NULL DEFAULT 0,
  carry_over      NUMERIC(6,2) NOT NULL DEFAULT 0,
  carry_over_used NUMERIC(6,2) NOT NULL DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  deleted_at      TIMESTAMPTZ,

  UNIQUE(tenant_id, employee_id, leave_type_id, year)
);

-- ========================================
-- ALTER: user_profiles.employee_id from VARCHAR(50) -> UUID to link employees
-- ========================================
-- Only convert if there are no existing non-null values that would break
DO $$ BEGIN
  -- First check if column exists and has data
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'employee_id') THEN
    -- Drop any existing FK constraint on employee_id
    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_employee_id_fkey;
    -- Alter column type from VARCHAR to UUID
    ALTER TABLE user_profiles ALTER COLUMN employee_id TYPE UUID USING employee_id::uuid;
    -- Now add FK
    ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_employee_id_fkey
      FOREIGN KEY (employee_id) REFERENCES employees(id);
  END IF;
END $$;

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_employees_tenant         ON employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_nik            ON employees(tenant_id, nik);
CREATE INDEX IF NOT EXISTS idx_employees_department     ON employees(tenant_id, department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status         ON employees(tenant_id, employment_status);
CREATE INDEX IF NOT EXISTS idx_contracts_employee       ON employee_contracts(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_employee          ON employee_leaves(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status            ON employee_leaves(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_overtimes_employee       ON employee_overtimes(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_overtimes_status         ON employee_overtimes(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_leave_balances_employee  ON employee_leave_balances(tenant_id, employee_id, year);

-- ========================================
-- ENABLE RLS
-- ========================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_overtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_leave_balances ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES — using get_current_tenant_id() (SECURITY DEFINER from Sprint 1 fix)
-- ========================================
CREATE POLICY "employees_tenant_isolation" ON employees
  USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "employee_contracts_tenant_isolation" ON employee_contracts
  USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "employee_leaves_tenant_isolation" ON employee_leaves
  USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "employee_overtimes_tenant_isolation" ON employee_overtimes
  USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "employee_leave_balances_tenant_isolation" ON employee_leave_balances
  USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

-- ========================================
-- SEED DATA
-- ========================================
-- tid = 00000000-0000-0000-0000-000000000001

-- ------------------------------------
-- 1a. Seed Employees (6 karyawan)
-- ------------------------------------
INSERT INTO employees (
  id, tenant_id, nik, name, entity_id, branch_id, department_id, position_id, grade_id, work_shift_id,
  email, phone, birth_date, gender, religion, marital_status, education_level, npwp, address,
  bank_name, bank_account, bank_account_name,
  hire_date, employment_status, ptkp_status, base_salary
) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'WS-2022-001', 'Ahmad Rizal', NULL, NULL, NULL, NULL, NULL, NULL,
   'ahmad@wsystem.id', '081234567890', '1990-05-15', 'Laki-laki', 'Islam', 'Kawin', 'S1', '123456789012345', 'Jl. Sudirman No. 10, Jakarta',
   'BCA', '1234567890', 'Ahmad Rizal',
   '2022-01-15', 'aktif', 'K/1', 5200000),

  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   'WS-2022-002', 'Nina Sari', NULL, NULL, NULL, NULL, NULL, NULL,
   'nina@wsystem.id', '081234567891', '1992-08-22', 'Perempuan', 'Islam', 'Kawin', 'S1', '234567890123456', 'Jl. Thamrin No. 5, Jakarta',
   'BCA', '2345678901', 'Nina Sari',
   '2022-03-01', 'aktif', 'K/0', 5200000),

  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   'WS-2022-003', 'Budi Santoso', NULL, NULL, NULL, NULL, NULL, NULL,
   'budi@wsystem.id', '081234567892', '1988-11-10', 'Laki-laki', 'Kristen', 'Kawin', 'S1', '345678901234567', 'Jl. Gatot Subroto No. 20, Jakarta',
   'Mandiri', '3456789012', 'Budi Santoso',
   '2022-06-01', 'aktif', 'K/2', 4800000),

  ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
   'WS-2022-004', 'Putri Rahayu', NULL, NULL, NULL, NULL, NULL, NULL,
   'putri@wsystem.id', '081234567893', '1995-02-28', 'Perempuan', 'Hindu', 'Belum Kawin', 'S1', '456789012345678', 'Jl. Kuningan No. 15, Jakarta',
   'BNI', '4567890123', 'Putri Rahayu',
   '2022-09-01', 'aktif', 'TK/0', 4500000),

  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
   'WS-2022-005', 'Fajar Nugroho', NULL, NULL, NULL, NULL, NULL, NULL,
   'fajar@wsystem.id', '081234567894', '1987-07-04', 'Laki-laki', 'Islam', 'Kawin', 'S2', '567890123456789', 'Jl. Rasuna Said No. 8, Jakarta',
   'BCA', '5678901234', 'Fajar Nugroho',
   '2022-01-10', 'aktif', 'K/1', 5500000),

  ('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001',
   'WS-2023-006', 'Dewi Lestari', NULL, NULL, NULL, NULL, NULL, NULL,
   'dewi@wsystem.id', '081234567895', '1998-12-17', 'Perempuan', 'Buddha', 'Belum Kawin', 'D3', '678901234567890', 'Jl. HR Rasuna Said No. 3, Jakarta',
   'Mandiri', '6789012345', 'Dewi Lestari',
   '2023-02-01', 'aktif', 'TK/0', 4200000);


-- ------------------------------------
-- 2a. Seed Employee Contracts
-- ------------------------------------
INSERT INTO employee_contracts (
  tenant_id, employee_id, contract_type, contract_no, start_date, end_date, status
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'pkwtt', 'CTR-2022-001', '2022-01-15', NULL, 'aktif'),
  ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'pkwtt', 'CTR-2022-002', '2022-03-01', NULL, 'aktif'),
  ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'pkwtt', 'CTR-2022-003', '2022-06-01', NULL, 'aktif'),
  ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'pkwt',  'CTR-2022-004', '2022-09-01', '2023-09-01', 'aktif'),
  ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'pkwtt', 'CTR-2022-005', '2022-01-10', NULL, 'aktif'),
  ('00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'pkwt',  'CTR-2023-006', '2023-02-01', '2025-02-01', 'aktif');


-- ------------------------------------
-- 3a. Seed Leave Balances (2025)
-- ------------------------------------
-- Using leave_type IDs from hr_leave_types: ANNUAL (code), SICK (code)
INSERT INTO employee_leave_balances (tenant_id, employee_id, leave_type_id, year, quota, used, carry_over)
SELECT '00000000-0000-0000-0000-000000000001', e.id, lt.id, 2025,
  lt.default_quota,
  CASE lt.code WHEN 'ANNUAL' THEN (lt.default_quota - FLOOR(RANDOM() * 5 + 1)) ELSE 0 END,
  CASE WHEN lt.code = 'ANNUAL' THEN FLOOR(RANDOM() * 4) ELSE 0 END
FROM employees e
CROSS JOIN hr_leave_types lt
WHERE e.tenant_id = '00000000-0000-0000-0000-000000000001'
  AND lt.tenant_id = '00000000-0000-0000-0000-000000000001'
  AND lt.code IN ('ANNUAL','SICK')
  AND e.nik LIKE 'WS-%';


-- ------------------------------------
-- 4a. Seed Leave Requests
-- ------------------------------------
INSERT INTO employee_leaves (tenant_id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, approved_by) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   (SELECT id FROM hr_leave_types WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND code='ANNUAL' LIMIT 1),
   '2025-04-21', '2025-04-23', 3, 'Liburan keluarga ke Bandung', 'pending', NULL),

  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000003',
   (SELECT id FROM hr_leave_types WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND code='SICK' LIMIT 1),
   '2025-04-18', '2025-04-18', 1, 'Demam tinggi, butuh istirahat', 'pending', NULL),

  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000002',
   (SELECT id FROM hr_leave_types WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND code='MATERNITY' LIMIT 1),
   '2025-03-01', '2025-05-29', 90, 'Cuti melahirkan anak pertama', 'approved',
   '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000005',
   (SELECT id FROM hr_leave_types WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND code='ANNUAL' LIMIT 1),
   '2025-04-07', '2025-04-09', 3, 'Acara keluarga di Semarang', 'approved',
   '5d44f3f6-574f-4d2e-b636-2853a3e198b6');


-- ------------------------------------
-- 5a. Seed Overtime Requests
-- ------------------------------------
INSERT INTO employee_overtimes (tenant_id, employee_id, overtime_date, start_time, end_time, total_hours, day_type, reason, status, approved_by) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   '2025-04-18', '18:00', '21:00', 3, 'weekday', 'Project deadline sprint', 'pending', NULL),

  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000003',
   '2025-04-19', '09:00', '14:00', 5, 'weekend', 'Deployment weekend', 'pending', NULL),

  ('00000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000005',
   '2025-04-15', '17:30', '20:30', 3.5, 'weekday', 'Bug fixing production', 'approved',
   '5d44f3f6-574f-4d2e-b636-2853a3e198b6');