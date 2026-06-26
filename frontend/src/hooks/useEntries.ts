import { useQuery } from '@tanstack/react-query';
import { API, type EntryDTO } from '@shiplog/shared';
import { api } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

export function useEntries(projectId: string) {
  return useQuery<EntryDTO[]>({
    queryKey: queryKeys.entries(projectId),
    queryFn: () => api.get<EntryDTO[]>(API.entries(projectId)),
  });
}
