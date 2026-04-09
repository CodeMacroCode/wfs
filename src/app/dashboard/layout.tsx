"use client"

import * as React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { LogOut, User, Settings, KeyRound, Search } from "lucide-react"
import { DashboardBreadcrumbs } from "@/components/dashboard-breadcrumbs"
import { GlobalSearch } from "@/components/global-search"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthService } from "@/services/auth-service"
import { authStorage } from "@/lib/auth"
import Image from "next/image"
import { AttendanceProvider } from "@/components/providers/attendance-provider"
import { useAttendanceUpload } from "@/hooks/use-attendance-upload"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AttendanceProvider>
      <AttendanceLayoutInner>{children}</AttendanceLayoutInner>
    </AttendanceProvider>
  )
}

function AttendanceLayoutInner({ children }: { children: React.ReactNode }) {
  const { 
    handleGlobalDragEnter, 
    handleGlobalDragOver, 
    handleGlobalDragLeave,
    handleDrop 
  } = useAttendanceUpload()
  const [username, setUsername] = React.useState("ADMIN")

  React.useEffect(() => {
    const user = authStorage.getUser()
    if (user?.username) {
      setUsername(user.username.toUpperCase())
    }
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <div 
        className="flex flex-col flex-1 min-w-0 bg-[#f8fafc] relative"
        onDragEnter={handleGlobalDragEnter}
        onDragOver={handleGlobalDragOver}
        onDragLeave={handleGlobalDragLeave}
        onDrop={handleDrop}
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-slate-500">
            <SidebarTrigger className="-ml-1 hover:bg-gray-100 hover:text-slate-900 transition-colors text-slate-500" />
            <Separator orientation="vertical" className="mr-2 h-6 bg-gray-100" />
            <React.Suspense fallback={null}>
              <DashboardBreadcrumbs />
            </React.Suspense>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  bubbles: true
                });
                document.dispatchEvent(event);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all text-sm group"
              title="Search (⌘K)"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 cursor-pointer rounded-full p-0.5 transition-colors hover:bg-gray-100 outline-none">
                  <Image
                    src={`https://api.dicebear.com/9.x/initials/png?seed=${username}`}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="flex h-9 w-9 items-center justify-center rounded-full font-bold text-xs border border-gray-100 shadow-sm"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-gray-100 text-slate-700 shadow-lg"
              >
                <DropdownMenuLabel className="text-slate-400">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-50 focus:text-slate-900">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-50 focus:text-slate-900">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem className="cursor-pointer transition-colors focus:bg-gray-50 focus:text-slate-900">
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer transition-colors focus:bg-red-50 focus:text-white"
                  onClick={() => AuthService.logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
        <GlobalSearch />
      </div >
    </SidebarProvider >
  )
}
