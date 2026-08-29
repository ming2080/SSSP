import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  ShieldAlert, 
  BellRing, 
  ServerCrash,
  Ship
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewType } from '@/src/types';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '驾驶舱', icon: LayoutDashboard },
  { id: 'projects', label: '项目管理', icon: FolderKanban },
  { id: 'models', label: '船模管理', icon: Ship },
  { id: 'personnel', label: '人员定位', icon: Users },
  { id: 'fence', label: '电子围栏', icon: ShieldAlert },
  { id: 'alarms', label: '告警配置', icon: BellRing },
  { id: 'devices', label: '设备管理', icon: ServerCrash },
];

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  return (
    <div className="w-44 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200 z-10 shadow-sm">
      <div className="h-14 flex items-center px-4 border-b border-slate-200">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2 italic shadow-sm">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <h1 className="text-slate-800 font-bold text-sm tracking-tight truncate">智慧船厂</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">功能模块</div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
                currentView === item.id 
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-bold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-r-4 border-transparent font-medium"
              )}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>服务正常</span>
        </div>
        <span className="font-mono text-[10px]">V2.6</span>
      </div>
    </div>
  );
}
