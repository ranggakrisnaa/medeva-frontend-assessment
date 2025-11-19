import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import EmployeeFormPage from "./pages/EmployeeFormPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="employees" element={<EmployeeListPage />} />
            <Route path="employees/new" element={<EmployeeFormPage />} />
            <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="kunjungan" element={<div className="p-8 text-center text-gray-500">Halaman Kunjungan</div>} />
            <Route path="jadwal" element={<div className="p-8 text-center text-gray-500">Halaman Jadwal</div>} />
            <Route path="laporan" element={<div className="p-8 text-center text-gray-500">Halaman Laporan</div>} />
            <Route path="dokumen" element={<div className="p-8 text-center text-gray-500">Halaman Dokumen</div>} />
            <Route path="pengaturan" element={<div className="p-8 text-center text-gray-500">Halaman Pengaturan</div>} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
