"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  FileText,
  ExternalLink,
  Edit,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecruitmentByIdQuery } from "@/hooks/queries/use-recruitment"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { EditInterviewDialog, OnboardEmployeeDialog } from "@/components/recruitment/interview-dialogs"

export default function RecruitmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isOnboardOpen, setIsOnboardOpen] = React.useState(false)

  const { data: interview, isLoading } = useRecruitmentByIdQuery(id as string)

  if (isLoading) {
    return <RecruitmentDetailSkeleton />
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-slate-900">Candidate not found</h2>
        <Button onClick={() => router.back()}>Back to List</Button>
      </div>
    )
  }

  const statusColors = {
    "Selected": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Not Selected": "bg-rose-50 text-rose-700 border-rose-200",
    "Rejected": "bg-rose-50 text-rose-700 border-rose-200",
    "Pending": "bg-amber-50 text-amber-700 border-amber-200",
    "Interview": "bg-blue-50 text-blue-700 border-blue-200",
  }

  return (
    <div className="flex flex-col gap-6 p-2 md:p-8 bg-slate-50/30 min-h-screen">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="gap-2 text-slate-500 hover:text-slate-900 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recruitment
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2 border-slate-200 rounded-xl h-10 px-4"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
          {interview.status === "Selected" && (
            <Button 
              className="bg-[#2eb88a] hover:bg-[#259b74] gap-2 text-white shadow-md shadow-emerald-500/20 rounded-xl h-10 px-4 font-bold"
              onClick={() => setIsOnboardOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Onboard Candidate
            </Button>
          )}
        </div>
      </div>

      {/* Main Profile Header */}
      <Card className="p-6 md:p-8 border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#2eb88a]" />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#2eb88a] border border-emerald-100/50 shadow-inner">
            <User className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic font-heading">
                {interview.candidateName}
              </h1>
              <Badge variant="outline" className={cn("rounded-full px-4 py-1 font-bold uppercase text-[10px] tracking-widest", statusColors[interview.status as keyof typeof statusColors])}>
                {interview.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                {interview.position}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                {interview.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                {interview.contact}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Details */}
          <Card className="p-6 border-none shadow-sm bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              Interview Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interview Date</p>
                  <p className="text-sm font-bold text-slate-700">
                    {interview.interviewDate ? format(new Date(interview.interviewDate), "PPPP") : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Interviewer</p>
                  <p className="text-sm font-bold text-slate-700">{interview.interviewer}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate ID</p>
                  <p className="text-sm font-bold text-slate-700">#{interview.id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added On</p>
                  <p className="text-sm font-bold text-slate-700">{format(new Date(interview.createdAt), "MMM d, yyyy")}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Interviewer Feedback
              </p>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {interview.feedback ? `"${interview.feedback}"` : "No feedback provided yet."}
                </p>
              </div>
            </div>
          </Card>

          {/* Metadata & Expectations */}
          <Card className="p-6 border-none shadow-sm bg-white">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
              Metadata & Expectations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current CTC</p>
                <p className="text-sm font-bold text-slate-700">{interview.metadata?.currentCTC || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected CTC</p>
                <p className="text-sm font-bold text-emerald-600">{interview.metadata?.expectedCTC || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                <p className="text-sm font-bold text-slate-700">{interview.metadata?.experience || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-slate-700">{interview.metadata?.location || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notice Period</p>
                <p className="text-sm font-bold text-amber-600">{interview.metadata?.noticePeriod || "—"}</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {interview.metadata?.skills ? interview.metadata.skills.split(',').map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-3 font-bold text-[10px]">
                    {skill.trim()}
                  </Badge>
                )) : <span className="text-xs italic text-slate-400">No skills listed</span>}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Documents */}
        <div className="space-y-6">
          {/* Resumes / Documents */}
          <Card className="p-6 border-none shadow-sm bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Attached Documents
            </h3>
            {interview.resumes && interview.resumes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {interview.resumes.map((resume, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-100">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                          {resume.split('/').pop()?.split('-').slice(1).join('-') || `Document_${idx + 1}`}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight italic">Candidate CV</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600" asChild>
                      <a href={resume} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No documents attached</p>
              </div>
            )}
          </Card>

          {/* Next Steps Card */}
          <Card className="p-6 border-none shadow-sm bg-white bg-gradient-to-br from-emerald-600 to-emerald-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="h-24 w-24" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Next Steps</h3>
            {interview.status === "Selected" ? (
              <div className="space-y-4">
                <p className="text-sm font-bold leading-tight">Candidate is selected. Proceed with onboarding to the labor directory.</p>
                <Button 
                  className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl h-12"
                  onClick={() => setIsOnboardOpen(true)}
                >
                  Onboard Now
                </Button>
              </div>
            ) : interview.status === "Rejected" ? (
              <div className="space-y-4">
                <p className="text-sm font-bold leading-tight">Record archived. No further actions required.</p>
                <Badge className="bg-white/20 text-white border-none font-bold">Closed</Badge>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-bold leading-tight">Evaluation in progress. Update status after final review.</p>
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-400 font-bold rounded-xl h-12 shadow-inner shadow-black/10"
                  onClick={() => setIsEditOpen(true)}
                >
                  Update Status
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <EditInterviewDialog
        interview={interview}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={() => {}}
      />

      <OnboardEmployeeDialog
        interview={interview}
        open={isOnboardOpen}
        onOpenChange={setIsOnboardOpen}
      />
    </div>
  )
}

function RecruitmentDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-2 md:p-8 bg-slate-50/30 min-h-screen">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  )
}
