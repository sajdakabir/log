import { useQuery } from '@tanstack/react-query';
import { API, type GithubRepoDTO } from '@shiplog/shared';
import { api } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

export function useGithubRepos() {
  return useQuery<GithubRepoDTO[]>({
    queryKey: queryKeys.githubRepos,
    queryFn: () => api.get<GithubRepoDTO[]>(API.repos),
    retry: false,
    staleTime: 60_000,
  });
}
