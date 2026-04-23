"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, UserPlus } from "lucide-react"
import { Interview } from "@/types/recruitment"
import { PaginationState } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

interface InterviewTableProps {
  data: Interview[]
  isLoading?: boolean
  totalItems?: number
  pagination?: PaginationState
  onPaginationChange?: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onEdit: (interview: Interview) => void
  onDelete: (id: string) => void
  onOnboard: (interview: Interview) => void
}

export const getInterviewColumns = (
  onView: (interview: Interview) => void,
  onEdit: (interview: Interview) => void,
  onDelete: (id: string) => void,
  onOnboard: (interview: Interview) => void
): ColumnDef<Interview>[] => {
  return [
    {
      accessorKey: "candidateName",
      header: "Candidate",
      cell: ({ row }) => (
        <div 
          className="flex flex-col cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => onView(row.original)}
        >
          <span className="font-semibold text-slate-800">{row.original.candidateName}</span>
          <span className="text-xs text-slate-400">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 font-medium">{row.original.position}</span>
      ),
    },
    {
      accessorKey: "interviewDate",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {row.original.interviewDate
            ? new Date(row.original.interviewDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "interviewer",
      header: "Interviewer",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">{row.original.interviewer}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant =
          status === "Selected"
            ? "success"
            : status === "Not Selected"
            ? "destructive"
            : "secondary"

        return (
          <Badge variant={variant === "success" ? "outline" : variant} className={`rounded-full px-3 ${variant === "success" ? "border-[#2eb88a] text-[#2eb88a]" : ""}`}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const interview = row.original

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full h-8 w-8 p-0"
              onClick={() => onView(interview)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {interview.status === "Selected" && (
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full h-8 w-8 p-0"
                onClick={() => onOnboard(interview)}
                title="Onboard as Employee"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8 p-0"
              onClick={() => onEdit(interview)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8 p-0"
              onClick={() => onDelete(interview.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}

export function InterviewTable({
  data,
  isLoading = false,
  totalItems = 0,
  pagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange = () => {},
  searchValue: searchValueProp,
  onSearchChange: onSearchChangeProp,
  onEdit,
  onDelete,
  onOnboard,
}: InterviewTableProps) {
  const router = useRouter()
  const [localSearch, setLocalSearch] = React.useState("")

  // Allow parent to control search (server-side) or fall back to local state
  const searchValue = searchValueProp !== undefined ? searchValueProp : localSearch
  const handleSearchChange = onSearchChangeProp ?? setLocalSearch

  const columns = React.useMemo(
    () => getInterviewColumns(
      (interview) => router.push(`/dashboard/recruitment/${interview.id}`), 
      onEdit, 
      onDelete, 
      onOnboard
    ),
    [onEdit, onDelete, onOnboard, router]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      totalItems={totalItems}
      pageCount={Math.ceil(totalItems / pagination.pageSize) || 1}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      onSortingChange={() => {}}
      searchKey="candidateName"
      searchPlaceholder="Search candidate..."
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      showSrNo={true}
    />
  )
}
