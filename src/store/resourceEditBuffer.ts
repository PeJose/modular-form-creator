import { create } from 'zustand'
import type { BasicInfo, ProjectDetails } from '../schemas/resource.schema'

interface ResourceBuffer {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}

interface ResourceEditBufferState {
  buffers: Record<string, ResourceBuffer>
  setBasicInfo: (resourceId: string, data: BasicInfo) => void
  setProjectDetails: (resourceId: string, data: ProjectDetails) => void
  clearBuffer: (resourceId: string) => void
}

export const useResourceEditBuffer = create<ResourceEditBufferState>((set) => ({
  buffers: {},

  setBasicInfo: (resourceId, data) =>
    set((state) => ({
      buffers: {
        ...state.buffers,
        [resourceId]: {
          ...state.buffers[resourceId],
          basicInfo: data,
        },
      },
    })),

  setProjectDetails: (resourceId, data) =>
    set((state) => ({
      buffers: {
        ...state.buffers,
        [resourceId]: {
          ...state.buffers[resourceId],
          projectDetails: data,
        },
      },
    })),

  clearBuffer: (resourceId) =>
    set((state) => {
      const newBuffers = { ...state.buffers }
      delete newBuffers[resourceId]
      return { buffers: newBuffers }
    }),
}))
