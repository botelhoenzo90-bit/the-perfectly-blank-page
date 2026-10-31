import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createClient, type Session } from "@supabase/supabase-js";
import {
  BookOpen, Bookmark, Brain, Check, ChevronLeft, ChevronRight, CircleUserRound,
  Clock3, Library, LogOut, Mail, Plus, Search, Sparkles, X, Play, ArrowRight,
  Menu, PanelLeftClose, PanelLeftOpen, LoaderCircle, LockKeyhole, BookPlus,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroLeitura Cinematográfica | Minha Biblioteca" },
      { name: "description", content: "Sua biblioteca pessoal de experiências cinematográficas de leitura." },
    ],
  }),
  component: NeuroLeituraApp,
});

type Book = {
  id: string; title: string; author: string; table_of_contents: string[];
  last_accessed_chapter_id: string | null; created_at: string;
};
type Chapter = { id: string; book_id: string; title: string; position: number };
type Episode = { id: string; chapter_id: string; content: string; nlp_technique: string | null; created_at: string };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function NeuroLeituraApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
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

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) void loadLibrary();
    else { setBooks([]); setChapters([]); setEpisodes([]); setSelectedBook(null); setActiveChapter(null); }
  }, [session?.user.id]);

  async function loadLibrary() {
    if (!supabase) return;
    setBusy(true);
    const { data: bookRows, error: bookError } = await supabase.from("books").select("*").order("updated_at", { ascending: false });
    if (bookError) setNotice(bookError.message);
    const ids = (bookRows ?? []).map((b) => b.id);
    const [{ data: chapterRows }, { data: episodeRows }] = await Promise.all([
      ids.length ? supabase.from("chapters").select("*").in("book_id", ids).order("position") : Promise.resolve({ data: [] as Chapter[] }),
      ids.length ? supabase.from("episodes").select("*").in("book_id", ids) : Promise.resolve({ data: [] as Episode[] }),
    ]);
    setBooks((bookRows ?? []) as Book[]);
    setChapters((chapterRows ?? []) as Chapter[]);
    setEpisodes((episodeRows ?? []) as Episode[]);
    setBusy(false);
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setAuthBusy(true); setNotice("");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setNotice(error ? error.message : "Enviamos um link de acesso para seu e-mail. Confira sua caixa de entrada.");
    setAuthBusy(false);
  }

  async function signOut() { await supabase?.auth.signOut(); setNotice(""); }

  async function addBook(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !session?.user || !bookTitle.trim()) return;
    const titles = toc.split("\n").map((v) => v.trim()).filter(Boolean);
    if (!titles.length) { setNotice("Adicione ao menos um capítulo, um por linha."); return; }
    setBusy(true); setNotice("");
    const { data: book, error } = await supabase.from("books").insert({
      user_id: session.user.id, title: bookTitle.trim(), author: author.trim(),
      table_of_contents: titles,
    }).select().single();
    if (error || !book) { setNotice(error?.message ?? "Não foi possível cadastrar o livro."); setBusy(false); return; }
    const { error: chapterError } = await supabase.from("chapters").insert(titles.map((title, index) => ({
      book_id: book.id, user_id: session.user.id, title, position: index + 1,
    })));
    if (chapterError) setNotice(chapterError.message);
    setBookTitle(""); setAuthor(""); setToc(""); setShowAdd(false);
    await loadLibrary(); setBusy(false);
  }

  async function openBook(book: Book) {
    setSelectedBook(book); setActiveChapter(null); setMobileNav(false);
    if (supabase && book.last_accessed_chapter_id) {
      const chapter = chapters.find((c) => c.id === book.last_accessed_chapter_id);
      if (chapter) setActiveChapter(chapter);
    }
  }

  async function openChapter(chapter: Chapter) {
    setActiveChapter(chapter); setMobileNav(false);
    if (supabase && selectedBook) await supabase.from("books").update({ last_accessed_chapter_id: chapter.id }).eq("id", selectedBook.id);
  }

  async function generateEpisode(chapter: Chapter) {
    if (!supabase) return;
    const saved = episodes.find((e) => e.chapter_id === chapter.id);
    if (saved) { setActiveChapter(chapter); return; }
    setBusy(true); setNotice("");
    const { data, error } = await supabase.functions.invoke("generate-episode", { body: { chapter_id: chapter.id } });
    if (error) setNotice(error.message || "Não foi possível gerar o episódio.");
    else if (data?.episode) {
      setEpisodes((prev) => [...prev, data.episode as Episode]);
      setActiveChapter(chapter);
      if (selectedBook) await supabase.from("books").update({ last_accessed_chapter_id: chapter.id }).eq("id", selectedBook.id);
    } else setNotice(data?.error ?? "A geração não retornou um episódio.");
    setBusy(false);
  }

  const filteredBooks = useMemo(() => books.filter((b) => (b.title + " " + b.author).toLowerCase().includes(search.toLowerCase())), [books, search]);
  const bookChapters = selectedBook ? chapters.filter((c) => c.book_id === selectedBook.id) : [];
  const currentEpisode = activeChapter ? episodes.find((e) => e.chapter_id === activeChapter.id) : undefined;
  const doneCount = (book: Book) => chapters.filter((c) => c.book_id === book.id && episodes.some((ep) => ep.chapter_id === c.id)).length;

  if (!authReady) return <div className="boot-screen"><LoaderCircle className="spin" /> Preparando sua biblioteca...</div>;

  if (!supabase) return <div className="setup-screen"><div className="setup-card"><div className="brand-mark"><Brain /></div><span className="eyebrow">NEUROLEITURA CINEMATOGRÁFICA</span><h1>Falta conectar sua<br/><em>biblioteca.</em></h1><p>Configure as variáveis públicas do Supabase para ativar login, armazenamento permanente e geração de episódios.</p><code>VITE_SUPABASE_URL</code><code>VITE_SUPABASE_ANON_KEY</code><small>As chaves privadas devem ficar apenas nos secrets do Supabase, nunca no navegador.</small></div></div>;

  if (!session) return <main className="auth-screen"><div className="auth-visual"><div className="auth-brand"><span className="brand-mark"><Brain /></span><span>NEURO<span>LEITURA</span></span></div><div className="auth-message"><span className="eyebrow">UMA NOVA FORMA DE VIVER OS LIVROS</span><h1>Entre na história.<br/><em>Transforme a leitura.</em></h1><p>Suas obras, seus capítulos e suas experiências cinematográficas reunidos em um só lugar.</p></div><div className="auth-foot">INSTITUTO NEUROCONSCIÊNCIA DE DESENVOLVIMENTO HUMANO</div></div><div className="auth-form-wrap"><form className="auth-form" onSubmit={sendMagicLink}><span className="form-icon"><LockKeyhole /></span><span className="eyebrow">ACESSO À SUA CONTA</span><h2>Bem-vindo de volta.</h2><p>Informe seu e-mail. Enviaremos um link seguro para entrar na sua biblioteca.</p><label htmlFor="email">Seu e-mail</label><div className="input-wrap"><Mail size={18}/><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" required /></div><button className="primary-btn full" disabled={authBusy}>{authBusy ? <LoaderCircle className="spin"/> : "ENVIAR LINK DE ACESSO"}<ArrowRight size={17}/></button>{notice && <div className="notice">{notice}</div>}<small>O acesso é individual. Sua biblioteca e seus episódios são privados.</small></form></div></main>;

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${mobileNav ? "mobile-open" : ""}`}>
      <div className="sidebar-brand"><span className="brand-mark"><Brain/></span>{sidebarOpen && <span>NEURO<em>LEITURA</em></span>}<button className="icon-btn collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Recolher menu">{sidebarOpen ? <PanelLeftClose/> : <PanelLeftOpen/>}</button></div>
      <div className="nav-caption">{sidebarOpen ? "ESPAÇO DE LEITURA" : " "}</div>
      <button className="nav-item active" onClick={() => { setSelectedBook(null); setActiveChapter(null); setMobileNav(false); }}><Library/>{sidebarOpen && "Minha Biblioteca"}</button>
      <button className="nav-item" onClick={() => { setShowAdd(true); setSelectedBook(null); setMobileNav(false); }}><BookPlus/>{sidebarOpen && "Adicionar livro"}</button>
      <div className="sidebar-bottom"><div className="profile-avatar"><CircleUserRound/></div>{sidebarOpen && <div className="profile-meta"><strong>{session.user.email?.split("@")[0]}</strong><span>LEITOR(A)</span></div>}<button className="icon-btn logout-btn" onClick={signOut} aria-label="Sair"><LogOut/></button></div>
    </aside>
    <main className="main-area">
      <header className="app-topbar"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button><div className="breadcrumb">NEUROLEITURA <ChevronRight size={14}/> <span>{activeChapter ? "LEITURA" : selectedBook ? "LIVRO" : "MINHA BIBLIOTECA"}</span></div><div className="topbar-right"><span className="secure-pill"><span/> BIBLIOTECA PRIVADA</span><button className="icon-btn" onClick={signOut} title="Sair"><LogOut/></button></div></header>
      <div className="content-area">
        {notice && <div className="notice global-notice">{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}
        {showAdd ? <section className="content-narrow"><button className="back-link" onClick={() => setShowAdd(false)}><ChevronLeft/> Voltar à biblioteca</button><div className="page-heading"><span className="eyebrow">SUA PRÓXIMA JORNADA COMEÇA AQUI</span><h1>Adicionar <em>livro.</em></h1><p>Cadastre a obra e organize os capítulos para iniciar a experiência cinematográfica.</p></div><form className="panel add-form" onSubmit={addBook}><label>Título do livro<input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Ex.: O poder do hábito" required /></label><label>Autor<input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nome do autor" /></label><label>Sumário original <span className="label-help">Um capítulo por linha, na ordem do livro</span><textarea value={toc} onChange={(e) => setToc(e.target.value)} placeholder={"Introdução\nCapítulo 1 — ...\nCapítulo 2 — ...\nConclusão"} rows={8} required /></label><div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancelar</button><button className="primary-btn" disabled={busy}>{busy ? <LoaderCircle className="spin"/> : <Plus size={17}/>} Salvar livro</button></div></form></section>
        : activeChapter ? <section className="reader-view"><button className="back-link" onClick={() => setActiveChapter(null)}><ChevronLeft/> Voltar aos capítulos</button><div className="reader-meta"><span>{selectedBook?.title}</span><span>CAPÍTULO {String(activeChapter.position).padStart(2,"0")}</span></div><h1>{activeChapter.title}</h1>{currentEpisode ? <><div className="episode-toolbar"><span><Sparkles size={15}/> EPISÓDIO CINEMATOGRÁFICO</span><span><Clock3 size={14}/> LEITURA APROX. 5 MIN</span></div><article className="episode-content">{currentEpisode.content.split("\n").filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</article>{currentEpisode.nlp_technique && <div className="nlp-panel"><span><Brain size={17}/> TÉCNICA COMPLEMENTAR DE PNL</span><p>{currentEpisode.nlp_technique}</p></div>}</> : <div className="empty-episode"><span className="empty-icon"><Play/></span><h2>Este capítulo ainda não foi decodificado.</h2><p>Gere o episódio cinematográfico para explorar as ideias, os conflitos e os aprendizados desta parte da obra.</p><button className="primary-btn" onClick={() => generateEpisode(activeChapter)} disabled={busy}>{busy ? <LoaderCircle className="spin"/> : <Sparkles size={17}/>} GERAR EPISÓDIO</button></div>}<div className="reader-pagination"><button className="secondary-btn" disabled={activeChapter.position <= 1} onClick={() => { const prev = bookChapters.find(c => c.position === activeChapter.position - 1); if (prev) void openChapter(prev); }}><ChevronLeft/> Capítulo anterior</button><button className="primary-btn" disabled={activeChapter.position >= bookChapters.length} onClick={() => { const next = bookChapters.find(c => c.position === activeChapter.position + 1); if (next) void openChapter(next); }}>Próximo capítulo <ChevronRight/></button></div></section>
        : selectedBook ? <section className="content-narrow"><button className="back-link" onClick={() => setSelectedBook(null)}><ChevronLeft/> Minha Biblioteca</button><div className="book-detail-heading"><div className="book-cover large-cover"><BookOpen/></div><div><span className="eyebrow">JORNADA DE LEITURA</span><h1>{selectedBook.title}</h1><p>{selectedBook.author || "Autor não informado"}</p><div className="detail-stats"><span>{bookChapters.length} capítulos</span><span>{doneCount(selectedBook)} episódios gerados</span></div></div></div><div className="chapter-list-heading"><div><span className="eyebrow">SUMÁRIO ORIGINAL</span><h2>Capítulos da obra</h2></div><span className="chapter-total">{bookChapters.length} PARTES</span></div><div className="chapter-list">{bookChapters.map((chapter) => { const episode = episodes.find(e => e.chapter_id === chapter.id); return <div className="chapter-item" key={chapter.id}><span className="chapter-index">{String(chapter.position).padStart(2,"0")}</span><div className="chapter-info"><strong>{chapter.title}</strong><span>{episode ? "Episódio disponível na biblioteca" : "Aguardando decodificação"}</span></div>{episode ? <button className="chapter-action done" onClick={() => void openChapter(chapter)}><Check size={15}/> Abrir episódio</button> : <button className="chapter-action" onClick={() => void generateEpisode(chapter)} disabled={busy}><Sparkles size={15}/> Gerar episódio</button>}</div>; })}</div></section>
        : <section className="library-view"><div className="welcome-row"><div><span className="eyebrow">SEU ESPAÇO DE CONHECIMENTO</span><h1>Minha <em>Biblioteca.</em></h1><p>Retome suas jornadas e transforme cada capítulo em uma nova descoberta.</p></div><button className="primary-btn add-book-btn" onClick={() => setShowAdd(true)}><Plus size={18}/> ADICIONAR LIVRO</button></div><div className="library-toolbar"><div className="library-count"><strong>{books.length}</strong><span>{books.length === 1 ? "LIVRO CADASTRADO" : "LIVROS CADASTRADOS"}</span></div><div className="search-box"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar na biblioteca..." /></div></div>{busy ? <div className="loading-state"><LoaderCircle className="spin"/> Carregando sua biblioteca...</div> : filteredBooks.length ? <div className="book-grid">{filteredBooks.map((book, i) => { const total = chapters.filter(c => c.book_id === book.id).length; const done = doneCount(book); const progress = total ? Math.round(done / total * 100) : 0; const last = chapters.find(c => c.id === book.last_accessed_chapter_id); return <article className="book-card" key={book.id}><div className={`book-cover cover-${i % 4}`}><BookOpen/><span>NEUROLEITURA</span></div><div className="book-card-body"><div className="book-card-top"><span className="book-tag">LIVRO</span><span className="book-chapters">{total} capítulos</span></div><h3>{book.title}</h3><p className="book-author">{book.author || "Autor não informado"}</p><div className="progress-meta"><span>PROGRESSO DA JORNADA</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{width: progress + "%"}}/></div><div className="book-card-footer"><span>{done} de {total} episódios</span><button onClick={() => void openBook(book)}>{last ? "Continuar leitura" : "Abrir livro"} <ArrowRight size={15}/></button></div></div></article>; })}</div> : <div className="empty-library"><div className="empty-icon"><Bookmark/></div><h2>{books.length ? "Nenhum livro encontrado." : "Sua próxima descoberta começa aqui."}</h2><p>{books.length ? "Experimente buscar por outro título ou autor." : "Adicione seu primeiro livro para organizar capítulos e criar episódios cinematográficos que ficarão salvos na sua biblioteca."}</p>{!books.length && <button className="primary-btn" onClick={() => setShowAdd(true)}><Plus size={17}/> ADICIONAR PRIMEIRO LIVRO</button>}</div>}</section>}
      </div>
      <footer className="app-footer">© Instituto NeuroConsciência de Desenvolvimento Humano. Todos os direitos reservados. <span>Criador: Jöweslëy.</span></footer>
    </main>
  </div>;
}
