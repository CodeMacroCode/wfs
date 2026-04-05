"use client"

import * as React from "react"
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
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
}

const PasswordCell = ({ password }: { password?: string }) => {
    const [show, setShow] = React.useState(false)

    if (!password) {
        return <span className="text-slate-300 italic text-xs">Not set</span>
    }

    return (
        <div className="flex items-center gap-2 group/pass">
            <span className="font-mono text-slate-500 text-[13px] min-w-[80px]">
                {show ? password : "••••••••"}
            </span>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                onClick={() => setShow(!show)}
            >
                {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
        </div>
    )
}

export const getEmployeeColumns = (
    onEdit?: (employee: Employee) => void,
    onDelete?: (id: string) => void
): ColumnDef<Employee>[] => {
    const cols: ColumnDef<Employee>[] = [
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
                <span className="font-mono text-slate-500 text-[13px]">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: "email",
            header: "Email Address",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{row.original.email}</span>
                    {row.original.name && (
                        <span className="text-xs text-slate-400 capitalize">{row.original.name}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "password",
            header: "Password",
            cell: ({ row }) => <PasswordCell password={row.original.password} />,
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
}: EmployeeTableProps) {
    const columns = React.useMemo(
        () => getEmployeeColumns(onEdit, onDelete),
        [onEdit, onDelete]
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
