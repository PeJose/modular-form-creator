import type { BasicInfo, ProjectDetails } from '../schemas/resource.schema'

export function isBasicInfoComplete(basicInfo?: BasicInfo | null): boolean {
  return Boolean(
    basicInfo?.resourceName &&
      basicInfo?.owner &&
      basicInfo?.email &&
      basicInfo?.description &&
      basicInfo?.priority,
  )
}

export function isProjectDetailsComplete(
  projectDetails?: ProjectDetails | null,
): boolean {
  return Boolean(
    projectDetails?.projectName &&
      projectDetails?.budget &&
      projectDetails?.category &&
      (projectDetails?.options?.length ?? 0) > 0,
  )
}