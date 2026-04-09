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
  useUpdateEmployeeMutation
} from "@/hooks/queries/use-employees-query"
import { Employee, RegisterEmployeeDto } from "@/types/employee"

export function RegisterEmployeeDialog() {
  const [open, setOpen] = React.useState(false)
  const { mutate: register, isPending } = useRegisterEmployeeMutation()

  const onSubmit = (data: RegisterEmployeeDto) => {
    register(data, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#2eb88a] hover:bg-[#259b74] text-white cursor-pointer">
          Add Employee
        </Button>
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
  const { mutate: update, isPending } = useUpdateEmployeeMutation()

  if (!employee) return null

  const onSubmit = (data: RegisterEmployeeDto) => {
    update(
      { id: employee.id, data },
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
        <EmployeeForm
          initialValues={employee}
          onSubmit={onSubmit}
          isLoading={isPending}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  )
}
