import type { BuildCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR das builds.
 *
 * As escolhas de equipamento são endereçadas por chaves estáveis
 * (`${slot}-${índice}`, com alternativas em `-alt${n}`) em vez de por posição
 * numa lista aninhada: espelhar posicionalmente desalinha silenciosamente no
 * momento em que uma escolha é inserida no meio.
 */
export const buildsPtBr: Overlay<BuildCopy> = {
  "blizzard-sorceress": {
    summary:
      "A farmadora de magic find de referência. Teleport nativo, explosão enorme de frio, e um conjunto capaz de encarar o Hell que custa quatro runas comuns.",
    playstyle:
      "Você teleporta para dentro de uma sala, solta um Blizzard um pouco à frente de onde os monstros estão indo, e teleporta para fora enquanto ele mata. O Glacial Spike cobre o cooldown do Blizzard e congela qualquer coisa que se aproxime. Você nunca está em alcance corpo a corpo, nunca tanka nada, e se um grupo parecer perigoso você simplesmente vai embora. A build inteira se apoia na ideia de que você escolhe quais lutas acontecem.",
    strengths: [
      "Teleport a partir do nível 18 — nunca precisa de Enigma",
      "Genuinamente viável no Hell com uma Spirit sword, um Stealth e um elmo Lore",
      "O congelamento e a lentidão do Blizzard fazem dela a skill forte de farm mais segura do jogo",
      "A melhor farmadora de magic find do D2R, e o primeiro personagem padrão de uma temporada de ladder",
      "Todo item central é barato e encontrável sozinho",
    ],
    weaknesses: [
      "Imunes a frio são uma parede sem Sunder Charm, Infinity ou um mercenário com Might",
      "O Blizzard tem um cooldown fixo que nenhuma quantidade de Faster Cast Rate reduz",
      "Menor reserva de vida do jogo — um Teleport errado encerra um personagem de Hardcore",
      "O dano está inteiramente concentrado em um único elemento",
    ],
    flexPoints: [
      "Todo ponto depois das quatro skills maximizadas vai para a **Cold Mastery**.",
      "Não coloque pontos no Energy Shield a menos que você esteja construindo deliberadamente em torno dele — o investimento em mana compete diretamente com a vida de que você precisa.",
      "Alguns jogadores mantêm 5 a 10 pontos no Frozen Orb como reserva sem cooldown. É uma escolha legítima, e custa dano de Blizzard.",
    ],
    statPlan: {
      strength: "Só o suficiente para vestir o seu equipamento. Nada além disso, nunca.",
      dexterity:
        "Base. Não mexa, a menos que você esteja construindo deliberadamente para bloqueio máximo.",
      vitality: "Cada ponto restante.",
      energy: "Nenhum. Zero. Nem um ponto.",
      notes: [
        "A Sorceress ganha 2 de vida por ponto de Vitality — o menor do jogo — e é exatamente por isso que cada ponto sobrando precisa ir para lá.",
        "Energy é uma armadilha. Warmth, um mercenário com Insight e poções de mana cobrem tudo, e mana não impede você de morrer.",
        "Strength é a única decisão de julgamento. Uma base Monarch para um Spirit shield precisa de 156 de Strength, o que são cerca de 60 pontos de atributo — um investimento muito grande. A maioria adia o Spirit shield até que Nightwing's Veil (Requirements -50%), Sandstorm Trek (+15 de Strength) ou um Enigma (+0,75 de Strength por nível) paguem por ele.",
        "Com o buff de Battle Orders de um Call to Arms, mire em 1200 a 1800 de vida antes de levar o Hell a sério.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "O breakpoint que define a build. Ele governa a velocidade do Teleport tanto quanto a de conjuração, então determina a velocidade real com que você farma. Todo o plano de equipamento é organizado em torno de alcançá-lo.",
      "fcr-63":
        "Uma meta intermediária realista durante a evolução. Spirit sword (35) mais Magefist (20) mais quase qualquer anel de FCR chega lá antes do Hell.",
      "fcr-200":
        "O último breakpoint. Exige abrir mão de coisa demais para valer a pena na maioria dos conjuntos, e não há nenhum benefício acima de 200.",
      "fhr-60":
        "A tabela de FHR da Sorceress é punitiva. 60% é a meta prática — ficar preso em stun é uma das principais formas de uma Sorceress morrer.",
      "fhr-30":
        "Um mínimo razoável durante a evolução. Só o Stealth já dá 25%.",
    },
    skillNotes: {
      blizzard: "Maximize primeiro, sempre.",
      "glacial-spike":
        "+5% de dano de Blizzard por nível, e é a skill que você realmente conjura durante o cooldown.",
      "ice-blast": "+5% de dano de Blizzard por nível. Também um preenchimento usável em alvo único.",
      "ice-bolt": "+5% de dano de Blizzard por nível. Você nunca vai conjurar.",
      "cold-mastery":
        "Um ponto fixo cedo, e depois despeje as sobras aqui no fim. Veja a nota abaixo — é a parte mais mal compreendida da build.",
      teleport: "Um ponto. Nunca mais que isso.",
      telekinesis: "Pré-requisito do Teleport. Também pega poções à distância.",
      "static-field": "Amolece imunes a frio para o seu mercenário. Ignora resistência.",
      "frozen-armor": "Defesa de graça, e congela quem ataca corpo a corpo.",
      warmth: "Regeneração de mana desde o nível 1. Não custa nada.",
      "frozen-orb": "Não é pré-requisito de nada aqui — a Cold Mastery não exige nada. Pegue o ponto porque um orbe viajante cobre o que a colocação no chão do Blizzard não alcança.",
    },
    immunityPlan:
      "A Cold Mastery não quebra imunidade — contra um monstro imune a frio ela opera com um quinto da eficácia e não consegue levar a resistência abaixo de 100%. Suas opções, em ordem de praticidade: pule o grupo e teleporte para longe; deixe um mercenário com aura Might matá-lo com dano físico; use Static Field para reduzir a vida atual dele em direção ao piso de 50% do Hell, para o mercenário terminar mais rápido; carregue um Cold Rupture sunder charm, que coloca monstros imunes a frio em 95% de resistência a frio e os transforma em alvos comuns; ou rode um mercenário com Infinity, cuja aura Conviction quebra muitas imunidades a frio, mas não todas. No começo, pular é a resposta certa com muito mais frequência do que os jogadores imaginam.",
    mercenaryNotes:
      "Contrate um mercenário do Ato 2 no Nightmare, com a aura Might. O Might aumenta o dano físico dele, que é o que realmente mata os imunes a frio em que você não encosta. Dê a ele um Insight assim que puder — o Meditation encerra os seus problemas de mana de vez. Holy Freeze é a alternativa e é a melhor escolha no Hardcore, ao custo de matar imunes mais devagar.",
    farmingWhy: {
      "ancient-tunnels-hell":
        "Nível de área 85 com praticamente nenhum imune a frio na população base. É a casa natural da build e onde a maioria das Blizzard Sorceresses passa o tempo.",
      "mephisto-hell":
        "Monstro nível 87 apesar de um nível de área 83, um trajeto de vinte segundos, e ele não é imune a frio. O truque do fosso torna a run quase sem risco.",
      "andariel-hell":
        "O trajeto de boss mais curto do jogo, e ela não é imune a frio. Teto menor que o do Mephisto, mas volume maior.",
      "mephisto-nightmare":
        "Seguro, rápido, e dropa o bastante para viabilizar um personagem que ainda não está pronto para o Hell. O alvo padrão enquanto você conserta as resistências.",
      "chaos-sanctuary-hell":
        "Nível de área 85 e muito denso. Imunes a fogo e a raio estão por toda parte aqui, o que uma build de frio simplesmente ignora.",
      "countess-nightmare":
        "De onde vêm as runas para Insight, Spirit e Lore. Rode até suas runewords estarem feitas, e então pare.",
      "lower-kurast-hell":
        "Rodar baús não exige equipamento nem dano. Uma opção genuína para um personagem que ainda não consegue lutar no Hell.",
      "pit-hell":
        "Nível de área 85 e denso, mas contém imunes a frio — leve um mercenário com Might ou um Cold Rupture.",
      "mausoleum-hell": "Nível de área 85, seguro, e alcançável em segundos. Subestimado.",
      "pindleskin-hell":
        "Runs de dez segundos com monstro nível 86. Ele é imune a frio, então o mercenário faz o trabalho — ou leve um Cold Rupture.",
      "worldstone-keep-hell":
        "Onde você sobe do nível 90 ao 99. Todos os tipos de imunidade aparecem, então é território de Sunder Charm.",
    },
    levelingPath: {
      summary:
        "Não evolua como Blizzard. O Blizzard só abre no 24 e é fraco até as três sinergias entrarem, o que são mais 60 pontos de skill. Evolua com Fogo (Fire Bolt, depois Fire Ball no 12) ou Raio (Charged Bolt, depois Nova no 12), e então faça respec para Blizzard quando tiver os pontos para fazer funcionar.",
      respecAt:
        "Nível 24-30, usando o respec grátis da quest Den of Evil. Muitos jogadores esperam até o Nightmare e usam o token do Normal, guardando os outros dois de reserva.",
    },
    selfFoundNotes:
      "Esta build foi feita para jogo solo self-found. Spirit, Stealth, Lore, Ancient's Pledge e Insight são todos feitos com runas que a Countess dropa no Normal e no Nightmare, e nenhum deles exige troca. Skin of the Vipermagi, Harlequin Crest, The Oculus e Stone of Jordan são todos realisticamente encontráveis. Os únicos itens genuinamente dependentes de troca são Death's Fathom, Nightwing's Veil e as runas altas do Chains of Honor — e a build farma perfeitamente bem sem eles.",
    hardcoreNotes:
      "Viável, mas respeite a fragilidade. Pegue Holy Freeze no mercenário em vez de Might — a lentidão vale mais que o dano quando um erro é permanente. Evite The Oculus: os 25% de chance de conjurar Teleport ao ser atingida podem te jogar no meio de um grupo sem aviso, que é exatamente como Sorceresses de Hardcore morrem. Priorize Faster Hit Recovery e vida máxima acima de dano em todos os níveis, mantenha as resistências em 75% em vez de 'bom o bastante', e trate qualquer grupo que você não consiga identificar como motivo para sair da área.",
    gearSets: {
      starter: {
        goal: "Atravessar o Normal e chegar ao nível 25 com dano suficiente para continuar avançando.",
        nextUpgrade:
          "Chegue ao nível 25 e faça uma Spirit sword. Depois farme a Countess no Nightmare pelas runas do Insight do seu mercenário.",
        notes:
          "Não evolua como Blizzard Sorceress. O Blizzard só fica disponível no nível 24 e é fraco até as sinergias entrarem. Evolua com Fogo (Fire Bolt para Fire Ball) ou Raio (Charged Bolt para Nova), e faça respec entre 24 e 30 com o token da Den of Evil.",
        picks: {
          "weapon-0": {
            why: "O maior salto de poder disponível para um personagem novo. +2 skills e até 35% de Faster Cast Rate no nível 25, com quatro runas que a Countess dropa no Normal.",
            sockets: "Tal, Thul, Ort, Amn — nessa ordem — numa Crystal Sword de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Se você evoluiu como Fire Sorceress, o Leaf te carrega até o 25. Duas runas, nível 19.",
          },
          "weapon-0-alt1": {
            label: "Qualquer staff ou orb com +Blizzard ou +skills de frio",
            why: "Compre do Drognan e da Akara o tempo todo. Uma staff com +3 Blizzard vale mais que a maioria dos uniques nesta altura.",
          },
          "offhand-0": {
            why: "Três runas da Countess para resistências quase no máximo. É isso que te leva através da penalidade de resistência do Nightmare.",
          },
          "offhand-0-alt0": {
            why: "Duas runas por +25 em todas as resistências, Cannot Be Frozen e 25% de magic find.",
          },
          "body-0": {
            why: "25% de Faster Cast Rate, 25% de Faster Run/Walk e 25% de Faster Hit Recovery por duas das runas mais comuns do jogo. Faça assim que chegar ao nível 17.",
            sockets: "Tal e depois Eth, em qualquer armadura de 2 sockets. Uma Breast Plate é ideal.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns no nível 27." },
          "helm-0-alt0": {
            why: "+1 skills e até 50% de magic find no nível 15, se você achar ou apostar um antes.",
          },
          "gloves-0": {
            why: "20% de Faster Cast Rate no nível 23, e não custa nada. Aposte por elas.",
          },
          "ring1-0": {
            label: "Qualquer anel mágico ou raro com Faster Cast Rate",
            why: "Anéis de 10% de FCR são baratos e te empurram em direção ao breakpoint de 63%.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Mana"],
          },
          "belt-0": {
            label: "Qualquer cinto com 16 espaços (um Belt ou melhor)",
            why: "Espaços de poção importam mais que atributos nesta altura. Saia do Sash de 8 espaços o quanto antes.",
          },
          "boots-0": {
            label: "Qualquer bota com Faster Run/Walk e resistências",
            why: "Você ainda anda bastante antes do Teleport no 18. Resistências importam mais depois.",
          },
        },
      },
      nightmare: {
        goal: "Limpar o Nightmare confortavelmente e colocar as resistências sob controle antes do Hell.",
        nextUpgrade:
          "Um segundo Spirit num escudo Monarch, e resistências em 75% ou perto disso nos quatro elementos antes de entrar no Hell.",
        notes:
          "O Nightmare aplica uma penalidade de -40% em todas as suas resistências, e o Hell aplica -100%. Planeje para a penalidade do Hell *agora* — chegar ao Hell com 40% de resistência a fogo significa estar de fato em -60%.",
        picks: {
          "weapon-0": {
            why: "Ainda correto. Não há motivo para substituir uma Spirit sword até você conseguir pagar um Oculus ou um Heart of the Oak.",
          },
          "weapon-0-alt0": {
            why: "+3 skills de Sorceress, 30% de FCR, +20 em todas as resistências e 50% de magic find no nível 42. Um upgrade grande se você encontrar um.",
          },
          "weapon-0-alt1": {
            why: "+3 skills de Sorceress e 33% de FCR, se você preferir skills brutas a um escudo.",
          },
          "offhand-0": {
            why: "Um segundo Spirit, desta vez num escudo. +4 skills somando os dois slots é enorme.",
            sockets: "Tal, Thul, Ort, Amn num Monarch de 4 sockets.",
          },
          "offhand-0-alt0": {
            why: "Se 156 de Strength por um Monarch for caro demais agora — e normalmente é — o Rhyme num escudo leve é o intermediário sensato.",
          },
          "offhand-0-alt1": {
            why: "Continua perfeitamente utilizável se resistência for o seu problema.",
          },
          "body-0": {
            why: "+1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências com apenas 43 de Strength. A melhor armadura econômica de caster do jogo e um upgrade direto sobre o Stealth.",
          },
          "body-0-alt0": {
            why: "+50 em todas as resistências se resistência for o gargalo e você puder viver sem o FCR.",
          },
          "body-0-alt1": {
            why: "Continua servindo. Não gaste runas substituindo até ter algo genuinamente melhor.",
          },
          "helm-0": { why: "Continua servindo." },
          "helm-0-alt0": {
            why: "+2 skills, vida, mana, 50% de magic find e 10% de redução de dano. Se você achar um Shako, use na hora.",
          },
          "amulet-0": {
            label: "Qualquer amuleto com +2 Sorceress Skills",
            why: "+2 skills de classe é o afixo de amuleto mais valioso. Um amuleto mágico sem mais nada ainda vale a pena usar.",
            lookFor: ["+2 Sorceress Skill Levels", "Faster Cast Rate", "Resistências"],
          },
          "gloves-0": { why: "Ainda a resposta certa. 20% de FCR de graça." },
          "ring1-0": {
            label: "Anel raro ou mágico: 10% de FCR com resistências",
            why: "Dois anéis de 10% de FCR mais Spirit sword, Spirit shield e Magefist te colocam em 100% — logo abaixo do breakpoint de 105%, que mais uma fonte fecha.",
            lookFor: ["10% de Faster Cast Rate", "+Vida", "Resistências"],
          },
          "boots-0": {
            label: "Botas raras: Faster Run/Walk, Faster Hit Recovery, resistências",
            why: "O lugar mais barato para conseguir o Faster Hit Recovery de que você precisa para o breakpoint de 60%.",
            lookFor: ["30% de Faster Run/Walk", "Faster Hit Recovery", "Duas resistências"],
          },
        },
      },
      "early-hell": {
        goal: "Sobreviver aos Atos 1 a 3 do Hell e começar a farmar Mephisto e Andariel por upgrades de verdade.",
        nextUpgrade:
          "Alcance 105% de Faster Cast Rate. Depois farme Mephisto e Andariel até aparecer um Nightwing's Veil, um Death's Fathom ou as runas de um Heart of the Oak.",
        notes:
          "É o nível em que a maioria dos personagens empaca, e o motivo é quase sempre resistência, não dano. Coloque as quatro em 75% antes de se preocupar com a sua arma.",
        picks: {
          "weapon-0": {
            why: "+3 skills, 30% de FCR, +20 em todas as resistências e 50% de magic find. A arma clássica de magic find do início do Hell.",
          },
          "weapon-0-alt0": {
            why: "Uma Spirit sword continua genuinamente competitiva. O Oculus ganha em magic find e resistências, não em dano.",
          },
          "offhand-0": {
            why: "Spirit Monarch. A esta altura, Sandstorm Trek ou um charm de Strength já devem tornar os 156 de Strength viáveis.",
          },
          "body-0": {
            why: "Continua excelente. 30% de FCR no slot de armadura é difícil de substituir barato.",
          },
          "helm-0": {
            why: "+2 skills, +1,5 de vida por nível, 50% de magic find e 10% de redução de dano. O melhor elmo faz-tudo do jogo e bem encontrável.",
            sockets: "Um perfect topaz para magic find, ou uma runa Um para resistências.",
          },
          "helm-0-alt0": { why: "Continua servindo. Substitua quando achar um Shako." },
          "belt-0": {
            label: "Cinto raro com vida, Faster Hit Recovery e resistências",
            why: "O Arachnid Mesh exige nível 80, então um bom cinto raro cobre o intervalo.",
            lookFor: ["+Vida", "Faster Hit Recovery", "Duas resistências", "16 espaços"],
          },
          "boots-0": {
            why: "20% de Faster Hit Recovery, +10-15 de Strength (que ajuda a pagar o Monarch) e muita resistência a veneno.",
          },
          "boots-0-alt0": {
            why: "Até 50% de magic find, ao custo de 95 de Strength. Escolha só num conjunto dedicado a magic find.",
          },
          "ring1-0": {
            why: "+1 skills e +25% de mana máxima. Nunca venda um a um vendedor por acidente — isso avança o Diablo Clone.",
          },
          "ring1-0-alt0": {
            label: "Anel raro de 10% de FCR com resistências",
            why: "Mais barato, e frequentemente melhor se você precisa do breakpoint de FCR.",
          },
        },
        charms: [
          {
            label: "Small charms com resistências",
            why: "A resistência mais barata do jogo. Uma fileira de small charms de +11 de resistência resolve muita coisa.",
          },
          {
            label: "Grand charms de Cold Skill",
            why: "+1 Cold Skills cada. Multiplica diretamente o dano do Blizzard. Procure os que vêm com vida junto.",
          },
        ],
      },
      budget: {
        goal: "Um conjunto completo de farm no Hell, self-found, com 105% de Faster Cast Rate.",
        nextUpgrade:
          "Um Death's Fathom ou um Heart of the Oak, e depois o Nightwing's Veil. Esses três são a diferença entre uma boa Blizzard Sorceress e uma finalizada.",
        picks: {
          "weapon-0": {
            why: "30% de FCR e 50% de magic find. Combinado com Spirit shield (35), Magefist (20) e um anel de 10% de FCR, você chega a 95 — mais uma fonte de 10% fecha o breakpoint de 105.",
          },
          "weapon-0-alt0": {
            why: "+3 skills, 40% de FCR e até +40 em todas as resistências. O maior ganho de qualidade de vida da build, e torna trivial bater os 105%.",
          },
          "offhand-0": {
            why: "Spirit Monarch. +2 skills e 35% de FCR com quatro runas do Normal.",
          },
          "body-0": {
            why: "Ainda se segurando bem neste nível. 30% de FCR e resistências com 43 de Strength.",
          },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências. Caro (Ber e Ist), e libera todos os outros slots para buscar dano em vez de resistência.",
          },
          "helm-0": {
            why: "A escolha faz-tudo: skills, vida, magic find e redução de dano.",
          },
          "helm-0-alt0": {
            why: "+2 skills e até +15% de Dano de Skills de Frio. Mais dano, menos magic find e nenhuma redução de dano.",
          },
          "amulet-0": {
            why: "+2 em todas as skills e até +30 em todas as resistências. Simples e muito difícil de superar.",
          },
          "amulet-0-alt0": {
            label: "Amuleto crafted ou raro: +2 Sorceress Skills com 10-20% de Faster Cast Rate",
            why: "O Mara's não tem FCR nenhum. Um amuleto com +2 skills *e* FCR pode valer mais se o seu breakpoint estiver apertado.",
            lookFor: [
              "+2 Sorceress Skill Levels",
              "10-20% de Faster Cast Rate",
              "Vida",
              "Resistências",
            ],
          },
          "belt-0": {
            why: "O único cinto com +1 skills e 20% de Faster Cast Rate juntos. Exige nível 80.",
          },
          "belt-0-alt0": {
            label: "Cinto raro com vida, FHR e resistências",
            why: "O Arachnid Mesh só tem 12 espaços de poção — um bom cinto raro é uma escolha defensável.",
          },
          "gloves-0": {
            why: "20% de FCR. Ainda, depois de oitenta níveis, um dos itens de melhor custo-benefício que você tem.",
          },
          "gloves-0-alt0": {
            label: "Trang-Oul's Claws",
            why: "20% de FCR e +25% de resistência a frio. Upgrade direto sobre o Magefist se você tiver a peça do set.",
          },
          "boots-0": { why: "Faster Hit Recovery, Strength e resistência a veneno." },
          "ring1-0": { why: "+1 skills, +25% de mana máxima." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate com resistências e vida",
            why: "É quase sempre este slot que fecha o breakpoint de 105%.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "+Vida", "+Mana"],
          },
        },
        charms: [
          {
            label: "Grand charms de Cold Skill com vida",
            why: "+1 Cold Skills cada. O melhor dano por espaço de inventário disponível.",
          },
          {
            label: "Small charms de resistência",
            why: "Preencha os buracos das suas resistências para que o equipamento possa buscar dano.",
          },
          {
            label: "Annihilus",
            why: "+1 em todas as skills, +10-20 em todos os atributos, +10-20 em todas as resistências. Vem do Uber Diablo.",
          },
          {
            label: "Hellfire Torch (Sorceress)",
            why: "+3 skills de Sorceress e +10-20 em todas as resistências. Vem do Uber Tristram.",
          },
          {
            label: "Cold Rupture (Sunder Charm)",
            why: "Coloca monstros imunes a frio em 95% de resistência a frio. É isto que permite a uma Blizzard Sorceress farmar em qualquer lugar, em vez de só em zonas amigáveis a frio. Repare que o Patch 3.3 subiu o nível mínimo de drop do Latent Sunder Charm para 75 e restringiu drops via magic find ao Hell.",
          },
        ],
        weaponSwap: [
          {
            why: "Battle Orders no slot de troca é cerca de 40% a mais de vida. Conjure Battle Command duas vezes, depois Battle Orders, e volte. Combine com um Spirit ou um Lidless Wall na mão secundária pelos +skills.",
          },
        ],
      },
      optimized: {
        goal: "Dano quase máximo mantendo magic find e resistências intactos.",
        nextUpgrade:
          "Um Infinity no mercenário. É o último upgrade relevante — a Conviction reduz ainda mais a resistência a frio e quebra muitas imunidades a frio por completo.",
        picks: {
          "weapon-0": {
            why: "+3 skills de Sorceress e até +30% de Dano de Skills de Frio — a maior fonte isolada de dano da build.",
            sockets:
              "Um Cold Rainbow Facet. Priorize o roll de -resistência a frio do inimigo sobre o de +dano de frio.",
          },
          "weapon-0-alt0": {
            why: "40% de FCR contra os 20% do Death's Fathom, mais até +40 em todas as resistências. Menos dano, breakpoints muito mais fáceis. Uma escolha de endgame completamente legítima.",
          },
          "offhand-0": {
            why: "O Spirit Monarch continua best-in-slot para a maioria dos conjuntos. +2 skills e 35% de FCR não é superável a preço nenhum para um caster.",
          },
          "offhand-0-alt0": {
            label: "Monarch com 4 Cold Rainbow Facets",
            why: "Dano de frio máximo, ao custo dos +2 skills e dos 35% de FCR do Spirit. Só correto se o seu breakpoint de FCR estiver coberto em outro lugar.",
          },
          "offhand-0-alt1": {
            why: "35% de redução de dano e muito bloqueio. Uma escolha de Hardcore — custa bastante dano.",
          },
          "helm-0": {
            why: "+2 skills e até +15% de Dano de Skills de Frio. O Requirements -50% faz os 192 de Strength custarem só 96 na prática.",
            sockets: "Um Cold Rainbow Facet.",
          },
          "helm-0-alt0": {
            why: "Troque dano por 50% de magic find, +1,5 de vida por nível e 10% de redução de dano. Num conjunto de magic find, este é o elmo melhor.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências. As resistências liberam todos os outros slots para buscar dano.",
          },
          "body-0-alt0": {
            why: "Só se tiver rolado +3 Blizzard. Esse roll específico é um dos maiores upgrades de dano da build; qualquer outro faz dele uma armadura medíocre.",
          },
          "body-0-alt1": {
            why: "Menos útil numa Sorceress que em qualquer outra classe — ela já tem Teleport. Ainda valioso pelos +2 skills, pelo bônus de Strength e pelo magic find que escala com o nível.",
          },
          "amulet-0": { why: "+2 skills e até +30 em todas as resistências." },
          "amulet-0-alt0": {
            label: "Amuleto crafted de caster: +2 Sorceress Skills, 20% de FCR, vida, mana",
            why: "Supera o Mara's quando você precisa do FCR.",
          },
          "belt-0": { why: "+1 skills e 20% de FCR. Praticamente obrigatório aqui." },
          "gloves-0": {
            label: "Trang-Oul's Claws",
            why: "20% de FCR e +25% de resistência a frio.",
          },
          "gloves-1": { why: "20% de FCR. Continua perfeitamente bom." },
          "boots-0": { why: "FHR, Strength e resistência a veneno." },
          "boots-1": {
            label: "Botas raras: FHR, Faster Run/Walk e duas resistências",
            why: "Uma rara bem rolada supera qualquer unique aqui.",
            lookFor: ["Faster Hit Recovery", "30% de Faster Run/Walk", "Duas resistências altas"],
          },
          "ring1-0": { why: "+1 skills, +25% de mana máxima." },
          "ring2-0": {
            label: "Anel raro: 10% de FCR, resistências, vida, mana",
            why: "O que fechar o seu breakpoint de 105% e remendar a sua pior resistência.",
            lookFor: ["10% de Faster Cast Rate", "+Vida", "Duas resistências"],
          },
        },
        charms: [
          { label: "Annihilus", why: "+1 em todas as skills, todos os atributos, todas as resistências." },
          {
            label: "Hellfire Torch (Sorceress)",
            why: "+3 skills de Sorceress e +10-20 em todas as resistências.",
          },
          {
            label: "Grand charms de Cold Skill com vida",
            why: "Quantos couberem no seu inventário.",
          },
          {
            label: "Cold Rupture (Sunder Charm)",
            why: "Remove a única fraqueza real da build. Leve ao farmar zonas cheias de imunes e troque quando não precisar.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders. Cerca de +40% de vida e mana." },
          {
            label: "Lidless Wall ou um Spirit na mão secundária da troca",
            why: "Mais +skills significa um Battle Orders de nível mais alto vindo do mesmo Call to Arms.",
          },
        ],
      },
      bis: {
        goal: "O máximo absoluto. Cada slot otimizado para dano, com as resistências no teto.",
        nextUpgrade:
          "Nada no seu próprio equipamento. Daqui em diante os upgrades são no mercenário (Infinity, Fortitude, Andariel's Visage) e nos rolls dos charms.",
        notes:
          "Mesmo no best-in-slot, mantenha as resistências em 75%. Uma Sorceress morta com dano perfeito não mata nada.",
        picks: {
          "weapon-0": {
            why: "Um roll de 30% de Dano de Skills de Frio, encaixado com um Rainbow Facet de -5% de resistência a frio do inimigo.",
            sockets: "Cold Rainbow Facet, priorizando o roll de -resistência a frio do inimigo.",
          },
          "offhand-0": {
            why: "Um roll de 35% de FCR num Monarch. Nada o deslocou em vinte anos.",
          },
          "helm-0": {
            why: "Um roll de 15% de Dano de Skills de Frio, encaixado com um Cold Rainbow Facet.",
            sockets: "Cold Rainbow Facet.",
          },
          "body-0": {
            why: "+2 skills, +65 em todas as resistências, 8% de redução de dano. As resistências são o que tornam possível um conjunto de dano máximo em todo o resto.",
          },
          "body-0-alt0": {
            why: "Só com um roll de +3 Blizzard, e só se as suas resistências estiverem cobertas sem o Chains of Honor.",
          },
          "amulet-0": {
            label: "Amuleto crafted de caster: +2 Sorceress Skills, 20% de FCR, +vida, +mana",
            why: "O único slot em que um item crafted genuinamente supera todo unique, porque consegue carregar skills e FCR juntos.",
            lookFor: ["+2 Sorceress Skill Levels", "20% de Faster Cast Rate", "+Vida", "+Mana"],
          },
          "amulet-1": { why: "A alternativa confiável, se o craft nunca sair." },
          "belt-0": { why: "+1 skills, 20% de FCR." },
          "gloves-0": {
            label: "Trang-Oul's Claws",
            why: "20% de FCR e +25% de resistência a frio.",
          },
          "boots-0": {
            label: "Botas raras: 30% de FRW, Faster Hit Recovery, duas resistências altas",
            why: "Uma rara perfeita supera qualquer bota unique para um caster.",
            lookFor: [
              "Faster Hit Recovery",
              "30% de Faster Run/Walk",
              "Duas resistências em 30%+",
            ],
          },
          "ring1-0": { why: "+1 skills." },
          "ring2-0": {
            label: "Anel raro: 10% de FCR, +vida, duas resistências",
            why: "Ajustado para fechar o breakpoint de 105% exatamente, sem nada desperdiçado.",
          },
        },
        charms: [
          {
            label: "Annihilus (20/20/20)",
            why: "+1 em todas as skills, +20 em todos os atributos, +20 em todas as resistências.",
          },
          { label: "Hellfire Torch (Sorceress, 3/20/20)", why: "+3 skills de Sorceress." },
          {
            label: "9 grand charms de Cold Skill com 40+ de vida",
            why: "+9 Cold Skills e cerca de 400 de vida.",
          },
          {
            label: "Cold Rupture (Sunder Charm)",
            why: "Trocado para dentro em conteúdo cheio de imunes.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders, conjurado depois de dois Battle Commands." },
          {
            label: "Spirit Monarch (troca)",
            why: "Mais +skills para um Battle Orders de nível mais alto.",
          },
        ],
      },
    },
  },

  hammerdin: {
    summary:
      "Dano mágico que quase nada resiste, bloqueio máximo permanente, e uma aura para o grupo inteiro. O faz-tudo de referência.",
    playstyle:
      "Você roda a Concentration, se posiciona para que a espiral do hammer passe pelo grupo, e segura o botão. Os hammers miram mal e você mira bem — a habilidade inteira da build é ficar no lugar certo. O Holy Shield mantém o seu bloqueio no máximo, então, diferente da maioria das builds de dano alto, você pode simplesmente ficar no meio das coisas. Com Enigma você teleporta para a posição em vez de andar, e a build fica tão rápida quanto uma Sorceress sendo muito mais difícil de matar.",
    strengths: [
      "Dano mágico — só um punhado de monstros no jogo inteiro resiste",
      "150% de dano bônus contra Undead e Demons, que é a maior parte do Chaos Sanctuary e do Baal",
      "Bloqueio máximo permanente pelo Holy Shield; genuinamente resistente com dano total",
      "Concentration e Vigor beneficiam o grupo inteiro",
      "Forte em qualquer nível de equipamento, do Spirit-e-Lore ao best-in-slot completo",
    ],
    weaknesses: [
      "A espiral do hammer é genuinamente difícil de mirar, e a build parece fraca até o clique acontecer",
      "Precisa de Enigma para alcançar a velocidade de limpeza de uma Sorceress — e o Enigma é caro",
      "O dano escala só com +skills, então equipamento de dano bruto não faz nada",
      "Divide os pontos de atributo em três: Strength para equipamento, Dexterity para bloqueio, Vitality para vida",
    ],
    flexPoints: [
      "Um ponto em **Fanaticism** vale a pena assim que os pré-requisitos permitirem — custa quase nada e é uma aura forte de grupo.",
      "**Salvation** é uma troca útil de um ponto para o Uber Tristram e outros conteúdos hostis a resistência. Repare que ela aumenta apenas a resistência *atual* — diferente das três auras de Resist, não tem componente nenhum de resistência máxima.",
      "**A variante de 20 pontos em Resist Lightning, e o que ela realmente compra.** O Uber Mephisto roda Conviction, que arrasta a sua resistência a raio para baixo; um *teto* mais alto é o que te segura no topo dessa queda. Vinte pontos duros sobem o teto em 20% enquanto Resist Lightning é a aura ativa, ou em 10% enquanto não é. Um Hammerdin mantém a **Concentration** ativa — é o multiplicador de dano em que a build inteira se apoia — então o valor honesto desta variante é **+10% passivo, sempre ligado, de 75% para 85%**. Trocar a aura pelos +20% completos significa enfrentar os Ubers com hammers sem buff, que costuma ser a troca pior.",
      "**Por que é variante de Uber e não o plano de PvM.** Vinte pontos são 18% do personagem. Fora do Uber Tristram nada pune ter teto de 85% em vez de 75%, e esses pontos rendem mais no Holy Shield ou como auras de um ponto. Pegue se o Uber Tristram for o objetivo deste personagem; ignore caso contrário.",
      "Pontos extras além das cinco skills maximizadas vão para **Holy Shield**, por mais defesa e bloqueio, ou para **Redemption**, por sustentação mais rápida.",
    ],
    statPlan: {
      strength:
        "O suficiente para o seu equipamento. 103 para um Herald of Zakarum, menos se você usar um Spirit numa base mais leve.",
      dexterity:
        "O suficiente para alcançar 75% de bloqueio **com o Holy Shield ativo**. Confira com o Holy Shield ligado, não desligado.",
      vitality: "Todo o restante.",
      energy: "Nenhum. Insight e Redemption cobrem a mana por completo.",
      notes: [
        "É aqui que o Hammerdin mais difere de um caster: **Dexterity é investimento real**, não algo a ignorar. Bloqueio máximo é a sobrevivência da build, e é o que permite ficar no meio dos grupos.",
        "Calcule a Dexterity com o Holy Shield **ativo**. O bônus de bloqueio dele significa que você precisa de muito menos Dexterity do que os números crus do escudo sugerem, e as pessoas rotineiramente investem cinquenta pontos a mais.",
        "Strength depende inteiramente da escolha de escudo. Um Spirit em Sacred Targe precisa de muito menos que um Monarch, e é por isso que essa é a base preferida.",
        "O +0,75 de Strength por nível de um Enigma significa que você pode planejar Strength assumindo que vai ter um — mas não se deixe travado antes disso.",
      ],
    },
    breakpointWhy: {
      "fcr-125":
        "A meta de endgame. Alcançável com Heart of the Oak (40) + Spirit shield (35) + Arachnid Mesh (20) + Magefist (20) + um anel de 10%.",
      "fcr-75":
        "Alcance esta primeiro. Dois Spirits (35 + 35) mais Magefist (20) chegam a 90% sem nenhum item raro.",
      "fhr-48":
        "A tabela do Paladin é generosa. 48% é confortavelmente alcançável e basta para quase todo conteúdo.",
      "fbr-32":
        "Você está bloqueando o tempo todo, então recuperar de um bloqueio importa. Só o Herald of Zakarum já dá 30%.",
    },
    skillNotes: {
      "blessed-hammer":
        "Maximize primeiro. Dano mágico numa espiral horária, mais 150% contra Undead e Demons.",
      vigor: "+14% de dano mágico por nível, e deixa você mais rápido. Maximize em segundo.",
      concentration:
        "Sua aura ativa. Multiplica o dano do hammer diretamente — não é sinergia, precisa estar rodando.",
      "blessed-aim": "+14% de dano mágico por nível. Você nunca vai ativar esta aura.",
      "resist-lightning": "**A variante para Uber Tristram, não a build principal — e ela vale dois valores diferentes.** Com a aura rodando, vinte pontos duros dão +20% de resistência máxima a raio, levando o teto de 75% para 95%. Mas um Hammerdin roda **Concentration**, e só uma aura fica ativa por vez, então na prática você fica com a metade passiva: **+10%, teto de 85%**. Os dois números leem o nível *base*, então +skills de equipamento não aumentam nenhum. Veja os pontos flexíveis abaixo para quando cada um se aplica.",
      "holy-shield":
        "Um ponto fixo. +skills sobe bem além disso, e é o que mantém o seu bloqueio no máximo.",
      redemption:
        "Troque para ela depois de um grupo para reabastecer vida e mana com os cadáveres. Substitui a maior parte do uso de poções.",
      cleansing: "Pré-requisito do Vigor, junto com a Defiance, e uma troca de verdade contra duração de maldições.",
      defiance: "Pré-requisito do Vigor.",
      might: "Pré-requisito do Blessed Aim, e uma aura utilizável no começo.",
      smite: "Pré-requisito do Charge e, portanto, do Holy Shield. Também nunca erra.",
      "holy-bolt": "Pré-requisito do Blessed Hammer. Cura outros jogadores.",
      "charge": "**O Holy Shield exige Blessed Hammer e Charge.** O Charge, por sua vez, exige Smite, então o par custa dois pontos, não um.",
      "prayer": "Pré-requisito do Cleansing e, portanto, do caminho até o Vigor.",
    },
    immunityPlan:
      "Esta é a vantagem que define a build: o Blessed Hammer causa dano mágico, e apenas um número pequeno de monstros nos Atos 2 e 3 é imune a mágico. Na prática, ou você deixa o mercenário lidar com eles, ou passa direto. Não há Sunder Charm para caçar, Infinity para juntar, nem zona que você precise evitar. A troca é que você também não consegue aumentar o seu dano reduzindo resistência inimiga — a Conviction não faz nada por dano mágico — então o seu dano vem inteiramente de +skills e da Concentration.",
    mercenaryNotes:
      "Contrate um mercenário do Ato 2 no Nightmare. Holy Freeze costuma ser a escolha aqui em vez de Might: o seu dano não precisa de ajuda, e desacelerar tudo ao redor facilita muito o posicionamento dos hammers. Insight pela mana, Treachery ou Duriel's Shell pela sobrevivência, Vampire Gaze pelo roubo de vida e redução de dano.",
    farmingWhy: {
      "chaos-sanctuary-hell":
        "Nível de área 85, extremamente denso, e quase nada aqui resiste a mágico. O bônus de 150% contra Undead e Demons se aplica a quase todo monstro da zona. Esta é a casa do Hammerdin.",
      "worldstone-keep-hell":
        "Três andares de nível de área 85 e o Baal no fim. Todos os tipos de imunidade aparecem, e o Hammerdin ignora todos.",
      "travincal-hell":
        "O Council é imune a fogo e a raio, o que trava a maioria dos casters. Eles não são imunes a mágico. O agrupamento apertado combina perfeitamente com a espiral do hammer.",
      "pit-hell":
        "Nível de área 85, denso, e os imunes a frio e a raio dele são irrelevantes para você.",
      "ancient-tunnels-hell":
        "Nível de área 85 e compacto. Funciona bem, embora se destaque menos aqui do que para uma build de frio.",
      "mephisto-hell":
        "Monstro nível 87 e um trajeto de vinte segundos. Ele é imune a fogo e a raio, e nada disso importa.",
      "countess-nightmare": "De onde vêm as runas dos seus Spirits, do Lore e do Insight.",
      "mausoleum-hell":
        "Nível de área 85, majoritariamente undead — o que significa que o bônus de 150% contra Undead se aplica a quase tudo.",
      "pindleskin-hell":
        "Monstro nível 86 a dez segundos de um portal na cidade, e ele é undead.",
    },
    levelingPath: {
      summary:
        "Diferente da Blizzard Sorceress, você pode evoluir com esta build diretamente. O Blessed Hammer abre no 18 e é imediatamente utilizável — sem respec. Antes do 18, use Zeal com uma arma decente, ou Holy Fire e uma aura Might.",
      respecAt:
        "Normalmente desnecessário. Guarde os tokens da Den of Evil para experimentar, ou para corrigir um excesso de investimento em Dexterity.",
    },
    selfFoundNotes:
      "Forte em self-found até certo ponto. Dois Spirits, Lore, Ancient's Pledge e Insight vêm todos de runas da Countess, e Herald of Zakarum, Harlequin Crest e Skin of the Vipermagi são todos realisticamente encontráveis. A parede é o Enigma: Jah, Ith e Ber é um pedido sério em solo, e a build é visivelmente mais lenta sem ele. Ainda assim, ela farma Chaos Sanctuary e Travincal perfeitamente bem enquanto você junta.",
    hardcoreNotes:
      "Uma das builds mais seguras do jogo para Hardcore. Bloqueio máximo pelo Holy Shield, uma reserva grande de vida, e dano mágico que nunca te deixa incapaz de matar algo. Pegue Holy Freeze no mercenário. Prefira Herald of Zakarum a um segundo Spirit pelas resistências e pelo bloqueio, e considere Crown of Ages em vez de Harlequin Crest pela redução de dano. O risco real de Hardcore nesta build é o Iron Maiden dos Oblivion Knights no Chaos Sanctuary — ele reflete dano físico, e, embora os seus hammers sejam mágicos, os ataques do seu mercenário não são.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 18 e ao Blessed Hammer, e então atravessar o Normal.",
        nextUpgrade:
          "Blessed Hammer no 18, depois um Spirit no 25. Pratique a espiral — a build vive ou morre do posicionamento.",
        notes:
          "Evolua com Blessed Hammer a partir do 18 se quiser; diferente do Blizzard, ele é imediatamente utilizável. Antes do 18, use Zeal ou Holy Fire com uma arma decente.",
        picks: {
          "weapon-0": {
            why: "O maior salto de poder disponível para um personagem novo. +2 skills e até 35% de Faster Cast Rate no nível 25, com as mesmas quatro runas da Countess do Spirit de qualquer outra build.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "weapon-0-alt0": {
            label: "Qualquer scepter com +Blessed Hammer ou +Concentration",
            why: "Scepters de Paladin rolam bônus de skill de classe. Compre dos vendedores — um scepter de +3 Blessed Hammer supera a maioria dos uniques iniciais.",
            lookFor: ["+3 Blessed Hammer", "+3 Concentration", "+2 Combat Skills"],
          },
          "offhand-0": {
            why: "Três runas da Countess para resistências quase no máximo, e um escudo de Paladin soma a resistência inerente dele por cima.",
          },
          "offhand-0-alt0": {
            why: "Cannot Be Frozen e 25% de magic find por duas runas.",
          },
          "body-0": {
            why: "25% de Faster Cast Rate, 25% de Faster Run/Walk e 25% de Faster Hit Recovery no nível 17.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
          "gloves-0": { why: "20% de Faster Cast Rate no nível 23." },
          "belt-0": {
            why: "+10 em todas as resistências e 50% de dano convertido em mana no nível 20. Um cinto genuinamente bom no começo para uma build sem Energy.",
          },
        },
      },
      nightmare: {
        goal: "Alcançar 75% de Faster Cast Rate e colocar as resistências sob controle.",
        nextUpgrade:
          "Chegue a 75% de Faster Cast Rate, depois empurre as resistências para 75% antes de entrar no Hell. Em seguida, comece a juntar para o Enigma.",
        picks: {
          "weapon-0": {
            why: "Ainda correto. Não há nada melhor até o Heart of the Oak.",
          },
          "offhand-0": {
            why: "Um segundo Spirit num escudo. Dois Spirits mais Magefist são 90% de Faster Cast Rate — bem além do breakpoint de 75%.",
            sockets:
              "Tal, Thul, Ort, Amn numa Sacred Targe de 4 sockets, se você achar uma — o requisito de Strength dela é bem menor que o de um Monarch.",
          },
          "offhand-0-alt0": {
            why: "+2 skills de Paladin, +2 Combat skills, +50 em todas as resistências e 30% de chance de bloqueio. Menos Faster Cast Rate que o Spirit, muito mais defesa.",
          },
          "body-0": {
            why: "+1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências com apenas 43 de Strength.",
          },
          "body-0-alt0": { why: "+50 em todas as resistências, se for esse o gargalo." },
          "body-0-alt1": {
            why: "Os +25 de Strength efetivamente devolvem 25 pontos de atributo, que um Paladin pode gastar em Dexterity.",
          },
          "helm-0": { why: "Continua servindo até um Shako aparecer." },
          "amulet-0": {
            label: "Qualquer amuleto com +2 Paladin Skills",
            why: "+2 skills de classe é o afixo de amuleto mais valioso. Combat Skills especificamente é ainda melhor.",
            lookFor: [
              "+2 Paladin Skill Levels",
              "+3 Combat Skills",
              "Faster Cast Rate",
              "Resistências",
            ],
          },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "boots-0": {
            label: "Botas raras com Faster Run/Walk e resistências",
            why: "Você ainda anda para todo lado até o Enigma. Velocidade de movimento tem valor real aqui.",
            lookFor: ["30% de Faster Run/Walk", "Duas resistências", "Faster Hit Recovery"],
          },
        },
      },
      "early-hell": {
        goal: "Sobreviver ao Hell e começar a farmar. O Enigma é o objetivo que muda tudo.",
        nextUpgrade:
          "Enigma. Nada chega perto — o Teleport transforma isto de uma boa build na melhor build.",
        picks: {
          "weapon-0": { why: "Continua dando conta." },
          "offhand-0": {
            why: "+2 skills de Paladin e +2 Combat skills, +50 em todas as resistências, +20 de Strength e +20 de Vitality, e 30% de chance de bloqueio. No início do Hell as resistências e o bloqueio importam mais que o cast rate do Spirit.",
            sockets: "Uma runa Um por mais resistências, ou um perfect diamond.",
          },
          "offhand-0-alt0": {
            why: "Se você precisar do Faster Cast Rate para manter o seu breakpoint.",
          },
          "body-0": { why: "Continua a melhor armadura econômica de caster." },
          "body-0-alt0": {
            why: "Cannot Be Frozen, +15 de Strength, +1 de vida por nível e boas resistências. Uma alternativa defensiva.",
          },
          "helm-0": {
            why: "+2 skills, +1,5 de vida por nível, 50% de magic find e 10% de redução de dano.",
            sockets: "Uma runa Um por resistências, ou um perfect topaz por magic find.",
          },
          "belt-0": {
            why: "Até 15% de redução de dano físico e 8% de roubo de vida, numa build que fica em alcance corpo a corpo. Só 20 de Strength.",
          },
          "boots-0": {
            why: "Faster Hit Recovery, +Strength (que compra requisito de escudo) e muita resistência a veneno.",
          },
          "ring1-0": {
            why: "+1 skills e +25% de mana máxima. Hammers custam mana e você não tem Energy.",
          },
        },
        charms: [
          {
            label: "Small charms de resistência",
            why: "A resistência mais barata do jogo.",
          },
          {
            label: "Grand charms de Paladin Combat Skill",
            why: "+1 Combat Skills cada — multiplica diretamente o dano do hammer.",
          },
        ],
      },
      budget: {
        goal: "Um conjunto completo de farm no Hell com Enigma e 75% de Faster Cast Rate.",
        nextUpgrade:
          "Heart of the Oak, e depois empurre até o breakpoint de 125% de Faster Cast Rate.",
        picks: {
          "weapon-0": {
            why: "Perfeitamente adequado. O Heart of the Oak é um upgrade grande, mas não um requisito.",
          },
          "weapon-0-alt0": {
            why: "+3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências. A arma definitiva de endgame do Hammerdin.",
          },
          "offhand-0": {
            why: "Numa Sacred Targe. +2 skills e 35% de Faster Cast Rate com um requisito de Strength que um Paladin realmente consegue pagar.",
          },
          "offhand-0-alt0": {
            why: "Troque cast rate por resistências, bloqueio e +2 Combat skills.",
          },
          "body-0": {
            why: "Teleport. É o maior upgrade isolado disponível para a build — muda a sua velocidade de limpeza mais que qualquer item de dano. O +0,75 de Strength por nível ainda paga pelo seu escudo.",
            sockets: "Jah, Ith, Ber numa Mage Plate ou Archon Plate de 3 sockets.",
          },
          "body-0-alt0": { why: "Até você conseguir pagar Jah, Ith e Ber." },
          "helm-0": { why: "+2 skills, vida, magic find e redução de dano." },
          "amulet-0": { why: "+2 em todas as skills e até +30 em todas as resistências." },
          "amulet-0-alt0": {
            label: "Amuleto raro ou crafted: +2 Paladin Skills com Faster Cast Rate",
            why: "O Mara's não tem Faster Cast Rate. Se o seu breakpoint de 125% estiver apertado, um amuleto que carregue os dois vale mais.",
            lookFor: [
              "+2 Paladin Skill Levels",
              "10-20% de Faster Cast Rate",
              "Resistências",
            ],
          },
          "belt-0": { why: "+1 skills e 20% de Faster Cast Rate." },
          "belt-1": { why: "Troca as skills e a velocidade de conjuração por redução de dano físico." },
          "belt-0-alt0": {
            why: "Troque o skill e o cast rate por redução de dano físico.",
          },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "boots-0": { why: "Faster Hit Recovery e Strength." },
          "boots-1": { why: "Até 50% de magic find numa configuração voltada a magic find." },
          "boots-0-alt0": {
            why: "Até 50% de magic find num conjunto voltado para isso.",
          },
          "ring1-0": { why: "+1 skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate com resistências",
            why: "Normalmente é o que fecha o breakpoint de 125%.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "+Vida", "+Mana"],
          },
        },
        charms: [
          {
            label: "Grand charms de Paladin Combat Skill com vida",
            why: "+1 Combat Skills cada. O melhor dano por espaço de inventário.",
          },
          {
            label: "Annihilus",
            why: "+1 em todas as skills, +10-20 em todos os atributos e resistências.",
          },
          {
            label: "Hellfire Torch (Paladin)",
            why: "+3 skills de Paladin e +10-20 em todas as resistências.",
          },
          {
            label: "Small charms de resistência",
            why: "Preencha os buracos para que o equipamento possa buscar skills.",
          },
        ],
        weaponSwap: [
          {
            why: "Battle Orders. Cerca de +40% de vida e mana — e um Paladin tem uma reserva grande de vida para multiplicar.",
          },
        ],
      },
      optimized: {
        goal: "125% de Faster Cast Rate com bloqueio máximo e resistências no teto.",
        nextUpgrade:
          "Upgrades de mercenário — Fortitude e Andariel's Visage — e rolls perfeitos de charm. O seu próprio equipamento está essencialmente pronto.",
        picks: {
          "weapon-0": {
            why: "+3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências. Feito numa Flail — de uma mão, 41 de Strength, chega a 4 sockets.",
          },
          "offhand-0": {
            why: "Numa Sacred Targe, pelos 35% de Faster Cast Rate de que você precisa para chegar a 125%.",
          },
          "offhand-0-alt0": {
            why: "Se o seu cast rate estiver coberto em outro lugar, as resistências e o bloqueio valem mais.",
          },
          "body-0": { why: "Teleport. Inegociável neste nível." },
          "helm-0": { why: "+2 skills, vida, magic find, redução de dano." },
          "helm-1": {
            why: "+1 skills, 30% de Faster Hit Recovery, até 15% de redução de dano e dois sockets. A escolha de Hardcore.",
          },
          "amulet-0": { why: "+2 skills e resistências." },
          "belt-0": { why: "+1 skills, 20% de Faster Cast Rate." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "boots-0": {
            label: "Botas raras: Faster Hit Recovery, Faster Run/Walk, duas resistências",
            why: "Uma rara bem rolada supera qualquer unique aqui.",
            lookFor: [
              "Faster Hit Recovery",
              "30% de Faster Run/Walk",
              "Duas resistências em 30%+",
            ],
          },
          "ring1-0": { why: "+1 skills." },
          "ring2-0": { why: "Um segundo, se o seu breakpoint permitir." },
          "ring2-1": {
            label: "Anel raro de 10% de Faster Cast Rate",
            why: "O que fechar os 125% e remendar a sua pior resistência.",
          },
        },
        charms: [
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          {
            label: "9 grand charms de Combat Skill com vida",
            why: "+9 Combat Skills.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders." },
          {
            label: "Spirit ou Lidless Wall na mão secundária da troca",
            why: "Mais +skills significa um Battle Orders de nível mais alto.",
          },
        ],
      },
      bis: {
        goal: "Cada slot otimizado, 125% de Faster Cast Rate, 75% de bloqueio, resistências no teto.",
        nextUpgrade:
          "Nada no seu próprio equipamento. Confirme que o seu bloqueio está em 75% com o Holy Shield ativo, e as suas resistências em 75% no Hell.",
        picks: {
          "weapon-0": { why: "Um roll de 40% em todas as resistências, numa Flail." },
          "offhand-0": {
            why: "Um roll de 35% de Faster Cast Rate numa Sacred Targe, encaixado para a runeword e nada mais.",
          },
          "offhand-0-alt0": {
            why: "Upgradeado para Zakarum Shield e encaixado com um Um. O best-in-slot defensivo.",
          },
          "body-0": { why: "Numa Archon Plate." },
          "helm-0": {
            why: "Encaixado com uma runa Um por resistências, ou Ist por magic find.",
            sockets: "Runa Um, ou um perfect topaz num conjunto de magic find.",
          },
          "amulet-0": {
            label: "Amuleto crafted de caster: +2 Paladin Skills, 20% de Faster Cast Rate, vida, mana",
            why: "O único slot em que um craft genuinamente supera todo unique, porque carrega skills e cast rate juntos.",
            lookFor: [
              "+2 Paladin Skill Levels",
              "20% de Faster Cast Rate",
              "+Vida",
              "Resistências",
            ],
          },
          "amulet-1": { why: "A alternativa confiável." },
          "belt-0": { why: "+1 skills, 20% de Faster Cast Rate." },
          "gloves-0": {
            label: "Trang-Oul's Claws",
            why: "20% de Faster Cast Rate. Continua imbatível no slot.",
          },
          "boots-0": {
            label: "Botas raras: 30% de Faster Run/Walk, Faster Hit Recovery, duas resistências altas",
            why: "Uma rara perfeita, ajustada para fechar o que faltar.",
          },
          "ring1-0": { why: "+1 skills." },
          "ring2-0": {
            why: "+1 skills. Dois é o padrão assim que o cast rate estiver coberto em outro lugar.",
          },
        },
        charms: [
          {
            label: "Annihilus (20/20/20)",
            why: "+1 em todas as skills, +20 em todos os atributos e resistências.",
          },
          { label: "Hellfire Torch (Paladin, 3/20/20)", why: "+3 skills de Paladin." },
          {
            label: "9 grand charms de Combat Skill com 40+ de vida",
            why: "+9 Combat Skills e cerca de 400 de vida.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders, depois de dois Battle Commands." },
          {
            label: "Spirit na mão secundária da troca",
            why: "Mais +skills para um Battle Orders mais alto.",
          },
        ],
      },
    },
  },
  smiter: {
    summary:
      "Um ataque que não pode errar nem ser bloqueado, matando bosses de nível 110 com Crushing Blow. O especialista em Ubers.",
    playstyle:
      "Você chega perto de uma coisa e segura um botão. Não há mira, não há Attack Rating para satisfazer e não há chance de errar — Smite sempre acerta e ainda atordoa. A habilidade da build não está na luta, está na preparação: levar Life Tap, capar as resistências contra a aura de Conviction do Uber Mephisto, e separar os três Ubers para você só enfrentar um de cada vez. Longe de bosses esta build é genuinamente ruim, e isso é proposital.",
    strengths: [
      "Smite nunca erra e não pode ser bloqueado, então não precisa de nenhum investimento em Attack Rating",
      "Crushing Blow tira uma porcentagem da vida atual do alvo, o que escala para qualquer boss independentemente do tamanho da vida dele",
      "Bloqueio máximo com Holy Shield, resistências altas e escudo sempre erguido — o Paladin mais resistente",
      "Um conjunto funcional para Ubers é barato pelos padrões de endgame; as partes caras são opcionais",
      "Farma o Hellfire Torch, que melhora todo outro personagem que você tiver",
    ],
    weaknesses: [
      "Quase nenhum dano em área. Smite atinge um alvo e essa é a skill inteira",
      "Life Steal, Mana Steal e Deadly Strike não fazem nada — boa parte do equipamento normal de corpo a corpo é desperdício",
      "Precisa de Teleport do Enigma para se mover com alguma velocidade, ou anda a pé por tudo",
      "Imunes a físico são uma parede absoluta, e não há alternativa elemental",
      "Repetitiva por natureza. Um botão, um alvo, sem posicionamento",
    ],
    flexPoints: [
      "**Tudo além das quatro skills maximizadas é opcional.** Um Smiter está plenamente funcional por volta do nível 85, e os pontos restantes são conforto, não capacidade.",
      "**Mais Resist Lightning** é a melhor das opções restantes se o Uber Mephisto estiver te matando — a Conviction dele arrasta a sua resistência para baixo, e um *teto* mais alto é o que te segura no topo dessa queda. Repare qual número você está comprando: um Smiter roda **Fanaticism**, então você fica com metade do bônus, arredondada para baixo. Dez pontos duros são +5% passivos; os +10% completos exigem Resist Lightning como aura ativa, o que custa a velocidade de ataque e o dano da Fanaticism naquela luta.",
      "**Mais Vigor** se você joga sem Enigma. Velocidade de corrida é a diferença entre uma run de Ubers de quinze minutos e uma de nove.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint neste site.** Os limiares de frame do Smite dependem do modificador de velocidade da sua arma e dos dados de animação do próprio jogo, e nenhuma fonte que consideramos confiável publica isso. Fanaticism sozinho fornece de 10 a 40% e o Grief mais 30 a 40%, o que na prática resolve — mas preferimos dizer isso a imprimir um número que não conseguimos verificar.",
    ],
    statPlan: {
      strength: "O suficiente para o seu equipamento e nada além disso. Um escudo de Paladin pede muito pouco; normalmente é a arma que define o número.",
      dexterity:
        "O suficiente para bloqueio máximo **com o Holy Shield ativo**, mais o que a sua arma exigir. Um Grief numa Phase Blade pede 136 de Dexterity sozinho, o que para a maioria dos Smiters já passa do requisito de bloqueio.",
      vitality: "Todo o resto. Não há uso concorrente.",
      energy: "Nenhum. Smite custa quase nada e a Redemption cobre o resto.",
      notes: [
        "**Confira a sua porcentagem de bloqueio com o Holy Shield ligado, não desligado.** O Holy Shield fornece boa parte dela, e conferir com o buff desligado é a forma mais comum de um Paladin desperdiçar cinquenta pontos de atributo.",
        "Decida a sua arma antes de gastar Dexterity. O requisito de 136 de Dexterity de uma Phase Blade muda o plano inteiro; uma Berserker Axe ou um scepter não.",
        "Não coloque pontos em Energy. Os problemas de mana de um Smiter se resolvem com um ponto em Redemption e um Insight no mercenário.",
      ],
    },
    breakpointWhy: {
      "fbr-86":
        "Bloquear é a sua mitigação de dano, e os frames de recuperação são o que determina se você consegue agir entre golpes bloqueados. Só o Exile já dá 30%, e o Stormshield mais 35%.",
      "fhr-48":
        "O alvo prático. O Uber Diablo bate forte o bastante para que a recuperação decida se você consegue tomar uma poção.",
      "fhr-86":
        "Alcançável com um cinto Verdungo's e um anel raro, mas normalmente ao custo de resistências de que você precisa mais.",
    },
    skillNotes: {
      smite:
        "Disponível no nível 1. O dano por nível importa muito menos que o Crushing Blow, mas a duração do atordoamento escala com ele e é isso que impede um boss de agir.",
      fanaticism:
        "A sua aura ativa. Velocidade de ataque e dano, e se aplica também ao seu mercenário. Disponível no nível 30.",
      "holy-shield":
        "Chance de bloqueio e um bônus grande de defesa, e é o que permite ficar de frente para um Uber em vez de ao lado dele.",
      defiance:
        "Sinergia direta da defesa do Holy Shield — 15% mais armadura por ponto. Maximize por último; é real, mas é o item menos urgente da lista.",
      might: "No caminho até a Fanaticism.",
      "blessed-aim": "No caminho até a Fanaticism.",
      concentration:
        "No caminho até a Fanaticism. Também é uma aura genuinamente útil quando você quer sobreviver em vez de matar.",
      vigor: "Velocidade de corrida e stamina. Vale um ponto em qualquer personagem que ande a pé.",
      redemption:
        "Transforma cadáveres em vida e mana. Numa build sem life steal, é a sua recuperação entre lutas.",
      "resist-lightning":
        "Uma aura para a qual trocar pela resistência a raio. **Um ponto duro não compra resistência máxima passiva nenhuma** — o passivo é metade do valor da aura, arredondado para baixo — então este é a aura em si, não um bônus de fundo que você mantém enquanto a Fanaticism está rodando.",
      salvation:
        "Uma troca de um ponto para a entrada em Uber Tristram, onde toda resistência importa mais que qualquer aura de dano.",
      charge: "Mobilidade gratuita antes do Enigma. Não é dano — é transporte.",
      "holy-bolt": "Pré-requisito do Blessed Hammer e, portanto, do caminho até o Holy Shield.",
      "blessed-hammer": "**O Holy Shield exige Blessed Hammer e Charge.** Um ponto em cada; o Smiter nunca conjura nenhum dos dois.",
      "meditation": "Regeneração de mana para o grupo. Não é pré-requisito de nada aqui — pegue porque é útil.",
    },
    immunityPlan:
      "Smite é dano físico puro, então imunidade a físico é uma parada total sem alternativa elemental. Isso importa muito menos do que parece: nenhum dos Ubers é imune a físico, e a build não é uma farmadora geral. Onde você encontrar imunes a físico, a resposta é o seu mercenário, ou um sunder charm Bone Break, ou simplesmente passar direto — você não é obrigado a matar nada que seja inconveniente. A aura permanente de Conviction do Uber Mephisto é o problema real de resistência, e ele funciona na direção oposta: ela arranca as **suas** resistências, e é por isso que 75% antes de entrar não é negociável.",
    mercenaryNotes:
      "Contrate o mercenário do Ato 2 no Nightmare com **Might** pelo dano, ou **Holy Freeze** se você quiser os Ubers desacelerados. Holy Freeze é a escolha mais segura e a maioria dos Smiters usa ela. Ele vai morrer em Uber Tristram de qualquer jeito — leve ouro para reviver e não monte uma arma cara para ele antes de resolver o seu próprio equipamento.",
    farmingWhy: {
      "uber-tristram-hell":
        "O motivo de a build existir. Três bosses de nível 110, e a única fonte do Hellfire Torch.",
      "countess-hell": "Key of Terror, e runas para o Exile no caminho.",
      "arcane-sanctuary-hell": "O Summoner dropa a Key of Hate, e a run é curta.",
      "nihlathak-hell":
        "Key of Destruction. Perigoso para a build errada; um Smiter com bloqueio máximo não é a build errada.",
      "pindleskin-hell":
        "Dez segundos de um portal, e um alvo único — que é o único tipo de alvo em que um Smiter é bom.",
      "travincal-hell":
        "O Council são três alvos únicos bem agrupados. Mais lento que um Hammerdin aqui, mas perfeitamente viável.",
    },
    levelingPath: {
      summary:
        "Não evolua como Smiter. O Smite não tem dano em área e não tem nada em que investir antes do nível 30. Evolua como Zealot ou Hammerdin, e faça respec no 75 ou depois, quando já tiver a fonte de Life Tap que faz a build funcionar.",
      respecAt: "Nível 75+, quando Dracul's Grasp ou Exile estiver em mãos",
    },
    selfFoundNotes:
      "Mais amigável a self-found do que parece. Kingslayer são quatro runas médias, Herald of Zakarum cai no Hell, Gore Rider é comum, e Dracul's Grasp é o único requisito genuinamente raro. Exile e Grief são upgrades, não requisitos de entrada — um Smiter self-found com Kingslayer, Herald of Zakarum e Dracul's Grasp consegue matar os mini-Ubers. As chaves também são self-found por definição, já que só caem de três bosses específicos.",
    hardcoreNotes:
      "O Paladin mais amigável ao Hardcore, com uma ressalva que não é pequena. Bloqueio máximo, alta redução de dano e um escudo que nunca abaixa deixam o conteúdo comum do Hell quase seguro. Uber Tristram é a exceção: três bosses de nível 110 com uma aura de Conviction entre eles matam um personagem despreparado em segundos. Faça os três mini-Ubers muitas vezes antes de abrir o portal final, mantenha Battle Orders ativo, e aceite que o Torch pode não valer o personagem.",
    gearSets: {
      starter: {
        goal: "Atravessar o Normal e o Nightmare com o Smite como reserva, não como ataque principal.",
        nextUpgrade:
          "O nível 30 é o começo real da build — a Fanaticism abre lá. Até então você é só um Paladin com escudo.",
        notes:
          "Não tente evoluir com o Smite. Ele não tem dano em área e não tem sinergias em que investir ainda. Evolua com Zeal ou Blessed Hammer e faça respec depois — a Den of Evil te dá um token grátis em toda dificuldade.",
        picks: {
          "weapon-0": {
            label: "Qualquer scepter de Paladin com +Combat Skills",
            why: "O dano do Smite mal importa ainda, mas um scepter que soma níveis de skill sobe Holy Shield e Smite juntos. Os vendedores repõem esses itens o tempo todo.",
            lookFor: ["+2 Combat Skills", "+3 Smite", "+3 Holy Shield"],
          },
          "offhand-0": {
            why: "Três runas da Countess para resistências quase no máximo, num escudo de Paladin que ainda soma a própria resistência por cima.",
            sockets: "Ral, Ort, Tal num escudo de Paladin de 3 sockets.",
          },
          "body-0": {
            why: "Faster Hit Recovery e velocidade de corrida por duas das runas mais comuns do jogo.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas." },
        },
      },
      nightmare: {
        goal: "Fanaticism em funcionamento, Holy Shield ativo, resistências caminhando para 75%.",
        nextUpgrade: "Uma fonte de Life Tap. Enquanto você não tiver uma, o Uber Mephisto não é tentável.",
        notes:
          "A Fanaticism no 30 é quando a build começa a parecer ela mesma. Antes disso, Might é um substituto razoável.",
        picks: {
          "weapon-0": {
            why: "33% de Crushing Blow é o atributo que de fato mata bosses, e este é o lugar mais barato para conseguir uma quantidade séria dele.",
            sockets: "Mal, Um, Gul, Fal numa Sword ou Axe de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mais barata, e o Zeal que ela concede te dá algo para limpar entre bosses.",
          },
          "offhand-0": {
            why: "+2 skills de Paladin, +2 Combat Skills, 30% de chance de bloqueio e +50 em todas as resistências. O melhor custo-benefício de escudo que um Smiter pode usar antes do Exile.",
          },
          "body-0": {
            why: "O proc de Fade sobe todas as resistências e corta o dano físico recebido, e custa três runas baratas.",
          },
          "helm-0": {
            why: "15-20% de redução de dano. Life steal é desperdício no Smite, mas a redução de dano não é.",
          },
          "boots-0": {
            why: "15% de Crushing Blow e 30% de velocidade de corrida. O Deadly Strike dele não faz nada para você — pegue pelo Crushing Blow.",
          },
          "ring1-0": {
            why: "Cannot Be Frozen. Ficar congelado enquanto está preso numa animação de ataque é como personagens de corpo a corpo morrem.",
          },
        },
        charms: [
          {
            label: "Small charms com resistências e vida",
            why: "Resistência é a restrição daqui até o fim do jogo, e charms são o lugar mais barato para comprá-la.",
          },
        ],
      },
      "early-hell": {
        goal: "Chegar ao Hell com 75% de resistências e um total real de Crushing Blow.",
        nextUpgrade:
          "As três chaves, e depois um Exile. Com Life Tap e 75% de resistências no lugar, os mini-Ubers ficam tentáveis.",
        notes:
          "Este é o nível em que a build vira aquilo para que ela existe. Tudo acima dele é sobre fazer o mesmo trabalho mais rápido e com mais segurança.",
        picks: {
          "weapon-0": {
            why: "Ainda dando conta. Crushing Blow não liga para o dano da sua arma, e é por isso que isto se sustenta muito mais tempo do que parece.",
          },
          "offhand-0": {
            why: "As resistências importam mais no Hell que o bloqueio, e este escudo dá os dois.",
          },
          "gloves-0": {
            why: "**O item que torna os Ubers possíveis.** Life Tap converte o seu dano em cura, que é a única sustentação que um Smiter tem — life steal não funciona com Smite. Qualquer roll serve: o proc de Life Tap é fixo, e é a razão inteira de usar essas luvas.",
          },
          "body-0": {
            why: "15% de Crushing Blow no slot de armadura, mais redução de dano, por três runas médias.",
          },
          "body-0-alt0": {
            why: "+2 skills, +65 em todas as resistências e 8% de redução de dano. Melhor, e consideravelmente mais cara.",
          },
          "belt-0": {
            why: "10-15% de redução de dano num slot de cinto, o que aqui vale mais que qualquer total de atributos.",
          },
          "amulet-0": {
            why: "+2 em todas as skills e +20-30 em todas as resistências. As resistências são o motivo.",
          },
        },
        charms: [
          {
            label: "Small charms de resistência e vida",
            why: "Você está mirando em 75% nas quatro resistências antes de chegar perto do Uber Mephisto.",
          },
        ],
      },
      budget: {
        goal: "Matar os três mini-Ubers de forma confiável e começar a juntar órgãos.",
        nextUpgrade: "Enigma. Não pelo dano — pela capacidade de alcançar a luta e de separar os Ubers.",
        notes:
          "Os mini-Ubers são individualmente bem mais fáceis que Uber Tristram. Limpe eles até ficar confortável antes de abrir o portal final.",
        picks: {
          "weapon-0": {
            why: "O dano fixo do Grief se aplica ao Smite mesmo sem a ficha do personagem nunca mostrar. É a arma padrão de Smiter e não é nem perto.",
            sockets: "Eth, Tir, Lo, Mal, Ral numa Phase Blade de 5 sockets.",
          },
          "weapon-0-alt0": {
            why: "33% de Crushing Blow e +2-3 skills de Paladin, por uma fração do custo do Grief.",
          },
          "offhand-0": {
            why: "15% de chance de Life Tap ao golpear, uma aura de Defiance e +2 em Offensive Auras. É uma segunda fonte de Life Tap e um escudo defensivo ao mesmo tempo.",
            sockets:
              "Vex, Ohm, Ist, Dol num escudo de Paladin de 4 sockets. Use uma base etérea — o Exile se repara sozinho.",
          },
          "offhand-0-alt0": {
            why: "Se o Exile estiver fora de alcance. Aí você precisa do Dracul's Grasp para Life Tap, não como reserva mas como única fonte.",
          },
          "helm-0": {
            why: "Redução de dano, barato. Um Guillaume's Face ou um elmo com socket de Crushing Blow é a alternativa, se você achar um.",
          },
          "body-0": {
            why: "+2 skills, +65 em todas as resistências e 8% de redução de dano. Contra a Conviction do Uber Mephisto, são as resistências que te mantêm de pé.",
          },
          "gloves-0": {
            why: "Mantenha mesmo com o Exile. Duas fontes de Life Tap significam que a maldição fica praticamente sempre ativa.",
          },
          "boots-0": { why: "Mais 15% de Crushing Blow." },
          "ring1-0": { why: "Cannot Be Frozen, permanentemente." },
          "ring2-0": {
            why: "+1 em todas as skills. Um anel raro com resistências é uma alternativa legítima se você precisar do cap.",
          },
        },
        charms: [
          {
            label: "Hellfire Torch (Paladin)",
            why: "+3 skills de Paladin e +10-20 em todas as resistências. Você está farmando ele — o primeiro que guardar deve ser o seu.",
          },
          { why: "+1 em todas as skills, +10-20 em todos os atributos, +10-20 em todas as resistências." },
          {
            label: "Small charms de resistência",
            why: "O que for preciso para segurar 75% nas quatro enquanto a Conviction estiver em cima de você.",
          },
        ],
        weaponSwap: [
          {
            why: "Battle Orders antes de cada portal. É um aumento de vida de cerca de um terço e custa uma tecla.",
          },
        ],
      },
      optimized: {
        goal: "Limpar Uber Tristram de forma consistente e rápida.",
        nextUpgrade:
          "Resistências máximas acima de 75%, via sockets no Crown of Ages e o roll do Exile. É o último upgrade relevante.",
        picks: {
          "weapon-0": { why: "Inalterado. Nada desloca." },
          "offhand-0": { why: "Inalterado. Base etérea." },
          "body-0": {
            why: "Teleport. É como você separa os três Ubers, e separar eles é a maior parte da luta.",
            sockets:
              "Jah, Ith, Ber numa armadura de 3 sockets. O +0,75 de Strength por nível também paga pelo seu equipamento.",
          },
          "helm-0": {
            why: "+1 skills, +20-30 em todas as resistências, 10-15% de redução de dano e até dois sockets. O melhor elmo de Smiter.",
            lookFor: ["2 sockets", "30% em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": { why: "Life Tap. Continua obrigatório." },
          "boots-0": { why: "Crushing Blow." },
          "belt-0": {
            why: "Redução de dano, que nesta luta importa mais que qualquer total de atributos.",
          },
          "amulet-0": {
            why: "+1 em todas as skills e 20% de velocidade de ataque. O Deadly Strike dele não faz nada para o Smite — você está comprando as outras duas linhas.",
          },
          "amulet-0-alt0": {
            why: "Use este sempre que as resistências forem a coisa entre você e a morte do boss.",
          },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": {
            why: "+1 em todas as skills, ou um anel raro com resistências e Faster Hit Recovery.",
          },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { why: "+1 em todas as skills e resistências." },
          {
            label: "Small charms de resistência e vida",
            why: "Preencha o inventário restante com o que segurar as suas resistências no máximo.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders." },
          {
            why: "A mão secundária para a troca com Call to Arms. O +2 skills dele sobe o Battle Orders que você conjura.",
          },
        ],
      },
      bis: {
        goal: "Nada mais a consertar. Uber Tristram quando quiser.",
        notes:
          "Não sobra upgrade de dano para perseguir, porque o Crushing Blow não tem teto contra o qual empurrar. Tudo neste nível é resistência, redução de dano e conforto.",
        picks: {
          "weapon-0": {
            why: "Um roll de 400 de dano numa Phase Blade etérea.",
            lookFor: ["400 de dano", "40% de Increased Attack Speed", "Phase Blade etérea"],
          },
          "offhand-0": {
            why: "Um roll de Defiance 16 num escudo de Paladin etéreo que já vinha com +45 em todas as resistências.",
            lookFor: ["Defiance nível 16", "260% de Enhanced Defense", "Base etérea"],
          },
          "body-0": { why: "Teleport." },
          "helm-0": {
            why: "Dois sockets, 30% em todas as resistências, 15% de redução de dano.",
            lookFor: ["2 sockets", "30 em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": { why: "Life Tap." },
          "boots-0": { why: "Crushing Blow." },
          "belt-0": { why: "15% de redução de dano num roll máximo." },
          "amulet-0": {
            why: "+2 em todas as skills e +30 em todas as resistências. Neste nível o teto de resistência é a restrição real, não o total de skills.",
          },
          "ring1-0": { why: "Cannot Be Frozen, 20 de Dexterity." },
          "ring2-0": {
            why: "+1 em todas as skills, ou um anel raro com resistências, Faster Hit Recovery e vida.",
          },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin, 20 em todas as resistências." },
          { why: "+1 em todas as skills, 20 em todos os atributos, 20 em todas as resistências." },
          {
            label: "Small charms de vida e resistência",
            why: "O resto do inventário. Nada mais compete a esta altura.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  zealot: {
    summary:
      "Cinco golpes por investida, com uma aura de velocidade de ataque lançada por você mesmo e bloqueio máximo permanente. O Paladin que nunca precisa de respec.",
    playstyle:
      "Entre num grupo e segure o botão de ataque. O Zeal te prende numa sequência de até cinco golpes — o primeiro no alvo, os outros no que estiver ao lado — e a Fanaticism deixa essa sequência rápida. Não há problema de posicionamento nem de mira. As duas coisas que vão te matar são o travamento da animação, que impede reagir no meio da sequência, e ser congelado, que estica esse travamento. As duas têm a mesma solução, e é um anel.",
    strengths: [
      "Evolui como ela mesma a partir do 12 e nunca precisa de respec — o único Paladin do qual isso é verdade",
      "Fanaticism é uma aura sua, então o seu dano não depende de achar um item de aura",
      "Bloqueio máximo com Holy Shield e resistências altas; genuinamente difícil de matar",
      "Excelente contra alvo único e contra Ubers, com uma fração da especialização de um Smiter",
      "Amigável para iniciantes. A rotação é um botão",
    ],
    weaknesses: [
      "Só dano físico, o que faz dos imunes a físico no Hell uma parede absoluta",
      "Ruim contra densidade. O Zeal atinge alguns alvos adjacentes, não uma tela inteira",
      "Muito dependente de arma — esta build vale só o que ela estiver segurando",
      "O travamento de animação do Zeal impede reagir, desviar ou beber no meio da sequência",
      "Repetitiva, e as fontes honestas dizem isso",
    ],
    flexPoints: [
      "**Defiance** é o melhor destino restante. É uma sinergia de 15% de armadura por nível do Holy Shield, então soma com um atributo em que você já investe.",
      "**Mais Resist Lightning** se você pretende enfrentar o Uber Mephisto, cuja aura de Conviction mira exatamente nas suas resistências. Ela sobe a sua resistência máxima a raio em 1% por ponto duro enquanto for a aura ativa, e metade disso — arredondada para baixo — enquanto a Fanaticism for. +skills de equipamento não aumentam nenhum dos dois números, então este é um dos poucos lugares em que só o ponto duro conta.",
      "**O Holy Freeze Zealot.** Publicado em outros lugares como build própria, e documentado aqui como variante porque é o que ele é: as mesmas skills, o mesmo plano de equipamento e o mesmo estilo, com Holy Freeze selecionada no lugar da Fanaticism. A versão que vale montar não gasta ponto nenhum nela — uma runeword **Doom** emana uma aura de Holy Freeze nível 12 a partir da arma, o que libera a sua aura selecionada para a Fanaticism e te dá as duas ao mesmo tempo. Desacelerar um grupo vale mais do que parece para uma build presa na própria animação de ataque, e o dano de frio belisca imunes a físico. Uma das fontes que consultamos ainda descreve esta build contra o Patch 2.4, então trate qualquer número específico que você achar por aí com desconfiança.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint aqui.** Os limiares de frame do Zeal dependem do modificador de velocidade da arma e dos dados de animação do jogo, e nenhuma fonte que tratamos como confiável publica isso. Na prática, Fanaticism mais um Grief resolvem; preferimos dizer isso a imprimir um número não verificado.",
    ],
    statPlan: {
      strength: "O suficiente para o seu equipamento. Normalmente é a arma que define o número, não a armadura.",
      dexterity:
        "O suficiente para bloqueio máximo **com o Holy Shield ativo**, mais o requisito da sua arma. Só a Phase Blade já pede 136, o que para a maioria dos Zealots cobre o requisito de bloqueio sozinho.",
      vitality: "Todo o resto.",
      energy: "Nenhum. O Zeal é barato, e Redemption mais um mercenário com Insight cobrem o resto.",
      notes: [
        "**Confira o bloqueio com o Holy Shield ativo.** Conferir com o buff desligado é como Paladins investem cinquenta pontos a mais em Dexterity e nunca os recuperam sem respec.",
        "Escolha a arma antes de gastar qualquer coisa. Phase Blade, Berserker Axe e scepter têm requisitos muito diferentes, e o plano de Dexterity decorre dessa escolha.",
        "Resistência vem de equipamento e charms, não de atributos. Não tente resolver o Hell com pontos de atributo.",
      ],
    },
    breakpointWhy: {
      "fhr-48":
        "O alvo prático para uma build que fica parada enquanto o ataque acontece. Ser interrompido no meio do Zeal é como o travamento de animação vira uma morte.",
      "fbr-32":
        "Barato, e vale mais que a porcentagem bruta de bloqueio — os frames de recuperação decidem se você consegue agir entre golpes bloqueados.",
      "fhr-86":
        "Alcançável com um cinto Verdungo's e um anel raro, normalmente ao custo de resistência de que você precisa mais.",
    },
    skillNotes: {
      zeal:
        "**Quatro pontos alcançam o teto de cinco golpes.** Tudo depois disso é +6% de dano por ponto, o que ainda vale maximizar — mas saber onde está o teto te diz quando é seguro gastar em outro lugar primeiro.",
      fanaticism:
        "Velocidade de ataque e dano, em você e no seu mercenário. Disponível no nível 30 e é o maior salto que a build dá.",
      sacrifice:
        "A única sinergia do Zeal, a 12% de dano por nível. Não conjure — o dano em si mesmo é real. É um investimento passivo.",
      "holy-shield":
        "Bloqueio e defesa. Maximize por último entre as quatro; o primeiro ponto já faz a maior parte do trabalho para o requisito de bloqueio.",
      smite: "No caminho até o Holy Shield, e um atordoamento grátis quando você precisar.",
      concentration:
        "No caminho até a Fanaticism, e a aura para a qual trocar quando você preferir não morrer.",
      vigor: "Velocidade de corrida. Um ponto, útil para sempre.",
      redemption:
        "Cadáveres em vida e mana. Útil mesmo com life steal, porque funciona entre lutas, quando o roubo não funciona.",
      "resist-lightning": "Uma aura para trocar pela resistência a raio. **Um ponto duro não dá resistência máxima passiva** — a metade passiva arredonda para zero — então vale o ponto pela aura, não por um bônus de fundo.",
      salvation: "Uma aura de resistência de um ponto para trocar em Uber Tristram.",
      charge: "Transporte antes do Enigma.",
      "holy-bolt": "Pré-requisito do Blessed Hammer, no caminho até o Holy Shield.",
      "blessed-hammer": "**O Holy Shield exige Blessed Hammer e Charge**, então este ponto é obrigatório mesmo que você nunca conjure.",
      "meditation": "Regeneração de mana. Uma aura útil, não um pré-requisito.",
    },
    immunityPlan:
      "O Zeal é dano físico puro, então imunidade a físico é a única parede real da build — e no Hell ela é comum. Existem três respostas honestas e você deve escolher uma em vez de torcer. **Um sunder charm Bone Break** quebra imunidade a físico diretamente, ao custo de um slot de charm e de alguma redução de dano. **O seu mercenário** com uma arma elemental mata o que você não consegue tocar. **Uma fonte secundária de dano** — a carga de Berserk do Passion, o dano de frio do Duress, ou o +1 em Vengeance de um Kingslayer — te dá algo para golpear que não é físico. Passar direto também é legítimo; você não é obrigado a matar tudo. O outro perigo não é imunidade: **o Iron Maiden dos Oblivion Knights no Chaos Sanctuary reflete o seu dano físico**, e um ataque de cinco golpes contra uma maldição de dano refletido mata Zealots na hora.",
    mercenaryNotes:
      "Pegue **Might** no Ato 2 do Nightmare — ele não emana nada enquanto você roda Fanaticism, então a escolha de aura dele é na verdade sobre o dano dele próprio. **Holy Freeze** é a alternativa e a escolha mais comum: desacelerar um grupo vale mais para uma build com travamento de animação do que o dano pessoal dele. Dê um Insight para a sua mana e um Reaper's Toll depois, se quiser Decrepify em tudo.",
    farmingWhy: {
      "travincal-hell":
        "O Council são alvos únicos bem agrupados com muita vida, que é exatamente para o que Zeal e Crushing Blow servem.",
      "pit-hell":
        "Nível de área 85, denso, e majoritariamente vulnerável a físico. O melhor farm geral de Zealot.",
      "ancient-tunnels-hell": "Nível de área 85 com poucos imunes a físico e um trajeto curto.",
      "pindleskin-hell": "Um alvo único de nível alto a dez segundos de um portal.",
      "uber-tristram-hell":
        "Um Zealot com Life Tap e resistências capadas mata Ubers mais devagar que um Smiter, mas de forma perfeitamente confiável — e, diferente de um Smiter, ainda farma o resto do jogo.",
      "mausoleum-hell":
        "Nível de área 85, denso e perto de um waypoint. A densidade combina com investidas de cinco golpes.",
      "chaos-sanctuary-hell":
        "Possível, mas não ideal — os Oblivion Knights lançam Iron Maiden, que reflete o seu dano físico direto de volta.",
    },
    levelingPath: {
      summary:
        "Esta é a build de evolução. O Zeal está disponível no nível 12 e quatro pontos dão todos os cinco golpes, então ela é eficaz de imediato. Rode Might até a Fanaticism abrir no 30, e então simplesmente continue gastando — não há respec e não há transição. Se você pretende terminar como Smiter ou Hammerdin, este ainda é o caminho para chegar lá.",
    },
    selfFoundNotes:
      "Um dos melhores Paladins para self-found. Evolui como ela mesma sem respec, as armas iniciais vêm de vendedor, Herald of Zakarum e Gore Rider caem no Hell, e Raven Frost é comum. Grief é o único requisito genuinamente difícil, e a build limpa o Hell sem ele — Kingslayer ou uma arma rara bem rolada basta. A única coisa que quem joga self-found deve planejar é a resposta para imunidade a físico, porque isso não dá para improvisar.",
    hardcoreNotes:
      "Forte no Hardcore, com dois perigos específicos. O primeiro é o **Iron Maiden** — um Zealot que segura o botão de ataque contra uma maldição de dano refletido morre pelos próprios golpes antes de conseguir reagir, e essa é a morte mais comum de Zealot no Hardcore. Aprenda a animação de conjuração do Oblivion Knight ou evite o Chaos Sanctuary. O segundo é o **travamento de animação**: você não consegue beber, desviar nem teleportar no meio do Zeal, então uma fonte de Cannot Be Frozen não é opcional e Chains of Honor é uma armadura melhor que Fortitude. Fora isso, bloqueio máximo, resistências altas e life steal fazem dela uma das builds mais seguras do jogo.",
    gearSets: {
      starter: {
        goal: "Zeal no 12, atravessar o Normal, entrar no Nightmare.",
        nextUpgrade: "Nível 30 pela Fanaticism. Até lá, rode Might — é a mesma ideia com um número menor.",
        notes:
          "O Zeal está disponível no 12 e é utilizável de imediato, e é por isso que esta é a build padrão de evolução do Paladin. Quatro pontos te dão os cinco golpes; coloque o resto onde quiser até o 30.",
        picks: {
          "weapon-0": {
            label: "Qualquer arma rápida de uma mão com bom roll de dano",
            why: "O Zeal multiplica o que você estiver segurando por até cinco golpes, então velocidade base importa mais que dano base nesta fase. Compre scepters de vendedor e confira toda vez que estiver na cidade.",
            lookFor: ["+2 Combat Skills", "+3 Zeal", "+3 Sacrifice", "Alta velocidade de ataque"],
          },
          "offhand-0": {
            why: "Resistências quase no máximo por três runas da Countess, numa classe de escudo que soma resistência própria.",
            sockets: "Ral, Ort, Tal num escudo de Paladin de 3 sockets.",
          },
          "body-0": {
            why: "25% de Faster Hit Recovery e 25% de velocidade de corrida, com duas das runas mais comuns do jogo.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas." },
        },
      },
      nightmare: {
        goal: "Fanaticism ativa, uma arma de verdade, resistências caminhando para 75%.",
        nextUpgrade: "Um Grief, e um plano para imunes a físico.",
        picks: {
          "weapon-0": {
            why: "Velocidade de ataque e uma carga de Berserk para os imunes a físico em que você não consegue encostar de outro jeito. Barata, e resolve um problema real cedo.",
          },
          "weapon-0-alt0": {
            why: "Mais dano e 33% de Crushing Blow se você achar as quatro runas médias. Melhor contra bosses, pior contra grupos.",
          },
          "offhand-0": {
            why: "+2 skills de Paladin, +2 Combat Skills, +50 em todas as resistências e 30% de chance de bloqueio. O melhor custo-benefício de escudo de Paladin do jogo.",
          },
          "body-0": {
            why: "O proc de Fade sobe resistências e corta dano físico, e custa três runas baratas.",
          },
          "helm-0": {
            why: "Life steal e redução de dano. Diferente de um Smiter, um Zealot se beneficia de verdade do roubo.",
          },
          "ring1-0": {
            why: "**Cannot Be Frozen.** Ser congelado estica o travamento de animação do Zeal, que é a forma mais comum de esta build morrer.",
          },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds juntos, mais 30% de velocidade de corrida. Diferente de um Smiter, um Zealot usa os três.",
          },
        },
        charms: [
          {
            label: "Small charms de resistência e vida",
            why: "A resistência mais barata do jogo, e resistência é o que impede o Hell de ser impossível.",
          },
        ],
      },
      "early-hell": {
        goal: "Sobreviver ao Hell e ter uma resposta para imunidade a físico.",
        nextUpgrade: "Grief. É o maior upgrade isolado de dano que esta build vai fazer.",
        notes:
          "Este é o nível em que imunidade a físico deixa de ser teoria. Decida a sua resposta aqui — sunder charm, mercenário ou passar direto — em vez de descobrir o problema no Ato 2.",
        picks: {
          "weapon-0": {
            why: "Crushing Blow e Open Wounds te carregam contra qualquer coisa com muita vida, e o +1 em Vengeance é uma saída genuína contra imunidade a físico.",
          },
          "offhand-0": { why: "Resistências e skills, inalterado." },
          "body-0": {
            why: "15% de Crushing Blow, dano de frio e redução de dano pesada, por três runas médias. O dano de frio também belisca imunes a físico.",
          },
          "gloves-0": {
            label: "Luvas raras ou craftadas com 20% de Increased Attack Speed",
            why: "Velocidade de ataque e resistências num slot sem concorrência forte de unique para esta build.",
            lookFor: ["20% de Increased Attack Speed", "Resistências", "+2 Combat Skills (craftada)"],
          },
          "belt-0": {
            why: "Redução de dano e life steal, que é exatamente do que um personagem de corpo a corpo no Hell está precisando.",
          },
          "amulet-0": {
            why: "+1 em todas as skills, 20% de velocidade de ataque e Deadly Strike que cresce com o seu nível. O amuleto padrão de corpo a corpo, e diferente de um Smiter você usa todas as linhas dele.",
          },
        },
        charms: [
          {
            label: "Bone Break (Sunder Charm físico)",
            why: "A resposta direta para imunidade a físico. Custa um slot de charm e alguma redução de dano, e transforma uma parede absoluta numa luta lenta.",
          },
          { label: "Small charms de resistência e vida", why: "Segure 75% nas quatro." },
        ],
      },
      budget: {
        goal: "Limpar o Hell com conforto e começar os mini-Ubers.",
        nextUpgrade: "Fortitude, se você pegou Chains of Honor, ou Enigma se estiver cansado de andar.",
        picks: {
          "weapon-0": {
            why: "O dano fixo dele é aplicado depois dos multiplicadores de Enhanced Damage, o que o torna muito melhor num ataque rápido de cinco golpes do que o dano listado sugere. É o item que define a build.",
            sockets: "Eth, Tir, Lo, Mal, Ral numa Phase Blade de 5 sockets.",
          },
          "offhand-0": {
            why: "Ainda excelente. O Exile é o upgrade, e é majoritariamente defensivo.",
          },
          "offhand-0-alt0": {
            why: "Life Tap ao golpear e uma aura de Defiance. Pegue para Ubers; Herald of Zakarum é melhor para limpeza geral.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage, que numa build física é a maior linha de dano disponível fora da arma.",
          },
          "body-0-alt0": {
            why: "Troque o dano por +65 em todas as resistências e 8% de redução de dano. A escolha certa no Hardcore.",
          },
          "helm-0": { why: "Life steal e redução de dano, barato." },
          "boots-0": { why: "Crushing Blow, Deadly Strike e Open Wounds — as três numa bota só." },
          "belt-0": { why: "Redução de dano e life steal." },
          "amulet-0": { why: "Skills, velocidade de ataque, Deadly Strike." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": {
            why: "Magic find enquanto você farma, ou um anel raro com life steal e resistências se estiver morrendo.",
          },
        },
        charms: [
          { label: "Bone Break (Sunder Charm físico)", why: "Imunes a físico." },
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin e resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, atributos e resistências." },
        ],
        weaponSwap: [
          {
            why: "Battle Orders antes de qualquer coisa perigosa. Cerca de um terço mais de vida por uma tecla.",
          },
        ],
      },
      optimized: {
        goal: "Limpezas rápidas no Hell e runs de Uber confiáveis.",
        nextUpgrade: "Enigma, pelo Teleport. Muda a velocidade de limpeza mais que qualquer upgrade de dano restante.",
        picks: {
          "weapon-0": { why: "Inalterado. Nada substitui." },
          "offhand-0": {
            why: "Life Tap, uma aura de Defiance e +2 em Offensive Auras — o que sobe a própria Fanaticism.",
            sockets: "Vex, Ohm, Ist, Dol num escudo de Paladin de 4 sockets. Base etérea; ele se repara sozinho.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage e +200 de defesa. A armadura de dano de uma build física.",
          },
          "helm-0": {
            why: "+1 skills, resistências, redução de dano e até dois sockets para mais velocidade de ataque.",
            lookFor: ["2 sockets", "30% em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood com 20% de Increased Attack Speed",
            why: "Velocidade de ataque, vida e resistências num slot só, e craftáveis em vez de achadas.",
            lookFor: ["20% de Increased Attack Speed", "Vida", "Resistências"],
          },
          "boots-0": { why: "A bota de corpo a corpo. Nada compete." },
          "belt-0": { why: "Redução de dano e life steal." },
          "amulet-0": { why: "O Deadly Strike cresce com o seu nível." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": {
            label: "Anel raro com life steal, resistências e Faster Hit Recovery",
            why: "O único slot em que um raro bem rolado supera qualquer unique para esta build.",
            lookFor: ["6%+ de Life Stolen per Hit", "Resistências", "10% de Faster Hit Recovery"],
          },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Bone Break (Sunder Charm físico)", why: "Troque quando a zona estiver cheia de imunes a físico." },
        ],
        weaponSwap: [
          { why: "Battle Orders." },
          { why: "Mão secundária para a troca; o +2 skills dele sobe o Battle Orders." },
        ],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "A escolha entre Enigma e Fortitude é genuinamente aberta. Fortitude é mais dano; Enigma é mais conteúdo limpo por hora. A maioria acaba com os dois e troca conforme a atividade.",
        picks: {
          "weapon-0": {
            why: "Um roll de 400 de dano numa Phase Blade etérea.",
            lookFor: ["400 de dano", "40% de Increased Attack Speed"],
          },
          "offhand-0": {
            why: "Escudo de Paladin etéreo com roll alto de resistências.",
            lookFor: ["Defiance nível 16", "Base etérea", "45 em todas as resistências"],
          },
          "body-0": {
            why: "Teleport. A esta altura mobilidade vale mais que o dano que o Fortitude daria.",
          },
          "body-0-alt0": {
            why: "Mantenha o Fortitude se você tiver Teleport de outra fonte, ou se dano bruto importar mais que movimento para o seu jeito de jogar.",
          },
          "helm-0": {
            why: "Dois sockets, resistências máximas, redução de dano máxima.",
            lookFor: ["2 sockets", "30 em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood, 20% de Increased Attack Speed",
            why: "Velocidade de ataque, vida, life steal e resistências.",
            lookFor: ["20% de Increased Attack Speed", "+3 Combat Skills", "Life steal"],
          },
          "boots-0": { why: "Crushing Blow e Deadly Strike." },
          "belt-0": { why: "15% de redução de dano e 8% de life steal em rolls máximos." },
          "amulet-0": { why: "No nível 90 o roll de Deadly Strike vale cerca de 34%." },
          "ring1-0": { why: "Cannot Be Frozen, 20 de Dexterity." },
          "ring2-0": {
            label: "Anel raro: life steal, resistências, Faster Hit Recovery, Attack Rating",
            why: "O último slot a aperfeiçoar, e o único em que um raro é o teto.",
            lookFor: ["6-7% de Life Stolen per Hit", "Duas ou mais resistências", "10% de Faster Hit Recovery"],
          },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Small charms de vida e resistência", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  fohdin: {
    summary:
      "Raio à distância com ondas mágicas que rasgam Undead e Demons, e uma aura que quebra imunidade a raio. O Paladin que luta de longe.",
    playstyle:
      "Você escolhe um alvo no alcance máximo, conjura, e o raio cai nele enquanto os Holy Bolts se espalham por tudo em volta. A Conviction fica ativa o tempo todo e arranca resistência de qualquer coisa no alcance, que é o que faz a metade de raio funcionar no Hell. Contra um grupo você mira no meio e deixa as ondas limparem; contra um elite único você trava o nome dele e segura o botão. É o Paladin com mais ações por minuto do site e o único que nunca precisa estar em alcance corpo a corpo.",
    strengths: [
      "Dois tipos de dano ao mesmo tempo — raio do bolt, mágico das ondas de Holy Bolt",
      "A Conviction quebra imunidade a raio em monstros naturalmente imunes, então a própria parede da build praticamente some",
      "À distância. A classe inteira de problemas que vem de ficar perto das coisas não se aplica",
      "O Holy Shield ainda dá bloqueio máximo, então é uma build à distância que sobrevive a ser alcançada",
      "Suporte de party: a Conviction ajuda todo personagem elemental perto de você",
    ],
    weaknesses: [
      "Nada antes do nível 30. Fist of the Heavens e Conviction abrem no mesmo nível e a build não existe até lá",
      "Muitas ações por minuto — não é uma build de segurar um botão",
      "Imunidade a mágico enfraquece a metade do Holy Bolt, e alguns monstros resistem às duas metades",
      "Precisa de 125% de Faster Cast Rate para ficar boa, o que é uma exigência real de equipamento",
      "O dano é faminto por pontos de skill: o bolt, a sinergia, a aura e o escudo todos querem ser maximizados",
    ],
    flexPoints: [
      "**A build é genuinamente faminta por pontos.** Quatro skills maximizadas mais as cadeias de pré-requisito até Conviction e Fist of the Heavens são quase um personagem inteiro. Espere terminar o Holy Shield lá pelos oitenta e poucos.",
      "**Híbrida com Smite (\"Vindicator Templar\").** Coloque os pontos restantes em Fanaticism, carregue um Grief, e coloque Smite num segundo botão. Fist of the Heavens limpa a sala e o Smite mata o boss. Não custa nada estruturalmente, porque o Smite já é pré-requisito.",
      "**Híbrida com Blessed Hammer (\"Tri-Brid\").** O Blessed Hammer já é pré-requisito; investir nele mais Concentration te dá uma resposta de dano mágico para os grupos em que a Conviction não ajuda. Combine com Heaven's Light e Gore Rider para uma opção de boss com Crushing Blow.",
      "**Mais Resist Lightning** se você farma zonas cheias de inimigos de raio. Ela sobe a sua resistência máxima, que é a metade que uma Conviction inimiga não consegue tirar de você — mas repare qual número você está comprando: metade do bônus, arredondada para baixo, enquanto a Conviction for a sua aura ativa, e o valor cheio só se você trocar para Resist Lightning e abrir mão dela. Dez pontos duros são +5% passivos.",
    ],
    statPlan: {
      strength: "Só o que o seu equipamento pedir. Um Spirit num Monarch pede 156 e é o motivo habitual de o número não ser pequeno; um Herald of Zakarum pede bem menos.",
      dexterity:
        "O suficiente para bloqueio máximo **com o Holy Shield ativo**. Diferente dos Paladins de corpo a corpo, não há requisito de arma empurrando isso para cima, então o número é literalmente só o do bloqueio.",
      vitality: "Todo o resto.",
      energy: "Nenhum. Redemption mais um mercenário com Insight cobrem a mana de um caster tranquilamente.",
      notes: [
        "**Decida o escudo antes de gastar Strength.** Spirit num Monarch custa 156 de Strength; Spirit numa Sacred Targe custa uma fração disso ao preço de alguma defesa. O Herald of Zakarum fica entre os dois.",
        "**Confira o bloqueio com o Holy Shield ligado.** A mesma armadilha que pega todo Paladin.",
        "Faster Cast Rate vem inteiramente de equipamento. Nenhum ponto de atributo contribui.",
      ],
    },
    breakpointWhy: {
      "fcr-125":
        "O alvo de endgame e o que faz a build parecer rápida. Heart of the Oak (40) mais dois Spirits (70) mais um anel de 20% já passam disso.",
      "fcr-75":
        "O mínimo para a build jogar de forma aceitável. Só dois Spirits te levam a 70, então é uma barra baixa depois que você os tiver.",
      "fhr-48":
        "Você luta à distância, mas é alcançado, e uma build de longo alcance presa em stun é uma build morta.",
      "fbr-32":
        "Vale ter se você se comprometeu com bloqueio máximo, e não vale nada se não se comprometeu.",
    },
    skillNotes: {
      "fist-of-the-heavens":
        "Nível 30. Seis ondas de Holy Bolt com um ponto e mais uma por nível, então cada ponto amplia a limpeza além de subir o dano.",
      "holy-bolt":
        "A sinergia de dano, e também é a metade de dano mágico do que você dispara. Maximize em segundo.",
      conviction:
        "A sua aura ativa. 30% de redução de resistência no nível 1 e mais 5% por nível — no 20 isso é 125%, e o equipamento empurra mais. É isso que quebra imunidade a raio.",
      "holy-shield":
        "Bloqueio e defesa. A mais flexível das quatro — se você estiver com poucos pontos, é esta que deve ficar sub-investida.",
      sacrifice: "No caminho até o Holy Bolt.",
      "blessed-hammer":
        "Pré-requisito do Fist of the Heavens, e a semente da variante Tri-Brid.",
      smite: "No caminho até o Holy Shield, e a semente da híbrida com Smite.",
      "holy-freeze": "No caminho até a Conviction, e um slow útil se você precisar.",
      sanctuary:
        "No caminho até a Conviction. Também empurra Undead para trás, o que ocasionalmente é a coisa que te salva.",
      fanaticism:
        "Não para você — para o seu mercenário. Troque para ela quando encontrar algo que a Conviction não quebra e deixe ele matar.",
      vigor: "Velocidade de corrida antes do Enigma.",
      redemption:
        "Vida e mana de cadáveres. Num caster sem life steal, é o plano de sustentação inteiro.",
      "resist-lightning":
        "Uma aura para a qual trocar pela resistência a raio. **Um ponto duro não compra resistência máxima passiva nenhuma** — o passivo é metade, arredondado para baixo — então este ponto é a aura em si, não um bônus de fundo.",
      salvation: "Uma aura de resistência de um ponto para os momentos em que a Conviction é a escolha errada.",
      "zeal": "Pré-requisito da Vengeance, no caminho até a Conversion e daí até o Fist of the Heavens.",
      "vengeance": "Pré-requisito da Conversion. O FoHdin nunca ataca com ela.",
      "conversion": "**O Fist of the Heavens exige Blessed Hammer e Conversion.** Este é o ponto que a maioria dos guias de FoHdin esquece.",
      "thorns": "**O Sanctuary exige Holy Freeze e Thorns**, e o Sanctuary abre a Conviction.",
      "charge": "Pré-requisito do Holy Shield, junto com o Blessed Hammer.",
      "holy-shock": "**Sinergia de dano do Fist of the Heavens, +7% por nível.** Um ponto aqui porque os pontos da build estão comprometidos em outro lugar — maximizá-la é a alternativa documentada abaixo.",
      "meditation": "Regeneração de mana. Uma aura útil, não um pré-requisito.",
    },
    immunityPlan:
      "Este é o Paladin com a melhor resposta a imunidade, e ela vem de duas direções ao mesmo tempo. **A Conviction reduz resistência em 30% no nível 1 e mais 5% por nível**, o que no nível 20 é 125% e mais com equipamento de +skills; isso basta para quebrar imunidade a raio natural nos monstros que você de fato vai encontrar. Onde não basta, as **ondas de Holy Bolt são dano mágico** e acertam mesmo assim, porque imunidade a raio e imunidade a mágico são coisas diferentes. A parede real é um monstro imune aos dois, e há poucos. A saída prática é o seu mercenário: coloque um ponto em Fanaticism, troque para ela, e deixe ele matar o que você não consegue. Vale saber que a Conviction tem um limite de quanto consegue empurrar um monstro abaixo de zero, então um monstro com resistência a raio muito alta continua efetivamente imune por mais +skills que você empilhe.",
    mercenaryNotes:
      "Pegue **Might** pelo dano dele, e dê um **Insight** imediatamente — a Meditation resolve de vez a mana de um Paladin caster e custa quatro runas comuns. Depois, **Infinity** na polearm dele é o upgrade que importa: a Conviction dele e a sua não somam, mas com ele carregando a aura você pode rodar **Fanaticism** e passar a velocidade de ataque e o dano para ele enquanto o efeito da Conviction continua valendo. Um **Reaper's Toll** é a versão mais barata da mesma ideia, via Decrepify.",
    farmingWhy: {
      "chaos-sanctuary-hell":
        "Quase tudo aqui é Undead ou Demon, que é exatamente para o que as ondas de Holy Bolt servem. A melhor zona de FoHdin do jogo.",
      "worldstone-keep-hell":
        "Nível de área 85, densa e cheia de Demons. A Conviction dá conta dos imunes a raio que aparecerem.",
      "pit-hell": "Nível de área 85 e trajeto curto, e a Conviction cobre os imunes a raio.",
      "mausoleum-hell":
        "Nível de área 85 e quase inteiramente Undead. O Holy Bolt está no seu melhor aqui.",
      "travincal-hell":
        "O Council é imune a raio, mas a Conviction quebra imunidade a raio natural — e eles são Demons, então a metade do Holy Bolt acerta de qualquer forma. Confira o seu nível de Conviction antes de contar com isso.",
      "pindleskin-hell":
        "Undead, a dez segundos de um portal, e morre com uma conjuração à distância.",
      "ancient-tunnels-hell":
        "Nível de área 85 sem imunes a raio que preocupem. Confortável, ainda que menos recompensador que as zonas cheias de Undead.",
    },
    levelingPath: {
      summary:
        "Você não consegue evoluir como FoHdin. Fist of the Heavens e Conviction abrem os dois no nível 30, e a cadeia de pré-requisitos até a Conviction passa por cinco skills que você não usa para mais nada. Evolua como Blessed Hammer Paladin — Blessed Hammer e Holy Bolt são ambos pré-requisitos, então nada é desperdiçado — e use o respec grátis da Den of Evil no 30 ou depois para converter. O Nightmare é o lugar natural para fazer a troca.",
      respecAt: "Nível 30 no mínimo, com mais conforto no Nightmare",
    },
    selfFoundNotes:
      "Razoável para self-found, com uma dependência dura: dois Spirits. Cada um são quatro runas da Countess, então são farmáveis em vez de negociáveis, mas você precisa de oito runas e duas bases de 4 sockets. Depois disso a build funciona — Skin of the Vipermagi, Harlequin Crest e Mara's Kaleidoscope caem no Hell, e o Heart of the Oak é upgrade e não requisito. O breakpoint de 125% de Faster Cast Rate é a parte que realmente exige troca ou sorte.",
    hardcoreNotes:
      "Uma boa build de Hardcore com uma ressalva estrutural. Lutar à distância mais bloqueio máximo mais Holy Shield é uma combinação incomumente segura, e a Conviction permite matar as coisas antes de elas chegarem. A ressalva é o **buraco de evolução**: esta build não existe antes do nível 30, então um FoHdin de Hardcore passa os seus trinta níveis mais frágeis jogando outra coisa. Evolua como Blessed Hammer Paladin — os pontos são pré-requisitos de qualquer jeito — e trate a transição como o momento em que o personagem fica seguro, não como o momento em que fica forte.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30. Você ainda não é um FoHdin, e fingir que é desperdiça um personagem.",
        nextUpgrade:
          "Nível 30, e depois um segundo Spirit. Fist of the Heavens e Conviction chegam juntos e o personagem muda por completo.",
        notes:
          "Evolua com Zeal ou Blessed Hammer. O Blessed Hammer é a melhor escolha aqui porque já é pré-requisito — os pontos não são desperdiçados.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de Faster Cast Rate no nível 25. Todo Paladin caster começa aqui.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências enquanto você evolui, por três runas da Countess." },
          "body-0": { why: "25% de Faster Cast Rate no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills." },
          "gloves-0": { why: "20% de Faster Cast Rate no nível 23." },
        },
      },
      nightmare: {
        goal: "Fist of the Heavens funcionando, 75% de Faster Cast Rate, resistências subindo.",
        nextUpgrade:
          "Conviction maximizada, e um Insight para o mercenário para a mana deixar de ser uma consideração.",
        picks: {
          "weapon-0": { why: "Ainda a arma de melhor custo-benefício do jogo para um Paladin caster." },
          "offhand-0": {
            why: "Um segundo Spirit num escudo. Dois Spirits são +4 skills e 70% de Faster Cast Rate, que é quase todo o caminho até o breakpoint que importa.",
            sockets:
              "Tal, Thul, Ort, Amn num escudo de 4 sockets. Uma Sacred Targe pede muito menos Strength que um Monarch.",
          },
          "offhand-0-alt0": {
            why: "Mais resistências e skills, e zero Faster Cast Rate. Confira o seu breakpoint antes de trocar — esta é a forma clássica de um Paladin perder um frame sem perceber.",
          },
          "body-0": {
            why: "+1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências, com 43 de Strength. A armadura padrão de caster.",
          },
          "helm-0": { why: "+1 skills e magic find até um Shako aparecer." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "Resistências e dano convertido em mana numa build sem Energy." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "O caminho mais barato até 75% antes do Hell." },
        ],
      },
      "early-hell": {
        goal: "Entrar no Hell com resistências capadas e uma Conviction que quebra imunidade a raio.",
        nextUpgrade: "125% de Faster Cast Rate, e depois Enigma.",
        notes:
          "A Conviction é a diferença entre esta build funcionar no Hell e não funcionar. Maximize ela antes de se preocupar com qualquer upgrade de equipamento acima.",
        picks: {
          "weapon-0": { why: "Inalterado até o Heart of the Oak." },
          "offhand-0": { why: "Segundo Spirit. 70% de Faster Cast Rate entre os dois." },
          "body-0": { why: "Resistências e velocidade de conjuração juntas, barato." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências. O upgrade, quando as runas aparecerem.",
          },
          "helm-0": {
            why: "+2 skills, vida, mana, 50% de magic find e 10% de redução de dano, com 50 de Strength.",
          },
          "amulet-0": {
            why: "+2 em todas as skills e +20-30 em todas as resistências. As duas metades importam aqui.",
          },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A fonte mais barata de velocidade de conjuração que resta, e ainda carrega resistência de que você precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas ou mais resistências", "Vida"],
          },
          "boots-0": {
            why: "Faster Hit Recovery, Strength e Vitality. A Strength é o que paga por um Monarch, se você for por esse caminho.",
          },
        },
        charms: [{ label: "Small charms de resistência", why: "Segure 75% nas quatro." }],
      },
      budget: {
        goal: "Farmar o Hell de forma confiável com 125% de Faster Cast Rate.",
        nextUpgrade:
          "Enigma, e Infinity no mercenário se você pretende farmar zonas carregadas de raio.",
        picks: {
          "weapon-0": {
            why: "+3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências. O maior upgrade isolado que a build faz.",
            sockets: "Ko, Vex, Pul, Thul num Flail de 4 sockets — a base mais barata que aceita.",
          },
          "weapon-0-alt0": {
            why: "Mantenha o Spirit até o Heart of the Oak estar de fato em mãos. São 35% contra 40%, não um abismo.",
          },
          "offhand-0": { why: "35% de Faster Cast Rate e +2 skills." },
          "body-0": { why: "+2 skills, +65 em todas as resistências, 8% de redução de dano." },
          "helm-0": { why: "+2 skills e 50% de magic find." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 em todas as skills e 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "+1 em todas as skills e mana." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "Os últimos 10% que te levam por cima da linha dos 125%.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find e dano enquanto você farma." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin e +10-20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Small charms de resistência", why: "O que segurar o cap." },
        ],
        weaponSwap: [
          { why: "Battle Orders. Um caster sem life steal quer a vida." },
        ],
      },
      optimized: {
        goal: "Farm rápido e seguro no Hell, com magic find de verdade.",
        nextUpgrade:
          "Infinity no mercenário. Duas auras de Conviction não somam, mas a dele te libera para rodar Fanaticism em favor dele.",
        picks: {
          "weapon-0": { why: "+3 skills, 40% de Faster Cast Rate, resistências." },
          "offhand-0": {
            why: "35% de Faster Cast Rate. Base Monarch se você tiver a Strength, Sacred Targe se preferir gastar em outro lugar.",
          },
          "offhand-0-alt0": {
            why: "Use só se conseguir segurar 125% de Faster Cast Rate sem o Spirit. A maioria dos conjuntos não consegue.",
          },
          "body-0": {
            why: "Teleport. Muda quanto do jogo você consegue farmar mais do que qualquer upgrade de dano restante.",
            sockets: "Jah, Ith, Ber numa armadura de 3 sockets.",
          },
          "helm-0": { why: "+2 skills, magic find, redução de dano." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro supera qualquer unique para esta build.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Grand charms de skills de raio",
            why: "Dano direto numa build cujo golpe principal é raio.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Acima de 125% de Faster Cast Rate não sobra nada para comprar além de dano e resistência. É neste ponto que a híbrida com Smite ou com Blessed Hammer passa a valer os pontos de skill restantes.",
        picks: {
          "weapon-0": {
            why: "Um roll máximo: +40 em todas as resistências junto com os +3 skills e 40% de velocidade de conjuração.",
            lookFor: ["+40 em todas as resistências", "base Flail ou Mace"],
          },
          "offhand-0": {
            why: "Um roll de 35% de Faster Cast Rate num Monarch.",
            lookFor: ["35% de Faster Cast Rate", "base Monarch com 4 sockets"],
          },
          "body-0": { why: "Teleport." },
          "helm-0": {
            why: "Coloque um facet de raio para dano direto, ou uma runa Um para resistências.",
            lookFor: ["2 sockets"],
          },
          "gloves-0": { why: "20% de Faster Cast Rate e +1 em skills de fogo." },
          "belt-0": { why: "+1 skills, 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida, mana",
            why: "O último slot a aperfeiçoar.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find, ou Sandstorm Trek pelo Faster Hit Recovery." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Grand charms de skills de raio com vida", why: "Dano e vida no mesmo slot." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  avenger: {
    summary:
      "Cada golpe causa dano físico, de fogo, de frio e de raio ao mesmo tempo, sob uma aura que arranca resistência. A build que a imunidade não consegue parar.",
    playstyle:
      "Rode Conviction, chegue perto do que estiver na sua frente e golpeie. O Vengeance converte uma parte do dano da sua arma em fogo, frio e raio simultaneamente, então todo ataque são quatro tipos de dano procurando aquele que o alvo não resiste. Não há checagem de imunidade para planejar nem troca a fazer. O que você planeja são os seus pontos de skill, porque esta build quer mais do que o jogo te dá.",
    strengths: [
      "Quatro tipos de dano em cada golpe — você quase nunca vai achar algo que resista a todos",
      "A Conviction arranca resistência de tudo por perto, o que te torna um bom membro de party para personagens elementais",
      "Barata de equipar. Um Kingslayer sozinho já dá +1 em Vengeance, e a build limpa o Hell sem uma única runa alta",
      "Maximizar três skills de resistência sobe as suas três resistências máximas em 10% passivamente — sobrevivência de verdade, comprada com pontos que você já ia gastar",
      "Sem sunder charm, sem Infinity, sem lista de compras contra imunidade",
    ],
    weaknesses: [
      "**Faminta por pontos de skill.** O plano completo pede cerca de 113 pontos e um personagem nível 99 tem 110. Alguma coisa vai ficar de fora",
      "Alvo único. O Vengeance atinge uma coisa por vez, então densidade é lenta",
      "Nenhuma mobilidade própria. Sem Enigma esta build anda a pé por tudo",
      "O dano chega tarde — as sinergias só compensam quando várias estão perto do máximo",
      "Nenhum dos dois tier lists ranqueados que consultamos a inclui, o que é um sinal real sobre como ela se compara",
    ],
    flexPoints: [
      "**O orçamento é apertado mas fecha.** Vengeance, as três skills de resistência e a Conviction todas maximizadas são 100 pontos, e as cadeias de pré-requisito custam exatamente sete a mais. Sobram três pontos no nível 99 — e o nível 99 não é onde a maioria dos personagens para, então na prática você está escolhendo qual sinergia termina por último.",
      "**O Holy Shield custa cinco pontos, não um.** Ele exige Blessed Hammer e Charge, e o Charge exige Smite. Se você quer bloqueio máximo, está comprando uma cadeia de cinco pontos pela árvore de Combat e tirando de uma sinergia de resistência — uma troca de verdade, não um arredondamento.",
      "**A Conviction é o lugar habitual de ficar devendo**, e é o certo — cada ponto de +skills no seu equipamento sobe ela, então equipamento substitui pontos aqui de um jeito que não funciona para as sinergias.",
      "**O Holy Shield é o outro candidato.** Um ponto mais +skills dá um bloqueio real, mas não máximo. Se você prefere bloqueio máximo aos últimos pontos de Conviction, é uma troca legítima e esta página não vai fingir o contrário.",
      "**Salvation além de um ponto é armadilha.** É uma sinergia de 2% por nível contra os 10% das skills de resistência. Maximize as três primeiro, sempre.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint aqui.** Os limiares de frame do Vengeance dependem do modificador de velocidade da sua arma e de dados de animação que nenhuma fonte confiável publica. A Fanaticism não está disponível para você enquanto a Conviction estiver rodando, então velocidade de ataque precisa vir de equipamento — Highlord's Wrath, Kingslayer e luvas craftadas são onde ela mora.",
    ],
    statPlan: {
      strength: "O que a sua arma e o seu escudo pedirem. Um Kingslayer numa Cryptic Sword e um Rhyme num escudo modesto pedem muito pouco; um Last Wish numa Berserker Axe pede 138.",
      dexterity:
        "O suficiente para o tanto de bloqueio que você decidiu comprar. Com o Holy Shield em um ponto, esse número é maior do que seria num Zealot, e isso faz parte do custo do compromisso acima.",
      vitality: "Todo o resto.",
      energy: "Nenhum. O Vengeance custa mana por golpe, e é para isso que serve o Insight do mercenário.",
      notes: [
        "**O Vengeance tem custo de mana real por ataque**, diferente do Zeal. Um Insight no mercenário não é opcional nesta build, é o plano de mana.",
        "**Confira o bloqueio com o Holy Shield ativo** — a armadilha habitual de Paladin, e aqui importa mais porque você só tem um ponto nele.",
        "**As suas três resistências máximas ficam em 85% em vez de 75%**, porque as três auras de Resist estão maximizadas como sinergias do Vengeance e cada uma concede metade do bônus de resistência máxima passivamente. Você só recebe os +20% completos naquela que for a aura ativa, e a sua é a Conviction — então leia como +10% permanentes em tudo. Vale saber antes de comprar equipamento de resistência a mais.",
      ],
    },
    breakpointWhy: {
      "fhr-48": "Uma build de corpo a corpo com bloqueio modesto precisa se recuperar dos golpes que não parou.",
      "fbr-32":
        "Vale ter qualquer que seja a porcentagem de bloqueio que você escolheu, porque os frames de recuperação são o que permite agir entre golpes.",
    },
    skillNotes: {
      vengeance:
        "70% de dano no nível 1 e +6% por nível, além da conversão elemental. Maximize primeiro — todo o resto é multiplicador em cima dele.",
      "resist-fire":
        "Sinergia de fogo do Vengeance a 10% por nível, e carrega +10% de resistência máxima a fogo passivamente com 20 pontos duros — +20% se você algum dia rodá-la no lugar da Conviction. O melhor investimento por ponto da build.",
      "resist-lightning":
        "Os mesmos 10% por nível, para a parte de raio. Vem antes do frio porque dano de raio no Hell é o que mata Paladins.",
      "resist-cold":
        "A terceira sinergia de 10% por nível. Também é pré-requisito do Resist Lightning, então o primeiro ponto já está pago.",
      conviction:
        "**É aqui que os pontos acabam.** 30% de redução de resistência no nível 1 mais 5% por nível. Coloque todo ponto que sobrar aqui e deixe o equipamento com +skills levar o resto do caminho.",
      zeal: "Pré-requisito do Vengeance, e um segundo ataque genuinamente útil contra lixo.",
      salvation:
        "A quarta sinergia do Vengeance, a 2% por nível — um quarto do que uma skill de resistência dá. Pegue um ponto pelo valor de pré-requisito e pela aura, e não invista mais até as três skills de resistência estarem maximizadas.",
      "thorns": "**O Sanctuary exige Holy Freeze e Thorns.** Um ponto, e é a única razão para pegar.",
    },
    immunityPlan:
      "Este é o motivo inteiro de jogar a build, então vale ser preciso. **O Vengeance soma dano de fogo, frio e raio ao seu ataque físico simultaneamente** — ele não converte, ele soma, então um golpe carrega quatro tipos de dano de uma vez. Um monstro imune a um deles ainda toma os outros três. Imunidade quádrupla genuína não ocorre naturalmente. Em cima disso, **a Conviction reduz resistência a fogo, frio e raio em 30% no nível 1 mais 5% por nível**, o que raspa as resistências parciais que sobrarem. Você não precisa de sunder charm, nem de Infinity, nem de um segundo ataque. As duas coisas que *de fato* te param são o **Iron Maiden**, que reflete a parte física do seu dano e é um perigo real no Chaos Sanctuary, e monstros com resistência muito alta em vários elementos ao mesmo tempo, que a Conviction não consegue empurrar abaixo de zero o bastante.",
    mercenaryNotes:
      "**O Insight não é opcional.** O Vengeance custa mana em todo golpe, e diferente do Zeal você não pode ignorar isso — a Meditation de uma polearm com Insight é o plano de mana, e custa quatro runas comuns. Para a aura dele, pegue **Might** no Ato 2 do Nightmare pelo dano, ou **Holy Freeze** se preferir desacelerar grupos. Evite dar a ele algo que duplique o que você já faz; a sua Conviction já está quebrando resistência para os dois.",
    farmingWhy: {
      "chaos-sanctuary-hell":
        "Densa, de nível alto, e cheia de imunidades misturadas que param outras builds e não fazem nada contra esta. Cuidado com o Iron Maiden dos Oblivion Knights — a parte física do Vengeance reflete.",
      "travincal-hell":
        "O Council é imune a fogo e a raio, o que para a maioria dos casters. Você tem frio e físico também, e Conviction por cima.",
      "pit-hell":
        "Nível de área 85 e trajeto curto. Mais lento que um Hammerdin aqui, mas nada lá dentro te para.",
      "ancient-tunnels-hell":
        "Nível de área 85 com muita imunidade a frio, que é exatamente o tipo de zona para o qual esta build existe.",
      "worldstone-keep-hell":
        "Nível de área 85 e densa. Dano de alvo único torna isso mais lento do que é para um caster, mas todo grupo morre.",
      "pindleskin-hell":
        "Um alvo, a dez segundos de um portal. Exatamente o que uma build de alvo único quer.",
    },
    levelingPath: {
      summary:
        "Evolua como Zealot. O Zeal é pré-requisito do Vengeance, então o ponto não é desperdiçado, e o próprio Vengeance é fraco até várias sinergias estarem investidas — golpear com ele no nível 18 sem Conviction é pior que Zeal em todos os aspectos. Troque quando a Conviction estiver disponível no 30 e você tiver pontos suficientes para as sinergias significarem algo, o que na prática é em algum ponto do Nightmare.",
      respecAt: "Nível 30 no mínimo; Nightmare na prática",
    },
    selfFoundNotes:
      "Um dos Paladins mais fortes para self-found, e é daqui que vem a fama de a build ser barata. Kingslayer são quatro runas médias e já fornece +1 em Vengeance sozinho; Rhyme são duas das runas mais baratas do jogo; Treachery são três. Nada do dano vem de runas altas — vem de pontos de skill, que são de graça. Um Avenger self-found limpa o Hell sem um único item que valeria a pena trocar. O que ele não consegue resolver sozinho é o déficit de pontos de skill, porque isso precisa de equipamento com +skills.",
    hardcoreNotes:
      "Razoável no Hardcore, mas não é o Paladin mais seguro, e o motivo é o orçamento de pontos: você quase certamente não tem bloqueio máximo, porque o Holy Shield perdeu a disputa para as sinergias de dano. Compense com Chains of Honor em vez de Enigma, mantenha Battle Orders ativo, e trate o **Iron Maiden** como a coisa específica que te mata — a parte física do Vengeance reflete, e um ataque rápido contra uma maldição de dano refletido é letal. Os +10% passivos em cada resistência máxima, que vêm junto com as três sinergias maximizadas, são uma vantagem genuína no Hardcore e compensam em parte o problema do bloqueio.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30 sendo outra coisa. O Vengeance abre no 18, mas a Conviction não existe antes do 30.",
        nextUpgrade: "Nível 30 pela Conviction. Nada nesta build funciona direito antes disso.",
        notes:
          "Evolua com Zeal. É pré-requisito do Vengeance, então o ponto não é desperdiçado, e é um ataque de evolução melhor do que o Vengeance até as sinergias existirem.",
        picks: {
          "weapon-0": {
            label: "Qualquer scepter de Paladin com +Combat Skills",
            why: "Scepters de vendedor carregam bônus de skill de classe, que sobem o Zeal e depois o Vengeance de graça.",
            lookFor: ["+2 Combat Skills", "+3 Zeal", "Alta velocidade de ataque"],
          },
          "offhand-0": {
            why: "Resistências por três runas da Countess, numa classe de escudo que soma a própria.",
          },
          "body-0": { why: "Recuperação e velocidade de corrida por duas runas comuns." },
          "helm-0": { why: "+1 em Todas as Skills." },
        },
      },
      nightmare: {
        goal: "Conviction rodando, sinergias iniciadas, resistências subindo.",
        nextUpgrade:
          "Maximize as três sinergias de resistência. Todo o dano da build vem depois delas.",
        picks: {
          "weapon-0": {
            why: "A arma natural do Avenger: fornece **+1 em Vengeance** sozinha, mais 30% de velocidade de ataque e 33% de Crushing Blow.",
            sockets: "Mal, Um, Gul, Fal numa Sword ou Axe de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mais barata, e a velocidade de ataque é justamente o que falta nesta fase.",
          },
          "offhand-0": {
            why: "Cannot Be Frozen, 25% de magic find, resistências e bloqueio, por duas das runas mais baratas do jogo. O escudo clássico de Avenger econômico.",
          },
          "offhand-0-alt0": { why: "Mais skills e muito mais resistência, quando cair." },
          "body-0": {
            why: "Fade ao ser atingido, mais velocidade de ataque. Três runas baratas e resolve dois problemas.",
          },
          "helm-0": { why: "Life steal e redução de dano." },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds — uma build física usa os três.",
          },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "A resistência mais barata disponível." }],
      },
      "early-hell": {
        goal: "Entrar no Hell e descobrir que imunidade não é o seu problema.",
        nextUpgrade:
          "+skills onde você conseguir. Nesta build cada +1 sobe Vengeance, três sinergias e a Conviction juntos.",
        notes:
          "É aqui que a build compensa. Entre num grupo de imunes misturados que pararia uma Sorceress e mate tudo com o mesmo botão.",
        picks: {
          "weapon-0": {
            why: "Ainda a arma certa. O Crushing Blow dela cobre bosses enquanto o seu dano elemental cobre todo o resto.",
          },
          "offhand-0": { why: "+2 skills de Paladin, +2 Combat Skills e +50 em todas as resistências." },
          "body-0": { why: "Crushing Blow, dano de frio e redução de dano por três runas médias." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências. Vale mais aqui que o dano bruto, porque +2 skills levanta a Conviction e as três sinergias de uma vez.",
          },
          "amulet-0": {
            why: "+1 em todas as skills, 20% de velocidade de ataque e Deadly Strike. O +1 vale mais nesta build que em quase qualquer outra, porque sobe cinco skills separadas em que você investiu.",
          },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity para o bloqueio." },
          "belt-0": { why: "Redução de dano e life steal." },
        },
        charms: [
          {
            label: "Small charms de resistência e vida",
            why: "Segure o cap enquanto a Conviction não estiver te ajudando.",
          },
        ],
      },
      budget: {
        goal: "Limpar o Hell com conforto, inclusive as zonas cheias de imunes que ninguém mais quer.",
        nextUpgrade:
          "Enigma pela mobilidade, ou Last Wish se você preferir uma aura de Might e Crushing Blow pesado.",
        picks: {
          "weapon-0": {
            why: "O dano fixo dele alimenta a conversão elemental além do golpe físico, o que faz dele o maior upgrade isolado de dano disponível.",
            sockets: "Eth, Tir, Lo, Mal, Ral numa Phase Blade de 5 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mantenha se o Grief estiver fora de alcance. O +1 em Vengeance e o Crushing Blow ainda fazem trabalho real.",
          },
          "offhand-0": { why: "Skills, resistências e bloqueio." },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências — cinco skills investidas subindo de uma vez.",
          },
          "helm-0": { why: "Life steal e redução de dano, barato." },
          "helm-0-alt0": { why: "+1 skills, resistências, redução de dano e sockets. O upgrade." },
          "amulet-0": { why: "+1 skills e 20% de velocidade de ataque." },
          "boots-0": { why: "Crushing Blow e Deadly Strike." },
          "belt-0": { why: "Redução de dano e life steal." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills, o que nesta build são cinco skills de uma vez." },
        },
        charms: [
          {
            label: "Hellfire Torch (Paladin)",
            why: "+3 skills de Paladin — o maior aumento de skills disponível.",
          },
          { label: "Annihilus", why: "+1 em todas as skills e resistências." },
          { label: "Small charms de resistência e vida", why: "O resto do inventário." },
        ],
        weaponSwap: [
          { why: "Battle Orders. Uma build de corpo a corpo com bloqueio modesto quer a vida." },
        ],
      },
      optimized: {
        goal: "Limpezas rápidas em zonas que outras builds evitam.",
        nextUpgrade: "Mais +skills. Cada ponto vale cinco pontos de skill para esta build.",
        picks: {
          "weapon-0": { why: "Dano fixo transformado em quatro tipos de dano." },
          "weapon-0-alt0": {
            why: "Uma aura de Might, 40-50% de Crushing Blow e Life Tap ao golpear. Você troca o dano fixo do Grief por sustentação e dano em boss — uma escolha real, não um upgrade.",
          },
          "offhand-0": { why: "+4 skills efetivos e +50 em todas as resistências." },
          "offhand-0-alt0": {
            why: "Life Tap e uma aura de Defiance, mais +2 em Offensive Auras, que sobe a Conviction.",
          },
          "body-0": {
            why: "Teleport. Esta build não tem mobilidade própria e sente isso mais que a maioria.",
            sockets: "Jah, Ith, Ber numa armadura de 3 sockets.",
          },
          "body-0-alt0": {
            why: "Mantenha se resistência ou os +2 skills importarem mais para você que movimento.",
          },
          "helm-0": {
            why: "+1 skills, resistências, redução de dano e até dois sockets para velocidade de ataque.",
            lookFor: ["2 sockets", "30% em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood com 20% de Increased Attack Speed",
            why: "Velocidade de ataque é escassa nesta build porque a Fanaticism não está disponível enquanto a Conviction roda.",
            lookFor: ["20% de Increased Attack Speed", "+2 Combat Skills", "Vida"],
          },
          "amulet-0": { why: "+1 skills, velocidade de ataque, Deadly Strike." },
          "boots-0": { why: "Crushing Blow." },
          "belt-0": { why: "Redução de dano." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Small charms de vida e resistência", why: "O inventário restante." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar, e a barra de skills ainda está três pontos curta.",
        notes:
          "Repare no que best in slot significa aqui. Todo item desta lista foi escolhido em parte por +skills, porque o teto da build é definido por pontos de skill e não por moeda. É o oposto de como a maioria das listas de endgame funciona, e vale entender antes de trocar por qualquer coisa.",
        picks: {
          "weapon-0": {
            why: "Um roll de 400 de dano numa Phase Blade etérea.",
            lookFor: ["400 de dano", "40% de Increased Attack Speed"],
          },
          "offhand-0": {
            why: "+2 em Offensive Auras sobe a Conviction diretamente, que é exatamente a skill que você não conseguiu maximizar.",
            lookFor: ["Defiance nível 16", "Base etérea", "45 em todas as resistências"],
          },
          "body-0": { why: "Teleport, e +0,75 de Strength por nível." },
          "helm-0": {
            why: "Dois sockets, resistências máximas, redução de dano máxima.",
            lookFor: ["2 sockets", "30 em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood, 20% de Increased Attack Speed, +3 Combat Skills",
            why: "O único slot em que um craft supera qualquer unique para esta build.",
            lookFor: ["20% de Increased Attack Speed", "+3 Combat Skills", "Vida"],
          },
          "amulet-0": {
            why: "+1 em todas as skills, 20% de velocidade de ataque, e Deadly Strike valendo cerca de 34% no nível 90.",
          },
          "amulet-0-alt0": {
            why: "+2 em todas as skills no lugar, se você preferir as skills à velocidade de ataque.",
          },
          "boots-0": { why: "Crushing Blow e Deadly Strike." },
          "belt-0": { why: "15% de redução de dano num roll máximo." },
          "ring1-0": { why: "Cannot Be Frozen, 20 de Dexterity." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Small charms de vida e resistência", why: "O resto." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  tesladin: {
    summary:
      "Duas runewords Dream empilham uma aura de Holy Shock nível 30. Você entra num grupo e ele morre para um passivo.",
    playstyle:
      "Não existe botão de dano. Você corre para dentro de um grupo, segura Zeal pela metade física, e a aura de Holy Shock empilhada eletrocuta tudo dentro do raio, esteja você atacando ou não. A Conviction é a aura que você realmente tem selecionada, porque ela arranca a resistência a raio contra a qual a aura está lutando. A build inteira é um exercício de posicionamento: chegue perto, fique perto, e deixe o passivo trabalhar.",
    strengths: [
      "Dano que não custa ponto de skill nem botão — a aura roda esteja você atacando ou não",
      "Raio mais físico, então um imune a raio ainda toma a metade do Zeal",
      "Rápida contra densidade, o que é incomum para um Paladin de corpo a corpo",
      "A Conviction quebra imunidade a raio nos monstros que de outra forma seriam parede",
      "Bloqueio máximo e escudo erguido permanentemente",
    ],
    weaknesses: [
      "**Duas runas Jah.** Isto não é uma build cara, é uma build caríssima, e não existe versão barata",
      "A aura tem raio. Você precisa estar no meio do grupo, que é onde as coisas te matam",
      "Nada antes do nível 65, porque é o requisito do Dream",
      "Os seus melhores slots defensivos — elmo e escudo — estão os dois gastos em dano",
      "Alvos únicos morrem devagar; a aura é dano em área e bosses não são áreas",
    ],
    flexPoints: [
      "**Mais Zeal** depois que as quatro skills centrais estiverem prontas. Sobe a metade física, que é o que mata os imunes a raio que a Conviction não quebra.",
      "**Fanaticism** vale considerar como segunda aura pela velocidade de ataque, mas você não pode rodar ela e a Conviction ao mesmo tempo — e a Conviction é o que faz a aura do Dream funcionar. A maioria dos Tesladins deixa quieto.",
      "**Holy Freeze** além de um ponto se você estiver morrendo dentro dos grupos mais do que matando devagar.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint aqui**, pelo mesmo motivo dos outros Paladins de corpo a corpo. Importa menos nesta build do que em qualquer uma delas, porque a aura é o dano e ela não tem velocidade de ataque.",
    ],
    statPlan: {
      strength: "O suficiente para um escudo de 3 sockets e um elmo de 3 sockets. Nenhum precisa ser pesado, e o Dream não é uma runeword pela qual você queira pagar imposto de Strength duas vezes.",
      dexterity:
        "O suficiente para bloqueio máximo **com o Holy Shield ativo**. Você fica no meio dos grupos, então esta é uma das builds em que o bloqueio de fato compensa o custo.",
      vitality: "Todo o resto, e leve a sério — os seus dois slots defensivos estão ocupados por dano.",
      energy: "Nenhum.",
      notes: [
        "**As duas bases de Dream devem ser as mais baratas que funcionem.** Os atributos da runeword não escalam com a base, então pagar Strength por um elmo ou escudo pesado não compra nada.",
        "**Confira o bloqueio com o Holy Shield ativo.** A armadilha habitual de Paladin.",
        "Vida importa mais aqui que em qualquer outro Paladin, porque o loop central da build é ficar dentro daquilo que está tentando te matar.",
      ],
    },
    breakpointWhy: {
      "fhr-48":
        "Dois Dreams já fornecem de 40 a 60% entre eles, então isto é quase de graça — e importa mais aqui que em outros lugares porque você luta cercado.",
      "fhr-86":
        "Alcançável com um cinto Verdungo's em cima dos dois Dreams. Vale pegar numa build que fica em alcance corpo a corpo de tudo.",
      "fbr-32":
        "A recuperação de bloqueio decide se você consegue agir enquanto um grupo te bate, que é o tempo inteiro.",
    },
    skillNotes: {
      "resist-lightning":
        "Uma sinergia do Holy Shock, e com 20 pontos duros carrega também **+10% de resistência máxima a raio passivamente** — os +20% completos exigiriam ela como aura ativa, e a sua é a Conviction. Maximize primeiro: é o maior aumento de dano disponível e não custa nada além de pontos.",
      salvation:
        "A segunda sinergia do Holy Shock. Também é uma aura de resistência para a qual trocar, o que ocasionalmente importa — embora, diferente das três auras de Resist, ela suba apenas a resistência *atual*, sem componente de resistência máxima e sem nada passivo.",
      conviction:
        "A sua aura selecionada. 30% de redução de resistência no nível 1 mais 5% por nível — é isso que empurra imunes a raio abaixo da linha para a aura do Dream conseguir feri-los.",
      "holy-shield":
        "Bloqueio e defesa. Você fica dentro dos grupos por desenho, então isto não é opcional.",
      zeal:
        "**Um ponto, e maximize por último, se é que vai.** Quatro pontos alcançam o teto de cinco golpes, mas nesta build o Zeal é um mecanismo de entrega de life steal e uma alternativa física, não o dano.",
      "holy-freeze":
        "No caminho até a Conviction, e uma aura genuinamente útil para trocar — desacelerar um grupo dentro do qual você está vale mais do que parece.",
      "holy-shock":
        "Um ponto. A aura vem do Dream, não daqui — mas o ponto é pré-requisito da Conviction de qualquer forma.",
      vigor: "Velocidade de corrida. **A Salvation não exige nada** — este ponto compra movimento, não acesso.",
      redemption: "Vida e mana de cadáveres, que é a sua recuperação entre grupos.",
      "thorns": "**O Sanctuary exige Holy Freeze e Thorns.** Um ponto, só para abrir o caminho até a Conviction.",
      "holy-bolt": "Pré-requisito do Blessed Hammer, no caminho até o Holy Shield.",
      "blessed-hammer": "Pré-requisito do Holy Shield, junto com o Charge.",
      "charge": "O outro pré-requisito do Holy Shield. Serve também como mobilidade barata antes do Enigma.",
      "meditation": "Regeneração de mana. Uma aura útil, não um pré-requisito.",
    },
    immunityPlan:
      "Dois tipos de dano, e eles falham em lugares diferentes. A **aura de Holy Shock é raio**, e imunes a raio não tomam nada dela — que é por que a Conviction é a sua aura selecionada em vez de qualquer coisa mais empolgante. A Conviction reduz resistência em 30% no nível 1 mais 5% por nível, o bastante para quebrar imunidade a raio natural na maior parte do que você vai encontrar. Onde não basta, **o dano físico do Zeal ainda acerta**, e essa é a alternativa real: um Grief mais Crushing Blow mata imunes a raio devagar, mas de forma confiável. O problema genuíno é um monstro imune a raio e a físico ao mesmo tempo, o que é raro, e a resposta honesta ali é passar direto. O **Iron Maiden** merece menção específica: a aura não é refletida, mas o seu Zeal é, e um ataque de cinco golpes contra uma maldição de dano refletido te mata tão rápido nesta build quanto em qualquer outra.",
    mercenaryNotes:
      "Pegue **Might** pelo dano dele ou **Holy Freeze** pelo slow — Holy Freeze é a escolha comum, porque qualquer coisa desacelerada fica mais tempo dentro do seu raio de aura, o que é a mesma coisa que mais dano. Dê um **Insight** para a mana. O item que a maioria das fontes aponta para ele é um Reaper's Toll pelo proc de Decrepify, que baixa a resistência física e desacelera por cima; o site ainda não documenta esse item, então trate como um alvo nomeado e não como um link.",
    farmingWhy: {
      "chaos-sanctuary-hell":
        "Densa e bem agrupada, que é exatamente o que uma aura com raio quer. Cuidado com o Iron Maiden — a sua metade de Zeal reflete, ainda que a aura não.",
      "worldstone-keep-hell": "Nível de área 85 e muito densa. O melhor farm geral de Tesladin.",
      "pit-hell": "Nível de área 85, trajeto curto, e os grupos vêm até você.",
      "mausoleum-hell": "Nível de área 85 densa com quase nada imune a raio.",
      "travincal-hell":
        "O Council é imune a raio. A Conviction pode quebrar imunidade a raio natural, mas esta é a zona em que você deve verificar isso antes de contar com ela, e a sua metade de Zeal faz mais trabalho que o normal.",
      "secret-cow-level-hell":
        "Densidade enorme e nada imune a raio. Uma aura empilhada num rebanho de vacas é a coisa mais rápida que esta build faz.",
    },
    levelingPath: {
      summary:
        "Evolua e jogue como Zealot — mesma classe, mesma arma, mesmo plano de bloqueio, e o Zeal é o ataque que esta build usa de qualquer jeito. O Dream exige nível 65, então não existe versão desta build antes disso, e não há motivo para fazer respec até os dois Dreams estarem de fato no seu inventário. A conversão é um único respec grátis da Den of Evil.",
      respecAt: "Nível 65+, e só quando os dois Dreams existirem",
    },
    selfFoundNotes:
      "Realisticamente, não. Duas runas Jah em self-found é um projeto muito longo — Jah é uma das runas mais altas do jogo e a build precisa de duas, sem versão parcial que funcione. Quem joga self-found e quer este estilo deve ler esta página como destino, não como plano, jogar de Zealot enquanto isso, e converter se as runas aparecerem. Todo o resto de que a build precisa é comum.",
    hardcoreNotes:
      "Arriscada, e por um motivo estrutural em vez de corrigível. O dano da build exige que você fique dentro do grupo, e os dois slots que você normalmente usaria para sobreviver a isso — elmo e escudo — estão ocupados pelo Dream. Chains of Honor em vez de Enigma é quase obrigatório, Battle Orders deve estar ativo antes de cada grupo, e Holy Freeze no mercenário vale mais que o dano dele. Pese também a perda: este é um personagem de duas Jah, e Hardcore significa que você pode perder as duas.",
    gearSets: {
      starter: {
        goal: "Não é um Tesladin. Evolua como outra coisa — o Dream exige nível 65.",
        nextUpgrade:
          "Nível 65 e duas runas Jah. Não há atalho nem versão parcial — leia a nota de self-found antes de se comprometer com esta build.",
        notes:
          "Jogue de Zealot. É a mesma classe, a mesma arma e o mesmo plano de bloqueio, e converte para esta build com um respec assim que os Dreams existirem.",
        picks: {
          "weapon-0": {
            label: "Qualquer scepter de Paladin com +Combat Skills",
            why: "Você está jogando de Zealot por enquanto. Scepters de vendedor são o dano mais barato disponível.",
            lookFor: ["+2 Combat Skills", "+3 Zeal"],
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "Recuperação e velocidade de corrida por duas runas comuns." },
          "helm-0": { why: "+1 em Todas as Skills." },
        },
      },
      nightmare: {
        goal: "Ainda um Zealot. Guarde runas.",
        nextUpgrade:
          "Continue farmando a Countess e o Travincal. Tudo nesta build vem depois de duas runas Jah.",
        picks: {
          "weapon-0": { why: "Velocidade de ataque e uma carga de Berserk, barato." },
          "offhand-0": {
            why: "+50 em todas as resistências e skills. Vai ser substituído por um Dream, mas não tão cedo.",
          },
          "body-0": { why: "Fade e velocidade de ataque por três runas baratas." },
          "ring1-0": { why: "Cannot Be Frozen, do qual uma build baseada em Zeal não abre mão." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "A resistência mais barata do jogo." }],
      },
      "early-hell": {
        goal: "Limpar o Hell como Zealot enquanto as runas se acumulam.",
        nextUpgrade:
          "O primeiro Dream. Um não é a build, mas é o ponto em que você deixa de ser Zealot e passa a ser um Tesladin com metade do dano.",
        notes:
          "Seja honesto consigo. Se duas runas Jah não são um alvo realista para o seu jeito de jogar, a página do Zealot é a build em que você já está, e ela é boa.",
        picks: {
          "weapon-0": { why: "Crushing Blow para bosses enquanto você espera." },
          "offhand-0": { why: "Resistências e skills." },
          "body-0": { why: "Crushing Blow e redução de dano por três runas médias." },
          "helm-0": { why: "Life steal e redução de dano." },
          "boots-0": { why: "Crushing Blow e velocidade de corrida." },
          "amulet-0": { why: "Skills e resistências." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "Segure 75%." }],
      },
      budget: {
        goal: "O primeiro Dream. Metade da aura, e uma prévia da build.",
        nextUpgrade: "A segunda Jah. É o projeto restante inteiro.",
        picks: {
          "helm-0": {
            why: "Uma aura de Holy Shock nível 15 e 20-30% de Faster Hit Recovery. Sozinho não é uma build — é a primeira metade de uma.",
            sockets:
              "Io, Jah, Pul num elmo de 3 sockets. Use o elmo elite de 3 sockets mais leve que achar; a base não contribui em nada.",
          },
          "offhand-0": {
            why: "Mantenha até o segundo Dream existir. As resistências são o que permite ficar dentro dos grupos.",
          },
          "weapon-0": {
            why: "A metade física. Também mata os imunes a raio que a sua aura não consegue tocar.",
            sockets: "Eth, Tir, Lo, Mal, Ral numa Phase Blade de 5 sockets.",
          },
          "weapon-0-alt0": {
            why: "Perfeitamente adequado enquanto as runas vão para os Dreams.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências, o que sobe as duas sinergias e a Conviction.",
          },
          "boots-0": { why: "Crushing Blow e velocidade de corrida." },
          "belt-0": { why: "Redução de dano e life steal." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          {
            label: "Hellfire Torch (Paladin)",
            why: "+3 skills de Paladin, o que levanta as duas sinergias e a Conviction de uma vez.",
          },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Grand charms de skills de raio",
            why: "Dano direto na aura, no slot que não tem nada melhor para fazer.",
          },
        ],
      },
      optimized: {
        goal: "Os dois Dreams. A build finalmente existe.",
        nextUpgrade: "Enigma, quando as suas resistências sobreviverem à perda do Chains of Honor.",
        picks: {
          "helm-0": {
            why: "Holy Shock nível 15, metade do par.",
            sockets: "Io, Jah, Pul no elmo de 3 sockets mais leve disponível.",
          },
          "offhand-0": {
            why: "A segunda metade. Duas auras empilham para um Holy Shock nível 30 efetivo, e este é o momento em que a build começa a funcionar.",
            sockets:
              "Io, Jah, Pul num escudo de Paladin de 3 sockets — o escudo de classe soma as próprias resistências por cima.",
          },
          "weapon-0": {
            why: "O dano físico, e a resposta contra imunes a raio que a Conviction não quebra.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências. Com os dois slots defensivos gastos em Dreams, é aqui que mora a sua sobrevivência.",
          },
          "body-0-alt0": {
            why: "Teleport, ao custo das resistências. Pegue só quando os seus charms cobrirem o buraco.",
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood com 20% de Increased Attack Speed",
            why: "Velocidade de ataque e vida num slot sem unique que valha a pena para esta build.",
            lookFor: ["20% de Increased Attack Speed", "Vida", "Resistências"],
          },
          "belt-0": { why: "Redução de dano e life steal." },
          "boots-0": { why: "Crushing Blow e velocidade de corrida." },
          "amulet-0": { why: "+1 skills, 20% de velocidade de ataque e resistência a raio." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Grand charms de skills de raio com vida",
            why: "O melhor dano restante, e vida de que você precisa muito.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders. Os seus slots defensivos são dano, então a vida importa." },
          { why: "Mão secundária para a troca." },
        ],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "O nível da aura é fixado pela runeword e não sobe com +skills, então todos os upgrades restantes vão para as sinergias, a Conviction, e sobreviver dentro do raio.",
        picks: {
          "helm-0": {
            why: "Um roll de 30% de Faster Hit Recovery e 20 em todas as resistências.",
            lookFor: ["30% de Faster Hit Recovery", "All Resistances +20"],
          },
          "offhand-0": {
            why: "Num escudo de classe do Paladin, pelas resistências inatas que a build não tem de onde tirar.",
            lookFor: ["30% de Faster Hit Recovery", "All Resistances +20", "base de escudo de Paladin"],
          },
          "weapon-0": {
            why: "Um roll de 400 de dano numa Phase Blade etérea.",
            lookFor: ["400 de dano", "40% de Increased Attack Speed"],
          },
          "body-0": {
            why: "Teleport, quando os charms cobrirem as resistências que o Chains of Honor carregava.",
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood, 20% de Increased Attack Speed, +3 Combat Skills",
            why: "Velocidade de ataque, life steal e skills num slot só.",
            lookFor: ["20% de Increased Attack Speed", "+3 Combat Skills", "Life steal"],
          },
          "belt-0": { why: "15% de redução de dano num roll máximo." },
          "boots-0": { why: "Crushing Blow." },
          "amulet-0": {
            why: "+2 em todas as skills e +30 em todas as resistências. Numa build que usa dois itens de dano nos slots defensivos, as resistências ganham.",
          },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Grand charms de skills de raio com vida", why: "Dano e vida juntos." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "holy-fire-paladin": {
    summary:
      "Uma aura de fogo que queima tudo perto de você enquanto ataca com Zeal. Divertida, barata de começar, e barrada pela imunidade mais comum do jogo.",
    playstyle:
      "Rode Holy Fire, entre num grupo e segure Zeal. A aura causa dano contínuo a tudo num raio ao seu redor e adiciona dano de fogo a cada golpe seu, então a build mata por proximidade tanto quanto por atacar. É rápida, tátil e barata de colocar de pé. Aí você chega ao Hell, encontra o primeiro grupo imune a fogo, e descobre que a aura que você está rodando é também o slot de aura de que você precisaria para a Conviction. Tudo acima do nível Dragon nesta página é sobre resolver isso.",
    strengths: [
      "Muito barata de começar. Holy Fire é uma skill de nível 6 e carrega um personagem pelo Normal sozinha",
      "Dano de fogo mais dano físico do Zeal, então há duas coisas em que se apoiar",
      "Rápida e física de jogar — a aura mata coisas que você nunca atacou",
      "Excelente auto-sustentação via life steal na metade do Zeal",
      "A variante Dragon é um dos poucos quebra-cabeças de equipamento genuinamente originais do jogo",
    ],
    weaknesses: [
      "**Imunidade a fogo é a mais comum no Hell**, e é o seu tipo de dano",
      "Você não pode rodar Holy Fire e Conviction ao mesmo tempo, então a versão padrão não tem quebra de imunidade",
      "A solução — Dragon mais Hand of Justice — custa duas Sur, uma Cham, uma Lo e uma Sol",
      "As duas fontes ranqueadas que consultamos a colocam por último ou quase entre as builds de Paladin",
      "Ruim em Ubers: o Maxroll a coloca especificamente no tier D lá",
    ],
    flexPoints: [
      "**A variante Dragon é a forma real da build.** O Dragon concede uma aura de Holy Fire nível 14 e o Hand of Justice uma nível 16 — as duas vindas do item. Quando a sua aura de dano vem do equipamento, a aura que você *seleciona* pode ser a Conviction, e o problema estrutural da build desaparece. Se você pretende ir por aí, invista em Conviction em vez de Holy Fire.",
      "**Versão padrão:** maximize Holy Fire e rode ela. Barata, divertida pelo Nightmare, e bate numa parede no Hell que nenhuma quantidade de equipamento dentro desta variante resolve.",
      "**Sacrifice** vale pontos depois que o núcleo estiver pronto — é a sinergia do Zeal, e o Zeal é o que mata os imunes a fogo.",
      "**Omnidin, a variante de troca de auras.** Com Dragon, Dream, Doom e Exile você carrega Holy Fire, Holy Shock, Holy Freeze e Defiance ao mesmo tempo e seleciona a aura de que a party precisar. É um estilo de suporte de grupo e não uma build de dano, só uma fonte que consultamos documenta isso, e é por esse motivo que está documentada aqui em vez de ter página própria.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint aqui**, pelo mesmo motivo dos outros Paladins de corpo a corpo.",
    ],
    statPlan: {
      strength: "O suficiente para o seu equipamento. Se você vai para uma armadura Dragon, note que ela mesma dá +0,375 de Strength por nível, o que paga boa parte do que custa.",
      dexterity: "O suficiente para o tanto de bloqueio que você comprou, com o Holy Shield ativo.",
      vitality: "Todo o resto.",
      energy: "Nenhum.",
      notes: [
        "**A sua própria resistência máxima a fogo sobe como efeito colateral** de maximizar Resist Fire pela sinergia — em 10%, para um teto de 85%, porque o Paladin mantém metade do bônus passivamente e você está rodando Holy Fire, não Resist Fire. Sobrevivência real, e é fácil esquecer que você tem.",
        "**Confira o bloqueio com o Holy Shield ativo**, como em todo Paladin.",
        "Cannot Be Frozen não é opcional em nenhuma build baseada em Zeal, porque ser congelado estica a animação de ataque na qual você fica preso.",
      ],
    },
    breakpointWhy: {
      "fhr-48":
        "Você luta cercado pelo grupo que a sua aura está queimando, então a recuperação decide se você consegue agir.",
      "fbr-32": "Recuperação de bloqueio, numa build que está sempre em alcance corpo a corpo.",
    },
    skillNotes: {
      "holy-fire":
        "Disponível no nível 6, e é por isso que esta build carrega um personagem tão cedo. Raio 6 mais 1 por nível, então pontos ampliam a zona de morte além de aprofundá-la.",
      "resist-fire":
        "Sinergia do Holy Fire, e com 20 pontos duros carrega também **+10% de resistência máxima a fogo passivamente** — os +20% completos só se Resist Fire for a aura que você está rodando, o que não é o caso. Os melhores pontos da build.",
      salvation:
        "A segunda sinergia. Também é uma aura de resistência para a qual vale trocar quando a aura que você roda não está ajudando — embora ela suba apenas a resistência *atual*, sem componente de resistência máxima.",
      zeal:
        "A metade física, e a sua resposta contra imunes a fogo. Quatro pontos alcançam o teto de cinco golpes; o resto é dano.",
      "holy-shield":
        "Um ponto mais equipamento. Você fica em alcance corpo a corpo de tudo, então considere mais se estiver morrendo.",
      sacrifice: "Pré-requisito do Zeal, e a única sinergia do Zeal se você tiver pontos sobrando.",
      conviction:
        "**Um ponto, e importa mais do que o nível sugere** — mas só se o seu Holy Fire vier do equipamento. Leia a variante Dragon antes de decidir quanto investir aqui.",
      fanaticism: "Para o mercenário, ou para os momentos em que você prefere golpear mais rápido a queimar.",
      vigor: "Velocidade de corrida. **A Salvation não exige nada** — este ponto compra movimento, não acesso.",
      redemption: "Vida e mana de cadáveres.",
      "thorns": "**O Sanctuary exige Holy Freeze e Thorns**, e é o Sanctuary que abre a Conviction.",
      "holy-bolt": "Pré-requisito do Blessed Hammer, no caminho até o Holy Shield.",
      "blessed-hammer": "Pré-requisito do Holy Shield, junto com o Charge.",
      "charge": "O outro pré-requisito do Holy Shield, e mobilidade utilizável no caminho.",
      "holy-shock": "Uma aura de troca de um ponto. É sinergia do Fist of the Heavens, que esta build não usa.",
      "meditation": "Regeneração de mana. Uma aura útil, não um pré-requisito.",
    },
    immunityPlan:
      "Este é o problema que define a build, então aqui vai a versão honesta. **Imunidade a fogo é a mais comum no Hell**, e fogo é o seu dano. Pior, a build padrão não consegue quebrá-la: o Holy Fire é a sua aura selecionada, e a Conviction teria que ocupar o mesmo slot. Existem três respostas reais. **Um Sunder Charm de fogo** quebra imunidade a fogo diretamente pelo preço de um slot de charm e de alguma redução de dano — a solução mais barata por larga margem. **A variante Dragon** move o Holy Fire para o seu equipamento para que a aura selecionada possa ser a Conviction; isso mais os -20% de resistência a fogo do inimigo do Hand of Justice é a solução completa, e também a cara. **O dano físico do Zeal** está sempre disponível e é o que de fato mata imunes a fogo em todos os níveis abaixo do Dragon — e é por isso que as listas de equipamento se apoiam em Crushing Blow muito mais do que uma build de fogo sugeriria.",
    mercenaryNotes:
      "**Might** pelo dano, ou **Holy Freeze** para manter os grupos dentro do seu raio de aura por mais tempo — a mesma lógica do Tesladin, e pelo mesmo motivo. Dê um **Insight** para a mana. Assim que você estiver rodando Conviction, não há necessidade de duplicá-la nele; coloque as runas na sobrevivência dele.",
    farmingWhy: {
      "secret-cow-level-hell":
        "Densidade enorme, nada imune a fogo, e tudo anda para dentro da sua aura. A melhor zona para esta build.",
      "mausoleum-hell": "Nível de área 85 densa e majoritariamente Undead vulnerável a fogo.",
      "pit-hell":
        "Nível de área 85 e curta. Alguns imunes a fogo, que é para o que serve a metade do Zeal.",
      "ancient-tunnels-hell":
        "Nível de área 85 e um trajeto curto. Fogo está entre as imunidades registradas dela, então a aura não faz nada contra parte da população e é o dano da sua arma que mata esses — e é por isso que a metade física desta build não é opcional.",
      "chaos-sanctuary-hell":
        "Densa, mas cheia de demônios resistentes a fogo e com Iron Maiden dos Oblivion Knights, que reflete o seu Zeal. Possível, não confortável.",
      "travincal-hell":
        "O Council é imune a fogo. Sem a Conviction da variante Dragon, esta simplesmente não é a sua zona.",
    },
    levelingPath: {
      summary:
        "Esta evolui como ela mesma, e é muito boa nisso. O Holy Fire está disponível no nível 6 e limpa telas inteiras pelo Normal sem equipamento nenhum; o Zeal chega no 12 e te dá um segundo tipo de dano. Nenhum respec é necessário até você se comprometer com a variante Dragon, quando os pontos que você afundou no próprio Holy Fire ficam melhor gastos em Conviction — o token grátis da Den of Evil cobre isso.",
      respecAt: "Só ao converter para a variante Dragon",
    },
    selfFoundNotes:
      "A build padrão é genuinamente amigável a self-found e um dos personagens iniciais mais fortes do jogo — o Holy Fire não precisa de nada além de pontos de skill. O Hell é onde ela para: um Sunder Charm de fogo é um alvo realista de self-found e é a solução a mirar, enquanto a variante Dragon precisa de duas Sur, uma Cham, uma Lo e uma Sol e não é um projeto de self-found. Planeje para o sunder charm, e trate o Dragon como um talvez distante.",
    hardcoreNotes:
      "Mais segura do que parece. Resistência a fogo pessoal alta cai de graça ao maximizar Resist Fire como sinergia, o life steal do Zeal te mantém cheio, e Holy Shield mais um escudo de Paladin dão bloqueio real. Os dois perigos são os mesmos de todo Zealot: **Iron Maiden**, que reflete a sua metade física, e o **travamento de animação**, que exige Cannot Be Frozen. A variante Dragon também é muita moeda carregada num personagem que pode morrer.",
    gearSets: {
      starter: {
        goal: "Do nível 6 até o fim do Normal, com quase nada.",
        nextUpgrade: "Zeal no 12, e depois simplesmente continue despejando pontos em Holy Fire e Resist Fire.",
        notes:
          "Esta é genuinamente uma das builds iniciais mais fortes do jogo. Holy Fire no nível 6 limpa telas inteiras no Normal sem equipamento nenhum. Aproveite — e leia a seção do Hell antes de planejar em cima disso.",
        picks: {
          "weapon-0": {
            label: "Qualquer arma rápida de uma mão",
            why: "O Holy Fire faz a matança nesta fase e não liga para o que você segura. Prefira velocidade a dano.",
            lookFor: ["+2 Combat Skills", "Alta velocidade de ataque"],
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "Recuperação e velocidade de corrida." },
          "helm-0": { why: "+1 em Todas as Skills." },
        },
      },
      nightmare: {
        goal: "Empurrar Holy Fire e as sinergias, e começar a pensar no Hell.",
        nextUpgrade:
          "Decida agora se você vai bancar um Dragon e um Hand of Justice. A resposta muda o que você faz nos próximos trinta níveis.",
        picks: {
          "weapon-0": {
            why: "Velocidade de ataque e uma carga de Berserk. O Berserk é uma saída de dano físico que você vai querer.",
          },
          "offhand-0": { why: "+2 skills de Paladin, +2 Combat Skills, +50 em todas as resistências." },
          "body-0": { why: "Fade e velocidade de ataque por três runas baratas." },
          "helm-0": { why: "Life steal e redução de dano." },
          "ring1-0": { why: "Cannot Be Frozen. Inegociável numa build de Zeal." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "A resistência mais barata disponível." }],
      },
      "early-hell": {
        goal: "Encontrar imunidade a fogo e ter o que fazer a respeito.",
        nextUpgrade:
          "Ou um Sunder Charm de fogo, ou o par Dragon e Hand of Justice. São as duas respostas reais e custam valores absurdamente diferentes.",
        notes:
          "Este é o nível em que o problema central da build aparece. Uma fonte publicada conta 102 monstros imunes a fogo no Hell, dos quais ela diz que cerca de um terço precisa de Conviction em vez de uma maldição para quebrar. Estando o número exato certo ou não, o formato está: imunidade a fogo está em todo lugar, e o Zeal sozinho é lento.",
        picks: {
          "weapon-0": {
            why: "Crushing Blow e Open Wounds. Contra um imune a fogo, o seu dano físico é o plano inteiro, e este é o jeito mais barato de torná-lo sério.",
          },
          "offhand-0": { why: "Resistências, das quais você vai estar carente." },
          "body-0": {
            why: "Crushing Blow, dano de frio e redução de dano. O dano de frio é um terceiro tipo de dano contra imunes a fogo.",
          },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds — todos ajudam a metade do seu dano que ainda funciona.",
          },
          "amulet-0": { why: "+1 skills e 20% de velocidade de ataque." },
          "belt-0": { why: "Redução de dano e life steal." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "Segure 75%." },
          {
            label: "Flame Rift (Sunder Charm de fogo)",
            why: "A resposta direta para imunidade a fogo, ao custo de um slot de charm e de alguma redução de dano. Vale saber que isto existe antes de gastar uma fortuna na rota do Dragon.",
          },
        ],
      },
      budget: {
        goal: "Limpar o Hell com o Zeal fazendo mais trabalho que a aura.",
        nextUpgrade:
          "Um Dragon. É o ponto em que esta build deixa de ser um Zealot com uma aura simpática e vira a própria coisa.",
        picks: {
          "weapon-0": {
            why: "A metade física vira a metade principal. O dano fixo do Grief é o que carrega este nível.",
            sockets: "Eth, Tir, Lo, Mal, Ral numa Phase Blade de 5 sockets.",
          },
          "offhand-0": { why: "Skills e resistências." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "helm-0": { why: "Life steal e redução de dano." },
          "boots-0": { why: "Crushing Blow." },
          "belt-0": { why: "Redução de dano e life steal." },
          "amulet-0": { why: "+1 skills, velocidade de ataque, Deadly Strike." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Flame Rift (Sunder Charm de fogo)", why: "A resposta barata ao problema central da build." },
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { label: "Annihilus", why: "+1 em todas as skills." },
        ],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      optimized: {
        goal: "A variante Dragon. Holy Fire vindo do equipamento, Conviction selecionada.",
        nextUpgrade:
          "Conviction, investida de verdade. Com as auras no equipamento, cada ponto nela agora faz o que os pontos de Holy Fire faziam.",
        notes:
          "Faça respec aqui. Os pontos da build padrão em Holy Fire são majoritariamente desperdiçados quando a aura vem do Dragon e do Hand of Justice — coloque-os em Conviction e Zeal. Mantenha Resist Fire e Salvation; elas ainda dão sinergia às auras dos itens.",
        picks: {
          "body-0": {
            why: "**O item-chave.** Uma aura de Holy Fire nível 14 vinda da armadura, o que libera o seu slot de aura selecionada para a Conviction. O +0,375 de Strength por nível ainda se paga.",
            sockets: "Sur, Lo, Sol na armadura de 3 sockets mais leve que você achar.",
          },
          "weapon-0": {
            why: "Uma segunda aura de Holy Fire no nível 16, e -20% de resistência a fogo do inimigo em cima da sua Conviction. As duas auras empilham, e agora você também tem quebra de imunidade.",
            sockets: "Sur, Cham, Amn, Lo numa arma de 4 sockets. Uma Phase Blade pela velocidade, uma Berserker Axe pelo dano.",
          },
          "weapon-0-alt0": {
            why: "Se o Hand of Justice estiver fora de alcance, mantenha o Grief e rode só a aura do Dragon. Você ganha a Conviction, mas com metade do dano de fogo.",
          },
          "offhand-0": {
            why: "Skills e resistências. Com as duas auras de dano agora em outros slots, este volta a te manter vivo.",
          },
          "helm-0": {
            why: "+1 skills, resistências, redução de dano e sockets.",
            lookFor: ["2 sockets", "30% em todas as resistências"],
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood com 20% de Increased Attack Speed",
            why: "Velocidade de ataque e vida.",
            lookFor: ["20% de Increased Attack Speed", "Vida", "Resistências"],
          },
          "boots-0": { why: "Crushing Blow." },
          "belt-0": { why: "Redução de dano." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "Dano direto na aura." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Duas auras de fogo empilhadas, Conviction selecionada, e um sunder de fogo de reserva.",
        notes:
          "Vale dizer com clareza no topo da escada: este é um personagem caro que as duas fontes ranqueadas que consultamos colocam abaixo de builds de Paladin que custam muito menos. Monte porque o quebra-cabeça de empilhar auras é divertido, não porque os números mandam.",
        picks: {
          "body-0": {
            why: "A aura de Holy Fire e a Strength que paga pelo resto do seu equipamento.",
            lookFor: ["+5 em todos os atributos", "base leve de 3 sockets"],
          },
          "weapon-0": {
            why: "A segunda aura, a velocidade de ataque, o life steal e -20% de resistência a fogo do inimigo.",
            lookFor: ["330% de Enhanced Damage", "base Phase Blade ou Berserker Axe"],
          },
          "offhand-0": { why: "Skills, resistências, bloqueio." },
          "helm-0": {
            why: "Dois sockets, resistências máximas, redução de dano máxima.",
            lookFor: ["2 sockets", "30 em todas as resistências", "15% de redução de dano"],
          },
          "gloves-0": {
            label: "Luvas craftadas de Blood, 20% de Increased Attack Speed",
            why: "Velocidade de ataque, life steal e skills.",
            lookFor: ["20% de Increased Attack Speed", "+3 Combat Skills"],
          },
          "boots-0": { why: "Crushing Blow e Deadly Strike." },
          "belt-0": { why: "15% de redução de dano." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
        },
        charms: [
          { label: "Hellfire Torch (Paladin)", why: "+3 skills de Paladin, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Flame Rift (Sunder Charm de fogo)",
            why: "Carregue para os monstros que nem a Conviction consegue empurrar para baixo.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "lightning-sorceress": {
    summary:
      "Picos enormes de dano numa corrente que acha os próprios alvos. A Sorceress mais versátil, numa tabela de breakpoint só dela.",
    playstyle:
      "Duas magias e uma decisão entre elas. O Lightning é um raio em linha e o golpe único mais alto; o Chain Lightning salta entre alvos e limpa grupos. Você teleporta para dentro, escolhe a que a situação pede, e segura. O Static Field amolece qualquer coisa com muita vida tirando um quarto da vida atual por conjuração, e o Infinity do seu mercenário lida com os imunes a raio. A faixa de dano da build é a mais larga de qualquer Sorceress — a mesma conjuração pode rolar muito baixo ou muito alto — e é por isso que ela parece inconsistente até o equipamento de +dano e -resistência do inimigo aparecer.",
    strengths: [
      "Excelente contra densidade e contra alvo único, o que poucas builds conseguem",
      "O Static Field trivializa bosses de muita vida independentemente do seu roll de dano",
      "O Chain Lightning acha alvos que você não vê, o que combina com limpeza rápida por teleport",
      "Forte nas waves do Baal, nos bosses de chave dos Ubers e no Arcane Sanctuary",
      "Escala mais que a maioria: Griffon's Eye, facets e Infinity se acumulam uns sobre os outros",
    ],
    weaknesses: [
      "**A animação de conjuração dela tem uma tabela de breakpoint própria** — o alvo habitual de 105% é o número errado aqui",
      "Imunes a raio são comuns no Hell e a Lightning Mastery não os quebra",
      "A faixa de dano é muito larga, então cada conjuração parece pouco confiável com equipamento baixo",
      "Precisa de Infinity para chegar ao teto, e Infinity é uma Ber e uma Jah",
      "Vida baixa, como toda Sorceress — o Energy Shield é uma consideração real",
    ],
    flexPoints: [
      "**Tudo além das quatro skills maximizadas vai para Charged Bolt ou Nova**, que são as duas sinergias. Charged Bolt primeiro.",
      "**O Energy Shield é uma bifurcação real.** Ele converte dano recebido em mana a uma taxa base de dois de mana por ponto de dano, melhorada pela Telekinesis. Numa build sem vida, pode ser a diferença entre sobreviver a um grupo lightning enchanted e não sobreviver — mas também significa que um mana burn ou uma reserva esvaziada te mata na hora. Pegue de propósito ou não pegue.",
      "**Não coloque pontos em Energy.** A mana vem do Warmth, de um mercenário com Insight e do seu equipamento.",
    ],
    statPlan: {
      strength: "Só o que o seu equipamento exigir. Um Spirit num Monarch pede 156 e é o motivo habitual de esse número não ser mínimo; um Lidless Wall ou um Spirit num escudo mais leve pedem muito menos.",
      dexterity: "Nenhuma, a menos que você esteja montando para bloqueio máximo — e a maioria das Lightning Sorceress não está. O Teleport é a defesa.",
      vitality: "Todo o resto. Não há uso concorrente.",
      energy: "Nenhum. Mesmo com Energy Shield, equipamento e Warmth dão mais mana por ponto gasto do que o atributo dá.",
      notes: [
        "**Decida o escudo antes de gastar Strength.** Um Spirit num Monarch são 156 de Strength; a mesma runeword numa Sacred Targe é uma fração disso.",
        "Às vezes se diz a quem usa Energy Shield para investir em Energy. Não faça — o escudo escala com a sua *reserva* de mana, e equipamento fornece muito mais mana por ponto que o atributo.",
        "Vida é o atributo que mantém uma Sorceress viva, e Battle Orders de uma troca com Call to Arms vale mais que qualquer quantidade de Vitality que você consiga comprar.",
      ],
    },
    breakpointWhy: {
      "fcr-117":
        "**Na tabela de Lightning/Chain Lightning, não na padrão.** Este é o alvo realista de endgame e o motivo de o conselho habitual de 105% estar errado para esta build.",
      "fcr-78":
        "O mínimo que parece aceitável. Só dois Spirits chegam a 70, então isto está a um anel de 10% de distância.",
      "fcr-194":
        "Um frame a mais, a um custo que quase sempre supera dano ou resistência de que você precisa mais.",
      "fhr-60":
        "Uma Sorceress interrompida é uma Sorceress morta. Este é o alvo padrão de recuperação de Sorceress.",
    },
    skillNotes: {
      lightning: "Disponível no nível 12. O golpe único mais alto, e sinergia do Chain Lightning.",
      "chain-lightning":
        "Nível 18. A magia de limpeza — ela salta entre alvos, que é o que torna esta build rápida.",
      "lightning-mastery":
        "**50% de dano no nível 1 e +12% por nível.** Ela aumenta o seu dano; não reduz a resistência do inimigo. Não espere que quebre imunidade — esse é o trabalho do Infinity.",
      "charged-bolt":
        "Sinergia de Lightning e de Chain Lightning, e uma magia genuinamente útil à queima-roupa durante a evolução.",
      "static-field":
        "**Tira 25% da vida atual do alvo por conjuração**, com piso de 33% do máximo no Nightmare e 50% no Hell. Um ponto; a única coisa que mais pontos compram é raio.",
      telekinesis:
        "Pré-requisito do Teleport, e aumenta a eficiência do Energy Shield se você for por esse caminho.",
      teleport: "**Um ponto é tudo de que você precisa, para sempre.** Mais pontos só reduzem o custo de mana.",
      warmth: "Regeneração de mana desde o nível 1. Um ponto se paga imediatamente.",
      "frozen-armor": "Defesa e chance de congelar quem te ataca. Um buff defensivo de graça.",
      nova: "**+5% de dano do Lightning por nível.** Um ponto é tudo que o orçamento permite, mas é sinergia, não pré-requisito.",
      "thunder-storm": "Um raio passivo em intervalo fixo. **A Lightning Mastery não exige ele** — pegue pelo que ele faz, ou não pegue.",
      "energy-shield":
        "Opcional e genuinamente controverso — leia os pontos flexíveis antes de gastar aqui.",
    },
    immunityPlan:
      "Imunidade a raio é comum no Hell e esta build tem exatamente uma resposta real. **A Lightning Mastery não ajuda** — ela é aumento de dano (50% no nível 1, +12% por nível), não redução de resistência, o que a torna o oposto da Cold Mastery e é o mal-entendido mais comum sobre a build. O que funciona é **Infinity no mercenário**, cuja aura de Conviction reduz a resistência do inimigo o bastante para quebrar a maior parte da imunidade a raio natural. Antes de o Infinity existir, as respostas honestas são **Griffon's Eye** (-15-20% de resistência a raio do inimigo, aplicado antes da checagem de imunidade), **facets de raio**, e escolher zonas que não estejam cheias de imunes — a lista de farming acima está ordenada com isso em mente. Um sunder charm **Crack of the Heavens** é a solução direta, ao custo de 70 a 90 pontos da sua própria resistência a raio; leia o artigo de mecânicas antes de pegar um.",
    mercenaryNotes:
      "O mercenário do Ato 2 com **Might**, um **Insight** para a sua mana e — o item que esta build está esperando — um **Infinity** na polearm dele. A aura de Conviction do Infinity é o que quebra imunidade a raio, e enquanto ele não existir a build não tem resposta contra um imune a raio além de pular. Dê um **Vampire Gaze** pela redução de dano e pelo life steal; ele morre mais que o mercenário de um personagem de corpo a corpo.",
    farmingWhy: {
      "throne-of-destruction-hell":
        "Cinco waves densas numa sala só. O Chain Lightning está no seu melhor aqui, e o Static Field derruba a vida do Baal independentemente do seu roll de dano.",
      "chaos-sanctuary-hell":
        "Densa e de nível alto. Cuidado com grupos imunes a raio antes de o Infinity existir.",
      "arcane-sanctuary-hell":
        "Corredores longos e abertos que combinam com teleportar, e o Summoner dropa uma chave. O Chain Lightning cobre a largura das plataformas.",
      "worldstone-keep-hell":
        "Nível de área 85 e muito densa — o melhor farm geral de raio depois que o Infinity existir.",
      "pit-hell": "Nível de área 85, curta, e boa parte dela não é imune a raio.",
      "countess-hell":
        "Runas para o Infinity que você está montando. Curta, e nada lá resiste a você de forma relevante.",
      "travincal-hell":
        "O Council é imune a raio. Sem Infinity esta não é a sua zona, e com Infinity ela vira uma das melhores.",
    },
    levelingPath: {
      summary:
        "Evolui como ela mesma, com uma ressalva. Charged Bolt desde o nível 1 e Nova a partir do 12 são as duas sinergias, então nada do que você gasta cedo é desperdiçado, e o Static Field a partir do 6 lida com qualquer coisa com vida demais. O Lightning chega no 12, o Chain Lightning no 18, e o Teleport no 18 muda como você se move pelo resto do jogo. **A Lightning Mastery não existe antes do nível 30**, então o dano da build parece estagnado até lá — isso é esperado, não um erro na sua distribuição.",
    },
    selfFoundNotes:
      "Boa até certo ponto, e aí ela para. Dois Spirits são oito runas da Countess e são inteiramente self-found; Skin of the Vipermagi, Harlequin Crest e Mara's Kaleidoscope caem no Hell. O Infinity é onde acaba — uma Ber e uma Jah entre quatro runas não é alvo realista de self-found, e sem ele a imunidade a raio limita permanentemente onde você consegue farmar. Uma Lightning Sorceress self-found é um bom personagem que farma uma lista restrita de zonas. Se não é isso que você quer, as páginas de Blizzard e Frozen Orb descrevem builds de frio com uma mastery que de fato quebra imunidade.",
    hardcoreNotes:
      "Jogável, mas exigente. A reserva de vida da Sorceress é a menor do jogo e esta build não tem bloqueio, então sobrevivência é Teleport, recuperação e Battle Orders. Dois perigos específicos: grupos **lightning enchanted**, porque é a sua própria resistência que te salva e a Conviction de um Infinity não te protege deles; e **mana burn**, que é letal se você pegou Energy Shield. Chains of Honor em vez de Enigma, mantenha uma troca com Call to Arms, e trate o alvo de 60% de Faster Hit Recovery como obrigatório em vez de recomendado.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 18 pelo Teleport, e depois ao 30 pela Lightning Mastery.",
        nextUpgrade:
          "Nível 30 e a Lightning Mastery. Antes disso a build é um personagem de Charged Bolt, e ela é boa nisso.",
        notes:
          "Evolua com Charged Bolt e Nova — as duas são sinergias, então nada é desperdiçado. O Static Field a partir do nível 6 lida com qualquer coisa com vida demais.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de Faster Cast Rate no nível 25. O item de melhor custo-benefício que uma Sorceress em evolução pode segurar.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": {
            why: "Resistências por três runas da Countess, que é o que te carrega para dentro do Nightmare.",
          },
          "body-0": { why: "25% de Faster Cast Rate e 25% de Faster Hit Recovery no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
          "gloves-0": { why: "20% de Faster Cast Rate no nível 23." },
        },
      },
      nightmare: {
        goal: "Lightning Mastery ativa, um segundo Spirit, resistências subindo.",
        nextUpgrade:
          "Um Insight para o mercenário, e depois resistências em 75% antes de entrar no Hell.",
        picks: {
          "weapon-0": { why: "Ainda a arma de melhor custo-benefício disponível." },
          "offhand-0": {
            why: "Um segundo Spirit. Dois deles são +4 skills e 70% de Faster Cast Rate, que é quase todo o caminho até o limiar de 78 na sua tabela.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "offhand-0-alt0": {
            why: "+1 skills e 20% de Faster Cast Rate sem precisar achar uma base de 4 sockets. Mais fraco, mas disponível de imediato.",
          },
          "body-0": {
            why: "+1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências com 43 de Strength. A armadura padrão de caster, por um motivo.",
          },
          "helm-0": { why: "+1 skills e magic find até algo melhor cair." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "Resistências e dano convertido em mana num personagem sem Energy." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "O caminho mais barato até 75% antes do Hell." },
        ],
      },
      "early-hell": {
        goal: "Chegar a 78% de Faster Cast Rate na tabela de raio e capar as resistências.",
        nextUpgrade:
          "Infinity no mercenário. É a diferença entre limpar o Hell e escolher as zonas com cuidado.",
        notes:
          "É aqui que imunidade a raio deixa de ser ocasional. Enquanto o Infinity não existir, planeje o seu farm em torno de zonas que não estejam cheias dela — a lista de farming abaixo está ordenada com isso em mente.",
        picks: {
          "weapon-0": { why: "35% de Faster Cast Rate e +2 skills." },
          "offhand-0": { why: "O segundo. 70% entre os dois." },
          "body-0": { why: "Resistências e velocidade de conjuração juntas." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências. O upgrade quando as runas aparecerem.",
          },
          "helm-0": {
            why: "+2 skills, vida, 50% de magic find e 10% de redução de dano com 50 de Strength.",
          },
          "amulet-0": { why: "+2 em todas as skills e +20-30 em todas as resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A velocidade de conjuração mais barata que resta, carregando resistência de que você ainda precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Faster Hit Recovery, Strength e Vitality." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "Segure 75% nas quatro." }],
      },
      budget: {
        goal: "Infinity, e a forma real da build.",
        nextUpgrade: "Griffon's Eye, e facets de raio para encaixar nele.",
        picks: {
          "weapon-0": {
            why: "+3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências. O maior upgrade isolado que a build faz.",
            sockets: "Ko, Vex, Pul, Thul num Flail de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mantenha o Spirit até o Heart of the Oak estar em mãos — 35% contra 40% não é o abismo que o preço sugere.",
          },
          "offhand-0": { why: "35% de Faster Cast Rate e +2 skills." },
          "body-0": { why: "+2 skills, +65 em todas as resistências, 8% de redução de dano." },
          "helm-0": { why: "+2 skills e 50% de magic find." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 em todas as skills e 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "+1 em todas as skills e mana." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "A última velocidade de conjuração necessária para passar do limiar de 117.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find e dano enquanto você farma." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress e +10-20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Grand charms de skills de raio",
            why: "Dano direto, no slot que não tem nada melhor para fazer.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders. Num personagem com tão pouca vida, não é opcional." },
        ],
      },
      optimized: {
        goal: "117% de Faster Cast Rate na tabela de raio, com a resistência do inimigo empilhada para baixo.",
        nextUpgrade: "Facets de raio em todo socket que você tiver, e um roll melhor de Griffon's.",
        picks: {
          "weapon-0": { why: "+3 skills, 40% de Faster Cast Rate, resistências." },
          "weapon-0-alt0": {
            why: "Mais dano bruto — até +3 skills de Sorceress e +20% de dano de skills de raio — ao custo de todas as resistências que o Heart of the Oak dava.",
          },
          "offhand-0": { why: "35% de Faster Cast Rate e +2 skills." },
          "helm-0": {
            why: "**-15-20% de resistência a raio do inimigo** e +10-15% de dano de skills de raio. A linha de resistência soma com a Conviction do Infinity e é aplicada antes da checagem de imunidade.",
            lookFor: ["-20% de resistência a raio do inimigo", "+15% de dano de skills de raio", "1 socket para um facet"],
          },
          "body-0": {
            why: "Teleport sem custo de mana que escala, e a Strength para usar o que você quiser.",
            sockets: "Jah, Ith, Ber numa armadura de 3 sockets.",
          },
          "body-0-alt0": {
            why: "Mantenha enquanto as resistências estiverem apertadas. Você já tem o Teleport como skill.",
          },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro bem rolado supera qualquer unique.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find, ou Sandstorm Trek pela recuperação." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de raio com vida", why: "Dano e vida no mesmo slot." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Passados os 117% de Faster Cast Rate só sobra dano para comprar: facets, um roll melhor de Griffon's, e charms de skills de raio. O limiar de 194 existe, mas o custo de alcançá-lo supera coisas de que você precisa mais.",
        picks: {
          "weapon-0": {
            why: "Um roll de +40 em todas as resistências junto com os +3 skills e 40% de velocidade de conjuração.",
            lookFor: ["+40 em todas as resistências", "base Flail"],
          },
          "offhand-0": {
            why: "Um roll de 35% de Faster Cast Rate num Monarch, com socket se você puder pagar a Strength.",
            lookFor: ["35% de Faster Cast Rate", "base Monarch"],
          },
          "helm-0": {
            why: "Um roll de -20% de resistência do inimigo e +15% de dano de skill, com um facet de raio encaixado.",
            lookFor: ["-20% de resistência a raio do inimigo", "+15% de dano de skills de raio"],
          },
          "body-0": { why: "Teleport, Strength e magic find por nível." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida, mana",
            why: "O último slot a aperfeiçoar.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida e mana"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Grand charms de skills de raio com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "fireball-meteor-sorceress": {
    summary:
      "Um projétil rápido e uma explosão atrasada que compartilham todas as sinergias. Uma das duas melhores ladder starters do jogo.",
    playstyle:
      "Duas magias que se alimentam. O Fire Ball é instantâneo e viaja, então é o que você segura; o Meteor é jogado à frente de onde as coisas estão indo e cai um segundo depois por muito mais dano. Contra um boss você joga o Meteor nele e preenche o intervalo com Fire Ball. Contra um grupo você abre com Meteor e deixa o fogo no chão terminar o que a explosão começou. As duas escalam com as mesmas sinergias e a mesma mastery, então nada do que você investe é dividido entre elas — que é o motivo de esta build funcionar tão cedo com tão pouco equipamento.",
    strengths: [
      "Uma ladder starter de verdade que também tem endgame de verdade — poucas builds são as duas coisas",
      "Fire Ball no nível 12 e Meteor no 24 significam que a build entra cedo e continua crescendo",
      "As duas magias compartilham sinergias, então não há imposto de pontos por jogar com duas skills",
      "Mata Andariel, Mephisto e a Countess rápido com quase nenhum equipamento",
      "Usa a tabela de conjuração padrão, então os alvos familiares de 63% e 105% valem",
    ],
    weaknesses: [
      "**Imunidade a fogo é a mais comum no Hell**, e a Fire Mastery não a quebra",
      "O Meteor tem atraso de queda, então erra qualquer coisa que se mova depois da conjuração",
      "Vida baixa e sem bloqueio, como toda Sorceress",
      "A resposta de endgame para imunidade é a penalidade grande de um Sunder Charm ou um Infinity",
      "Dano de fogo é muito resistido por vários dos melhores alvos de farm",
    ],
    flexPoints: [
      "**Os pontos restantes vão para o Inferno**, que é a outra sinergia do Fire Ball, ou para mais Frost Nova se o problema for sobrevivência e não dano.",
      "**A divisão Meteorb.** Em vez de Fire Mastery e Fire Bolt, algumas pessoas pegam Frozen Orb e Cold Mastery por um segundo tipo de dano. Essa é uma build materialmente diferente, com outro plano de imunidade e outro orçamento de pontos — ela tem página própria em vez de morar aqui como variante.",
      "**Variante de magic find:** troque charms de skill de fogo por magic find, use Tarnhelm ou Harlequin Crest e War Traveler, e aceite mortes mais lentas. O plano de skills não muda em nada, e é por isso que isto é uma decisão de equipamento e não uma build.",
      "**Não coloque pontos em Energy.** O Warmth mais um mercenário com Insight cobrem a mana.",
    ],
    statPlan: {
      strength: "Só o que o equipamento pedir. Esta build não tem motivo para querer um escudo pesado.",
      dexterity: "Nenhuma. O Teleport é a defesa, não o bloqueio.",
      vitality: "Todo o resto.",
      energy: "Nenhum.",
      notes: [
        "Esta é uma das poucas builds de Sorceress em que o plano de atributos é genuinamente trivial — não há decisão de bloqueio nem base pesada para bancar.",
        "Vida é o que te mantém viva. Uma troca com Call to Arms vale mais que qualquer quantidade de Vitality que você comprasse com a mesma moeda.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "O alvo padrão de endgame da Sorceress, e ele governa o Teleport além da conjuração. Dois Spirits mais Magefist mais um anel de 10% passam disso.",
      "fcr-63":
        "O alvo inicial. Uma sword Spirit e o Magefist sozinhos já levam quase lá, e a build parece aceitável aqui.",
      "fhr-60":
        "O Meteor tem uma animação de conjuração que você não quer interrompida, e uma Sorceress presa em stun é uma Sorceress morta.",
    },
    skillNotes: {
      "fire-ball":
        "Nível 12, e a magia que você de fato segura. Raio de explosão 4. Maximize primeiro — é o seu dano nos doze níveis antes de o Meteor existir.",
      meteor:
        "Nível 24. Raio de explosão 6 mais fogo no chão que dura mais por ponto. O atraso é o preço do dano.",
      "fire-mastery":
        "**30% de dano no nível 1, +7% por nível.** Ela aumenta o seu dano; não reduz a resistência a fogo do inimigo. Não vai quebrar uma imunidade.",
      "fire-bolt":
        "Sinergia do Fire Ball e do Meteor, e o seu dano nos primeiros onze níveis. Nada gasto aqui é desperdiçado.",
      warmth: "Regeneração de mana desde o nível 1. Um ponto, vale para sempre.",
      teleport: "**Um ponto para sempre.** Mais pontos só cortam o custo de mana.",
      "static-field":
        "Tira 25% da vida atual do alvo. A resposta contra qualquer coisa com uma reserva de vida que você não consegue mastigar.",
      "frozen-armor": "Defesa grátis e chance de congelar o que te acerta.",
      "frost-nova":
        "Um botão de pânico à queima-roupa que também congela. Seguro barato num personagem sem bloqueio.",
      "inferno": "Pré-requisito do Blaze. Um ponto no caminho que o Meteor realmente exige.",
      "blaze": "Pré-requisito do Fire Wall.",
      "fire-wall": "**O Meteor exige Fire Ball e Fire Wall.** O Fire Wall é a metade que a maioria dos guias omite, e ele custa uma cadeia de três pontos a partir do Inferno.",
    },
    immunityPlan:
      "Fogo é o elemento mais resistido do Hell, e **a Fire Mastery não ajuda** — ela dá 30% de dano no nível 1 e +7% por nível, aumentando a sua saída em vez de baixar a resistência deles. Existem três respostas honestas e você deve escolher uma antes do Ato 3, não durante. **Um sunder charm Flame Rift** quebra imunidade a fogo diretamente e custa de 70 a 90 pontos da sua própria resistência a fogo, o que numa dificuldade que já aplica −100 é um preço sério. **Infinity no mercenário** quebra muitas imunidades a fogo via Conviction sem penalidade para você, e custa uma Ber e uma Jah. **Escolher zonas** é legítimo e de graça, e a lista de farming acima está ordenada de acordo — embora não exista neste site uma zona livre de fogo para escolher, e as áreas que esta build mais farma registrem fogo entre as imunidades delas. O **Static Field** não é resposta para imunidade, mas é resposta para boss — ele tira um quarto da vida atual independentemente do que o alvo resiste.",
    mercenaryNotes:
      "Mercenário do Ato 2 com **Might**, e um **Insight** na polearm dele o quanto antes — a Meditation resolve de vez a mana de uma Sorceress por quatro runas comuns. Depois, o **Infinity** é a alternativa a carregar um Sunder Charm: a aura de Conviction dele quebra muitas imunidades a fogo sem te custar 70 a 90 pontos da sua própria resistência a fogo. Dê um **Vampire Gaze** enquanto isso.",
    farmingWhy: {
      "mephisto-hell":
        "O clássico. Um trajeto de vinte segundos, ele não é imune a fogo, e a tabela de drop é excelente. Esta build o mata mais rápido que quase qualquer outra no mesmo nível de equipamento.",
      "andariel-hell":
        "Curta, perto de um waypoint, e ela morre para um Meteor e alguns Fire Balls.",
      "countess-hell": "Runas, e nada na torre resiste a fogo de forma relevante.",
      "stony-tomb-hell":
        "Nível de área 85, perto de um waypoint, e leve em imunidade a fogo. Uma das melhores zonas para build de fogo do jogo.",
      "pit-hell":
        "Nível de área 85 e curta. Alguns imunes a fogo, que é para o que serve o seu Sunder Charm ou Infinity.",
      "ancient-tunnels-hell":
        "Nível de área 85 e compacta. Fogo está entre as imunidades registradas dela, então esta é uma zona em que o mercenário justifica o salário, e não uma que você limpa sem ser incomodada.",
      "chaos-sanctuary-hell":
        "Densa e de nível alto, mas boa parte resiste a fogo. Confortável só depois de a imunidade estar resolvida.",
    },
    levelingPath: {
      summary:
        "Esta é uma build de evolução por direito próprio, e uma das duas melhores. O Fire Bolt desde o nível 1 é sinergia, então nada é desperdiçado; o Fire Ball no 12 é um salto real; o Static Field no 6 lida com qualquer coisa com vida demais; o Teleport no 18 muda como você se move. O Meteor chega no 24 e a Fire Mastery no 30, então a build só fica completa no 30 — mas, diferente da maioria, ela nunca foi fraca no caminho. **Nenhum respec é necessário em momento algum.**",
    },
    selfFoundNotes:
      "A melhor Sorceress para self-found do site junto com a Blizzard, e possivelmente melhor porque as skills de fogo entram mais cedo. Fire Bolt desde o nível 1, Fire Ball desde o 12, e tudo que a build quer abaixo do endgame é runeword da Countess ou compra de vendedor. A única parede genuína é imunidade a fogo no Hell, e a resposta mais barata para ela — escolher zonas que não tenham muita — não custa nada. Um Flame Rift é alvo realista de self-found; um Infinity não é.",
    hardcoreNotes:
      "Uma das Sorceress mais sobreviventes, por um motivo pouco glamouroso: o Meteor é conjurado à distância e o Fire Ball viaja, então você passa menos tempo perto do que está matando do que uma Blizzard ou uma Nova. Os perigos são da classe, não da build — sem bloqueio, a menor reserva de vida do jogo, e morte por interrupção. Pegue Chains of Honor em vez de Enigma, trate os 60% de Faster Hit Recovery como obrigatórios, mantenha Frost Nova numa tecla como botão de pânico, e use a troca com Call to Arms antes de qualquer coisa perigosa.",
    gearSets: {
      starter: {
        goal: "Fire Bolt até o 12, Fire Ball até o 24, Meteor dali em diante. Quase nenhum equipamento necessário.",
        nextUpgrade: "Meteor no 24, Fire Mastery no 30. Aí comece a farmar o Mephisto.",
        notes:
          "O Fire Bolt te carrega até o 12 e é sinergia, então esses pontos seguem úteis pela vida inteira do personagem. É o mais perdoável que evoluir consegue ser.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de Faster Cast Rate no nível 25. O item de melhor custo-benefício do jogo para um caster em evolução.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "weapon-0-alt0": {
            label: "Qualquer staff ou orb com +Fire Ball ou +Fire Bolt",
            why: "O estoque dos vendedores é renovado toda vez que você entra na cidade, e uma staff com +3 Fire Ball supera a maioria dos uniques iniciais.",
            lookFor: ["+3 Fire Ball", "+3 Fire Bolt", "+2 Fire Skills"],
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "25% de Faster Cast Rate e 25% de Faster Hit Recovery no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
          "gloves-0": {
            why: "20% de Faster Cast Rate **e +1 em Fire Skills**, o que nesta build faz dele um item de dano além de um de velocidade.",
          },
        },
      },
      nightmare: {
        goal: "Fire Mastery ativa e Mephisto no farm.",
        nextUpgrade:
          "Resistências em 75%, um Insight para o mercenário, e então um plano para imunidade a fogo.",
        picks: {
          "weapon-0": { why: "Ainda o melhor custo-benefício disponível." },
          "offhand-0": {
            why: "Um segundo Spirit — +4 skills e 70% de Faster Cast Rate entre os dois, o que passa do alvo de 63 com folga.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "offhand-0-alt0": {
            why: "+1 skills e 20% de velocidade sem precisar caçar uma base de 4 sockets.",
          },
          "body-0": {
            why: "+1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências com 43 de Strength.",
          },
          "helm-0": { why: "+1 skills e magic find enquanto você farma." },
          "gloves-0": { why: "+1 em Fire Skills e 20% de Faster Cast Rate." },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "O caminho mais barato até 75% antes do Hell." },
        ],
      },
      "early-hell": {
        goal: "Entrar no Hell com 105% de velocidade de conjuração e decidir o que fazer com os imunes a fogo.",
        nextUpgrade: "Death's Fathom ou um conjunto de facets de fogo, e uma decisão sobre o Sunder Charm.",
        notes:
          "Fogo é o elemento mais resistido do Hell, e é aqui que isso vira o seu problema em vez de uma nota de rodapé. Escolha uma das três respostas do plano de imunidade e construa na direção dela, em vez de descobrir no Ato 3.",
        picks: {
          "weapon-0": { why: "35% de velocidade e +2 skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração." },
          "body-0-alt0": { why: "+2 skills e +65 em todas as resistências quando as runas aparecerem." },
          "helm-0": { why: "+2 skills, vida, 50% de magic find e 10% de redução de dano." },
          "amulet-0": { why: "+2 em todas as skills e +20-30 em todas as resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A última velocidade de que você precisa, carregando resistência de que também precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Faster Hit Recovery, Strength e Vitality." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "Segure 75% nas quatro." },
          {
            label: "Flame Rift (Sunder Charm de fogo)",
            why: "A resposta direta para imunidade a fogo, ao custo de 70 a 90 pontos da sua própria resistência a fogo. Leia o artigo de resistências antes de se comprometer a carregar um.",
          },
        ],
      },
      budget: {
        goal: "Farmar o Hell de forma confiável com uma resposta para imunidade a fogo em mãos.",
        nextUpgrade:
          "Facets de fogo, e ou Infinity no mercenário ou um slot permanente de Sunder Charm.",
        picks: {
          "weapon-0": {
            why: "+3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências.",
            sockets: "Ko, Vex, Pul, Thul num Flail de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mais dano: até +3 skills de Sorceress, 40% de velocidade e +20% de dano de skills de fogo — mas nenhuma resistência.",
          },
          "offhand-0": { why: "35% de velocidade e +2 skills." },
          "body-0": { why: "+2 skills, +65 em todas as resistências, 8% de redução de dano." },
          "helm-0": { why: "+2 skills e 50% de magic find." },
          "gloves-0": { why: "+1 em Fire Skills e 20% de velocidade." },
          "belt-0": { why: "+1 em todas as skills e 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "+1 em todas as skills e mana." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "Passa do alvo de 105.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find e dano." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress e resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Flame Rift (Sunder Charm de fogo)",
            why: "Leve para as zonas que exigem e deixe no baú nas outras.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      optimized: {
        goal: "Dano de fogo empilhado, imunidade resolvida, magic find por cima.",
        nextUpgrade:
          "Facets de fogo em todo socket, e Infinity se você preferir não carregar um Sunder Charm.",
        picks: {
          "weapon-0": {
            why: "Até +3 skills de Sorceress, 40% de velocidade e +20% de dano de skills de fogo. A arma de dano quando as suas resistências vierem de outro lugar.",
            lookFor: ["+3 skills de Sorceress", "+20% de dano de skills de fogo", "3 sockets para facets"],
          },
          "weapon-0-alt0": {
            why: "Mantenha se os +40 em todas as resistências forem o que está segurando o seu cap.",
          },
          "offhand-0": { why: "35% de velocidade e +2 skills." },
          "body-0": { why: "+2 skills e as resistências que te permitem usar o Eschuta's." },
          "body-0-alt0": {
            why: "Teleport de graça e Strength por nível. Você já tem o Teleport como skill, então aqui é pelo custo de mana e pela Strength.",
          },
          "helm-0": { why: "+2 skills, magic find, redução de dano. Encaixe um facet de fogo." },
          "gloves-0": { why: "+1 em Fire Skills e 20% de velocidade." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro supera qualquer unique para esta build.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "Dano e vida num slot só." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Acima de 105% de velocidade de conjuração as únicas compras restantes são facets de fogo, rolls melhores, e a resposta de imunidade que você escolheu. O teto desta build é mais baixo que o da Lightning Sorceress, e o piso é muito mais alto — que é a troca que ela vem fazendo desde o nível 12.",
        picks: {
          "weapon-0": {
            why: "Um roll de +3 skills e +20% de dano de skills de fogo com três sockets de facets de fogo.",
            lookFor: ["+3 skills de Sorceress", "+20% de dano de skills de fogo", "3 sockets"],
          },
          "offhand-0": {
            why: "35% de velocidade num Monarch.",
            lookFor: ["35% de Faster Cast Rate", "base Monarch"],
          },
          "body-0": { why: "Teleport, Strength e magic find por nível." },
          "helm-0": { why: "+2 skills, com um facet de fogo encaixado.", lookFor: ["2 sockets"] },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida, mana",
            why: "O último slot a aperfeiçoar.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "frozen-orb-sorceress": {
    summary:
      "Um projétil que solta gelo enquanto viaja, sob uma mastery que arranca resistência a frio. A build de farm mais perdoável do jogo.",
    playstyle:
      "Conjure na direção do problema e continue andando. O orb viaja para frente e joga estilhaços para os lados o caminho inteiro, então ele cobre um corredor largo sem você precisar mirar com precisão — e é por isso que é a build recomendada para quem acha a colocação no chão do Blizzard chata. Tudo que ele toca é congelado ou desacelerado, então a luta vai ficando mais lenta conforme acontece. A Cold Mastery trabalha em silêncio no fundo: ela arranca uma fatia grande da resistência a frio de tudo, e é por isso que o dano se sustenta no Hell.",
    strengths: [
      "Quase nenhuma mira necessária — o orb cobre um caminho largo sozinho",
      "Congela e desacelera tudo que toca, o que é defesa além de dano",
      "**A Cold Mastery reduz a resistência do inimigo em vez de aumentar o seu dano**, então builds de frio encontram menos paredes que as de fogo ou raio",
      "Excelente em Terror Zones, onde a densidade combina com um projétil largo que viaja",
      "Muito barata. Dois Spirits e um Vipermagi já é um personagem funcional no Hell",
    ],
    weaknesses: [
      "**Nada antes do nível 30** — Frozen Orb e Cold Mastery abrem juntos",
      "Imunes a frio existem e a Cold Mastery não os quebra, só reduz resistência do que não é imune",
      "Dano de alvo único é modesto; bosses demoram",
      "Vida baixa, sem bloqueio, e nenhuma camada defensiva além do Teleport e do congelamento",
      "Um tipo de dano só, então um imune a frio de verdade é uma parede e não uma lentidão — o Pit e o Worldstone Keep são onde este site os registra",
    ],
    flexPoints: [
      "**Os pontos restantes vão para o Glacial Spike**, que é ao mesmo tempo uma terceira sinergia e o melhor botão de emergência da árvore de frio.",
      "**A questão do Blizzard.** O Blizzard é a outra build de frio e tem página própria; ele troca a mira perdoável desta build por dano de alvo único maior e um cooldown para administrar. Não são variantes uma da outra e os planos de skill mal se sobrepõem.",
      "**A divisão Meteorb** — Frozen Orb mais Meteor em vez de Frozen Orb mais as sinergias de frio — é uma build separada com página própria. Ela compra um segundo tipo de dano e paga com um orçamento de pontos bem mais apertado.",
      "**Variante de magic find:** esta build tem o melhor perfil de magic find entre as starters, porque limpa rápido e quase não precisa de nada do equipamento. Troque charms de dano por magic find e use War Traveler e um Harlequin Crest. O plano de skills não muda.",
    ],
    statPlan: {
      strength: "Só o que o equipamento pedir, que para esta build é muito pouco.",
      dexterity: "Nenhuma. O Teleport e o congelamento são a defesa.",
      vitality: "Todo o resto.",
      energy: "Nenhum. O Warmth e um mercenário com Insight cobrem.",
      notes: [
        "Este é o plano de atributos mais barato de qualquer build do site: sem bloqueio, sem base pesada, sem requisito de arma.",
        "Uma troca com Call to Arms vale mais vida que qualquer quantidade de Vitality que você comprasse com a moeda equivalente.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "O alvo padrão da Sorceress, e ele governa o Teleport além da conjuração — que numa build de farm é a maior parte do seu tempo.",
      "fcr-63": "O alvo inicial, e uma sword Spirit mais Magefist quase chegam lá sozinhos.",
      "fhr-60":
        "O alvo padrão de recuperação da Sorceress. Ser interrompida é a forma principal de esta build morrer.",
    },
    skillNotes: {
      "frozen-orb":
        "Nível 30. A build inteira. Maximize primeiro e nada mais chega perto em valor por ponto.",
      "cold-mastery":
        "**Reduz a resistência a frio do inimigo em 20% no nível 1 e mais 5% por nível.** Não é multiplicador de dano — é o motivo de o seu dano ainda acertar no Hell.",
      "ice-bolt":
        "Sinergia do Frozen Orb, e o seu dano nos primeiros onze níveis. Nada gasto aqui é desperdiçado.",
      "ice-blast":
        "A segunda sinergia. Também é uma magia de alvo único utilizável enquanto você espera o nível 30.",
      warmth: "Regeneração de mana desde o nível 1.",
      teleport: "**Um ponto para sempre.** Mais pontos só cortam o custo de mana.",
      "static-field":
        "Tira 25% da vida atual do alvo, que é como uma build de frio lida com um boss que ela não consegue explodir.",
      "frozen-armor": "Defesa e congelamento em quem te ataca.",
      "frost-nova": "Um botão de pânico à queima-roupa que congela tudo ao seu redor.",
      "glacial-spike":
        "No caminho até o Blizzard, e uma ferramenta defensiva de verdade por si só — um ponto congela um grupo inteiro por um instante.",
      blizzard:
        "**Pré-requisito do Frozen Orb**, então este ponto é obrigatório. Também é uma build inteira — veja a página da Blizzard Sorceress se o estilo de colocar no chão te agradar mais que o orb que viaja.",
    },
    immunityPlan:
      "Builds de frio encontram menos paredes que as de fogo ou raio, e vale entender por quê. **A Cold Mastery reduz a resistência a frio do inimigo em 20% no nível 1 e mais 5% por nível**, enquanto as masteries de fogo e raio aumentam o seu próprio dano. Contra qualquer coisa que não seja de fato imune, isso significa que o seu dano continua acertando bem dentro do Hell sem um único item comprado para isso. **Mas ela não quebra imunidade verdadeira**: redução de resistência é aplicada com um quinto da eficácia contra um monstro já imune, então uma Cold Mastery maximizada vale cerca de −20% contra algo em 110%, o que está longe de bastar. As respostas contra imunes a frio de verdade são um sunder charm **Cold Rupture** ao custo de 70 a 90 pontos da sua própria resistência a frio, **o dano físico do seu mercenário**, ou **pular** — que numa build de farm costuma ser o certo. O Pit e o Worldstone Keep são onde essa escolha custa caro, e a lista de farming acima está avaliada de acordo.",
    mercenaryNotes:
      "Mercenário do Ato 2 com **Might**, um **Insight** para a sua mana, e um **Vampire Gaze** para mantê-lo vivo. Diferente da Lightning Sorceress, esta build não precisa de um Infinity — a Cold Mastery já reduz a resistência a frio do inimigo, então o mercenário está ali pelo dano e pelos imunes a frio que você decidir não pular. **Treachery** na armadura dele é um upgrade barato cujo proc de Fade sobe muito as resistências dele.",
    farmingWhy: {
      "mephisto-hell":
        "O motivo de a build existir. Um trajeto de vinte segundos, ele não é imune a frio, e a tabela de drop é uma das melhores do jogo.",
      "pindleskin-hell":
        "A dez segundos de um portal e monstro nível 86. Ele é imune a frio no Hell, então esta é uma run em que o seu mercenário ganha o salário — ou em que você leva um Cold Rupture.",
      "andariel-hell": "Curta, perto de um waypoint, e ela morre rápido com alguns orbs.",
      "countess-hell": "Runas, e um trajeto que o orb limpa sem você mirar em nada.",
      "pit-hell":
        "Nível de área 85, curta, e o caminho largo do orb combina com o layout. O melhor farm geral depois que você tiver magic find.",
      "mausoleum-hell":
        "Nível de área 85 densa e perto de um waypoint. Densidade é onde um projétil que viaja está no seu melhor.",
      "ancient-tunnels-hell":
        "Nível de área 85 e uma das melhores zonas do jogo, com fogo e veneno entre as imunidades registradas, e não frio. A casa natural de uma build de frio, e esta não é exceção.",
    },
    levelingPath: {
      summary:
        "Frozen Orb e Cold Mastery chegam os dois no **nível 30**, então os primeiros trinta níveis são jogados como uma Sorceress de Ice Bolt e Ice Blast — e as duas são sinergias, então nada é desperdiçado. O Static Field a partir do nível 6 lida com qualquer coisa com vida demais, e o Teleport no 18 muda como você se move. **Nenhum respec é necessário**, o que junto com a Fire Ball Meteor Sorceress faz destas as duas partidas mais perdoáveis do site.",
    },
    selfFoundNotes:
      "Junto com a Fire Ball Meteor, o melhor personagem de self-found do site. Tudo de que ela precisa abaixo do endgame é runeword da Countess ou compra de vendedor, ela não tem nenhum item que seja requisito duro, e a Cold Mastery significa que ela não precisa de um Infinity para continuar funcionando no Hell. Uma Frozen Orb Sorceress self-found farmando o Mephisto é como muita gente banca todos os outros personagens que tem.",
    hardcoreNotes:
      "Uma das casters mais seguras do jogo, e o motivo é o congelamento e não o dano. Tudo que o orb toca fica desacelerado, então grupos chegam devagar e em pedaços; Frost Nova e Glacial Spike te dão dois botões de pânico que param uma sala inteira. Pegue Chains of Honor em vez de Enigma, trate os 60% de Faster Hit Recovery como obrigatórios, e mantenha uma troca com Call to Arms. O perigo real é o mesmo de toda Sorceress — grupos imunes a frio que fecham a distância enquanto você não tem nada para desacelerá-los.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30. Até lá você é uma Sorceress de Ice Bolt, e tudo bem.",
        nextUpgrade:
          "Nível 30. Frozen Orb e Cold Mastery chegam juntos e o personagem muda por completo num nível só.",
        notes:
          "Evolua com Ice Bolt e Ice Blast. As duas são sinergias, então todo ponto gasto antes do 30 ainda está trabalhando no 90. O Static Field a partir do nível 6 lida com qualquer coisa com vida demais.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de Faster Cast Rate no nível 25.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "weapon-0-alt0": {
            label: "Qualquer staff ou orb com +Ice Bolt ou +Ice Blast",
            why: "O estoque dos vendedores é renovado cada vez que você entra na cidade. Uma staff com +3 numa sinergia é dano grátis que continua pagando depois do nível 30.",
            lookFor: ["+3 Ice Bolt", "+3 Ice Blast", "+2 Cold Skills"],
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "25% de Faster Cast Rate e 25% de Faster Hit Recovery no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
          "gloves-0": {
            why: "Mana, e +1 em Cold Skills quando você achar um par. O Magefist é a alternativa se velocidade de conjuração importar mais.",
          },
        },
      },
      nightmare: {
        goal: "Frozen Orb ativo, Mephisto no farm, resistências subindo.",
        nextUpgrade: "Resistências em 75%, um Insight para o mercenário, e então simplesmente farme.",
        picks: {
          "weapon-0": { why: "Ainda o item de melhor custo-benefício disponível." },
          "offhand-0": {
            why: "Um segundo Spirit — +4 skills e 70% de Faster Cast Rate entre os dois.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "offhand-0-alt0": {
            why: "+1 skills e 20% de velocidade sem precisar achar uma base de 4 sockets.",
          },
          "body-0": {
            why: "+1 skills, 30% de velocidade e até +35 em todas as resistências com 43 de Strength.",
          },
          "helm-0": { why: "+1 skills e até 50% de magic find, que nesta build é o ponto." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "O caminho mais barato até 75% antes do Hell." },
        ],
      },
      "early-hell": {
        goal: "105% de velocidade, resistências capadas, e Mephisto rodando em repetição.",
        nextUpgrade:
          "Nightwing's Veil ou Death's Fathom — os dois itens que transformam uma build barata numa build rápida.",
        notes:
          "É aqui que a build já está fazendo o trabalho dela. Tudo acima deste nível a deixa mais rápida; nada acima dele a torna possível.",
        picks: {
          "weapon-0": { why: "35% de velocidade e +2 skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração juntas, barato." },
          "body-0-alt0": {
            why: "+3 numa magia aleatória e +10-15% de dano de skills de frio se o roll for Frozen Orb. Uma loteria, mas barata.",
          },
          "helm-0": { why: "+2 skills, vida, 50% de magic find e 10% de redução de dano." },
          "amulet-0": { why: "+2 em todas as skills e +20-30 em todas as resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A última velocidade de que você precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Magic find, que é para o que esta build serve." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "Segure 75% nas quatro." }],
      },
      budget: {
        goal: "Farm rápido de Mephisto e de Terror Zones com magic find de verdade.",
        nextUpgrade:
          "Nightwing's Veil, e Death's Fathom quando a restrição virar velocidade de limpeza em vez de magic find.",
        picks: {
          "weapon-0": {
            why: "+3 skills de Sorceress, 30% de velocidade, +20 em todas as resistências e 50% de magic find. O orb clássico de magic find, e barato.",
          },
          "weapon-0-alt0": {
            why: "A opção de dano: até +30% de dano de skills de frio. Bem mais caro, e vale a pena quando a velocidade de limpeza for a restrição.",
          },
          "offhand-0": { why: "35% de velocidade e +2 skills." },
          "body-0": { why: "+2 skills, +65 em todas as resistências, 8% de redução de dano." },
          "helm-0": { why: "+2 skills e 50% de magic find." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 em todas as skills e 20% de Faster Cast Rate." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "Magic find, numa build cujo propósito inteiro é achar coisas." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "Passa dos 105%.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find e dano." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress e resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de frio com vida", why: "Dano e vida juntos." },
        ],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      optimized: {
        goal: "Dano de frio empilhado, e a escolha entre achar mais e matar mais rápido.",
        nextUpgrade:
          "Facets de frio em todo socket, e um charm Cold Rupture se o Pit ou o Worldstone Keep forem o que você quer farmar.",
        picks: {
          "weapon-0": {
            why: "Até +30% de dano de skills de frio além dos +3 skills de Sorceress. O maior item de dano que esta build tem.",
            lookFor: ["+30% de dano de skills de frio", "+3 skills de Sorceress", "sockets para facets de frio"],
          },
          "weapon-0-alt0": {
            why: "Mantenha o Oculus enquanto magic find importar mais que velocidade de limpeza. Essa é uma escolha real e não uma escolha menor.",
          },
          "offhand-0": { why: "35% de velocidade e +2 skills." },
          "helm-0": {
            why: "+2 skills e até +15% de dano de skills de frio. O requisito de 192 de Strength é cortado pela metade pelo próprio Requirements -50% dele, então o custo real é 96.",
            lookFor: ["+15% de dano de skills de frio", "2 sockets para facets de frio"],
          },
          "helm-0-alt0": {
            why: "Mantenha o Shako pelo magic find e pela redução de dano se você está farmando em vez de empurrando.",
          },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "body-0-alt0": {
            why: "Teleport sem custo de mana que escala, mais magic find por nível.",
          },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro supera qualquer unique.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de frio com vida", why: "Dano e vida." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "A nota honesta no topo da escada: o teto desta build é mais baixo que o da Lightning ou da Nova, e ela chega a esse teto por uma fração do preço. Ela segue sendo um dos melhores personagens de magic find do jogo justamente porque nunca precisou dos itens caros para funcionar.",
        picks: {
          "weapon-0": {
            why: "Um roll de +30% de dano de skills de frio, com facets de frio encaixados.",
            lookFor: ["+30% de dano de skills de frio", "sockets"],
          },
          "offhand-0": {
            why: "35% de velocidade num Monarch.",
            lookFor: ["35% de Faster Cast Rate", "base Monarch"],
          },
          "helm-0": {
            why: "+15% de dano de skills de frio com dois facets de frio dentro.",
            lookFor: ["+15% de dano de skills de frio", "2 sockets"],
          },
          "body-0": { why: "Teleport, Strength e magic find por nível." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida, mana",
            why: "O último slot a aperfeiçoar.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de frio com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "nova-sorceress": {
    summary:
      "Um anel de raio que se expande de onde você está, conjurado rápido o bastante para ser contínuo. A matadora de densidade mais rápida do jogo.",
    playstyle:
      "Teleporte para o meio do grupo e segure o botão. A Nova se expande a partir da sua posição, então não há mira nenhuma — a única habilidade é escolher onde cair. Na velocidade de conjuração cheia os anéis se sobrepõem e viram algo mais próximo de um campo contínuo que de uma sequência de magias. Você fica dentro de tudo que está matando, e é por isso que o Energy Shield entra na conversa e por que a build quer mais vida do que parece.",
    strengths: [
      "A velocidade de limpeza mais alta do site. Nada mata uma sala lotada mais rápido",
      "Nenhuma mira — a magia é centrada em você",
      "Infinity empunhado por você quebra imunidade a raio *e* libera o mercenário para o Insight",
      "O Static Field lida com os alvos únicos em que a Nova é ruim",
      "Teto enorme: o DiabloBytes a classifica como a melhor build do jogo",
    ],
    weaknesses: [
      "**O setup padrão dela é um Infinity**, que é uma Ber, uma Mal, uma Ber e uma Ist. Não existe versão barata da build pronta",
      "Você luta do centro do grupo, que é o lugar mais perigoso para estar",
      "Dano de alvo único ruim — bosses são problema do Static Field, não da Nova",
      "Usa a tabela de conjuração padrão, o que é fácil de errar depois de ler a página da Lightning",
      "O Energy Shield transforma mana burn de incômodo em morte",
    ],
    flexPoints: [
      "**O Energy Shield é a decisão real da build.** A dois de mana por ponto de dano, ele converte uma reserva grande de mana numa segunda barra de vida efetiva, o que combina com um personagem parado no meio de tudo. Também significa que mana burn te mata na hora e que uma reserva esvaziada te deixa com a sua vida real, minúscula. Pegue de propósito com investimento em Telekinesis por trás, ou não pegue e compre vida. Ficar em cima do muro é o pior dos dois.",
      "**A híbrida com Hydra.** O Maxroll publica uma variante que adiciona Hydra pelo dano de fogo que a Nova não faz. Custa os pontos que iriam para uma sinergia e te dá uma resposta contra imunes a raio que não é o Infinity. Vale antes de o Infinity existir, menos depois.",
      "**Variante de magic find:** mesmo plano de skills, troque charms e equipamento de dano por magic find. A velocidade de limpeza da build faz dela um dos melhores personagens de magic find mesmo com dano reduzido.",
      "**Não coloque pontos em Energy**, nem para o Energy Shield. O escudo escala com a sua reserva de mana, e equipamento fornece muito mais mana por ponto gasto que o atributo.",
    ],
    statPlan: {
      strength: "O suficiente para o seu equipamento. Se você empunhar o Infinity, note que ele vai numa **polearm ou spear** — confira o requisito da base antes de gastar pontos, porque é mais alto do que um caster costuma pagar.",
      dexterity: "Nenhuma. Esta build não tem bloqueio nem precisão de arma a satisfazer.",
      vitality:
        "Todo o resto, e importa mais aqui que em qualquer outra Sorceress porque você luta do meio.",
      energy: "Nenhum. Equipamento dá mais mana por ponto que o atributo, mesmo com Energy Shield.",
      notes: [
        "**O Infinity é uma runeword de polearm ou spear.** Uma Sorceress consegue empunhar, mas o requisito de Strength é o custo real de fazer isso e deve ser planejado antes de gastar um ponto.",
        "Vida é o atributo que importa. Uma troca com Call to Arms vale mais que qualquer coisa que você comprasse com a mesma moeda.",
        "Se você pegar o Energy Shield, coloque pontos em Telekinesis em vez de Energy — ela melhora a taxa de conversão, que é o que de fato escala.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "**A tabela padrão da Sorceress se aplica aqui** — a Nova não é Lightning nem Chain Lightning. Em 105% os anéis se sobrepõem e viram algo contínuo, que é o ponto inteiro da build.",
      "fcr-63":
        "O mínimo para a build parecer ela mesma em vez de uma sequência de conjurações separadas.",
      "fhr-60":
        "Não é recomendado — é obrigatório. Você luta de dentro do grupo, e uma Sorceress que não consegue se recuperar de um golpe ali não se recupera de jeito nenhum.",
    },
    skillNotes: {
      nova: "Nível 12. Expande a partir da sua posição, então a única decisão é onde ficar.",
      "lightning-mastery":
        "**50% de dano no nível 1 e +12% por nível.** Um multiplicador de dano, não uma redução de resistência — ela não quebra imunidade.",
      "static-field":
        "Sinergia da Nova além de ser a sua resposta contra bosses. Tira 25% da vida atual do alvo por conjuração, o que é o que permite a uma build péssima de alvo único conseguir matar coisas.",
      "charged-bolt": "A outra sinergia, e o seu dano nos primeiros onze níveis.",
      warmth:
        "Regeneração de mana desde o nível 1, e importa mais aqui que em qualquer outra build se você pegar Energy Shield.",
      telekinesis:
        "Pré-requisito do Teleport, e melhora a taxa de mana por dano do Energy Shield. Vale mais que um ponto se você se comprometer com o escudo.",
      teleport: "**Um ponto para sempre**, e é como você chega ao meio do grupo.",
      "energy-shield":
        "**Dois de mana por ponto de dano na base**, melhorado pela Telekinesis. Uma bifurcação real — leia os pontos flexíveis antes de se comprometer.",
      "frozen-armor": "Defesa grátis e chance de congelar o que te alcançar.",
      "frost-nova":
        "Congela tudo ao seu redor. Numa build que vive no centro dos grupos, este é um botão de verdade.",
      lightning:
        "Um ponto para o raro alvo único que o Static Field não termina. Não invista mais — ele está numa tabela de conjuração diferente.",
      "thunder-storm": "Um raio passivo em intervalo fixo. Um ponto — não é sinergia do Nova e a Lightning Mastery não exige ele.",
      "chain-lightning": "**Thunder Storm e Energy Shield exigem os dois o Chain Lightning.** Um ponto cobre ambos.",
    },
    immunityPlan:
      "Uma resposta, e a build é construída em torno de possuí-la. **A Lightning Mastery não quebra imunidade** — é um multiplicador de dano de 50% mais 12% por nível, igual à da Lightning Sorceress. O que quebra é a **Conviction do Infinity**, e a escolha que define esta build é empunhar esse Infinity você mesma em vez de colocá-lo no mercenário: a aura é idêntica dos dois jeitos, e empunhar libera ele para carregar o Insight que paga a sua conta de mana. O **Griffon's Eye** soma outros -15-20% de resistência a raio do inimigo por cima, e **facets de raio** somam mais ainda. Antes de o Infinity existir, as respostas honestas são a variante **híbrida com Hydra** por um segundo tipo de dano, ou escolher zonas — o Secret Cow Level não tem nada imune a raio dentro dele. Um sunder charm **Crack of the Heavens** funciona, mas custa 70 a 90 pontos da sua própria resistência a raio, o que numa build parada no meio de grupos lightning enchanted é uma troca pior que o normal.",
    mercenaryNotes:
      "**Esta é a build em que o trabalho do mercenário se inverte.** Como você carrega o Infinity, ele não precisa — então dê a ele um **Insight**, cuja aura de Meditation é o que banca uma build que conjura continuamente. Pegue **Might** pelo dano dele, ou **Holy Freeze** para desacelerar o grupo dentro do qual você está, o que nesta build vale mais que o dano dele. Uma armadura **Treachery** e um **Vampire Gaze** o mantêm vivo; ele ainda vai morrer, porque está onde você está.",
    farmingWhy: {
      "secret-cow-level-hell":
        "Densidade enorme, nada imune a raio, e cada vaca anda para dentro de uma magia centrada em você. A coisa mais rápida que esta build faz.",
      "worldstone-keep-hell":
        "Nível de área 85 e muito densa. Com Infinity, é o melhor farm geral do jogo para esta build.",
      "throne-of-destruction-hell":
        "Cinco waves densas numa sala só, que é exatamente o formato que a Nova quer. O Static Field lida com o próprio Baal.",
      "chaos-sanctuary-hell":
        "Densa e de nível alto. O Static Field amolece os bosses dos Seals que a Nova não consegue explodir.",
      "pit-hell": "Nível de área 85 e curta. Boa, ainda que a densidade seja menor do que a build gostaria.",
      "travincal-hell":
        "O Council é imune a raio, então esta é uma zona só com Infinity — e com ele é muito rápida, porque eles ficam amontoados.",
    },
    levelingPath: {
      summary:
        "Evolui como ela mesma. Charged Bolt desde o nível 1 e Static Field desde o 6 são as duas sinergias, a Nova chega no 12, e o Teleport no 18 dá a mobilidade sobre a qual a build é construída. A Lightning Mastery no 30 é quando o dano começa a compor. **Nenhum respec é necessário** — mas tenha clareza de que a build que você está evoluindo não é a build dos níveis finais desta página, que é definida por um item e não por uma skill.",
    },
    selfFoundNotes:
      "Realisticamente, não. A build pronta é um Infinity, que são duas runas Ber entre quatro, e não existe versão do endgame que funcione sem a Conviction. O que *é* self-found são os primeiros oitenta níveis: a Nova no 12 com as sinergias de Charged Bolt e Static Field é um personagem genuinamente forte e muito barato, e a híbrida com Hydra a mantém viável no Hell contra imunes a raio. Trate esta página como destino. As páginas de Frozen Orb e Fire Ball Meteor descrevem builds que chegam ao próprio teto sem uma única runa alta.",
    hardcoreNotes:
      "A Sorceress mais perigosa do site, e os motivos são estruturais e não corrigíveis. Você luta do centro do grupo por desenho; empunhar o Infinity significa **nenhum escudo**, então sem bloqueio e sem resistência daquele slot; e a reserva de vida da Sorceress é a menor do jogo. Se você pegar o Energy Shield, **mana burn vira letal** em vez de irritante. No Hardcore, a recomendação honesta é colocar o Infinity no mercenário e manter um escudo Spirit — você perde o Insight e paga a mana de outro jeito, e mantém um slot defensivo. Chains of Honor em vez de Enigma, Battle Orders sempre, e 60% de Faster Hit Recovery como requisito duro.",
    gearSets: {
      starter: {
        goal: "Charged Bolt até o 12, Nova dali em diante. Barato e genuinamente eficaz.",
        nextUpgrade: "Nível 30 e a Lightning Mastery. A Nova fica estagnada até lá, e isso é esperado.",
        notes:
          "O Charged Bolt é sinergia, então os pontos de evolução não são desperdiçados. O Static Field a partir do nível 6 é ao mesmo tempo sinergia e a sua resposta contra qualquer coisa com vida demais.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de Faster Cast Rate no nível 25.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "25% de Faster Cast Rate e 25% de Faster Hit Recovery no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills." },
          "gloves-0": { why: "20% de Faster Cast Rate no nível 23." },
        },
      },
      nightmare: {
        goal: "Lightning Mastery ativa, dois Spirits, resistências subindo.",
        nextUpgrade:
          "Decida sobre o Energy Shield antes do Hell, porque isso muda que equipamento você quer.",
        picks: {
          "weapon-0": { why: "Ainda o melhor custo-benefício disponível." },
          "offhand-0": {
            why: "Um segundo Spirit — +4 skills e 70% de velocidade entre os dois.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "offhand-0-alt0": {
            why: "+1 skills e 20% de velocidade, mais mana por morte, que aqui é genuinamente útil.",
          },
          "body-0": { why: "+1 skills, 30% de velocidade e até +35 em todas as resistências." },
          "helm-0": { why: "+1 skills e magic find." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": {
            why: "Resistências e dano convertido em mana — a segunda metade importa se você vai de Energy Shield.",
          },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "O caminho mais barato até 75% antes do Hell." },
        ],
      },
      "early-hell": {
        goal: "105% de velocidade, 60% de recuperação, resistências capadas — e um plano para imunes a raio.",
        nextUpgrade:
          "Infinity. Até lá esta build limpa muito rápido tudo que não é imune a raio, e é impotente contra o que é.",
        notes:
          "A variante híbrida com Hydra existe justamente para este nível — uma fonte de dano de fogo cobre os imunes a raio enquanto você junta para o Infinity.",
        picks: {
          "weapon-0": { why: "35% de velocidade e +2 skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências — a escolha melhor numa build que fica no meio das coisas.",
          },
          "helm-0": {
            why: "+2 skills, vida, magic find e 10% de redução de dano. A vida e a redução de dano são o que você está comprando.",
          },
          "amulet-0": { why: "+2 em todas as skills e +20-30 em todas as resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate, resistências e vida",
            why: "Velocidade mais os dois atributos de que esta build sempre está carente.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": {
            why: "Faster Hit Recovery e Vitality — os dois valem mais para esta build que magic find nesta fase.",
          },
        },
        charms: [
          {
            label: "Small charms de resistência e vida",
            why: "Segure 75%, e prefira vida a dano onde puder.",
          },
        ],
      },
      budget: {
        goal: "Infinity nas suas próprias mãos, e o mercenário liberado para o Insight.",
        nextUpgrade:
          "Griffon's Eye e facets de raio — a pilha de resistência do inimigo que soma com a Conviction.",
        picks: {
          "weapon-0": {
            why: "**Empunhado por você.** A aura de Conviction dele quebra imunidade a raio e funciona igual nas suas mãos ou nas do mercenário — mas usar você mesma libera ele para carregar o Insight, que é de onde vem a sua mana.",
            sockets:
              "Ber, Mal, Ber, Ist numa polearm ou spear de 4 sockets. Confira o requisito de Strength da base antes de gastar pontos de atributo.",
          },
          "weapon-0-alt0": {
            why: "Enquanto o Infinity não existir, um Spirit mais a híbrida com Hydra é a resposta honesta de transição.",
          },
          "offhand-0": {
            label: "Nenhum — o Infinity é de duas mãos",
            why: "Empunhar o Infinity te custa o slot de escudo inteiro, o que é uma troca real: sem Spirit, sem bloqueio, sem resistência daquele slot. A Conviction compensa, mas planeje as resistências em outro lugar.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências. Sem escudo, é aqui que as suas resistências moram.",
          },
          "helm-0": { why: "+2 skills, vida e redução de dano." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": {
            why: "+1 em todas as skills, 20% de velocidade e mana máxima aumentada — a última importa se você pegou Energy Shield.",
          },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills e mana máxima aumentada." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "Com o slot de escudo perdido, cada slot restante carrega resistência.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Faster Hit Recovery e Vitality." },
        },
        charms: [
          {
            label: "Hellfire Torch (Sorceress)",
            why: "+3 skills de Sorceress e +10-20 em todas as resistências, de que você precisa mais que o normal.",
          },
          { label: "Annihilus", why: "+1 em todas as skills e resistências." },
          {
            label: "Small charms de vida e resistência",
            why: "Sem escudo, os charms carregam mais peso aqui que em qualquer outra Sorceress.",
          },
        ],
        weaponSwap: [
          {
            why: "Battle Orders. Numa build sem escudo parada no meio dos grupos, isto não é opcional.",
          },
          { why: "Mão secundária para a troca." },
        ],
      },
      optimized: {
        goal: "Conviction, Griffon's e facets empurrando a resistência do inimigo para o chão.",
        nextUpgrade: "Facets de raio em todo socket, e um roll melhor de Griffon's.",
        picks: {
          "weapon-0": {
            why: "Conviction, empunhado por você. O mercenário carrega o Insight.",
            lookFor: ["-55% de resistência a raio do inimigo", "base de polearm com requisito baixo"],
          },
          "helm-0": {
            why: "**-15-20% de resistência a raio do inimigo** em cima da redução da Conviction, mais +10-15% de dano de skills de raio e 25% de velocidade.",
            lookFor: ["-20% de resistência a raio do inimigo", "+15% de dano de skills de raio", "1 socket"],
          },
          "helm-0-alt0": {
            why: "Mantenha o Shako se você está morrendo em vez de matando devagar. Vida e redução de dano acima de dano.",
          },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "body-0-alt0": {
            why: "Teleport com custo de mana fixo e Strength por nível — a Strength é o que torna uma base de Infinity mais pesada acessível.",
          },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de velocidade, mana máxima." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills, mana máxima." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida",
            why: "Ainda carregando resistência, porque o slot de escudo se foi de vez.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": {
            why: "Magic find, quando a sobrevivência estiver resolvida. Sandstorm Trek se não estiver.",
          },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Grand charms de skills de raio com vida",
            why: "Dano e a vida de que esta build está sempre carente.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Esta é a build de maior teto que o site documenta, e ela merece isso com um Infinity, um Griffon's Eye e um Enigma. A página da Frozen Orb alcança quase todo o próprio teto pelo preço de oito runas da Countess. As duas afirmações são verdadeiras, e a diferença entre elas é o motivo honesto para escolher uma.",
        picks: {
          "weapon-0": {
            why: "Um roll de -55% de resistência a raio do inimigo na polearm de 4 sockets mais leve que você achar.",
            lookFor: ["-55% de resistência a raio do inimigo", "base de Strength baixa"],
          },
          "helm-0": {
            why: "Um roll de -20% e +15% com um facet de raio encaixado.",
            lookFor: ["-20% de resistência a raio do inimigo", "+15% de dano de skills de raio"],
          },
          "body-0": { why: "Teleport, Strength para a base do Infinity, e magic find por nível." },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "belt-0": { why: "+1 skills, 20% de velocidade, mana máxima." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida, mana",
            why: "O último slot a aperfeiçoar, e ele ainda está carregando resistência.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida e mana"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Grand charms de skills de raio com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "enchant-sorceress": {
    summary:
      "Uma Sorceress cujo dano vem de uma crossbow. Bolts perfurantes carregando dano de fogo, e um buff que a party inteira quer.",
    playstyle:
      "Lance Enchant em si mesma e segure o botão de ataque. Cada bolt carrega o dano de fogo que o buff somou, e os 66% de Piercing Attack do Demon Machine mandam a maioria deles direto através do primeiro alvo para o que estiver atrás. A Chu-Ko-Nu é a crossbow mais rápida do jogo, então isso vira um fluxo em vez de uma sequência de tiros. Você é uma atacante física à distância que por acaso é Sorceress — o que significa que Attack Rating importa, Increased Attack Speed importa, e Faster Cast Rate só importa para o Teleport.",
    strengths: [
      "Dois tipos de dano em cada bolt — físico da arma, fogo do buff",
      "Perfuração faz um tiro acertar uma fileira de inimigos, o que é enorme em áreas densas",
      "**Uma build de suporte de verdade.** O Enchant pode ser lançado em outros jogadores e no seu mercenário, e dura minutos",
      "Teleport mais um ataque à distância é uma combinação que quase nada mais no jogo tem",
      "Dano físico faz da imunidade a fogo apenas metade de um problema",
    ],
    weaknesses: [
      "**95 de Dexterity e 80 de Strength** para a crossbow, que é muito ponto de atributo para uma caster",
      "A crossbow é de duas mãos, então **não há escudo** — sem Spirit, sem bloqueio, sem resistência daquele slot",
      "Precisa de Attack Rating, com o que nenhuma outra build de Sorceress se importa",
      "Increased Attack Speed importa e este site não publica tabela de IAS — veja os pontos flexíveis",
      "O Demon Machine é a build. Sem ele, isto é um personagem diferente e bem pior",
    ],
    flexPoints: [
      "**Os pontos restantes vão para o Fire Ball**, que te dá uma magia de verdade para os momentos em que um ataque à distância é a ferramenta errada, ou para mais Frozen Armor pela sobrevivência de que você precisa muito sem escudo.",
      "**Variante Max Enchant:** todo ponto restante em Enchant e na sinergia dele, equipamento escolhido inteiramente por +skills. O buff que você lança na party também melhora, e é o motivo de fazer isso em grupo.",
      "**Variante de magic find:** a build limpa rápido o bastante para que trocar dano por magic find custe menos que em outros lugares. Mesmo plano de skills; War Traveler, Harlequin Crest e charms de magic find.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint neste site**, pelo mesmo motivo das páginas de Paladin de corpo a corpo — os limiares dependem de velocidade de arma e de dados de animação que nenhuma fonte que consideramos confiável publica. O próprio modificador de velocidade −60 da Chu-Ko-Nu faz a maior parte do trabalho aqui; Highlord's Wrath e luvas craftadas fornecem o resto.",
    ],
    statPlan: {
      strength: "**80**, para o Demon Machine. Nem um ponto a mais, a menos que a sua armadura peça.",
      dexterity:
        "**95**, para o Demon Machine — e esta é a maior diferença entre esta build e toda outra Sorceress do site. O +15-20 de Dexterity do Raven Frost cobre parte disso, o que vale planejar antes de gastar os pontos.",
      vitality: "Todo o resto depois de os dois requisitos acima estarem atendidos.",
      energy: "Nenhum. O Warmth é maximizado como sinergia, o que já resolve a mana.",
      notes: [
        "**Confira o que o seu equipamento fornece antes de gastar Dexterity.** Um Raven Frost rola +15-20, e são 15-20 pontos que você não precisa comprar.",
        "**Attack Rating importa aqui e em nenhum outro lugar desta classe.** Os +632 do Demon Machine cobrem a maior parte; Raven Frost e Highlord's Wrath cobrem o resto. Se você está errando, é Attack Rating e não dano.",
        "Não há decisão de bloqueio, porque não há escudo. Isso simplifica o plano e também é a principal fraqueza defensiva da build.",
      ],
    },
    breakpointWhy: {
      "fhr-60":
        "**Obrigatório, não recomendado.** Você não tem escudo nem bloqueio, então a recuperação é a única coisa entre uma interrupção e uma morte.",
      "fcr-63":
        "Só o Teleport usa — o seu dano é um ataque, não uma conjuração. 63% basta para se reposicionar com conforto e há pouco motivo para comprar mais.",
    },
    skillNotes: {
      enchant:
        "Nível 18. Adiciona dano de fogo aos seus ataques e **33% a mais quando a arma é de longo alcance** — o parâmetro que faz esta build existir. Dura minutos, e pode ser lançado em aliados.",
      "fire-mastery":
        "30% de dano no nível 1 e +7% por nível, aplicado à metade de fogo de cada bolt. Ela aumenta o seu dano; não quebra imunidade a fogo.",
      warmth:
        "Sinergia do Enchant além de pré-requisito, e resolve a sua mana ao mesmo tempo. Não há motivo para segurar pontos aqui.",
      "fire-ball": "**O Enchant exige Fire Ball e Warmth.** Um ponto, e você nunca vai conjurar.",
      teleport:
        "**Um ponto para sempre.** Teleport mais uma arma de longo alcance é a maior parte do motivo de esta build ser boa.",
      "static-field":
        "Tira 25% da vida atual do alvo — a sua resposta contra bosses que ignoram bolts.",
      "frozen-armor":
        "Defesa e chance de congelar o que fechar a distância. Você não tem escudo, então pegue.",
      "frost-nova":
        "Um botão de pânico à queima-roupa para quando algo te alcançar, o que numa build sem escudo é quando você está em apuros.",
      "fire-bolt": "Pré-requisito do Fire Ball.",
    },
    immunityPlan:
      "Dois tipos de dano em cada bolt fazem desta a build de fogo menos incomodada por imunidade do site. **Imunes a fogo ainda tomam a metade física**, que é substancial depois que o Fortitude entra — então onde uma Fire Ball Meteor Sorceress para de vez, esta build simplesmente fica mais lenta. **Imunes a físico ainda tomam a metade de fogo**, pelo mesmo motivo ao contrário. Só algo imune aos dois é parede de verdade, e há pouco disso. **A Fire Mastery não quebra imunidade a fogo** — é multiplicador de dano de 30% mais 7% por nível. Se a metade de fogo é o que você precisa de volta, um sunder charm **Flame Rift** resolve ao custo de 70 a 90 pontos da sua própria resistência a fogo, o que numa build sem escudo é um preço mais pesado que o normal. A recomendação honesta costuma ser aceitar a morte mais lenta e manter a resistência.",
    mercenaryNotes:
      "**Lance Enchant nele.** É o mesmo buff, dura minutos, e transforma um mercenário do Ato 2 numa segunda fonte de dano de verdade — é por isso que a build carrega a etiqueta de suporte. Pegue **Might** pelo dano físico que o Enchant então multiplica, dê um **Insight** se a sua mana ainda precisar de ajuda depois de maximizar o Warmth, e um **Vampire Gaze** ou **Treachery** para mantê-lo de pé. Ele importa mais aqui que em qualquer outra build de Sorceress, porque você não tem escudo e quer outra coisa para os monstros olharem.",
    farmingWhy: {
      "secret-cow-level-hell":
        "Bolts perfurantes numa fileira de vacas é a melhor expressão desta build. Nada lá é imune a fogo e a densidade é enorme.",
      "stony-tomb-hell":
        "Nível de área 85, perto de um waypoint, leve em imunidade a fogo, e os corredores alinham os alvos para a perfuração.",
      "pit-hell":
        "Nível de área 85 e curta. As salas abertas combinam com uma atacante à distância com Teleport.",
      "mausoleum-hell": "Nível de área 85 densa com corredores, que é o que a perfuração quer.",
      "ancient-tunnels-hell":
        "Nível de área 85 e rápida de limpar. Fogo está entre as imunidades registradas dela, e a metade física da arma encantada dá conta disso — o motivo de esta build carregar dois tipos de dano.",
      "chaos-sanctuary-hell":
        "Densa e de nível alto, mas boa parte resiste a fogo e o Iron Maiden dos Oblivion Knights reflete a metade física do seu dano. Possível, não confortável.",
    },
    levelingPath: {
      summary:
        "Evolua como Fire Ball Sorceress. Fire Bolt e Fire Ball são os dois pré-requisitos no caminho do Enchant, então nada é desperdiçado, e o Warmth é uma sinergia que você maximizaria de qualquer jeito. O Enchant chega no 18, mas faz muito pouco até você ter uma arma que valha encantar — **a transição real é o Demon Machine no nível 49**, não um nível de skill. Planeje os 80 de Strength e os 95 de Dexterity antes de chegar lá, e confira primeiro o que os seus anéis conseguem fornecer.",
      respecAt: "Opcional, quando o Demon Machine aparecer",
    },
    selfFoundNotes:
      "Mais alcançável do que parece. O Demon Machine cai a partir de nível de área 57 e é raramente negociado porque só uma build o quer — então ele é um dos poucos itens que definem uma build que você tem mais chance de achar do que de comprar. Todo o resto é comum: Skin of the Vipermagi, Harlequin Crest, Raven Frost e Magefist caem no Hell. O Fortitude é a única peça cara e a build funciona sem ele. O obstáculo genuíno é que você precisa da crossbow antes de a build existir, e não há versão parcial.",
    hardcoreNotes:
      "Arriscada de um jeito específico e estrutural: **a crossbow é de duas mãos, então você não tem escudo nenhum.** Sem bloqueio, sem Spirit, e sem resistência daquele slot, numa classe com a menor reserva de vida do jogo. Todo o resto da build é seguro — você luta à distância e tem Teleport — mas quando algo te alcança não há nada entre isso e você. Pegue Chains of Honor em vez de Fortitude, Crown of Ages em vez de Harlequin Crest, trate os 60% de Faster Hit Recovery como piso duro, e mantenha o Frost Nova numa tecla. Note também o risco de **Iron Maiden** no Chaos Sanctuary: o seu dano físico reflete.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 18 pelo Enchant, e ao 49 pelo Demon Machine. Você é uma Fire Ball Sorceress até lá.",
        nextUpgrade:
          "Demon Machine no nível 49, e os 80 de Strength e 95 de Dexterity para segurá-lo. Planeje esses pontos antes de precisar deles.",
        notes:
          "Evolua como Fire Ball Sorceress — Fire Bolt e Fire Ball estão no caminho do Enchant de qualquer forma. A transição acontece quando a crossbow aparece, não num nível específico.",
        picks: {
          "weapon-0": {
            why: "+2 skills e velocidade de conjuração enquanto você evolui como caster. Você vai trocar por uma crossbow, então não invista demais.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": {
            why: "Resistências enquanto você ainda tem slot de escudo. Aproveite — a crossbow tira isso de você.",
          },
          "body-0": { why: "Faster Hit Recovery e velocidade de corrida por duas runas comuns." },
          "helm-0": { why: "+1 em Todas as Skills." },
        },
      },
      nightmare: {
        goal: "Demon Machine em mãos e o Enchant fazendo o dano.",
        nextUpgrade: "Fire Mastery no 30, e depois resistências em 75% antes do Hell.",
        picks: {
          "weapon-0": {
            why: "**A build.** 66% de Piercing Attack na crossbow mais rápida do jogo, então cada bolt carrega o dano de fogo do Enchant por uma fileira de inimigos.",
            lookFor: ["Qualquer roll serve"],
          },
          "body-0": {
            why: "+1 skills e até +35 em todas as resistências com 43 de Strength. Sem escudo, resistência precisa vir de algum lugar.",
          },
          "helm-0": { why: "+1 skills e magic find enquanto você farma." },
          "gloves-0": {
            why: "**+1 em Fire Skills**, que sobe o Enchant diretamente. A velocidade de conjuração aqui é acessória.",
          },
          "ring1-0": {
            why: "Cannot Be Frozen, **+15-20 de Dexterity para o requisito da crossbow**, e +150-250 de Attack Rating. Três coisas de que esta build precisa especificamente, num anel só.",
          },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [
          {
            label: "Small charms de resistência e vida",
            why: "Sem escudo, os charms carregam mais da sua resistência que o normal.",
          },
        ],
      },
      "early-hell": {
        goal: "Fire Mastery maximizada, resistências capadas, Attack Rating suficiente.",
        nextUpgrade: "Fortitude, que multiplica a metade física de cada bolt.",
        picks: {
          "weapon-0": { why: "Inalterado. Nada substitui." },
          "body-0": { why: "Resistências, barato." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências. Numa build sem escudo, isso vale mais que o normal.",
          },
          "helm-0": {
            why: "+2 skills, vida, magic find e 10% de redução de dano. A vida e a redução são o que você está comprando.",
          },
          "gloves-0": { why: "+1 em Fire Skills." },
          "amulet-0": {
            why: "+1 em todas as skills, **20% de Increased Attack Speed** e Deadly Strike que escala com o nível. Todas as linhas dele funcionam nesta build, o que é incomum para um item de Sorceress.",
          },
          "ring1-0": { why: "Cannot Be Frozen, Dexterity e Attack Rating." },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds — uma build de ataque físico usa os três, o que nenhuma outra Sorceress pode dizer.",
          },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "Segure 75% sem um escudo para ajudar." },
          {
            label: "Flame Rift (Sunder Charm de fogo)",
            why: "Só se a metade de fogo for o que está falhando. O seu dano físico ainda acerta imunes a fogo, então isto importa menos aqui que numa build de fogo pura.",
          },
        ],
      },
      budget: {
        goal: "As duas metades do dano escalando juntas.",
        nextUpgrade:
          "+skills onde você achar. Cada ponto sobe o Enchant, e o Enchant está em cada bolt.",
        picks: {
          "weapon-0": { why: "Ainda a build." },
          "body-0": {
            why: "**+300% de Enhanced Damage**, aplicado à metade física de cada bolt. É o maior upgrade de dano que a build faz, e nenhuma outra Sorceress do site quer isso.",
            sockets: "El, Sol, Dol, Lo numa armadura de 4 sockets.",
          },
          "body-0-alt0": {
            why: "Troque o dano por +2 skills e +65 em todas as resistências. Numa build sem escudo, essa é uma escolha defensável e não uma escolha menor.",
          },
          "helm-0": { why: "+2 skills, vida, magic find, redução de dano." },
          "gloves-0": {
            label: "Luvas craftadas ou raras com 20% de Increased Attack Speed",
            why: "Velocidade de ataque é escassa nesta build e este é um dos poucos slots que fornece.",
            lookFor: ["20% de Increased Attack Speed", "+2 Fire Skills (craftada)", "Resistências"],
          },
          "belt-0": { why: "+1 em todas as skills, o que sobe o Enchant." },
          "amulet-0": { why: "+1 skills, 20% de velocidade de ataque, Deadly Strike." },
          "ring1-0": { why: "Cannot Be Frozen, mais Dexterity e Attack Rating." },
          "ring2-0": {
            why: "+1 em todas as skills, ou um anel raro com Attack Rating e resistências se você estiver errando tiros.",
          },
          "boots-0": {
            why: "Magic find e +Strength, o que compensa parte do requisito da crossbow.",
          },
        },
        charms: [
          {
            label: "Hellfire Torch (Sorceress)",
            why: "+3 skills de Sorceress, o que sobe o Enchant três níveis.",
          },
          { label: "Annihilus", why: "+1 em todas as skills e resistências." },
          {
            label: "Grand charms de skills de fogo com vida",
            why: "Dano e a vida de que uma build sem escudo precisa.",
          },
        ],
        weaponSwap: [
          {
            why: "Battle Orders. Sem escudo e com reserva de vida de Sorceress, isto não é opcional.",
          },
          { why: "Mão secundária para a troca — o único momento em que você recupera um slot de escudo." },
        ],
      },
      optimized: {
        goal: "Enchant máximo, e uma build que limpa o cow level numa passada.",
        nextUpgrade: "Facets de fogo, e uma decisão entre o dano do Fortitude e a mobilidade do Enigma.",
        picks: {
          "weapon-0": { why: "Inalterado, permanentemente." },
          "body-0": { why: "+300% de Enhanced Damage na metade física." },
          "body-0-alt0": {
            why: "Teleport com custo de mana fixo, +Strength por nível cobrindo o requisito da crossbow, e magic find. Uma alternativa real se mobilidade for o que te limita.",
          },
          "helm-0": {
            why: "+2 skills e a sobrevivência de que uma build sem escudo está carente. Encaixe um facet de fogo.",
            lookFor: ["2 sockets"],
          },
          "helm-0-alt0": {
            why: "Mais resistências e redução de dano, menos skills. A escolha de Hardcore.",
          },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, +2 Fire Skills",
            why: "O único slot que dá velocidade de ataque e skills de fogo juntos.",
            lookFor: ["20% de Increased Attack Speed", "+2 Fire Skills", "Resistências"],
          },
          "belt-0": { why: "+1 em todas as skills." },
          "amulet-0": {
            why: "+2 em todas as skills e +30 em todas as resistências — as resistências importam mais depois que a sua velocidade de ataque estiver resolvida.",
          },
          "ring1-0": { why: "Cannot Be Frozen, Dexterity e Attack Rating num anel só." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find e Strength." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "Dano e vida." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Vale dizer uma vez no topo: tudo nesta lista foi escolhido por +skills, velocidade de ataque ou Attack Rating, e quase nada disso é o que uma lista de Sorceress normalmente contém. Esse é o resumo honesto da build — é um personagem físico à distância vestindo a árvore de skills de uma Sorceress.",
        picks: {
          "weapon-0": {
            why: "Encaixe facets de fogo — ele aceita até cinco.",
            lookFor: ["Sockets para facets de fogo"],
          },
          "body-0": { why: "+300% de Enhanced Damage e +200 de defesa." },
          "helm-0": {
            why: "+2 skills com um facet de fogo encaixado.",
            lookFor: ["2 sockets"],
          },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, +3 Fire Skills",
            why: "O melhor roll possível no slot que mais importa para velocidade.",
            lookFor: ["20% de Increased Attack Speed", "+3 Fire Skills", "Duas resistências"],
          },
          "belt-0": { why: "+1 em todas as skills." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen, 20 de Dexterity, 250 de Attack Rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find e Strength." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Grand charms de skills de fogo com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "hydra-sorceress": {
    summary:
      "Torres de fogo que você posiciona e abandona. A Sorceress que mata coisas sem estar na sala.",
    playstyle:
      "Posicione hydras onde algo vai estar, e saia. Elas atiram sozinhas pela duração inteira, o que significa que você pode empilhar vários conjuntos num boss e teleportar para fora enquanto elas trabalham. Contra grupos isto é mais lento que qualquer outra Sorceress — as hydras precisam adquirir alvos — mas contra uma reserva de vida grande e única é um dos padrões de dano mais seguros do jogo, porque você nunca é a coisa que está sendo atacada.",
    strengths: [
      "Dano que continua depois de você ter saído. Nada mais no site faz isso",
      "Genuinamente segura contra bosses: você posiciona, sai, eles morrem",
      "Barata de equipar e fácil de alcançar o alvo de 105% de velocidade de conjuração",
      "Excelente para farmar chaves, onde os alvos são super uniques isolados",
      "Posicionar e esquecer combina com Hardcore melhor que qualquer outro padrão de Sorceress",
    ],
    weaknesses: [
      "**Ruim contra densidade.** As hydras adquirem alvos devagar e não te seguem",
      "Nada antes do nível 30 — a espera é nível de personagem, não uma cadeia",
      "Imunidade a fogo é a mais comum no Hell e a Fire Mastery não a quebra",
      "O teto de 18 hydras e a duração fixa de 250 frames significam que há um limite de quanto dá para empilhar",
      "As duas fontes ranqueadas a colocam no meio da tabela, e o motivo é velocidade de limpeza",
    ],
    flexPoints: [
      "**A divisão inicial.** A variante Starter do Maxroll coloca pontos iniciais numa skill de frio ou raio para você ter algo que funcione contra imunes a fogo, e depois faz respec completo para fogo quando um Sunder Charm ou Infinity existir. É isso que o inventário chamava de 'Hydra/Frozen Orb' — é uma variante de evolução desta build, não uma build separada.",
      "**Fire Ball contra utilidade.** Maximizar Fire Ball te dá uma magia de limpeza de verdade e transforma a build em algo mais próximo de uma Fire Ball Meteor Sorceress com torres. Deixar em um ponto e gastar em outro lugar mantém a identidade da build mas deixa densidade genuinamente lenta. As duas são defensáveis; escolha pelo que você farma, bosses ou zonas.",
      "**Variante de magic find:** a build é segura o bastante para que trocar dano por magic find custe tempo e não mortes. Mesmo plano de skills.",
      "**Não coloque pontos em Energy.** Warmth mais um mercenário com Insight cobrem o custo de posicionar hydras.",
    ],
    statPlan: {
      strength: "Só o que o seu equipamento exigir.",
      dexterity: "Nenhuma. Teleport e distância são a defesa.",
      vitality: "Todo o resto.",
      energy: "Nenhum.",
      notes: [
        "Esta build toma menos dano que qualquer outra Sorceress do site, porque as hydras são o que os monstros estão atacando. Vitality ainda importa, mas importa menos aqui que em qualquer outro lugar.",
        "Posicionar três ou quatro hydras em sequência tem um custo de mana real. Warmth e um mercenário com Insight são a resposta, não Energy.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "O alvo padrão da Sorceress, e ele importa duas vezes aqui — é a velocidade com que você posiciona hydras e a velocidade com que teleporta para longe depois.",
      "fcr-63": "O alvo inicial. Dois Spirits passam com conforto.",
      "fhr-60":
        "Menos crítico que em outras builds de Sorceress, porque normalmente você não é o alvo — mas ainda é o que te salva quando uma hydra puxa algo para cima de você.",
    },
    skillNotes: {
      hydra:
        "Nível 30. A duração é fixa em 250 frames independentemente do que você gastar — pontos compram dano, não permanência. Dezoito é o teto; a mais antiga some depois disso.",
      "fire-mastery":
        "30% de dano no nível 1 e +7% por nível. Multiplicador de dano, não redução de resistência.",
      "fire-bolt":
        "A sinergia de dano da Hydra, e o seu dano nos primeiros onze níveis. Nada aqui é desperdiçado.",
      "fire-ball": "Fazendo dois trabalhos: **+3% de dano do Hydra por nível**, e pré-requisito do Enchant, que é o que o Hydra realmente precisa.",
      warmth: "Regeneração de mana, e o outro pré-requisito do Enchant.",
      teleport: "**Um ponto para sempre**, e é como você sai depois de posicionar.",
      "static-field":
        "Tira 25% da vida atual do alvo — combina bem com uma build que já é paciente com bosses.",
      "frozen-armor": "Defesa e congelamento em quem te ataca.",
      "frost-nova": "Um botão de pânico para qualquer coisa que se aproxime enquanto as hydras trabalham.",
      "enchant": "**O pré-requisito do Hydra é o Enchant** — não Fire Wall nem Meteor. Um ponto abre a build inteira.",
    },
    immunityPlan:
      "Fogo é o elemento mais resistido do Hell e **a Fire Mastery não quebra imunidade** — ela dá 30% de dano no nível 1 mais 7% por nível. Como esta build não tem nenhum segundo tipo de dano, a resposta precisa vir de fora dela. **Um sunder charm Flame Rift** é a solução direta e é a que o próprio guia do Maxroll considera, ao custo de 70 a 90 pontos da sua própria resistência a fogo. **Infinity no mercenário** faz o mesmo sem a penalidade e por um preço muito maior. **A divisão inicial** — manter pontos iniciais numa skill de frio ou raio até um dos dois existir — é a resposta de graça durante a evolução, e é o que o item 'Hydra/Frozen Orb' do inventário de fato descreve. Escolher alvos também funciona melhor aqui que na maioria das builds: os bosses de chave e o Mephisto, que é onde esta build quer estar de qualquer forma, não são imunes a fogo.",
    mercenaryNotes:
      "**Ele importa mais aqui que na maioria das builds de Sorceress**, porque as hydras demoram a adquirir alvos e alguém precisa segurar a frente. Pegue **Might** pelo dano ou **Holy Freeze** para desacelerar o que as hydras estão atirando, dê um **Insight** pela mana que posicionar várias hydras custa, e um **Treachery** mais **Vampire Gaze** para mantê-lo vivo. Depois, um **Infinity** nele é a alternativa a carregar um Flame Rift.",
    farmingWhy: {
      "countess-hell":
        "Um super unique único no fim de um trajeto curto — exatamente para o que torres servem. Runas por cima.",
      "pindleskin-hell":
        "Um alvo, monstro nível 86, a dez segundos de um portal. Posicione, recue, colete.",
      "mephisto-hell":
        "Ele não é imune a fogo, e o truque do fosso faz as hydras trabalharem enquanto nada consegue te alcançar.",
      "andariel-hell": "Curta, perto de um waypoint, e um alvo único.",
      "nihlathak-hell":
        "Um boss de chave, e torres lidam com ele de fora do alcance do que o torna perigoso.",
      "stony-tomb-hell":
        "Nível de área 85 e leve em imunidade a fogo, ainda que a densidade combine menos com esta build que com uma de projétil.",
    },
    levelingPath: {
      summary:
        "A Hydra é uma skill de nível 30 atrás de uma cadeia incomumente longa: Fire Bolt até Fire Ball até Meteor, e Fire Bolt até Inferno até Fire Wall, antes de a Hydra abrir. A boa notícia é que o Fire Bolt também é a sinergia de dano da Hydra, então os pontos de evolução rendem duas vezes. Evolua como Fire Ball Sorceress e a transição não custa nada — **nenhum respec é necessário**, a menos que você tenha feito a divisão inicial de frio ou raio, e nesse caso o token grátis da Den of Evil cobre.",
      respecAt: "Só se você fez a divisão inicial de frio ou raio",
    },
    selfFoundNotes:
      "Muito amigável a self-found e melhor nisso do que o tier sugere. Ela não precisa de nenhum item caro para funcionar, mata os alvos únicos que mais dropam, e a lista inteira de equipamento abaixo do endgame é runeword da Countess e uniques comuns. Imunidade a fogo é a única coisa que self-found não resolve com facilidade — um Flame Rift é alvo realista, um Infinity não é — e a resposta enquanto isso é farmar os bosses que não são imunes.",
    hardcoreNotes:
      "Possivelmente a build de Sorceress mais segura do jogo. Você posiciona hydras e sai; os monstros atacam torres, não você; e contra um boss você nunca está na sala quando ele morre. A fraqueza da build — velocidade de limpeza baixa — custa tempo e não vidas. As ressalvas habituais da classe seguem valendo: a menor reserva de vida, sem bloqueio, e 60% de Faster Hit Recovery para os momentos em que algo passa por uma hydra e te encontra.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30 pela cadeia de Fire Wall e Meteor.",
        nextUpgrade: "Nível 30 pela Hydra e pela Fire Mastery juntas.",
        notes:
          "O Fire Bolt te carrega até o 12 e é a sinergia da Hydra, então nada cedo é desperdiçado. O Fire Ball a partir do 12 cobre o intervalo até o 30.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de velocidade no nível 25.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "Velocidade de conjuração e recuperação no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills." },
          "gloves-0": { why: "+1 em Fire Skills e 20% de velocidade." },
        },
      },
      nightmare: {
        goal: "Hydras posicionadas, Mephisto e os bosses de chave no farm.",
        nextUpgrade:
          "Resistências em 75%, um Insight para o mercenário, e um plano para imunes a fogo.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": {
            why: "Um segundo Spirit — 70% de velocidade entre os dois.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "body-0": { why: "+1 skills, velocidade e resistências com 43 de Strength." },
          "helm-0": { why: "+1 skills e magic find." },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "O caminho mais barato até 75%." }],
      },
      "early-hell": {
        goal: "105% de velocidade de conjuração e uma resposta para imunidade a fogo.",
        nextUpgrade:
          "Death's Fathom é o elemento errado — o Eschuta's Temper é a arma de dano desta build.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração." },
          "helm-0": { why: "+2 skills, vida, magic find e redução de dano." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A última velocidade de que você precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "Segure 75%." },
          {
            label: "Flame Rift (Sunder Charm de fogo)",
            why: "A resposta direta para imunidade a fogo, e a que o próprio guia do Maxroll considera. Custa 70 a 90 pontos da sua própria resistência a fogo.",
          },
        ],
      },
      budget: {
        goal: "Farm rápido de chaves e mortes de boss.",
        nextUpgrade: "Facets de fogo em todo socket que você tiver.",
        picks: {
          "weapon-0": {
            why: "Até +3 skills de Sorceress, 40% de velocidade e +20% de dano de skills de fogo. A arma de dano da build.",
          },
          "weapon-0-alt0": {
            why: "Mantenha o Spirit enquanto resistência for a restrição — o Eschuta's não tem nenhuma.",
          },
          "offhand-0": { why: "Velocidade de conjuração e skills." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "helm-0": { why: "+2 skills e magic find." },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills e 20% de velocidade." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "Passa do alvo de 105.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Flame Rift (Sunder Charm de fogo)", why: "Leve onde a zona exigir." },
        ],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      optimized: {
        goal: "Dano de fogo máximo em torres que não erram.",
        nextUpgrade: "Sobra muito pouco. Esta build alcança o próprio teto cedo e barato.",
        picks: {
          "weapon-0": {
            why: "+3 skills e +20% de dano de skills de fogo, com facets de fogo encaixados.",
            lookFor: ["+3 skills de Sorceress", "+20% de dano de skills de fogo", "3 sockets"],
          },
          "offhand-0": { why: "Velocidade de conjuração e skills." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "body-0-alt0": { why: "Teleport com custo de mana fixo e magic find por nível." },
          "helm-0": { why: "+2 skills, com um facet de fogo encaixado.", lookFor: ["2 sockets"] },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro ganha.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "Dano e vida." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Esta build termina bem abaixo do topo do mercado, que é o motivo honesto de as duas fontes ranqueadas a colocarem no meio da tabela. Ela nunca vai limpar como uma Nova Sorceress. Ela também nunca vai precisar de um Infinity.",
        picks: {
          "weapon-0": {
            why: "Um roll de +3 skills e +20% de dano de fogo com três facets de fogo.",
            lookFor: ["+3 skills de Sorceress", "+20% de dano de skills de fogo", "3 sockets"],
          },
          "offhand-0": {
            why: "35% de velocidade num Monarch.",
            lookFor: ["35% de Faster Cast Rate"],
          },
          "body-0": { why: "Teleport e magic find por nível." },
          "helm-0": { why: "+2 skills com um facet de fogo.", lookFor: ["2 sockets"] },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida",
            why: "O último slot.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "meteorb-sorceress": {
    summary:
      "Fogo e frio no mesmo personagem, então quase nada é imune aos dois. Nenhuma das metades bate tão forte quanto a de uma especialista.",
    playstyle:
      "Abra com o elemento que o grupo não está resistindo. O Frozen Orb é o botão que você segura — ele viaja, congela, e não precisa de mira; o Meteor é jogado no que está parado, e em qualquer coisa imune a frio. A build nunca é rápida, porque você está alternando em vez de se comprometer, e também nunca é parada. Se você já abandonou uma run porque tudo na sala resistia ao seu único elemento, esta é a build que conserta exatamente essa frustração.",
    strengths: [
      "Dois tipos de dano significam que quase nada no Hell é imune aos dois",
      "O Frozen Orb congela tudo, o que é defesa além de dano",
      "**A Cold Mastery reduz a resistência do inimigo**, então a metade de frio segue funcionando bem dentro do Hell sem equipamento comprado para isso",
      "Genuinamente barata. Ela alcança o próprio teto sem uma única runa alta",
      "A build mais perdoável do site para quem não quer planejar nada em torno de imunidade",
    ],
    weaknesses: [
      "**Nenhuma das metades tem sinergia.** Uma especialista gasta 40 pontos em sinergias; esta build tem cerca de 18 para dividir",
      "As duas skills-chave abrem no nível 30, e a cadeia de frio até o Frozen Orb tem quatro pré-requisitos",
      "Mais lenta que qualquer uma das build-mãe naquilo para que a build-mãe existe",
      "A Fire Mastery aumenta dano em vez de quebrar imunidade, então a metade de fogo ainda encontra paredes",
      "As duas fontes ranqueadas a colocam no meio da tabela, e o motivo é exatamente a troca acima",
    ],
    flexPoints: [
      "**Os pontos restantes são a decisão real da build.** Sobram cerca de dezoito depois das quatro skills maximizadas e dos pré-requisitos, e eles vão para as sinergias da metade que você de fato usa mais. **Ice Bolt e Ice Blast** sobem o Frozen Orb; **Fire Bolt** sobe o Meteor. Dividir igualmente é a única opção claramente pior que as alternativas.",
      "**Prefira frio se você está farmando**, porque a Cold Mastery mantém a metade de frio relevante sem ajuda. Prefira fogo se você encontra imunes a frio especificamente — o Pit e o Worldstone Keep são as zonas que este site registra com eles.",
      "**Variante de magic find:** a build é barata o bastante para o orçamento de equipamento ir para magic find sem custar muito. Mesmo plano de skills.",
      "**Não coloque pontos em Energy.** Warmth e um mercenário com Insight bastam.",
    ],
    statPlan: {
      strength: "Só o que o equipamento pedir, que é muito pouco.",
      dexterity: "Nenhuma.",
      vitality: "Todo o resto.",
      energy: "Nenhum.",
      notes: [
        "Como nas duas builds das quais ela toma emprestado, não há decisão de bloqueio nem requisito de arma — este é um dos planos de atributo mais simples do site.",
        "Uma troca com Call to Arms vale mais que qualquer Vitality que você comprasse com a mesma moeda.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "O alvo padrão da Sorceress. As duas magias desta build usam ele, e o Teleport também.",
      "fcr-63": "O alvo inicial, alcançável com uma sword Spirit e o Magefist.",
      "fhr-60": "O alvo padrão de recuperação da Sorceress.",
    },
    skillNotes: {
      "frozen-orb":
        "Nível 30. O seu botão padrão — ele viaja, congela, e não precisa de mira.",
      "cold-mastery":
        "**Reduz a resistência a frio do inimigo em 20% no nível 1 e 5% por nível.** É por isso que a metade de frio segue útil sem sinergias atrás dela, e por que ela deve ser maximizada antes da metade de fogo.",
      meteor: "Nível 24. A resposta contra qualquer coisa imune a frio, e contra qualquer coisa parada.",
      "fire-mastery":
        "30% de dano no nível 1 e +7% por nível. Ela sobe a metade de fogo; não quebra imunidade a fogo.",
      "fire-bolt":
        "Sinergia do Meteor além de pré-requisito — é para cá que vão os pontos extras se você preferir fogo.",
      "fire-ball":
        "Pré-requisito do Meteor, e uma magia mais rápida que ele para coisas que se movem.",
      "ice-bolt":
        "Sinergia do Frozen Orb além do início da cadeia dele — o outro lugar para onde vão os pontos extras.",
      "ice-blast": "A segunda sinergia do Frozen Orb, e o próximo elo da cadeia.",
      "glacial-spike": "No caminho até o Blizzard, e um congelamento de emergência de verdade.",
      blizzard: "Pré-requisito do Frozen Orb. Um ponto, obrigatório.",
      warmth: "Regeneração de mana desde o nível 1.",
      teleport: "**Um ponto para sempre.**",
      "static-field":
        "Tira 25% da vida atual do alvo — útil numa build cujo dano está dividido.",
      "frozen-armor": "Defesa e congelamento em quem te ataca.",
      "frost-nova": "**O Blizzard exige Frost Nova e Glacial Spike.** Um ponto.",
      "inferno": "Pré-requisito do Blaze, na cadeia que o Meteor exige.",
      "blaze": "Pré-requisito do Fire Wall.",
      "fire-wall": "**O Meteor exige Fire Ball e Fire Wall.** Três pontos de cadeia por uma skill que você nunca conjura — o custo real da metade de fogo desta build.",
    },
    immunityPlan:
      "Esta é a build que existe para tornar imunidade um não-problema, e ela em grande parte consegue. **Quase nada no Hell é imune a fogo e a frio ao mesmo tempo**, então onde uma especialista encontra parede, esta build troca de botão. As duas metades falham de formas diferentes e vale saber como. **A Cold Mastery reduz a resistência a frio do inimigo** (20% no nível 1, +5% por nível), então a metade de frio segue funcionando contra monstros resistentes-mas-não-imunes sem nenhum equipamento comprado para isso. **A Fire Mastery aumenta o seu dano** (30%, +7% por nível), então a metade de fogo encara imunidade a fogo de frente sem nada para amolecer. Na prática isso significa que o Frozen Orb é o seu padrão e o Meteor é a sua resposta contra imunes a frio — e não o contrário. Sunder Charms existem para os dois elementos, mas esta build precisa deles menos que qualquer outra do site, e a penalidade de 70 a 90 pontos de resistência é uma troca ruim para um personagem que já tem uma segunda opção.",
    mercenaryNotes:
      "Mercenário do Ato 2 com **Might**, um **Insight** para mana, e um **Vampire Gaze** para mantê-lo vivo. Esta build precisa menos dele que a maioria — ela já tem resposta para quase tudo — então coloque runas na sobrevivência dele em vez de no dano. **Treachery** é a armadura barata e correta.",
    farmingWhy: {
      "mephisto-hell":
        "Não é imune a nenhum dos dois elementos, a vinte segundos de um waypoint, e com uma excelente tabela de drop. A casa óbvia desta build.",
      "pit-hell":
        "Nível de área 85 e curta, e o que resiste a um elemento lá não resiste ao outro.",
      "ancient-tunnels-hell":
        "Nível de área 85, e fogo está entre as imunidades registradas dela, e não frio — que é exatamente a zona para a qual uma build dividida existe. O Frozen Orb lida com o que o Meteor não consegue.",
      "mausoleum-hell": "Nível de área 85 densa perto de um waypoint.",
      "countess-hell": "Runas, curta, e nada lá para as duas metades.",
      "andariel-hell":
        "Curta e perto de um waypoint. Ela resiste a fogo, então esta é uma run de Frozen Orb.",
    },
    levelingPath: {
      summary:
        "Evolua com Fire Ball, que chega no 12 e é pré-requisito do Meteor de qualquer forma. O lado do frio é uma cadeia mais longa — Ice Bolt até Ice Blast até Glacial Spike até Blizzard antes de o Frozen Orb abrir no 30 — mas cada um deles é um ponto só, exceto os dois que são sinergias do Frozen Orb. O Meteor chega no 24, e as duas masteries no 30, então a build se monta ao longo dos níveis 24 a 30. **Nenhum respec é necessário.**",
    },
    selfFoundNotes:
      "Excelente, e possivelmente a melhor escolha de self-found do site para quem não quer pensar em imunidade. Ela não precisa de nenhum item caro, as duas metades entram no nível 30, e a lista de best in slot dela é skills e resistências em vez de raridades específicas de elemento. A ressalva honesta é que ela é mais lenta que as especialistas em tudo — você troca velocidade de limpeza por nunca ser parada.",
    hardcoreNotes:
      "Uma boa escolha de Hardcore por um motivo incomum: ela nunca chega na situação em que não consegue matar o que está na frente e precisa ficar ali decidindo. O Frozen Orb congela, o Meteor é lançado à distância, e o Glacial Spike é um congelamento de emergência de verdade por um ponto. As ressalvas da classe valem — menor reserva de vida, sem bloqueio, 60% de Faster Hit Recovery como piso — mas o perfil de risco da própria build é baixo. Pegue Chains of Honor em vez de Enigma.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30 pelas duas metades. Fire Ball e Ice Blast te levam lá.",
        nextUpgrade:
          "Nível 30. Frozen Orb, Cold Mastery e Fire Mastery chegam a poucos níveis uns dos outros.",
        notes:
          "**Prefira +all skills a equipamento de elemento em todos os níveis.** Numa build dividida, um item que sobe um elemento sobe metade do seu dano; um item que sobe todas as skills sobe tudo. Essa regra única explica a maior parte das escolhas de equipamento desta página.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de velocidade no nível 25 — e sobe as duas metades igualmente, o que importa numa build dividida.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "Velocidade de conjuração e recuperação no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills, o que aqui vale em dobro." },
        },
      },
      nightmare: {
        goal: "As duas metades ativas e nada no Nightmare te parando.",
        nextUpgrade: "Decida qual metade você prefere, e gaste os pontos extras lá.",
        picks: {
          "weapon-0": { why: "+2 skills para as duas metades." },
          "offhand-0": {
            why: "Um segundo Spirit — +4 skills e 70% de velocidade entre os dois.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "body-0": { why: "+1 skills, velocidade e resistências com 43 de Strength." },
          "helm-0": { why: "+1 skills e magic find." },
          "gloves-0": {
            why: "20% de velocidade. O +1 em Fire Skills só ajuda metade do seu dano, que é a troca que esta build sempre faz.",
          },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "O caminho mais barato até 75%." }],
      },
      "early-hell": {
        goal: "105% de velocidade, resistências capadas, e Mephisto no farm.",
        nextUpgrade: "+all skills onde você achar. Vale em dobro nesta build.",
        picks: {
          "weapon-0": { why: "+2 skills para as duas metades." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências. Numa build dividida o +2 vale mais que o normal.",
          },
          "helm-0": { why: "+2 skills para as duas metades, mais vida e magic find." },
          "amulet-0": {
            why: "+2 em todas as skills e resistências — exatamente o item que uma build dividida quer.",
          },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A última velocidade de que você precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "Segure 75%." }],
      },
      budget: {
        goal: "Farmar o Hell sem nunca precisar checar o que resiste a você.",
        nextUpgrade: "Não sobra muito acima disto. A build termina barata e fica lá.",
        picks: {
          "weapon-0": {
            why: "**+3 em Todas as Skills**, o que numa build dividida sobe as duas metades — e +40 em todas as resistências por cima. A melhor arma que esta build pode segurar, e por uma margem maior que numa especialista.",
            sockets: "Ko, Vex, Pul, Thul num Flail de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mantenha o Spirit até o Heart of the Oak existir. Os dois dão skills às duas metades.",
          },
          "offhand-0": { why: "+2 skills e velocidade." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "helm-0": { why: "+2 skills e magic find." },
          "gloves-0": { why: "20% de velocidade." },
          "belt-0": { why: "**+1 em Todas as Skills** e 20% de velocidade — de novo, vale em dobro aqui." },
          "amulet-0": { why: "+2 em todas as skills e +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "Passa do alvo de 105.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          {
            label: "Hellfire Torch (Sorceress)",
            why: "**+3 skills de Sorceress** — o maior aumento isolado às duas metades ao mesmo tempo.",
          },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Small charms de resistência e vida", why: "Preencha o resto." },
        ],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      optimized: {
        goal: "As duas metades tão altas quanto uma build dividida leva.",
        nextUpgrade: "Nada estrutural. A esta altura a build é o que ela vai ser.",
        picks: {
          "weapon-0": { why: "+3 em todas as skills e +40 em todas as resistências." },
          "offhand-0": { why: "+2 skills e 35% de velocidade." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "body-0-alt0": {
            why: "Teleport com custo de mana fixo e magic find por nível, ao custo das resistências.",
          },
          "helm-0": { why: "+2 skills, vida, magic find, redução de dano." },
          "gloves-0": { why: "20% de velocidade." },
          "belt-0": { why: "+1 em todas as skills, 20% de velocidade." },
          "amulet-0": { why: "+2 em todas as skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro ganha.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Small charms de vida e resistência",
            why: "Charms de skill são específicos de elemento, então charms gerais costumam servir melhor a esta build.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "**Os facets são o único lugar em que uma build dividida realmente perde.** Um facet de frio não faz nada pelo Meteor e um de fogo não faz nada pelo Frozen Orb, então metade de cada socket é desperdiçada. É por isso que esta lista busca +all skills e resistências onde uma especialista buscaria dano de elemento — e é um resumo compacto da build inteira.",
        picks: {
          "weapon-0": {
            why: "Um roll de +40 em todas as resistências junto com +3 em todas as skills.",
            lookFor: ["+40 em todas as resistências", "base Flail"],
          },
          "offhand-0": {
            why: "35% de velocidade num Monarch.",
            lookFor: ["35% de Faster Cast Rate"],
          },
          "body-0": { why: "Teleport e magic find por nível." },
          "helm-0": {
            why: "+2 skills, com uma runa Um encaixada por resistências em vez de um facet — facets são específicos de elemento e metade do seu seria desperdiçada.",
            lookFor: ["2 sockets"],
          },
          "gloves-0": { why: "20% de velocidade." },
          "belt-0": { why: "+1 em todas as skills." },
          "amulet-0": { why: "+2 em todas as skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida",
            why: "O último slot.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Small charms de vida e resistência", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "frost-nova-sorceress": {
    summary:
      "Um anel de frio que se expande de você, congelando tudo que toca. A resposta de frio à Nova Sorceress, por uma fração do preço.",
    playstyle:
      "Teleporte para dentro do grupo e segure o botão. O anel se expande de onde você está, então não há nada para mirar, e tudo que ele toca fica desacelerado ou congelado — o que significa que o grupo dentro do qual você está para de se mover. Esse congelamento é a defesa real da build e o motivo de ela sobreviver a um estilo que deveria ser suicídio para uma Sorceress. A Cold Mastery trabalha em silêncio atrás disso, arrancando resistência para o dano seguir importando no Hell.",
    strengths: [
      "**O congelamento é a defesa.** Tudo no anel para, e é por isso que ficar no meio funciona",
      "Nenhuma mira — a magia é centrada em você",
      "A Cold Mastery reduz a resistência do inimigo em vez de aumentar o seu dano, então a build envelhece bem sem equipamento caro",
      "Muito barata. Ela alcança o próprio teto sem uma única runa alta, diferente da Nova de raio",
      "Cinco das seis sinergias de dano dela ficam na mesma árvore, então os pontos da evolução e os do endgame são os mesmos pontos",
    ],
    weaknesses: [
      "**Nenhuma folga no plano de skills** — a build pronta são 108 dos seus 110 pontos",
      "Imunes a frio são parada total, e não há segundo tipo de dano",
      "Você luta do centro do grupo, que é onde as coisas te matam",
      "Dano de alvo único ruim; bosses são problema do Static Field",
      "A Cold Mastery é nível 30, então o dano da build fica estagnado até lá apesar de o Frost Nova abrir no 6",
    ],
    flexPoints: [
      "**Não existem pontos flexíveis, e essa é a resposta honesta.** O plano pronto são 108 de 110. Se você está abaixo do nível 99 — e está — a decisão é qual sinergia deixar incompleta, não onde gastar pontos que sobram. O Glacial Spike costuma ser a resposta, porque o congelamento de emergência de um ponto é a maior parte do valor dele.",
      "**Mais Frozen Orb** é a exceção que vale considerar. Ele já é pré-requisito, e um segundo ou terceiro ponto te dá uma opção à distância de verdade para os grupos dentro dos quais você preferiria não ficar. Custa dano de sinergia.",
      "**Variante de magic find:** mesmo plano de skills, equipamento trocado por magic find. A build limpa rápido o bastante para bancar.",
      "**Não coloque pontos em Energy.** Warmth e um mercenário com Insight cobrem o custo de conjurar continuamente.",
    ],
    statPlan: {
      strength: "Só o que o equipamento exigir.",
      dexterity: "Nenhuma. O congelamento é a defesa, não o bloqueio.",
      vitality: "Todo o resto, e leve a sério — você luta do centro do grupo.",
      energy: "Nenhum.",
      notes: [
        "Vida importa mais aqui que nas builds de frio à distância, pelo mesmo motivo que importa na Nova Sorceress: você fica dentro do que está matando.",
        "Uma troca com Call to Arms vale mais que qualquer Vitality que você comprasse com a mesma moeda.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "A tabela padrão da Sorceress. Em 105% os anéis se sobrepõem e viram algo contínuo, que é quando o congelamento fica confiável em vez de intermitente.",
      "fcr-63": "O mínimo para o congelamento acompanhar um grupo se fechando em cima de você.",
      "fhr-60":
        "**Obrigatório, não recomendado** — igual à Nova Sorceress, e pelo mesmo motivo. Você luta cercada.",
    },
    skillNotes: {
      "frost-nova":
        "Nível 6, e disponível quase de imediato — mas estagnada até a Cold Mastery chegar no 30. Expande da sua posição, então a única decisão é onde ficar.",
      "cold-mastery":
        "**Reduz a resistência a frio do inimigo em 20% no nível 1 e 5% por nível.** Não quebra imunidade verdadeira, mas é por isso que o dano ainda importa bem dentro do Hell.",
      "ice-bolt":
        "Sinergia do Frost Nova e o primeiro elo da cadeia até a Cold Mastery. Fazendo dois trabalhos ao mesmo tempo, como tudo nesta lista.",
      "ice-blast": "A segunda sinergia, e o segundo elo.",
      "glacial-spike":
        "A terceira sinergia, o terceiro elo, e um congelamento de emergência de verdade por si só.",
      blizzard: "**Uma sinergia do Frost Nova**, não um pré-requisito da Cold Mastery — que não exige absolutamente nada.",
      "frozen-orb": "**A outra sinergia do Frost Nova.** Também uma opção à distância aceitável para os grupos dentro dos quais você preferiria não ficar.",
      warmth: "Regeneração de mana desde o nível 1.",
      teleport: "**Um ponto para sempre**, e é como você chega ao meio.",
      "static-field": "Tira 25% da vida atual do alvo — a sua única resposta real contra um boss.",
      "frozen-armor":
        "Defesa e congelamento em quem te ataca, somando com o congelamento que você já está aplicando.",
    },
    immunityPlan:
      "Um tipo de dano e nenhuma alternativa, que é o custo da simplicidade da build. **A Cold Mastery reduz a resistência a frio do inimigo em 20% no nível 1 mais 5% por nível**, o que mantém o dano relevante contra qualquer coisa resistente mas não imune — e isso cobre a maior parte do Hell. Contra um imune a frio de verdade ela quase não faz nada, porque redução de resistência é aplicada com um quinto da eficácia depois que um monstro já é imune. As respostas reais são um sunder charm **Cold Rupture** ao custo de 70 a 90 pontos da sua própria resistência a frio, um **Infinity** no mercenário, ou **escolher zonas** — e para uma build cujas melhores áreas são o cow level, os Ancient Tunnels e o Mausoleum, escolher zonas costuma bastar. A lista de farming acima está ordenada com isso em mente.",
    mercenaryNotes:
      "Mercenário do Ato 2 com **Might** pelo dano, um **Insight** pela mana, e **Treachery** mais um **Vampire Gaze** para mantê-lo de pé — ele está no meio do grupo com você. **Holy Freeze** é a aura alternativa e ela combina conceitualmente com o que você já faz: tudo desacelerado fica mais tempo dentro do seu anel. Depois, um **Infinity** nele é a única resposta real contra imunes a frio fora um Sunder Charm.",
    farmingWhy: {
      "secret-cow-level-hell":
        "Densidade enorme, nada imune a frio, e cada vaca anda para dentro de um anel centrado em você. A melhor coisa que esta build faz.",
      "worldstone-keep-hell":
        "Nível de área 85 e muito densa. O congelamento é o que torna ficar no meio dela sobrevivível.",
      "mausoleum-hell":
        "Nível de área 85 densa, perto de um waypoint, e leve em imunidade a frio.",
      "pit-hell":
        "Nível de área 85 e curta, ainda que as salas sejam mais abertas do que uma build de nova gostaria.",
      "chaos-sanctuary-hell":
        "Densa e de nível alto. O Static Field lida com os bosses dos Seals que o seu anel não consegue explodir.",
      "ancient-tunnels-hell":
        "Nível de área 85, estreita, e as imunidades registradas dela são fogo e veneno, não frio. Corredores são onde uma nova de curto alcance quer lutar, e nada nesta resiste a ela.",
    },
    levelingPath: {
      summary:
        "Estranho, e vale entender antes de se comprometer. O Frost Nova está disponível no **nível 6** mas fica fraco até a Cold Mastery, e a Cold Mastery é uma skill de nível 30. Ela não exige mais nada — a espera é nível de personagem, não uma cadeia de pré-requisitos — então a leitura honesta é que você passa vinte e quatro níveis jogando com uma skill que ainda não é boa. A salvação é que tudo com que você evolui é sinergia do Frost Nova: Ice Bolt, Ice Blast e Glacial Spike são todas maximizadas na build pronta. Troque para o Frost Nova como botão principal no 30. **Nenhum respec é necessário.**",
    },
    selfFoundNotes:
      "Boa, e melhor do que o tier sugere para quem joga self-found. Ela não precisa de nada caro — dois Spirits, um Vipermagi e um Shako já é um personagem funcional no Hell — e a Cold Mastery significa que ela não precisa de um Infinity para seguir relevante. A fraqueza em self-found é a mesma que a geral: imunes a frio, sem segundo tipo de dano e sem forma barata de contornar.",
    hardcoreNotes:
      "Mais segura que a Nova de raio com que ela se parece, e a diferença é o congelamento. Tudo no seu anel para de se mover, o que converte o estilo mais perigoso do jogo num estilo administrável — e, diferente da Nova Sorceress, você mantém o escudo, porque nada aqui exige arma de duas mãos. Pegue Chains of Honor em vez de Enigma, trate os 60% de Faster Hit Recovery como o piso duro que estão listados, e mantenha o Glacial Spike numa tecla para os momentos em que o anel não basta.",
    gearSets: {
      starter: {
        goal: "Frost Nova desde o nível 6, e a caminhada longa até a Cold Mastery no 30.",
        nextUpgrade: "Nível 30 pela Cold Mastery. A build fica genuinamente estagnada até lá.",
        notes:
          "O Frost Nova está disponível no 6 mas é fraco, e a cadeia até a Cold Mastery é longa. A maioria evolui com Ice Blast e Glacial Spike — que são sinergias que você ia maximizar de qualquer jeito — e só troca para o Frost Nova como botão principal por volta do 30.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de velocidade no nível 25.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "Velocidade de conjuração e recuperação no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills." },
        },
      },
      nightmare: {
        goal: "Cold Mastery ativa e o congelamento fazendo trabalho de verdade.",
        nextUpgrade:
          "Vida, resistências e velocidade de conjuração — nessa ordem, porque você luta cercada.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": {
            why: "Um segundo Spirit — 70% de velocidade entre os dois, que é quase todo o caminho até um anel contínuo.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "body-0": { why: "+1 skills, velocidade e resistências com 43 de Strength." },
          "helm-0": { why: "+1 skills e magic find." },
          "gloves-0": {
            why: "+1 em Cold Skills e um aumento grande de mana, os dois usados diretamente por esta build.",
          },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "O caminho mais barato até 75%." }],
      },
      "early-hell": {
        goal: "105% de velocidade, 60% de recuperação, e resistências capadas.",
        nextUpgrade: "Nightwing's Veil, e facets de frio para encaixar nele.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração." },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências — vale mais que o normal numa build que luta do centro.",
          },
          "helm-0": {
            why: "+2 skills, vida, magic find e 10% de redução de dano. A vida é o que você está comprando.",
          },
          "amulet-0": { why: "+2 em todas as skills e resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate, resistências e vida",
            why: "Velocidade mais as duas coisas de que esta build está carente.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": {
            why: "Faster Hit Recovery e Vitality, que aqui importam mais que magic find.",
          },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "Segure 75%, e prefira vida a dano." },
        ],
      },
      budget: {
        goal: "Farm rápido de Terror Zones e de áreas densas.",
        nextUpgrade:
          "Nightwing's Veil e facets de frio, ou um Cold Rupture se você quiser o Pit e o Worldstone Keep.",
        picks: {
          "weapon-0": {
            why: "+3 skills de Sorceress, 30% de velocidade, +20 em todas as resistências e 50% de magic find — as resistências importam numa build sem distância.",
          },
          "weapon-0-alt0": {
            why: "Até +30% de dano de skills de frio. A opção de dano, quando as suas resistências se sustentarem sem o Oculus.",
          },
          "offhand-0": { why: "Velocidade de conjuração e skills." },
          "body-0": { why: "+2 skills, +65 em todas as resistências, 8% de redução de dano." },
          "helm-0": { why: "+2 skills, vida, magic find." },
          "gloves-0": { why: "+1 em Cold Skills." },
          "belt-0": { why: "+1 em todas as skills e 20% de velocidade." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate e vida",
            why: "Passa dos 105% e carrega vida.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Grand charms de skills de frio com vida",
            why: "Dano e a vida de que uma build de centro de grupo precisa.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders. Não é opcional neste estilo." }],
      },
      optimized: {
        goal: "Dano de frio empilhado, e um congelamento que segura uma sala inteira.",
        nextUpgrade: "Facets de frio em todo socket.",
        picks: {
          "weapon-0": {
            why: "Até +30% de dano de skills de frio além dos +3 skills de Sorceress.",
            lookFor: ["+30% de dano de skills de frio", "sockets para facets de frio"],
          },
          "offhand-0": { why: "Velocidade de conjuração e skills." },
          "helm-0": {
            why: "+2 skills e até +15% de dano de skills de frio. Os 192 de Strength são cortados pela metade pelo próprio Requirements -50% dele.",
            lookFor: ["+15% de dano de skills de frio", "2 sockets"],
          },
          "helm-0-alt0": {
            why: "Mantenha o Shako pela vida e pela redução de dano se você está morrendo em vez de matando devagar.",
          },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "body-0-alt0": { why: "Teleport com custo de mana fixo e magic find por nível." },
          "gloves-0": { why: "+1 em Cold Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro ganha.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find, ou Sandstorm Trek se a recuperação ainda estiver curta." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de frio com vida", why: "Dano e vida." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "Esta build termina barata e fica lá, que é a comparação honesta com a Nova Sorceress com que ela se parece. O Frost Nova alcança o próprio teto pelo preço de dois Spirits e um Death's Fathom; a Nova de raio precisa de um Infinity para alcançar o dela. Uma delas é um personagem muito melhor. A outra é um primeiro personagem muito melhor.",
        picks: {
          "weapon-0": {
            why: "Um roll de +30% de dano de skills de frio com facets de frio encaixados.",
            lookFor: ["+30% de dano de skills de frio", "sockets"],
          },
          "offhand-0": {
            why: "35% de velocidade num Monarch.",
            lookFor: ["35% de Faster Cast Rate"],
          },
          "helm-0": {
            why: "+15% de dano de skills de frio com dois facets de frio.",
            lookFor: ["+15% de dano de skills de frio", "2 sockets"],
          },
          "body-0": { why: "Teleport e magic find por nível." },
          "gloves-0": { why: "+1 em Cold Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida",
            why: "O último slot.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de frio com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "melee-sorceress": {
    summary:
      "Uma Sorceress que não conjura. O Dream fornece o dano, outra runeword fornece o ataque, e o Energy Shield a mantém de pé.",
    playstyle:
      "Entre e golpeie. O dano não é seu — vem da aura de Holy Shock das suas runewords Dream, que eletrocuta tudo por perto esteja você atacando ou não, e do dano físico que a arma fizer. Os seus pontos de skill compram sobrevivência, não dano: o Energy Shield converte golpes recebidos em mana, a Telekinesis torna essa conversão mais barata, e o Warmth reabastece a reserva. É uma build de novidade genuína, e tanto esta página quanto as fontes de onde ela vem dizem isso.",
    strengths: [
      "Completamente diferente de jogar de qualquer outra Sorceress do site",
      "Energy Shield mais uma reserva grande de mana é uma camada defensiva real, não um truque",
      "A aura de Holy Shock causa dano em tudo por perto sem apertar botão",
      "Raio mais físico significa menos paredes duras que uma caster pura",
      "Mantém o Teleport, que nenhum outro personagem de corpo a corpo do jogo tem de graça",
    ],
    weaknesses: [
      "**Muito cara para o que é.** Dois Dreams são duas runas Jah, e a runeword de ataque vem por cima",
      "**Fonte única.** Só uma das três fontes de build que consultamos documenta isso, no tier C",
      "Mana burn é letal em vez de irritante, porque o Energy Shield é a sua vida",
      "Os seus pontos de skill não compram dano nenhum — cada ponto dele vem do equipamento",
      "Mais lenta que as especialistas em tudo, e custa mais que a maioria delas",
    ],
    flexPoints: [
      "**Variante Zeal:** uma runeword **Passion** concede Zeal como Oskill. Mais rápida, acerta vários alvos adjacentes, e te mantém em forma normal — então você ainda conjura, bebe e teleporta livremente. É a mais flexível das duas.",
      "**Variante Werebear:** uma runeword **Beast** concede Werebear como Oskill, e você luta em forma de urso. A forma é mais resistente e bate mais forte por golpe, mas você não consegue conjurar transformado — aplique Enchant e a sua armadura *antes* de transformar, e aceite que o Teleport fica indisponível até voltar.",
      "**Pule o Enchant** se preferir empurrar mais as skills de apoio do Energy Shield. O dano da build é a aura do Dream de qualquer forma, e o Enchant é um bônus de dano de fogo e não um núcleo.",
      "**Não coloque pontos em Energy.** O Energy Shield escala com a sua *reserva* de mana, e equipamento fornece muito mais mana por ponto que o atributo. Esta é a build em que esse erro é mais tentador e mais caro.",
      "**Increased Attack Speed não é publicado como tabela de breakpoint neste site** — a mesma posição das páginas de Paladin de corpo a corpo. O Beast fornece 40% e o Passion fornece o dele; na prática isso resolve.",
    ],
    statPlan: {
      strength: "O suficiente para a sua arma e armadura. O próprio Beast dá +25-40 de Strength, o que devolve parte do que a base dele custa.",
      dexterity: "O suficiente para a arma. Não há plano de bloqueio aqui — o slot do escudo é um Dream.",
      vitality: "Todo o resto, e ainda assim não vai ser muito. O Energy Shield faz o trabalho que a Vitality faz em outros lugares.",
      energy: "**Nenhum**, apesar das aparências. Leia os pontos flexíveis — o escudo escala com a reserva, e equipamento dá mais reserva por ponto que o atributo.",
      notes: [
        "**O erro mais comum nesta build é investir em Energy.** Parece certo e não é: mana vinda de equipamento é muito mais barata por ponto, e a Telekinesis melhora a taxa de conversão de um jeito que a Energy nunca faz.",
        "Os dois slots defensivos — elmo e escudo — são Dreams, então não há bloqueio nem resistência de nenhum dos dois. Todo o resto que você usa precisa compensar isso.",
        "A variante Werebear não bebe poções do mesmo jeito nem conjura transformada. Planeje a ordem dos buffs antes de se transformar.",
      ],
    },
    breakpointWhy: {
      "fhr-60":
        "**Obrigatório.** Você está em alcance corpo a corpo sem bloqueio, e o Dream fornece 20-30% disso por cópia — então dois Dreams já levam quase todo o caminho.",
      "fcr-63":
        "Só o Teleport e os seus buffs usam. Não há motivo para comprar mais do que o suficiente para se reposicionar.",
    },
    skillNotes: {
      "energy-shield":
        "**Dois de mana por ponto de dano na base**, melhorado pela Telekinesis. Num personagem com reserva de vida de Sorceress parado em alcance corpo a corpo, esta é a barra de vida da build.",
      telekinesis:
        "Melhora a taxa de mana por dano do Energy Shield, o que vale mais que qualquer quantidade de mana bruta. Maximize em segundo.",
      warmth:
        "Reabastece a reserva que o Energy Shield está gastando. Numa build cuja vida é mana, regeneração é cura.",
      enchant:
        "**A única skill de dano que vale pegar.** Ela adiciona dano de fogo aos seus ataques, dura minutos, e pode ser lançada antes de virar urso. Pule se preferir armaduras mais profundas.",
      teleport:
        "**Um ponto**, e é a maior vantagem isolada que esta build tem sobre qualquer outro personagem de corpo a corpo do jogo.",
      "fire-ball": "Só é necessário para a opção de Enchant abaixo, que exige ele.",
      "chilling-armor":
        "A armadura que vale rodar em corpo a corpo — ela dispara um projétil de volta em quem atira em você, e a defesa dela se aplica onde você de fato está.",
      "static-field":
        "Tira 25% da vida atual do alvo. A sua única resposta contra um boss com muita vida.",
      "frost-nova":
        "Congela tudo ao seu redor, o que numa build parada no meio vale o ponto.",
      "lightning": "Pré-requisito do Chain Lightning.",
      "chain-lightning": "**O Energy Shield exige Chain Lightning e Teleport.** Dois pontos na árvore de raio numa build que não conjura nenhum dos dois.",
      "ice-blast": "**O Shiver Armor exige Frozen Armor e Ice Blast.**",
      "fire-bolt": "Só é necessário se você pegar a opção de Enchant abaixo — é pré-requisito do Fire Ball.",
    },
    immunityPlan:
      "Dois tipos de dano que falham em lugares diferentes. A **aura de Holy Shock é raio**, e um imune a raio não toma nada dela — sem Conviction disponível para uma Sorceress, não há como quebrar isso pelo seu próprio equipamento. O que ainda acerta é o **dano físico do seu ataque**, que com os 20% de Crushing Blow do Beast é mais substancial do que parece. Contra algo imune aos dois, a resposta honesta é passar direto. Um sunder charm **Crack of the Heavens** funciona, mas custa 70 a 90 pontos da sua própria resistência a raio, o que numa build parada dentro de grupos lightning enchanted e sem escudo é um dos piores lugares do jogo para fazer essa troca. O **Infinity** do seu mercenário é a solução limpa, e é uma Ber e uma Jah em cima de tudo que esta build já custa.",
    mercenaryNotes:
      "Pegue **Holy Freeze** em vez de Might. Você luta de dentro do grupo, e qualquer coisa desacelerada fica mais tempo dentro do seu raio de Holy Shock, o que vale mais que o dano pessoal dele. Dê um **Insight** — a Meditation dele reabastece a mana que é funcionalmente a sua barra de vida, o que o torna mais valioso nesta build que em qualquer caster. **Treachery** e um **Vampire Gaze** o mantêm vivo ao seu lado.",
    farmingWhy: {
      "secret-cow-level-hell":
        "Densidade enorme, nada imune a raio, e tudo anda para dentro de uma aura centrada em você. A melhor coisa que esta build faz.",
      "worldstone-keep-hell":
        "Nível de área 85 e densa — os grupos vêm até você, que é o que uma aura de raio quer.",
      "mausoleum-hell": "Nível de área 85 densa com quase nada imune a raio.",
      "pit-hell":
        "Nível de área 85 e curta, ainda que as salas sejam mais abertas do que a aura gostaria.",
      "uber-tristram-hell":
        "Genuinamente viável, o que é incomum para uma Sorceress — Energy Shield mais um ataque físico mais o Crushing Blow do Beast é um kit de Uber de verdade. Mais lenta que um Smiter e muito mais cara.",
      "chaos-sanctuary-hell":
        "Densa, mas o Iron Maiden dos Oblivion Knights reflete a sua metade física — e num personagem cuja vida é uma reserva de mana, isso termina mal.",
    },
    levelingPath: {
      summary:
        "Não existe versão de evolução. O Dream exige nível 65, o Beast 63, e nenhuma das skills da build causa dano — um personagem nível 40 com Energy Shield maximizado não tem como matar nada. Evolua como **Frozen Orb** ou **Fire Ball Meteor** Sorceress, que são personagens fortes e não precisam de nada caro, e converta com um respec grátis da Den of Evil quando as runewords estiverem de fato no seu inventário. Não faça respec cedo.",
      respecAt: "Nível 65+, e só quando os dois Dreams e uma runeword de ataque existirem",
    },
    selfFoundNotes:
      "Não. Duas runas Jah mais um Beast (que contém uma Ber) ou um Passion não é projeto de self-found, e não existe versão parcial da build que funcione — um Dream é metade de uma aura e nenhuma runeword de ataque é nenhum ataque. Leia esta página como destino. Se o que atrai é o estilo e não o custo, a página do Tesladin descreve um Paladin fazendo a mesma coisa com melhor suporte de classe, e a do Zealot descreve isso sem nenhuma runa alta.",
    hardcoreNotes:
      "Arriscada, e o risco é incomum o bastante para valer detalhar. **O Energy Shield faz da sua vida uma reserva de mana**, então um monstro com mana burn não te incomoda — ele remove a sua barra de vida. Os dois slots defensivos são Dreams, então não há bloqueio nem resistência de nenhum. E a variante Werebear não conjura nem teleporta transformada, o que remove a opção de fuga que torna Sorceress sobrevivíveis. Se você jogar isso no Hardcore, pegue a **variante Zeal** e não a Werebear, mantenha Chains of Honor, e trate grupos com mana burn como motivo para sair da área e não como desafio.",
    gearSets: {
      starter: {
        goal: "Não é esta build. O Dream exige nível 65 e o Beast 63.",
        nextUpgrade:
          "Nível 65 e duas runas Jah, mais um Beast ou um Passion. Leia a nota de self-found antes.",
        notes:
          "**Não existe versão inicial desta build.** Evolua como Frozen Orb ou Fire Ball Meteor Sorceress, que são bons personagens por direito próprio, e converta com um respec grátis da Den of Evil se as runas aparecerem.",
        picks: {
          "weapon-0": {
            why: "Você está evoluindo como caster. Jogue uma das builds de frio ou fogo e volte depois.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências enquanto você evolui normalmente." },
          "body-0": { why: "Velocidade de conjuração e recuperação no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills." },
        },
      },
      nightmare: {
        goal: "Ainda uma caster. Guarde runas.",
        nextUpgrade:
          "Runs de Countess e Travincal. Tudo nesta build vem depois de runas altas.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": { why: "Um segundo Spirit." },
          "body-0": { why: "+1 skills e resistências com 43 de Strength." },
          "helm-0": { why: "+1 skills e magic find enquanto você farma runas." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "A resistência mais barata disponível." }],
      },
      "early-hell": {
        goal: "Farmar o Hell como caster enquanto as runas se acumulam.",
        nextUpgrade: "O primeiro Dream, e uma decisão entre as variantes Zeal e Werebear.",
        notes:
          "Seja honesto consigo aqui, exatamente como na página do Tesladin. Se duas runas Jah mais um Beast ou Passion não é um alvo realista para o seu jeito de jogar, esta build é uma página para ler e não um plano para seguir.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "+2 skills e +65 em todas as resistências — e você vai querer depois também." },
          "helm-0": { why: "+2 skills, vida e magic find." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": {
            why: "+1 em todas as skills e **mana máxima aumentada** — a segunda metade é o que esta build está comprando.",
          },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "Segure 75%." }],
      },
      budget: {
        goal: "Um Dream e um ataque. Metade do dano, e uma prévia de verdade.",
        nextUpgrade: "A segunda Jah. É o projeto restante, exatamente como na página do Tesladin.",
        picks: {
          "helm-0": {
            why: "Uma aura de Holy Shock nível 15 e 20-30% de Faster Hit Recovery. Metade do dano da build, num slot.",
            sockets: "Io, Jah, Pul no elmo de 3 sockets mais leve que você achar.",
          },
          "weapon-0": {
            why: "**A variante Zeal.** Concede Zeal como Oskill — vários golpes rápidos, e você fica em forma normal, então ainda conjura e teleporta livremente. O mais barato dos dois ataques por larga margem.",
            sockets: "Dol, Ort, Eld, Lem numa arma de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "**A variante Werebear.** Concede Werebear como Oskill mais uma aura de Fanaticism e 40% de velocidade de ataque. Mais resistente e batendo mais forte, mas você não conjura transformado.",
          },
          "offhand-0": {
            why: "Mantenha até o segundo Dream existir — o +2 skills sobe Energy Shield e Telekinesis, que são a sua sobrevivência.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências. Com Dreams nos slots defensivos, é aqui que mora a sobrevivência.",
          },
          "belt-0": {
            why: "+1 skills e **Increase Maximum Mana 5%** — mana é vida aqui.",
          },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "+1 skills e mana máxima aumentada." },
          "ring2-0": {
            why: "Cannot Be Frozen, que qualquer build de corpo a corpo precisa — e a Dexterity ajuda no requisito da arma.",
          },
          "boots-0": { why: "Faster Hit Recovery, Strength e Vitality." },
        },
        charms: [
          {
            label: "Hellfire Torch (Sorceress)",
            why: "+3 skills de Sorceress, o que sobe Energy Shield e Telekinesis juntos.",
          },
          { label: "Annihilus", why: "+1 em todas as skills e resistências." },
          {
            label: "Small charms de vida e resistência",
            why: "Com os dois slots defensivos gastos em dano, os charms carregam mais aqui que o normal.",
          },
        ],
        weaponSwap: [
          {
            why: "Battle Orders sobe **mana além de vida**, o que nesta build é um aumento direto da sua vida efetiva.",
          },
        ],
      },
      optimized: {
        goal: "Os dois Dreams. Uma aura de Holy Shock nível 30 e um Energy Shield fundo o bastante para ficar dentro dela.",
        nextUpgrade:
          "Mana e resistências. Não sobra upgrade de dano — o nível da aura é fixado pela runeword.",
        picks: {
          "helm-0": {
            why: "Metade da aura empilhada.",
            sockets: "Io, Jah, Pul no elmo de 3 sockets mais leve disponível.",
          },
          "offhand-0": {
            why: "A outra metade. Duas auras empilham para um Holy Shock nível 30 efetivo, que é o momento em que a build vira ela mesma.",
            sockets: "Io, Jah, Pul num escudo de 3 sockets.",
          },
          "weapon-0": {
            why: "**Variante Werebear.** Fanaticism, 40% de velocidade de ataque, 20% de Crushing Blow e a própria transformação.",
          },
          "weapon-0-alt0": {
            why: "**Variante Zeal.** Mais barata, mais rápida, e mantém você conjurando e teleportando à vontade.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências. Sem escudo e sem bloqueio, isto não é opcional.",
          },
          "gloves-0": {
            label: "Luvas craftadas com 20% de Increased Attack Speed e mana",
            why: "Velocidade de ataque, e mana que funcionalmente é vida nesta build.",
            lookFor: ["20% de Increased Attack Speed", "Mana", "Resistências"],
          },
          "belt-0": { why: "+1 skills e mana máxima aumentada." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "+1 skills e mana máxima." },
          "ring2-0": { why: "Cannot Be Frozen." },
          "boots-0": { why: "Recuperação e Vitality." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Small charms de vida e resistência",
            why: "Os dois slots defensivos são dano; os charms compensam a diferença.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders — mana e vida juntos." },
          { why: "Mão secundária para a troca." },
        ],
      },
      bis: {
        goal: "Nada mais a consertar.",
        notes:
          "O resumo honesto, e é o mesmo a que a pesquisa chegou: isto custa mais que a Nova Sorceress e limpa menos que a Frozen Orb Sorceress. Monte porque uma Sorceress empunhando um machado é algo que você quer fazer, o que é um motivo perfeitamente bom — não porque os números apontem para cá.",
        picks: {
          "helm-0": {
            why: "Um roll de 30% de Faster Hit Recovery e 20 em todas as resistências.",
            lookFor: ["30% de Faster Hit Recovery", "All Resistances +20"],
          },
          "offhand-0": {
            why: "O mesmo, num escudo.",
            lookFor: ["30% de Faster Hit Recovery", "All Resistances +20"],
          },
          "weapon-0": {
            why: "Um roll de 270% de Enhanced Damage numa Berserker Axe.",
            lookFor: ["270% de Enhanced Damage", "+40 de Strength"],
          },
          "weapon-0-alt0": {
            why: "A variante Zeal segue sendo um ponto final legítimo, não uma versão econômica.",
          },
          "body-0": { why: "+2 skills, +65 em todas as resistências, 8% de redução de dano." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, mana, resistências",
            why: "O único slot em que um craft supera qualquer unique aqui.",
            lookFor: ["20% de Increased Attack Speed", "Mana", "Duas resistências"],
          },
          "belt-0": { why: "+1 skills, mana máxima." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 skills, mana máxima." },
          "ring2-0": { why: "Cannot Be Frozen, Dexterity para a arma." },
          "boots-0": { why: "Recuperação e Vitality." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills, 20 atributos, 20 resistências." },
          { label: "Small charms de vida e resistência", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Mão secundária para a troca." }],
      },
    },
  },
  "fire-wall-sorceress": {
    summary:
      "Negação de terreno em vez de dano. Você decide por onde o inimigo tem permissão de andar, e os Ubers andam por ali mesmo assim.",
    playstyle:
      "Coloque as paredes onde as coisas precisam passar, não onde elas estão. O Fire Wall causa dano ao longo do tempo em vez de no impacto, então ele recompensa ler a sala — um corredor, uma porta, o chão entre um boss e você. Contra algo que se move na sua direção independentemente do que esteja no caminho, que é a maioria dos bosses do jogo, ele é muito melhor do que a velocidade de limpeza sugere. Contra um grupo espalhado numa sala aberta, é uma das piores magias do jogo, e nenhuma quantidade de equipamento conserta isso.",
    strengths: [
      "**Genuinamente boa nos Ubers**, o que quase nenhuma build de Sorceress é — a Maxroll marca ela exatamente para isso",
      "Dano ao longo do tempo ignora quanta vida o alvo tem, então bosses não são uma parede",
      "Barata. Ela não precisa de nenhum item caro para fazer o que faz",
      "Disponível no nível 18 atrás de uma cadeia curta de pré-requisitos",
      "Empilhar várias paredes no mesmo ponto é uma opção de burst de verdade que a maioria das builds não tem",
    ],
    weaknesses: [
      "**Ruim contra densidade em terreno aberto.** Se as coisas puderem contornar, elas vão contornar",
      "Fogo é o elemento mais resistido no Hell e a Fire Mastery não quebra imunidade",
      "O dano é atrasado, então ela recompensa previsão e pune reação",
      "Build de conjuração mais mal avaliada da pesquisa — Maxroll B, DiabloBytes C",
      "Um tipo de dano e nenhuma alternativa",
    ],
    flexPoints: [
      "**O Meteor é o ponto flexível, e a maioria pega.** O Fire Wall sozinho não dá conta de um grupo espalhado. Ele não é de graça — o Meteor exige Fire Ball e Fire Wall, e você já tem os dois — mas maximizá-lo transforma a build em algo mais próximo de uma Fire Ball Meteor Sorceress que também nega terreno.",
      "**Mais Frost Nova** se você prefere resolver o mesmo problema de forma defensiva — um grupo desacelerado passa mais tempo dentro da sua parede.",
      "**Variante de magic find:** a build é barata o bastante para o orçamento de equipamento ir para magic find. Mesmo plano de skills.",
      "**Não coloque pontos em Energy.** Warmth mais um mercenário com Insight cobrem o custo de empilhar paredes.",
    ],
    statPlan: {
      strength: "Só o que o equipamento exigir.",
      dexterity: "Nenhuma.",
      vitality: "Todo o resto.",
      energy: "Nenhum.",
      notes: [
        "Nada de incomum aqui. A dificuldade da build está em onde você fica, não no que você gasta.",
        "Uma troca com Call to Arms vale mais que qualquer Vitality que você comprasse com a mesma moeda.",
      ],
    },
    breakpointWhy: {
      "fcr-105":
        "O alvo padrão da Sorceress. Ele determina com que rapidez você consegue empilhar várias paredes no mesmo ponto, que é o burst desta build.",
      "fcr-63": "O alvo inicial, alcançável com um Spirit em sword e Magefist.",
      "fhr-60":
        "O alvo padrão de recuperação da Sorceress. Você normalmente está atrás da sua própria parede, mas nem sempre.",
    },
    skillNotes: {
      "fire-wall":
        "Nível 18. Dano ao longo do tempo em vez de no impacto — a skill inteira é escolher onde colocar.",
      "fire-mastery":
        "30% de dano no nível 1 e +7% por nível. Um multiplicador, não uma redução de resistência.",
      inferno:
        "Sinergia do Fire Wall, e a raiz da cadeia de duas skills que o destrava pelo Blaze. Também um jato de curta distância genuinamente utilizável durante a evolução.",
      meteor:
        "Não é sinergia — é uma segunda magia, e a que cobre a fraqueza do Fire Wall contra coisas paradas em terreno aberto. **A Fire Mastery não exige nada**, então, diferente da maioria das builds de fogo, você não é obrigado a passar pelo Meteor para chegar nela.",
      "fire-ball": "Uma opção rápida de alvo único, e pré-requisito do Meteor se você pegar o ponto flexível abaixo.",
      warmth: "Regeneração de mana desde o nível 1. Empilhar paredes é caro.",
      teleport: "**Um ponto para sempre**, e é como você fica atrás de uma parede que acabou de colocar.",
      "static-field":
        "Tira 25% da vida atual do alvo — combina excepcionalmente bem com dano ao longo do tempo.",
      "frozen-armor": "Defesa e congelamento em quem te ataca.",
      "frost-nova":
        "Desacelera um grupo para ele ficar mais tempo dentro da parede, que é o ponto não relacionado a fogo mais útil da lista.",
      "blaze": "**O pré-requisito do Fire Wall é o Blaze**, e o do Blaze é o Inferno — que você já está maximizando como sinergia.",
      "fire-bolt": "A magia que te carrega até o nível 24, e pré-requisito do Fire Ball.",
    },
    immunityPlan:
      "Um elemento e nenhuma alternativa, a não ser que você tenha pegado o Meteor — que também é fogo, então ele não ajuda contra imunidade. **A Fire Mastery não quebra imunidade**: 30% de dano no nível 1 mais 7% por nível aumenta o seu dano, não a resistência deles, e fogo é o elemento mais resistido no Hell. As respostas são as mesmas três de toda build de fogo. **Um sunder charm Flame Rift** é a solução direta ao custo de 70 a 90 pontos da sua própria resistência a fogo. **Infinity no mercenário** resolve sem a penalidade e por um preço muito maior. **Escolher zonas** é de graça, e importa mais aqui do que em outros lugares porque a build já quer *formatos* específicos de mapa — a Stony Tomb e o Chaos Sanctuary te dão corredores e pouca imunidade a fogo ao mesmo tempo.",
    mercenaryNotes:
      "**Holy Freeze em vez de Might.** Qualquer coisa desacelerada passa mais tempo dentro da sua parede, e numa build de dano ao longo do tempo isso é um aumento direto de dano de um jeito que não é para as outras Sorceresses. Dê a ele um **Insight** pela mana que empilhar paredes custa, e um **Vampire Gaze** com **Treachery** para ele continuar segurando o terreno que você está queimando. Depois, um **Infinity** é a alternativa a um charm Flame Rift.",
    farmingWhy: {
      "uber-tristram-hell":
        "O motivo de esta build existir. Dano ao longo do tempo ignora quanta vida um boss de nível 110 tem, e os Ubers vêm na sua direção através do que você tiver colocado. Mais lento que um Smiter, e muito mais possível que qualquer outra Sorceress.",
      "chaos-sanctuary-hell":
        "Corredores e bosses de Seal que vêm até você — o layout para o qual esta magia foi desenhada. Boa parte resiste a fogo, então leve o sunder charm.",
      "mausoleum-hell": "Nível de área 85 denso com aproximações estreitas, e leve em imunidade a fogo.",
      "stony-tomb-hell":
        "Nível de área 85, corredores, e pouquíssima imunidade a fogo. Uma das poucas zonas onde o formato da magia e o formato do mapa concordam.",
      "andariel-hell": "Ela vem direto na sua direção por uma sala curta. Empilhe paredes e recue.",
      "pit-hell":
        "Nível de área 85, mas salas abertas onde os monstros simplesmente contornam a parede. Este é o formato de mapa em que a build é pior.",
    },
    levelingPath: {
      summary:
        "Evolua com Fire Bolt e depois Fire Ball, os dois no caminho até o Meteor e a Fire Mastery. O Fire Wall chega no 18 mas é desconfortável durante a evolução — monstros em terreno aberto contornam a parede — então a maioria se apoia no Inferno, que é sinergia do Fire Wall e portanto não é desperdiçado, e troca quando o Meteor no 24 e a Fire Mastery no 30 dão à build a segunda opção e o multiplicador. **Nenhum respec é necessário.**",
    },
    selfFoundNotes:
      "Genuinamente boa. Nada do que a build precisa é caro, o Fire Wall chega no 18 atrás de uma cadeia de duas skills, e a lista de melhores itens não contém nada que um personagem self-found não possa acabar encontrando. A ressalva honesta é a mesma de toda build de fogo: imunidade a fogo no Hell, com um Flame Rift como resposta realista e um Infinity como a resposta que não é.",
    hardcoreNotes:
      "Melhor do que a velocidade de limpeza sugere, por um motivo estrutural: você coloca o dano e fica em outro lugar. Uma parede numa porta significa que a luta acontece onde você escolheu, e não onde os monstros escolheram. Valem as ressalvas de sempre da classe — menor reserva de vida, sem bloqueio, 60% de Faster Hit Recovery como piso — e o perigo específico é terreno aberto, onde a magia não faz nada e você é só uma Sorceress sem plano de fuga. Pegue Chains of Honor em vez de Enigma e mantenha o Frost Nova numa tecla.",
    gearSets: {
      starter: {
        goal: "Fire Wall no 18, e Fire Mastery no 30.",
        nextUpgrade:
          "Nível 30 pela Fire Mastery. Fire Bolt e Inferno te levam até lá, e o Inferno é sinergia.",
        notes:
          "O Fire Wall chega no 18 mas é desconfortável durante a evolução, porque monstros em terreno aberto contornam a parede. A maioria se apoia em Fire Bolt e Inferno até o Meteor no 24 dar uma segunda opção.",
        picks: {
          "weapon-0": {
            why: "+2 skills e até 35% de velocidade de conjuração no nível 25.",
            sockets: "Tal, Thul, Ort, Amn numa Crystal Sword de 4 sockets.",
          },
          "offhand-0": { why: "Resistências por três runas da Countess." },
          "body-0": { why: "Velocidade de conjuração e recuperação no nível 17." },
          "helm-0": { why: "+1 em Todas as Skills." },
          "gloves-0": { why: "+1 em Fire Skills e 20% de velocidade de conjuração." },
        },
      },
      nightmare: {
        goal: "Fire Mastery ativa e as duas magias fazendo trabalho.",
        nextUpgrade:
          "Resistências em 75%, um Insight para o mercenário, e um plano para imunes a fogo.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": {
            why: "Um segundo Spirit — 70% de velocidade de conjuração entre os dois.",
            sockets: "Tal, Thul, Ort, Amn num escudo de 4 sockets.",
          },
          "body-0": { why: "+1 skills, velocidade de conjuração e resistências com 43 de Strength." },
          "helm-0": { why: "+1 skills e magic find." },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "Resistências e dano convertido em mana." },
        },
        charms: [{ label: "Small charms de resistência e vida", why: "O caminho mais barato até 75%." }],
      },
      "early-hell": {
        goal: "105% de velocidade de conjuração, resistências capadas, e uma resposta para imunidade a fogo.",
        nextUpgrade:
          "Eschuta's Temper, e um conjunto de chaves de Uber se foi para isso que você montou esta build.",
        picks: {
          "weapon-0": { why: "Velocidade de conjuração e skills." },
          "offhand-0": { why: "O segundo." },
          "body-0": { why: "Resistências e velocidade de conjuração." },
          "body-0-alt0": { why: "+2 skills e +65 em todas as resistências quando as runas aparecerem." },
          "helm-0": { why: "+2 skills, vida, magic find e redução de dano." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": {
            label: "Anel raro com 10% de Faster Cast Rate e resistências",
            why: "A última velocidade de conjuração de que você precisa.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Small charms de resistência e vida", why: "Segure 75%." },
          {
            label: "Flame Rift (sunder charm de fogo)",
            why: "A resposta direta contra imunidade a fogo, ao custo de 70 a 90 pontos da sua própria resistência a fogo.",
          },
        ],
      },
      budget: {
        goal: "Farm no Hell, e os mini-Ubers.",
        nextUpgrade:
          "Facets de fogo, e as resistências para sobreviver perto da sua própria parede.",
        picks: {
          "weapon-0": {
            why: "Até +3 skills de Sorceress, 40% de velocidade de conjuração e +20% de dano de skills de fogo.",
          },
          "weapon-0-alt0": {
            why: "Mantenha o Spirit enquanto resistência for o limite — o Eschuta's não tem nenhuma.",
          },
          "offhand-0": { why: "Velocidade de conjuração e skills." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "helm-0": { why: "+2 skills e magic find." },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills e 20% de velocidade de conjuração." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro com 10% de Faster Cast Rate",
            why: "Fecha o alvo de 105%.",
            lookFor: ["10% de Faster Cast Rate", "Resistências", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          {
            label: "Flame Rift (sunder charm de fogo)",
            why: "Carregue quando a zona exigir.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      optimized: {
        goal: "Capaz nos Ubers, e confortável nas zonas que combinam com a magia.",
        nextUpgrade: "Facets de fogo em todo socket. Há pouca coisa além disso.",
        picks: {
          "weapon-0": {
            why: "+3 skills e +20% de dano de skills de fogo, com facets de fogo nos sockets.",
            lookFor: ["+3 skills de Sorceress", "+20% de dano de skills de fogo", "3 sockets"],
          },
          "offhand-0": { why: "Velocidade de conjuração e skills." },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "body-0-alt0": {
            why: "Teleport com custo fixo de mana, o que importa numa build que se reposiciona o tempo todo.",
          },
          "helm-0": { why: "+2 skills, com um facet de fogo encaixado.", lookFor: ["2 sockets"] },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade de conjuração." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, resistências, vida",
            why: "O slot em que um raro ganha.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "Dano e vida." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Escudo para a troca." }],
      },
      bis: {
        goal: "Nada mais a corrigir.",
        notes:
          "A observação honesta: esta é a build de conjuração mais mal avaliada da pesquisa e a lista de melhores itens é quase idêntica à da Fire Ball Meteor Sorceress, que as duas fontes avaliam dois patamares acima. Monte pela questão dos Ubers e pelo jeito que ela joga, não porque o teto de equipamento seja diferente — não é.",
        picks: {
          "weapon-0": {
            why: "Um roll de +3 skills e +20% de dano de fogo com três facets de fogo.",
            lookFor: ["+3 skills de Sorceress", "+20% de dano de skills de fogo", "3 sockets"],
          },
          "offhand-0": {
            why: "35% de velocidade de conjuração num Monarch.",
            lookFor: ["35% de Faster Cast Rate"],
          },
          "body-0": { why: "Teleport e magic find por nível." },
          "helm-0": { why: "+2 skills com um facet de fogo.", lookFor: ["2 sockets"] },
          "gloves-0": { why: "+1 em Fire Skills." },
          "belt-0": { why: "+1 skills, 20% de velocidade de conjuração." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "+1 em todas as skills." },
          "ring2-0": {
            label: "Anel raro: 10% de Faster Cast Rate, duas resistências, vida",
            why: "O último slot.",
            lookFor: ["10% de Faster Cast Rate", "Duas resistências em 20+", "Vida"],
          },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { label: "Hellfire Torch (Sorceress)", why: "+3 skills de Sorceress, 20 em todas as resistências." },
          { label: "Annihilus", why: "+1 em todas as skills." },
          { label: "Grand charms de skills de fogo com vida", why: "O resto do inventário." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "Escudo para a troca." }],
      },
    },
  },

  "lightning-fury-amazon": {
    summary:
      "Uma javelin arremessada enche a tela de raios. A limpeza de área mais rápida do jogo, e um botão de boss na mesma barra.",
    playstyle:
      "Você arremessa uma javelin no meio de um grupo e ela se divide em raios que perseguem tudo dentro de um raio de quinze. Pierce é o que transforma isso de bom em absurdo: a javelin atravessa o alvo que acertou, e cada inimigo por quem ela passa libera outra rajada completa. Numa sala densa você aperta o botão uma vez. Aí aparece um boss, você entra em alcance corpo a corpo e aperta Charged Strike, que dispara bolts carregados da ponta da lança — e todos eles podem acertar um único alvo à queima-roupa. Dois botões, um conjunto de equipamento, e uma Valkyrie segurando a frente enquanto as duas coisas acontecem.",
    strengths: [
      "A limpeza mais rápida do jogo em áreas densas — nada mais esvazia uma sala do Cow Level em um arremesso",
      "**Charged Strike está na mesma barra e no mesmo equipamento**, então a build não tem problema com boss",
      "Escala com +skills mais forte que quase tudo: cada nível de skill é mais um raio",
      "Bloqueio de verdade e uma Valkyrie, que é mais sobrevivência do que qualquer caster tem",
      "A Titan's Revenge se repõe sozinha, então a build não custa nada para rodar depois de pronta",
    ],
    weaknesses: [
      "Imunidade a raio é comum no Hell e a build não tem mastery para reduzi-la",
      "**Velocidade de ataque não dá para planejar por um número único** — os frames dependem da javelin, da skill e de você estar arremessando ou golpeando, então esta página declara isso por arma em vez de publicar um breakpoint de Amazon",
      "Fraca até ter −resistência a raio do inimigo vinda de algum lugar: um Griffon's Eye, uma Thunderstroke ou um Infinity",
      "Divide atributos em três, coisa que nenhuma caster precisa fazer",
      "Grupos lightning enchanted são o que tem mais chance de matá-la, e é a própria resistência ao elemento dela que a salva",
    ],
    flexPoints: [
      "**O plano gasta 109 dos 110 pontos fixos que um personagem nível 99 tem.** Abaixo do 99, a ordem acima é a ordem para cortar de baixo para cima: os doze pontos de Lightning Strike são o bloco flexível.",
      "**Mais pontos em Pierce normalmente é a resposta errada.** Um Razortail são 33% por um slot de cinto, e a curva da própria skill é decrescente entre 10% e 100%. Consiga o cinto primeiro e releia o seu total antes de gastar.",
      "Pontos extras depois do Lightning Strike vão para **Decoy** — ele aumenta a vida da Valkyrie — ou para **Critical Strike**, que não faz nada pelo seu raio e faz tudo pelo Jab que você aperta num imune a raio.",
    ],
    statPlan: {
      strength: "O suficiente para o seu equipamento, e aqui é um número de verdade — um Thundergod's Vigor pede 110 e um Stormshield pede 156. Decida o cinto e o escudo antes de gastar.",
      dexterity:
        "O suficiente para bloqueio máximo com o escudo que você escolheu, e o suficiente para segurar a javelin. Uma Thunderstroke pede 151 de Dexterity sozinha.",
      vitality: "Todo o resto. A Amazon ganha 3 de vida por ponto, metade a mais do que uma Sorceress.",
      energy: "Nenhum. A mana vem de um mercenário com Insight e do roubo na javelin.",
      notes: [
        "**Esta classe paga por três atributos onde uma caster paga por um.** Strength pelo cinto e pelo escudo, Dexterity pela arma e pelo bloqueio, Vitality por todo o resto — e as próprias javelins têm requisitos altos de Dexterity.",
        "Vale a pena alcançar o bloqueio máximo. A Amazon divide a tabela de bloqueio com o Paladin, então o custo em Dexterity é bem menor do que seria numa caster.",
        "Não persiga os 156 de Strength de um Stormshield cedo. Um Ancient's Pledge ou um Lidless Wall custa uma fração disso e as resistências importam mais que o bloqueio antes do Hell.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "A tabela de recuperação de golpe da Amazon é uma das mais generosas do jogo, e 32% é o ponto em que ela deixa de te custar um arremesso inteiro. Alcançável só com uma armadura Peace.",
      "fhr-52":
        "Vale pegar se cair naturalmente do equipamento que você já queria. Não vale comprar por si só.",
      "fbr-32":
        "A meta padrão na tabela de Paladin, Amazon e Assassin. Um escudo do qual você não se recupera rápido é um escudo que te mata enquanto bloqueia.",
    },
    skillNotes: {
      "lightning-fury":
        "**Dois raios no nível 1 e mais um por nível**, com raio de busca 15. A build inteira.",
      "charged-strike":
        "A metade de alvo único deste personagem, não uma build separada. A contagem de bolts sobe a cada cinco níveis, e todos podem acertar um único alvo à queima-roupa.",
      "lightning-bolt":
        "Alimenta o Lightning Fury a +1% por nível e o Charged Strike a +14% por nível. O melhor gasto ponto a ponto do plano.",
      "power-strike":
        "As mesmas duas sinergias de novo. Nunca é apertada depois dos primeiros níveis — é maximizada pelo que alimenta.",
      "lightning-strike":
        "Alimenta as duas skills principais, e é uma corrente corpo a corpo utilizável por si só. É aqui que vão os pontos restantes.",
      jab: "Pré-requisito do Power Strike, e o ataque físico que você aperta num imune a raio.",
      "poison-javelin": "Pré-requisito do Lightning Bolt. Um ponto, e nunca apertada.",
      "plague-javelin": "Pré-requisito do Lightning Fury. Um ponto.",
      valkyrie: "Ela segura a frente enquanto você arremessa. Um ponto mais os seus +skills bastam.",
      decoy:
        "**Pontos fixos aqui aumentam a vida da Valkyrie**, e esse é o motivo de gastar mais que um. Também é um corpo em que os inimigos atiram no seu lugar.",
      evade: "Pré-requisito da Valkyrie, e uma chance de desviar de ataques em movimento.",
      avoid: "Pré-requisito do Evade. Uma chance de desviar de ataques à distância parada.",
      dodge: "Pré-requisito do Avoid, e a metade corpo a corpo da mesma passiva.",
      "slow-missiles":
        "Pré-requisito do Decoy, e um dos botões defensivos mais fortes do jogo por um ponto.",
      "inner-sight": "Pré-requisito do Slow Missiles.",
      pierce:
        "**Um ponto, porque um Razortail fornece 33% por um slot de cinto.** Leia o artigo de Pierce antes de gastar mais — a chance do equipamento e a da skill são um pool só.",
      penetrate:
        "Pré-requisito do Pierce, e attack rating de que você genuinamente precisa para o Charged Strike.",
      "critical-strike":
        "Pré-requisito do Penetrate. Não vale nada para o Charged Strike, que não causa dano físico.",
    },
    immunityPlan:
      "Imunidade a raio é o único problema real da build e a Amazon **não tem mastery para reduzir a resistência do inimigo** — a resposta inteira precisa vir do equipamento, do mercenário ou de um segundo tipo de dano. Na ordem do que a maioria dos jogadores de fato alcança: o **Griffon's Eye** dá −15-20% de resistência a raio do inimigo, aplicados antes da checagem de imunidade; a **Thunderstroke** dá mais −15% e empilha com ele; o **Infinity no mercenário** é o que de fato quebra a imunidade, via Conviction, e é o que transforma Travincal e a Worldstone Keep de zonas ruins em zonas boas. Antes de qualquer um desses, a resposta honesta é **Jab** — um ataque físico, na barra desde o nível 1, com uma Valkyrie segurando o alvo enquanto ele trabalha. Um sunder charm **Crack of the Heavens** é a solução direta e o mais caro dos seis para carregar: ele remove 70 a 90 pontos da resistência que te protege de grupos lightning enchanted, que são justamente o que tem mais chance de matar esta build.",
    mercenaryNotes:
      "O mercenário do Ato 2, contratado no Nightmare, e o item que esta build espera é dele: um **Infinity**, cuja aura Conviction reduz a resistência a raio do inimigo o bastante para quebrar a maior parte da imunidade a raio que ocorre naturalmente. Antes disso existir, dê a ele um **Insight** pela mana — uma Amazon de javelin arremessa sem parar e não tem Warmth — e um **Fortitude** ou **Treachery** com um **Vampire Gaze** para mantê-lo de pé. Pegue **Might** pelo dano físico que mata o que você não consegue tocar, ou **Holy Freeze** se você preferir que nada chegue perto.",
    farmingWhy: {
      "secret-cow-level-hell":
        "A sala mais densa do jogo e nada lá é imune a raio. Um arremesso limpa uma tela; esta é a zona pela qual a build existe.",
      "chaos-sanctuary-hell":
        "Nível de área 85 e a zona mais densa do jogo, que é o que o Lightning Fury quer. Ela também carrega imunidade a raio na população comum, então é uma boa zona antes do Infinity e uma ótima depois. O Charged Strike dá conta do Diablo sem trocar de equipamento.",
      "throne-of-destruction-hell":
        "Cinco ondas densas numa sala só, que é o formato contra o qual o Lightning Fury é melhor, e o Charged Strike mata o Baal na mesma barra. Imunidade a raio é comum nas ondas, então Jab ou um Infinity decidem o quanto a run flui.",
      "worldstone-keep-hell":
        "Nível de área 85 e muito denso. Imunidade a raio aparece aqui, então esta é uma zona de Infinity, não uma zona de início.",
      "pit-hell":
        "Nível de área 85, curto, e sem boss para enfrentar. Ele tem imunes a raio, então antes do Infinity esta é uma zona que você limpa apertando Jab nos intervalos, não uma que você limpa numa passada só.",
      "travincal-hell":
        "O Council é imune a raio. Sem Infinity esta é uma zona de Jab e não vale o seu tempo; com Infinity vira uma das runs mais rápidas do jogo.",
      "countess-hell":
        "Runas para o Infinity que você está montando. Curto, e nada na torre resiste a raio de forma significativa.",
    },
    levelingPath: {
      summary:
        "**Não tente evoluir como esta build.** O Lightning Fury abre no 30 e o Charged Strike no 18, então os primeiros dezoito níveis são Jab e Power Strike com qualquer javelin que um vendedor tenha. Nada disso é desperdiçado — o Power Strike é uma sinergia de 14% para as duas skills para as quais você está indo — mas o personagem só parece uma Javazon a partir do nível 30, e só parece forte quando o Lightning Bolt estiver bem entrado nos vinte.",
      respecAt:
        "Normalmente nunca. Se você evoluiu com pontos espalhados por Impale e Fend, o respec da Den of Evil no começo do Nightmare recupera tudo.",
    },
    selfFoundNotes:
      "Genuinamente boa, até certo ponto. Peace, Spirit, Lore e Ancient's Pledge são todos runas da Countess; Titan's Revenge, Harlequin Crest, Mara's Kaleidoscope e Razortail caem todos no Hell e nenhum deles é raro. O que o solo self-found não alcança é a −resistência a raio do inimigo: um Griffon's Eye é um elmo elite de nível 76 e um Infinity é uma Ber e uma Jah. Uma Lightning Fury Amazon self-found é um personagem muito rápido que farma o Cow Level, o Chaos Sanctuary e o Pit, e aperta Jab nas coisas que não consegue ferir. Isso é um personagem de verdade, e vale dizer isso em vez de fingir que o endgame está mais perto do que está.",
    hardcoreNotes:
      "Melhor do que parece. Bloqueio de verdade, uma Valkyrie, um Decoy e as passivas de Dodge fazem deste um dos personagens mais resistentes do jogo — e Slow Missiles por um ponto é quase injusto contra os grupos à distância do Hell. O perigo específico é **lightning enchanted**, porque é a sua própria resistência a raio que te salva e nenhuma aura te protege disso. Pegue o **Thundergod's Vigor** pela resistência máxima a raio elevada e pelo absorb, mantenha 75% em tudo antes do Hell, e não carregue um Crack of the Heavens. Prefira Holy Freeze no mercenário em vez de Might.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30, onde o Lightning Fury existe.",
        nextUpgrade:
          "Nível 30, e então as duas skills que fazem disto uma build em vez de um personagem: Lightning Fury e, a partir do 18, Charged Strike.",
        notes:
          "**Você ainda não é uma Lightning Fury Amazon e nem está perto.** O Lightning Fury abre no 30 e o Charged Strike no 18, então o primeiro ato e meio é Jab e Power Strike. Cada ponto gasto no Power Strike é uma sinergia que você mantém, então nada aqui é desperdiçado.",
        picks: {
          "weapon-0": {
            label: "Qualquer javelin com +Javelin and Spear Skills",
            why: "Vendedores no Ato 1 e no Ato 2 vendem javelins mágicas, e um +3 numa skill de javelin em uma delas vale mais que qualquer rolagem de dano neste nível.",
            lookFor: ["+2-3 Javelin and Spear Skills", "Replenishes Quantity"],
          },
          "offhand-0": {
            why: "Resistências por três runas da Countess, numa classe que de fato consegue usar escudo.",
          },
          "body-0": {
            why: "25% de Faster Hit Recovery e 25% de Faster Run/Walk no nível 17, por duas runas comuns.",
          },
          "body-0-alt0": {
            why: "+2 skills de Amazon no nível 29, que é o maior upgrade único disponível antes do Hell.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas que a Countess derruba sem parar." },
        },
      },
      nightmare: {
        goal: "As duas skills principais online, e a primeira javelin de verdade.",
        nextUpgrade:
          "Um Insight para o mercenário, e depois resistências em 75% antes de entrar no Hell.",
        notes:
          "**Velocidade de ataque começa a importar aqui, e não dá para ler num número só.** Os frames que você recebe dependem da velocidade base da própria javelin, de você estar arremessando o Lightning Fury ou golpeando com o Charged Strike, e do resto do seu equipamento — uma Titan's Revenge e uma Matriarchal Javelin não se comportam igual na mesma porcentagem. Busque velocidade de ataque no amuleto e nas luvas, e julgue pelo tato na arma que você de fato segura.",
        picks: {
          "weapon-0": {
            why: "+2 skills de Amazon e mais +2 na aba Javelin and Spear, numa javelin que se repõe sozinha. O item que esta build espera.",
          },
          "offhand-0": {
            why: "+2 skills e até +112 de mana num escudo, que são quatro níveis de skill de raios ao lado da javelin.",
            sockets: "Tal, Thul, Ort e Amn num escudo de 4 sockets.",
          },
          "body-0": { why: "+2 skills de Amazon e 20% de Faster Hit Recovery por três runas baratas." },
          "helm-0": { why: "+1 skills e magic find até aparecer algo melhor." },
          "belt-0": {
            why: "33% de Piercing Attack por 20 de Strength. No Lightning Fury isso multiplica em vez de somar.",
          },
          "ring1-0": {
            why: "Cannot Be Frozen, mais Dexterity que conta para o bloqueio e para o requisito da javelin.",
          },
        },
        charms: [{ why: "O caminho mais barato para 75% antes de o Hell começar." }],
      },
      "early-hell": {
        goal: "Fechar as resistências e conseguir a primeira −resistência a raio do inimigo.",
        nextUpgrade:
          "Um Griffon's Eye, ou um Infinity para o mercenário. Até um dos dois existir, a imunidade a raio decide onde você pode farmar.",
        notes:
          "**É aqui que aparece o único problema real da build.** Imunidade a raio é comum no Hell e nada na árvore da Amazon reduz a resistência do inimigo — ela não tem mastery. O Jab está na barra exatamente por isso, e não é piada: um ataque físico com uma Valkyrie na sua frente mata um imune a raio devagar e com segurança.",
        picks: {
          "weapon-0": {
            why: "Ainda a javelin certa. Replenishes Quantity é o que torna uma build de arremesso jogável.",
          },
          "offhand-0": { why: "+2 skills, e o bloqueio que a tabela da Amazon deixa barato." },
          "offhand-0-alt0": {
            why: "35% de redução de dano e bloqueio enorme, a 156 de Strength. Só pegue quando a Strength já estiver paga.",
          },
          "body-0": { why: "+2 skills de Amazon, e custa três runas em vez de uma fortuna." },
          "body-0-alt0": {
            why: "Cannot Be Frozen e resistências pesadas, se você preferir não segurar um Raven Frost.",
          },
          "helm-0": {
            why: "+2 skills, vida por nível e 10% de redução de dano com apenas 50 de Strength.",
          },
          "belt-0": {
            why: "+3 Lightning Fury e +3 Lightning Strike, mais o lightning absorb que te mantém viva dentro do seu próprio elemento.",
          },
          "belt-0-alt0": {
            why: "Volte para este na limpeza densa — o pierce vale mais que as skills quando a sala está cheia.",
          },
          "amulet-0": {
            why: "+2 em todas as skills e até +30 em todas as resistências, que são dois problemas num slot só.",
          },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity." },
          "boots-0": {
            why: "Vida, Dexterity para o bloqueio, e resistência máxima a fogo elevada.",
          },
        },
        charms: [{ why: "Mantenha 75% nas quatro resistências." }],
      },
      budget: {
        goal: "−resistência a raio do inimigo, e o dano de verdade da build.",
        nextUpgrade:
          "Infinity no mercenário. É a diferença entre escolher suas zonas e não precisar escolher.",
        picks: {
          "weapon-0": { why: "Mantida para limpar, porque se repõe sozinha." },
          "weapon-0-alt0": {
            why: "−15% de resistência a raio do inimigo e até +4 skills de Javelin and Spear, ao custo de reabastecer na mão. Muita gente carrega as duas.",
          },
          "helm-0": {
            why: "**−15-20% de resistência a raio do inimigo**, aplicados antes da checagem de imunidade, mais dano de skills de raio. O maior upgrade único de dano que a build faz.",
            lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
          },
          "offhand-0": { why: "+2 skills e bloqueio, ainda imbatível pelo preço." },
          "body-0": {
            why: "+200% de Enhanced Damage e +15 em todas as resistências. O Enhanced Damage não faz nada pelos seus raios, mas a defesa e as resistências fazem.",
          },
          "body-0-alt0": {
            why: "+2 skills e +65 em todas as resistências — a escolha melhor se o que está falhando forem as resistências.",
          },
          "belt-0": { why: "33% de pierce para limpar. Troque para o Thundergod's Vigor num boss." },
          "gloves-0": {
            label: "Luvas raras ou craftadas com 20% de Increased Attack Speed",
            why: "A velocidade de ataque mais barata do personagem, num slot sem nenhum unique que valha o espaço.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências"],
          },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity." },
          "ring2-0": { why: "+1 em todas as skills, que nesta build é mais um raio." },
          "boots-0": { why: "Magic find enquanto você limpa, e Strength para o cinto." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon, que são três raios a mais." },
          { why: "Níveis de skill diretos, no slot que não tem nada melhor para fazer." },
        ],
        weaponSwap: [
          { why: "Battle Orders antes da luta, num personagem que apanha." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "Infinity, e nada mais que seja imune.",
        nextUpgrade: "Uma rolagem melhor de Griffon's, mais lightning facets, e charms de skill.",
        picks: {
          "weapon-0": {
            why: "−15% de resistência a raio do inimigo em cima do Griffon's Eye e do Infinity. Três fontes empilham, e esta é a que você empunha.",
            lookFor: ["+4 Javelin and Spear Skills"],
          },
          "weapon-0-alt0": {
            why: "Guardada no cinto para sessões longas de limpeza, porque se repõe.",
          },
          "helm-0": {
            why: "−20% de resistência a raio do inimigo e +15% de dano de skills de raio, com um lightning facet encaixado.",
            sockets: "Um Rainbow Facet de raio.",
          },
          "offhand-0": {
            why: "35% de redução de dano e o melhor bloqueio do jogo, agora que a Strength é pagável.",
          },
          "offhand-0-alt0": {
            why: "Mantenha se os dois níveis de skill importarem mais que a redução de dano.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências, o que paga pelo Griffon's e pelo Infinity juntos.",
          },
          "belt-0": { why: "33% de pierce. Ainda o cinto de limpeza." },
          "gloves-0": {
            label: "Luvas raras ou craftadas: 20% de Increased Attack Speed, resistências",
            why: "Velocidade de ataque e as últimas resistências de uma vez.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 20+"],
          },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen, mais Dexterity e attack rating de graça." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find, ou Waterwalk se a vida importar mais." },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Raios e vida na mesma fileira." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "Depois deste ponto só sobra nível de skill para comprar: rolagens melhores de charm, um segundo lightning facet, e a Torch. **Velocidade de ataque é a única coisa que ainda vale testar em vez de ler** — os frames diferem entre arremessar o Lightning Fury e golpear com o Charged Strike, e entre uma Ceremonial e uma Matriarchal Javelin, então o total certo é o que parecer mais rápido na arma que você de fato segura.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de +4 Javelin and Spear. A javelin de limpeza fica no cinto para sessões longas.",
            lookFor: ["+4 Javelin and Spear Skills", "+200% Enhanced Damage"],
          },
          "helm-0": {
            why: "Uma rolagem de −20% e +15% com um lightning facet dentro.",
            lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
          },
          "offhand-0": {
            why: "Redução de dano e bloqueio, com um lightning facet encaixado.",
          },
          "body-0": {
            why: "Teleport, que muda a forma como a build farma mais que qualquer upgrade de dano restante.",
          },
          "body-0-alt0": {
            why: "Mantenha enquanto as resistências forem a restrição que aperta.",
          },
          "belt-0": { why: "33% de pierce, ainda imbatível no slot para limpar." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, duas resistências, vida",
            why: "O único slot onde um craft vence qualquer unique.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "Carregado só onde o Infinity não alcança. Leia a página dele antes — a penalidade cai justamente na resistência que te mantém viva.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
    },
  },

  "lightning-strike-amazon": {
    summary:
      "Uma javelin corpo a corpo que encadeia raios entre tudo que está por perto, com a skill de alvo único mais forte do jogo na mesma barra.",
    playstyle:
      "Você luta em alcance corpo a corpo com uma javelin e um escudo. O Lightning Strike acerta o que está na sua frente e inicia uma corrente que salta entre inimigos próximos — dois saltos no nível 1 e mais um por nível, e ela pode voltar num alvo que já atingiu, e é por isso que ela supera o Lightning Fury em grupos espalhados. Aí Charged Strike para o que precisa morrer agora: bolts da ponta da lança, e todos podem acertar um único alvo à queima-roupa. Uma Valkyrie segura a frente, um Decoy leva as flechas, e a sua chance de bloqueio faz o resto.",
    strengths: [
      "**Charged Strike é a skill de alvo único mais forte do jogo** e esta build é montada em torno de segurá-la",
      "O Lightning Strike entrega o dano da arma além do próprio, então um imune a raio ainda leva alguma coisa",
      "Alcance corpo a corpo com escudo de verdade, uma Valkyrie e um Decoy — mais resistente que qualquer caster",
      "A corrente pode voltar num alvo que já acertou, o que combina com grupos espalhados",
      "Sem pierce, sem projétil, sem imposto de posicionamento: você acerta o que está na sua frente",
    ],
    weaknesses: [
      "Você está em alcance corpo a corpo com a menor reserva de vida entre as classes de melee",
      "**Attack rating é uma restrição real** — as duas skills rolam contra ele, e a Amazon não tem Blessed Aim",
      "O Charged Strike não entrega absolutamente nada num imune a raio",
      "A velocidade de limpeza é uma fração da build de arremesso; este é um personagem de boss que limpa de forma aceitável",
      "**Velocidade de ataque também não tem número único aqui** — arremessar e golpear usam animações diferentes, então a meta depende da javelin e da skill",
    ],
    flexPoints: [
      "**O plano gasta 109 de 110.** O Penetrate é o bloco ajustável: corte em direção a um ponto se o seu attack rating já estiver bom pelo equipamento, e gaste a diferença em Decoy ou Critical Strike.",
      "**Não pegue Pierce.** As duas skills principais são corpo a corpo e nada sai da arma — a chance é desperdiçada. Esta é a maior diferença em relação ao plano da build de arremesso.",
      "**Critical Strike vale mais aqui do que em qualquer outra Amazon**, porque o Lightning Strike carrega o dano físico da arma. Se você estiver com uma javelin de dano alto, pontos aqui são dano de verdade em vez de pré-requisito.",
    ],
    statPlan: {
      strength: "O suficiente para o escudo e o cinto que você escolheu. Um Stormshield são 156 e um Thundergod's Vigor são 110.",
      dexterity:
        "O suficiente para bloqueio máximo, e o suficiente para a javelin — uma Thunderstroke pede 151 sozinha. Esta é a build em que Dexterity não é opcional.",
      vitality: "Todo o resto, e é a diferença entre lutar corpo a corpo e morrer nisso.",
      energy: "Nenhum.",
      notes: [
        "**Bloqueio máximo importa mais aqui do que em qualquer outra Amazon**, porque esta é a única que fica em alcance corpo a corpo por escolha de projeto. A Amazon divide a tabela de bloqueio com o Paladin, então dá para pagar.",
        "Dexterity também aumenta o attack rating e o dano da arma, então, ao contrário do que acontece numa caster, aqui ela nunca é um atributo morto.",
        "Roubo de vida não é um atributo que você compra com pontos, mas é um que você precisa ter. Dracul's Grasp, uma Titan's Revenge ou um Andariel's Visage — escolha ao menos um antes do Hell.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "Um personagem corpo a corpo preso em recuperação de golpe é um personagem morrendo. Aqui isso não é opcional como é na build de arremesso.",
      "fhr-52":
        "Alcançável com um Shael num escudo ou uma armadura Peace mais botas, e vale os sockets num personagem em alcance corpo a corpo.",
      "fbr-32":
        "O bloqueio é a sobrevivência desta build, e bloquear te prende numa animação. 32% é onde essa animação deixa de ser um problema.",
    },
    skillNotes: {
      "lightning-strike":
        "**Dois saltos de corrente no nível 1 e mais um por nível.** O golpe em si entrega o dano completo da arma mais o raio da skill.",
      "charged-strike":
        "O botão de boss. A contagem de bolts sobe a cada cinco níveis e todos podem acertar um alvo à queima-roupa.",
      "power-strike":
        "+14% de dano por nível para as duas skills principais. Maximizada pelo que alimenta, não pelo que faz.",
      "lightning-bolt":
        "Os outros 14% por nível no Charged Strike, e 11% por nível no Lightning Strike.",
      penetrate:
        "**35% de attack rating no nível 1 e +10% por nível.** As suas duas skills rolam contra attack rating e a Amazon não tem aura para consertar isso. Pontos fixos aqui também aumentam o da Valkyrie.",
      jab: "Pré-requisito do Power Strike, e o ataque puramente físico que você aperta num imune a raio.",
      "poison-javelin": "Pré-requisito do Lightning Bolt. Nunca apertada.",
      "plague-javelin": "Pré-requisito do Lightning Fury, pego só pelo ponto abaixo dele.",
      "lightning-fury":
        "**Um ponto, como botão de limpeza à distância.** Com os seus +skills ele resolve um corredor no qual você preferiria não entrar. Maximizar é outra build — veja a página do Lightning Fury.",
      valkyrie: "Ela segura o alvo enquanto você golpeia. Um ponto mais +skills.",
      decoy:
        "Pontos fixos aqui aumentam a vida da Valkyrie, e um Decoy é no que os grupos à distância atiram no seu lugar.",
      evade: "Pré-requisito da Valkyrie, e esquiva em movimento.",
      avoid: "Pré-requisito do Evade.",
      dodge:
        "Pré-requisito do Avoid, e a metade corpo a corpo da passiva — que aqui importa mais que em qualquer outra Amazon.",
      "slow-missiles":
        "Pré-requisito do Decoy, e o melhor botão defensivo do jogo por um ponto.",
      "inner-sight":
        "Pré-requisito do Slow Missiles, e ele reduz a defesa de tudo em volta de você.",
      "critical-strike":
        "Pré-requisito do Penetrate. Ele dobra dano **físico**, então ajuda a metade de arma do Lightning Strike e não faz nada pelo Charged Strike.",
    },
    immunityPlan:
      "Esta build lida melhor com imunidade a raio do que a de arremesso, e o motivo é uma diferença em como as duas skills são construídas. **O Lightning Strike entrega o dano físico completo da arma além do próprio raio**, então um imune a raio ainda leva a metade da arma — com um Fortitude, um Gore Rider e um mercenário com Might, essa metade é substancial. **O Charged Strike não entrega dano de arma nenhum**; contra um imune a raio ele literalmente não faz nada, e é por isso que o Jab fica na barra. Os upgrades são os mesmos de toda Amazon de raio: **Griffon's Eye** e **Thunderstroke** pela −resistência do inimigo aplicada antes da checagem de imunidade, e **Infinity no mercenário** pela Conviction que de fato a quebra. Um **Crack of the Heavens** funciona e custa 70 a 90 pontos da resistência que te protege de grupos lightning enchanted — uma troca pior em alcance corpo a corpo do que à distância.",
    mercenaryNotes:
      "O mercenário do Ato 2 com **Might**, porque o dano físico dele é o que mata os imunes a raio que o seu Charged Strike não toca — e porque Might aumenta o dano da sua própria arma, que o Lightning Strike carrega e a build de arremesso não. Dê a ele um **Insight** pela mana cedo e um **Infinity** eventualmente; Conviction é a única coisa que de fato quebra imunidade a raio. **Holy Freeze** é a escolha de Hardcore, e é uma escolha mais forte aqui do que numa build à distância: tudo que está lento é uma coisa que não chega ao seu alcance.",
    farmingWhy: {
      "chaos-sanctuary-hell":
        "Nível de área 85, denso o bastante para a corrente e cheio dos alvos únicos para os quais o Charged Strike existe. Ele tem imunes a raio, que o Lightning Strike ainda fere com a metade de arma e o Charged Strike não toca de jeito nenhum. Cuidado com Iron Maiden dos Oblivion Knights — ela reflete a metade física de cada golpe.",
      "throne-of-destruction-hell":
        "O Charged Strike é a melhor resposta ao Baal no jogo, e as ondas ficam próximas o bastante para a corrente alcançar. As ondas carregam imunidade a raio, então a metade de arma do Lightning Strike e um mercenário com Might fazem essa parte do trabalho.",
      "pindleskin-hell":
        "Runs de dez segundos contra um alvo único de monstro nível 86. É o formato contra o qual o Charged Strike é melhor, e não há nada para limpar.",
      "nihlathak-hell":
        "Uma run curta até um alvo perigoso. Mantenha distância das Vipers em vez do homem — o Charged Strike o mata em poucos golpes.",
      "secret-cow-level-hell":
        "Nada aqui é imune a raio e a densidade combina com a corrente. Mais lento que a build de arremesso, mas perfeitamente seguro com o escudo levantado.",
      "worldstone-keep-hell":
        "Nível de área 85 e a melhor experiência do jogo. Imunidade a raio é comum, então esta é uma zona de Infinity ou uma zona de Jab.",
      "travincal-hell":
        "O Council é imune a raio e bate forte corpo a corpo. Não é zona para esta build antes de o Infinity existir.",
    },
    levelingPath: {
      summary:
        "O Charged Strike no 18 é cedo o bastante para esta build genuinamente evoluir como ela mesma a partir do meio do Normal. Antes disso é Jab e Power Strike, e nenhum dos dois é desperdiçado — o Power Strike é uma sinergia de 14% e o Jab nunca sai da barra. **O Lightning Strike só existe a partir do nível 30**, então a corrente chega tarde; isso é esperado, não um erro na sua distribuição.",
      respecAt:
        "Normalmente nunca. Guarde os tokens da Den of Evil para uma mudança de ideia em vez de uma correção.",
    },
    selfFoundNotes:
      "Razoável. Titan's Revenge, Vampire Gaze, String of Ears, Gore Rider e Raven Frost são todos drops comuns do Hell, e Peace e Spirit são runas da Countess. Dracul's Grasp é o único item pelo qual vale sair do caminho e ele é encontrável. O que o solo self-found não fornece é −resistência a raio do inimigo, o que significa que o Charged Strike para de funcionar contra uma fatia crescente do Hell enquanto o Lightning Strike continua entregando a metade física. Uma versão self-found desta build é uma Amazon física corpo a corpo com um bônus de raio, e funciona — só não é o personagem apaga-boss que a versão de endgame é.",
    hardcoreNotes:
      "Jogável e exigente. Você está em alcance corpo a corpo com a menor reserva de vida entre os personagens de melee, então o plano inteiro é bloqueio, recuperação de golpe e roubo de vida: alcance 32% de Faster Block Rate e 32% de Faster Hit Recovery antes do Hell, segure um Stormshield, e coloque um Dracul's Grasp o quanto antes — Life Tap ao golpear vale mais que qualquer quantidade de defesa bruta. **Iron Maiden é a assassina específica.** Os Oblivion Knights no Chaos Sanctuary refletem dano físico, e o Lightning Strike carrega uma metade física, então um grupo amaldiçoado pode encerrar o personagem. Fique atenta à maldição e saia de dentro dela. Holy Freeze no mercenário, não Might.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 18 e ao Charged Strike, e depois ao 30 pelo Lightning Strike.",
        nextUpgrade: "Nível 30 pelo Lightning Strike, e uma javelin com dano de verdade.",
        notes:
          "Jab e Power Strike carregam os primeiros dezoito níveis. Os dois ficam: o Jab permanece na barra para sempre como resposta a um imune a raio, e cada ponto de Power Strike é uma sinergia de 14% para as duas skills para as quais você está indo.",
        picks: {
          "weapon-0": {
            label: "Qualquer javelin ou spear com +Javelin and Spear Skills",
            why: "Uma javelin mágica de vendedor com +3 numa skill vence qualquer rolagem de dano que você vá ver antes do Nightmare.",
            lookFor: ["+2-3 Javelin and Spear Skills"],
          },
          "offhand-0": {
            why: "Resistências por três runas da Countess, e um escudo com o qual você vai bloquear o tempo todo.",
          },
          "body-0": {
            why: "25% de Faster Hit Recovery a partir do nível 17, que num personagem corpo a corpo é o atributo que te mantém viva.",
          },
          "body-0-alt0": {
            why: "+2 skills de Amazon e mais 20% de recuperação de golpe no nível 29.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
        },
      },
      nightmare: {
        goal: "As duas skills online, roubo de vida no lugar, e um escudo que valha bloquear.",
        nextUpgrade: "Um Insight para o mercenário, e resistências no teto antes de o Hell começar.",
        notes:
          "**Velocidade de ataque começa a importar e não existe um número único de Amazon para mirar.** Golpear com Charged Strike e arremessar Lightning Fury não usam a mesma animação, e uma Ceremonial Javelin não é uma Matriarchal. Pegue velocidade de ataque onde ela é de graça — Highlord's Wrath, Andariel's Visage, luvas — e julgue o resultado na arma que você de fato segura.",
        picks: {
          "weapon-0": {
            why: "+4 níveis de skill entre as duas linhas, 5-9% de roubo de vida, e 20 de Dexterity para o bloqueio. A melhor javelin corpo a corpo disponível tão cedo.",
          },
          "offhand-0": {
            why: "+2 skills e mana no slot com que você bloqueia.",
            sockets: "Tal, Thul, Ort e Amn num escudo de 4 sockets.",
          },
          "body-0": {
            why: "+2 skills de Amazon, +2 Critical Strike e 20% de Faster Hit Recovery por três runas baratas.",
          },
          "helm-0": {
            why: "Roubo de vida, roubo de mana e redução de dano — três coisas de que uma Amazon corpo a corpo precisa e não consegue na árvore dela.",
          },
          "belt-0": {
            why: "Roubo de vida e até 15% de redução de dano. O cinto de melee até o Thundergod's Vigor ficar acessível.",
          },
          "ring1-0": {
            why: "Cannot Be Frozen, attack rating e Dexterity. Velocidade de ataque reduzida por chill é pior justamente para quem fica parada golpeando.",
          },
        },
        charms: [{ why: "75% nas quatro antes do Hell, e nem um ponto a menos num personagem corpo a corpo." }],
      },
      "early-hell": {
        goal: "Fechar resistências, colocar roubo de vida num segundo slot, e alcançar bloqueio máximo.",
        nextUpgrade:
          "Um Griffon's Eye ou um Infinity, e um Fortitude pelo Enhanced Damage que a metade física de fato usa.",
        picks: {
          "weapon-0": {
            why: "Ainda a javelin certa, e o roubo de vida dela está trabalhando mais que o dano.",
          },
          "offhand-0": { why: "+2 skills e bloqueio." },
          "offhand-0-alt0": {
            why: "35% de redução de dano e o melhor bloqueio do jogo, quando os 156 de Strength estiverem pagos.",
          },
          "body-0": {
            why: "Cannot Be Frozen e resistências pesadas, num personagem que não pode se dar ao luxo de ficar lento.",
          },
          "body-0-alt0": { why: "+2 skills de Amazon se as resistências já estiverem resolvidas." },
          "helm-0": { why: "+2 skills, vida por nível e 10% de redução de dano com 50 de Strength." },
          "gloves-0": {
            why: "**Life Tap ao golpear.** Numa build que acerta várias vezes por segundo isso é quase permanente, e é o maior item de sobrevivência disponível a uma Amazon corpo a corpo.",
          },
          "belt-0": {
            why: "+3 Lightning Strike, +3 Lightning Fury, e a resistência máxima a raio elevada de que você precisa parada no meio dos grupos.",
          },
          "amulet-0": {
            why: "+1 skills, 20% de velocidade de ataque, e Deadly Strike que dobra a metade física do Lightning Strike.",
          },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds — os três se aplicam ao dano de arma que o Lightning Strike carrega.",
          },
        },
        charms: [{ why: "Mantenha 75% e some vida; as duas coisas importam mais no corpo a corpo." }],
      },
      budget: {
        goal: "Enhanced Damage na metade física, e a primeira −resistência a raio do inimigo.",
        nextUpgrade: "Griffon's Eye, e depois um Infinity no mercenário.",
        picks: {
          "weapon-0": { why: "Roubo de vida e quatro níveis de skill." },
          "weapon-0-alt0": {
            why: "−15% de resistência a raio do inimigo e até +4 skills de Javelin and Spear, a 151 de Dexterity e sem roubo de vida.",
          },
          "body-0": {
            why: "**+300% de Enhanced Damage, e aqui não é linha desperdiçada** — o Lightning Strike entrega o dano da arma, então isto é um upgrade de dano de verdade além de defensivo.",
            sockets: "El, Sol, Dol e Lo numa armadura de 4 sockets.",
          },
          "helm-0": {
            why: "+2 skills, 20% de velocidade de ataque e até 10% de roubo de vida. Pague os −30% de resistência a fogo dele em outro lugar antes de vestir.",
            sockets: "Uma runa Um, que devolve boa parte da resistência a fogo que ele tirou.",
          },
          "offhand-0": { why: "35% de redução de dano e o bloqueio que mantém esta build de pé." },
          "gloves-0": { why: "Life Tap ao golpear." },
          "belt-0": {
            why: "Seis níveis de skill entre as duas linhas de raio, mais lightning absorb.",
          },
          "amulet-0": { why: "Velocidade de ataque e Deadly Strike." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Crushing Blow contra qualquer coisa com muita vida." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon." },
          { why: "Níveis de skill, que são bolts e saltos de corrente." },
        ],
        weaponSwap: [
          { why: "Battle Orders, no personagem que mais precisa da vida." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "Os dois tipos de dano na força total, e nada que resista aos dois.",
        nextUpgrade: "Facets em cada socket, e uma rolagem melhor de Thunderstroke.",
        picks: {
          "weapon-0": {
            why: "−15% de resistência a raio do inimigo, empilhando com um Griffon's Eye e um Infinity. Agora que o Dracul's Grasp fornece o roubo de vida, abrir mão da Titan's é viável.",
            lookFor: ["+4 Javelin and Spear Skills"],
          },
          "helm-0": {
            why: "−20% de resistência a raio do inimigo e +15% de dano de skills de raio, aplicados antes da checagem de imunidade.",
            sockets: "Um Rainbow Facet de raio.",
          },
          "helm-0-alt0": {
            why: "Mantenha se o roubo de vida e a velocidade de ataque ainda estiverem te carregando.",
          },
          "offhand-0": {
            why: "Redução de dano e bloqueio, com um lightning facet encaixado.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage na metade física, e a defesa para ficar no corpo a corpo.",
          },
          "gloves-0": { why: "Life Tap ao golpear." },
          "belt-0": { why: "Seis níveis de skill e lightning absorb." },
          "amulet-0": {
            why: "Velocidade de ataque e Deadly Strike, que a metade de arma converte em dano.",
          },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": {
            why: "Crushing Blow, que é percentual e portanto melhor contra bosses.",
          },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Skills e vida juntas." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "Esta build termina com dois tipos de dano na força total e um escudo na frente dos dois. **A última decisão de verdade é Fortitude contra Chains of Honor**, e é uma decisão real: o Enhanced Damage do Fortitude alimenta a metade do Lightning Strike que acerta imunes a raio, e as resistências do Chains of Honor são o que permite usar um Griffon's Eye e um Andariel's Visage ao mesmo tempo.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de +4 Javelin and Spear com o Enhanced Damage máximo.",
            lookFor: ["+4 Javelin and Spear Skills", "+200% Enhanced Damage"],
          },
          "helm-0": {
            why: "Uma rolagem de −20% e +15%, com um lightning facet encaixado.",
            lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
          },
          "offhand-0": { why: "Redução de dano, bloqueio, e um facet no socket." },
          "body-0": {
            why: "O Enhanced Damage que a metade física gasta, e as resistências que o Griffon's custa.",
          },
          "body-0-alt0": {
            why: "Troque dano por +65 em todas as resistências se o Hell estiver te punindo em vez de te cansando.",
          },
          "gloves-0": {
            why: "Life Tap. Nada mais no slot compete numa Amazon corpo a corpo.",
          },
          "belt-0": {
            why: "Seis níveis de skill, +10% de resistência máxima a raio e 20 de absorb.",
          },
          "amulet-0": { why: "Velocidade de ataque e Deadly Strike escalando com o nível." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Crushing Blow e Open Wounds." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "Só onde o Infinity não alcança, e nunca numa zona lightning enchanted — leia a página dele antes.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
    },
  },

  "strafe-amazon": {
    summary:
      "Até dez flechas por rajada, cada uma com o dano completo do arco. A arqueira física mais pura do jogo, e a que nunca erra.",
    playstyle:
      "Você segura o botão e a Amazon dispara em tudo que estiver no alcance numa rajada só — até dez tiros, cada um escolhendo o próprio alvo, cada um carregando o dano completo do arco. Você fica presa na animação enquanto ela roda, e essa é toda a troca: uma saída enorme em troca de ficar parada. O Guided Arrow é a outra metade da barra, uma flecha que persegue o alvo e não pode errar, para o boss que a rajada não termina. Não existe dano elemental nenhum nesta build, o que faz dela a Amazon mais simples de equipar e a de fraqueza mais afiada.",
    strengths: [
      "**Dez tiros por rajada, cada um com o dano completo do arco** — a maior saída física sustentada do jogo",
      "O Strafe carrega o próprio bônus de attack rating, então ele conecta onde outras builds físicas erram",
      "O Guided Arrow não pode errar, o que transforma bosses numa questão de tempo em vez de equipamento",
      "Um tipo de dano só significa um plano de equipamento só: velocidade de ataque, dano e Deadly Strike",
      "Barata de começar — uma runeword Melody são três runas baixas e +3 na árvore inteira",
    ],
    weaknesses: [
      "**Imunidade física é a única parede, e é uma parede completa** sem Amplify Damage ou Decrepify",
      "Você fica presa na animação durante a rajada inteira, e é daí que vêm as mortes",
      "**Os tiros travam em dez no nível 7 da skill** — pontos além disso compram só dano, e muitos guias sugerem o contrário",
      "Knockback briga com a skill: um alvo empurrado para longe é um tiro que não encontra nada",
      "**Velocidade de ataque é uma pergunta por arco**, não um número de Amazon — um Hydra Bow e um Ward Bow não se comportam igual na mesma porcentagem",
    ],
    flexPoints: [
      "**O plano gasta 108 de 110.** Penetrate e Dodge são os blocos ajustáveis; mova pontos entre eles conforme você estiver errando ou morrendo.",
      "**Não empurre o Strafe além de vinte esperando mais tiros.** O teto é dez e chega no nível 7 da skill. Além disso a skill compra 5% de dano por nível, e +skills do equipamento também compram só isso.",
      "Avoid e Evade merecem mais de um ponto cada num personagem de Hardcore. Eles saem do Penetrate.",
    ],
    statPlan: {
      strength:
        "O que o arco pedir, e arcos pedem muito — um Hydra Bow são 134, um Crusader Bow 97, um Ward Bow só 72. Escolha o arco antes de gastar.",
      dexterity:
        "**Mais que em qualquer outra build do site.** Arcos têm os maiores requisitos de Dexterity do jogo, Dexterity aumenta o attack rating, e numa build física aumenta o dano também.",
      vitality: "Todo o resto. Você está à distância mas presa, e presa à distância não é seguro.",
      energy: "Nenhum. O Strafe custa 11 de mana fixos e o custo do Guided Arrow cai conforme ele sobe de nível.",
      notes: [
        "**Esta é a única Amazon em que Dexterity é um atributo de dano.** Ela aumenta o attack rating e aumenta o dano do arco, então pontos ali nunca são mortos como são numa caster.",
        "Os requisitos dos arcos são a restrição real do plano de atributos inteiro. Um Ward Bow com 72 de Strength e 146 de Dexterity, e um Hydra Bow com 134 e 167, pedem personagens completamente diferentes.",
        "Sem escudo não há bloqueio, então Vitality e recuperação de golpe são toda a defesa que você tem além da Valkyrie e das passivas.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "Um personagem preso numa animação de ataque e depois atordoado para fora dela é um personagem levando a atenção de um grupo inteiro. Este é o número a alcançar antes do Hell.",
      "fhr-52":
        "Barato nesta build — uma armadura Peace são 20% e as botas fornecem o resto.",
    },
    skillNotes: {
      strafe:
        "**Dez tiros no nível 7 da skill, e nunca mais que isso.** Pontos além disso são 5% de dano cada, o que ainda é o melhor lugar para eles.",
      "guided-arrow":
        "Uma sinergia de 10% por nível para o Strafe **e** a skill de alvo único. Ele persegue, então não pode errar — bosses e monstros em fuga, os dois.",
      "multiple-shot":
        "Uma sinergia de 5% por nível, e um cone largo para os momentos em que uma rajada desperdiçaria tiros num alvo só.",
      "critical-strike":
        "**Uma chance de dobrar dano físico, e todo o seu dano é físico.** A chance sobe em direção ao teto de 80% que as próprias colunas do jogo nomeiam; a curva entre os dois está no motor, não em nenhuma tabela.",
      penetrate:
        "**Menos do que um plano de Multiple Shot precisa**, porque o Strafe já carrega 30% de attack rating mais 9% por nível por conta própria. Dez pontos e Ignore Target's Defense no arco resolvem.",
      dodge:
        "**A passiva que mais importa nesta build.** O Strafe te prende no lugar, e o Dodge é a chance de desviar de um ataque corpo a corpo parada ou atacando.",
      pierce:
        "Um ponto. Os tiros do Strafe já escolhem alvos separados, então o pierce acrescenta menos aqui do que na build de cone — leia o artigo de Pierce.",
      "magic-arrow":
        "Pré-requisito do Multiple Shot, e um ataque sem custo de mana que nunca esvazia uma aljava.",
      "cold-arrow":
        "Pré-requisito do Guided Arrow. O chill que ele aplica é uma linha defensiva de verdade no começo.",
      valkyrie:
        "Alguma coisa na sua frente enquanto você está presa numa animação. Não é opcional nesta build.",
      decoy:
        "Pontos fixos aumentam a vida da Valkyrie, e um Decoy é no que os grupos à distância atiram em vez de em você.",
      evade: "Pré-requisito da Valkyrie, e esquiva em movimento.",
      avoid: "Pré-requisito do Evade, e esquiva de ataques à distância enquanto você atira.",
      "slow-missiles":
        "Pré-requisito do Decoy, e a resposta aos grupos à distância que punem um personagem preso no lugar.",
      "inner-sight":
        "Pré-requisito do Slow Missiles, e ele reduz a defesa de tudo em que você está atirando.",
    },
    immunityPlan:
      "**Cada ponto de dano desta build é físico, então imunidade física é uma parede completa em vez de um atraso.** Não existe mastery, facet nem aura que faça dano físico passar por uma imunidade. As quatro respostas honestas, na ordem em que a maioria as alcança: **Amplify Damage de um Atma's Scarab**, que corta pela metade a resistência física do alvo e normalmente quebra a imunidade de vez — cinco por cento por golpe é constante numa skill que dispara dez flechas por rajada; **Decrepify de um arco Wrath**, que faz o mesmo a 30% por golpe e vale manter no weapon swap; **um charm Bone Break**, a solução direta, cuja penalidade são 10 a 20 pontos da sua própria redução de dano físico em vez de uma resistência — uma troca mais barata à distância do que no corpo a corpo; e **o seu mercenário**, se você pegar o mercenário do Ato 2 com uma arma elemental em vez de um segundo Faith. Escolher zonas também funciona, e a lista de farm acima está ordenada por quanta imunidade física você vai encontrar.",
    mercenaryNotes:
      "**A Rogue do Ato 1 é a escolha incomum e a certa aqui.** Ela é a única mercenária que se beneficia de uma runeword de arco, e a aura Fanaticism do Faith se aplica a você tanto quanto a ela — então um segundo Faith na Rogue é um buff de velocidade de ataque e dano para o grupo inteiro que nenhum outro contratado consegue dar. Contrate a variante Cold pelo chill, dê a ela um **Insight** se você preferir mana, e um **Fortitude** com um **Vampire Gaze** para mantê-la de pé. **Se a imunidade física for o que está te travando, pegue o mercenário do Ato 2** e dê a ele uma arma elemental: o dano dele é o plano B que o seu não pode ser.",
    farmingWhy: {
      "pit-hell":
        "Nível de área 85, curto, e sem boss para enfrentar — a zona padrão do Strafe. Ele tem imunes a físico, então é aqui que um Atma's Scarab começa a justificar o slot, não onde dá para ignorar o problema.",
      "mausoleum-hell":
        "Nível de área 85, alcançável em segundos, e cheio dos mortos-vivos contra os quais o seu arco causa dano bônus.",
      "ancient-tunnels-hell":
        "Nível de área 85 com quase nada imune a físico — as imunidades registradas dela são fogo e veneno. Curta, fechada em si mesma, e a zona que esta build limpa mais rápido.",
      "chaos-sanctuary-hell":
        "Denso e de nível alto, e o Guided Arrow dá conta do Diablo sem trocar de equipamento. Imunidade física faz parte da população comum aqui, então traga o Amplify Damage. **Iron Maiden dos Oblivion Knights reflete uma rajada de dez tiros de volta em você** — fique atenta à maldição.",
      "pindleskin-hell":
        "Dez segundos, monstro nível 86, e um alvo único que o Guided Arrow não consegue errar.",
      "worldstone-keep-hell":
        "A melhor experiência do jogo, e imunidade física é comum o bastante para esta ser uma zona de Amplify Damage em vez de uma zona de início.",
      "travincal-hell":
        "O Council não é imune a físico e fica parado num lugar só. Uma run curta e extremamente lucrativa para um arco físico.",
    },
    levelingPath: {
      summary:
        "**Esta aqui genuinamente evolui como ela mesma**, coisa que quase nenhuma Amazon faz. Magic Arrow desde o nível 1 não custa flechas, Multiple Shot no 6 limpa, Guided Arrow no 18 mata bosses e o Strafe chega no 24 — todas são skills que a build pronta continua usando. Nada precisa ser desaprendido e nenhum respec está planejado.",
      respecAt: "Não é necessário. Guarde os três tokens da Den of Evil.",
    },
    selfFoundNotes:
      "**A melhor Amazon self-found do site.** Edge, Melody, Peace e Harmony são todas runewords de runas baixas, e só a Melody são doze níveis de skill por três runas que a Countess derruba sem parar. Widowmaker, Eaglehorn, Razortail, The Cat's Eye, Raven Frost e Gore Rider são todos achados realistas do Hell. A build funciona em cada etapa dessa progressão porque não tem nenhum limiar a atravessar — nenhuma mastery a alcançar, nenhuma −resistência a empilhar, nenhuma aura a comprar. O que o solo self-found não fornece é o Faith, e a consequência honesta é um personagem mais lento em vez de um personagem travado.",
    hardcoreNotes:
      "Ficar presa é o perigo. O Strafe te trava na animação durante a rajada inteira, então um grupo que te alcança enquanto ela roda ganha vários golpes de graça — e é por isso que o Dodge leva cinco pontos aqui em vez de um, por isso a meta de 32% de recuperação de golpe está marcada como obrigatória, e por isso a Valkyrie não é opcional. Mantenha **Slow Missiles** na barra; contra os grupos à distância do Hell é a skill defensiva de um ponto mais forte do jogo. Evite **Windforce** no Hardcore por um motivo não óbvio: knockback espalha um grupo em vez de matá-lo, e um grupo espalhado te cerca. Pegue o mercenário do Ato 2 com Holy Freeze em vez de um segundo Faith.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 24 pelo Strafe, com um arco que não te envergonhe.",
        nextUpgrade: "Nível 24 pelo Strafe, depois uma Melody no 39 e um arco de verdade depois disso.",
        notes:
          "Magic Arrow desde o nível 1 não custa flecha nenhuma, o que importa mais do que parece quando aljavas custam ouro que você não tem. Multiple Shot no 6 é o botão de limpeza até o Strafe existir no 24.",
        picks: {
          "weapon-0": {
            why: "35% de velocidade de ataque, Thorns, e um dano bônus enorme contra demônios e mortos-vivos por três runas da Countess no nível 25.",
            sockets: "Tir, Tal e Amn num arco de 3 sockets.",
          },
          "weapon-0-alt0": {
            why: "+3 na aba inteira de Bow and Crossbow mais +3 em cada um de Critical Strike, Dodge e Slow Missiles, no nível 39. Doze níveis de skill por três runas baixas.",
          },
          "body-0": {
            why: "Recuperação de golpe e velocidade de corrida no nível 17, que é do que um personagem preso no lugar mais precisa.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
          "gloves-0": {
            label: "Quaisquer luvas com Increased Attack Speed",
            why: "Velocidade de ataque é o único atributo que importa tão cedo, e vendedores vendem luvas mágicas que a carregam.",
            lookFor: ["20% Increased Attack Speed"],
          },
        },
      },
      nightmare: {
        goal: "Strafe online, velocidade de ataque subindo, e uma Valkyrie na sua frente.",
        nextUpgrade: "Um arco elite e um Fortitude. Os dois são passos grandes e nenhum é caro.",
        notes:
          "**Velocidade de ataque agora é o atributo que você está caçando, e não existe um número único para mirar.** Os frames que um arco te dá dependem da velocidade base dele e da skill que você está usando, e este site não publica uma tabela que estaria errada para a maioria dos conjuntos. Pegue velocidade de ataque onde ela for de graça e julgue pelo arco que está na sua mão.",
        picks: {
          "weapon-0": {
            why: "+3 na aba de arco inteira e +3 em Critical Strike. Nada mais neste nível chega perto pelo preço.",
            sockets: "Shael, Ko e Nef num arco de 3 sockets.",
          },
          "weapon-0-alt0": {
            why: "Uma aura de Vigor e uma Valkyrie que qualquer classe pode invocar, se você preferir movimento e dano elemental a níveis de skill.",
          },
          "body-0": {
            why: "+2 skills de Amazon, +2 Critical Strike e 20% de Faster Hit Recovery por três runas baratas.",
          },
          "helm-0": { why: "+1 skills e magic find enquanto nada melhor existir." },
          "belt-0": {
            why: "33% de Piercing Attack por 20 de Strength — cada flecha que perfura acerta a fileira atrás daquela em que você mirou.",
          },
          "amulet-0": {
            why: "20% de velocidade de ataque, 25 de Dexterity e 30% de velocidade de corrida. Numa build física de arco, cada uma dessas linhas é dano ou sobrevivência.",
          },
          "ring1-0": {
            why: "Cannot Be Frozen e até 250 de attack rating. Estar sob chill enquanto presa no lugar é a pior combinação que esta build tem.",
          },
        },
        charms: [{ why: "75% nas quatro antes do Hell." }],
      },
      "early-hell": {
        goal: "Um arco elite, resistências no teto, e o attack rating para usar os dois.",
        nextUpgrade: "Um arco Faith, ou um Wrath para os imunes a físico.",
        notes:
          "**Imunidade física começa aqui e é absoluta.** Nenhuma quantidade de dano ajuda; cada ponto dele é físico. As respostas são Amplify Damage de um Atma's Scarab, Decrepify de um arco Wrath, um charm Bone Break, ou o seu mercenário — e a lista de farm abaixo está ordenada com isso em mente.",
        picks: {
          "weapon-0": {
            why: "**Ignore Target's Defense e 33% de Deadly Strike** com apenas 72 de Strength — o jeito mais barato de parar de errar e começar a dobrar.",
          },
          "weapon-0-alt0": {
            why: "+1 skills de Amazon, Ignore Target's Defense, e dano que cresce com o seu nível. Seis sockets, que é o motivo para preferi-lo depois.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage. Numa build cujo dano é inteiramente o do arco, este é o maior upgrade disponível.",
          },
          "helm-0": { why: "+2 skills, vida por nível e 10% de redução de dano com 50 de Strength." },
          "gloves-0": {
            label: "Luvas raras ou craftadas com 20% de Increased Attack Speed",
            why: "Velocidade de ataque e resistências no slot sem nenhum unique que valha a pena.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências"],
          },
          "belt-0": {
            why: "33% de pierce, e ele está fazendo mais pelo seu dano do que qualquer cinto com resistências faria.",
          },
          "amulet-0": { why: "Velocidade de ataque, Dexterity e movimento." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "boots-0": {
            why: "Vida, Dexterity e resistência máxima a fogo elevada, num personagem sem escudo.",
          },
        },
        charms: [{ why: "Mantenha 75% e some a vida de que um personagem sem escudo precisa." }],
      },
      budget: {
        goal: "Uma aura de Fanaticism, e uma resposta à imunidade física.",
        nextUpgrade: "Um Windforce, ou uma rolagem melhor de Faith. Depois os charms.",
        picks: {
          "weapon-0": {
            why: "**Uma aura de Fanaticism no seu próprio arco**: velocidade de ataque, attack rating e dano juntos, mais +1-2 em todas as skills. A melhor arma de Strafe do jogo.",
            sockets: "Ohm, Jah, Lem e Eld num arco de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Decrepify ao golpear, que corta pela metade a resistência física e quebra a maior parte da imunidade física. Fica no swap para os grupos que o Faith não consegue ferir.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage e a defesa para a qual um personagem sem escudo não tem outra fonte.",
          },
          "helm-0": {
            why: "+2 skills, 20% de velocidade de ataque e roubo de vida. Os −30% de resistência a fogo dele precisam ser pagos antes.",
            sockets: "Uma runa Um devolve a maior parte da resistência a fogo.",
          },
          "helm-0-alt0": {
            why: "Mais seguro, mais barato, e sem penalidade de resistência para planejar em volta.",
          },
          "amulet-0": {
            why: "**Amplify Damage ao golpear**, que corta pela metade a resistência física e muitas vezes quebra a imunidade física de vez. Dez flechas por rajada aplicam isso o tempo todo.",
          },
          "amulet-0-alt0": {
            why: "Mais velocidade de ataque e Dexterity, se o mercenário estiver dando conta dos imunes.",
          },
          "gloves-0": {
            label: "Luvas raras ou craftadas: 20% de Increased Attack Speed, resistências",
            why: "A velocidade de ataque mais barata que resta no personagem.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 20+"],
          },
          "belt-0": { why: "33% de pierce, ainda o melhor dano do slot." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find e dano enquanto você farma." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon." },
          { why: "Dano no Strafe e no Guided Arrow ao mesmo tempo." },
        ],
        weaponSwap: [
          { why: "Battle Orders, num personagem sem escudo." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "O maior dano físico sustentado que o jogo permite.",
        nextUpgrade: "Um Wrath no swap, e as últimas rolagens de charm.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de Fanaticism nível 15 com +2 em todas as skills. Velocidade de ataque, attack rating e dano de um item só, numa build que precisa dos três.",
            lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
          },
          "weapon-0-alt0": {
            why: "Mais dano bruto que qualquer outra coisa do jogo — e **Knockback, que empurra alvos para fora de uma rajada de Strafe.** Uma troca de verdade, não um upgrade puro.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage, e tudo que você tem é do Enhanced Damage multiplicar.",
          },
          "helm-0": {
            why: "+2 skills, 20% de velocidade de ataque e roubo de vida, com uma Um no socket.",
          },
          "amulet-0": {
            why: "Amplify Damage ao golpear — a resposta da build à imunidade física, aplicada dez vezes por rajada.",
          },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, resistências, vida",
            why: "A última velocidade de ataque, e as resistências que o Andariel's Visage custa.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds — os três multiplicam dano físico, que é tudo que você tem.",
          },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Dano e a vida de que uma build sem escudo precisa." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "A build termina com três respostas separadas para a sua única fraqueza — Amplify Damage do amuleto, Decrepify de um Wrath no swap, e um charm Bone Break — e precisa das três só nas piores zonas. **Todo o resto que sobrou para comprar é velocidade de ataque e níveis de skill, e velocidade de ataque continua sendo uma pergunta por arco**: um Grand Matron Bow, um Ward Bow e um Hydra Bow alcançam os frames deles em totais diferentes.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de Fanaticism nível 15 e +2 em todas as skills, num Grand Matron Bow se a Dexterity permitir.",
            lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
          },
          "weapon-0-alt0": {
            why: "O arco da imunidade física, no swap. Decrepify a 30% por golpe e 20% de Crushing Blow.",
          },
          "body-0": { why: "+300% de Enhanced Damage e 200% de defesa aumentada." },
          "helm-0": {
            why: "+2 skills, velocidade de ataque e roubo de vida, com Um no socket.",
          },
          "amulet-0": { why: "Amplify Damage ao golpear." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, duas resistências, vida",
            why: "O único slot onde um craft vence qualquer unique.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Crushing Blow, Deadly Strike e Open Wounds." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "A resposta direta à imunidade física, e a única cuja penalidade é a sua própria redução de dano em vez de uma resistência. Carregado pela zona, não usado sempre.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders." },
          { why: "Trocado para um grupo imune a físico em vez de carregado no cinto." },
        ],
      },
    },
  },

  "multiple-shot-amazon": {
    summary:
      "Um cone de até vinte e quatro flechas, cada uma perfurando a fileira atrás dela. A limpeza física mais larga do jogo.",
    playstyle:
      "Você aponta a Amazon para um aglomerado e dispara um leque de flechas nele — duas no nível 1 e mais uma por nível, até vinte e quatro. As flechas vão para onde você mirou em vez de perseguirem alvos, então a skill recompensa encarar um corredor e pune atirar num monstro só em campo aberto. Pierce é o que transforma o cone numa parede: cada flecha que atravessa um alvo continua e acerta a fileira atrás, e num grupo denso essa é a diferença entre limpar uma tela e arranhá-la. O Guided Arrow é o outro botão, para o alvo único em que o cone se desperdiça.",
    strengths: [
      "**Até vinte e quatro flechas num aperto só**, coisa de que nenhuma outra skill do jogo chega perto",
      "Pierce multiplica o cone inteiro de uma vez, então um Razortail vale mais aqui do que em qualquer outra build",
      "Custa 4 de mana no nível 1 — a skill de limpeza mais barata que qualquer Amazon tem",
      "Disponível no nível 6, então o personagem fica completo bem antes de qualquer build de javelin",
      "Um tipo de dano e um plano de equipamento, sem imunidade para pensar até o Hell",
    ],
    weaknesses: [
      "**Imunidade física é uma parede completa**, exatamente como na página do Strafe e pelo mesmo motivo",
      "Cada flecha carrega três quartos do dano do arco em vez de todo ele",
      "**Só as duas flechas centrais aplicam efeitos ao acertar** — knockback, roubo de vida, Crushing Blow",
      "**Nenhum bônus de attack rating próprio**, ao contrário do Strafe, então Penetrate e Ignore Target's Defense não são opcionais",
      "Ele dispara para onde você mirou em vez de para o que está lá, então se desperdiça quase todo num alvo único",
    ],
    flexPoints: [
      "**O plano gasta 108 de 110.** Pierce é o bloco a ajustar: some um Razortail e 33% chegam de graça, então reconte antes de gastar os últimos cinco pontos aqui.",
      "**Não pegue Strafe.** Ele divide a mesma arma e as mesmas passivas, e uma build que maximiza os dois são duas meias-builds. Se o que você quer apertar é o Strafe, aquela página tem uma divisão diferente de Penetrate e Pierce por bons motivos.",
      "Se o cone estiver limpando bem e você estiver morrendo, mova os últimos pontos do Pierce para Dodge, Avoid e Evade.",
    ],
    statPlan: {
      strength: "O que o arco pedir. Uma Balista são 110 de Strength e um Ward Bow são 72 — essa diferença são trinta pontos de atributo.",
      dexterity:
        "Alta, e nunca desperdiçada: ela paga o arco, aumenta o attack rating e aumenta o dano físico.",
      vitality: "Todo o resto. Sem escudo, Vitality e recuperação de golpe são a defesa inteira.",
      energy:
        "Nenhum. O Multiple Shot custa 4 de mana no nível 1 e sobe 1 por nível — a limpeza mais barata do jogo.",
      notes: [
        "**O arco decide o plano de atributos, então escolha antes de gastar.** Um Buriza-Do Kyanon com 110 de Strength e 80 de Dexterity é um personagem completamente diferente de um Ward Bow com 72 e 146.",
        "Dexterity aumenta o dano do próprio arco além do attack rating, então nesta build ela compete com Vitality de forma honesta em vez de perder automaticamente.",
        "Não há escudo e não há bloqueio. Cada ponto que não for para requisitos pertence à Vitality.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "Você atira parada e sem escudo. Ser atordoada nessa posição é como esta build morre, e 32% é a resposta acessível.",
      "fhr-52":
        "Uma armadura Peace e botas alcançam juntas, então normalmente não custa nada que você já não fosse comprar.",
    },
    skillNotes: {
      "multiple-shot":
        "**Duas flechas no nível 1, mais uma por nível, teto 24.** Ao contrário do teto de dez tiros do Strafe, este é alto o bastante para +skills continuarem comprando flechas.",
      "guided-arrow":
        "A skill de alvo único, e a que as tabelas do jogo ligam ao Multiple Shot nos dois sentidos — uma sinergia de dano rotulada num sentido e um parâmetro de 'Damage % per level' no outro.",
      "critical-strike":
        "Uma chance de dobrar dano físico, aplicada por flecha. A chance sobe em direção ao teto de 80% que as colunas nomeiam; a curva entre os dois está no motor.",
      penetrate:
        "**35% de attack rating mais 10% por nível, e o Multiple Shot não tem bônus próprio.** Esta é a skill de que o Strafe não precisa e sem a qual esta build não vive.",
      pierce:
        "**Quinze pontos, coisa que nenhuma outra build do site gasta aqui.** Um cone de vinte e quatro flechas perfurando uma fileira a mais são vinte e quatro acertos a mais. Conte o seu Razortail primeiro — equipamento e skill são um pool só.",
      "magic-arrow": "Pré-requisito do Multiple Shot, e um tiro que não custa flecha nenhuma.",
      "cold-arrow": "Pré-requisito do Guided Arrow.",
      valkyrie: "Alguma coisa para segurar a frente do cone enquanto você atira dentro dele.",
      decoy:
        "Pontos fixos aumentam a vida da Valkyrie. Um Decoy colocado atrás de um grupo também o puxa para dentro do seu cone.",
      evade: "Pré-requisito da Valkyrie, e esquiva enquanto você se reposiciona.",
      avoid: "Pré-requisito do Evade.",
      dodge: "Pré-requisito do Avoid.",
      "slow-missiles":
        "Pré-requisito do Decoy, e a resposta a um grupo à distância que você está parada atirando.",
      "inner-sight":
        "Pré-requisito do Slow Missiles, e ele reduz a defesa de um grupo inteiro de uma vez — o que combina com um cone.",
    },
    immunityPlan:
      "Idêntico em natureza ao da página do Strafe, e diferente num detalhe. **Todo o seu dano é físico, então um imune a físico não leva absolutamente nada** — nenhuma mastery, facet ou aura faz dano físico passar por uma imunidade. As respostas são **Amplify Damage de um Atma's Scarab**, **Decrepify de um arco Wrath no swap**, **um charm Bone Break** e **a arma elemental do seu mercenário**. O detalhe que difere: **só as duas flechas centrais de um Multiple Shot aplicam efeitos ao acertar**, então um proc de maldição dispara bem menos aqui do que numa rajada de dez tiros de Strafe, em que cada tiro é um acerto separado. Isso torna o mercenário e o swap de Wrath relativamente mais importantes nesta build, e o amuleto relativamente menos.",
    mercenaryNotes:
      "**O mercenário do Ato 2, não a Rogue.** A página do Strafe recomenda um segundo Faith numa Rogue do Ato 1 e faz bem, mas esta build tem uma lacuna mais larga a cobrir: sem bônus próprio de attack rating e sem dano elemental em lugar nenhum, ela quer **Might** pelo dano bruto e um contratado cuja arma consiga ferir o que a sua não fere. Dê a ele um **Insight** cedo pela mana, e depois um **Pride** ou uma arma elemental para ele resolver os imunes a físico enquanto você limpa todo o resto. **Holy Freeze** se você preferir que nada chegue à sua posição de tiro.",
    farmingWhy: {
      "secret-cow-level-hell":
        "Uma manada enfileirada é exatamente o formato que um cone de vinte e quatro flechas quer, e a run é curta o bastante para repetir para sempre. Imunidade física aparece aqui, então o amuleto e o mercenário são o que impede isso de te travar.",
      "pit-hell":
        "Nível de área 85 e cheio de corredores curtos, que é o formato em que um cone é melhor. Ele tem imunes a físico, então esta é uma zona de Amplify Damage e não uma zona de graça.",
      "ancient-tunnels-hell":
        "Nível de área 85 e estreito. Quase nada lá resiste a dano físico, o que faz desta uma zona melhor para esta build do que para a maioria.",
      "mausoleum-hell":
        "Nível de área 85, a segundos de um waypoint, e cheio de mortos-vivos contra os quais o seu arco causa dano bônus.",
      "chaos-sanctuary-hell":
        "Denso e de nível alto, e os grupos dos selos ficam nos corredores em que um cone é melhor. Imunidade física faz parte da população, e Iron Maiden é o outro perigo — uma rajada de vinte e quatro flechas refletida é fatal.",
      "travincal-hell":
        "O Council fica junto e não é imune a físico. Um cone cobre todos eles.",
      "worldstone-keep-hell":
        "A melhor experiência do jogo e denso o bastante para o cone, mas imunidade física é comum — uma zona de Amplify Damage em vez de uma zona de início.",
    },
    levelingPath: {
      summary:
        "**Esta build é o próprio plano de evolução**, e o mais precoce do site. O Multiple Shot no nível 6 limpa o Normal inteiro, o Guided Arrow no 18 dá conta dos bosses, e nada nos dois precisa ser desaprendido depois. Coloque pontos em Critical Strike no caminho em vez de guardá-los — é uma porcentagem que funciona desde o primeiro ponto.",
      respecAt: "Não é necessário. Guarde os tokens.",
    },
    selfFoundNotes:
      "Excelente, e um pouco melhor que a da página do Strafe por um motivo: **o Multiple Shot chega no nível 6** em vez do 24, então um personagem novo está limpando direito dentro de uma hora. Edge, Melody e Peace são todas runewords da Countess, e o Buriza-Do Kyanon — o maior upgrade único que esta build faz — cai a partir do fim do Nightmare e é uma das armas capazes de endgame mais comuns do jogo. O Faith é o único item genuinamente fora de alcance, e a build fica bem sem ele.",
    hardcoreNotes:
      "Mais segura que o Strafe por um motivo: você não fica presa numa animação longa, então dá para atirar e andar. Todo o resto é igual — sem escudo, sem bloqueio, e Vitality mais recuperação de golpe como defesa inteira. Alcance 32% de Faster Hit Recovery antes do Hell, mantenha **Slow Missiles** na barra, e coloque o **Decoy** atrás de um grupo em vez de na sua frente: ele puxa o grupo para dentro do cone e leva as flechas destinadas a você ao mesmo tempo. Pegue Holy Freeze no mercenário.",
    gearSets: {
      starter: {
        goal: "Multiple Shot no nível 6, e um arco que aceite três sockets.",
        nextUpgrade: "Nível 18 pelo Guided Arrow, depois uma Melody no 39.",
        notes:
          "**O Multiple Shot é a limpeza completa mais precoce que a Amazon tem**, disponível no nível 6 por quatro de mana. A dificuldade inteira do Normal é esta skill e o Magic Arrow, e nenhuma das duas é jogada fora depois.",
        picks: {
          "weapon-0": {
            why: "35% de velocidade de ataque e um dano bônus enorme contra demônios e mortos-vivos, por três runas da Countess no nível 25.",
            sockets: "Tir, Tal e Amn num arco de 3 sockets.",
          },
          "body-0": {
            why: "Recuperação de golpe e velocidade de corrida a partir do nível 17 — os dois atributos que mais faltam a um personagem sem escudo.",
          },
          "helm-0": {
            why: "+1 em Todas as Skills, que neste nível é mais uma flecha em cada cone.",
          },
          "gloves-0": {
            label: "Quaisquer luvas com Increased Attack Speed",
            why: "Vendedores vendem luvas mágicas com isso, e nada mais no slot importa ainda.",
            lookFor: ["20% Increased Attack Speed"],
          },
        },
      },
      nightmare: {
        goal: "Um cone largo, uma Valkyrie, e o primeiro pierce.",
        nextUpgrade: "Um arco elite e um Fortitude.",
        notes:
          "**Velocidade de ataque importa e não existe número de Amazon para ela.** Uma Balista é uma das bases mais lentas do jogo e um Ward Bow uma das mais rápidas, então a mesma porcentagem compra frames muito diferentes. Pegue velocidade de ataque onde for de graça, e julgue pelo arco que você está segurando em vez de por uma tabela.",
        picks: {
          "weapon-0": {
            why: "+3 na aba inteira de Bow and Crossbow são três flechas a mais por cone, mais +3 em Critical Strike.",
            sockets: "Shael, Ko e Nef num arco de 3 sockets.",
          },
          "weapon-0-alt0": {
            why: "**100% de Piercing Attack de graça** no nível 41, que é o maior passo que esta build dá — e permite deixar o Pierce em um ponto até bem mais tarde.",
          },
          "body-0": {
            why: "+2 skills de Amazon, +2 Critical Strike e recuperação de golpe, por três runas baratas.",
          },
          "helm-0": { why: "+1 skills e magic find enquanto nada melhor existir." },
          "belt-0": {
            why: "33% de pierce por 20 de Strength. Num cone de vinte e quatro flechas este é o melhor custo-benefício do jogo.",
          },
          "amulet-0": {
            why: "20% de velocidade de ataque e 25 de Dexterity, e os dois são dano num arco físico.",
          },
          "ring1-0": {
            why: "Cannot Be Frozen e até 250 de attack rating, para o qual esta build não tem outra fonte barata.",
          },
        },
        charms: [{ why: "75% antes do Hell, num personagem sem escudo para se esconder atrás." }],
      },
      "early-hell": {
        goal: "Attack rating, resistências no teto, e pierce perto do limite.",
        nextUpgrade: "Um arco Faith, e uma resposta à imunidade física.",
        notes:
          "**Conte o seu total de pierce antes de gastar mais pontos de skill.** Um Buriza já está no teto sozinho, e um Razortail mais um punhado de pontos fixos chega quase lá sem ele. Esta é a única build em que ler o artigo de Pierce primeiro economiza quinze pontos de skill.",
        picks: {
          "weapon-0": {
            why: "100% de Piercing Attack e 80% de velocidade de ataque numa base lenta. Cada flecha do cone atravessa tudo que encontra.",
          },
          "weapon-0-alt0": {
            why: "Ignore Target's Defense e +1 skills de Amazon, numa base bem mais rápida — a escolha se os seus pontos de Pierce e o Razortail já cobrirem o pierce.",
          },
          "body-0": { why: "+300% de Enhanced Damage em cada uma das vinte e quatro flechas." },
          "helm-0": {
            why: "+2 skills — duas flechas a mais — além de vida e redução de dano com 50 de Strength.",
          },
          "gloves-0": {
            label: "Luvas raras ou craftadas com 20% de Increased Attack Speed",
            why: "Velocidade de ataque e resistências num slot só.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências"],
          },
          "belt-0": { why: "33% de pierce, e ele empilha com a skill em direção ao mesmo teto." },
          "amulet-0": {
            why: "Velocidade de ataque, Dexterity e o movimento de que um personagem sem escudo precisa.",
          },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "boots-0": { why: "Vida, Dexterity e resistência máxima a fogo elevada." },
        },
        charms: [{ why: "75% nas quatro, e vida por cima." }],
      },
      budget: {
        goal: "Fanaticism, e alguma coisa que fira imunes a físico.",
        nextUpgrade: "Um Wrath para os imunes a físico, e os últimos charms de skill.",
        picks: {
          "weapon-0": {
            why: "Uma aura de Fanaticism nas suas próprias mãos — velocidade de ataque, attack rating e dano juntos, mais +1-2 em todas as skills para mais flechas.",
            sockets: "Ohm, Jah, Lem e Eld num arco de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mantenha se o seu total de pierce desmoronar sem ele. Pierce de graça vale bastante velocidade de ataque.",
          },
          "body-0": { why: "+300% de Enhanced Damage, multiplicado pelo cone inteiro." },
          "helm-0": {
            why: "+2 skills, 20% de velocidade de ataque e roubo de vida — embora **só as duas flechas centrais roubem**, então o roubo é menor do que parece.",
            sockets: "Uma runa Um pela resistência a fogo que ele custa.",
          },
          "helm-0-alt0": { why: "Sem penalidade de resistência, e os mesmos +2 skills." },
          "amulet-0": {
            why: "**Amplify Damage ao golpear**, que é a resposta à imunidade física. Repare que as flechas centrais são as que conseguem aplicá-lo.",
          },
          "amulet-0-alt0": {
            why: "Mais velocidade de ataque e Dexterity, se o mercenário estiver dando conta dos imunes.",
          },
          "gloves-0": {
            label: "Luvas raras ou craftadas: 20% de Increased Attack Speed, resistências",
            why: "A velocidade de ataque mais barata que resta.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 20+"],
          },
          "belt-0": { why: "33% de pierce." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills, que é mais uma flecha." },
          "boots-0": { why: "Magic find na build de limpeza mais rápida que a Amazon tem." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon — três flechas a mais por cone." },
          { why: "Níveis de skill aqui são flechas, não só dano." },
        ],
        weaponSwap: [
          { why: "Battle Orders, num personagem sem escudo." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "Um cone de vinte e quatro flechas que perfura tudo e acerta tudo.",
        nextUpgrade:
          "As últimas rolagens de charm, e um Bone Break para as zonas que o Amplify Damage não cobre.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de Fanaticism nível 15 com +2 em todas as skills — velocidade de ataque, attack rating e duas flechas a mais de um item só.",
            lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
          },
          "weapon-0-alt0": {
            why: "Decrepify ao golpear, para os grupos que o Faith não consegue ferir de jeito nenhum. Fica no swap em vez de vestido.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage e a defesa para a qual uma build sem escudo não tem outra fonte.",
          },
          "helm-0": { why: "+2 skills e 20% de velocidade de ataque, com uma Um no socket." },
          "amulet-0": {
            why: "Amplify Damage ao golpear, a única resposta de verdade da build à imunidade física.",
          },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, resistências, vida",
            why: "Velocidade de ataque e as resistências que o Andariel's Visage custa.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": {
            why: "Magic find, ou Gore Rider se você preferir Crushing Blow nas flechas centrais.",
          },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Flechas e vida juntas." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "**O cone está em vinte e quatro flechas e todas elas perfuram**, então o que resta comprar é dano por flecha e frequência de acerto. Velocidade de ataque continua sendo uma pergunta por arco e sempre vai ser: o mesmo total se comporta diferente num Grand Matron Bow, num Ward Bow e numa Balista, então teste em vez de ler.",
        picks: {
          "weapon-0": {
            why: "Fanaticism nível 15 e +2 em todas as skills, no arco de 4 sockets que a sua Dexterity alcançar.",
            lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
          },
          "weapon-0-alt0": { why: "No swap, para imunes a físico." },
          "body-0": { why: "+300% de Enhanced Damage." },
          "helm-0": { why: "+2 skills e velocidade de ataque, com Um no socket." },
          "amulet-0": { why: "Amplify Damage ao golpear." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, duas resistências, vida",
            why: "A melhor versão do único slot sem nenhum unique que valha vestir.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "Carregado para as zonas em que os cinco por cento por golpe do Amplify Damage não bastam. A penalidade dele é a sua própria redução de dano, que à distância de arco é a mais barata das seis.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders." },
          { why: "Trocado para um grupo imune a físico." },
        ],
      },
    },
  },

  "freezing-arrow-amazon": {
    summary:
      "Uma flecha que estoura num campo de frio e congela tudo que alcança. A Amazon mais segura do jogo, e a mais cara de alimentar.",
    playstyle:
      "Você atira no meio de um aglomerado e ele para de andar. O Freezing Arrow estoura num raio de cinco e congela sólido tudo que alcança, e um grupo congelado é um grupo que não está atacando ninguém — o que faz desta a forma mais segura de jogar a classe e a mais perdoadora de um erro. O dano chega enquanto eles ficam parados. O Guided Arrow é o segundo botão, e ele importa mais aqui do que em qualquer outra build de frio: é puramente físico, então é o que você aperta nos imunes a frio que o seu elemento único não toca. O custo é mana. O Freezing Arrow é a skill mais cara que a Amazon tem e você vai sentir isso em cada decisão de equipamento.",
    strengths: [
      "**Congelar um grupo é tão bom quanto matá-lo** enquanto durar — a Amazon mais segura do site",
      "Frio está entre os elementos menos resistidos do Hell, então o problema de imunidade é menor que o de uma build de fogo ou raio",
      "O Guided Arrow na mesma barra é uma resposta puramente física aos imunes a frio que aparecem",
      "Uma sinergia de dano só significa um plano de skills curto e poucos erros possíveis",
      "Ice, Nightwing's Veil e cold facets empilham −resistência a frio do inimigo, aplicada antes da checagem de imunidade",
    ],
    weaknesses: [
      "**36 de mana no nível 1 e 55 no nível 20**, a skill mais cara da classe e uma restrição real de equipamento",
      "**O Ice Arrow não acrescenta dano nenhum** — a sinergia dele é duração de congelamento, e vinte pontos ali compram segurança, não mortes",
      "Imunes a frio não levam nada da skill principal; a resposta inteira é o Guided Arrow e o mercenário",
      "Congelar elimina o estilhaçamento de cadáver que torna algumas zonas lucrativas, e trava aliados de Corpse Explosion",
      "**Velocidade de ataque é uma pergunta por arco**, como em toda build de arco aqui, então nenhum número único de Amazon é publicado",
    ],
    flexPoints: [
      "**O plano gasta 109 de 110.** Pierce é o bloco a ajustar quando um Razortail ou um Buriza entrar — equipamento e skill são um pool só.",
      "**Os vinte pontos do Ice Arrow são os que geram discussão.** Eles não acrescentam dano nenhum. Corte para um e coloque a diferença nas passivas que sustentam o Guided Arrow se você preferir matar imunes a frio mais rápido a manter todo o resto congelado; mantenha se o motivo de você jogar esta build for ela ser segura.",
      "Immolation Arrow é a sugestão usual de segundo elemento e aqui é a errada: ela exige Exploding Arrow e Fire Arrow embaixo, o que são três skills maximizadas para um tipo de dano que o Guided Arrow já cobre mais barato.",
    ],
    statPlan: {
      strength: "O que o arco pedir. Uma runeword Ice num Crusader Bow são 97 de Strength; num Matriarchal Bow são 87 com 187 de Dexterity.",
      dexterity: "Alta — o arco exige, e ela aumenta o attack rating e o dano físico da flecha.",
      vitality: "Todo o resto. Nada congelado está te batendo, mas nada imune está congelado.",
      energy:
        "**Nenhum, e esta é a única build em que esse conselho precisa de defesa.** O custo do Freezing Arrow é real, mas Energy é uma forma ruim de pagá-lo: um mercenário com Insight, mana por abate e roubo de mana fornecem mais mana por slot do que o atributo por ponto.",
      notes: [
        "**Mana é a restrição que aperta nesta build e ela se resolve com equipamento, não com Energy.** Um Insight no mercenário é quase obrigatório; mana após cada abate e mana roubada por golpe são os dois afixos a procurar em anéis e luvas.",
        "Dexterity faz dois trabalhos — paga o arco e aumenta a metade física de cada flecha, que é o que fere um imune a frio.",
        "Sem escudo, Vitality e recuperação de golpe são a defesa inteira quando o congelamento falha.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "Prioridade menor que nas outras builds de arco, porque um monstro congelado não está te interrompendo. Ainda importa contra tudo que é imune a frio.",
      "fhr-52": "Só vale comprar se cair do equipamento que você já queria.",
    },
    skillNotes: {
      "freezing-arrow":
        "**Raio 5, e 36 de mana subindo um por nível.** O congelamento é a defesa e o dano é a recompensa.",
      "cold-arrow":
        "**A única sinergia de dano que o Freezing Arrow tem.** Doze por cento por nível, e não há mais nada disputando estes pontos.",
      "ice-arrow":
        "**Uma sinergia de duração de congelamento, não de dano.** O próprio nível do Freezing Arrow não estende o congelamento dele; só este estende. Vinte pontos aqui compram tempo em vez de dano, e nesta build tempo é o objetivo.",
      "guided-arrow":
        "**Puramente físico, e a resposta a um imune a frio.** Ele também não pode errar, o que faz dele a skill de boss que uma build de área de frio não teria.",
      pierce:
        "Uma flecha que perfura estoura de novo onde cair em seguida, então o pierce multiplica o número de congelamentos além do dano. Conte o seu Razortail antes de gastar os últimos destes.",
      "magic-arrow":
        "Pré-requisito do Multiple Shot, e um tiro que não custa mana digna de nota nem flechas.",
      "multiple-shot":
        "O outro pré-requisito do Guided Arrow. Um ponto, e um leque utilizável durante a evolução.",
      penetrate:
        "Pré-requisito do Pierce. O Freezing Arrow carrega 40% de attack rating mais 9% por nível por conta própria, então um ponto basta.",
      "critical-strike":
        "Pré-requisito do Penetrate. Ele dobra dano físico, então ajuda o Guided Arrow e o dano da própria flecha, e não a explosão de frio.",
      valkyrie: "Ela segura o que não congelou. Um ponto mais +skills.",
      decoy: "Aumenta a vida da Valkyrie, e dá a um grupo congelado outra coisa para olhar.",
      evade: "Pré-requisito da Valkyrie.",
      avoid: "Pré-requisito do Evade.",
      dodge: "Pré-requisito do Avoid.",
      "slow-missiles":
        "Pré-requisito do Decoy, e uma segunda forma de parar um grupo à distância que o congelamento não alcançou.",
      "inner-sight": "Pré-requisito do Slow Missiles.",
    },
    immunityPlan:
      "Frio está entre os elementos menos resistidos do Hell, então esta build encontra menos paredes que uma de fogo ou raio — e ainda assim tem duas respostas em vez de nenhuma. **O Guided Arrow é puramente físico**, na mesma barra, maximizado, e incapaz de errar; contra um imune a frio ele não é tanto um plano B quanto uma segunda skill principal, e é por isso que o plano gasta vinte pontos nele. **A −resistência a frio do inimigo empilha e é aplicada antes da checagem de imunidade**: uma runeword Ice são −20%, um Nightwing's Veil dá mais, e cold facets somam ainda mais. Isso não quebra uma imunidade de verdade — toda redução de resistência opera com um quinto da eficácia contra um monstro já imune — mas mantém a explosão relevante contra tudo que é apenas resistente, que é a maior parte do Hell. Um sunder charm **Cold Rupture** é a solução direta e o mais barato dos seis para carregar, porque dano de frio no Hell chega principalmente como chill em vez de como aquilo que te mata.",
    mercenaryNotes:
      "**O Insight não é opcional nesta build.** O Freezing Arrow custa 36 de mana no nível 1 e 55 no nível 20, e a aura Meditation de um Insight é a diferença entre atirar sem parar e atirar em rajadas entre poções. Além disso, pegue **Might** para o dano físico dele matar os imunes a frio, e dê a ele um **Fortitude** ou um **Treachery** com um **Vampire Gaze** para mantê-lo de pé. **Holy Freeze é redundante aqui** de um jeito que não é em outros lugares — você já está congelando tudo — então Might é a escolha clara mesmo no Hardcore.",
    farmingWhy: {
      "ancient-tunnels-hell":
        "Nível de área 85, denso e autocontido, e a população comum dele carrega imunidade a fogo e veneno em vez de frio. A casa natural desta build, como é a de uma Blizzard Sorceress.",
      "chaos-sanctuary-hell":
        "Nível de área 85, a zona mais densa do jogo, e sem imunidade a frio na população comum — as imunidades dela são fogo, raio e físico. Congelar um grupo de selo é a forma mais segura que existe de limpar esta sala.",
      "secret-cow-level-hell":
        "Uma manada que para de andar é uma manada que você mata no seu ritmo, e nada aqui resiste a frio.",
      "mephisto-hell":
        "Uma run de vinte segundos contra um alvo que não é imune a frio, e o congelamento torna o truque do fosso desnecessário.",
      "travincal-hell":
        "O Council é imune a fogo e raio em vez de frio, e eles ficam próximos o bastante para uma explosão pegar todos.",
      "pit-hell":
        "Nível de área 85 e curto, mas a população inclui imunes a frio — uma zona em que o Guided Arrow faz uma parte real do trabalho.",
      "worldstone-keep-hell":
        "A melhor experiência do jogo e denso o bastante para congelar, mas todos os tipos de imunidade aparecem aqui, incluindo frio. Território de sunder charm.",
    },
    levelingPath: {
      summary:
        "Cold Arrow a partir do nível 6 e Multiple Shot a partir do 6 carregam os dois primeiros atos, e os dois ficam — o Cold Arrow como sinergia de dano, o Multiple Shot como pré-requisito que você ainda aperta. O Ice Arrow no 18 é um upgrade de verdade e não só um degrau. **O Freezing Arrow em si só existe a partir do nível 30**, então a identidade da build chega tarde mesmo que nada antes dela seja desperdiçado.",
      respecAt: "Não é necessário. Guarde os tokens.",
    },
    selfFoundNotes:
      "Muito boa. Edge, Melody, Peace e Insight são todas runewords de runas baixas, o Buriza-Do Kyanon cai no fim do Nightmare e dá pierce de graça, e o Nightwing's Veil — o elmo best-in-slot — é um achado realista do Hell. O Ice é o único item genuinamente fora de alcance, com quatro runas coroadas por uma Jah, e a build funciona sem ele porque frio não é muito resistido para começar. O Guided Arrow não custa nada além de pontos de skill e cobre os imunes.",
    hardcoreNotes:
      "**A Amazon mais segura do site, e um dos personagens mais seguros do jogo.** Um monstro congelado não está atacando ninguém, e o raio é largo o bastante para um grupo inteiro parar de uma vez. As duas coisas que ainda matam esta build são imunes a frio, que não congelam, e mana — ficar sem no meio de um grupo significa estar numa sala cheia de monstros descongelados sem botão para apertar. Carregue um mercenário com Insight, mantenha poções de mana no cinto, e trate um grupo imune a frio como motivo para sair em vez de um quebra-cabeça para resolver. Might no mercenário em vez de Holy Freeze; a fonte do chill já é você.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 30 pelo Freezing Arrow, jogando de Cold Arrow e Multiple Shot.",
        nextUpgrade: "Nível 30, e depois um Insight no mercenário antes de qualquer outra coisa.",
        notes:
          "**O Cold Arrow é uma skill de verdade enquanto você evolui, não só uma sinergia.** Ele aplica chill, que é uma linha defensiva num ponto do jogo em que você não tem nenhuma, e cada ponto nele é mantido.",
        picks: {
          "weapon-0": {
            why: "Velocidade de ataque e um bônus grande contra demônios e mortos-vivos por três runas baixas, enquanto o seu dano ainda é o do arco.",
            sockets: "Tir, Tal e Amn num arco de 3 sockets.",
          },
          "body-0": {
            why: "Recuperação de golpe, velocidade de corrida e um pouco de regeneração de mana a partir do nível 17.",
          },
          "helm-0": {
            why: "+1 em Todas as Skills e +10 de Energy, que é mais útil nesta build do que em qualquer outra Amazon de arco.",
          },
          "belt-0": {
            label: "Qualquer cinto com mana ou resistências",
            why: "O Freezing Arrow são trinta e seis de mana por tiro desde o momento em que você o consegue. Qualquer coisa que ajude vale vestir.",
            lookFor: ["+Mana", "Resistências"],
          },
        },
      },
      nightmare: {
        goal: "Freezing Arrow online, e a mana para apertá-lo.",
        nextUpgrade:
          "Um Insight para o mercenário — nesta build ele não é opcional — e depois um Nightwing's Veil.",
        notes:
          "**Velocidade de ataque importa e não existe tabela de Amazon para ela.** Uma besta lenta e um arco de Amazon rápido alcançam os frames deles em totais completamente diferentes, então pegue a velocidade onde ela for de graça e julgue pelo arco que está na sua mão.",
        picks: {
          "weapon-0": {
            why: "+3 na aba de arco inteira, que é +3 em Freezing Arrow, Cold Arrow, Ice Arrow e Guided Arrow de uma vez.",
            sockets: "Shael, Ko e Nef num arco de 3 sockets.",
          },
          "weapon-0-alt0": {
            why: "100% de Piercing Attack significa que cada flecha estoura mais de uma vez, e o dano de frio dele aplica chill no que a explosão não pegar.",
          },
          "body-0": { why: "+2 skills de Amazon e recuperação de golpe por três runas baratas." },
          "helm-0": { why: "+1 skills e magic find enquanto nada melhor existir." },
          "gloves-0": {
            label: "Luvas com Increased Attack Speed e roubo de mana",
            why: "Mana roubada por golpe é a resposta mais barata a uma skill de cinquenta de mana, e é neste slot que ela mora.",
            lookFor: ["20% Increased Attack Speed", "Mana Stolen per Hit"],
          },
          "ring1-0": {
            why: "Cannot Be Frozen, attack rating, e +40 de mana que esta build genuinamente percebe.",
          },
        },
        charms: [{ why: "75% antes do Hell." }],
      },
      "early-hell": {
        goal: "Dano de skills de frio, e uma resposta física para os imunes.",
        nextUpgrade: "Uma runeword Ice, que é o único arco feito para esta build.",
        notes:
          "**M'avina's Battle Hymn é o set mais associado a esta build.** O arco dele e os bônus dele miram exatamente nesta skill, e é uma forma legítima de jogar — mas este site ainda não cataloga itens de set, e publicar uma página de set com linhas de status não verificadas seria pior do que dizer isso. Se você tem o set, o arco dele substitui o slot de arma aqui e o resto desta lista continua valendo.",
        picks: {
          "weapon-0": {
            why: "Pierce de graça significa que cada flecha estoura de novo onde continuar. Mais congelamentos sem gastar pontos de skill.",
          },
          "weapon-0-alt0": {
            why: "+1 skills de Amazon e Ignore Target's Defense numa base mais rápida, com seis sockets para cold facets.",
          },
          "helm-0": {
            why: "**+2 skills e até +15% de Dano de Skills de Frio**, mais −resistência a frio do inimigo. O elmo best-in-slot de qualquer build de frio, e ele cabe aqui tão bem quanto numa Sorceress.",
            sockets: "Um Rainbow Facet de frio.",
          },
          "body-0": {
            why: "+2 skills de Amazon e recuperação de golpe, ainda imbatível por três runas.",
          },
          "belt-0": {
            why: "33% de pierce, que nesta build são 33% mais explosões além de mais flechas.",
          },
          "amulet-0": {
            why: "+2 em todas as skills e até +30 em todas as resistências — skills para a explosão, resistências para o Hell.",
          },
          "ring1-0": { why: "Cannot Be Frozen, attack rating e mana." },
          "boots-0": {
            why: "Vida e resistência máxima a fogo elevada num personagem sem escudo.",
          },
        },
        charms: [{ why: "75% nas quatro, e vida para os grupos que não congelam." }],
      },
      budget: {
        goal: "−resistência a frio do inimigo, e mana que deixa de ser problema.",
        nextUpgrade:
          "Cold facets em cada socket, e um Cold Rupture para as zonas que exigirem.",
        picks: {
          "weapon-0": {
            why: "**−20% de resistência a frio do inimigo e +25-30% de Dano de Skills de Frio**, mais uma aura de Holy Freeze que aplica chill no que a explosão não pegar. O arco que esta build esperava.",
            sockets: "Amn, Shael, Jah e Lo num arco de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "Mais velocidade de ataque e attack rating, e nenhum dano de frio. A escolha se o Guided Arrow estiver fazendo a maior parte das suas mortes.",
          },
          "helm-0": {
            why: "+2 skills, dano de skills de frio e −resistência a frio do inimigo, com um facet no socket.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências, que é o que permite ao resto desta lista ser egoísta.",
          },
          "body-0-alt0": {
            why: "Mantenha até as runas existirem. +2 skills de Amazon é a maior parte do que o Chains of Honor te dá aqui.",
          },
          "gloves-0": {
            label: "Luvas raras ou craftadas: 20% de Increased Attack Speed, roubo de mana",
            why: "Velocidade de ataque e a mana que uma skill de custo cinquenta bebe.",
            lookFor: ["20% Increased Attack Speed", "Mana Stolen per Hit"],
          },
          "belt-0": { why: "33% de pierce, e cada perfuração é outra explosão." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "Cannot Be Frozen, mais attack rating e mana." },
          "ring2-0": {
            why: "+1 em todas as skills e +25% de mana máxima, que é a linha de anel mais útil desta build.",
          },
          "boots-0": { why: "Magic find numa build segura o bastante para farmar em qualquer lugar." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon." },
          { why: "Cada nível de skill é dano e duração de congelamento juntos." },
        ],
        weaponSwap: [
          { why: "Battle Orders, que também aumenta a reserva de mana de que esta build vive." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "Resistência a frio do inimigo empilhada para baixo até onde dá.",
        nextUpgrade:
          "Os últimos facets, e um Cold Rupture se a zona que você quer estiver fechada para você.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de +30% de Dano de Skills de Frio. Os −20% de resistência a frio do inimigo empilham com os do elmo e com cada facet.",
            lookFor: ["+30% to Cold Skill Damage", "+210% Enhanced Damage"],
          },
          "helm-0": {
            why: "+15% de Dano de Skills de Frio e −resistência a frio do inimigo, com um cold facet encaixado.",
          },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, roubo de mana, resistências",
            why: "Velocidade, mana e resistências de um slot só.",
            lookFor: ["20% Increased Attack Speed", "Mana Stolen per Hit"],
          },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills e a reserva de mana." },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Skills e vida numa fileira só." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "**Tudo que resta é nível de skill e resistência do inimigo**, e os dois fazem trabalhos diferentes: níveis de skill aumentam o dano e o raio, e a −resistência a frio do inimigo é o que mantém eles conectando no que resiste. Velocidade de ataque continua sendo uma pergunta por arco e sempre vai ser — um Ice num Grand Matron Bow e um Ice num Crusader Bow alcançam os frames deles em totais diferentes.",
        picks: {
          "weapon-0": {
            why: "Um Ice de rolagem máxima no arco de 4 sockets mais rápido que a sua Dexterity alcançar.",
            lookFor: ["+30% to Cold Skill Damage"],
          },
          "helm-0": {
            why: "Uma rolagem de +15% de Dano de Skills de Frio com um cold facet dentro.",
          },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, roubo de mana, duas resistências",
            why: "O slot sem nenhum unique que valha vestir, no melhor estado possível.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills e mana." },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "O mais barato dos seis para carregar na prática, porque dano de frio no Hell chega principalmente como chill. Troque para uma zona imune a frio e deixe no baú no resto do tempo.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
    },
  },

  "exploding-arrow-amazon": {
    summary:
      "Cada flecha detona onde cai, e o pierce faz detonar de novo. Uma arqueira de fogo com uma skill física na mesma barra, porque fogo sozinho não basta no Hell.",
    playstyle:
      "Você atira num grupo e ele se desfaz numa corrente de explosões. O Exploding Arrow causa dano em tudo em volta do alvo em vez de só no alvo, e com pierce a flecha segue adiante e detona de novo na próxima coisa que tocar — um tiro por um corredor lotado são várias explosões de profundidade. O Immolation Arrow é o segundo botão e faz outra coisa: ele deixa uma mancha de fogo queimando no chão, o que transforma uma porta num lugar que os monstros não atravessam. O Guided Arrow é o terceiro, e ele está na barra por um motivo específico — fogo é o elemento mais resistido do Hell, e é o que você aperta nas coisas em que o fogo não encosta.",
    strengths: [
      "**Dano em área em cada tiro**, sem cooldown e sem exigência de posicionamento",
      "Pierce transforma uma flecha numa corrente de explosões em vez de num acerto maior",
      "O fogo no chão do Immolation Arrow é negação de área de verdade — poucas builds conseguem simplesmente fechar um corredor",
      "Disponível no nível 12, mais cedo que qualquer outra limpeza elemental da Amazon",
      "Dano de fogo fixo vindo do equipamento aumenta a explosão, não só a flecha",
    ],
    weaknesses: [
      "**Fogo é o elemento mais resistido do Hell** — treze das vinte áreas catalogadas aqui listam imunidade a fogo",
      "Uma sinergia de dano só, então a metade de fogo do plano é curta e o teto dela é menor que o de uma build de frio",
      "Nenhum item do site aumenta dano de skills de fogo como o Nightwing's Veil aumenta frio ou o Griffon's Eye aumenta raio",
      "O fogo no chão do Immolation Arrow não faz nada contra o que não pisar nele",
      "**Velocidade de ataque é uma pergunta por arco**, então nenhum breakpoint de Amazon é publicado aqui também",
    ],
    flexPoints: [
      "**O plano gasta 109 de 110.** Pierce é o bloco a ajustar quando um Razortail entrar.",
      "**Os vinte pontos do Immolation Arrow são a bifurcação honesta.** Ele é uma segunda skill de fogo, não uma sinergia, então não faz nada pelo dano do Exploding Arrow. Mantenha se você quiser negação de área e um acerto de fogo de alvo único mais forte; mova para Critical Strike e Penetrate se o Guided Arrow estiver fazendo a maior parte das suas mortes no Hell, e ele vai estar.",
      "**Não persiga uma terceira sinergia de fogo.** Ela não existe. A árvore dá ao Exploding Arrow exatamente o Fire Arrow e nada mais.",
    ],
    statPlan: {
      strength: "O que o arco pedir. Esta build não tem motivo para buscar uma base pesada — nada aqui escala com o dano do próprio arco tão forte quanto numa build física.",
      dexterity:
        "O suficiente para o arco, mais o que aumentar o attack rating do Guided Arrow. Menos crítica que nas builds físicas.",
      vitality: "Todo o resto.",
      energy:
        "Nenhum. O Exploding Arrow são 20 de mana no nível 1 e o Immolation Arrow 24, então esta build quer um Insight mas não passa a fome que a de Freezing Arrow passa.",
      notes: [
        "**Dano de fogo fixo no equipamento aumenta a explosão**, então um afixo que seria enchimento em outra build de arco aqui é dano de verdade — procure em anéis, amuletos e joias.",
        "Dexterity rende menos nesta build do que nas físicas, porque a metade de fogo não escala com o arco. Gaste em requisitos e pare.",
        "Resistência a fogo é a que vai faltar com mais frequência, porque a resposta à sua própria fraqueza — carregar um Flame Rift — custa 70 a 90 pontos dela.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "Você atira parada e sem escudo. Esta é a meta acessível e a que vale alcançar antes do Hell.",
      "fhr-52": "Vale pegar se o equipamento que você já queria fornecer.",
    },
    skillNotes: {
      "exploding-arrow":
        "**Dano em área em cada tiro**, e a explosão dele é aumentada por dano de fogo fixo do equipamento além do nível de skill.",
      "fire-arrow":
        "**A única sinergia de dano que o Exploding Arrow tem**, a 14% por nível. Não há mais nada disputando estes vinte pontos.",
      "immolation-arrow":
        "Uma segunda skill de fogo em vez de uma sinergia — ela recebe 10% por nível do Exploding Arrow e não devolve nada. O fogo no chão é para o que ela serve.",
      "guided-arrow":
        "**Puramente físico e incapaz de errar.** Numa build de fogo no Hell isto não é um plano B, é a segunda metade do personagem.",
      pierce:
        "Uma flecha que perfura explode de novo onde cair em seguida, então o pierce multiplica o número de detonações. Conte um Razortail no total antes de gastar os últimos destes.",
      "magic-arrow": "Pré-requisito do Multiple Shot, e um tiro que não custa flechas.",
      "multiple-shot":
        "O outro pré-requisito do Exploding Arrow, e do Guided Arrow. Um ponto cobre os dois.",
      "cold-arrow":
        "Pré-requisito do Guided Arrow. O chill é um bônus defensivo pequeno durante a evolução.",
      penetrate:
        "Pré-requisito do Pierce. O Exploding Arrow carrega 20% de attack rating mais 9% por nível por conta própria.",
      "critical-strike":
        "Pré-requisito do Penetrate, e ele dobra a metade física — que é todo o dano do Guided Arrow.",
      valkyrie: "Alguém parada onde as explosões estão, para que não seja você.",
      decoy:
        "Aumenta a vida da Valkyrie, e um Decoy colocado dentro de um grupo o puxa para dentro da explosão.",
      evade: "Pré-requisito da Valkyrie.",
      avoid: "Pré-requisito do Evade.",
      dodge: "Pré-requisito do Avoid.",
      "slow-missiles": "Pré-requisito do Decoy, e a resposta a um grupo à distância.",
      "inner-sight":
        "Pré-requisito do Slow Missiles, e ele reduz a defesa de um grupo inteiro de uma vez.",
    },
    immunityPlan:
      "**Fogo é o elemento mais resistido do Hell e esta build planeja em torno disso em vez de torcer.** Das vinte áreas de farm catalogadas neste site, treze registram fogo entre as imunidades comuns — e é por isso que o Guided Arrow é maximizado em vez de ficar em um ponto, e por isso a lista de farm acima é ordenada por dados de imunidade e não por nível de área. Em ordem de praticidade: **Guided Arrow**, puramente físico, incapaz de errar, já na sua barra; **o dano físico do seu mercenário**, que não custa nada; **Infinity no mercenário**, cuja Conviction reduz resistência a fogo e é a única fonte aqui que quebra a imunidade sem te custar nada; e **um sunder charm Flame Rift**, que é a solução direta e a pior troca das seis para esta build em particular — fogo é a resistência de que você já está com falta, e o charm leva mais 70 a 90 pontos dela. Não use um Andariel's Visage e um Flame Rift ao mesmo tempo; são 100 a 120 pontos de resistência a fogo entregues entre dois itens.",
    mercenaryNotes:
      "O mercenário do Ato 2 com **Might**, porque o dano dele é físico e o seu é metade fogo — contra os imunes ele é um segundo Guided Arrow que nunca fica sem mana. Dê a ele um **Insight** cedo pela sua própria mana, e depois um **Infinity**, cuja Conviction reduz resistência a fogo tanto quanto a raio e é a única coisa do site que quebra imunidade a fogo sem te custar resistência. **Holy Freeze** se você preferir que nada saia andando da mancha do Immolation Arrow.",
    farmingWhy: {
      "pit-hell":
        "Nível de área 85, curto, e as imunidades registradas dele são físico, frio e raio em vez de fogo. A melhor zona de fogo do site exatamente por isso.",
      "mausoleum-hell":
        "Nível de área 85, a segundos de um waypoint, e imune a veneno e frio em vez de fogo. Mortos-vivos andam juntos, que é o que as explosões querem.",
      "secret-cow-level-hell":
        "Nada aqui é imune a fogo e a manada fica perto o bastante para uma flecha disparar várias explosões.",
      "throne-of-destruction-hell":
        "As ondas são imunes a frio, raio e veneno em vez de fogo, e chegam exatamente na densidade que o Exploding Arrow quer.",
      "pindleskin-hell":
        "Dez segundos, monstro nível 86, e não é imune a fogo. O Guided Arrow termina se as explosões não terminarem.",
      "arcane-sanctuary-hell":
        "Imunidade a raio e a mágico em vez de fogo, e as plataformas longas e estreitas combinam com um Immolation Arrow atravessando a largura de uma.",
      "chaos-sanctuary-hell":
        "A zona mais densa do jogo e um dos piores confrontos do site: imunidade a fogo faz parte da população comum. Uma zona de Guided Arrow com bônus de fogo, e não o contrário.",
    },
    levelingPath: {
      summary:
        "**Melhor que a maioria das Amazons em evoluir sozinha.** O Fire Arrow desde o nível 1 é um ataque de verdade e não um marcador de lugar, o Exploding Arrow chega no 12 e limpa direito, e o Immolation Arrow no 24 acrescenta negação de área. Nada precisa ser desaprendido. O Guided Arrow no 18 é a única adição que um personagem em evolução pode não pensar em fazer, e é a skill que vai carregar a build pelo Hell.",
      respecAt: "Não é necessário. Guarde os tokens.",
    },
    selfFoundNotes:
      "Boa, e mais barata que a maioria. Edge, Melody e Peace são runewords da Countess, o Magefist custa quase nada e dá um nível de skill de fogo, e o Buriza-Do Kyanon — o maior upgrade único — é comum a partir do fim do Nightmare. O que o solo self-found não conserta é o problema estrutural: não existe equivalente de fogo para um Nightwing's Veil ou um Griffon's Eye neste site, então o teto da metade de fogo é menor que o de uma build de frio ou raio, por mais que você farme. A build continua viável porque o Guided Arrow não custa nada além de pontos de skill.",
    hardcoreNotes:
      "O que há de mais seguro nesta build é que o Immolation Arrow consegue fechar uma porta, e o que há de mais perigoso é que imunidade a fogo é comum o bastante para você encontrar grupos que não consegue ferir enquanto fica parada atirando neles. Alcance 32% de Faster Hit Recovery, mantenha Slow Missiles na barra, e trate o Guided Arrow como a sua arma de verdade no Hell em vez de um detalhe. **Não carregue um Flame Rift no Hardcore.** Fogo é o tipo de dano mais comum do jogo além do mais resistido, e 70 a 90 pontos de resistência a fogo não é uma margem que um personagem de morte permanente deva abrir mão.",
    gearSets: {
      starter: {
        goal: "Exploding Arrow no nível 12, e velocidade de ataque suficiente para usá-lo.",
        nextUpgrade: "Nível 24 pelo Immolation Arrow, depois uma Melody pela aba inteira.",
        notes:
          "**O Exploding Arrow no nível 12 é a limpeza elemental em área mais precoce que a Amazon tem.** O Fire Arrow antes dele é uma skill de verdade e não um pré-requisito desperdiçado — ele converte parte do dano físico da flecha em fogo e soma mais por cima.",
        picks: {
          "weapon-0": {
            why: "Velocidade de ataque e dano bônus contra demônios e mortos-vivos por três runas baixas, enquanto a explosão ainda é pequena.",
            sockets: "Tir, Tal e Amn num arco de 3 sockets.",
          },
          "body-0": { why: "Recuperação de golpe e velocidade de corrida a partir do nível 17." },
          "helm-0": {
            why: "+1 em Todas as Skills, o que aumenta a explosão e a flecha ao mesmo tempo.",
          },
          "gloves-0": {
            why: "**+1 em Fire Skills, e isso não é exclusivo de Sorceress** — é o bônus elemental de fogo que vale para todas as classes, então ele aumenta Fire Arrow, Exploding Arrow e Immolation Arrow. Disponível no nível 23 por quase nada.",
          },
        },
      },
      nightmare: {
        goal: "As duas skills de fogo online, e uma skill física para os imunes.",
        nextUpgrade:
          "Um arco elite e um Fortitude, depois resistências no teto antes do Hell.",
        notes:
          "**Velocidade de ataque importa e nenhum número único de Amazon dá conta.** Os frames dependem da velocidade base do arco e da skill, então pegue a velocidade onde ela for de graça e julgue pelo arco que você segura.",
        picks: {
          "weapon-0": {
            why: "+3 na aba de arco inteira aumenta todas as skills desta barra de uma vez, de fogo e físicas.",
            sockets: "Shael, Ko e Nef num arco de 3 sockets.",
          },
          "weapon-0-alt0": {
            why: "Pierce de graça significa que cada flecha detona mais de uma vez. Nesta build esse é o maior upgrade disponível.",
          },
          "body-0": { why: "+2 skills de Amazon e recuperação de golpe por três runas baratas." },
          "helm-0": { why: "+1 skills e magic find até aparecer algo melhor." },
          "gloves-0": { why: "+1 em Fire Skills num slot que ainda não tem nada melhor." },
          "belt-0": { why: "33% de pierce, que nesta build são 33% mais detonações." },
          "ring1-0": {
            why: "Cannot Be Frozen e attack rating para a metade de Guided Arrow.",
          },
        },
        charms: [{ why: "75% antes do Hell, e resistência a fogo em especial." }],
      },
      "early-hell": {
        goal: "Resistências no teto, e um Guided Arrow forte o bastante para carregar os imunes a fogo.",
        nextUpgrade: "Um arco Faith, e uma decisão sobre o Flame Rift.",
        notes:
          "**É aqui que a imunidade a fogo deixa de ser ocasional.** Treze das vinte áreas catalogadas neste site listam fogo entre as imunidades comuns. A lista de farm abaixo está ordenada por isso em vez de por nível de área, e o Guided Arrow é o motivo de a lista não ser ainda mais curta.",
        picks: {
          "weapon-0": {
            why: "Pierce de graça, então cada flecha explode ao longo de uma linha em vez de uma vez só.",
          },
          "weapon-0-alt0": {
            why: "+1 skills de Amazon, Ignore Target's Defense para o Guided Arrow, e seis sockets para fire facets.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage, que a metade de Guided Arrow gasta e a explosão não.",
          },
          "helm-0": {
            why: "+2 skills, vida por nível e redução de dano com 50 de Strength.",
          },
          "gloves-0": {
            why: "+1 Fire Skills. **Esta é uma troca de verdade e não uma escolha de graça** — a alternativa são 20% de velocidade de ataque, que a metade de Guided Arrow quer mais do que a metade de fogo.",
          },
          "gloves-0-alt0": {
            label: "Luvas raras ou craftadas com 20% de Increased Attack Speed",
            why: "Pegue estas quando o Guided Arrow estiver fazendo a maior parte das mortes no Hell.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências"],
          },
          "belt-0": { why: "33% de pierce, e cada perfuração é outra explosão." },
          "amulet-0": {
            why: "+2 em todas as skills e até +30 em todas as resistências — e resistência a fogo é a que vai te faltar.",
          },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "boots-0": {
            why: "Vida e **+5% de resistência máxima a fogo**, que importa mais nesta build do que em qualquer outra por causa do que você pode acabar carregando.",
          },
        },
        charms: [{ why: "Resistência a fogo primeiro, e o resto depois." }],
      },
      budget: {
        goal: "Uma aura de Fanaticism, e uma resposta definida à imunidade a fogo.",
        nextUpgrade: "Fire facets em cada socket, e uma decisão sobre o sunder charm.",
        picks: {
          "weapon-0": {
            why: "Fanaticism aumenta velocidade de ataque, attack rating e dano, e +1-2 em todas as skills aumenta as duas metades da build de uma vez.",
            sockets: "Ohm, Jah, Lem e Eld num arco de 4 sockets.",
          },
          "weapon-0-alt0": {
            why: "66% de Piercing Attack na besta mais rápida do jogo, e ela dispara as próprias flechas explosivas. Uma curiosidade aqui em vez de um plano, mas uma curiosidade adequada.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage para a metade física, e a defesa de que uma build sem escudo precisa.",
          },
          "helm-0": {
            why: "+2 skills sem penalidade de resistência. **O Andariel's Visage é o elmo errado nesta build especificamente** — os −30% de resistência a fogo dele empilham com a penalidade de um Flame Rift num número do qual nada se recupera.",
          },
          "gloves-0": {
            label: "Luvas raras ou craftadas: 20% de Increased Attack Speed, resistências",
            why: "A esta altura o Guided Arrow está carregando os imunes a fogo, e velocidade de ataque serve mais a ele do que +1 Fire Skills.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 20+"],
          },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills e resistências." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find, ou Waterwalk se você tiver pegado um Flame Rift." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon." },
          { why: "Eles aumentam a metade de fogo e a metade física ao mesmo tempo." },
        ],
        weaponSwap: [
          { why: "Battle Orders num personagem sem escudo." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "A metade de fogo no teto, e a metade física cobrindo o que ela não alcança.",
        nextUpgrade:
          "Os últimos fire facets, e um Flame Rift se você tiver decidido pagar por um.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem de Fanaticism nível 15 com +2 em todas as skills.",
            lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
          },
          "weapon-0-alt0": {
            why: "Decrepify e Crushing Blow para a metade de Guided Arrow, no swap. Nada nele ajuda a metade de fogo.",
          },
          "body-0": {
            why: "+2 skills e +65 em todas as resistências, que é o que torna um Flame Rift sobrevivível se você carregar um.",
          },
          "helm-0": { why: "+2 skills, com um fire facet encaixado." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, resistências, vida",
            why: "Velocidade para a metade física e resistência para a de fogo.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": {
            why: "+5% de resistência máxima a fogo, que é a defesa mais barata contra o seu próprio sunder charm.",
          },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "As duas metades, mais a vida." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "Esta build termina como dois personagens dividindo um arco: uma arqueira de fogo que limpa tudo que não é imune, e uma arqueira física que mata o que é. **A última decisão de verdade é o Flame Rift**, e é uma troca pior aqui do que numa Sorceress — o mesmo charm, mas numa build que já não gasta resistência com mais nada. A maioria acaba carregando para duas ou três zonas e deixando no baú no resto do tempo.",
        picks: {
          "weapon-0": {
            why: "Fanaticism nível 15 e +2 em todas as skills.",
            lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
          },
          "body-0": { why: "+2 skills e +65 em todas as resistências." },
          "helm-0": { why: "+2 skills e um fire facet no socket." },
          "gloves-0": {
            label: "Luvas craftadas: 20% de Increased Attack Speed, duas resistências, vida",
            why: "A melhor versão de um slot sem nenhum unique que valha vestir a esta altura.",
            lookFor: ["20% Increased Attack Speed", "Duas resistências em 30+"],
          },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "+5% de resistência máxima a fogo e vida." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "A resposta direta, e a mais cara das seis para conviver: fogo é o elemento de que você já está com falta, e este leva mais 70 a 90 pontos dele. Carregue pela zona, nunca como padrão.",
          },
        ],
        weaponSwap: [
          { why: "Battle Orders." },
          { why: "Para a metade de Guided Arrow contra um imune a físico." },
        ],
      },
    },
  },

  "poison-javelin-amazon": {
    summary:
      "Uma linha de veneno que impede um grupo de regenerar por quase um minuto, e uma Valkyrie montada para matar o que o veneno não mata.",
    playstyle:
      "Você arremessa uma javelin atravessando um grupo e ela deixa veneno para trás. Nada morre na hora — veneno é dano ao longo do tempo e esta build nunca finge o contrário — mas tudo que você acertou para de regenerar e começa a perder vida enquanto você arremessa a próxima. O Plague Javelin é a versão em rajada: uma nuvem onde a javelin para, três segundos de dano bem mais pesado, e o motivo de esta build limpar o Cow Level tão rápido. Enquanto isso, uma Valkyrie com quatrocentos por cento a mais de vida que uma invocação de um ponto entra no grupo e mata o que for imune a veneno. Ela não é um bicho de estimação nesta build; ela é a segunda metade dela.",
    strengths: [
      "**Veneno impede um monstro de regenerar** enquanto estiver aplicado, o que em níveis altos é quase um minuto",
      "A nuvem do Plague Javelin cobre mais chão que qualquer outro ataque de javelin — uma skill de Cow Level",
      "Barata de rodar: 16 e 14 de mana, nenhuma exigência de attack rating na skill principal, e uma javelin que se repõe",
      "**Um Decoy de vinte pontos faz da Valkyrie uma lutadora de verdade**, e ela herda o seu Critical Strike e as suas esquivas",
      "O Bramble existe, e nada mais no jogo oferece dano de skills de veneno num slot de armadura",
    ],
    weaknesses: [
      "**Nada morre quando você acerta.** Veneno é dano ao longo do tempo e a build parece lenta mesmo quando é rápida",
      "Veneno é o segundo elemento mais resistido do Hell — dez das vinte áreas aqui registram isso",
      "O dano não empilha: uma segunda aplicação renova o veneno em vez de somar",
      "Cadáveres não estilhaçam e monstros morrem fora do seu campo de visão, o que faz da coleta de itens uma tarefa à parte",
      "Nenhuma rajada de alvo único. Bosses morrem no ritmo do veneno ou no ritmo da Valkyrie",
    ],
    flexPoints: [
      "**O plano gasta 109 de 110.** Critical Strike é o bloco ajustável: ele serve a Valkyrie e não você, então corte se preferir Dodge, Avoid e Evade mais altos.",
      "**Não maximize o Lightning Bolt como segundo tipo de dano.** Ele recebe as sinergias dele de quatro skills de raio que você não está pegando, então um Lightning Bolt maximizado sozinho é uma skill fraca sem apoio. Se você quer raio, a página do Lightning Fury é essa build.",
      "Poison Javelin e Plague Javelin são a única sinergia um do outro, a 12% e 14% por nível. Não há uma terceira para procurar.",
    ],
    statPlan: {
      strength: "O suficiente para o escudo e o cinto. Não há arma pesada a alcançar — o requisito de Strength de uma javelin é pequeno.",
      dexterity:
        "O suficiente para bloqueio máximo e para a javelin. **Nenhuma das suas duas skills principais rola contra attack rating**, então Dexterity aqui é para o escudo e para o Jab, não para o veneno conectar.",
      vitality: "Todo o resto.",
      energy: "Nenhum. Dezesseis e catorze de mana são as skills principais mais baratas de qualquer página de Amazon.",
      notes: [
        "**Esta é a única Amazon cujo dano principal nunca erra.** A linha do Poison Javelin não carrega bônus de attack rating porque não precisa — a javelin envenena o que ela atravessa. Isso libera Dexterity para bloqueio de um jeito que nenhuma outra build aqui consegue.",
        "Vale a pena alcançar bloqueio máximo, porque ficar parada enquanto o veneno trabalha é o que esta build faz.",
        "Poison Resist é a resistência para estourar o teto em vez de só encostar nele, se você pretende carregar um Rotting Fissure depois.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "Você arremessa e depois espera. Ser atordoada durante a espera é o que transforma uma luta segura numa luta ruim.",
      "fhr-52":
        "Um Bramble sozinho são 50% de Faster Hit Recovery, então nesta build a meta mais alta chega junto com a armadura em vez de no lugar de outra coisa.",
      "fbr-32":
        "A meta padrão na tabela de Paladin, Amazon e Assassin, e esta build tem o escudo e a Dexterity de sobra para ela.",
    },
    skillNotes: {
      "poison-javelin":
        "**25-37 de veneno em 8 segundos no nível 1, e a duração cresce 50 frames por nível** — dois segundos a mais a cada vez. No vinte ela se espalha por quase um minuto.",
      "plague-javelin":
        "**Fixo em três segundos desde o patch 2.4**, seja qual for o nível. Muito mais dano comprimido em muito menos tempo, numa área muito maior. Este é o botão de limpeza.",
      decoy:
        "**+20% de vida da Valkyrie por nível** — o grafo registra isso como uma sinergia de `hp`, não de dano, e vinte pontos são quatrocentos por cento a mais de vida naquilo que faz o seu trabalho físico.",
      penetrate:
        "**Pontos fixos aumentam o attack rating da Valkyrie além do seu.** Numa build cujo dano é um efeito de estado, esta é a skill que faz ela acertar as coisas.",
      "critical-strike":
        "Ela herda o seu nível nele, e ele dobra dano físico — o dela. Não faz absolutamente nada pelo seu veneno.",
      "lightning-bolt": "Pré-requisito do Plague Javelin. Um ponto, e nunca arremessado.",
      valkyrie:
        "Um ponto mais +skills. Os vinte no Decoy é o que faz ela sobreviver, não o nível aqui.",
      dodge: "Ela herda, e você também. Três pontos em vez de um porque dois personagens usam.",
      avoid:
        "O mesmo, para ataques à distância — e são os grupos à distância que matam Valkyries.",
      evade: "O mesmo de novo, em movimento. Também é pré-requisito da Valkyrie.",
      "slow-missiles":
        "Pré-requisito do Decoy, e a melhor skill defensiva de um ponto do jogo.",
      "inner-sight":
        "Pré-requisito do Slow Missiles, e ele reduz a defesa de tudo contra o que a Valkyrie está lutando.",
      jab: "Um ponto, e o único ataque físico que você vai fazer pessoalmente. Três estocadas, na javelin que você já segura.",
      pierce:
        "Um ponto, porque um Razortail fornece 33%. A javelin atravessa uma linha e envenena tudo nela, então o pierce importa de verdade — leia o artigo antes de gastar mais.",
    },
    immunityPlan:
      "**Veneno é o segundo elemento mais resistido do Hell segundo os próprios dados de área deste site** — dez das vinte áreas catalogadas registram isso, contra treze de fogo e oito de raio — e, ao contrário de uma Amazon de raio, você não tem Conviction como plano B nem dano de arma nas suas skills principais. A resposta que esta build de fato usa é **a Valkyrie**, e é por isso que ela é financiada em vez de tolerada: vinte pontos de Decoy pela vida dela, vinte de Penetrate pelo attack rating dela, e os níveis de Critical Strike, Dodge, Avoid e Evade que ela herda de você. Um mercenário com Might aumenta ainda mais o dano dela, e um **Atma's Scarab** lança Amplify Damage a partir dos golpes *dela*, não dos seus. Além dela: **Jab**, um ponto, na javelin que você já segura, para o alvo único contra o qual ela é lenta; e um sunder charm **Rotting Fissure**, o menos negociado dos seis e o que esta build mais tem chance de querer. A penalidade dele é mais absorvível aqui que a da maioria, porque resistência a veneno é fácil de estourar com charms e um Atma's Scarab.",
    mercenaryNotes:
      "O mercenário do Ato 2 com **Might**, cuja aura aumenta o dano da Valkyrie além do dele — nesta build isso são dois lutadores físicos comprados com uma contratação. Dê a ele um **Insight** cedo se quiser a mana, embora esta seja a Amazon menos faminta de mana do site, e um **Fortitude** ou **Treachery** com um **Vampire Gaze** para mantê-lo de pé. **Holy Freeze merece uma segunda olhada aqui**: uma build de veneno vence fazendo as lutas durarem, e deixar tudo lento é exatamente isso.",
    farmingWhy: {
      "secret-cow-level-hell":
        "A nuvem do Plague Javelin cobre mais chão que qualquer outro ataque de javelin, e uma manada é a única coisa do jogo com o formato da nuvem. Físico é a imunidade registrada aqui, não veneno.",
      "chaos-sanctuary-hell":
        "Nível de área 85 e a zona mais densa do jogo, com fogo, raio e físico entre as imunidades em vez de veneno. As nuvens fazem o trabalho enquanto a Valkyrie segura os grupos dos selos.",
      "pit-hell":
        "Nível de área 85, curto, e nada lá é registrado como imune a veneno. Uma zona constante em vez de rápida, o que combina com dano ao longo do tempo.",
      "travincal-hell":
        "O Council é imune a fogo e raio, não a veneno, e eles ficam parados em grupo — que é o alvo ideal para uma nuvem que dura três segundos.",
      "worldstone-keep-hell":
        "Nível de área 85 e a melhor experiência do jogo, e as imunidades registradas dele são físico, fogo, raio e frio em vez de veneno.",
      "arcane-sanctuary-hell":
        "Imunidade a raio e a mágico em vez de veneno, e plataformas longas e estreitas são exatamente o formato que uma linha de veneno quer.",
      "mausoleum-hell":
        "Nível de área 85 e rápido de alcançar, mas a população dele é registrada como imune a veneno — uma zona de Valkyrie em vez de uma zona de veneno.",
    },
    levelingPath: {
      summary:
        "**Uma das duas Amazons que evoluem como elas mesmas.** O Poison Javelin está disponível no nível 6 e fica na barra para sempre; o Plague Javelin chega no 18 e vira o botão de limpeza. Nada antes de nenhum dos dois é desperdiçado, e nenhum respec está planejado. A única coisa a saber é que ela não vai parecer forte em nenhum momento antes de os dois estarem maximizados — veneno nunca parece forte, e isso não é sinal de que o plano está errado.",
      respecAt: "Não é necessário. Guarde os tokens.",
    },
    selfFoundNotes:
      "Barata de começar e genuinamente travada no fim. Titan's Revenge, Razortail, Raven Frost e Atma's Scarab são todos achados comuns do Hell, Peace e Spirit são runas da Countess, e as duas skills principais estão disponíveis antes do nível 20. **O Bramble é a parede**: Ral, Ohm, Sur e Eth é um investimento sério de runas, e é a única fonte de dano de skills de veneno do jogo. Uma versão self-found funciona e simplesmente causa menos dano — o que numa build de dano ao longo do tempo significa lutas mais longas, não lutas perdidas.",
    hardcoreNotes:
      "Melhor que a reputação dela. Você arremessa à distância, carrega escudo, bloqueia bem, e a coisa que entra no grupo é uma Valkyrie com quatrocentos por cento a mais de vida que uma invocação de um ponto. O perigo real é o ritmo: veneno mata devagar, então as lutas duram mais e você passa mais tempo na sala do que qualquer outra Amazon. Alcance as metas de 32% de bloqueio e de recuperação de golpe, mantenha **Slow Missiles** para os grupos à distância que desmontariam a Valkyrie, e trate um grupo imune a veneno como problema da Valkyrie em vez de um quebra-cabeça para encarar parada. Holy Freeze no mercenário combina mais com esta build do que Might, se você joga para sobreviver.",
    gearSets: {
      starter: {
        goal: "Poison Javelin no nível 6, e Plague Javelin no 18.",
        nextUpgrade:
          "Nível 18 pelo Plague Javelin, e depois nível 24 por um Decoy que valha investir.",
        notes:
          "**O Poison Javelin está disponível no nível 6 e é genuinamente utilizável a partir dali**, coisa que nenhuma outra skill elemental de Amazon consegue. Ele não vai parecer forte, porque veneno nunca parece — verifique se as coisas estão morrendo em vez de se elas estão recuando.",
        picks: {
          "weapon-0": {
            label: "Qualquer javelin com +Javelin and Spear Skills",
            why: "Javelins mágicas de vendedor carregam isso, e um nível de skill vale mais que qualquer rolagem de dano para uma skill que não usa o dano da arma.",
            lookFor: ["+2-3 Javelin and Spear Skills"],
          },
          "offhand-0": {
            why: "Resistências por três runas da Countess, e um escudo com o qual você de fato vai bloquear.",
          },
          "body-0": { why: "Recuperação de golpe e velocidade de corrida a partir do nível 17." },
          "helm-0": {
            why: "+1 em Todas as Skills, o que aumenta o veneno e a duração ao mesmo tempo.",
          },
        },
      },
      nightmare: {
        goal: "As duas javelins maximizadas, e uma Valkyrie que sobrevive a ser olhada.",
        nextUpgrade:
          "Um Bramble, que é a única armadura do jogo que aumenta dano de skills de veneno.",
        notes:
          "**Velocidade de ataque importa menos nesta build do que em qualquer outra Amazon.** O veneno se aplica no arremesso e não empilha, então a segunda javelin no mesmo grupo renova em vez de somar. Cadência de arremesso vale por cobertura, não por dano, e de qualquer forma não há número de Amazon para mirar.",
        picks: {
          "weapon-0": {
            why: "+4 níveis de skill entre as duas linhas, e Replenishes Quantity — uma build que arremessa a cada segundo precisa de uma javelin que se reponha.",
          },
          "offhand-0": {
            why: "+2 skills no slot com que você bloqueia. Dois níveis de skill a mais são mais veneno e mais duração.",
            sockets: "Tal, Thul, Ort e Amn num escudo de 4 sockets.",
          },
          "body-0": {
            why: "+2 skills de Amazon e recuperação de golpe por três runas baratas, até um Bramble existir.",
          },
          "helm-0": { why: "+1 skills e magic find enquanto nada melhor existir." },
          "belt-0": {
            why: "33% de pierce, para a javelin envenenar uma segunda fileira em que ela teria parado.",
          },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity para o bloqueio." },
        },
        charms: [{ why: "75% antes do Hell." }],
      },
      "early-hell": {
        goal: "Dano de skills de veneno, e uma Valkyrie que segura uma sala.",
        nextUpgrade:
          "Uma rolagem melhor de Bramble — o espalhamento do dano de veneno vai de 25% a 50% e a diferença é enorme.",
        picks: {
          "weapon-0": {
            why: "Quatro níveis de skill e reposição automática. Nada mais no slot compete para quem arremessa.",
          },
          "body-0": {
            why: "**+25-50% de Dano de Skills de Veneno** — a única fonte disso num slot de armadura no jogo — mais 50% de Faster Hit Recovery e uma aura de Thorns que ajuda a Valkyrie.",
            sockets: "Ral, Ohm, Sur e Eth numa armadura de 4 sockets.",
            lookFor: ["+50% to Poison Skill Damage"],
          },
          "helm-0": {
            why: "+2 skills e uma resistência a veneno grande, numa build que eventualmente vai querer estourar o teto dela. Os −30% de resistência a fogo são o preço.",
          },
          "helm-0-alt0": {
            why: "+2 skills sem penalidade, e mais fácil de alcançar com 50 de Strength.",
          },
          "offhand-0": { why: "+2 skills e bloqueio." },
          "belt-0": { why: "33% de pierce ao longo da linha de veneno." },
          "amulet-0": {
            why: "**Amplify Damage ao golpear ajuda a Valkyrie, não você** — é ela que está acertando as coisas — e Poison Resist +75% é exatamente a linha que esta build quer estourar.",
          },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity." },
          "boots-0": {
            why: "Vida, Dexterity para o bloqueio, e resistência máxima a fogo elevada para o Andariel's.",
          },
        },
        charms: [{ why: "75% em tudo, e veneno acima do teto se der." }],
      },
      budget: {
        goal: "Dano de veneno no teto, e uma Valkyrie que sobrevive ao grupo.",
        nextUpgrade:
          "Um Rotting Fissure se as zonas que você quer estiverem fechadas, e melhores charms de skill no resto do tempo.",
        picks: {
          "weapon-0": {
            why: "Ainda a javelin certa. Nada no site aumenta dano de skills de veneno numa arma.",
          },
          "body-0": {
            why: "Uma rolagem de +50% de Dano de Skills de Veneno, se você achar uma. O espalhamento é o maior de qualquer runeword do site.",
          },
          "helm-0": {
            why: "+2 skills, resistência a veneno e +10% de resistência máxima a veneno. Encaixe uma Um pelo fogo que ele tira.",
          },
          "offhand-0": {
            why: "35% de redução de dano e o melhor bloqueio do jogo, numa build que fica parada enquanto o veneno trabalha.",
          },
          "offhand-0-alt0": {
            why: "Mantenha os dois níveis de skill se a Strength para um Monarch não estiver paga.",
          },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": {
            why: "+2 skills e +30 em todas as resistências, se a Valkyrie não precisar mais do Amplify Damage.",
          },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": {
            why: "Magic find numa build que limpa de forma constante em vez de rápida.",
          },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon, que são dano de veneno e duração juntos." },
          { why: "Os únicos charms que aumentam as duas javelins de uma vez." },
        ],
        weaponSwap: [
          { why: "Battle Orders, e a Valkyrie também se beneficia." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "Nada que resista a veneno e sobreviva à Valkyrie.",
        nextUpgrade: "Um Rotting Fissure, e as últimas rolagens de charm.",
        picks: {
          "weapon-0": {
            why: "Quatro níveis de skill, reposição automática, e 20 de Dexterity para o bloqueio.",
          },
          "body-0": { why: "+50% de Dano de Skills de Veneno e 50% de Faster Hit Recovery." },
          "helm-0": {
            why: "+2 skills e a resistência a veneno para estourar o teto, com uma Um no socket.",
          },
          "offhand-0": { why: "Redução de dano e bloqueio." },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills e +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen e Dexterity." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Skills e vida numa fileira só." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "Esta build termina num teto mais baixo que o das de raio e chega nele muito mais barato. **O Bramble é o endgame inteiro**, e a rolagem dele é a diferença entre uma build que funciona e uma build forte. Tudo depois disso são níveis de skill, que aumentam o dano de veneno e a área do Plague Javelin — mas nunca a duração dele, que o jogo fixou em três segundos e nenhuma quantidade de equipamento move.",
        picks: {
          "weapon-0": { why: "A javelin que esta build nunca substitui." },
          "body-0": {
            why: "Um Bramble de rolagem máxima. Vinte e cinco por cento contra cinquenta é a maior diferença única que qualquer item desta lista faz.",
            lookFor: ["+50% to Poison Skill Damage"],
          },
          "helm-0": {
            why: "+2 skills, +10% de resistência máxima a veneno, Um no socket.",
          },
          "offhand-0": { why: "Redução de dano e bloqueio." },
          "belt-0": { why: "33% de pierce." },
          "amulet-0": { why: "+2 skills, +30 em todas as resistências." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Magic find." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "O menos negociado dos seis, e o que esta build mais tem chance de querer. Resistência a veneno é fácil de estourar com charms e um Atma's Scarab, então a penalidade dele é mais absorvível aqui do que a de um charm de fogo ou raio seria.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
    },
  },

  "jab-fend-amazon": {
    summary:
      "Uma lança, um escudo e três ataques físicos sem nenhuma sinergia entre eles. A Amazon que luta onde o Barbarian luta.",
    playstyle:
      "Você entra com o escudo levantado e a lança em riste. O Fend ataca cada inimigo adjacente numa sequência — mais um alvo por nível de skill — e é assim que você limpa. O Jab são três estocadas rápidas num alvo único, e é a skill de boss por um motivo não óbvio: Crushing Blow tira uma porcentagem da vida atual por *golpe*, e o Jab acerta três deles por ataque. O Impale é a abertura, uma estocada enorme que não pode ser interrompida e que deixa lento o que acerta. Não há dano elemental em lugar nenhum e nenhuma sinergia entre nada disso — a árvore simplesmente não oferece uma — então a build inteira é a arma, as passivas, e o que você conseguir colocar como efeito ao acertar.",
    strengths: [
      "**Um ponto no Impale são 300% de dano de arma** — o melhor ponto único da classe",
      "O Jab acerta três golpes por ataque, então Crushing Blow, roubo de vida e Amplify Damage disparam três vezes",
      "O Fend acerta mais um alvo adjacente por nível de skill, sem teto na coluna dele",
      "Um escudo, uma Valkyrie, um Decoy e o maior investimento em esquiva do site",
      "Barata: 5 e 8 de mana, e nada no plano precisa de uma runa acima de Amn para começar",
    ],
    weaknesses: [
      "**Nenhuma sinergia.** Nada neste plano multiplica nada, então o teto de dano é o da arma",
      "**Imunidade física é total** — e, ao contrário das builds de arco, você está parada ao lado dela enquanto ela não morre",
      "O Fend é uma animação longa. Ser atingida no meio pode te prender nela, e esse é o principal assassino da build",
      "O Impale gasta durabilidade da arma a cada golpe, então é abertura e não rotação",
      "**Velocidade de ataque é uma pergunta por arma** — uma javelin, uma Ceremonial Pike e uma Matriarchal Pike se comportam diferente no mesmo total",
    ],
    flexPoints: [
      "**O plano gasta 109 de 110 e não contém nenhuma sinergia**, porque Jab, Impale e Fend não têm. Nada aqui multiplica nada — os pontos compram a escala da própria skill ou uma passiva, e é essa a árvore inteira.",
      "**O Impale é o ponto mais gasto errado.** Ele são 300% de dano de arma por um ponto e 775% no vinte, mas gasta durabilidade a cada golpe e não dá para spammar. Mantenha em um, a menos que você esteja montando especificamente em torno de uma abertura enorme.",
      "O bloco de Dodge, Avoid e Evade é onde um personagem de Hardcore acrescenta e um de Softcore corta. As curvas deles são decrescentes, então os primeiros pontos valem muito mais que os últimos.",
    ],
    statPlan: {
      strength: "O suficiente para o escudo e a lança. Um Stormshield são 156, uma Matriarchal Pike 132 — decida entre o escudo e a arma de duas mãos antes de gastar.",
      dexterity:
        "O suficiente para bloqueio máximo, e ela aumenta attack rating e dano de arma por cima. Aqui nunca é um atributo morto.",
      vitality: "Todo o resto, e ela importa mais aqui do que em qualquer outro lugar do site.",
      energy: "Nenhum. O Fend são 5 de mana e o Jab 8 — a barra mais barata que a Amazon tem.",
      notes: [
        "**A primeira decisão de verdade é uma mão ou duas.** Uma javelin com um Stormshield te dá bloqueio, redução de dano e uma Valkyrie segurando a linha; uma Matriarchal Pike com um Passion te dá muito mais dano e Berserk para os imunes a físico. Esta página assume o escudo, e diz onde a lança vence.",
        "Bloqueio máximo importa mais aqui do que em qualquer outra Amazon e custa menos que em qualquer outra classe — a Amazon divide a tabela de bloqueio com o Paladin.",
        "Roubo de vida não é opcional. Dracul's Grasp, um Andariel's Visage ou uma Titan's Revenge — pegue ao menos um antes do Hell.",
      ],
    },
    breakpointWhy: {
      "fhr-32":
        "O Fend é uma animação longa e ser arrancada dela é o que mata esta build. Este é o número a alcançar antes do Hell e ele não é negociável.",
      "fhr-52":
        "Um Shael num escudo mais uma armadura Peace alcançam, e num personagem parado no corpo a corpo o frame vale o socket.",
      "fbr-32":
        "O bloqueio é metade da defesa desta build, e bloquear te prende numa animação própria. 32% é onde isso para de se somar à do Fend.",
    },
    skillNotes: {
      fend: "**70% de dano de arma na base e +10% por nível, mais um alvo adjacente a mais por nível.** A skill de limpeza, e a que te prende no lugar enquanto roda.",
      jab: "**Três estocadas num ataque**, a −15% de dano na base subindo 3% por nível. Os três golpes são o ponto: Crushing Blow, roubo de vida e qualquer maldição ao acertar disparam por golpe.",
      "critical-strike":
        "Uma chance de dobrar dano físico, e cada ponto do seu dano é físico. A chance sobe em direção ao teto de 80% que as colunas do jogo nomeiam.",
      penetrate:
        "**35% de attack rating mais 10% por nível.** O Fend carrega 40% mais 10% por conta própria e o Jab só 10% mais 9%, então é isto que faz a skill de boss conectar.",
      dodge:
        "**Uma chance de desviar por completo de um ataque corpo a corpo parada ou atacando** — que descreve tudo que esta build faz. Dez pontos, mais do que qualquer outra página aqui gasta.",
      avoid:
        "O mesmo para ataques à distância e mágicos enquanto você está no meio da sequência. Grupos à distância são o que pune uma lança.",
      evade:
        "O mesmo de novo andando ou correndo — a brecha que os outros dois deixam aberta, e o pré-requisito da Valkyrie.",
      impale:
        "**300% de dano de arma no nível 1**, mais uma lentidão de até 75%, por um único ponto. Pré-requisito do Fend, e vale apertar em vez de só possuir — ele gasta durabilidade, então use como abertura.",
      valkyrie:
        "Um segundo corpo na luta, e ela herda os dez e os sete pontos de esquiva acima.",
      decoy:
        "Pré-requisito da Valkyrie, e algo para um grupo à distância atirar enquanto você está presa num Fend.",
      "slow-missiles":
        "Pré-requisito do Decoy, e a resposta aos ataques à distância que matam Amazons de lança.",
      "inner-sight":
        "Pré-requisito do Slow Missiles, e ele reduz a defesa de tudo que o Fend está prestes a acertar.",
    },
    immunityPlan:
      "**Cada ponto de dano desta build é físico e ela não tem segundo elemento**, o que faz da imunidade física uma parede em vez de um atraso — e, ao contrário das páginas de arco, você está parada ao lado da coisa que não está morrendo. Quatro respostas, na ordem em que a maioria as alcança. **Amplify Damage de um Atma's Scarab** corta pela metade a resistência física do alvo e normalmente quebra a imunidade de vez, e o Jab aplica isso três vezes por ataque, que é o que torna um proc de cinco por cento confiável aqui. **Berserk de um Passion** converte o seu dano físico em mágico por inteiro; é a solução mais limpa e custa o escudo, que nesta build é metade da defesa. **O seu mercenário** com uma arma elemental mata o que você não toca, pelo preço de uma contratação. E **um charm Bone Break** é a resposta direta com o pior encaixe: a penalidade dele são 10 a 20 pontos da sua própria redução de dano físico em vez de uma resistência, e dano físico é justamente o que os monstros em alcance corpo a corpo estão te causando. Leia a página dele antes de pegar um, carregue pela zona, e tire depois.",
    mercenaryNotes:
      "O mercenário do Ato 2 com **Might**, cuja aura aumenta o dano da sua arma — e numa build sem nenhuma sinergia, uma aura que multiplica a arma vale mais aqui do que em qualquer outra página. Dê a ele um **Insight** se quiser a mana, embora esta barra quase não use, e depois um **Pride** pela Concentration ou uma arma elemental para ele ferir os imunes a físico que você não fere. **Holy Freeze é a escolha de Hardcore e é forte**: o Fend te prende numa animação, então tudo que estiver lento é algo que chega depois de a animação terminar, e não durante.",
    farmingWhy: {
      "ancient-tunnels-hell":
        "Nível de área 85 e denso, com fogo e veneno entre as imunidades registradas em vez de físico. A melhor zona do site para uma build de um tipo de dano só, sendo esse tipo o físico.",
      "mausoleum-hell":
        "Nível de área 85, a segundos de um waypoint, imune a veneno e frio em vez de físico, e cheio de mortos-vivos que se amontoam em volta de um Fend.",
      "travincal-hell":
        "O Council é imune a fogo e raio, não a físico, e eles ficam num grupo que uma sequência de Fend alcança. Uma das runs mais rápidas disponíveis a esta build.",
      "pindleskin-hell":
        "Dez segundos, monstro nível 86, um alvo único e nenhuma multidão. Jab mais Crushing Blow é exatamente o que esta luta pede.",
      "andariel-hell":
        "A run de boss mais curta do jogo, imune a veneno e não a físico, e ela fica parada. Jab com Life Tap ativo é quase sem risco.",
      "pit-hell":
        "Nível de área 85 e curto, mas imunidade física faz parte da população registrada — uma zona de Amplify Damage em vez de uma zona de graça.",
      "chaos-sanctuary-hell":
        "Imunidade física na população, e **Iron Maiden dos Oblivion Knights reflete uma sequência inteira de Fend de volta em você**. A zona mais perigosa do site para esta build.",
    },
    levelingPath: {
      summary:
        "**Esta build evolui como ela mesma desde o nível 1**, coisa que só as builds de arco conseguem também. O Jab está disponível na hora, o Impale no 12 são 300% de dano de arma por um único ponto, e o Fend no 24 é o botão de limpeza que você mantém. Coloque os pontos passivos iniciais no Critical Strike no caminho — é uma porcentagem que funciona desde o primeiro ponto e nunca deixa de ser o maior multiplicador da build.",
      respecAt: "Não é necessário. Guarde os três tokens da Den of Evil.",
    },
    selfFoundNotes:
      "**Uma das melhores builds self-found do site**, e é a ausência de sinergias que faz isso. Não há runeword a alcançar, mastery a desbloquear nem −resistência a empilhar; a build é uma arma e algumas passivas, e funciona desde o nível 1 com o que um vendedor tiver. Titan's Revenge, String of Ears, Gore Rider, Vampire Gaze e Raven Frost são todos drops comuns do Hell, Peace e Spirit são runas da Countess, e o Fortitude é o único item caro da lista — e vale as runas, já que Enhanced Damage é o único multiplicador que esta build tem. Imunidade física é a única coisa que o solo self-found não conserta barato, e um Atma's Scarab é um achado realista.",
    hardcoreNotes:
      "Exigente mas genuinamente sobrevivível, e o plano reflete isso — dez pontos de Dodge e sete de cada um de Avoid e Evade é o maior investimento em esquiva deste site, porque esta é a única Amazon cujo trabalho inteiro é ficar ao lado das coisas. **A animação do Fend é o perigo específico**: ela roda até o fim, então um grupo que te alcança no meio ganha golpes de graça, e é por isso que 32% de recuperação de golpe e 32% de bloqueio estão marcados como obrigatórios em vez de recomendados. **Iron Maiden é o outro** — os Oblivion Knights refletem dano físico e o Fend são vários golpes por segundo dele, então um grupo amaldiçoado no Chaos Sanctuary pode encerrar um personagem de uma vez. Fique atenta à maldição e saia de dentro dela. Dracul's Grasp antes de tudo, Holy Freeze no mercenário, e nada de Bone Break.",
    gearSets: {
      starter: {
        goal: "Chegar ao nível 24 pelo Fend, jogando de Jab e um ponto de Impale.",
        nextUpgrade: "Nível 24 pelo Fend, e uma arma com dano de verdade.",
        notes:
          "**Jab desde o nível 1 e um ponto de Impale no 12 é um kit completo para o Normal inteiro.** O Impale com um ponto já causa 300% de dano de arma, que é mais do que qualquer outro ponto único que a Amazon possa gastar tão cedo.",
        picks: {
          "weapon-0": {
            label: "Qualquer spear ou javelin com +Javelin and Spear Skills",
            why: "Vendedores vendem lanças mágicas pelo Ato 1 e pelo Ato 2 inteiros. Um nível de skill vence uma rolagem de dano aqui porque toda skill escala com a arma de qualquer forma.",
            lookFor: ["+2-3 Javelin and Spear Skills", "Increased Attack Speed"],
          },
          "offhand-0": {
            why: "Resistências por três runas da Countess, e você vai bloquear o tempo todo.",
          },
          "body-0": {
            why: "25% de Faster Hit Recovery a partir do nível 17, que numa Amazon de lança é o atributo de sobrevivência.",
          },
          "helm-0": { why: "+1 em Todas as Skills por duas runas comuns." },
        },
      },
      nightmare: {
        goal: "Fend online, roubo de vida no lugar, e um escudo que valha bloquear.",
        nextUpgrade: "Um Fortitude, e o Dracul's Grasp pelo Life Tap.",
        notes:
          "**Velocidade de ataque importa e nenhum número de Amazon dá conta.** Uma javelin de uma mão, uma Ceremonial Pike e uma Matriarchal Pike se comportam diferente na mesma porcentagem, e a animação do Fend não é a do Jab. Pegue velocidade de ataque onde for de graça e julgue pela arma que você está segurando.",
        picks: {
          "weapon-0": {
            why: "+4 níveis de skill entre as duas linhas, 5-9% de roubo de vida, e de uma mão — que é o que mantém o escudo no seu braço.",
          },
          "weapon-0-alt0": {
            why: "Numa lança: muito mais dano, 25% de velocidade de ataque, e **+1 em Berserk, que converte dano físico em mágico** e é a resposta de duas mãos à imunidade física.",
            sockets: "Dol, Ort, Eld e Lem numa lança de 4 sockets.",
          },
          "offhand-0": {
            why: "+2 skills e a chance de bloqueio que a tabela da Amazon deixa barata.",
            sockets: "Tal, Thul, Ort e Amn num escudo de 4 sockets.",
          },
          "body-0": {
            why: "+2 skills de Amazon, +2 Critical Strike e 20% de Faster Hit Recovery por três runas baratas.",
          },
          "helm-0": {
            why: "Roubo de vida, roubo de mana e redução de dano — três coisas que a árvore de lança não fornece.",
          },
          "belt-0": {
            why: "Roubo de vida e até 15% de redução de dano. **O Razortail é uma armadilha nesta build** — pierce não faz nada por um ataque corpo a corpo.",
          },
          "boots-0": {
            why: "Crushing Blow, Deadly Strike e Open Wounds, e o Jab aplica os três três vezes por ataque.",
          },
        },
        charms: [{ why: "75% antes do Hell, num personagem que vai ficar cercado." }],
      },
      "early-hell": {
        goal: "Enhanced Damage, Life Tap, e bloqueio máximo.",
        nextUpgrade: "Um Atma's Scarab, e depois uma decisão sobre o Bone Break.",
        notes:
          "**A imunidade física começa aqui e é absoluta.** Você não tem nenhum segundo tipo de dano, a menos que tenha pegado o Passion. O próximo tier é sobre comprar um.",
        picks: {
          "weapon-0": {
            why: "Quatro níveis de skill e roubo de vida, de uma mão. O escudo vale mais que o dano que uma arma de duas mãos acrescentaria nesta etapa.",
          },
          "offhand-0": {
            why: "35% de redução de dano e o melhor bloqueio do jogo, quando os 156 de Strength estiverem pagos.",
          },
          "offhand-0-alt0": {
            why: "Mantenha os dois níveis de skill até a Strength existir.",
          },
          "body-0": {
            why: "**+300% de Enhanced Damage, e esta build não é nada além do que o Enhanced Damage multiplica.** O maior upgrade único da lista.",
          },
          "helm-0": {
            why: "+2 skills, vida por nível e 10% de redução de dano com apenas 50 de Strength.",
          },
          "gloves-0": {
            why: "**Life Tap ao golpear, e o Jab golpeia três vezes por ataque.** Nada mais no slot chega perto numa Amazon corpo a corpo.",
          },
          "belt-0": { why: "Roubo de vida e redução de dano." },
          "amulet-0": {
            why: "+1 skills, 20% de velocidade de ataque e Deadly Strike que escala com o nível — uma segunda rolagem de dobra ao lado do Critical Strike.",
          },
          "boots-0": {
            why: "Crushing Blow contra qualquer coisa com muita vida, aplicado por golpe.",
          },
        },
        charms: [{ why: "75% e vida — as duas coisas importam mais no corpo a corpo do que em qualquer outro lugar." }],
      },
      budget: {
        goal: "Uma resposta à imunidade física, e o dano para usá-la.",
        nextUpgrade: "Um charm Bone Break, e as últimas rolagens de charm.",
        picks: {
          "weapon-0": { why: "Skills, roubo de vida e um braço de escudo livre." },
          "weapon-0-alt0": {
            why: "A bifurcação de duas mãos: **Berserk converte o seu dano físico em mágico**, que é a resposta mais limpa que um personagem corpo a corpo tem a um imune a físico. Você abre mão do escudo por isso.",
          },
          "amulet-0": {
            why: "**Amplify Damage ao golpear corta pela metade a resistência física e normalmente quebra a imunidade**, e o Jab aplica isso três vezes por ataque. Nesta build o amuleto é um tipo de dano, não uma linha de status.",
          },
          "amulet-0-alt0": {
            why: "Mais velocidade de ataque e Deadly Strike, se o Passion ou o mercenário estiverem dando conta dos imunes.",
          },
          "body-0": { why: "+300% de Enhanced Damage e 200% de defesa aumentada." },
          "helm-0": {
            why: "+2 skills, 20% de velocidade de ataque e até 10% de roubo de vida. Pague os −30% de resistência a fogo em outro lugar antes.",
            sockets: "Uma runa Um devolve a maior parte da resistência a fogo.",
          },
          "offhand-0": { why: "35% de redução de dano e bloqueio." },
          "gloves-0": { why: "Life Tap ao golpear." },
          "belt-0": { why: "Roubo de vida e redução de dano." },
          "ring1-0": {
            why: "Cannot Be Frozen e attack rating. Velocidade de ataque reduzida por chill é pior justamente para quem fica parada golpeando.",
          },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Crushing Blow, Deadly Strike e Open Wounds." },
        },
        charms: [
          { why: "+1 em todas as skills e resistências." },
          { why: "+3 skills de Amazon." },
          { why: "Os únicos charms que aumentam Fend e Jab ao mesmo tempo." },
        ],
        weaponSwap: [
          { why: "Battle Orders, na Amazon que mais precisa da vida." },
          { why: "O escudo da troca." },
        ],
      },
      optimized: {
        goal: "Duas formas de ferir um imune a físico, e bloqueio suficiente para ficar parada fazendo isso.",
        nextUpgrade: "Um Bone Break para as zonas que o Amplify Damage não cobre.",
        picks: {
          "weapon-0": {
            why: "Quatro níveis de skill, roubo de vida, e um braço de escudo. Toda alternativa troca o escudo por dano.",
          },
          "offhand-0": {
            why: "35% de redução de dano e o melhor bloqueio do jogo, com uma joia de dano no socket.",
          },
          "body-0": {
            why: "+300% de Enhanced Damage, que é o multiplicador de dano da build inteira.",
          },
          "helm-0": {
            why: "+2 skills, velocidade de ataque e roubo de vida, com uma Um no socket.",
          },
          "gloves-0": { why: "Life Tap ao golpear, aplicado três vezes por Jab." },
          "amulet-0": {
            why: "Amplify Damage ao golpear — a resposta de dano da build, não um atributo.",
          },
          "belt-0": { why: "Roubo de vida e até 15% de redução de dano." },
          "ring1-0": { why: "Cannot Be Frozen e attack rating." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": {
            why: "Crushing Blow, que é percentual e portanto melhor exatamente contra os bosses para os quais o Jab existe.",
          },
        },
        charms: [
          { why: "+1 em todas as skills." },
          { why: "+3 skills de Amazon." },
          { why: "Dano e a vida de que uma Amazon corpo a corpo precisa." },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
      bis: {
        goal: "Nada mais para consertar.",
        notes:
          "A build termina onde começou: uma arma, um escudo e três ataques sem nada multiplicando eles. **Tudo que resta comprar é Enhanced Damage, efeitos ao acertar e velocidade de ataque**, e velocidade de ataque continua sendo uma pergunta por arma — a animação do Fend não é a do Jab, e uma javelin não é uma Matriarchal Pike. Teste em vez de ler uma tabela.",
        picks: {
          "weapon-0": {
            why: "Uma rolagem máxima de Enhanced Damage, com o roubo de vida e os quatro níveis de skill.",
            lookFor: ["+200% Enhanced Damage", "9% Life Stolen per Hit"],
          },
          "offhand-0": {
            why: "Redução de dano, bloqueio, e um socket para uma joia de dano.",
          },
          "body-0": { why: "+300% de Enhanced Damage." },
          "helm-0": {
            why: "+2 skills, velocidade de ataque e roubo de vida, Um no socket.",
          },
          "gloves-0": { why: "Life Tap. Nada compete." },
          "amulet-0": { why: "Amplify Damage ao golpear." },
          "belt-0": { why: "Roubo de vida e redução de dano." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 em todas as skills." },
          "boots-0": { why: "Crushing Blow e Open Wounds." },
        },
        charms: [
          { why: "+1 em todas as skills, 20 de atributos, 20 de resistências." },
          { why: "+3 skills de Amazon." },
          {
            why: "**Leia a página dele antes de carregar.** A penalidade são 10 a 20 pontos da sua própria redução de dano físico, e dano físico é o que os monstros corpo a corpo causam — então nesta build, entre todas, o charm que te deixa ferir um imune a físico também faz cada golpe comum doer mais. Carregue pela zona, nunca como padrão.",
          },
        ],
        weaponSwap: [{ why: "Battle Orders." }, { why: "O escudo da troca." }],
      },
    },
  },
};
