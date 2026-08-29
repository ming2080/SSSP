import React, { useState, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  PenTool, 
  Plus, 
  Radio, 
  Check, 
  AlertCircle, 
  Trash2,
  Cpu,
  Layers,
  ChevronDown,
  Building2,
  Ship,
  Sparkles,
  Link,
  ShieldCheck
} from 'lucide-react';

export interface FenceData {
  id: string;
  code: string;
  name: string;
  scopeType: 'yard' | 'project'; // 归属范围：厂区公共 vs 项目工程
  yardArea?: string; // 厂区功能分区
  projectId?: string; // 关联造船项目ID (选填/弱关联)
  projectName: string; // 显示名称
  projectPhase?: string; // 关联工程阶段 (选填)
  projectSection?: string; // 关联船体舱段/部位 (选填)
  type: string;
  color: string;
  shape: string;
  points: string;
  status: 'active' | 'inactive';
  dangerLevel: 'high' | 'medium' | 'low';
  deviceIds: string[];
  devices: { id: string; name: string; type: string; status: string }[];
  todayViolations: number;
}

interface CreateFenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fence: FenceData) => void;
  onStartDrawing?: (tempConfig: Partial<FenceData>) => void;
  currentProjectId?: string;
  drawnPoints?: string;
}

// 预设颜色池
const COLOR_OPTIONS = [
  { label: '珊瑚红 (高危)', value: '#ef4444' },
  { label: '金黄色 (预警)', value: '#f59e0b' },
  { label: '霓虹紫 (吊装)', value: '#d946ef' },
  { label: '青蓝色 (水域)', value: '#06b6d4' },
  { label: '翠绿色 (安全)', value: '#10b981' },
  { label: '科技蓝 (作业)', value: '#3b82f6' },
];

// 可用造船项目列表
const PROJECT_OPTIONS = [
  { id: 'PRJ-2026-LNG01', name: '17.4万m³ 薄膜型大型LNG船', code: 'HULL-LNG-174', shipType: 'LNG船' },
  { id: 'PRJ-2026-CTN02', name: '24000TEU 超大型集装箱船', code: 'HULL-CTN-240', shipType: '集装箱船' },
  { id: 'PRJ-2026-VLCC03', name: '30万吨级 超大型原油船(VLCC)', code: 'HULL-VLCC-300', shipType: '原油船' },
  { id: 'PRJ-2026-BULK04', name: '8.2万吨 卡姆萨尔型散货船', code: 'HULL-BULK-082', shipType: '散货船' },
];

// 厂区功能分区列表
const YARD_AREA_OPTIONS = [
  '全厂通用公共区域',
  '1#大型船台合拢滑道区',
  '2#干船坞总装区',
  '3号码头舾装泊位',
  '龙门吊核心起重作业带',
  '钢材下料与分段预处理车间',
  '涂装防腐与危化品库区',
  '管业加工与机加总装车间'
];

// 施工工程阶段列表
const PROJECT_PHASE_OPTIONS = [
  '不指定阶段 (全周期有效)',
  '分段制作与预装配',
  '船体合拢与主结构搭载',
  '密闭空间与绝热层铺设',
  '主甲板管系与电气舾装',
  '密闭舱室涂装与动火作业',
  '下水系泊调试阶段',
  '航行试验与交付阶段'
];

// 船体部位/舱段列表
const PROJECT_SECTION_OPTIONS = [
  '全船通用作业面',
  '1#~4#液货舱 / 密闭舱室',
  '主甲板及管架区域',
  '机舱双层底及泵舱区',
  '艏楼与导轨架安装区',
  '驾驶甲板与上层建筑',
  '货油舱及压载舱'
];

// 围栏类型
const FENCE_TYPES = ['作业区', '禁入区', '危险区', '受限空间', '仓储区', '吊装警戒区'];

// 围栏形状
const FENCE_SHAPES = ['自定义', '多边形', '矩形', '圆形'];

