"use client"

import * as React from "react"
import { Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FuelTable } from "@/components/fuel/fuel-table"
import { AddFuelDialog } from "@/components/fuel/fuel-dialogs"
import { useDocCenterQuery, useDeleteDocMutation } from "@/hooks/queries/use-doc-center"
import { useDebounce } from "@/hooks/use-debounce"
import { PaginationState } from "@tanstack/react-table"
import { FuelRecord } from "@/types/fuel"
import { FuelFormValues } from "@/components/fuel/fuel-dialogs"

export default function FuelExpensePage() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [initialValues, setInitialValues] = React.useState<Partial<FuelFormValues> | undefined>()
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 400)

  const { data, isLoading } = useDocCenterQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    documentType: "Fuel"
  })
  const deleteMutation = useDeleteDocMutation()

  const expenses = (data?.data || []) as unknown as FuelRecord[]
  const total = data?.pagination?.total || 0

  const handleQuickAdd = (values: Partial<FuelFormValues>) => {
    setInitialValues(values)
    setIsAddOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsAddOpen(open)
    if (!open) setInitialValues(undefined)
  }

  return (
    <div className="flex flex-col gap-8 p-2 md:p-8 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight italic font-heading text-[#2eb88a]">
            Fuel Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage fuel records and card balances for your entire fleet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-[#2eb88a] hover:bg-[#259b74] gap-2 text-white shadow-md shadow-emerald-500/20 rounded-xl h-10 px-5 font-bold"
            onClick={() => {
              setInitialValues(undefined)
              setIsAddOpen(true)
            }}
          >
            <Fuel className="h-4 w-4" />
            Log Fuel Expense
          </Button>
        </div>
      </div>


      {/* Table */}
      <FuelTable
        data={expenses}
        isLoading={isLoading}
        totalItems={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val)
          setPagination((p) => ({ ...p, pageIndex: 0 }))
        }}
        onDelete={(id) => {
          if (confirm("Are you sure you want to delete this fuel record?")) {
            deleteMutation.mutate(id)
          }
        }}
        onQuickAdd={handleQuickAdd}
      />

      <AddFuelDialog
        open={isAddOpen}
        onOpenChange={handleOpenChange}
        initialValues={initialValues}
      />
    </div>
  )
}