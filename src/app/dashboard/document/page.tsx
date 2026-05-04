"use client"

import * as React from "react"
import { useDocCenterQuery } from "@/hooks/queries/use-doc-center"
import { DocCenterTable } from "@/components/dashboard/document/doc-center-table"
import { UploadDocDialog } from "@/components/dashboard/document/upload-doc-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    documentType: documentType === "All" ? undefined : documentType,
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

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-full md:w-64">
          <Select 
            value={documentType || "All"} 
            onValueChange={(val) => setDocumentType(val)}
          >
            <SelectTrigger className="rounded-xl border-slate-200 h-10 font-bold bg-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Bill">Bill</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Picks">Picks</SelectItem>
              <SelectItem value="Documents">Documents</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(search || documentType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
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