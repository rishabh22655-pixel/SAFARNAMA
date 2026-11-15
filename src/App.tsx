import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PlannerPage } from './pages/PlannerPage';
import { TripsListPage } from './pages/TripsListPage';
import { TripDashboardPage } from './pages/TripDashboardPage';
import { JoinTripPage } from './pages/JoinTripPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0C0A09] text-[#EDE5DB]">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/trips" element={<TripsListPage />} />
            <Route path="/trips/:id" element={<TripDashboardPage />} />
            <Route path="/join/:inviteCode" element={<JoinTripPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
