"use client"

import * as React from "react"
import { Filter, Download, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Asset, AssetType, CreateAssetDto } from "@/types/asset"
import { AssetTable } from "@/components/asset-tracking/asset-table"
import { IssueAssetDialog, EditAssetDialog } from "@/components/asset-tracking/asset-dialogs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useAssetsQuery, useCreateAssetMutation, useUpdateAssetMutation, useDeleteAssetMutation } from "@/hooks/queries/use-assets-query"
import { useDebounce } from "@/hooks/use-debounce"

// Remove unused TODAY constant

export default function AssetTrackingPage() {
    const [typeFilter, setTypeFilter] = React.useState<AssetType | "All">("All")
    const [searchTerm, setSearchTerm] = React.useState("")
    const debouncedSearch = useDebounce(searchTerm, 500)

    const { data: response, isLoading } = useAssetsQuery({
        search: debouncedSearch,
        type: typeFilter === "All" ? undefined : typeFilter
    })
    const assets = response?.data || []

    const createMutation = useCreateAssetMutation()
    const updateMutation = useUpdateAssetMutation()
    const deleteMutation = useDeleteAssetMutation()

    const [isIssueOpen, setIsIssueOpen] = React.useState(false)
    const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null)

    const handleAdd = async (data: CreateAssetDto) => {
        try {
            await createMutation.mutateAsync(data)
            setIsIssueOpen(false)
        } catch {
            // Error is handled by service toast
        }
    }

    const handleUpdate = async (id: string, data: Partial<Asset>) => {
        try {
            await updateMutation.mutateAsync({ id, data })
            setEditingAsset(null)
        } catch {
            // Error is handled by service toast
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this asset record?")) {
            try {
                await deleteMutation.mutateAsync(id)
            } catch (_error) {
                // Error is handled by service toast
            }
        }
    }

    const maintenanceAlertsCount = assets.filter(a => {
        if (!a.maintenanceDueDate) return false
        const dueDate = new Date(a.maintenanceDueDate)
        const today = new Date()
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 10 && diffDays >= 0
    }).length

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b-4 border-indigo-500 w-fit pb-1">
                        Asset Tracking & Maintenance
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage company assets issued to employees and monitor maintenance schedules.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 text-slate-600 border-slate-200">
                        <Download className="h-4 w-4" />
                        Export Assets
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white shadow-lg shadow-indigo-500/20"
                        onClick={() => setIsIssueOpen(true)}
                    >

                        Issue New Asset
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Assets</span>
                    <span className="text-2xl font-bold text-slate-900">{assets.length}</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Currently Issued</span>
                    <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === "Issued").length}</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md border-l-4 border-l-orange-500">
                    <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Maint. Alerts (10d)</span>
                    <span className="text-2xl font-bold text-slate-900">{maintenanceAlertsCount}</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Returned</span>
                    <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === "Returned").length}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-1">
                    <div className="w-full max-w-[240px]">
                        <Select onValueChange={(v) => setTypeFilter(v as AssetType | "All")} defaultValue="All">
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Filter by Asset Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Asset Types</SelectItem>
                                <SelectItem value="Laptop">Laptops</SelectItem>
                                <SelectItem value="Safety Gear">Safety Gear</SelectItem>
                                <SelectItem value="Specialized Tool">Specialized Tools</SelectItem>
                                <SelectItem value="Uniform">Uniforms</SelectItem>
                                <SelectItem value="Mobile Device">Mobile Devices</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <span className="text-sm text-slate-400">
                        Showing {assets.length} assets
                    </span>
                </div>
            </div>


            <AssetTable
                data={assets}
                isLoading={isLoading}
                onEdit={setEditingAsset}
                onDelete={handleDelete}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
            />


            <IssueAssetDialog
                open={isIssueOpen}
                onOpenChange={setIsIssueOpen}
                onAdd={handleAdd}
            />

            <EditAssetDialog
                asset={editingAsset}
                open={!!editingAsset}
                onOpenChange={(open) => !open && setEditingAsset(null)}
                onUpdate={handleUpdate}
            />
        </div>
    )
}