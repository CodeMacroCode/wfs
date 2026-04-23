"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fuelFormSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  vehicleName: z.string().min(1, "Vehicle name is required"),
  date: z.string().min(1, "Date is required"),
  fuelType: z.enum(["Petrol", "Diesel", "CNG", "Electric"]),
  quantity: z.string().min(1, "Quantity is required"),
  pricePerUnit: z.string().min(1, "Price per unit is required"),
  totalAmount: z.string().min(1, "Total amount is required"),
  odometerReading: z.string().min(1, "Odometer reading is required"),
  remarks: z.string().optional(),
})

export type FuelFormValues = z.infer<typeof fuelFormSchema>

interface FuelFormProps {
  onSubmit: (data: FuelFormValues) => void
  isLoading?: boolean
  initialValues?: Partial<FuelFormValues>
}

export function FuelForm({ onSubmit, isLoading, initialValues }: FuelFormProps) {
  const form = useForm<FuelFormValues>({
    resolver: zodResolver(fuelFormSchema),
    defaultValues: {
      vehicleId: "",
      vehicleName: "",
      date: new Date().toISOString().substring(0, 10),
      fuelType: "Diesel",
      quantity: "",
      pricePerUnit: "",
      totalAmount: "",
      odometerReading: "",
      remarks: "",
      ...initialValues,
    },
  })

  // Auto-calculate total amount
  const quantity = useWatch({ control: form.control, name: "quantity" })
  const price = useWatch({ control: form.control, name: "pricePerUnit" })
  
  React.useEffect(() => {
    if (quantity && price) {
      const total = parseFloat(quantity) * parseFloat(price)
      if (!isNaN(total)) {
        form.setValue("totalAmount", total.toFixed(2))
      }
    }
  }, [quantity, price, form.setValue, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle ID/Plate</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. MH12AB1234" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Tata Tiago" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity (L/Kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricePerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price/Unit</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="rounded-xl border-slate-200 bg-slate-50 h-11 font-black text-emerald-600" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="odometerReading"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Odometer Reading (KM)</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remarks (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Full tank refill" {...field} className="rounded-xl border-slate-200 focus:border-[#2eb88a] focus:ring-[#2eb88a]/20 h-11 font-bold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#2eb88a] hover:bg-[#259b74] h-12 rounded-xl font-bold shadow-lg shadow-emerald-500/20 mt-4"
        >
          {isLoading ? "Saving..." : "Log Fuel Expense"}
        </Button>
      </form>
    </Form>
  )
}
