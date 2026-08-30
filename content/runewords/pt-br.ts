import type { Overlay, RunewordCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR das runewords.
 *
 * As linhas de estatística NÃO estão aqui: são strings do jogo e permanecem em
 * inglês nos dois idiomas, junto dos dados invariantes. A única exceção são os
 * marcadores de "não verificado" das runewords da expansão. Ver ADR 0003.
 */
export const runewordsPtBr: Overlay<RunewordCopy> = {
  stealth: {
    summary:
      "A primeira runeword que quase todo personagem faz. Barata, e o bloco de 25 FCR / 25 FRW / 25 FHR carrega você por todo o Normal.",
    basesDisplay: "Qualquer Armadura de 2 sockets",
    basesExclusions: [
      "Só armadura de corpo — não funciona em elmos nem escudos.",
      "A base precisa ser um item comum (branco ou cinza), nunca mágico, raro, set ou unique.",
    ],
    recommendedBases: [
      "Breast Plate — só 30 de Strength, e o peso baixo mantém você na velocidade de corrida Fast.",
      "Qualquer armadura leve que você consiga vestir. Não invista Strength demais por uma base mais pesada.",
    ],
    usedBy:
      "Toda classe, toda build, em todo personagem novo. O melhor custo-benefício por runa do jogo.",
    commonMistakes: [
      "Fazer numa armadura de 3 sockets. A base precisa ter exatamente 2.",
      "Encaixar Eth antes de Tal. A ordem é Tal e depois Eth, da esquerda para a direita.",
    ],
  },
  leaf: {
    summary:
      "+3 Fire Skills numa staff de duas runas. Transforma uma Fire Sorceress de nível 19 numa matadora de verdade.",
    basesDisplay: "Qualquer Staff de 2 sockets",
    basesExclusions: ["Só staves — não wands, não orbs, não Sorceress orbs."],
    recommendedBases: [
      "Qualquer staff barata. Staves base que já vêm com bônus de skill de Sorceress somam por cima, então uma staff que já rola +Fire Ball ou +Warmth é um upgrade real.",
    ],
    usedBy:
      "Fire Sorceresses durante o Normal. Também um preenchimento barato de slot de arma para qualquer caster que queira o bônus de Warmth.",
    commonMistakes: ["Comprar uma staff que já tem sockets, mas na quantidade errada."],
  },
  "ancients-pledge": {
    summary:
      "Três runas comuns para resistências quase no máximo. A resposta mais barata à penalidade de resistência do Nightmare.",
    basesDisplay: "Qualquer Escudo de 3 sockets",
    basesExclusions: ["Só escudos — não armadura de corpo, não elmos."],
    recommendedBases: [
      "Qualquer escudo com requisito de Strength que você já atenda.",
      "Para um Paladin, um escudo exclusivo de Paladin soma a resistência inerente dele por cima.",
    ],
    usedBy:
      "Qualquer personagem entrando no Nightmare sem plano de resistência. Costuma ser a diferença entre morrer o tempo todo e progredir.",
    commonMistakes: [
      "As três runas caem da Countess no Normal — não troque por elas.",
    ],
    notes:
      "Os valores de resistência mostrados são os totais do escudo pronto, já incluindo os bônus individuais de cada runa em escudo.",
  },
  lore: {
    summary: "+1 em Todas as Skills num elmo, por duas runas comuns.",
    basesDisplay: "Qualquer Elmo de 2 sockets",
    basesExclusions: ["Só elmos — não escudos, mesmo os dois sendo 'armadura'."],
    recommendedBases: [
      "Qualquer elmo leve. Elmos de classe (Barbarian helms, Druid pelts) podem rolar +skills próprios por cima.",
    ],
    usedBy:
      "Toda classe, do fim dos 20 até aparecer um elmo melhor. Aguenta surpreendentemente bem até fundo no Nightmare.",
  },
  steel: {
    summary:
      "Uma runeword de arma de nível 13. Open Wounds e velocidade de ataque por duas das runas mais baratas.",
    basesDisplay: "Qualquer Sword, Axe ou Mace de 2 sockets",
    basesExclusions: ["Não polearms, não spears, não hammers nem scepters."],
    usedBy: "Personagens corpo a corpo no início do Normal, e armas iniciais de mercenário.",
  },
  spirit: {
    summary:
      "A runeword econômica mais importante do jogo. +2 skills e até 35% de Faster Cast Rate, com quatro runas do Normal.",
    basesDisplay: "Qualquer Sword de 4 sockets, ou qualquer Escudo de 4 sockets",
    basesExclusions: [
      "Só swords e escudos. Não axes, não maces, não staves, não orbs.",
      "Uma Crystal Sword é a base padrão de sword; um Monarch é a base padrão de escudo.",
    ],
    recommendedBases: [
      "Sword: uma Crystal Sword. Chega a 4 sockets, tem requisito trivial de 43 de Strength, e é comprada da Charsi ou apostada barato.",
      "Escudo: um Monarch. É o escudo de menor Strength (156) que rola 4 sockets — ainda um investimento real para um caster, então a maioria roda primeiro a Spirit sword e adiciona o escudo depois.",
      "Broad Sword e Long Sword também chegam a 4 sockets e são mais leves que a Crystal Sword.",
    ],
    usedBy:
      "Praticamente todo caster, e a maioria dos não-casters como mão secundária. Uma Spirit sword no nível 25 é o maior salto de poder disponível para um personagem novo.",
    commonMistakes: [
      "Tentar numa Sorceress Orb. Orbs não são swords — isso não funciona.",
      "Comprar uma Crystal Sword que já tem 3 ou 5 sockets. Precisa ser exatamente 4.",
      "Fazer numa base cara antes de conseguir atender o requisito de Strength.",
    ],
    notes:
      "O roll de Faster Cast Rate é aleatório entre 25 e 35. Como as runas são baratas, os jogadores costumam fazer vários Spirits e ficar com o melhor roll — 35% é o que a maioria dos planos de breakpoint de FCR assume.",
  },
  insight: {
    summary:
      "Uma aura de Meditation no seu mercenário. Resolve a mana do caster de vez, e custa quatro runas comuns.",
    basesDisplay: "Qualquer Polearm, Staff ou Arma de Projétil (arco/besta) de 4 sockets",
    basesExclusions: [
      "Não spears. Polearms e spears são classes de item diferentes, e este é o erro mais comum com o Insight.",
      "Não swords, axes nem maces.",
    ],
    recommendedBases: [
      "Para um mercenário do Ato 2: uma Partizan ou Bill (normal), uma Great Poleaxe ou Lochaber Axe (exceptional), ou uma Giant Thresher / Cryptic Axe (elite) — todas polearms.",
      "Bases ethereal dão mais dano e o mercenário nunca as quebra, então uma polearm elite ethereal é a versão de endgame.",
      "Existe a versão em staff de 4 sockets para o próprio personagem conjurar, mas a aura é o ponto, então a versão do mercenário é quase sempre a correta.",
    ],
    usedBy:
      "O mercenário do Ato 2 de quase todo caster. O Meditation remove poções de mana do jogo pelo resto da vida do personagem.",
    commonMistakes: [
      "Usar uma base de spear (War Pike, Ghost Spear). O Insight não funciona em spears.",
      "Dar a um mercenário do Ato 1 ou do Ato 5 — eles não usam polearms.",
    ],
  },
  rhyme: {
    summary:
      "Duas runas baratas por Cannot Be Frozen, resistências e magic find num escudo.",
    basesDisplay: "Qualquer Escudo de 2 sockets",
    usedBy:
      "Personagens de magic find, e qualquer um que precise de Cannot Be Frozen sem gastar uma runa Cham.",
    notes:
      "O Cannot Be Frozen importa mais que as resistências para a maioria das builds — estar congelado reduz sua velocidade de conjuração e de movimento.",
  },
  smoke: {
    summary: "+50 em todas as resistências numa armadura, por duas runas médias.",
    basesDisplay: "Qualquer Armadura de 2 sockets",
    usedBy:
      "Qualquer personagem com dificuldade nas resistências do Hell que ainda não tenha uma armadura melhor. O -1 de raio de luz é genuinamente irritante, mas raramente decisivo.",
  },
  lionheart: {
    summary: "Atributos e +30 em todas as resistências. A armadura que resolve seus requisitos de Strength.",
    basesDisplay: "Qualquer Armadura de 3 sockets",
    usedBy:
      "Personagens corpo a corpo pelo Nightmare e entrando no Hell. Os +25 de Strength efetivamente devolvem 25 pontos de atributo, e é por isso que ela supera o Smoke para muitas builds, apesar das resistências menores.",
  },
  treachery: {
    summary:
      "45 de IAS e chance de conjurar Fade em si mesmo. A armadura padrão de mercenário durante a maior parte do jogo.",
    basesDisplay: "Qualquer Armadura de 3 sockets",
    usedBy:
      "Mercenários, esmagadoramente. O Fade dá ao mercenário um buff grande de resistência e redução de dano sempre que dispara, o que mantém um mercenário do Ato 2 vivo no Hell muito melhor do que defesa bruta conseguiria.",
    notes:
      "O proc de Fade é o objetivo inteiro. Venom e as skills de Assassin são irrelevantes num mercenário.",
  },
  wealth: {
    summary: "300% de ouro e 100% de magic find. Uma armadura de farm de ouro, não de combate.",
    basesDisplay: "Qualquer Armadura de 3 sockets",
    usedBy:
      "Personagens dedicados a magic find e gold find. Não dá nenhum valor defensivo, então use apenas onde você não possa morrer.",
  },
  memory: {
    summary: "+3 skills de Sorceress e 33% de Faster Cast Rate numa staff.",
    basesDisplay: "Qualquer Staff de 4 sockets",
    basesExclusions: ["Só staves — não orbs, não wands."],
    usedBy:
      "Sorceresses que querem mais +skills bruto do que uma Spirit sword dá, e que podem abrir mão do slot de escudo. Uma staff base com skills de Sorceress inerentes soma por cima.",
    notes:
      "É de duas mãos, então custa o seu escudo. A maioria das Sorceresses prefere Spirit sword mais escudo até conseguir pagar um orb.",
  },
  "call-to-arms": {
    summary:
      "Battle Orders em qualquer classe. Um aumento permanente de cerca de 40% de vida, carregado na troca de arma.",
    basesDisplay: "Qualquer Arma de 5 sockets",
    basesExclusions: [
      "Só armas. Cinco sockets é a restrição — a maioria dos tipos de arma não chega a cinco.",
    ],
    recommendedBases: [
      "Uma Crystal Sword ou Flail — baratas, Strength baixa, e chegam a 5 sockets.",
      "Os atributos da base não importam. Você nunca luta com ela; conjura Battle Command duas vezes e Battle Orders uma, e volta.",
    ],
    usedBy:
      "Toda classe, no slot de troca de arma. O Battle Orders é um multiplicador grande de vida e mana que nenhum outro item fornece.",
    commonMistakes: [
      "Fazer numa base boa. É um bastão de buff — use a arma de 5 sockets mais barata que achar.",
      "Esquecer de conjurar Battle Command duas vezes antes do Battle Orders. O segundo Battle Command potencializa o Battle Orders que vem depois.",
    ],
  },
  "heart-of-the-oak": {
    summary:
      "+3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências. A arma padrão de caster no endgame.",
    basesDisplay: "Qualquer Staff ou Mace de 4 sockets",
    basesExclusions: [
      "Maces especificamente — não hammers, não scepters, não clubs que se classifiquem como outro tipo.",
      "Não swords, não orbs, não wands.",
    ],
    recommendedBases: [
      "Uma Flail — de uma mão, só 41 de Strength, e chega a 4 sockets. Esta é a escolha padrão.",
      "Evite bases de staff de duas mãos, a menos que você não tenha uso para um escudo.",
    ],
    usedBy:
      "Casters de qualquer classe assim que conseguirem pagar uma runa Vex. A combinação de +3 skills, 40 de FCR e até 40 em todas as resistências não tem igual pelo custo.",
  },
  enigma: {
    summary:
      "Teleport em qualquer classe. O item mais transformador do jogo, e precificado de acordo.",
    basesDisplay: "Qualquer Armadura de 3 sockets",
    recommendedBases: [
      "Uma Mage Plate ou Archon Plate — leves, Strength baixa, e o +0,75 de Strength por nível torna quase qualquer base vestível de qualquer forma.",
      "Não use uma base pesada pela defesa. A defesa é irrelevante ao lado do Teleport.",
    ],
    usedBy:
      "Toda classe que não seja Sorceress. Para uma Sorceress ainda é forte (+2 skills, muita Strength, magic find), mas bem menos essencial, porque ela já tem Teleport.",
    notes:
      "O bônus de Strength é o motivo de o Enigma liberar equipamento pesado em casters: no nível 90 ele concede 67 de Strength, frequentemente o bastante para vestir um escudo Monarch sem investir nenhum ponto.",
  },
  "chains-of-honor": {
    summary: "+2 skills e +65 em todas as resistências. A armadura de caster mais segura do endgame.",
    basesDisplay: "Qualquer Armadura de 4 sockets",
    usedBy:
      "Sorceresses e outros casters que já têm Teleport e prefeririam resistências a um Enigma. No Hell, +65 em todas as resistências libera um orçamento enorme de equipamento no resto dos slots.",
  },
  fortitude: {
    summary:
      "+300% de Dano Aumentado numa arma, ou +200% de Defesa Aumentada e muita vida numa armadura.",
    basesDisplay: "Qualquer Armadura ou Arma de 4 sockets",
    recommendedBases: [
      "Versão armadura: uma Archon Plate pelo requisito baixo de Strength, ou uma base mais pesada se você quiser que a defesa realmente conte.",
      "Versão arma: normalmente para um mercenário. Repare no Hit Causes Monster to Flee, que é uma desvantagem real numa arma de mercenário.",
    ],
    usedBy:
      "Builds de dano físico (versão arma) e quase qualquer personagem que queira uma reserva grande de vida (versão armadura). A armadura é a escolha mais comum.",
  },
  infinity: {
    summary:
      "Uma aura de Conviction que quebra imunidade a raio. A runeword que mais define builds de casters elementais.",
    basesDisplay: "Qualquer Polearm ou Spear de 4 sockets",
    basesExclusions: [
      "Só polearms e spears. Diferente do Insight, spears FUNCIONAM aqui — verifique a classe do item com atenção.",
    ],
    recommendedBases: [
      "Uma Giant Thresher ou Cryptic Axe ethereal para um mercenário do Ato 2. Ethereal é preferível: mercenários não quebram equipamento.",
      "Uma Great Poleaxe ou Thresher se bases elite estiverem fora de alcance.",
    ],
    usedBy:
      "Lightning Sorceresses acima de tudo — a Conviction mais a linha de -resistência a raio quebram a imunidade a raio do Hell por completo. Também transformador para Javazons e qualquer build física que queira a redução de defesa.",
    commonMistakes: [
      "Achar que a Conviction reduz todas as resistências igualmente. A Conviction reduz resistência a fogo, frio e raio; a linha extra de -45 a 55% vale só para raio.",
      "Colocar num mercenário do Ato 1 ou do Ato 5. Só o mercenário do Ato 2 usa polearms e spears.",
    ],
    notes:
      "Duas runas Ber fazem deste um dos itens mais caros do jogo. É o clássico item do tipo 'a build funciona sem ele, mas é outra build com ele'.",
  },
  duress: {
    summary:
      "40% de Faster Hit Recovery, Crushing Blow e Open Wounds numa armadura. A armadura econômica do corpo a corpo.",
    basesDisplay: "Qualquer Armadura de 3 sockets",
    usedBy:
      "Personagens corpo a corpo que querem Crushing Blow sem abrir mão de um slot de equipamento para consegui-lo. O Crushing Blow remove uma porcentagem da vida atual do monstro, o que o torna desproporcionalmente bom contra bosses.",
  },
  "crescent-moon": {
    summary:
      "-35% de resistência a raio do inimigo numa arma, por três runas médias. A resposta econômica à imunidade a raio.",
    basesDisplay: "Qualquer Axe, Sword ou Polearm de 3 sockets",
    basesExclusions: ["Não maces, não hammers, não spears."],
    usedBy:
      "Builds de raio que não podem pagar um Infinity. -35% de resistência a raio do inimigo é cerca de dois terços do que a linha do Infinity oferece, por uma fração mínima do custo — embora não tenha Conviction, então não quebra imunidade.",
  },
  passion: {
    summary:
      "Uma runeword de arma barata que dá Zeal e Berserk a qualquer classe. Usada principalmente para alcançar o Berserk contra imunes físicos.",
    basesDisplay: "Qualquer Arma de 4 sockets",
    usedBy:
      "Barbarians e qualquer personagem corpo a corpo que queira acesso ao Berserk. O Berserk converte dano físico em mágico, que é a resposta padrão a um monstro imune a físico.",
    notes:
      "O Hit Causes Monster to Flee é uma desvantagem real — monstros fugindo de você são monstros que você precisa perseguir.",
  },
  death: {
    summary: "50% de Crushing Blow e Deadly Strike que escala com o nível. Uma arma barata para bosses.",
    basesDisplay: "Qualquer Sword ou Axe de 5 sockets",
    basesExclusions: ["Só swords e axes — cinco sockets é a restrição real."],
    usedBy:
      "Personagens corpo a corpo focados em bosses. 50% de Crushing Blow é o maior de qualquer runeword e remove uma porcentagem da vida atual do alvo por golpe, que é exatamente o que você quer contra algo com uma reserva enorme de vida.",
  },
  grief: {
    summary:
      "Um dano fixo de +340-400 que ignora completamente a escala de dano aumentado. A melhor arma física de corpo a corpo do jogo.",
    basesDisplay: "Qualquer Sword ou Axe de 5 sockets",
    basesExclusions: [
      "Só swords e axes. Uma Phase Blade é a base padrão — é indestrutível e muito rápida.",
    ],
    recommendedBases: [
      "Uma Phase Blade. É indestrutível, tem a velocidade base mais rápida entre as swords, e não pode ser afetada por defesa.",
      "Berserker Axe se você quiser o dano base maior e puder conviver com o reparo.",
    ],
    usedBy:
      "Toda build física de corpo a corpo que puder pagar. O bônus de dano fixo é aplicado depois dos multiplicadores de dano aumentado, e não antes, e é por isso que ela supera armas com dano listado muito maior.",
    notes:
      "O +dano fixo é o ponto inteiro e é fácil de ler errado: ele não escala com +% de Dano Aumentado, o que paradoxalmente o torna *melhor* em armas rápidas de dano base baixo.",
  },
  exile: {
    summary:
      "Um escudo exclusivo de Paladin que carrega aura de Defiance, +2 em Offensive Auras e Life Tap ao golpear. A sustentação do Smiter num item só.",
    basesDisplay: "Qualquer escudo de Paladin de 4 sockets",
    basesExclusions: [
      "Só escudos de classe do Paladin — Auric Shields e seus equivalentes Normal e Exceptional. Não dá para fazer num Monarch nem em qualquer escudo comum.",
    ],
    recommendedBases: [
      "Um escudo de Paladin **etéreo**. O Exile se repara sozinho, então o motivo habitual para evitar bases etéreas não se aplica — e etéreo soma 50% à defesa base.",
      "Uma base que role +45 em todas as resistências é a que vale esperar. O tipo do escudo importa menos que esse roll.",
    ],
    usedBy:
      "Smiters acima de tudo — o proc de Life Tap é o que mantém um Paladin vivo contra o Uber Mephisto, e não custa ponto de skill. Também usado por Zealots e por Paladins de troca de aura que querem Defiance à disposição.",
    commonMistakes: [
      "Tentar fazer num Monarch. Exile é exclusivo de Paladin; a base precisa ser um escudo de classe.",
      "Evitar bases etéreas por hábito. Aqui elas são estritamente melhores, porque a runeword se repara sozinha.",
    ],
  },
  kingslayer: {
    summary:
      "Crushing Blow, Open Wounds e um ponto grátis em Vengeance numa arma de meio de jogo. A resposta barata contra um boss.",
    basesDisplay: "Qualquer Sword ou Axe de 4 sockets",
    basesExclusions: [
      "Só swords e axes. Não maces, não scepters, não polearms — a mesma restrição de classe que as pessoas erram com o Grief.",
    ],
    recommendedBases: [
      "Uma Cryptic Sword ou Berserker Axe pelo dano, ou uma Phase Blade se você quiser a velocidade e a indestrutibilidade.",
    ],
    usedBy:
      "Personagens de corpo a corpo que ainda não podem pagar um Grief. O +1 em Vengeance também faz dela a primeira arma natural de um Avenger, já que fornece a skill antes de qualquer investimento de pontos.",
    notes:
      "Open Wounds aparece como 25% nos dados do próprio jogo. Várias bases da comunidade ainda listam 50%, o que parece ser um número desatualizado — veja `docs/research/01-paladin-builds.md`.",
  },
  "last-wish": {
    summary:
      "Uma aura de Might, Crushing Blow pesado e Life Tap ao golpear, numa arma de seis sockets que custa três runas Jah.",
    basesDisplay: "Qualquer Sword, Hammer ou Axe de 6 sockets",
    basesExclusions: [
      "Swords, hammers e axes. Não polearms — o que exclui a maioria das bases que um mercenário iria querer.",
    ],
    recommendedBases: [
      "Uma Berserker Axe ou Colossus Blade, pelo dano que o roll de Enhanced Damage multiplica.",
      "Feita com mais frequência para o mercenário do que para o jogador, porque a aura de Might que ela emana beneficia quem estiver ao lado.",
    ],
    usedBy:
      "Personagens físicos de corpo a corpo e seus mercenários. A combinação de aura de Might, Crushing Blow e proc de Life Tap faz um item só cobrir dano, dano em boss e sustentação de uma vez.",
    commonMistakes: [
      "Três runas Jah é o custo real, não os seis sockets. Faça essa conta antes de caçar uma base.",
      "Montar numa polearm. Last Wish não aceita polearms, que é justamente a base usada pela maioria das armas de mercenário.",
    ],
    notes:
      "Crushing Blow aparece como 40-50% nos dados do próprio jogo. Várias bases da comunidade ainda listam 60-70%, o que parece ser um número desatualizado — veja `docs/research/01-paladin-builds.md`.",
  },
  doom: {
    summary:
      "Uma aura de Holy Freeze mais -40 a -60% de resistência a frio do inimigo. Desacelera tudo e quebra resistência a frio ao mesmo tempo.",
    basesDisplay: "Qualquer Axe, Polearm ou Hammer de 5 sockets",
    basesExclusions: ["Não swords, não spears, não maces nem scepters."],
    usedBy:
      "Builds de frio que querem que o mercenário reduza a resistência a frio do mesmo jeito que o Infinity reduz a de raio — e personagens corpo a corpo que querem uma lentidão permanente em tudo por perto.",
    notes: "Holy Freeze vindo de item não acumula com a aura de Holy Freeze do mercenário. Escolha uma.",
  },
  bramble: {
    summary:
      "+25-50% de dano de skills de veneno e uma aura de Thorns. A armadura que define builds de veneno.",
    basesDisplay: "Qualquer Armadura de 4 sockets",
    usedBy:
      "Necromancers de veneno acima de tudo — o roll de +dano de skill de veneno é multiplicador direto de dano e nada mais no jogo oferece isso no slot de armadura.",
    notes:
      "O roll de dano de veneno varia de 25% a 50%, uma amplitude enorme. Verifique o roll antes de trocar por um.",
  },
  pride: {
    summary:
      "Uma aura de Concentration nível 16-20 numa arma de mercenário. O equivalente do Infinity para dano físico.",
    basesDisplay: "Qualquer Polearm ou Spear de 4 sockets",
    basesExclusions: ["Só polearms e spears, como o Infinity."],
    usedBy:
      "Builds físicas, no mercenário. A Concentration multiplica o dano físico seu e dele — e num Hammerdin não acumula com nada, porque Concentration não acumula consigo mesma.",
    notes:
      "Não tem nenhuma linha de Dano Aumentado, o que surpreende as pessoas. O valor dele é a aura e o attack rating, não o dano da própria arma.",
  },
  faith: {
    summary:
      "Uma aura de Fanaticism num arco. Velocidade de ataque, attack rating e dano para o grupo inteiro.",
    basesDisplay: "Qualquer Arco ou Besta de 4 sockets",
    basesExclusions: [
      "Só armas de projétil — não arcos exclusivos de Amazon, a menos que também tenham 4 sockets.",
    ],
    usedBy:
      "Bowazons, e mercenárias Rogue do Ato 1. O bônus de velocidade de ataque do Fanaticism vale para você além de quem empunha, o que faz dela uma das poucas runewords de arco genuinamente valiosas para mercenário.",
  },

  // ---------------------------------------------------------------------------
  // Reign of the Warlock
  // ---------------------------------------------------------------------------
  authority: {
    summary:
      "Uma runeword de armadura do Reign of the Warlock. Runas e base confirmadas; estatísticas ainda não verificadas.",
    basesDisplay: "Qualquer Armadura de 3 sockets",
    stats: [{ text: "Estatísticas ainda não verificadas — veja a nota abaixo." }],
    notes:
      "A combinação de runas e o tipo de base vêm do anúncio do Reign of the Warlock da Blizzard. As estatísticas não foram publicadas lá e não foram confirmadas em jogo, então ficam em branco em vez de adivinhadas. O nível mostrado é o mínimo implicado pela runa mais alta — Shael no nível 29, não Ral no 19; a Hel não tem nível mínimo — e o requisito real pode ser maior.",
  },
  coven: {
    summary:
      "Uma runeword de elmo do Reign of the Warlock. Runas e base confirmadas; estatísticas ainda não verificadas.",
    basesDisplay: "Qualquer Elmo de 3 sockets",
    stats: [{ text: "Estatísticas ainda não verificadas — veja a nota abaixo." }],
    notes:
      "Runas e base vêm do anúncio da Blizzard. Estatísticas não publicadas e não verificadas. O nível mostrado é o mínimo implicado pela Ist (nível 51).",
  },
  void: {
    summary:
      "Uma runeword de dagger do Reign of the Warlock, e uma das pouquíssimas que usam uma Zod. Estatísticas ainda não verificadas.",
    basesDisplay: "Qualquer Dagger de 3 sockets",
    basesExclusions: ["Só daggers — não swords, não claws."],
    stats: [{ text: "Estatísticas ainda não verificadas — veja a nota abaixo." }],
    notes:
      "Runas e base vêm do anúncio da Blizzard. Uma runa Zod faz desta uma das runewords mais caras do jogo, independentemente do que ela faça. Estatísticas não publicadas e não verificadas.",
  },
  vigilence: {
    summary:
      "Uma runeword de escudo do Reign of the Warlock. Runas e base confirmadas; estatísticas ainda não verificadas.",
    basesDisplay: "Qualquer Escudo de 2 sockets",
    stats: [{ text: "Estatísticas ainda não verificadas — veja a nota abaixo." }],
    notes:
      "Grafada 'Vigilence' no próprio anúncio da Blizzard, o que quase certamente é um erro de digitação de 'Vigilance' — a grafia dentro do jogo não foi confirmada. Runas e base vêm desse mesmo anúncio; estatísticas não publicadas e não verificadas.",
  },
  ritual: {
    summary:
      "Uma runeword de dagger do Reign of the Warlock. Runas e base confirmadas; estatísticas ainda não verificadas.",
    basesDisplay: "Qualquer Dagger de 3 sockets",
    basesExclusions: ["Só daggers."],
    stats: [{ text: "Estatísticas ainda não verificadas — veja a nota abaixo." }],
    notes:
      "Runas e base vêm do anúncio da Blizzard. Estatísticas não publicadas e não verificadas. O nível mostrado é o mínimo implicado pela Ohm (nível 57).",
  },
  dream: {
    summary:
      "Uma aura de Holy Shock nível 15 vinda de um item. Use dois e a aura empilha para o nível 30, que é o dano de uma build inteira.",
    basesDisplay: "Qualquer Helm ou Shield de 3 sockets",
    basesExclusions: [
      "Só elmos e escudos — não armadura de corpo. O Dragon é o que vai em armadura, e confundir os dois é o erro mais comum aqui.",
    ],
    recommendedBases: [
      "Um elmo e um escudo, os dois. Um Dream é curiosidade; dois Dreams é o Tesladin, porque as auras empilham para um nível 30 efetivo.",
      "Para o escudo, um escudo de classe do Paladin soma as próprias resistências por cima. Para o elmo, qualquer elmo elite de 3 sockets com requisitos baixos.",
    ],
    usedBy:
      "Tesladins, que usam dois e deixam uma aura de Holy Shock nível 30 matar enquanto eles atacam com Zeal. Também usado sozinho por Paladins de troca de aura que querem dano de raio à disposição.",
    commonMistakes: [
      "Fazer em armadura de corpo. O Dream não aceita armadura; isso é o Dragon.",
      "Fazer só um. A build é construída sobre as duas auras empilhando, e um Dream sozinho não é quase lá.",
      "Subestimar o custo. Dois Dreams são duas runas Jah, que é o preço real da build.",
    ],
    notes:
      "As duas últimas linhas de atributo dependem da base usada — o jogo concede bônus diferentes num elmo e num escudo. Tudo acima delas vale para os dois.",
  },
  dragon: {
    summary:
      "Uma aura de Holy Fire nível 14 vinda de armadura de corpo ou escudo, mais Strength que escala com o seu nível.",
    basesDisplay: "Qualquer Body Armor ou Shield de 3 sockets",
    basesExclusions: ["Armadura de corpo e escudos — não elmos. O Dream é o dos elmos."],
    recommendedBases: [
      "Uma armadura de 3 sockets com requisito baixo, porque a linha de Strength por nível significa que você não quer pagar pela base duas vezes.",
      "Um escudo de classe do Paladin se você está montando um Dragon Paladin e quer as resistências inatas.",
    ],
    usedBy:
      "Dragon Paladins, normalmente junto com uma arma Hand of Justice para que duas auras de Holy Fire empilhem. A Strength por nível ainda paga discretamente por equipamento mais pesado nos outros slots.",
    commonMistakes: [
      "Esperar que a aura baste sozinha. Um Holy Fire nível 14 sozinho não mata nada no Hell — ele é metade de um par.",
      "Montar num elmo. O Dragon não aceita elmos.",
    ],
    notes:
      "As duas últimas linhas de atributo dependem da base. Tudo acima delas vale tanto para armadura de corpo quanto para escudo.",
  },
  "hand-of-justice": {
    summary:
      "Uma aura de Holy Fire nível 16 numa arma, com velocidade de ataque, life steal e -20% de resistência a fogo do inimigo.",
    basesDisplay: "Qualquer arma de 4 sockets",
    basesExclusions: [
      "Qualquer tipo de arma, o que é incomumente permissivo — a restrição é achar uma base de 4 sockets que valha quatro runas altas.",
    ],
    recommendedBases: [
      "Uma Phase Blade pela velocidade e pela indestrutibilidade, ou uma Berserker Axe pelo dano que o roll de Enhanced Damage multiplica.",
    ],
    usedBy:
      "Dragon Paladins, que combinam com uma runeword Dragon para as duas auras de Holy Fire empilharem — e o -20% de resistência a fogo do inimigo soma diretamente com isso. Também usada por personagens de corpo a corpo que só querem a velocidade de ataque e o life steal.",
    commonMistakes: [
      "Tratar a linha de Meteor ao morrer como recurso. Ela dispara quando você morre; é sabor, não plano.",
      "Comprar pela aura sem uma segunda fonte de Holy Fire. Uma aura não é uma build.",
    ],
  },
  beast: {
    summary:
      "Uma aura de Fanaticism e +3 em Werebear numa arma — o que permite qualquer classe se transformar, não só o Druid.",
    basesDisplay: "Qualquer Axe, Scepter ou Hammer de 5 sockets",
    basesExclusions: [
      "Só axes, scepters e hammers — não swords, que é a base para a qual a maioria olha primeiro.",
    ],
    recommendedBases: [
      "Uma Berserker Axe pelo dano que o roll de Enhanced Damage multiplica, ou um Scourge se o requisito de Strength for o problema.",
      "Para quem não é Druid e usa para transformar, a base importa menos que o normal — o que você está comprando é o ataque da própria forma de Werebear.",
    ],
    usedBy:
      "Dois leitores muito diferentes. **Summoners e personagens de party** querem a aura de Fanaticism, que ela emana para tudo por perto sem ocupar o seu próprio slot de aura. **Personagens que não são Druid** querem o +3 em Werebear, porque `Oskill` significa que a skill é concedida a qualquer classe — é a única forma de uma Sorceress ou um Barbarian se transformar.",
    commonMistakes: [
      "Montar numa sword. O Beast não aceita swords.",
      "Esperar que a Fanaticism empilhe com a de um Paladin. Ela não empilha — só uma aura fica ativa por vez, e um Paladin rodando Fanaticism não ganha nada com a do Beast.",
    ],
    notes:
      "O `Oskill` no Werebear e no Shape Shifting é a parte incomum: um Oskill é concedido a todas as classes em vez de só à dona da árvore. Essa única palavra é o que torna a Werebear Sorceress e o Werebear Barbarian possíveis.",
  },
};
