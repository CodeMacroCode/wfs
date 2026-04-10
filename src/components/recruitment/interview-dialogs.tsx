"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InterviewForm } from "./interview-form"
import { Interview, CreateInterviewDto } from "@/types/recruitment"
import { EmployeeForm } from "@/components/employee/employee-form"
import { RegisterEmployeeDto } from "@/types/employee"
import { toast } from "sonner"

interface AddInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: CreateInterviewDto) => void
}

export function AddInterviewDialog({ open, onOpenChange, onAdd }: AddInterviewDialogProps) {
  const onSubmit = (data: CreateInterviewDto) => {
    onAdd(data)
    onOpenChange(false)
    toast.success("Interview logged successfully")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Log New Interview</DialogTitle>
        </DialogHeader>
        <InterviewForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

interface EditInterviewDialogProps {
  interview: Interview | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, data: Partial<Interview>) => void
}

export function EditInterviewDialog({ interview, open, onOpenChange, onUpdate }: EditInterviewDialogProps) {
  if (!interview) return null

  const onSubmit = (data: Partial<Interview>) => {
    onUpdate(interview.id, data)
    onOpenChange(false)
    toast.success("Interview updated successfully")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Interview Details</DialogTitle>
        </DialogHeader>
        <InterviewForm
          initialValues={interview}
          onSubmit={onSubmit}
          isEdit={true}
        />
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

  const onSubmit = (data: RegisterEmployeeDto) => {
    console.log("Onboarding data:", data)
    toast.success(`${data.name} has been onboarded to Labor Directory!`)
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
            interviewDate: interview.interviewDate,
            competencyMet: true,
            role: "user",
          }}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
