import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  API,
  type CreateProjectInput,
  type ProjectDTO,
  type UpdateProjectInput,
} from '@shiplog/shared';
import { api } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

export function useProjects() {
  return useQuery<ProjectDTO[]>({
    queryKey: queryKeys.projects,
    queryFn: () => api.get<ProjectDTO[]>(API.projects),
  });
}

export function useProject(id: string) {
  return useQuery<ProjectDTO>({
    queryKey: queryKeys.project(id),
    queryFn: () => api.get<ProjectDTO>(API.project(id)),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => api.post<ProjectDTO>(API.projects, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectInput) => api.patch<ProjectDTO>(API.project(id), input),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.project(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del<void>(API.project(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
  });
}
