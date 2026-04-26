"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  CloudUpload, 
  Loader2, 
  X, 
  FileText, 
  Plus, 
  Zap, 
  Building2, 
  Calendar as CalendarIcon, 
  CreditCard,
  History,
  Info,
  Gauge,
  Calculator,
  IndianRupee,
  Activity,
  Lightbulb
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useUploadDocMutation } from "@/hooks/queries/use-doc-center"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format, parseISO, isValid } from "date-fns"
import { ElectricityBillMetadata } from "@/types/electricity-bill"

const electricityBillSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  billDate: z.string().optional(),
  dueDate: z.string().optional(),
  billFrom: z.string().optional(),
  billTo: z.string().optional(),
  months: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  connectedLoad: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  contractDemand: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  billPeriod: z.string().optional(),
  oldReadingKwh: z.string().optional(),
  newReadingKwh: z.string().optional(),
  oldReadingKvah: z.string().optional(),
  newReadingKvah: z.string().optional(),
  unitKwh: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  unitKvah: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  kwhKvahDiff: z.string().optional(),
  kwhKvahRatio: z.string().optional(),
  unitPriceBasic: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  consumptionCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  fppca: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  edRate: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  ed: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  fixedCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  powerFactor: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  mcTaxRate: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  mcTax: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  pfIncentive: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  regSurcharge: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  paymentRebate: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  sundryCharges: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  arrears: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  reversalOfArrear: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  totalAmount: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  adjPrevBill: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  acdInt: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  acd: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  lastAcd: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  paidAmount: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  paidOn: z.string().optional(),
  paidUnitRate: z.string().optional().refine(v => !v || parseFloat(v) >= 0, "Cannot be negative"),
  remarks: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
})

type ElectricityBillFormValues = z.infer<typeof electricityBillSchema>

interface ElectricityBillFormDialogProps {
  trigger?: React.ReactNode
  defaultAccountName?: string
  defaultAccountNumber?: string
  initialData?: ElectricityBillMetadata
}

const inputClass = "rounded-xl border-slate-200 focus-visible:ring-blue-500 h-11 font-medium text-sm transition-all"
const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-tight mb-1"

const blockNegativeKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault()
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-5 mt-2">
      <span className="text-blue-500">{icon}</span>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
  )
}

