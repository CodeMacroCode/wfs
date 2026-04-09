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
import { AssetType, AssetStatus, CreateAssetDto } from "@/types/asset"

const formSchema = z.object({
  name: z.string().min(2, "Asset name is required"),
  type: z.enum(["Laptop", "Safety Gear", "Specialized Tool", "Uniform", "Mobile Device", "Other"] as const),
  serialNumber: z.string().min(2, "Serial number is required"),
  issuedTo: z.string().min(2, "Employee name is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  status: z.enum(["Issued", "Returned", "Under Maintenance", "Damaged"] as const),
  nextMaintenanceDate: z.string().min(1, "Maintenance date is required"),
})

interface AssetFormProps {
  initialValues?: Partial<CreateAssetDto>
  onSubmit: (data: any) => void
  isLoading?: boolean
  isEdit?: boolean
}

export function AssetForm({ 
  initialValues, 
  onSubmit, 
  isLoading,
  isEdit = false 
}: AssetFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      type: initialValues?.type || "Other",
      serialNumber: initialValues?.serialNumber || "",
      issuedTo: initialValues?.issuedTo || "",
      issueDate: initialValues?.issueDate || new Date().toISOString().split('T')[0],
      status: initialValues?.status || "Issued",
      nextMaintenanceDate: initialValues?.nextMaintenanceDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issueDate"
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="nextMaintenanceDate"
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-[#1e293b] hover:bg-[#334155] text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Asset" : "Issue Asset"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
