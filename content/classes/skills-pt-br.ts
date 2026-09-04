import type { Overlay, SkillCopy, SkillTreeCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR das skills e das árvores.
 *
 * Os **nomes** das skills permanecem em inglês (dados invariantes) — é assim
 * que aparecem em toda base de dados, em todo guia e em toda conversa da
 * comunidade brasileira. Só as descrições são traduzidas. Ver ADR 0003.
 */

export const skillTreesPtBr: Overlay<SkillTreeCopy> = {
  "javelin-and-spear": {
    name: "Javelin and Spear",
    summary: "Raio arremessado e corpo a corpo, mais a resposta física da classe para ele.",
    theme:
      "Lightning Fury limpa grupos mais rápido que quase tudo no jogo e Charged Strike apaga chefes, mas nenhuma das duas encosta num imune a raio. Jab fica na barra exatamente por isso.",
  },
  "passive-and-magic": {
    name: "Passive and Magic",
    summary: "Porcentagens sempre ativas que toda build de Amazon quer.",
    theme:
      "Seis destas dez skills são porcentagens passivas, e valem tanto com arco quanto com lança. É a árvore que torna a Amazon difícil de matar e a razão de os dois chamarizes dela segurarem tão bem.",
  },
  "bow-and-crossbow": {
    name: "Bow and Crossbow",
    summary: "Arquearia física, e um ramo por elemento.",
    theme:
      "Strafe e Multiple Shot são dano de arma puro; as flechas elementais somam um elemento por cima. O ramo escolhido decide o que dá para farmar, porque uma build de arco não tem aura para quebrar imunidade.",
  },
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
  summoning: {
    name: "Summoning Spells",
    summary: "Um exército que luta por você, e as passivas que o mantêm de pé.",
    theme:
      "O jeito mais seguro de jogar a classe e a razão de ela ser escolha padrão no Hardcore: um exército de esqueletos absorve o que iria acertar você. As duas masteries e o Summon Resist rendem muito mais para o exército do que mais um tipo de criatura invocada.",
  },
  "poison-and-bone": {
    name: "Poison and Bone Spells",
    summary: "Dano mágico que quase nada resiste, veneno ao longo do tempo e o Corpse Explosion.",
    theme:
      "Duas escolas de dano numa árvore só. O ramo de osso causa dano mágico, que pouquíssimos monstros resistem; o veneno é aplicado ao longo do tempo e é o único elemento sem Mastery para aumentá-lo. O Corpse Explosion fica entre os dois e pertence a toda build da classe.",
  },
  curses: {
    name: "Curses",
    summary: "Dez maldições — uma por alvo, de cada vez.",
    theme:
      "Um monstro carrega exatamente uma maldição: lançar a segunda substitui a primeira. É essa regra que transforma a árvore num conjunto de escolhas em vez de um empilhamento, e é por isso que a discussão nunca é qual maldição é a mais forte, e sim qual você está abrindo mão de usar.",
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
      "Contra monstros *imunes* a frio, não faz absolutamente nada. Não quebra a imunidade em nível nenhum, e enquanto a imunidade estiver de pé ela não é reduzida a uma fração — ela é ignorada.",
      "Depois que outra coisa quebrar a imunidade — um Cold Rupture, a Conviction de um mercenário, o Lower Resist de um Necromancer — ela passa a valer sobre o que sobrou, com um quinto do valor desde o Patch 2.6.",
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
  // ---------------------------------------------------------------------------
  // Amazon
  // ---------------------------------------------------------------------------
  jab: {
    summary:
      "Três estocadas rápidas com spear ou javelin. A resposta da Amazon de javelin à imunidade a raio.",
    mechanics: [
      "A animação vai até o fim — depois que começa, as três estocadas acontecem.",
      "Toda build de javelin guarda um ponto aqui como resposta a um imune a raio, já que o dano da árvore de javelin é quase todo elétrico.",
    ],
  },
  "power-strike": {
    summary: "Um golpe corpo a corpo que soma dano de raio ao dano da própria arma.",
    mechanics: [
      "Raramente usada como ataque depois dos primeiros níveis. É maximizada porque alimenta as outras quatro skills de raio de javelin.",
    ],
    synergyBonuses: [
      "+14% de dano por nível",
      "+14% de dano por nível",
      "+14% de dano por nível",
    ],
  },
  "poison-javelin": {
    summary:
      "Um javelin arremessado que deixa uma linha de veneno. O dano acontece ao longo da duração, e não no impacto.",
    mechanics: [
      "A nuvem segue o trajeto do javelin, então ela é arremessada atravessando um grupo, e não contra um alvo só.",
      "Veneno impede o monstro de regenerar enquanto durar, e em nível alto isso é quase um minuto.",
    ],
    synergyBonuses: ["+12% de dano por nível"],
  },
  impale: {
    summary: "Uma estocada lenta e ininterrompível, com bônus alto de dano e lentidão no alvo.",
    mechanics: [
      "Gasta durabilidade da arma quando acerta, e por isso se usa em alvo único em vez de repetir sem parar.",
      "Não pode ser interrompida depois de iniciada, o que a torna uma abertura confiável contra chefe.",
    ],
  },
  "lightning-bolt": {
    summary:
      "Arremessa um javelin cujo dano físico é convertido inteiramente em raio, mais o raio próprio da skill.",
    mechanics: [
      "O raio perfura, então ele se alinha bem contra uma fileira de monstros.",
    ],
    synergyBonuses: [
      "+3% de dano por nível",
      "+3% de dano por nível",
      "+3% de dano por nível",
      "+3% de dano por nível",
    ],
  },
  "charged-strike": {
    summary:
      "Libera raios carregados da ponta da lança. A skill de alvo único mais forte que a Amazon tem.",
    mechanics: [
      "O golpe rola contra o attack rating como qualquer ataque e, ao acertar, entrega o dano de raio da skill. Os raios são criados à parte, e é por isso que a quantidade deles importa mais que o golpe.",
      "A quantidade de raios cresce com o nível da skill, e todos podem acertar um único alvo à queima-roupa. É daí que vem o dano em chefe.",
      "Ao contrário da Power Strike, a skill não contribui com o dano físico base da arma: o dano próprio dela é todo de raio.",
    ],
    synergyBonuses: [
      "+14% de dano por nível",
      "+14% de dano por nível",
      "+14% de dano por nível",
    ],
  },
  "plague-javelin": {
    summary:
      "Um javelin arremessado que deixa veneno pelo caminho e estoura numa nuvem onde para.",
    mechanics: [
      "Duração menor que a do Poison Javelin, mas com muito mais dano concentrado nela.",
      "**Os três segundos dela não crescem com o nível da skill.** O patch 2.4 do Diablo II: Resurrected fixou a duração no código; a coluna que a alongava nunca foi editada, então um banco de dados que lê a tabela ainda reporta quase sete segundos no nível 20.",
      "A área é o que faz dela uma skill de Cow Level: a nuvem cobre mais chão que qualquer outro ataque de javelin.",
    ],
    synergyBonuses: ["+14% de dano por nível"],
  },
  fend: {
    summary: "Ataca todos os inimigos adjacentes numa sequência, um alvo a mais por nível de skill.",
    mechanics: [
      "A sequência inteira é uma animação só. Levar dano no meio dela pode te prender ali, e esse é o principal risco da build.",
    ],
  },
  "lightning-strike": {
    summary:
      "Um golpe corpo a corpo que inicia uma corrente de raio, saltando entre inimigos próximos.",
    mechanics: [
      "O próprio golpe rola contra o attack rating e entrega o dano cheio da arma mais o raio da skill; a corrente é criada à parte, a partir do alvo atingido.",
      "A corrente pode voltar num alvo que já acertou, e por isso ela supera a Lightning Fury contra grupos espalhados.",
    ],
    synergyBonuses: [
      "+11% de dano por nível",
      "+11% de dano por nível",
      "+11% de dano por nível",
    ],
  },
  "lightning-fury": {
    summary:
      "Um javelin arremessado que se divide em raios buscando todos os inimigos por perto. A assinatura da classe.",
    mechanics: [
      "O próprio javelin perfura, e cada alvo atravessado libera outra rajada de raios. Pierce é o que transforma isto de bom em absurdo.",
      "A quantidade de raios cresce com o nível da skill, então ela escala com +skills mais que quase qualquer coisa no jogo.",
    ],
    synergyBonuses: [
      "+1% de dano por nível",
      "+1% de dano por nível",
      "+1% de dano por nível",
      "+1% de dano por nível",
    ],
  },
  "inner-sight": {
    summary: "Ilumina os inimigos próximos e reduz a defesa deles.",
    mechanics: [
      "Pega-se sobretudo como o ponto único que libera Slow Missiles e, por ela, Decoy e Valkyrie.",
    ],
  },
  "critical-strike": {
    summary: "Chance de dobrar o dano físico. Sempre ativa, com qualquer arma.",
    mechanics: [
      "Acumula com Deadly Strike do equipamento como duas rolagens separadas, e não como uma chance maior.",
      "Não vale nada para a Charged Strike, cujo dano é todo de raio e não carrega nada do físico da arma.",
    ],
  },
  dodge: {
    summary: "Chance de desviar por completo de um ataque corpo a corpo parada ou atacando.",
    mechanics: [
      "Desviar anula o ataque por completo: isto não é redução de dano.",
      "Dodge, Avoid e Evade cobrem três situações diferentes e não se sobrepõem.",
    ],
  },
  "slow-missiles": {
    summary: "Desacelera os projéteis inimigos, tornando grupos à distância bem menos perigosos.",
    mechanics: [
      "Um dos botões defensivos mais fortes do jogo contra os atiradores do Hell, e custa um ponto.",
    ],
  },
  avoid: {
    summary: "Chance de desviar de um ataque à distância ou mágico parada ou atacando.",
  },
  penetrate: {
    summary: "Aumenta o attack rating. Sempre ativa, e também aumenta o da Valkyrie.",
    mechanics: [
      "Pontos fixos aqui alimentam o attack rating da própria Valkyrie, e essa é uma razão real para colocar mais de um.",
    ],
  },
  decoy: {
    summary:
      "Cria uma cópia da Amazon que os inimigos atacam no seu lugar. Também alimenta a vida da Valkyrie.",
    mechanics: [
      "Ela não anda nem ataca. A função dela é ser alvejada em algum lugar onde você não está.",
      "Pontos fixos aqui aumentam a vida da Valkyrie, então nunca é ponto perdido numa build que a invoca.",
    ],
  },
  evade: {
    summary: "Chance de desviar de qualquer ataque enquanto anda ou corre.",
    mechanics: [
      "É a que cobre você em movimento, situação em que Dodge e Avoid não fazem nada.",
    ],
  },
  valkyrie: {
    summary: "Invoca uma guerreira que luta ao seu lado e absorve golpes destinados a você.",
    mechanics: [
      "Ela herda os seus níveis de Dodge, Avoid, Evade e Critical Strike, e Penetrate aumenta o attack rating dela.",
      "Invoque de novo quando ela morrer; não há cooldown que valha planejamento.",
    ],
    synergyBonuses: ["+20% de vida por nível"],
  },
  pierce: {
    summary:
      "Chance de o projétil atravessar o alvo e seguir adiante. O multiplicador por trás da Lightning Fury.",
    mechanics: [
      "Cada inimigo que um javelin de Lightning Fury atravessa libera outra rajada de raios, então isto multiplica a skill em vez de somar a ela.",
      "Pierce do equipamento acumula com a skill, e por isso as builds indicam uma chance a alcançar em vez de um número de pontos a gastar.",
    ],
  },
  "magic-arrow": {
    summary:
      "Converte parte do dano físico da flecha em mágico, e não consome flechas para disparar.",
    mechanics: [
      "Dano mágico quase não é resistido por nada, então ela continua útil muito depois de o dano parar de escalar.",
      "Ela cria a própria flecha, e por isso nunca esvazia a aljava.",
    ],
  },
  "fire-arrow": {
    summary: "Soma dano de fogo ao disparo e converte parte do dano físico dele em fogo.",
    synergyBonuses: ["+12% de dano por nível"],
  },
  "cold-arrow": {
    summary:
      "Soma dano de frio e um chill, e converte parte do dano físico do disparo em frio.",
    synergyBonuses: ["+12% de dano por nível"],
  },
  "multiple-shot": {
    summary: "Dispara um leque de flechas em cone. A limpeza física mais ampla da Amazon.",
    mechanics: [
      "Cada flecha carrega três quartos do dano do arco, e não o dano inteiro.",
      "Só as duas flechas centrais aplicam efeitos de acerto, como knockback ou roubo de vida.",
    ],
  },
  "exploding-arrow": {
    summary: "Uma flecha que explode no impacto, causando dano em tudo ao redor do alvo.",
    mechanics: [
      "Combinada com Pierce, um disparo através de um grupo denso dispara uma cadeia de explosões.",
      "Dano de fogo fixo vindo do equipamento aumenta a explosão, não só a flecha.",
    ],
    synergyBonuses: ["+14% de dano por nível"],
  },
  "ice-arrow": {
    summary: "Soma dano de frio e congela o alvo de verdade, em vez de apenas desacelerá-lo.",
    synergyBonuses: ["+8% de dano por nível", "+5% de duração do congelamento por nível"],
  },
  "guided-arrow": {
    summary:
      "Uma flecha que persegue o alvo e não pode errar. A resposta de alvo único da Amazon de arco.",
    mechanics: [
      "Ela persegue, então acerta fazendo curva e atravessando multidão: é isso que faz dela uma skill de chefe.",
    ],
    synergyBonuses: ["+12% de dano por nível"],
  },
  strafe: {
    summary: "Dispara em vários alvos numa rajada, um tiro a mais por nível de skill até um teto.",
    mechanics: [
      "Os alvos são escolhidos aleatoriamente dentro do alcance, então ela é mais forte quando tudo já está à sua frente.",
      "Você fica travada na animação durante a duração dela.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+5% de dano por nível"],
  },
  "immolation-arrow": {
    summary: "Uma flecha que explode e deixa uma mancha de fogo queimando no chão.",
    mechanics: [
      "O fogo no chão é o ponto: ele transforma um corredor num lugar por onde os monstros não passam.",
    ],
    synergyBonuses: ["+10% de dano por nível"],
  },
  "freezing-arrow": {
    summary: "Uma flecha que estoura numa área de frio, congelando tudo que alcança.",
    mechanics: [
      "Congelar um grupo é tão bom quanto matá-lo enquanto durar, e por isso essa build passa a sensação de segura.",
      "A duração do congelamento dela não cresce com o próprio nível: só Ice Arrow a estende.",
    ],
    synergyBonuses: ["+12% de dano por nível", "+5% de duração do congelamento por nível"],
  },

  // -------------------------------------------------------------------------
  // Necromancer — Summoning Spells
  // -------------------------------------------------------------------------
  "skeleton-mastery": {
    summary:
      "Soma vida e dano a cada esqueleto, mago esqueleto e revive que você levantar.",
    mechanics: [
      "Cada ponto duro soma **+8 de vida e +2 de dano** à criatura invocada, e o jogo lê o nível *efetivo* desta skill — ou seja, +skills do equipamento contam aqui, diferente de uma sinergia.",
      "Ela carrega mais dois parâmetros que o jogo rotula só para o Revive: **+5% de vida e +10% de dano por nível** no monstro revivido.",
      "O bônus é gravado no lacaio no instante em que ele é criado. Aumentar esta skill não faz nada pelos esqueletos que já estão de pé; o exército precisa ser levantado de novo para receber o bônus.",
    ],
  },
  "raise-skeleton": {
    summary: "Levanta um esqueleto guerreiro de um cadáver. A espinha dorsal do Summoner.",
    mechanics: [
      "O limite é **um esqueleto por nível até o terceiro, depois dois mais um a cada três níveis** — oito no nível duro 20, e mais conforme +skills elevam o nível efetivo.",
      "Cada conjuração precisa de um cadáver, então a primeira morte de uma sala é sempre a demorada.",
      "Os magos esqueletos são contados à parte e não dividem esse limite.",
    ],
  },
  "clay-golem": {
    summary: "Um golem lento e resistente cujos golpes desaceleram o que tocam.",
    synergyBonuses: ["+5% de vida por nível", "+6% de dano por nível", "+35 de defesa por nível"],
    mechanics: [
      "A lentidão que ele aplica sobe de **0% em direção a um teto de 75%** numa curva de retornos decrescentes — a maior lentidão disponível para a classe, e a razão de um ponto nele valer a pena até em builds que nunca invocam mais nada.",
      "Você só pode ter **um golem por vez**. As quatro skills de golem dividem um único tipo de criatura invocada com máximo de um, então invocar outro substitui este.",
    ],
  },
  "golem-mastery": {
    summary:
      "Aumenta vida, velocidade e chance de acerto do golem. Vale para qualquer um deles.",
    mechanics: [
      "**+20% de vida com um ponto e +20% a mais por nível**, além de **+25 de chance de acerto e +25 a mais por nível**.",
      "Também eleva a velocidade de movimento do golem de **0% em direção a um teto de 40%** numa curva de retornos decrescentes, que é o que impede o Clay Golem de ficar para trás.",
      "Isto não é uma sinergia no sentido do jogo: os golens leem o nível efetivo desta skill, então +skills do equipamento a aumentam.",
    ],
  },
  "raise-skeletal-mage": {
    summary:
      "Levanta um esqueleto que conjura um de quatro elementos, sorteado no momento da invocação.",
    mechanics: [
      "Mesma fórmula de contagem do Raise Skeleton e um **limite separado**: um Summoner mantém os dois exércitos ao mesmo tempo.",
      "O elemento é sorteado quando o mago é levantado e não pode ser escolhido, e é por isso que o dano do grupo é pouco confiável contra qualquer coisa com a imunidade correspondente.",
      "O nível da skill de ataque dele acompanha o Skeleton Mastery, então os magos ficam mais fortes com a mesma passiva que fortalece os guerreiros.",
    ],
  },
  "blood-golem": {
    summary: "Um golem que rouba vida do que acerta, e divide parte dela com você.",
    synergyBonuses: [
      "+20 de chance de acerto por nível",
      "+6% de dano por nível",
      "+35 de defesa por nível",
    ],
    mechanics: [
      "O roubo de vida dele sobe de **75% em direção a um teto de 150%** numa curva de retornos decrescentes, e **30% do que ele rouba é repassado a você**.",
      "**25% da cura que você recebe é repassada ao golem**, então as poções o mantêm vivo junto com você.",
      "O antigo vínculo de vida — o conjurador levando parte do dano que o golem sofre — **não está nas tabelas fixadas**: a coluna que o carrega está zerada. Guias escritos antes dessa mudança ainda o descrevem como um risco no Hardcore.",
    ],
  },
  "summon-resist": {
    summary:
      "Dá resistência elemental e a veneno aos seus lacaios. Um ponto já é um salto grande.",
    mechanics: [
      "A resistência sobe de **20% em direção a um teto de 75%** numa curva de retornos decrescentes, então o primeiro ponto compra quase tudo o que vinte comprariam.",
      "Ela é aplicada ao lacaio no instante em que ele é criado, o que significa que aumentar a skill não faz nada por um exército já de pé.",
      "Ela não sobrescreve um elemento que o lacaio já absorve — o Fire Golem mantém a própria absorção de fogo em vez de receber resistência a fogo.",
      "Na implementação de referência do motor antigo ela é aplicada a esqueletos, magos esqueletos e golens, e **não** aos revives. Se Diablo II: Resurrected mudou isso é algo que este repositório não conseguiu estabelecer.",
    ],
  },
  "iron-golem": {
    summary:
      "Consome um item para construir um golem que carrega as propriedades dele. O item some.",
    synergyBonuses: [
      "+5% de vida por nível",
      "+20 de chance de acerto por nível",
      "+6% de dano por nível",
    ],
    mechanics: [
      "O item escolhido é **destruído** e vira o golem. Esta é a única skill da classe que pode custar algo que você não recupera.",
      "Ele carrega uma aura própria de devolução de dano, além do que quer que o item de origem forneça.",
      "Continua sendo um golem por vez: invocar qualquer outro o substitui, e o item não volta.",
    ],
  },
  "fire-golem": {
    summary: "Um golem que roda uma aura de Holy Fire e é curado, não ferido, por fogo.",
    synergyBonuses: [
      "+5% de vida por nível",
      "+20 de chance de acerto por nível",
      "+35 de defesa por nível",
    ],
    mechanics: [
      "Ele roda **Holy Fire no nível 7, subindo um por nível da skill até o teto de 30** — uma aura de verdade, afetando tudo por perto.",
      "A absorção de fogo dele sobe de **25% em direção a 100%** numa curva de retornos decrescentes, e é por isso que ele é o golem que sobrevive aos grupos fire enchanted do Hell.",
      "A tabela de dano desta página é o dano de fogo que a aura acrescenta, não a faixa de uma arma.",
    ],
  },
  revive: {
    summary:
      "Levanta um monstro morto para lutar por você durante três minutos. A quantidade é o nível da skill.",
    mechanics: [
      "**A quantidade que você mantém é o nível efetivo da skill**, então +skills do equipamento a aumentam diretamente.",
      "Cada revive dura **4500 frames — três minutos** — e não pode ser renovado. É isso que faz dele uma leva de corpos e não um exército permanente.",
      "A vida do revive é **sorteada de novo a partir da faixa de vida base daquele tipo de monstro** no nível e na dificuldade dele, e não copiada do cadáver. Um Champion revive com a vida comum da espécie dele.",
      "Se o nível do monstro estiver acima do nível do seu personagem, a vida dele é reduzida nessa proporção.",
      "Só monstros que o jogo marca como revivíveis podem ser levantados, e é por isso que alguns grupos nunca rendem um.",
    ],
  },

  // -------------------------------------------------------------------------
  // Necromancer — Poison and Bone Spells
  // -------------------------------------------------------------------------
  teeth: {
    summary: "Uma rajada de lascas de osso. O dano mágico mais barato do jogo no nível 1.",
    synergyBonuses: [
      "+15% de dano por nível",
      "+15% de dano por nível",
      "+15% de dano por nível",
      "+15% de dano por nível",
    ],
    mechanics: [
      "Dispara **dois projéteis no nível 1 e mais um por nível, com teto de 24** — o mesmo teto do Multiple Shot, lido do mesmo formato de coluna.",
      "Os projéteis se abrem em leque, então a quantidade importa muito mais contra um grupo do que contra um alvo só.",
      "Causa dano mágico, que só um punhado de monstros do jogo resiste.",
    ],
  },
  "bone-armor": {
    summary: "Um escudo que absorve uma quantidade fixa de dano, depois quebra e é reconjurado.",
    synergyBonuses: ["+15 de dano absorvido por nível", "+15 de dano absorvido por nível"],
    mechanics: [
      "Absorve **20 de dano no nível 1 e mais 15 por nível**, e **mais 15 para cada ponto em Bone Wall e Bone Prison**.",
      "Absorve dano **físico** — corpo a corpo e de projétil. Um acerto elemental passa direto por ele, que é o contrário do que o nome sugere para a maioria dos leitores.",
      "Quando a reserva acaba o efeito termina e precisa ser reconjurado. Não é uma duração.",
    ],
  },
  "poison-dagger": {
    summary: "Um ataque corpo a corpo que soma dano de veneno. Exige uma adaga.",
    synergyBonuses: ["+20% de dano por nível", "+20% de dano por nível"],
    mechanics: [
      "**O dano da própria adaga também entra.** A tabela desta página é o veneno que a skill acrescenta, não o golpe inteiro.",
      "O veneno dura **2 segundos no nível 1 e 0,4 segundo a mais por nível**, e o dano da tabela é o total espalhado por essa janela, não um acerto instantâneo.",
      "Só funciona com uma adaga equipada, o que a mantém como curiosidade em vez de build.",
    ],
  },
  "corpse-explosion": {
    summary:
      "Detona um cadáver com dano baseado na vida base daquele tipo de monstro. Metade físico, metade fogo.",
    mechanics: [
      "**Metade do dano é físico e metade é fogo**, divididos a partir de um único total sorteado. Cada metade é então reduzida pela resistência do alvo àquele tipo, então um imune a fogo ainda leva a metade física.",
      "O dano é **70%–120% da vida base média do tipo de monstro**, e essa vida é recalculada a partir da tabela do próprio jogo no nível e na dificuldade do cadáver — não lida do cadáver. Quantidade de jogadores e bônus de Champion, Unique e Super Unique não a aumentam.",
      "**Pontos compram raio, não dano.** O parâmetro de raio começa em 8 e sobe 1 por nível, e o motor o divide por dois: cerca de 4 unidades no nível 1 e 13 no nível 20.",
      "Se o nível do seu personagem estiver abaixo do nível do monstro do cadáver, o dano é reduzido nessa proporção. Subir de nível o aumenta; o nível da própria skill não.",
      "Amplify Damage age sobre a metade física — o mesmo corte de 100 pontos na resistência a dano físico que qualquer outro golpe físico recebe.",
      "Existe um artigo inteiro sobre isso: veja a página de mecânica do Corpse Explosion.",
    ],
  },
  "bone-wall": {
    summary: "Ergue uma parede de osso que bloqueia passagem até ser quebrada.",
    synergyBonuses: ["+10% de vida por nível", "+10% de vida por nível"],
    mechanics: [
      "**Oito segmentos**, e a quantidade não cresce com o nível da skill — os pontos compram a vida da parede, a **+25% por nível**.",
      "Ela fica de pé por **600 frames — 24 segundos** — em qualquer nível.",
      "O uso real dela é como porta: os monstros precisam quebrá-la, o que compra para um conjurador os segundos que um Teleport custaria.",
    ],
  },
  "poison-explosion": {
    summary:
      "Detona um cadáver numa nuvem de veneno. Precisa de um corpo, como tudo em volta dela.",
    synergyBonuses: ["+15% de dano por nível", "+15% de dano por nível"],
    mechanics: [
      "O veneno dura **2 segundos no nível 1 e 0,4 segundo a mais por nível**; a tabela dá o dano total espalhado por essa janela.",
      "Ela consome o cadáver, então disputa com o Corpse Explosion e com o Raise Skeleton os mesmos corpos.",
      "Diferente do Corpse Explosion, o dano é da própria skill e não depende do que morreu.",
    ],
  },
  "bone-spear": {
    summary:
      "Uma lança de osso que perfura. Dano mágico em linha reta, e o ataque principal da árvore.",
    synergyBonuses: [
      "+8% de dano por nível",
      "+8% de dano por nível",
      "+8% de dano por nível",
      "+8% de dano por nível",
    ],
    mechanics: [
      "Ela **perfura todos os alvos no caminho**, o que faz dela uma skill de limpar fileiras em vez de uma de alvo único.",
      "Dano mágico: só um punhado de monstros do jogo resiste, e nenhum deles é comum nos lugares que essa build farma.",
      "Não existe Mastery para ela. O dano vem das quatro sinergias e dos +skills, e de mais nada.",
    ],
  },
  "bone-prison": {
    summary: "Enjaula um alvo em osso. A mesma parede, fechada em volta de alguma coisa.",
    synergyBonuses: ["+8% de vida por nível", "+8% de vida por nível"],
    mechanics: [
      "A vida escala a **+25% por nível**, e ela fica de pé por **600 frames — 24 segundos** — como o Bone Wall.",
      "O custo de mana dela **cai** com o nível em vez de subir: 27 no nível 1, um a menos por nível.",
      "Encaixotar um atacante à distância é para o que ela serve; não segura nada que teleporte nem nada que já esteja do seu lado.",
    ],
  },
  "poison-nova": {
    summary: "Um anel de veneno que se expande a partir de você. O único ataque em área da classe.",
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
    mechanics: [
      "O veneno dura **2 segundos em qualquer nível**. As colunas que alongam as outras duas skills de veneno simplesmente não existem aqui, então todo o crescimento vai para o dano.",
      "A tabela dá o dano **total** ao longo desses dois segundos, não dano por segundo e não um acerto instantâneo.",
      "Ela não precisa de cadáver, e é isso que a separa do resto da árvore.",
      "Veneno não tem Mastery. O Lower Resist é a única coisa na classe que reduz resistência a veneno.",
    ],
  },
  "bone-spirit": {
    summary:
      "Um crânio teleguiado que persegue o alvo. Dano de alvo único maior que o do Bone Spear.",
    synergyBonuses: [
      "+8% de dano por nível",
      "+8% de dano por nível",
      "+8% de dano por nível",
      "+8% de dano por nível",
    ],
    mechanics: [
      "Ele **persegue** em vez de viajar reto, e acerta um alvo — a troca oposta à da perfuração do Bone Spear.",
      "Dano base maior que o do Bone Spear no mesmo nível, e é por isso que ele é a metade de chefe de uma build de osso, não uma build própria.",
      "Ele divide as sinergias do Bone Spear, então os dois são investidos juntos em vez de escolhidos um ou outro.",
    ],
  },

  // -------------------------------------------------------------------------
  // Necromancer — Curses
  // -------------------------------------------------------------------------
  "amplify-damage": {
    summary:
      "Corta 100 pontos da resistência a dano físico do monstro. O maior multiplicador físico do jogo.",
    mechanics: [
      "Ela baixa a **resistência** a dano físico em 100 pontos, em vez de multiplicar o dano: um monstro com 0% de resistência vai para −100% e passa a levar o dobro. Um com 50% vai para −50%, e ali a mesma maldição vale muito mais.",
      "Contra um monstro **imune a físico** a maldição entra com um quinto da força, cortando 20 pontos em vez de 100. Isso é exatamente o suficiente para quebrar um monstro parado em 100% de resistência física, e não é suficiente para um acima de 120%.",
      "O raio cresce 1 por nível a partir de 3, e ela dura 8 segundos no nível 1, com 3 segundos a mais por nível.",
      "Um ponto costuma bastar para um grupo físico; o que os pontos extras compram é duração e raio.",
    ],
  },
  "dim-vision": {
    summary: "Cega um grupo para que ele não enxergue você. A maldição de segurança do Summoner.",
    mechanics: [
      "Um monstro cegado para de perseguir e para de usar ataques à distância até alguma coisa acertá-lo.",
      "**A duração dela é dividida pela dificuldade**: 7 segundos no nível 1 em Normal, metade disso em Nightmare e um quarto em Hell. Só esta maldição e o Terror são tratados assim.",
      "Por ser uma maldição, lançá-la remove a maldição que já estivesse no alvo — inclusive o Amplify Damage.",
    ],
  },
  weaken: {
    summary: "Reduz o dano físico que o monstro causa. Raio grande, duração longa.",
    mechanics: [
      "**−33% de dano causado no nível 1, um ponto a mais por nível**, então vinte pontos chegam a −52%.",
      "O raio dela começa em 9 — empatado como o maior de qualquer maldição — e é isso que faz dela uma conjuração defensiva de sala inteira em vez de algo mirado.",
      "Ela é a metade mais segura da decisão do Amplify Damage: uma reduz o que você leva, a outra aumenta o que você causa, e um alvo só carrega uma das duas.",
    ],
  },
  "iron-maiden": {
    summary:
      "Devolve ao monstro boa parte do dano corpo a corpo dele. A ferramenta clássica de Uber.",
    mechanics: [
      "Devolve **200% do dano causado no nível 1, +25% por nível** — 675% com vinte pontos.",
      "Só devolve dano de ataques que conectam corpo a corpo, então não faz nada contra conjuradores e monstros à distância.",
      "É a maldição que mata coisas muito acima do seu próprio dano, e é por isso que ela é a contribuição do Necromancer para a Uber Tristram.",
    ],
  },
  terror: {
    summary: "Faz os monstros fugirem. Útil para quebrar um grupo, perigoso para espalhá-lo.",
    mechanics: [
      "**Dividida pela dificuldade como o Dim Vision**: 8 segundos no nível 1 em Normal, quatro em Nightmare, dois em Hell.",
      "Monstros em fuga se espalham, que é o contrário do que uma build de Corpse Explosion quer — é botão de pânico, não conjuração de rotina.",
      "A distância percorrida na fuga cresce com o nível, o que na prática só aumenta o problema.",
    ],
  },
  confuse: {
    summary: "Os monstros atacam o que estiver mais perto, inclusive uns aos outros.",
    mechanics: [
      "Monstros confusos escolhem alvos ao acaso, então um grupo denso briga consigo mesmo enquanto o seu exército chega.",
      "É uma maldição de controle de grupo, não de dano: nada nela aumenta o que você causa.",
      "Raio e duração são o que os pontos compram — 6 e 10 segundos no nível 1, crescendo 1 e 2 por nível.",
    ],
  },
  "life-tap": {
    summary:
      "Metade do dano físico causado ao monstro amaldiçoado volta como vida. A melhor maldição de grupo.",
    mechanics: [
      "**50% do dano causado volta como vida**, e o número não muda com o nível — os pontos compram só raio e duração.",
      "Vale para todo mundo que estiver batendo no alvo, o que faz dela a coisa mais forte que um Necromancer leva para um grupo corpo a corpo.",
      "Dracul's Grasp a conjura ao acertar, então um personagem corpo a corpo pode carregá-la sem um Necromancer no grupo.",
    ],
  },
  attract: {
    summary: "Tudo que está por perto ataca o monstro amaldiçoado em vez de você.",
    mechanics: [
      "A maldição mais longa da árvore: 12 segundos no nível 1 e 3,6 segundos a mais por nível.",
      "O raio dela é 9 e não cresce, empatando com o do Weaken como o maior da árvore.",
      "**Nenhuma maldição pode ser aplicada a um alvo enquanto o Attract estiver nele** — nem outro Attract, nem o Amplify Damage. É a única maldição da árvore que tranca o espaço em vez de dividi-lo.",
    ],
  },
  decrepify: {
    summary:
      "Desacelera, enfraquece e expõe o monstro de uma vez. Mais curta que o Amplify Damage, e faz mais.",
    mechanics: [
      "Uma maldição, quatro efeitos, todos a **−50% e nenhum deles crescendo com o nível**: velocidade de movimento, velocidade de ataque, dano causado e resistência a dano físico.",
      "A metade de resistência é o efeito do Amplify Damage pela metade — então, contra um monstro com 0% de resistência física, o Amplify dobra o seu dano e o Decrepify o multiplica por 1,5.",
      "Contra um monstro **imune a físico** ela é cortada para um quinto como toda maldição de resistência, o que deixa 10 pontos — não o bastante para quebrar uma imunidade de 100% que o Amplify Damage quebra. Os imunes são o único lugar onde a escolha entre as duas não é questão de gosto.",
      "É a maldição mais curta da árvore: 4 segundos no nível 1, 0,6 segundo a mais por nível. Os pontos compram duração e nada mais.",
      "Um Reaper's Toll a conjura ao acertar, e é por isso que essa lança é arma padrão de mercenário para builds físicas fora desta classe.",
      "A resposta de sempre é usar as duas: Amplify Damage para limpar, Decrepify para o que for realmente perigoso.",
    ],
  },
  "lower-resist": {
    summary:
      "Reduz resistência a fogo, frio, raio e veneno. A única coisa da classe que encosta em resistência a veneno.",
    mechanics: [
      "A redução sobe de **25% em direção a um teto de 70%** numa curva de retornos decrescentes, então o primeiro ponto vale muito mais que o vigésimo.",
      "Ela cobre **veneno além dos três elementos**, o que nenhuma aura e nenhuma outra maldição faz — e veneno não tem Mastery, então esta é toda a resposta de resistência de uma build de veneno.",
      "Contra um monstro *imune* ao elemento ela entra com um quinto da força — e, ao contrário de uma mastery ou de um −% to Enemy Resistance, ainda assim quebra a imunidade se um quinto bastar. No teto de −70% da skill esse quinto é −14, que alcança 113%; com um ponto seco é −5, que alcança 104%.",
      "É uma maldição como qualquer outra: substitui o Amplify Damage no alvo em vez de se somar a ele.",
    ],
  },
};
