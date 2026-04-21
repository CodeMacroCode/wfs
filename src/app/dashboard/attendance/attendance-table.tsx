"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { 
  Clock, 
  User, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Briefcase,
  Building2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Attendance } from "@/types/attendance"
import { format } from "date-fns"
import { PaginationState } from "@tanstack/react-table"

interface AttendanceTableProps {
  data: Attendance[]
  isLoading: boolean
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  totalItems?: number
  hideSearch?: boolean
}

export function AttendanceTable({ 
  data, 
  isLoading,
  pagination,
  onPaginationChange,
  totalItems,
  hideSearch = false
}: AttendanceTableProps) {
  
  /**
   * Helper to format ISO time to HH:mm
   */
  const formatTime = (isoString: string | null) => {
    if (!isoString) return "--:--"
    try {
      return format(new Date(isoString), "HH:mm")
    } catch {
      return "--:--"
    }
  }

  /**
   * Helper to format ISO date to DD MMM YY
   */
  const formatDateLabel = (isoString: string) => {
    try {
      return format(new Date(isoString), "dd MMM yy")
    } catch {
      return isoString
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100/50 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            {status}
          </Badge>
        )
      case 'Absent':
        return (
          <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/10 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            <XCircle className="h-3 w-3" />
            {status}
          </Badge>
        )
      case 'Late':
      case 'Half-Day':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100/50 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            <AlertCircle className="h-3 w-3" />
            {status}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-100 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            {status}
          </Badge>
        )
    }
  }

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: "userId",
      header: "Employee",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100/50">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 line-clamp-1">
              {row.original.userId?.name || "Unknown"}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
              {row.original.userId?.employeeId}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.original.userId?.designation || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.original.userId?.companyName || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatDateLabel(row.original.date)}</span>
        </div>
      ),
    },
    {
      accessorKey: "punchIn",
      header: "Punch In",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Clock className="h-3.5 w-3.5 text-emerald-500" />
          <span>{formatTime(row.original.punchIn)}</span>
        </div>
      ),
    },
    {
      accessorKey: "punchOut",
      header: "Punch Out",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Clock className="h-3.5 w-3.5 text-rose-500" />
          <span>{formatTime(row.original.punchOut)}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalWorkedMinutes",
      header: "Duration",
      cell: ({ row }) => {
        const mins = Math.floor(row.original.totalWorkedMinutes || 0)
        const hours = Math.floor(mins / 60)
        const remainingMins = mins % 60
        return (
          <span className="font-bold text-slate-700">
            {hours}h {remainingMins}m
          </span>
        )
      },
    },
    {
      accessorKey: "overtimeHours",
      header: "Overtime",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-bold text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{row.original.overtimeHours}h</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      totalItems={totalItems}
      showSrNo={true}
      hideSearch={hideSearch}
    />
  )
}
