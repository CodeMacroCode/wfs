'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { DetailsSidebar } from '@/components/calendar/DetailsSidebar';
import { useCalendarMonth, useUpdateCalendarDay } from '@/hooks/queries/use-calendar-queries';
import { addMonths, subMonths, format, parseISO, isValid } from 'date-fns';

function CalendarPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  console.log("searchParams", searchParams);

  // Initialize state from URL or default to today
  const [currentDate, setCurrentDate] = useState(() => {
    const monthParam = searchParams.get('month');
    if (monthParam) {
      const parsed = parseISO(`${monthParam}-01`);
      if (isValid(parsed)) return parsed;
    }
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isValid(parsed)) return parsed;
    }
    return new Date();
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isValid(parsed)) return parsed;
    }
    return null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(!!selectedDate);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Synchronize state with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const oldParams = params.toString();
    
    if (selectedDate) {
      params.set('date', format(selectedDate, 'yyyy-MM-dd'));
      params.delete('month'); 
    } else {
      params.delete('date');
      params.set('month', format(currentDate, 'yyyy-MM'));
    }
    
    // Only update if the string representation has actually changed
    if (params.toString() !== oldParams) {
      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedDate, currentDate, router, pathname, searchParams]);

  // Fetch monthly data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { data, isLoading } = useCalendarMonth(year, month);
  
  // Mutation for updating day
  const updateMutation = useUpdateCalendarDay();

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleDateChange = (date: Date) => setCurrentDate(date);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSidebarOpen(true);
  };

  const handleUpdateDay = async (updateData: {
    dayType: 'working' | 'holiday';
    isNationalHoliday: boolean;
    isCompanyHoliday: boolean;
    description: string;
    checkIn?: string;
    checkOut?: string;
  }) => {
    if (!selectedDate) return;

    await updateMutation.mutateAsync({
      date: format(selectedDate, 'yyyy-MM-dd'),
      ...updateData
    });
  };

  // Find data for currently selected date, with dummy overrides injected
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return undefined;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const day = selectedDate.getDate();

    const apiData = data?.days?.find(d => d.date.startsWith(dateStr));

    // Dummy schedule overrides (same as grid)
    const dummySchedules: Record<number, { checkIn: string; checkOut: string; description: string }> = {
      12: { checkIn: '08:00', checkOut: '15:00', description: 'Early Morning Shift' },
      14: { checkIn: '14:00', checkOut: '22:00', description: 'Late Evening Shift' },
      20: { checkIn: '11:00', checkOut: '18:00', description: 'Delayed Start' },
      25: { checkIn: '09:00', checkOut: '13:00', description: 'Half Day (Morning)' },
    };

    const override = dummySchedules[day];

    if (apiData) {
      // Inject dummy data into the existing API record if it has no custom times
      if (override && !apiData.checkIn && !apiData.checkOut) {
        return { ...apiData, ...override };
      }
      return apiData;
    }

    return undefined;
  }, [selectedDate, data]);

  // Merge API data with dummy schedule exceptions for the grid
  const mergedCalendarData = useMemo(() => {
    const apiDays = data?.days || [];
    const datePrefix = format(currentDate, 'yyyy-MM');

    // Dummy schedule exceptions keyed by day number
    const dummySchedules: Record<string, { checkIn: string; checkOut: string; description: string }> = {
      [`${datePrefix}-12`]: { checkIn: '08:00', checkOut: '15:00', description: 'Early Morning Shift' },
      [`${datePrefix}-14`]: { checkIn: '14:00', checkOut: '22:00', description: 'Late Evening Shift' },
      [`${datePrefix}-20`]: { checkIn: '11:00', checkOut: '18:00', description: 'Delayed Start' },
      [`${datePrefix}-25`]: { checkIn: '09:00', checkOut: '13:00', description: 'Half Day (Morning)' },
    };

    // Inject dummy checkIn/checkOut into matching API records
    const merged = apiDays.map(day => {
      const dateKey = day.date.substring(0, 10); // "2026-04-12"
      const override = dummySchedules[dateKey];
      if (override && !day.checkIn && !day.checkOut) {
        return { ...day, ...override };
      }
      return day;
    });

    return merged;
  }, [data, currentDate]);

  if (!isMounted) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Initializing Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/20">
      <div className="flex-1 flex flex-col p-6 min-w-0 h-full">
        <CalendarHeader 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDateChange={handleDateChange}
        />

        <div className="mt-6 flex-1 flex bg-white border border-sidebar-border/30 rounded-[24px] overflow-hidden relative shadow-none">
          <div className="flex-1 flex flex-col min-w-0 relative h-full">
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-500 animate-pulse">Updating Schedule...</p>
                </div>
              </div>
            )}
            
            <CalendarGrid 
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateClick={handleDayClick}
              calendarData={mergedCalendarData}
            />
          </div>

          {sidebarOpen && selectedDate && (
            <>
              <div className="w-px bg-sidebar-border/20 self-stretch" />
              <DetailsSidebar 
                key={selectedDate.toISOString()}
                selectedDate={selectedDate}
                onClose={() => setSidebarOpen(false)}
                data={selectedDayData}
                onUpdate={handleUpdateDay}
                isLoading={updateMutation.isPending}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Initializing Calendar...</p>
        </div>
      </div>
    }>
      <CalendarPageContent />
    </Suspense>
  );
}