"use client"

import * as React from "react"
import { PaginationState } from "@tanstack/react-table"
import { RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoasterDialog } from "@/components/dashboard/roaster-dialog"
import { RoasterTable } from "./roaster-table"
import { useAssignAttendancePolicyQuery } from "@/hooks/queries/use-roster"
import { useDebounce } from "@/hooks/use-debounce"

export default function RoasterPage() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [search, setSearch] = React.useState("")
    const debouncedSearch = useDebounce(search, 500)

    const { data, isLoading, refetch, isFetching } = useAssignAttendancePolicyQuery(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch
    )

    // Reset to first page when searching
    React.useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [debouncedSearch])

    return (
        <div className="flex flex-col gap-6 p-2 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic font-heading">Roster Management</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        View and manage employee shifts and schedules.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search employee or policy..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-teal-500/20"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => refetch()}
                            disabled={isLoading || isFetching}
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 w-10 rounded-xl shadow-sm transition-all active:scale-95 border-none bg-white p-0"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                        <RoasterDialog />
                    </div>
                </div>
            </div>

            <RoasterTable 
                data={data?.data || []} 
                isLoading={isLoading}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalItems={data?.pagination?.total}
                pageCount={data?.pagination?.totalPages}
            />
        </div>
    )
}