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
    queryClient.invalidateQueries({ queryKey: ['resources'] });
    return result;
  };

  return {
    resources,
    isLoading,
    error,
    createResource,
  };
};
