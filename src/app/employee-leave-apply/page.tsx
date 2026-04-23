"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar as CalendarIcon, Phone, FileText, Send, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import apiClient from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const leaveFormSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(12, "Invalid phone number"),
  fromDate: z.string().min(1, "Start date is required"),
  toDate: z.string().min(1, "End date is required"),
  leaveType: z.string().min(1, "Leave type is required"),
  reason: z.string().min(5, "Please provide a reason (min 5 chars)"),
})

type LeaveFormValues = z.infer<typeof leaveFormSchema>

export default function ApplyForLeavePage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      phone: "",
      fromDate: new Date().toISOString().substring(0, 10),
      toDate: new Date().toISOString().substring(0, 10),
      leaveType: "Sick Leave",
      reason: "",
    },
  })

  const onSubmit = async (values: LeaveFormValues) => {
    setIsLoading(true)
    try {
      const payload = {
        phone: Number(values.phone),
        fromDate: values.fromDate,
        toDate: values.toDate,
        leaveType: values.leaveType,
        reason: values.reason,
      }

      await apiClient.post("/leave", payload)
      toast.success("Leave application submitted successfully!")
      form.reset()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || err?.message || "Failed to submit leave application"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col items-center p-6 md:p-10">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-xl flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-white shadow-sm hover:bg-slate-50 transition-colors h-10 w-10"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <h1 className="text-xl md:text-2xl font-black italic text-slate-900 tracking-tight">Apply for Leave</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <Card className="w-full max-w-md md:max-w-xl border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden mb-10 shrink-0">
        <div className="bg-gradient-to-br from-[#2eb88a] to-[#1e8a66] p-6 md:p-8 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg shrink-0">
              <CalendarIcon className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-tight">Leave Request</h2>
              <p className="text-emerald-50/80 text-xs md:text-sm font-medium mt-1 max-w-[240px] md:max-w-sm">Submit your time-off request for approval.</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                      <Phone className="h-3 w-3 text-[#2eb88a]" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter registered phone" 
                        {...field} 
                        type="tel"
                        className="rounded-xl border-slate-100 bg-slate-50/50 h-12 md:h-14 px-5 focus:border-[#2eb88a] focus:ring-[#2eb88a]/10 font-bold text-base transition-all" 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">From Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full rounded-xl border-slate-100 bg-slate-50/50 h-12 md:h-14 px-5 focus:border-[#2eb88a] focus:ring-[#2eb88a]/10 font-bold text-left",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-slate-100" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            disabled={(date) => date < new Date("1900-01-01")}
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
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">To Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full rounded-xl border-slate-100 bg-slate-50/50 h-12 md:h-14 px-5 focus:border-[#2eb88a] focus:ring-[#2eb88a]/10 font-bold text-left",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-slate-100" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            disabled={(date) => {
                              const fromDate = form.getValues("fromDate");
                              return date < new Date("1900-01-01") || (!!fromDate && date < new Date(fromDate));
                            }}
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Leave Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 h-12 md:h-14 px-5 focus:border-[#2eb88a] focus:ring-[#2eb88a]/10 font-bold transition-all text-left">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl p-1">
                        {["Sick Leave", "Casual Leave","Maternity Leave", "Paternity Leave"].map((type) => (
                          <SelectItem key={type} value={type} className="font-bold py-2 rounded-lg focus:bg-emerald-50 focus:text-emerald-700">{type}</SelectItem>
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                      <FileText className="h-3 w-3 text-[#2eb88a]" />
                      Reason
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe why you are taking leave..." 
                        {...field} 
                        className="rounded-2xl border-slate-100 bg-slate-50/50 min-h-[100px] p-5 focus:border-[#2eb88a] focus:ring-[#2eb88a]/10 font-medium text-sm leading-relaxed resize-none transition-all" 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#2eb88a] hover:bg-[#259b74] h-14 md:h-16 rounded-2xl font-black text-base text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </Card>

      <div className="pb-10 text-center shrink-0">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Powered by Workforce Sync • v1.0
        </p>
      </div>
    </div>
  )
}