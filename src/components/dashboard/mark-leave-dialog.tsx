"use client"

import * as React from "react"
import { CalendarIcon, Loader2, X, ClipboardList } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { useEmployeesDropdownInfiniteQuery } from "@/hooks/queries/use-employees-query"
import { useCreateLeaveMutation } from "@/hooks/queries/use-leave"
import { InfiniteScrollSelect } from "@/components/ui/infinite-scroll-select"
import { EmployeeDropdownItem } from "@/types/employee"

const leaveSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  fromDate: z.any().refine((val) => val instanceof Date, "From date is required"),
  toDate: z.any().refine((val) => val instanceof Date, "To date is required"),
  leaveType: z.string().min(1, "Leave type is required"),
  reason: z.string().min(1, "Reason is required"),
})

type LeaveFormValues = z.infer<typeof leaveSchema>

interface MarkLeaveDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const LEAVE_TYPES = [
  "Casual",
  "Sick",
  "Earned",
  "Loss of Pay",
  "Maternity",
  "Paternity",
]

export function MarkLeaveDialog({ trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }: MarkLeaveDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  const {
    data: employeeData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingEmployees
  } = useEmployeesDropdownInfiniteQuery({ search: debouncedSearch }, isOpen)

  const createLeaveMutation = useCreateLeaveMutation()

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      employeeId: "",
      leaveType: "Casual",
      reason: "",
    },
  })

  const onSubmit = async (values: LeaveFormValues) => {
    try {
      await createLeaveMutation.mutateAsync({
        employeeId: values.employeeId,
        fromDate: format(values.fromDate, "yyyy-MM-dd"),
        toDate: format(values.toDate, "yyyy-MM-dd"),
        leaveType: values.leaveType,
        reason: values.reason,
      })
      setIsOpen?.(false)
      form.reset()
    } catch {
      // Error is handled in the mutation hook via toast
    }
  }

  const employeeList = React.useMemo(() =>
    employeeData?.pages.flatMap((page) => page.data) || [],
    [employeeData]
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen?.(open)
      if (!open) form.reset()
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[28px] bg-white/95 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <DialogHeader className="p-8 pb-0 relative z-10">
          <button
            onClick={() => setIsOpen?.(false)}
            className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-all p-2 rounded-xl hover:bg-slate-50 pointer-events-auto z-50"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 italic font-heading">
            Mark Leave
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium pt-1">
            Create a leave request for an employee in the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-5 relative z-10">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Employee</FormLabel>
                  <FormControl>
                    <InfiniteScrollSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      items={employeeList}
                      loadMore={fetchNextPage}
                      hasNextPage={!!hasNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      isLoading={isLoadingEmployees}
                      onSearchChange={setSearchTerm}
                      placeholder="Select employee"
                      getLabel={(emp: EmployeeDropdownItem) => emp.name}
                      getValue={(emp: EmployeeDropdownItem) => emp._id}
                      renderItem={(emp: EmployeeDropdownItem) => (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-700 italic">{emp.name}</span>
                        </div>
                      )}
                      className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-teal-500/20"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">From Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-12 pl-3 text-left font-normal rounded-xl border-slate-200 bg-white/50 hover:bg-white transition-all",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">To Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-12 pl-3 text-left font-normal rounded-xl border-slate-200 bg-white/50 hover:bg-white transition-all",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < form.getValues("fromDate")}
                          initialFocus
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Leave Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-teal-500/20">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      {LEAVE_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="rounded-lg focus:bg-teal-50 italic font-bold text-slate-700">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the reason for leave..."
                      className="min-h-[100px] rounded-xl border-slate-200 bg-white/50 focus:ring-teal-500/20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex gap-3 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen?.(false)}
                disabled={createLeaveMutation.isPending}
                className="text-slate-400 font-bold hover:bg-slate-50 transition-all px-6 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLeaveMutation.isPending}
                className={cn(
                  "px-8 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20",
                  "bg-teal-500 hover:bg-teal-600 text-white scale-105"
                )}
              >
                {createLeaveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Submit Leave
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
