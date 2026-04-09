"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDataTable } from "@/hooks/use-data-table"
import { useEmployeesQuery } from "@/hooks/queries/use-employees-query"
import { Employee, EmployeeQueryParams } from "@/types/employee"
import { RegisterEmployeeDialog, EditEmployeeDialog } from "@/components/employee/employee-dialogs"
import { DeleteEmployeeDialog } from "@/components/employee/delete-employee-dialog"
import { DataTableExport } from "@/components/ui/data-table-export"
import { employeeService } from "@/services/employee-service"
import { EmployeeTable, getEmployeeColumns } from "./employee-table"
import { EmployeeDetailDialog } from "@/components/employee/employee-detail-dialog"

export default function EmployeeMaster() {
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = React.useState<string | null>(null)
  const [viewingEmployeeId, setViewingEmployeeId] = React.useState<string | null>(null)

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

  // Use a static version of columns for export (without actions)
  const exportColumns = React.useMemo(() => getEmployeeColumns(), [])

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
            columns={exportColumns}
            filename="employee_report"
            fetchData={() => employeeService.getAll({ ...apiParams, limit: "all" } as EmployeeQueryParams)}
          />
          <RegisterEmployeeDialog />
        </div>
      </div>

      <EmployeeTable
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={data?.pagination?.total || 0}
        pageCount={data?.pagination?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        onSortingChange={onSortingChange}
        search={search}
        onSearchChange={onSearchChange}
        onEdit={setEditingEmployee}
        onDelete={setDeletingEmployeeId}
        onView={setViewingEmployeeId}
      />

      <EmployeeDetailDialog
        employeeId={viewingEmployeeId}
        open={!!viewingEmployeeId}
        onOpenChange={(open) => !open && setViewingEmployeeId(null)}
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