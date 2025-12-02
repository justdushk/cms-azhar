import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TranslationsPage from "./components/TranslationsPage";
import "./App.css";

type SystemLang = "ru" | "kz";
type ContentLang = "ru" | "kz";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [systemLang, setSystemLang] = useState<SystemLang>("ru");
  const [contentLang, setContentLang] = useState<ContentLang>("ru");

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

  return (
    <div className="admin-container">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        systemLang={systemLang}
      />
      <div className="main-content">
        <Header 
          systemLang={systemLang} 
          setSystemLang={setSystemLang}
          contentLang={contentLang}
          setContentLang={setContentLang}
        />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;