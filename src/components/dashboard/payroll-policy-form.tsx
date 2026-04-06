"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CreatePayrollPolicyDto } from "@/types/payroll-policy"

const formSchema = z.object({
  name: z.string().min(2, "Policy name must be at least 2 characters"),
  sundayPolicyActive: z.boolean(),
  heads: z.object({
    basic: z.number().min(0).max(100),
    hra: z.number().min(0).max(100),
    conveyance: z.number().min(0).max(100),
    pfEmployee: z.number().min(0).max(100),
    pfEmployer: z.number().min(0).max(100),
    esiEmployee: z.number().min(0).max(100),
    esiEmployer: z.number().min(0).max(100),
    lwfEmployee: z.number().min(0),
    lwfEmployer: z.number().min(0),
    overtimeHourlyRate: z.number().min(0),
  }),
})

type FormValues = z.infer<typeof formSchema>

interface PayrollPolicyFormProps {
  initialValues?: Partial<CreatePayrollPolicyDto>
  onSubmit: (data: CreatePayrollPolicyDto) => void
  isLoading?: boolean
  isEdit?: boolean
}

export function PayrollPolicyForm({ 
  initialValues,
  onSubmit, 
  isLoading,
  isEdit = false
}: PayrollPolicyFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      sundayPolicyActive: initialValues?.sundayPolicyActive ?? true,
      heads: {
        basic: initialValues?.heads?.basic ?? 0,
        hra: initialValues?.heads?.hra ?? 40,
        conveyance: initialValues?.heads?.conveyance ?? 5,
        pfEmployee: initialValues?.heads?.pfEmployee ?? 12,
        pfEmployer: initialValues?.heads?.pfEmployer ?? 12,
        esiEmployee: initialValues?.heads?.esiEmployee ?? 0.75,
        esiEmployer: initialValues?.heads?.esiEmployer ?? 3.25,
        lwfEmployee: initialValues?.heads?.lwfEmployee ?? 0,
        lwfEmployer: initialValues?.heads?.lwfEmployer ?? 0,
        overtimeHourlyRate: initialValues?.heads?.overtimeHourlyRate ?? 0,
      },
    },
  })

  const handleSubmit = (values: FormValues) => {
    onSubmit(values as CreatePayrollPolicyDto)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy Name</FormLabel>
              <FormControl>
                <Input placeholder="Standard Policy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sundayPolicyActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Sunday Policy Active</FormLabel>
                <FormDescription>
                  Enable special payroll rules for Sundays.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium border-b pb-2">Earnings (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heads.basic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basic (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heads.hra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HRA (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heads.conveyance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conveyance (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-sm font-medium border-b pb-2 pt-2">Provident Fund (PF) (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heads.pfEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee PF (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heads.pfEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company PF (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-sm font-medium border-b pb-2 pt-2">ESI (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heads.esiEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ESI (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heads.esiEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company ESI (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-sm font-medium border-b pb-2 pt-2">Other Heads & Overtime (₹)</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heads.lwfEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LWF Employee (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heads.lwfEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LWF Company (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="heads.overtimeHourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overtime Hourly Rate (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value}
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
