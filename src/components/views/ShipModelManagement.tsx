import React, { useState } from 'react';
import { 
  Ship, 
  Anchor, 
  Info, 
  Search, 
  Filter, 
  X, 
  Layers, 
  Box, 
  Cpu, 
  ShieldCheck, 
  Compass, 
  Maximize2,
  CheckCircle2,
  Eye
} from 'lucide-react';

// 导入 8 款不同船型的 3D 数字孪生模型渲染图
import lngModelBg from '@/src/assets/images/lng_ship_model_1787972569670.jpg';
import containerModelBg from '@/src/assets/images/container_ship_model_1787972581740.jpg';
import tankerModelBg from '@/src/assets/images/tanker_ship_model_1787972594875.jpg';
import bulkModelBg from '@/src/assets/images/bulk_ship_model_1787972609425.jpg';
import psvModelBg from '@/src/assets/images/psv_3d_model_1787972977692.jpg';
import workboatModelBg from '@/src/assets/images/workboat_3d_model_1787972992279.jpg';
import supportModelBg from '@/src/assets/images/support_3d_model_1787973007774.jpg';
import chemTankerModelBg from '@/src/assets/images/chemical_tanker_3d_1787973019008.jpg';

interface ShipModel {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  thumbnail: string;
  lodLevel: string;
  meshCount: string;
  compartments: number;
  parameters: {
    loa: string;
    beam: string;
    depth: string;
    draft: string;
    power: string;
    displacement: string;
    speed: string;
  };
  features: string[];
}

