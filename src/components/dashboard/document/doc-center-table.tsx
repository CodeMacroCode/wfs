"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, FileText, MoreHorizontal, Trash, Download, Files, Plus } from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AddFilesDialog } from "./add-files-dialog"

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
  const deleteMutation = useDeleteDocMutation()
  const deleteFilesMutation = useDeleteFilesMutation()

  const handleViewFile = (fileUrl: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    window.open(`${baseUrl}${fileUrl}`, "_blank")
  }

  const handleDownloadFile = (fileUrl: string, title: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    const fullUrl = `${baseUrl}${fileUrl}`
    const link = document.createElement("a")
    link.href = fullUrl
    const fileName = fileUrl.split("/").pop() || title
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <span className="font-medium">{row.getValue("title")}</span>
        </div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("documentType") as string
        return (
          <Badge variant="outline" className="bg-slate-50">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "files",
      header: "Files",
      cell: ({ row }) => {
        const doc = row.original
        const files = doc.files
        
        return (
          <div className="flex items-center gap-2">
            {!files || files.length === 0 ? (
              <span className="text-slate-400 text-xs">No files</span>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-slate-100">
                    <Files className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold">{files.length} {files.length === 1 ? 'file' : 'files'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Document Files</h4>
                    <AddFilesDialog 
                      documentId={doc._id} 
                      documentTitle={doc.title}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600 hover:bg-emerald-50">
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {files.map((file, idx) => (
                      <div key={idx} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                          <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="text-xs font-medium text-slate-600 truncate">
                            {file.split('/').pop() || `File ${idx + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-slate-400 hover:text-emerald-500"
                            onClick={() => handleViewFile(file)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-slate-400 hover:text-blue-500"
                            onClick={() => handleDownloadFile(file, doc.title)}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-slate-400 hover:text-rose-500"
                            onClick={() => handleDeleteSpecificFile(doc._id, file)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            {(files && files.length === 0) && (
              <AddFilesDialog 
                documentId={doc._id} 
                documentTitle={doc.title}
              />
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const doc = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                 <AddFilesDialog 
                  documentId={doc._id} 
                  documentTitle={doc.title}
                  trigger={
                    <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add More Files
                    </div>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-rose-600 cursor-pointer"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this entire document and all its files?")) {
                    deleteMutation.mutate(doc._id)
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data || []}
      isLoading={isLoading}
      totalItems={totalItems}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      onSearchChange={onSearchChange}
      searchValue={searchValue}
      searchPlaceholder="Search documents by title..."
    />
  )
}
