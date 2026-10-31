# NeuroLeitura Cinematográfica

Demonstração navegável da experiência NeuroLeitura Cinematográfica.

## Executar localmente

```bash
bun install
bun run dev
```

## O que está disponível na demonstração

- Biblioteca inicial com um livro e capítulos de exemplo.
- Navegação entre biblioteca, livro, capítulos e leitor.
- Episódio de exemplo já disponível para leitura.
- Geração de prévias demonstrativas para os demais capítulos.
- Cadastro local de livros e sumários.
- Pesquisa e indicador de progresso.

## Importante

Esta versão funciona sem Supabase, autenticação ou chave de API. Os dados são mantidos somente no estado da página e desaparecem ao atualizar ou fechar o navegador. A geração de episódios é simulada com conteúdo demonstrativo; nenhuma chamada real à inteligência artificial é feita.

A integração com banco de dados, login e geração real de episódios poderá ser conectada posteriormente.
