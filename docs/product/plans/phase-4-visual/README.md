# Fase 4 — evidência visual

Capturas do build de produção local de `865bb3a` (Chrome headless, `--headless=new`, o driver do
próprio repositório, `scripts/headless.ts`), nos dois idiomas, em 320, 390, 768 e 1280 px. `index.txt`
é o registro por captura: URL, largura, escala de texto, JavaScript, hidratação, altura da seção,
transbordo horizontal do documento, trees escondidas, erros de console, e o que a captura fez antes
(toque, foco, clique, preferência gravada). Nenhuma captura registrou erro ou aviso de console.

Reproduzíveis com o mesmo script sobre o mesmo SHA (o script vive fora do repositório, ao lado dos
logs da fase; a receita está no relatório §7).

| Captura | O que mostra |
|---|---|
| `320-pt-br-sorceress-class` | a seção a 320 px com uma tree: abas em três colunas (12 px), Cold Spells em grade 3×6 real, trilho de níveis, conectores, legenda fechada e "Meu nível" no fim; seção de 798 px |
| `320-en-us-necromancer-class` | Summoning a 320 px: "Raise Skeletal Mage" em três linhas numa fileira elástica (grade 493 px), "Poison and Bone Spells" em duas linhas na aba; seção de 787 px |
| `390-pt-br-blizzard-build` | a build a 390 px: total "88 de 110 pontos duros obrigatórios" no cabeçalho, pontos por aba (84/200), pílulas ✦20 (maximizada), 1 (investida) e "—" (sem pontos) |
| `390-en-us-blizzard-build-sheet` | um toque em Blizzard: a sheet modal com nome, nível, tree, estado, resumo, pontos e papel, nota editorial, pré-requisitos, desbloqueia, sinergias recebidas e dadas (todas links) e "View full skill page" |
| `390-pt-br-necromancer-level-18-locked` | `d2rc.level = 18` gravado: os dez nós acima do nível 18 com moldura tracejada, cadeado e sigilo esmaecido; "Meu nível 18" com "Limpar" |
| `320-en-us-sorceress-text-200-glyph` | texto a 200 %: modo glifo — grade 3×6 intacta, sigilos a 36 px, foco em Ice Blast, faixa de nome "Ice Blast · Level 6 · Available" acima da grade, abas empilhadas numa coluna; o transbordo de 232 px do documento é do header e é anterior à fase (baseline: `docScrollW` 552 a 320/200 %) |
| `768-en-us-sorceress-class-stacked` | a partir de 640 px: as três trees empilhadas, sem abas, uma legenda |
| `1280-pt-br-blizzard-build-panel` | desktop: Glacial Spike selecionada, o painel ancorado à direita, o caminho de pré-requisito (Ice Bolt → Ice Blast → Glacial Spike) aceso |
| `1280-en-us-warlock-class` | a oitava classe: Demon, Eldritch e Chaos empilhadas, cada uma com o seu tema |
| `320-pt-br-sorceress-noscript-stacked` | sem JavaScript a 320 px: as três trees empilhadas, conectores e 30 links presentes, abas como três links de fragmento, nenhum controle de preferência; seção de 1.894 px |
