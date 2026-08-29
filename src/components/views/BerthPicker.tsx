import React, { useState } from 'react';
import { 
  Anchor, 
  Layers, 
  Building2, 
  Ship, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Maximize2, 
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { BERTH_AREAS, BerthAreaConfig, checkIsSmallShip } from '@/src/data/berthData';

interface BerthPickerProps {
  selectedBerthId: string | null;
  onSelectBerth: (berth: BerthAreaConfig) => void;
  shipName?: string;
  shipType?: string;
  className?: string;
}

export function BerthPicker({
  selectedBerthId,
  onSelectBerth,
  shipName,
  shipType,
  className = ''
}: BerthPickerProps) {
  const [hoveredBerthId, setHoveredBerthId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'berth_pier' | 'berth_slipway'>('ALL');

  const selectedBerth = BERTH_AREAS.find(b => b.id === selectedBerthId) || null;
  const hoveredBerth = BERTH_AREAS.find(b => b.id === hoveredBerthId) || null;
  const activeDisplayBerth = hoveredBerth || selectedBerth || BERTH_AREAS[0];

  const isCurrentShipSmall = checkIsSmallShip(shipName) || checkIsSmallShip(shipType);

  // 过滤后的列表
  const displayedBerths = BERTH_AREAS.filter(b => {
    if (filterCategory === 'ALL') return true;
    return b.category === filterCategory;
  });

  return (
    <div className={`flex flex-col lg:flex-row gap-4 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 text-white shadow-xl ${className}`}>
      
      {/* 左侧：船厂俯视图与 6 大停泊位交互底图 */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 顶部工具与说明栏 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h4 className="text-xs font-bold text-slate-100 tracking-wide flex items-center gap-1.5">
              <span>船厂厂区停泊位可视化选择</span>
              <span className="text-[11px] font-normal text-slate-400 font-mono">(共 6 个合规停泊区域)</span>
            </h4>
          </div>

          {/* 类别筛选按钮 */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterCategory('ALL')}
              className={`px-2 py-0.5 rounded transition-colors font-medium cursor-pointer ${
                filterCategory === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              全部 (6)
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('berth_pier')}
              className={`px-2 py-0.5 rounded transition-colors font-medium cursor-pointer flex items-center gap-1 ${
                filterCategory === 'berth_pier' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Anchor className="w-3 h-3" />
              <span>移动码头 (4)</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('berth_slipway')}
              className={`px-2 py-0.5 rounded transition-colors font-medium cursor-pointer flex items-center gap-1 ${
                filterCategory === 'berth_slipway' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>平船台 (2)</span>
            </button>
          </div>
        </div>

        {/* 核心底图与 6 个区域标注 */}
        <div className="relative w-full aspect-[1/1] max-h-[380px] sm:max-h-[420px] rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner group">
          
          {/* 高清背景底图 */}
          <img 
            src="/assets/船厂背景.jpeg" 
            alt="东南造船厂俯视全景" 
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />

          {/* 暗色微光遮罩 */}
          <div className="absolute inset-0 bg-slate-950/25 pointer-events-none"></div>

          {/* 6 个可停泊区域交互红框与标牌 */}
          {BERTH_AREAS.map((berth) => {
            const isSelected = selectedBerthId === berth.id;
            const isHovered = hoveredBerthId === berth.id;
            const isFull = berth.currentOccupied.length >= berth.maxCapacity;
            const isSmallShipViolation = berth.isSmallShipOnly && !isCurrentShipSmall && shipName;
            
            // 是否在筛选中淡出
            const isFilteredOut = filterCategory !== 'ALL' && berth.category !== filterCategory;

            return (
              <div
                key={berth.id}
                onClick={() => onSelectBerth(berth)}
                onMouseEnter={() => setHoveredBerthId(berth.id)}
                onMouseLeave={() => setHoveredBerthId(null)}
                style={{
                  top: `${berth.rect.top}%`,
                  left: `${berth.rect.left}%`,
                  width: `${berth.rect.width}%`,
                  height: `${berth.rect.height}%`
                }}
                className={`absolute transition-all duration-200 cursor-pointer z-20 flex items-center justify-center ${
                  isFilteredOut ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {/* 区域红框边框（高亮与呼吸效果） */}
                <div 
                  className={`w-full h-full border-2 transition-all rounded-sm relative ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/25 shadow-[0_0_18px_rgba(6,182,212,0.8)] ring-2 ring-cyan-300'
                      : isHovered
                      ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_14px_rgba(245,158,11,0.7)]'
                      : 'border-red-500/90 bg-red-500/10 hover:border-amber-400 hover:bg-amber-500/15'
                  }`}
                >
                  {/* 红色编号数字徽章（如图片所示的 1, 2, 3, 4, 5, 6） */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black font-mono transition-transform text-shadow ${
                    isSelected
                      ? 'text-cyan-300 text-lg scale-125'
                      : isHovered
                      ? 'text-amber-300 text-base scale-110'
                      : 'text-red-400/90 text-sm'
                  }`}>
                    {berth.code}
                  </div>

                  {/* 角落状态标签 */}
                  <div className="absolute -top-3 -left-1 flex items-center gap-1">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono shadow-md border ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-300'
                        : isHovered
                        ? 'bg-amber-600 text-white border-amber-300'
                        : 'bg-red-600 text-white border-red-400'
                    }`}>
                      #{berth.code}
                    </span>

                    {/* 状态徽标 */}
                    {isSelected && (
                      <span className="bg-cyan-500 text-slate-950 font-bold text-[9px] px-1 rounded flex items-center gap-0.5 shadow-sm">
                        <CheckCircle2 className="w-2.5 h-2.5" /> 已选
                      </span>
                    )}
                  </div>

                  {/* 泊位容量小徽章 */}
                  <div className="absolute -bottom-2.5 right-0.5">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shadow-sm ${
                      isFull 
                        ? 'bg-rose-700 text-white border border-rose-400' 
                        : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                    }`}>
                      {berth.currentOccupied.length}/{berth.maxCapacity}艘
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 底部浮动图例提示 */}
          <div className="absolute bottom-2 left-2 z-10 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 text-[11px] text-slate-300 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 border-2 border-red-500 bg-red-500/20 rounded-xs"></span>
              <span>可停泊区域(1~6)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 border-2 border-cyan-400 bg-cyan-500/30 rounded-xs"></span>
              <span>当前选中泊位</span>
            </div>
            <span className="text-slate-500">| 点击图上红框区域切换</span>
          </div>
        </div>

        {/* 底部 6 个泊位快速切换胶囊标签 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2.5">
          {BERTH_AREAS.map((b) => {
            const isSelected = selectedBerthId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBerth(b)}
                className={`px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-mono font-bold text-xs ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    #{b.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {b.currentOccupied.length}/{b.maxCapacity}
                  </span>
                </div>
                <div className="text-[11px] font-medium truncate leading-tight">
                  {b.shortName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右侧：当前所选泊位的规则校验与详细技术参数面板 */}
      <div className="w-full lg:w-72 bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between shrink-0 space-y-3">
        
        {/* 顶部标题与泊位基本信息 */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-700/70 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-600/30 border border-cyan-400 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                #{activeDisplayBerth.code}
              </span>
              <div>
                <h5 className="font-bold text-xs text-white leading-tight">
                  {activeDisplayBerth.name}
                </h5>
                <span className="text-[10px] text-cyan-400">
                  {activeDisplayBerth.categoryName}
                </span>
              </div>
            </div>

            {selectedBerthId === activeDisplayBerth.id ? (
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                已选中
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectBerth(activeDisplayBerth)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                选择此位
              </button>
            )}
          </div>

          {/* 🎯 核心停泊规则说明 (按照用户严格要求展示) */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/70 space-y-2 mb-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> 停泊位规则说明
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
                容量: {activeDisplayBerth.maxCapacity} 艘
              </span>
            </div>

            <div className="text-xs font-semibold text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-600/30 leading-snug">
              {activeDisplayBerth.ruleDescription}
            </div>

            {activeDisplayBerth.isSmallShipOnly && (
              <div className="flex items-start gap-1.5 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-500/40">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>5号码头专有限制：</strong>仅允许停泊 1 艘小型船只（如拖轮、工作艇、AHTS海工辅助船等）。
                </span>
              </div>
            )}
          </div>

          {/* 泊位容量占用状态条 */}
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">当前泊位占有率</span>
              <span className="font-mono text-slate-200">
                已停 <strong className="text-cyan-300">{activeDisplayBerth.currentOccupied.length}</strong> / {activeDisplayBerth.maxCapacity} 艘
                <span className="text-slate-500 ml-1">
                  (余 {Math.max(0, activeDisplayBerth.maxCapacity - activeDisplayBerth.currentOccupied.length)} 泊位)
                </span>
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/60">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeDisplayBerth.currentOccupied.length >= activeDisplayBerth.maxCapacity 
                    ? 'bg-rose-500' 
                    : activeDisplayBerth.currentOccupied.length > 0 
                    ? 'bg-amber-400' 
                    : 'bg-emerald-500'
                }`}
                style={{ 
                  width: `${Math.min(100, (activeDisplayBerth.currentOccupied.length / activeDisplayBerth.maxCapacity) * 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* 当前在该泊位的船舶列表 */}
          <div className="space-y-1.5 mb-3">
            <span className="text-[11px] text-slate-400 block">目前已停泊船舶</span>
            {activeDisplayBerth.currentOccupied.length === 0 ? (
              <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>当前泊位完全空闲，可随时移泊靠泊</span>
              </div>
            ) : (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {activeDisplayBerth.currentOccupied.map((ship) => (
                  <div 
                    key={ship.id} 
                    className="flex items-center justify-between bg-slate-900/90 p-2 rounded-lg border border-slate-700/60 text-[11px]"
                  >
                    <div className="truncate pr-2">
                      <span className="text-slate-200 font-medium truncate block">{ship.name}</span>
                      <span className="text-slate-500 text-[10px] font-mono">{ship.shipCode} · {ship.stage}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono shrink-0 bg-amber-950/60 px-1 rounded border border-amber-800/40">
                      在泊
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 设施支持 */}
          <div className="text-[11px] space-y-1 border-t border-slate-700/60 pt-2.5">
            <span className="text-slate-400 block">配套设施与吊装支持</span>
            <div className="flex flex-wrap gap-1">
              {activeDisplayBerth.facilities.map((fac, i) => (
                <span 
                  key={i} 
                  className="bg-slate-900/70 text-slate-300 px-1.5 py-0.5 rounded text-[10px] border border-slate-700/60"
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 底部确认选择按钮 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectBerth(activeDisplayBerth)}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedBerthId === activeDisplayBerth.id
                ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>确认选择 #{activeDisplayBerth.code} {activeDisplayBerth.shortName} 作为移泊目标</span>
          </button>
        </div>

      </div>

    </div>
  );
}
