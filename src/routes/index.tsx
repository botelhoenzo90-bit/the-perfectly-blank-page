import { useState } from "react";
import "../sales.css";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Brain, BookOpen, Bookmark,
  Check, ChevronDown, Compass, Cpu, Layers3, Lightbulb, Menu, MessageCircle,
  Network, Play, Sparkles, Target, X, Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroLeitura | Não leia apenas livros. Aprenda a decodificá-los." },
      { name: "description", content: "Transforme grandes livros em experiências práticas de desenvolvimento humano com o Método NeuroLeitura." },
      { property: "og:title", content: "NeuroLeitura — Extraia mais de cada livro" },
      { property: "og:description", content: "Conhecimento, psicologia e aplicação prática em uma jornada de desenvolvimento humano." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#090b12" },
    ],
  }),
  component: NeuroLeituraPage,
});

const monthlyUrl = "https://pay.kiwify.com.br/C5gmznh";
const annualUrl = "https://pay.kiwify.com.br/5Ky3Pp8";
const benefits = [
  "Área de membros premium", "Aplicativo Instituto NeuroConsciência",
  "Área Bônus de Evolução", "Mentor I.A NeuroConsciência",
  "I.A Decodificador de Livros", "Workshops semanais", "NeuroFlix",
];
const faqs = [
  ["O NeuroLeitura é um aplicativo de resumos?", "Não. A proposta não é simplesmente condensar livros. O Método NeuroLeitura busca decodificar aspectos psicológicos e extrair ensinamentos práticos das obras para transformá-los em reflexão e aplicação."],
  ["O que é o NeuroFlix?", "É uma jornada de autoconhecimento construída capítulo por capítulo através dos livros. Não é resumo, resenha ou leitura do capítulo. Utilizamos o Método NeuroLeitura para explorar os ensinamentos e suas aplicações práticas."],
  ["Existem novos conteúdos?", "A proposta inclui workshops semanais nos quais um novo livro é decodificado através do Método NeuroLeitura."],
  ["Posso acessar pelo celular?", "O ecossistema inclui o aplicativo Instituto NeuroConsciência e a experiência web foi pensada para funcionar em dispositivos móveis."],
  ["Quanto custa?", "Existem duas modalidades: R$ 26 por mês ou acesso anual por 12x de R$ 20,37 ou R$ 197 à vista."],
];

function NeuroLeituraPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const goPlans = () => {
    setMenuOpen(false);
    document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
  };
  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="NeuroLeitura início"><span className="brand-mark"><Brain size={19} /></span><span>NEURO<span className="brand-accent">LEITURA</span></span></a>
        <button className="mobile-menu-button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          {[["Como funciona","metodo"],["Experiência","ecossistema"],["NeuroFlix","neuroflix"],["Workshops","ecossistema"],["Inteligência Artificial","ia"],["Planos","planos"],["Dúvidas","faq"]].map(([label,id]) => <button key={label} onClick={() => goTo(id)}>{label}</button>)}
          <a className="button button-small nav-cta" href="/app">EXPERIMENTAR DEMONSTRAÇÃO <ArrowUpRight size={15}/></a><button className="button button-small" onClick={goPlans}>QUERO FAZER PARTE <ArrowUpRight size={15}/></button>
        </nav>
      </header>

      <section className="hero section-wrap" id="inicio">
        <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-dot" /> MÉTODO NEUROLEITURA</div>
          <h1>VOCÊ NÃO PRECISA<br/>LER MAIS LIVROS<span className="headline-line">PRECISA APRENDER A<br/><em>EXTRAIR MAIS DELES.</em></span></h1>
          <p className="hero-copy">Transforme grandes livros em experiências práticas de desenvolvimento humano para compreender ideias profundas, identificar a psicologia por trás delas e levar seus ensinamentos para a vida.</p>
          <div className="process-line"><span>LER</span><ArrowRight/><span>DECODIFICAR</span><ArrowRight/><span>COMPREENDER</span><ArrowRight/><span>APLICAR</span></div>
          <div className="hero-actions"><button className="button" onClick={goPlans}>QUERO CONHECER O NEUROLEITURA <ArrowUpRight size={17}/></button><button className="text-button" onClick={() => goTo("metodo")}>DESCOBRIR COMO FUNCIONA <ArrowDown size={15}/></button></div>
          <div className="hero-note"><span className="note-line"/><span>Um novo livro. Toda semana. Uma nova oportunidade de evolução.</span></div>
          <div className="starting-price">PLANOS A PARTIR DE <strong>R$ 26<span>/mês</span></strong></div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit-core"><Brain size={45}/><span>IDEIAS EM<br/>MOVIMENTO</span></div><span className="orbit-tag tag-a">CONHECIMENTO</span><span className="orbit-tag tag-b">PSICOLOGIA</span><span className="orbit-tag tag-c">APLICAÇÃO</span><span className="orbit-star star-a">✳</span><span className="orbit-star star-b">✧</span></div>
        <div className="hero-bottom"><span>CONHECIMENTO COM INTENÇÃO</span><span>01 / 07</span></div>
      </section>

      <section className="section-wrap problem-section" id="problema">
        <div className="section-kicker">01 — O PONTO DE PARTIDA</div>
        <div className="problem-grid"><div><h2>QUANTOS LIVROS<br/>VOCÊ JÁ LEU...</h2><h2 className="muted-heading">E QUANTO REALMENTE<br/>MUDOU DEPOIS DELES?</h2></div><div className="problem-copy"><p>O problema não está necessariamente na quantidade de livros que você lê.</p><p>Está na forma como transforma leitura em compreensão e compreensão em ação.</p></div></div>
        <div className="forget-flow">{["Você lê","Marca trechos","Salva frases","Termina inspirado","O tempo passa","Grande parte daquele conhecimento desaparece"].map((item,i)=><div className={i===5?"flow-step flow-last":"flow-step"} key={item}><span className="flow-number">0{i+1}</span><span>{item}</span>{i<5&&<ArrowDown size={15}/>}</div>)}</div>
        <div className="statement-band"><span>INFORMAÇÃO NÃO TRANSFORMA UMA VIDA</span><strong>QUANDO PERMANECE APENAS COMO INFORMAÇÃO.</strong></div>
      </section>

      <section className="section-wrap method-section" id="metodo">
        <div className="section-heading"><div className="section-kicker">02 — A METODOLOGIA</div><h2>É AQUI QUE COMEÇA<br/>O MÉTODO <em>NEUROLEITURA.</em></h2><p>O NeuroLeitura foi criado para ir além da leitura tradicional. Em vez de simplesmente resumir um livro, buscamos compreender sua arquitetura de ideias, decodificar os aspectos psicológicos presentes na obra e transformar seus principais ensinamentos em conhecimento aplicável.</p></div>
        <div className="method-grid">{[{n:"01",t:"LER",d:"Entrar em contato com as ideias da obra.",ic:BookOpen},{n:"02",t:"DECODIFICAR",d:"Identificar padrões, princípios, comportamentos e mecanismos presentes no conteúdo.",ic:Network},{n:"03",t:"COMPREENDER",d:"Conectar os ensinamentos com situações reais da vida.",ic:Lightbulb},{n:"04",t:"APLICAR",d:"Transformar conhecimento em decisões, comportamentos e práticas.",ic:Target}].map(({n,t,d,ic:Icon})=><article className="method-card" key={n}><div className="card-topline"><span>{n}</span><Icon size={23}/></div><h3>{t}</h3><p>{d}</p><div className="card-index">{n}</div></article>)}</div>
        <div className="method-footer"><p>Não é sobre terminar mais livros.<br/><strong>É sobre permitir que os livros continuem trabalhando em você depois da última página.</strong></p><button className="button" onClick={goPlans}>QUERO VIVER ESSA EXPERIÊNCIA <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="section-wrap ecosystem-section" id="ecossistema">
        <div className="section-heading centered"><div className="section-kicker">03 — UM UNIVERSO CONECTADO</div><h2>MUITO MAIS QUE<br/><em>CONTEÚDO SOBRE LIVROS.</em></h2><p>Um ecossistema criado para transformar conhecimento em evolução contínua.</p></div>
        <div className="ecosystem-grid">
          <article className="eco-card"><span className="eco-number">01 / AMBIENTE</span><Layers3/><h3>ÁREA DE MEMBROS PREMIUM</h3><p>Um ambiente organizado para acessar os conteúdos, treinamentos, jornadas e experiências do NeuroLeitura.</p></article>
          <article className="eco-card"><span className="eco-number">02 / MOBILIDADE</span><Cpu/><h3>APLICATIVO INSTITUTO NEUROCONSCIÊNCIA</h3><p>Tenha o Instituto NeuroConsciência com você para acompanhar sua jornada de conhecimento e desenvolvimento.</p></article>
          <article className="eco-card"><span className="eco-number">03 / CONTEÚDO</span><Sparkles/><h3>ÁREA BÔNUS DE EVOLUÇÃO</h3><p>Conteúdos complementares para ampliar sua jornada de desenvolvimento e aplicação.</p></article>
          <article className="eco-card"><span className="eco-number">04 / CONVERSA</span><MessageCircle/><h3>MENTOR I.A NEUROCONSCIÊNCIA</h3><p>Uma inteligência artificial conversacional criada para apoiar sua experiência dentro do ecossistema NeuroConsciência.</p></article>
          <article className="eco-card"><span className="eco-number">05 / INVESTIGAÇÃO</span><Brain/><h3>I.A DECODIFICADOR DE LIVROS</h3><p>Uma inteligência artificial voltada à exploração e decodificação dos ensinamentos dos livros.</p><span className="eco-footnote">Transforme leitura em investigação.</span></article>
          <article className="eco-card workshop-card"><span className="eco-number">06 / TODA SEMANA</span><Zap/><h3>WORKSHOPS NEUROLEITURA</h3><strong className="weekly-title">UM NOVO LIVRO<br/>TODA SEMANA</strong><p>Toda semana decodificamos um novo livro através do Método NeuroLeitura. Investigamos seus ensinamentos, compreendemos suas implicações e transformamos conhecimento em aplicação prática.</p></article>
        </div>
        <article className="neuroflix-card" id="neuroflix"><div className="neuroflix-copy"><span className="eco-number">07 / EXPERIÊNCIA IMERSIVA</span><div className="neuroflix-label"><Play size={13} fill="currentColor"/> NEUROFLIX</div><h3>UMA JORNADA DE AUTOCONHECIMENTO<br/><em>CAPÍTULO POR CAPÍTULO.</em></h3><p>O NeuroFlix transforma cada livro em uma jornada de desenvolvimento e autoconhecimento.</p><div className="not-list"><span>NÃO É RESUMO.</span><span>NÃO É RESENHA.</span><span>NÃO É LEITURA DO CAPÍTULO.</span></div><p>Aqui usamos o Método NeuroLeitura para decodificar capítulo por capítulo, investigar a psicologia presente nas ideias e extrair ensinamentos práticos para colocar em prática na vida.</p><button className="button" onClick={goPlans}>QUERO ACESSAR O NEUROFLIX <ArrowUpRight size={16}/></button></div><div className="chapter-interface"><div className="interface-top"><span><span className="status-dot"/> JORNADA EM ANDAMENTO</span><span>NEUROFLIX / 001</span></div><div className="interface-title">SUA PRÓXIMA<br/><em>DESCOBERTA.</em></div>{["Capítulo 01 — Decodificado","Capítulo 02 — Decodificado","Capítulo 03 — Sua próxima descoberta","Capítulo 04 — Continue sua jornada"].map((c,i)=><div className={i<2?"chapter-row chapter-done":"chapter-row"} key={c}><span className="chapter-count">0{i+1}</span><span>{c}</span>{i<2?<Check size={15}/>:<ArrowRight size={15}/>}</div>)}<div className="interface-progress"><span/><span/></div><div className="interface-caption">CADA CAPÍTULO. UMA NOVA CAMADA DE COMPREENSÃO.</div></div></article>
      </section>

      <section className="section-wrap journey-section">
        <div className="section-heading"><div className="section-kicker">04 — A JORNADA</div><h2>VOCÊ ENTRA PELO LIVRO.<br/><em>MAS A JORNADA É SOBRE VOCÊ.</em></h2></div>
        <div className="journey-flow">{["LIVRO","IDEIAS","PSICOLOGIA","AUTOCONHECIMENTO","APLICAÇÃO","TRANSFORMAÇÃO"].map((s,i)=><div className={i===5?"journey-node journey-final":"journey-node"} key={s}><span>0{i+1}</span><strong>{s}</strong>{i!==5&&<ArrowDown/>}</div>)}</div>
        <p className="journey-copy">Cada obra se transforma em uma oportunidade para observar comportamentos, crenças, decisões, relações e padrões sob uma nova perspectiva.</p>
        <div className="journey-end"><span>O LIVRO É O PONTO DE PARTIDA.</span><strong>A VIDA É O LUGAR DA APLICAÇÃO.</strong></div>
      </section>

      <section className="section-wrap ai-section" id="ia">
        <div className="section-heading centered"><div className="section-kicker">05 — INTELIGÊNCIA AMPLIFICADA</div><h2>CONHECIMENTO HUMANO<br/>POTENCIALIZADO POR <em>INTELIGÊNCIA ARTIFICIAL.</em></h2></div>
        <div className="ai-grid"><article className="ai-card"><div className="ai-card-head"><span className="ai-icon"><Brain/></span><div><span className="eco-number">MENTOR CONVERSACIONAL</span><h3>MENTOR I.A NEUROCONSCIÊNCIA</h3></div><span className="online-dot"/></div><div className="chat-window"><div className="chat-label">VOCÊ</div><div className="chat-bubble user-bubble">Estou estudando um conceito e quero entender como aplicá-lo à minha vida.</div><div className="chat-label ai-label">MENTOR I.A <Sparkles size={12}/></div><div className="chat-bubble assistant-bubble">Vamos transformar esse conceito em uma reflexão prática e explorar como ele pode se relacionar com situações da sua realidade.</div><div className="typing-line"><span/><span/><span/> <small>MENTOR REFLETINDO</small></div></div></article>
        <article className="ai-card"><div className="ai-card-head"><span className="ai-icon"><BookOpen/></span><div><span className="eco-number">EXPLORAÇÃO DE IDEIAS</span><h3>I.A DECODIFICADOR DE LIVROS</h3></div><span className="online-dot"/></div><div className="chat-window"><div className="chat-label">VOCÊ</div><div className="chat-bubble user-bubble">Quero compreender melhor um ensinamento deste livro.</div><div className="chat-label ai-label">DECODIFICADOR <Sparkles size={12}/></div><div className="chat-bubble assistant-bubble">Vamos investigar a ideia, seu contexto e os possíveis ensinamentos que podem ser extraídos dela.</div><div className="typing-line"><span/><span/><span/> <small>IDEIAS EM ANÁLISE</small></div></div></article></div>
      </section>

      <section className="section-wrap access-section">
        <div className="access-panel"><div className="section-kicker">06 — UM ÚNICO ACESSO</div><h2>UM ECOSSISTEMA INTEIRO<br/>PARA <em>SUA EVOLUÇÃO.</em></h2><p>Uma experiência integrada para acompanhar sua jornada de conhecimento e desenvolvimento.</p><div className="benefit-list">{benefits.map(b=><div key={b}><Check size={17}/>{b}</div>)}</div><div className="access-bottom"><strong>Tudo conectado por uma única ideia: transformar conhecimento em desenvolvimento.</strong><button className="button" onClick={goPlans}>QUERO ENTRAR PARA O NEUROLEITURA <ArrowUpRight size={16}/></button></div></div>
      </section>

      <section className="section-wrap difference-section">
        <div className="section-heading centered"><div className="section-kicker">07 — UMA NOVA PERSPECTIVA</div><h2>NÃO É UMA BIBLIOTECA<br/>DE <em>RESUMOS.</em></h2><p>O que torna o NeuroLeitura diferente?</p></div>
        <div className="versus-grid"><div className="versus-card ordinary"><span className="eco-number">APENAS CONSUMIR</span>{["Ler","Assistir","Salvar","Esquecer"].map(x=><div key={x}><span className="minus-mark">−</span>{x}</div>)}</div><div className="versus-divider"><span>VS</span></div><div className="versus-card neuro"><span className="eco-number">MÉTODO NEUROLEITURA</span>{["Decodificar","Questionar","Compreender","Aplicar","Evoluir"].map(x=><div key={x}><Check size={16}/>{x}</div>)}</div></div>
        <p className="difference-end">Porque o valor de um livro não está apenas no que você terminou de ler.<br/><strong>Está no que consegue levar dele para a vida.</strong></p>
      </section>

      <section className="section-wrap plans-section" id="planos">
        <div className="section-heading centered"><div className="section-kicker">08 — SUA JORNADA COMEÇA AQUI</div><h2>ESCOLHA COMO QUER<br/><em>COMEÇAR SUA JORNADA.</em></h2><p>Duas formas de entrar. A mesma experiência NeuroLeitura.</p></div>
        <div className="plans-grid"><article className="plan-card"><span className="plan-label">ACESSO MENSAL</span><h3>PLANO MENSAL</h3><div className="price"><strong>R$ 26</strong><span>por mês</span></div><div className="plan-rule"/><ul>{benefits.map(b=><li key={b}><Check size={16}/>{b}</li>)}</ul><a className="button plan-button" href={monthlyUrl} target="_blank" rel="noopener noreferrer">COMEÇAR COM O PLANO MENSAL <ArrowUpRight size={16}/></a><span className="plan-foot">Flexibilidade para começar sua jornada.</span></article>
        <article className="plan-card featured-plan"><div className="popular-tag"><Sparkles size={13}/> MELHOR VALOR PARA SUA JORNADA</div><span className="plan-label">ACESSO ANUAL</span><h3>PLANO ANUAL</h3><div className="price annual-price"><span>12x DE</span><strong>R$ 20,37</strong></div><div className="cash-price">ou <strong>R$ 197 à vista</strong></div><div className="annual-badge">12 MESES DE ACESSO</div><div className="plan-rule"/><ul>{benefits.map(b=><li key={b}><Check size={16}/>{b}</li>)}</ul><a className="button plan-button" href={annualUrl} target="_blank" rel="noopener noreferrer">QUERO MEU ACESSO ANUAL <ArrowUpRight size={16}/></a><span className="plan-foot">Uma jornada contínua de conhecimento e evolução.</span></article></div>
        <div className="secure-note"><span className="secure-icon"><Check size={14}/></span> Pagamento processado em ambiente seguro pela Kiwify.</div>
      </section>

      <section className="section-wrap audience-section">
        <div className="section-heading"><div className="section-kicker">09 — PARA QUEM É</div><h2>O NEUROLEITURA É PARA QUEM ACREDITA QUE UM LIVRO PODE SER MUITO MAIS QUE <em>INFORMAÇÃO.</em></h2></div>
        <div className="audience-grid">{["Gosta de livros e desenvolvimento humano.","Quer extrair mais das obras que estuda.","Deseja transformar conhecimento em aplicação.","Busca desenvolver maior consciência sobre pensamentos e comportamentos.","Quer uma jornada contínua de desenvolvimento pessoal.","Deseja utilizar inteligência artificial como apoio à aprendizagem.","Acredita que um grande livro pode continuar ensinando muito depois da última página."].map((x,i)=><div className="audience-item" key={x}><span>0{i+1}</span><p>{x}</p><ArrowUpRight size={16}/></div>)}</div>
      </section>

      <section className="section-wrap future-section">
        <div className="future-orbit" aria-hidden="true"><span/><span/><span/></div><div className="section-kicker">10 — O QUE VEM DEPOIS DA LEITURA</div><h2>IMAGINE O QUE ACONTECE QUANDO VOCÊ PARA DE APENAS ACUMULAR LIVROS...</h2><div className="future-reveal">E COMEÇA A ACUMULAR<br/><em>TRANSFORMAÇÕES.</em></div><div className="future-steps"><p>Um livro pode apresentar uma ideia.</p><p>Uma ideia pode mudar uma percepção.</p><p>Uma nova percepção pode mudar uma decisão.</p><p>E decisões repetidas podem mudar uma trajetória.</p></div><p className="future-end">Essa é a proposta do NeuroLeitura.<br/>Transformar livros em ferramentas para compreender melhor a si mesmo e a própria vida.</p><button className="button" onClick={goPlans}>COMEÇAR MINHA JORNADA <ArrowUpRight size={16}/></button></section>

      <section className="section-wrap faq-section" id="faq"><div className="faq-intro"><div className="section-kicker">11 — DÚVIDAS FREQUENTES</div><h2>ANTES DE<br/><em>COMEÇAR.</em></h2><p>Respostas diretas para você entender a experiência NeuroLeitura.</p><button className="text-button" onClick={goPlans}>VER PLANOS <ArrowRight size={16}/></button></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={faqOpen===i?"faq-item faq-active":"faq-item"} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?null:i)} aria-expanded={faqOpen===i}><span>{q}</span><ChevronDown size={18}/></button>{faqOpen===i&&<p>{a}</p>}</div>)}</div></section>

      <section className="section-wrap final-cta"><div className="section-kicker">SUA PRÓXIMA PÁGINA COMEÇA AGORA</div><h2>O PRÓXIMO LIVRO PODE SER APENAS MAIS UM LIVRO.</h2><div className="final-emphasis">OU PODE SE TRANSFORMAR EM UMA NOVA FORMA DE ENXERGAR A SUA VIDA.</div><p>Entre para o NeuroLeitura e descubra uma nova maneira de transformar leitura em conhecimento aplicado.</p><button className="button" onClick={goPlans}>QUERO ENTRAR PARA O NEUROLEITURA <ArrowUpRight size={17}/></button><div className="final-prices"><span>R$ 26/mês</span><i/> <span>12x de R$ 20,37 | R$ 197 à vista no acesso anual</span></div></section>

      <footer className="footer"><a className="brand" href="#inicio"><span className="brand-mark"><Brain size={18}/></span><span>NEURO<span className="brand-accent">LEITURA</span></span></a><p>Instituto NeuroConsciência de Desenvolvimento Humano</p><div className="footer-links"><a href="#termos">Termos de Uso</a><a href="#privacidade">Política de Privacidade</a><a href="mailto:" onClick={e=>e.preventDefault()}>Suporte</a></div><div className="footer-bottom">© Instituto NeuroConsciência de Desenvolvimento Humano. Todos os direitos reservados.</div></footer>
      <button className="mobile-sticky-cta" onClick={goPlans}>QUERO FAZER PARTE <ArrowUpRight size={16}/></button>
    </main>
  );
}
