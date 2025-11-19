import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useEmployees,
  useDeleteEmployee,
  useDepartments,
} from "@/hooks/useApi";
import { useCurrentUser } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { InfiniteScrollDropdown } from "@/components/InfiniteScrollDropdown";

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentUser } = useCurrentUser();
  
  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);
  const [departmentFilter, setDepartmentFilter] = useState<string>(searchParams.get("department") || "");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "10"));
  
  // Department infinite scroll states
  const [departmentPage, setDepartmentPage] = useState(1);
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [hasMoreDepts, setHasMoreDepts] = useState(true);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string; name: string } | null>(null);

  // Fetch data
  const { data: employeesData, isLoading } = useEmployees({
    page,
    limit,
    search: debouncedSearch || undefined,
    departmentId: departmentFilter && departmentFilter !== "all" ? departmentFilter : undefined,
    status: statusFilter || undefined,
  });

  const { data: departmentsData, isFetching: isFetchingDepts } = useDepartments({
    page: departmentPage,
    limit: 5,
  });
  const deleteEmployeeMutation = useDeleteEmployee();

  // Accumulate departments as pages load
  useEffect(() => {
    if (departmentsData?.content) {
      const newDepts = Array.isArray(departmentsData.content)
        ? departmentsData.content
        : Array.isArray((departmentsData.content as any)?.entries)
        ? (departmentsData.content as any).entries
        : [];
      
      const paginationInfo = (departmentsData.content as any);
      const currentPage = paginationInfo?.page || departmentPage;
      const totalPages = paginationInfo?.totalPages || 1;
      
      setAllDepartments(prev => {
        if (currentPage === 1) {
          return newDepts;
        }
        const existingIds = new Set(prev.map((d: any) => d.id));
        const uniqueNewDepts = newDepts.filter((d: any) => !existingIds.has(d.id));
        return [...prev, ...uniqueNewDepts];
      });
      
      setHasMoreDepts(currentPage < totalPages);
    }
  }, [departmentsData, departmentPage]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, departmentFilter, statusFilter, limit]);

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (departmentFilter) params.set("department", departmentFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (page > 1) params.set("page", page.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, departmentFilter, statusFilter, page, limit, setSearchParams]);

  // Check if content is array or has entries property
  const employees = Array.isArray(employeesData?.content)
    ? employeesData.content
    : Array.isArray((employeesData?.content as any)?.entries)
    ? (employeesData?.content as any).entries
    : [];
    
  const departments = allDepartments;
    
  // Parse meta from content (backend returns pagination data inside content)
  const contentData = employeesData?.content as any;
  const meta = contentData?.entries ? {
    total: contentData.totalData,
    page: contentData.page,
    limit: contentData.dataPerPage,
    totalPages: contentData.totalPages
  } : null;

  // Check permissions
  const canCreate = ["ADMIN", "MANAGER"].includes(currentUser?.role || "");
  const canEdit = ["ADMIN", "MANAGER"].includes(currentUser?.role || "");
  const canDelete = currentUser?.role === "ADMIN";

  const openDeleteDialog = (id: string, fullName: string) => {
    setEmployeeToDelete({ id, name: fullName });
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (employeeToDelete) {
      deleteEmployeeMutation.mutate(employeeToDelete.id, {
        onSuccess: () => {
          toast.success(`Karyawan ${employeeToDelete.name} berhasil dihapus`);
          setDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Gagal menghapus karyawan");
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Data Karyawan & Tenaga Kesehatan
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola data karyawan dan tenaga kesehatan
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => navigate("/employees/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <Card className="p-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === ""
                  ? "bg-white border-2 border-blue-500 text-blue-600"
                  : "bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              SEMUA
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === "active"
                  ? "bg-white border-2 border-blue-500 text-blue-600"
                  : "bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              AKTIF
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === "inactive"
                  ? "bg-white border-2 border-blue-500 text-blue-600"
                  : "bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              NON-AKTIF
            </button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama karyawan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="w-full md:w-64">
            <InfiniteScrollDropdown
              value={departmentFilter || "all"}
              onValueChange={(value) => setDepartmentFilter(value === "all" ? "" : value)}
              placeholder="Semua Departemen"
              items={[{ id: "all", name: "Semua Departemen" }, ...departments]}
              displayField="name"
              valueField="id"
              onLoadMore={() => {
                if (!isFetchingDepts) {
                  setDepartmentPage(prev => prev + 1);
                }
              }}
              hasMore={hasMoreDepts}
              isLoading={isFetchingDepts}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Karyawan / Tenaga Kesehatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pekerjaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data karyawan
                  </td>
                </tr>
              ) : (
                employees.map((employee: any, index: number) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                          {employee.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            NIK: {employee.nik}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {employee.position?.name || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Posisi
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{employee.user?.email || "-"}</div>
                      <div className="text-sm text-gray-500">{employee.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={employee.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                        {employee.isActive ? "Aktif" : "Non-Aktif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/employees/${employee.id}/edit`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(employee.id, employee.fullName)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Menampilkan {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, meta.total)} dari {meta.total} data
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Tampilkan:</span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === meta.totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, index, array) => (
                  <div key={p} className="flex items-center gap-2">
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="text-gray-500">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p)}
                      className="bg-white text-black hover:bg-gray-50"
                    >
                      {p}
                    </Button>
                  </div>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus karyawan{" "}
              <span className="font-semibold">{employeeToDelete?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEmployeeMutation.isPending}
            >
              {deleteEmployeeMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
