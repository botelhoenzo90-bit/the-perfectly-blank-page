import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bookmark, Brain, Check, ChevronLeft, ChevronRight, Clock3, Library, Plus, Search, Sparkles, X, Play, ArrowRight, Menu, PanelLeftClose, PanelLeftOpen, BookPlus } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "NeuroLeitura Cinematográfica | Minha Biblioteca" }, { name: "description", content: "Sua biblioteca pessoal de experiências cinematográficas de leitura." }] }),
  component: NeuroLeituraApp,
});

type Book = { id: string; title: string; author: string; table_of_contents: string[]; last_accessed_chapter_id: string | null; created_at: string };
type Chapter = { id: string; book_id: string; title: string; position: number };
type Episode = { id: string; chapter_id: string; content: string; nlp_technique: string | null; created_at: string };

const initialBooks: Book[] = [{ id: "demo-book-1", title: "O Poder do Hábito", author: "Charles Duhigg", table_of_contents: ["O loop do hábito", "O cérebro ansioso", "A regra de ouro da mudança"], last_accessed_chapter_id: "demo-chapter-1", created_at: new Date().toISOString() }];
const initialChapters: Chapter[] = [
  { id: "demo-chapter-1", book_id: "demo-book-1", title: "O loop do hábito", position: 1 },
  { id: "demo-chapter-2", book_id: "demo-book-1", title: "O cérebro ansioso", position: 2 },
  { id: "demo-chapter-3", book_id: "demo-book-1", title: "A regra de ouro da mudança", position: 3 },
];
const sampleContent = "Imagine uma manhã comum. Você acorda, caminha até a cozinha e prepara café quase sem pensar.\n\nEsse gesto aparentemente simples revela uma engrenagem poderosa da mente: hábitos são ciclos que conectam um sinal, uma rotina e uma recompensa. O sinal desperta o comportamento; a rotina é a ação; e a recompensa ensina o cérebro a repetir o caminho.\n\nPense em alguém que, ao chegar em casa depois de um dia difícil, troca os tênis por uma caminhada curta. O sinal pode ser o estresse, a rotina é caminhar e a recompensa é a sensação de alívio. Ao reconhecer cada parte do ciclo, essa pessoa deixa de agir no automático e passa a enxergar uma oportunidade de escolha.\n\nA grande descoberta é que mudar não exige apagar quem você foi. Exige compreender o mecanismo que sustenta uma ação e experimentar uma rotina diferente para atender à mesma necessidade.\n\nDurante os próximos dias, observe um hábito recorrente. Identifique o que acontece imediatamente antes dele e qual sensação aparece depois. A curiosidade é o primeiro passo para transformar repetição em consciência.";

