
import React, { useState, useMemo } from 'react';
import { BusinessData, DashboardReport } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, Line, Cell
} from 'recharts';

interface DashboardProps {
  data: BusinessData;
  report: DashboardReport;
}

const Dashboard: React.FC<DashboardProps> = ({ data, report }) => {
  // Simulator State
  const [simRevenue, setSimRevenue] = useState(data.grossRevenue);
  const [simMargin, setSimMargin] = useState(data.netMargin);
  const [simNRR, setSimNRR] = useState(data.nrr);
  const [simCAC, setSimCAC] = useState(data.cac);

  const simImpact = useMemo(() => {
    const baselineNet = (data.grossRevenue * (data.netMargin / 100));
    const simulatedNet = (simRevenue * (simMargin / 100));
    const diff = simulatedNet - baselineNet;
    return {
      netProfit: simulatedNet,
      diff,
      roi: (diff / baselineNet) * 100
    };
  }, [simRevenue, simMargin, data]);

  const handleDownloadCSV = () => {
    const rows = [
      ["Category", "Key", "Value"],
      ["Context", "Industry", data.industry],
      ["Context", "Problem", data.problemStatement.replace(/,/g, ' ')],
      ["KPI", "Revenue", data.grossRevenue],
      ["KPI", "Net Margin", data.netMargin],
      ["KPI", "NRR", data.nrr],
      ["KPI", "CAC", data.cac],
      ...data.painPoints.map(p => ["Pain Point", p.issue.replace(/,/g, ' '), p.perceivedImpact]),
      ...report.benchmarks.map(b => ["Benchmark", b.metric, b.industryMedian]),
      ...report.rootCauses.map(r => ["Root Cause", r.cause.replace(/,/g, ' '), r.impactWeight])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `insightstream_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Executive Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Problem Analysis Dashboard</h2>
            <p className="text-slate-500 font-medium">Industry: {data.industry}</p>
          </div>
          <button 
            onClick={handleDownloadCSV}
            className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-sm font-semibold"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export to CSV
          </button>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <div className="bg-slate-50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
            <h4 className="text-indigo-900 font-bold mb-2 uppercase text-xs tracking-widest">Executive Summary</h4>
            <p className="text-slate-700 leading-relaxed text-lg italic">"{report.executiveSummary}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Benchmarking */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Market Benchmark Positioning</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.benchmarks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar name="Your Performance" dataKey="userValue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar name="Industry Median" dataKey="industryMedian" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {report.benchmarks.map((b, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">{b.metric}</p>
                <p className={`text-lg font-bold ${b.percentile >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {b.percentile}th Percentile
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pareto Root Cause */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Root Cause Exploration</h3>
          <p className="text-slate-500 text-sm mb-6">Pareto 80/20 weighted impact analysis.</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={report.rootCauses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="cause" tick={false} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" unit="%" />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Bar yAxisId="left" dataKey="impactWeight" radius={[4, 4, 0, 0]}>
                  {report.rootCauses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isParetoCritical ? '#4f46e5' : '#cbd5e1'} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="impactWeight" stroke="#f43f5e" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {report.rootCauses.filter(r => r.isParetoCritical).map((r, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                <span className="font-semibold text-slate-700">Critical: {r.cause}</span>
                <span className="text-slate-400">({r.impactWeight}% impact weight)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Simulator */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Impact Scenario Simulator</h3>
            <p className="text-slate-500">Test assumptions on potential recovery strategies.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wider">Estimated Profit Change</p>
            <h4 className={`text-3xl font-black ${simImpact.diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {simImpact.diff >= 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(simImpact.diff)}
            </h4>
            <p className="text-xs font-bold text-slate-500">({simImpact.roi.toFixed(1)}% variance)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Projected Gross Revenue</label>
                <span className="text-indigo-600 font-bold">${simRevenue.toLocaleString()}</span>
              </div>
              <input 
                type="range" min={data.grossRevenue * 0.5} max={data.grossRevenue * 2} step={10000}
                value={simRevenue} onChange={(e) => setSimRevenue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Projected Net Margin</label>
                <span className="text-indigo-600 font-bold">{simMargin}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="1"
                value={simMargin} onChange={(e) => setSimMargin(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Target NRR</label>
                <span className="text-indigo-600 font-bold">{simNRR}%</span>
              </div>
              <input 
                type="range" min="50" max="150" step="1"
                value={simNRR} onChange={(e) => setSimNRR(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Optimized CAC</label>
                <span className="text-indigo-600 font-bold">${simCAC.toLocaleString()}</span>
              </div>
              <input 
                type="range" min={data.cac * 0.2} max={data.cac * 3} step={10}
                value={simCAC} onChange={(e) => setSimCAC(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Challenge - The "Why You Might Be Wrong" section */}
      <div className="bg-rose-50 p-8 rounded-2xl border-2 border-rose-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-rose-500 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-rose-900">Analyst's Challenge: Blind Spots</h3>
        </div>
        <div className="prose prose-rose max-w-none">
          <p className="text-rose-800 leading-relaxed whitespace-pre-wrap font-medium">
            {report.aiChallenge}
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => window.location.hash = '/'}
          className="text-slate-500 hover:text-indigo-600 font-medium transition flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Update Intake Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
