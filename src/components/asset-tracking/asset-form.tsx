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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateAssetDto } from "@/types/asset"
import { Employee } from "@/types/employee"

import { Textarea } from "@/components/ui/textarea"
import { EmployeeSelect } from "@/components/employee/employee-select"

const formSchema = z.object({
  name: z.string().min(2, "Asset name is required"),
  type: z.enum(["Laptop", "Safety Gear", "Specialized Tool", "Uniform", "Mobile Device", "Electronics", "Other"] as const),
  serialNumber: z.string().min(2, "Serial number is required"),
  issuedTo: z.string().min(1, "Employee is required"),
  issuedDate: z.string().min(1, "Issue date is required"),
  status: z.enum(["Issued", "Returned", "Under Maintenance", "Damaged"] as const),
  maintenanceDueDate: z.string().min(1, "Maintenance date is required"),
  extraNote: z.string().optional(),
})

interface AssetFormProps {
  initialValues?: Partial<CreateAssetDto>
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading?: boolean
  isEdit?: boolean
}

export function AssetForm({ 
  initialValues, 
  onSubmit, 
  isLoading,
  isEdit = false 
}: AssetFormProps) {
  const [now] = React.useState(() => Date.now())

  const defaultValues = React.useMemo(() => ({
    name: initialValues?.name || "",
    type: initialValues?.type || "Other",
    serialNumber: initialValues?.serialNumber || "",
    issuedTo: typeof initialValues?.issuedTo === "object" && initialValues.issuedTo !== null
      ? (initialValues.issuedTo as Employee)._id || (initialValues.issuedTo as Employee).id || ""
      : initialValues?.issuedTo || "",
    issuedDate: initialValues?.issuedDate ? initialValues.issuedDate.split('T')[0] : new Date(now).toISOString().split('T')[0],
    status: initialValues?.status || "Issued",
    maintenanceDueDate: initialValues?.maintenanceDueDate ? initialValues.maintenanceDueDate.split('T')[0] : new Date(now + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    extraNote: initialValues?.extraNote || "",
  }), [initialValues, now])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Re-sync form if initialValues change (important for edit mode)
  React.useEffect(() => {
    if (initialValues) {
      form.reset(defaultValues)
    }
  }, [initialValues, defaultValues, form])

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Convert dates to ISO format for backend if needed
    const payload = {
      ...data,
      issuedDate: new Date(data.issuedDate).toISOString(),
      maintenanceDueDate: new Date(data.maintenanceDueDate).toISOString(),
    }
    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input placeholder="MacBook Pro / Dell Latitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Safety Gear">Safety Gear</SelectItem>
                    <SelectItem value="Specialized Tool">Specialized Tool</SelectItem>
                    <SelectItem value="Uniform">Uniform</SelectItem>
                    <SelectItem value="Mobile Device">Mobile Device</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number / ID</FormLabel>
                <FormControl>
                  <Input placeholder="SN12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="issuedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued To (Employee)</FormLabel>
                <FormControl>
                  <EmployeeSelect 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)} 
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
            name="issuedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Issued">Issued</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maintenanceDueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Maintenance Due</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Note</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about the asset..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-[#1e293b] hover:bg-[#334155] text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Asset" : "Issue Asset"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
