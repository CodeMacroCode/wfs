"use client"

import * as React from "react"
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Check,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "sonner"

interface DataTableExportProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  filename?: string
  fetchData?: () => Promise<{ data: TData[] }>
  data?: TData[]
  defaultSelectedColumns?: string[]
}

// Helper for nested property access
const getNestedValue = (obj: Record<string, unknown>, path: string): string | number => {
  if (!path) return ""
  const value = path.split('.').reduce((acc: unknown, part: string) => (acc as Record<string, unknown>)?.[part], obj);
  return (typeof value === 'string' || typeof value === 'number') ? value : "";
}

export function DataTableExport<TData>({
  columns,
  filename = "report",
  fetchData,
  data,
  defaultSelectedColumns,
}: DataTableExportProps<TData>) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  // Filter columns to exclude non-exportable items like actions
  const exportableColumns = React.useMemo(() => {
    return columns.filter(col => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = col.id || (col as any).accessorKey
      return id && id !== "actions" && id !== "srNo" && id !== "select"
    })
  }, [columns])

  // State for selected columns
  const [selectedColumnIds, setSelectedColumnIds] = React.useState<Set<string>>(new Set())

  // Helper to get consistent column ID
  const getColumnId = React.useCallback((col: ColumnDef<TData, unknown>): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (col.id || (col as any).accessorKey || "") as string
  }, [])

  // Initialize selected columns when dialog opens
  React.useEffect(() => {
    if (open) {
      const allIds = exportableColumns.map(getColumnId).filter(Boolean);
      const initialSelected = defaultSelectedColumns 
        ? allIds.filter(id => defaultSelectedColumns.includes(id))
        : allIds;
      setSelectedColumnIds(new Set(initialSelected));
    }
  }, [open, exportableColumns, defaultSelectedColumns, getColumnId])

  const toggleColumn = (id: string) => {
    const newSelected = new Set(selectedColumnIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedColumnIds(newSelected)
  }

  const selectAll = () => {
    setSelectedColumnIds(new Set(exportableColumns.map(getColumnId).filter(Boolean)))
  }

  const deselectAll = () => {
    setSelectedColumnIds(new Set())
  }

  const prepareDataForExport = async (): Promise<Record<string, string | number>[]> => {
    try {
      let sourceData: TData[] = []

      if (fetchData) {
        const response = await fetchData()
        sourceData = response.data
      } else if (data) {
        sourceData = data
      }

      const activeColumns = exportableColumns.filter(col => {
         const id = getColumnId(col)
         return id && selectedColumnIds.has(id)
      })

      // Map data to column headers
      return sourceData.map((item) => {
        const row: Record<string, string | number> = {}
        activeColumns.forEach(col => {
          const id = getColumnId(col)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const castCol = col as any
          const header = typeof castCol.header === "string" ? castCol.header : id
          
          let value: string | number = "";
          
          if (castCol.meta?.exportValue) {
            value = castCol.meta.exportValue(item);
          } else {
            value = getNestedValue(item as Record<string, unknown>, id);
          }

          row[header] = value || "";
        })
        return row
      })
    } catch (error) {
      toast.error("Failed to prepare data for export")
      throw error
    }
  }

  const handleExcelExport = async () => {
    if (selectedColumnIds.size === 0) {
      toast.error("Please select at least one column")
      return
    }

    setIsExporting(true)
    try {
      const rows = await prepareDataForExport()
      const worksheet = XLSX.utils.json_to_sheet(rows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
      XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`)
      toast.success("Excel report exported successfully")
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePDFExport = async () => {
    if (selectedColumnIds.size === 0) {
      toast.error("Please select at least one column")
      return
    }

    setIsExporting(true)
    try {
      const rows = await prepareDataForExport()
      const doc = new jsPDF("landscape")

      const activeColumns = exportableColumns.filter(col => {
        const id = getColumnId(col)
        return id && selectedColumnIds.has(id)
      })

      const headers = activeColumns.map(col => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const castCol = col as any
        return typeof castCol.header === "string" ? castCol.header : getColumnId(col)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = rows.map(row => Object.values(row)) as any[][]

      autoTable(doc, {
        head: [headers as string[]],
        body: body,
        theme: "striped",
        headStyles: {
          fillColor: [45, 184, 138], // #2db88a
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold"
        },
        styles: { fontSize: 8 },
        margin: { top: 20 },
        didDrawPage: (data) => {
          doc.setFontSize(14)
          doc.text(filename.toUpperCase().replace(/_/g, ' '), data.settings.margin.left, 15)
        }
      })

      doc.save(`${filename}_${new Date().getTime()}.pdf`)
      toast.success("PDF report exported successfully")
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#2db88a]" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#2db88a]/10 rounded-lg">
              <Download className="w-5 h-5 text-[#2db88a]" />
            </div>
            <div>
              <DialogTitle className="text-lg">Export Report</DialogTitle>
              <DialogDescription>
                Select the columns you want to include in your report.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Columns</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={selectAll} 
                className="text-[10px] font-bold text-[#2db88a] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Select All
              </button>
              <button 
                onClick={deselectAll} 
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Deselect All
              </button>
            </div>
          </div>
          
          <ScrollArea className="h-[250px] border rounded-xl bg-slate-50/50 p-4">
            <div className="space-y-4">
              {exportableColumns.map((col) => {
                const id = getColumnId(col)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const castCol = col as any
                const header = typeof castCol.header === "string" ? castCol.header : id
                return (
                  <div key={id} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`col-${id}`}
                      checked={selectedColumnIds.has(id)}
                      onCheckedChange={() => toggleColumn(id)}
                      className="border-slate-300 data-checked:bg-[#2db88a] data-checked:border-[#2db88a]"
                    />
                    <Label
                      htmlFor={`col-${id}`}
                      className="text-sm font-medium text-slate-600 cursor-pointer group-hover:text-slate-900 transition-colors flex-1"
                    >
                      {header}
                    </Label>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-slate-100" />

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-4">
          <Button
            onClick={handleExcelExport}
            className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 border-2 hover:border-emerald-300 shadow-sm"
            disabled={isExporting || selectedColumnIds.size === 0}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
            Excel (.xlsx)
          </Button>
          <Button
            onClick={handlePDFExport}
            className="flex-1 bg-white hover:bg-rose-50 text-rose-700 border-rose-200 border-2 hover:border-rose-300 shadow-sm"
            disabled={isExporting || selectedColumnIds.size === 0}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            PDF (.pdf)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
