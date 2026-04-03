"use client"

import * as React from "react"
import { AttendanceContext } from "@/components/providers/attendance-provider"

/**
 * Custom hook to consume the AttendanceContext
 */
export function useAttendanceUpload() {
  const context = React.useContext(AttendanceContext)
  
  if (context === undefined) {
    throw new Error("useAttendanceUpload must be used within an AttendanceProvider")
  }

  return context
}
