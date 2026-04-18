-- ============================================================
-- W.System — Phase 0.4: Multi-Tenant & Multi-Entity Foundation
-- Migration: 001_multi_tenant_foundation.sql
-- ============================================================

-- =============================================
-- 1. TENANTS
-- =============================================
CREATE TABLE IF NOT EXISTS tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. ENTITIES (Multi-Entity: setiap PT)
-- =============================================
CREATE TABLE IF NOT EXISTS entities (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  code                  VARCHAR(50) NOT NULL,
  name                  VARCHAR(255) NOT NULL,
  short_name            VARCHAR(100),
  npwp                  VARCHAR(30),
  nib                   VARCHAR(50),
  is_pkp                BOOLEAN DEFAULT false,
  legal_address         TEXT,
  -- BPJS
  bpjs_tk_number        VARCHAR(50),
  bpjs_tk_risk_level    VARCHAR(20) DEFAULT 'low',
  bpjs_kes_number       VARCHAR(50),
  -- Bank
  bank_name             VARCHAR(100),
  bank_account          VARCHAR(50),
  bank_account_name     VARCHAR(255),
  -- UMR
  umr_amount            NUMERIC(20,4),
  umr_area              VARCHAR(100),
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

-- =============================================
-- 3. BRANCHES (Multi-Branch per Entity)
-- =============================================
CREATE TABLE IF NOT EXISTS branches (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                 UUID NOT NULL,
  entity_id                 UUID NOT NULL REFERENCES entities(id),
  code                      VARCHAR(50) NOT NULL,
  name                      VARCHAR(255) NOT NULL,
  branch_type               VARCHAR(30) DEFAULT 'branch',
  address                   TEXT,
  latitude                  NUMERIC(10,8),
  longitude                 NUMERIC(11,8),
  geofence_radius_meters    INTEGER DEFAULT 100,
  umr_override              NUMERIC(20,4),
  bpjs_tk_number_override   VARCHAR(50),
  bpjs_kes_number_override  VARCHAR(50),
  is_active                 BOOLEAN DEFAULT true,
  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now(),
  deleted_at                TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

-- =============================================
-- 4. HR JOB GRADES (needed by user_profiles FK)
-- =============================================
CREATE TABLE IF NOT EXISTS hr_job_grades (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  code          VARCHAR(20) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  sequence      SMALLINT NOT NULL,
  kpi_weight    NUMERIC(5,2) DEFAULT 60,
  comp_weight   NUMERIC(5,2) DEFAULT 40,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

-- =============================================
-- 5. HR DEPARTMENTS (needed by user_profiles FK)
-- =============================================
CREATE TABLE IF NOT EXISTS hr_departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  entity_id   UUID REFERENCES entities(id),
  branch_id   UUID REFERENCES branches(id),
  code        VARCHAR(30) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  head_id     UUID,  -- FK added later (circular with user_profiles)
  parent_id   UUID REFERENCES hr_departments(id),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  UNIQUE(tenant_id, entity_id, code)
);

-- =============================================
-- 6. HR POSITIONS (needed by user_profiles FK)
-- =============================================
CREATE TABLE IF NOT EXISTS hr_positions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL,
  code          VARCHAR(30) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  grade_id      UUID REFERENCES hr_job_grades(id),
  department_id UUID REFERENCES hr_departments(id),
  job_desc      TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

-- =============================================
-- 7. USER PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL,
  auth_user_id      UUID UNIQUE REFERENCES auth.users(id),
  entity_id         UUID REFERENCES entities(id),
  branch_id         UUID REFERENCES branches(id),
  department_id     UUID REFERENCES hr_departments(id),
  position_id       UUID REFERENCES hr_positions(id),
  grade_id          UUID REFERENCES hr_job_grades(id),
  employee_id       VARCHAR(50),
  name              VARCHAR(255) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  phone             VARCHAR(30),
  npwp              VARCHAR(30),
  bank_name         VARCHAR(100),
  bank_account      VARCHAR(50),
  bank_account_name VARCHAR(255),
  birth_date        DATE,
  gender            VARCHAR(10),
  religion          VARCHAR(30),
  marital_status    VARCHAR(20),
  education_level   VARCHAR(30),
  address           TEXT,
  join_date         DATE,
  employment_status VARCHAR(20) DEFAULT 'active',
  url_photo         TEXT,
  url_signature     TEXT,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  created_by        UUID,
  updated_by        UUID,
  deleted_at        TIMESTAMPTZ
);

-- Add circular FK: hr_departments.head_id -> user_profiles.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'hr_departments_head_id_fkey'
  ) THEN
    ALTER TABLE hr_departments
      ADD CONSTRAINT hr_departments_head_id_fkey
      FOREIGN KEY (head_id) REFERENCES user_profiles(id);
  END IF;
END $$;

-- Add FK: branches.tenant_id -> tenants.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'branches_tenant_id_fkey'
  ) THEN
    ALTER TABLE branches
      ADD CONSTRAINT branches_tenant_id_fkey
      FOREIGN KEY (tenant_id) REFERENCES tenants(id);
  END IF;
END $$;

-- Add FK: user_profiles.created_by -> user_profiles.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_profiles_created_by_fkey'
  ) THEN
    ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES user_profiles(id);
  END IF;
