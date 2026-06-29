"use client";

import React from "react";
import { Employee } from "@/types/employee";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Package, Shield, Calendar, Tag, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetsTabProps {
  employee: Employee;
}

export function AssetsTab({ employee }: AssetsTabProps) {
  const assets = employee.assets || [];

  return (
    <div className="p-8 bg-slate-50/50 space-y-8">
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Assigned Assets & Equipment
          </CardTitle>
          <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full">
            {assets.length} {assets.length === 1 ? "Asset" : "Assets"}
          </span>
        </div>
        <CardContent className="p-6">
          {assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="bg-slate-50 p-4 rounded-full mb-4 border border-slate-100">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-md font-bold text-slate-700">No Assets Issued</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm text-center">
                This employee does not currently have any company-issued tools, gear, or devices.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-4">Asset Details</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Serial / Specs</th>
                    <th className="pb-3">Issued Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assets.map((asset) => {
                    const formattedDate = asset.issuedDate
                      ? new Date(asset.issuedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A";

                    return (
                      <tr
                        key={asset._id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 pl-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-[#2eb88a]">
                              <Shield className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block">{asset.name}</span>
                              {asset.extraNote && (
                                <span className="text-[11px] font-normal text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Info className="w-3 h-3" /> {asset.extraNote}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-slate-600 font-medium">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {asset.type}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-xs text-slate-500 font-semibold">
                          {asset.serialNumber || "N/A"}
                        </td>
                        <td className="py-4 text-slate-600 font-medium">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formattedDate}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              asset.status === "Issued"
                                ? "bg-emerald-50 text-emerald-700"
                                : asset.status === "Returned"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {asset.status === "Issued" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
