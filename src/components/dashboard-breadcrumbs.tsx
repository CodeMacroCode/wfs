"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import React from "react"

interface DynamicLabelProps {
  segment: string
  prevSegment?: string
  fallback: string
}

function DynamicBreadcrumbLabel({ segment, prevSegment, fallback }: DynamicLabelProps) {
  const searchParams = useSearchParams()
  const isId = segment.length === 24
  
  if (isId) {
    if (prevSegment === "warehouse") {
      const name = searchParams.get("name") || searchParams.get("warehouseName")
      if (name) return <>{name}</>
    }
    if (prevSegment === "rack") {
      const name = searchParams.get("rackName")
      if (name) return <>{name}</>
    }
  }
  
  return <>{fallback}</>
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const segments = pathname.split("/").filter(Boolean)

  // Map of URL segments to readable labels
  const segmentMap: Record<string, string> = {
    dashboard: "Dashboard",
    tasks: "Task Management",
    shops: "Manage Shop",
    company: "Company",
    branches: "Branches",
    supervisor: "Supervisor",
    users: "Manage User",
    "qr-codes": "Manage Qr Code",
    "qr-questions": "Manage Qr Question",
    meetings: "Meeting & Collaboration",
    workpad: "WorkPad",
    medical: "Medical Appointment",
    Inventory: "Inventory",
    warehouse: "Warehouse",
    rack: "Rack",
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          if (segment === "rack") return null;

          const isLast = index === segments.length - 1
          const prevSegment = segments[index - 1]
          const isId = segment.length === 24
          
          let href = `/${segments.slice(0, index + 1).join("/")}`
          
          // Append relevant search params for navigation
          if (isId && prevSegment === "warehouse") {
            const name = searchParams.get("name") || searchParams.get("warehouseName")
            if (name) href += `?name=${encodeURIComponent(name)}`
          }

          const fallbackLabel = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

          const isClickable = !isLast

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {!isClickable ? (
                  <BreadcrumbPage className={cn(
                    "text-sm font-semibold text-slate-900"
                  )}>
                    <DynamicBreadcrumbLabel segment={segment} prevSegment={prevSegment} fallback={fallbackLabel} />
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-sm text-slate-500 hover:text-[#3CC3A3] transition-colors font-medium">
                    <Link href={href}>
                      <DynamicBreadcrumbLabel segment={segment} prevSegment={prevSegment} fallback={fallbackLabel} />
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="text-slate-300" />
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
