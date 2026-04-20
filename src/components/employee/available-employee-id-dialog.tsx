"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  useEmployeeIdDropdownQuery, 
  useCreateEmployeeIdMutation 
} from "@/hooks/queries/use-employees-query"
import { useCompanyDropdownQuery } from "@/hooks/queries/use-company"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Plus, List, Loader2, Key } from "lucide-react"
import { cn } from "@/lib/utils"

export function AvailableEmployeeIdDialog() {
  const [activeTab, setActiveTab] = React.useState<"list" | "generate">("list")
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95 bg-white border cursor-pointer">
          <Key className="h-4 w-4" />
          <span className="font-semibold text-sm">Available IDs</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[24px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-slate-900">Employee ID Management</DialogTitle>
        </DialogHeader>
        
        {/* Custom Tabs */}
        <div className="flex p-1 bg-slate-100 mx-6 mt-4 rounded-xl">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer",
              activeTab === "list" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <List className="h-4 w-4" />
            Available IDs
          </button>
          <button
            onClick={() => setActiveTab("generate")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer",
              activeTab === "generate" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Plus className="h-4 w-4" />
            Generate New
          </button>
        </div>

        <div className="p-6">
          {activeTab === "list" ? <AvailableIdList /> : <GenerateIdForm onSuccess={() => setActiveTab("list")} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AvailableIdList() {
  const { data, isLoading } = useEmployeeIdDropdownQuery()
  const ids = data?.data || []

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Fetching available IDs...</p>
      </div>
    )
  }

  if (ids.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No available IDs found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[350px] pr-4">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="text-[10px] font-black uppercase text-slate-400">Employee ID</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-400">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ids.map((id) => (
            <TableRow key={id._id} className="border-slate-50 hover:bg-slate-50/50 transition-colors cursor-default">
              <TableCell className="font-bold text-slate-900 py-4">{id.employeeId}</TableCell>
              <TableCell className="text-xs font-semibold text-slate-500">
                {format(new Date(id.createdAt), "dd MMM yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

function GenerateIdForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: companyData } = useCompanyDropdownQuery()
  const companies = companyData?.data || []
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [remark, setRemark] = React.useState<string>("")
  
  const { mutate: generate, isPending } = useCreateEmployeeIdMutation()

  const handleGenerate = () => {
    const selectedCompany = companies.find(c => c._id === selectedCompanyId)
    if (!selectedCompany) return

    generate(
      { prefix: selectedCompany.prefix, remark },
      { onSuccess: () => onSuccess() }
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Company</Label>
        <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
          <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500/10 cursor-pointer">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
            {companies.map((company) => (
              <SelectItem key={company._id} value={company._id} className="text-xs font-semibold">
                {company.name} ({company.prefix})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Remark (Optional)</Label>
        <Input 
          placeholder="e.g. Batch for Sales Team" 
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500/10 font-semibold"
        />
      </div>

      <Button 
        onClick={handleGenerate}
        disabled={!selectedCompanyId || isPending}
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 font-extrabold rounded-xl text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:grayscale cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate ID(s)"
        )}
      </Button>
    </div>
  )
}
