"use client"

import {
  Plus,
  Upload,
  MoreVertical,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Droplets,
  Wifi,
  FileText,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import { AttendanceUploadDialog } from "@/components/dashboard/attendance-upload-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

const employees = [
  { id: "EMP-0234", name: "Olivia Mason", role: "Marketing", subRole: "Executive Marketing", shift: "General", date: "28 Jun 35", company: "Fourtech", avatar: "OM" },
  { id: "EMP-0178", name: "Ethan Ray", role: "UI Designer", subRole: "Product Design", shift: "First Shift", date: "28 Jun 35", company: "Goel Enterprises", avatar: "ER" },
  { id: "EMP-0289", name: "Mia Torres", role: "HR Officer", subRole: "Human Resources", shift: "General", date: "28 Jun 35", company: "Fourtech", avatar: "MT" },
  { id: "EMP-0291", name: "Daniel Cheung", role: "Compliance Specialist", subRole: "Operations", shift: "General", date: "28 Jun 35", company: "Goel Enterprises", avatar: "DC" },
  { id: "EMP-0320", name: "Farah Nabila", role: "Customer Experience Lead", subRole: "Customer Service", shift: "Night", date: "28 Jun 35", company: "Fourtech", avatar: "FN" }
]

export default function DashboardPage() {

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
          <Button variant="outline" className="border-gray-200 text-slate-700 bg-white hover:bg-gray-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95">
            <Plus className="h-4 w-4" />
            <span className="font-semibold text-sm">Mark Leave</span>
          </Button>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Labor Force */}
        <Card className="border-none shadow-none bg-[#f1f5f9] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Labor Force</h3>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">1,250</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="bg-white/80 hover:bg-white text-slate-600 text-[9px] font-bold py-1 px-3 rounded-full border border-slate-100 uppercase tracking-lighter flex items-center justify-center w-fit shadow-xs">
              <span className="text-emerald-500 mr-1">+12</span> <span className="text-slate-400">THIS MONTH</span>
            </Badge>
          </div>
        </Card>

        {/* Processed Present */}
        <Card className="border-none shadow-none bg-[#f0f9f1] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Processed Present</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">1,180</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-500 bg-emerald-100/50 px-2 py-0.5 rounded-lg">94.4%</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 pt-3 border-t border-emerald-100/50">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900">1,120</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">On-time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900">60</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">Late</span>
            </div>
          </div>
        </Card>

        {/* Absentees */}
        <Card className="border-none bg-white border border-gray-100 rounded-[20px] overflow-hidden min-h-[130px] ring-1 ring-gray-100 flex flex-col justify-between p-4 px-5 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Absentees</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">70</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Employees</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-500">-5%</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900">30</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Annual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900">25</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Sick</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900">15</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Others</span>
            </div>
          </div>
        </Card>

        {/* Total Overtime */}
        <Card className="border-none shadow-none bg-[#0a3622] rounded-[20px] overflow-hidden min-h-[130px] flex flex-col justify-between p-4 px-5">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-emerald-500/70 uppercase tracking-wider">Total Overtime</h3>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white tracking-tight">345h</span>
              <span className="text-[10px] font-bold text-white/40 uppercase">Work Hours</span>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="bg-[#1e463a] hover:bg-[#265345] text-emerald-400 text-[9px] font-bold py-1 px-3 rounded-full border border-emerald-900/10 uppercase tracking-lighter flex items-center justify-center w-fit shadow-xs">
              <span className="mr-1">+12h</span> <span className="text-white/40">VS YESTERDAY</span>
            </Badge>
          </div>
        </Card>
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
        {/* Employee List Table */}
        <Card className="lg:col-span-2 border-none ring-1 ring-gray-100 shadow-none rounded-[28px] overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 font-heading">Employee List</h3>
                <p className="text-xs font-semibold text-slate-400">Manage your workforce directory.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <Input
                    placeholder="Search employee, ID, etc"
                    className="pl-11 pr-4 h-11 w-64 bg-slate-50 border-none rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-teal-500/20 shadow-none transition-all"
                  />
                </div>
                <Button variant="outline" className="border-gray-200 text-slate-500 h-11 px-5 rounded-xl flex gap-2 font-bold text-sm bg-white hover:bg-gray-50 shadow-sm">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-gray-100/50 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-8 py-5 tracking-widest">Name</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-6 py-5 tracking-widest">Job Title</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-6 py-5 tracking-widest">Shift</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-6 py-5 tracking-widest">Date</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-6 py-5 tracking-widest">Company</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-8 py-5 tracking-widest text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="border-b border-gray-50 hover:bg-slate-50/30 transition-all group">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white ring-1 ring-gray-100 flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                          <Image
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${emp.name}`}
                            alt={emp.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{emp.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-700">{emp.role}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.subRole}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px] font-black capitalize px-2.5 py-1 rounded-lg">
                        {emp.shift}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-700 font-bold text-[13px]">
                      {emp.date}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-700">{emp.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <button className="text-slate-300 hover:text-slate-600 p-2 hover:bg-white rounded-lg transition-all shadow-hover">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-white mt-auto">
            <div className="text-[11px] font-bold text-slate-400">
              Showing <span className="text-slate-900">1 to 5</span> of <span className="text-slate-900">12</span> entries
            </div>
            <div className="flex items-center gap-1.5">
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-300 pointer-events-none hover:bg-gray-50 group">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-500/20 -translate-y-px">1</button>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs hover:bg-slate-50 transition-colors">2</button>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs hover:bg-slate-50 transition-colors">3</button>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all hover:translate-x-1 group">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
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