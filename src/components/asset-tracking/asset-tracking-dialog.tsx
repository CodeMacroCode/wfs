"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Paperclip } from "lucide-react"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  images: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AssetTrackingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { amount: number; description: string; images?: File[] }) => Promise<void>
  isPending?: boolean
}

export function AssetTrackingDialog({ open, onOpenChange, onSubmit, isPending }: AssetTrackingDialogProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      amount: parseFloat(values.amount),
      description: values.description,
      images: selectedFiles.length > 0 ? selectedFiles : undefined
    })
    form.reset()
    setSelectedFiles([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold italic font-heading">Add Tracking Record</DialogTitle>
          </DialogHeader>
          <p className="text-indigo-100 text-sm mt-1 opacity-90">Log repairs, expenses or general maintenance activities.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="p-6 space-y-5 bg-white">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">Expense Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 5000" 
                      type="number" 
                      {...field} 
                      className="rounded-xl bg-slate-50 border-slate-200 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the activity or expense..." 
                      className="rounded-xl bg-slate-50 border-slate-200 focus:ring-indigo-500 min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">Attachments (Images/PDF)</FormLabel>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group"
              >
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-sm font-medium text-slate-500">Click to upload files</span>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-bold border border-indigo-100 animate-in zoom-in-95">
                      <Paperclip className="h-3 w-3" />
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="hover:bg-indigo-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-slate-50">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="rounded-xl font-bold text-slate-500"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 font-bold shadow-lg shadow-indigo-500/20"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
