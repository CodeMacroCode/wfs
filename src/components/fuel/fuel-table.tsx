"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, FileText } from "lucide-react"
import { FuelExpense } from "@/types/fuel"
import { PaginationState } from "@tanstack/react-table"
import { format } from "date-fns"

interface FuelTableProps {
  data: FuelExpense[]
  isLoading?: boolean
  totalItems?: number
  pagination?: PaginationState
  onPaginationChange?: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onDelete: (id: string) => void
}

export const getFuelColumns = (
  onDelete: (id: string) => void
): ColumnDef<FuelExpense>[] => {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">
          {format(new Date(row.original.date), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "vehicleName",
      header: "Vehicle",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.original.vehicleName}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.original.vehicleId}</span>
        </div>
      ),
    },
    {
      accessorKey: "fuelType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold uppercase text-[10px]">
          {row.original.fuelType}
        </Badge>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-slate-700">{row.original.quantity} L</span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-sm font-black text-emerald-600">₹{row.original.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "odometerReading",
      header: "Odometer",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-500">{row.original.odometerReading.toLocaleString()} km</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.receiptUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8"
              asChild
            >
              <a href={row.original.receiptUrl} target="_blank" rel="noopener noreferrer">
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
}: FuelTableProps) {
  const columns = React.useMemo(() => getFuelColumns(onDelete), [onDelete])

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
      searchKey="vehicleName"
      searchPlaceholder="Search vehicle..."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      showSrNo={true}
    />
  )
}
