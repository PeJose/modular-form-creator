import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceService } from '../services/resourceService'
import { Resource } from '../types/resource'

export const useResource = (id: string) => {
  const queryClient = useQueryClient()

  const {
    data: resource,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['resources', id],
    queryFn: () => resourceService.getResourceById(id),
    enabled: !!id,
  })

  const updateBasicInfo = async (data: Partial<Resource>) => {
    const result = await resourceService.updateBasicInfo(id, data)
    queryClient.invalidateQueries({ queryKey: ['resources', id] })
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    return result
  }

  const updateProjectDetails = async (data: Partial<Resource>) => {
    const result = await resourceService.updateProjectDetails(id, data)
    queryClient.invalidateQueries({ queryKey: ['resources', id] })
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    return result
  }

  const provisionResource = async () => {
    const result = await resourceService.provisionResource(id)
    queryClient.invalidateQueries({ queryKey: ['resources', id] })
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    return result
  }

  const fullUpdateResource = async (data: Partial<Resource>) => {
    const result = await resourceService.fullUpdateResource(id, data)
    queryClient.invalidateQueries({ queryKey: ['resources', id] })
    queryClient.invalidateQueries({ queryKey: ['resources'] })
    return result
  }

  return {
    resource,
    isLoading,
    error,
    updateBasicInfo,
    updateProjectDetails,
    provisionResource,
    fullUpdateResource,
  }
}
