-- Migration 005: Recruitment & Talent Pool
-- Sprint 4: Rekrutmen module

-- ──────────────────────────────────────────────
-- 1. hr_recruitments (Job Postings / Lowongan)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hr_recruitments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  department_id   UUID REFERENCES hr_departments(id) ON DELETE SET NULL,
  position_id     UUID REFERENCES hr_positions(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  requirements    TEXT,
  employment_type TEXT NOT NULL DEFAULT 'full_time'
                  CHECK (employment_type IN ('full_time','part_time','contract','internship','freelance')),
  salary_min      NUMERIC(12,2),
  salary_max      NUMERIC(12,2),
  location        TEXT NOT NULL DEFAULT 'Jakarta',
  is_remote       BOOLEAN NOT NULL DEFAULT false,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','buka','tutup','batal')),
  opened_at       DATE,
  closed_at       DATE,
  vacancies       INTEGER NOT NULL DEFAULT 1,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_recruitments_tenant
  ON hr_recruitments (tenant_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_recruitments_status
  ON hr_recruitments (tenant_id, status)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 2. hr_applicants (Candidates / Pelamar)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hr_applicants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  recruitment_id  UUID NOT NULL REFERENCES hr_recruitments(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  current_company TEXT,
  current_position TEXT,
  source          TEXT NOT NULL DEFAULT 'website'
                  CHECK (source IN ('website','linkedin','referral','job_board','walk_in','other')),
  resume_url      TEXT,
  stage           TEXT NOT NULL DEFAULT 'melamar'
                  CHECK (stage IN ('melamar','screening','interview','assessment','offering','dihiring','ditolak')),
  applied_at      DATE NOT NULL DEFAULT CURRENT_DATE,
  notes           TEXT,
  rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_talent_pool  BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_applicants_tenant
  ON hr_applicants (tenant_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_applicants_recruitment
  ON hr_applicants (recruitment_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_applicants_stage
  ON hr_applicants (tenant_id, stage)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 3. RLS Policies
-- ──────────────────────────────────────────────
ALTER TABLE hr_recruitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_applicants ENABLE ROW LEVEL SECURITY;

-- hr_recruitments
CREATE POLICY "rec_select" ON hr_recruitments
  FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "rec_insert" ON hr_recruitments
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "rec_update" ON hr_recruitments
  FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "rec_delete" ON hr_recruitments
  FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- hr_applicants
CREATE POLICY "app_select" ON hr_applicants
  FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "app_insert" ON hr_applicants
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "app_update" ON hr_applicants
  FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "app_delete" ON hr_applicants
  FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- ──────────────────────────────────────────────
-- 4. Seed Data
-- ──────────────────────────────────────────────
INSERT INTO hr_recruitments (id, tenant_id, department_id, position_id, title, description, requirements, employment_type, salary_min, salary_max, location, is_remote, status, opened_at, vacancies, created_by) VALUES
('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hr_departments WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 (SELECT id FROM hr_positions WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 'Frontend Developer', 'Membangun dan mengembangkan antarmuka web modern menggunakan React/Next.js', 'Minimal 2 tahun pengalaman React, kuasai TypeScript dan CSS modern', 'full_time', 8000000, 15000000, 'Jakarta', false, 'buka', '2025-03-01', 2,
 '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hr_departments WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 (SELECT id FROM hr_positions WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 'Backend Developer', 'Merancang dan mengembangkan API serta layanan backend yang scalable', 'Pengalaman Node.js/Python, database SQL dan NoSQL, CI/CD', 'full_time', 10000000, 18000000, 'Jakarta', false, 'buka', '2025-02-15', 1,
 '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hr_departments WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 (SELECT id FROM hr_positions WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 'UI/UX Designer', 'Merancang pengalaman pengguna yang intuitif dan menarik', 'Portfolio desain, Figma, user research, prototyping', 'full_time', 7000000, 12000000, 'Remote', true, 'draft', NULL, 1,
 '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hr_departments WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 (SELECT id FROM hr_positions WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 'Project Manager', 'Memimpin dan mengoordinasikan tim proyek untuk pengirikan tepat waktu', 'PMP/Scrum Master, 5+ tahun manajemen proyek IT', 'full_time', 15000000, 25000000, 'Jakarta', false, 'tutup', '2025-01-10', 1,
 '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

('a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
 (SELECT id FROM hr_departments WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 (SELECT id FROM hr_positions WHERE tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
 'Data Analyst Intern', 'Menganalisis data untuk insight bisnis dan membuat dashboard', 'Mahasiswa semester akhir, Python/SQL dasar, tertarik analisis data', 'internship', 3000000, 5000000, 'Jakarta', false, 'buka', '2025-04-01', 3,
 '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Seed applicants
INSERT INTO hr_applicants (id, tenant_id, recruitment_id, full_name, email, phone, current_company, current_position, source, stage, applied_at, rating, is_talent_pool, created_by) VALUES
-- Frontend Developer applicants
('b0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Budi Santoso', 'budi.s@email.com', '081234567890', 'PT ABC', 'Junior Frontend Dev', 'linkedin', 'melamar', '2025-03-05', 3, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Andi Wijaya', 'andi.w@email.com', '081234567891', 'PT XYZ', 'Frontend Dev 3yr', 'referral', 'screening', '2025-03-08', 4, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Rizky Pratama', 'rizky.p@email.com', '081234567892', 'PT Tokopedia', 'Senior Frontend Dev', 'linkedin', 'interview', '2025-03-10', 5, true, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Ahmad Rizal', 'ahmad.r@email.com', '081234567893', NULL, 'Fresh Graduate', 'website', 'dihiring', '2025-03-02', 5, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

-- Backend Developer applicants
('b0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', 'Putri Rahayu', 'putri.r@email.com', '081234567894', 'PT Gojek', 'Backend Engineer', 'linkedin', 'interview', '2025-02-20', 4, true, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', 'Fajar Nugroho', 'fajar.n@email.com', '081234567895', 'PT Bukalapak', 'Backend Engineer', 'job_board', 'assessment', '2025-02-22', 4, true, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', 'Lisa Permata', 'lisa.p@email.com', '081234567896', 'PT Shopee', 'Senior Backend Dev', 'referral', 'assessment', '2025-02-25', 5, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

-- UI/UX Designer applicant (draft vacancy, still applied)
('b0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000003', 'Ayu Lestari', 'ayu.l@email.com', '081234567897', 'PT Gojek', 'UX Researcher', 'linkedin', 'interview', '2025-03-15', 4, true, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000003', 'Nina Sari', 'nina.s@email.com', '081234567898', NULL, 'UI Designer Freelance', 'website', 'dihiring', '2025-03-12', 5, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

-- Project Manager applicants (closed vacancy)
('b0000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', 'Hendra Kusuma', 'hendra.k@email.com', '081234567899', 'PT Telkom', 'Project Lead', 'linkedin', 'ditolak', '2025-01-15', 2, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),

-- Data Analyst Intern applicants
('b0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005', 'Sari Dewi', 'sari.d@email.com', '081234567800', 'Universitas Indonesia', 'Mahasiswa S1 Statistika', 'website', 'melamar', '2025-04-03', 3, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('b0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005', 'Dian Safitri', 'dian.s@email.com', '081234567801', 'Institut Teknologi Bandung', 'Mahasiswa S1 Matematika', 'job_board', 'offering', '2025-04-05', 4, false, '5d44f3f6-574f-4d2e-b636-2853a3e198b6');