"use client"

import * as React from "react"
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Employee } from "@/types/employee"

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
    onEdit: (employee: Employee) => void
    onDelete: (id: string) => void
    onView: (id: string) => void
}

export const getEmployeeColumns = (
    onEdit?: (employee: Employee) => void,
    onDelete?: (id: string) => void,
    onView?: (id: string) => void
): ColumnDef<Employee>[] => {
    const cols: ColumnDef<Employee>[] = [
        {
            accessorKey: "empCode",
            header: "EMP Code",
            cell: ({ row }) => (
                <span className="font-bold text-[#2eb88a]">
                    {row.original.empCode}
                </span>
            ),
        },
        {
            accessorKey: "uniqueId",
            header: "Unique ID",
            cell: ({ row }) => (
                <span className="font-mono text-slate-500 text-[13px]">
                    #{row.original.uniqueId}
                </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex flex-col items-start">
                    <button 
                        onClick={() => onView?.(row.original.id)}
                        className="font-bold text-slate-800 hover:text-[#3CC3A3] hover:underline transition-all cursor-pointer text-left"
                    >
                        {row.original.name}
                    </button>
                    {row.original.designation && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.original.designation}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Contact Info",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-600 truncate max-w-[150px]">{row.original.email}</span>
                    {row.original.mobileNo && (
                        <span className="text-xs text-slate-400">{row.original.mobileNo}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.original.role
                const variant =
                    role === "admin"
                        ? "destructive"
                        : role === "hr"
                            ? "secondary"
                            : "outline"

                return (
                    <Badge variant={variant} className="capitalize rounded-full px-3">
                        {role.toLowerCase().replace("_", " ")}
                    </Badge>
                )
            },
        },
    ]

    if (onEdit || onDelete) {
        cols.push({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const employee = row.original

                return (
                    <div className="flex items-center gap-2">
                        {onView && (
                             <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8 p-0"
                                onClick={() => onView(employee.id)}
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
                                onClick={() => onDelete(employee.id)}
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
}: EmployeeTableProps) {
    const columns = React.useMemo(
        () => getEmployeeColumns(onEdit, onDelete, onView),
        [onEdit, onDelete, onView]
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
        />
    )
}
