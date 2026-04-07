"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { PayrollPolicyForm } from "./payroll-policy-form"
import { 
  useCreatePayrollPolicyMutation, 
  useUpdatePayrollPolicyMutation,
  useDeletePayrollPolicyMutation
} from "@/hooks/queries/use-payroll-policies"
import { CreatePayrollPolicyDto, PayrollPolicy } from "@/types/payroll-policy"

interface PayrollPolicyDialogProps {
  policy?: PayrollPolicy
  trigger?: React.ReactNode
}

export function PayrollPolicyDialog({ policy, trigger }: PayrollPolicyDialogProps) {
  const [open, setOpen] = React.useState(false)
  const createMutation = useCreatePayrollPolicyMutation()
  const updateMutation = useUpdatePayrollPolicyMutation()

  const isEdit = !!policy
  const isLoading = createMutation.isPending || updateMutation.isPending

  const onSubmit = async (data: CreatePayrollPolicyDto) => {
    try {
      if (isEdit && policy) {
        await updateMutation.mutateAsync({ id: policy._id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setOpen(false)
    } catch (error) {
      // Error handled by mutation toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#2eb88a] hover:bg-[#259b74] text-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm transition-all active:scale-95 border-none">
            Add Policy
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Payroll Policy" : "Create Payroll Policy"}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the details of your payroll policy here." 
              : "Define new payroll heads and rules for your team."}
          </DialogDescription>
        </DialogHeader>
        <PayrollPolicyForm 
          key={policy?._id || "new-policy"}
          initialValues={policy} 
          onSubmit={onSubmit} 
          isLoading={isLoading} 
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  )
}

interface DeletePayrollPolicyDialogProps {
  policyId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePayrollPolicyDialog({ 
  policyId, 
  open, 
  onOpenChange 
}: DeletePayrollPolicyDialogProps) {
  const deleteMutation = useDeletePayrollPolicyMutation()

  const onDelete = async () => {
    if (!policyId) return
    try {
      await deleteMutation.mutateAsync(policyId)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation toast
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the payroll policy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onDelete()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Policy"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

