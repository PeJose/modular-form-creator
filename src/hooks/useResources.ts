import { useQuery, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '../services/resourceService';

export const useResources = () => {
  const queryClient = useQueryClient();

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: resourceService.getResources,
  });

    const createResource = async (name: string) => {
      const result = await resourceService.createResource(name);
      queryClient.invalidateQueries({ queryKey: ['resources'], exact: true });
      return result;
    };

    const deleteResource = async (id: string) => {
      await resourceService.deleteResource(id);
      queryClient.invalidateQueries({ queryKey: ['resources'], exact: true });
    };

    return {
      resources,
      isLoading,
      error,
      createResource,
      deleteResource,
    };
};
