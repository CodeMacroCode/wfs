"use client"

import * as React from "react"
import { RefreshCw, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttendanceUploadDialog } from "@/components/dashboard/attendance-upload-dialog"
import { MarkLeaveDialog } from "@/components/dashboard/mark-leave-dialog"
import { useAttendanceQuery } from "@/hooks/queries/use-attendance"
import { PaginationState } from "@tanstack/react-table"
import { AttendanceTable } from "./attendance-table"

export default function AttendancePage() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, isLoading, refetch, isFetching } = useAttendanceQuery(
        pagination.pageIndex + 1,
        pagination.pageSize
    )

    return (
        <div className="flex flex-col gap-6 p-2 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight italic font-heading text-emerald-600">Attendance Log</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Monitor and manage daily attendance records and workforce punch logs.
                    </p>
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

                    <MarkLeaveDialog
                        trigger={
                            <Button variant="outline" className="border-gray-200 text-slate-700 bg-white hover:bg-gray-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95 border-none">
                                <Plus className="h-4 w-4" />
                                <span className="font-semibold text-sm">Mark Leave</span>
                            </Button>
                        }
                    />

                    <AttendanceUploadDialog
                        trigger={
                            <Button
                                variant="outline"
                                className="border-gray-200 text-slate-100 bg-[#2dd4bf] hover:bg-[#26bba8] flex gap-2 h-10 px-5 rounded-xl border-none shadow-sm transition-all active:scale-95"
                            >
                                <Upload className="h-4 w-4" />
                                <span className="font-bold text-sm">Bulk Import</span>
                            </Button>
                        }
                    />
                </div>
            </div>

            <AttendanceTable
                data={data?.data || []}
                isLoading={isLoading}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalItems={data?.total}
            />
        </div>
    )
}