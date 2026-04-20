-- Migration 007: KPI, Appraisal, Training
-- Sprint 6: KPI + Appraisal + Training module

-- ──────────────────────────────────────────────
-- 1. kpi_periods
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kpi_periods (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','active','closed')),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_kpi_periods_tenant ON kpi_periods(tenant_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 2. kpi_indicators
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kpi_indicators (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_id       UUID NOT NULL REFERENCES kpi_periods(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  indicator_name  TEXT NOT NULL,
  weight          NUMERIC(5,2) NOT NULL DEFAULT 0,
  target_value    TEXT NOT NULL,
  actual_value    TEXT,
  score           NUMERIC(5,2),
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','submitted','approved','revision')),
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_kpi_ind_tenant ON kpi_indicators(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_kpi_ind_period ON kpi_indicators(period_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_kpi_ind_employee ON kpi_indicators(employee_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 3. appraisal_cycles
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appraisal_cycles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  period_type     TEXT NOT NULL DEFAULT 'quarterly'
                  CHECK (period_type IN ('quarterly','semester','annual')),
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  deadline_date   DATE,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','active','closed')),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_appraisal_cycles_tenant ON appraisal_cycles(tenant_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 4. appraisal_reviews
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appraisal_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cycle_id        UUID NOT NULL REFERENCES appraisal_cycles(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id     UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  self_score      NUMERIC(5,2),
  reviewer_score  NUMERIC(5,2),
  final_score     NUMERIC(5,2),
  status          TEXT NOT NULL DEFAULT 'belum_dinilai'
                  CHECK (status IN ('belum_dinilai','draft','menunggu_review','selesai')),
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_appraisal_rev_tenant ON appraisal_reviews(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_appraisal_rev_cycle ON appraisal_reviews(cycle_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_appraisal_rev_employee ON appraisal_reviews(employee_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 5. appraisal_dimensions
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appraisal_dimensions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  review_id       UUID NOT NULL REFERENCES appraisal_reviews(id) ON DELETE CASCADE,
  dimension_name  TEXT NOT NULL,
  weight          NUMERIC(5,2) NOT NULL DEFAULT 0,
  self_score      NUMERIC(5,2),
  reviewer_score  NUMERIC(5,2),
  final_score     NUMERIC(5,2),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_appraisal_dim_tenant ON appraisal_dimensions(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_appraisal_dim_review ON appraisal_dimensions(review_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 6. training_programs
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_programs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL DEFAULT 'offline'
                  CHECK (type IN ('offline','online','hybrid')),
  instructor      TEXT,
  start_date      DATE NOT NULL,
  end_date        DATE,
  quota           INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'akan_datang'
                  CHECK (status IN ('akan_datang','berjalan','selesai','dibatalkan')),
  location        TEXT,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_training_prog_tenant ON training_programs(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_training_prog_status ON training_programs(tenant_id, status) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 7. training_participants
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_participants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  program_id      UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'terdaftar'
                  CHECK (status IN ('terdaftar','sedang','lulus','tidak_lulus')),
  score           NUMERIC(5,2),
  certificate_url TEXT,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_training_part_tenant ON training_participants(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_training_part_program ON training_participants(program_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_training_part_employee ON training_participants(employee_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 8. e_learning_courses
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS e_learning_courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL DEFAULT 'teknis'
                  CHECK (category IN ('teknis','soft_skill','compliance','leadership')),
  duration_hours  NUMERIC(5,2) NOT NULL DEFAULT 0,
  module_count    INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID,
  updated_by      UUID,
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_elearning_tenant ON e_learning_courses(tenant_id) WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────
-- 9. e_learning_enrollments
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS e_learning_enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES e_learning_courses(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  completion_pct  NUMERIC(5,2) NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'baru'
                  CHECK (status IN ('baru','sedang','selesai')),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_elearn_enroll_tenant ON e_learning_enrollments(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_elearn_enroll_course ON e_learning_enrollments(course_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_elearn_enroll_employee ON e_learning_enrollments(employee_id) WHERE deleted_at IS NULL;

-- ════════════════════════════════════════════════
-- RLS POLICIES (all 9 tables)
-- ════════════════════════════════════════════════
ALTER TABLE kpi_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_learning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_learning_enrollments ENABLE ROW LEVEL SECURITY;

-- kpi_periods
CREATE POLICY "kpi_periods_select" ON kpi_periods FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "kpi_periods_insert" ON kpi_periods FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "kpi_periods_update" ON kpi_periods FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "kpi_periods_delete" ON kpi_periods FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- kpi_indicators
CREATE POLICY "kpi_ind_select" ON kpi_indicators FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "kpi_ind_insert" ON kpi_indicators FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "kpi_ind_update" ON kpi_indicators FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "kpi_ind_delete" ON kpi_indicators FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- appraisal_cycles
CREATE POLICY "appr_cycles_select" ON appraisal_cycles FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "appr_cycles_insert" ON appraisal_cycles FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "appr_cycles_update" ON appraisal_cycles FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "appr_cycles_delete" ON appraisal_cycles FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- appraisal_reviews
CREATE POLICY "appr_rev_select" ON appraisal_reviews FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "appr_rev_insert" ON appraisal_reviews FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "appr_rev_update" ON appraisal_reviews FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "appr_rev_delete" ON appraisal_reviews FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- appraisal_dimensions
CREATE POLICY "appr_dim_select" ON appraisal_dimensions FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "appr_dim_insert" ON appraisal_dimensions FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "appr_dim_update" ON appraisal_dimensions FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "appr_dim_delete" ON appraisal_dimensions FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- training_programs
CREATE POLICY "train_prog_select" ON training_programs FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "train_prog_insert" ON training_programs FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "train_prog_update" ON training_programs FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "train_prog_delete" ON training_programs FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- training_participants
CREATE POLICY "train_part_select" ON training_participants FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "train_part_insert" ON training_participants FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "train_part_update" ON training_participants FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "train_part_delete" ON training_participants FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- e_learning_courses
CREATE POLICY "elearn_course_select" ON e_learning_courses FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "elearn_course_insert" ON e_learning_courses FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "elearn_course_update" ON e_learning_courses FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "elearn_course_delete" ON e_learning_courses FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- e_learning_enrollments
CREATE POLICY "elearn_enroll_select" ON e_learning_enrollments FOR SELECT USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "elearn_enroll_insert" ON e_learning_enrollments FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
CREATE POLICY "elearn_enroll_update" ON e_learning_enrollments FOR UPDATE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);
CREATE POLICY "elearn_enroll_delete" ON e_learning_enrollments FOR DELETE USING (tenant_id = get_current_tenant_id() AND deleted_at IS NULL);

-- ════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════
-- Tenant: 00000000-0000-0000-0000-000000000001
-- Admin: 5d44f3f6-574f-4d2e-b636-2853a3e198b6

-- KPI Period
INSERT INTO kpi_periods (id, tenant_id, name, start_date, end_date, status, created_by) VALUES
('d0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Q1 2025', '2025-01-01', '2025-03-31', 'active', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- KPI Indicators (emp0: Ahmad, emp1: Nina, emp2: Budi)
INSERT INTO kpi_indicators (id, tenant_id, period_id, employee_id, indicator_name, weight, target_value, actual_value, score, status, created_by) VALUES
('d0000002-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Produktivitas Kode', 25, '100 line/day', '115 line/day', 115, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Bug Rate', 20, '≤2 bug/sprint', '1 bug/sprint', 110, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Timeliness', 20, '100% on-time', '95% on-time', 95, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Code Review', 15, '5 review/minggu', '6 review/minggu', 120, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  'Knowledge Sharing', 20, '2 sesi/bulan', '2 sesi/bulan', 100, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
-- Nina KPI
('d0000002-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'Desain UI', 30, '10 screen/sprint', '9.5 screen/sprint', 95, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'User Feedback Score', 25, '≥4.0', '3.8', 95, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'Kolaborasi Tim', 25, '100% partisipasi', '100% partisipasi', 100, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  'Design System Compliance', 20, '≥90%', '88%', 98, 'approved', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
-- Budi KPI (below target)
('d0000002-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'API Completion', 30, '8 endpoint/sprint', '6 endpoint/sprint', 75, 'submitted', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'Bug Fix Rate', 25, '≥90%', '82%', 82, 'submitted', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'Code Quality', 25, '≥8 score', '7 score', 88, 'submitted', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000002-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  'Documentation', 20, '100% coverage', '70% coverage', 70, 'submitted', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Appraisal Cycle
INSERT INTO appraisal_cycles (id, tenant_id, name, period_type, start_date, end_date, deadline_date, status, created_by) VALUES
('d0000003-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Penilaian Q1 2025', 'quarterly', '2025-01-01', '2025-03-31', '2025-04-15', 'active', '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Appraisal Reviews
INSERT INTO appraisal_reviews (id, tenant_id, cycle_id, employee_id, reviewer_id, self_score, reviewer_score, final_score, status, notes, created_by) VALUES
('d0000004-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0),
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', 88, 87, 87.1, 'selesai', 'Performa konsisten baik', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000004-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1),
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', 82, 78, 79.6, 'selesai', NULL, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000004-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2),
  '5d44f3f6-574f-4d2e-b636-2853a3e198b6', 75, NULL, NULL, 'menunggu_review', NULL, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000004-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 3),
  NULL, NULL, NULL, NULL, 'belum_dinilai', NULL, '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Appraisal Dimensions for review #1 (Ahmad)
INSERT INTO appraisal_dimensions (id, tenant_id, review_id, dimension_name, weight, self_score, reviewer_score, final_score) VALUES
('d0000005-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'Kualitas Kerja', 25, 90, 88, 88.5),
('d0000005-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'Produktivitas', 25, 85, 90, 88.0),
('d0000005-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'Kerjasama Tim', 20, 88, 92, 90.4),
('d0000005-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'Inisiatif', 15, 80, 82, 81.3),
('d0000005-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'Kepemimpinan', 15, 85, 86, 85.5);

-- Training Programs
INSERT INTO training_programs (id, tenant_id, title, description, type, instructor, start_date, end_date, quota, status, location, created_by) VALUES
('d0000006-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Onboarding Karyawan Baru', 'Program orientasi untuk karyawan baru', 'offline', 'Hendra Kusuma', '2025-04-01', '2025-04-03', 20, 'akan_datang', 'Ruang Training Lt.2', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000006-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Leadership Essentials', 'Pelatihan kepemimpinan dasar', 'hybrid', 'Dewi Anggraini', '2025-03-15', '2025-03-20', 15, 'berjalan', 'Zoom + Ruang Meeting', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000006-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Python for Data Analysis', 'Pelatihan analisis data dengan Python', 'online', 'Fajar Nugroho', '2025-03-10', '2025-04-10', 30, 'berjalan', NULL, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000006-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'K3 & Keselamatan Kerja', 'Pelatihan keselamatan dan kesehatan kerja', 'offline', 'Budi Santoso', '2025-02-20', '2025-02-21', 25, 'selesai', 'Aula Lt.1', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000006-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Effective Communication', 'Workshop komunikasi efektif', 'hybrid', 'Ayu Lestari', '2025-02-10', '2025-02-12', 20, 'selesai', 'Ruang Training Lt.2', '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000006-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Agile Scrum Workshop', 'Workshop metodologi Agile Scrum', 'online', 'Andi Wijaya', '2025-01-25', '2025-01-28', 20, 'selesai', NULL, '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- Training Participants
INSERT INTO training_participants (id, tenant_id, program_id, employee_id, status, score, created_by) VALUES
('d0000007-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'd0000006-0000-0000-0000-000000000004',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0), 'lulus', 92, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000007-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'd0000006-0000-0000-0000-000000000005',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1), 'lulus', 88, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000007-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'd0000006-0000-0000-0000-000000000006',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 3), 'lulus', 95, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000007-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'd0000006-0000-0000-0000-000000000003',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2), 'sedang', NULL, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000007-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'd0000006-0000-0000-0000-000000000002',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 4), 'lulus', 81, '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- E-Learning Courses
INSERT INTO e_learning_courses (id, tenant_id, title, description, category, duration_hours, module_count, created_by) VALUES
('d0000008-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Dasar-Dasar Cybersecurity', 'Pengenalan keamanan siber untuk karyawan', 'teknis', 8, 12, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000008-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Public Speaking Mastery', 'Teknik presentasi dan public speaking', 'soft_skill', 4, 6, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000008-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Anti-Bribery & Corruption', 'Kepatuhan anti suap dan korupsi', 'compliance', 2, 4, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000008-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Strategic Leadership Program', 'Program kepemimpinan strategis', 'leadership', 12, 18, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000008-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'React Advanced Patterns', 'Pattern lanjutan React untuk developer', 'teknis', 10, 15, '5d44f3f6-574f-4d2e-b636-2853a3e198b6'),
('d0000008-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Data Privacy & GDPR', 'Kepatuhan privasi data dan GDPR', 'compliance', 3, 5, '5d44f3f6-574f-4d2e-b636-2853a3e198b6');

-- E-Learning Enrollments
INSERT INTO e_learning_enrollments (id, tenant_id, course_id, employee_id, completion_pct, status) VALUES
('d0000009-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'd0000008-0000-0000-0000-000000000001',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0), 75, 'sedang'),
('d0000009-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'd0000008-0000-0000-0000-000000000002',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1), 33, 'sedang'),
('d0000009-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'd0000008-0000-0000-0000-000000000003',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 0), 100, 'selesai'),
('d0000009-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'd0000008-0000-0000-0000-000000000005',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 2), 50, 'sedang'),
('d0000009-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'd0000008-0000-0000-0000-000000000006',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 1), 100, 'selesai'),
('d0000009-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'd0000008-0000-0000-0000-000000000004',
  (SELECT id FROM employees WHERE tenant_id='00000000-0000-0000-0000-000000000001' AND deleted_at IS NULL LIMIT 1 OFFSET 3), 0, 'baru');