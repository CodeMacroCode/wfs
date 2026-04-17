'use client';

import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarDay } from '@/types/calendar';
import { getRemindersForDate } from '@/utils/reminders';
import { ReceiptText, Bell, Clock } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface DetailsSidebarProps {
  selectedDate: Date | null;
  onClose: () => void;
  data?: CalendarDay;
  onUpdate: (data: {
    dayType: 'working' | 'holiday';
    isNationalHoliday: boolean;
    isCompanyHoliday: boolean;
    description: string;
    checkIn?: string;
    checkOut?: string;
  }) => void;
  isLoading?: boolean;
}

export const DetailsSidebar: React.FC<DetailsSidebarProps> = ({
  selectedDate,
  onClose,
  data,
  onUpdate,
  isLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    dayType: 'working' as 'working' | 'holiday',
    isNationalHoliday: false,
    isCompanyHoliday: false,
    description: '',
    checkIn: '',
    checkOut: '',
  });

  const [prevData, setPrevData] = useState(data);
  const [prevDate, setPrevDate] = useState(selectedDate);

  if (data !== prevData || selectedDate !== prevDate) {
    setPrevData(data);
    setPrevDate(selectedDate);
    if (data) {
      setEditData({
        dayType: data.dayType,
        isNationalHoliday: data.isNationalHoliday,
        isCompanyHoliday: data.isCompanyHoliday,
        description: data.description || '',
        checkIn: data.checkIn || '',
        checkOut: data.checkOut || '',
      });
    } else {
      setEditData({
        dayType: 'working',
        isNationalHoliday: false,
        isCompanyHoliday: false,
        description: '',
        checkIn: '',
        checkOut: '',
      });
    }
  }

  if (!selectedDate) return null;

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  return (
    <div className="w-[350px] flex flex-col relative z-20">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border/20 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Details Schedule</h2>
          <p className="text-sm text-slate-400 font-medium">{format(selectedDate, 'dd MMMM yyyy')}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
          <X className="h-6 w-6 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {!isEditing ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* View Mode */}
            <div className={cn(
              "p-8 rounded-[24px] shadow-sm transition-all hover:shadow-md group border-0",
              data?.isNationalHoliday 
                ? "bg-[#ECF5DE]" 
                : data?.isCompanyHoliday 
                  ? "bg-[#FFF8E1]"
                  : "bg-slate-50"
            )}>
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0 rounded-full bg-white/50 hover:bg-white shadow-sm border border-slate-100 transition-all">
                  <Edit2 className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              <h3 className="text-[22px] font-extrabold text-slate-800 mb-8 leading-[1.2]">
                {data?.description || (data?.dayType === 'holiday' ? 'Republic Day' : 'Standard Working Day')}
              </h3>

              {/* Time Exceptions Display */}
              {data?.dayType === 'working' && (data?.checkIn || data?.checkOut) && (
                <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Scheduled Hours</h4>
                    <p className="text-sm font-bold text-slate-700">
                      {data.checkIn || '--:--'} — {data.checkOut || '--:--'}
                    </p>
                  </div>
                </div>
              )}

              {/* Reminders Section */}
              {getRemindersForDate(selectedDate).length > 0 && (
                <div className="space-y-4 pt-4 border-t border-indigo-200/30">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Bell className="h-3 w-3" />
                    Pending Reminders
                  </div>
                  <div className="space-y-3">
                    {getRemindersForDate(selectedDate).map((reminder) => (
                      <div key={reminder.id} className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                          <ReceiptText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{reminder.title}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{reminder.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Edit Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Day Type</Label>
              <Select 
                value={editData.dayType} 
                onValueChange={(val: 'working' | 'holiday') => setEditData({...editData, dayType: val})}
              >
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 font-medium">
                  <SelectValue placeholder="Select Day Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working">Working Day</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Title / Description</Label>
              <Input 
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                placeholder="e.g. Republic Day, Summer Team Building"
                className="h-12 rounded-xl bg-slate-50 border-slate-200"
              />
            </div>

            {editData.dayType === 'working' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Check-In</Label>
                  <Input 
                    type="time"
                    value={editData.checkIn}
                    onChange={(e) => setEditData({...editData, checkIn: e.target.value})}
                    className="h-12 rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Check-Out</Label>
                  <Input 
                    type="time"
                    value={editData.checkOut}
                    onChange={(e) => setEditData({...editData, checkOut: e.target.value})}
                    className="h-12 rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            )}

            {editData.dayType === 'holiday' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEditData({...editData, isNationalHoliday: !editData.isNationalHoliday})}>
                  <Checkbox 
                    id="national" 
                    checked={editData.isNationalHoliday} 
                    onCheckedChange={(checked) => setEditData({...editData, isNationalHoliday: !!checked})} 
                  />
                  <Label htmlFor="national" className="text-sm font-semibold text-slate-700 cursor-pointer">National</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEditData({...editData, isCompanyHoliday: !editData.isCompanyHoliday})}>
                  <Checkbox 
                    id="company" 
                    checked={editData.isCompanyHoliday} 
                    onCheckedChange={(checked) => setEditData({...editData, isCompanyHoliday: !!checked})} 
                  />
                  <Label htmlFor="company" className="text-sm font-semibold text-slate-700 cursor-pointer">Company</Label>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-6">
              <Button 
                className="h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold" 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="ghost" 
                className="h-12 rounded-xl font-semibold text-slate-500 hover:bg-slate-100" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-sidebar-border/20 bg-slate-50/50">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          Last updated: Today, 10:30 AM
        </div>
      </div>
    </div>
  );
};

export default DetailsSidebar;
