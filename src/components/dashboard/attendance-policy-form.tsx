"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { CreateAttendancePolicyDto } from "@/types/attendance-policy"

const formSchema = z.object({
  name: z.string().min(2, "Policy name must be at least 2 characters"),
  shiftInTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:MM)"),
  shiftOutTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:MM)"),
  overtimeThresholdMins: z.number().min(0, "Threshold must be at least 0"),
  overtimeHourlyRate: z.number().min(0, "Hourly rate must be at least 0"),
})



interface AttendancePolicyFormProps {
  initialValues?: Partial<CreateAttendancePolicyDto>
  onSubmit: (data: CreateAttendancePolicyDto) => void
  isLoading?: boolean
  isEdit?: boolean
}

export function AttendancePolicyForm({
  initialValues,
  onSubmit,
  isLoading,
  isEdit = false
}: AttendancePolicyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      shiftInTime: initialValues?.shiftInTime || "09:00",
      shiftOutTime: initialValues?.shiftOutTime || "18:00",
      overtimeThresholdMins: initialValues?.overtimeThresholdMins ?? 30,
      overtimeHourlyRate: initialValues?.overtimeHourlyRate ?? 100,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift Name</FormLabel>
              <FormControl>
                <Input placeholder="General Shift" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shiftInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift In Time (HH:MM)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shiftOutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shift Out Time (HH:MM)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="overtimeThresholdMins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buffer Time (Mins)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overtimeHourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OT Hourly Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-[#2eb88a] hover:bg-[#259b74]" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Policy" : "Create Policy"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
