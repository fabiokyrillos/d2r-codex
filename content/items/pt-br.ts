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
  "heavens-light": {
    summary:
      "Um scepter de Paladin com 33% de Crushing Blow e até três sockets. O caminho barato para dano em boss sem um Grief.",
    dropSummary:
      "Nível de área 69+. Incomum, e pouco negociado porque a maioria dos Paladins prefere um Grief.",
    notes:
      "O motivo para usar é o Crushing Blow, que é o que realmente mata um boss — uma porcentagem da vida atual, ignorando quase tudo que o boss tem. Junto com Gore Rider chega a 48% de chance, que é o número em torno do qual as híbridas de Fist of the Heavens são montadas.",
  },
  "draculs-grasp": {
    summary:
      "Life Tap ao golpear, sem gastar um ponto de skill. O item que sozinho faz um Smiter sobreviver ao Uber Mephisto.",
    dropSummary:
      "Nível de área 84+, o que na prática significa farmar zonas de nível 85 no Hell. Sempre procurado.",
    notes:
      "Life Tap é o ponto. Ele converte o seu dano em cura enquanto dura, que é o que carrega um personagem de corpo a corpo por uma luta que ele não conseguiria curar de outro jeito. Os 5% de chance parecem pouco até você lembrar que Smite e Zeal batem várias vezes por segundo.",
  },
  "gore-rider": {
    summary:
      "15% de Crushing Blow, 15% de Deadly Strike e 10% de Open Wounds num par de botas. A bota padrão de corpo a corpo.",
    dropSummary:
      "Nível de área 55+. Comum o bastante para aparecer durante a evolução, e barata de trocar.",
    notes:
      "O requisito de Strength mostrado já considera o -25% de requisitos do próprio item; a base War Boots por si pede 125. Deadly Strike não faz nada para um Smiter — Smite o ignora — mas só o Crushing Blow já justifica o slot.",
  },
  "raven-frost": {
    summary:
      "Cannot Be Frozen num slot de anel, mais Dexterity e Attack Rating. Na prática, obrigatório para corpo a corpo.",
    dropSummary:
      "Nível de área 53+. Comum, e a solução mais barata para um problema que todo personagem de corpo a corpo tem.",
    notes:
      "Ser congelado é o assassino silencioso do corpo a corpo, e é pior ainda para o Zeal, cuja sequência de ataques te prende no lugar enquanto ela acontece. Cannot Be Frozen elimina isso por completo. O roll de Dexterity ainda conta para o bloqueio máximo, então o anel paga duas vezes.",
  },
  "highlords-wrath": {
    summary:
      "+1 em todas as skills, 20% de Increased Attack Speed e Deadly Strike que escala com o nível. O amuleto de corpo a corpo.",
    dropSummary: "Nível de área 73+. Incomum, mas bastante negociado.",
    notes:
      "No nível 90 o roll de Deadly Strike vale cerca de 34%, e é por isso que o amuleto melhora quanto mais você joga com ele. Vale saber que Deadly Strike não faz absolutamente nada para um Smiter — para essa build o amuleto é só o +1 em skills e a velocidade de ataque.",
  },
  "griffons-eye": {
    summary:
      "O elmo de raio. -15-20% de resistência a raio do inimigo e +10-15% de dano de skills de raio, num slot sem requisito de Strength.",
    dropSummary:
      "Nível de área 84+, o que na prática significa farmar zonas de nível 85 no Hell ou trocar.",
    notes:
      "A linha de resistência do inimigo é o motivo, não o dano de skill — ela soma com Conviction e com Lower Resist, e é aplicada antes de a imunidade ser checada. Um Diadem não tem requisito de Strength, o que torna este item incomumente fácil de usar para o que ele faz.",
  },
  "eschutas-temper": {
    summary:
      "+1-3 skills de Sorceress e 40% de Faster Cast Rate, com dano de fogo e de raio no mesmo orb.",
    dropSummary: "Nível de área 80+. Incomum, e muito negociado porque duas famílias de build o querem.",
    notes:
      "Os rolls importam mais aqui que na maioria dos uniques: +1 contra +3 skills de Sorceress, e 10% contra 20% de dano de skill, é uma faixa larga. Ele não tem resistência nem magic find, então é uma arma de dano puro — um Spirit ou um Oculus costuma ser a escolha melhor para uso geral com orçamento apertado.",
  },
  "lidless-wall": {
    summary:
      "+1 em todas as skills e 20% de Faster Cast Rate num escudo barato, com mana por morte. A mão secundária econômica de caster.",
    dropSummary: "Nível de área 49+. Comum, e disponível bem antes de um escudo Spirit ser realista.",
    notes:
      "Vale saber o que ele não é: um Spirit num escudo de 4 sockets dá +2 skills e 35% de Faster Cast Rate por quatro runas da Countess. O Lidless Wall só ganha quando você não acha uma base de 4 sockets, ou quando a mana por morte resolve um problema de verdade — o que numa build sem investimento em Energy às vezes acontece.",
  },
  "demon-machine": {
    summary:
      "66% de Piercing Attack na crossbow mais rápida do jogo. O item que dá nome à Enchant Sorceress.",
    dropSummary:
      "Nível de área 57+. Incomum, e quase nunca negociado porque só uma build o quer.",
    notes:
      "A base Chu-Ko-Nu é a crossbow mais rápida do jogo — o modificador de velocidade dela é −60, mais que qualquer outra. Combinado com 66% de Piercing Attack, cada bolt carrega o dano elemental que você somou a ele através de vários alvos de uma vez, que é o mecanismo inteiro por trás da Enchant Sorceress. O requisito de 95 de Dexterity é o custo real, e não é pequeno para uma caster.",
  },

  // Sunder Charms
  "bone-break": {
    summary:
      "Quebra a imunidade física, e tira de 10 a 20 pontos da sua própria redução de dano físico para fazer isso.",
    dropSummary:
      "Só no Hell. Cai do Herald das Terror Zones em qualquer nível, ou de monstros comuns a uma taxa bem menor, desde que o patch 3.3 elevou o nível mínimo de drop para 75.",
    notes:
      "**A penalidade dele é diferente das outras cinco.** Os Sunder Charms elementais custam de 70 a 90 pontos de uma resistência, que um personagem com resistências empilhadas consegue absorver em parte. Este subtrai da sua redução de dano físico, e dano físico é o que os monstros corpo a corpo causam — então o charm que permite a uma build física ferir um imune físico é também o charm que faz cada golpe comum doer mais. Numa Amazon de Jab e Fend parada em alcance corpo a corpo, essa é a troca para pensar com mais calma; numa Amazon de arco à distância custa muito menos. Leve para as zonas que exigem e deixe no baú no resto do tempo.",
  },
  "crack-of-the-heavens": {
    summary:
      "Quebra a imunidade a raio, ao custo de 70 a 90 pontos da sua própria resistência a raio.",
    dropSummary:
      "Só no Hell, do Herald das Terror Zones ou a uma taxa reduzida de monstros comuns acima do nível 75.",
    notes:
      "O mais caro dos seis para carregar, por um motivo que não tem nada a ver com o número dele: **monstros lightning enchanted são os que matam personagens de raio**, e este charm remove a maior parte da resistência que te protege deles. Uma Amazon de javelin carregando isso está no meio dos grupos com 70 a 90 pontos a menos de resistência a raio do que ela imagina ter. Um Infinity no mercenário faz o mesmo serviço sem penalidade nenhuma, e custa uma Ber e uma Jah.",
  },
  "cold-rupture": {
    summary:
      "Quebra a imunidade a frio, ao custo de 70 a 90 pontos da sua própria resistência a frio.",
    dropSummary:
      "Só no Hell, do Herald das Terror Zones ou a uma taxa reduzida de monstros comuns acima do nível 75.",
    notes:
      "O mais barato dos seis para carregar na prática, porque dano de frio no Hell chega principalmente como chill, e não como aquilo que te mata. É o que transforma o Pit e o Worldstone Keep — ambos nível de área 85, e ambos registrando frio entre as imunidades deles — em zonas que uma build de frio farma em vez de contornar.",
  },
  "flame-rift": {
    summary:
      "Quebra a imunidade a fogo, ao custo de 70 a 90 pontos da sua própria resistência a fogo.",
    dropSummary:
      "Só no Hell, do Herald das Terror Zones ou a uma taxa reduzida de monstros comuns acima do nível 75.",
    notes:
      "Fogo é o elemento mais resistido do Hell, o que faz deste o mais carregado dos seis e aquele cuja penalidade é sentida com mais frequência. Qualquer coisa com aura de fogo, ataque de Immolation ou encantamento de fogo dói bem mais enquanto ele está no inventário. Usar um Andariel's Visage ao mesmo tempo são 100 a 120 pontos de resistência a fogo entregues entre dois itens.",
  },
  "rotting-fissure": {
    summary:
      "Quebra a imunidade a veneno, ao custo de 70 a 90 pontos da sua própria resistência a veneno.",
    dropSummary:
      "Só no Hell, do Herald das Terror Zones ou a uma taxa reduzida de monstros comuns acima do nível 75.",
    notes:
      "O menos negociado dos seis, porque veneno é o tipo de dano menos jogado — o que também significa que é o que mais costuma faltar quando uma build de veneno finalmente precisa dele. Resistência a veneno é fácil de estourar o teto com charms e um Atma's Scarab, então a penalidade é mais absorvível que a de fogo ou a de raio.",
  },

  "andariels-visage": {
    summary:
      "+2 skills, 20% de velocidade de ataque e até 10% de roubo de vida — pagos com 30 pontos da sua própria resistência a fogo.",
    dropSummary:
      "Só no Hell, e com um dos requisitos de nível mais altos do jogo, 83. Negociado em vez de farmado.",
    notes:
      "**Os −30% de resistência a fogo não são uma nota de rodapé.** O Hell já aplica −100, então este elmo precisa ser pago em outro lugar antes de entrar — uma runa Um num escudo, uma fileira de charms de resistência, ou simplesmente não usá-lo numa zona cheia de fogo. O que ele compra é o melhor elmo de velocidade de ataque com skills que um personagem de ataque pode vestir, e o roubo de vida é o que mantém uma Amazon corpo a corpo de pé sem uma fonte de Life Tap. Socke-o com uma Um pela resistência que ele tirou, ou com uma joia de 15% de velocidade de ataque se você conseguir a resistência em outro lugar.",
  },
  razortail: {
    summary:
      "33% de Piercing Attack num slot de cinto. O pierce mais barato do site, e o motivo de Lightning Fury funcionar antes de Pierce estar maximizado.",
    dropSummary:
      "Disponível a partir do Nightmare, abundante e barato de comprar. Um dos melhores custo-benefícios do jogo para as builds que o querem.",
    notes:
      "Pierce de equipamento e pierce da skill são um pool só, e isto são 33 pontos dele por um slot de cinto e 20 de Strength. No Lightning Fury isso não é um aumento de dano de 33% — cada inimigo que a javelin atravessa libera outra rajada de raios, então ele multiplica. É igualmente decisivo numa build de arco, onde uma flecha que perfura acerta a fileira atrás daquela em que você mirou. **Não vale absolutamente nada para Charged Strike, Lightning Strike, Jab ou Fend**, que são ataques corpo a corpo e nunca disparam um projétil.",
  },
  "thundergods-vigor": {
    summary:
      "+3 de Lightning Strike e +3 de Lightning Fury, mais o lightning absorb que mantém viva uma Amazon de javelin dentro do próprio elemento.",
    dropSummary:
      "Cai a partir do Nightmare e é negociado barato, porque só a Amazon de javelin realmente o quer.",
    notes:
      "Seis níveis de skill divididos entre as duas skills que uma Amazon de javelin de fato aperta, num slot cuja concorrência é um cinto com resistências. O requisito de 110 de Strength é o preço real e não é pequeno num personagem que também precisa alcançar um escudo. O lightning absorb e a resistência máxima a raio elevada são a outra metade do argumento: **grupos lightning enchanted são o que mata Amazons de javelin**, e este cinto é a resposta mais barata a eles.",
  },
  waterwalk: {
    summary:
      "Vida, Dexterity e resistência máxima a fogo elevada numa bota leve. A alternativa defensiva às botas de magic find.",
    dropSummary: "A partir do Nightmare, abundante e barato.",
    notes:
      "A Dexterity conta para o bloqueio máximo, e numa classe que bloqueia bem isso torna esta bota discretamente melhor do que a lista de status sugere. A resistência máxima a fogo elevada é a linha pela qual jogadores de Hardcore a compram — 80% em vez de 75% é um quinto a menos de dano de toda fonte de fogo no Hell, e nenhuma quantidade de resistência comum leva você até lá.",
  },
  "the-cats-eye": {
    summary:
      "Movimento, velocidade de ataque e Dexterity num amuleto só. O slot de pescoço padrão da Amazon física de arco.",
    dropSummary: "A partir do Nightmare, comum e barato de comprar.",
    notes:
      "Nenhuma skill, e é por isso que ele não está na lista de nenhuma caster. O que ele é, em vez disso, é a velocidade de ataque de 20% mais barata do site somada a 25 de Dexterity, e numa build de arco as duas coisas viram dano diretamente — Dexterity aumenta o attack rating e o dano base de cada flecha. Os 30% de Faster Run/Walk são o motivo de uma Bowazon que o usa jogar diferente: esta classe faz kite, e movimento é um atributo defensivo.",
  },
  "atmas-scarab": {
    summary:
      "Amplify Damage ao golpear. O único amuleto que responde à imunidade física sem gastar um slot de charm.",
    dropSummary:
      "A partir do Nightmare. Incomum, e negociado com constância só pela maldição.",
    notes:
      "**Amplify Damage corta pela metade a resistência física do alvo, e contra um imune físico isso costuma bastar para quebrar a imunidade de vez.** Cinco por cento por golpe parece pouco até você contar os golpes: Strafe dispara até dez flechas numa rajada e Fend atinge cada inimigo adjacente numa sequência, então uma build física de múltiplos acertos aplica a maldição o tempo todo. Numa build de acerto único é pouco confiável e o amuleto não vale o slot. Poison Resist +75% é a outra metade do argumento, e é uma linha real nas zonas do Hell cheias de veneno.",
  },

  // Arcos, bestas e armas de Amazon
  "titans-revenge": {
    summary:
      "+2 skills de Amazon e +2 skills de Javelin and Spear numa lança que se repõe sozinha. A arma da Amazon de javelin durante quase toda a vida dela.",
    dropSummary:
      "Cai no Hell e no fim do Nightmare, e é um dos itens de Amazon mais negociados do jogo, porque toda build de javelin quer um.",
    notes:
      "Replenishes Quantity é a linha que mais importa no dia a dia: uma build de javelin arremessa a própria arma, e sem reposição automática você fica catando javelins do chão entre um grupo e outro. Os quatro níveis de skill que ele carrega — dois da classe inteira e mais dois na aba Javelin and Spear — valem mais do que qualquer dano bruto que uma javelin rara consiga rolar.",
  },
  thunderstroke: {
    summary:
      "A única arma de Amazon que reduz a resistência a raio do inimigo. O endgame da javelin de raio, e ela não se repõe.",
    dropSummary:
      "Um drop exclusivo do Hell, e genuinamente raro. A maioria das Amazons compra em vez de encontrar.",
    notes:
      "Os −15% de resistência a raio do inimigo são aplicados só a alvos que não são imunes, exatamente como no Griffon's Eye, o que faz desta a única peça de equipamento de Amazon que ajuda contra a imunidade a raio, e não apenas contra a resistência. Ela **não tem Replenishes Quantity**, então uma Amazon de Thunderstroke ou compra a versão com rolagem perfeita e aceita reabastecer na mão, ou mantém uma Titan's Revenge no swap para limpar. Esse é todo o dilema entre as duas javelins.",
  },
  windforce: {
    summary:
      "O arco de maior dano do jogo, numa base que dispara rápido. Knockback é ao mesmo tempo a assinatura e o principal defeito dele.",
    dropSummary:
      "Só no Hell, e entre os arcos elite mais raros. Normalmente é negociado, não encontrado.",
    notes:
      "No nível 90 só a linha por nível vale cerca de 281 de dano máximo, e é por isso que ele supera qualquer outro arco por larga margem. **Knockback não sai de graça.** Ele empurra o alvo para fora de uma sequência de Strafe e do meio do cone do Multiple Shot, então nessas duas skills custa acertos; contra um boss parado não custa nada e compra segurança. Quem não gosta disso usa um arco Faith e aceita o teto mais baixo.",
  },
  "buriza-do-kyanon": {
    summary:
      "100% de Piercing Attack sem gastar um ponto de skill. Uma besta que resolve o pierce de vez, ao custo de velocidade.",
    dropSummary:
      "Disponível a partir do fim do Nightmare e muito negociada. Uma das armas genuinamente capazes de endgame mais baratas do jogo.",
    notes:
      "Os 80% de velocidade de ataque estão numa base de besta, e bestas são lentas o bastante para o número ser menor do que parece — uma Balista com 80% ainda dispara mais devagar que a maioria dos arcos sem nenhum. O que você está comprando é **100% de Piercing Attack de graça**, o que permite a uma Amazon em evolução pular o Pierce por completo e gastar esses pontos em outro lugar. O dano de frio também aplica chill, que é uma linha defensiva real num personagem que fica sem escudo enquanto atira.",
  },
  widowmaker: {
    summary:
      "Ignore Target's Defense e 33% de Deadly Strike numa base de arco leve. A resposta barata para o problema de attack rating de uma build de arco.",
    dropSummary: "Um drop do Hell, e incomum em vez de raro. Barato de comprar.",
    notes:
      "Ignore Target's Defense elimina por completo a rolagem de attack rating contra monstros normais, o que vale mais numa Amazon de arco do que o dano bruto de uma base maior — uma flecha que erra não causa dano nenhum. O requisito de 72 de Strength é o mais baixo de qualquer arco elite, então ele cabe num plano de atributos onde um Hydra Bow não cabe. **Os +3-5 de Guided Arrow não são motivo para comprá-lo** num plano de Strafe ou Multiple Shot; trate como bônus, não como build.",
  },
  eaglehorn: {
    summary:
      "+1 skills de Amazon, Ignore Target's Defense e dano que cresce com o seu nível. O arco para socketar.",
    dropSummary:
      "Só no Hell, e incomum. Negociado com frequência porque várias builds o querem.",
    notes:
      "As duas linhas por nível são o que faz ele escalar: no nível 90 o dano aumentado é 200% mais cerca de 180% adicionais, e o attack rating sobe outros 135. É também o arco que uma Bowazon mais socketa — seis sockets numa base elite com +1 skills é o caminho mais barato para empilhar joias de dano ou uma runa Amn para roubo de vida.",
  },
  homunculus: {
    summary:
      "+2 em skills de Necromancer e +2 em Curses num escudo que bloqueia como escudo. A resposta da própria classe ao Spirit.",
    dropSummary:
      "Área de nível 50+, a partir do Nightmare. Comum o bastante para achar e barato de comprar.",
    notes:
      "**Quatro níveis de skill num slot só, e os +40% de bloqueio não são enfeite.** Um Necromancer parado atrás de um exército ainda leva pancada do que passa por ele, e este é o único item de classe que paga por isso. All Resistances +40 cobre sozinho a maior parte dos −100 do Hell, e Regenerate Mana 33% é a maior linha de recuperação de mana disponível para a classe — o que importa mais do que parece quando reconstruir um exército custa a barra inteira. **Os +2 em Curses aumentam Amplify Damage e Decrepify juntos**, e nenhuma das duas quer pontos duros além do primeiro, então é daqui que os níveis delas vêm.",
  },
  "deaths-web": {
    summary:
      "O único item do jogo que reduz a resistência a veneno do inimigo. O endgame de um Necromancer de veneno, e nada substitui.",
    dropSummary:
      "Área de nível 74+, então só no Hell e só nas zonas mais fundas. Um dos itens menos encontrados do jogo, e precificado de acordo.",
    notes:
      "**−40-50% de resistência a veneno do inimigo não existe em nenhum outro lugar.** Veneno não tem Mastery, então a única outra redução de uma build de veneno é o Lower Resist — e os dois empilham, que é a razão inteira de um Necromancer de Poison Nova ser uma build e não uma curiosidade. Contra um monstro apenas resistente isso é a diferença entre uma morte lenta e uma rápida. **Contra um imune a veneno não faz absolutamente nada** — uma linha de −% to Enemy Resistance é aplicada depois da checagem de imunidade e pulada enquanto a imunidade estiver de pé, então rolagem nenhuma desta wand jamais quebrou uma. O Lower Resist é a metade da dupla que quebra a imunidade: cortado a um quinto ele alcança 104% com um ponto seco e 113% no teto da skill, e o valor cheio da wand cai sobre o que ele abrir.\n\n**Leia as duas linhas de skill separadamente.** O +2 em todas as skills é fixo, não uma faixa, e o +1-2 em Poison and Bone Skills vem por cima dele como uma segunda linha, específica daquela árvore — então uma wand rolada dá a um Necromancer de Poison Nova três ou quatro níveis efetivos, não dois. As cinco propriedades foram conferidas contra a extração fixada e contra fontes independentes, e elas concordam.\n\n**O que ele não carrega é +% to Poison Skill Damage.** Esse atributo existe, e vem de um Bramble em vez de vir daqui — uma wand e uma armadura de tronco, então os dois empilham em vez de competir.",
  },
  "arm-of-king-leoric": {
    summary:
      "+2 em duas árvores inteiras e mais dez níveis espalhados por quatro skills de invocação. A wand do Summoner em evolução, e ela chega no 36.",
    dropSummary:
      "Área de nível 44+, o que é o fim do Nightmare. Comum, barata, e entregue de rotina a um Necromancer novo.",
    notes:
      "**Leia as duas linhas de aba juntas.** Os +2 em Summoning empilham com os +3 em Raise Skeleton e os +3 em Skeleton Mastery, então um personagem de nível 36 segurando esta wand levanta esqueletos cinco níveis efetivos acima dos pontos duros dele e faz cada um valer cinco acima também — e os +2 em Poison and Bone aumentam o raio do Corpse Explosion ao mesmo tempo. Nada mais neste nível cobre as duas metades de um Summoner de uma vez.\n\nOs dois procs disparam quando *você* é atingido, e não quando você acerta, o que combina com um personagem que não está no corpo a corpo: são um Bone Prison defensivo e um Bone Spirit ocasional, não um plano de dano. **Esta wand é superada, não substituída** — um White dá mais para a árvore de osso e nada para a de invocação, e a resposta de endgame é uma wand rara ou craftada com +3 numa skill de invocação e +Necromancer skills.",
  },
};
