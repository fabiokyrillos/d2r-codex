import type { Overlay, UniqueItemCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR dos itens únicos.
 *
 * Nomes de item e linhas de estatística permanecem em inglês — são dados
 * invariantes. Só resumo, notas e a descrição de drop são traduzidos.
 * Ver ADR 0003.
 */
export const uniquesPtBr: Overlay<UniqueItemCopy> = {
  "harlequin-crest": {
    summary:
      "Universalmente conhecido como 'Shako'. +2 skills, vida, mana, 50% de magic find e 10% de redução de dano — o melhor elmo faz-tudo de caster do jogo.",
    dropSummary:
      "Cai de qualquer monstro numa zona de nível de área 58+. Extremamente comum para um unique de alto nível — costuma ser um dos primeiros bons itens que um personagem novo encontra.",
    notes:
      "O requisito de 50 de Strength é trivialmente baixo para um elmo elite, e o +1,5 de vida por nível significa que ele escala com o personagem. No nível 90 isso é 135 de vida e 135 de mana em cima de todo o resto.",
  },
  "nightwings-veil": {
    summary:
      "+2 skills e até +15% de Dano de Skills de Frio. O elmo best-in-slot de toda build de frio.",
    dropSummary:
      "Exige uma zona de nível de área 79+. Na prática isso significa Chaos Sanctuary no Hell, Worldstone Keep, Terror Zones altas, ou troca.",
    notes:
      "Os 192 de Strength listados parecem impossíveis para uma Sorceress, mas o Requirements -50% se aplica ao requisito do próprio item — o custo efetivo é 96 de Strength. Encaixe um Cold Rainbow Facet para mais dano de frio.",
  },
  tarnhelm: {
    summary:
      "+1 em Todas as Skills e até 50% de magic find no nível 15. Um elmo excelente para o início do jogo.",
    dropSummary:
      "Cai de monstros de nível 15+, então pode aparecer a partir do Ato 2 do Normal. Comumente apostado.",
    notes:
      "Quase nenhuma defesa, mas +1 skills e 50% de magic find no nível 15 é um presente de verdade num personagem novo. Continua útil até um Lore ou um Shako substituí-lo.",
  },
  "vampire-gaze": {
    summary:
      "Roubo de vida, roubo de mana e até 20% de redução de dano. O elmo padrão de mercenário durante a maior parte do jogo.",
    dropSummary:
      "Nível de área 41+. Comum nos Atos 4 e 5 do Nightmare, e em todo lugar no Hell.",
    notes:
      "Num mercenário costuma ser melhor que um elmo mais caro: o roubo de vida mantém ele de pé, e a redução de dano físico soma com todo o resto.",
  },
  "the-oculus": {
    summary:
      "+3 skills de Sorceress, 30% de Faster Cast Rate, +20 em todas as resistências e 50% de magic find. O orb clássico de magic find.",
    dropSummary:
      "Nível de área 50+. Encontrado com muita frequência, e o upgrade padrão de Sorceress saindo de uma Spirit sword quando o objetivo é magic find.",
    notes:
      "O proc aleatório de Teleport ao ser atingida é genuinamente perigoso — pode te teleportar para dentro de um grupo. Muitos jogadores ainda usam porque a linha de atributos é boa demais, mas é um motivo real para preferir Death's Fathom ou um conjunto com Spirit shield no Hardcore.",
  },
  "deaths-fathom": {
    summary:
      "+3 skills de Sorceress e até +30% de Dano de Skills de Frio. A arma best-in-slot de uma Blizzard Sorceress.",
    dropSummary:
      "Exige uma zona de nível de área 85, e é isso que a torna genuinamente rara. Chaos Sanctuary, Worldstone Keep, The Pit, Ancient Tunnels e Terror Zones altas.",
    notes:
      "O roll de +Dano de Skills de Frio varia de 15% a 30%, e a diferença é grande. Encaixe um Cold Rainbow Facet. Repare que ela dá apenas 20% de Faster Cast Rate contra os 40% do Heart of the Oak, então trocar para o Death's Fathom normalmente significa buscar esse FCR em outro lugar.",
  },
  wizardspike: {
    summary:
      "50% de Faster Cast Rate e +75 em todas as resistências num item só. Nenhum +skills, e essa é a troca.",
    dropSummary: "Nível de área 58+. Razoavelmente comum.",
    notes:
      "+75 em todas as resistências vindas de um único slot não tem igual, e resolve as resistências do Hell de uma vez. O custo é zero +skills, o que para uma Sorceress focada em dano costuma ser demais. Brilha em personagens cujo dano não escala com skills.",
  },
  "skin-of-the-vipermagi": {
    summary:
      "+1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências no nível 29. A melhor armadura econômica de caster do jogo.",
    dropSummary:
      "Nível de área 36+, então pode cair a partir do fim do Normal. Um dos uniques úteis mais confiavelmente encontrados do jogo.",
    notes:
      "30% de Faster Cast Rate no slot de armadura é raro, e com apenas 43 de Strength custa quase nada a uma Sorceress. É a armadura que carrega a maioria dos casters do nível 29 até um Chains of Honor ou Enigma.",
  },
  "ormus-robes": {
    summary:
      "Um +1 a 3 aleatório numa skill específica, mais até +15% de dano em skills de fogo, raio e frio.",
    dropSummary: "Nível de área 65+. O valor depende inteiramente do roll de skill aleatório.",
    notes:
      "Um roll de Blizzard num Ormus' Robes é um dos maiores upgrades de dano disponíveis para a build. Qualquer outro roll faz dele uma armadura medíocre. É o item definitivo do tipo 'confira o roll antes de trocar por ele'.",
  },
  magefist: {
    summary:
      "20% de Faster Cast Rate e regeneração de mana no nível 23. O FCR mais barato do jogo.",
    dropSummary:
      "Nível de área 20+. Barato, abundante, e disponível desde o meio do Normal.",
    notes:
      "20% de Faster Cast Rate por essencialmente nada. Todo caster usa até encontrar algo com FCR *e* resistências. O +1 Fire Skills é desperdiçado numa build de frio, mas o FCR não.",
  },
  frostburn: {
    summary: "+40% de mana máxima. Um item de Energy Shield, não de uso geral.",
    dropSummary: "Nível de área 27+. Comum.",
    notes:
      "Sem Faster Cast Rate, e é por isso que a maioria das Sorceresses prefere Magefist. O Frostburn é para builds de Energy Shield, onde a reserva de mana *é* a reserva de vida.",
  },
  "arachnid-mesh": {
    summary:
      "+1 em Todas as Skills e 20% de Faster Cast Rate no slot de cinto. Praticamente obrigatório em casters de endgame.",
    dropSummary:
      "Nível de área 61+, mas o requisito de nível 80 significa que você não pode usar até bem tarde. Amplamente trocado.",
    notes:
      "O único cinto do jogo com +skills e Faster Cast Rate juntos, e é por isso que quase todo plano de FCR de caster o assume. Só 12 espaços de poção, contra 16 de um cinto completo — uma troca real.",
  },
  "war-traveler": {
    summary: "Até 50% de magic find em botas, mais Strength e Vitality.",
    dropSummary: "Nível de área 49+. Comum e bastante trocado.",
    notes:
      "95 de Strength é um custo real para uma Sorceress — cerca de 40 pontos de atributo que poderiam ter sido Vitality. Vale a pena num conjunto dedicado a magic find, questionável no resto. Os +10 de Strength que ele dá compensam parte do próprio requisito.",
  },
  "sandstorm-trek": {
    summary:
      "20% de Faster Hit Recovery, Strength, Vitality e muita resistência a veneno. A bota de sobrevivência.",
    dropSummary: "Nível de área 66+. Incomum, mas não rara.",
    notes:
      "O Faster Hit Recovery é o que importa: costuma ser a forma mais barata de alcançar um breakpoint de FHR de Sorceress, e o +Strength ajuda a pagar um escudo Monarch.",
  },
  "stone-of-jordan": {
    summary:
      "+1 em Todas as Skills e +25% de mana máxima. A moeda de troca de referência por duas décadas.",
    dropSummary:
      "Anéis não têm base limitada por nível, então um Stone of Jordan pode cair em quase qualquer lugar — mas é genuinamente raro. A maioria dos jogadores troca por um.",
    notes:
      "Vender um Stone of Jordan a um vendedor avança em um o progresso do Diablo Clone no seu servidor. Offline, vender um invoca o Diablo Clone imediatamente. Você não pode comprá-lo de volta, então não venda um por acidente.",
  },
  nagelring: {
    summary: "Até 30% de magic find no nível 7. O primeiro item de magic find da maioria dos personagens.",
    dropSummary: "Disponível desde bem cedo no Normal, e comumente apostado.",
    notes:
      "Dois Nagelrings são 60% de magic find no nível 7. Uma escolha genuinamente boa para um personagem de magic find no início, e inútil depois.",
  },
  "maras-kaleidoscope": {
    summary:
      "+2 em Todas as Skills e até +30 em todas as resistências. O amuleto padrão de caster no endgame.",
    dropSummary:
      "Amuletos não têm base limitada por nível, então pode cair de qualquer monstro suficientemente alto. Amplamente trocado.",
    notes:
      "Simples e difícil de superar. Um amuleto crafted ou raro pode superá-lo se rolar +2 skills de classe junto com Faster Cast Rate — o Mara's não tem FCR nenhum, que é a única fraqueza real dele num conjunto apertado de FCR.",
  },
  stormshield: {
    summary:
      "35% de redução de dano, +30 de Strength e muito bloqueio. O escudo mais defensivo do jogo.",
    dropSummary: "Nível de área 72+. Incomum, e sempre procurado.",
    notes:
      "Sem +skills e sem Faster Cast Rate, então um caster abre mão de dano real e frequentemente de um breakpoint de FCR para usá-lo. É uma escolha de Hardcore e de bloqueio máximo, não um padrão.",
  },
  "herald-of-zakarum": {
    summary:
      "+2 skills de Paladin, +2 Combat skills, +50 em todas as resistências e 30% de chance de bloqueio. O escudo defensivo do Paladin.",
    dropSummary:
      "Nível de área 51+. Comum o bastante para aparecer enquanto você progride pelo Hell, e trocado barato.",
    notes:
      "+4 níveis efetivos de skill no Blessed Hammer num slot só, com resistências e bloqueio junto. A fraqueza dele contra um Spirit é o Faster Cast Rate — o Herald não tem nenhum. Qual é o correto depende inteiramente de o seu breakpoint já estar coberto ou não. Fazer upgrade dele para Zakarum Shield (Ko + Lem + Perfect Diamond) sobe o requisito para nível 68 e melhora a defesa.",
  },
  "crown-of-ages": {
    summary:
      "+1 skills, 30% de Faster Hit Recovery, até 15% de redução de dano e até dois sockets. O elmo do Hardcore.",
    dropSummary: "Exige uma zona de nível de área 85. Genuinamente raro, e sempre procurado.",
    notes:
      "A amplitude dos rolls é enorme: um Crown of Ages com 2 sockets, 15% de redução de dano e 30 em todas as resistências vale muitas vezes mais que um de 1 socket, 10% e 20%. O requisito de 174 de Strength é um custo real. Escolhido no lugar de um Harlequin Crest quando sobrevivência importa mais que magic find.",
  },
  "duriels-shell": {
    summary:
      "Cannot Be Frozen, +15 de Strength, +1 de vida por nível e boas resistências. Uma armadura defensiva discretamente excelente.",
    dropSummary: "Nível de área 47+. Comum pelo Nightmare e pelo Hell.",
    notes:
      "Cannot Be Frozen no slot de armadura vale mais do que parece — libera o seu elmo e escudo de terem que fornecer isso, e estar congelado reduz a sua velocidade de conjuração. Também é uma boa armadura de mercenário, além de servir ao jogador.",
  },
  "string-of-ears": {
    summary: "Até 15% de redução de dano físico e 8% de roubo de vida, com apenas 20 de Strength.",
    dropSummary: "Nível de área 36+. Muito comum.",
    notes:
      "A redução de dano físico é multiplicativa com outras fontes e soma em direção ao teto de 50%, o que torna este cinto desproporcionalmente bom em qualquer personagem que apanhe. Só 12 espaços de poção, e nenhum skill nem cast rate — é uma escolha pura de sobrevivência.",
  },
  nightsmoke: {
    summary:
      "+10 em todas as resistências e 50% de dano convertido em mana no nível 20. Um cinto excelente para o início numa build sem Energy.",
    dropSummary:
      "Nível de área 12+. Disponível desde o início do Normal, e comumente apostado.",
    notes:
      "Só 8 espaços de poção, que é o custo real. A conversão de dano em mana é genuinamente útil num caster sem investimento em Energy — transforma dano recebido em conjurações.",
  },
};
