"use client";

import React, { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  setMonth,
  setYear
} from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Info,
  ChevronDown
} from "lucide-react";
import { useMonthlyAttendanceQuery } from "@/hooks/queries/use-attendance";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Attendance, AttendanceStatus } from "@/types/attendance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttendanceTabProps {
  employeeId: string;
}

const statusColors: Record<AttendanceStatus, string> = {
  "Present": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Absent": "bg-rose-50 text-rose-600 border-rose-100",
  "Late": "bg-amber-50 text-amber-600 border-amber-100",
  "Half-Day": "bg-orange-50 text-orange-600 border-orange-100",
  "On Leave": "bg-blue-50 text-blue-600 border-blue-100",
};

const statusIcons: Record<AttendanceStatus, React.ElementType> = {
  "Present": CheckCircle2,
  "Absent": XCircle,
  "Late": Clock,
  "Half-Day": AlertCircle,
  "On Leave": Info,
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function AttendanceTab({ employeeId }: AttendanceTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = currentDate.getFullYear().toString();

  const { data: attendanceData, isLoading } = useMonthlyAttendanceQuery(employeeId, monthStr, yearStr);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleMonthChange = (monthIdx: number) => {
    setCurrentDate(setMonth(currentDate, monthIdx));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const range = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      range.push(i);
    }
    return range;
  }, []);

  const attendanceMap = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendanceData?.data.forEach(item => {
      const dateKey = format(new Date(item.date), "yyyy-MM-dd");
      map[dateKey] = item;
    });
    return map;
  }, [attendanceData]);

  return (
    <div className="p-8 bg-slate-50/50 min-h-[600px] flex flex-col gap-8">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-2xl font-bold text-slate-900 tracking-tight hover:text-[#2eb88a] transition-colors flex items-center gap-1 group outline-none">
                    {format(currentDate, "MMMM")}
                    <ChevronDown className="h-4 w-4 text-slate-300 group-hover:text-[#2eb88a] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-64 overflow-y-auto">
                  {months.map((month, idx) => (
                    <DropdownMenuItem key={month} onClick={() => handleMonthChange(idx)}>
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-2xl font-bold text-slate-900 tracking-tight hover:text-[#2eb88a] transition-colors flex items-center gap-1 group outline-none">
                    {format(currentDate, "yyyy")}
                    <ChevronDown className="h-4 w-4 text-slate-300 group-hover:text-[#2eb88a] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-64 overflow-y-auto">
                  {years.map((year) => (
                    <DropdownMenuItem key={year} onClick={() => handleYearChange(year)}>
                      {year}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Attendance Records</p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 text-slate-500">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday} className="h-9 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 text-slate-500">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(statusColors).map(([status, colorClass]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full border", colorClass.split(' ')[2].replace('border-', 'bg-'))} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b bg-slate-50/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-4 text-center">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{day}</span>
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {isLoading ? (
            Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="border-r border-b p-4 min-h-[120px]">
                <Skeleton className="h-4 w-6 mb-4" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))
          ) : (
            calendarDays.map((day, idx) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const attendance = attendanceMap[dateKey];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const StatusIcon = attendance ? statusIcons[attendance.status] : null;

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "border-r border-b p-4 min-h-[140px] transition-colors flex flex-col gap-3",
                    !isCurrentMonth ? "bg-slate-50/50" : "bg-white",
                    idx % 7 === 6 ? "border-r-0" : ""
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                      isToday ? "bg-[#2eb88a] text-white shadow-md shadow-emerald-200" : 
                      isCurrentMonth ? "text-slate-800" : "text-slate-300"
                    )}>
                      {format(day, "d")}
                    </span>
                    {attendance?.overtimeHours > 0 && (
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">
                        +{attendance.overtimeHours}h OT
                      </span>
                    )}
                  </div>

                  {attendance ? (
                    <div className="flex flex-col gap-2">
                      <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-tight",
                        statusColors[attendance.status as AttendanceStatus]
                      )}>
                        {StatusIcon && <StatusIcon className="h-3 w-3" />}
                        {attendance.status}
                      </div>
                      
                      {attendance.punchIn && (
                        <div className="flex flex-col gap-1 px-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-tighter">In:</span>
                            <span className="text-slate-700">{format(new Date(attendance.punchIn), "hh:mm a")}</span>
                          </div>
                          {attendance.punchOut ? (
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-400 uppercase tracking-tighter">Out:</span>
                              <span className="text-slate-700">{format(new Date(attendance.punchOut), "hh:mm a")}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-400 uppercase tracking-tighter">Out:</span>
                              <span className="text-amber-500 animate-pulse italic">— Missed</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    isCurrentMonth && day < new Date() && (
                      <div className="mt-auto opacity-30 text-[10px] font-bold text-slate-400 italic text-center pb-2">
                        No record
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
