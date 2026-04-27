"use client"

import * as React from "react"
import { RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDataTable } from "@/hooks/use-data-table"
import { useEmployeesQuery } from "@/hooks/queries/use-employees-query"
import { Employee, EmployeeQueryParams } from "@/types/employee"
import { RegisterEmployeeDialog, EditEmployeeDialog } from "@/components/employee/employee-dialogs"
import { AvailableEmployeeIdDialog } from "@/components/employee/available-employee-id-dialog"
import { DeleteEmployeeDialog } from "@/components/employee/delete-employee-dialog"
import { DataTableExport } from "@/components/ui/data-table-export"
import { employeeService } from "@/services/employee-service"
import { EmployeeTable, getEmployeeColumns } from "./employee-table"
import { InfiniteScrollSelect } from "@/components/ui/infinite-scroll-select"
import { useCompanyDropdownInfiniteQuery } from "@/hooks/queries/use-company"
import { useDebounce } from "@/hooks/use-debounce"

export default function EmployeeMaster() {
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = React.useState<string | null>(null)
  const [companyId, setCompanyId] = React.useState<string | undefined>(undefined)
  const [companySearch, setCompanySearch] = React.useState("")
  const debouncedCompanySearch = useDebounce(companySearch, 500)

  const {
    pagination,
    onPaginationChange,
    onSortingChange,
    search,
    onSearchChange,
    apiParams,
  } = useDataTable({
    storageKey: "employee-master",
    initialPageSize: 10,
  })

  const { data, isLoading, refetch, isFetching } = useEmployeesQuery({ 
    ...apiParams, 
    limit: 10,
    companyId: companyId 
  } as EmployeeQueryParams)

  const { 
    data: companiesData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: companiesLoading 
  } = useCompanyDropdownInfiniteQuery({ search: debouncedCompanySearch })

  const companies = companiesData?.pages.flatMap((page) => page.data) || []

  // Use a static version of columns for export (without actions, including all fields)
  const exportColumns = React.useMemo(() => getEmployeeColumns(undefined, undefined, undefined, undefined, true), [])

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
            defaultSelectedColumns={['name', 'uniqueId', 'designation']}
          />
          <AvailableEmployeeIdDialog />
          <RegisterEmployeeDialog />
        </div>
      </div>

      <EmployeeTable
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={data?.pagination?.total || 0}
        pageCount={data?.pagination?.totalPages || 0}
        pagination={{ ...pagination, pageSize: 10 }}
        onPaginationChange={onPaginationChange}
        onSortingChange={onSortingChange}
        search={search}
        onSearchChange={onSearchChange}
        onEdit={setEditingEmployee}
        onDelete={setDeletingEmployeeId}
        extraActions={
          <div className="flex items-center gap-2">
            {companyId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCompanyId(undefined)
                  onPaginationChange({ ...pagination, pageIndex: 0 })
                }}
                className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                title="Clear Company Filter"
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            )}
            <div className="w-[200px]">
              <InfiniteScrollSelect
                placeholder="Filter by Company"
                searchPlaceholder="Search companies..."
                items={companies}
                value={companyId}
                onValueChange={(val) => {
                  setCompanyId(val === companyId ? undefined : val)
                  onPaginationChange({ ...pagination, pageIndex: 0 })
                }}
                onSearchChange={setCompanySearch}
                loadMore={() => fetchNextPage()}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={companiesLoading}
                getLabel={(item) => item.name}
                getValue={(item) => item._id}
                className="h-10 border-slate-200 rounded-xl bg-white shadow-sm font-semibold text-xs text-slate-700"
              />
            </div>
          </div>
        }
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