import { BarChart3, Users, Calendar, Settings, FileText, Home, UserCog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/", roles: [] },
  { icon: UserCog, label: "Karyawan", path: "/employees", roles: [] },
  { icon: Users, label: "Kunjungan", path: "/kunjungan", roles: [] },
  { icon: Calendar, label: "Jadwal", path: "/jadwal", roles: [] },
  { icon: BarChart3, label: "Laporan", path: "/laporan", roles: [] },
  { icon: FileText, label: "Dokumen", path: "/dokumen", roles: [] },
  { icon: Settings, label: "Pengaturan", path: "/pengaturan", roles: [] },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle className="text-xl font-bold text-gray-800">
            Klinik Rohima
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
