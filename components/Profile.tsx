
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BusinessData, DashboardReport } from '../types';

interface ProfileProps {
  onLoadReport: (data: BusinessData, report: DashboardReport) => void;
}

const Profile: React.FC<ProfileProps> = ({ onLoadReport }) => {
  const { user, logout, deleteReport } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleViewReport = (data: BusinessData, report: DashboardReport) => {
    onLoadReport(data, report);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* User Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-sm"
        />
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 font-medium">{user.email}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-4 py-2 bg-indigo-50 rounded-lg">
              <span className="text-xs font-bold text-indigo-400 uppercase block">Reports Generated</span>
              <span className="text-lg font-bold text-indigo-700">{user.reportHistory.length}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { logout(); navigate('/auth'); }}
          className="px-6 py-2 border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition"
        >
          Logout
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Past Analysis History</h3>
        </div>
        
        {user.reportHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-lg italic">No reports generated yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Start your first analysis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Problem Context</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {user.reportHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700 truncate max-w-xs">{item.data.problemStatement}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 uppercase">
                        {item.data.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewReport(item.data, item.report)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      <button 
                        onClick={() => deleteReport(item.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
