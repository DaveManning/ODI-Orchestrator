
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            I
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">InsightStream</h1>
        </div>
        
        <nav className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <button onClick={() => navigate('/')} className="text-slate-600 hover:text-indigo-600 transition">Intake Form</button>
            <button onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-indigo-600 transition">Latest Report</button>
          </div>
          
          <div className="relative">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Premium Analyst</p>
                </div>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:border-indigo-300 transition"
                >
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    <button 
                      onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Vault (History)
                    </button>
                    <button 
                      onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Settings
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={() => { logout(); setShowDropdown(false); navigate('/auth'); }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
