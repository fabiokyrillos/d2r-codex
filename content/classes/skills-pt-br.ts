import type { Overlay, SkillCopy, SkillTreeCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR das skills e das árvores.
 *
 * Os **nomes** das skills permanecem em inglês (dados invariantes) — é assim
 * que aparecem em toda base de dados, em todo guia e em toda conversa da
 * comunidade brasileira. Só as descrições são traduzidas. Ver ADR 0003.
 */

export const skillTreesPtBr: Overlay<SkillTreeCopy> = {
  "cold-spells": {
    name: "Cold Spells",
    summary: "Congelamento, lentidão e a melhor skill de dano para magic find do jogo.",
    theme:
      "Frio causa menos dano bruto que fogo ou raio, mas congela e desacelera, o que é defesa. Blizzard é a skill forte de farm mais segura do jogo.",
  },
  "lightning-spells": {
    name: "Lightning Spells",
    summary: "O maior teto de dano, mais Teleport e Static Field.",
    theme:
      "Dano enorme espalhado por um alcance imenso, e a árvore que guarda o Teleport — pego por toda Sorceress, independentemente da build.",
  },
  "fire-spells": {
    name: "Fire Spells",
    summary: "Dano em área sustentado, e o motor de mana que é o Warmth.",
    theme:
      "Dano em área consistente ao longo do tempo. O mais fraco no começo, mas Fire Ball e Meteor juntos limpam bem, e o Warmth é pego por quase toda Sorceress.",
  },
  "combat-skills": {
    name: "Combat Skills",
    summary: "Ataques e utilidade defensiva, incluindo o Blessed Hammer.",
    theme:
      "Onde ficam os ataques de verdade do Paladin. O dano mágico do Blessed Hammer é o motivo de a classe ser considerada a melhor faz-tudo do jogo.",
  },
  "offensive-auras": {
    name: "Offensive Auras",
    summary: "Multiplicadores de dano para o grupo inteiro.",
    theme:
      "Uma aura ativa por vez, e ela afeta o grupo todo. Concentration para hammers, Fanaticism para ataques físicos, Conviction para elemental.",
  },
  "defensive-auras": {
    name: "Defensive Auras",
    summary: "Resistências, sustentação e velocidade de movimento.",
    theme:
      "As auras defensivas cobrem sobrevivência e qualidade de vida. Várias valem um ponto só para servirem de troca situacional.",
  },
};

export const skillsPtBr: Overlay<SkillCopy> = {
  // -------------------------------------------------------------------------
  // Sorceress — Cold
  // -------------------------------------------------------------------------
  "ice-bolt": {
    summary:
      "Um projétil congelante único. Fraco sozinho, mas é uma sinergia do Blizzard que vale 20 pontos.",
    mechanics: [
      "Numa build de Blizzard você vai maximizar isso e nunca conjurar — existe puramente como sinergia de +5% por nível.",
    ],
  },
  "frozen-armor": {
    summary: "Bônus de defesa, e congela quem te ataca corpo a corpo.",
    mechanics: [
      "Só uma cold armor pode estar ativa por vez — Frozen, Shiver e Chilling são mutuamente exclusivas.",
      "Frozen Armor dá a menor defesa das três, mas congela o atacante, o que costuma ser o efeito mais útil.",
    ],
  },
  "frost-nova": {
    summary: "Um anel de frio que se expande a partir de você. Bom controle, dano ruim.",
  },
  "ice-blast": {
    summary:
      "Um projétil de alvo único mais forte que congela por completo. Sinergia do Blizzard e preenchimento usável.",
    mechanics: [
      "Diferente da maioria das skills de frio, ela *congela* em vez de apenas desacelerar, o que trava um monstro perigoso na hora.",
      "Vale conjurar durante o cooldown do Blizzard contra alvos únicos.",
    ],
    synergyBonuses: ["+dano por nível"],
  },
  "shiver-armor": {
    summary: "Mais defesa que a Frozen Armor; causa dano a quem ataca em vez de congelar.",
  },
  "glacial-spike": {
    summary:
      "Um projétil de gelo que explode e congela uma área pequena. O controle da build de Blizzard e a segunda maior sinergia dela.",
    mechanics: [
      "Congela tudo no raio da explosão, e é por isso que uma Blizzard Sorceress raramente apanha.",
      "É isto que você conjura enquanto o Blizzard está em cooldown.",
    ],
    synergyBonuses: ["+dano por nível"],
  },
  blizzard: {
    summary:
      "Uma tempestade de estilhaços de gelo numa área ampla. A melhor skill de farm para magic find do jogo.",
    manaCost: "Moderado, e não muda com o cooldown — mana raramente é o limitante.",
    mechanics: [
      "Tem um cooldown fixo que não pode ser reduzido por Faster Cast Rate nem por nada.",
      "Blizzards sobrepostos acumulam — duas conjurações cobrindo o mesmo chão causam os dois danos.",
      "Conjure *à frente* dos inimigos em movimento, para que eles entrem na área, em vez de em cima deles.",
    ],
    synergyBonuses: [
      "+5% de dano por nível",
      "+5% de dano por nível",
      "+5% de dano por nível",
    ],
  },
  "chilling-armor": {
    summary: "A maior defesa das três armaduras; retalia apenas contra atacantes à distância.",
    mechanics: [
      "Responde a ataques à distância, não corpo a corpo. Escolha quando a ameaça forem flechas e virotes.",
    ],
  },
  "frozen-orb": {
    summary:
      "Um orbe lento que dispara projéteis de gelo em todas as direções. Cobertura de área excelente, sem cooldown.",
    mechanics: [
      "Sem cooldown, diferente do Blizzard, então combina com um estilo mais agressivo.",
      "O dano se espalha em muitos projéteis pequenos, o que a torna mais fraca em alvo único e mais forte em grupos.",
    ],
    synergyBonuses: ["+dano por nível"],
  },
  "cold-mastery": {
    summary:
      "Reduz a resistência a frio do inimigo. O maior multiplicador de dano disponível para qualquer build de frio.",
    mechanics: [
      "Contra monstros não imunes, subtrai diretamente da resistência a frio deles, e pode levá-la ao negativo.",
      "Contra monstros *imunes* a frio, funciona com um quinto da eficácia e não consegue quebrar a imunidade.",
      "Como +skills a elevam, a maioria das builds coloca menos pontos aqui do que os 20 que a descrição sugere — nível 17 depois do equipamento é um alvo comum.",
    ],
  },

  // -------------------------------------------------------------------------
  // Sorceress — Lightning
  // -------------------------------------------------------------------------
  "charged-bolt": {
    summary:
      "Um leque de projéteis de curto alcance. Forte à queima-roupa, fraco à distância.",
  },
  "static-field": {
    summary:
      "Remove 25% da vida atual de tudo por perto. Funciona em bosses, e não escala com nada.",
    manaCost: "Baixo — 9 de mana em todos os níveis",
    mechanics: [
      "Causa 25% da vida **atual** do alvo, não da vida máxima. Conjurações repetidas perdem efeito rapidamente.",
      "Tem um piso: não reduz um monstro abaixo de **33% de vida no Nightmare** ou **50% no Hell**. No Normal não há piso.",
      "Pontos de skill só aumentam o **raio**, nunca a potência. Um ponto basta para quase toda build.",
      "As fontes discordam sobre se a resistência a raio do inimigo reduz o efeito — veja a página de mecânicas. Trate como ferramenta para amolecer alvos para o mercenário, não como resposta confiável à imunidade.",
    ],
  },
  telekinesis: {
    summary:
      "Pega itens e aciona objetos à distância, e empurra inimigos. Também é o pré-requisito do Teleport.",
    mechanics: [
      "Toda Sorceress coloca um ponto só porque o Teleport exige.",
      "Abre baús e pega poções do outro lado da tela, o que é um ganho real de qualidade de vida.",
      "O empurrão e o breve atordoamento compram tempo contra um monstro perigoso.",
    ],
  },
  nova: {
    summary:
      "Um anel de raio que se expande a partir de você. O centro da build de Nova.",

  },
  lightning: {
    summary: "Um raio que atinge instantaneamente por toda a tela.",
    mechanics: [
      "Usa a animação de conjuração de Lightning, mais lenta, não a padrão da Sorceress. Planeje Faster Cast Rate pela tabela de raio.",
    ],
    synergyBonuses: ["+dano por nível"],
  },
  "chain-lightning": {
    summary:
      "Um raio que salta entre inimigos próximos. A principal skill de limpeza da Lightning Sorceress.",
    mechanics: ["Também usa a animação de conjuração de Lightning, mais lenta."],
    synergyBonuses: ["+dano por nível", "+dano por nível"],
  },
  teleport: {
    summary:
      "Move instantaneamente para qualquer ponto visível. A skill mais valiosa de Diablo II.",
    manaCost: "Moderado, e reduzido pelo nível da skill",
    mechanics: [
      "Um ponto é tudo que qualquer build precisa. Pontos extras só reduzem o custo de mana.",
      "Atravessa paredes e monstros, e é isso que torna as rotas de farm da Sorceress tão rápidas.",
      "A velocidade do Teleport é governada pelo Faster Cast Rate — é por isso que 105% de FCR importa tanto.",
      "Toda outra classe precisa de uma runeword Enigma para fazer isso. A Sorceress ganha no nível 18 por um ponto.",
    ],
  },
  "thunder-storm": {
    summary:
      "Um buff temporário que periodicamente atinge um inimigo próximo aleatório com um raio.",
    mechanics: [
      "Acumula com uma cold armor e com o Energy Shield — não são mutuamente exclusivos.",
    ],

  },
  "energy-shield": {
    summary: "Desvia parte do dano recebido para a mana em vez da vida.",
    mechanics: [
      "Poderoso, mas exigente: precisa de uma reserva grande de mana e de eficiência de mana por dano vinda de níveis de skill para valer o investimento.",
      "A maioria das Sorceresses de Blizzard e de fogo simplesmente ignora e coloca os pontos em vida.",
    ],
  },
  "lightning-mastery": {
    summary:
      "Aumenta o dano de raio. Diferente da Cold Mastery, esta aumenta o dano em vez de perfurar resistência.",
    mechanics: [
      "Essa assimetria é importante: a Cold Mastery reduz a resistência do inimigo, enquanto Lightning e Fire Mastery aumentam o seu dano. Não são equivalentes, e interagem de formas muito diferentes com imunidades.",
    ],
  },

  // -------------------------------------------------------------------------
  // Sorceress — Fire
  // -------------------------------------------------------------------------
  "fire-bolt": {
    summary:
      "Um projétil de fogo único. O ataque padrão de nível 1 da Sorceress e uma sinergia do Fire Ball.",
  },
  warmth: {
    summary: "Aumenta a regeneração de mana. Pego por essencialmente toda Sorceress.",
    mechanics: [
      "Um ponto é o padrão. É a solução de mana mais barata do jogo e funciona desde o nível 1.",
      "Mesmo builds com um mercenário de Insight costumam manter o ponto — não custa nada relevante.",
    ],
  },
  inferno: {
    summary: "Um jato curto de chamas. Raramente usado depois do começo do Normal.",
  },
  blaze: {
    summary: "Deixa um rastro de fogo atrás de você enquanto se move.",

  },
  "fire-ball": {
    summary:
      "Um projétil de fogo que explode. O cavalo de batalha da Fire Sorceress do nível 12 até o fim do jogo.",
    mechanics: [
      "Sem cooldown e com bom dano em área, o que a torna a skill de fogo mais prática para limpeza geral.",
    ],
    synergyBonuses: ["+dano por nível"],
  },
  "fire-wall": {
    summary:
      "Uma parede de fogo no chão. Dano alto contra qualquer coisa obrigada a ficar dentro dela.",
    synergyBonuses: ["+dano por nível"],
  },
  enchant: {
    summary:
      "Adiciona dano de fogo aos ataques de um alvo. Pode ser conjurada em outros jogadores e no seu mercenário.",
    mechanics: [
      "É a base da build de suporte Enchantress — ela buffa o dano de arma do grupo inteiro.",
      "Também é uma escolha forte de qualidade de vida para qualquer Sorceress com mercenário de dano físico.",
    ],
  },
  meteor: {
    summary:
      "Chama um meteoro que causa dano de impacto e deixa uma área em chamas. Dano alto, com atraso.",
    mechanics: ["Há um atraso entre a conjuração e o impacto. Antecipe o alvo, como no Blizzard."],
    synergyBonuses: ["+dano por nível", "+dano por nível"],
  },
  hydra: {
    summary:
      "Invoca uma torreta de fogo de três cabeças que ataca sozinha por um tempo.",
    mechanics: ["Conjure e esqueça — dá para lançar e sair, o que a torna bastante segura."],
    synergyBonuses: ["+dano por nível"],
  },
  "fire-mastery": {
    summary:
      "Aumenta o dano de fogo. Como a Lightning Mastery, aumenta o dano em vez de perfurar resistência.",
  },

  // -------------------------------------------------------------------------
  // Paladin — Combat Skills
  // -------------------------------------------------------------------------
  sacrifice: {
    summary: "Um ataque pesado que também causa dano a você.",
  },
  smite: {
    summary:
      "Uma pancada de escudo que sempre acerta e sempre atordoa. O único ataque do jogo que não pode errar.",
    mechanics: [
      "O Smite nunca erra — ele nem faz o teste contra attack rating.",
      "Ele atordoa, e é por isso que é a ferramenta padrão para Uber Tristram: um Smiter trava bosses Uber que de outra forma matariam qualquer coisa.",
      "O dano vem do escudo, não da arma.",
    ],
  },
  "holy-bolt": {
    summary:
      "Um projétil mágico que fere undead e cura jogadores. Pré-requisito do Blessed Hammer.",
    mechanics: [
      "Fere apenas undead, mas cura jogadores aliados por onde passa — uma skill de grupo genuinamente útil.",
    ],
  },
  zeal: {
    summary:
      "Uma sequência de ataques rápidos contra alvos próximos. A skill central do Zealot.",
    synergyBonuses: ["+dano por nível"],
  },
  charge: {
    summary:
      "Avança contra um alvo e acerta na chegada. Serve também como mobilidade barata antes do Enigma.",
  },
  vengeance: {
    summary:
      "Converte parte do dano físico em fogo, frio e raio simultaneamente.",
    mechanics: [
      "Como causa os três elementos ao mesmo tempo, é a resposta clássica à imunidade física — a build Avenger é construída inteiramente em cima disso.",
    ],
  },
  "blessed-hammer": {
    summary:
      "Um martelo que gira para fora causando dano mágico. Quase nada no jogo resiste.",
    mechanics: [
      "Causa dano **mágico**. Só um punhado de monstros nos Atos 2 e 3 é imune a mágico, e é a maior razão de esta build ser considerada a melhor faz-tudo.",
      "Causa 150% de dano contra Undead e Demons, que é a maior parte do que você enfrenta no Chaos Sanctuary e nas runs de Baal.",
      "**Ele gira, não voa reto.** Os hammers viajam numa espiral que se expande no sentido horário, começando por volta da posição de 9 horas. Hammerdins novos acham a build fraca — eles estão errando.",
      "A Concentration multiplica o dano diretamente enquanto está ativa.",
    ],
    synergyBonuses: [
      "+14% de dano mágico por nível",
      "+14% de dano mágico por nível",
    ],
  },
  conversion: {
    summary: "Transforma temporariamente um monstro num aliado que luta por você.",
  },
  "holy-shield": {
    summary:
      "Um buff temporário que dá muita defesa e chance de bloqueio. Toda build de Paladin pega.",
    mechanics: [
      "O bônus de bloqueio é o que permite ao Paladin alcançar e manter o bloqueio máximo, que é a principal vantagem de sobrevivência da classe.",
      "Um ponto costuma bastar — equipamento com +skills eleva bem o nível efetivo.",
    ],

  },
  "fist-of-the-heavens": {
    summary:
      "Um raio somado a holy bolts que se espalham. Dano de raio e mágico juntos.",

  },

  // -------------------------------------------------------------------------
  // Paladin — Offensive Auras
  // -------------------------------------------------------------------------
  might: { summary: "Aumenta o dano físico seu e do seu grupo." },
  "holy-fire": { summary: "Adiciona dano de fogo aos ataques e queima inimigos próximos." },
  thorns: { summary: "Devolve parte do dano corpo a corpo ao atacante." },
  "blessed-aim": {
    summary:
      "Aumenta o attack rating. Num Hammerdin, é maximizada puramente como sinergia e nunca ativada.",
    mechanics: [
      "É o exemplo mais claro da peculiaridade do sistema de auras: uma aura maximizada contribui com a sinergia dela esteja ou não sendo a aura ativa.",
    ],
  },
  concentration: {
    summary:
      "Aumenta o dano e evita interrupção. A aura ativa do Hammerdin.",
    mechanics: [
      "Multiplica o dano mágico do Blessed Hammer diretamente — não é sinergia, é multiplicador ao vivo, e precisa ser a aura que você está rodando.",
      "Também dá chance de não ser interrompido ao atacar ou conjurar.",
    ],
  },
  "holy-freeze": {
    summary:
      "Congela tudo por perto, reduzindo ataque e movimento. A aura defensiva mais forte do jogo.",
    mechanics: [
      "Desacelerar tudo ao seu redor vale mais que defesa bruta no Hell, e é por isso que é a aura padrão de mercenário no Hardcore.",
    ],
  },
  "holy-shock": {
    summary: "Adiciona dano de raio aos ataques. O centro do Zealot de Holy Shock.",
  },
  sanctuary: {
    summary: "Fere e empurra undead, e ignora a resistência física deles.",
  },
  fanaticism: {
    summary:
      "Aumenta velocidade de ataque, attack rating e dano. A melhor aura para ataques físicos do jogo.",
    mechanics: [
      "O bônus de velocidade de ataque vale para o grupo inteiro, e é por isso que um Paladin de Fanaticism é tão valioso em grupo.",
      "Vale um ponto em quase qualquer Paladin, como troca situacional.",
    ],
  },
  conviction: {
    summary:
      "Reduz a resistência a fogo, frio e raio dos inimigos, e a defesa deles. É a aura que a runeword Infinity concede.",
    mechanics: [
      "É a mesma aura que o Infinity fornece, e é por isso que o Infinity é tão transformador para casters elementais.",
      "Reduz resistência a fogo, frio e raio — não a veneno, e não a mágico.",
    ],
  },

  // -------------------------------------------------------------------------
  // Paladin — Defensive Auras
  // -------------------------------------------------------------------------
  prayer: { summary: "Regenera vida sua e do seu grupo." },
  "resist-fire": {
    summary: "Aumenta a resistência a fogo, e o teto máximo dela.",
    mechanics: [
      "O aumento da resistência máxima é a parte valiosa: ele eleva o próprio teto de 75%, em direção ao limite de 95% do jogo.",
      "**Ele vale dois valores diferentes.** Com a aura ativa você ganha +1% de resistência máxima a fogo por ponto duro. Com ela desligada você mantém metade, arredondada para baixo. Vinte pontos duros são +20% ativa, +10% passiva.",
      "Os dois números leem o nível *base* da skill, então +skills de equipamento não aumentam nenhum dos dois. Este é um dos poucos lugares em que só o ponto duro conta.",
    ],
  },
  "resist-cold": {
    summary: "Aumenta a resistência a frio e o máximo dela.",
    mechanics: [
      "Mesma regra de dois níveis das outras duas auras de resistência: +1% de resistência máxima a frio por ponto duro enquanto ela roda, metade disso arredondada para baixo enquanto não roda, e +skills de equipamento não aumentam nenhum dos dois.",
    ],
  },
  defiance: { summary: "Aumenta a defesa sua e do seu grupo." },
  "resist-lightning": {
    summary: "Aumenta a resistência a raio e o máximo dela.",
    mechanics: [
      "**+1% de resistência máxima a raio por ponto duro enquanto a aura está ativa, e metade disso — arredondada para baixo — enquanto não está.** Vinte pontos duros são +20% ativa ou +10% passiva, contra o limite de 95% do jogo.",
      "Os dois números leem o nível *base*, então +skills de equipamento não aumentam nenhum. Um único ponto vale +1% ativa e absolutamente nada passiva, porque metade de um arredonda para zero.",
      "Às vezes maximizada num Hammerdin para o Uber Tristram. Leia os dois números antes de comprometer vinte pontos: manter a Concentration ativa significa que você está comprando a metade passiva.",
    ],
  },
  cleansing: {
    summary: "Reduz a duração de maldições e veneno em você e no seu grupo.",

  },
  vigor: {
    summary:
      "Aumenta velocidade de movimento e recuperação de stamina. Também é sinergia do Blessed Hammer.",
    mechanics: [
      "Serve também como uma das duas sinergias do Blessed Hammer, a +14% de dano mágico por nível, então um Hammerdin maximiza de qualquer jeito, queira ou não a velocidade.",
    ],
  },
  meditation: {
    summary:
      "Regenera mana rapidamente para você e o grupo. É a aura que a runeword Insight concede.",
    mechanics: [
      "É a mesma aura que o Insight fornece, e é por isso que uma única runeword barata num mercenário resolve de vez a mana de um caster.",
    ],
  },
  redemption: {
    summary:
      "Consome cadáveres próximos para restaurar vida e mana. Uma das melhores ferramentas de sustentação do jogo.",
    mechanics: [
      "Trocar para Redemption por um instante depois de limpar um grupo reabastece vida e mana por completo. Vale um ponto em todo Paladin.",
      "Também destrói cadáveres, o que importa se algum companheiro de grupo depende deles.",
    ],
  },
  salvation: {
    summary: "Aumenta a resistência a fogo, frio e raio sua e do seu grupo.",
  },
};
