# NeuroLeitura Cinematográfica

Aplicação privada para cadastrar livros, organizar o sumário original, gerar episódios cinematográficos por capítulo e continuar a leitura de onde parou.

## Stack
- React + TanStack Start
- Supabase Auth (link de acesso por e-mail)
- Supabase Database com Row Level Security
- Supabase Edge Function para geração de episódios via OpenAI

## Configuração

1. Crie um projeto no Supabase.
2. Execute o SQL de `supabase/migrations/20261031000000_neuroleitura_library.sql` no SQL Editor.
3. Ative Email como provedor de autenticação em Authentication > Providers. Configure a URL do app e os redirects em Authentication > URL Configuration.
4. Configure no ambiente de build do frontend: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Configure os secrets da Edge Function no Supabase: `OPENAI_API_KEY`, `OPENAI_MODEL` (opcional; padrão `gpt-4.1`) e `NEUROLEITURA_MASTER_PROMPT` (obrigatório: inserir o texto integral e aprovado do Prompt Mestre Universal 4.0).
6. Publique a função `supabase/functions/generate-episode` usando Supabase CLI.
7. Execute `bun install` para atualizar o lockfile após a inclusão do cliente Supabase.

## Segurança e persistência
- Cada livro, capítulo e episódio é associado ao ID do usuário autenticado.
- RLS limita leitura e escrita ao proprietário dos dados.
- A chave service role e a chave da OpenAI ficam somente nos secrets do servidor/Edge Function; nunca no frontend.
- A função valida a sessão e a propriedade do capítulo antes de gerar.
- Antes de chamar a IA, procura um episódio já salvo para evitar nova geração e custo desnecessário.

## Fluxo disponível
- Acesso individual por link enviado ao e-mail.
- Cadastro de livro, autor e sumário (um capítulo por linha).
- Minha Biblioteca com pesquisa, progresso e contagem de episódios.
- Lista de capítulos, geração sob demanda e abertura de episódios existentes.
- Registro do último capítulo acessado e navegação entre capítulos.

## Importante sobre o Prompt 4.0
O texto completo do Prompt Mestre Universal 4.0 não estava versionado neste repositório. A função exige a variável privada `NEUROLEITURA_MASTER_PROMPT` e complementa as regras com duração aproximada de cinco minutos, narrativa em português brasileiro e técnica complementar de PNL. Cole ali o prompt oficial integral para preservar fielmente todas as regras editoriais específicas.
