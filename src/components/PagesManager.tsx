import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const translations = {
  ru: {
    pagesManagement: "Управление страницами",
    addPage: "+ Добавить страницу",
    editPage: "Редактировать страницу",
    slug: "URL (slug)",
    titleKey: "Ключ названия",
    isHome: "Главная страница",
    active: "Активна",
    backgroundColor: "Цвет фона",
    backgroundImage: "Фоновое изображение",
    order: "Порядок",
    save: "✓ Сохранить",
    cancel: "✕ Отмена",
    edit: "✏️",
    delete: "🗑️",
    manageSections: "Управлять секциями",
    pageSections: "Секции страницы",
    availableSections: "Доступные секции",
    addSection: "Добавить секцию",
    removeSection: "Убрать",
    moveUp: "↑",
    moveDown: "↓",
    titleRu: "Название (RU)",
    titleKz: "Название (KZ)",
  },
  kz: {
    pagesManagement: "Беттерді басқару",
    addPage: "+ Бет қосу",
    editPage: "Бетті өңдеу",
    slug: "URL (slug)",
    titleKey: "Атау кілті",
    isHome: "Басты бет",
    active: "Белсенді",
    backgroundColor: "Фон түсі",
    backgroundImage: "Фон суреті",
    order: "Реті",
    save: "✓ Сақтау",
    cancel: "✕ Болдырмау",
    edit: "✏️",
    delete: "🗑️",
    manageSections: "Секцияларды басқару",
    pageSections: "Бет секциялары",
    availableSections: "Қол жетімді секциялар",
    addSection: "Секция қосу",
    removeSection: "Алып тастау",
    moveUp: "↑",
    moveDown: "↓",
    titleRu: "Атауы (RU)",
    titleKz: "Атауы (KZ)",
  },
};

interface Page {
  id: string;
  slug: string;
  title_key: string;
  is_home: boolean;
  is_active: boolean;
  background_color: string;
  background_image: string | null;
  order_index: number;
}

interface PageSection {
  id: string;
  page_id: string;
  section_id: string;
  order_index: number;
  is_visible: boolean;
  section?: {
    id: string;
    section_key: string;
    section_type: string;
  };
}

interface Section {
  id: string;
  section_key: string;
  section_type: string;
}

interface PagesManagerProps {
  systemLang: "ru" | "kz";
  contentLang: "ru" | "kz";
}

