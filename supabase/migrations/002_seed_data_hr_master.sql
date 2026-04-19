-- ============================================================
-- Migration 002: Seed Data — HR Master Tables
-- Phase 0.11: BPJS configs, PPh21 configs, TER brackets,
--             salary components, overtime rules, leave types
-- ============================================================

-- Tenant ID from seed: 00000000-0000-0000-0000-000000000001
-- Entity ID from seed: 00000000-0000-0000-0000-000000000010

-- ========================================
-- 1. HR Work Shifts (default shifts)
-- ========================================
CREATE TABLE IF NOT EXISTS hr_work_shifts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  entity_id     UUID REFERENCES entities(id),
  name          VARCHAR(100) NOT NULL,
  code          VARCHAR(30) NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  is_overnight  BOOLEAN DEFAULT false,
  break_minutes INTEGER DEFAULT 60,
  grace_period_minutes INTEGER DEFAULT 15,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);
ALTER TABLE hr_work_shifts ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. HR Work Calendars (holidays, etc)
-- ========================================
CREATE TABLE IF NOT EXISTS hr_work_calendars (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  entity_id     UUID REFERENCES entities(id),
  date          DATE NOT NULL,
  day_type      VARCHAR(20) NOT NULL
                CHECK (day_type IN ('workday','weekend','national_holiday','company_holiday')),
  name          VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, entity_id, date)
);
ALTER TABLE hr_work_calendars ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. HR City UMR (minimum wage per city)
-- ========================================
CREATE TABLE IF NOT EXISTS hr_city_umr (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  city_name   VARCHAR(100) NOT NULL,
  province    VARCHAR(100),
  year        INTEGER NOT NULL,
  umr_amount  NUMERIC(20,4) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, city_name, year)
);
ALTER TABLE hr_city_umr ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. HR Salary Matrix (grade × step → amount)
-- ========================================
CREATE TABLE IF NOT EXISTS hr_salary_matrix (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  entity_id       UUID REFERENCES entities(id),
  grade_id        UUID NOT NULL REFERENCES hr_job_grades(id),
  step            INTEGER NOT NULL,
  amount          NUMERIC(20,4) NOT NULL,
  effective_date  DATE NOT NULL,
  end_date        DATE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  created_by      UUID,
  UNIQUE(tenant_id, entity_id, grade_id, step, effective_date)
);
ALTER TABLE hr_salary_matrix ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. HR BPJS Configs
-- ========================================
CREATE TABLE IF NOT EXISTS hr_bpjs_configs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL,
  effective_year        INTEGER NOT NULL,
  tk_jkk_rate           NUMERIC(8,6) DEFAULT 0.0024,
  tk_jkm_rate           NUMERIC(8,6) DEFAULT 0.003,
  tk_jht_employee_rate  NUMERIC(8,6) DEFAULT 0.02,
  tk_jht_company_rate   NUMERIC(8,6) DEFAULT 0.037,
  tk_jp_employee_rate   NUMERIC(8,6) DEFAULT 0.01,
  tk_jp_company_rate    NUMERIC(8,6) DEFAULT 0.02,
  tk_jp_max_salary      NUMERIC(20,4) DEFAULT 9559600,
  kes_employee_rate     NUMERIC(8,6) DEFAULT 0.01,
  kes_company_rate      NUMERIC(8,6) DEFAULT 0.04,
  kes_max_salary        NUMERIC(20,4) DEFAULT 12000000,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, effective_year)
);
ALTER TABLE hr_bpjs_configs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. HR PPh21 Configs
-- ========================================
CREATE TABLE IF NOT EXISTS hr_pph21_configs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL,
  effective_year      INTEGER NOT NULL,
  ptkp_tk0            NUMERIC(20,4) DEFAULT 54000000,
  ptkp_k0             NUMERIC(20,4) DEFAULT 58500000,
  ptkp_k1             NUMERIC(20,4) DEFAULT 63000000,
  ptkp_k2             NUMERIC(20,4) DEFAULT 67500000,
  ptkp_k3             NUMERIC(20,4) DEFAULT 72000000,
  jabatan_rate        NUMERIC(8,6)  DEFAULT 0.05,
  jabatan_max_annual  NUMERIC(20,4) DEFAULT 6000000,
  non_npwp_surcharge  NUMERIC(8,6)  DEFAULT 0.20,
  progressive_brackets JSONB DEFAULT '[
    {"min":0,"max":60000000,"rate":0.05},
    {"min":60000000,"max":250000000,"rate":0.15},
    {"min":250000000,"max":500000000,"rate":0.25},
    {"min":500000000,"max":5000000000,"rate":0.30},
    {"min":5000000000,"max":null,"rate":0.35}
  ]',
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, effective_year)
);
ALTER TABLE hr_pph21_configs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 7. HR TER Brackets (PMK 168/2023)
-- ========================================
CREATE TABLE IF NOT EXISTS hr_ter_brackets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  effective_year  INTEGER NOT NULL,
  ptkp_status     VARCHAR(10) NOT NULL,
  income_min      NUMERIC(20,4) NOT NULL,
  income_max      NUMERIC(20,4),
  rate            NUMERIC(8,6) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, effective_year, ptkp_status, income_min)
);
ALTER TABLE hr_ter_brackets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 8. HR Salary Components
-- ========================================
CREATE TABLE IF NOT EXISTS hr_salary_components (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  code            VARCHAR(30) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  component_type  VARCHAR(20) NOT NULL CHECK (component_type IN ('earning','deduction')),
  category        VARCHAR(50) NOT NULL,
  is_taxable      BOOLEAN DEFAULT true,
  is_bpjs_base    BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);
