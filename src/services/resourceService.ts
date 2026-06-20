import api from '../api/axios'
import type { BasicInfo, ProjectDetails } from '../schemas/resource.schema'
import type { Resource, ListResourcesResult } from '../types/resource'

export const resourceService = {
  getResources: async (page = 1, pageSize = 9): Promise<ListResourcesResult> => {
    const { data } = await api.get('/resources', { params: { page, pageSize } })
    return data
  },

  getResourceById: async (id: string): Promise<Resource> => {
    const { data } = await api.get(`/resources/${id}`)
    return data
  },

  createResource: async (name: string): Promise<Resource> => {
    const { data } = await api.post('/resources', { resourceName: name })
    return data
  },

  updateBasicInfo: async (id: string, data: BasicInfo): Promise<Resource> => {
    const { data: response } = await api.patch(`/resources/${id}/basic-info`, data)
    return response as Resource
  },

  updateProjectDetails: async (id: string, data: ProjectDetails): Promise<Resource> => {
    const { data: response } = await api.patch(`/resources/${id}/project-details`, data)
    return response as Resource
  },

  provisionResource: async (id: string): Promise<Resource> => {
    const { data } = await api.patch(`/resources/${id}/provisioning`)
    return data.resource
  },

  fullUpdateResource: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    const { data: response } = await api.put(`/resources/${id}`, data)
    return response as Resource
  },

  deleteResource: async (id: string): Promise<Resource> => {
    const { data } = await api.delete(`/resources/${id}`)
    return data
  },
}
