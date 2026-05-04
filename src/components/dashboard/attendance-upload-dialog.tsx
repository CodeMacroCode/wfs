"use client"

import * as React from "react"
import { 
  CloudUpload, 
  FileSpreadsheet, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAttendanceUpload } from "@/hooks/use-attendance-upload"
import { cn } from "@/lib/utils"

interface AttendanceUploadDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * A premium dialog component for uploading attendance files
 */
export function AttendanceUploadDialog({ trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AttendanceUploadDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const [wasOpenedByDrag, setWasOpenedByDrag] = React.useState(false)

  const {
    selectedFile,
    isUploading,
    isDragging,
    isGlobalDragging,
    progress,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    uploadFile,
    clearFile
  } = useAttendanceUpload()

  // Auto-open when a file is dragged over the page, and auto-close if pull back
  React.useEffect(() => {
    if (isGlobalDragging && !isOpen) {
      setWasOpenedByDrag(true)
      setIsOpen?.(true)
    } else if (!isGlobalDragging && isOpen && wasOpenedByDrag && !selectedFile && !isUploading) {
      // Only auto-close if it was specifically opened by a drag event
      setIsOpen?.(false)
      setWasOpenedByDrag(false)
    }
  }, [isGlobalDragging, isOpen, setIsOpen, selectedFile, isUploading, wasOpenedByDrag])

  const handleConfirmUpload = async () => {
    const success = await uploadFile()
    if (success) {
      // Close dialog after a short delay to show 100% progress
      setTimeout(() => {
        setIsOpen?.(false)
        setWasOpenedByDrag(false)
      }, 800)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />
    }
    return <FileText className="h-10 w-10 text-blue-500" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isUploading) {
        setIsOpen?.(open)
        if (!open) {
          clearFile()
          setWasOpenedByDrag(false)
        }
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex gap-2">
            <CloudUpload className="h-4 w-4" />
            Upload Attendance
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[28px] bg-white/95 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <DialogHeader className="p-8 pb-0 relative z-10">
          <button 
            onClick={() => {
              setIsOpen?.(false)
              clearFile()
              setWasOpenedByDrag(false)
            }}
            disabled={isUploading}
            className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-all p-2 rounded-xl hover:bg-slate-50 disabled:opacity-0 pointer-events-auto z-50"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 italic font-heading">
            Upload Attendance
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Drag and drop your attendance logs below to process workforce data.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 relative z-10">
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
              className={cn(
                "group relative flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed rounded-[24px] cursor-pointer transition-all duration-300",
                isDragging 
                  ? "border-teal-500 bg-teal-50/50 scale-[1.02] shadow-lg shadow-teal-500/10" 
                  : "border-slate-200 hover:border-teal-400 hover:bg-slate-50/50"
              )}
            >
              <div className={cn(
                "h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500",
                isDragging && "scale-110 rotate-3 border-teal-200 shadow-teal-500/10"
              )}>
                <CloudUpload className={cn(
                  "h-8 w-8 text-slate-400 transition-colors duration-300",
                  isDragging ? "text-teal-500" : "group-hover:text-teal-500"
                )} />
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-700">
                  {isDragging ? "Drop your file here" : "Click or drag file to upload"}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                  CSV, XLSX, XLS OR TXT (MAX 10MB)
                </p>
              </div>

              {/* Animated corner accents */}
              <div className="absolute top-4 left-4 h-2 w-2 border-t-2 border-l-2 border-transparent group-hover:border-teal-500/30 transition-colors" />
              <div className="absolute top-4 right-4 h-2 w-2 border-t-2 border-r-2 border-transparent group-hover:border-teal-500/30 transition-colors" />
              <div className="absolute bottom-4 left-4 h-2 w-2 border-b-2 border-l-2 border-transparent group-hover:border-teal-500/30 transition-colors" />
              <div className="absolute bottom-4 right-4 h-2 w-2 border-b-2 border-r-2 border-transparent group-hover:border-teal-500/30 transition-colors" />
            </div>
          ) : (
            <div className="bg-slate-50/80 rounded-[24px] p-6 border border-slate-100 relative overflow-hidden group">
              {isUploading && (
                <div className="absolute bottom-0 left-0 h-1 bg-teal-500 transition-all duration-300 shadow-[0_0_8px_rgba(20,184,166,0.5)]" style={{ width: `${progress}%` }} />
              )}
              
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  {getFileIcon(selectedFile.name)}
                </div>
                
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className="text-sm font-bold text-slate-900 truncate mb-1">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter bg-slate-200/50 px-2 py-0.5 rounded">
                      {formatFileSize(selectedFile.size)}
                    </span>
                    {isUploading ? (
                      <span className="text-[11px] font-bold text-teal-600 flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing... {progress}%
                      </span>
                    ) : progress === 100 ? (
                      <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                        Ready to upload
                      </span>
                    )}
                  </div>
                </div>

                {!isUploading && progress === 0 && (
                  <button 
                    onClick={() => {
                      clearFile()
                      setWasOpenedByDrag(false)
                      setIsOpen?.(false)
                    }}
                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls, .txt"
          />
        </div>

        <DialogFooter className="p-8 pt-0 flex gap-3 sm:justify-end relative z-10">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen?.(false)
              clearFile()
            }}
            disabled={isUploading}
            className="text-slate-400 font-bold hover:bg-slate-50 transition-all px-6 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpload}
            disabled={!selectedFile || isUploading}
            className={cn(
              "px-8 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20",
              selectedFile && !isUploading 
                ? "bg-teal-500 hover:bg-teal-600 text-white scale-105" 
                : "bg-slate-100 text-slate-400 border-none shadow-none"
            )}
          >
            {isUploading ? "Uploading..." : "Start Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
