import api from '../api/axios';
import { Resource } from '../types/resource';

export const resourceService = {
  getResources: async (): Promise<Resource[]> => {
    const { data } = await api.get('/resources');
    return data;
  },

  getResourceById: async (id: string): Promise<Resource> => {
    const { data } = await api.get(`/resources/${id}`);
    return data;
  },

  createResource: async (name: string): Promise<Resource> => {
    const { data } = await api.post('/resources', { name });
    return data;
  },

  updateBasicInfo: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    const { data: response } = await api.put(`/resources/${id}/basic-info`, data);
    return response as Resource;
  },

  updateProjectDetails: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    const { data: response } = await api.put(`/resources/${id}/project-details`, data);
    return response as Resource;
  },

  provisionResource: async (id: string): Promise<Resource> => {
    const { data } = await api.post(`/resources/${id}/provision`);
    return data;
  },

  fullUpdateResource: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    const { data: response } = await api.put(`/resources/${id}/full-update`, data);
    return response as Resource;
  },
};