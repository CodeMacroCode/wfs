"use client";

import React from "react";
import { Employee } from "@/types/employee";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FileText, Download, User, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsTabProps {
  employee: Employee;
}

export function DocumentsTab({ employee }: DocumentsTabProps) {
  const profileUrl = typeof employee.profilePicture === 'string' ? employee.profilePicture : null;

  return (
    <div className="p-8 bg-slate-50/50 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* I-Card Preview */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Digital I-Card Preview</CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-emerald-100 text-emerald-600 hover:bg-emerald-50">
              <Download className="w-3 h-3 mr-2" /> Download
            </Button>
          </div>
          <CardContent className="p-8 flex justify-center">
            {/* Minimalist I-Card UI */}
            <div className="w-[320px] h-[500px] bg-white rounded-[2rem] shadow-2xl border relative overflow-hidden flex flex-col items-center p-6 text-center">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-emerald-500 to-teal-600" />
              
              <div className="mt-8 relative z-10 w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 mb-6 shrink-0">
                {profileUrl ? (
                  <img src={profileUrl} alt={employee.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-4 text-slate-300" />
                )}
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{employee.name}</h3>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{employee.designation}</p>
                <p className="text-xs text-slate-400 font-medium">{employee.department || "Engineering"}</p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-4 space-y-3 mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Employee ID</span>
                  <span className="text-slate-900">{employee.uniqueId}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t pt-2">
                  <span>Joined Date</span>
                  <span className="text-slate-900">{employee.doj ? new Date(employee.doj).toLocaleDateString() : "-"}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t pt-2">
                  <span>Blood Group</span>
                  <span className="text-rose-500">{employee.bloodGroup}</span>
                </div>
              </div>

              <div className="mt-auto flex flex-col items-center">
                <QrCode className="w-16 h-16 text-slate-900 mb-2 opacity-80" />
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  VERIFIED BY GOYAL ENTERPRISES
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Documents */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <div className="border-b px-6 py-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Statutory Documents</CardTitle>
          </div>
          <CardContent className="p-6">
             <div className="space-y-4">
               {employee.documents?.length ? (
                 employee.documents.map((doc, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-hover hover:border-[#2eb88a]/30 group">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center text-slate-400 shadow-sm group-hover:text-[#2eb88a] transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{doc.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Click to view document</p>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-[#2eb88a] font-bold">View</a>
                     </Button>
                   </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                   <FileText className="w-12 h-12 mb-2 opacity-20" />
                   <p className="text-sm font-medium">No documents uploaded</p>
                 </div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
