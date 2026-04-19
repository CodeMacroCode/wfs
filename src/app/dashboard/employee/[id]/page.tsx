"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEmployeeQuery } from "@/hooks/queries/use-employees-query";
import { ProfileHeader } from "@/components/employee/profile/profile-header";
import { ProfileTabs, TabType } from "@/components/employee/profile/profile-tabs";
import { OverviewTab } from "@/components/employee/profile/tabs/overview-tab";
import { DocumentsTab } from "@/components/employee/profile/tabs/doc-tab";
import { AttendanceTab } from "@/components/employee/profile/tabs/attendance-tab";
import { LeavesTab } from "@/components/employee/profile/tabs/leaves-tab";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const idValue = params.id;
  const employeeId = Array.isArray(idValue) ? idValue[0] : idValue as string;
  const { data: employee, isLoading, error } = useEmployeeQuery(employeeId);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
        <p className="mb-6">The employee you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 pb-12">
      {/* Top Bar for specific actions/navigation if needed */}
      <div className="px-8 py-4 bg-white/50 border-b flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-900 font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <ProfileHeader employee={employee} />
          <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
          
          <div className="min-h-[400px]">
            {activeTab === "overview" && <OverviewTab employee={employee} />}
            {activeTab === "documents" && <DocumentsTab employee={employee} />}
            {activeTab === "i-card" && <DocumentsTab employee={employee} />}
            {activeTab === "attendance" && <AttendanceTab employeeId={employeeId} />}
            {activeTab === "leaves" && <LeavesTab employeeId={employeeId} />}
            
            {(activeTab !== "overview" && activeTab !== "documents" && activeTab !== "i-card" && activeTab !== "attendance" && activeTab !== "leaves") && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-300">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2eb88a]" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">Loading {activeTab} information...</h3>
                <p className="text-sm">This module is being initialized.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="flex gap-6 items-end -mt-12 px-8">
        <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
        <div className="flex-1 space-y-3 pb-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <div className="border-b px-8 flex gap-8 py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[400px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