ALTER TABLE hr_salary_components ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 9. HR Overtime Rules
-- ========================================
CREATE TABLE IF NOT EXISTS hr_overtime_rules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  entity_id     UUID REFERENCES entities(id),
  day_type      VARCHAR(20) NOT NULL CHECK (day_type IN ('weekday','weekend','national_holiday')),
  hour_from     INTEGER NOT NULL,
  hour_to       INTEGER,
  multiplier    NUMERIC(4,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hr_overtime_rules ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 10. HR Leave Types (8 default)
-- ========================================
CREATE TABLE IF NOT EXISTS hr_leave_types (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  code            VARCHAR(30) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  default_quota   NUMERIC(6,2) NOT NULL DEFAULT 0,
  is_paid         BOOLEAN DEFAULT true,
  is_carry_over   BOOLEAN DEFAULT false,
  carry_over_max  NUMERIC(6,2) DEFAULT 0,
  require_proof   BOOLEAN DEFAULT false,
  min_advance_days INTEGER DEFAULT 1,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);
ALTER TABLE hr_leave_types ENABLE ROW LEVEL SECURITY;

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_work_shifts_tenant      ON hr_work_shifts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_work_calendars_tenant    ON hr_work_calendars(tenant_id, entity_id);
CREATE INDEX IF NOT EXISTS idx_city_umr_tenant          ON hr_city_umr(tenant_id);
CREATE INDEX IF NOT EXISTS idx_salary_matrix_tenant     ON hr_salary_matrix(tenant_id, entity_id);
CREATE INDEX IF NOT EXISTS idx_bpjs_configs_tenant      ON hr_bpjs_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pph21_configs_tenant      ON hr_pph21_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ter_brackets_tenant       ON hr_ter_brackets(tenant_id, effective_year);
CREATE INDEX IF NOT EXISTS idx_salary_components_tenant ON hr_salary_components(tenant_id);
CREATE INDEX IF NOT EXISTS idx_overtime_rules_tenant     ON hr_overtime_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leave_types_tenant        ON hr_leave_types(tenant_id);

-- ========================================
-- RLS POLICIES (tenant_isolation)
-- ========================================
-- All HR master tables: users can see their own tenant's data

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'hr_work_shifts','hr_work_calendars','hr_city_umr','hr_salary_matrix',
    'hr_bpjs_configs','hr_pph21_configs','hr_ter_brackets','hr_salary_components',
    'hr_overtime_rules','hr_leave_types'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('
      CREATE POLICY "%s_tenant_isolation" ON %I
        USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()));
    ', tbl, tbl);
  END LOOP;
END;
$$;

-- ========================================
-- SEED DATA
-- ========================================

-- Use the seeded tenant ID
-- tid = 00000000-0000-0000-0000-000000000001

