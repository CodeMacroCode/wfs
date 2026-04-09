"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { 
  Pencil, 
  Trash2,
  Wallet,
  Globe,
  Briefcase,
  Activity,
  Calculator,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { 
  PayrollPolicyDialog, 
  DeletePayrollPolicyDialog 
} from "@/components/dashboard/payroll-policy-dialog"
import { PayrollPolicy } from "@/types/payroll-policy"

interface PayrollPolicyTableProps {
  data: PayrollPolicy[]
  isLoading: boolean
}

export function PayrollPolicyTable({ data, isLoading }: PayrollPolicyTableProps) {
  const [deletingPolicyId, setDeletingPolicyId] = React.useState<string | null>(null)

  const columns: ColumnDef<PayrollPolicy>[] = [
    {
      accessorKey: "name",
      header: "Policy Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.original.name}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {row.original._id.slice(-8)}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "heads.basic",
      header: "Basic",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <CircleDollarSign className="h-3.5 w-3.5 text-purple-500" />
          <span>{row.original.heads.basic}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.hra",
      header: "HRA",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Wallet className="h-3.5 w-3.5 text-indigo-500" />
          <span>{row.original.heads.hra}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.conveyance",
      header: "Conveyance",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
          <span>{row.original.heads.conveyance}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.pfEmployee",
      header: "PF (Emp)",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Activity className="h-3.5 w-3.5 text-orange-500" />
          <span>{row.original.heads.pfEmployee}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.pfEmployer",
      header: "PF (Company)",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
          <span>{row.original.heads.pfEmployer}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.esiEmployee",
      header: "ESI (Emp)",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Globe className="h-3.5 w-3.5 text-emerald-500" />
          <span>{row.original.heads.esiEmployee}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.esiEmployer",
      header: "ESI (Company)",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap">
          <Calculator className="h-3.5 w-3.5 text-emerald-600" />
          <span>{row.original.heads.esiEmployer}%</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.lwfEmployee",
      header: "LWF (Emp)",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-500 font-medium whitespace-nowrap">
          <span>₹{row.original.heads.lwfEmployee}</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.lwfEmployer",
      header: "LWF (Company)",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-500 font-medium whitespace-nowrap">
          <span>₹{row.original.heads.lwfEmployer}</span>
        </div>
      ),
    },
    {
      accessorKey: "heads.overtimeHourlyRate",
      header: "OT Rate",
      cell: ({ row }) => (
        <div className="font-bold text-slate-700 whitespace-nowrap">
          ₹{row.original.heads.overtimeHourlyRate}
        </div>
      ),
    },
    {
      accessorKey: "sundayPolicyActive",
      header: "Sunday Policy",
      cell: ({ row }) => (
        <Badge 
          variant={row.original.sundayPolicyActive ? "default" : "secondary"}
          className={row.original.sundayPolicyActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500"}
        >
          {row.original.sundayPolicyActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <PayrollPolicyDialog 
            policy={row.original}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full p-0"
                title="Edit Policy"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
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

      <DeletePayrollPolicyDialog
        policyId={deletingPolicyId}
        open={!!deletingPolicyId}
        onOpenChange={(open) => !open && setDeletingPolicyId(null)}
      />
    </>
  )
}
