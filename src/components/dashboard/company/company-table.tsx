"use client"

import * as React from "react"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, Phone, Mail, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Company } from "@/types/company"
import { format } from "date-fns"
import { useDeleteCompanyMutation } from "@/hooks/queries/use-company"
import { EditCompanyDialog } from "./edit-company-dialog"

interface CompanyTableProps {
  data: Company[]
  isLoading: boolean
  totalItems?: number
  pagination: PaginationState
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
  searchValue: string
  onSearchChange: (value: string) => void
}

export function CompanyTable({
  data,
  isLoading,
  totalItems,
  pagination,
  onPaginationChange,
  searchValue,
  onSearchChange,
}: CompanyTableProps) {
  const deleteMutation = useDeleteCompanyMutation()

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Company",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{row.original.name}</p>
            {row.original.gstNumber && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">GST: {row.original.gstNumber}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="space-y-1">
          {row.original.email && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Mail className="h-3 w-3 text-slate-400" />
              <span>{row.original.email}</span>
            </div>
          )}
          {row.original.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Phone className="h-3 w-3 text-slate-400" />
              <span>{row.original.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-start gap-1.5 max-w-[200px]">
          {row.original.address ? (
            <>
              <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
              <span className="text-xs text-slate-600 line-clamp-2">{row.original.address}</span>
            </>
          ) : (
            <span className="text-xs text-slate-300 italic">—</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "prefix",
      header: "Prefix",
      cell: ({ row }) =>
        row.original.prefix ? (
          <Badge variant="outline" className="text-xs font-bold text-slate-600 border-slate-200">
            {row.original.prefix}
          </Badge>
        ) : (
          <span className="text-xs text-slate-300 italic">—</span>
        ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
              : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-50"
          }
          variant="outline"
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
              row.original.isActive ? "bg-emerald-500" : "bg-rose-400"
            }`}
          />
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500 font-medium">
          {format(new Date(row.original.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const company = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <EditCompanyDialog
                  company={company}
                  trigger={
                    <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm w-full">
                      <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                      Edit
                    </div>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-rose-600 cursor-pointer"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${company.name}"?`)) {
                    deleteMutation.mutate(company._id)
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
      totalItems={totalItems}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search companies..."
      showSrNo={true}
    />
  )
}
