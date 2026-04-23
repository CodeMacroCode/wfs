"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InterviewForm, InterviewFormValues } from "./interview-form"
import { Interview } from "@/types/recruitment"
import { EmployeeForm } from "@/components/employee/employee-form"
import { RegisterEmployeeDto } from "@/types/employee"
import { toast } from "sonner"
import { useCreateRecruitmentMutation, useUpdateRecruitmentMutation } from "@/hooks/queries/use-recruitment"

interface AddInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: () => void
}

export function AddInterviewDialog({ open, onOpenChange, onAdd }: AddInterviewDialogProps) {
  const createMutation = useCreateRecruitmentMutation()

  const onSubmit = async (data: InterviewFormValues, resumes: File[]) => {
    const formData = new FormData()
    formData.append("candidateName", data.candidateName)
    formData.append("email", data.email)
    formData.append("contactNumber", data.contactNumber)
    formData.append("appliedPosition", data.appliedPosition)
    formData.append("selectionStatus", data.selectionStatus)
    formData.append("interviewDate", data.interviewDate)
    formData.append("interviewerName", data.interviewerName)
    if (data.interviewerFeedback) formData.append("interviewerFeedback", data.interviewerFeedback)
    if (data.experience)    formData.append("experience", data.experience)
    if (data.currentCTC)    formData.append("currentCTC", data.currentCTC)
    if (data.expectedCTC)   formData.append("expectedCTC", data.expectedCTC)
    if (data.noticePeriod)  formData.append("noticePeriod", data.noticePeriod)
    if (data.skills)        formData.append("skills", data.skills)
    resumes.forEach((file) => formData.append("resumes", file))

    try {
      await createMutation.mutateAsync(formData)
      onOpenChange(false)
      onAdd?.()
    } catch {
      // error toast handled in service
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-[24px] border-none shadow-2xl p-0">
        <div className="bg-gradient-to-br from-[#0d4c3a] to-[#0f5c47] p-6 rounded-t-[24px]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black italic">Log New Interview</DialogTitle>
            <p className="text-teal-300/70 text-xs font-medium mt-1">Add a candidate to the recruitment pipeline</p>
          </DialogHeader>
        </div>
        <div className="p-6">
          <InterviewForm onSubmit={onSubmit} isLoading={createMutation.isPending} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface EditInterviewDialogProps {
  interview: Interview | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

export function EditInterviewDialog({ interview, open, onOpenChange, onUpdate }: EditInterviewDialogProps) {
  const updateMutation = useUpdateRecruitmentMutation()
  
  if (!interview) return null

  // Map Interview (normalized type) → InterviewFormValues (API field names)
  const prefill: Partial<InterviewFormValues> = {
    candidateName:      interview.candidateName,
    email:              interview.email,
    contactNumber:      interview.contact,           // contact → contactNumber
    appliedPosition:    interview.position,          // position → appliedPosition
    selectionStatus:    interview.status as InterviewFormValues["selectionStatus"],     // status → selectionStatus
    interviewDate:      interview.interviewDate
                          ? interview.interviewDate.substring(0, 10)  // ISO → YYYY-MM-DD
                          : "",
    interviewerName:    interview.interviewer,       // interviewer → interviewerName
    interviewerFeedback: interview.feedback ?? "",   // feedback → interviewerFeedback
    // Flatten metadata
    experience:   interview.metadata?.experience   ?? "",
    currentCTC:   interview.metadata?.currentCTC   ?? "",
    expectedCTC:  interview.metadata?.expectedCTC  ?? "",
    noticePeriod: interview.metadata?.noticePeriod ?? "",
    skills:       interview.metadata?.skills ?? "",
  }

  const onSubmit = async (data: InterviewFormValues) => {
    try {
      // Map form values back to API expected keys
      const apiData = {
        candidateName: data.candidateName,
        email: data.email,
        contactNumber: data.contactNumber,
        appliedPosition: data.appliedPosition,
        selectionStatus: data.selectionStatus,
        interviewDate: data.interviewDate,
        interviewerName: data.interviewerName,
        interviewerFeedback: data.interviewerFeedback,
        experience: data.experience,
        currentCTC: data.currentCTC,
        expectedCTC: data.expectedCTC,
        noticePeriod: data.noticePeriod,
        skills: data.skills,
      }

      await updateMutation.mutateAsync({ id: interview.id, data: apiData })
      onOpenChange(false)
      onUpdate?.()
    } catch {
      // error handled in service
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-[24px] border-none shadow-2xl p-0">
        <div className="bg-gradient-to-br from-[#0d4c3a] to-[#0f5c47] p-6 rounded-t-[24px]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black italic">Edit Interview Details</DialogTitle>
            <p className="text-teal-300/70 text-xs font-medium mt-1">Update candidate information</p>
          </DialogHeader>
        </div>
        <div className="p-6">
          <InterviewForm
            initialValues={prefill}
            onSubmit={onSubmit}
            isEdit={true}
            isLoading={updateMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface OnboardEmployeeDialogProps {
  interview: Interview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OnboardEmployeeDialog({ interview, open, onOpenChange }: OnboardEmployeeDialogProps) {
  if (!interview) return null

  const onSubmit = (data: RegisterEmployeeDto | FormData) => {
    console.log("Onboarding data:", data)
    const name = data instanceof FormData ? data.get("name") : data.name
    toast.success(`${name} has been onboarded to Labor Directory!`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Onboard as New Employee</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-slate-500">
          Transferring candidate <strong>{interview.candidateName}</strong> to employee records.
        </div>
        <EmployeeForm
          initialValues={{
            name: interview.candidateName,
            email: interview.email,
            mobileNo: interview.contact,
            designation: interview.position,
            doj: interview.interviewDate,
            currentAddress: interview.metadata?.location || "",
            reference: "Recruitment Pipeline",
            previousWorkExperience: interview.metadata?.experience 
              ? [{ company: "Previous Company", role: interview.position, years: interview.metadata.experience }] 
              : [],
            role: "user",
          }}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
