"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RoasterForm } from "./roaster-form"
import { useAssignAttendancePolicyMutation } from "@/hooks/queries/use-roster"
import { AssignRosterDto } from "@/types/roster"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/query-keys"

interface RoasterDialogProps {
  trigger?: React.ReactNode
}

export function RoasterDialog({ trigger }: RoasterDialogProps) {
  const [open, setOpen] = React.useState(false)
  const assignMutation = useAssignAttendancePolicyMutation()
  const queryClient = useQueryClient()

  const onSubmit = async (data: AssignRosterDto) => {
    try {
      await assignMutation.mutateAsync({
        userIds: data.employeeIds,
        attendancePolicyId: data.shiftId
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rosters.all })
      setOpen(false)
    } catch {
      // Error handled by mutation toast or service
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#2eb88a] hover:bg-[#259b74] text-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm transition-all active:scale-95 border-none">
            <Plus className="h-4 w-4" />
            Assign Roster
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 italic font-heading">Assign Roster</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Select employees, a shift, and a date range to assign a roster.
          </DialogDescription>
        </DialogHeader>
        <RoasterForm 
          onSubmit={onSubmit} 
          isLoading={assignMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  )
}
