"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Clock, AlertTriangle } from "lucide-react"
import { Asset } from "@/types/asset"
import { cn } from "@/lib/utils"

interface AssetTableProps {
  data: Asset[]
  isLoading?: boolean
  onEdit: (asset: Asset) => void
  onDelete: (id: string) => void
}

const isMaintenanceDueSoon = (dateStr: string) => {
  const dueDate = new Date(dateStr)
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 10 && diffDays >= 0
}

export const getAssetColumns = (
  onEdit: (asset: Asset) => void,
  onDelete: (id: string) => void
): ColumnDef<Asset>[] => {
  return [
    {
      accessorKey: "name",
      header: "Asset Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.original.name}</span>
          <span className="text-xs text-slate-400 font-mono">SN: {row.original.serialNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="rounded-full bg-slate-50">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "issuedTo",
      header: "Issued To",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 font-medium">{row.original.issuedTo}</span>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Issued On",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">{row.original.issueDate}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant =
          status === "Issued"
            ? "default"
            : status === "Returned"
            ? "secondary"
            : status === "Under Maintenance"
            ? "destructive"
            : "outline"

        return (
          <Badge variant={variant} className="rounded-full px-3">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "nextMaintenanceDate",
      header: "Next Maint.",
      cell: ({ row }) => {
        const date = row.original.nextMaintenanceDate
        const isDueSoon = isMaintenanceDueSoon(date)

        return (
          <div className={cn(
            "flex items-center gap-1.5 text-sm",
            isDueSoon ? "text-orange-600 font-bold" : "text-slate-500"
          )}>
            <Clock className={cn("h-3.5 w-3.5", isDueSoon && "animate-pulse")} />
            {date}
            {isDueSoon && <AlertTriangle className="h-4 w-4 text-orange-500" />}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const asset = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8 p-0"
              onClick={() => onEdit(asset)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8 p-0"
              onClick={() => onDelete(asset.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}

export function AssetTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
}: AssetTableProps) {
  const columns = React.useMemo(
    () => getAssetColumns(onEdit, onDelete),
    [onEdit, onDelete]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      totalItems={data.length}
      pageCount={1}
      pagination={{ pageIndex: 0, pageSize: 10 }}
      onPaginationChange={() => {}}
      onSortingChange={() => {}}
      searchKey="name"
      searchPlaceholder="Search asset name or SN..."
      searchValue=""
      onSearchChange={() => {}}
      showSrNo={true}
    />
  )
}
