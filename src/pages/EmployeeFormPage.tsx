import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ChevronDown } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateEmployee,
  useUpdateEmployee,
  useEmployee,
  useDepartments,
  usePositions,
} from "@/hooks/useApi";
import { useCurrentUser } from "@/hooks/useAuth";
import { employeeCreateSchema, employeeEditSchema } from "@/lib/validations";

interface EmployeeFormData {
  nik: string;
  fullName: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  address?: string;
  phone?: string;
  positionId: string;
  email: string;
  username: string;
  password: string;
  isActive: boolean;
}

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const { data: currentUser } = useCurrentUser();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [departmentPage, setDepartmentPage] = useState(1);
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [hasMoreDepts, setHasMoreDepts] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check permissions
  const canEdit = ["ADMIN", "MANAGER"].includes(currentUser?.role || "");

  // Redirect if no permission
  useEffect(() => {
    if (currentUser && !canEdit) {
      navigate("/employees");
    }
  }, [currentUser, canEdit, navigate]);

  // Fetch data
  const { data: employeeData } = useEmployee(id || "", { enabled: isEditMode });
  // Fetch departments with pagination for infinite scroll
  const { data: departmentsData, isFetching: isFetchingDepts } = useDepartments({ 
    page: departmentPage, 
    limit: 5 
  });
  const { data: positionsData } = usePositions(selectedDepartmentId, {
    enabled: !!selectedDepartmentId,
  });

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  // Accumulate departments as pages load
  useEffect(() => {
    if (departmentsData?.content) {
      const newDepts = Array.isArray(departmentsData.content)
        ? departmentsData.content
        : Array.isArray((departmentsData.content as any)?.entries)
        ? (departmentsData.content as any).entries
        : [];
      
      // Check pagination info
      const paginationInfo = (departmentsData.content as any);
      const currentPage = paginationInfo?.page || departmentPage;
      const totalPages = paginationInfo?.totalPages || 1;
      
      setAllDepartments(prev => {
        // On first page, replace all. On subsequent pages, append
        if (currentPage === 1) {
          return newDepts;
        }
        // Avoid duplicates
        const existingIds = new Set(prev.map((d: any) => d.id));
        const uniqueNewDepts = newDepts.filter((d: any) => !existingIds.has(d.id));
        return [...prev, ...uniqueNewDepts];
      });
      
      setHasMoreDepts(currentPage < totalPages);
    }
  }, [departmentsData, departmentPage]);

  const departments = allDepartments;
    
  const positions = Array.isArray(positionsData?.content)
    ? positionsData.content
    : Array.isArray((positionsData?.content as any)?.entries)
    ? (positionsData?.content as any).entries
    : [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(isEditMode ? employeeEditSchema : employeeCreateSchema) as any,
  });

  useEffect(() => {
    if (employeeData?.content) {
      const employee = employeeData.content;
      setValue("nik", employee.nik);
      setValue("fullName", employee.fullName);
      setValue("placeOfBirth", employee.placeOfBirth || "");
      
      // Convert ISO date to YYYY-MM-DD format for date input
      if (employee.dateOfBirth) {
        const date = new Date(employee.dateOfBirth);
        const formattedDate = date.toISOString().split('T')[0];
        setValue("dateOfBirth", formattedDate);
      } else {
        setValue("dateOfBirth", "");
      }
      
      setValue("address", employee.address || "");
      setValue("phone", employee.phone || "");
      setValue("email", employee.user?.email || "");
      setValue("username", employee.user?.username || "");
      setIsActive(employee.isActive ?? true);
      
      // Set department first, then position will be set when positions load
      if (employee.position) {
        const { departmentId, department } = employee.position;
        setSelectedDepartmentId(departmentId);
        
        if (department) {
          setAllDepartments(prev => {
            const departmentExists = prev.some((d: any) => d.id === department.id);
            if (!departmentExists) {
              return [department, ...prev];
            }
            return prev;
          });
        }
      }
    }
  }, [employeeData, setValue]);

  // Set positionId after positions are loaded (for edit mode)
  useEffect(() => {
    if (isEditMode && employeeData?.content && positions.length > 0) {
      const employee = employeeData.content;
      // Make sure the positionId exists in the loaded positions
      const positionExists = positions.some((p: any) => p.id === employee.positionId);
      if (positionExists) {
        setValue("positionId", employee.positionId);
      }
    }
  }, [isEditMode, employeeData, positions, setValue]);

  // Clear position when department changes in create mode
  useEffect(() => {
    if (selectedDepartmentId && !isEditMode) {
      setValue("positionId", "");
    }
  }, [selectedDepartmentId, setValue, isEditMode]);

  const onSubmit = async (data: EmployeeFormData) => {
    setApiError(""); // Clear previous errors
    
    if (isEditMode) {
      const updateData = {
        employee: {
          nik: data.nik,
          fullName: data.fullName,
          placeOfBirth: data.placeOfBirth || undefined,
          dateOfBirth: data.dateOfBirth || undefined,
          address: data.address || undefined,
          phone: data.phone || undefined,
          positionId: data.positionId,
          isActive: isActive,
        },
        user: {
          email: data.email,
          username: data.username,
          ...(data.password && { password: data.password }),
        },
      };
      
      updateMutation.mutate(
        { id: id!, data: updateData },
        {
          onSuccess: () => {
            toast.success("Data karyawan berhasil diperbarui");
            navigate("/employees");
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data";
            setApiError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    } else {
      const createData = {
        employee: {
          nik: data.nik,
          fullName: data.fullName,
          placeOfBirth: data.placeOfBirth || undefined,
          dateOfBirth: data.dateOfBirth || undefined,
          address: data.address || undefined,
          phone: data.phone || undefined,
          positionId: data.positionId,
          isActive: isActive,
        },
        user: {
          email: data.email,
          username: data.username,
          password: data.password,
        },
      };
      
      createMutation.mutate(createData, {
        onSuccess: () => {
          toast.success("Data karyawan berhasil ditambahkan");
          navigate("/employees");
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data";
          setApiError(errorMessage);
          toast.error(errorMessage);
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Karyawan" : "Form Tambah Karyawan"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode
              ? "Perbarui data karyawan"
              : "Tambah karyawan baru ke sistem"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {apiError && (
            <Alert variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Masukkan nama lengkap"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* NIK */}
            <div className="space-y-2">
              <Label htmlFor="nik">
                No. Kartu Identitas (NIK) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nik"
                placeholder="Masukkan 16 digit NIK"
                maxLength={16}
                {...register("nik")}
                className={errors.nik ? "border-red-500" : ""}
              />
              {errors.nik && (
                <p className="text-sm text-red-500">{errors.nik.message}</p>
              )}
            </div>

            {/* Tempat Lahir */}
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Tempat Lahir</Label>
              <Input
                id="placeOfBirth"
                placeholder="Contoh: Jakarta"
                {...register("placeOfBirth")}
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                placeholder="08xx xxxx xxxx"
                {...register("phone")}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                placeholder="Masukkan username"
                {...register("username")}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah" : "Minimal 6 karakter"}
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Department - Custom Dropdown with Infinite Scroll */}
            <div className="space-y-2 relative">
              <Label htmlFor="departmentId">
                Departemen <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={selectedDepartmentId ? "" : "text-gray-500"}>
                    {selectedDepartmentId
                      ? departments.find((d: any) => d.id === selectedDepartmentId)?.name || "Pilih departemen"
                      : "Pilih departemen"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div
                      id="scrollableDepartmentDiv"
                      ref={dropdownRef}
                      className="absolute z-50 mt-1 h-[150px] w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
                      style={{ maxHeight: '150px', overflowY: 'auto' }}
                    >
                      <InfiniteScroll
                        dataLength={departments.length}
                        next={() => {
                          if (!isFetchingDepts) {
                            setDepartmentPage(prev => prev + 1);
                          }
                        }}
                        hasMore={hasMoreDepts}
                        loader={
                          <div className="p-2 text-center text-sm text-gray-500">
                            Loading...
                          </div>
                        }
                        scrollableTarget="scrollableDepartmentDiv"
                        height={150}
                      >
                        {departments.map((dept: any) => (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => {
                              setSelectedDepartmentId(dept.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                              selectedDepartmentId === dept.id ? "bg-gray-100 font-medium" : ""
                            }`}
                          >
                            {dept.name}
                          </button>
                        ))}
                      </InfiniteScroll>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="positionId">
                Posisi <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`pos-${watch("positionId")}-${selectedDepartmentId}`}
                value={watch("positionId") || ""}
                onValueChange={(value) => setValue("positionId", value)}
                disabled={!selectedDepartmentId || positions.length === 0}
              >
                <SelectTrigger
                  className={errors.positionId ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      !selectedDepartmentId
                        ? "Pilih departemen terlebih dahulu"
                        : positions.length === 0
                        ? "Tidak ada posisi tersedia"
                        : "Pilih posisi"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos: any) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.positionId && (
                <p className="text-sm text-red-500">
                  {errors.positionId.message}
                </p>
              )}
            </div>

            {/* Status Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
                  {isActive ? "Aktif" : "Non-Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <textarea
              id="address"
              placeholder="Masukkan alamat lengkap"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("address")}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employees")}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : isEditMode
                ? "Simpan Perubahan"
                : "Simpan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
