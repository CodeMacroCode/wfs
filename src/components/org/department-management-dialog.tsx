"use client"

import * as React from "react"
import { Pencil, Trash2, Loader2, Building2 } from "lucide-react"
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
  useDepartmentsQuery, 
  useCreateDepartmentMutation, 
  useUpdateDepartmentMutation, 
  useDeleteDepartmentMutation 
} from "@/hooks/queries/use-org"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface DepartmentManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentManagementDialog({ open, onOpenChange }: DepartmentManagementDialogProps) {
  const [name, setName] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  const { data: deptsData, isLoading } = useDepartmentsQuery()
  const createMutation = useCreateDepartmentMutation()
  const updateMutation = useUpdateDepartmentMutation()
  const deleteMutation = useDeleteDepartmentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: { name } })
        toast.success("Department updated")
      } else {
        await createMutation.mutateAsync({ name })
        toast.success("Department created")
      }
      setName("")
      setEditingId(null)
    } catch {
      // Error handled by mutation
    }
  }

  const handleEdit = (dept: { _id: string, name: string }) => {
    setName(dept.name)
    setEditingId(dept._id)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteMutation.mutateAsync(id)
        toast.success("Department deleted")
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
            <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Manage Departments</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Add, edit or remove departments from your organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-slate-200"
            />
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-11 px-6 shadow-sm shadow-teal-200"
            >
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => { setEditingId(null); setName(""); }}
                className="rounded-xl h-11"
              >
                Cancel
              </Button>
            )}
          </form>

          <div className="space-y-3">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">All Departments</h4>
            <ScrollArea className="h-[300px] pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
              ) : (
                <div className="space-y-2">
                  {deptsData?.data?.filter(d => d.isActive !== false).map((dept) => (
                    <div 
                      key={dept._id} 
                      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-teal-100 hover:bg-teal-50/30 transition-all"
                    >
                      <span className="font-bold text-slate-700">{dept.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(dept)}
                          className="h-8 w-8 text-slate-400 hover:text-teal-600 hover:bg-white rounded-lg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(dept._id)}
                          className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {deptsData?.data?.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm font-medium">
                      No departments found
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
