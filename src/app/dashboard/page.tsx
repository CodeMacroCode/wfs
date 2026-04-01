"use client"

import * as React from "react"
import { 
  Users, 
  UserCheck, 
  Clock, 
  Plus, 
  Upload, 
  Calendar,
  MoreVertical,
  Search,
  Filter,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const shiftData = [
  { name: "General", value: 60, color: "#0f4c3a", count: 750 },
  { name: "First Shift", value: 30, color: "#2dd4bf", count: 375 },
  { name: "Night", value: 10, color: "#475569", count: 125 }
]

const recentActivity = [
  {
    id: 1,
    type: "onboarding",
    title: "New Employee Onboarded",
    description: "Sarah Jenkins joined as UI Designer",
    time: "2 MINS AGO",
    user: "HR Team",
    icon: <Users className="h-4 w-4 text-emerald-500" />,
    iconBg: "bg-emerald-50"
  },
  {
    id: 2,
    type: "leave",
    title: "Leave Request Approved",
    description: "Mark Thompson (EMP-0231) - 2 days",
    time: "45 MINS AGO",
    user: "David Chen",
    icon: <Calendar className="h-4 w-4 text-blue-500" />,
    iconBg: "bg-blue-50"
  },
  {
    id: 3,
    type: "report",
    title: "Attendance Report Exported",
    description: "Monthly summary for June 2035",
    time: "2 HOURS AGO",
    user: "System",
    icon: <UserCheck className="h-4 w-4 text-emerald-500" />,
    iconBg: "bg-emerald-50"
  },
  {
    id: 4,
    type: "shift",
    title: "Shift Change Requested",
    description: "Elena Rodriguez moved to Night Shift",
    time: "5 HOURS AGO",
    user: "Operations",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    iconBg: "bg-amber-50"
  },
  {
    id: 5,
    type: "punch",
    title: "Missing Punch Log",
    description: "3 employees missed checkout yesterday",
    time: "YESTERDAY",
    user: "System",
    icon: <Clock className="h-4 w-4 text-amber-600" />,
    iconBg: "bg-amber-100"
  }
]

const employees = [
  { id: "EMP-0234", name: "Olivia Mason", role: "Marketing", subRole: "Executive Marketing", shift: "General", date: "28 Jun 35", status: "Active", avatar: "OM" },
  { id: "EMP-0178", name: "Ethan Ray", role: "UI Designer", subRole: "Product Design", shift: "First Shift", date: "28 Jun 35", status: "Active", avatar: "ER" },
  { id: "EMP-0289", name: "Mia Torres", role: "HR Officer", subRole: "Human Resources", shift: "General", date: "28 Jun 35", status: "Active", avatar: "MT" },
  { id: "EMP-0291", name: "Daniel Cheung", role: "Compliance Specialist", subRole: "Operations", shift: "General", date: "28 Jun 35", status: "Active", avatar: "DC" },
  { id: "EMP-0320", name: "Farah Nabila", role: "Customer Experience Lead", subRole: "Customer Service", shift: "Night", date: "28 Jun 35", status: "Active", avatar: "FN" }
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
          <Button variant="outline" className="border-gray-200 text-slate-700 bg-white hover:bg-gray-50 flex gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95">
            <Upload className="h-4 w-4" />
            <span className="font-semibold text-sm">Upload Attendance</span>
          </Button>
          <Button className="bg-[#2dd4bf] hover:bg-[#26bba8] text-white font-bold text-sm flex gap-2 h-10 px-5 rounded-xl border-none shadow-sm transition-all active:scale-95">
            <span>New Employee</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Labor Force */}
        <Card className="border-none shadow-none bg-[#f1f5f9] rounded-[24px] overflow-hidden min-h-[160px] flex flex-col justify-between p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Labor Force</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-slate-900 tracking-tight">1,250</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Employees</span>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/80 hover:bg-white text-slate-600 text-[10px] font-bold py-1.5 px-3 rounded-full border border-slate-100 uppercase tracking-lighter flex items-center justify-center w-fit shadow-xs">
              <span className="text-emerald-500 mr-1">+12</span> <span className="text-slate-400">THIS MONTH</span>
            </Badge>
          </div>
        </Card>

        {/* Processed Present */}
        <Card className="border-none shadow-none bg-[#f0f9f1] rounded-[24px] overflow-hidden min-h-[160px] flex flex-col justify-between p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Processed Present</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">1,180</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Employees</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-500 bg-emerald-100/50 px-2 py-0.5 rounded-lg">94.4%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1">Attendance Rate</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-6 pt-4 border-t border-emerald-100/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">1,120</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">On-time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">60</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">Late</span>
            </div>
          </div>
        </Card>

        {/* Absentees */}
        <Card className="border-none bg-white border border-gray-100 rounded-[24px] overflow-hidden min-h-[160px] ring-1 ring-gray-100 flex flex-col justify-between p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Absentees</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">70</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Employees</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-500">-5%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-0.5 whitespace-nowrap">VS LAST WEEK</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900">30</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Annual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900">25</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sick</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900">15</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Others</span>
            </div>
          </div>
        </Card>

        {/* Total Overtime */}
        <Card className="border-none shadow-none bg-[#0a3622] rounded-[24px] overflow-hidden min-h-[160px] flex flex-col justify-between p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-500/70 uppercase tracking-wider">Total Overtime</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-white tracking-tight">345h</span>
              <span className="text-xs font-bold text-white/40 uppercase">Work Hours</span>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="secondary" className="bg-[#1e463a] hover:bg-[#265345] text-emerald-400 text-[10px] font-bold py-1.5 px-3 rounded-full border border-emerald-900/10 uppercase tracking-lighter flex items-center justify-center w-fit shadow-xs">
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
                <Bar dataKey="present" fill="#e2f5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onLeave" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#0f4c3c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-8 mt-10 px-4">
             <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-[#e2f5e1]" />
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

        {/* Shift Distribution */}
        <Card className="border-none ring-1 ring-gray-100 shadow-none rounded-[28px] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Shift Distribution</h3>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-8">Current workforce shift allocation.</p>
          
          <div className="flex-1 relative min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shiftData}
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
                  {shiftData.map((entry, index) => (
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
             {shiftData.map((item, index) => (
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
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-6 py-5 tracking-widest">Status</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase px-8 py-5 tracking-widest text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="border-b border-gray-50 hover:bg-slate-50/30 transition-all group">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white ring-1 ring-gray-100 flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                           <img 
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${emp.name}`} 
                            alt={emp.name} 
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
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{emp.status}</span>
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

        {/* Recent Activity Feed */}
        <Card className="border-none ring-1 ring-gray-100 shadow-none rounded-[28px] flex flex-col p-8 bg-white overflow-hidden">
          <div className="flex flex-col gap-1 mb-10">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Recent Activity</h3>
            <p className="text-xs font-semibold text-slate-400">Latest updates from the portal.</p>
          </div>

          <div className="flex-1 space-y-10 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="relative pl-14 flex flex-col gap-1.5 group cursor-pointer">
                <div className={`absolute left-0 top-0 h-11 w-11 rounded-full ${activity.iconBg} border-[5px] border-white flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                  {activity.icon}
                </div>
                <div className="flex items-start justify-between">
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{activity.title}</h4>
                  <span className="text-[9px] font-black text-slate-300 whitespace-nowrap ml-2 mt-1 tracking-tighter uppercase">{activity.time}</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed pr-2">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                   <div className="h-5 w-5 rounded-full bg-slate-100 border border-gray-100 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                     {activity.user.charAt(0)}
                   </div>
                   <span className="text-[10px] font-bold italic text-slate-400">by {activity.user}</span>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-12 bg-slate-50 border border-slate-100 text-slate-500 font-black text-[11px] h-14 shadow-none hover:bg-slate-100 hover:text-slate-700 rounded-2xl group transition-all uppercase tracking-widest">
             View All Activities
             <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Button>
        </Card>
      </div>
    </div>
  )
}