// 候选关联设备库
const MOCK_AVAILABLE_DEVICES = [
  { id: 'DEV-BS-01', name: '1#船台高精度定位主基站', type: '定位基站', status: '在线' },
  { id: 'DEV-BS-02', name: '龙门吊G-01作业面基站', type: '定位基站', status: '在线' },
  { id: 'DEV-GAS-01', name: '2#密闭货舱四合一气体检测仪', type: '气体检测仪', status: '在线' },
  { id: 'DEV-ALM-01', name: '大件吊装防碰高分贝声光报警器', type: '声光报警器', status: '在线' },
  { id: 'DEV-BS-03', name: '舾装码头水域微基站', type: '定位基站', status: '在线' },
  { id: 'DEV-GAS-02', name: '涂装车间VOC气体分析仪', type: '气体检测仪', status: '在线' },
];

export function CreateFenceModal({
  isOpen,
  onClose,
  onConfirm,
  onStartDrawing,
  currentProjectId = 'yard',
  drawnPoints,
}: CreateFenceModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [fenceCode, setFenceCode] = useState('');
  const [fenceName, setFenceName] = useState('');
  
  // 归属类型：'yard' (厂区公共) 或 'project' (工程项目)
  const [scopeType, setScopeType] = useState<'yard' | 'project'>(currentProjectId === 'yard' ? 'yard' : 'project');
  const [yardArea, setYardArea] = useState<string>('全厂通用公共区域');
  const [projectId, setProjectId] = useState<string>(currentProjectId === 'yard' ? 'PRJ-2026-LNG01' : currentProjectId);
  const [projectPhase, setProjectPhase] = useState<string>('船体合拢与主结构搭载');
  const [projectSection, setProjectSection] = useState<string>('全船通用作业面');
  
  const [fenceType, setFenceType] = useState('作业区');
  const [fenceColor, setFenceColor] = useState('#ef4444');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [fenceShape, setFenceShape] = useState('自定义');
  const [associatedDevices, setAssociatedDevices] = useState<typeof MOCK_AVAILABLE_DEVICES>([]);
  const [isDeviceSelectOpen, setIsDeviceSelectOpen] = useState(false);

  // 表单校验状态
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 自动生成围栏编号
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFenceCode(`EF-2026-${randomNum}`);
      if (currentProjectId === 'yard') {
        setScopeType('yard');
      } else {
        setScopeType('project');
        setProjectId(currentProjectId);
      }
      setIsSubmitted(false);
    }
  }, [isOpen, currentProjectId]);

  if (!isOpen) return null;

  const isNameEmpty = !fenceName.trim();
  const showNameError = isSubmitted && isNameEmpty;

  const handleConfirm = () => {
    setIsSubmitted(true);
    if (isNameEmpty) {
      return;
    }

    const selectedProj = PROJECT_OPTIONS.find(p => p.id === projectId);
    const projectName = scopeType === 'yard' 
      ? `东南造船厂 (${yardArea})`
      : (selectedProj ? selectedProj.name : '造船工程项目');

    const newFence: FenceData = {
      id: `FENCE-${Date.now()}`,
      code: fenceCode,
      name: fenceName.trim(),
      scopeType: scopeType,
      yardArea: scopeType === 'yard' ? yardArea : undefined,
      projectId: scopeType === 'project' ? projectId : 'yard',
      projectName: projectName,
      projectPhase: scopeType === 'project' ? projectPhase : undefined,
      projectSection: scopeType === 'project' ? projectSection : undefined,
      type: fenceType,
      color: fenceColor,
      shape: fenceShape,
      points: drawnPoints || '25,25 45,25 48,45 22,45',
      status: 'active',
      dangerLevel: fenceType === '禁入区' || fenceType === '危险区' || fenceType === '吊装警戒区' ? 'high' : fenceType === '受限空间' ? 'medium' : 'low',
      deviceIds: associatedDevices.map(d => d.id),
      devices: associatedDevices,
      todayViolations: 0
    };

    onConfirm(newFence);
    handleClose();
  };

  const handleClose = () => {
    setFenceName('');
    setAssociatedDevices([]);
    setIsSubmitted(false);
    setIsColorPickerOpen(false);
    setIsDeviceSelectOpen(false);
    onClose();
  };

  const handleDrawClick = () => {
    if (onStartDrawing) {
      onStartDrawing({
        code: fenceCode,
        name: fenceName,
        scopeType,
        yardArea,
        projectId: scopeType === 'project' ? projectId : 'yard',
        projectPhase,
        projectSection,
        type: fenceType,
        color: fenceColor,
        shape: fenceShape
      });
    }
  };

  const toggleDeviceSelection = (device: typeof MOCK_AVAILABLE_DEVICES[0]) => {
    if (associatedDevices.some(d => d.id === device.id)) {
      setAssociatedDevices(associatedDevices.filter(d => d.id !== device.id));
    } else {
      setAssociatedDevices([...associatedDevices, device]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn select-none">
      <div 
        className={`bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 ${
          isMaximized ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-2xl max-h-[92vh]'
        }`}
      >
        {/* 弹窗头部标题栏 (带标题、最大化/还原、关闭按钮) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-blue-600 rounded-full"></div>
            <h2 className="text-base font-bold text-slate-800 tracking-wide">新增电子围栏</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title={isMaximized ? "还原" : "最大化"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 弹窗内容表单区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-slate-700">
          {/* 1. 围栏编号 */}
          <div className="flex items-center">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 shrink-0">
              围栏编号
            </label>
            <div className="flex-1">
              <input
                type="text"
                disabled
                value={fenceCode}
                placeholder="围栏编号无需输入系统自动生成"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-mono text-sm placeholder:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* 2. 围栏名称 (必填，带校验红框和提示) */}
          <div className="flex items-start">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 pt-2 shrink-0">
              <span className="text-rose-500 mr-1">*</span>围栏名称
            </label>
            <div className="flex-1">
              <input
                type="text"
                value={fenceName}
                onChange={(e) => setFenceName(e.target.value)}
                placeholder="请输入围栏名称，例如：1#液货舱密闭作业区 / 龙门吊警戒带"
                className={`w-full px-3.5 py-2 bg-white border rounded-md text-slate-800 text-sm focus:outline-none transition-colors ${
                  showNameError
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                }`}
              />
              {showNameError && (
                <div className="text-rose-500 text-xs mt-1 font-normal flex items-center gap-1">
                  <span>围栏名称不能为空</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. 🎯 归属范围与项目关联信息 (非强关联，支持属于厂区或特定船舶项目) */}
          <div className="flex items-start">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 pt-2 shrink-0">
              归属范围
            </label>
            <div className="flex-1 space-y-3">
              {/* 单选分段器：厂区公共设施 vs 关联船舶工程项目 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => setScopeType('yard')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    scopeType === 'yard'
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                    scopeType === 'yard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span>厂区公共区域 / 设施</span>
                      {scopeType === 'yard' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">当前生效</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      属于船厂公共作业区（如船台、码头、龙门吊区等），全厂通用
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setScopeType('project')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    scopeType === 'project'
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                    scopeType === 'project' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Ship className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span>关联船舶工程项目</span>
                      <span className="text-[10px] text-slate-400 font-normal">(非强关联)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      定向关联具体船舶工程，可联动施工阶段与舱段部位
                    </p>
                  </div>
                </div>
              </div>

              {/* 展开的关联详情表单块 */}
              {scopeType === 'yard' ? (
                /* 厂区公共区域配置 */
                <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>厂区功能区域设置</span>
                  </div>
                  <div className="relative">
                    <select
                      value={yardArea}
                      onChange={(e) => setYardArea(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-8"
                    >
                      {YARD_AREA_OPTIONS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>厂区公共围栏对进入该物理区域的所有在厂人员与作业班组持续生效</span>
                  </div>
                </div>
              ) : (
                /* 关联船舶工程项目配置 (弱关联/支持阶段与舱段联动) */
                <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-3 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-blue-600" />
                      <span>船舶工程关联信息 (选填弱关联)</span>
                    </div>
                    <span className="text-[10px] text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      支持多维度工程映射
                    </span>
                  </div>

                  {/* 选择关联船舶 */}
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">关联造船项目</label>
                    <div className="relative">
                      <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-8"
                      >
                        {PROJECT_OPTIONS.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.name} ({proj.shipType})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 关联施工阶段 & 船体部位 (横向双列) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">关联施工阶段 (选填)</label>
                      <div className="relative">
                        <select
                          value={projectPhase}
                          onChange={(e) => setProjectPhase(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-7 truncate"
                        >
                          {PROJECT_PHASE_OPTIONS.map((phase) => (
                            <option key={phase} value={phase}>
                              {phase}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">船体舱段/部位 (选填)</label>
                      <div className="relative">
                        <select
                          value={projectSection}
                          onChange={(e) => setProjectSection(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-7 truncate"
                        >
                          {PROJECT_SECTION_OPTIONS.map((sec) => (
                            <option key={sec} value={sec}>
                              {sec}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. 围栏类型 (必填) */}
          <div className="flex items-center">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 shrink-0">
              <span className="text-rose-500 mr-1">*</span>围栏类型
            </label>
            <div className="flex-1 relative">
              <select
                value={fenceType}
                onChange={(e) => setFenceType(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-9"
              >
                {FENCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. 围栏颜色 (必填) */}
          <div className="flex items-center">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 shrink-0">
              <span className="text-rose-500 mr-1">*</span>围栏颜色
            </label>
            <div className="flex-1 relative">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  className="w-9 h-9 rounded-md border border-slate-300 flex items-center justify-center p-1 cursor-pointer shadow-sm hover:border-slate-400 transition-colors relative"
                  style={{ backgroundColor: fenceColor }}
                  title="选择颜色"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                </button>
                <span className="text-xs text-slate-500 font-mono">{fenceColor}</span>
              </div>

              {/* 颜色下拉选择盘 */}
              {isColorPickerOpen && (
                <div className="absolute left-0 top-11 z-30 bg-white border border-slate-200 rounded-lg shadow-xl p-2 flex gap-2 animate-fadeIn">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => {
                        setFenceColor(col.value);
                        setIsColorPickerOpen(false);
                      }}
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
                        fenceColor === col.value ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: col.value }}
                      title={col.label}
                    >
                      {fenceColor === col.value && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. 围栏形状 (必填) */}
          <div className="flex items-center">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 shrink-0">
              <span className="text-rose-500 mr-1">*</span>围栏形状
            </label>
            <div className="flex-1 relative">
              <select
                value={fenceShape}
                onChange={(e) => setFenceShape(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-9"
              >
                {FENCE_SHAPES.map((shape) => (
                  <option key={shape} value={shape}>
                    {shape}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 7. 绘制围栏 (必填按钮) */}
          <div className="flex items-center">
            <label className="w-24 text-right pr-4 font-medium text-slate-600 shrink-0">
              <span className="text-rose-500 mr-1">*</span>绘制围栏
            </label>
            <div className="flex-1 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDrawClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>绘制围栏</span>
              </button>
              {drawnPoints ? (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 空间坐标已就绪
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  点击按钮可在底图上点选定点绘制
                </span>
              )}
            </div>
          </div>

          {/* 分割线 */}
          <div className="pt-2"></div>

          {/* 8. 关联设备信息 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">关联设备信息</h3>
              <button
                type="button"
                onClick={() => setIsDeviceSelectOpen(!isDeviceSelectOpen)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200/60 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isDeviceSelectOpen ? '收起设备选择' : '添加关联设备'}</span>
              </button>
            </div>

            {/* 可勾选设备面板 */}
            {isDeviceSelectOpen && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 animate-fadeIn">
                <div className="text-xs font-semibold text-slate-600 mb-1.5">选择要关联的硬件定位/监测设备：</div>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_AVAILABLE_DEVICES.map((dev) => {
                    const isSelected = associatedDevices.some(d => d.id === dev.id);
                    return (
                      <div
                        key={dev.id}
                        onClick={() => toggleDeviceSelection(dev)}
                        className={`p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Cpu className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="truncate">{dev.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <span className="text-[10px] text-slate-500">{dev.type}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 已关联设备列表 或 空状态 */}
            {associatedDevices.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                {/* 空状态插画（类似图示浅灰色纸箱） */}
                <div className="w-24 h-24 mb-3 relative flex items-center justify-center opacity-80">
                  <svg className="w-20 h-20 text-slate-200" viewBox="0 0 100 100" fill="none">
                    <path d="M50 15 L85 35 L50 55 L15 35 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
                    <path d="M15 35 L50 55 L50 90 L15 70 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M85 35 L50 55 L50 90 L85 70 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                    <path d="M50 35 L68 25 L85 35 L68 45 Z" fill="#f8fafc" opacity="0.6" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400 font-medium">暂无关联设备信息</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {associatedDevices.map((dev) => (
                  <div 
                    key={dev.id}
                    className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-md text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-medium text-slate-800">{dev.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({dev.id})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dev.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleDeviceSelection(dev)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="移除关联"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 弹窗底部按钮栏 */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0 rounded-b-xl">
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm transition-colors active:scale-95 cursor-pointer"
          >
            确定
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
