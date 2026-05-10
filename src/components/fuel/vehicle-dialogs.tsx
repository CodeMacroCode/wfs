"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateVehicleMutation, useUpdateVehicleMutation } from "@/hooks/queries/use-vehicles"

const vehicleFormSchema = z.object({
  vehicleNo: z.string().min(1, "Vehicle number is required"),
  vehicleCode: z.string().min(1, "Vehicle code is required"),
})

type VehicleFormValues = z.infer<typeof vehicleFormSchema>

interface VehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  mode: "add" | "edit"
  initialValues?: Partial<VehicleFormValues>
  vehicleId?: string
}

export function VehicleDialog({ open, onOpenChange, onSuccess, mode, initialValues, vehicleId }: VehicleDialogProps) {
  const createMutation = useCreateVehicleMutation()
  const updateMutation = useUpdateVehicleMutation()
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicleNo: "",
      vehicleCode: "",
    },
  })

  React.useEffect(() => {
    if (open && initialValues) {
      form.reset({
        vehicleNo: initialValues.vehicleNo || "",
        vehicleCode: initialValues.vehicleCode || "",
      })
    } else if (open && mode === "add") {
      form.reset({
        vehicleNo: "",
        vehicleCode: "",
      })
    }
  }, [open, initialValues, mode, form])

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      if (mode === "edit" && vehicleId) {
        await updateMutation.mutateAsync({ id: vehicleId, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch {
      // Error handled by service toast
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="vehicleNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input placeholder="MP04AB1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Code</FormLabel>
                  <FormControl>
                    <Input placeholder="VH001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-[#2eb88a] hover:bg-[#26a67a] text-white"
              >
                {isPending ? (mode === "edit" ? "Updating..." : "Adding...") : (mode === "edit" ? "Update Vehicle" : "Add Vehicle")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
