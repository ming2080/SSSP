import React, { useState } from 'react';
import { 
  X, 
  Ship, 
  Calendar, 
  MapPin, 
  Anchor, 
  Building2, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { BerthPicker } from './BerthPicker';
import { BERTH_AREAS, BerthAreaConfig, checkIsSmallShip } from '@/src/data/berthData';

export interface VersionPayload {
  id: string;
  title: string;
  versionNumber: string;
  phaseName: string;
  startDate: string;
  endDate: string;
  sync: boolean;
  status: 'active' | 'planned' | 'archived';
  // 移泊相关字段
  enableBerthTransfer: boolean;
  berthId?: string;
  berthCode?: number;
  berthName?: string;
  berthCategoryName?: string;
  transferType?: string;
  transferNotes?: string;
  details?: React.ReactNode;
}

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (version: VersionPayload) => void;
  projectName?: string;
  shipType?: string;
}

export function CreateVersionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  projectName = '17.4万m³ 薄膜型大型LNG船 1号舰',
  shipType = '清洁能源运输'
}: CreateVersionModalProps) {
  // 基础信息
  const [versionNumber, setVersionNumber] = useState('V3.0');
  const [phaseName, setPhaseName] = useState('水下舾装与管系试压');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2027-04-30');
  const [sync, setSync] = useState(true);

  // 移泊配置
  const [enableBerthTransfer, setEnableBerthTransfer] = useState(true);
  const [selectedBerthId, setSelectedBerthId] = useState<string>('berth-3'); // 默认3号码头
  const [transferType, setTransferType] = useState('出坞下水系泊调试');
  const [transferNotes, setTransferNotes] = useState('需双拖轮护航，并联动3号码头防落水与气体监测围栏');

  // 错误提示
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedBerth = BERTH_AREAS.find(b => b.id === selectedBerthId) || BERTH_AREAS[2];
  const isSmallShip = checkIsSmallShip(projectName) || checkIsSmallShip(shipType);
  const is5BerthViolation = selectedBerth.id === 'berth-5' && !isSmallShip;

  const handleSelectBerth = (berth: BerthAreaConfig) => {
    setSelectedBerthId(berth.id);
    if (errorMsg) setErrorMsg('');
  };

  const handleSave = () => {
    if (!versionNumber.trim()) {
      setErrorMsg('请输入版本编号（如 V3.0）');
      return;
    }
    if (!phaseName.trim()) {
      setErrorMsg('请输入阶段名称（如 水下舾装与管系试压）');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMsg('请选择生效起始时段与计划截止时段');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('生效起始日期不能晚于计划截止日期');
      return;
    }

    const fullTitle = `${versionNumber.trim()} - ${phaseName.trim()}`;

    const newVersion: VersionPayload = {
      id: `v-${Date.now()}`,
      title: fullTitle,
      versionNumber: versionNumber.trim(),
      phaseName: phaseName.trim(),
      startDate,
      endDate,
      sync,
      status: 'planned',
      enableBerthTransfer,
      berthId: enableBerthTransfer ? selectedBerth.id : undefined,
      berthCode: enableBerthTransfer ? selectedBerth.code : undefined,
      berthName: enableBerthTransfer ? selectedBerth.name : undefined,
      berthCategoryName: enableBerthTransfer ? selectedBerth.categoryName : undefined,
      transferType: enableBerthTransfer ? transferType : undefined,
      transferNotes: enableBerthTransfer ? transferNotes : undefined,
      details: (
        <div className="space-y-2 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <span className="text-slate-400">计划时段:</span>
            <span className="font-mono text-slate-700 font-medium">{startDate} 至 {endDate}</span>
          </p>
          {enableBerthTransfer && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  移泊至：#{selectedBerth.code} {selectedBerth.name}
                </span>
                <span className="text-[10px] bg-blue-100/70 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                  {selectedBerth.categoryName}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                工序类型: <strong className="text-slate-800 font-medium">{transferType}</strong>
              </p>
              {transferNotes && (
                <p className="text-[10px] text-slate-400">
                  安全协同: {transferNotes}
                </p>
              )}
            </div>
          )}
        </div>
      )
    };

    onSave(newVersion);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4 overflow-y-auto animate-fadeIn select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[94vh] border border-slate-200 text-slate-700 font-sans overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600">
              <Ship className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>新增阶段版本与停泊位移泊规划</span>
                <span className="text-xs font-normal text-slate-400 font-mono">({projectName})</span>
              </h2>
              <p className="text-xs text-slate-400">
                配置施工阶段时效、同步感知策略，并可在船厂厂区 6 大停泊区域中指定新阶段移泊目标
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[13px]">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setErrorMsg('')}
                className="text-rose-400 hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 1. 阶段基础信息与周期 */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">1</span>
              <h3 className="text-slate-800 font-bold text-sm">阶段版本基本属性与周期排程</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 版本号 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>版本代号
                </label>
                <input 
                  type="text" 
                  value={versionNumber}
                  onChange={e => setVersionNumber(e.target.value)}
                  placeholder="如 V3.0 或 V2.2" 
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400" 
                />
              </div>

              {/* 阶段名称 */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>施工阶段全称
                </label>
                <input 
                  type="text" 
                  value={phaseName}
                  onChange={e => setPhaseName(e.target.value)}
                  placeholder="如：水下舾装与管系试压 / 分段总组合拢" 
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400" 
                />
              </div>
            </div>

            {/* 周期起止时间 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-red-500 mr-1">*</span>生效起始时段
                </label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer" 
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-red-500 mr-1">*</span>计划截止时段
                </label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer" 
                />
              </div>
            </div>

            {/* 同步开关 */}
            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200/80 rounded-xl">
              <input 
                type="checkbox" 
                id="sync-checkbox"
                checked={sync}
                onChange={e => setSync(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <label htmlFor="sync-checkbox" className="text-xs text-slate-700 cursor-pointer">
                <strong>开启「周期变更自动延展与同步」：</strong>新版本生效时，自动平移并延展该阶段绑定的防爆定位基站、受限空间气体传感器及电子围栏生效时段。
              </label>
            </div>
          </div>

          {/* 2. 🎯 核心移泊操作：轮船模型移泊至厂区新停泊位 */}
          <div className="bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/30 p-4 rounded-2xl border border-blue-200 space-y-4">
            
            {/* 移泊开关与标题 */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">2</span>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                    <span>轮船模型移泊与厂区新停泊位规划</span>
                    <span className="text-xs font-normal text-blue-600 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-full">
                      船厂停泊规则管控
                    </span>
                  </h3>
                </div>
              </div>

              {/* 启用移泊勾选 */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                <input 
                  type="checkbox" 
                  id="transfer-toggle"
                  checked={enableBerthTransfer}
                  onChange={e => setEnableBerthTransfer(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <label htmlFor="transfer-toggle" className="text-xs font-bold text-blue-900 cursor-pointer">
                  当前阶段需执行船模移泊
                </label>
              </div>
            </div>

            {enableBerthTransfer ? (
              <div className="space-y-4 pt-1">
                
                {/* 规则合规提示条 */}
                <div className="bg-white border border-blue-200/80 rounded-xl p-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      <strong>停泊位规则：</strong>
                      移动码头（2号码头≤3艘，3号码头≤2艘，4号浮动码头≤2艘，5号码头限1艘小型船）；平船台（1号船台≤2艘，6号平船台≤3艘）。
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">已选目标：</span>
                    <span className="font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-md font-mono">
                      #{selectedBerth.code} {selectedBerth.shortName}
                    </span>
                  </div>
                </div>

                {/* 嵌入 6 大停泊位可视化选择组件 */}
                <BerthPicker
                  selectedBerthId={selectedBerthId}
                  onSelectBerth={handleSelectBerth}
                  shipName={projectName}
                  shipType={shipType}
                />

                {/* 5号码头小型船只规则限制强提示 */}
                {is5BerthViolation && (
                  <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5">5号码头专用船型规则提示：</strong>
                      当前选择的【5号码头】为小型船舶专属泊位（规则：仅限1艘小型船只，如拖轮、工作艇等）。当前项目为【{shipType} - {projectName}】，若为大型主船体，建议选择2号码头、3号码头或4号浮动码头。
                    </div>
                  </div>
                )}

                {/* 移泊工序类型与安全协同信息 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      移泊工序类型
                    </label>
                    <select 
                      value={transferType}
                      onChange={e => setTransferType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="出坞下水系泊调试">出坞下水系泊调试 (Dock Launch to Pier)</option>
                      <option value="平船台合拢与分段搭载">平船台合拢与分段搭载 (Slipway Assembly)</option>
                      <option value="舾装码头水下管系试压">舾装码头水下管系试压 (Mooring Outfit & Test)</option>
                      <option value="拖轮护航至系泊泊位">拖轮护航至系泊泊位 (Tug Escort Transfer)</option>
                      <option value="试航归来靠泊调试">试航归来靠泊调试 (Sea Trial Return)</option>
                      <option value="船体合拢移位">船体合拢移位 (Hull Section Shifting)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      移泊安全协同与注意事项
                    </label>
                    <input 
                      type="text" 
                      value={transferNotes}
                      onChange={e => setTransferNotes(e.target.value)}
                      placeholder="如：双拖轮护航系泊、潮位窗口期确认、警戒广播"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                <span>当前阶段不变更船体在船厂的停泊位置，将沿用上一版本停泊位。如需移泊，请勾选上方开关。</span>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end items-center gap-3 shrink-0 rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            取消
          </button>
          <button 
            type="button"
            onClick={handleSave} 
            className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 active:scale-98"
          >
            <Check className="w-4 h-4" /> 
            <span>保存阶段版本并应用移泊规划</span>
          </button>
        </div>

      </div>
    </div>
  );
}
