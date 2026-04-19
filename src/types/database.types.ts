// Auto-generated placeholder — update via: npx supabase gen types typescript --project-id sztazodzdnmfwwwifmma
// For now, define core table types manually based on Phase 0.4 migration

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          is_active?: boolean
        }
      }
      entities: {
        Row: {
          id: string
          tenant_id: string
          code: string
          name: string
          short_name: string | null
          npwp: string | null
          nib: string | null
          is_pkp: boolean
          legal_address: string | null
          bpjs_tk_number: string | null
          bpjs_tk_risk_level: string | null
          bpjs_kes_number: string | null
          bank_name: string | null
          bank_account: string | null
          bank_account_name: string | null
          umr_amount: number | null
          umr_area: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
      }
      branches: {
        Row: {
          id: string
          tenant_id: string
          entity_id: string
          code: string
          name: string
          branch_type: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          geofence_radius_meters: number | null
          umr_override: number | null
          bpjs_tk_number_override: string | null
          bpjs_kes_number_override: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          entity_id: string
          code: string
          name: string
        }
        Update: {
          name?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          tenant_id: string
          auth_user_id: string | null
          entity_id: string | null
          branch_id: string | null
          department_id: string | null
          position_id: string | null
          grade_id: string | null
          employee_id: string | null
          name: string
          email: string
          phone: string | null
          npwp: string | null
          bank_name: string | null
          bank_account: string | null
          bank_account_name: string | null
          birth_date: string | null
          gender: string | null
          religion: string | null
          marital_status: string | null
          education_level: string | null
          address: string | null
          join_date: string | null
          employment_status: string | null
          url_photo: string | null
          url_signature: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          email: string
        }
        Update: {
          name?: string
          email?: string
        }
      }
      hr_job_grades: {
        Row: {
          id: string
          tenant_id: string
          code: string
          name: string
          sequence: number
          kpi_weight: number
          comp_weight: number
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
          sequence: number
        }
        Update: {
          name?: string
          sequence?: number
        }
      }
      hr_departments: {
        Row: {
          id: string
          tenant_id: string
          entity_id: string | null
          branch_id: string | null
          code: string
          name: string
          head_id: string | null
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
        }
        Update: {
          name?: string
        }
      }
      hr_positions: {
        Row: {
          id: string
          tenant_id: string
          code: string
          name: string
          grade_id: string | null
          department_id: string | null
          job_desc: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
        }
        Update: {
          name?: string
        }
      }
      hr_work_shifts: {
        Row: {
          id: string
          tenant_id: string
          entity_id: string | null
          name: string
          code: string
          start_time: string
          end_time: string
          is_overnight: boolean
          break_minutes: number
          grace_period_minutes: number
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          code: string
          start_time: string
          end_time: string
        }
        Update: {
          name?: string
          start_time?: string
          end_time?: string
        }
      }
      hr_work_calendars: {
        Row: {
          id: string
          tenant_id: string
          entity_id: string | null
          date: string
          day_type: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          date: string
          day_type: string
        }
        Update: {
          day_type?: string
          name?: string
        }
      }
      hr_city_umr: {
        Row: {
          id: string
          tenant_id: string
          city_name: string
          province: string | null
          year: number
          umr_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          city_name: string
          year: number
          umr_amount: number
        }
        Update: {
          umr_amount?: number
        }
      }
      hr_salary_matrix: {
        Row: {
          id: string
          tenant_id: string
          entity_id: string | null
          grade_id: string
          step: number
          amount: number
          effective_date: string
          end_date: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          grade_id: string
          step: number
          amount: number
          effective_date: string
        }
        Update: {
          amount?: number
          end_date?: string
        }
      }
      hr_bpjs_configs: {
        Row: {
          id: string
          tenant_id: string
          effective_year: number
          tk_jkk_rate: number
          tk_jkm_rate: number
          tk_jht_employee_rate: number
          tk_jht_company_rate: number
          tk_jp_employee_rate: number
          tk_jp_company_rate: number
          tk_jp_max_salary: number
          kes_employee_rate: number
          kes_company_rate: number
          kes_max_salary: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          effective_year: number
        }
        Update: {
          effective_year?: number
        }
      }
      hr_pph21_configs: {
        Row: {
          id: string
          tenant_id: string
          effective_year: number
          ptkp_tk0: number
          ptkp_k0: number
          ptkp_k1: number
          ptkp_k2: number
          ptkp_k3: number
          jabatan_rate: number
          jabatan_max_annual: number
          non_npwp_surcharge: number
          progressive_brackets: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          effective_year: number
        }
        Update: {
          effective_year?: number
        }
      }
      hr_ter_brackets: {
        Row: {
          id: string
          tenant_id: string
          effective_year: number
          ptkp_status: string
          income_min: number
          income_max: number | null
          rate: number
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          effective_year: number
          ptkp_status: string
          income_min: number
          rate: number
        }
        Update: {
          rate?: number
          income_max?: number | null
        }
      }
      hr_salary_components: {
        Row: {
          id: string
          tenant_id: string
          code: string
          name: string
          component_type: string
          category: string
          is_taxable: boolean
          is_bpjs_base: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
          component_type: string
          category: string
        }
        Update: {
          name?: string
          is_active?: boolean
        }
      }
      hr_overtime_rules: {
        Row: {
          id: string
          tenant_id: string
          entity_id: string | null
          day_type: string
          hour_from: number
          hour_to: number | null
          multiplier: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          day_type: string
          hour_from: number
          multiplier: number
        }
        Update: {
          multiplier?: number
        }
      }
      hr_leave_types: {
        Row: {
          id: string
          tenant_id: string
          code: string
          name: string
          default_quota: number
          is_paid: boolean
          is_carry_over: boolean
          carry_over_max: number
          require_proof: boolean
          min_advance_days: number
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          code: string
          name: string
          default_quota: number
        }
        Update: {
          name?: string
          is_active?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}