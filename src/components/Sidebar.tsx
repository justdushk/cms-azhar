const translations = {
  ru: {
    adminPanel: "Админ-панель",
    translations: "Переводы",
    menu: "Меню",
    sections: "Секции",
    pages: "Страницы",
  },
  kz: {
    adminPanel: "Админ-панель",
    translations: "Аудармалар",
    menu: "Мәзір",
    sections: "Секциялар",
    pages: "Беттер",
  },
};

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  systemLang: "ru" | "kz";
}

export default function Sidebar({ currentPage, setCurrentPage, systemLang }: SidebarProps) {
  const t = translations[systemLang];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{t.adminPanel}</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentPage === "translations" ? "active" : ""}`}
          onClick={() => setCurrentPage("translations")}
        >
          🌐 {t.translations}
        </button>
        <button
          className={`nav-item ${currentPage === "menu" ? "active" : ""}`}
          onClick={() => setCurrentPage("menu")}
        >
          📝 {t.menu}
        </button>
        <button
          className={`nav-item ${currentPage === "sections" ? "active" : ""}`}
          onClick={() => setCurrentPage("sections")}
        >
          📄 {t.sections}
        </button>
        <button
          className={`nav-item ${currentPage === "pages" ? "active" : ""}`}
          onClick={() => setCurrentPage("pages")}
        >
          📑 {t.pages}
        </button>
      </nav>
    </aside>
  );
}