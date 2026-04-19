"use client"

import {
  Plus,
  Upload,
  MoreVertical,
  Filter,
  ArrowRight,
  Zap,
  Droplets,
  Wifi,
  FileText,
  AlertCircle
} from "lucide-react"
import { AttendanceUploadDialog } from "@/components/dashboard/attendance-upload-dialog"
import { MarkLeaveDialog } from "@/components/dashboard/mark-leave-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Employee, EmployeeStatus } from "@/types/employee"
import { ExpandedStatCard } from "@/components/dashboard/ExpandedStatCard"
import { useDataTable } from "@/hooks/use-data-table"
import { useAttendanceQuery, useAttendanceDashboardCountQuery } from "@/hooks/queries/use-attendance"
import { AttendanceTable } from "@/app/dashboard/attendance/attendance-table"
import { EditEmployeeDialog } from "@/components/employee/employee-dialogs"
import { DeleteEmployeeDialog } from "@/components/employee/delete-employee-dialog"

const weeklyStats = [
  { day: "Mon", present: 85, onLeave: 12, absent: 3 },
  { day: "Tue", present: 88, onLeave: 9, absent: 3 },
  { day: "Wed", present: 82, onLeave: 15, absent: 3 },
  { day: "Thu", present: 90, onLeave: 7, absent: 3 },
  { day: "Fri", present: 75, onLeave: 18, absent: 7 },
  { day: "Sat", present: 60, onLeave: 25, absent: 15 },
  { day: "Sun", present: 65, onLeave: 20, absent: 15 }
]

const companyData = [
  { name: "Fourtech", value: 55, color: "#0f4c3a", count: 688 },
  { name: "Goel Enterprises", value: 35, color: "#2dd4bf", count: 437 },
  { name: "Others", value: 10, color: "#475569", count: 125 }
]

const billAlerts = [
  {
    id: 1,
    title: "Electricity Bill",
    description: "Monthly consumption: 450 kWh. Pending for Sep 2035.",
    amount: "₹4,250",
    status: "Pending",
    time: "DUE IN 3 DAYS",
    icon: <Zap className="h-4 w-4 text-amber-500" />,
    iconBg: "bg-amber-50",
    color: "text-amber-600"
  },
  {
    id: 2,
    title: "Water Utility",
    description: "Quarterly maintenance and usage charge.",
    amount: "₹850",
    status: "Overdue",
    time: "2 DAYS OVERDUE",
    icon: <Droplets className="h-4 w-4 text-rose-500" />,
    iconBg: "bg-rose-50",
    color: "text-rose-600"
  },
  {
    id: 3,
    title: "Internet Services",
    description: "Fiber Optic - 100Mbps Unlimited Plan.",
    amount: "₹1,199",
    status: "Upcoming",
    time: "DUE IN 12 DAYS",
    icon: <Wifi className="h-4 w-4 text-blue-500" />,
    iconBg: "bg-blue-50",
    color: "text-blue-600"
  },
  {
    id: 4,
    title: "Property Tax",
    description: "Annual municipal property tax for Block A.",
    amount: "₹12,400",
    status: "Pending",
    time: "DUE IN 15 DAYS",
    icon: <FileText className="h-4 w-4 text-emerald-500" />,
    iconBg: "bg-emerald-50",
    color: "text-emerald-600"
  }
]

// Mock data removed in favor of real API data


