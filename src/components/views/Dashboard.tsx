import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  User, 
  Users, 
  AlertTriangle, 
  Bell, 
  Search, 
  Maximize, 
  MapPin, 
  Cloud, 
  Activity, 
  Server, 
  Radio, 
  Crosshair, 
  Layers, 
  Cpu, 
  Compass,
  LogOut,
  Eye,
  EyeOff,
  Ship,
  Building2,
  ChevronDown,
  Anchor,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Gauge,
  Wifi,
  Volume2,
  Wind,
  BatteryCharging,
  Zap,
  Info,
  Shield,
  X
} from 'lucide-react';
import { ViewType } from '@/src/types';

// 设备细分类型定义 (对应附图分类)
export type DeviceCategoryType = 'all' | 'work_station' | 'main_station' | 'gas_detector' | 'alarm_light';

// 空间电子围栏区域接口 (对应附图的多边形分区与状态浮标，并与电子围栏模块保持配置一致)
export interface SpatialElectronicFence {
  id: string;
  name: string;
  code: string;
  scopeType?: 'yard' | 'project';
  projectId?: string;
  projectName?: string;
  type?: string;
  dangerLevel?: 'high' | 'medium' | 'low';
  points: string; // SVG 0 0 100 100 坐标百分比多边形
  strokeColor: string;
  fillColor: string;
  labelX: number; // 标签百分比坐标
  labelY: number;
  statusBadge?: {
    x: number;
    y: number;
    title: string;
    subText: string;
    statusColor?: string;
  };
  details: {
    areaType: string;
    securityLevel: string;
    allowedRoles: string;
    maxCapacity: number;
    currentOccupancy: number;
  };
  devices?: { id: string; name: string; type: string; status: string }[];
  todayViolations?: number;
}

// 空间定位设备实体接口 (包含经纬度/坐标、信号覆盖半径与监测参数)
export interface SpatialDevice {
  id: string;
  name: string;
  category: 'work_station' | 'main_station' | 'gas_detector' | 'alarm_light';
  categoryLabel: string;
  code: string;
  location: string;
  top: string;
  left: string;
  status: 'online' | 'warning' | 'offline';
  coverageRadius: number; // 像素覆盖半径
  coverageColor: string; // 覆盖波纹主色
  battery: string;
  frequency: string;
  valueText?: string;
  power?: string;
}

// 导入船模背景图
import lngModelBg from '@/src/assets/images/lng_ship_model_1787972569670.jpg';
import containerModelBg from '@/src/assets/images/container_ship_model_1787972581740.jpg';
import tankerModelBg from '@/src/assets/images/tanker_ship_model_1787972594875.jpg';
import bulkModelBg from '@/src/assets/images/bulk_ship_model_1787972609425.jpg';

