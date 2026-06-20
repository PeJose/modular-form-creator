import type { Category, Priority, TeamMember } from '../enums'

export type ResourceStatus = 'draft' | 'completed'

export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: Priority
}

export interface ProjectDetails {
  projectName: string
  budget: string
  category: Category
  options: TeamMember[]
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
