import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VisitData {
  time: string;
  lakiLaki: number;
  perempuan: number;
  lainnya: number;
}

const mockData: VisitData[] = [
  { time: "00:00 - 04:00", lakiLaki: 0, perempuan: 0, lainnya: 0 },
  { time: "04:00 - 08:00", lakiLaki: 0, perempuan: 0, lainnya: 0 },
  { time: "08:00 - 12:00", lakiLaki: 19, perempuan: 15, lainnya: 9 },
  { time: "12:00 - 16:00", lakiLaki: 1, perempuan: 6, lainnya: 2 },
  { time: "16:00 - 20:00", lakiLaki: 0, perempuan: 0, lainnya: 0 },
  { time: "20:00 - 24:00", lakiLaki: 0, perempuan: 0, lainnya: 0 },
];

export function VisitChart() {
  const maxValue = Math.max(
    ...mockData.flatMap((d) => [d.lakiLaki, d.perempuan, d.lainnya])
  );
  const total = mockData.reduce(
    (acc, d) => acc + d.lakiLaki + d.perempuan + d.lainnya,
    0
  );

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Jumlah Kunjungan</h3>
              <p className="text-sm text-gray-500">
                Terdapat total <span className="font-semibold text-blue-600">{total}</span>{" "}
                kunjungan dalam Hari ini.
              </p>
            </div>
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
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Laki-laki</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-400 rounded"></div>
            <span className="text-gray-600">Perempuan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-300 rounded"></div>
            <span className="text-gray-600">Lainnya</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-end justify-between gap-2 lg:gap-4 min-w-[600px] lg:min-w-0 h-64">
            {mockData.map((data, index) => {
              const heightL = maxValue > 0 ? (data.lakiLaki / maxValue) * 180 : 0;
              const heightP = maxValue > 0 ? (data.perempuan / maxValue) * 180 : 0;
              const heightLa = maxValue > 0 ? (data.lainnya / maxValue) * 180 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="flex items-end justify-center gap-1 lg:gap-2 w-full h-48">
                    {/* Laki-laki */}
                    <div className="flex flex-col items-center justify-end gap-1 w-full max-w-6">
                      {data.lakiLaki > 0 ? (
                        <>
                          <span className="text-xs font-semibold text-blue-600">
                            {data.lakiLaki}
                          </span>
                          <div
                            className="w-full bg-blue-500 rounded-t transition-all duration-300"
                            style={{ height: `${heightL}px` }}
                          ></div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">0</span>
                      )}
                    </div>
                    {/* Perempuan */}
                    <div className="flex flex-col items-center justify-end gap-1 w-full max-w-6">
                      {data.perempuan > 0 ? (
                        <>
                          <span className="text-xs font-semibold text-pink-600">
                            {data.perempuan}
                          </span>
                          <div
                            className="w-full bg-pink-400 rounded-t transition-all duration-300"
                            style={{ height: `${heightP}px` }}
                          ></div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">0</span>
                      )}
                    </div>
                    {/* Lainnya */}
                    <div className="flex flex-col items-center justify-end gap-1 w-full max-w-6">
                      {data.lainnya > 0 ? (
                        <>
                          <span className="text-xs font-semibold text-orange-600">
                            {data.lainnya}
                          </span>
                          <div
                            className="w-full bg-orange-300 rounded-t transition-all duration-300"
                            style={{ height: `${heightLa}px` }}
                          ></div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">0</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] lg:text-xs text-gray-500 text-center leading-tight">
                    {data.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
