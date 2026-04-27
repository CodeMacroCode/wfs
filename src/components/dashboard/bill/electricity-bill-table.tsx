"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Zap,
  Maximize2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  PlusCircle
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ElectricityBillFormDialog } from "./electricity-bill-form-dialog"
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
import { ElectricityBillRecord } from "@/types/electricity-bill"
import { cn } from "@/lib/utils"

interface ElectricityBillTableProps {
  data: ElectricityBillRecord[]
  isLoading: boolean
  onDelete: (id: string) => void
  isDeleting?: boolean
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—"
  try {
    return format(new Date(dateStr), "dd.MM.yy")
  } catch {
    return dateStr
  }
}

function formatCurrency(val?: string | number) {
  const num = parseFloat(String(val ?? ""))
  if (isNaN(num)) return "₹0.00"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num)
}

function PaymentBadge({ paid, total }: { paid?: string | number; total?: string | number }) {
  const p = parseFloat(String(paid ?? "0"))
  const t = parseFloat(String(total ?? "0"))
  
  if (p >= t && t > 0) {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 font-bold text-[10px] px-2 rounded-lg">
        PAID
      </Badge>
    )
  }
  if (p > 0) {
    return (
      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 font-bold text-[10px] px-2 rounded-lg">
        PARTIAL
      </Badge>
    )
  }
  return (
    <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-100 font-bold text-[10px] px-2 rounded-lg">
      UNPAID
    </Badge>
  )
}

function DetailCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className={cn("text-xs font-bold", highlight ? "text-blue-600" : "text-slate-700")}>{value}</p>
    </div>
  )
}

export function ElectricityBillTable({
  data,
  isLoading,
  onDelete,
  isDeleting,
}: ElectricityBillTableProps) {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  return (
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
              Bill Period
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100">
              kWh
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center border-r border-slate-100">
              kVAh
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

            return (
              <React.Fragment key={bill._id}>
                <TableRow
                  className={cn(
                    "transition-colors cursor-pointer group border-slate-50",
                    isExpanded ? "bg-yellow-50/40 hover:bg-yellow-50/60" : "hover:bg-slate-50/70"
                  )}
                  onClick={() => setExpandedRow(isExpanded ? null : bill._id)}
                >
                  <TableCell className="py-4 pr-0 pl-4 border-r border-slate-100">
                    <div className={cn(
                      "h-6 w-6 rounded-lg flex items-center justify-center transition-colors",
                      isExpanded ? "bg-yellow-100 text-yellow-600" : "text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-500"
                    )}>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                        <Zap className="h-3.5 w-3.5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-black text-[13px] text-slate-800 leading-tight">
                          {meta?.accountName || "—"}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 tracking-tight">
                          ID: {meta?.accountNumber || "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 font-bold text-slate-600 text-[13px] border-r border-slate-100">
                    {formatDate(meta?.billDate)}
                  </TableCell>

                  <TableCell className="py-4 font-bold text-slate-600 text-[13px] border-r border-slate-100">
                    {formatDate(meta?.billFrom)} - {formatDate(meta?.billTo)}
                  </TableCell>

                  <TableCell className="py-4 text-center border-r border-slate-100">
                     <span className="font-black text-[13px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {meta?.unitKwh || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-center border-r border-slate-100">
                     <span className="font-black text-[13px] text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg">
                      {meta?.unitKvah || "—"}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg" title="Open Full Page">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <ElectricityBillFormDialog 
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
                            <AlertDialogDescription>Permanently remove this electricity bill entry.</AlertDialogDescription>
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
                  <TableRow className="bg-slate-50/50">
                    <TableCell colSpan={10} className="px-12 py-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                         <DetailCell label="kWh Unit" value={meta?.unitKwh || "—"} highlight />
                         <DetailCell label="kVAh Unit" value={meta?.unitKvah || "—"} highlight />
                         <DetailCell label="kWh-kVAh" value={meta?.kwhKvahDiff || "—"} />
                         <DetailCell label="kWh/kVAh (%)" value={meta?.kwhKvahRatio ? `${meta.kwhKvahRatio}%` : "—"} highlight />
                         <DetailCell label="Basic Unit Price" value={formatCurrency(meta?.unitPriceBasic)} />
                         <DetailCell label="Consum. Charges" value={formatCurrency(meta?.consumptionCharges)} highlight />
                         <DetailCell label="FPPCA" value={formatCurrency(meta?.fppca)} />
                         <DetailCell label="ED Rate" value={meta?.edRate || "—"} />
                         <DetailCell label="ED" value={formatCurrency(meta?.ed)} />
                         <DetailCell label="Fix Charges" value={formatCurrency(meta?.fixedCharges)} />
                         <DetailCell label="Power Factor" value={meta?.powerFactor || "—"} />
                         <DetailCell label="MC Tax Rate" value={meta?.mcTaxRate || "—"} />
                         <DetailCell label="MC Tax" value={formatCurrency(meta?.mcTax)} />
                         <DetailCell label="P.F. Incentive" value={formatCurrency(meta?.pfIncentive)} />
                         <DetailCell label="Regl. Surc" value={formatCurrency(meta?.regSurcharge)} />
                         <DetailCell label="Payment Rebate" value={formatCurrency(meta?.paymentRebate)} />
                         <DetailCell label="Sundry Charges" value={formatCurrency(meta?.sundryCharges)} />
                         <DetailCell label="Arrear - Reg" value={formatCurrency(meta?.arrears)} />
                         <DetailCell label="Rev. of Arrear" value={formatCurrency(meta?.reversalOfArrear)} />
                         <DetailCell label="ACD Int" value={formatCurrency(meta?.acdInt)} />
                         <DetailCell label="ACD" value={formatCurrency(meta?.acd)} />
                         <DetailCell label="Last ACD" value={formatCurrency(meta?.lastAcd)} />
                         <DetailCell label="Actual Unit Price" value={formatCurrency(meta?.paidUnitRate)} highlight />
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-8">
                         <DetailCell label="Actual Paid" value={formatCurrency(meta?.paidAmount)} highlight />
                         <DetailCell label="Paid On" value={formatDate(meta?.paidOn)} />
                         <DetailCell label="Remarks" value={meta?.remarks || "—"} />
                         
                         {bill.files && bill.files.length > 0 && (
                           <div className="flex-1">
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Documents</p>
                             <div className="flex flex-wrap gap-2">
                               {bill.files.map((file, i) => (
                                 <a key={i} href={`${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/api$/, "")}${file}`} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-yellow-100 rounded-lg text-xs font-bold text-yellow-600 hover:bg-yellow-50">
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
  )
}
