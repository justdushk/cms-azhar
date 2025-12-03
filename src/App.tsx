import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Header from "./components/Header";
import TranslationsPage from "./components/TranslationsPage";
import LoginPage from "./components/LoginPage";
import "./App.css";

type SystemLang = "ru" | "kz";
type ContentLang = "ru" | "kz";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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

  if (isLoading || (isAuthenticated && !isDataLoaded)) {
    return <div style={{ background: "white", width: "100vw", height: "100vh" }} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  return (
    <div className="admin-container app-init-ready">
      <div className="main-content-full">
        <Header 
          systemLang={systemLang} 
          setSystemLang={setSystemLang}
          contentLang={contentLang}
          setContentLang={setContentLang}
          onLogout={handleLogout}
          totalKeys={totalKeys}
        />
        <TranslationsPage 
          contentLang={contentLang} 
          systemLang={systemLang} 
          onDataLoad={setTotalKeys} 
        />
      </div>
    </div>
  );
}

export default App;