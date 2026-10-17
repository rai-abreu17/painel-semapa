# Identidade visual do painel SEMAPA

O redesign aproveita das referências as superfícies claras, a navegação leve e a hierarquia de informações. A identidade mantém o azul institucional do SEMAPA, com verde, âmbar e vermelho reservados aos estados dos dados. Textos, números e regras continuam vindo do modelo existente em `dashboard.store.ts`, que não foi alterado.

## Organização dos estilos

- `src/styles/tokens.css`: paleta, fontes, espaçamentos, controles, bordas, raios, sombras e camadas.
- `src/styles/components.css`: botões, formulários, tabelas, cards, modais e feedback.
- `src/styles/shell.css`: navegação, cabeçalho e composição das telas.
- `src/styles/filters.css`: barra de filtros e adaptação à largura disponível.
- `src/styles/utilities.css`: vocabulário de classes já utilizado pelo projeto.

Os arquivos são importados por `src/styles.css`. Os indicadores mantêm estilos locais no componente. Nenhuma dependência foi adicionada.

## Padrões de interface

Cards brancos têm bordas suaves e sombras discretas. Os indicadores usam cor nos ícones, números semânticos e barras, evitando grandes fundos em gradiente. A navegação mantém um destaque azul para a página atual. As tabelas preservam todos os campos e permitem rolagem horizontal local quando necessário.

Explicações e critérios de leitura ficam no componente `InfoTipComponent`, junto ao título correspondente. O botão “i” abre com foco, cursor ou toque; o clique mantém o conteúdo aberto, e Escape ou clique externo o fecha. Os textos de confirmação do acesso restrito permanecem no modal.

O modal contém o foco, fecha com Escape e devolve o foco ao controle de origem. A navegação móvel também contém o foco e mantém os itens ocultos fora da ordem de tabulação. Há indicação de foco, link para pular ao conteúdo e redução de animações conforme a preferência do dispositivo.

## Filtros

`DashboardFiltersComponent` organiza os controles existentes por projeção de conteúdo, preservando seus eventos e valores. Os segmentos selecionados usam superfície branca, borda discreta e texto azul. O setor selecionado recebe destaque suave.

A distribuição responde à largura real do painel por container queries: horizontal no desktop, rótulos acima dos controles em larguras intermediárias e três linhas integradas no celular. Os controles móveis têm aproximadamente 44 px de altura.

Filtros adicionais aparecem como chips removíveis. “Limpar filtros” só aparece quando existem chips e chama as mesmas ações de remoção já existentes: restaura período, setor e completude aos padrões, preservando o mercado escolhido como contexto.

## Validação realizada

- Build de produção aprovado, sem avisos de orçamento ou compilação.
- Oito telas verificadas em 320, 390, 768, 1024, 1440 e 1920 px, sem transbordamento horizontal da página.
- Filtros de mercado, período e setor, chips, limpeza e seleção por teclado verificados.
- Planta, alternância de métricas, tabela de setores, alertas e navegação com filtro verificados.
- Seleção de produto por teclado e ordenação da tabela verificadas.
- Tooltips, foco do menu e comportamento de Escape verificados.
- Modal verificado com justificativa inválida e válida, retorno de foco, confirmação e atualização do log local.
- Filtros do log e feedback existente de exportação verificados.

As verificações de interação foram realizadas no navegador local. A lógica e os comportamentos de integração existentes foram preservados.
