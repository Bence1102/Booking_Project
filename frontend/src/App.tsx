import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Layout/Navbar";
import AuthCard from "./components/auth/AuthCard";
import DashboardView from "./components/views/DashboardView";
import AccountView from "./components/views/AccountView";
import FavoritesView from "./components/views/FavoritesView";

function MainContent() {
  const { token } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full">
        {!token ? (
          <AuthCard />
        ) : currentView === "account" ? (
          <AccountView />
        ) : currentView === "favorites" ? (
          <FavoritesView />
        ) : (
          <DashboardView />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainContent />
      </LanguageProvider>
    </AuthProvider>
  );
}