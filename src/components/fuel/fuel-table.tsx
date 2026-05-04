"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { FuelRecord } from "@/types/fuel"
import { FuelFormValues } from "@/components/fuel/fuel-dialogs"
import { PaginationState } from "@tanstack/react-table"
import { format } from "date-fns"
import { Plus, Trash2, FileText } from "lucide-react"

interface FuelTableProps {
  data: FuelRecord[]
  isLoading?: boolean
  totalItems?: number
  pagination?: PaginationState
  onPaginationChange?: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onDelete: (id: string) => void
  onQuickAdd?: (values: Partial<FuelFormValues>) => void
}

function formatDate(val?: string) {
  if (!val) return "—"
  try {
    return format(new Date(val), "dd/MM/yyyy")
  } catch {
    return val
  }
}

function formatCurrency(val?: string | number) {
  const num = parseFloat(String(val ?? ""))
  if (isNaN(num)) return "—"
  return num.toFixed(2)
}

function formatNumber(val?: string | number) {
  const num = parseFloat(String(val ?? ""))
  if (isNaN(num)) return "—"
  return num.toString()
}

export const getFuelColumns = (
  onDelete: (id: string) => void,
  onQuickAdd?: (values: Partial<FuelFormValues>) => void
): ColumnDef<FuelRecord>[] => {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">
          {formatDate(row.original.metadata?.runningDate)}
        </span>
      ),
    },
    {
      accessorKey: "vehicleCode",
      header: "Vehicle Code",
      cell: ({ row }) => (
        <span className="font-bold text-slate-800">{row.original.metadata?.vehicleCode || "—"}</span>
      ),
    },
    {
      accessorKey: "vehicleNo",
      header: "Vehicle No.",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.metadata?.vehicleNo || "—"}</span>
      ),
    },
    {
      accessorKey: "startKm",
      header: "Start KM",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">{formatNumber(row.original.metadata?.startKm)}</span>
      ),
    },
    {
      accessorKey: "endKm",
      header: "End KM",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">{formatNumber(row.original.metadata?.endKm)}</span>
      ),
    },
    {
      accessorKey: "totalKm",
      header: "Total KM",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-blue-600">{formatNumber(row.original.metadata?.totalKm)}</span>
      ),
    },
    {
      accessorKey: "diesel",
      header: "Diesel",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-amber-600">{formatNumber(row.original.metadata?.totalDiesel)} L</span>
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate/Ltr",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-500">₹{formatCurrency(row.original.metadata?.ratePerLitre)}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-sm font-black text-emerald-600">₹{formatCurrency(row.original.metadata?.totalAmount)}</span>
      ),
    },
    {
      accessorKey: "average",
      header: "Average/KM",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-indigo-600">{formatCurrency(row.original.metadata?.averageKm)}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {onQuickAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-[#2eb88a] hover:bg-emerald-50 rounded-full h-8 w-8"
              title="Quick Log for this vehicle"
              onClick={() => onQuickAdd({
                vehicleNo: row.original.metadata?.vehicleNo,
                vehicleCode: row.original.metadata?.vehicleCode,
              })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {row.original.files && row.original.files.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8"
              asChild
            >
              <a href={row.original.files[0]} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8"
            onClick={() => onDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}

export function FuelTable({
  data,
  isLoading = false,
  totalItems = 0,
  pagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange = () => {},
  searchValue,
  onSearchChange,
  onDelete,
  onQuickAdd,
}: FuelTableProps) {
  const columns = React.useMemo(() => getFuelColumns(onDelete, onQuickAdd), [onDelete, onQuickAdd])

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      totalItems={totalItems}
      pageCount={Math.ceil(totalItems / pagination.pageSize) || 1}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      onSortingChange={() => {}}
      searchKey="title"
      searchPlaceholder="Search by vehicle no or date..."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      showSrNo={true}
    />
  )
}
