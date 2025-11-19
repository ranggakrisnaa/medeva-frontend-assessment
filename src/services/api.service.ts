import { api } from "@/lib/axios";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
}

export interface Employee {
  id: string;
  userId?: string | null;
  nik: string;
  fullName: string;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  phone?: string | null;
  positionId: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  position?: Position;
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  content: T;
  errors?: Array<string | Record<string, unknown>>;
  meta?: PaginationMeta;
}

// Department API
export const departmentApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get<ApiResponse<Department[]>>("/departments", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Department>>(
      `/departments/${id}`
    );
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post<ApiResponse<Department>>(
      "/departments",
      data
    );
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.patch<ApiResponse<Department>>(
      `/departments/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/departments/${id}`);
    return response.data;
  },
};

// Employee API
export const employeeApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<Employee[]>>("/employees", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data;
  },

  create: async (data: {
    employee: {
      nik: string;
      fullName: string;
      placeOfBirth?: string;
      dateOfBirth?: string;
      address?: string;
      phone?: string;
      positionId: string;
    };
    user: {
      email: string;
      username: string;
      password: string;
    };
  }) => {
    const response = await api.post<ApiResponse<Employee>>("/employees", data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      employee?: Partial<{
        nik: string;
        fullName: string;
        placeOfBirth?: string;
        dateOfBirth?: string;
        address?: string;
        phone?: string;
        positionId: string;
      }>;
      user?: Partial<{
        email: string;
        username: string;
        password: string;
      }>;
    }
  ) => {
    const response = await api.put<ApiResponse<Employee>>(
      `/employees/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/employees/${id}`);
    return response.data;
  },
};

// Position API
export const positionApi = {
  getAll: async (
    departmentId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
    }
  ) => {
    const response = await api.get<ApiResponse<Position[]>>(
      `/departments/${departmentId}/positions`,
      { params }
    );
    return response.data;
  },
};
