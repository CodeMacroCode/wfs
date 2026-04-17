"use client";

import React from "react";
import { Employee } from "@/types/employee";
import { User, MapPin, Briefcase, BadgeCheck } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  employee: Employee;
}

export function ProfileHeader({ employee }: ProfileHeaderProps) {
  const apiBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/api$/, "");
  const rawImage = (employee.profileImage || employee.profilePicture) as string | null | undefined;
  const previewUrl = typeof rawImage === "string" && rawImage
    ? rawImage.startsWith("http") ? rawImage : `${apiBase}${rawImage}`
    : null;

  return (
    <div className="relative mb-6">
      {/* Banner */}
      <div className="h-48 w-full rounded-t-2xl bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10 blur-3xl bg-white/20 animate-pulse" />
        <div className="absolute top-4 left-4">
           {/* Backward button could go here if needed */}
        </div>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-8 pb-4">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-4 relative z-10">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
            {previewUrl ? (
              <Image src={previewUrl} alt={employee.name} width={128} height={128} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{employee.name}</h1>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                <BadgeCheck className="w-3.5 h-3.5" />
                Active Employee
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-300" />
                <span>{employee.designation}</span>
              </div>
              <div className="text-slate-300">•</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ID:</span>
                <span className="font-mono text-emerald-600 font-bold">{employee.uniqueId}</span>
              </div>
              <div className="text-slate-300">•</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-300" />
                <span>Chandigarh, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
