"use client"

import * as React from "react"
import { useCompanyQuery } from "@/hooks/queries/use-company"
import { CompanyTable } from "@/components/dashboard/company/company-table"
import { AddCompanyDialog } from "@/components/dashboard/company/add-company-dialog"
import { useDebounce } from "@/hooks/use-debounce"

export default function CompanyMasterPage() {
  const [search, setSearch] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading } = useCompanyQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic font-heading">
            Company Master
          </h1>
          <p className="text-slate-500 font-medium">
            Manage company profiles, contact information, and GST details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddCompanyDialog />
        </div>
      </div>

      {/* Table */}
      <CompanyTable
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={data?.pagination.total}
        pagination={pagination}
        onPaginationChange={setPagination}
        searchValue={search}
        onSearchChange={setSearch}
      />
    </div>
  )
}