"use client"

import * as React from "react"
import { useRemindersQuery } from "@/hooks/queries/use-reminders"
import { ReminderTable } from "@/components/dashboard/reminder/reminder-table"
import { AddReminderDialog } from "@/components/dashboard/reminder/add-reminder-dialog"

export default function RemindersPage() {
    const { data, isLoading } = useRemindersQuery({ limit: 1000000 })

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic font-heading">
                        Reminders
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage your notification schedules and task reminders.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <AddReminderDialog />
                </div>
            </div>


            <ReminderTable
                data={data?.data || []}
                isLoading={isLoading}
            />
        </div>
    )
}