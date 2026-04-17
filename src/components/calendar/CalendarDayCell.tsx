'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarDay } from '@/types/calendar';
import { getRemindersForDate } from '@/utils/reminders';
import { ReceiptText, Clock } from 'lucide-react';


interface CalendarDayCellProps {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  data?: CalendarDay;
  onClick: (date: Date) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  month,
  year,
  isCurrentMonth,
  isSelected,
  isToday,
  data,
  onClick,
}) => {
  const date = new Date(year, month, day);
  const isSunday = date.getDay() === 0;
  const isHoliday = data?.dayType === 'holiday';
  const reminders = getRemindersForDate(date);

  return (
    <div
      onClick={() => onClick(date)}
      className={cn(
        "min-h-[140px] p-2 border-r border-b border-sidebar-border/30 transition-all cursor-pointer relative group overflow-hidden",
        !isCurrentMonth && "bg-slate-100/80 text-slate-300 opacity-90",
        isSelected && "ring-2 ring-teal-500/50 ring-inset bg-teal-50/20 z-10",
        isToday && "bg-teal-50/10",
        "hover:bg-teal-50/30"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-colors",
          isToday ? "bg-teal-500 text-white" : isCurrentMonth ? "text-slate-600" : "text-slate-400",
          isSelected && !isToday && "bg-teal-500/20 text-teal-700"
        )}>
          {day}
        </span>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[90px] custom-scrollbar scrollbar-hide">
        {isHoliday && data?.description && (
          <div className={cn(
            "p-2 rounded-lg border-0 text-[10px] sm:text-[11px] leading-tight font-semibold shadow-sm relative group/event",
            data.isNationalHoliday 
              ? "bg-[#ECF5DE] text-[#617F30]" 
              : "bg-[#FFF8E1] text-[#B45309]"
          )}>
            <div className="text-[8px] font-bold uppercase tracking-tight opacity-60 mb-0.5">
              {data.isNationalHoliday ? 'National Holiday' : 'Company Holiday'}
            </div>
            <div className="line-clamp-2 pr-4">{data.description}</div>
            
            {/* Standard time placeholder */}
            <div className="mt-2 text-[9px] font-medium opacity-60">All Day</div>
            
            {/* Indicator Dot at bottom right */}
            <div className={cn(
               "absolute bottom-2 right-2 w-2 h-2 rounded-full",
               data.isNationalHoliday ? "bg-[#10B981]" : "bg-[#047857]" 
            )} />
          </div>
        )}

        {/* Time Exceptions Indicator */}
        {data?.dayType === 'working' && (data?.checkIn || data?.checkOut) && (
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] leading-tight font-bold shadow-sm flex items-center gap-1.5">
            <Clock className="h-2.5 w-2.5" />
            <span>{data.checkIn || '--:--'} — {data.checkOut || '--:--'}</span>
          </div>
        )}
        
        {/* System Reminders (e.g. Bill Payments) */}
        {reminders.map((reminder) => (
          <div key={reminder.id} className={cn(
            "p-2 rounded-lg border-0 text-[10px] sm:text-[11px] leading-tight font-semibold shadow-sm relative group/reminder",
            "bg-indigo-50 text-indigo-700"
          )}>
            <div className="text-[8px] font-bold uppercase tracking-tight opacity-60 mb-0.5 flex items-center gap-1">
              <ReceiptText className="h-2 w-2" />
              Reminder
            </div>
            <div className="line-clamp-2 pr-4">{reminder.title}</div>
            
            {/* Indicator Dot at bottom right */}
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
          </div>
        ))}
        
        {/* Placeholder for future events/agendas */}
        {!isHoliday && isSunday && isCurrentMonth && (
          <div className="p-2 rounded-lg bg-slate-100/50 border border-slate-200 text-slate-500 text-[11px] leading-tight font-medium opacity-60 italic">
            Weekend Break
          </div>
        )}
      </div>

      {/* Modern hover indicator at bottom */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-teal-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100",
        isSelected ? "scale-x-100 opacity-100" : "opacity-0"
      )} />
    </div>
  );
};

export default CalendarDayCell;