export default function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState<EmployeeStatus | "all" | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null)

  const {
    pagination,
    onPaginationChange,
    apiParams,
  } = useDataTable({
    storageKey: "dashboard-employees",
  })

  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceQuery(
    apiParams.page, 
    apiParams.limit as number,
    undefined,
    { staleTime: 60000 }
  )
  const attendanceList = attendanceData?.data || []

  const { data: dashboardStats } = useAttendanceDashboardCountQuery({ staleTime: 60000 });

  const statsConfig = {
    all: { title: "Total Labor Force", color: { bg: "bg-[#f1f5f9]", text: "text-slate-900", titleText: "text-slate-500" } },
    present: { title: "Processed Present", color: { bg: "bg-[#f0f9f1]", text: "text-slate-900", titleText: "text-emerald-700" } },
    absent: { title: "Absentees", color: { bg: "bg-white", text: "text-slate-900", titleText: "text-slate-600" } },
    "on-leave": { title: "On Leave", color: { bg: "bg-[#f0fdfa]", text: "text-slate-900", titleText: "text-[#0d9488]" } },
    "not-marked": { title: "Attendance Not Marked", color: { bg: "bg-[#0a3622]", text: "text-white", titleText: "text-emerald-500/70" } },
  }

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">HR Command Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">
            Real-time overview of workforce attendance and operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MarkLeaveDialog
            trigger={
              <Button variant="outline" className="border-gray-200 text-slate-700 bg-white hover:bg-gray-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95">
                <Plus className="h-4 w-4" />
                <span className="font-semibold text-sm">Mark Leave</span>
              </Button>
            }
          />
          <AttendanceUploadDialog
            trigger={
              <Button
                variant="outline"
                className="border-gray-200 text-slate-700 bg-white hover:bg-gray-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Upload className="h-4 w-4" />
                <span className="font-semibold text-sm">Upload Attendance</span>
              </Button>
            }
          />
          <Button className="bg-[#2dd4bf] hover:bg-[#26bba8] text-white font-bold text-sm flex gap-2 h-10 px-5 rounded-xl border-none shadow-sm transition-all active:scale-95">
            <span>New Employee</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 relative">
        <AnimatePresence>
          {selectedStat && (
            <ExpandedStatCard
              category={selectedStat}
              title={statsConfig[selectedStat].title}
              onClose={() => setSelectedStat(null)}
              colorScheme={statsConfig[selectedStat].color}
            />
          )}
        </AnimatePresence>

        <motion.div
          layoutId="card-all"
          onClick={() => setSelectedStat("all")}
          className="cursor-pointer"
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <Card className="border-none shadow-none bg-[#f1f5f9] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5 hover:bg-slate-200/50">
            <div className="space-y-2">
              <motion.h3 layoutId="title-all" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Labor Force</motion.h3>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {dashboardStats?.totalUsers ?? 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Click to view</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          layoutId="card-present"
          onClick={() => setSelectedStat("present")}
          className="cursor-pointer"
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <Card className="border-none shadow-none bg-[#f0f9f1] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5 hover:bg-emerald-100/50">
            <div className="space-y-2">
              <motion.h3 layoutId="title-present" className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Processed Present</motion.h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {dashboardStats?.present ?? 0}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          layoutId="card-absent"
          onClick={() => setSelectedStat("absent")}
          className="cursor-pointer"
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <Card className="border-none bg-white border border-gray-100 rounded-[20px] overflow-hidden min-h-[130px] ring-1 ring-gray-100 flex flex-col justify-between p-4 px-5 shadow-sm hover:bg-slate-50">
            <div className="space-y-2">
              <motion.h3 layoutId="title-absent" className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Absentees</motion.h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {dashboardStats?.absent ?? 0}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          layoutId="card-on-leave"
          onClick={() => setSelectedStat("on-leave")}
          className="cursor-pointer"
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <Card className="border-none shadow-none bg-[#f0fdfa] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5 hover:bg-teal-100/50">
            <div className="space-y-2">
              <motion.h3 layoutId="title-on-leave" className="text-[11px] font-bold text-[#0d9488] uppercase tracking-wider">On Leave</motion.h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {dashboardStats?.onLeave ?? 0}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Not Marked */}
        <motion.div
          layoutId="card-not-marked"
          onClick={() => setSelectedStat("not-marked")}
          className="cursor-pointer"
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <Card className="border-none shadow-none bg-[#0a3622] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5 hover:bg-[#0d4d31]">
            <div className="space-y-2">
              <motion.h3 layoutId="title-not-marked" className="text-[11px] font-bold text-emerald-500/70 uppercase tracking-wider">Not Marked</motion.h3>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {dashboardStats?.notMarked ?? 0}
                </span>
                <span className="text-[10px] font-bold text-white/40 uppercase">Employees</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Weekly Attendance */}
        <Card className="lg:col-span-2 border-none ring-1 ring-gray-100 shadow-none rounded-[28px] p-8 flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 italic font-heading">Weekly Attendance</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 px-4 py-2 rounded-xl border border-gray-100 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
              This Week
              <Filter className="h-3.5 w-3.5 ml-1" />
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(val) => `${val}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="present" fill="#86efac" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onLeave" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#0f4c3c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-8 mt-10 px-4">
            <div className="flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-[#86efac]" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Present</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-[#2dd4bf]" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">On Leave</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-[#0f4c3c]" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Absent</span>
            </div>
          </div>
        </Card>

        {/* Company Distribution */}
        <Card className="border-none ring-1 ring-gray-100 shadow-none rounded-[28px] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Company Distribution</h3>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-8">Employee count per organization.</p>

          <div className="flex-1 relative min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  animationBegin={200}
                  animationDuration={1500}
                  cornerRadius={6}
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900">1,250</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {companyData.map((item, index) => (
              <div key={`legend-${index}`} className="flex items-center justify-between group hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-7 w-12 flex items-center justify-center rounded-lg text-[11px] font-black text-white shadow-sm" style={{ backgroundColor: item.color }}>
                    {item.value}%
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800">{item.count}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Employees</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Data Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Attendance Activity Table */}
        <Card className="lg:col-span-2 border-none ring-1 ring-gray-100 shadow-none rounded-[28px] overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Recent Attendance Activity</h3>
            <p className="text-xs font-semibold text-slate-400">Real-time log of employee punch-in and punch-out activities.</p>
          </div>
          
          <AttendanceTable
            data={attendanceList}
            isLoading={isAttendanceLoading}
            totalItems={attendanceData?.total || 0}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />

          <EditEmployeeDialog
            employee={editingEmployee}
            open={!!editingEmployee}
            onOpenChange={(open) => !open && setEditingEmployee(null)}
          />

          <DeleteEmployeeDialog
            employeeId={deletingEmployeeId}
            open={!!deletingEmployeeId}
            onOpenChange={(open) => !open && setDeletingEmployeeId(null)}
          />
        </Card>

        {/* Bill Payment Alerts */}
        <Card className="border-none ring-1 ring-gray-100 shadow-none rounded-[28px] flex flex-col p-8 bg-white overflow-hidden">
          <div className="flex flex-col gap-1 mb-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Bill Payment Alerts</h3>
              <AlertCircle className="h-5 w-5 text-rose-500 animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-400">Pending and upcoming utility bills.</p>
          </div>

          <div className="flex-1 space-y-10 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
            {billAlerts.map((bill) => (
              <div key={bill.id} className="relative pl-14 flex flex-col gap-1.5 group cursor-pointer">
                <div className={`absolute left-0 top-0 h-11 w-11 rounded-full ${bill.iconBg} border-[5px] border-white flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                  {bill.icon}
                </div>
                <div className="flex items-start justify-between">
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{bill.title}</h4>
                  <span className="text-[9px] font-black text-slate-300 whitespace-nowrap ml-2 mt-1 tracking-tighter uppercase">{bill.time}</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed pr-2">{bill.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[13px] font-black ${bill.color}`}>{bill.amount}</span>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    <div className={`h-1 w-1 rounded-full ${bill.status === 'Overdue' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{bill.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-12 bg-slate-50 border border-slate-100 text-slate-500 font-black text-[11px] h-14 shadow-none hover:bg-slate-100 hover:text-slate-700 rounded-2xl group transition-all uppercase tracking-widest">
            Manage All Bills
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Button>
        </Card>
      </div>
    </div>
  )
}