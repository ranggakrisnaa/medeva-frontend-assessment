import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  departmentApi,
  employeeApi,
  positionApi,
} from "@/services/api.service";

// Department hooks
export function useDepartments(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentApi.getAll(params),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      departmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string };
    }) => departmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

// Employee hooks
export function useEmployees(params?: {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => employeeApi.getAll(params),
  });
}

export function useEmployee(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeeApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      employee: {
        nik: string;
        fullName: string;
        placeOfBirth?: string;
        dateOfBirth?: string;
        address?: string;
        phone?: string;
        positionId: string;
        isActive: boolean;
      };
      user: {
        email: string;
        username: string;
        password: string;
      };
    }) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        employee?: Partial<{
          nik: string;
          fullName: string;
          placeOfBirth?: string;
          dateOfBirth?: string;
          address?: string;
          phone?: string;
          positionId: string;
          isActive: boolean;
        }>;
        user?: Partial<{
          email: string;
          username: string;
          password: string;
        }>;
      };
    }) => employeeApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Position hooks
export function usePositions(
  departmentId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["positions", departmentId],
    queryFn: () => positionApi.getAll(departmentId),
    enabled: options?.enabled !== false && !!departmentId,
  });
}