// 圆角科技风格面板容器组件
const SciFiPanel: React.FC<{ 
  title: string; 
  icon?: React.ReactNode; 
  extra?: React.ReactNode;
  children: React.ReactNode; 
  className?: string;
  bodyClassName?: string;
}> = ({ title, icon, extra, children, className = '', bodyClassName = '' }) => (
  <div 
    onClick={(e) => e.stopPropagation()} 
    className={`relative bg-[#061833]/85 border border-[#1f4a7c]/80 flex flex-col backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(31,74,124,0.35)] rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ${className}`}
  >
    {/* 四个圆角发光弧线微光装饰 */}
    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00d2ff]/80 rounded-tl-lg pointer-events-none z-20"></div>
    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00d2ff]/80 rounded-tr-lg pointer-events-none z-20"></div>
    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00d2ff]/80 rounded-bl-lg pointer-events-none z-20"></div>
    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00d2ff]/80 rounded-br-lg pointer-events-none z-20"></div>

    {/* 面板顶部标题栏 */}
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f4a7c]/60 bg-gradient-to-r from-[#0c315e]/80 via-[#0a264a]/50 to-transparent relative z-10 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="text-[#00d2ff] flex items-center justify-center shrink-0">
          {icon || <div className="w-2 h-2 bg-[#00d2ff] rounded-full"></div>}
        </div>
        <h3 className="text-[#e2f1ff] text-[13px] font-bold tracking-wider drop-shadow-[0_0_6px_rgba(0,210,255,0.4)] whitespace-nowrap">
          {title}
        </h3>
      </div>
      
      <div className="flex items-center gap-1.5 shrink-0">
        {extra ? extra : (
          <div className="flex gap-1 opacity-70">
            <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>

    {/* 面板内容区域 */}
    <div className={`flex-1 p-3 overflow-hidden flex flex-col relative z-10 ${bodyClassName}`}>
      {children}
    </div>
  </div>
);

// 造船项目配置接口
interface ProjectDashboardConfig {
  id: string;
  name: string;
  shipType: string;
  shipCode: string;
  phase: string;
  progress: number;
  dockingArea: string;
  manager: string;
  version: string;
  bgImage: string;
  totalPersonnel: number;
  onDutyPersonnel: number;
  offDutyPersonnel: number;
  alarmPersonnel: number;
  distributionData: { name: string; value: number; max: number }[];
  typeData: { name: string; value: number; color: string }[];
  trendData: { time: string; 在岗人数: number; 报警人数: number }[];
  deviceSummary: { total: number; online: number; offline: number; fault: number };
  deviceList: { id: string; type: string; status: string; location: string; statusColor: string; dotColor: string }[];
  alerts: { time: string; name: string; reason: string; location: string }[];
  featuredWorker: { name: string; id: string; role: string; location: string; time: string; status: string };
  markers: { id: string; role: string; name: string; type: 'online' | 'offline' | 'alarm'; top: string; left: string }[];
  fences: { label: string; location: string; top: string; left: string; width: string; height: string }[];
  kpis: { label: string; value: string; change: string; isUp: boolean; icon: any; iconBg: string }[];
}

// 4大造船项目详细孪生数据 (与电子围栏模块保持项目ID、围栏及设备关联严格一致)
const projectListConfig: ProjectDashboardConfig[] = [
  {
    id: 'PRJ-2026-LNG01',
    name: '17.4万m³ 薄膜型大型LNG船',
    shipType: 'LNG船',
    shipCode: 'HULL-LNG-174',
    phase: '合拢焊接',
    progress: 45,
    dockingArea: '1号造船台 (不可移泊)',
    manager: '王建国',
    version: 'V2.1 (合拢合口焊接)',
    bgImage: lngModelBg,
    totalPersonnel: 186,
    onDutyPersonnel: 178,
    offDutyPersonnel: 8,
    alarmPersonnel: 3,
    distributionData: [
      { name: '1#液货舱', value: 52, max: 60 },
      { name: '2#液货舱', value: 46, max: 60 },
      { name: '合拢分段区', value: 38, max: 60 },
      { name: '主甲板管系', value: 24, max: 60 },
      { name: '机舱底部', value: 16, max: 60 },
      { name: '艏楼甲板', value: 10, max: 60 },
    ],
    typeData: [
      { name: '焊工技师', value: 42.5, color: '#00d2ff' },
      { name: '装配钳工', value: 26.8, color: '#00e676' },
      { name: '探伤质检', value: 18.2, color: '#ffb300' },
      { name: '安全巡检', value: 12.5, color: '#f4511e' },
    ],
    trendData: [
      { time: '00:00', 在岗人数: 28, 报警人数: 1 },
      { time: '04:00', 在岗人数: 20, 报警人数: 0 },
      { time: '08:00', 在岗人数: 165, 报警人数: 12 },
      { time: '12:00', 在岗人数: 178, 报警人数: 18 },
      { time: '16:00', 在岗人数: 172, 报警人数: 14 },
      { time: '20:00', 在岗人数: 85, 报警人数: 4 },
      { time: '24:00', 在岗人数: 30, 报警人数: 1 },
    ],
    deviceSummary: { total: 52, online: 49, offline: 2, fault: 1 },
    deviceList: [
      { id: 'LNG-BS-M01', type: '主甲板网关主基站', status: '在线', location: '主甲板中控室顶', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'LNG-BS-W01', type: '合拢作业面基站', status: '在线', location: '1#绝热箱合拢位', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'LNG-GAS-01', type: '四合一气体检测仪', status: '在线', location: '2#密闭货舱通道', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'LNG-ALM-01', type: '吊装防碰声光报警', status: '在线', location: '主甲板吊运口', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'LNG-BS-W02', type: '机舱作业面基站', status: '在线', location: '艉部主推进机舱', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'LNG-BS-W03', type: '艏楼作业面基站', status: '离线', location: '艏楼压载舱', statusColor: 'text-[#ffb300]', dotColor: 'bg-[#ffb300]' },
    ],
    alerts: [
      { time: '10:28', name: '李强', reason: '密闭舱室作业未通风', location: '1#液货舱底部' },
      { time: '10:14', name: '王亮', reason: '动火作业未设看火人', location: '主甲板合拢段' },
      { time: '09:55', name: '赵宏', reason: '未佩戴防爆定位手环', location: '2#罐体通道' },
      { time: '09:30', name: '陈兵', reason: '超出受限空间许可时间', location: '主泵舱底部' },
    ],
    featuredWorker: {
      name: '张三 (组长)',
      id: 'LNG20260421',
      role: '高级焊接技师',
      location: '1#液货舱绝热合拢段',
      time: '2026-08-28 10:30:30',
      status: '在岗施工'
    },
    markers: [
      { id: 'LNG-W1', role: '合拢焊工', name: '张三', type: 'online', top: '26%', left: '38%' },
      { id: 'LNG-W2', role: '探伤员', name: '李四', type: 'online', top: '35%', left: '28%' },
      { id: 'LNG-W3', role: '绝热装配工', name: '王五', type: 'online', top: '30%', left: '52%' },
      { id: 'LNG-W4', role: '安全巡检员', name: '赵六', type: 'online', top: '22%', left: '66%' },
      { id: 'LNG-W5', role: '打磨工', name: '钱七', type: 'alarm', top: '48%', left: '42%' },
      { id: 'LNG-W6', role: '机舱电工', name: '孙八', type: 'offline', top: '40%', left: '60%' },
      { id: 'LNG-W7', role: '起重指挥工', name: '周九', type: 'online', top: '18%', left: '48%' },
    ],
    fences: [
      { label: '1#液货舱绝热合拢受限空间', location: '1#液货舱/合拢口', top: '28%', left: '22%', width: '190px', height: '110px' },
      { label: '主甲板高压管路动火作业区', location: '主甲板管系区域', top: '24%', left: '50%', width: '210px', height: '110px' }
    ],
    kpis: [
      { label: '船上作业总数', value: '186', change: '+3.8%', isUp: true, icon: Users, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '在岗施工人数', value: '178', change: '+4.2%', isUp: true, icon: User, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '受限空间违规', value: '3', change: '-25.0%', isUp: false, icon: AlertTriangle, iconBg: 'bg-amber-500/30 text-[#ffb300] border-amber-500/40' },
      { label: '船载传感器数', value: '52', change: '+5.0%', isUp: true, icon: Cpu, iconBg: 'bg-cyan-500/30 text-[#00d2ff] border-cyan-500/40' },
      { label: '合拢焊接进度', value: '45.0%', change: '+1.5%', isUp: true, icon: Activity, iconBg: 'bg-emerald-500/30 text-[#00e676] border-emerald-500/40' },
      { label: '气体监测达标率', value: '99.8%', change: '+0.2%', isUp: true, icon: Compass, iconBg: 'bg-indigo-500/30 text-[#8ab4f8] border-indigo-500/40' },
    ]
  },
  {
    id: 'PRJ-2026-CTN02',
    name: '24000TEU 超大型集装箱船',
    shipType: '集装箱船',
    shipCode: 'HULL-CTN-240',
    phase: '系泊试验',
    progress: 85,
    dockingArea: '1号码头 (可移泊)',
    manager: '李海波',
    version: 'V3.0 (系泊电气调试)',
    bgImage: containerModelBg,
    totalPersonnel: 142,
    onDutyPersonnel: 136,
    offDutyPersonnel: 6,
    alarmPersonnel: 2,
    distributionData: [
      { name: '集装箱导轨架', value: 48, max: 55 },
      { name: '驾驶甲板楼', value: 34, max: 55 },
      { name: '主推进主机舱', value: 28, max: 55 },
      { name: '首侧推机舱', value: 16, max: 55 },
      { name: '系泊绞缆甲板', value: 16, max: 55 },
    ],
    typeData: [
      { name: '电气调试', value: 38.6, color: '#00d2ff' },
      { name: '轮机调试', value: 32.4, color: '#00e676' },
      { name: '涂装补漆', value: 16.5, color: '#ffb300' },
      { name: '船东代表', value: 12.5, color: '#f4511e' },
    ],
    trendData: [
      { time: '00:00', 在岗人数: 15, 报警人数: 0 },
      { time: '04:00', 在岗人数: 10, 报警人数: 0 },
      { time: '08:00', 在岗人数: 120, 报警人数: 4 },
      { time: '12:00', 在岗人数: 136, 报警人数: 8 },
      { time: '16:00', 在岗人数: 130, 报警人数: 5 },
      { time: '20:00', 在岗人数: 55, 报警人数: 1 },
      { time: '24:00', 在岗人数: 18, 报警人数: 0 },
    ],
    deviceSummary: { total: 60, online: 58, offline: 2, fault: 0 },
    deviceList: [
      { id: 'CTN-BS-M01', type: '驾驶室顶甲板主基站', status: '在线', location: '驾驶室顶甲板', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'CTN-BS-W01', type: '导轨架作业面基站', status: '在线', location: '10#箱位导轨架', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'CTN-ALM-01', type: '落水防溺报警器', status: '在线', location: '艏艉系泊舷梯', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'CTN-BS-W02', type: '中控室作业基站', status: '在线', location: '电气中控室', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'CTN-GAS-01', type: '通风气体检测仪', status: '在线', location: '主机舱集控室', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
    ],
    alerts: [
      { time: '10:22', name: '刘东', reason: '临水边缘未挂安全绳', location: '右舷艉甲板' },
      { time: '09:40', name: '郭凯', reason: '配电屏调试未设警示牌', location: '配电控制室' },
    ],
    featuredWorker: {
      name: '李海波 (主管)',
      id: 'CTN20260901',
      role: '系泊调试总师',
      location: '集控室主配电盘区',
      time: '2026-08-28 10:15:20',
      status: '带电调试'
    },
    markers: [
      { id: 'CTN-W1', role: '调试总师', name: '李海波', type: 'online', top: '24%', left: '70%' },
      { id: 'CTN-W2', role: '轮机调试工', name: '郑华', type: 'online', top: '38%', left: '48%' },
      { id: 'CTN-W3', role: '系泊工', name: '吴磊', type: 'online', top: '48%', left: '20%' },
      { id: 'CTN-W4', role: '导轨装配工', name: '王敏', type: 'alarm', top: '34%', left: '32%' },
      { id: 'CTN-W5', role: '电气工', name: '杨光', type: 'online', top: '30%', left: '56%' },
      { id: 'CTN-W6', role: '防坠巡检员', name: '刘强', type: 'online', top: '44%', left: '74%' },
      { id: 'CTN-W7', role: '验船师', name: '陈思远', type: 'offline', top: '20%', left: '62%' },
    ],
    fences: [
      { label: '艏楼导轨架安装禁区', location: '艏楼导轨安装面', top: '30%', left: '26%', width: '200px', height: '100px' },
      { label: '舷侧临水高空防坠警戒区', location: '舷侧临水边缘', top: '32%', left: '55%', width: '210px', height: '95px' }
    ],
    kpis: [
      { label: '调试人员总数', value: '142', change: '+2.1%', isUp: true, icon: Users, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '在岗调试人数', value: '136', change: '+3.0%', isUp: true, icon: User, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '高空防坠预警', value: '2', change: '-50.0%', isUp: false, icon: AlertTriangle, iconBg: 'bg-amber-500/30 text-[#ffb300] border-amber-500/40' },
      { label: '调试传感器数', value: '60', change: '+4.0%', isUp: true, icon: Cpu, iconBg: 'bg-cyan-500/30 text-[#00d2ff] border-cyan-500/40' },
      { label: '系泊试验进度', value: '85.0%', change: '+0.5%', isUp: true, icon: Activity, iconBg: 'bg-emerald-500/30 text-[#00e676] border-emerald-500/40' },
      { label: '临水边缘安全率', value: '100%', change: '0.0%', isUp: true, icon: Compass, iconBg: 'bg-indigo-500/30 text-[#8ab4f8] border-indigo-500/40' },
    ]
  },
  {
    id: 'PRJ-2026-VLCC03',
    name: '30万吨级 超大型原油船(VLCC)',
    shipType: '原油船',
    shipCode: 'HULL-VLCC-300',
    phase: '密闭涂装',
    progress: 60,
    dockingArea: '3号码头 (可移泊)',
    manager: '张明',
    version: 'V4.0 (试航前管系试压)',
    bgImage: tankerModelBg,
    totalPersonnel: 98,
    onDutyPersonnel: 94,
    offDutyPersonnel: 4,
    alarmPersonnel: 1,
    distributionData: [
      { name: '货油管系总管', value: 36, max: 40 },
      { name: '主甲板阀门段', value: 25, max: 40 },
      { name: '惰性气体机舱', value: 18, max: 40 },
      { name: '居住楼生活区', value: 15, max: 40 },
    ],
    typeData: [
      { name: '管系技工', value: 45.0, color: '#00d2ff' },
      { name: '压力测试', value: 25.0, color: '#00e676' },
      { name: '油漆防腐', value: 18.0, color: '#ffb300' },
      { name: '验船师', value: 12.0, color: '#f4511e' },
    ],
    trendData: [
      { time: '00:00', 在岗人数: 12, 报警人数: 0 },
      { time: '04:00', 在岗人数: 8, 报警人数: 0 },
      { time: '08:00', 在岗人数: 88, 报警人数: 3 },
      { time: '12:00', 在岗人数: 94, 报警人数: 5 },
      { time: '16:00', 在岗人数: 90, 报警人数: 3 },
      { time: '20:00', 在岗人数: 40, 报警人数: 1 },
      { time: '24:00', 在岗人数: 15, 报警人数: 0 },
    ],
    deviceSummary: { total: 44, online: 42, offline: 2, fault: 0 },
    deviceList: [
      { id: 'VLCC-BS-M01', type: '货油中控主基站', status: '在线', location: '主甲板中控楼', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'VLCC-GAS-01', type: '泵舱VOC气体分析仪', status: '在线', location: '货油泵舱底段', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'VLCC-BS-W01', type: '隔舱防爆基站', status: '在线', location: '1号隔离舱段', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'VLCC-ALM-01', type: '管汇高压报警器', status: '在线', location: '甲板货油管汇处', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
    ],
    alerts: [
      { time: '10:05', name: '陈明', reason: '管系试压区域违规逗留', location: '主甲板左舷' },
    ],
    featuredWorker: {
      name: '张明 (项目经理)',
      id: 'VLCC20251110',
      role: 'VLCC建造总管',
      location: '主甲板货油管汇处',
      time: '2026-08-28 09:50:12',
      status: '现场核验'
    },
    markers: [
      { id: 'VLCC-W1', role: '建造总管', name: '张明', type: 'online', top: '28%', left: '60%' },
      { id: 'VLCC-W2', role: '试压工程师', name: '宋超', type: 'online', top: '38%', left: '76%' },
      { id: 'VLCC-W3', role: '泵舱管工', name: '周志强', type: 'online', top: '44%', left: '46%' },
      { id: 'VLCC-W4', role: '防腐涂装工', name: '刘小军', type: 'alarm', top: '32%', left: '34%' },
      { id: 'VLCC-W5', role: '双层底焊工', name: '吴峰', type: 'online', top: '46%', left: '26%' },
      { id: 'VLCC-W6', role: '外籍验船师', name: 'Hans', type: 'offline', top: '24%', left: '78%' },
    ],
    fences: [
      { label: '泵舱与货油舱受限空间', location: '机舱双层底及泵舱区', top: '28%', left: '46%', width: '190px', height: '110px' },
      { label: '主甲板货油总管高压试压区', location: '主甲板高压管段', top: '30%', left: '74%', width: '180px', height: '95px' }
    ],
    kpis: [
      { label: '涂装作业人数', value: '98', change: '+1.2%', isUp: true, icon: Users, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '在岗施工人数', value: '94', change: '+2.0%', isUp: true, icon: User, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '试压安全告警', value: '1', change: '-66.7%', isUp: false, icon: AlertTriangle, iconBg: 'bg-amber-500/30 text-[#ffb300] border-amber-500/40' },
      { label: '在线传感器', value: '42', change: '+2.4%', isUp: true, icon: Cpu, iconBg: 'bg-cyan-500/30 text-[#00d2ff] border-cyan-500/40' },
      { label: '密闭涂装进度', value: '60.0%', change: '+3.0%', isUp: true, icon: Activity, iconBg: 'bg-emerald-500/30 text-[#00e676] border-emerald-500/40' },
      { label: '管系试压合格率', value: '100%', change: '0.0%', isUp: true, icon: Compass, iconBg: 'bg-indigo-500/30 text-[#8ab4f8] border-indigo-500/40' },
    ]
  },
  {
    id: 'PRJ-2026-BULK04',
    name: '8.2万吨 卡姆萨尔型散货船',
    shipType: '散货船',
    shipCode: 'HULL-BULK-082',
    phase: '分段搭载',
    progress: 30,
    dockingArea: '2号造船台 (不可移泊)',
    manager: '陈远',
    version: 'V1.3 (分段总组搭载)',
    bgImage: bulkModelBg,
    totalPersonnel: 76,
    onDutyPersonnel: 72,
    offDutyPersonnel: 4,
    alarmPersonnel: 2,
    distributionData: [
      { name: '1#大舱分段', value: 28, max: 35 },
      { name: '2#大舱分段', value: 24, max: 35 },
      { name: '艉部机舱总组', value: 12, max: 35 },
      { name: '双层底压载舱', value: 8, max: 35 },
    ],
    typeData: [
      { name: '船台铆焊', value: 50.0, color: '#00d2ff' },
      { name: '起重吊装', value: 25.0, color: '#00e676' },
      { name: '分段校正', value: 15.0, color: '#ffb300' },
      { name: '安全监督', value: 10.0, color: '#f4511e' },
    ],
    trendData: [
      { time: '00:00', 在岗人数: 8, 报警人数: 0 },
      { time: '04:00', 在岗人数: 5, 报警人数: 0 },
      { time: '08:00', 在岗人数: 68, 报警人数: 2 },
      { time: '12:00', 在岗人数: 72, 报警人数: 4 },
      { time: '16:00', 在岗人数: 70, 报警人数: 3 },
      { time: '20:00', 在岗人数: 30, 报警人数: 1 },
      { time: '24:00', 在岗人数: 10, 报警人数: 0 },
    ],
    deviceSummary: { total: 32, online: 30, offline: 2, fault: 0 },
    deviceList: [
      { id: 'BULK-BS-M01', type: '船台总组主基站', status: '在线', location: '2号船台搭载总控', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'BULK-BS-W01', type: '大舱舷梯基站', status: '在线', location: '1#大舱舷梯口', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'BULK-GAS-01', type: '压载舱气体检测仪', status: '在线', location: '双层底压载舱', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
      { id: 'BULK-ALM-01', type: '大件吊装防碰警报', status: '在线', location: '总组吊装龙门架', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
    ],
    alerts: [
      { time: '09:50', name: '孙强', reason: '大件吊装半径内违规停留', location: '2#大舱总组区' },
    ],
    featuredWorker: {
      name: '陈远 (搭载长)',
      id: 'BULK20260115',
      role: '船台总搭载工程师',
      location: '1#货舱基座定位点',
      time: '2026-08-28 09:35:40',
      status: '吊装对位'
    },
    markers: [
      { id: 'BULK-W1', role: '总搭载工', name: '陈远', type: 'online', top: '24%', left: '40%' },
      { id: 'BULK-W2', role: '吊车指挥', name: '赵刚', type: 'online', top: '20%', left: '54%' },
      { id: 'BULK-W3', role: '结构焊接工', name: '王利', type: 'alarm', top: '34%', left: '26%' },
      { id: 'BULK-W4', role: '分段校正工', name: '钱大明', type: 'online', top: '44%', left: '62%' },
      { id: 'BULK-W5', role: '探伤质检员', name: '孙建军', type: 'online', top: '38%', left: '72%' },
      { id: 'BULK-W6', role: '船台铆工', name: '周成', type: 'offline', top: '48%', left: '36%' },
    ],
    fences: [
      { label: '船台大件总组吊装警戒', location: '2号船台搭载区', top: '24%', left: '38%', width: '210px', height: '110px' },
      { label: '双层底压载舱密闭作业区', location: '双层底压载舱', top: '30%', left: '70%', width: '190px', height: '100px' }
    ],
    kpis: [
      { label: '船台搭载人数', value: '76', change: '+2.7%', isUp: true, icon: Users, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '在岗施工人数', value: '72', change: '+3.1%', isUp: true, icon: User, iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' },
      { label: '吊装区域告警', value: '2', change: '0.0%', isUp: true, icon: AlertTriangle, iconBg: 'bg-amber-500/30 text-[#ffb300] border-amber-500/40' },
      { label: '在线定位设备', value: '30', change: '+3.4%', isUp: true, icon: Cpu, iconBg: 'bg-cyan-500/30 text-[#00d2ff] border-cyan-500/40' },
      { label: '分段总组进度', value: '30.0%', change: '+2.0%', isUp: true, icon: Activity, iconBg: 'bg-emerald-500/30 text-[#00e676] border-emerald-500/40' },
      { label: '高空防坠合格率', value: '99.5%', change: '+0.5%', isUp: true, icon: Compass, iconBg: 'bg-indigo-500/30 text-[#8ab4f8] border-indigo-500/40' },
    ]
  }
];

// 厂区视图的数据
const yardDistributionData = [
  { name: '1#船台', value: 342, max: 350 },
  { name: '2#船台', value: 286, max: 350 },
  { name: '总装车间', value: 210, max: 350 },
  { name: '分段车间', value: 158, max: 350 },
  { name: '涂装车间', value: 132, max: 350 },
  { name: '机舱车间', value: 80, max: 350 },
  { name: '仓储区', value: 40, max: 350 },
];

const yardTypeData = [
  { name: '管理人员', value: 12.3, color: '#00b4d8' },
  { name: '技术人员', value: 28.7, color: '#00d26a' },
  { name: '作业人员', value: 45.6, color: '#ffc107' },
  { name: '外包人员', value: 13.4, color: '#ff7849' },
];

const yardTrendData = [
  { time: '00:00', 在岗人数: 220, 报警人数: 15 },
  { time: '04:00', 在岗人数: 180, 报警人数: 10 },
  { time: '08:00', 在岗人数: 1100, 报警人数: 120 },
  { time: '12:00', 在岗人数: 1450, 报警人数: 230 },
  { time: '16:00', 在岗人数: 1320, 报警人数: 180 },
  { time: '20:00', 在岗人数: 600, 报警人数: 40 },
  { time: '24:00', 在岗人数: 200, 报警人数: 10 },
];

const yardAlerts = [
  { time: '10:25', name: '张三', reason: '未佩戴安全帽', location: '2#船台' },
  { time: '10:18', name: '李四', reason: '进入危险区域', location: '涂装车间' },
  { time: '10:15', name: '王五', reason: '长时间静止', location: '仓储区' },
  { time: '09:58', name: '赵六', reason: '超出活动范围', location: '机舱车间' },
  { time: '09:45', name: '钱七', reason: '未佩戴工牌', location: '总装车间' },
  { time: '09:32', name: '孙八', reason: '进入高压受限区', location: '1#船台' },
  { time: '09:20', name: '周九', reason: '无许可登高作业', location: '分段车间' },
  { time: '09:05', name: '吴十', reason: '跨越警戒围栏', location: '码头西区' },
];

const yardDeviceTypes = [
  { name: '定位基站', value: 45.3, color: '#00a2ff' },
  { name: '信标标签', value: 30.1, color: '#00c2cb' },
  { name: '定位手环', value: 15.6, color: '#ff9800' },
  { name: '其他设备', value: 9.0, color: '#f4511e' },
];

const yardDeviceList = [
  { id: '基站-01', type: '定位基站', status: '在线', location: '1#船台', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
  { id: '基站-02', type: '定位基站', status: '在线', location: '总装车间', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
  { id: '信标-001', type: '信标标签', status: '在线', location: '分段车间A区', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
  { id: '信标-002', type: '信标标签', status: '离线', location: '仓储区', statusColor: 'text-[#ffb300]', dotColor: 'bg-[#ffb300]' },
  { id: '手环-045', type: '定位手环', status: '在线', location: '机舱车间', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
  { id: '信标-003', type: '信标标签', status: '故障', location: '涂装车间', statusColor: 'text-[#ff1744]', dotColor: 'bg-[#ff1744]' },
  { id: '基站-03', type: '定位基站', status: '在线', location: '2#船台东侧', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
  { id: '手环-088', type: '定位手环', status: '在线', location: '码头南区', statusColor: 'text-[#00e676]', dotColor: 'bg-[#00e676]' },
];

// 厂区全景图空间电子围栏多边形定义 (与电子围栏模块保持名称、编码、危险级别、关联设备及点位完全一致)
const YARD_ELECTRONIC_FENCES: SpatialElectronicFence[] = [
  // 1. 龙门吊作业区 (紫色霓虹发光多边形，紧凑贴合龙门吊主梁与分段搭载区)
  {
    id: 'FENCE-YARD-01',
    name: '龙门吊核心起重作业警戒区',
    code: 'EF-2026-001',
    scopeType: 'yard',
    type: 'crane',
    dangerLevel: 'high',
    points: '24.3,22.6 41.9,15.6 50.2,25.4 54.6,36.6 48.5,37.7 28.2,36.6 25.4,25.6',
    strokeColor: '#d946ef',
    fillColor: 'rgba(217, 70, 239, 0.28)',
    labelX: 38,
    labelY: 30,
    statusBadge: {
      x: 38,
      y: 15,
      title: '龙门吊G-01: 起重防碰警戒中',
      subText: '作业状态: 正常',
      statusColor: '#00e676'
    },
    details: {
      areaType: '大型起重重型作业警戒区',
      securityLevel: '一级严控警戒 (声光联动 + 防碰传感器)',
      allowedRoles: '起重指挥工、龙门吊司机、合拢焊工',
      maxCapacity: 50,
      currentOccupancy: 28
    },
    devices: [
      { id: 'DEV-BS-01', name: '龙门吊主梁中枢基站', type: '定位基站', status: 'online' },
      { id: 'DEV-ALM-01', name: '龙门吊吊运防碰声光报警器', type: '声光报警器', status: 'online' }
    ],
    todayViolations: 3
  },

  // 2. 钢材与预处理厂区 (暖金黄色霓虹发光多边形，紧凑贴合预处理下料切割区)
  {
    id: 'FENCE-YARD-02',
    name: '钢材下料与分段预处理区',
    code: 'EF-2026-002',
    scopeType: 'yard',
    type: 'assembly',
    dangerLevel: 'medium',
    points: '26.9,56.9 49.4,57.7 54.4,69.0 61.0,79.7 27.4,82.8 25.8,69.6',
    strokeColor: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.25)',
    labelX: 41,
    labelY: 71,
    statusBadge: {
      x: 41,
      y: 54,
      title: '预处理下料流水线',
      subText: '自动化切割开工率: 92%',
      statusColor: '#00e5ff'
    },
    details: {
      areaType: '钢材堆存与智能预处理车间',
      securityLevel: '二级管控区域 (红外+定位基站)',
      allowedRoles: '数控切割工、行车吊运工、质检员',
      maxCapacity: 80,
      currentOccupancy: 45
    },
    devices: [
      { id: 'DEV-BS-03', name: '预处理总厂区主基站', type: '定位基站', status: 'online' },
      { id: 'DEV-GAS-01', name: '钢材车间防爆气体监测仪', type: '气体检测仪', status: 'online' },
      { id: 'DEV-ALM-02', name: '钢材运输通道防撞报警器', type: '声光报警器', status: 'online' }
    ],
    todayViolations: 2
  },

  // 3. 3号码头舾装泊位 & S105轮 (青蓝色霓虹发光多边形，紧凑贴合右侧舾装船体泊位)
  {
    id: 'FENCE-YARD-03',
    name: '3号码头舾装泊位水域管制区',
    code: 'EF-2026-003',
    scopeType: 'yard',
    type: 'dock',
    dangerLevel: 'high',
    points: '71.7,23.7 83.2,18.7 88.2,39.6 75.0,47.3 70.0,35.2',
    strokeColor: '#06b6d4',
    fillColor: 'rgba(6, 182, 212, 0.26)',
    labelX: 77,
    labelY: 34,
    statusBadge: {
      x: 77,
      y: 17,
      title: 'S105轮: 设备维护完成 85%',
      subText: '作业状态: 正常',
      statusColor: '#00e676'
    },
    details: {
      areaType: '深水舾装码头及靠泊船体作业面',
      securityLevel: '特级防跌落/防溺水管控区',
      allowedRoles: '舾装管系工、电气调试工程师、登船检查员',
      maxCapacity: 60,
      currentOccupancy: 34
    },
    devices: [
      { id: 'DEV-BS-02', name: '3号码头枢纽主基站', type: '定位基站', status: 'online' },
      { id: 'DEV-BS-06', name: 'S105轮甲板舾装基站', type: '作业面基站', status: 'online' }
    ],
    todayViolations: 0
  },

  // 4. 1号船台分段合拢区 (翠绿色霓虹发光多边形，紧凑贴合左上方船台滑道搭载区)
  {
    id: 'FENCE-YARD-04',
    name: '1#船台分段合拢滑道作业区',
    code: 'EF-2026-004',
    scopeType: 'yard',
    type: 'hull',
    dangerLevel: 'medium',
    points: '6.3,5.0 20.6,5.0 23.9,16.5 10.7,17.6 6.3,13.8',
    strokeColor: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.24)',
    labelX: 14,
    labelY: 12,
    statusBadge: {
      x: 14,
      y: 4,
      title: '1#船台分段合拢区',
      subText: '精度偏差: ±2mm (优)',
      statusColor: '#10b981'
    },
    details: {
      areaType: '船体主干分段搭载合拢船台',
      securityLevel: '一级受限空间/高空防坠管控',
      allowedRoles: '船体装配工、合拢焊工、探伤工程师',
      maxCapacity: 40,
      currentOccupancy: 19
    },
    devices: [
      { id: 'DEV-BS-05', name: '1#船台合拢作业面基站', type: '作业面基站', status: 'online' },
      { id: 'DEV-GAS-02', name: '龙门吊合拢舱段气体仪', type: '气体检测仪', status: 'online' }
    ],
    todayViolations: 1
  }
];

// 单船/分段各项目的专属空间电子围栏定义 (与电子围栏模块INITIAL_FENCES项目配置完全一致)
const PROJECT_ELECTRONIC_FENCES: Record<string, SpatialElectronicFence[]> = {
  'PRJ-2026-LNG01': [
    {
      id: 'FENCE-LNG-01',
      name: '1#液货舱绝热合拢受限空间',
      code: 'EF-LNG-001',
      scopeType: 'project',
      projectId: 'PRJ-2026-LNG01',
      projectName: '17.4万m³ 薄膜型大型LNG船',
      dangerLevel: 'high',
      points: '16,28 34,28 38,54 14,54',
      strokeColor: '#06b6d4',
      fillColor: 'rgba(6, 182, 212, 0.26)',
      labelX: 25,
      labelY: 42,
      statusBadge: {
        x: 25,
        y: 26,
        title: '1#货舱绝热箱合拢',
        subText: '含氧量 20.9% 正常',
        statusColor: '#00e676'
      },
      details: {
        areaType: 'LNG船液货舱受限密闭空间',
        securityLevel: '特级密闭空间/有毒有害气体持续监控',
        allowedRoles: '绝热层焊接技师、装配钳工、安全员',
        maxCapacity: 30,
        currentOccupancy: 12
      },
      devices: [
        { id: 'LNG-GAS-01', name: '2#液货舱受限空间气体仪', type: '气体检测仪', status: 'online' },
        { id: 'LNG-BS-W01', name: '1#液货舱合拢作业面基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 2
    },
    {
      id: 'FENCE-LNG-02',
      name: '主甲板高压管路动火作业区',
      code: 'EF-LNG-002',
      scopeType: 'project',
      projectId: 'PRJ-2026-LNG01',
      projectName: '17.4万m³ 薄膜型大型LNG船',
      dangerLevel: 'high',
      points: '40,24 64,24 68,52 36,52',
      strokeColor: '#ef4444',
      fillColor: 'rgba(239, 68, 68, 0.25)',
      labelX: 52,
      labelY: 38,
      statusBadge: {
        x: 52,
        y: 20,
        title: '主甲板动火监控',
        subText: '专职看火人: 在岗',
        statusColor: '#00e676'
      },
      details: {
        areaType: '主甲板高压LNG管路与合拢动火区',
        securityLevel: '一级动火严格管控区 (双人专岗)',
        allowedRoles: '持动火证焊工、专职看火人、安全监督',
        maxCapacity: 25,
        currentOccupancy: 14
      },
      devices: [
        { id: 'LNG-ALM-01', name: '甲板吊装防碰声光报警器', type: '声光报警器', status: 'online' },
        { id: 'LNG-BS-M01', name: 'LNG船主甲板网关主基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 1
    }
  ],
  'PRJ-2026-CTN02': [
    {
      id: 'FENCE-CTN-01',
      name: '艏楼导轨架安装禁区',
      code: 'EF-CTN-001',
      scopeType: 'project',
      projectId: 'PRJ-2026-CTN02',
      projectName: '24000TEU 超大型集装箱船',
      dangerLevel: 'medium',
      points: '18,30 38,30 42,58 15,58',
      strokeColor: '#f59e0b',
      fillColor: 'rgba(245, 158, 11, 0.25)',
      labelX: 28,
      labelY: 44,
      statusBadge: {
        x: 28,
        y: 26,
        title: '导轨垂直度校正',
        subText: '偏差: ±1.2mm 达标',
        statusColor: '#00e676'
      },
      details: {
        areaType: '超大型集装箱导轨架起吊与垂直安装禁区',
        securityLevel: '二级落物防砸严控区',
        allowedRoles: '导轨装配钳工、起重指挥工、质检员',
        maxCapacity: 20,
        currentOccupancy: 8
      },
      devices: [
        { id: 'CTN-BS-W01', name: '10#箱位导轨作业面基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 0
    },
    {
      id: 'FENCE-CTN-02',
      name: '舷侧临水高空防坠警戒区',
      code: 'EF-CTN-002',
      scopeType: 'project',
      projectId: 'PRJ-2026-CTN02',
      projectName: '24000TEU 超大型集装箱船',
      dangerLevel: 'high',
      points: '44,28 78,28 74,54 40,54',
      strokeColor: '#00e5ff',
      fillColor: 'rgba(0, 229, 255, 0.24)',
      labelX: 58,
      labelY: 44,
      statusBadge: {
        x: 58,
        y: 24,
        title: '舷侧临水边缘防坠',
        subText: '安全绳挂扣率: 100%',
        statusColor: '#00e676'
      },
      details: {
        areaType: '高空舷侧与落水防溺高危管制区',
        securityLevel: '特级防坠落/防溺水联动报警',
        allowedRoles: '舾装调试工、电气工、安全巡检员',
        maxCapacity: 35,
        currentOccupancy: 18
      },
      devices: [
        { id: 'CTN-ALM-01', name: '艏艉系泊舷梯落水报警器', type: '声光报警器', status: 'online' },
        { id: 'CTN-BS-M01', name: '驾驶室顶甲板主基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 2
    }
  ],
  'PRJ-2026-VLCC03': [
    {
      id: 'FENCE-VLCC-01',
      name: '泵舱与货油舱受限空间',
      code: 'EF-VLCC-001',
      scopeType: 'project',
      projectId: 'PRJ-2026-VLCC03',
      projectName: '30万吨级 超大型原油船(VLCC)',
      dangerLevel: 'high',
      points: '32,26 62,26 65,56 30,56',
      strokeColor: '#ef4444',
      fillColor: 'rgba(239, 68, 68, 0.25)',
      labelX: 47,
      labelY: 41,
      statusBadge: {
        x: 47,
        y: 22,
        title: '货油泵舱封闭涂装',
        subText: 'VOC气体浓度: 达标',
        statusColor: '#00e676'
      },
      details: {
        areaType: '货油泵舱及双层底防腐涂装受限空间',
        securityLevel: '特级受限空间 (VOC挥发物与易燃气体监测)',
        allowedRoles: '货油管系工、防腐涂装工、安全员',
        maxCapacity: 25,
        currentOccupancy: 11
      },
      devices: [
        { id: 'VLCC-GAS-01', name: '货油泵舱防爆气体检测仪', type: '气体检测仪', status: 'online' },
        { id: 'VLCC-BS-W01', name: '1号隔舱防爆定位基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 1
    },
    {
      id: 'FENCE-VLCC-02',
      name: '主甲板货油总管高压试压区',
      code: 'EF-VLCC-002',
      scopeType: 'project',
      projectId: 'PRJ-2026-VLCC03',
      projectName: '30万吨级 超大型原油船(VLCC)',
      dangerLevel: 'medium',
      points: '64,28 88,28 86,52 62,52',
      strokeColor: '#f59e0b',
      fillColor: 'rgba(245, 158, 11, 0.25)',
      labelX: 75,
      labelY: 40,
      statusBadge: {
        x: 75,
        y: 24,
        title: '总管水压试验 2.5MPa',
        subText: '保压中: 无泄漏',
        statusColor: '#00e676'
      },
      details: {
        areaType: '主甲板超高压货油管系水压气密试验区',
        securityLevel: '二级高压禁入警戒',
        allowedRoles: '试压工程师、管工主管、验船师',
        maxCapacity: 15,
        currentOccupancy: 5
      },
      devices: [
        { id: 'VLCC-ALM-01', name: '货油管汇试压声光报警器', type: '声光报警器', status: 'online' },
        { id: 'VLCC-BS-M01', name: '货油控制中心主基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 0
    }
  ],
  'PRJ-2026-BULK04': [
    {
      id: 'FENCE-BULK-01',
      name: '船台大件总组吊装警戒',
      code: 'EF-BULK-001',
      scopeType: 'project',
      projectId: 'PRJ-2026-BULK04',
      projectName: '8.2万吨 卡姆萨尔型散货船',
      dangerLevel: 'high',
      points: '22,25 58,25 62,55 20,55',
      strokeColor: '#d946ef',
      fillColor: 'rgba(217, 70, 239, 0.28)',
      labelX: 40,
      labelY: 40,
      statusBadge: {
        x: 40,
        y: 20,
        title: '大舱总组分段吊装',
        subText: '警戒半径: 30米',
        statusColor: '#00e676'
      },
      details: {
        areaType: '船台总组分段整体吊装与精准对位区',
        securityLevel: '一级吊装重型警戒',
        allowedRoles: '船台铆焊工、吊装总指挥、校正工',
        maxCapacity: 30,
        currentOccupancy: 15
      },
      devices: [
        { id: 'BULK-BS-M01', name: '2号船台大件总组主基站', type: '定位基站', status: 'online' },
        { id: 'BULK-ALM-01', name: '船台大件吊装防碰报警器', type: '声光报警器', status: 'online' }
      ],
      todayViolations: 2
    },
    {
      id: 'FENCE-BULK-02',
      name: '双层底压载舱密闭作业区',
      code: 'EF-BULK-002',
      scopeType: 'project',
      projectId: 'PRJ-2026-BULK04',
      projectName: '8.2万吨 卡姆萨尔型散货船',
      dangerLevel: 'medium',
      points: '60,28 84,28 82,54 58,54',
      strokeColor: '#10b981',
      fillColor: 'rgba(16, 185, 129, 0.24)',
      labelX: 71,
      labelY: 41,
      statusBadge: {
        x: 71,
        y: 24,
        title: '双层底焊缝探伤',
        subText: 'X射线探伤中',
        statusColor: '#00e676'
      },
      details: {
        areaType: '散货船狭小双层底压载水舱作业区',
        securityLevel: '一级受限空间管控',
        allowedRoles: '探伤员、合拢焊工、安全员',
        maxCapacity: 18,
        currentOccupancy: 7
      },
      devices: [
        { id: 'BULK-GAS-01', name: '双层底压载舱气体检测仪', type: '气体检测仪', status: 'online' },
        { id: 'BULK-BS-W01', name: '1#大舱舷梯口作业面基站', type: '定位基站', status: 'online' }
      ],
      todayViolations: 0
    }
  ]
};

// 厂区全景图空间人员定位点位 (对应附图绿色圆形小人徽标与分片统计)
const YARD_SPATIAL_WORKERS = [
  // 1. 龙门吊作业区人员点位
  { id: 'W-01', name: '李强', role: '起重指挥', area: '龙门吊作业区', top: '19%', left: '12.5%', count: 1, status: '在岗' },
  { id: 'W-02', name: '王伟', role: '龙门吊司机', area: '龙门吊作业区', top: '16.5%', left: '23%', count: 1, status: '在岗' },
  { id: 'W-03', name: '张三', role: '合拢焊工', area: '龙门吊作业区', top: '16.5%', left: '33%', count: 1, status: '在岗' },
  { id: 'W-04', name: '赵六', role: '装配钳工', area: '龙门吊作业区', top: '38.5%', left: '31%', count: 2, status: '在岗' },
  { id: 'W-05', name: '孙敏', role: '探伤工程师', area: '龙门吊作业区', top: '30.5%', left: '23%', count: 1, status: '在岗' },

  // 2. 钢材与预处理厂区人员点位
  { id: 'W-06', name: '陈建国', role: '数控切割工', area: '钢材预处理厂区', top: '58%', left: '22%', count: 1, status: '在岗' },
  { id: 'W-07', name: '刘洋', role: '行车吊运工', area: '钢材预处理厂区', top: '58%', left: '38%', count: 1, status: '在岗' },
  { id: 'W-08', name: '吴凯', role: '流水线操作工', area: '钢材预处理厂区', top: '63%', left: '48%', count: 1, status: '在岗' },
  { id: 'W-09', name: '郑浩', role: '钢板质检员', area: '钢材预处理厂区', top: '78%', left: '28%', count: 1, status: '在岗' },
  { id: 'W-10', name: '黄海', role: '预处理喷砂工', area: '钢材预处理厂区', top: '82%', left: '45%', count: 1, status: '在岗' },
  { id: 'W-11', name: '周华', role: '物料转运工', area: '钢材预处理厂区', top: '74%', left: '60%', count: 1, status: '在岗' },

  // 3. S105轮及3号码头人员点位
  { id: 'W-12', name: '钱亮', role: '舾装管系工', area: 'S105轮舾装泊位', top: '27%', left: '72%', count: 1, status: '在岗' },
  { id: 'W-13', name: '徐峰', role: '电气调试工', area: 'S105轮舾装泊位', top: '38%', left: '75%', count: 1, status: '在岗' },
  { id: 'W-14', name: '马涛', role: '船检工程师', area: 'S105轮舾装泊位', top: '45%', left: '79%', count: 1, status: '在岗' },

  // 4. 1#船台分段区人员点位
  { id: 'W-15', name: '杨光', role: '船台装配工', area: '1#船台分段区', top: '12%', left: '8%', count: 1, status: '在岗' },
  { id: 'W-16', name: '方舟', role: '结构焊工', area: '1#船台分段区', top: '22%', left: '16%', count: 1, status: '在岗' },
];

// 厂区全景图空间设备标定数据 (精准对应各建筑实物位置)
const YARD_SPATIAL_DEVICES: SpatialDevice[] = [
  // 1. 主基站 (广域高功率骨干节点)
  {
    id: 'DEV-BS-MAIN-01',
    name: '龙门吊主梁中枢基站',
    category: 'main_station',
    categoryLabel: '主基站',
    code: 'BS-M-01',
    location: '龙门吊立柱顶端与轨道中枢',
    top: '22%',
    left: '34%',
    status: 'online',
    coverageRadius: 100,
    coverageColor: '#00d2ff',
    battery: '外接供电 100%',
    frequency: '无线信道 CH2 (高精频段)',
    power: '28dBm (覆盖 R:150m)',
    valueText: '骨干同步中 · 信号优秀'
  },
  {
    id: 'DEV-BS-MAIN-02',
    name: '3号码头枢纽主基站',
    category: 'main_station',
    categoryLabel: '主基站',
    code: 'BS-M-02',
    location: '3号码头舾装指挥塔顶',
    top: '38%',
    left: '70%',
    status: 'online',
    coverageRadius: 110,
    coverageColor: '#00d2ff',
    battery: '外接供电 100%',
    frequency: '无线信道 CH5 (高精频段)',
    power: '30dBm (覆盖 R:160m)',
    valueText: '骨干同步中 · 信号优秀'
  },
  {
    id: 'DEV-BS-MAIN-03',
    name: '预处理总厂区主基站',
    category: 'main_station',
    categoryLabel: '主基站',
    code: 'BS-M-03',
    location: '钢材厂房屋脊中央天线塔',
    top: '64%',
    left: '36%',
    status: 'online',
    coverageRadius: 105,
    coverageColor: '#00d2ff',
    battery: '外接供电 100%',
    frequency: '无线信道 CH2 (高精频段)',
    power: '28dBm (覆盖 R:140m)',
    valueText: '骨干同步中 · 信号优秀'
  },

  // 2. 作业面基站 (高精密集覆盖节点)
  {
    id: 'DEV-BS-WORK-01',
    name: '数控下料切割工位基站',
    category: 'work_station',
    categoryLabel: '作业面基站',
    code: 'BS-W-01',
    location: '智能下料流水线支架',
    top: '62%',
    left: '44%',
    status: 'online',
    coverageRadius: 75,
    coverageColor: '#38bdf8',
    battery: '94% (太阳能/锂电)',
    frequency: '无线信道 CH5 (高精频段)',
    power: '18dBm (覆盖 R:90m)',
    valueText: '挂载终端: 16台 · 测距精度 ±10cm'
  },
  {
    id: 'DEV-BS-WORK-02',
    name: '1#船台合拢作业面基站',
    category: 'work_station',
    categoryLabel: '作业面基站',
    code: 'BS-W-02',
    location: '1号码头船台外板支架',
    top: '16%',
    left: '18%',
    status: 'online',
    coverageRadius: 70,
    coverageColor: '#38bdf8',
    battery: '88% (锂电池)',
    frequency: '无线信道 CH2 (高精频段)',
    power: '18dBm (覆盖 R:85m)',
    valueText: '挂载终端: 22台 · 测距精度 ±10cm'
  },
  {
    id: 'DEV-BS-WORK-03',
    name: 'S105轮甲板舾装基站',
    category: 'work_station',
    categoryLabel: '作业面基站',
    code: 'BS-W-03',
    location: 'S105轮舾装主甲板挂篮',
    top: '42%',
    left: '77%',
    status: 'online',
    coverageRadius: 65,
    coverageColor: '#38bdf8',
    battery: '96%',
    frequency: '无线信道 CH3 (高精频段)',
    power: '16dBm (覆盖 R:80m)',
    valueText: '挂载终端: 14台 · 测距精度 ±10cm'
  },

  // 3. 气体检测仪 (密闭与受限空间气体传感)
  {
    id: 'DEV-GAS-01',
    name: '钢材车间防爆气体监测仪',
    category: 'gas_detector',
    categoryLabel: '气体检测仪',
    code: 'GAS-01',
    location: '预处理下料切割下风口',
    top: '72%',
    left: '30%',
    status: 'online',
    coverageRadius: 55,
    coverageColor: '#00e676',
    battery: '98%',
    frequency: 'LoraWAN 470MHz',
    power: '检测半径 45m',
    valueText: '可燃气: 0%LEL | VOC: 正常 | 达标'
  },
  {
    id: 'DEV-GAS-02',
    name: '龙门吊合拢舱段气体仪',
    category: 'gas_detector',
    categoryLabel: '气体检测仪',
    code: 'GAS-02',
    location: '合拢分段底舱通风口',
    top: '32%',
    left: '26%',
    status: 'online',
    coverageRadius: 55,
    coverageColor: '#00e676',
    battery: '91%',
    frequency: 'LoraWAN 470MHz',
    power: '检测半径 45m',
    valueText: 'O₂: 20.9% | CO: 0ppm | 达标'
  },

  // 4. 声光报警器 (吊装高危防碰与超距预警)
  {
    id: 'DEV-ALM-01',
    name: '龙门吊吊运防碰声光报警器',
    category: 'alarm_light',
    categoryLabel: '声光报警器',
    code: 'ALM-01',
    location: '龙门吊主小车吊钩滑道',
    top: '17%',
    left: '46%',
    status: 'online',
    coverageRadius: 65,
    coverageColor: '#ff9800',
    battery: '100%',
    frequency: 'Zigbee 2.4GHz',
    power: '声光覆盖 80m',
    valueText: '吊装警戒中 · 状态正常'
  },
  {
    id: 'DEV-ALM-02',
    name: '钢材运输通道防撞报警器',
    category: 'alarm_light',
    categoryLabel: '声光报警器',
    code: 'ALM-02',
    location: '预处理主干道路口道闸',
    top: '52%',
    left: '52%',
    status: 'online',
    coverageRadius: 60,
    coverageColor: '#ff9800',
    battery: '100%',
    frequency: 'Zigbee 2.4GHz',
    power: '声光覆盖 70m',
    valueText: '车辆穿行声光联动正常'
  }
];

// 造船项目船模内部空间定位设备标定数据 (各造船项目具备差异化的设备数量、安装物理点位及监测参数)
const PROJECT_SPATIAL_DEVICES: Record<string, SpatialDevice[]> = {
  'PRJ-2026-LNG01': [
    {
      id: 'LNG-BS-M01',
      name: 'LNG船主甲板网关主基站',
      category: 'main_station',
      categoryLabel: '主基站',
      code: 'LNG-M01',
      location: 'LNG主甲板中央控制室顶',
      top: '24%',
      left: '48%',
      status: 'online',
      coverageRadius: 130,
      coverageColor: '#00d2ff',
      battery: '100%',
      frequency: '无线信道 CH2 (高精频段)',
      power: '覆盖全船中段',
      valueText: '船载主网关 · 信号强'
    },
    {
      id: 'LNG-BS-W01',
      name: '1#液货舱合拢作业面基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'LNG-W01',
      location: '1#绝热箱合拢施工位',
      top: '32%',
      left: '32%',
      status: 'online',
      coverageRadius: 85,
      coverageColor: '#38bdf8',
      battery: '92%',
      frequency: '无线信道 CH5',
      power: '覆盖 1#货舱全段',
      valueText: '人员精确定位中 ±10cm'
    },
    {
      id: 'LNG-BS-W02',
      name: '机舱管路作业面基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'LNG-W02',
      location: '艉部主推进机舱',
      top: '38%',
      left: '68%',
      status: 'online',
      coverageRadius: 80,
      coverageColor: '#38bdf8',
      battery: '90%',
      frequency: '无线信道 CH5',
      power: '覆盖机舱及泵舱',
      valueText: '人员精确定位中'
    },
    {
      id: 'LNG-GAS-01',
      name: '2#液货舱受限空间气体仪',
      category: 'gas_detector',
      categoryLabel: '气体检测仪',
      code: 'LNG-G01',
      location: '2#密闭货舱底部通道',
      top: '46%',
      left: '36%',
      status: 'online',
      coverageRadius: 65,
      coverageColor: '#10b981',
      battery: '88%',
      frequency: 'LoraWAN 470MHz',
      power: '监测半径 50m',
      valueText: 'O₂: 20.9% | CO: 0ppm | 达标'
    },
    {
      id: 'LNG-ALM-01',
      name: '甲板吊装防碰声光报警器',
      category: 'alarm_light',
      categoryLabel: '声光报警器',
      code: 'LNG-A01',
      location: '主甲板吊运口',
      top: '22%',
      left: '35%',
      status: 'online',
      coverageRadius: 75,
      coverageColor: '#f59e0b',
      battery: '100%',
      frequency: 'Zigbee',
      power: '声光覆盖 80m',
      valueText: '龙门吊防碰预警中'
    },
    {
      id: 'LNG-BS-W03',
      name: '艏楼压载舱作业面基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'LNG-W03',
      location: '艏楼压载水舱入孔',
      top: '30%',
      left: '20%',
      status: 'online',
      coverageRadius: 70,
      coverageColor: '#38bdf8',
      battery: '95%',
      frequency: '无线信道 CH3',
      power: '覆盖 艏楼隔离段',
      valueText: '通道人员出入计数'
    }
  ],
  'PRJ-2026-CTN02': [
    {
      id: 'CTN-BS-M01',
      name: '驾驶室顶甲板主基站',
      category: 'main_station',
      categoryLabel: '主基站',
      code: 'CTN-M01',
      location: '集装箱船驾驶甲板上层',
      top: '25%',
      left: '72%',
      status: 'online',
      coverageRadius: 135,
      coverageColor: '#00d2ff',
      battery: '100%',
      frequency: '无线信道 CH1 (骨干网)',
      power: '覆盖生活楼及艉甲板',
      valueText: '主干网络正常 · 信号满格'
    },
    {
      id: 'CTN-BS-W01',
      name: '10#箱位导轨作业面基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'CTN-W01',
      location: '10#贝位导轨架垂直面',
      top: '36%',
      left: '36%',
      status: 'online',
      coverageRadius: 85,
      coverageColor: '#38bdf8',
      battery: '94%',
      frequency: '无线信道 CH4',
      power: '覆盖 8#-12#箱位货舱',
      valueText: '导轨装配钳工高精度定位'
    },
    {
      id: 'CTN-BS-W02',
      name: '电气中控室作业基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'CTN-W02',
      location: '主配电板与电气集控室',
      top: '32%',
      left: '54%',
      status: 'online',
      coverageRadius: 75,
      coverageColor: '#38bdf8',
      battery: '96%',
      frequency: '无线信道 CH4',
      power: '覆盖 配电控制室',
      valueText: '带电调试受控监管'
    },
    {
      id: 'CTN-ALM-01',
      name: '艏艉系泊舷梯落水报警器',
      category: 'alarm_light',
      categoryLabel: '声光报警器',
      code: 'CTN-A01',
      location: '右舷系泊甲板临水通道',
      top: '48%',
      left: '19%',
      status: 'online',
      coverageRadius: 70,
      coverageColor: '#00e5ff',
      battery: '100%',
      frequency: 'Zigbee 2.4G',
      power: '临水光栅警戒 35m',
      valueText: '临水防坠落监测中'
    },
    {
      id: 'CTN-GAS-01',
      name: '主机舱通风气体检测仪',
      category: 'gas_detector',
      categoryLabel: '气体检测仪',
      code: 'CTN-G01',
      location: '主推进主机舱底排风道',
      top: '42%',
      left: '46%',
      status: 'online',
      coverageRadius: 60,
      coverageColor: '#10b981',
      battery: '90%',
      frequency: 'LoraWAN 470MHz',
      power: '监测半径 40m',
      valueText: '可燃气 0% | 氧气 21.0%'
    }
  ],
  'PRJ-2026-VLCC03': [
    {
      id: 'VLCC-BS-M01',
      name: '货油控制中心主基站',
      category: 'main_station',
      categoryLabel: '主基站',
      code: 'VLCC-M01',
      location: '主甲板货油中控室',
      top: '28%',
      left: '62%',
      status: 'online',
      coverageRadius: 140,
      coverageColor: '#00d2ff',
      battery: '100%',
      frequency: '防爆本安信道 CH6',
      power: '覆盖中艉货油主甲板',
      valueText: '本安防爆主网关'
    },
    {
      id: 'VLCC-GAS-01',
      name: '货油泵舱防爆气体检测仪',
      category: 'gas_detector',
      categoryLabel: '气体检测仪',
      code: 'VLCC-G01',
      location: '货油泵舱封闭底层',
      top: '42%',
      left: '45%',
      status: 'online',
      coverageRadius: 70,
      coverageColor: '#10b981',
      battery: '85%',
      frequency: 'Lora 470MHz 防爆',
      power: '连续气体巡测 50m',
      valueText: 'VOC: 0.2ppm | 易燃气: 0%'
    },
    {
      id: 'VLCC-BS-W01',
      name: '1号隔舱防爆定位基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'VLCC-W01',
      location: '1号隔离空舱顶板',
      top: '34%',
      left: '32%',
      status: 'online',
      coverageRadius: 80,
      coverageColor: '#38bdf8',
      battery: '91%',
      frequency: '无线信道 CH6',
      power: '覆盖 1#-2#隔舱',
      valueText: '密闭隔舱人员在岗'
    },
    {
      id: 'VLCC-ALM-01',
      name: '货油管汇试压声光报警器',
      category: 'alarm_light',
      categoryLabel: '声光报警器',
      code: 'VLCC-A01',
      location: '甲板货油高压管汇端部',
      top: '25%',
      left: '76%',
      status: 'online',
      coverageRadius: 65,
      coverageColor: '#f59e0b',
      battery: '100%',
      frequency: 'Zigbee 本安',
      power: '高压试压警戒 50m',
      valueText: '试压保压警戒状态'
    },
    {
      id: 'VLCC-BS-W02',
      name: '艉部双层底作业面基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'VLCC-W02',
      location: '艉部双层底压载通道',
      top: '48%',
      left: '26%',
      status: 'online',
      coverageRadius: 75,
      coverageColor: '#38bdf8',
      battery: '89%',
      frequency: '无线信道 CH6',
      power: '覆盖 双层底涂装区',
      valueText: '涂装施工人员核准中'
    }
  ],
  'PRJ-2026-BULK04': [
    {
      id: 'BULK-BS-M01',
      name: '2号船台大件总组主基站',
      category: 'main_station',
      categoryLabel: '主基站',
      code: 'BULK-M01',
      location: '2号船台搭载总控支架',
      top: '22%',
      left: '42%',
      status: 'online',
      coverageRadius: 125,
      coverageColor: '#00d2ff',
      battery: '100%',
      frequency: '无线信道 CH3',
      power: '覆盖 散货船搭载滑道',
      valueText: '总搭载骨干网'
    },
    {
      id: 'BULK-BS-W01',
      name: '1#大舱舷梯口作业面基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'BULK-W01',
      location: '1#大货舱舷梯口通道',
      top: '35%',
      left: '28%',
      status: 'online',
      coverageRadius: 80,
      coverageColor: '#38bdf8',
      battery: '93%',
      frequency: '无线信道 CH3',
      power: '覆盖 1#货舱内壁',
      valueText: '大舱结构焊接定位'
    },
    {
      id: 'BULK-GAS-01',
      name: '双层底压载舱气体检测仪',
      category: 'gas_detector',
      categoryLabel: '气体检测仪',
      code: 'BULK-G01',
      location: '散货船双层底压载舱',
      top: '46%',
      left: '64%',
      status: 'online',
      coverageRadius: 65,
      coverageColor: '#10b981',
      battery: '92%',
      frequency: 'LoraWAN 470MHz',
      power: '监测半径 45m',
      valueText: '含氧量 20.9% | 无有害气体'
    },
    {
      id: 'BULK-ALM-01',
      name: '船台大件吊装防碰报警器',
      category: 'alarm_light',
      categoryLabel: '声光报警器',
      code: 'BULK-A01',
      location: '总组吊装龙门吊主横梁',
      top: '20%',
      left: '52%',
      status: 'online',
      coverageRadius: 75,
      coverageColor: '#f59e0b',
      battery: '100%',
      frequency: 'Zigbee 2.4G',
      power: '吊运警戒 70m',
      valueText: '分段吊运对位预警'
    },
    {
      id: 'BULK-BS-W02',
      name: '艉部分段搭载定位基站',
      category: 'work_station',
      categoryLabel: '作业面基站',
      code: 'BULK-W02',
      location: '艉部总组段合拢口',
      top: '38%',
      left: '74%',
      status: 'online',
      coverageRadius: 70,
      coverageColor: '#38bdf8',
      battery: '88%',
      frequency: '无线信道 CH3',
      power: '覆盖 艉段总组区',
      valueText: '探伤与合拢监控'
    }
  ]
};

interface DashboardProps {
  onExit?: () => void;
  onNavigate?: (view: ViewType) => void;
}

export function Dashboard({ onExit, onNavigate }: DashboardProps) {
  // 核心视图切换状态：'yard' (厂区) | 'project' (造船项目)
  const [viewScope, setViewScope] = useState<'yard' | 'project'>('yard');
  
  // 选中的造船项目 (从项目管理列表中获取)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-2026-LNG01');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchKey, setSearchKey] = useState('');
  
  // 面板显隐控制状态 (默认展示，点击背景滑动隐藏)
  const [isPanelsVisible, setIsPanelsVisible] = useState(true);

  // 图层显隐与细分控制状态 (默认人员与设备均显示)
  const [showPersonnelLayer, setShowPersonnelLayer] = useState<boolean>(true);
  const [showDeviceLayer, setShowDeviceLayer] = useState<boolean>(true);
  const [showFenceLayer, setShowFenceLayer] = useState<boolean>(true);
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState<DeviceCategoryType>('all');
  const [selectedDeviceDetail, setSelectedDeviceDetail] = useState<SpatialDevice | null>(null);
  const [selectedFenceDetail, setSelectedFenceDetail] = useState<SpatialElectronicFence | null>(null);

  // 轮播滚动 Refs
  const alertsScrollRef = useRef<HTMLDivElement>(null);
  const devicesScrollRef = useRef<HTMLDivElement>(null);
  const [isAlertsHovered, setIsAlertsHovered] = useState(false);
  const [isDevicesHovered, setIsDevicesHovered] = useState(false);

  // 获取当前选中的造船项目配置
  const currentProject = projectListConfig.find(p => p.id === selectedProjectId) || projectListConfig[0];

  // 时钟更新定时器
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. 实时预警列表平滑自动轮播
  useEffect(() => {
    if (isAlertsHovered) return;
    const interval = setInterval(() => {
      const el = alertsScrollRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ top: 32, behavior: 'smooth' });
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [isAlertsHovered]);

  // 2. 设备状态列表平滑自动轮播
  useEffect(() => {
    if (isDevicesHovered) return;
    const interval = setInterval(() => {
      const el = devicesScrollRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ top: 28, behavior: 'smooth' });
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isDevicesHovered]);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const weeks = ['日', '一', '二', '三', '四', '五', '六'];
    const week = weeks[date.getDay()];
    return `${y}-${m}-${d} ${h}:${min}:${s} 星期${week}`;
  };

  // 点击背景图切换面板显隐
  const handleBackgroundClick = () => {
    setIsProjectDropdownOpen(false);
    setSelectedDeviceDetail(null);
    setSelectedFenceDetail(null);
    setIsPanelsVisible(prev => !prev);
  };

  // 动态获取当前背景图
  const currentBackgroundImage = viewScope === 'yard' ? '/assets/船厂背景.jpeg' : currentProject.bgImage;

  // 动态获取当前数据流
  const currentDistribution = viewScope === 'yard' ? yardDistributionData : currentProject.distributionData;
  const currentTypeData = viewScope === 'yard' ? yardTypeData : currentProject.typeData;
  const currentTrendData = viewScope === 'yard' ? yardTrendData : currentProject.trendData;
  const currentAlerts = viewScope === 'yard' ? yardAlerts : currentProject.alerts;
  const currentDeviceSummary = viewScope === 'yard' ? { total: 512, online: 485, offline: 27, fault: 8 } : currentProject.deviceSummary;
  const currentDeviceList = viewScope === 'yard' ? yardDeviceList : currentProject.deviceList;
  const currentTotal = viewScope === 'yard' ? 1284 : currentProject.totalPersonnel;
  const currentOnDuty = viewScope === 'yard' ? 1248 : currentProject.onDutyPersonnel;
  const currentOffDuty = viewScope === 'yard' ? 36 : currentProject.offDutyPersonnel;
  const currentAlarmCount = viewScope === 'yard' ? 8 : currentProject.alarmPersonnel;

  // 动态获取当前空间定位设备
  const allCurrentSpatialDevices = viewScope === 'yard' 
    ? YARD_SPATIAL_DEVICES 
    : (PROJECT_SPATIAL_DEVICES[currentProject.id] || YARD_SPATIAL_DEVICES);

  const activeFilteredDevices = allCurrentSpatialDevices.filter(dev => {
    if (selectedDeviceCategory === 'all') return true;
    return dev.category === selectedDeviceCategory;
  });

  // 动态获取当前电子围栏
  const currentFences = viewScope === 'yard' 
    ? YARD_ELECTRONIC_FENCES 
    : (PROJECT_ELECTRONIC_FENCES[currentProject.id] || []);

  return (
    <div 
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 bg-[#020b14] text-[#e2f1ff] overflow-hidden flex flex-col font-sans select-none cursor-pointer"
      title={isPanelsVisible ? "点击背景空白处可收起所有数据面板" : "点击背景可展开数据面板"}
    >
      
      {/* 1. 3D 全景/船模背景图（根据所选项目实时无缝切换，等比例缩放不拉伸） */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center bg-[#020b14] pointer-events-none transition-all duration-700">
        <img 
          key={currentBackgroundImage}
          src={currentBackgroundImage} 
          alt={viewScope === 'yard' ? '智慧船厂全景' : currentProject.name} 
          className="w-full h-full object-cover object-center select-none animate-fadeIn transition-all duration-700"
        />
        {/* 造船项目视角专属的科幻光栅与蓝图微光覆层 */}
        {viewScope === 'project' && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#020b14]/70 via-transparent to-[#020b14]/40 pointer-events-none"></div>
        )}
      </div>

      {/* ===================== 全画幅空间矢量标定图层 (全屏百分比对齐背景图) ===================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        
        {/* 1. 空间电子围栏多边形与工业作业状态浮标图层 (受 showFenceLayer 开关控制) */}
        {showFenceLayer && (
          <div className="absolute inset-0 pointer-events-none">
            {/* SVG 多边形矢量图层 */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="fence-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {currentFences.map((fence) => (
                <g 
                  key={fence.id}
                  className="pointer-events-auto cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFenceDetail(fence);
                  }}
                >
                  {/* 多边形区域 (半透明彩色填充 + 发光霓虹边框) */}
                  <polygon
                    points={fence.points}
                    fill={fence.fillColor}
                    stroke={fence.strokeColor}
                    strokeWidth="0.35"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter="url(#fence-glow-filter)"
                    className="transition-all duration-300 group-hover:opacity-90 group-hover:stroke-white cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFenceDetail(fence);
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* 电子围栏区域中心名称标签 & 附图工业作业状态浮标看板 */}
            {currentFences.map((fence) => (
              <div key={`fence-labels-${fence.id}`} className="contents">
                {/* A. 区域中心名称标签 */}
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-20 transition-transform duration-200 hover:scale-105"
                  style={{ top: `${fence.labelY}%`, left: `${fence.labelX}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFenceDetail(fence);
                  }}
                >
                  <div 
                    className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-1.5 border select-none"
                    style={{
                      backgroundColor: 'rgba(6, 24, 51, 0.92)',
                      borderColor: `${fence.strokeColor}aa`,
                      boxShadow: `0 0 14px ${fence.strokeColor}55`
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: fence.strokeColor }}></span>
                    <span>{fence.name}</span>
                  </div>
                </div>

                {/* B. 附图作业状态浮标看板 (如: 龙门吊G-01: 安装已完成 100% / S105轮: 设备维护完成 85%) */}
                {fence.statusBadge && (
                  <div 
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-25 group"
                    style={{ top: `${fence.statusBadge.y}%`, left: `${fence.statusBadge.x}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFenceDetail(fence);
                    }}
                  >
                    <div className="bg-[#061833]/95 border border-[#1f4a7c] group-hover:border-[#00e5ff] rounded-xl px-2.5 py-1.5 text-[11px] shadow-[0_8px_24px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center gap-2.5 transition-all">
                      {/* 状态绿色小指示盾 */}
                      <div className="w-5 h-5 rounded-full bg-[#00e676]/20 border border-[#00e676] flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>
                      </div>
                      
                      {/* 文本内容 */}
                      <div className="flex flex-col text-left leading-tight whitespace-nowrap">
                        <span className="font-bold text-white tracking-tight flex items-center gap-1">
                          {fence.statusBadge.title}
                        </span>
                        <span className="text-[10px] text-[#8ab4f8] mt-0.5 flex items-center gap-1">
                          <span>{fence.statusBadge.subText}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 2. 设备图层与信号覆盖范围 (受 showDeviceLayer 开关控制) */}
        {showDeviceLayer && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-100">
            {activeFilteredDevices.map((dev) => (
              <div 
                key={dev.id}
                className="absolute pointer-events-auto transition-all z-20 group"
                style={{ top: dev.top, left: dev.left }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeviceDetail(dev);
                }}
              >
                {/* 📡 动态信号覆盖范围光圈 (带脉冲扫描波纹与范围标尺) */}
                <div 
                  className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-700"
                  style={{
                    width: `${dev.coverageRadius * 2}px`,
                    height: `${dev.coverageRadius * 2}px`,
                    top: '12px',
                    left: '12px',
                  }}
                >
                  {/* 背景半透明径向辐射色 */}
                  <div 
                    className="absolute inset-0 rounded-full border border-dashed opacity-60 transition-all duration-500 group-hover:opacity-95"
                    style={{
                      background: `radial-gradient(circle, ${dev.coverageColor}38 0%, ${dev.coverageColor}18 55%, transparent 75%)`,
                      borderColor: `${dev.coverageColor}99`,
                      boxShadow: `0 0 20px ${dev.coverageColor}33`,
                    }}
                  />

                  {/* 动态扩散脉冲动画波纹 (Radar Ping) */}
                  <div 
                    className="absolute inset-0 rounded-full border animate-ping opacity-35"
                    style={{ borderColor: dev.coverageColor, animationDuration: '3.5s' }}
                  />

                  {/* 信号覆盖范围半径标尺悬浮提示 */}
                  <div 
                    className="absolute bottom-1 right-2 text-[9px] font-mono px-1 rounded bg-[#030e1d]/80 text-[#8ab4f8] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    覆盖 R:{dev.coverageRadius}m
                  </div>
                </div>

                {/* 📍 设备核心发光图标徽标 */}
                <div 
                  className="relative -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-130"
                  style={{
                    backgroundColor: dev.coverageColor,
                    boxShadow: `0 0 16px ${dev.coverageColor}, inset 0 0 6px rgba(255,255,255,0.7)`
                  }}
                  title={`点击查看设备: ${dev.name} (${dev.categoryLabel})`}
                >
                  {dev.category === 'main_station' && <Radio className="w-3.5 h-3.5 text-white" />}
                  {dev.category === 'work_station' && <Cpu className="w-3.5 h-3.5 text-white" />}
                  {dev.category === 'gas_detector' && <Wind className="w-3.5 h-3.5 text-white" />}
                  {dev.category === 'alarm_light' && <Volume2 className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* 设备简易悬浮标签 (悬停时显现) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-30">
                  <div className="bg-[#061833]/95 border border-[#00d2ff]/80 text-[10px] text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]"></span>
                    <span>{dev.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. 人员定位点位 (受 showPersonnelLayer 开关控制) */}
        {showPersonnelLayer && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-100">
            {viewScope === 'yard' ? (
              YARD_SPATIAL_WORKERS.map((worker) => (
                <div 
                  key={worker.id}
                  className="absolute pointer-events-auto z-20 group cursor-pointer"
                  style={{ top: worker.top, left: worker.left }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div 
                    className="w-5 h-5 rounded-full bg-[#00e676] border-2 border-white shadow-[0_0_12px_#00e676] flex items-center justify-center hover:scale-130 transition-transform cursor-pointer"
                    title={`${worker.name} (${worker.role}) - ${worker.area}`}
                  >
                    {worker.count > 1 ? (
                      <span className="text-[9px] font-bold text-[#061833]">{worker.count}</span>
                    ) : (
                      <User className="w-3 h-3 text-[#061833]" />
                    )}
                  </div>
                  
                  {/* 人员悬浮快速标签 */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-30">
                    <div className="bg-[#061833]/95 border border-[#00e676] text-[10px] text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1">
                      <span className="text-[#00e676] font-bold">{worker.name}</span>
                      <span className="text-[#8ab4f8]">({worker.role})</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              currentProject.markers.map((marker) => (
                <div 
                  key={marker.id}
                  className="absolute pointer-events-auto z-20 cursor-pointer"
                  style={{ top: marker.top, left: marker.left }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div 
                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center hover:scale-125 transition-transform shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-pointer ${
                      marker.type === 'alarm' 
                        ? 'bg-red-600 animate-pulse shadow-[0_0_14px_#ff1744]' 
                        : marker.type === 'offline'
                        ? 'bg-[#ffb300] shadow-[0_0_10px_#ffb300]'
                        : 'bg-[#00e676] shadow-[0_0_10px_#00e676]'
                    }`}
                    title={`${marker.name} (${marker.role})`}
                  >
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 📋 4. 点击电子围栏弹出的安防与作业详情卡片 (居中浮窗) */}
        {selectedFenceDetail && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-24 left-1/2 -translate-x-1/2 w-88 bg-[#061833]/95 border backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.85)] z-50 animate-fadeIn pointer-events-auto"
            style={{ borderColor: selectedFenceDetail.strokeColor, boxShadow: `0 0 28px ${selectedFenceDetail.strokeColor}55` }}
          >
            <div className="flex items-center justify-between border-b border-[#1f4a7c]/80 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center border"
                  style={{ 
                    backgroundColor: `${selectedFenceDetail.strokeColor}22`, 
                    borderColor: selectedFenceDetail.strokeColor,
                    color: selectedFenceDetail.strokeColor
                  }}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{selectedFenceDetail.name}</h4>
                  <span className="text-[10px] text-[#8ab4f8] font-mono">{selectedFenceDetail.code}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFenceDetail(null)}
                className="text-[#8ab4f8] hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-[#8ab4f8]">所属业务关联:</span>
                <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#092244] border border-[#19426f] text-[10px]">
                  {selectedFenceDetail.scopeType === 'yard' ? '厂区级公共受控区' : (selectedFenceDetail.projectName || '造船项目专属区')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8ab4f8]">危险管控等级:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedFenceDetail.dangerLevel === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedFenceDetail.dangerLevel === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {selectedFenceDetail.dangerLevel === 'high' ? '🔴 一级高危警戒' :
                   selectedFenceDetail.dangerLevel === 'medium' ? '🟡 二级中危管控' : '🔵 三级常规监控'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">区域类型:</span>
                <span className="font-medium text-white truncate max-w-[190px]">{selectedFenceDetail.details.areaType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">安全管控机制:</span>
                <span className="font-bold text-[#00e5ff] truncate max-w-[190px]">{selectedFenceDetail.details.securityLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">准入工种/角色:</span>
                <span className="text-[#e2f1ff] text-right truncate max-w-[190px]">{selectedFenceDetail.details.allowedRoles}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8ab4f8]">当前在岗 / 上限:</span>
                <span className="font-mono text-white font-bold">
                  <span className="text-[#00e676]">{selectedFenceDetail.details.currentOccupancy}</span> / {selectedFenceDetail.details.maxCapacity} 人
                </span>
              </div>
              
              {/* 容量负载进度条 */}
              <div className="w-full h-1.5 bg-[#092244] rounded-full overflow-hidden border border-[#19426f] my-1">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.min(100, (selectedFenceDetail.details.currentOccupancy / selectedFenceDetail.details.maxCapacity) * 100)}%`,
                    backgroundColor: selectedFenceDetail.strokeColor
                  }}
                />
              </div>

              {/* 关联硬件感知设备 (与电子围栏设置模块严格关联) */}
              {selectedFenceDetail.devices && selectedFenceDetail.devices.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#1f4a7c]/60">
                  <div className="flex items-center justify-between text-[10px] text-[#8ab4f8] mb-1.5">
                    <span>电子围栏关联布设设备 ({selectedFenceDetail.devices.length}):</span>
                    <span className="text-[#00e676]">全部在线</span>
                  </div>
                  <div className="space-y-1">
                    {selectedFenceDetail.devices.map((dev) => (
                      <div key={dev.id} className="flex items-center justify-between bg-[#092244]/80 px-2 py-1 rounded border border-[#19426f] text-[10px]">
                        <span className="text-white font-mono">{dev.name}</span>
                        <span className="text-[#00e5ff]">{dev.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 今日违规预警数据 */}
              <div className="flex justify-between items-center pt-1 border-t border-[#1f4a7c]/40 text-[10px]">
                <span className="text-[#8ab4f8]">今日越界预警:</span>
                <span className={`font-bold ${selectedFenceDetail.todayViolations ? 'text-amber-400' : 'text-[#00e676]'}`}>
                  {selectedFenceDetail.todayViolations || 0} 次触发
                </span>
              </div>

              {selectedFenceDetail.statusBadge && (
                <div className="mt-2.5 pt-2 border-t border-[#1f4a7c]/60 bg-[#092244]/70 p-2.5 rounded-xl">
                  <div className="text-[10px] text-[#8ab4f8]">动态作业看板:</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedFenceDetail.statusBadge.title}</div>
                  <div className="text-[11px] text-[#00e676] mt-0.5">{selectedFenceDetail.statusBadge.subText}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📱 5. 点击空间设备弹出的参数卡片 */}
        {selectedDeviceDetail && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-24 left-1/2 -translate-x-1/2 w-80 bg-[#061833]/95 border backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.85)] z-50 animate-fadeIn pointer-events-auto"
            style={{ borderColor: selectedDeviceDetail.coverageColor, boxShadow: `0 0 28px ${selectedDeviceDetail.coverageColor}55` }}
          >
            <div className="flex items-center justify-between border-b border-[#1f4a7c]/80 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center border"
                  style={{ 
                    backgroundColor: `${selectedDeviceDetail.coverageColor}22`, 
                    borderColor: selectedDeviceDetail.coverageColor,
                    color: selectedDeviceDetail.coverageColor
                  }}
                >
                  {selectedDeviceDetail.category === 'main_station' && <Radio className="w-4 h-4" />}
                  {selectedDeviceDetail.category === 'work_station' && <Cpu className="w-4 h-4" />}
                  {selectedDeviceDetail.category === 'gas_detector' && <Wind className="w-4 h-4" />}
                  {selectedDeviceDetail.category === 'alarm_light' && <Volume2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{selectedDeviceDetail.name}</h4>
                  <span className="text-[10px] text-[#8ab4f8] font-mono">{selectedDeviceDetail.code} · {selectedDeviceDetail.categoryLabel}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDeviceDetail(null)}
                className="text-[#8ab4f8] hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">安装物理位置:</span>
                <span className="text-white font-medium truncate max-w-[170px]">{selectedDeviceDetail.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">在线运行状态:</span>
                <span className="text-[#00e676] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>
                  在线正常
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">信号频段:</span>
                <span className="font-mono text-[#d0e5ea]">{selectedDeviceDetail.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">覆盖指标:</span>
                <span className="font-mono text-[#00e5ff] font-bold">{selectedDeviceDetail.power || `R: ${selectedDeviceDetail.coverageRadius}m 范围`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ab4f8]">电池/供电:</span>
                <span className="font-mono text-[#00e676]">{selectedDeviceDetail.battery}</span>
              </div>
              {selectedDeviceDetail.valueText && (
                <div className="mt-2 pt-2 border-t border-[#1f4a7c]/60 bg-[#092244]/70 p-2 rounded-lg">
                  <div className="text-[10px] text-[#8ab4f8]">实时监测/负载信息:</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{selectedDeviceDetail.valueText}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. 顶部 Header 栏 */}
      <header 
        onClick={(e) => e.stopPropagation()} 
        className="relative z-40 h-[82px] flex items-start justify-between px-6 pt-2 bg-gradient-to-b from-[#031326]/95 via-[#031326]/60 to-transparent shrink-0 cursor-default"
      >
        
        {/* 左侧：仅保留「返回系统」按钮 */}
        <div className="flex items-center gap-3 pt-2 whitespace-nowrap shrink-0">
          <button 
            onClick={() => {
              if (onExit) {
                onExit();
              } else if (onNavigate) {
                onNavigate('projects');
              }
            }}
            className="flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-[#00d2ff]/80 px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-[0_0_14px_rgba(0,210,255,0.4)] hover:shadow-[0_0_20px_rgba(0,210,255,0.7)] whitespace-nowrap shrink-0 cursor-pointer"
            title="返回系统主菜单"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-medium whitespace-nowrap">返回系统</span>
          </button>
        </div>

        {/* 中间：标题与“厂区/造船项目”双视图切换栏 */}
        <div className="flex-1 flex flex-col items-center px-2">
          
          {/* 主标题底座 */}
          <div className="relative px-16 py-1 flex items-center justify-center whitespace-nowrap">
            {/* 科技梯形光效底框 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0d3b6f]/85 to-transparent [clip-path:polygon(0_0,100%_0,85%_100%,15%_100%)] border-b-2 border-[#00d2ff]"></div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent"></div>
            
            <h1 className="relative z-10 text-[25px] font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#dbeafe] to-[#38bdf8] drop-shadow-[0_0_12px_rgba(56,189,248,0.85)] whitespace-nowrap">
              智慧船厂驾驶舱
            </h1>
          </div>

          {/* “厂区” 与 “造船项目” 视图切换 & 项目下拉选择器 */}
          <div className="flex items-center gap-3 mt-1.5 whitespace-nowrap relative">
            
            {/* 视图双切换胶囊按钮 */}
            <div className="flex items-center bg-[#071d3d]/90 p-0.5 rounded-full border border-[#1f4a7c] shadow-[0_0_16px_rgba(0,210,255,0.25)]">
              {/* 厂区视图按钮 */}
              <button
                onClick={() => {
                  setViewScope('yard');
                  setIsProjectDropdownOpen(false);
                }}
                className={`px-4 py-1 text-[12px] font-bold tracking-wider transition-all duration-300 rounded-full flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewScope === 'yard'
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_14px_rgba(0,210,255,0.7)]'
                    : 'text-[#8ab4f8] hover:text-white hover:bg-[#0c315e]/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>厂区全景</span>
              </button>

              {/* 造船项目视图按钮 */}
              <button
                onClick={() => setViewScope('project')}
                className={`px-4 py-1 text-[12px] font-bold tracking-wider transition-all duration-300 rounded-full flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewScope === 'project'
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_14px_rgba(0,210,255,0.7)]'
                    : 'text-[#8ab4f8] hover:text-white hover:bg-[#0c315e]/50'
                }`}
              >
                <Ship className="w-3.5 h-3.5" />
                <span>造船项目</span>
              </button>
            </div>

            {/* 当处于“造船项目”视图时，调取项目管理中的项目名称列表供实时切换 */}
            {viewScope === 'project' && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProjectDropdownOpen(!isProjectDropdownOpen);
                  }}
                  className="flex items-center gap-2 bg-[#0a264a]/90 hover:bg-[#0f3466] border border-[#00d2ff]/80 px-3.5 py-1 rounded-full text-xs text-[#e2f1ff] shadow-[0_0_14px_rgba(0,210,255,0.35)] transition-all duration-200 cursor-pointer"
                >
                  <Anchor className="w-3 h-3 text-[#00d2ff]" />
                  <span className="font-bold text-[#00d2ff]">{currentProject.name}</span>
                  <span className="text-[10px] bg-blue-500/20 text-[#8ab4f8] px-1.5 py-0.5 rounded border border-blue-400/30">
                    {currentProject.phase}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#00d2ff] transition-transform duration-200 ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 项目下拉选择弹窗菜单 */}
                {isProjectDropdownOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full mt-1.5 left-0 w-80 bg-[#061833]/95 border border-[#00d2ff] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(0,210,255,0.4)] backdrop-blur-xl p-2 z-50 animate-fadeIn"
                  >
                    <div className="text-[10px] font-bold text-[#8ab4f8] px-2.5 py-1 uppercase tracking-wider border-b border-[#1f4a7c]/60 mb-1 flex items-center justify-between">
                      <span>选择造船项目模型</span>
                      <span className="text-[#00d2ff]">共 {projectListConfig.length} 个在建项目</span>
                    </div>

                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {projectListConfig.map((prj) => {
                        const isSelected = prj.id === selectedProjectId;
                        return (
                          <div
                            key={prj.id}
                            onClick={() => {
                              setSelectedProjectId(prj.id);
                              setIsProjectDropdownOpen(false);
                            }}
                            className={`p-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#19528f]/90 to-[#0c315e]/90 border border-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.4)]'
                                : 'hover:bg-[#0b2447] border border-transparent hover:border-[#1f4a7c]'
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <Ship className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00d2ff]' : 'text-[#8ab4f8]'}`} />
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#e2f1ff]'}`}>
                                  {prj.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-[#8ab4f8] mt-1">
                                <span>{prj.shipCode}</span>
                                <span>·</span>
                                <span className="text-[#00d2ff]">{prj.dockingArea}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-[11px] font-mono font-bold text-[#00e676]">{prj.progress}%</div>
                              <span className="text-[9px] text-[#557696]">{prj.phase}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* 右侧：时间日期与天气、查询框、显隐面板切换、管理员标识 */}
        <div className="flex justify-end items-center gap-3 pt-2 whitespace-nowrap shrink-0">
          
          {/* 时间、日期与天气 (移至右上角) */}
          <div className="flex items-center text-[12px] text-[#8ab4f8] font-mono tracking-wide whitespace-nowrap">
            <span className="whitespace-nowrap">{formatDate(currentTime)}</span>
            <span className="ml-2.5 flex items-center text-[#00d2ff] whitespace-nowrap">
              <Cloud className="w-3.5 h-3.5 mr-1 text-[#00d2ff] shrink-0" /> 25°C 晴
            </span>
          </div>

          {/* 搜索查询框 (移至右上角) */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#00d2ff] absolute left-2.5 pointer-events-none" />
            <input 
              type="text" 
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="请输入关键词" 
              className="bg-[#0b2447]/80 border border-[#1f4a7c] rounded-full pl-8 pr-2.5 py-1 text-xs text-[#e2f1ff] focus:outline-none focus:border-[#00d2ff] w-32 focus:w-36 transition-all placeholder-[#476582] shadow-[inset_0_0_8px_rgba(0,0,0,0.4)] whitespace-nowrap"
            />
          </div>

          <div className="h-4 w-px bg-[#1f4a7c]/60"></div>

          {/* 显隐面板切换浮动按钮 */}
          <button 
            onClick={() => setIsPanelsVisible(!isPanelsVisible)}
            className={`px-2.5 py-1 text-xs border rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isPanelsVisible 
                ? 'border-[#1f4a7c] bg-[#0b2447]/70 text-[#8ab4f8] hover:text-white hover:border-[#00d2ff]' 
                : 'border-[#00d2ff] bg-[#00d2ff]/20 text-[#00d2ff] animate-pulse shadow-[0_0_10px_rgba(0,210,255,0.4)]'
            }`}
            title={isPanelsVisible ? "隐藏全部数据面板" : "显示全部数据面板"}
          >
            {isPanelsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPanelsVisible ? '全景模式' : '显示面板'}</span>
          </button>

          {/* 管理员标识 */}
          <div className="flex items-center gap-1.5 text-xs text-[#e2f1ff] border border-[#1f4a7c] bg-[#0b2447]/70 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#103a68] flex items-center justify-center border border-[#00d2ff] shrink-0">
              <User className="w-2.5 h-2.5 text-[#00d2ff]" />
            </div>
            <span className="tracking-wide whitespace-nowrap font-medium">管理员</span>
          </div>
        </div>
      </header>

      {/* 3. 核心大屏布局（带平滑滑动隐藏/展开动效与动态数据联动） */}
      <div className="relative z-20 flex-1 flex gap-3 px-4 pb-3 overflow-hidden">
        
        {/* 🎯 人员分布 / 设备分布 浮动图层控制工具栏 (在全景模式下平滑滑动靠左贴边展示，始终可交互操作) */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className={`absolute top-[175px] z-40 flex items-start gap-2 select-none pointer-events-auto transition-all duration-500 ease-in-out ${
            isPanelsVisible ? 'left-[350px]' : 'left-4'
          }`}
        >
          {/* 左侧主控制块：人员分布 & 设备分布 双开关 */}
          <div className="flex flex-col gap-2">
            {/* 1. 人员分布开关方块 */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowPersonnelLayer(prev => !prev);
              }}
              className={`w-[74px] h-[74px] bg-[#12363b]/90 border rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md cursor-pointer transition-all duration-200 ${
                showPersonnelLayer ? 'border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.3)]' : 'border-[#2b7277]/80 hover:border-[#00d2ff]/80'
              }`}
              title={showPersonnelLayer ? "点击隐藏人员分布" : "点击显示人员分布"}
            >
              {/* Toggle 开关 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPersonnelLayer(prev => !prev);
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                  showPersonnelLayer ? 'bg-[#2995ff] shadow-[0_0_8px_rgba(41,149,255,0.7)]' : 'bg-[#1b2b36]'
                }`}
              >
                <span 
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    showPersonnelLayer ? 'translate-x-4' : 'translate-x-0'
                  }`} 
                />
              </button>
              <span className="text-xs text-[#e2f1ff] font-medium tracking-wide whitespace-nowrap">
                人员分布
              </span>
            </div>

            {/* 2. 设备分布开关方块 */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeviceLayer(prev => !prev);
              }}
              className={`w-[74px] h-[74px] bg-[#12363b]/90 border rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md cursor-pointer transition-all duration-200 ${
                showDeviceLayer ? 'border-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.35)]' : 'border-[#2b7277]/80 hover:border-[#00d2ff]/80'
              }`}
              title={showDeviceLayer ? "点击隐藏设备分布" : "点击展开设备分布与类型查询"}
            >
              {/* Toggle 开关 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeviceLayer(prev => !prev);
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                  showDeviceLayer ? 'bg-[#2995ff] shadow-[0_0_8px_rgba(41,149,255,0.7)]' : 'bg-[#1b2b36]'
                }`}
              >
                <span 
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    showDeviceLayer ? 'translate-x-4' : 'translate-x-0'
                  }`} 
                />
              </button>
              <span className="text-xs text-[#e2f1ff] font-medium tracking-wide whitespace-nowrap">
                设备分布
              </span>
            </div>
          </div>

          {/* 🎯 当点击设备分布时再出现二级类型菜单查询，显示对应的设备信息 */}
          {showDeviceLayer && (
            <div 
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-[#12363b]/95 border border-[#00e5ff]/60 rounded-xl p-2 min-w-[104px] shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_16px_rgba(0,229,255,0.25)] backdrop-blur-md flex flex-col gap-1 animate-fadeIn transition-all duration-200"
            >
              <div className="text-[10px] text-[#8ab4f8] px-2 py-0.5 font-medium border-b border-[#1f4a7c]/60 mb-0.5 flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#00e5ff]" />
                <span>设备分类筛选</span>
              </div>

              {/* 全部 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeviceCategory('all');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedDeviceCategory === 'all'
                    ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/20 border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-[#d0e5ea] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>全部</span>
                {selectedDeviceCategory === 'all' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]"></span>
                )}
              </button>

              {/* 作业面基站 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeviceCategory('work_station');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedDeviceCategory === 'work_station'
                    ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/20 border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-[#d0e5ea] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>作业面基站</span>
                {selectedDeviceCategory === 'work_station' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]"></span>
                )}
              </button>

              {/* 主基站 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeviceCategory('main_station');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedDeviceCategory === 'main_station'
                    ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/20 border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-[#d0e5ea] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>主基站</span>
                {selectedDeviceCategory === 'main_station' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]"></span>
                )}
              </button>

              {/* 气体检测仪 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeviceCategory('gas_detector');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedDeviceCategory === 'gas_detector'
                    ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/20 border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-[#d0e5ea] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>气体检测仪</span>
                {selectedDeviceCategory === 'gas_detector' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]"></span>
                )}
              </button>

              {/* 声光报警器 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDeviceCategory('alarm_light');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedDeviceCategory === 'alarm_light'
                    ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/20 border border-[#00e5ff]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-[#d0e5ea] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>声光报警器</span>
                {selectedDeviceCategory === 'alarm_light' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]"></span>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* ===================== 左侧面板 (向左滑入/滑出) ===================== */}
        <div 
          className={`w-[330px] flex flex-col gap-2 shrink-0 transition-all duration-500 ease-in-out relative ${
            isPanelsVisible ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'
          }`}
        >
          
          {/* 左1: 人员定位总览 */}
          <SciFiPanel 
            title={viewScope === 'yard' ? "厂区人员定位总览" : `${currentProject.shipType}人员定位总览`}
            icon={<Crosshair className="w-3.5 h-3.5" />}
            className="h-[142px]"
          >
            <div className="flex items-center h-full gap-3">
              {/* 左侧人员大头像光环 */}
              <div className="flex flex-col items-center justify-center pl-1 shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-[#00d2ff] shadow-[0_0_16px_rgba(0,210,255,0.45)] flex items-center justify-center bg-[#071d3d] relative">
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#00d2ff]/50 animate-spin" style={{ animationDuration: '12s' }}></div>
                  <User className="w-7 h-7 text-[#00d2ff]" />
                </div>
                <div className="mt-1 text-[11px] text-[#8ab4f8] whitespace-nowrap">
                  人员总数 <span className="text-[#00d2ff] font-bold font-mono text-sm ml-0.5">{currentTotal}</span>
                </div>
              </div>

              {/* 右侧3行状态卡片 */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                <div className="flex items-center justify-between bg-[#0b2447]/90 border border-[#1e4976]/80 px-2.5 py-1 rounded-xl whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8ab4f8] whitespace-nowrap">
                    <div className="w-4 h-4 rounded-full bg-blue-600/30 flex items-center justify-center shrink-0">
                      <Users className="w-2.5 h-2.5 text-[#00d2ff]" />
                    </div>
                    <span className="whitespace-nowrap">在岗人数</span>
                  </div>
                  <span className="font-mono text-[#00d2ff] font-bold text-sm whitespace-nowrap ml-1">{currentOnDuty}</span>
                </div>

                <div className="flex items-center justify-between bg-[#0b2447]/90 border border-[#1e4976]/80 px-2.5 py-1 rounded-xl whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8ab4f8] whitespace-nowrap">
                    <div className="w-4 h-4 rounded-full bg-amber-500/30 flex items-center justify-center shrink-0">
                      <User className="w-2.5 h-2.5 text-[#ffb300]" />
                    </div>
                    <span className="whitespace-nowrap">离岗人数</span>
                  </div>
                  <span className="font-mono text-[#ffb300] font-bold text-sm whitespace-nowrap ml-1">{currentOffDuty}</span>
                </div>

                <div className="flex items-center justify-between bg-[#0b2447]/90 border border-[#1e4976]/80 px-2.5 py-1 rounded-xl whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8ab4f8] whitespace-nowrap">
                    <div className="w-4 h-4 rounded-full bg-rose-500/30 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-2.5 h-2.5 text-[#ff1744]" />
                    </div>
                    <span className="whitespace-nowrap">今日报警人数</span>
                  </div>
                  <span className="font-mono text-[#ff1744] font-bold text-sm whitespace-nowrap ml-1">{currentAlarmCount}</span>
                </div>
              </div>
            </div>
          </SciFiPanel>

          {/* 左2: 人员分布统计 (厂区车间 / 船舱段分布) */}
          <SciFiPanel 
            title={viewScope === 'yard' ? "人员区域分布统计" : "船体各舱段分布统计"}
            icon={<Layers className="w-3.5 h-3.5" />}
            className="h-[200px]"
          >
            <div className="flex flex-col gap-1.5 h-full justify-center">
              {currentDistribution.map((item, index) => (
                <div key={index} className="flex items-center text-[11px] whitespace-nowrap">
                  <div className="w-20 text-[#8ab4f8] shrink-0 whitespace-nowrap truncate">{item.name}</div>
                  <div className="flex-1 h-2 bg-[#092244] mx-2 rounded-full overflow-hidden border border-[#19426f]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0077b6] to-[#00d2ff] rounded-full relative"
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white rounded-full shadow-[0_0_6px_#fff]"></div>
                    </div>
                  </div>
                  <div className="w-12 text-right font-mono text-[#e2f1ff] shrink-0 font-medium whitespace-nowrap">
                    {item.value}<span className="text-[10px] text-[#8ab4f8] ml-0.5">人</span>
                  </div>
                </div>
              ))}
            </div>
          </SciFiPanel>

          {/* 左3: 人员类型统计 */}
          <SciFiPanel 
            title={viewScope === 'yard' ? "人员工种类型统计" : "船上工种类型统计"}
            icon={<Users className="w-3.5 h-3.5" />}
            className="h-[165px]"
          >
            <div className="flex items-center h-full">
              {/* 环形图 */}
              <div className="w-[120px] h-full relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentTypeData}
                      innerRadius={28}
                      outerRadius={44}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {currentTypeData.map((entry, index) => (
                        <Cell key={`cell-type-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none whitespace-nowrap">
                  <span className="text-base font-bold font-mono text-white leading-none">{currentTotal}</span>
                  <span className="text-[9px] text-[#8ab4f8] mt-0.5">总人数</span>
                </div>
              </div>

              {/* 图例 */}
              <div className="flex-1 flex flex-col gap-1.5 justify-center pl-2 min-w-0">
                {currentTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[#8ab4f8] whitespace-nowrap">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                    <span className="font-mono text-[#e2f1ff] font-medium whitespace-nowrap ml-1">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SciFiPanel>

          {/* 左4: 人员状态趋势 (今日) */}
          <SciFiPanel 
            title="人员状态趋势 (今日)" 
            icon={<Activity className="w-3.5 h-3.5" />}
            extra={
              <div className="flex items-center gap-2.5 text-[10px] whitespace-nowrap">
                <div className="flex items-center gap-1 text-[#00e676] whitespace-nowrap">
                  <div className="w-2 h-0.5 bg-[#00e676] rounded-full"></div> 在岗人数
                </div>
                <div className="flex items-center gap-1 text-[#ff1744] whitespace-nowrap">
                  <div className="w-2 h-0.5 bg-[#ff1744] rounded-full"></div> 报警人数
                </div>
              </div>
            }
            className="flex-1 min-h-[150px]"
          >
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTrendData} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOnDuty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorAlarmDuty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff1744" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff1744" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#19426f" vertical={false} />
                  <XAxis dataKey="time" stroke="#8ab4f8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8ab4f8" fontSize={9} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(6, 24, 51, 0.95)', border: '1px solid #00d2ff', color: '#e2f1ff', borderRadius: '12px', fontSize: '11px' }} 
                  />
                  <Area type="monotone" dataKey="在岗人数" stroke="#00e676" fillOpacity={1} fill="url(#colorOnDuty)" strokeWidth={2} dot={{ r: 2, fill: '#00e676' }} />
                  <Area type="monotone" dataKey="报警人数" stroke="#ff1744" fillOpacity={1} fill="url(#colorAlarmDuty)" strokeWidth={2} dot={{ r: 2, fill: '#ff1744' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SciFiPanel>

        </div>

        {/* ===================== 中间全景/船模交互与悬浮数据概览 ===================== */}
        <div className="flex-1 flex flex-col relative min-w-0 pointer-events-none">
          
          {/* 中间上层浮动徽标与漫游控制 */}
          <div className="flex-1 relative">
            
            {/* 视角为“造船项目”时的船型头部徽章与阶段指示器 */}
            {viewScope === 'project' && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute top-3 left-3 bg-[#061833]/90 border border-[#00d2ff]/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center gap-3 text-xs text-[#e2f1ff] z-30 pointer-events-auto"
              >
                <div className="w-6 h-6 rounded-full bg-[#00d2ff]/20 flex items-center justify-center border border-[#00d2ff]">
                  <Ship className="w-3.5 h-3.5 text-[#00d2ff]" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{currentProject.name}</span>
                    <span className="text-[10px] text-[#00e676] bg-[#00e676]/10 px-1.5 py-0.2 rounded border border-[#00e676]/30">3D模型孪生</span>
                  </div>
                  <div className="text-[10px] text-[#8ab4f8] flex items-center gap-2 mt-0.5">
                    <span>分段状态: <strong className="text-[#00d2ff]">{currentProject.phase}</strong></span>
                    <span>·</span>
                    <span>泊位: <strong>{currentProject.dockingArea}</strong></span>
                    <span>·</span>
                    <span>负责人: <strong>{currentProject.manager}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* 隐藏数据面板状态下的全景漫游提示气泡 */}
            {!isPanelsVisible && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#061833]/90 border border-[#00d2ff] backdrop-blur-md px-5 py-2 rounded-full shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center gap-2.5 text-sm text-[#e2f1ff] animate-bounce z-30 pointer-events-auto">
                <Eye className="w-4 h-4 text-[#00d2ff]" />
                <span>
                  {viewScope === 'yard' ? '厂区全景漫游模式' : `${currentProject.name} 3D孪生漫游模式`} · 点击任意背景区域即可恢复数据面板
                </span>
              </div>
            )}

          </div>

          {/* 底部：今日数据概览横幅 (向下滑入/滑出，圆角风格) */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`w-full bg-[#061833]/85 border border-[#1f4a7c]/80 backdrop-blur-md rounded-2xl p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(31,74,124,0.35)] relative shrink-0 transition-all duration-500 ease-in-out cursor-default pointer-events-auto ${
              isPanelsVisible ? 'translate-y-0 opacity-100' : 'translate-y-[140%] opacity-0 pointer-events-none'
            }`}
          >
            {/* 四角圆润发光装饰 */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00d2ff]/80 rounded-tl-lg pointer-events-none"></div>
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00d2ff]/80 rounded-tr-lg pointer-events-none"></div>
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00d2ff]/80 rounded-bl-lg pointer-events-none"></div>
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00d2ff]/80 rounded-br-lg pointer-events-none"></div>

            {/* 标题栏 */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#1f4a7c]/60 px-1 whitespace-nowrap">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Activity className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                <span className="text-xs font-bold text-[#e2f1ff] tracking-wider whitespace-nowrap">
                  {viewScope === 'yard' ? '厂区今日数据概览' : `${currentProject.name} 建造指标概览`}
                </span>
              </div>
              <div className="flex gap-1 opacity-70">
                <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></div>
              </div>
            </div>

            {/* 6大指标 (每个都是圆角卡片，根据所选视图动态计算) */}
            <div className="grid grid-cols-6 divide-x divide-[#1f4a7c]/60 pt-0.5">
              {(viewScope === 'yard' ? [
                { 
                  label: '人员总数', 
                  value: '1284', 
                  change: '+5.2%', 
                  isUp: true, 
                  icon: Users,
                  iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' 
                },
                { 
                  label: '在岗人数', 
                  value: '1248', 
                  change: '+6.1%', 
                  isUp: true, 
                  icon: User,
                  iconBg: 'bg-blue-600/30 text-[#00d2ff] border-blue-500/40' 
                },
                { 
                  label: '预警次数', 
                  value: '8', 
                  change: '-11.1%', 
                  isUp: false, 
                  icon: AlertTriangle,
                  iconBg: 'bg-amber-500/30 text-[#ffb300] border-amber-500/40' 
                },
                { 
                  label: '设备总数', 
                  value: '512', 
                  change: '+2.0%', 
                  isUp: true, 
                  icon: Cpu,
                  iconBg: 'bg-cyan-500/30 text-[#00d2ff] border-cyan-500/40' 
                },
                { 
                  label: '在线设备', 
                  value: '485', 
                  change: '+3.6%', 
                  isUp: true, 
                  icon: Activity,
                  iconBg: 'bg-emerald-500/30 text-[#00e676] border-emerald-500/40' 
                },
                { 
                  label: '生产区域覆盖率', 
                  value: '98.6%', 
                  change: '+0.8%', 
                  isUp: true, 
                  icon: Compass,
                  iconBg: 'bg-indigo-500/30 text-[#8ab4f8] border-indigo-500/40' 
                },
              ] : currentProject.kpis).map((item, idx) => (
                <div key={idx} className="flex flex-col px-3 first:pl-1 last:pr-1 whitespace-nowrap min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8ab4f8] whitespace-nowrap">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <item.icon className="w-2.5 h-2.5" />
                    </div>
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  </div>

                  <div className="text-lg font-bold font-mono text-[#e2f1ff] my-0.5 tracking-tight whitespace-nowrap">
                    {item.value}
                  </div>

                  <div className="text-[10px] text-[#557696] flex items-center gap-1 whitespace-nowrap">
                    <span className="whitespace-nowrap">较昨日</span>
                    <span className={`whitespace-nowrap font-mono ${item.change.startsWith('+') ? 'text-[#ff1744]' : 'text-[#00e676]'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ===================== 右侧面板 (向右滑入/滑出) ===================== */}
        <div 
          className={`w-[330px] flex flex-col gap-2 shrink-0 transition-all duration-500 ease-in-out ${
            isPanelsVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
          }`}
        >
          
          {/* 右1: 实时人员预警 (支持自动平滑轮播) */}
          <SciFiPanel 
            title={viewScope === 'yard' ? "实时人员预警" : `${currentProject.shipType}专属实时预警`}
            icon={<Bell className="w-3.5 h-3.5 text-[#ff1744]" />}
            extra={
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#00d2ff]/70">自动轮播中</span>
                <button className="text-[11px] text-[#00d2ff] hover:underline cursor-pointer whitespace-nowrap">更多 &gt;</button>
              </div>
            }
            className="h-[200px]"
          >
            {/* 今日预警统计 */}
            <div className="text-[11px] text-[#8ab4f8] mb-1.5 pb-1 border-b border-[#1f4a7c]/40 flex items-center justify-between whitespace-nowrap">
              <div className="whitespace-nowrap">
                今日预警 <span className="text-[#ff1744] font-bold font-mono text-base mx-1">{currentAlerts.length}</span> 条
              </div>
            </div>

            {/* 预警自动轮播列表 */}
            <div 
              ref={alertsScrollRef}
              onMouseEnter={() => setIsAlertsHovered(true)}
              onMouseLeave={() => setIsAlertsHovered(false)}
              className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin scrollbar-thumb-[#1f4a7c] scroll-smooth"
            >
              {currentAlerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center text-[11px] py-1 px-2 bg-[#0b2447]/60 hover:bg-[#0f3466]/80 rounded-xl border border-[#1a4473]/50 transition-colors whitespace-nowrap"
                >
                  <Bell className="w-3 h-3 text-[#ff1744] mr-1.5 shrink-0 animate-bounce" />
                  <span className="font-mono text-[#8ab4f8] w-9 shrink-0 whitespace-nowrap">{alert.time}</span>
                  <span className="w-8 text-[#e2f1ff] font-medium shrink-0 whitespace-nowrap">{alert.name}</span>
                  <span className="flex-1 text-[#ff7849] truncate pr-1 whitespace-nowrap">{alert.reason}</span>
                  <span className="text-[#8ab4f8] shrink-0 text-right text-[10px] whitespace-nowrap">{alert.location}</span>
                </div>
              ))}
            </div>
          </SciFiPanel>

          {/* 右2: 定位设备总览 */}
          <SciFiPanel 
            title={viewScope === 'yard' ? "定位设备总览" : "船载监测设备总览"}
            icon={<Cpu className="w-3.5 h-3.5" />}
            className="h-[250px]"
          >
            {/* 上半部4个状态指标 (圆角小徽章) */}
            <div className="grid grid-cols-4 gap-1.5 pb-2 mb-1.5 border-b border-[#1f4a7c]/50">
              {[
                { label: '设备总数', value: currentDeviceSummary.total, color: 'text-[#00d2ff]', bg: 'border-[#00d2ff]/40 bg-[#00d2ff]/10', icon: Server },
                { label: '在线设备', value: currentDeviceSummary.online, color: 'text-[#00e676]', bg: 'border-[#00e676]/40 bg-[#00e676]/10', icon: Activity },
                { label: '离线设备', value: currentDeviceSummary.offline, color: 'text-[#8ab4f8]', bg: 'border-[#8ab4f8]/40 bg-[#8ab4f8]/10', icon: Radio },
                { label: '故障设备', value: currentDeviceSummary.fault, color: 'text-[#ff1744]', bg: 'border-[#ff1744]/40 bg-[#ff1744]/10', icon: AlertTriangle },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center p-1.5 rounded-xl bg-[#0b2447]/60 border border-[#19426f] whitespace-nowrap min-w-0">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mb-0.5 shrink-0 ${stat.bg}`}>
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                  </div>
                  <div className={`text-sm font-mono font-bold leading-tight whitespace-nowrap ${stat.color}`}>{stat.value}</div>
                  <div className="text-[9px] text-[#557696] mt-0.5 whitespace-nowrap truncate">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 下半部：设备类型统计环形图 */}
            <div className="text-[11px] text-[#8ab4f8] mb-0.5 font-medium whitespace-nowrap">设备类型统计</div>
            <div className="flex-1 flex items-center">
              <div className="w-[115px] h-full relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={yardDeviceTypes}
                      innerRadius={26}
                      outerRadius={40}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {yardDeviceTypes.map((entry, index) => (
                        <Cell key={`cell-dev-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none whitespace-nowrap">
                  <span className="text-base font-bold font-mono text-white leading-none">{currentDeviceSummary.total}</span>
                  <span className="text-[9px] text-[#8ab4f8] mt-0.5">总设备数</span>
                </div>
              </div>

              {/* 图例 */}
              <div className="flex-1 flex flex-col gap-1.5 justify-center pl-1 min-w-0">
                {yardDeviceTypes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[#8ab4f8] whitespace-nowrap">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                    <span className="font-mono text-[#e2f1ff] font-medium whitespace-nowrap ml-1">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SciFiPanel>

          {/* 右3: 设备状态列表 (支持自动平滑轮播) */}
          <SciFiPanel 
            title="设备状态列表" 
            icon={<Radio className="w-3.5 h-3.5" />}
            extra={
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#00d2ff]/70">自动轮播中</span>
                <button className="text-[11px] text-[#00d2ff] hover:underline cursor-pointer whitespace-nowrap">更多 &gt;</button>
              </div>
            }
            className="flex-1 min-h-[160px]"
          >
            <div className="flex flex-col h-full">
              {/* 表头 */}
              <div className="flex text-[11px] text-[#557696] border-b border-[#1f4a7c]/60 pb-1 mb-1 font-medium px-2 whitespace-nowrap">
                <div className="w-1/4 whitespace-nowrap">设备名称</div>
                <div className="w-1/4 whitespace-nowrap">设备类型</div>
                <div className="w-1/4 text-center whitespace-nowrap">状态</div>
                <div className="w-1/4 text-right whitespace-nowrap">位置</div>
              </div>

              {/* 自动轮播表格数据行 */}
              <div 
                ref={devicesScrollRef}
                onMouseEnter={() => setIsDevicesHovered(true)}
                onMouseLeave={() => setIsDevicesHovered(false)}
                className="flex-1 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin scrollbar-thumb-[#1f4a7c] scroll-smooth"
              >
                {currentDeviceList.map((device, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center text-[11px] py-1 px-2 hover:bg-[#0f3466]/60 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <div className="w-1/4 text-[#e2f1ff] font-mono whitespace-nowrap truncate">{device.id}</div>
                    <div className="w-1/4 text-[#8ab4f8] whitespace-nowrap truncate">{device.type}</div>
                    <div className={`w-1/4 flex items-center justify-center gap-1 ${device.statusColor} whitespace-nowrap`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${device.dotColor} shrink-0`}></div>
                      <span className="whitespace-nowrap">{device.status}</span>
                    </div>
                    <div className="w-1/4 text-right text-[#8ab4f8] whitespace-nowrap truncate">{device.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </SciFiPanel>

        </div>

      </div>

    </div>
  );
}
