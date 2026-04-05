"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AttendancePolicyForm } from "./attendance-policy-form"
import { 
  useCreateAttendancePolicyMutation,
  useUpdateAttendancePolicyMutation,
  useDeleteAttendancePolicyMutation
} from "@/hooks/queries/use-attendance-policies"
import { AttendancePolicy, CreateAttendancePolicyDto } from "@/types/attendance-policy"

export function AttendancePolicyDialog() {
  const [open, setOpen] = React.useState(false)
  const { mutate: create, isPending } = useCreateAttendancePolicyMutation()

  const onSubmit = (data: CreateAttendancePolicyDto) => {
    create(data, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#2eb88a] hover:bg-[#259b74] text-white cursor-pointer px-5 rounded-xl h-10 shadow-sm transition-all active:scale-95 flex gap-2">
          <Plus className="h-4 w-4" />
          <span className="font-semibold text-sm">Add Policy</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[28px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold italic font-heading">Create New Attendance Policy</DialogTitle>
        </DialogHeader>
        <AttendancePolicyForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  )
}

interface EditAttendancePolicyDialogProps {
  policy: AttendancePolicy | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAttendancePolicyDialog({ policy, open, onOpenChange }: EditAttendancePolicyDialogProps) {
  const { mutate: update, isPending } = useUpdateAttendancePolicyMutation()

  if (!policy) return null

  const onSubmit = (data: CreateAttendancePolicyDto) => {
    update(
      { id: policy._id, data },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[28px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold italic font-heading">Edit Attendance Policy</DialogTitle>
        </DialogHeader>
        <AttendancePolicyForm
          initialValues={{
            name: policy.name,
            shiftInTime: policy.shiftInTime,
            shiftOutTime: policy.shiftOutTime,
            overtimeThresholdMins: policy.overtimeThresholdMins,
            overtimeHourlyRate: policy.overtimeHourlyRate,
          }}
          onSubmit={onSubmit}
          isLoading={isPending}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  )
}

interface DeleteAttendancePolicyDialogProps {
  policyId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAttendancePolicyDialog({ policyId, open, onOpenChange }: DeleteAttendancePolicyDialogProps) {
  const { mutate: deletePolicy, isPending } = useDeleteAttendancePolicyMutation()

  const onDelete = () => {
    if (!policyId) return
    deletePolicy(policyId, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[28px] border-none shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold italic font-heading">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 font-medium pt-2">
            This action cannot be undone. This will permanently delete the attendance
            policy and remove all associated rules from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-6">
          <AlertDialogCancel disabled={isPending} className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onDelete()
            }}
            className="bg-destructive text-white hover:bg-destructive/90 rounded-xl px-6"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Policy"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
