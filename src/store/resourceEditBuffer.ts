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
  getBuffer: (resourceId?: string) => ResourceBuffer | undefined
  clearBuffer: (resourceId: string) => void
}

export const useResourceEditBuffer = create<ResourceEditBufferState>((set, get) => ({
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

  getBuffer: (resourceId?: string) => (resourceId ? get().buffers[resourceId] : undefined),

  clearBuffer: (resourceId) =>
    set((state) => {
      const newBuffers = { ...state.buffers }
      delete newBuffers[resourceId]
      return { buffers: newBuffers }
    }),
}))
