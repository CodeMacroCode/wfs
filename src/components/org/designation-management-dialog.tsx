"use client"

import * as React from "react"
import { Pencil, Trash2, Loader2, Briefcase, Building2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  useDesignationsQuery, 
  useCreateDesignationMutation, 
  useUpdateDesignationMutation, 
  useDeleteDesignationMutation,
  useDepartmentsQuery
} from "@/hooks/queries/use-org"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"

interface DesignationManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DesignationManagementDialog({ open, onOpenChange }: DesignationManagementDialogProps) {
  const [name, setName] = React.useState("")
  const [departmentId, setDepartmentId] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  const { data: deptsData } = useDepartmentsQuery()
  const { data: desgsData, isLoading } = useDesignationsQuery()
  
  const createMutation = useCreateDesignationMutation()
  const updateMutation = useUpdateDesignationMutation()
  const deleteMutation = useDeleteDesignationMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !departmentId) {
      toast.error("Name and Department are required")
      return
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: { name, departmentId } })
        toast.success("Designation updated")
      } else {
        await createMutation.mutateAsync({ name, departmentId })
        toast.success("Designation created")
      }
      setName("")
      setDepartmentId("")
      setEditingId(null)
    } catch {
      // Error handled by mutation
    }
  }

  const handleEdit = (desg: { name: string; departmentId: string | { _id: string }; _id: string }) => {
    setName(desg.name)
    setDepartmentId(typeof desg.departmentId === 'string' ? desg.departmentId : desg.departmentId?._id)
    setEditingId(desg._id)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this designation?")) {
      try {
        await deleteMutation.mutateAsync(id)
        toast.success("Designation deleted")
      } catch {
        // Error handled by mutation
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-[28px] border-none shadow-2xl">
        <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Manage Designations</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Add, edit or remove designations from your organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Department</label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {deptsData?.data?.filter(d => d.isActive !== false).map((dept) => (
                    <SelectItem key={dept._id} value={dept._id} className="rounded-lg">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Designation Name</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Designation Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl border-slate-200"
                />
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 px-6 shadow-sm shadow-amber-200"
                >
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </div>

            {editingId && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => { setEditingId(null); setName(""); setDepartmentId(""); }}
                className="w-full rounded-xl h-10 text-slate-500 font-bold"
              >
                Cancel Editing
              </Button>
            )}
          </form>

          <div className="space-y-3">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">All Designations</h4>
            <ScrollArea className="h-[250px] pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
              ) : (
                <div className="space-y-2">
                  {desgsData?.data?.filter(d => d.isActive !== false).map((desg) => (
                    <div 
                      key={desg._id} 
                      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-amber-100 hover:bg-amber-50/30 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{desg.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                          <Building2 className="h-2.5 w-2.5" />
                          {typeof desg.departmentId === 'object' ? desg.departmentId?.name : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(desg)}
                          className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-white rounded-lg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(desg._id)}
                          className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {desgsData?.data?.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm font-medium">
                      No designations found
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