-- ------------------------------------
-- 5a. BPJS Config 2025
-- ------------------------------------
INSERT INTO hr_bpjs_configs (
  tenant_id, effective_year,
  tk_jkk_rate, tk_jkm_rate,
  tk_jht_employee_rate, tk_jht_company_rate,
  tk_jp_employee_rate, tk_jp_company_rate, tk_jp_max_salary,
  kes_employee_rate, kes_company_rate, kes_max_salary
) VALUES (
  '00000000-0000-0000-0000-000000000001', 2025,
  0.0024,   -- JKK 0.24%
  0.003,    -- JKM 0.3%
  0.02,     -- JHT karyawan 2%
  0.037,    -- JHT perusahaan 3.7%
  0.01,     -- JP karyawan 1%
  0.02,     -- JP perusahaan 2%
  9559600,  -- JP max salary
  0.01,     -- BPJS Kes karyawan 1%
  0.04,     -- BPJS Kes perusahaan 4%
  12000000  -- BPJS Kes max salary
);

-- ------------------------------------
-- 6a. PPh21 Config 2025
-- ------------------------------------
INSERT INTO hr_pph21_configs (
  tenant_id, effective_year,
  ptkp_tk0, ptkp_k0, ptkp_k1, ptkp_k2, ptkp_k3,
  jabatan_rate, jabatan_max_annual, non_npwp_surcharge,
  progressive_brackets
) VALUES (
  '00000000-0000-0000-0000-000000000001', 2025,
  54000000,  -- TK/0
  58500000,  -- K/0
  63000000,  -- K/1
  67500000,  -- K/2
  72000000,  -- K/3
  0.05,      -- Biaya jabatan 5%
  6000000,   -- Max biaya jabatan Rp6.000.000/tahun
  0.20,      -- Non-NPWP surcharge 20%
  '[{"min":0,"max":60000000,"rate":0.05},{"min":60000000,"max":250000000,"rate":0.15},{"min":250000000,"max":500000000,"rate":0.25},{"min":500000000,"max":5000000000,"rate":0.30},{"min":5000000000,"max":null,"rate":0.35}]'::jsonb
);

-- ------------------------------------
-- 7a. TER Brackets 2025 (PMK 168/2023)
-- ------------------------------------
-- TER brackets per PTKP status with income ranges and rates
-- Source: Peraturan Dirjen Pajak PER-25/PJ/2024 (terbaru untuk 2025)

-- TK/0
INSERT INTO hr_ter_brackets (tenant_id, effective_year, ptkp_status, income_min, income_max, rate) VALUES
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 0, 6600000, 0),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 6600000, 6950000, 0.005),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 6950000, 7400000, 0.01),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 7400000, 7900000, 0.015),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 7900000, 8550000, 0.02),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 8550000, 9350000, 0.025),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 9350000, 10300000, 0.03),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 10300000, 11450000, 0.035),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 11450000, 12800000, 0.04),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 12800000, 14550000, 0.045),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 14550000, 16850000, 0.05),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 16850000, 19800000, 0.055),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 19800000, 23750000, 0.06),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 23750000, 29000000, 0.065),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 29000000, 35950000, 0.07),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 35950000, 45200000, 0.075),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 45200000, 57700000, 0.08),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 57700000, 77700000, 0.09),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 77700000, 102700000, 0.10),
  ('00000000-0000-0000-0000-000000000001', 2025, 'TK/0', 102700000, NULL, 0.11);

-- K/0
INSERT INTO hr_ter_brackets (tenant_id, effective_year, ptkp_status, income_min, income_max, rate) VALUES
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 0, 6850000, 0),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 6850000, 7200000, 0.005),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 7200000, 7650000, 0.01),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 7650000, 8100000, 0.015),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 8100000, 8700000, 0.02),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 8700000, 9500000, 0.025),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 9500000, 10400000, 0.03),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 10400000, 11550000, 0.035),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 11550000, 12900000, 0.04),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 12900000, 14600000, 0.045),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 14600000, 16900000, 0.05),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 16900000, 19850000, 0.055),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 19850000, 23800000, 0.06),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 23800000, 29050000, 0.065),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 29050000, 36000000, 0.07),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 36000000, 45250000, 0.075),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 45250000, 57750000, 0.08),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 57750000, 77750000, 0.09),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 77750000, 102750000, 0.10),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/0', 102750000, NULL, 0.11);

