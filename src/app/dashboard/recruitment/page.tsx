"use client"

import * as React from "react"
import { Download, Users, Clock, CheckCircle2, XCircle, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Interview } from "@/types/recruitment"
import { InterviewTable } from "@/components/recruitment/interview-table"
import { AddInterviewDialog, EditInterviewDialog, OnboardEmployeeDialog } from "@/components/recruitment/interview-dialogs"
import { useRecruitmentQuery, useDeleteRecruitmentMutation } from "@/hooks/queries/use-recruitment"
import { useDebounce } from "@/hooks/use-debounce"
import { PaginationState } from "@tanstack/react-table"

export default function RecruitmentPage() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingInterview, setEditingInterview] = React.useState<Interview | null>(null)
  const [onboardingInterview, setOnboardingInterview] = React.useState<Interview | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 400)

  const { data, isLoading } = useRecruitmentQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
  })
  const deleteMutation = useDeleteRecruitmentMutation()

  const interviews = data?.data || []
  const stats = data?.stats
  const total = data?.pagination?.total || 0

  const statCards = [
    { label: "Total Candidates", value: stats?.totalCandidates ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Interview Scheduled", value: stats?.interviewScheduled ?? 0, icon: CalendarCheck, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Pending", value: stats?.pending ?? 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Selected", value: stats?.selected ?? 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ]

  return (
    <div className="flex flex-col gap-8 p-2 md:p-8 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight italic font-heading text-[#2eb88a]">
            Recruitment & Onboarding
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Track candidate interviews and streamline their onboarding to the labor directory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" className="gap-2 text-slate-600 border-slate-200 rounded-xl h-10">
            <Download className="h-4 w-4" />
            Export
          </Button> */}
          <Button
            className="bg-[#2eb88a] hover:bg-[#259b74] gap-2 text-white shadow-md shadow-emerald-500/20 rounded-xl h-10 px-5 font-bold"
            onClick={() => setIsAddOpen(true)}
          >
            Log Interview
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4 border-none shadow-sm flex items-center gap-3">
            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl shrink-0`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 text-center">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <InterviewTable
        data={interviews}
        isLoading={isLoading}
        totalItems={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val)
          setPagination((p) => ({ ...p, pageIndex: 0 })) // reset to page 1 on new search
        }}
        onEdit={setEditingInterview}
        onDelete={(id) => {
          if (confirm("Are you sure you want to delete this candidate record?")) {
            deleteMutation.mutate(id)
          }
        }}
        onOnboard={setOnboardingInterview}
      />

      <AddInterviewDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={() => {}}
      />

      <EditInterviewDialog
        interview={editingInterview}
        open={!!editingInterview}
        onOpenChange={(open) => !open && setEditingInterview(null)}
        onUpdate={() => {}}
      />

      <OnboardEmployeeDialog
        interview={onboardingInterview}
        open={!!onboardingInterview}
        onOpenChange={(open) => !open && setOnboardingInterview(null)}
      />
    </div>
  )
}