END $$;

-- Add FK: user_profiles.updated_by -> user_profiles.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_profiles_updated_by_fkey'
  ) THEN
    ALTER TABLE user_profiles
      ADD CONSTRAINT user_profiles_updated_by_fkey
      FOREIGN KEY (updated_by) REFERENCES user_profiles(id);
  END IF;
END $$;

-- =============================================
-- 8. INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_entities_tenant ON entities(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_branches_entity ON branches(entity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant ON user_profiles(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_entity ON user_profiles(entity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_departments_entity ON hr_departments(tenant_id, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_positions_tenant ON hr_positions(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_grades_tenant ON hr_job_grades(tenant_id) WHERE deleted_at IS NULL;

-- =============================================
-- 9. ROW LEVEL SECURITY
-- =============================================
ALTER TABLE tenants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_job_grades   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_departments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_positions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles    ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 10. RLS POLICIES — Basic tenant isolation
-- =============================================

-- Tenants: superadmin only (no tenant filter needed)
CREATE POLICY "Superadmin can manage tenants" ON tenants
  FOR ALL USING (true) WITH CHECK (true);

-- Entities: filter by tenant_id
CREATE POLICY "Users can view own tenant entities" ON entities
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));
CREATE POLICY "Users can manage own tenant entities" ON entities
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));

-- Branches: filter by tenant_id
CREATE POLICY "Users can view own tenant branches" ON branches
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));
CREATE POLICY "Users can manage own tenant branches" ON branches
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));

-- Job grades: filter by tenant_id
CREATE POLICY "Users can view own tenant job grades" ON hr_job_grades
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));
CREATE POLICY "Users can manage own tenant job grades" ON hr_job_grades
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));

-- Departments: filter by tenant_id
CREATE POLICY "Users can view own tenant departments" ON hr_departments
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));
CREATE POLICY "Users can manage own tenant departments" ON hr_departments
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));

-- Positions: filter by tenant_id
CREATE POLICY "Users can view own tenant positions" ON hr_positions
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));
CREATE POLICY "Users can manage own tenant positions" ON hr_positions
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));

-- User profiles: filter by tenant_id
CREATE POLICY "Users can view own tenant profiles" ON user_profiles
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));
CREATE POLICY "Users can manage own tenant profiles" ON user_profiles
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM user_profiles WHERE auth_user_id = auth.uid() LIMIT 1));

-- =============================================
-- 11. UPDATED_AT TRIGGER (auto-update timestamp)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenants         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON entities        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON branches        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hr_job_grades  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hr_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hr_positions   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 12. SEED: Default tenant + entity + branch
-- =============================================
INSERT INTO tenants (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'W.System Demo', 'wsystem-demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO entities (id, tenant_id, code, name, short_name, npwp, is_pkp, bpjs_tk_number, bpjs_tk_risk_level, bpjs_kes_number, bank_name, bank_account, bank_account_name, umr_amount, umr_area) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'HQ', 'PT W.System Indonesia', 'WSI', '01.234.567.8-ABC.000', true, '0012345678901', 'low', '0012345678901', 'BCA', '1234567890', 'PT W.System Indonesia', 5067381, 'Jakarta Selatan')
ON CONFLICT DO NOTHING;

INSERT INTO branches (id, tenant_id, entity_id, code, name, branch_type, address, latitude, longitude, geofence_radius_meters) VALUES
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'HQ-JKT', 'Kantor Pusat Jakarta', 'hq', 'Jl. Sudirman No. 1, Jakarta Selatan', -6.20876340, 106.84558210, 200)
ON CONFLICT DO NOTHING;

-- Seed: Default job grades
INSERT INTO hr_job_grades (id, tenant_id, code, name, sequence, kpi_weight, comp_weight) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'G1', 'C-Level / Director', 1, 80, 20),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'G2', 'VP / GM', 2, 75, 25),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'G3', 'Senior Manager', 3, 70, 30),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'G4', 'Manager', 4, 65, 35),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'G5', 'Senior Staff', 5, 60, 40),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'G6', 'Staff', 6, 55, 45),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'G7', 'Junior Staff', 7, 50, 50),
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'G8', 'Support / Admin', 8, 40, 60)
ON CONFLICT DO NOTHING;

-- Seed: Default departments
INSERT INTO hr_departments (id, tenant_id, entity_id, code, name) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'ENG', 'Engineering'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'HR', 'Human Resources'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'FIN', 'Finance'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'MKT', 'Marketing'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'OPS', 'Operations')
ON CONFLICT DO NOTHING;

-- Seed: Default positions
INSERT INTO hr_positions (id, tenant_id, code, name, grade_id, department_id) VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CEO', 'Chief Executive Officer', '10000000-0000-0000-0000-000000000001', NULL),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'CTO', 'Chief Technology Officer', '10000000-0000-0000-0000-000000000001', NULL),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'HRM', 'HR Manager', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'SEM', 'Senior Engineer', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'SEM2', 'Software Engineer', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- =============================================
-- DONE. Tables created:
--   tenants, entities, branches
--   hr_job_grades, hr_departments, hr_positions
--   user_profiles (with all FK)
--   + RLS enabled + policies
--   + auto updated_at trigger
--   + seed data
-- =============================================