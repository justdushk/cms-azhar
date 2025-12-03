const translations = {
  ru: {
    adminPanel: "Панель управления",
    systemLang: "Язык системы",
    contentLang: "Язык контента",
    logout: "Выход",
  },
  kz: {
    adminPanel: "Басқару панелі",
    systemLang: "Жүйе тілі",
    contentLang: "Мазмұн тілі",
    logout: "Шығу",
  },
};

interface HeaderProps {
  systemLang: "ru" | "kz";
  setSystemLang: (lang: "ru" | "kz") => void;
  contentLang: "ru" | "kz";
  setContentLang: (lang: "ru" | "kz") => void;
  onLogout: () => void;
}

export default function Header({ 
  systemLang, 
  setSystemLang, 
  contentLang, 
  setContentLang,
  onLogout 
}: HeaderProps) {
  const t = translations[systemLang];

  return (
    <header className="admin-header">
      <h1>{t.adminPanel}</h1>
      <div className="header-actions">
        <div className="lang-switcher-container">
          <span className="lang-label">{t.systemLang}</span>
          <div className="lang-switcher">
            <button
              className={systemLang === "ru" ? "lang-btn active" : "lang-btn"}
              onClick={() => setSystemLang("ru")}
            >
              RUS
            </button>
            <button
              className={systemLang === "kz" ? "lang-btn active" : "lang-btn"}
              onClick={() => setSystemLang("kz")}
            >
              QAZ
            </button>
          </div>
        </div>
        
        <div className="content-lang-switcher-container">
          <span className="lang-label">{t.contentLang}</span>
          <div className="content-lang-switcher">
            <button
              className={contentLang === "ru" ? "content-lang-btn active" : "content-lang-btn"}
              onClick={() => setContentLang("ru")}
            >
              RUS
            </button>
            <button
              className={contentLang === "kz" ? "content-lang-btn active" : "content-lang-btn"}
              onClick={() => setContentLang("kz")}
            >
              QAZ
            </button>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>{t.logout}</button>
      </div>
    </header>
  );
}