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
import { AttendancePolicyUser } from "@/types/roster"
import { Badge } from "@/components/ui/badge"
import { useDeleteRosterMutation } from "@/hooks/queries/use-roster"
import { format } from "date-fns"

interface RoasterTableProps {
  data: AttendancePolicyUser[]
  isLoading?: boolean
}

export function RoasterTable({ data, isLoading }: RoasterTableProps) {
  const deleteMutation = useDeleteRosterMutation()

  const columns: ColumnDef<AttendancePolicyUser>[] = [
    {
      accessorKey: "name",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{row.original.name}</span>
          <span className="text-xs text-slate-500">ID: {row.original.uniqueId}</span>
        </div>
      ),
    },
    {
      accessorKey: "uniqueId",
      header: "Unique ID",
    },
    {
      accessorKey: "mobileNo",
      header: "Mobile No",
      cell: ({ row }) => (
        <div className="text-slate-600 font-medium">
          {row.original.mobileNo}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-100 rounded-lg">
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "attendancePolicyId",
      header: "Policy ID",
      cell: ({ row }) => (
        row.original.attendancePolicyId ? (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg">
            {row.original.attendancePolicyId}
          </Badge>
        ) : (
          <span className="text-slate-400 text-sm italic">Not Assigned</span>
        )
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-slate-600 font-medium">
          {format(new Date(row.original.createdAt), "dd MMM yyyy")}
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
      searchKey="name"
      searchPlaceholder="Search by employee name..."
    />
  )
}