-- K/1
INSERT INTO hr_ter_brackets (tenant_id, effective_year, ptkp_status, income_min, income_max, rate) VALUES
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 0, 7000000, 0),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 7000000, 7350000, 0.005),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 7350000, 7800000, 0.01),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 7800000, 8250000, 0.015),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 8250000, 8850000, 0.02),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 8850000, 9650000, 0.025),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 9650000, 10550000, 0.03),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 10550000, 11700000, 0.035),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 11700000, 13050000, 0.04),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 13050000, 14750000, 0.045),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 14750000, 17050000, 0.05),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 17050000, 20000000, 0.055),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 20000000, 23950000, 0.06),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 23950000, 29200000, 0.065),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 29200000, 36150000, 0.07),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 36150000, 45350000, 0.075),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 45350000, 57850000, 0.08),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 57850000, 77850000, 0.09),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 77850000, 102850000, 0.10),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/1', 102850000, NULL, 0.11);

-- K/2
INSERT INTO hr_ter_brackets (tenant_id, effective_year, ptkp_status, income_min, income_max, rate) VALUES
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 0, 7200000, 0),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 7200000, 7550000, 0.005),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 7550000, 8000000, 0.01),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 8000000, 8500000, 0.015),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 8500000, 9100000, 0.02),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 9100000, 9900000, 0.025),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 9900000, 10800000, 0.03),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 10800000, 11950000, 0.035),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 11950000, 13300000, 0.04),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 13300000, 15000000, 0.045),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 15000000, 17300000, 0.05),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 17300000, 20250000, 0.055),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 20250000, 24200000, 0.06),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 24200000, 29450000, 0.065),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 29450000, 36400000, 0.07),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 36400000, 45600000, 0.075),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 45600000, 58100000, 0.08),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 58100000, 78100000, 0.09),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 78100000, 103100000, 0.10),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/2', 103100000, NULL, 0.11);

-- K/3
INSERT INTO hr_ter_brackets (tenant_id, effective_year, ptkp_status, income_min, income_max, rate) VALUES
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 0, 7400000, 0),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 7400000, 7800000, 0.005),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 7800000, 8250000, 0.01),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 8250000, 8750000, 0.015),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 8750000, 9400000, 0.02),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 9400000, 10200000, 0.025),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 10200000, 11150000, 0.03),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 11150000, 12300000, 0.035),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 12300000, 13650000, 0.04),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 13650000, 15350000, 0.045),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 15350000, 17650000, 0.05),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 17650000, 20600000, 0.055),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 20600000, 24550000, 0.06),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 24550000, 29800000, 0.065),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 29800000, 36750000, 0.07),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 36750000, 45950000, 0.075),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 45950000, 58500000, 0.08),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 58500000, 78500000, 0.09),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 78500000, 103500000, 0.10),
  ('00000000-0000-0000-0000-000000000001', 2025, 'K/3', 103500000, NULL, 0.11);

-- ------------------------------------
-- 8a. Salary Components
-- ------------------------------------
INSERT INTO hr_salary_components (tenant_id, code, name, component_type, category, is_taxable, is_bpjs_base) VALUES
  ('00000000-0000-0000-0000-000000000001', 'BASIC',       'Gaji Pokok',              'earning',   'fixed',             true,  true),
  ('00000000-0000-0000-0000-000000000001', 'T_JAB',        'Tunjangan Jabatan',       'earning',   'benefit',           true,  false),
  ('00000000-0000-0000-0000-000000000001', 'T_TRANSPORT',  'Tunjangan Transport',      'earning',   'benefit',           false, false),
  ('00000000-0000-0000-0000-000000000001', 'T_MAKAN',      'Tunjangan Makan',          'earning',   'benefit',           false, false),
  ('00000000-0000-0000-0000-000000000001', 'LEMBUR',       'Lembur',                   'earning',   'overtime',          true,  false),
  ('00000000-0000-0000-0000-000000000001', 'JHT_EMP',      'JHT Karyawan 2%',          'deduction', 'bpjs_tk_employee',  false, false),
  ('00000000-0000-0000-0000-000000000001', 'JP_EMP',       'JP Karyawan 1%',           'deduction', 'bpjs_tk_employee',  false, false),
  ('00000000-0000-0000-0000-000000000001', 'BPJSKES_EMP',  'BPJS Kes Karyawan 1%',     'deduction', 'bpjs_kes_employee', false, false),
  ('00000000-0000-0000-0000-000000000001', 'PPH21',        'PPh 21',                   'deduction', 'pph21',             false, false);

