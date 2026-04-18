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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}