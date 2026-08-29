import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Plus, 
  Anchor, 
  MapPin, 
  Building2, 
  Ship, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { CreateVersionModal, VersionPayload } from './CreateVersionModal';

interface ProjectVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
  projectName?: string;
  shipType?: string;
}

export function ProjectVersionsModal({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName = '17.4万m³ 薄膜型大型LNG船 1号舰',
  shipType = '清洁能源运输'
}: ProjectVersionsModalProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([
    {
      id: 'v1',
      title: 'V1.0 - 分段搭载与总组阶段',
      versionNumber: 'V1.0',
      phaseName: '分段搭载与总组阶段',
      status: 'archived',
      startDate: '2026-03-01',
      endDate: '2026-06-15',
      berthInfo: {
        code: 1,
        name: '1号船台（2万吨船台）',
        categoryName: '平船台',
        transferType: '分段总组就位'
      },
      details: (
        <div className="space-y-2 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <span className="text-slate-400">时段:</span>
            <span className="font-mono text-slate-700">2026-03-01 至 2026-06-15 (已触发围栏时效自动剥离)</span>
          </p>
          <div className="flex items-center gap-2 bg-slate-100/70 p-2 rounded-lg text-[11px] text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>停泊区域: <strong>#1 1号船台 (平船台)</strong> · 搭载工序完毕</span>
          </div>
          <p className="text-[11px] text-slate-400">强绑定设备: 读卡器(12) | 激励器(4) | 四合一(4) (已随版本迭代完成延展归档)</p>
        </div>
      )
    },
    {
      id: 'v2',
      title: 'V2.1 - 大接缝合拢与密闭舱焊接',
      versionNumber: 'V2.1',
      phaseName: '大接缝合拢与密闭舱焊接',
      status: 'active',
      startDate: '2026-06-16',
      endDate: '2026-10-30',
      berthInfo: {
        code: 1,
        name: '1号船台（2万吨船台）',
        categoryName: '平船台',
        transferType: '平船台总装合拢'
      },
      details: (
        <div className="space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600">
            <p>
              时段生效区间: <span className="font-mono bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">2026-06-16</span> 至 <span className="font-mono bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">2026-10-30</span>
            </p>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>当前在泊：<strong>#1 1号船台（2万吨船台）</strong> (平船台)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-100 rounded-xl p-3 bg-slate-50">
              <p className="text-[11px] text-slate-500 mb-1">生效时段感知设备:</p>
              <p className="text-xs font-bold text-emerald-600 tracking-wide">读卡(12) · 激励(6) · 四合一(8) · 烟感(16)</p>
            </div>
            <div className="border border-slate-100 rounded-xl p-3 bg-slate-50">
              <p className="text-[11px] text-slate-500 mb-1">生效平面/立体围栏:</p>
              <p className="text-xs font-bold text-red-600 tracking-wide">龙门吊立体警戒 + 密闭舱防爆立体网</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'v3',
      title: 'V3.0 - 下水舾装与系泊电气调试',
      versionNumber: 'V3.0',
      phaseName: '下水舾装与系泊电气调试',
      status: 'planned',
      startDate: '2026-11-01',
      endDate: '2027-02-28',
      berthInfo: {
        code: 3,
        name: '3号码头 (移动码头)',
        categoryName: '移动码头',
        transferType: '出坞下水系泊调试'
      },
      details: (
        <div className="space-y-2 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <span className="text-slate-400">计划时段:</span>
            <span className="font-mono text-slate-700 font-medium">2026-11-01 至 2027-02-28</span>
          </p>
          <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-100 p-2 rounded-lg text-[11px] text-blue-900">
            <Anchor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              规划移泊目标: <strong className="text-blue-700 font-bold">#3 3号码头 (移动码头)</strong> · 工序: <strong>出坞下水系泊调试</strong> (规则: ≤2艘)
            </span>
          </div>
        </div>
      )
    }
  ]);

  if (!isOpen) return null;

  const handleAddVersion = (newVersion: VersionPayload) => {
    setVersions(prev => [...prev, newVersion]);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn select-none"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] border border-slate-200 text-slate-700 font-sans overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>阶段版本时间轴与厂区移泊演进</span>
                {projectId && (
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
                    {projectId}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                记录项目各施工阶段的版本快照、感知设备延展时效及船模在厂区各停泊位的移泊演变
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreateOpen(true)} 
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              新增阶段版本
            </button>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Timeline */}
        <div className="p-6 sm:p-8 overflow-y-auto relative bg-slate-50/50 rounded-b-2xl">
          {/* Timeline continuous line background */}
          <div className="absolute left-[38px] sm:left-[51px] top-12 bottom-12 w-0.5 bg-slate-200"></div>

          <div className="space-y-8 pl-8 sm:pl-12 relative">
            {versions.map((version, index) => {
              const isArchived = version.status === 'archived';
              const isActive = version.status === 'active';
              const isPlanned = version.status === 'planned';

              return (
                <div key={version.id} className="relative">
                  {isArchived && (
                    <>
                      <div className="absolute -left-[45px] sm:-left-[57px] top-4 w-3.5 h-3.5 bg-slate-400 rounded-full ring-4 ring-white shadow-sm z-10"></div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {version.versionNumber || 'V1.0'}
                            </span>
                            <h3 className="text-sm font-bold text-slate-700">{version.phaseName || version.title}</h3>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium border border-slate-200">
                            已归档 (历史快照留存)
                          </span>
                        </div>
                        {version.details}
                      </div>
                    </>
                  )}

                  {isActive && (
                    <>
                      <div className="absolute -left-[45px] sm:-left-[57px] top-4 w-3.5 h-3.5 bg-cyan-500 rounded-full ring-4 ring-cyan-100 shadow-sm z-10 animate-pulse"></div>
                      <div className="bg-white border-2 border-cyan-400/90 rounded-2xl p-5 shadow-md shadow-cyan-500/5">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200">
                              {version.versionNumber || 'V2.1'}
                            </span>
                            <h3 className="text-sm font-bold text-cyan-950 flex items-center gap-1.5">
                              <span>{version.phaseName || version.title}</span>
                              <span className="text-cyan-600 font-normal text-xs">(当前活跃版本)</span>
                            </h3>
                          </div>
                          <span className="text-[10px] border border-cyan-300 text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full font-bold tracking-wide flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                            活跃运行时段
                          </span>
                        </div>
                        {version.details}
                      </div>
                    </>
                  )}

                  {isPlanned && (
                    <>
                      <div className="absolute -left-[45px] sm:-left-[57px] top-4 w-3.5 h-3.5 bg-blue-300 rounded-full ring-4 ring-white shadow-sm z-10"></div>
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {version.versionNumber || 'V3.0'}
                            </span>
                            <h3 className="text-sm font-bold text-slate-800">{version.phaseName || version.title}</h3>
                          </div>
                          <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full font-medium">
                            计划阶段 (待触发)
                          </span>
                        </div>
                        {version.details}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end items-center shrink-0 rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            关闭时间轴
          </button>
        </div>
      </div>
      
      <CreateVersionModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSave={handleAddVersion}
        projectName={projectName}
        shipType={shipType}
      />
    </div>
  );
}
