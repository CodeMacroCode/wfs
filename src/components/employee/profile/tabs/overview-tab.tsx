"use client";

import React from "react";
import { Employee } from "@/types/employee";
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Users, 
  Mail,
  IdCard,
  Calendar,
  Contact
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface OverviewTabProps {
  employee: Employee;
}

export function OverviewTab({ employee }: OverviewTabProps) {
  return (
    <div className="bg-white m-8 rounded-2xl border shadow-sm overflow-hidden">
      {/* 1. Basic Information Section */}
      <ProfileSection icon={User} title="Basic Information" color="text-emerald-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DataItem label="Full Name" value={employee.name} />
          <DataItem label="Gender" value={employee.gender} />
          <DataItem label="Date of Birth" value={employee.dob ? new Date(employee.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <DataItem label="Blood Group" value={employee.bloodGroup} icon={Heart} />
          <DataItem label="Marital Status" value={employee.maritalStatus} />
          <DataItem label="Other Name" value={employee.otherName || "-"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <DataItem label="Father's Name" value={employee.fatherName} />
          <DataItem label="Mother's Name" value={employee.motherName} />
        </div>
      </ProfileSection>

      <Separator />

      {/* 2. Employment & Background Section */}
      <ProfileSection icon={Briefcase} title="Employment Profile" color="text-blue-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DataItem label="Designation" value={employee.designation} highlight />
          <DataItem label="Department" value={employee.department || "General"} />
          <DataItem label="Date of Joining" value={employee.doj ? new Date(employee.doj).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"} icon={Calendar} />
        </div>
        
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Educational Background</h4>
            {employee.academicQualification?.length ? (
              employee.academicQualification.map((edu, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-emerald-100">
                  <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{edu.degree}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{edu.institute} • {edu.year}</div>
                  </div>
                </div>
              ))
            ) : <NoData text="No academic records found" />}
          </div>

          {/* Work History */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Work Experience</h4>
            {employee.previousWorkExperience?.length ? (
              employee.previousWorkExperience.map((exp, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                  <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{exp.role}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{exp.company} • {exp.years} Years</div>
                  </div>
                </div>
              ))
            ) : <NoData text="No previous experience recorded" />}
          </div>
        </div>
      </ProfileSection>

      <Separator />

      {/* 3. Contact & Identity Section */}
      <ProfileSection icon={Contact} title="Contact & Identity" color="text-rose-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Identity */}
          <div className="space-y-8">
            <DataItem label="Aadhar Number" value={employee.aadharNo} icon={IdCard} isMono />
            <div className="grid grid-cols-2 gap-8">
              <DataItem label="PF Number" value={employee.pfNo || "Not Enrolled"} isMono />
              <DataItem label="ESI Number" value={employee.esiNo || "Not Enrolled"} isMono />
            </div>
            <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
               <div className="flex items-center gap-3 mb-3">
                 <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                   <Phone className="h-3.5 w-3.5" />
                 </div>
                 <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-none">Emergency Contact</span>
               </div>
               <div className="text-sm font-bold text-slate-800">{employee.emergencyContact?.name} ({employee.emergencyContact?.relation})</div>
               <div className="text-xs text-slate-500 mt-1.5 font-bold tracking-tight">{employee.emergencyContact?.phone}</div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <DataItem label="Mobile Number" value={employee.mobileNo} icon={Phone} />
            <DataItem label="Email Address" value={employee.email} icon={Mail} />
            <div className="space-y-6 pt-2">
              <DataItem label="Current Address" value={employee.currentAddress} icon={MapPin} vertical />
              <DataItem label="Permanent Address" value={employee.permanentAddress} icon={MapPin} vertical />
            </div>
          </div>
        </div>
      </ProfileSection>

      <Separator />

      {/* 4. Family Information Section */}
      <ProfileSection icon={Users} title="Family Details" color="text-slate-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employee.familyDetails?.length ? (
            employee.familyDetails.map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-slate-300 hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-slate-50 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{member.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{member.relation}</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border">{member.age} yrs</div>
              </div>
            ))
          ) : <NoData text="No family members recorded" />}
        </div>
        {employee.reference && (
          <div className="mt-10 pt-8 border-t border-dashed">
            <DataItem label="Reference / Referred By" value={employee.reference} vertical />
          </div>
        )}
      </ProfileSection>
    </div>
  );
}

function ProfileSection({ icon: Icon, title, color, children }: { icon: React.ElementType, title: string, color: string, children: React.ReactNode }) {
  return (
    <div className="p-10">
      <div className="flex items-center gap-4 mb-10">
        <div className={cn("p-2.5 rounded-xl bg-slate-50 border shadow-sm", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-900">{title}</h3>
          <div className={cn("h-0.5 w-10 mt-1 rounded-full", color.replace('text', 'bg'))} />
        </div>
      </div>
      <div className="px-2">
        {children}
      </div>
    </div>
  );
}

function DataItem({ label, value, icon: Icon, isMono, highlight, vertical }: { label: string, value: string | number, icon?: React.ElementType, isMono?: boolean, highlight?: boolean, vertical?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-2", vertical && "w-full")}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{label}</span>
      <div className={cn(
        "flex items-center gap-2 text-sm font-bold",
        highlight ? "text-emerald-600" : "text-slate-800"
      )}>
        {Icon && <Icon className="h-4 w-4 text-slate-300 shrink-0" />}
        <span className={cn(
          isMono && "font-mono tracking-wider tabular-nums",
          vertical && "leading-relaxed"
        )}>{value}</span>
      </div>
    </div>
  );
}

function NoData({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
      <span className="text-xs font-medium italic">{text}</span>
    </div>
  );
}
