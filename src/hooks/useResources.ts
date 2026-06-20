import { useQuery, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '../services/resourceService';

export const useResources = (page: number = 1) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['resources', page],
    queryFn: () => resourceService.getResources(page, 9),
  });

    const createResource = async (name: string) => {
      const result = await resourceService.createResource(name);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      return result;
    };

    const deleteResource = async (id: string) => {
      await resourceService.deleteResource(id);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    };

    return {
      resources: data?.items,
      pagination: data?.pagination,
      isLoading,
      error,
      createResource,
      deleteResource,
    };
};
