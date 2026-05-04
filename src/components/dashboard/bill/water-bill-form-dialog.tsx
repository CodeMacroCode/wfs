"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  CloudUpload, 
  X, 
  Plus, 
  Droplets, 
  Building2, 
  Calendar as CalendarIcon, 
  CreditCard,
  History,
  Zap,
  Gauge,
  Calculator,
  Percent
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useUploadDocMutation } from "@/hooks/queries/use-doc-center"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format, parseISO, isValid } from "date-fns"
import { WaterBillMetadata } from "@/types/water-bill"

const waterBillSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  billDate: z.string().optional(),
  dueDate: z.string().optional(),
  billFrom: z.string().optional(),
  billTo: z.string().optional(),
  isFromAverage: z.boolean().optional(),
  isToAverage: z.boolean().optional(),
  connectionSize: z.string().optional(),
  billPeriod: z.string().optional(),
  oldReading: z.string().optional(),
  newReading: z.string().optional(),
  actualReading: z.string().optional(),
  unit: z.string().optional(),
  costPerUnit: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  currentWaterCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  maintenanceCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  sewerageCess: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  sewerageCessPercentage: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  meterRentals: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  garbageCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  sundryCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  arrears: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  totalAmount: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  adjPrevBill: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  mcTax: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  latePaymentSurcharge: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  paidAmount: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  paidOn: z.string().optional(),
  paidUnitRate: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  unitRemarks: z.string().optional(),
  remarks: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
})

type WaterBillFormValues = z.infer<typeof waterBillSchema>

interface WaterBillFormDialogProps {
  trigger?: React.ReactNode
  defaultAccountName?: string
  defaultAccountNumber?: string
  initialData?: WaterBillMetadata
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputClass =
  "rounded-xl border-slate-200 focus-visible:ring-blue-500 h-11 font-medium text-sm transition-all"

const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-tight mb-1"

// Blocks negative numbers and 'e' in number inputs
const blockNegativeKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "-" || e.key === "e" || e.key === "E") {
    e.preventDefault()
  }
}

// ── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-5 mt-2">
      <span className="text-blue-500">{icon}</span>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
  )
}

