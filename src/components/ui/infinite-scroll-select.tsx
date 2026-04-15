"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface InfiniteScrollSelectProps<T> {
  value?: string
  onValueChange: (value: string, item: T) => void
  items: T[]
  loadMore: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  placeholder?: string
  searchPlaceholder?: string
  onSearchChange?: (search: string) => void
  getLabel: (item: T) => string
  getValue: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
  className?: string
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}

export function InfiniteScrollSelect<T>({
  value,
  onValueChange,
  items,
  loadMore,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  onSearchChange,
  getLabel,
  getValue,
  renderItem,
  className,
  disabled = false,
  onOpenChange: onOpenChangeProp,
}: InfiniteScrollSelectProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const observerTarget = React.useRef<HTMLDivElement>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChangeProp?.(newOpen)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    onSearchChange?.(val)
  }

  React.useEffect(() => {
    if (!open) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
          loadMore()
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
        rootMargin: '40px'
      }
    )

    const target = observerTarget.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [loadMore, hasNextPage, isFetchingNextPage, isLoading, open])

  const selectedItem = React.useMemo(() =>
    items.find((item) => getValue(item) === value),
    [items, value, getValue]
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled || isLoading}
        >
          {selectedItem ? getLabel(selectedItem) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 shadow-xl border-slate-200 overflow-hidden"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center border-b px-3 py-2 bg-slate-50/50">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-40" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div
          ref={scrollContainerRef}
          className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"
        >
          <div className="p-1">
            {items.length === 0 && !isLoading && (
              <div className="py-8 text-center text-sm text-slate-400">
                No results found.
              </div>
            )}
            {items.map((item) => (
              <button
                key={getValue(item)}
                type="button"
                onClick={() => {
                  onValueChange(getValue(item), item)
                  setOpen(false)
                }}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors",
                  "hover:bg-indigo-50 hover:text-indigo-600",
                  value === getValue(item) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 shrink-0",
                    value === getValue(item) ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate flex-1 text-left">
                  {renderItem ? renderItem(item) : getLabel(item)}
                </span>
              </button>
            ))}
            <div ref={observerTarget} className="h-10 w-full flex items-center justify-center">
              {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin text-indigo-500 opacity-50" />}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
