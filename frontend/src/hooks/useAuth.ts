import { useQuery } from '@tanstack/react-query';
import { API, type UserDTO } from '@shiplog/shared';
import { api, ApiError } from '../lib/api';

export const meQueryKey = ['me'] as const;

export function useAuth() {
  const query = useQuery<UserDTO | null>({
    queryKey: meQueryKey,
    queryFn: async () => {
      try {
        return await api.get<UserDTO>(API.me);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
