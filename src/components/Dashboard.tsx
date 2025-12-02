import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const translations = {
  ru: {
    dashboard: "Панель управления",
    statistics: "Статистика",
    totalKeys: "Всего ключей",
  },
  kz: {
    dashboard: "Басқару панелі",
    statistics: "Статистика",
    totalKeys: "Барлығы кілттер",
  },
};

interface DashboardProps {
  systemLang: "ru" | "kz";
}

export default function Dashboard({ systemLang }: DashboardProps) {
  const t = translations[systemLang];
  const [stats, setStats] = useState({
    totalKeys: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await supabase.from("translations").select("*");
    setStats({
      totalKeys: data?.length || 0,
    });
  };

  return (
    <div className="dashboard">
      <h2>{t.dashboard}</h2>
      <p className="subtitle">{t.statistics}</p>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <p className="stat-label">{t.totalKeys}</p>
            <h3 className="stat-value">{stats.totalKeys}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}