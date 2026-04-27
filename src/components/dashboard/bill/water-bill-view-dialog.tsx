"use client"

import * as React from "react"
import { 
  Droplets, 
  Building2, 
  Calendar, 
  FileText, 
  CreditCard, 
  ExternalLink,
  History,
  Info,
  ArrowRight,
  User,
  Clock
} from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { WaterBillRecord } from "@/types/water-bill"
import { cn } from "@/lib/utils"
import { format, parseISO, isValid } from "date-fns"

interface WaterBillViewDialogProps {
  bill: WaterBillRecord
  open: boolean
  onClose: () => void
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—"
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return "—"
    return format(date, "dd MMM yyyy")
  } catch {
    return "—"
  }
}

const formatCurrency = (amount?: string | number) => {
  if (amount === undefined || amount === null || amount === "") return "—"
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return "—"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(num)
}

// ── Shared Components ─────────────────────────────────────────────────────────

function InfoBlock({ label, value, icon, highlight, subValue }: { 
  label: string; 
  value?: string; 
  icon?: React.ReactNode; 
  highlight?: "blue" | "green" | "amber" | "red";
  subValue?: string;
}) {
  return (
    <div className="group">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon && <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span>}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "text-sm font-bold tracking-tight",
          highlight === "blue" ? "text-blue-600" :
          highlight === "green" ? "text-emerald-600" :
          highlight === "amber" ? "text-amber-600" :
          highlight === "red" ? "text-rose-600" :
          "text-slate-700"
        )}>
          {value || "—"}
        </span>
        {subValue && <span className="text-[10px] font-bold text-slate-400 mt-0.5">{subValue}</span>}
      </div>
    </div>
  )
}

function StatCard({ label, value, prefix, highlight }: { 
  label: string; 
  value?: string; 
  prefix?: string; 
  highlight?: "blue" | "green" | "amber"
}) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-300",
      highlight === "blue" ? "bg-blue-50/50 border-blue-100 hover:bg-blue-50" :
      highlight === "green" ? "bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50" :
      highlight === "amber" ? "bg-amber-50/50 border-amber-100 hover:bg-amber-50" :
      "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
    )}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <p className={cn(
        "text-xl font-black flex items-baseline gap-1",
        highlight === "blue" ? "text-blue-700" :
        highlight === "green" ? "text-emerald-700" :
        highlight === "amber" ? "text-amber-700" :
        "text-slate-800"
      )}>
        {prefix && <span className="text-sm font-bold opacity-60">{prefix}</span>}
        {value || "0.00"}
      </p>
    </div>
  )
}

// ── Main Dialog ───────────────────────────────────────────────────────────────

