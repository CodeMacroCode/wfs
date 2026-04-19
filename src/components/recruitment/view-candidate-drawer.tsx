"use client"

import * as React from "react"
import { X, Mail, Phone, Briefcase, Calendar, User, MessageSquare, FileText, MapPin, Clock, DollarSign, GraduationCap, ExternalLink } from "lucide-react"
import { Interview } from "@/types/recruitment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface ViewCandidateDrawerProps {
  interview: Interview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    Selected:       { label: "Selected",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    "Not Selected": { label: "Not Selected",className: "bg-rose-50 text-rose-700 border-rose-200" },
    Interview:      { label: "Interview",   className: "bg-violet-50 text-violet-700 border-violet-200" },
    Pending:        { label: "Pending",     className: "bg-amber-50 text-amber-700 border-amber-200" },
    Rejected:       { label: "Rejected",    className: "bg-red-50 text-red-700 border-red-200" },
  }
  const config = map[status] ?? { label: status, className: "bg-slate-50 text-slate-600 border-slate-200" }
  return (
    <Badge variant="outline" className={`rounded-full px-3 text-xs font-bold ${config.className}`}>
      {config.label}
    </Badge>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-semibold text-slate-700 break-words">{value}</span>
      </div>
    </div>
  )
}

export function ViewCandidateDrawer({ interview, open, onOpenChange }: ViewCandidateDrawerProps) {
  if (!interview) return null

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
      : undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] p-0 overflow-y-auto border-none shadow-2xl bg-white"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#0d4c3a] via-[#0f5c47] to-[#0a3628] p-8 pb-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(45,212,191,0.15)_0%,_transparent_60%)]" />
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all z-10"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-2xl font-black text-white">
              {interview.candidateName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{interview.candidateName}</h2>
              <p className="text-[#2dd4bf] font-semibold text-sm mt-0.5">{interview.position}</p>
            </div>
            <StatusBadge status={interview.status} />
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* Contact */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact</h3>
            <div className="rounded-2xl bg-slate-50/70 px-4 py-1">
              <InfoRow icon={Mail}  label="Email"   value={interview.email} />
              <InfoRow icon={Phone} label="Phone"   value={interview.contact} />
              <InfoRow icon={MapPin} label="Location" value={interview.metadata?.location} />
            </div>
          </section>

          {/* Interview */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Interview Details</h3>
            <div className="rounded-2xl bg-slate-50/70 px-4 py-1">
              <InfoRow icon={Calendar} label="Interview Date"  value={formatDate(interview.interviewDate)} />
              <InfoRow icon={User}     label="Interviewer"     value={interview.interviewer} />
            </div>
          </section>

          {/* Financials & Experience */}
          {interview.metadata && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Profile</h3>
              <div className="rounded-2xl bg-slate-50/70 px-4 py-1">
                <InfoRow icon={GraduationCap} label="Experience"      value={interview.metadata.experience} />
                <InfoRow icon={DollarSign}    label="Current CTC"     value={interview.metadata.currentCTC} />
                <InfoRow icon={DollarSign}    label="Expected CTC"    value={interview.metadata.expectedCTC} />
                <InfoRow icon={Clock}         label="Notice Period"   value={interview.metadata.noticePeriod} />
              </div>
            </section>
          )}

          {/* Feedback */}
          {interview.feedback && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Interviewer Feedback</h3>
              <div className="rounded-2xl bg-slate-50/70 p-4 flex gap-3">
                <MessageSquare className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{interview.feedback}</p>
              </div>
            </section>
          )}

          {/* Resumes */}
          {interview.resumes && interview.resumes.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resumes / Documents</h3>
              <div className="flex flex-col gap-2">
                {interview.resumes.map((url, i) => (
                  <a
                    key={i}
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 transition-all group"
                  >
                    <FileText className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-teal-700 flex-1 truncate">
                      Document {i + 1}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-500" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Applied Date */}
          <div className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-2 pb-4 border-t border-slate-100">
            Applied {formatDate(interview.createdAt)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
