"use client"

import * as React from "react"
import { CheckCircle2, XCircle, Loader2, AlertTriangle, User, Calendar, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUpdateLeaveMutation } from "@/hooks/queries/use-leave"
import { Leave } from "@/types/leave"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface LeaveStatusDialogProps {
  leave: Leave | null
  status: 'Approved' | 'Rejected' | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeaveStatusDialog({ leave, status, open, onOpenChange }: LeaveStatusDialogProps) {
  const updateStatusMutation = useUpdateLeaveMutation()
  const [reason, setReason] = React.useState("")
  const [isPaid, setIsPaid] = React.useState(false)

  const isReject = status === 'Rejected'
  const isApprove = status === 'Approved'

  const handleConfirm = async () => {
    if (!leave || !status) return

    try {
      await updateStatusMutation.mutateAsync({
        id: leave._id,
        data: {
          status,
          isPaid: isApprove ? isPaid : false,
          rejectionReason: isReject ? reason : undefined
        }
      })
      onOpenChange(false)
      setReason("")
      setIsPaid(false)
    } catch (error) {
      // Error handled in hook
    }
  }

  if (!leave) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[28px] bg-white">
        <div className={cn(
          "h-2 w-full",
          isApprove ? "bg-emerald-500" : "bg-rose-500"
        )} />
        
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-4 mb-4">
             <div className={cn(
               "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border",
               isApprove ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
             )}>
               {isApprove ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
             </div>
             <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 italic font-heading">
                  {isApprove ? "Approve Leave" : "Reject Leave"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  {isApprove ? "Confirm leave approval for the employee." : "Provide a reason for rejecting this leave."}
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="px-8 py-4 space-y-6">
          {/* Summary Card */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100 italic font-black text-xs text-[#2eb88a]">
                {leave.userId?.name.charAt(0) || <User className="h-4 w-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 italic">{leave.userId?.name || "System Record"}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {leave.employeeId}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Period</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Calendar className="h-3 w-3 text-slate-300" />
                  {format(new Date(leave.fromDate), "dd MMM")} — {format(new Date(leave.toDate), "dd MMM")}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Type</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <FileText className="h-3 w-3 text-slate-300" />
                  {leave.leaveType}
                </div>
              </div>
            </div>
          </div>

          {isApprove && (
            <div className="flex items-center space-x-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
              <Checkbox 
                id="isPaid" 
                checked={isPaid} 
                onCheckedChange={(checked) => setIsPaid(!!checked)}
                className="rounded-md border-emerald-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="isPaid" className="text-sm font-bold text-emerald-800 cursor-pointer">
                  Mark as Paid Leave
                </Label>
                <p className="text-[11px] text-emerald-600 font-medium">
                  This will count towards the employee's paid leave balance.
                </p>
              </div>
            </div>
          )}

          {isReject && (
            <div className="space-y-3">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Rejection Reason</Label>
              <Textarea
                placeholder="Ex: Insufficient leave balance, Critical project deadline..."
                className="min-h-[100px] rounded-2xl border-slate-200 focus:ring-rose-500/20 resize-none bg-slate-50/50"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <p className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium italic">
                <AlertTriangle className="h-3 w-3" />
                This reason will be visible to the employee.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-8 pt-4 flex gap-3 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={updateStatusMutation.isPending}
            className="text-slate-400 font-bold hover:bg-slate-50 transition-all px-6 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={updateStatusMutation.isPending || (isReject && !reason.trim())}
            className={cn(
              "px-8 rounded-xl font-bold transition-all shadow-lg",
              isApprove 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20",
              "scale-105 active:scale-95"
            )}
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              isApprove ? "Confirm Approval" : "Confirm Rejection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
