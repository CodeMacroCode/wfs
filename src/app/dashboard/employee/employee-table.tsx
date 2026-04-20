"use client"

import * as React from "react"
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Employee } from "@/types/employee"
import { format } from "date-fns"

interface EmployeeTableProps {
    data: Employee[]
    isLoading: boolean
    totalItems: number
    pageCount: number
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    onSortingChange: (sorting: SortingState) => void
    search: string
    onSearchChange: (value: string) => void
    onEdit?: (employee: Employee) => void
    onDelete?: (id: string) => void
    onView?: (employee: Employee) => void
    showActions?: boolean
    hideSearch?: boolean
    isDashboardView?: boolean
    extraActions?: React.ReactNode
}

export const getEmployeeColumns = (
    onEdit?: (employee: Employee) => void,
    onDelete?: (id: string) => void,
    onView?: (employee: Employee) => void,
    isDashboardView?: boolean,
): ColumnDef<Employee>[] => {
    type PopulatedField = { name: string; _id: string };

    const cols: ColumnDef<Employee>[] = [
        {
            accessorKey: "uniqueId",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-bold text-[#2eb88a] text-center">
                    {row.original.employeeObjId?.employeeId}
                </span>
            ),
            meta: {
                exportValue: (item: Employee) => item.employeeObjId?.employeeId || item.uniqueId?.toString() || ""
            }
        },
        {
            accessorKey: "name",
            header: "Employee",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="font-semibold text-slate-800">{row.original.name}</span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.name
            }
        },
        {
            accessorKey: "designation",
            header: "Designation",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <span className="text-sm text-slate-600 capitalize">{row.original.designation}</span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.designation
            }
        },
        {
            accessorKey: "email",
            header: "Contact Info",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="font-medium text-slate-600 truncate">{row.original.email}</span>
                    {row.original.mobileNo && (
                        <span className="text-xs text-slate-400">{row.original.mobileNo}</span>
                    )}
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => `${item.email}${item.mobileNo ? ` (${item.mobileNo})` : ""}`
            }
        },
    ];

    if (!isDashboardView) {
        cols.push({
            accessorKey: "companyId",
            header: "Company",
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-center">
                    <span className="text-sm text-slate-600">{(row.original.companyId as unknown as PopulatedField)?.name || "N/A"}</span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => (item.companyId as unknown as PopulatedField)?.name || "N/A"
            }
        });

        cols.push({
            accessorKey: "emergencyContact",
            header: "Emergency Contact",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="text-sm text-slate-600 capitalize">{row.original.emergencyContact?.name || "N/A"}</span>
                    {row.original.emergencyContact?.phone && (
                        <span className="text-xs text-slate-400">{row.original.emergencyContact.phone}</span>
                    )}
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.emergencyContact?.name ? `${item.emergencyContact.name}${item.emergencyContact.phone ? ` (${item.emergencyContact.phone})` : ""}` : "N/A"
            }
        });
        cols.push({
            accessorKey: "doj",
            header: "Joining Date",
            cell: ({ row }) => (
                <div className="flex flex-col items-center text-center">
                    <span className="text-sm font-medium text-slate-700">
                        {row.original.doj ? format(new Date(row.original.doj), "dd MMM yyyy") : "N/A"}
                    </span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.doj ? format(new Date(item.doj), "dd MMM yyyy") : "N/A"
            }
        });


        cols.push({
            accessorKey: "gender",
            header: "Gender",
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-center">
                    <span className="text-sm text-slate-600 capitalize">{row.original.gender}</span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.gender
            }
        });

        cols.push({
            accessorKey: "dob",
            header: "Date of Birth",
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-center">
                    <span className="text-sm text-slate-600">
                        {row.original.dob ? format(new Date(row.original.dob), "dd MMM yyyy") : "N/A"}
                    </span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.dob ? format(new Date(item.dob), "dd MMM yyyy") : "N/A"
            }
        });

        cols.push({
            accessorKey: "mobileNo",
            header: "Mobile No",
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-center">
                    <span className="text-sm text-slate-600">{row.original.mobileNo || "N/A"}</span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.mobileNo || "N/A"
            }
        });

        cols.push({
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-center">
                    <span className="text-sm text-slate-600">{row.original.department || "N/A"}</span>
                </div>
            ),
            meta: {
                exportValue: (item: Employee) => item.department || "N/A"
            }
        });

        // cols.push({
        //     accessorKey: "aadharNo",
        //     header: "Aadhar No",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600">{row.original.aadharNo || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => item.aadharNo || "N/A"
        //     }
        // });

        // cols.push({
        //     accessorKey: "pfNo",
        //     header: "PF No",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600">{row.original.pfNo || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => item.pfNo || "N/A"
        //     }
        // });

        // cols.push({
        //     accessorKey: "esiNo",
        //     header: "ESI No",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600">{row.original.esiNo || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => item.esiNo || "N/A"
        //     }
        // });

        // cols.push({
        //     accessorKey: "attendancePolicyId",
        //     header: "Attendance Policy",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600">{(row.original.attendancePolicyId as unknown as PopulatedField)?.name || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => (item.attendancePolicyId as unknown as PopulatedField)?.name || "N/A"
        //     }
        // });

        // cols.push({
        //     accessorKey: "maritalStatus",
        //     header: "Marital Status",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600 capitalize">{row.original.maritalStatus || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => item.maritalStatus || "N/A"
        //     }
        // });

        // cols.push({
        //     accessorKey: "bloodGroup",
        //     header: "Blood Group",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600">{row.original.bloodGroup || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => item.bloodGroup || "N/A"
        //     }
        // });

        // cols.push({
        //     accessorKey: "reference",
        //     header: "Reference",
        //     cell: ({ row }) => (
        //         <div className="flex items-center justify-center text-center">
        //             <span className="text-sm text-slate-600 truncate max-w-[150px]">{row.original.reference || "N/A"}</span>
        //         </div>
        //     ),
        //     meta: {
        //         exportValue: (item: Employee) => item.reference || "N/A"
        //     }
        // });
    }

    if (onEdit || onDelete || onView) {
        cols.push({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const employee = row.original

                return (
                    <div className="flex items-center justify-center gap-2">
                        {onView && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-[#2eb88a] hover:bg-[#2eb88a]/5 rounded-full h-8 w-8 p-0"
                                onClick={() => onView(employee)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        )}
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full h-8 w-8 p-0"
                                onClick={() => onEdit(employee)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-full h-8 w-8 p-0"
                                onClick={() => onDelete(employee.id || employee._id || "")}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )
            },
        })
    }

    return cols
}

export function EmployeeTable({
    data,
    isLoading,
    totalItems,
    pageCount,
    pagination,
    onPaginationChange,
    onSortingChange,
    search,
    onSearchChange,
    onEdit,
    onDelete,
    onView,
    showActions,
    hideSearch,
    isDashboardView,
    extraActions,
}: EmployeeTableProps) {
    const router = useRouter()

    // Default onView redirect only if showActions is not explicitly false
    const effectiveOnView = React.useMemo(() => {
        if (showActions === false) return undefined
        return onView || ((emp: Employee) => router.push(`/dashboard/employee/${emp.id || emp._id}`))
    }, [onView, router, showActions])

    const columns = React.useMemo(
        () => getEmployeeColumns(
            showActions === false ? undefined : onEdit,
            showActions === false ? undefined : onDelete,
            effectiveOnView,
            isDashboardView
        ),
        [onEdit, onDelete, effectiveOnView, showActions, isDashboardView]
    )

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            totalItems={totalItems}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            onSortingChange={onSortingChange}
            searchKey="uniqueId"
            searchPlaceholder="Search employee..."
            searchValue={search}
            onSearchChange={onSearchChange}
            showSrNo={true}
            hideSearch={hideSearch}
            extraActions={extraActions}
        />
    )
}
