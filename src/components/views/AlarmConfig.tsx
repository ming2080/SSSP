import React, { useState } from 'react';
import { 
  Settings, 
  List, 
  Plus, 
  Search, 
  RotateCw, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Eye, 
  GitBranch, 
  Ship, 
  Globe2, 
  ShieldAlert,
  Clock,
  Filter
} from 'lucide-react';
import { INITIAL_ALARM_RULES, AlarmRuleItem } from '@/src/data/alarmData';
import { AlarmFormModal } from './AlarmFormModal';
import { AlarmDetailModal } from './AlarmDetailModal';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';

export function AlarmConfig() {
  const [activeTab, setActiveTab] = useState<'rules' | 'records'>('rules');
  const [rules, setRules] = useState<AlarmRuleItem[]>(INITIAL_ALARM_RULES);
  
  // 模态框状态
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlarmRuleItem | null>(null);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingRule, setViewingRule] = useState<AlarmRuleItem | null>(null);

  const [latestCreatedId, setLatestCreatedId] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 搜索和多维筛选状态
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterProject, setFilterProject] = useState(''); // '' 全部, 'GLOBAL' 全局, 'PRJ-...'
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 筛选规则
  const filteredRules = rules.filter(r => {
    const matchesName = filterName ? r.name.toLowerCase().includes(filterName.toLowerCase()) : true;
    const matchesType = filterType ? r.type === filterType : true;
    const matchesLevel = filterLevel ? r.level === filterLevel : true;
    const matchesStatus = filterStatus ? r.status === filterStatus : true;
    
    let matchesProject = true;
    if (filterProject === 'GLOBAL') {
      matchesProject = !r.projectId;
    } else if (filterProject) {
      matchesProject = r.projectId === filterProject;
    }

    return matchesName && matchesType && matchesLevel && matchesStatus && matchesProject;
  });

  // 重置筛选
  const handleResetFilters = () => {
    setFilterName('');
    setFilterType('');
    setFilterProject('');
    setFilterLevel('');
    setFilterStatus('');
  };

  // 处理新建/编辑规则提交
  const handleFormSubmit = (rule: AlarmRuleItem, isEdit: boolean) => {
    if (isEdit) {
      // 编辑：更新列表中对应的项
      setRules(prev => prev.map(r => r.id === rule.id ? rule : r));
      setLatestCreatedId(rule.id);
      setSuccessToast(`已成功将告警配置「${rule.name}」更新至最新版本 ${rule.currentVersion}！`);
    } else {
      // 新建：置顶插入
      setRules(prev => [rule, ...prev]);
      setLatestCreatedId(rule.id);
      setSuccessToast(`成功创建告警配置：「${rule.name}」并发布初始版本 ${rule.currentVersion}！`);
    }

    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // 打开新建弹窗
  const handleOpenCreate = () => {
    setEditingRule(null);
    setIsFormModalOpen(true);
  };

  // 打开编辑弹窗
  const handleOpenEdit = (rule: AlarmRuleItem) => {
    setEditingRule(rule);
    setIsFormModalOpen(true);
  };

  // 打开查看详情弹窗
  const handleOpenDetail = (rule: AlarmRuleItem) => {
    setViewingRule(rule);
    setIsDetailModalOpen(true);
  };

  // 删除规则
  const handleDeleteRule = (id: number, name: string) => {
    if (window.confirm(`确定要删除告警配置「${name}」及其所有历史版本记录吗？`)) {
      setRules(prev => prev.filter(r => r.id !== id));
      setSuccessToast(`已删除告警配置「${name}」`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  return (
    <div className="h-full">
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden flex flex-col h-full">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button 
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center transition-colors cursor-pointer ${
              activeTab === 'rules' 
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
            onClick={() => setActiveTab('rules')}
          >
            <Settings className="w-4 h-4 mr-2 text-blue-600" />
            告警规则配置与版本管理
          </button>
          <button 
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center transition-colors cursor-pointer ${
              activeTab === 'records' 
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
            onClick={() => setActiveTab('records')}
          >
            <List className="w-4 h-4 mr-2" />
            实时与历史告警流水
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'rules' && (
            <div className="flex flex-col h-full p-5 bg-white">
              
              {/* 成功提示条 */}
              {successToast && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn shadow-2xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">{successToast}</span>
                  </div>
                  <button 
                    onClick={() => setSuccessToast(null)}
                    className="text-emerald-600 hover:text-emerald-900 text-xs font-bold px-2 py-0.5 rounded hover:bg-emerald-100/50 cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              )}

              {/* Top Filter Bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-4 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 shrink-0">策略名称</span>
                  <input 
                    type="text" 
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="搜索策略名称..." 
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-44 placeholder-slate-400 transition-shadow" 
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 shrink-0">策略类型</span>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-36 bg-white cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">全部策略类型</option>
                    <option value="气体告警">气体告警</option>
                    <option value="厂区玩手机">厂区玩手机</option>
                    <option value="未佩戴安全帽">未佩戴安全帽</option>
                    <option value="进入危险区域">进入危险区域</option>
                    <option value="受限空间滞留">受限空间滞留</option>
                    <option value="长时间静止">长时间静止</option>
                    <option value="超出活动范围">超出活动范围</option>
                  </select>
                </div>

                {/* 关联项目筛选 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 shrink-0">适用项目/范围</span>
                  <select 
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-44 bg-white cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">全部适用范围</option>
                    <option value="GLOBAL">🌐 全局有效配置</option>
                    {MOCK_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>
                        🚢 {p.name.substring(0, 14)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 shrink-0">告警级别</span>
                  <select 
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-28 bg-white cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">全部级别</option>
                    <option value="低">低</option>
                    <option value="中">中</option>
                    <option value="高">高</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 shrink-0">启用状态</span>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-28 bg-white cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <option value="">全部状态</option>
                    <option value="启用">已启用</option>
                    <option value="禁用">已禁用</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    onClick={() => {}}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white text-xs rounded-lg shadow-xs transition-colors font-medium cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" /> 查询
                  </button>
                  <button 
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 text-xs rounded-lg shadow-2xs transition-colors font-medium cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> 重置
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mb-3.5 flex items-center justify-between shrink-0">
                <button 
                  onClick={handleOpenCreate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1677ff] text-white text-xs rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-sm shadow-blue-500/20 active:scale-98 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> 新建告警配置
                </button>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>共检索到 <strong className="text-slate-800 font-bold">{filteredRules.length}</strong> 条告警配置项</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-400">每次编辑将自动递增生成新版本并归档快照</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-center text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-3 px-3 w-12 whitespace-nowrap">序号</th>
                      <th className="py-3 px-4 text-left whitespace-nowrap">告警策略名称</th>
                      <th className="py-3 px-3 whitespace-nowrap">当前生效版本</th>
                      <th className="py-3 px-4 text-left whitespace-nowrap">适用范围 / 关联工程项目</th>
                      <th className="py-3 px-3 whitespace-nowrap">策略类型</th>
                      <th className="py-3 px-3 w-20 whitespace-nowrap">告警级别</th>
                      <th className="py-3 px-3 w-24 whitespace-nowrap">分级通知</th>
                      <th className="py-3 px-3 w-20 whitespace-nowrap">生效周期</th>
                      <th className="py-3 px-3 w-20 whitespace-nowrap">状态</th>
                      <th className="py-3 px-3 w-36 whitespace-nowrap">最近修改时间</th>
                      <th className="py-3 px-4 w-44 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {filteredRules.map((rule, idx) => {
                      const isNew = rule.id === latestCreatedId;
                      return (
                        <tr 
                          key={rule.id} 
                          className={`transition-colors group ${
                            isNew ? 'bg-blue-50/70 hover:bg-blue-100/50 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-3 px-3 text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 text-left font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => handleOpenDetail(rule)}>
                                {rule.name}
                              </span>
                              {isNew && (
                                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                                  NEW
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 🎯 需求1：版本信息展示与版本标签 */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenDetail(rule)}
                              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                              title="点击查看此版本快照与历史变更"
                            >
                              <GitBranch className="w-3 h-3 text-blue-600" />
                              <span>{rule.currentVersion || 'V1'}</span>
                              {rule.versions && rule.versions.length > 1 && (
                                <span className="text-[9px] bg-blue-200/70 text-blue-800 px-1 rounded">
                                  {rule.versions.length}版
                                </span>
                              )}
                            </button>
                          </td>

                          {/* 🎯 需求3：项目关联信息展示（为空则显示全局有效） */}
                          <td className="py-3 px-4 text-left whitespace-nowrap">
                            {rule.projectId ? (
                              <div className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 text-xs max-w-[220px] truncate" title={`${rule.projectId} · ${rule.projectName}`}>
                                <Ship className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="font-mono text-blue-700 font-bold text-[11px] shrink-0">{rule.projectId}</span>
                                <span className="truncate text-slate-700">{rule.projectName}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                                <Globe2 className="w-3 h-3 text-emerald-600" />
                                全局有效
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">{rule.type}</td>
                          
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold min-w-[36px] ${
                              rule.level === '高' 
                                ? 'text-red-700 bg-red-50 border border-red-200' 
                                : rule.level === '中' 
                                ? 'text-amber-700 bg-amber-50 border border-amber-200' 
                                : 'text-blue-700 bg-blue-50 border border-blue-200'
                            }`}>
                              {rule.level}
                            </span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-slate-600 font-medium">{rule.notify}</span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-slate-500">{rule.period}</td>
                          
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              rule.status === '启用' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {rule.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{rule.modifiedAt}</td>

                          {/* 🎯 需求2：操作栏增加【查看】功能，可按版本查看 */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => handleOpenDetail(rule)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="查看版本配置详情与历史快照"
                              >
                                <Eye className="w-3.5 h-3.5" /> 查看
                              </button>
                              
                              <button 
                                onClick={() => handleOpenEdit(rule)}
                                className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-2 py-1 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="编辑并递增生成新版本"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> 编辑
                              </button>

                              <button 
                                onClick={() => handleDeleteRule(rule.id, rule.name)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="删除告警配置"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> 删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-3.5 pt-3.5 border-t border-slate-100 shrink-0 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>共 <strong>{filteredRules.length}</strong> 条记录</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select className="pl-2.5 pr-6 py-1 border border-slate-200 rounded text-slate-600 outline-none bg-white cursor-pointer hover:border-slate-300 transition-colors">
                      <option>10条/页</option>
                      <option>20条/页</option>
                      <option>50条/页</option>
                    </select>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:border-blue-500 hover:text-blue-500 bg-white transition-colors cursor-pointer">&lt;</button>
                    <button className="w-6 h-6 flex items-center justify-center border border-blue-600 rounded text-white bg-blue-600 font-bold">1</button>
                    <button className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded hover:border-blue-500 hover:text-blue-500 text-slate-600 bg-white transition-colors cursor-pointer">&gt;</button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>前往</span>
                    <input type="text" defaultValue="1" className="w-9 px-1 py-0.5 border border-slate-200 rounded text-center outline-none focus:border-blue-500" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="flex flex-col h-full p-5 bg-white">
              <div className="flex justify-between mb-3.5 gap-3 shrink-0">
                <div className="flex gap-2">
                  <select className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 outline-none shadow-2xs">
                    <option>全部告警类型</option>
                    <option>气体告警</option>
                    <option>未佩戴安全帽</option>
                    <option>进入危险区域</option>
                    <option>受限空间滞留</option>
                    <option>长时间静止</option>
                  </select>
                  <select className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 outline-none shadow-2xs">
                    <option>全部级别</option>
                    <option>高危</option>
                    <option>中危</option>
                    <option>低</option>
                  </select>
                  <input type="date" className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-700 outline-none shadow-2xs" />
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input type="text" placeholder="搜索告警内容或人员..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 w-52 focus:outline-none focus:border-blue-500 shadow-2xs placeholder-slate-400" />
                </div>
              </div>

              <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">发生时间</th>
                      <th className="py-2.5 px-3">告警内容</th>
                      <th className="py-2.5 px-3">级别</th>
                      <th className="py-2.5 px-3">触发策略与版本</th>
                      <th className="py-2.5 px-3">关联项目</th>
                      <th className="py-2.5 px-3">处理状态</th>
                      <th className="py-2.5 px-3">处理人</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">2026-08-28 10:42</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">刘强 (EMP-042) 闯入2号坞吊装禁区</td>
                      <td className="py-2.5 px-3"><span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-bold text-[11px]">高危</span></td>
                      <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">V3</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">24,000 TEU 超大型集装箱船</td>
                      <td className="py-2.5 px-3"><span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-bold">待处理</span></td>
                      <td className="py-2.5 px-3 text-slate-400">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">2026-08-28 08:12</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">张伟 (EMP-015) 1号船台密闭液货舱气体浓度达 18 ppm</td>
                      <td className="py-2.5 px-3"><span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-bold text-[11px]">高危</span></td>
                      <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">V2</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">17.4万m³ 薄膜型大型LNG船 1号舰</td>
                      <td className="py-2.5 px-3"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">已处理</span></td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">安全工程师-林峰</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">2026-08-27 15:30</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">总装车间 3号作业区未佩戴安全帽违章</td>
                      <td className="py-2.5 px-3"><span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-[11px]">中危</span></td>
                      <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">V1</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-medium">🌐 全局有效策略</td>
                      <td className="py-2.5 px-3"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">已恢复</span></td>
                      <td className="py-2.5 px-3 text-slate-500">系统自动告警消除</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 新建/编辑告警配置弹窗 (带自动版本递增与项目关联) */}
      <AlarmFormModal
        isOpen={isFormModalOpen}
        editRule={editingRule}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRule(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* 查看告警配置与版本快照弹窗 */}
      <AlarmDetailModal
        isOpen={isDetailModalOpen}
        rule={viewingRule}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingRule(null);
        }}
        onEdit={(rule) => {
          handleOpenEdit(rule);
        }}
      />
    </div>
  );
}
