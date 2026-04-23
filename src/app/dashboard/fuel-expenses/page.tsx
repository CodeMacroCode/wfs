"use client"

import * as React from "react"
import { Fuel, TrendingUp, Droplets, Wallet, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FuelTable } from "@/components/fuel/fuel-table"
import { AddFuelDialog } from "@/components/fuel/fuel-dialogs"
import { useFuelQuery, useDeleteFuelMutation } from "@/hooks/queries/use-fuel"
import { useDebounce } from "@/hooks/use-debounce"
import { PaginationState } from "@tanstack/react-table"

export default function FuelExpensePage() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 400)

  const { data, isLoading } = useFuelQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
  })
  const deleteMutation = useDeleteFuelMutation()

  const expenses = data?.data || []
  const stats = data?.stats
  const total = data?.pagination?.total || 0

  const statCards = [
    { label: "Total Entries", value: stats?.totalEntries ?? 0, icon: Fuel, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Spent", value: `₹${(stats?.totalAmount ?? 0).toLocaleString()}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Fuel", value: `${(stats?.totalQuantity ?? 0).toLocaleString()} L`, icon: Droplets, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Avg Price/L", value: `₹${(stats?.avgPrice ?? 0).toFixed(2)}`, icon: IndianRupee, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Efficiency", value: "14.2 km/l", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
  ]

  return (
    <div className="flex flex-col gap-8 p-2 md:p-8 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight italic font-heading text-[#2eb88a]">
            Fuel Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Monitor vehicle fuel consumption and manage fleet expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-[#2eb88a] hover:bg-[#259b74] gap-2 text-white shadow-md shadow-emerald-500/20 rounded-xl h-10 px-5 font-bold"
            onClick={() => setIsAddOpen(true)}
          >
            <Fuel className="h-4 w-4" />
            Log Fuel Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4 border-none shadow-sm flex items-center gap-3">
            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl shrink-0`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</p>
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
            </div>
          </Card>
        ))}
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
      />

      <AddFuelDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />
    </div>
  )
}