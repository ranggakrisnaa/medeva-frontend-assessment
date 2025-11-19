import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const daysOfWeek = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

// Mock data untuk jadwal - tanggal dengan jadwal
const scheduleDates = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 28, 29, 30, 31,
];

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Adjust for Monday as first day
  const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const days: (number | null)[] = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < adjustedStart; i++) {
    days.push(null);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9)); // October 2025

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("id-ID", { month: "long" });

  const days = generateCalendarDays(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  // Count schedules
  const totalSchedules = scheduleDates.length;
  const replacementSchedules = 0; // Mock data

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-700">Jadwal Jaga</h3>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900 uppercase">
            {monthName} {year}
          </h4>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const hasSchedule = day && scheduleDates.includes(day);
            const isWeekend = index % 7 === 5 || index % 7 === 6;

            return (
              <div
                key={index}
                className="aspect-square flex items-center justify-center relative"
              >
                {day && (
                  <div
                    className={`
                      w-full h-full flex items-center justify-center rounded-lg
                      text-sm transition-colors
                      ${
                        hasSchedule
                          ? "text-blue-600 font-semibold hover:bg-blue-50 cursor-pointer"
                          : "text-gray-400"
                      }
                      ${isWeekend && !hasSchedule ? "text-red-400" : ""}
                    `}
                  >
                    {day}
                    {hasSchedule && (
                      <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Schedule Summary */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Jadwal Jaga</span>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {totalSchedules}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-gray-600">Jadwal Pengganti</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
              {replacementSchedules}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
