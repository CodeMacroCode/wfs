"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InterviewStatus } from "@/types/recruitment"

const formSchema = z.object({
  candidateName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact must be at least 10 digits"),
  appliedPosition: z.string().min(2, "Position is required"),
  selectionStatus: z.enum(["Pending", "Interview", "Selected", "Not Selected", "Rejected"] as const),
  interviewDate: z.string().min(1, "Date is required"),
  interviewerName: z.string().min(2, "Interviewer name is required"),
  interviewerFeedback: z.string().optional(),
  experience: z.string().optional(),
  currentCTC: z.string().optional(),
  expectedCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.string().optional(),
})

export type InterviewFormValues = z.infer<typeof formSchema>

interface InterviewFormProps {
  initialValues?: Partial<InterviewFormValues>
  onSubmit: (data: InterviewFormValues, resumes: File[]) => void
  isLoading?: boolean
  isEdit?: boolean
}

const STATUS_OPTIONS: InterviewStatus[] = ["Pending", "Interview", "Selected", "Not Selected", "Rejected"]

export function InterviewForm({
  initialValues,
  onSubmit,
  isLoading,
  isEdit = false,
}: InterviewFormProps) {
  const [resumes, setResumes] = React.useState<File[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: initialValues?.candidateName ?? "",
      email: initialValues?.email ?? "",
      contactNumber: initialValues?.contactNumber ?? "",
      appliedPosition: initialValues?.appliedPosition ?? "",
      selectionStatus: initialValues?.selectionStatus ?? "Pending",
      interviewDate: initialValues?.interviewDate ?? new Date().toISOString().split("T")[0],
      interviewerName: initialValues?.interviewerName ?? "",
      interviewerFeedback: initialValues?.interviewerFeedback ?? "",
      experience: initialValues?.experience ?? "",
      currentCTC: initialValues?.currentCTC ?? "",
      expectedCTC: initialValues?.expectedCTC ?? "",
      noticePeriod: initialValues?.noticePeriod ?? "",
      skills: initialValues?.skills ?? "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumes((prev) => [...prev, ...Array.from(e.target.files!)])
    }
    // reset so same file can be re-selected if removed
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setResumes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (values: InterviewFormValues) => {
    onSubmit(values, resumes)
  }

  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest"
  const inputClass = "h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-teal-500/30"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">

        {/* Candidate Info */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Candidate Info</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="candidateName" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Full Name</FormLabel>
                <FormControl><Input placeholder="Rahul Sharma" className={inputClass} {...field} /></FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Email</FormLabel>
                <FormControl><Input placeholder="rahul@example.com" className={inputClass} {...field} /></FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="contactNumber" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Contact Number</FormLabel>
                <FormControl><Input placeholder="9876543210" className={inputClass} {...field} /></FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="appliedPosition" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Applied Position</FormLabel>
                <FormControl><Input placeholder="Frontend Developer" className={inputClass} {...field} /></FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Interview Details */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Interview Details</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="interviewDate" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Interview Date</FormLabel>
                <FormControl><Input type="date" className={inputClass} {...field} /></FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="selectionStatus" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="interviewerName" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Interviewer</FormLabel>
                <FormControl><Input placeholder="John Doe" className={inputClass} {...field} /></FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="interviewerFeedback" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Feedback</FormLabel>
              <FormControl>
                <Textarea placeholder="Interview feedback notes..." className="rounded-xl border-slate-200 bg-slate-50/50 text-sm resize-none min-h-[72px] focus-visible:ring-teal-500/30" {...field} />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
        </div>

        {/* Profile / CTC */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Profile & CTC</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="experience" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Experience</FormLabel>
                <FormControl><Input placeholder="2 Years" className={inputClass} {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="noticePeriod" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Notice Period</FormLabel>
                <FormControl><Input placeholder="30 Days" className={inputClass} {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="currentCTC" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Current CTC</FormLabel>
                <FormControl><Input placeholder="5 LPA" className={inputClass} {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="expectedCTC" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Expected CTC</FormLabel>
                <FormControl><Input placeholder="8 LPA" className={inputClass} {...field} /></FormControl>
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="skills" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Skills</FormLabel>
              <FormControl><Input placeholder="React, Next.js, MongoDB" className={inputClass} {...field} /></FormControl>
            </FormItem>
          )} />
        </div>

        {/* Resume Upload — only on create */}
        {!isEdit && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Resumes / Documents</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl p-4 flex flex-col items-center gap-2 text-slate-400 hover:text-teal-600 transition-all"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs font-bold">Click to upload files</span>
              <span className="text-[10px] text-slate-300">PDF, DOC, PNG, JPG</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            {resumes.length > 0 && (
              <div className="flex flex-col gap-2">
                {resumes.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                    <FileText className="h-4 w-4 text-teal-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-600 flex-1 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#2eb88a] hover:bg-[#259b74] text-white font-bold rounded-xl px-6 h-10 shadow-md shadow-emerald-500/20"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : isEdit ? "Update" : "Log Interview"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