export default function PagesManager({ systemLang, }: PagesManagerProps) {
  const t = translations[systemLang];
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [managingSectionsPageId, setManagingSectionsPageId] = useState<string | null>(null);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);

  const [editPageData, setEditPageData] = useState({
    slug: "",
    title_key: "",
    is_home: false,
    is_active: true,
    background_color: "#FFFFFF",
    background_image: "",
    order_index: 0,
    title_ru: "",
    title_kz: "",
  });

  useEffect(() => {
    loadPages();
    loadSections();
  }, []);

  const loadPages = async () => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("order_index");
    if (data) setPages(data);
  };

  const loadSections = async () => {
    const { data } = await supabase.from("sections").select("*").order("order_index");
    if (data) setSections(data);
  };

  const loadPageSections = async (pageId: string) => {
    const { data } = await supabase
      .from("page_sections")
      .select(`
        *,
        section:sections(id, section_key, section_type)
      `)
      .eq("page_id", pageId)
      .order("order_index");
    if (data) setPageSections(data as any);
  };

  const startAddPage = () => {
    const maxOrder = Math.max(...pages.map((p) => p.order_index), 0);
    setEditPageData({
      slug: "/new-page",
      title_key: `page.new.title`,
      is_home: false,
      is_active: true,
      background_color: "#FFFFFF",
      background_image: "",
      order_index: maxOrder + 1,
      title_ru: "",
      title_kz: "",
    });
    setIsAddingPage(true);
  };

  const addPage = async () => {
    // Создаём перевод
    const { error: transError } = await supabase.from("translations").insert({
      key: editPageData.title_key,
      value_ru: editPageData.title_ru,
      value_kz: editPageData.title_kz,
    });

    if (transError) {
      alert("Ошибка создания перевода: " + transError.message);
      return;
    }

    // Создаём страницу
    const { error: pageError } = await supabase.from("pages").insert({
      slug: editPageData.slug,
      title_key: editPageData.title_key,
      is_home: editPageData.is_home,
      is_active: editPageData.is_active,
      background_color: editPageData.background_color,
      background_image: editPageData.background_image || null,
      order_index: editPageData.order_index,
    });

    if (pageError) {
      alert("Ошибка создания страницы: " + pageError.message);
      return;
    }

    setIsAddingPage(false);
    loadPages();
  };

  const startEditPage = async (page: Page) => {
    // Загружаем перевод
    const { data } = await supabase
      .from("translations")
      .select("value_ru, value_kz")
      .eq("key", page.title_key)
      .single();

    setEditPageData({
      slug: page.slug,
      title_key: page.title_key,
      is_home: page.is_home,
      is_active: page.is_active,
      background_color: page.background_color,
      background_image: page.background_image || "",
      order_index: page.order_index,
      title_ru: data?.value_ru || "",
      title_kz: data?.value_kz || "",
    });
    setEditingPageId(page.id);
  };

  const savePage = async (id: string) => {
    // Обновляем перевод
    const { error: transError } = await supabase
      .from("translations")
      .update({
        value_ru: editPageData.title_ru,
        value_kz: editPageData.title_kz,
      })
      .eq("key", editPageData.title_key);

    if (transError) {
      alert("Ошибка обновления перевода: " + transError.message);
      return;
    }

    // Обновляем страницу
    const { error: pageError } = await supabase
      .from("pages")
      .update({
        slug: editPageData.slug,
        title_key: editPageData.title_key,
        is_home: editPageData.is_home,
        is_active: editPageData.is_active,
        background_color: editPageData.background_color,
        background_image: editPageData.background_image || null,
        order_index: editPageData.order_index,
      })
      .eq("id", id);

    if (pageError) {
      alert("Ошибка обновления страницы: " + pageError.message);
      return;
    }

    setEditingPageId(null);
    loadPages();
  };

  const deletePage = async (id: string, titleKey: string) => {
    if (!confirm("Удалить эту страницу?")) return;

    await supabase.from("pages").delete().eq("id", id);
    await supabase.from("translations").delete().eq("key", titleKey);
    loadPages();
  };

  const addSectionToPage = async (pageId: string, sectionId: string) => {
    const maxOrder = Math.max(...pageSections.map((ps) => ps.order_index), -1);
    await supabase.from("page_sections").insert({
      page_id: pageId,
      section_id: sectionId,
      order_index: maxOrder + 1,
      is_visible: true,
    });
    loadPageSections(pageId);
  };

  const removeSectionFromPage = async (pageSectionId: string) => {
    await supabase.from("page_sections").delete().eq("id", pageSectionId);
    if (managingSectionsPageId) loadPageSections(managingSectionsPageId);
  };

  const moveSectionUp = async (ps: PageSection) => {
    const prevPS = pageSections.find((p) => p.order_index === ps.order_index - 1);
    if (!prevPS) return;
    await supabase.from("page_sections").update({ order_index: ps.order_index }).eq("id", prevPS.id);
    await supabase.from("page_sections").update({ order_index: prevPS.order_index }).eq("id", ps.id);
    if (managingSectionsPageId) loadPageSections(managingSectionsPageId);
  };

  const moveSectionDown = async (ps: PageSection) => {
    const nextPS = pageSections.find((p) => p.order_index === ps.order_index + 1);
    if (!nextPS) return;
    await supabase.from("page_sections").update({ order_index: ps.order_index }).eq("id", nextPS.id);
    await supabase.from("page_sections").update({ order_index: nextPS.order_index }).eq("id", ps.id);
    if (managingSectionsPageId) loadPageSections(managingSectionsPageId);
  };

  return (
    <div className="pages-manager">
      <div className="page-header">
        <h2>{t.pagesManagement}</h2>
        <button className="btn-add" onClick={startAddPage}>
          {t.addPage}
        </button>
      </div>

      {/* Форма добавления */}
      {isAddingPage && (
        <div className="page-form">
          <h3 style={{ marginBottom: "16px", fontSize: "18px", color: "#1e293b", fontWeight: 600 }}>
            Новая страница
          </h3>
          <div className="form-grid">
            <div>
              <label>{t.slug}</label>
              <input
                type="text"
                value={editPageData.slug}
                onChange={(e) => setEditPageData({ ...editPageData, slug: e.target.value })}
                placeholder="/about"
              />
            </div>
            <div>
              <label>{t.titleKey}</label>
              <input
                type="text"
                value={editPageData.title_key}
                onChange={(e) => setEditPageData({ ...editPageData, title_key: e.target.value })}
                placeholder="page.about.title"
              />
            </div>
            <div>
              <label>{t.titleRu}</label>
              <input
                type="text"
                value={editPageData.title_ru}
                onChange={(e) => setEditPageData({ ...editPageData, title_ru: e.target.value })}
                placeholder="О нас"
              />
            </div>
            <div>
              <label>{t.titleKz}</label>
              <input
                type="text"
                value={editPageData.title_kz}
                onChange={(e) => setEditPageData({ ...editPageData, title_kz: e.target.value })}
                placeholder="Біз туралы"
              />
            </div>
            <div>
              <label>{t.backgroundColor}</label>
              <input
                type="color"
                value={editPageData.background_color}
                onChange={(e) => setEditPageData({ ...editPageData, background_color: e.target.value })}
              />
            </div>
            <div>
              <label>{t.order}</label>
              <input
                type="number"
                value={editPageData.order_index}
                onChange={(e) => setEditPageData({ ...editPageData, order_index: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={editPageData.is_active}
                  onChange={(e) => setEditPageData({ ...editPageData, is_active: e.target.checked })}
                />
                {t.active}
              </label>
            </div>
          </div>
          <div className="section-actions" style={{ marginTop: "16px" }}>
            <button onClick={addPage} className="btn-save">{t.save}</button>
            <button onClick={() => setIsAddingPage(false)} className="btn-cancel">{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Список страниц */}
      <div className="pages-list">
        {pages.map((page) => {
          const isEditing = editingPageId === page.id;
          const isManagingSections = managingSectionsPageId === page.id;

          return (
            <div key={page.id} className="page-card">
              {isEditing ? (
                <div className="page-form">
                  <div className="form-grid">
                    <div>
                      <label>{t.slug}</label>
                      <input
                        type="text"
                        value={editPageData.slug}
                        onChange={(e) => setEditPageData({ ...editPageData, slug: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>{t.titleRu}</label>
                      <input
                        type="text"
                        value={editPageData.title_ru}
                        onChange={(e) => setEditPageData({ ...editPageData, title_ru: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>{t.titleKz}</label>
                      <input
                        type="text"
                        value={editPageData.title_kz}
                        onChange={(e) => setEditPageData({ ...editPageData, title_kz: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>{t.backgroundColor}</label>
                      <input
                        type="color"
                        value={editPageData.background_color}
                        onChange={(e) => setEditPageData({ ...editPageData, background_color: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="section-actions" style={{ marginTop: "12px" }}>
                    <button onClick={() => savePage(page.id)} className="btn-save">{t.save}</button>
                    <button onClick={() => setEditingPageId(null)} className="btn-cancel">{t.cancel}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="page-header-row">
                    <div className="page-info">
                      <strong>{page.slug}</strong>
                      <span className="page-key">{page.title_key}</span>
                      {page.is_home && <span className="page-badge">🏠 Главная</span>}
                      {!page.is_active && <span className="page-badge inactive">Неактивна</span>}
                    </div>
                    <div className="page-actions">
                      <button onClick={() => startEditPage(page)} className="btn-icon btn-edit">{t.edit}</button>
                      <button
                        onClick={() => {
                          setManagingSectionsPageId(isManagingSections ? null : page.id);
                          if (!isManagingSections) loadPageSections(page.id);
                        }}
                        className="btn-add-sub"
                      >
                        {t.manageSections}
                      </button>
                      {!page.is_home && (
                        <button onClick={() => deletePage(page.id, page.title_key)} className="btn-icon delete">
                          {t.delete}
                        </button>
                      )}
                    </div>
                  </div>

                  {isManagingSections && (
                    <div className="sections-management">
                      <h4>{t.pageSections}</h4>
                      <div className="page-sections-list">
                        {pageSections.map((ps, idx) => (
                          <div key={ps.id} className="page-section-item">
                            <span>{ps.section?.section_key} ({ps.section?.section_type})</span>
                            <div className="item-actions">
                              {idx > 0 && (
                                <button onClick={() => moveSectionUp(ps)} className="btn-icon">{t.moveUp}</button>
                              )}
                              {idx < pageSections.length - 1 && (
                                <button onClick={() => moveSectionDown(ps)} className="btn-icon">{t.moveDown}</button>
                              )}
                              <button onClick={() => removeSectionFromPage(ps.id)} className="btn-icon delete">
                                {t.removeSection}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 style={{ marginTop: "20px" }}>{t.availableSections}</h4>
                      <div className="available-sections">
                        {sections
                          .filter((s) => !pageSections.find((ps) => ps.section_id === s.id))
                          .map((section) => (
                            <button
                              key={section.id}
                              onClick={() => addSectionToPage(page.id, section.id)}
                              className="section-chip"
                            >
                              + {section.section_key}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}