const mockShipModels: ShipModel[] = [
  {
    id: 'M-001',
    name: '17.4万m³ 薄膜型大型LNG船',
    type: 'LNG液化天然气船',
    category: '清洁能源运输',
    description: '采用 GTT NO96 薄膜型绝热货舱系统，具有高安全、低蒸发率的 3D 全舱段高精度数字孪生模型。',
    thumbnail: lngModelBg,
    lodLevel: 'LOD 400 (施工级)',
    meshCount: '1,280,000 面',
    compartments: 4,
    parameters: { 
      loa: '295.0', 
      beam: '45.0', 
      depth: '26.25', 
      draft: '11.5', 
      power: '双燃料低速机+轴带发电机',
      displacement: '118,000 吨',
      speed: '19.5 节'
    },
    features: ['3D 绝热层空间网格', '密闭货舱受限空间定位', '超低温泄漏监测点位']
  },
  {
    id: 'M-002',
    name: '24,000 TEU 超大型集装箱船',
    type: '超大型集装箱船',
    category: '集装箱班轮',
    description: '全球顶级装载量集装箱船 3D 模型，完整包含 24 层集装箱导轨架、系泊甲板及双岛式上层建筑网格。',
    thumbnail: containerModelBg,
    lodLevel: 'LOD 350',
    meshCount: '1,860,000 面',
    compartments: 12,
    parameters: { 
      loa: '399.9', 
      beam: '61.5', 
      depth: '33.2', 
      draft: '16.5', 
      power: 'WinGD 11X92DF 双燃料主机',
      displacement: '240,000 吨',
      speed: '22.0 节'
    },
    features: ['箱位 3D 空间坐标系', '舷边防落水警戒网格', '主机舱多层拓扑']
  },
  {
    id: 'M-003',
    name: '30万吨 VLCC 超大型原油船',
    type: '超大型油轮 (VLCC)',
    category: '液体散货',
    description: '双壳双底结构 3D 数字模型，精细刻画 15 个货油舱、双层底压载舱及主甲板复杂管系走线。',
    thumbnail: tankerModelBg,
    lodLevel: 'LOD 400',
    meshCount: '1,450,000 面',
    compartments: 15,
    parameters: { 
      loa: '333.0', 
      beam: '60.0', 
      depth: '30.0', 
      draft: '20.5', 
      power: '低速柴油机 + 脱硫塔系统',
      displacement: '348,000 吨',
      speed: '15.5 节'
    },
    features: ['货油管系 3D BIM 路由', '惰性气体密闭舱监测', '防爆区域立体电子围栏']
  },
  {
    id: 'M-004',
    name: '82,000 DWT 卡姆萨尔型散货船',
    type: '卡姆萨尔型散货船',
    category: '干散货运输',
    description: '标准节能型大开口散货船 3D 孪生数模，包含 7 个独立货舱、液压舱盖及船台搭载分段基准点。',
    thumbnail: bulkModelBg,
    lodLevel: 'LOD 300',
    meshCount: '920,000 面',
    compartments: 7,
    parameters: { 
      loa: '229.0', 
      beam: '32.26', 
      depth: '20.35', 
      draft: '14.45', 
      power: 'MAN B&W 6S60ME 柴油机',
      displacement: '98,000 吨',
      speed: '14.2 节'
    },
    features: ['船台分段搭载对位基准', '大舱临边登高作业防护', '装载应力模拟网格']
  },
  {
    id: 'M-005',
    name: '75M 动力定位平台供应船',
    type: '平台供应船 (PSV)',
    category: '海洋工程',
    description: '配备 DP-2 动力定位系统，具备 650㎡ 开阔后甲板与散装泥浆/燃油输送系统 3D 数字仿真体。',
    thumbnail: psvModelBg,
    lodLevel: 'LOD 350',
    meshCount: '850,000 面',
    compartments: 6,
    parameters: { 
      loa: '75.0', 
      beam: '16.8', 
      depth: '7.5', 
      draft: '6.0', 
      power: '柴电全回转电力推进系统',
      displacement: '4,200 吨',
      speed: '13.5 节'
    },
    features: ['开阔甲板作业人员热力图', 'DP动力定位基站网络', '泥浆舱受限空间进出许可']
  },
  {
    id: 'M-006',
    name: '69.8M 海上风电运维工作船',
    type: '风电运维船 (SOV)',
    category: '海上风电装备',
    description: '双体高速耐波浪船型 3D 渲染模型，集成 3D 波浪补偿登乘栈桥与海上物资吊装回转吊机。',
    thumbnail: workboatModelBg,
    lodLevel: 'LOD 400',
    meshCount: '1,120,000 面',
    compartments: 5,
    parameters: { 
      loa: '69.8', 
      beam: '16.0', 
      depth: '6.8', 
      draft: '5.2', 
      power: '混合动力 + 蓄电池储能',
      displacement: '3,100 吨',
      speed: '16.0 节'
    },
    features: ['3D 动态波浪补偿栈桥联动', '风场运维人员登乘轨迹', '离岸作业高精度定位']
  },
  {
    id: 'M-007',
    name: '37米 多用途海洋工程支持船',
    type: '多用途支持船 (AHTS)',
    category: '海工辅助',
    description: '灵活的多功能近海工作船 3D 模型，支持拖拽、抛锚、潜水支持及小规模物资补给。',
    thumbnail: supportModelBg,
    lodLevel: 'LOD 300',
    meshCount: '640,000 面',
    compartments: 4,
    parameters: { 
      loa: '37.0', 
      beam: '10.4', 
      depth: '4.5', 
      draft: '3.5', 
      power: '双机双桨常规柴油动力',
      displacement: '950 吨',
      speed: '12.0 节'
    },
    features: ['拖缆机作业危险警戒弧区', '潜水作业支持定位', '多模式锚泊姿态显示']
  },
  {
    id: 'M-008',
    name: '18500 DWT 绿色节能油化船',
    type: '不锈钢化学品船',
    category: '特种危化运输',
    description: 'IMO II 类化学品船 3D 高精度模型，具备独立双相不锈钢货舱、深井泵及全船防爆监测感知节点。',
    thumbnail: chemTankerModelBg,
    lodLevel: 'LOD 350',
    meshCount: '1,180,000 面',
    compartments: 14,
    parameters: { 
      loa: '149.8', 
      beam: '24.0', 
      depth: '13.2', 
      draft: '9.8', 
      power: '电控二冲程低速柴油机',
      displacement: '25,600 吨',
      speed: '14.0 节'
    },
    features: ['2205双相不锈钢舱壁三维网格', '有毒有害化学气体扩散模拟', '洗舱作业人员实时跟踪']
  }
];

