import { Users, Activity } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { VisitChart } from "../components/dashboard/VisitChart";
import { CalendarWidget } from "../components/dashboard/CalendarWidget";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Grid3X3 className="w-4 h-4" />
          <span className="hidden sm:inline">Atur Widget</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Kunjungan Asuransi"
          value={0}
          description="Tidak ada penambahan jumlah Kunjungan Asuransi pada daftar Kunjungan Asuransi klinik anda"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Kunjungan BPJS"
          value={50}
          description="Terdapat penambahan jumlah Kunjungan BPJS sebanyak 50 pada daftar Kunjungan BPJS klinik anda"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Kunjungan Umum"
          value={2}
          description="Terdapat penambahan jumlah Kunjungan Umum sebanyak 2 pada daftar Kunjungan Umum klinik anda"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Chart and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <VisitChart />
        <CalendarWidget />
      </div>
    </div>
  );
}
