"use client"

import * as React from "react"
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
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
}

export function DataTableExport<TData>({
  columns,
  filename = "report",
  fetchData,
  data,
}: DataTableExportProps<TData>) {
  const [isExporting, setIsExporting] = React.useState(false)

  // Filter columns to exclude actions and Sr. No.
  const exportableColumns = columns.filter(col => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = col.id || (col as any).accessorKey
    return id && id !== "actions" && id !== "srNo" && id !== "select"
  })

  const prepareData = async (): Promise<Record<string, string | number>[]> => {
    try {
      let exportData: TData[] = []

      if (fetchData) {
        const response = await fetchData()
        exportData = response.data
      } else if (data) {
        exportData = data
      }

      // Map data to column headers
      return exportData.map((item) => {
        const row: Record<string, string | number> = {}
        exportableColumns.forEach(col => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const key = ((col as any).accessorKey || col.id) as keyof TData
          const header = typeof col.header === "string" ? col.header : col.id || (key as string)
          row[header] = (item[key] as string | number) || ""
        })
        return row
      })
    } catch (error) {
      toast.error("Failed to prepare data for export")
      throw error
    }
  }

  const exportToExcel = async () => {
    setIsExporting(true)
    try {
      const rows = await prepareData()
      const worksheet = XLSX.utils.json_to_sheet(rows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
      XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`)
      toast.success("Excel report exported successfully")
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      const rows = await prepareData()
      const doc = new jsPDF("landscape")

      const headers = exportableColumns.map(col =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof col.header === "string" ? col.header : col.id || (col as any).accessorKey
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = rows.map(row => Object.values(row)) as any[][]

      autoTable(doc, {
        head: [headers as string[]],
        body: body,
        theme: "striped",
        headStyles: {
          fillColor: [60, 195, 163], // #3CC3A3
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold"
        },
        styles: { fontSize: 9 },
        margin: { top: 20 },
        didDrawPage: (data) => {
          doc.text(filename.toUpperCase(), data.settings.margin.left, 15)
        }
      })

      doc.save(`${filename}_${new Date().getTime()}.pdf`)
      toast.success("PDF report exported successfully")
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4 text-rose-600" />
          <span>PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