// ── Charge Field ──────────────────────────────────────────────────────────────
function ChargeField({
  name,
  label,
  control,
  highlight,
  disabled,
  prefix = "₹",
}: {
  name: keyof WaterBillFormValues
  label: string
  control: ReturnType<typeof useForm<WaterBillFormValues>>["control"]
  highlight?: "blue" | "green" | "amber"
  disabled?: boolean
  prefix?: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(labelClass, disabled && "opacity-50")}>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{prefix}</span>
              <Input
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.00"
                {...field}
                disabled={disabled}
                onKeyDown={blockNegativeKeys}
                value={(field.value as string) ?? ""}
                className={cn(
                  inputClass,
                  "pl-7",
                  highlight === "blue" && "bg-blue-50/50 border-blue-200 text-blue-700 font-bold",
                  highlight === "green" && "bg-emerald-50/50 border-emerald-200 text-emerald-700 font-bold",
                  highlight === "amber" && "bg-amber-50/50 border-amber-200 text-amber-700 font-bold"
                )}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ── Date Picker Field ─────────────────────────────────────────────────────────
function DatePickerField({
  name,
  label,
  control,
  placeholder = "Pick a date",
  className,
  disabled,
}: {
  name: keyof WaterBillFormValues
  label: string
  control: ReturnType<typeof useForm<WaterBillFormValues>>["control"]
  placeholder?: string
  className?: string
  disabled?: boolean
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={cn(labelClass, disabled && "opacity-50")}>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  disabled={disabled}
                  className={cn(
                    "w-full pl-3 text-left font-normal h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-colors",
                    !field.value && "text-muted-foreground",
                    className
                  )}
                >
                  {field.value && isValid(parseISO(field.value as string)) ? (
                    format(parseISO(field.value as string), "PPP")
                  ) : (
                    <span className="text-sm">{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={field.value && isValid(parseISO(field.value as string)) ? parseISO(field.value as string) : undefined}
                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                startMonth={new Date(2000, 0)}
                endMonth={new Date(new Date().getFullYear() + 5, 0)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Helper to safely parse strings to numbers (Clamped to 0)
const safeParse = (val: string | number | undefined | null) => {
  if (val === undefined || val === null || val === "") return 0;
  const parsed = parseFloat(String(val))
  return Math.max(0, isNaN(parsed) ? 0 : parsed)
}

// ── Main Dialog ───────────────────────────────────────────────────────────────
export function WaterBillFormDialog({
  trigger,
  defaultAccountName = "",
  defaultAccountNumber = "",
  initialData,
}: WaterBillFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadDocMutation()

  const form = useForm<WaterBillFormValues>({
    resolver: zodResolver(waterBillSchema),
    defaultValues: {
      accountName: initialData?.accountName || defaultAccountName,
      accountNumber: initialData?.accountNumber || defaultAccountNumber,
      billDate: "",
      dueDate: "",
      billFrom: "",
      billTo: "",
      isFromAverage: false,
      isToAverage: false,
      connectionSize: "",
      billPeriod: "",
      oldReading: initialData?.newReading || "",
      newReading: "",
      actualReading: "",
      unit: "",
      costPerUnit: "",
      currentWaterCharges: "",
      maintenanceCharges: "",
      sewerageCess: "",
      sewerageCessPercentage: "30",
      meterRentals: "",
      garbageCharges: "",
      sundryCharges: "",
      arrears: "",
      totalAmount: "",
      adjPrevBill: "",
      mcTax: "",
      latePaymentSurcharge: "",
      paidAmount: "",
      paidOn: "",
      paidUnitRate: "",
      unitRemarks: "",
      remarks: "",
      files: [],
    },
  })

  // Destructure watched values for reactivity
  const watchedOldReading = useWatch({ control: form.control, name: "oldReading" })
  const watchedNewReading = useWatch({ control: form.control, name: "newReading" })
  const watchedUnit = useWatch({ control: form.control, name: "unit" })
  const watchedConnSize = useWatch({ control: form.control, name: "connectionSize" })
  const watchedWaterCharges = useWatch({ control: form.control, name: "currentWaterCharges" })
  const watchedSeweragePercentage = useWatch({ control: form.control, name: "sewerageCessPercentage" })
  const watchedMaintenance = useWatch({ control: form.control, name: "maintenanceCharges" })
  const watchedSewerageCess = useWatch({ control: form.control, name: "sewerageCess" })
  const watchedMeterRental = useWatch({ control: form.control, name: "meterRentals" })
  const watchedGarbage = useWatch({ control: form.control, name: "garbageCharges" })
  const watchedSundry = useWatch({ control: form.control, name: "sundryCharges" })
  const watchedArrears = useWatch({ control: form.control, name: "arrears" })
  const watchedTotal = useWatch({ control: form.control, name: "totalAmount" })
  const watchedPaid = useWatch({ control: form.control, name: "paidAmount" })
  const watchedMcTax = useWatch({ control: form.control, name: "mcTax" })
  const watchedLatePayment = useWatch({ control: form.control, name: "latePaymentSurcharge" })
  const watchedAdjPrevBill = useWatch({ control: form.control, name: "adjPrevBill" })
  const watchedIsFromAvg = useWatch({ control: form.control, name: "isFromAverage" })
  const watchedIsToAvg = useWatch({ control: form.control, name: "isToAverage" })
  const watchedFiles = useWatch({ control: form.control, name: "files" })

  const selectedFiles = watchedFiles ?? []

  const lastCalcUnitRef = React.useRef<string>("")
  const lastCalcChargesRef = React.useRef<string>("")
  const lastCalcSewerageRef = React.useRef<string>("")
  const lastCalcTotalRef = React.useRef<string>("")
  const lastCalcPaidRateRef = React.useRef<string>("")

  // 1. Auto-calculate UNIT = New Reading - Old Reading
  React.useEffect(() => {
    const oldR = safeParse(watchedOldReading)
    const newR = safeParse(watchedNewReading)
    if (watchedNewReading || watchedOldReading) {
      const calculated = Math.max(0, newR - oldR).toString()
      if (calculated !== lastCalcUnitRef.current) {
        form.setValue("unit", calculated)
        lastCalcUnitRef.current = calculated
      }
    }
  }, [watchedOldReading, watchedNewReading, form])

  // 2. Auto-calculate CURRENT WATER CHARGES = Conn. Size * UNIT
  React.useEffect(() => {
    const u = safeParse(watchedUnit)
    const sizeStr = watchedConnSize?.replace(/[^0-9.]/g, '') || "0"
    const size = safeParse(sizeStr)
    
    if (u > 0 && size > 0) {
      const calculated = (u * size).toFixed(2)
      if (calculated !== lastCalcChargesRef.current) {
        form.setValue("currentWaterCharges", calculated)
        lastCalcChargesRef.current = calculated
      }
    }
  }, [watchedUnit, watchedConnSize, form])

  // 3. Auto-calculate SEWERAGE CESS = Water Charges * Percentage
  React.useEffect(() => {
    const wc = safeParse(watchedWaterCharges)
    const pct = safeParse(watchedSeweragePercentage)
    
    if (wc > 0 && pct > 0) {
      const calculated = (wc * (pct / 100)).toFixed(2)
      if (calculated !== lastCalcSewerageRef.current) {
        form.setValue("sewerageCess", calculated)
        lastCalcSewerageRef.current = calculated
      }
    }
  }, [watchedWaterCharges, watchedSeweragePercentage, form])

  // 4. Auto-calculate TOTAL AMOUNT
  React.useEffect(() => {
    const sum = Math.max(0, (
      safeParse(watchedWaterCharges) +
      safeParse(watchedMaintenance) +
      safeParse(watchedSewerageCess) +
      safeParse(watchedMeterRental) +
      safeParse(watchedGarbage) +
      safeParse(watchedSundry) +
      safeParse(watchedArrears) +
      safeParse(watchedLatePayment) +
      safeParse(watchedMcTax) -
      safeParse(watchedAdjPrevBill)
    )).toFixed(2)

    if (sum !== lastCalcTotalRef.current) {
      form.setValue("totalAmount", sum)
      lastCalcTotalRef.current = sum
    }
  }, [
    watchedWaterCharges,
    watchedMaintenance,
    watchedSewerageCess,
    watchedMeterRental,
    watchedGarbage,
    watchedSundry,
    watchedArrears,
    watchedLatePayment,
    watchedMcTax,
    watchedAdjPrevBill,
    form
  ])

  // 5. Auto-calculate Effective Rate (UNIT in Totals Section) = (Paid || Total) / UNIT
  React.useEffect(() => {
    const paid = safeParse(watchedPaid)
    const total = safeParse(watchedTotal)
    const u = safeParse(watchedUnit)
    
    // We use either Paid Amount or Total Amount as the base for the rate calculation
    const baseValue = paid > 0 ? paid : total

    if (u > 0 && baseValue > 0) {
      const calculated = (baseValue / u).toFixed(4)
      if (calculated !== lastCalcPaidRateRef.current) {
        form.setValue("paidUnitRate", calculated)
        lastCalcPaidRateRef.current = calculated
      }
    } else {
      if (lastCalcPaidRateRef.current !== "0.0000") {
        form.setValue("paidUnitRate", "0.0000")
        lastCalcPaidRateRef.current = "0.0000"
      }
    }
  }, [watchedPaid, watchedTotal, watchedUnit, form])

  // 6. Sync Cost Per Unit badge value to form state
  React.useEffect(() => {
    const cpu = ((safeParse(watchedWaterCharges) / safeParse(watchedUnit || "1")) || 0).toFixed(2)
    if (cpu !== lastCalcChargesRef.current + "_cpu") { // using a dummy suffix for ref check or just sync
      form.setValue("costPerUnit", cpu)
    }
  }, [watchedWaterCharges, watchedUnit, form])

  const onSubmit = async (values: WaterBillFormValues) => {
    try {
      const { files, accountName: acctName, accountNumber, ...restMeta } = values
      
      // Ensure booleans are actually booleans
      const metadata = {
        ...restMeta,
        accountName: acctName,
        accountNumber,
        isFromAverage: String(restMeta.isFromAverage) === "true",
        isToAverage: String(restMeta.isToAverage) === "true",
      }

      const title = `Water Bill – ${acctName || "Account"} – ${
        values.billDate || new Date().toLocaleDateString("en-IN")
      }`
      await uploadMutation.mutateAsync({
        title,
        documentType: "Water",
        files: files && files.length > 0 ? files : [],
        metadata,
      })
      toast.success("Water bill saved successfully!")
      setOpen(false)
      form.reset()
    } catch {
      toast.error("Failed to save water bill")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    if (newFiles.length > 0) {
      const current = form.getValues("files") ?? []
      form.setValue("files", [...current, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const current = form.getValues("files") ?? []
    form.setValue(
      "files",
      current.filter((_, i) => i !== index)
    )
  }

  const setFullAverage = () => {
    form.setValue("isFromAverage", true)
    form.setValue("isToAverage", true)
    form.setValue("billFrom", "")
    form.setValue("billTo", "")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4" />
            Add Water Bill
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[850px] p-0 max-h-[95vh] overflow-hidden flex flex-col rounded-2xl border-none shadow-2xl">
        <div className="bg-slate-900 px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-xl font-black">
              <Droplets className="h-5 w-5 text-blue-400" />
              Water Bill Entry
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm font-medium">
              Fill in all fields from the water bill. Fields with * are required.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 py-8 space-y-10">
              {/* Account Section */}
              <section>
                <SectionTitle icon={<Building2 className="h-4 w-4" />} title="Account Info" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Account Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Main Office" {...field} value={field.value ?? ""} className={inputClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Connection ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. WC-0012" {...field} value={field.value ?? ""} className={inputClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Dates & Period Section */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <SectionTitle icon={<CalendarIcon className="h-4 w-4" />} title="Dates & Period" />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={setFullAverage}
                    className="h-8 text-[10px] font-black uppercase tracking-widest border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg flex items-center gap-1.5"
                  >
                    <Zap className="h-3 w-3" />
                    Mark Full Average
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <DatePickerField control={form.control} name="billDate" label="Bill Date" placeholder="Pick date" />
                  <DatePickerField control={form.control} name="dueDate" label="Due Date" placeholder="Pick date" className="border-rose-100" />
                  
                  <div className="space-y-3">
                    <DatePickerField 
                      control={form.control} 
                      name="billFrom" 
                      label="Bill From" 
                      placeholder="Start" 
                      disabled={watchedIsFromAvg}
                    />
                    <FormField
                      control={form.control}
                      name="isFromAverage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 shadow-sm transition-colors hover:bg-amber-100">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-[10px] font-black text-amber-700 uppercase tracking-tighter cursor-pointer">
                            Avg From
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <DatePickerField 
                      control={form.control} 
                      name="billTo" 
                      label="Bill To" 
                      placeholder="End" 
                      disabled={watchedIsToAvg}
                    />
                     <FormField
                      control={form.control}
                      name="isToAverage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 shadow-sm transition-colors hover:bg-amber-100">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-[10px] font-black text-amber-700 uppercase tracking-tighter cursor-pointer">
                            Avg To
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sub-section for Consumption Details */}
                <div className="mt-8">
                  <SectionTitle icon={<Gauge className="h-4 w-4" />} title="Consumption Details" />
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <FormField
                      control={form.control}
                      name="connectionSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Conn. Size</FormLabel>
                          <FormControl>
                            <Input placeholder='e.g. 15mm' {...field} value={field.value ?? ""} className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Bill Period (Months)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              placeholder='0' 
                              {...field} 
                              onKeyDown={blockNegativeKeys}
                              value={field.value ?? ""} 
                              className={inputClass} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="oldReading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Old Reading</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              onKeyDown={blockNegativeKeys}
                              placeholder="0" 
                              {...field} 
                              value={field.value ?? ""} 
                              className={inputClass} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newReading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>New Reading</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              onKeyDown={blockNegativeKeys}
                              placeholder="0" 
                              {...field} 
                              value={field.value ?? ""} 
                              className={inputClass} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>UNIT</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              onKeyDown={blockNegativeKeys}
                              placeholder="0" 
                              {...field} 
                              value={field.value ?? ""} 
                              className={cn(inputClass, "font-black text-blue-600 bg-blue-50/30")} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* Financials Section */}
              <section>
                <div className="flex items-center justify-between mb-5">
                   <SectionTitle icon={<CreditCard className="h-4 w-4" />} title="Financials" />
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                        <Calculator className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Cost Per Unit:</span>
                        <span className="text-sm font-black text-blue-700">₹{((safeParse(watchedWaterCharges) / safeParse(watchedUnit || "1")) || 0).toFixed(2)}</span>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
                  <ChargeField control={form.control} name="currentWaterCharges" label="CURRENT WATER CHARGES" />
                  <ChargeField control={form.control} name="maintenanceCharges" label="Maintenance charges" />
                  
                  {/* Sewerage Cess with Percentage Input */}
                  <div className="col-span-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                       <FormLabel className={labelClass}>Sewerage Cess</FormLabel>
                       <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <Percent className="h-2.5 w-2.5 text-slate-400" />
                          <input 
                            type="number" 
                            min="0"
                            onKeyDown={blockNegativeKeys}
                            {...form.register("sewerageCessPercentage")}
                            className="w-8 bg-transparent text-[10px] font-black text-slate-600 outline-none border-none p-0 h-auto"
                          />
                       </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="sewerageCess"
                      render={({ field }) => (
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onKeyDown={blockNegativeKeys}
                              value={(field.value as string) ?? ""}
                              className={cn(inputClass, "pl-7")}
                            />
                          </div>
                        </FormControl>
                      )}
                    />
                  </div>

                  <ChargeField control={form.control} name="meterRentals" label="Meter Rental" />
                  <ChargeField control={form.control} name="garbageCharges" label="GARBAGE CHARGES" />
                  <ChargeField control={form.control} name="sundryCharges" label="SUNDRY CHARGES" />
                  <ChargeField control={form.control} name="arrears" label="Arrears" />
                </div>
              </section>

              {/* Totals Section */}
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <SectionTitle icon={<History className="h-4 w-4" />} title="Final Totals & Payment" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <ChargeField control={form.control} name="totalAmount" label="Total Amount" highlight="blue" />
                  <ChargeField control={form.control} name="latePaymentSurcharge" label="LATE PAYMENT SURCHARGE" />
                  <ChargeField control={form.control} name="adjPrevBill" label="ADJ PREV BILL" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                   <ChargeField control={form.control} name="mcTax" label="MC Tax" />
                   <ChargeField control={form.control} name="paidUnitRate" label="UNIT" highlight="amber" prefix="₹" />
                   <FormField
                    control={form.control}
                    name="actualReading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Actual Reading</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            onKeyDown={blockNegativeKeys}
                            placeholder="0" 
                            {...field} 
                            value={field.value ?? ""} 
                            className={inputClass} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200/60">
                  <ChargeField control={form.control} name="paidAmount" label="Paid Amount" highlight="green" />
                  <DatePickerField control={form.control} name="paidOn" label="Paid On" placeholder="Pick date" />
                </div>
              </section>

              {/* Upload & Remarks */}
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <FormLabel className={labelClass}>Attach Document</FormLabel>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" multiple />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <CloudUpload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Click to upload bill</p>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">
                            <span className="truncate flex-1">{file.name}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-rose-500" onClick={() => removeFile(idx)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Remarks / Notes</FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Add notes..."
                            {...field}
                            value={field.value ?? ""}
                            className="w-full h-[100px] rounded-xl border border-slate-200 p-4 text-sm font-medium focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} className="font-bold text-slate-500">
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={uploadMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8"
          >
            {uploadMutation.isPending ? "Saving..." : "Save Water Bill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
