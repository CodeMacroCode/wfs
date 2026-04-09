"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { RegisterEmployeeDto } from "@/types/employee"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["user", "hr", "admin"] as const),
  empCode: z.string().min(1, "EMP Code is required"),
  otherName: z.string().optional(),
  category: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"] as const),
  fathersName: z.string().min(1, "Father's name is required"),
  mothersName: z.string().min(1, "Mother's name is required"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"] as const),
  spouseName: z.string().optional(),
  familyDetails: z.string().optional(),
  dob: z.string().min(1, "D.O.B is required"),
  bloodGroup: z.string().min(1, "Blood Group is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  reference: z.string().optional(),
  academicQualification: z.string().min(1, "Qualification is required"),
  previousExperience: z.string().optional(),
  interviewDate: z.string().optional(),
  competencyCriteriaMet: z.enum(["Yes", "No"] as const),
  designation: z.string().min(1, "Designation is required"),
  workingHours: z.string().min(1, "Working hours are required"),
  aadharNo: z.string().min(1, "Aadhar No is required"),
  pfNo: z.string().optional(),
  esiNo: z.string().optional(),
  doj: z.string().min(1, "D.O.J is required"),
  doe: z.string().optional(),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  currentAddress: z.string().min(1, "Current address is required"),
  mobileNo: z.string().min(1, "Mobile No is required"),
})

interface EmployeeFormProps {
  initialValues?: Partial<RegisterEmployeeDto>
  onSubmit: (data: RegisterEmployeeDto) => void
  isLoading?: boolean
  isEdit?: boolean
}

export function EmployeeForm({ 
  initialValues, 
  onSubmit, 
  isLoading,
  isEdit = false 
}: EmployeeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      password: initialValues?.password || (isEdit ? undefined : ""), 
      role: initialValues?.role || "user",
      empCode: initialValues?.empCode || "",
      otherName: initialValues?.otherName || "",
      category: initialValues?.category || "",
      gender: initialValues?.gender || "Male",
      fathersName: initialValues?.fathersName || "",
      mothersName: initialValues?.mothersName || "",
      maritalStatus: initialValues?.maritalStatus || "Single",
      spouseName: initialValues?.spouseName || "",
      familyDetails: initialValues?.familyDetails || "",
      dob: initialValues?.dob || "",
      bloodGroup: initialValues?.bloodGroup || "",
      emergencyContact: initialValues?.emergencyContact || "",
      reference: initialValues?.reference || "",
      academicQualification: initialValues?.academicQualification || "",
      previousExperience: initialValues?.previousExperience || "",
      interviewDate: initialValues?.interviewDate || "",
      competencyCriteriaMet: initialValues?.competencyCriteriaMet || "Yes",
      designation: initialValues?.designation || "",
      workingHours: initialValues?.workingHours || "",
      aadharNo: initialValues?.aadharNo || "",
      pfNo: initialValues?.pfNo || "",
      esiNo: initialValues?.esiNo || "",
      doj: initialValues?.doj || "",
      doe: initialValues?.doe || "",
      permanentAddress: initialValues?.permanentAddress || "",
      currentAddress: initialValues?.currentAddress || "",
      mobileNo: initialValues?.mobileNo || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as RegisterEmployeeDto))} className="space-y-6">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            {/* Section 1: Professional Access */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">1. Professional & Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="empCode" render={({ field }) => (
                  <FormItem><FormLabel>EMP CODE</FormLabel><FormControl><Input placeholder="E101" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="designation" render={({ field }) => (
                  <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="Manager" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="doj" render={({ field }) => (
                  <FormItem><FormLabel>D.O.J (Joining)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="doe" render={({ field }) => (
                  <FormItem><FormLabel>D.O.E (Exit)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>System Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl><SelectContent><SelectItem value="user">User</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="workingHours" render={({ field }) => (
                  <FormItem><FormLabel>Working Hours</FormLabel><FormControl><Input placeholder="9 AM - 6 PM" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john@example.com" {...field} disabled={isEdit} /></FormControl><FormMessage /></FormItem>
                )} />
                {!isEdit && (
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                )}
              </div>
            </div>

            <Separator />

            {/* Section 2: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">2. Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="otherName" render={({ field }) => (
                  <FormItem><FormLabel>Other Name</FormLabel><FormControl><Input placeholder="Alias" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                  <FormItem><FormLabel>Blood Group</FormLabel><FormControl><Input placeholder="O+" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="General/OBC/etc" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                  <FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Married">Married</SelectItem><SelectItem value="Divorced">Divorced</SelectItem><SelectItem value="Widowed">Widowed</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="spouseName" render={({ field }) => (
                  <FormItem><FormLabel>Spouse Name</FormLabel><FormControl><Input placeholder="If married" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <Separator />

            {/* Section 3: Family & Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">3. Family & Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="fathersName" render={({ field }) => (
                  <FormItem><FormLabel>Father&apos;s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="mothersName" render={({ field }) => (
                  <FormItem><FormLabel>Mother&apos;s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="mobileNo" render={({ field }) => (
                  <FormItem><FormLabel>Mobile No</FormLabel><FormControl><Input placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContact" render={({ field }) => (
                  <FormItem><FormLabel>Emergency Contact</FormLabel><FormControl><Input placeholder="Name / Phone" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="familyDetails" render={({ field }) => (
                <FormItem><FormLabel>Family Details</FormLabel><FormControl><Input placeholder="Dependents, etc." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reference" render={({ field }) => (
                <FormItem><FormLabel>Reference (If any)</FormLabel><FormControl><Input placeholder="Referred by..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="currentAddress" render={({ field }) => (
                <FormItem><FormLabel>Current/Temporary Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                <FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />

            {/* Section 4: Documentation & Education */}
            <div className="space-y-4 pb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">4. Documentation & Qualification</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="academicQualification" render={({ field }) => (
                  <FormItem><FormLabel>Academic Qualification</FormLabel><FormControl><Input placeholder="Degree / Diploma" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="previousExperience" render={({ field }) => (
                  <FormItem><FormLabel>Previous Experience</FormLabel><FormControl><Input placeholder="Years / Companies" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="interviewDate" render={({ field }) => (
                  <FormItem><FormLabel>Date of Interview</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="competencyCriteriaMet" render={({ field }) => (
                  <FormItem><FormLabel>Competency Met?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="aadharNo" render={({ field }) => (
                  <FormItem><FormLabel>Aadhar NO</FormLabel><FormControl><Input placeholder="12 Digit No" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pfNo" render={({ field }) => (
                  <FormItem><FormLabel>PF NO.</FormLabel><FormControl><Input placeholder="PF Number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="esiNo" render={({ field }) => (
                  <FormItem><FormLabel>ESI NO.</FormLabel><FormControl><Input placeholder="ESI Number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" className="bg-[#2eb88a] hover:bg-[#259b74]" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Employee" : "Register Employee"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
