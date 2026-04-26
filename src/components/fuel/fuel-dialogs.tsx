"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
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
import { Upload, X, FileImage, CalendarIcon } from "lucide-react"
import { useUploadDocMutation, useDocCenterQuery } from "@/hooks/queries/use-doc-center"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const fuelFormSchema = z.object({
  runningDate: z.string().min(1, "Date is required"),
  openingBalance: z.string().optional().refine(val => !val || parseFloat(val) >= 0, "Must be non-negative"),
  petroCardBalance: z.string().optional().refine(val => !val || parseFloat(val) >= 0, "Must be non-negative"),
  vehicleCode: z.string().min(1, "Vehicle code is required"),
  vehicleNo: z.string().min(1, "Vehicle number is required"),
  startKm: z.string().min(1, "Start KM is required").refine(val => parseFloat(val) >= 0, "Must be non-negative"),
  endKm: z.string().min(1, "End KM is required").refine(val => parseFloat(val) >= 0, "Must be non-negative"),
  totalKm: z.string().optional(),
  totalDiesel: z.string().min(1, "Total Diesel is required").refine(val => parseFloat(val) >= 0, "Must be non-negative"),
  ratePerLitre: z.string().min(1, "Rate per litre is required").refine(val => parseFloat(val) >= 0, "Must be non-negative"),
  totalAmount: z.string().optional(),
  averageKm: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
})

export type FuelFormValues = z.infer<typeof fuelFormSchema>

interface AddFuelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: () => void
  initialValues?: Partial<FuelFormValues>
}

