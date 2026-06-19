export type ResourceStatus = 'draft' | 'completed'

export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: string
}

export interface ProjectDetails {
  projectName: string
  budget: string
  category: string
  options: string[]
}

export interface ResourcePayload {
  name: string
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
}

export interface Resource {
  _id: string
  resourceId: number
  name: string
  status: ResourceStatus
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
  createdAt: string
  updatedAt: string
}

export interface ListResourcesResult {
  items: Resource[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}
