import * as yup from "yup";

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email wajib diisi")
    .email("Format email tidak valid"),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Department validation schema
export const departmentSchema = yup.object({
  name: yup
    .string()
    .required("Nama departemen wajib diisi")
    .min(3, "Nama departemen minimal 3 karakter")
    .max(100, "Nama departemen maksimal 100 karakter"),
  description: yup
    .string()
    .optional()
    .max(500, "Deskripsi maksimal 500 karakter"),
});

export type DepartmentFormData = yup.InferType<typeof departmentSchema>;

// Employee validation schema for create
export const employeeCreateSchema = yup.object().shape({
  nik: yup
    .string()
    .min(16, "NIK minimal 16 karakter")
    .required("NIK wajib diisi"),
  fullName: yup.string().required("Nama lengkap wajib diisi"),
  placeOfBirth: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  address: yup.string().optional(),
  phone: yup.string().optional(),
  positionId: yup.string().required("Posisi wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  username: yup
    .string()
    .min(3, "Username minimal 3 karakter")
    .required("Username wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

// Employee validation schema for edit (password is optional)
export const employeeEditSchema = yup.object().shape({
  nik: yup
    .string()
    .min(16, "NIK minimal 16 karakter")
    .required("NIK wajib diisi"),
  fullName: yup.string().required("Nama lengkap wajib diisi"),
  placeOfBirth: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  address: yup.string().optional(),
  phone: yup.string().optional(),
  positionId: yup.string().required("Posisi wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  username: yup
    .string()
    .min(3, "Username minimal 3 karakter")
    .required("Username wajib diisi"),
  password: yup.string().optional(),
});

export const employeeSchema = employeeCreateSchema;

export type EmployeeFormData = yup.InferType<typeof employeeCreateSchema>;
