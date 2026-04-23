"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FuelForm, FuelFormValues } from "./fuel-form"
import { useCreateFuelMutation } from "@/hooks/queries/use-fuel"

interface AddFuelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: () => void
}

export function AddFuelDialog({ open, onOpenChange, onAdd }: AddFuelDialogProps) {
  const createMutation = useCreateFuelMutation()

  const onSubmit = async (data: FuelFormValues) => {
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity),
        pricePerUnit: Number(data.pricePerUnit),
        totalAmount: Number(data.totalAmount),
        odometerReading: Number(data.odometerReading),
      }
      await createMutation.mutateAsync(payload)
      onOpenChange(false)
      onAdd?.()
    } catch {
      // error handled in service
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[24px] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#0d4c3a] to-[#0f5c47] p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black italic">Log Fuel Expense</DialogTitle>
            <p className="text-teal-300/70 text-xs font-medium mt-1">Record a new fuel refill for a vehicle</p>
          </DialogHeader>
        </div>
        <div className="p-6 bg-white">
          <FuelForm onSubmit={onSubmit} isLoading={createMutation.isPending} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