function NeuroLeituraApp() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [episodes, setEpisodes] = useState<Episode[]>([{ id: "demo-episode-1", chapter_id: "demo-chapter-1", content: sampleContent, nlp_technique: "Âncora de intenção: antes de iniciar uma nova rotina, respire profundamente e associe esse gesto a uma frase curta que represente sua escolha. Repita a associação sempre que o sinal aparecer.", created_at: new Date().toISOString() }]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [toc, setToc] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");

  function addBook(e: React.FormEvent) {
    e.preventDefault();
    const titles = toc.split("\n").map(v => v.trim()).filter(Boolean);
    if (!bookTitle.trim() || !titles.length) { setNotice("Informe o título e adicione ao menos um capítulo."); return; }
    const id = `demo-book-${Date.now()}`;
    const book: Book = { id, title: bookTitle.trim(), author: author.trim(), table_of_contents: titles, last_accessed_chapter_id: null, created_at: new Date().toISOString() };
    setBooks(prev => [book, ...prev]);
    setChapters(prev => [...prev, ...titles.map((title, i) => ({ id: `${id}-chapter-${i + 1}`, book_id: id, title, position: i + 1 }))]);
    setBookTitle(""); setAuthor(""); setToc(""); setShowAdd(false);
    setNotice("Livro adicionado à demonstração. Os dados ficam apenas nesta sessão.");
  }
  function openBook(book: Book) {
    setSelectedBook(book); setActiveChapter(null); setMobileNav(false);
    const last = chapters.find(c => c.id === book.last_accessed_chapter_id);
    if (last) setActiveChapter(last);
  }
  function openChapter(chapter: Chapter) {
    setActiveChapter(chapter); setMobileNav(false);
    if (selectedBook) setBooks(prev => prev.map(b => b.id === selectedBook.id ? { ...b, last_accessed_chapter_id: chapter.id } : b));
  }
  function generateEpisode(chapter: Chapter) {
    const saved = episodes.find(e => e.chapter_id === chapter.id);
    if (saved) { setActiveChapter(chapter); return; }
    setBusy(true);
    const episode: Episode = { id: `demo-episode-${Date.now()}`, chapter_id: chapter.id, content: `Esta é uma prévia demonstrativa do episódio cinematográfico para “${chapter.title}”.\n\nImagine que as ideias deste capítulo ganham vida diante de você. Em uma situação cotidiana, uma pequena decisão pode revelar padrões que normalmente passam despercebidos. Ao observar esses padrões com atenção, você começa a compreender como o conhecimento pode ser aplicado fora das páginas.\n\nNa experiência completa, este espaço receberá uma narrativa aprofundada, construída a partir do conteúdo do capítulo, com cenas, exemplos práticos, conexões entre ideias e uma jornada de aproximadamente cinco minutos.\n\nPor enquanto, explore a navegação, acompanhe seu progresso e visualize como os episódios serão organizados na biblioteca.`, nlp_technique: "Exercício demonstrativo: escolha uma ideia importante do capítulo e transforme-a em uma ação pequena, clara e possível de realizar hoje.", created_at: new Date().toISOString() };
    setEpisodes(prev => [...prev, episode]); setActiveChapter(chapter);
    if (selectedBook) setBooks(prev => prev.map(b => b.id === selectedBook.id ? { ...b, last_accessed_chapter_id: chapter.id } : b));
    setBusy(false); setNotice("Episódio de demonstração criado. A geração real será conectada posteriormente.");
  }

  const filteredBooks = useMemo(() => books.filter(b => (b.title + " " + b.author).toLowerCase().includes(search.toLowerCase())), [books, search]);
  const bookChapters = selectedBook ? chapters.filter(c => c.book_id === selectedBook.id) : [];
  const currentEpisode = activeChapter ? episodes.find(e => e.chapter_id === activeChapter.id) : undefined;
  const doneCount = (book: Book) => chapters.filter(c => c.book_id === book.id && episodes.some(ep => ep.chapter_id === c.id)).length;

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${mobileNav ? "mobile-open" : ""}`}>
      <div className="sidebar-brand"><span className="brand-mark"><Brain /></span>{sidebarOpen && <span>NEURO<em>LEITURA</em></span>}<button className="icon-btn collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Recolher menu">{sidebarOpen ? <PanelLeftClose/> : <PanelLeftOpen/>}</button></div>
      <div className="nav-caption">{sidebarOpen ? "ESPAÇO DE LEITURA" : " "}</div>
      <button className="nav-item active" onClick={() => { setSelectedBook(null); setActiveChapter(null); setMobileNav(false); }}><Library/>{sidebarOpen && "Minha Biblioteca"}</button>
      <button className="nav-item" onClick={() => { setShowAdd(true); setSelectedBook(null); setMobileNav(false); }}><BookPlus/>{sidebarOpen && "Adicionar livro"}</button>
      <div className="sidebar-bottom"><div className="profile-avatar"><Brain/></div>{sidebarOpen && <div className="profile-meta"><strong>Visitante</strong><span>MODO DEMONSTRAÇÃO</span></div>}</div>
    </aside>
    <main className="main-area">
      <header className="app-topbar"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button><div className="breadcrumb">NEUROLEITURA <ChevronRight size={14}/> <span>{activeChapter ? "LEITURA" : selectedBook ? "LIVRO" : "MINHA BIBLIOTECA"}</span></div><div className="topbar-right"><span className="secure-pill"><span/> MODO DEMONSTRAÇÃO</span></div></header>
      <div className="content-area">
        <div className="demo-banner"><Sparkles size={15}/> AMBIENTE DE DEMONSTRAÇÃO <span>Dados temporários: não são salvos após atualizar a página.</span></div>
        {notice && <div className="notice global-notice">{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}
        {showAdd ? <section className="content-narrow"><button className="back-link" onClick={() => setShowAdd(false)}><ChevronLeft/> Voltar à biblioteca</button><div className="page-heading"><span className="eyebrow">SUA PRÓXIMA JORNADA COMEÇA AQUI</span><h1>Adicionar <em>livro.</em></h1><p>Cadastre a obra e organize os capítulos para visualizar a experiência.</p></div><form className="panel add-form" onSubmit={addBook}><label>Título do livro<input value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="Ex.: O poder do hábito" required /></label><label>Autor<input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Nome do autor" /></label><label>Sumário original <span className="label-help">Um capítulo por linha, na ordem do livro</span><textarea value={toc} onChange={e => setToc(e.target.value)} placeholder={"Introdução\nCapítulo 1 — ...\nCapítulo 2 — ...\nConclusão"} rows={8} required /></label><div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancelar</button><button className="primary-btn"><Plus size={17}/> Salvar livro</button></div></form></section>
        : activeChapter ? <section className="reader-view"><button className="back-link" onClick={() => setActiveChapter(null)}><ChevronLeft/> Voltar aos capítulos</button><div className="reader-meta"><span>{selectedBook?.title}</span><span>CAPÍTULO {String(activeChapter.position).padStart(2,"0")}</span></div><h1>{activeChapter.title}</h1>{currentEpisode ? <><div className="episode-toolbar"><span><Sparkles size={15}/> EPISÓDIO CINEMATOGRÁFICO</span><span><Clock3 size={14}/> LEITURA APROX. 5 MIN</span></div><article className="episode-content">{currentEpisode.content.split("\n").filter(Boolean).map((p,i) => <p key={i}>{p}</p>)}</article>{currentEpisode.nlp_technique && <div className="nlp-panel"><span><Brain size={17}/> TÉCNICA COMPLEMENTAR DE PNL</span><p>{currentEpisode.nlp_technique}</p></div>}</> : <div className="empty-episode"><span className="empty-icon"><Play/></span><h2>Prévia deste capítulo</h2><p>Visualize como o episódio cinematográfico será apresentado ao leitor.</p><button className="primary-btn" onClick={() => generateEpisode(activeChapter)} disabled={busy}><Sparkles size={17}/> GERAR PRÉVIA</button></div>}<div className="reader-pagination"><button className="secondary-btn" disabled={activeChapter.position <= 1} onClick={() => { const p = bookChapters.find(c => c.position === activeChapter.position - 1); if (p) openChapter(p); }}><ChevronLeft/> Capítulo anterior</button><button className="primary-btn" disabled={activeChapter.position >= bookChapters.length} onClick={() => { const n = bookChapters.find(c => c.position === activeChapter.position + 1); if (n) openChapter(n); }}>Próximo capítulo <ChevronRight/></button></div></section>
        : selectedBook ? <section className="content-narrow"><button className="back-link" onClick={() => setSelectedBook(null)}><ChevronLeft/> Minha Biblioteca</button><div className="book-detail-heading"><div className="book-cover large-cover"><BookOpen/></div><div><span className="eyebrow">JORNADA DE LEITURA</span><h1>{selectedBook.title}</h1><p>{selectedBook.author || "Autor não informado"}</p><div className="detail-stats"><span>{bookChapters.length} capítulos</span><span>{doneCount(selectedBook)} episódios gerados</span></div></div></div><div className="chapter-list-heading"><div><span className="eyebrow">SUMÁRIO ORIGINAL</span><h2>Capítulos da obra</h2></div><span className="chapter-total">{bookChapters.length} PARTES</span></div><div className="chapter-list">{bookChapters.map(ch => { const ep = episodes.find(e => e.chapter_id === ch.id); return <div className="chapter-item" key={ch.id}><span className="chapter-index">{String(ch.position).padStart(2,"0")}</span><div className="chapter-info"><strong>{ch.title}</strong><span>{ep ? "Episódio disponível na demonstração" : "Prévia ainda não visualizada"}</span></div>{ep ? <button className="chapter-action done" onClick={() => openChapter(ch)}><Check size={15}/> Abrir episódio</button> : <button className="chapter-action" onClick={() => generateEpisode(ch)} disabled={busy}><Sparkles size={15}/> Gerar prévia</button>}</div>; })}</div></section>
        : <section className="library-view"><div className="welcome-row"><div><span className="eyebrow">SEU ESPAÇO DE CONHECIMENTO</span><h1>Minha <em>Biblioteca.</em></h1><p>Explore a demonstração e veja como cada capítulo ganha uma experiência de leitura.</p></div><button className="primary-btn add-book-btn" onClick={() => setShowAdd(true)}><Plus size={18}/> ADICIONAR LIVRO</button></div><div className="library-toolbar"><div className="library-count"><strong>{books.length}</strong><span>{books.length === 1 ? "LIVRO NA DEMONSTRAÇÃO" : "LIVROS NA DEMONSTRAÇÃO"}</span></div><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar na biblioteca..." /></div></div>{filteredBooks.length ? <div className="book-grid">{filteredBooks.map((book,i) => { const total = chapters.filter(c => c.book_id === book.id).length; const done = doneCount(book); const progress = total ? Math.round(done / total * 100) : 0; const last = chapters.find(c => c.id === book.last_accessed_chapter_id); return <article className="book-card" key={book.id}><div className={`book-cover cover-${i % 4}`}><BookOpen/><span>NEUROLEITURA</span></div><div className="book-card-body"><div className="book-card-top"><span className="book-tag">LIVRO</span><span className="book-chapters">{total} capítulos</span></div><h3>{book.title}</h3><p className="book-author">{book.author || "Autor não informado"}</p><div className="progress-meta"><span>PROGRESSO DA JORNADA</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{width: progress + "%"}}/></div><div className="book-card-footer"><span>{done} de {total} episódios</span><button onClick={() => openBook(book)}>{last ? "Continuar leitura" : "Abrir livro"} <ArrowRight size={15}/></button></div></div></article>; })}</div> : <div className="empty-library"><div className="empty-icon"><Bookmark/></div><h2>Nenhum livro encontrado.</h2><p>Experimente buscar por outro título ou autor.</p></div>}</section>}
      </div>
      <footer className="app-footer">© Instituto NeuroConsciência de Desenvolvimento Humano. Todos os direitos reservados. <span>Criador: Jöweslëy.</span></footer>
    </main>
  </div>;
}
