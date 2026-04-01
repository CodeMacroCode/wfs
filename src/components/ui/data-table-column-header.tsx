import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("text-[13px] font-semibold text-slate-500", className)}>
        {title}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={cn(
          "h-8 px-2 -ml-2 data-[state=open]:bg-slate-100 text-slate-500 hover:text-slate-900 font-semibold text-[13px]",
          className
        )}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-3.5 w-3.5 text-[#2eb88a]" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-3.5 w-3.5 text-[#2eb88a]" />
        ) : (
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
        )}
      </Button>
    </div>
  )
}
