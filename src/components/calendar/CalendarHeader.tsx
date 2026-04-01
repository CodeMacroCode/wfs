'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onViewChange?: (view: string) => void;
  onDateChange: (date: Date) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onDateChange,
}) => {

  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onDateChange(newDate);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentDate.getMonth(), 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between pb-6 border-b border-sidebar-border/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-xl font-semibold hover:bg-transparent px-2 h-auto flex items-center gap-2">
                {format(currentDate, 'MMMM yyyy')}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white border border-sidebar-border shadow-lg">
              {MONTHS.map((month, index) => (
                <DropdownMenuItem 
                  key={month} 
                  onClick={() => handleMonthSelect(index)}
                  className={currentDate.getMonth() === index ? 'bg-primary/10 font-bold text-primary' : ''}
                >
                  {month}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPrevMonth}
            className="h-8 w-8 hover:bg-sidebar-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNextMonth}
            className="h-8 w-8 hover:bg-sidebar-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10 px-4 bg-lime-50/50 border-lime-100 text-lime-900 font-medium hover:bg-lime-100/50">
              {currentYear}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white border border-sidebar-border shadow-lg max-h-[300px] overflow-y-auto custom-scrollbar">
            {years.map((year) => (
              <DropdownMenuItem 
                key={year} 
                onClick={() => handleYearSelect(year)}
                className={currentYear === year ? 'bg-lime-100 font-bold text-lime-900' : ''}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10 px-4 bg-lime-50/50 border-lime-100 text-lime-900 font-medium hover:bg-lime-100/50">
              {MONTHS[currentDate.getMonth()]}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white border border-sidebar-border shadow-lg max-h-[300px] overflow-y-auto custom-scrollbar">
            {MONTHS.map((month, index) => (
              <DropdownMenuItem 
                key={month} 
                onClick={() => handleMonthSelect(index)}
                className={currentDate.getMonth() === index ? 'bg-lime-100 font-bold text-lime-900' : ''}
              >
                {month}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CalendarHeader;
