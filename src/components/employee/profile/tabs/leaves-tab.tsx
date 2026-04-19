"use client";

import React, { useState, useMemo } from "react";
import { 
  format, 
  setMonth,
  setYear
} from "date-fns";
import { 
  ChevronDown, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { useEmployeeLeavesQuery } from "@/hooks/queries/use-leave";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Leave } from "@/types/leave";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

interface LeavesTabProps {
  employeeId: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const statusConfig = {
  'Approved': { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  'Pending': { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  'Rejected': { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle },
};

export function LeavesTab({ employeeId }: LeavesTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = currentDate.getFullYear().toString();

  const { data: leavesData, isLoading } = useEmployeeLeavesQuery(employeeId, monthStr, yearStr);
  const leaves = leavesData?.data || [];

  const handleMonthChange = (monthIdx: number) => {
    setCurrentDate(setMonth(currentDate, monthIdx));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const range = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      range.push(i);
    }
    return range;
  }, []);

  return (
    <div className="p-8 bg-slate-50/50 min-h-[600px] flex flex-col gap-6">
      {/* Filter Header */}
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Leave History</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight">Monthly Leaves:</span>
            <span className="text-sm font-black text-emerald-700">{leaves.length}</span>
          </div>
        </div>
      </div>

      {/* Leaves List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="p-6 border-none shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </Card>
          ))
        ) : leaves.length > 0 ? (
          leaves.map((leave: Leave) => {
            const status = leave.status || 'Pending';
            const { color, icon: StatusIcon } = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
            
            return (
              <Card key={leave._id} className="p-6 border-none shadow-sm ring-1 ring-slate-100 hover:ring-emerald-200 transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#2eb88a] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 italic font-black text-[#2eb88a]">
                    <FileText className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-slate-900 italic font-heading">{leave.leaveType} Leave</h4>
                      <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight", color)}>
                        <StatusIcon className="h-3 w-3" />
                        {status}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">
                          {format(new Date(leave.fromDate), "MMM d, yyyy")} — {format(new Date(leave.toDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium italic truncate max-w-md">"{leave.reason}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Requested On</span>
                    <span className="text-xs font-bold text-slate-600">{format(new Date(leave.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">No Leave Records</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">
              No leave applications found for {months[currentDate.getMonth()]} {currentDate.getFullYear()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
