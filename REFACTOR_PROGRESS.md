# Refatoração visual — Painel SEMAPA

Inventário real do projeto (SPA Angular 21 standalone, sem Angular Router — 8 "telas" são blocos `@if` dentro de um único `app.html`, controlados por `DashboardStore.vm()`).

Paleta obrigatória: `#082d69` `#3e98ce` `#90bb6f` `#2f7611`.

## 0. Tokens e fundação (`src/styles.css`)
- [x] `:root` usando a paleta obrigatória (estava sobrescrita com Slate/Blue/Emerald genérico) → corrigida
- [x] Variantes claras/escuras derivadas da paleta
- [x] Sombras/radius coerentes com a nova paleta (tingidas de navy, não cinza genérico)
- [x] Camada 2 (âmbar) e Camada 3 (vermelho) — dispositivo semântico de sensibilidade de dados restaurado (tinha sido acidentalmente substituído por tons azuis genéricos)

## 1. Layout global (shell)
- [x] Sidebar (`.app-sidebar`, `.app-sidebar__item`) — ativo funcionando, cores corretas
- [x] Header (`.app-header`)
- [x] Filter bar (`.filter-bar`, `.btn-group`, `.btn-filter`, `.chip*`)
- [x] Dica de navegação (hint banner)
- [x] Responsividade do shell — breakpoint adicionado (sidebar vira barra horizontal ≤900px, filtros empilham ≤640px); não existia nenhuma regra antes

## 2. Componentes compartilhados
- [x] `app-kpi-stat-card` (gradientes corrigidos para a paleta obrigatória, incluindo verde-claro antes órfão)
- [x] `app-modal`
- [x] Botões (`.btn-primary/secondary/ghost/danger`)
- [x] Tabelas (`.table`, `.table-container`)
- [x] Chips / badges
- [x] Chart-card header
- [x] Toast

## 3. Visão geral
- [x] KPI strip (bug: 3º/4º cards com tom azul/laranja aleatório sem sentido semântico → corrigido)
- [x] Planta do mercado (blocos, células, legenda, tabela)
- [x] Detalhe do setor (aside)
- [x] Alertas de decisão
- [x] Setores travados pela supressão

## 4. Preços e abastecimento
- [x] Tabela cesta monitorada (bug: sparkline de 12 semanas invisível — classe de animação no elemento errado → corrigido)
- [x] Série de preço (SVG chart)
- [x] Choque de preço / ruptura
- [x] Origem declarada da compra

## 5. Saúde dos negócios
- [x] Hero "número mais acionável"
- [x] Distribuição de margem (histograma)
- [x] Cards de maturidade (donuts SVG)
- [x] Tabela faixas de faturamento

## 6. Impacto e realocação
- [x] Gráfico índice de movimento agregado
- [x] Comparação entre setores
- [x] Coorte por tempo de uso + aviso de leitura

## 7. Adoção e cobertura
- [x] KPIs de adoção (bug: barras de progresso invisíveis, classe `bg-brand` inexistente → corrigido)
- [x] Cobertura e completude por setor
- [x] Temas perguntados ao bot (mesmo bug de barra invisível → corrigido)

## 8. Cadastro e ocupação (camada 2)
- [x] Banner de camada (tema âmbar restaurado)
- [x] KPIs cadastrais
- [x] Ocupação de boxes por setor
- [x] Permissionários com pendência
- [x] Histórico de transferência

## 9. Programas (camada 3)
- [x] Banner de camada (tema vermelho)
- [x] Cards de programa + filas (bug: botão "quebra-vidro" sem borda/cor vermelha, classes ausentes → corrigido)
- [x] Aside "Acessos neste mês" / "O que esta camada não faz"

## 10. Governança e privacidade
- [x] Inventário de dados
- [x] Regras de supressão ativas
- [x] Log de acessos (testado end-to-end via fluxo de quebra-vidro)
- [x] Pedidos de titulares + aside DPO

## 11. Modal de quebra-vidro + Toast
- [x] Modal (form, validação, botões) — fluxo completo testado no navegador
- [x] Toast (classes `animate-pulse`/`text-success` ausentes → corrigidas)

## 12. Auditoria final (passe 3)
- [x] Varredura automatizada (script no navegador comparando toda classe usada no DOM vs. toda classe definida no CSS) rodada nas 8 telas + modal + toast — 0 pendências no final
- [x] `ng build` limpo (várias rodadas, sem erros)
- [x] Navegação por todas as 8 telas no navegador, sem erros de console
- [x] Fluxo do modal testado (abrir → motivo → justificativa → confirmar → toast → log atualizado)
- [x] Responsividade — regra CSS adicionada e revisada (sidebar colapsa ≤900px); **não foi possível confirmar por captura de tela em viewport estreito**: a ferramenta de redimensionamento de janela do navegador não teve efeito neste ambiente (viewport permaneceu ~1536px mesmo após chamadas de resize bem-sucedidas). Validação feita por revisão de código da regra de mídia, não por screenshot ao vivo.
- [x] Nenhum overflow horizontal / conteúdo encoberto observado nas larguras testadas
