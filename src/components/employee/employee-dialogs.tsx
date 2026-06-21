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

import { EmployeeForm } from "./employee-form"
import {
  useRegisterEmployeeMutation,
  useUpdateEmployeeMutation,
  useEmployeeQuery
} from "@/hooks/queries/use-employees-query"
import { Employee, RegisterEmployeeDto } from "@/types/employee"
import { Loader2 } from "lucide-react"

export function RegisterEmployeeDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const { mutate: register, isPending } = useRegisterEmployeeMutation()

  const onSubmit = (data: RegisterEmployeeDto | FormData) => {
    register(data, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#2eb88a] hover:bg-[#259b74] text-white cursor-pointer">
            Add Employee
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Register New Employee</DialogTitle>
        </DialogHeader>
        <EmployeeForm onSubmit={onSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  )
}

interface EditEmployeeDialogProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditEmployeeDialog({ employee, open, onOpenChange }: EditEmployeeDialogProps) {
  const employeeId = employee?.id || employee?._id || null
  const { data: fullEmployee, isLoading: isFetchingEmployee } = useEmployeeQuery(open ? employeeId : null)
  const { mutate: update, isPending } = useUpdateEmployeeMutation()

  if (!employee) return null

  const onSubmit = (data: RegisterEmployeeDto | FormData) => {
    update(
      { id: employeeId || "", data },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Employee Details</DialogTitle>
        </DialogHeader>
        {isFetchingEmployee ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              <p className="text-sm text-slate-500 font-medium">Loading details...</p>
            </div>
          </div>
        ) : (
          <EmployeeForm
            initialValues={fullEmployee || employee}
            onSubmit={onSubmit}
            isLoading={isPending}
            isEdit={true}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

