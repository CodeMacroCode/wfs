"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Paperclip,
} from "lucide-react"
import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { useAssetQuery, useAssetHistoryQuery, useCreateAssetTrackingMutation, useDeleteAssetTrackingMutation } from "@/hooks/queries/use-assets-query"
import { AssetTrackingHistory, AssetType, AssetStatus } from "@/types/asset"
import { AssetTrackingDialog } from "@/components/asset-tracking/asset-tracking-dialog"
import { Plus, Trash2 } from "lucide-react"

export default function AssetMaintenanceHistoryPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  const { data: realAsset, isLoading: isLoadingAsset } = useAssetQuery(id)
  
  const { data: historyResponse, isLoading: isLoadingHistory } = useAssetHistoryQuery(id, {
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const createTrackingMutation = useCreateAssetTrackingMutation()
  const deleteTrackingMutation = useDeleteAssetTrackingMutation(id)

  const handleAddTracking = async (data: { amount: number; description: string; images?: File[] }) => {
    try {
      await createTrackingMutation.mutateAsync({
        ...data,
        assetId: id
      })
      setIsAddOpen(false)
    } catch {
      // Error handled by mutation toast
    }
  }

  const handleDeleteTracking = async (recordId: string) => {
    if (confirm("Are you sure you want to delete this tracking record?")) {
      try {
        await deleteTrackingMutation.mutateAsync(recordId)
      } catch {
        // Error handled by mutation toast
      }
    }
  }

  const asset = realAsset || {
    _id: id,
    name: "",
    type: "Other" as AssetType,
    serialNumber: "",
    status: "In Stock" as AssetStatus,
    maintenanceDueDate: ""
  }

  const historyData = React.useMemo(() => {
    return historyResponse?.data || []
  }, [historyResponse])

  const columns: ColumnDef<AssetTrackingHistory>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-slate-700">{row.original.description}</span>
          <span className="text-[10px] text-slate-400 font-medium italic line-clamp-1">Asset ID: {row.original.assetId}</span>
        </div>
      )
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-bold text-slate-900">
          ₹{row.original.amount.toLocaleString()}
        </div>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-600">
            {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
          </span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {format(new Date(row.original.createdAt), "hh:mm a")}
          </span>
        </div>
      )
    },
    {
      accessorKey: "images",
      header: "Attachments",
      cell: ({ row }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

        return (
          <div className="flex flex-wrap gap-2">
            {row.original.images && row.original.images.map((img, idx) => {
              const fileName = img.split('/').pop() || `File ${idx + 1}`
              const fileUrl = img.startsWith('http') ? img : `${baseUrl}${img}`
              
              return (
                <a
                  key={idx}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-[11px] font-bold border border-indigo-100"
                  title={fileName}
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  {fileName.length > 20 ? fileName.substring(0, 17) + "..." : fileName}
                </a>
              )
            })}
            {(!row.original.images || row.original.images.length === 0) && (
              <span className="text-slate-300 italic text-[10px]">No attachments</span>
            )}
          </div>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8 p-0"
          onClick={() => handleDeleteTracking(row.original._id)}
          disabled={deleteTrackingMutation.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  if (isLoadingAsset || isLoadingHistory) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-slate-100 h-10 w-10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Asset Tracking</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-indigo-600">History Log</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 italic font-heading flex items-center gap-3">
            {asset.name}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 italic font-heading">
            <Clock className="h-5 w-5 text-indigo-500" />
            Tracking & Expense Records
          </h3>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white shadow-lg shadow-indigo-500/20 rounded-xl font-bold h-10 px-5"
            >
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>


        <DataTable
          columns={columns}
          data={historyData}
          isLoading={isLoadingHistory}
          totalItems={historyData.length}
          showSrNo={true}
          hideSearch={true}
        />

      </div>

      <AssetTrackingDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddTracking}
        isPending={createTrackingMutation.isPending}
      />
    </div>
  )
}
