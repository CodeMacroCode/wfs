"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Check, ChevronsUpDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEmployeesQuery } from "@/hooks/queries/use-employees-query"
import { useAttendancePoliciesQuery } from "@/hooks/queries/use-attendance-policies"
import { AssignRosterDto } from "@/types/roster"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  employeeIds: z.array(z.string()).min(1, "Select at least one employee"),
  shiftId: z.string().min(1, "Select a shift"),
  startDate: z.string().min(1, "Select start date"),
  endDate: z.string().min(1, "Select end date"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

interface RoasterFormProps {
  onSubmit: (data: AssignRosterDto) => void
  isLoading?: boolean
}

export function RoasterForm({ onSubmit, isLoading }: RoasterFormProps) {
  const { data: employeesData } = useEmployeesQuery({ limit: 100 })
  const { data: policiesData } = useAttendancePoliciesQuery()
  const [searchTerm, setSearchTerm] = React.useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeIds: [],
      shiftId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  })

  const selectedEmployeeIds = form.watch("employeeIds")
  
  const filteredEmployees = React.useMemo(() => {
    const employees = employeesData?.data || []
    return employees.filter(emp => 
      (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(emp.uniqueId).includes(searchTerm)
    )
  }, [employeesData, searchTerm])

  const toggleEmployee = (id: string) => {
    const current = form.getValues("employeeIds")
    if (current.includes(id)) {
      form.setValue("employeeIds", current.filter(itemId => itemId !== id))
    } else {
      form.setValue("employeeIds", [...current, id])
    }
  }

  const removeEmployee = (id: string) => {
    form.setValue("employeeIds", selectedEmployeeIds.filter(itemId => itemId !== id))
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Multi-select Employees */}
        <FormField
          control={form.control}
          name="employeeIds"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Employees</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded-xl bg-slate-50/50">
                {selectedEmployeeIds.length === 0 && (
                  <span className="text-slate-400 text-sm py-1 px-2">No employees selected</span>
                )}
                {selectedEmployeeIds.map((id) => {
                  const emp = employeesData?.data.find(e => String(e.uniqueId) === id)
                  return (
                    <Badge 
                      key={id} 
                      variant="secondary" 
                      className="bg-white border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 py-1 px-2 rounded-lg"
                    >
                      {emp?.name || id}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeEmployee(id)}
                      />
                    </Badge>
                  )
                })}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between rounded-xl border-slate-200"
                  >
                    Select Employees
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) p-0 rounded-xl" align="start">
                  <div className="flex items-center border-b px-3 py-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search employee..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 border-none focus-visible:ring-0 px-0 rounded-none bg-transparent"
                    />
                  </div>
                  <ScrollArea className="h-48">
                    <div className="p-1">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.uniqueId}
                          className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          onClick={() => toggleEmployee(String(employee.uniqueId))}
                        >
                          <Checkbox 
                            checked={selectedEmployeeIds.includes(String(employee.uniqueId))}
                            onCheckedChange={() => toggleEmployee(String(employee.uniqueId))}
                            className="rounded-md"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{employee.name || "Unnamed"}</span>
                            <span className="text-xs text-slate-500">{employee.uniqueId}</span>
                          </div>
                        </div>
                      ))}
                      {filteredEmployees.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">
                          No employees found
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Shift Selection */}
        <FormField
          control={form.control}
          name="shiftId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Shift</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select a shift" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {policiesData?.policies.map((policy) => (
                    <SelectItem key={policy._id} value={policy._id} className="rounded-lg">
                      {policy.name} ({policy.shiftInTime} - {policy.shiftOutTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    min={today}
                    {...field} 
                    className="rounded-xl border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    min={form.watch("startDate") || today}
                    {...field} 
                    className="rounded-xl border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#2eb88a] hover:bg-[#259b74] text-white rounded-xl h-11 shadow-sm transition-all active:scale-95"
          disabled={isLoading}
        >
          {isLoading ? "Assigning..." : "Assign Roster"}
        </Button>
      </form>
    </Form>
  )
}
