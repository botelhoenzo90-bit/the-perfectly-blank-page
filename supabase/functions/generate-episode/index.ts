import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return reply({ error: "Autenticação necessária." }, 401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return reply({ error: "Sessão inválida." }, 401);
    const { chapter_id } = await req.json();
    if (!chapter_id) return reply({ error: "Informe o capítulo." }, 400);

    const admin = createClient(url, service);
    const { data: chapter, error: chapterError } = await admin.from("chapters")
      .select("id,title,position,book_id,user_id,books(id,title,author,table_of_contents)")
      .eq("id", chapter_id).eq("user_id", userData.user.id).single();
    if (chapterError || !chapter) return reply({ error: "Capítulo não encontrado nesta biblioteca." }, 404);

    const { data: existing } = await admin.from("episodes").select("*")
      .eq("chapter_id", chapter_id).eq("user_id", userData.user.id).maybeSingle();
    if (existing) return reply({ episode: existing, reused: true });

    const masterPrompt = Deno.env.get("NEUROLEITURA_MASTER_PROMPT");
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!masterPrompt || !openAiKey) return reply({
      error: "Configure NEUROLEITURA_MASTER_PROMPT (texto integral aprovado do Prompt Mestre Universal 4.0) e OPENAI_API_KEY nos secrets do Supabase.",
    }, 503);

    const book = Array.isArray(chapter.books) ? chapter.books[0] : chapter.books;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openAiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") || "gpt-4.1",
        temperature: 0.75,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: masterPrompt + "\n\nREGRAS DE ENTREGA: produza um episódio narrativo cinematográfico em português brasileiro, com duração aproximada de 5 minutos (cerca de 650 a 750 palavras). Não entregue blocos artificiais limitados a 450 caracteres. Respeite a sequência e o conteúdo do capítulo, não invente citações nem atribua ao autor ideias não sustentadas. Inclua uma técnica complementar de PNL explicada com responsabilidade, sem promessas terapêuticas. Retorne JSON com as chaves content e nlp_technique." },
          { role: "user", content: JSON.stringify({ livro: book?.title, autor: book?.author, sumario_original: book?.table_of_contents, capitulo: chapter.title, numero: chapter.position }) },
        ],
      }),
    });
    const result = await response.json();
    if (!response.ok) return reply({ error: result?.error?.message || "Falha no provedor de IA." }, 502);
    const raw = result.choices?.[0]?.message?.content;
    if (!raw) return reply({ error: "A IA não retornou conteúdo." }, 502);
    const generated = JSON.parse(raw);
    if (typeof generated.content !== "string" || !generated.content.trim()) return reply({ error: "Episódio inválido." }, 502);

    const { data: episode, error: saveError } = await admin.from("episodes").insert({
      book_id: chapter.book_id, chapter_id: chapter.id, user_id: userData.user.id,
      content: generated.content, nlp_technique: generated.nlp_technique || null, prompt_version: "4.0",
    }).select().single();
    if (saveError) {
      const { data: raced } = await admin.from("episodes").select("*").eq("chapter_id", chapter_id).eq("user_id", userData.user.id).maybeSingle();
      if (raced) return reply({ episode: raced, reused: true });
      throw saveError;
    }
    await admin.from("books").update({ last_accessed_chapter_id: chapter.id }).eq("id", chapter.book_id).eq("user_id", userData.user.id);
    return reply({ episode, reused: false });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Erro inesperado." }, 500);
  }
});

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
