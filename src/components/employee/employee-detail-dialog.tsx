"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useEmployeeQuery } from "@/hooks/queries/use-employees-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Users, 
  ShieldCheck, 
  Calendar,
  Clock,
  IdCard,
  Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AcademicQualification, WorkExperience, FamilyMember } from "@/types/employee"

interface EmployeeDetailDialogProps {
  employeeId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeDetailDialog({ employeeId, open, onOpenChange }: EmployeeDetailDialogProps) {
  const { data: employee, isLoading } = useEmployeeQuery(employeeId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[96vw] w-[96vw] h-[96vh] p-0 overflow-hidden border-none shadow-2xl bg-[#f8fafc] rounded-2xl">
       

        <ScrollArea className="flex-1 max-h-[calc(96vh-160px)] p-8">
          {isLoading ? (
            <DetailSkeleton />
          ) : employee ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: Personal & Bio */}
              <div className="space-y-8">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <SectionHeader icon={User} title="Personal Details" color="text-emerald-500" />
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <DataItem label="Full Name" value={employee.name} />
                       <DataItem label="Unique ID" value={employee.uniqueId} highlight isMono />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <DataItem label="System Role" value={employee.role} highlight />
                       <DataItem label="Other Name" value={employee.otherName || "-"} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <DataItem label="D.O.B" value={employee.dob ? new Date(employee.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"} />
                       <DataItem label="Blood Group" value={employee.bloodGroup} icon={Heart} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <DataItem label="Gender" value={employee.gender} />
                       <DataItem label="Marital Status" value={employee.maritalStatus} />
                    </div>
                    <DataItem label="Father's Name" value={employee.fatherName} />
                    <DataItem label="Mother's Name" value={employee.motherName} />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <SectionHeader icon={MapPin} title="Addresses" color="text-indigo-500" />
                  <CardContent className="p-6 space-y-6">
                    <DataItem label="Current Address" value={employee.currentAddress} vertical />
                    <DataItem label="Permanent Address" value={employee.permanentAddress} vertical />
                    <DataItem label="Reference" value={employee.reference || "-"} vertical />
                  </CardContent>
                </Card>
              </div>

              {/* Column 2: Professional & History */}
              <div className="space-y-8">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <SectionHeader icon={Briefcase} title="Professional Profile" color="text-blue-500" />
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <DataItem label="Date of Joining" value={employee.doj ? new Date(employee.doj).toLocaleDateString() : "-"} icon={Calendar} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Status</span>
                          <span className="text-sm font-bold text-emerald-900">Active / Competency Met</span>
                       </div>
                       <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                   <SectionHeader icon={GraduationCap} title="Academic & Experience" color="text-amber-500" />
                   <CardContent className="p-6 space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Education</h4>
                        {employee.academicQualification && employee.academicQualification.length > 0 ? (
                           employee.academicQualification.map((edu: AcademicQualification, index: number) => (
                             <div key={index} className="relative pl-6 border-l-2 border-amber-100 pb-4 last:pb-0">
                               <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-amber-400" />
                               <div className="text-sm font-bold text-slate-800">{edu.degree}</div>
                               <div className="text-[11px] text-slate-500">{edu.institute} • {edu.year}</div>
                             </div>
                           ))
                        ) : <div className="text-xs text-slate-400 italic">No academic history</div>}
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work History</h4>
                        {employee.previousWorkExperience && employee.previousWorkExperience.length > 0 ? (
                           employee.previousWorkExperience.map((exp: WorkExperience, index: number) => (
                             <div key={index} className="relative pl-6 border-l-2 border-slate-200 pb-4 last:pb-0">
                               <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-300" />
                               <div className="text-sm font-bold text-slate-800">{exp.role}</div>
                               <div className="text-[11px] text-slate-500">{exp.company} • {exp.years} Years</div>
                             </div>
                           ))
                        ) : <div className="text-xs text-slate-400 italic">No previous experience</div>}
                      </div>
                   </CardContent>
                </Card>
              </div>

              {/* Column 3: Contact, Family & ID */}
              <div className="space-y-8">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <SectionHeader icon={Phone} title="Contact & Emergency" color="text-rose-500" />
                  <CardContent className="p-6 space-y-6">
                    <DataItem label="Mobile Number" value={employee.mobileNo} icon={Phone} />
                    <DataItem label="Email Address" value={employee.email} icon={Mail} />
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                       <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tight block mb-2">Emergency Contact</span>
                       <div className="text-sm font-bold text-slate-800">{employee.emergencyContact?.name} ({employee.emergencyContact?.relation})</div>
                       <div className="text-xs text-slate-500 mt-1">{employee.emergencyContact?.phone}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <SectionHeader icon={IdCard} title="Statutory IDs" color="text-slate-500" />
                  <CardContent className="p-6 space-y-6">
                    <DataItem label="Aadhar Number" value={employee.aadharNo} icon={IdCard} isMono />
                    <div className="grid grid-cols-2 gap-6">
                       <DataItem label="PF Number" value={employee.pfNo || "-"} isMono />
                       <DataItem label="ESI Number" value={employee.esiNo || "-"} isMono />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <SectionHeader icon={Users} title="Family Members" color="text-slate-500" />
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {employee.familyDetails && employee.familyDetails.length > 0 ? (
                         employee.familyDetails.map((member: FamilyMember) => (
                           <div key={member._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                             <div className="text-sm font-bold text-slate-800">{member.name}</div>
                             <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{member.relation} • {member.age} yrs</div>
                           </div>
                         ))
                       ) : <div className="text-xs text-slate-400 italic">No family recorded</div>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-300">
              <User className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-xl font-medium">Failed to load employee details</p>
            </div>
          )}
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-5 bg-white border-t flex items-center justify-between shrink-0">
           <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Last updated: {employee?.updatedAt ? new Date(employee.updatedAt).toLocaleString() : "Recently"}
           </div>
           <Button 
            className="bg-[#3CC3A3] hover:bg-[#2eb88a] text-white px-8 rounded-xl font-bold transition-all shadow-md shadow-[#3CC3A3]/20"
            onClick={() => onOpenChange(false)}
           >
             Close Profile
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SectionHeader({ icon: Icon, title, color }: { icon: React.ElementType, title: string, color: string }) {
  return (
    <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
      <div className={cn("p-2 rounded-lg bg-slate-50", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</CardTitle>
    </div>
  )
}

function DataItem({ 
  label, 
  value, 
  icon: Icon, 
  isMono, 
  highlight, 
  subValue,
  vertical 
}: { 
  label: string, 
  value: string | number, 
  icon?: React.ElementType, 
  isMono?: boolean, 
  highlight?: boolean,
  subValue?: string,
  vertical?: boolean
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", vertical && "w-full")}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      <div className="flex flex-col">
        <div className={cn(
          "flex items-center gap-2 text-sm font-bold leading-tight",
          highlight ? "text-[#3CC3A3]" : "text-slate-800",
          isMono && "font-mono tracking-wider tabular-nums"
        )}>
          {Icon && <Icon className="h-4 w-4 text-slate-300 shrink-0" />}
          <span className="truncate">{value}</span>
        </div>
        {subValue && <span className="text-xs text-slate-400 font-medium ml-6">{subValue}</span>}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((col) => (
        <div key={col} className="space-y-8">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[250px] w-full rounded-2xl" />
        </div>
      ))}
    </div>
  )
}
