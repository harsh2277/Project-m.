import React from 'react';
import { Layout } from '../components/Layout';
import {
  CheckSquare, Users, Plus, Calendar as CalendarIcon,
  HelpCircle, PieChart, Clock, ChevronDown, Download,
  Check, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const CustomDateRangePicker = ({ isOpen, onClose, selectedRange, onSelectRange }: any) => {
  const [currentMonthDate, setCurrentMonthDate] = React.useState(new Date(2023, 4, 1)); // Default to May 2023 context
  const [selectionStart, setSelectionStart] = React.useState<Date | null>(new Date(2023, 4, 28));
  const [selectionEnd, setSelectionEnd] = React.useState<Date | null>(new Date(2023, 5, 3));

  if (!isOpen) return null;

  const presets = [
    "Last 7 days", "Last 4 weeks", "Last 3 months",
    "Last 12 months", "Month to date", "Quarter to date", "Year to date"
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const padZero = (n: number) => n < 10 ? '0' + n : n;

  const formatDate = (date: Date | null) => {
    if (!date) return "-- / -- / ----";
    return `${padZero(date.getDate())} / ${padZero(date.getMonth() + 1)} / ${date.getFullYear()}`;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const generateDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ d: prevMonthDays - firstDay + i + 1, gray: true, date: new Date(year, month - 1, prevMonthDays - firstDay + i + 1) });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      let sel = null;

      if (selectionStart && isSameDay(date, selectionStart)) {
        sel = selectionEnd ? 'start' : 'start-only';
      } else if (selectionEnd && isSameDay(date, selectionEnd)) {
        sel = 'end';
      } else if (selectionStart && selectionEnd && date > selectionStart && date < selectionEnd) {
        sel = 'mid';
      }
      days.push({ d: i, gray: false, date, sel });
    }

    const totalCurrentDays = firstDay + daysInMonth;
    const remainingDays = 42 - totalCurrentDays;
    for (let i = 1; i <= remainingDays; i++) {
      if (i > 7 && totalCurrentDays <= 35) break;
      days.push({ d: i, gray: true, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  const leftYear = currentMonthDate.getFullYear();
  const leftMonth = currentMonthDate.getMonth();
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  const leftMonthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const rightMonthName = rightDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const leftDays = generateDays(leftYear, leftMonth);
  const rightDays = generateDays(rightYear, rightMonth);

  const prevMonth = () => setCurrentMonthDate(new Date(leftYear, leftMonth - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(leftYear, leftMonth + 1, 1));

  const handleDayClick = (day: any) => {
    if (day.gray) return;
    const date = day.date;

    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(date);
      setSelectionEnd(null);
      onSelectRange("Custom date");
    } else if (selectionStart && !selectionEnd) {
      if (date >= selectionStart) {
        setSelectionEnd(date);
      } else {
        setSelectionStart(date);
      }
    }
  };

  const renderDay = (day: any, i: number) => {
    let bgClasses = "text-slate-700 hover:bg-slate-100 rounded-md";
    let innerContent = <>{day.d}</>;

    if (day.gray) {
      bgClasses = "text-slate-300";
    } else if (day.sel) {
      if (day.sel === 'start-only') {
        bgClasses = "bg-blue-600 text-white rounded-md relative z-10";
      } else if (day.sel === 'start') {
        bgClasses = "bg-blue-600 text-white rounded-l-md rounded-r-none relative z-10";
      } else if (day.sel === 'mid') {
        bgClasses = "bg-blue-500 text-white rounded-none relative z-10";
      } else if (day.sel === 'end') {
        bgClasses = "bg-blue-800 text-white rounded-r-lg rounded-l-none relative z-10";
        innerContent = (
          <>
            {day.d}
            <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-white rotate-180 mix-blend-overlay opacity-30"></div>
          </>
        );
      }
    }

    return (
      <div
        key={i}
        onClick={() => handleDayClick(day)}
        className={`flex items-center justify-center py-[7px] text-[13px] font-semibold cursor-pointer ${bgClasses}`}
      >
        {innerContent}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] z-50 flex flex-col md:flex-row overflow-hidden max-w-[90vw]"
      >
        {/* Left Sidebar Preset Ranges */}
        <div className="w-56 border-r border-slate-100 bg-white py-2 shrink-0 flex flex-col">
          {presets.map((preset) => (
            <div
              key={preset}
              className="px-6 py-[14px] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => {
                onSelectRange(preset);
                onClose();
              }}
            >
              <span className="text-[14.5px] text-slate-600">{preset}</span>
              {selectedRange === preset && <Check size={18} className="text-blue-500" strokeWidth={2.5} />}
            </div>
          ))}
        </div>

        {/* Right Main Calendar Area */}
        <div className="flex-1 flex flex-col w-[640px] bg-white">
          <div className="flex px-5 pt-5 pb-1 gap-8">
            {/* Left Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
                <span className="text-[15px] font-bold text-slate-700">{leftMonthName}</span>
                <div className="w-6"></div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-4 px-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[13px] font-semibold text-slate-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 gap-x-0 outline-none select-none px-1">
                {leftDays.map((day, i) => renderDay(day, i))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] bg-slate-100 self-stretch my-2"></div>

            {/* Right Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <div className="w-6"></div>
                <span className="text-[15px] font-bold text-slate-700">{rightMonthName}</span>
                <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"><ChevronRight size={20} /></button>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-4 px-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[13px] font-semibold text-slate-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 gap-x-0 outline-none select-none px-1">
                {rightDays.map((day, i) => renderDay(day, i))}
              </div>
            </div>
          </div>

          {/* Footer Dates */}
          <div className="border-t border-slate-100 p-5 flex items-center justify-center gap-6 mt-auto">
            <div className="px-5 py-2.5 border border-slate-200 rounded-lg text-[15.5px] tracking-wide text-slate-700 bg-white min-w-[150px] text-center shadow-sm">
              {formatDate(selectionStart)}
            </div>
            <span className="text-slate-500 font-bold text-lg">→</span>
            <div className="px-5 py-2.5 border border-slate-200 rounded-lg text-[15.5px] tracking-wide text-slate-700 bg-white min-w-[150px] text-center shadow-sm">
              {formatDate(selectionEnd)}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SidebarItem = ({ icon: Icon, label, active = false, badge, hasDropdown = false, isCollapsed = false }: any) => (
  <div
    className={`flex items-center ${isCollapsed ? 'justify-center mx-2' : 'justify-between px-4'} py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-violet-100/50 text-violet-700 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium'}`}
    title={isCollapsed ? label : undefined}
  >
    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
      <Icon size={20} className={active ? 'text-violet-600' : 'text-slate-400'} />
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </div>
    {!isCollapsed && badge && (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
        {badge}
      </span>
    )}
    {!isCollapsed && hasDropdown && (
      <Plus size={16} className="text-slate-400" />
    )}
  </div>
);

const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-[#f5f5f5] flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
          <Icon size={20} />
        </div>
        <span className="text-sm font-semibold text-slate-500">{title}</span>
      </div>
    </div>
    <div className="flex items-end gap-3">
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 mb-1 ${isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        }`}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
    <p className="text-xs text-slate-400 mt-2">{isPositive ? 'Increase' : 'Decrease'} from Last Month</p>
  </div>
);

const BarChartMockup = () => {
  const [activeBar, setActiveBar] = React.useState<string | null>('Jun');
  const data = [
    { month: 'Jan', tracked: 40, manual: 10 },
    { month: 'Feb', tracked: 20, manual: 8 },
    { month: 'Mar', tracked: 60, manual: 15 },
    { month: 'Apr', tracked: 35, manual: 5 },
    { month: 'May', tracked: 25, manual: 12 },
    { month: 'Jun', tracked: 70, manual: 20 },
    { month: 'Jul', tracked: 50, manual: 10 },
    { month: 'Aug', tracked: 30, manual: 15 },
    { month: 'Sep', tracked: 45, manual: 8 },
    { month: 'Oct', tracked: 80, manual: 25 },
    { month: 'Nov', tracked: 55, manual: 18 },
    { month: 'Dec', tracked: 35, manual: 10 },
  ];

  return (
    <div className="flex items-end justify-between h-56 mt-8 px-2" onMouseLeave={() => setActiveBar('Jun')}>
      {data.map((item, i) => {
        const isActive = activeBar === item.month;
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-2 relative h-full pt-6 cursor-pointer"
            onMouseEnter={() => setActiveBar(item.month)}
          >
            {/* Tooltip mockup for active bar */}
            <div className={`absolute top-0 bg-white p-2 rounded-lg shadow-lg border border-slate-100 text-xs z-20 w-24 transition-all duration-200 transform pointer-events-none ${isActive ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'}`}>
              <p className="text-slate-400 mb-1">Working</p>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-violet-600"></div> Tracked: {item.tracked}</div>
              <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 rounded-sm bg-violet-200"></div> Manual: {item.manual}</div>
            </div>
            <div className={`w-8 flex flex-col justify-end rounded-t-sm rounded-b-md overflow-hidden relative flex-1 transition-colors ${isActive ? 'bg-slate-100 shadow-md' : 'bg-slate-50'}`}>
              <motion.div
                className="w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#d8b4fe_2px,#d8b4fe_4px)] transition-all"
                style={{ opacity: 0.6 }}
                initial={{ height: 0 }}
                animate={{ height: `${item.manual}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
              ></motion.div>
              <motion.div
                className={`w-full rounded-b-md transition-all ${isActive ? 'bg-violet-500 ring-2 ring-violet-300 ring-offset-2' : 'bg-violet-600'}`}
                initial={{ height: 0 }}
                animate={{ height: `${item.tracked}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
              >
                <div className={`w-2 h-2 bg-white rounded-full mx-auto mt-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
              </motion.div>
            </div>
            <span className={`text-xs font-semibold transition-colors ${isActive ? 'text-violet-600' : 'text-slate-400'}`}>{item.month}</span>
          </div>
        );
      })}
    </div>
  );
};

const DonutChartMockup = () => {
  const [activeSegment, setActiveSegment] = React.useState<string | null>(null);

  return (
    <div className="relative w-48 h-48 mx-auto my-8 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
        {/* 20% Late (Gray) */}
        <g transform="rotate(0 50 50)">
          <motion.circle
            onMouseEnter={() => setActiveSegment('late')}
            onMouseLeave={() => setActiveSegment(null)}
            cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0"
            initial={{ pathLength: 0, strokeWidth: 16 }}
            animate={{ pathLength: 0.185, strokeWidth: activeSegment === 'late' ? 22 : 16 }}
            transition={{ duration: activeSegment ? 0.2 : 1.5, ease: "easeOut" }}
            className="cursor-pointer"
            style={{ strokeLinecap: 'butt' }}
          />
        </g>
        {/* 10% Pending (Light Purple) */}
        <g transform="rotate(72 50 50)">
          <motion.circle
            onMouseEnter={() => setActiveSegment('pending')}
            onMouseLeave={() => setActiveSegment(null)}
            cx="50" cy="50" r="40" fill="transparent" stroke="#A78BFA"
            initial={{ pathLength: 0, strokeWidth: 16 }}
            animate={{ pathLength: 0.085, strokeWidth: activeSegment === 'pending' ? 22 : 16 }}
            transition={{ duration: activeSegment ? 0.2 : 1.5, ease: "easeOut" }}
            className="cursor-pointer"
            style={{ strokeLinecap: 'butt' }}
          />
        </g>
        {/* 70% Done (Dark Purple) */}
        <g transform="rotate(108 50 50)">
          <motion.circle
            onMouseEnter={() => setActiveSegment('done')}
            onMouseLeave={() => setActiveSegment(null)}
            cx="50" cy="50" r="40" fill="transparent" stroke="#7C3AED"
            initial={{ pathLength: 0, strokeWidth: 16 }}
            animate={{ pathLength: 0.685, strokeWidth: activeSegment === 'done' ? 22 : 16 }}
            transition={{ duration: activeSegment ? 0.2 : 1.5, ease: "easeOut" }}
            className="cursor-pointer"
            style={{ strokeLinecap: 'butt' }}
          />
        </g>
      </svg>
      <div className="absolute text-center pointer-events-none">
        <h2 className="text-3xl font-bold text-slate-800 transition-all duration-300">
          {activeSegment === 'late' ? '20%' : activeSegment === 'pending' ? '10%' : activeSegment === 'done' ? '70%' : '70%'}
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1 transition-all duration-300">
          {activeSegment === 'late' ? 'Late' : activeSegment === 'pending' ? 'Pending' : 'Completed'}
        </p>
      </div>
    </div>
  );
};

const LineChartMockup = () => {
  const [hoverPos, setHoverPos] = React.useState<{ x: number, y: number, width: number } | null>(null);

  const mockData = [
    { booked: 12, available: 5 }, { booked: 14, available: 8 }, { booked: 16, available: 15 },
    { booked: 15, available: 25 }, { booked: 14, available: 32 }, { booked: 18, available: 35 },
    { booked: 24, available: 30 }, { booked: 28, available: 20 }, { booked: 26, available: 12 },
    { booked: 20, available: 8 }, { booked: 15, available: 5 }, { booked: 16, available: 7 },
    { booked: 20, available: 12 }, { booked: 25, available: 18 }, { booked: 30, available: 25 },
    { booked: 32, available: 32 }, { booked: 28, available: 38 }, { booked: 24, available: 35 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width
    });
  };

  const activeIndex = hoverPos ? Math.min(17, Math.max(0, Math.floor((hoverPos.x / hoverPos.width) * 18))) : 0;
  const currentData = mockData[activeIndex];

  return (
    <div
      className="relative h-40 mt-6 px-4 group cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPos(null)}
    >
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
        {/* Grid lines */}
        <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="2" />
        <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="2" />
        <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="2" />

        {/* Booked Hours (Orange) */}
        <motion.path whileHover={{ strokeWidth: 5 }} d="M0,150 C100,100 200,180 300,140 C400,100 500,40 600,100 C700,160 800,40 900,50 C950,55 1000,80 1000,80" fill="none" stroke="#F97316" strokeWidth="3" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} className="transition-all" />

        {/* Available (Purple) */}
        <motion.path whileHover={{ strokeWidth: 5 }} d="M0,180 C100,160 200,90 300,60 C400,30 500,130 600,150 C700,170 800,120 900,100 C950,90 1000,110 1000,110" fill="none" stroke="#7C3AED" strokeWidth="3" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }} className="transition-all" />
      </svg>

      {/* Tooltip Tracking */}
      {hoverPos && (
        <>
          <div
            className="absolute top-0 bottom-6 border-l-2 border-slate-300 border-dashed pointer-events-none"
            style={{ left: hoverPos.x }}
          ></div>
          <div
            className="absolute bg-white p-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 text-xs w-36 pointer-events-none z-20 transition-transform"
            style={{
              left: hoverPos.x + 160 > hoverPos.width ? hoverPos.x - 160 : hoverPos.x + 15,
              top: Math.max(hoverPos.y - 60, 0)
            }}
          >
            <p className="text-slate-400 mb-2 font-medium">Nov {activeIndex + 11}, 2024</p>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-orange-500"></div> Booked Hours :</div>
              <span className="font-bold text-slate-700">{currentData.booked}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-violet-600"></div> Available :</div>
              <span className="font-bold text-slate-700">{currentData.available}</span>
            </div>
          </div>
        </>
      )}

      {/* X-axis labels */}
      <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-slate-400 font-semibold px-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [isDateMenuOpen, setIsDateMenuOpen] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = React.useState("Last 7 days");

  return (
    <Layout>

      <div className="w-full">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              >
                <CalendarIcon size={16} /> {selectedDateRange} <ChevronDown size={14} className={`ml-1 transition-transform ${isDateMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <CustomDateRangePicker
                isOpen={isDateMenuOpen}
                onClose={() => setIsDateMenuOpen(false)}
                selectedRange={selectedDateRange}
                onSelectRange={setSelectedDateRange}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard icon={PieChart} title="Projects" value="850" change="10%" isPositive={true} />
          <StatCard icon={CheckSquare} title="Tasks" value="100" change="5%" isPositive={false} />
          <StatCard icon={Users} title="Resources" value="850" change="5%" isPositive={true} />
          <StatCard icon={Clock} title="Time Spent" value="752" change="10%" isPositive={false} />
        </div>

        {/* Main Grid Area */}
        <div className="flex flex-col gap-4 w-full">

          {/* Top Row: Working Hours & Overall Progress */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Working Hours */}
            <div className="xl:col-span-2 bg-white p-6 rounded-3xl border border-[#f5f5f5] flex flex-col h-full z-10">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800">Working Hours</h2>
                  <HelpCircle size={14} className="text-slate-300" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-100">
                    This Year <ChevronDown size={14} />
                  </button>
                  <button className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-100">
                    All Project <ChevronDown size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-violet-600"></div> Tracked
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-200"></div> Manual
                </div>
              </div>

              <div className="flex-1 min-h-[220px]">
                <BarChartMockup />
              </div>
            </div>

            {/* Overall Progress Donut */}
            <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-[#f5f5f5] h-full flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800">Overall Progress</h2>
                  <HelpCircle size={14} className="text-slate-300" />
                </div>
                <button className="px-3 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-50">
                  See All <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <DonutChartMockup />
              </div>

              <div className="flex items-center justify-around mt-8 border-t border-slate-100 pt-6 px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-600"></div>
                  <span className="text-sm font-semibold text-slate-600">8 Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-400"></div>
                  <span className="text-sm font-semibold text-slate-600">4 Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="text-sm font-semibold text-slate-600">3 Late</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Project Summary & Workload Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* Project Summary Table */}
            <div className="bg-white p-6 rounded-3xl border border-[#f5f5f5] flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800">Project Summary</h2>
                  <HelpCircle size={14} className="text-slate-300" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-100">Project <ChevronDown size={12} /></button>
                  <button className="px-2 py-1 bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-100">Status <ChevronDown size={12} /></button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left" style={{ borderSpacing: '0 8px', borderCollapse: 'separate' }}>
                  <thead>
                    <tr className="text-xs font-bold text-slate-800 bg-[#f5f5f5]">
                      <th className="py-3 px-4 rounded-l-xl">Project Name</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 rounded-r-xl text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-slate-500">
                    <tr className="bg-[#f5f5f5]/50">
                      <td className="py-3 px-4 rounded-l-xl w-1/2">BoostApp Social Revamp</td>
                      <td className="py-3 px-4 w-1/4">Nov 07, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl w-1/4 text-center">
                        <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] rounded-lg font-bold w-full">Completed</span>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 rounded-l-xl">Brainbubble Research</td>
                      <td className="py-3 px-4">Nov 23, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl text-center">
                        <span className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] rounded-lg font-bold w-full">In Progress</span>
                      </td>
                    </tr>
                    <tr className="bg-[#f5f5f5]/50">
                      <td className="py-3 px-4 rounded-l-xl">EcoLeadpunt Website</td>
                      <td className="py-3 px-4">Nov 12, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl text-center">
                        <span className="inline-block px-3 py-1.5 bg-orange-50 text-orange-600 text-[11px] rounded-lg font-bold w-full">Delayed</span>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 rounded-l-xl">Drip Page A/B Test</td>
                      <td className="py-3 px-4">Nov 24, 2024</td>
                      <td className="py-3 px-4 rounded-r-xl text-center">
                        <span className="inline-block px-3 py-1.5 bg-rose-50 text-rose-600 text-[11px] rounded-lg font-bold w-full">At Risk</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workload Summary Line Chart */}
            <div className="bg-white p-6 rounded-3xl border border-[#f5f5f5] flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800">Workload Summary</h2>
                  <HelpCircle size={14} className="text-slate-300" />
                </div>
                <button className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-100">
                  This Month <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-2 px-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-violet-600"></div> Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-orange-500"></div> Booked Hours
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end min-h-[160px]">
                <LineChartMockup />
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

