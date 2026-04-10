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

const TODAY = "2026-04-09"

const DUMMY_ASSETS: Asset[] = [
    {
        id: "1",
        name: "MacBook Pro M2",
        type: "Laptop",
        serialNumber: "MBP-99283-A",
        issuedTo: "John Doe",
        issueDate: "2024-01-15",
        status: "Issued",
        nextMaintenanceDate: "2026-04-15", // DUE SOON (within 6 days)
    },
    {
        id: "2",
        name: "Industrial Safety Helmet",
        type: "Safety Gear",
        serialNumber: "SH-8821",
        issuedTo: "Jane Smith",
        issueDate: "2024-03-10",
        status: "Issued",
        nextMaintenanceDate: "2026-10-10",
    },
    {
        id: "3",
        name: "Precision Laser Level",
        type: "Specialized Tool",
        serialNumber: "PLL-5542",
        issuedTo: "Mike Ross",
        issueDate: "2023-11-20",
        status: "Under Maintenance",
        nextMaintenanceDate: "2026-04-12", // DUE SOON (within 3 days)
    },
    {
        id: "4",
        name: "Standard Uniform Set",
        type: "Uniform",
        serialNumber: "U-1122",
        issuedTo: "Alice Johnson",
        issueDate: "2024-04-01",
        status: "Issued",
        nextMaintenanceDate: "2026-04-18", // DUE SOON (within 9 days)
    },
    {
        id: "5",
        name: "Dell Latitude 5420",
        type: "Laptop",
        serialNumber: "DL-66712",
        issuedTo: "Bob Wilson",
        issueDate: "2024-02-05",
        status: "Returned",
        nextMaintenanceDate: "2026-08-05",
    },
]

export default function AssetTrackingPage() {
    const [assets, setAssets] = React.useState<Asset[]>(DUMMY_ASSETS)
    const [typeFilter, setTypeFilter] = React.useState<AssetType | "All">("All")
    const [isIssueOpen, setIsIssueOpen] = React.useState(false)
    const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null)

    const handleAdd = (data: CreateAssetDto) => {
        const newAsset: Asset = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
        }
        setAssets([newAsset, ...assets])
    }

    const handleUpdate = (id: string, data: Partial<Asset>) => {
        setAssets(assets.map(a => a.id === id ? { ...a, ...data } : a))
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this asset record?")) {
            setAssets(assets.filter(a => a.id !== id))
        }
    }

    const filteredAssets = assets.filter(a =>
        typeFilter === "All" || a.type === typeFilter
    )

    const maintenanceAlertsCount = assets.filter(a => {
        const dueDate = new Date(a.nextMaintenanceDate)
        const today = new Date(TODAY)
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
                <div className="flex items-center gap-4 flex-1">
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
                        Showing {filteredAssets.length} assets
                    </span>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white shadow-sm">
                        <List className="h-4 w-4 text-indigo-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>


            <AssetTable
                data={filteredAssets}
                onEdit={setEditingAsset}
                onDelete={handleDelete}
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