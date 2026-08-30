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
      "**Mais Resist Lightning** é a melhor das opções restantes se o Uber Mephisto estiver te matando. Cada ponto sobe a sua resistência máxima a raio, que a Conviction não consegue tirar.",
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
        "Aumenta a resistência máxima a raio, que é justamente o que a aura de Conviction do Uber Mephisto está tentando tirar de você.",
      salvation:
        "Uma troca de um ponto para a entrada em Uber Tristram, onde toda resistência importa mais que qualquer aura de dano.",
      charge: "Mobilidade gratuita antes do Enigma. Não é dano — é transporte.",
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
      "**Mais Resist Lightning** se você pretende enfrentar o Uber Mephisto, cuja aura de Conviction mira exatamente nas suas resistências.",
      "**Holy Freeze** com um ponto é uma aura alternativa legítima quando você prefere desacelerar um grupo a matá-lo mais rápido. Custa a cadeia de pré-requisitos passando por Holy Fire, então decida antes de gastar.",
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
      "resist-lightning": "Aumenta a resistência máxima a raio.",
      salvation: "Uma aura de resistência de um ponto para trocar em Uber Tristram.",
      charge: "Transporte antes do Enigma.",
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
          "boots-0": { why: "Crushing Blow, Deadly Strike, Open Wounds." },
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
      "**Mais Resist Lightning** se você farma zonas cheias de inimigos de raio. Sobe a sua resistência máxima em vez da atual, que é a metade que a Conviction não consegue tirar de você.",
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
        "Resistência máxima a raio, que importa justamente nas zonas que você quer farmar.",
      salvation: "Uma aura de resistência de um ponto para os momentos em que a Conviction é a escolha errada.",
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
      "Maximizar três skills de resistência dá, de brinde, resistências máximas incomumente altas",
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
      "**Leia o orçamento de pontos antes de se comprometer.** Vengeance, as três skills de resistência e a Conviction todas maximizadas são 100 pontos, e as cadeias de pré-requisito custam cerca de 13 a mais. Um personagem nível 99 tem 110. Você vai terminar devendo alguma coisa, e é melhor escolher qual.",
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
        "As suas resistências máximas ficam incomumente altas porque três skills de resistência estão maximizadas como sinergia. Isso é sobrevivência de graça e vale saber antes de comprar equipamento de resistência a mais.",
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
        "Sinergia de fogo do Vengeance a 10% por nível, e ainda sobe a sua resistência máxima a fogo. O melhor investimento por ponto da build.",
      "resist-lightning":
        "Os mesmos 10% por nível, para a parte de raio. Vem antes do frio porque dano de raio no Hell é o que mata Paladins.",
      "resist-cold":
        "A terceira sinergia de 10% por nível. Também é pré-requisito do Resist Lightning, então o primeiro ponto já está pago.",
      conviction:
        "**É aqui que os pontos acabam.** 30% de redução de resistência no nível 1 mais 5% por nível. Coloque todo ponto que sobrar aqui e deixe o equipamento com +skills levar o resto do caminho.",
      zeal: "Pré-requisito do Vengeance, e um segundo ataque genuinamente útil contra lixo.",
      "holy-shield":
        "Só um ponto, e isso é um compromisso real — veja os pontos flexíveis. O bloqueio vem principalmente da Dexterity e do escudo.",
      vigor: "Velocidade de corrida, e pré-requisito da Salvation.",
      salvation:
        "A quarta sinergia do Vengeance, a 2% por nível — um quarto do que uma skill de resistência dá. Pegue um ponto pelo valor de pré-requisito e pela aura, e não invista mais até as três skills de resistência estarem maximizadas.",
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
      "Razoável no Hardcore, mas não é o Paladin mais seguro, e o motivo é o orçamento de pontos: você quase certamente não tem bloqueio máximo, porque o Holy Shield perdeu a disputa para as sinergias de dano. Compense com Chains of Honor em vez de Enigma, mantenha Battle Orders ativo, e trate o **Iron Maiden** como a coisa específica que te mata — a parte física do Vengeance reflete, e um ataque rápido contra uma maldição de dano refletido é letal. As resistências máximas altas que vêm de graça com as três sinergias maximizadas são uma vantagem genuína no Hardcore e compensam em parte o problema do bloqueio.",
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
};
