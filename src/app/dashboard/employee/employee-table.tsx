"use client"

import * as React from "react"
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Employee } from "@/types/employee"
import { format } from "date-fns"

interface EmployeeTableProps {
    data: Employee[]
    isLoading: boolean
    totalItems: number
    pageCount: number
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    onSortingChange: (sorting: SortingState) => void
    search: string
    onSearchChange: (value: string) => void
    onEdit?: (employee: Employee) => void
    onDelete?: (id: string) => void
    onView?: (employee: Employee) => void
    showActions?: boolean
    hideSearch?: boolean
    isDashboardView?: boolean
}

export const getEmployeeColumns = (
    onEdit?: (employee: Employee) => void,
    onDelete?: (id: string) => void,
    onView?: (employee: Employee) => void,
    isDashboardView?: boolean,
): ColumnDef<Employee>[] => {
    const cols: ColumnDef<Employee>[] = [
        {
            accessorKey: "uniqueId",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-bold text-[#2eb88a] text-center">
                    {row.original.uniqueId}
                </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="font-semibold text-slate-800">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "designation",
            header: "Designation",
            cell: ({row}) => (
                <div className="flex items-center justify-center">
                    <span className="text-sm text-slate-600 capitalize">{row.original.designation}</span>
                </div>
            )
        },
        {
            accessorKey: "email",
            header: "Contact Info",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="font-medium text-slate-600 truncate">{row.original.email}</span>
                    {row.original.mobileNo && (
                        <span className="text-xs text-slate-400">{row.original.mobileNo}</span>
                    )}
                </div>
            ),
        },
    ];

    if (!isDashboardView) {
        cols.push({
            accessorKey: "emergencyContact",
            header: "Emergency Contact",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="text-sm text-slate-600 capitalize">{row.original.emergencyContact?.name || "N/A"}</span>
                    {row.original.emergencyContact?.phone && (
                        <span className="text-xs text-slate-400">{row.original.emergencyContact.phone}</span>
                    )}
                </div>
            )
        });
        cols.push({
            accessorKey: "doj",
            header: "Joining Date",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="text-sm font-medium text-slate-700">
                        {row.original.doj ? format(new Date(row.original.doj), "dd MMM yyyy") : "N/A"}
                    </span>
                </div>
            ),
        });
    }

    if (onEdit || onDelete || onView) {
        cols.push({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const employee = row.original

                return (
                    <div className="flex items-center justify-center gap-2">
                        {onView && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-[#2eb88a] hover:bg-[#2eb88a]/5 rounded-full h-8 w-8 p-0"
                                onClick={() => onView(employee)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        )}
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full h-8 w-8 p-0"
                                onClick={() => onEdit(employee)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8 p-0"
                                onClick={() => onDelete(employee.id || employee._id || "")}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )
            },
        })
    }

    return cols
}

export function EmployeeTable({
    data,
    isLoading,
    totalItems,
    pageCount,
    pagination,
    onPaginationChange,
    onSortingChange,
    search,
    onSearchChange,
    onEdit,
    onDelete,
    onView,
    showActions,
    hideSearch,
    isDashboardView,
}: EmployeeTableProps) {
    const router = useRouter()
    
    // Default onView redirect only if showActions is not explicitly false
    const effectiveOnView = React.useMemo(() => {
        if (showActions === false) return undefined
        return onView || ((emp: Employee) => router.push(`/dashboard/employee/${emp.id || emp._id}`))
    }, [onView, router, showActions])

    const columns = React.useMemo(
        () => getEmployeeColumns(
            showActions === false ? undefined : onEdit, 
            showActions === false ? undefined : onDelete, 
            effectiveOnView,
            isDashboardView
        ),
        [onEdit, onDelete, effectiveOnView, showActions, isDashboardView]
    )

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            totalItems={totalItems}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            onSortingChange={onSortingChange}
            searchKey="uniqueId"
            searchPlaceholder="Search employee..."
            searchValue={search}
            onSearchChange={onSearchChange}
            showSrNo={true}
            hideSearch={hideSearch}
        />
    )
}
