const translations = {
  ru: {
    adminPanel: "Админ Панель",
    translations: "🌐 Переводы",
    menu: "📝 Управление меню",
  },
  kz: {
    adminPanel: "Админ Панелі",
    translations: "🌐 Аудармалар",
    menu: "📝 Мәзір басқару",
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
          className={currentPage === "translations" ? "nav-item active" : "nav-item"}
          onClick={() => setCurrentPage("translations")}
        >
          {t.translations}
        </button>
        <button
          className={currentPage === "menu" ? "nav-item active" : "nav-item"}
          onClick={() => setCurrentPage("menu")}
        >
          {t.menu}
        </button>
      </nav>
    </aside>
  );
}

export default memo(Sidebar);