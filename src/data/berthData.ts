import React from 'react';

export type BerthCategory = 'berth_pier' | 'berth_slipway';

export interface OccupiedShip {
  id: string;
  name: string;
  shipType: string;
  shipCode: string;
  stage: string;
  isSmallShip?: boolean;
}

export interface BerthAreaConfig {
  id: string;
  code: number; // 1 ~ 6
  name: string; // 完整名称
  shortName: string; // 简短名称
  category: BerthCategory;
  categoryName: string; // '移动码头' | '平船台'
  maxCapacity: number; // 容量上限
  ruleDescription: string; // 规则文字说明
  restrictionNote?: string; // 特殊限制说明
  isSmallShipOnly?: boolean; // 是否仅限小型船只
  // 在 1:1 船厂俯视背景图中的绝对百分比位置 (Top, Left, Width, Height)
  rect: {
    top: number; // %
    left: number; // %
    width: number; // %
    height: number; // %
  };
  // 标签定位偏移
  labelPos: {
    top: number; // %
    left: number; // %
  };
  // 初始停泊船舶
  currentOccupied: OccupiedShip[];
  // 区域设施支持
  facilities: string[];
  depthMeters?: number;
}

// 6 个可停泊区域的配置定义（严格按照用户提供的规则与红框标注位置）
export const BERTH_AREAS: BerthAreaConfig[] = [
  {
    id: 'berth-1',
    code: 1,
    name: '1号船台（2万吨船台）',
    shortName: '1号船台',
    category: 'berth_slipway',
    categoryName: '平船台',
    maxCapacity: 2,
    ruleDescription: '平船台：1号船台（2万吨船台）：<=2艘',
    restrictionNote: '最大承载2万吨级分段搭载与船体合拢建造',
    isSmallShipOnly: false,
    rect: {
      top: 85.8,
      left: 44.0,
      width: 44.5,
      height: 4.2
    },
    labelPos: {
      top: 87.8,
      left: 77.0
    },
    currentOccupied: [
      {
        id: 'PRJ-2026-LNG01',
        name: '17.4万m³ 大型LNG船 1号舰',
        shipType: '清洁能源运输',
        shipCode: 'HULL-LNG-174',
        stage: '合拢焊接'
      }
    ],
    facilities: ['200t龙门吊', '高精度三维定位基站', '焊接供气管网', '分段滑道系统'],
    depthMeters: 0
  },
  {
    id: 'berth-2',
    code: 2,
    name: '2号码头 (移动码头)',
    shortName: '2号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 3,
    ruleDescription: '移动码头：2号码头：<=3艘',
    restrictionNote: '配备双侧重型缆桩与岸电电箱，最多系泊3艘船舶',
    isSmallShipOnly: false,
    rect: {
      top: 0.8,
      left: 63.5,
      width: 18.2,
      height: 21.8
    },
    labelPos: {
      top: 11.2,
      left: 74.5
    },
    currentOccupied: [
      {
        id: 'PRJ-2026-PSV01',
        name: '75M 动力定位平台供应船',
        shipType: '海洋工程',
        shipCode: 'HULL-PSV-075',
        stage: '交船交付',
        isSmallShip: true
      },
      {
        id: 'PRJ-2026-CTN03',
        name: '15000TEU 集装箱船',
        shipType: '集装箱班轮',
        shipCode: 'HULL-CTN-150',
        stage: '系泊调试'
      }
    ],
    facilities: ['50t门座式起重机', '高压岸电箱', '系泊绞车', '深水导向靠球'],
    depthMeters: 14.5
  },
  {
    id: 'berth-3',
    code: 3,
    name: '3号码头 (移动码头)',
    shortName: '3号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 2,
    ruleDescription: '移动码头：3号码头：<=2艘',
    restrictionNote: '水下舾装与管系试压核心泊位，最多系泊2艘船舶',
    isSmallShipOnly: false,
    rect: {
      top: 42.8,
      left: 78.0,
      width: 15.0,
      height: 18.8
    },
    labelPos: {
      top: 52.0,
      left: 84.0
    },
    currentOccupied: [
      {
        id: 'PRJ-2026-TANK02',
        name: '30万吨 VLCC 超大型原油船',
        shipType: '液体散货',
        shipCode: 'HULL-VLCC-300',
        stage: '水下舾装'
      }
    ],
    facilities: ['80t重型岸吊', '低压工业气源', '防落水双重警戒雷达', '试压水回收系统'],
    depthMeters: 16.0
  },
  {
    id: 'berth-4',
    code: 4,
    name: '4号浮动码头 (移动码头)',
    shortName: '4号浮动码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 2,
    ruleDescription: '移动码头：4号浮动码头：<=2艘',
    restrictionNote: '浮动式自适应潮位系泊栈桥，最多系泊2艘船舶',
    isSmallShipOnly: false,
    rect: {
      top: 67.5,
      left: 89.8,
      width: 9.5,
      height: 17.2
    },
    labelPos: {
      top: 79.5,
      left: 95.0
    },
    currentOccupied: [
      {
        id: 'PRJ-2026-CHEM01',
        name: '18500 DWT 绿色油化船',
        shipType: '特种危化运输',
        shipCode: 'HULL-CHEM-185',
        stage: '管系试压'
      }
    ],
    facilities: ['自动潮位补偿栈桥', '移动式升降吊机', '防污染围油栏', '防爆消防炮'],
    depthMeters: 12.0
  },
  {
    id: 'berth-5',
    code: 5,
    name: '5号码头 (移动码头 - 小型船只)',
    shortName: '5号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 1,
    ruleDescription: '移动码头：5号码头：1艘小型船只，如拖轮',
    restrictionNote: '专用小型泊位：仅限停泊1艘小型船只（如拖轮、工作艇、支持船）',
    isSmallShipOnly: true,
    rect: {
      top: 34.5,
      left: 76.5,
      width: 7.2,
      height: 7.2
    },
    labelPos: {
      top: 38.0,
      left: 80.0
    },
    currentOccupied: [],
    facilities: ['拖轮快速缆桩', '轻型加油补给臂', '小型工作艇引桥', '微基站感知网络'],
    depthMeters: 8.5
  },
  {
    id: 'berth-6',
    code: 6,
    name: '6号船台（平船台）',
    shortName: '6号船台',
    category: 'berth_slipway',
    categoryName: '平船台',
    maxCapacity: 3,
    ruleDescription: '平船台：6号船台（平船台）：<=3艘',
    restrictionNote: '大型平船台与龙门吊总组作业区，最多同时搭载3艘船舶',
    isSmallShipOnly: false,
    rect: {
      top: 31.0,
      left: 41.0,
      width: 22.2,
      height: 19.8
    },
    labelPos: {
      top: 42.5,
      left: 49.0
    },
    currentOccupied: [
      {
        id: 'PRJ-2026-BULK04',
        name: '82,000 DWT 散货船',
        shipType: '干散货运输',
        shipCode: 'HULL-BULK-082',
        stage: '船台搭载'
      }
    ],
    facilities: ['800t跨区巨型龙门吊', '液压三维调整载车', '重型承载地基', '激光合拢测量仪'],
    depthMeters: 0
  }
];

// 判断船型是否属于小型船只（例如拖轮、工作艇、AHTS、PSV等）
export function checkIsSmallShip(shipNameOrType?: string): boolean {
  if (!shipNameOrType) return false;
  const lower = shipNameOrType.toLowerCase();
  return (
    lower.includes('拖轮') ||
    lower.includes('tug') ||
    lower.includes('工作船') ||
    lower.includes('工作艇') ||
    lower.includes('海工辅助') ||
    lower.includes('支持船') ||
    lower.includes('ahts') ||
    lower.includes('psv') ||
    lower.includes('小型')
  );
}
