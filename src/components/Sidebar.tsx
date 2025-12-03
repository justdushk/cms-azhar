const translations = {
  ru: {
    adminPanel: "Админ Панель",
    dashboard: "📊 Панель управления",
    translations: "🌐 Переводы",
  },
  kz: {
    adminPanel: "Админ Панелі",
    dashboard: "📊 Басқару панелі",
    translations: "🌐 Аудармалар",
  },
};

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  systemLang: "ru" | "kz";
}

import { memo } from "react";

function Sidebar({ currentPage, setCurrentPage, systemLang }: SidebarProps) {
  const t = translations[systemLang];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{t.adminPanel}</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={currentPage === "dashboard" ? "nav-item active" : "nav-item"}
          onClick={() => setCurrentPage("dashboard")}
        >
          {t.dashboard}
        </button>
        <button
          className={currentPage === "translations" ? "nav-item active" : "nav-item"}
          onClick={() => setCurrentPage("translations")}
        >
          {t.translations}
        </button>
      </nav>
    </aside>
  );
}

export default memo(Sidebar);
