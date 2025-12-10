import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TranslationsPage from "./components/TranslationsPage";
import MenuManager from "./components/MenuManager";
import SectionsManager from "./components/SectionsManager";
import PagesManager from "./components/PagesManager";
import LoginPage from "./components/LoginPage";
import "./App.css";

type SystemLang = "ru" | "kz";
type ContentLang = "ru" | "kz";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState("translations");
  const [systemLang, setSystemLang] = useState<SystemLang>("ru");
  const [contentLang, setContentLang] = useState<ContentLang>("ru");
  const [totalKeys, setTotalKeys] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isDataLoaded) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setIsLoading(false);
  };

  const loadInitialData = async () => {
    const { data } = await supabase.from("translations").select("*");
    setTotalKeys(data?.length || 0);
    setTimeout(() => {
      setIsDataLoaded(true);
    }, 100);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsDataLoaded(false);
    setTotalKeys(0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "translations":
        return <TranslationsPage contentLang={contentLang} systemLang={systemLang} onDataLoad={setTotalKeys} />;
      case "menu":
        return <MenuManager systemLang={systemLang} contentLang={contentLang} />;
      case "sections":
        return <SectionsManager systemLang={systemLang} contentLang={contentLang} />;
      case "pages":
        return <PagesManager systemLang={systemLang} contentLang={contentLang} />;
      default:
        return <TranslationsPage contentLang={contentLang} systemLang={systemLang} onDataLoad={setTotalKeys} />;
    }
  };

  if (isLoading || (isAuthenticated && !isDataLoaded)) {
    return <div style={{ background: "white", width: "100vw", height: "100vh" }} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="admin-container app-init-ready">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        systemLang={systemLang}
      />
      <div className="main-content-full">
        <Header
          systemLang={systemLang}
          setSystemLang={setSystemLang}
          contentLang={contentLang}
          setContentLang={setContentLang}
          onLogout={handleLogout}
          totalKeys={totalKeys}
        />
        {renderPage()}
      </div>
    </div>
  );
}
export default App;