export function AddFuelDialog({ open, onOpenChange, onAdd, initialValues }: AddFuelDialogProps) {
  const createMutation = useUploadDocMutation()
  const form = useForm<FuelFormValues>({
    resolver: zodResolver(fuelFormSchema),
    defaultValues: {
      runningDate: new Date().toISOString().substring(0, 10),
      openingBalance: "",
      petroCardBalance: "",
      vehicleCode: "",
      vehicleNo: "",
      startKm: "",
      endKm: "",
      totalKm: "",
      totalDiesel: "",
      ratePerLitre: "",
      totalAmount: "",
      averageKm: "",
      files: [],
      ...initialValues,
    },
  })

  // Update form when initialValues change
  React.useEffect(() => {
    if (open && initialValues) {
      form.reset({
        ...form.getValues(),
        ...initialValues,
      })
    }
  }, [open, initialValues, form])

  // Watch fields for calculations and auto-population
  const vehicleNo = useWatch({ control: form.control, name: "vehicleNo" })
  const startKm = useWatch({ control: form.control, name: "startKm" })
  const endKm = useWatch({ control: form.control, name: "endKm" })
  const totalDiesel = useWatch({ control: form.control, name: "totalDiesel" })
  const ratePerLitre = useWatch({ control: form.control, name: "ratePerLitre" })
  const openingBalance = useWatch({ control: form.control, name: "openingBalance" })

  // Fetch latest global fuel record for opening balance (initial default)
  const { data: globalLatest } = useDocCenterQuery({
    documentType: "Fuel",
    limit: 1,
  })

  // Fetch latest record for the specific vehicle
  const { data: vehicleLatest } = useDocCenterQuery({
    documentType: "Fuel",
    search: vehicleNo,
    limit: 1,
  })

  // Set opening balance from the very latest record globally
  React.useEffect(() => {
    if (open && globalLatest?.data && globalLatest.data.length > 0 && !form.getValues("openingBalance")) {
      const latest = globalLatest.data[0]
      const closingBalance = latest.metadata?.petroCardBalance
      if (closingBalance) {
        form.setValue("openingBalance", String(closingBalance))
      }
    }
  }, [open, globalLatest, form])

  // Set vehicleCode and startKm from the latest record of the same vehicle
  React.useEffect(() => {
    if (vehicleNo && vehicleLatest?.data && vehicleLatest.data.length > 0) {
      const latest = vehicleLatest.data[0]
      // Verify the title actually contains the vehicleNo to avoid false positives from global search
      if (latest.title.toLowerCase().includes(vehicleNo.toLowerCase())) {
        const prevEndKm = latest.metadata?.endKm
        const prevCode = latest.metadata?.vehicleCode
        
        if (prevEndKm) {
          form.setValue("startKm", String(prevEndKm))
        }
        if (prevCode && !form.getValues("vehicleCode")) {
          form.setValue("vehicleCode", String(prevCode))
        }
      }
    }
  }, [vehicleNo, vehicleLatest, form])

  React.useEffect(() => {
    // Calc Total KM
    let tKm = 0
    if (startKm && endKm) {
      const s = parseFloat(startKm)
      const e = parseFloat(endKm)
      if (!isNaN(s) && !isNaN(e)) {
        tKm = Math.max(0, e - s)
        form.setValue("totalKm", tKm.toString())
      }
    } else {
      form.setValue("totalKm", "")
    }

    // Calc Total Amount = Total Diesel * Rate Per Litre
    let tAmount = 0
    if (totalDiesel && ratePerLitre) {
      const d = parseFloat(totalDiesel)
      const r = parseFloat(ratePerLitre)
      if (!isNaN(d) && !isNaN(r)) {
        tAmount = Math.max(0, d * r)
        form.setValue("totalAmount", tAmount.toFixed(2))
      }
    } else {
      form.setValue("totalAmount", "")
    }

    // Calc Closing Balance = Opening Balance - Total Amount
    if (openingBalance && tAmount > 0) {
      const ob = parseFloat(openingBalance)
      if (!isNaN(ob)) {
        const cb = Math.max(0, ob - tAmount)
        form.setValue("petroCardBalance", cb.toFixed(2))
      }
    } else if (openingBalance) {
      const ob = parseFloat(openingBalance)
      if (!isNaN(ob)) {
        form.setValue("petroCardBalance", Math.max(0, ob).toFixed(2))
      }
    }

    // Calc Average/KM = Total KM / Total Diesel
    if (tKm > 0 && totalDiesel) {
      const d = parseFloat(totalDiesel)
      if (!isNaN(d) && d > 0) {
        const avg = Math.max(0, tKm / d)
        form.setValue("averageKm", avg.toFixed(3))
      }
    } else {
      form.setValue("averageKm", "")
    }
  }, [startKm, endKm, totalDiesel, ratePerLitre, openingBalance, form])

  // File handling
  const handleFileDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        const currentFiles = form.getValues("files") || []
        form.setValue("files", [...currentFiles, ...droppedFiles])
      }
    },
    [form]
  )
  const removeFile = (index: number) => {
    const currentFiles = form.getValues("files") || []
    form.setValue("files", currentFiles.filter((_, i) => i !== index))
  }
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files)
      const currentFiles = form.getValues("files") || []
      form.setValue("files", [...currentFiles, ...newFiles])
    }
  }

  const onSubmit = async (data: FuelFormValues) => {
    try {
      const metadata = {
        runningDate: data.runningDate,
        openingBalance: data.openingBalance,
        petroCardBalance: data.petroCardBalance,
        vehicleCode: data.vehicleCode,
        vehicleNo: data.vehicleNo,
        startKm: data.startKm,
        endKm: data.endKm,
        totalKm: data.totalKm,
        totalDiesel: data.totalDiesel,
        ratePerLitre: data.ratePerLitre,
        totalAmount: data.totalAmount,
        averageKm: data.averageKm,
      }

      await createMutation.mutateAsync({
        title: `Fuel - ${data.vehicleNo} - ${data.runningDate}`,
        documentType: "Fuel",
        files: data.files || [],
        metadata,
      })

      toast.success("Fuel record added successfully")
      form.reset()
      onOpenChange(false)
      onAdd?.()
    } catch {
      toast.error("Failed to add fuel record")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Log Fuel Expense</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-8">

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                    1. Basic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="runningDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Running Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date?.toISOString())}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="openingBalance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Balance</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="petroCardBalance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closing Balance (Auto)</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-slate-100 font-semibold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                    2. Vehicle & Readings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vehicleCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 4136" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle No.</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. CH01TC4136" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Kilometers</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Kilometers</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Kilometers (Auto)</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-slate-100 font-semibold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                    3. Fuel & Cost
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalDiesel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Diesel (Ltrs)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ratePerLitre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate Per Litre</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
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
                          <FormLabel>Total Amount (Auto)</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-slate-100 font-semibold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average/KM (Auto)</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-slate-100 font-semibold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                    4. Receipt / Photo
                  </h3>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer relative group"
                  >
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileInput}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Click or drag files here</p>
                        <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {form.watch("files") && form.watch("files")!.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {form.watch("files")!.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200 group">
                          <FileImage className="w-4 h-4 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(i)
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
