
import React, { useState } from 'react';
import { BusinessData, PainPoint } from '../types';
import { useNavigate } from 'react-router-dom';

interface IntakeFormProps {
  onSubmit: (data: BusinessData) => Promise<void>;
  isLoading: boolean;
  reportAvailable: boolean;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit, isLoading, reportAvailable }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessData>({
    industry: 'SaaS',
    problemStatement: '',
    grossRevenue: 1000000,
    netMargin: 15,
    nrr: 95,
    cac: 500,
    painPoints: [{ id: '1', issue: '', perceivedImpact: 50 }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'problemStatement' || name === 'industry' ? value : Number(value) }));
  };

  const handlePainPointChange = (index: number, field: keyof PainPoint, value: string | number) => {
    const updated = [...formData.painPoints];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, painPoints: updated }));
  };

  const addPainPoint = () => {
    setFormData(prev => ({
      ...prev,
      painPoints: [...prev.painPoints, { id: Date.now().toString(), issue: '', perceivedImpact: 50 }]
    }));
  };

  const removePainPoint = (id: string) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.filter(p => p.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 bg-indigo-600 text-white">
        <h2 className="text-2xl font-bold mb-2">Master Intake Form</h2>
        <p className="opacity-90">Share the context of your business challenge to generate a decision support dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Section 1: Context */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">1. Business Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
              <select 
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>SaaS</option>
                <option>E-commerce</option>
                <option>Manufacturing</option>
                <option>Fintech</option>
                <option>Healthcare</option>
                <option>Logistics</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Describe the Core Problem</label>
            <textarea
              name="problemStatement"
              required
              rows={4}
              value={formData.problemStatement}
              onChange={handleChange}
              placeholder="e.g., We've noticed a significant drop in customer retention specifically in our mid-market segment over the last two quarters..."
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 2: Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">2. Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Gross Revenue ($)</label>
              <input 
                type="number" name="grossRevenue" value={formData.grossRevenue} onChange={handleChange}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Net Margin (%)</label>
              <input 
                type="number" name="netMargin" value={formData.netMargin} onChange={handleChange}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NRR (Net Revenue Retention) (%)</label>
              <input 
                type="number" name="nrr" value={formData.nrr} onChange={handleChange}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CAC (Customer Acquisition Cost) ($)</label>
              <input 
                type="number" name="cac" value={formData.cac} onChange={handleChange}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pain Points */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-slate-800">3. Specific Pain Points</h3>
            <button 
              type="button" onClick={addPainPoint}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center"
            >
              <span className="mr-1 text-lg">+</span> Add Issue
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-4">List the issues you believe are contributing to the problem. We'll use the Pareto rule to analyze these.</p>
          
          <div className="space-y-4">
            {formData.painPoints.map((pp, idx) => (
              <div key={pp.id} className="flex flex-col md:flex-row gap-4 items-start bg-slate-50 p-4 rounded-xl relative group">
                <div className="flex-grow w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pain Point / Assumption</label>
                  <input
                    type="text"
                    required
                    value={pp.issue}
                    onChange={(e) => handlePainPointChange(idx, 'issue', e.target.value)}
                    placeholder="e.g., Support response times are too slow"
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Impact (1-100)</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={pp.perceivedImpact}
                    onChange={(e) => handlePainPointChange(idx, 'perceivedImpact', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="text-right text-xs font-medium text-slate-600 mt-1">{pp.perceivedImpact}% impact</div>
                </div>
                {formData.painPoints.length > 1 && (
                  <button 
                    type="button" onClick={() => removePainPoint(pp.id)}
                    className="md:mt-6 text-slate-300 hover:text-red-500 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t flex items-center justify-between">
          <p className="text-xs text-slate-400 italic">Complete all fields for accurate benchmarking.</p>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing...
              </span>
            ) : 'Generate Dashboard Report'}
          </button>
        </div>
      </form>
      
      {reportAvailable && !isLoading && (
        <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-indigo-700 font-semibold hover:underline"
          >
            &larr; View your previously generated report
          </button>
        </div>
      )}
    </div>
  );
};

export default IntakeForm;