export function ShipModelManagement() {
  const [selectedModel, setSelectedModel] = useState<ShipModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', '清洁能源运输', '集装箱班轮', '液体散货', '干散货运输', '海洋工程', '海上风电装备', '特种危化运输'];

  const filteredModels = mockShipModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 顶部搜索与类型筛选工具栏 */}
      <div className="flex flex-wrap justify-between items-center bg-white p-3.5 border border-slate-200 rounded-xl shadow-sm shrink-0 gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 3D 船模名称、船型或分类..." 
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Box className="w-4 h-4 text-blue-600" />
          <span>已载入 <strong className="text-slate-800">{filteredModels.length}</strong> 款高精度 3D 船模数模</span>
        </div>
      </div>

      {/* 3D 船模卡片列表网格 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {filteredModels.map(model => (
            <div 
              key={model.id} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group flex flex-col"
            >
              {/* 3D 模型视口预览区域 */}
              <div className="aspect-[16/9] relative bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setSelectedModel(model)}>
                <img 
                  src={model.thumbnail} 
                  alt={model.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                />
                
                {/* 3D 科技蓝图光效微光覆层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none"></div>

                {/* 左上角 3D 孪生标识徽章 */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                  <Box className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>3D CAD 数模</span>
                </div>

                {/* 右上角 船型类型 */}
                <div className="absolute top-2.5 right-2.5 bg-blue-600/90 backdrop-blur text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {model.type}
                </div>

                {/* 底部 3D 网格精度与舱段指标条 */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <span className="flex items-center gap-1 text-cyan-300 font-mono">
                    <Layers className="w-3 h-3" /> {model.lodLevel}
                  </span>
                  <span className="font-mono text-slate-300">{model.compartments} 个 3D 舱段</span>
                </div>
              </div>

              {/* 卡片详情内容 */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Ship className="w-4 h-4 text-blue-600 shrink-0" />
                    <h3 className="font-bold text-slate-800 text-sm truncate" title={model.name}>
                      {model.name}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0 font-medium">
                    {model.category}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed h-8">
                  {model.description}
                </p>

                {/* 核心参数胶囊 */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 mb-3 text-center">
                  <div>
                    <div className="text-[9px] text-slate-400">总长(LOA)</div>
                    <div className="text-xs font-bold font-mono text-slate-700">{model.parameters.loa}m</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400">型宽(Beam)</div>
                    <div className="text-xs font-bold font-mono text-slate-700">{model.parameters.beam}m</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400">型深(Depth)</div>
                    <div className="text-xs font-bold font-mono text-slate-700">{model.parameters.depth}m</div>
                  </div>
                </div>
                
                {/* 底部按钮栏 */}
                <div className="mt-auto pt-2 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => setSelectedModel(model)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> 查看 3D 拓扑与参数
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D 船模详细参数与结构弹窗 */}
      {selectedModel && (
        <div 
          onClick={() => setSelectedModel(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]"
          >
            {/* 顶部 3D 渲染大图展示 */}
            <div className="relative aspect-[21/9] bg-slate-950 overflow-hidden shrink-0">
              <img 
                src={selectedModel.thumbnail} 
                alt={selectedModel.name} 
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              {/* 关闭按钮 */}
              <button 
                onClick={() => setSelectedModel(null)}
                className="absolute top-4 right-4 text-white hover:text-slate-200 bg-black/40 hover:bg-black/70 p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-4 left-6 flex items-center gap-2">
                <span className="flex items-center gap-1 bg-cyan-500/80 backdrop-blur text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Box className="w-3.5 h-3.5" /> 3D 数字孪生模型
                </span>
                <span className="bg-white/20 backdrop-blur text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {selectedModel.lodLevel}
                </span>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">
                    {selectedModel.category} · {selectedModel.type}
                  </div>
                  <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 drop-shadow-md">
                    <Ship className="w-6 h-6 text-cyan-400" /> {selectedModel.name}
                  </h2>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] text-slate-300">3D 网格多边形</div>
                  <div className="text-cyan-300 font-mono font-bold text-sm">{selectedModel.meshCount}</div>
                </div>
              </div>
            </div>
            
            {/* 内容区 */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* 简介 */}
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {selectedModel.description}
              </p>

              {/* 核心主尺度参数 */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> 船舶主尺度与关键物理参数 (3D 数模基准)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">总长 (LOA)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.loa} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">型宽 (Beam)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.beam} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">型深 (Depth)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.depth} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">设计吃水 (Draft)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.draft} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">满载排水量</div>
                    <div className="font-mono text-sm font-bold text-slate-800">{selectedModel.parameters.displacement}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">设计航速</div>
                    <div className="font-mono text-sm font-bold text-slate-800">{selectedModel.parameters.speed}</div>
                  </div>
                  <div className="col-span-2 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">主机及推进形式</div>
                    <div className="text-xs font-bold text-slate-800 truncate">{selectedModel.parameters.power}</div>
                  </div>
                </div>
              </div>

              {/* 3D 空间定位与安全孪生特性 */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span> 3D 空间结构与人员定位联动特性
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {selectedModel.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs text-blue-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 弹窗底部操作 */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => setSelectedModel(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => setSelectedModel(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/30 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> 确认选用该 3D 模型
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

