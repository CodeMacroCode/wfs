"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  Clock,
  Pencil,
  ShieldCheck,
  TrendingUp,
  Trash2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  EditAttendancePolicyDialog,
  DeleteAttendancePolicyDialog
} from "@/components/dashboard/attendance-policy-dialog"
import { AttendancePolicy } from "@/types/attendance-policy"

interface AttendancePolicyTableProps {
  data: AttendancePolicy[]
  isLoading: boolean
}

export function AttendancePolicyTable({ data, isLoading }: AttendancePolicyTableProps) {
  const [editingPolicy, setEditingPolicy] = React.useState<AttendancePolicy | null>(null)
  const [deletingPolicyId, setDeletingPolicyId] = React.useState<string | null>(null)

  const columns: ColumnDef<AttendancePolicy>[] = [
    {
      accessorKey: "name",
      header: "Policy Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.original.name}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "shiftInTime",
      header: "Shift In",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          <span>{row.original.shiftInTime}</span>
        </div>
      ),
    },
    {
      accessorKey: "shiftOutTime",
      header: "Shift Out",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span>{row.original.shiftOutTime}</span>
        </div>
      ),
    },
    {
      accessorKey: "overtimeThresholdMins",
      header: "OT Threshold",
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-black px-2.5 py-1 rounded-lg border-none">
          {row.original.overtimeThresholdMins} Mins
        </Badge>
      ),
    },
    {
      accessorKey: "overtimeHourlyRate",
      header: "OT Hourly Rate",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-bold text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>₹{row.original.overtimeHourlyRate}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{row.original.createdBy?.name || "System"}</span>
          <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">{row.original.createdBy?.email || "Internal"}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full p-0"
            onClick={() => setEditingPolicy(row.original)}
            title="Edit Policy"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full p-0"
            onClick={() => setDeletingPolicyId(row.original._id)}
            title="Delete Policy"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        showSrNo={true}
      />

      <EditAttendancePolicyDialog
        policy={editingPolicy}
        open={!!editingPolicy}
        onOpenChange={(open) => !open && setEditingPolicy(null)}
      />

      <DeleteAttendancePolicyDialog
        policyId={deletingPolicyId}
        open={!!deletingPolicyId}
        onOpenChange={(open) => !open && setDeletingPolicyId(null)}
      />
    </>
  )
}
