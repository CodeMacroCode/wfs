"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { Roster } from "@/types/roster"
import { Badge } from "@/components/ui/badge"
import { useDeleteRosterMutation } from "@/hooks/queries/use-roster"

interface RoasterTableProps {
  data: Roster[]
  isLoading?: boolean
}

export function RoasterTable({ data, isLoading }: RoasterTableProps) {
  const deleteMutation = useDeleteRosterMutation()

  const columns: ColumnDef<Roster>[] = [
    {
      accessorKey: "employeeName",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{row.original.employeeName}</span>
          <span className="text-xs text-slate-500">ID: {row.original.employeeId}</span>
        </div>
      ),
    },
    {
      accessorKey: "employeeId",
      header: "Employee ID",
    },
    {
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="text-slate-600 font-medium">
          {row.original.companyName}
        </div>
      ),
    },
    {
      accessorKey: "shiftName",
      header: "Assigned Shift",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg">
          {row.original.shiftName}
        </Badge>
      ),
    },
    {
      id: "dateRange",
      header: "Date Range",
      cell: ({ row }) => (
        <div className="text-slate-600 font-medium">
          {row.original.startDate} to {row.original.endDate}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive rounded-lg flex items-center gap-2"
                onClick={() => deleteMutation.mutate(row.original._id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchKey="employeeName"
      searchPlaceholder="Search by employee name..."
    />
  )
}
