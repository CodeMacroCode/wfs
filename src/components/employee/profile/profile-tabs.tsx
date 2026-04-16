"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Factory, 
  IdCard 
} from "lucide-react";

export type TabType = "overview" | "attendance" | "leaves" | "oleo" | "i-card";

interface ProfileTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "attendance", label: "Attendance", icon: Calendar },
  { id: "leaves", label: "Leaves", icon: FileText },
] as const;

export function ProfileTabs({ activeTab, onChange }: ProfileTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const tabsRef = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    const activeTabElement = tabsRef.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }

    // Handle window resize
    const handleResize = () => {
      const el = tabsRef.current[activeTab];
      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  return (
    <div className="border-b bg-white px-8 sticky top-0 z-20">
      <div className="flex items-center gap-8 overflow-x-auto no-scrollbar relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              ref={(el) => { tabsRef.current[tab.id] = el; }}
              onClick={() => onChange(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 py-4 px-1 relative transition-colors duration-200 outline-none group",
                isActive ? "text-slate-900 font-bold" : "text-slate-500 hover:text-slate-700 font-medium"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-[#2eb88a]" : "text-slate-400 group-hover:text-slate-500")} />
              <span className="text-sm whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
        
        {/* Animated Indicator */}
        <div 
          className="absolute bottom-0 h-0.5 bg-[#2eb88a] rounded-t-full transition-all duration-300 ease-in-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>
    </div>
  );
}
