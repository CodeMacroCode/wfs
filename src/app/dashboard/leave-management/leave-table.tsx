"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Leave } from "@/types/leave"
import { format } from "date-fns"
import { PaginationState } from "@tanstack/react-table"
import { LeaveStatusDialog } from "./leave-status-dialog"
import { Button } from "@/components/ui/button"
import { 
  Check, 
  X
} from "lucide-react"

interface LeaveTableProps {
  data: Leave[]
  isLoading: boolean
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  totalItems?: number
}

export function LeaveTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
  totalItems
}: LeaveTableProps) {
  const [selectedLeave, setSelectedLeave] = React.useState<Leave | null>(null)
  const [actionType, setActionType] = React.useState<'Approved' | 'Rejected' | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false)

  const handleAction = (leave: Leave, type: 'Approved' | 'Rejected') => {
    setSelectedLeave(leave)
    setActionType(type)
    setStatusDialogOpen(true)
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100/50 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            {status}
          </Badge>
        )
      case 'Rejected':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-100/50 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            <XCircle className="h-3 w-3" />
            {status}
          </Badge>
        )
      case 'Pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100/50 gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            <Clock className="h-3 w-3" />
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

  const columns: ColumnDef<Leave>[] = [
    {
      accessorKey: "userId",
      header: "Employee",
      cell: ({ row }) => {
        const user = row.original.userId
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100/50 italic font-black text-[#2eb88a]">
              {user?.name.charAt(0) || <User className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 line-clamp-1 italic">
                {user?.name || "System Record"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                ID: {user?.uniqueId || row.original.employeeId || "N/A"}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "leaveType",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <span className="font-bold text-slate-700 italic">{row.original.leaveType}</span>
        </div>
      ),
    },
    {
      accessorKey: "dateRange",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap text-xs">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{format(new Date(row.original.fromDate), "dd MMM")} — {format(new Date(row.original.toDate), "dd MMM yy")}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5">
            {row.original.totalDays} {row.original.totalDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "appliedAt",
      header: "Applied On",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-600 text-xs">
            {format(new Date(row.original.appliedAt || row.original.createdAt), "dd MMM yyyy")}
          </span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
            {format(new Date(row.original.appliedAt || row.original.createdAt), "hh:mm a")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <p className="text-xs font-medium text-slate-500 line-clamp-1 italic max-w-[200px]">
          &quot;{row.original.reason || "No reason provided"}&quot;
        </p>
      ),
    },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const leave = row.original
          const isPending = leave.status === 'Pending'

          return (
            <div className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all"
                    onClick={() => handleAction(leave, 'Approved')}
                    title="Approve Leave"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                    onClick={() => handleAction(leave, 'Rejected')}
                    title="Reject Leave"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Processed</span>
              )}
            </div>
          )
        },
      },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalItems={totalItems}
        showSrNo={true}
      />

      <LeaveStatusDialog
        leave={selectedLeave}
        status={actionType}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </>
  )
}
