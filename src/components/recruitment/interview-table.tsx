"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserPlus } from "lucide-react"
import { Interview } from "@/types/recruitment"

interface InterviewTableProps {
  data: Interview[]
  isLoading?: boolean
  onEdit: (interview: Interview) => void
  onDelete: (id: string) => void
  onOnboard: (interview: Interview) => void
}

export const getInterviewColumns = (
  onEdit: (interview: Interview) => void,
  onDelete: (id: string) => void,
  onOnboard: (interview: Interview) => void
): ColumnDef<Interview>[] => {
  return [
    {
      accessorKey: "candidateName",
      header: "Candidate",
      cell: ({ row }) => (
        <div className="flex flex-col">
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
        <span className="text-sm text-slate-500">{row.original.interviewDate}</span>
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
          <div className="flex items-center gap-2">
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
  onEdit,
  onDelete,
  onOnboard,
}: InterviewTableProps) {
  const columns = React.useMemo(
    () => getInterviewColumns(onEdit, onDelete, onOnboard),
    [onEdit, onDelete, onOnboard]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      totalItems={data.length}
      pageCount={1}
      pagination={{ pageIndex: 0, pageSize: 10 }}
      onPaginationChange={() => {}}
      onSortingChange={() => {}}
      searchKey="candidateName"
      searchPlaceholder="Search candidate..."
      searchValue=""
      onSearchChange={() => {}}
      showSrNo={true}
    />
  )
}
