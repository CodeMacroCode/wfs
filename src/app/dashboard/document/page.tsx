"use client"

import * as React from "react"
import { useDocCenterQuery } from "@/hooks/queries/use-doc-center"
import { DocCenterTable } from "@/components/dashboard/document/doc-center-table"
import { UploadDocDialog } from "@/components/dashboard/document/upload-doc-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentPage() {
  const [search, setSearch] = React.useState("")
  const [documentType, setDocumentType] = React.useState<string | undefined>(undefined)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading } = useDocCenterQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    documentType: documentType || undefined,
  })

  const handleResetFilters = () => {
    setSearch("")
    setDocumentType(undefined)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic font-heading">
            Document Center
          </h1>
          <p className="text-slate-500 font-medium">
            Manage and organize your company documents, bills, and identities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UploadDocDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {(search || documentType) && (
          <div className="md:col-span-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-slate-500 border-slate-200 hover:bg-slate-50"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <DocCenterTable
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={data?.pagination.total}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={setSearch}
        searchValue={search}
      />
    </div>
  )
}