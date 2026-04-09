"use client"

import * as React from "react"
import { Search, Plus, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Interview, CreateInterviewDto } from "@/types/recruitment"
import { InterviewTable } from "@/components/recruitment/interview-table"
import { AddInterviewDialog, EditInterviewDialog, OnboardEmployeeDialog } from "@/components/recruitment/interview-dialogs"

const DUMMY_INTERVIEWS: Interview[] = [
  {
    id: "1",
    candidateName: "John Doe",
    email: "john@example.com",
    contact: "+1 234 567 8901",
    position: "Senior React Developer",
    interviewDate: "2024-04-12",
    interviewer: "Sarah Conners",
    feedback: "Strong technical background, good culture fit.",
    status: "Selected",
    createdAt: "2024-04-01T10:00:00Z",
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    email: "jane@example.com",
    contact: "+1 987 654 3210",
    position: "Product Designer",
    interviewDate: "2024-04-15",
    interviewer: "Mike Ross",
    feedback: "Portfolio is impressive, but needs to work on collaborative tools.",
    status: "Pending",
    createdAt: "2024-04-05T14:30:00Z",
  },
  {
    id: "3",
    candidateName: "Alice Johnson",
    email: "alice@example.com",
    contact: "+1 555 123 4567",
    position: "Backend Engineer (Go)",
    interviewDate: "2024-04-10",
    interviewer: "David Miller",
    feedback: "Technically sound but expectations on remote work didn't align.",
    status: "Not Selected",
    createdAt: "2024-03-25T09:15:00Z",
  },
]

export default function RecruitmentPage() {
  const [interviews, setInterviews] = React.useState<Interview[]>(DUMMY_INTERVIEWS)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingInterview, setEditingInterview] = React.useState<Interview | null>(null)
  const [onboardingInterview, setOnboardingInterview] = React.useState<Interview | null>(null)

  const handleAdd = (data: CreateInterviewDto) => {
    const newInterview: Interview = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "Pending",
      createdAt: new Date().toISOString(),
    }
    setInterviews([newInterview, ...interviews])
  }

  const handleUpdate = (id: string, data: Partial<Interview>) => {
    setInterviews(interviews.map(i => i.id === id ? { ...i, ...data } : i))
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this interview record?")) {
      setInterviews(interviews.filter(i => i.id !== id))
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 underline decoration-[#2eb88a] decoration-4 underline-offset-8">
            Recruitment & Onboarding
          </h2>
          <p className="text-sm text-slate-500">
            Track candidate interviews and streamline their onboarding to the labor directory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 text-slate-600 border-slate-200">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            className="bg-[#2eb88a] hover:bg-[#259b74] gap-2 text-white shadow-md shadow-emerald-500/20"
            onClick={() => setIsAddOpen(true)}
          >
            Log Interview
          </Button>
        </div>
      </div>

      
    
        <InterviewTable
          data={interviews}
          onEdit={setEditingInterview}
          onDelete={handleDelete}
          onOnboard={setOnboardingInterview}
        />


      <AddInterviewDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={handleAdd}
      />

      <EditInterviewDialog
        interview={editingInterview}
        open={!!editingInterview}
        onOpenChange={(open) => !open && setEditingInterview(null)}
        onUpdate={handleUpdate}
      />

      <OnboardEmployeeDialog
        interview={onboardingInterview}
        open={!!onboardingInterview}
        onOpenChange={(open) => !open && setOnboardingInterview(null)}
      />
    </div>
  )
}