"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, FileText, MoreHorizontal, Trash, Plus, Bell } from "lucide-react"
import { DocumentItem } from "@/types/doc-center"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useDeleteDocMutation, useDeleteFilesMutation } from "@/hooks/queries/use-doc-center"
import { AddFilesDialog } from "./add-files-dialog"
import { ViewDocDialog } from "./view-doc-dialog"
import { Reminder } from "@/types/reminder"
import { useRemindersQuery, useDeleteReminderMutation } from "@/hooks/queries/use-reminders"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DocCenterTableProps {
  data: DocumentItem[]
  isLoading?: boolean
  totalItems?: number
  pagination: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void
  onSearchChange: (value: string) => void
  searchValue?: string
}

export function DocCenterTable({
  data,
  isLoading,
  totalItems,
  pagination,
  onPaginationChange,
  onSearchChange,
  searchValue,
}: DocCenterTableProps) {
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentItem | null>(null)
  const [viewOpen, setViewOpen] = React.useState(false)

  const deleteMutation = useDeleteDocMutation()
  const deleteFilesMutation = useDeleteFilesMutation()
  const deleteReminderMutation = useDeleteReminderMutation()
  const { data: remindersData } = useRemindersQuery({ limit: 1000000 })

  const reminders = React.useMemo(() => remindersData?.data || [], [remindersData])

  const mergedData = React.useMemo(() => {
    return data.map((doc) => {
      const docKey = doc.metadata?.docKey
      const reminder = reminders.find((r) => 
        r.description?.includes(`DOC_KEY:${docKey}`) || 
        r.metadata?.docKey === docKey
      )
      return { ...doc, reminder }
    })
  }, [data, reminders])

  const getStatus = (expiryDate?: string) => {
    if (!expiryDate) return { label: "N/A", color: "bg-slate-100 text-slate-500" }
    
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    if (diff < 0) return { label: "Expired", color: "bg-rose-100 text-rose-600" }
    if (diff <= 7) return { label: "Expiring Soon", color: "bg-amber-100 text-amber-600" }
    return { label: "Valid", color: "bg-emerald-100 text-emerald-600" }
  }

  const handleViewDoc = (doc: DocumentItem) => {
    setSelectedDoc(doc)
    setViewOpen(true)
  }

  const handleDeleteSpecificFile = (documentId: string, fileUrl: string) => {
    if (confirm("Are you sure you want to delete this specific file?")) {
      deleteFilesMutation.mutate({
        documentId,
        fileUrls: [fileUrl],
      })
    }
  }

  const columns: ColumnDef<DocumentItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-900">{row.getValue("title")}</span>
        </div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("documentType") as string
        return (
          <Badge variant="outline" className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500 border-slate-200">
            {type}
          </Badge>
        )
      },
    },
    {
      id: "expiry",
      header: "Expiry",
      cell: ({ row }) => {
        const doc = row.original
        const expiryDate = doc.metadata?.expiryDate as string | undefined
        return (
          <span className="text-xs font-bold text-slate-600">
            {expiryDate ? format(new Date(expiryDate), "PPP") : "—"}
          </span>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const doc = row.original
        const expiryDate = doc.metadata?.expiryDate as string | undefined
        const status = getStatus(expiryDate)
        return (
          <Badge className={cn("font-bold uppercase text-[10px] border-none shadow-none", status.color)}>
            {status.label}
          </Badge>
        )
      },
    },
    {
      id: "reminder",
      header: "Reminder",
      cell: ({ row }) => {
        const doc = row.original as DocumentItem & { reminder?: Reminder }
        const reminder = doc.reminder
        if (!reminder) return <span className="text-slate-400 text-[10px] italic">No reminder</span>
        
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-700 uppercase italic">
              <Bell className="h-2.5 w-2.5 text-amber-500" />
              {reminder.frequency}
            </div>
            <span className="text-[9px] font-bold text-slate-400">
              Next: {format(new Date(reminder.nextOccurrence || reminder.startDate), "MMM dd")}
            </span>
          </div>
        )
      },
    },
    // {
    //   accessorKey: "files",
    //   header: "Files",
    //   cell: ({ row }) => {
    //     const doc = row.original
    //     const files = doc.files
        
    //     return (
    //       <div className="flex items-center gap-2">
    //         {!files || files.length === 0 ? (
    //           <span className="text-slate-400 text-xs">No files</span>
    //         ) : (
    //           <Popover>
    //             <PopoverTrigger asChild>
    //               <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-slate-100 rounded-lg">
    //                 <Files className="h-3.5 w-3.5 text-slate-400" />
    //                 <span className="text-xs font-bold text-slate-600">{files.length} {files.length === 1 ? 'file' : 'files'}</span>
    //               </Button>
    //             </PopoverTrigger>
    //             <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-none overflow-hidden" align="start">
    //               <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
    //                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Files</h4>
    //                 <AddFilesDialog 
    //                   documentId={doc._id} 
    //                   documentTitle={doc.title}
    //                   trigger={
    //                     <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600 hover:bg-emerald-50 rounded-full">
    //                       <Plus className="h-4 w-4" />
    //                     </Button>
    //                   }
    //                 />
    //               </div>
    //               <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
    //                 {files.map((file, idx) => (
    //                   <div key={idx} className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
    //                     <div className="flex items-center gap-2 overflow-hidden mr-2">
    //                       <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
    //                       <span className="text-xs font-bold text-slate-600 truncate">
    //                         {file.split('/').pop() || `File ${idx + 1}`}
    //                       </span>
    //                     </div>
    //                     <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
    //                       <Button 
    //                         variant="ghost" 
    //                         size="icon" 
    //                         className="h-7 w-7 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-full"
    //                         onClick={() => handleViewFile(file)}
    //                       >
    //                         <Eye className="h-3.5 w-3.5" />
    //                       </Button>
    //                       <Button 
    //                         variant="ghost" 
    //                         size="icon" 
    //                         className="h-7 w-7 text-slate-400 hover:text-blue-500 hover:bg-white rounded-full"
    //                         onClick={() => handleDownloadFile(file, doc.title)}
    //                       >
    //                         <Download className="h-3.5 w-3.5" />
    //                       </Button>
    //                       <Button 
    //                         variant="ghost" 
    //                         size="icon" 
    //                         className="h-7 w-7 text-slate-400 hover:text-rose-500 hover:bg-white rounded-full"
    //                         onClick={() => handleDeleteSpecificFile(doc._id, file)}
    //                       >
    //                         <Trash className="h-3.5 w-3.5" />
    //                       </Button>
    //                     </div>
    //                   </div>
    //                 ))}
    //               </div>
    //             </PopoverContent>
    //           </Popover>
    //         )}
            
    //         {(files && files.length === 0) && (
    //           <AddFilesDialog 
    //             documentId={doc._id} 
    //             documentTitle={doc.title}
    //           />
    //         )}
    //       </div>
    //     )
    //   },
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const doc = row.original

        return (
          <div className="flex items-center gap-1">
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
              onClick={() => handleViewDoc(doc)}
            >
              <Eye className="h-4 w-4" />
            </Button> */}
            {/* <EditDocDialog document={doc} /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Actions</DropdownMenuLabel>
                <DropdownMenuItem 
                  className="px-3 py-2 cursor-pointer font-bold text-slate-600 focus:bg-emerald-50 focus:text-emerald-600"
                  onClick={() => handleViewDoc(doc)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <EditDocDialog 
                    document={doc}
                    trigger={
                      <div className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 rounded-sm w-full font-bold text-slate-600">
                        <Pencil className="mr-2 h-4 w-4 text-[#2eb88a]" />
                        Edit Document
                      </div>
                    }
                  />
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                   <AddFilesDialog 
                    documentId={doc._id} 
                    documentTitle={doc.title}
                    trigger={
                      <div className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 rounded-sm w-full font-bold text-slate-600">
                        <Plus className="mr-2 h-4 w-4 text-[#2eb88a]" />
                        Add More Files
                      </div>
                    }
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuItem
                  className="px-3 py-2 text-rose-600 cursor-pointer font-bold focus:bg-rose-50 focus:text-rose-600"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this entire document and all its files?")) {
                      const docWithReminder = mergedData.find(d => d._id === doc._id)
                      if (docWithReminder?.reminder?._id) {
                        deleteReminderMutation.mutate(docWithReminder.reminder._id)
                      }
                      deleteMutation.mutate(doc._id)
                    }
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={mergedData}
        isLoading={isLoading}
        totalItems={totalItems}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        searchPlaceholder="Search documents by title..."
      />
      {selectedDoc && (
        <ViewDocDialog
          document={selectedDoc}
          open={viewOpen}
          onOpenChange={setViewOpen}
          onDeleteFile={(fileUrl) => handleDeleteSpecificFile(selectedDoc._id, fileUrl)}
        />
      )}
    </>
  )
}
