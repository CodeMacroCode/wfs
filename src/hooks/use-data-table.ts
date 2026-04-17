"use client"

import * as React from "react"
import { PaginationState, SortingState } from "@tanstack/react-table"
import { useDebounce } from "./use-debounce"

interface UseDataTableProps {
  initialPageIndex?: number
  initialPageSize?: number
  storageKey?: string
}

export function useDataTable({
  initialPageIndex = 0,
  initialPageSize = 10,
  storageKey,
}: UseDataTableProps = {}) {
  // --- Local States (with optional localStorage persistence) ---
  const [pagination, setPagination] = React.useState<PaginationState>(() => {
    if (typeof window !== "undefined" && storageKey) {
      const saved = localStorage.getItem(`${storageKey}-pagination`)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Error parsing pagination from localStorage", e)
        }
      }
    }
    return { pageIndex: initialPageIndex, pageSize: initialPageSize }
  })

  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (typeof window !== "undefined" && storageKey) {
      const saved = localStorage.getItem(`${storageKey}-sorting`)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Error parsing sorting from localStorage", e)
        }
      }
    }
    return []
  })

  const [search, setSearch] = React.useState(() => {
    if (typeof window !== "undefined" && storageKey) {
      const saved = localStorage.getItem(`${storageKey}-search`)
      if (saved) return saved
    }
    return ""
  })
  
  // Debounce search value for API calls
  const debouncedSearch = useDebounce(search, 500)

  // --- Persistence Effects ---
  React.useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-pagination`, JSON.stringify(pagination))
    }
  }, [pagination, storageKey])

  React.useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-sorting`, JSON.stringify(sorting))
    }
  }, [sorting, storageKey])

  React.useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-search`, search)
    }
  }, [search, storageKey])

  // --- Handlers ---
  const onPaginationChange = React.useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      setPagination((old) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue
        return next
      })
    },
    []
  )

  const onSortingChange = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting((old) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue
        return next
      })
    },
    []
  )

  const onSearchChange = React.useCallback((value: string) => {
    setSearch(value)
    // Automatically reset to page 1 on search change
    setPagination((old) => ({ ...old, pageIndex: 0 }))
  }, [])

  return {
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    search,
    onSearchChange,
    // Helper to get back values for API calls
    apiParams: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting.length > 0 ? sorting[0].id : undefined,
      order: (sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined) as "asc" | "desc" | undefined,
      search: debouncedSearch || undefined, // Use debounced value for API
    }
  }
}
