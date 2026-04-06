"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    PayrollPolicyDialog
} from "@/components/dashboard/payroll-policy-dialog"
import { usePayrollPoliciesQuery } from "@/hooks/queries/use-payroll-policies"
import { PayrollPolicyTable } from "./payroll-policy-table"

export default function PayrollPoliciesPage() {
    const { data, isLoading, refetch, isFetching } = usePayrollPoliciesQuery()

    return (
        <div className="flex flex-col gap-6 p-2 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic font-heading">Payroll Policies</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Define and manage payroll heads and ESI/PF structures for your team.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isLoading || isFetching}
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 w-10 rounded-xl shadow-sm transition-all active:scale-95 border-none bg-white p-0"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <PayrollPolicyDialog />
                </div>
            </div>

            <PayrollPolicyTable
                data={data?.data || []}
                isLoading={isLoading}
            />
        </div>
    )
}