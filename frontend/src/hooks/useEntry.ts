import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API, type EntryDTO, type UpdateEntryInput } from '@shiplog/shared';
import { api } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

export function useEntry(projectId: string, entryId: string) {
  return useQuery<EntryDTO>({
    queryKey: queryKeys.entry(projectId, entryId),
    queryFn: () => api.get<EntryDTO>(API.entry(projectId, entryId)),
  });
}

export function useUpdateEntry(projectId: string, entryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEntryInput) =>
      api.patch<EntryDTO>(API.entry(projectId, entryId), input),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.entry(projectId, entryId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.entries(projectId) });
    },
  });
}

export function useDeleteEntry(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => api.del<void>(API.entry(projectId, entryId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.entries(projectId) }),
  });
}
