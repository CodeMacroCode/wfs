"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Droplets,
  Maximize2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  PlusCircle
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WaterBillFormDialog } from "./water-bill-form-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { WaterBillRecord } from "@/types/water-bill"
import { cn } from "@/lib/utils"

interface WaterBillTableProps {
  data: WaterBillRecord[]
  isLoading: boolean
  onDelete: (id: string) => void
  isDeleting: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(val?: string | number) {
  const num = parseFloat(String(val ?? ""))
  if (isNaN(num)) return "—"
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(val?: string) {
  if (!val) return "—"
  try {
    return format(new Date(val), "dd.MM.yy")
  } catch {
    return val
  }
}

// ── Payment Status Badge ──────────────────────────────────────────────────────
function PaymentBadge({ paid, total }: { paid?: string; total?: string }) {
  const paidNum = parseFloat(paid ?? "")
  const totalNum = parseFloat(total ?? "")

  if (isNaN(paidNum) || isNaN(totalNum) || totalNum === 0)
    return (
      <Badge className="bg-slate-100 text-slate-500 border-transparent font-bold text-[10px] px-2 py-0">
        N/A
      </Badge>
    )
  if (paidNum >= totalNum)
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-transparent font-bold text-[10px] px-2 py-0 uppercase">
        Paid
      </Badge>
    )
  if (paidNum > 0)
    return (
      <Badge className="bg-amber-100 text-amber-700 border-transparent font-bold text-[10px] px-2 py-0 uppercase">
        Partial
      </Badge>
    )
  return (
    <Badge className="bg-rose-100 text-rose-700 border-transparent font-bold text-[10px] px-2 py-0 uppercase">
      Unpaid
    </Badge>
  )
}

// ── Detail Cell used in expanded row ─────────────────────────────────────────
function DetailCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[100px]">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className={cn("text-xs font-bold", highlight ? "text-blue-600" : "text-slate-700")}>{value || "—"}</span>
    </div>
  )
}

