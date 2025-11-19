import { Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              {icon || <Users className="w-5 h-5 text-blue-600" />}
            </div>
            <h3 className="font-semibold text-gray-700">{title}</h3>
          </div>
          <Select defaultValue="hari-ini">
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hari-ini">Hari ini</SelectItem>
              <SelectItem value="minggu-ini">Minggu ini</SelectItem>
              <SelectItem value="bulan-ini">Bulan ini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-gray-900">{value}</div>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
