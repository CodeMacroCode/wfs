"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CloudUpload, Loader2, X, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUploadDocMutation } from "@/hooks/queries/use-doc-center"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  documentType: z.string().min(1, "Document type is required"),
  customDocumentType: z.string().optional(),
  files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
}).refine((data) => {
  if (data.documentType === "Other" && (!data.customDocumentType || data.customDocumentType.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please specify the document type",
  path: ["customDocumentType"],
});

interface UploadDocDialogProps {
  trigger?: React.ReactNode
}

export function UploadDocDialog({ trigger }: UploadDocDialogProps) {
  const [open, setOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadDocMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      documentType: "",
      customDocumentType: "",
      files: [],
    },
  })

  const docType = useWatch({ control: form.control, name: "documentType" })
  const selectedFiles = useWatch({ control: form.control, name: "files" }) || []

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await uploadMutation.mutateAsync({
        title: values.title,
        documentType: values.documentType === "Other" ? values.customDocumentType! : values.documentType,
        files: values.files,
      })
      setOpen(false)
      form.reset()
    } catch {
      // Error handled in mutation
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const currentFiles = form.getValues("files") || []
      form.setValue("files", [...currentFiles, ...files])
    }
  }

  const removeFile = (index: number) => {
    const currentFiles = form.getValues("files") || []
    const updatedFiles = currentFiles.filter((_, i) => i !== index)
    form.setValue("files", updatedFiles)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="bg-[#2eb88a] hover:bg-[#259b74]">
            <CloudUpload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add new documents to the document center. You can upload multiple files.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Invoice #123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bill">Bill</SelectItem>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                      <SelectItem value="Identity">Identity</SelectItem>
                      <SelectItem value="Agreement">Agreement</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {docType === "Other" && (
              <FormField
                control={form.control}
                name="customDocumentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Document Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        multiple
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-[#2eb88a] transition-colors"
                      >
                        <CloudUpload className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500">
                          Click to select files
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PDF, DOC, JPG, PNG (Max 5MB per file)
                        </p>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 w-full">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 w-full overflow-hidden">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="h-4 w-4 text-[#2eb88a] shrink-0" />
                                <span className="text-xs font-medium truncate">
                                  {file.name}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-rose-500"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={uploadMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2eb88a] hover:bg-[#259b74]"
                disabled={uploadMutation.isPending || selectedFiles.length === 0}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