// ── Main Table ────────────────────────────────────────────────────────────────
export function WaterBillTable({
  data,
  isLoading,
  onDelete,
  isDeleting,
}: WaterBillTableProps) {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Droplets className="h-7 w-7 text-blue-300 animate-pulse" />
          </div>
          <p className="font-bold text-slate-400 text-sm">
            Loading water bill records...
          </p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
            <Droplets className="h-10 w-10 text-blue-200" />
          </div>
          <div className="text-center">
            <p className="font-black text-slate-600">No water bills found</p>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Use &ldquo;Add Water Bill&rdquo; to record your first entry
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-100">
              <TableHead className="w-10 border-r border-slate-100" />
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 border-r border-slate-100">
                Account
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">
                Bill Date
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">
                Due Date
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100" colSpan={2}>
                Bill From - To
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100">
                Conn. Size
              </TableHead>
               <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100" colSpan={2}>
                Reading (Old / New)
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100">
                Unit
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right border-r border-slate-100">
                Total Amount
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((bill) => {
              const meta = bill.metadata
              const isExpanded = expandedRow === bill._id
              const isFromAvg = String(meta.isFromAverage) === "true"
              const isToAvg = String(meta.isToAverage) === "true"
              const isAnyAvg = isFromAvg || isToAvg

              return (
                <React.Fragment key={bill._id}>
                  <TableRow
                    className={cn(
                      "transition-colors cursor-pointer group border-slate-50",
                      isExpanded ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-slate-50/70",
                      isAnyAvg && !isExpanded && "bg-amber-50/30 hover:bg-amber-50/50"
                    )}
                    onClick={() => setExpandedRow(isExpanded ? null : bill._id)}
                  >
                    <TableCell className="py-4 pr-0 pl-4 border-r border-slate-100">
                      <div className={cn(
                        "h-6 w-6 rounded-lg flex items-center justify-center transition-colors",
                        isExpanded ? "bg-blue-100 text-blue-600" : "text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-500"
                      )}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Droplets className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                        <p className="font-black text-[13px] text-slate-800 leading-tight truncate max-w-[120px]">
                          {meta?.accountName || "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 font-bold text-slate-600 text-[13px] border-r border-slate-100">
                      {formatDate(meta?.billDate)}
                    </TableCell>

                    <TableCell className="py-4 font-bold text-slate-600 text-[13px] border-r border-slate-100">
                      {formatDate(meta?.dueDate)}
                    </TableCell>

                    {/* From Column */}
                    <TableCell className="py-4 font-bold text-slate-600 text-[13px] border-r border-slate-100">
                      {isFromAvg ? (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-tighter italic">bill on avg</span>
                      ) : (
                        formatDate(meta?.billFrom)
                      )}
                    </TableCell>

                    {/* To Column */}
                    <TableCell className="py-4 font-bold text-slate-600 text-[13px] border-r border-slate-100">
                      {isToAvg ? (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-tighter italic">bill on avg</span>
                      ) : (
                        formatDate(meta?.billTo)
                      )}
                    </TableCell>

                    <TableCell className="py-4 font-bold text-slate-600 text-[13px] text-center border-r border-slate-100">
                      {meta?.connectionSize || "—"}
                    </TableCell>

                    <TableCell className="py-4 font-bold text-slate-400 text-[13px] text-center border-r border-slate-100">
                      {meta?.oldReading || "—"}
                    </TableCell>
                    <TableCell className="py-4 font-black text-slate-800 text-[13px] text-center border-r border-slate-100">
                      {meta?.newReading || "—"}
                    </TableCell>

                    <TableCell className="py-4 text-center border-r border-slate-100">
                       <span className={cn(
                         "font-black text-[13px] bg-slate-50 px-2 py-1 rounded-lg",
                         isAnyAvg ? "text-amber-600" : "text-blue-600"
                       )}>
                        {meta?.unit || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 font-black text-[14px] text-slate-900 text-right border-r border-slate-100">
                      {formatCurrency(meta?.totalAmount)}
                    </TableCell>

                    <TableCell className="py-4 text-center border-r border-slate-100" onClick={(e) => e.stopPropagation()}>
                      <PaymentBadge paid={meta?.paidAmount} total={meta?.totalAmount} />
                    </TableCell>

                    <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/Bill/${bill._id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 rounded-lg" title="Open Full Page">
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <WaterBillFormDialog 
                          initialData={meta}
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg" title="Add Next Bill">
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                              <AlertDialogDescription>Permanently remove this water bill entry.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => onDelete(bill._id)} disabled={isDeleting}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="bg-blue-50/20 border-blue-100">
                      <TableCell colSpan={12} className="py-6 px-10">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                           <DetailCell label="CURRENT WATER CHARGES" value={formatCurrency(meta?.currentWaterCharges)} />
                           <DetailCell label="Cost Per Unit" value={`₹${meta?.costPerUnit || "0.00"}`} highlight />
                           <DetailCell label="Maintenance charges" value={formatCurrency(meta?.maintenanceCharges)} />
                           <DetailCell label="Sewerage" value={formatCurrency(meta?.sewerageCess)} />
                           <DetailCell label="Meter Rental" value={formatCurrency(meta?.meterRentals)} />
                           <DetailCell label="GARBAGE CHARGES" value={formatCurrency(meta?.garbageCharges)} />
                           <DetailCell label="Arrears" value={formatCurrency(meta?.arrears)} />
                           <DetailCell label="MC Tax" value={formatCurrency(meta?.mcTax)} />
                           <DetailCell label="LATE PAYMENT SURCHARGE" value={formatCurrency(meta?.latePaymentSurcharge)} />
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-8">
                           <DetailCell label="Paid Amount" value={formatCurrency(meta?.paidAmount)} />
                           <DetailCell label="Paid On" value={formatDate(meta?.paidOn)} />
                           <DetailCell label="Remarks" value={meta?.remarks || "—"} />
                           
                           {bill.files && bill.files.length > 0 && (
                             <div className="flex-1">
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Documents</p>
                               <div className="flex flex-wrap gap-2">
                                 {bill.files.map((file, i) => (
                                   <a key={i} href={`${process.env.NEXT_PUBLIC_API_URL}${file}`} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-100 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50">
                                     <FileText className="h-3.5 w-3.5" />
                                     View Doc {i+1}
                                   </a>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

    </>
  )
}