-- ------------------------------------
-- 9a. Overtime Rules (Permenaker No.5/2021)
-- ------------------------------------
INSERT INTO hr_overtime_rules (tenant_id, entity_id, day_type, hour_from, hour_to, multiplier) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'weekday', 0, 1, 1.5),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'weekday', 1, NULL, 2.0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'weekend', 0, NULL, 2.0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'national_holiday', 0, NULL, 2.0);

-- ------------------------------------
-- 10a. Leave Types (8 default)
-- ------------------------------------
INSERT INTO hr_leave_types (tenant_id, code, name, default_quota, is_paid, is_carry_over, carry_over_max, require_proof, min_advance_days) VALUES
  ('00000000-0000-0000-0000-000000000001', 'ANNUAL',     'Cuti Tahunan',       12,  true,  true,  3, false, 1),
  ('00000000-0000-0000-0000-000000000001', 'SICK',        'Cuti Sakit',         0,   true,  false, 0, true,  0),
  ('00000000-0000-0000-0000-000000000001', 'PERSONAL',    'Cuti Pribadi',       0,   false, false, 0, false, 1),
  ('00000000-0000-0000-0000-000000000001', 'MATERNITY',   'Cuti Melahirkan',    90,  true,  false, 0, true,  7),
  ('00000000-0000-0000-0000-000000000001', 'PATERNITY',   'Cuti Ayah',          3,   true,  false, 0, false, 1),
  ('00000000-0000-0000-0000-000000000001', 'MARRIAGE',    'Cuti Menikah',       3,   true,  false, 0, false, 7),
  ('00000000-0000-0000-0000-000000000001', 'BEREAVEMENT', 'Cuti Duka',          2,   true,  false, 0, false, 0),
  ('00000000-0000-0000-0000-000000000001', 'UNPAID',      'Cuti Tanpa Gaji',    0,   false, false, 0, false, 1);

-- ------------------------------------
-- 1a. Default Work Shifts
-- ------------------------------------
INSERT INTO hr_work_shifts (tenant_id, entity_id, name, code, start_time, end_time, is_overnight, break_minutes, grace_period_minutes) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Reguler (08:00–17:00)', 'REGULER',    '08:00:00', '17:00:00', false, 60, 15),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Shift Pagi (06:00–14:00)', 'SHIFT_PAGI', '06:00:00', '14:00:00', false, 30, 10),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Shift Siang (14:00–22:00)', 'SHIFT_SIANG','14:00:00', '22:00:00', false, 30, 10),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Shift Malam (22:00–06:00)', 'SHIFT_MALAM','22:00:00', '06:00:00', true,  30, 10);

-- ------------------------------------
-- 3a. City UMR 2025 (DKI Jakarta + sekitarnya)
-- ------------------------------------
INSERT INTO hr_city_umr (tenant_id, city_name, province, year, umr_amount) VALUES
  ('00000000-0000-0000-0000-000000000001', 'DKI Jakarta',       'DKI Jakarta',              2025, 5397660),
  ('00000000-0000-0000-0000-000000000001', 'Kota Bekasi',       'Jawa Barat',               2025, 5397660),
  ('00000000-0000-0000-0000-000000000001', 'Kota Depok',        'Jawa Barat',               2025, 4905918),
  ('00000000-0000-0000-0000-000000000001', 'Kota Tangerang',    'Banten',                   2025, 4980630),
  ('00000000-0000-0000-0000-000000000001', 'Kota Bogor',         'Jawa Barat',               2025, 4680705),
  ('00000000-0000-0000-0000-000000000001', 'Kab. Bandung',      'Jawa Barat',               2025, 4100709),
  ('00000000-0000-0000-0000-000000000001', 'Kota Surabaya',     'Jawa Timur',               2025, 4750108),
  ('00000000-0000-0000-0000-000000000001', 'Kota Semarang',     'Jawa Tengah',              2025, 3900000),
  ('00000000-0000-0000-0000-000000000001', 'Kota Medan',        'Sumatera Utara',            2025, 3600000),
  ('00000000-0000-0000-0000-000000000001', 'Kota Makassar',     'Sulawesi Selatan',          2025, 3500000);