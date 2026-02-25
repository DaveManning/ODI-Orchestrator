
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import IntakeForm from './components/IntakeForm';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BusinessData, DashboardReport } from './types';
import { analyzeBusinessProblem } from './services/geminiService';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

// Use plain function declaration instead of React.FC to avoid issues with required children
const MainApp = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { saveReport } = useAuth();

  const handleFormSubmit = async (data: BusinessData) => {
    setLoading(true);
    setBusinessData(data);
    try {
      const result = await analyzeBusinessProblem(data);
      setReport(result);
      saveReport(data, result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Something went wrong with the AI analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadReport = (data: BusinessData, report: DashboardReport) => {
    setBusinessData(data);
    setReport(report);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/" 
            element={
              <IntakeForm 
                onSubmit={handleFormSubmit} 
                isLoading={loading} 
                reportAvailable={!!report}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              report && businessData ? (
                <Dashboard data={businessData} report={report} />
              ) : (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-semibold mb-4 text-slate-700">No data available</h2>
                  <p className="text-slate-400 mb-8">Please fill out the intake form first to see insights.</p>
                  <button 
                    onClick={() => window.location.hash = '/'} 
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
                  >
                    Go to Intake Form
                  </button>
                </div>
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile onLoadReport={handleLoadReport} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <footer className="bg-white border-t py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} InsightStream Pro. Data Analysts' Decision Support.
      </footer>
    </div>
  );
};

// Use plain function declaration instead of React.FC to avoid issues with required children
const App = () => (
  <HashRouter>
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  </HashRouter>
);

export default App;
