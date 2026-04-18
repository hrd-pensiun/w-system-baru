export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface EntityBranchContext {
  tenantId: string
  entityId: string
  branchId: string | null
}

export interface PaginationParams {
  page: number
  pageSize: number
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}