export function WaterBillViewDialog({ bill, open, onClose }: WaterBillViewDialogProps) {
  const meta = bill.metadata
  const isPaid = safeParse(meta?.paidAmount) >= safeParse(meta?.totalAmount)
  const isAnyAvg = String(meta?.isFromAverage) === "true" || String(meta?.isToAverage) === "true"

  function safeParse(val: string | number | undefined | null) {
    const num = parseFloat(String(val ?? ""))
    return isNaN(num) ? 0 : num
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50/30 backdrop-blur-xl">
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Droplets className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{bill.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Water Bill Record</span>
                  <div className="h-1 w-1 rounded-full bg-slate-600" />
                  <span className="text-xs font-bold text-blue-400/80">#{meta?.accountNumber || "N/A"}</span>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border self-start md:self-center",
              isPaid 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            )}>
              {isPaid ? "PAID IN FULL" : "PAYMENT PENDING"}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Top Row: Account & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Details</span>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <InfoBlock label="Account Holder" value={meta?.accountName} />
                <InfoBlock label="Connection ID" value={meta?.accountNumber} highlight="blue" />
                <InfoBlock label="Bill Period" value={meta?.billPeriod ? `${meta.billPeriod} Months` : "—"} />
                <InfoBlock label="Connection Size" value={meta?.connectionSize} />
              </div>
            </div>
            
            <StatCard 
              label="Paid Amount" 
              value={meta?.paidAmount || "0.00"} 
              prefix="₹" 
              highlight={isPaid ? "green" : "blue"} 
            />
          </div>

          {/* Average Billing Notice */}
          {isAnyAvg && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Average Billing Active</p>
                <p className="text-xs font-medium text-amber-700/80 leading-relaxed">Some components of this bill were calculated based on previous averages.</p>
              </div>
            </div>
          )}

          {/* Section: Schedule & Readings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Dates */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">Period & Schedule</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <InfoBlock label="Bill Date" value={formatDate(meta?.billDate)} icon={<ArrowRight className="h-3 w-3" />} />
                <InfoBlock label="Due Date" value={formatDate(meta?.dueDate)} highlight="red" />
                <InfoBlock 
                  label="Service From" 
                  value={(String(meta?.isFromAverage) === "true") ? "Billed on Average" : formatDate(meta?.billFrom)} 
                  highlight={(String(meta?.isFromAverage) === "true") ? "amber" : undefined}
                />
                <InfoBlock 
                  label="Service To" 
                  value={(String(meta?.isToAverage) === "true") ? "Billed on Average" : formatDate(meta?.billTo)} 
                  highlight={(String(meta?.isToAverage) === "true") ? "amber" : undefined}
                />
              </div>
            </div>

            {/* Readings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">Consumption Data</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <InfoBlock label="Old Reading" value={meta?.oldReading} />
                <InfoBlock label="New Reading" value={meta?.newReading} />
                <InfoBlock label="Actual Consumption" value={meta?.unit} highlight="blue" subValue="Units Consumed" />
                <InfoBlock label="Cost Per Unit" value={`₹${meta?.costPerUnit || "0.00"}`} />
              </div>
            </div>
          </div>

          {/* Section: Financials */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">Financial Breakdown</h3>
            </div>
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-8">
                <InfoBlock label="Water Charges" value={formatCurrency(meta?.currentWaterCharges)} highlight="blue" />
                <InfoBlock label="Maintenance" value={formatCurrency(meta?.maintenanceCharges)} />
                <InfoBlock label="Sewerage Cess" value={formatCurrency(meta?.sewerageCess)} subValue={`${meta?.sewerageCessPercentage || 30}% Rate`} />
                <InfoBlock label="Meter Rental" value={formatCurrency(meta?.meterRentals)} />
                <InfoBlock label="Garbage" value={formatCurrency(meta?.garbageCharges)} />
                <InfoBlock label="Sundry" value={formatCurrency(meta?.sundryCharges)} />
                <InfoBlock label="MC Tax" value={formatCurrency(meta?.mcTax)} />
                <InfoBlock label="Arrears" value={formatCurrency(meta?.arrears)} highlight="red" />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Bill Total" value={meta?.totalAmount} prefix="₹" highlight="blue" />
                <div className="flex flex-col justify-center px-4">
                  <DetailRowSmall label="LATE SURCHARGE" value={formatCurrency(meta?.latePaymentSurcharge)} />
                  <DetailRowSmall label="ADJ PREV BILL" value={formatCurrency(meta?.adjPrevBill)} />
                </div>
                <StatCard label="Final UNIT Rate" value={meta?.paidUnitRate} prefix="₹" highlight="amber" />
              </div>
            </div>
          </div>

          {/* Actual Reading & Payment Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                      <Clock className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Date</p>
                      <p className="text-sm font-bold text-slate-700">{formatDate(meta?.paidOn)}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actual Reading</p>
                   <p className="text-sm font-black text-blue-600">{meta?.actualReading || "—"}</p>
                </div>
             </div>
             
             {/* Remarks Box */}
             {meta?.remarks && (
               <div className="p-6 rounded-3xl bg-amber-50/30 border border-amber-100/50 flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Notes & Remarks</p>
                  <p className="text-xs font-medium text-slate-600 italic leading-relaxed">&quot;{meta.remarks}&quot;</p>
               </div>
             )}
          </div>

          {/* Files */}
          {bill.files && bill.files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">Attached Documents</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {bill.files.map((file, idx) => {
                  const fileName = file.split("/").pop() || `Bill_${idx + 1}`
                  const apiBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/api$/, "");
                  const fileUrl = `${apiBase}${file}`
                  return (
                    <a
                      key={idx}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all hover:shadow-lg hover:shadow-blue-500/5"
                    >
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                         <span className="truncate max-w-[120px]">{fileName}</span>
                         <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Click to view</span>
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-blue-400" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-inner">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Created By</p>
                <p className="text-xs font-bold text-slate-600">{bill.createdBy?.name || "System Administrator"}</p>
              </div>
            </div>
            <div className="text-right flex flex-col">
              <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Record Created</p>
              <p className="text-xs font-bold text-slate-500">{formatDate(bill.createdAt)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DetailRowSmall({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">{label}</span>
      <span className="text-xs text-slate-700 font-bold">{value || "—"}</span>
    </div>
  )
}
