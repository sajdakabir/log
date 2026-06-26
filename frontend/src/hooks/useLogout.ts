import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@shiplog/shared';
import { api } from '../lib/api';
import { meQueryKey } from './useAuth';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ ok: true }>(API.logout),
    onSuccess: () => {
      queryClient.setQueryData(meQueryKey, null);
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'me' });
    },
  });
}
