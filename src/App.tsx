import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TranslationsPage from "./components/TranslationsPage";
import LoginPage from "./components/LoginPage";
import "./App.css";

type SystemLang = "ru" | "kz";
type ContentLang = "ru" | "kz";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [systemLang, setSystemLang] = useState<SystemLang>("ru");
  const [contentLang, setContentLang] = useState<ContentLang>("ru");
  const setPage = useCallback((page: string) => {
  setCurrentPage(page);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard systemLang={systemLang} />;
      case "translations":
        return <TranslationsPage contentLang={contentLang} systemLang={systemLang} />;
      default:
        return <Dashboard systemLang={systemLang} />;
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh",
        fontSize: "18px",
        color: "#64748b"
      }}>
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  return (
  <div className="admin-container app-init-ready">
    <Sidebar 
      currentPage={currentPage} 
      setCurrentPage={setPage}
      systemLang={systemLang}
    />
    <div className="main-content">
      <Header 
        systemLang={systemLang} 
        setSystemLang={setSystemLang}
        contentLang={contentLang}
        setContentLang={setContentLang}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  </div>
);

}

export default App;