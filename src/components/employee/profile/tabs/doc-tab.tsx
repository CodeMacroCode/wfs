"use client";

import React from "react";
import { Employee } from "@/types/employee";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FileText, Download, User, ShieldCheck, Eye } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DocumentsTabProps {
  employee: Employee;
}

const IMAGE_REGEX = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i;

export function DocumentsTab({ employee }: DocumentsTabProps) {
  const apiBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/api$/, "");

  const rawImage = (employee.profileImage || employee.profilePicture) as string | null | undefined;
  const profileUrl =
    typeof rawImage === "string" && rawImage
      ? rawImage.startsWith("http")
        ? rawImage
        : `${apiBase}${rawImage}`
      : null;

  // API returns otherDocuments array with a `file` path already populated
  const docs = (
    employee as unknown as {
      otherDocuments?: { title: string; file: string; _id: string }[];
    }
  ).otherDocuments;

  const getFileUrl = (filePath: string) =>
    filePath.startsWith("http") ? filePath : `${apiBase}${filePath}`;

  const isImageFile = (filePath: string) =>
    IMAGE_REGEX.test(filePath) || filePath.startsWith("/api/uploads/");

  return (
    <div className="p-8 bg-slate-50/50 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* I-Card Preview */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Digital I-Card Preview
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold border-emerald-100 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="w-3 h-3 mr-2" /> Download
            </Button>
          </div>
          <CardContent className="p-8 flex justify-center">
            <div className="w-[320px] h-[500px] bg-white rounded-[2rem] shadow-2xl border relative overflow-hidden flex flex-col items-center p-6 text-center">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-emerald-500 to-teal-600" />

              <div className="mt-8 relative z-10 w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 mb-6 shrink-0">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={employee.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-4 text-slate-300" />
                )}
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{employee.name}</h3>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                  {employee.designation || employee.designationId?.name || "Employee"}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {employee.department || employee.departmentId?.name || "Engineering"}
                </p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-4 space-y-3 mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Employee ID</span>
                  <span className="text-slate-900">{employee.uniqueId}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t pt-2">
                  <span>Joined Date</span>
                  <span className="text-slate-900">
                    {employee.doj ? new Date(employee.doj).toLocaleDateString() : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t pt-2">
                  <span>Blood Group</span>
                  <span className="text-rose-500">{employee.bloodGroup}</span>
                </div>
              </div>

              <div className="mt-auto flex flex-col items-center">
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
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Statutory Documents
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {docs?.length ? (
                docs.map((doc, idx) => {
                  const fileUrl = doc.file ? getFileUrl(doc.file) : null;
                  const isImg = doc.file ? isImageFile(doc.file) : false;

                  return (
                    <div
                      key={doc._id || idx}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#2eb88a]/40 hover:bg-emerald-50/20 transition-all group"
                    >
                      {/* Thumbnail or icon */}
                      <div className="h-14 w-14 rounded-xl border overflow-hidden bg-white shadow-sm flex-shrink-0 flex items-center justify-center relative">
                        {isImg && fileUrl ? (
                          <Image
                            src={fileUrl}
                            alt={doc.title || "Document"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <FileText className="w-6 h-6 text-slate-300 group-hover:text-[#2eb88a] transition-colors" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">
                          {doc.title || `Document ${idx + 1}`}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {isImg ? "Image file" : "Document file"}
                        </p>
                      </div>

                      {/* View button */}
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#2eb88a] hover:bg-[#2eb88a]/10 transition-colors flex-shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-300 font-medium px-3">No file</span>
                      )}
                    </div>
                  );
                })
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
