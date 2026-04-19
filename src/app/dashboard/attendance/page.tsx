"use client"

import * as React from "react"
import { RefreshCw, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttendanceUploadDialog } from "@/components/dashboard/attendance-upload-dialog"
import { MarkLeaveDialog } from "@/components/dashboard/mark-leave-dialog"
import { useAttendanceWithSummaryQuery } from "@/hooks/queries/use-attendance"
import { useCompanyDropdownQuery } from "@/hooks/queries/use-company"
import { PaginationState } from "@tanstack/react-table"
import { AttendanceTable } from "./attendance-table"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
    Users, 
    UserCheck, 
    UserX, 
    UserMinus, 
    AlertTriangle 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date()
    })
    const [status, setStatus] = React.useState<string | undefined>(undefined)
    const [companyId, setCompanyId] = React.useState<string>("all")

    const { data, isLoading, refetch, isFetching } = useAttendanceWithSummaryQuery(
        date?.from ? format(date.from, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        date?.to ? format(date.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        pagination.pageIndex + 1,
        pagination.pageSize,
        status,
        companyId === "all" ? undefined : companyId
    )

    const handleStatusFilter = (newStatus: string | undefined) => {
        if (status === newStatus) {
            setStatus(undefined)
        } else {
            setStatus(newStatus)
        }
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }

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
                <div className="flex flex-wrap items-end gap-3 px-1">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Company</Label>
                        <CompanySelect 
                            value={companyId} 
                            onValueChange={(val) => {
                                setCompanyId(val)
                                setPagination(prev => ({ ...prev, pageIndex: 0 }))
                            }} 
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Range Filter</Label>
                        <DatePickerWithRange 
                            date={date} 
                            setDate={(newDate) => {
                                setDate(newDate)
                                setPagination(prev => ({ ...prev, pageIndex: 0 }))
                            }} 
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isLoading || isFetching}
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 w-10 rounded-xl shadow-sm transition-all active:scale-95 bg-white border"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>

                    <MarkLeaveDialog
                        trigger={
                            <Button variant="outline" className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95">
                                <Plus className="h-4 w-4" />
                                <span className="font-semibold text-sm">Mark Leave</span>
                            </Button>
                        }
                    />

                    <AttendanceUploadDialog
                        trigger={
                            <Button
                                variant="outline"
                                className="border-none text-white bg-emerald-500 hover:bg-emerald-600 flex gap-2 h-10 px-5 rounded-xl shadow-sm transition-all active:scale-95"
                            >
                                <Upload className="h-4 w-4" />
                                <span className="font-bold text-sm">Bulk Import</span>
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* Attendance Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Labor", value: data?.summary?.totalUsers ?? 0, icon: Users, color: "text-slate-600", bg: "bg-slate-50", status: undefined },
                    { label: "Present", value: data?.summary?.present ?? 0, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", status: "Present" },
                    { label: "Absent", value: data?.summary?.absent ?? 0, icon: UserX, color: "text-rose-600", bg: "bg-rose-50", status: "Absent" },
                    { label: "On Leave", value: data?.summary?.onLeave ?? 0, icon: UserMinus, color: "text-amber-600", bg: "bg-amber-50", status: "On Leave" },
                    { label: "Not Marked", value: data?.summary?.notMarked ?? 0, icon: AlertTriangle, color: "text-emerald-300", bg: "bg-[#0a3622]", status: "Not Marked" },
                ].map((stat) => {
                    const isActive = status === stat.status;
                    return (
                        <Card 
                            key={stat.label} 
                            onClick={() => handleStatusFilter(stat.status)}
                            className={cn(
                                "p-5 border-none shadow-sm flex flex-col justify-between min-h-[120px] rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                                stat.label === 'Not Marked' ? 'bg-[#0a3622]' : 'bg-white',
                                isActive && "ring-2 ring-emerald-500 ring-offset-2"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    stat.label === 'Not Marked' ? 'text-emerald-500/70' : 'text-slate-400',
                                    isActive && "text-emerald-600"
                                )}>
                                    {stat.label}
                                </p>
                                <div className={cn(
                                    "p-2 rounded-xl transition-colors",
                                    stat.label === 'Not Marked' ? 'bg-emerald-500/10' : stat.bg,
                                    isActive && "bg-emerald-500 text-white"
                                )}>
                                    <stat.icon className={cn(
                                        "h-4 w-4 transition-colors",
                                        stat.label === 'Not Marked' ? 'text-emerald-500' : stat.color,
                                        isActive && "text-white"
                                    )} />
                                </div>
                            </div>
                            <p className={cn(
                                "text-3xl font-black tracking-tight",
                                stat.label === 'Not Marked' ? 'text-white' : 'text-slate-900'
                            )}>
                                {stat.value}
                            </p>
                        </Card>
                    );
                })}
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

function CompanySelect({ value, onValueChange }: { value: string, onValueChange: (val: string) => void }) {
    const { data: companyData, isLoading } = useCompanyDropdownQuery()
    const companies = companyData?.data || []

    return (
        <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
            <SelectTrigger className="w-[180px] h-10 rounded-xl border-slate-200 bg-white shadow-sm font-semibold text-xs text-slate-700 focus:ring-emerald-500/10">
                <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                <SelectItem value="all" className="text-xs font-semibold">All Companies</SelectItem>
                {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id} className="text-xs font-semibold">
                        {company.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}