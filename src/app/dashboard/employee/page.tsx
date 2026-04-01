"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, RefreshCw } from "lucide-react"
import { useDataTable } from "@/hooks/use-data-table"
import { useEmployeesQuery } from "@/hooks/queries/use-employees-query"
import { Employee, EmployeeQueryParams } from "@/types/employee"
import { RegisterEmployeeDialog, EditEmployeeDialog } from "@/components/employee/employee-dialogs"
import { DeleteEmployeeDialog } from "@/components/employee/delete-employee-dialog"
import { DataTableExport } from "@/components/ui/data-table-export"
import { employeeService } from "@/services/employee-service"

export default function EmployeeMaster() {
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = React.useState<string | null>(null)

  const {
    pagination,
    onPaginationChange,
    onSortingChange,
    search,
    onSearchChange,
    apiParams,
  } = useDataTable({
    storageKey: "employee-master",
  })

  const { data, isLoading, refetch, isFetching } = useEmployeesQuery(apiParams as EmployeeQueryParams)

  const columns: ColumnDef<Employee>[] = [
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full h-8 w-8 p-0"
              onClick={() => setEditingEmployee(employee)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8 p-0"
              onClick={() => setDeletingEmployeeId(employee.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Employee Master</h2>
          <p className="text-sm text-slate-500">
            Manage your organization&apos;s employees and their access levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors h-10 w-10 p-0 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <DataTableExport
            columns={columns}
            filename="employee_report"
            fetchData={() => employeeService.getAll({ ...apiParams, limit: "all" } as EmployeeQueryParams)}
          />
          <RegisterEmployeeDialog />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={data?.pagination?.total || 0}
        pageCount={data?.pagination?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        onSortingChange={onSortingChange}
        searchKey="uniqueId"
        searchPlaceholder="Search employee..."
        searchValue={search}
        onSearchChange={onSearchChange}
        showSrNo={true}
      />

      <EditEmployeeDialog
        employee={editingEmployee}
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(null)}
      />

      <DeleteEmployeeDialog
        employeeId={deletingEmployeeId}
        open={!!deletingEmployeeId}
        onOpenChange={(open) => !open && setDeletingEmployeeId(null)}
      />
    </div>
  )
}