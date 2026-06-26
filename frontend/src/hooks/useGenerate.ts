import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API, type GenerateResultDTO } from '@shiplog/shared';
import { api } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

export function useGenerate(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (force?: boolean) =>
      api.post<GenerateResultDTO>(API.generate(projectId), { force: force ?? false }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.entries(projectId), data.entries);
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}