function ChargeField({
  name,
  label,
  control,
  highlight,
  disabled,
  prefix = "₹",
  suffix,
  allowNegative,
}: {
  name: keyof ElectricityBillFormValues
  label: string
  control: any
  highlight?: "blue" | "green" | "amber" | "yellow"
  disabled?: boolean
  prefix?: string
  suffix?: string
  allowNegative?: boolean
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
              {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{prefix}</span>}
              <Input
                type="number"
                step="0.0001"
                {...(allowNegative ? {} : { min: "0", onKeyDown: blockNegativeKeys })}
                placeholder="0.00"
                {...field}
                disabled={disabled}
                value={(field.value as string) ?? ""}
                className={cn(
                  inputClass,
                  prefix && "pl-7",
                  suffix && "pr-8",
                  highlight === "blue" && "bg-blue-50/50 border-blue-200 text-blue-700 font-bold",
                  highlight === "green" && "bg-emerald-50/50 border-emerald-200 text-emerald-700 font-bold",
                  highlight === "amber" && "bg-amber-50/50 border-amber-200 text-amber-700 font-bold",
                  highlight === "yellow" && "bg-yellow-50/50 border-yellow-200 text-yellow-700 font-bold"
                )}
              />
              {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{suffix}</span>}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function DatePickerField({
  name,
  label,
  control,
  placeholder = "Pick a date",
  className,
  disabled,
}: {
  name: keyof ElectricityBillFormValues
  label: string
  control: any
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

const safeParse = (val: any) => {
  if (val === undefined || val === null || val === "") return 0;
  const parsed = parseFloat(val)
  return Math.max(0, isNaN(parsed) ? 0 : parsed)
}

export function ElectricityBillFormDialog({
  trigger,
  defaultAccountName = "",
  defaultAccountNumber = "",
  initialData,
}: ElectricityBillFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const uploadMutation = useUploadDocMutation()

  const form = useForm<ElectricityBillFormValues>({
    resolver: zodResolver(electricityBillSchema),
    defaultValues: {
      accountName: initialData?.accountName || defaultAccountName,
      accountNumber: initialData?.accountNumber || defaultAccountNumber,
      billDate: "",
      dueDate: "",
      billFrom: "",
      billTo: "",
      months: "",
      connectedLoad: "",
      contractDemand: "",
      billPeriod: "",
      oldReadingKwh: initialData?.newReadingKwh || "",
      newReadingKwh: "",
      oldReadingKvah: initialData?.newReadingKvah || "",
      newReadingKvah: "",
      unitKwh: "",
      unitKvah: "",
      kwhKvahDiff: "",
      kwhKvahRatio: "",
      unitPriceBasic: "",
      consumptionCharges: "",
      fppca: "",
      edRate: initialData?.edRate || "0.11",
      ed: "",
      fixedCharges: "",
      powerFactor: "",
      mcTaxRate: initialData?.mcTaxRate || "0.12",
      mcTax: "",
      pfIncentive: "",
      regSurcharge: "",
      paymentRebate: "",
      sundryCharges: "",
      arrears: "",
      reversalOfArrear: "",
      totalAmount: "",
      adjPrevBill: "",
      acdInt: "",
      acd: "",
      lastAcd: "",
      paidAmount: "",
      paidOn: "",
      paidUnitRate: "",
      remarks: "",
      files: [],
    },
  })

  const watchedOldKwh = form.watch("oldReadingKwh")
  const watchedNewKwh = form.watch("newReadingKwh")
  const watchedOldKvah = form.watch("oldReadingKvah")
  const watchedNewKvah = form.watch("newReadingKvah")
  const watchedUnitKwh = form.watch("unitKwh")
  const watchedUnitKvah = form.watch("unitKvah")
  const watchedUnitPriceBasic = form.watch("unitPriceBasic")
  const watchedConsum = form.watch("consumptionCharges")
  const watchedFppca = form.watch("fppca")
  const watchedEdRate = form.watch("edRate")
  const watchedEd = form.watch("ed")
  const watchedFixed = form.watch("fixedCharges")
  const watchedMcTaxRate = form.watch("mcTaxRate")
  const watchedMcTax = form.watch("mcTax")
  const watchedPfInc = form.watch("pfIncentive")
  const watchedRegSurch = form.watch("regSurcharge")
  const watchedRebate = form.watch("paymentRebate")
  const watchedSundry = form.watch("sundryCharges")
  const watchedArrears = form.watch("arrears")
  const watchedRevArr = form.watch("reversalOfArrear")
  const watchedAdj = form.watch("adjPrevBill")
  const watchedAcdInt = form.watch("acdInt")
  const watchedAcd = form.watch("acd")
  const watchedPaid = form.watch("paidAmount")
  const watchedTotal = form.watch("totalAmount")

  // Auto-calculate Unit kWh
  React.useEffect(() => {
    const o = safeParse(watchedOldKwh)
    const n = safeParse(watchedNewKwh)
    if (watchedOldKwh && watchedNewKwh) {
      form.setValue("unitKwh", (Math.max(0, n - o)).toString())
    }
  }, [watchedOldKwh, watchedNewKwh, form])

  // Auto-calculate Unit kVAh
  React.useEffect(() => {
    const o = safeParse(watchedOldKvah)
    const n = safeParse(watchedNewKvah)
    if (watchedOldKvah && watchedNewKvah) {
      form.setValue("unitKvah", (Math.max(0, n - o)).toString())
    }
  }, [watchedOldKvah, watchedNewKvah, form])

  // Auto-calculate kWh/kVAh Diff & Ratio
  React.useEffect(() => {
    const kwh = safeParse(watchedUnitKwh)
    const kvah = safeParse(watchedUnitKvah)
    if (kwh > 0 && kvah > 0) {
      form.setValue("kwhKvahDiff", (kwh - kvah).toFixed(2))
      form.setValue("kwhKvahRatio", ((kwh / kvah) * 100).toFixed(2))
    }
  }, [watchedUnitKwh, watchedUnitKvah, form])

  // Auto-calculate Consumption Charges
  React.useEffect(() => {
    const kwh = safeParse(watchedUnitKwh)
    const unitPrice = safeParse(watchedUnitPriceBasic)
    if (kwh > 0 && unitPrice > 0) {
      form.setValue("consumptionCharges", (kwh * unitPrice).toFixed(2))
    }
  }, [watchedUnitKwh, watchedUnitPriceBasic, form])

  // Auto-calculate ED
  React.useEffect(() => {
    const kwh = safeParse(watchedUnitKwh)
    const rate = safeParse(watchedEdRate)
    if (kwh > 0 && rate > 0) {
      form.setValue("ed", (kwh * rate).toFixed(2))
    }
  }, [watchedUnitKwh, watchedEdRate, form])

  // Auto-calculate MC Tax
  React.useEffect(() => {
    const kwh = safeParse(watchedUnitKwh)
    const rate = safeParse(watchedMcTaxRate)
    if (kwh > 0 && rate > 0) {
      form.setValue("mcTax", (kwh * rate).toFixed(2))
    }
  }, [watchedUnitKwh, watchedMcTaxRate, form])

  // Auto-calculate Total Amount
  React.useEffect(() => {
    const sum = (
      safeParse(watchedConsum) +
      safeParse(watchedFppca) +
      safeParse(watchedEd) +
      safeParse(watchedFixed) +
      safeParse(watchedMcTax) +
      safeParse(watchedRegSurch) +
      safeParse(watchedSundry) +
      safeParse(watchedArrears) -
      safeParse(watchedPfInc) -
      safeParse(watchedRebate) -
      safeParse(watchedRevArr)
    ).toFixed(2)
    form.setValue("totalAmount", sum)
  }, [
    watchedConsum, watchedFppca, watchedEd, watchedFixed, watchedMcTax, 
    watchedRegSurch, watchedSundry, watchedArrears, 
    watchedPfInc, watchedRebate, watchedRevArr, form
  ])

  // Auto-calculate Actual Paid Amount
  React.useEffect(() => {
    const sum = (
      safeParse(watchedTotal) +
      safeParse(watchedAcdInt) +
      safeParse(watchedAcd)
    ).toFixed(2)
    form.setValue("paidAmount", sum)
  }, [watchedTotal, watchedAcdInt, watchedAcd, form])

  // Auto-calculate Unit Price Actual
  React.useEffect(() => {
    const kwh = safeParse(watchedUnitKwh)
    const total = safeParse(watchedTotal)
    if (kwh > 0 && total > 0) {
      form.setValue("paidUnitRate", (total / kwh).toFixed(2))
    }
  }, [watchedUnitKwh, watchedTotal, form])

  const onSubmit = async (values: ElectricityBillFormValues) => {
    try {
      const { files, accountName: acctName, accountNumber, ...restMeta } = values
      const title = `Electricity Bill – ${acctName} – ${values.billDate || new Date().toLocaleDateString("en-IN")}`
      await uploadMutation.mutateAsync({
        title,
        documentType: "Electricity",
        files: files || [],
        metadata: { ...restMeta, accountName: acctName, accountNumber },
      })
      toast.success("Electricity bill saved!")
      setOpen(false)
      form.reset()
    } catch {
      toast.error("Failed to save bill")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20">
            <Plus className="mr-2 h-4 w-4" />
            Add Electricity Bill
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 max-h-[95vh] overflow-hidden flex flex-col rounded-2xl border-none shadow-2xl">
        <div className="bg-slate-900 px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-xl font-black">
              <Zap className="h-5 w-5 text-yellow-400" />
              Electricity Bill Entry
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 py-8 space-y-10">
              <section>
                <SectionTitle icon={<Building2 className="h-4 w-4" />} title="Account Info" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="accountName" render={({ field }) => (
                    <FormItem><FormLabel className={labelClass}>Account Name *</FormLabel><FormControl><Input {...field} className={inputClass} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="accountNumber" render={({ field }) => (
                    <FormItem><FormLabel className={labelClass}>Account Number *</FormLabel><FormControl><Input {...field} className={inputClass} /></FormControl></FormItem>
                  )} />
                </div>
              </section>

              <section>
                <SectionTitle icon={<CalendarIcon className="h-4 w-4" />} title="Dates & Period" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <DatePickerField control={form.control} name="billDate" label="Bill Date" />
                  <DatePickerField control={form.control} name="dueDate" label="Due Date" />
                  <DatePickerField control={form.control} name="billFrom" label="Bill From" />
                  <DatePickerField control={form.control} name="billTo" label="Bill To" />
                  <FormField control={form.control} name="months" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Months</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="1"
                          onKeyDown={blockNegativeKeys}
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </section>

              <section>
                <SectionTitle icon={<Gauge className="h-4 w-4" />} title="Consumption Details" />
                
                {/* kWh Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <div className="col-span-full mb-1 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">kWh Readings</span>
                  </div>
                  <ChargeField control={form.control} name="oldReadingKwh" label="Old (kWh)" prefix="" />
                  <ChargeField control={form.control} name="newReadingKwh" label="New (kWh)" prefix="" />
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="unitKwh" label="Unit (kWh)" prefix="" highlight="blue" />
                    {(watchedOldKwh && watchedNewKwh) && (
                      <p className="text-[10px] font-bold text-blue-500 italic px-1">
                        ({watchedNewKwh} - {watchedOldKwh}) = {safeParse(watchedNewKwh) - safeParse(watchedOldKwh)}
                      </p>
                    )}
                  </div>
                </div>

                {/* kVAh Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <div className="col-span-full mb-1 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">kVAh Readings</span>
                  </div>
                  <ChargeField control={form.control} name="oldReadingKvah" label="Old (kVAh)" prefix="" />
                  <ChargeField control={form.control} name="newReadingKvah" label="New (kVAh)" prefix="" />
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="unitKvah" label="Unit (kVAh)" prefix="" highlight="yellow" />
                    {(watchedOldKvah && watchedNewKvah) && (
                      <p className="text-[10px] font-bold text-yellow-600 italic px-1">
                        ({watchedNewKvah} - {watchedOldKvah}) = {safeParse(watchedNewKvah) - safeParse(watchedOldKvah)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="kwhKvahDiff" label="kWh-kVAh" prefix="" highlight="blue" allowNegative />
                    {(watchedUnitKwh && watchedUnitKvah) && (
                      <p className="text-[10px] font-bold text-blue-500 italic px-1">
                        ({watchedUnitKwh} - {watchedUnitKvah}) = {safeParse(watchedUnitKwh) - safeParse(watchedUnitKvah)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="kwhKvahRatio" label="kWh/kVAh Ratio" prefix="" suffix="%" highlight="blue" />
                    {(watchedUnitKwh && watchedUnitKvah) && (
                      <p className="text-[10px] font-bold text-blue-500 italic px-1">
                        ({watchedUnitKwh} / {watchedUnitKvah}) × 100 = {((safeParse(watchedUnitKwh) / safeParse(watchedUnitKvah)) * 100).toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <SectionTitle icon={<CreditCard className="h-4 w-4" />} title="Financials" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                  <ChargeField control={form.control} name="unitPriceBasic" label="Unit Price Basic" />
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="consumptionCharges" label="Consumption Charges" />
                    {(watchedUnitKwh && watchedUnitPriceBasic) && (
                      <p className="text-[10px] font-bold text-slate-500 italic px-1">
                        ({watchedUnitKwh} × {watchedUnitPriceBasic}) = {(safeParse(watchedUnitKwh) * safeParse(watchedUnitPriceBasic)).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <ChargeField control={form.control} name="fppca" label="FPPCA" />
                  <ChargeField control={form.control} name="edRate" label="ED Rate" />
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="ed" label="ED" />
                    {(watchedUnitKwh && watchedEdRate) && (
                      <p className="text-[10px] font-bold text-slate-500 italic px-1">
                        ({watchedUnitKwh} × {watchedEdRate}) = {(safeParse(watchedUnitKwh) * safeParse(watchedEdRate)).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <ChargeField control={form.control} name="fixedCharges" label="Fix Charges" />
                  <FormField control={form.control} name="powerFactor" render={({ field }) => (
                    <FormItem><FormLabel className={labelClass}>Power Factor</FormLabel><FormControl><Input {...field} className={inputClass} /></FormControl></FormItem>
                  )} />
                  <ChargeField control={form.control} name="mcTaxRate" label="MC Tax Rate" />
                  <div className="space-y-1">
                    <ChargeField control={form.control} name="mcTax" label="MC Tax" />
                    {(watchedUnitKwh && watchedMcTaxRate) && (
                      <p className="text-[10px] font-bold text-slate-500 italic px-1">
                        ({watchedUnitKwh} × {watchedMcTaxRate}) = {(safeParse(watchedUnitKwh) * safeParse(watchedMcTaxRate)).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <ChargeField control={form.control} name="pfIncentive" label="P.F. Incentive" highlight="green" />
                  <ChargeField control={form.control} name="regSurcharge" label="Regl. Surc" />
                  <ChargeField control={form.control} name="paymentRebate" label="Payment Rebate" highlight="green" />
                  <ChargeField control={form.control} name="sundryCharges" label="Sundry Charges" />
                  <ChargeField control={form.control} name="arrears" label="Arrear - Reg" />
                  <ChargeField control={form.control} name="reversalOfArrear" label="Reversal of Arrear" highlight="amber" />
                </div>
              </section>

              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <SectionTitle icon={<Calculator className="h-4 w-4" />} title="Summary & ACD" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <ChargeField control={form.control} name="acdInt" label="ACD Int" />
                  <ChargeField control={form.control} name="acd" label="ACD" />
                  <ChargeField control={form.control} name="lastAcd" label="Last ACD" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <ChargeField control={form.control} name="totalAmount" label="Total Amount" highlight="blue" />
                  <ChargeField control={form.control} name="paidAmount" label="Actual Paid" highlight="green" />
                  <DatePickerField control={form.control} name="paidOn" label="Paid On" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                     <ChargeField control={form.control} name="paidUnitRate" label="Unit Price Actual" prefix="₹" />
                     {(watchedUnitKwh && watchedTotal) && (
                       <p className="text-[10px] font-bold text-slate-500 italic px-1">
                         ({watchedTotal} / {watchedUnitKwh}) = {(safeParse(watchedTotal) / safeParse(watchedUnitKwh)).toFixed(2)}
                       </p>
                     )}
                   </div>
                </div>
              </section>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button type="submit" disabled={uploadMutation.isPending} className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl font-bold">
                  {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
                  Save Bill Record
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
