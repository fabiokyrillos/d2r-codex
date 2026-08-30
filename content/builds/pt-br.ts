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
      "charged-bolt": "Pré-requisito de Static Field e Telekinesis.",
      "frozen-armor": "Defesa de graça, e congela quem ataca corpo a corpo.",
      warmth: "Regeneração de mana desde o nível 1. Não custa nada.",
      "frozen-orb": "Pré-requisito da Cold Mastery. Útil por si só durante a evolução.",
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
      "**Salvation** é uma troca útil de um ponto para o Uber Tristram e outros conteúdos hostis a resistência.",
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
      "resist-lightning":
        "Maximize por último, pela resistência máxima a raio. É o que torna a Conviction do Uber Mephisto sobrevivível.",
      "holy-shield":
        "Um ponto fixo. +skills sobe bem além disso, e é o que mantém o seu bloqueio no máximo.",
      redemption:
        "Troque para ela depois de um grupo para reabastecer vida e mana com os cadáveres. Substitui a maior parte do uso de poções.",
      cleansing: "Pré-requisito do Redemption, e uma troca real de duração de maldições.",
      meditation: "Pré-requisito do Redemption.",
      defiance: "Pré-requisito do Vigor.",
      might: "Pré-requisito do Blessed Aim, e uma aura utilizável no começo.",
      smite: "Pré-requisito do Holy Shield. Também nunca erra, o que ocasionalmente é útil.",
      "holy-bolt": "Pré-requisito do Blessed Hammer. Cura outros jogadores.",
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
          "belt-0-alt0": {
            why: "Troque o skill e o cast rate por redução de dano físico.",
          },
          "gloves-0": { why: "20% de Faster Cast Rate." },
          "boots-0": { why: "Faster Hit Recovery e Strength." },
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
          "helm-0-alt0": {
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
};
