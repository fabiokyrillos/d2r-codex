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
        "Uma sinergia do Holy Shock, e ainda sobe a sua resistência máxima a raio enquanto faz isso. Maximize primeiro — é o maior aumento de dano disponível e não custa nada além de pontos.",
      salvation:
        "A segunda sinergia do Holy Shock. Também é uma aura de resistência para a qual trocar, o que ocasionalmente importa.",
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
      vigor: "Velocidade de corrida, e pré-requisito da Salvation.",
      redemption: "Vida e mana de cadáveres, que é a sua recuperação entre grupos.",
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
        "**A sua própria resistência máxima a fogo sobe como efeito colateral** de maximizar Resist Fire pela sinergia. Isso é sobrevivência real e é fácil esquecer que você tem.",
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
        "Sinergia do Holy Fire, e sobe a sua própria resistência máxima a fogo ao mesmo tempo. Os melhores pontos da build.",
      salvation:
        "A segunda sinergia. Também é uma aura de resistência para a qual vale trocar quando a aura que você roda não está ajudando.",
      zeal:
        "A metade física, e a sua resposta contra imunes a fogo. Quatro pontos alcançam o teto de cinco golpes; o resto é dano.",
      "holy-shield":
        "Um ponto mais equipamento. Você fica em alcance corpo a corpo de tudo, então considere mais se estiver morrendo.",
      sacrifice: "Pré-requisito do Zeal, e a única sinergia do Zeal se você tiver pontos sobrando.",
      conviction:
        "**Um ponto, e importa mais do que o nível sugere** — mas só se o seu Holy Fire vier do equipamento. Leia a variante Dragon antes de decidir quanto investir aqui.",
      fanaticism: "Para o mercenário, ou para os momentos em que você prefere golpear mais rápido a queimar.",
      vigor: "Velocidade de corrida e pré-requisito da Salvation.",
      redemption: "Vida e mana de cadáveres.",
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
        "Nível de área 85 e cheia de imunes a frio, o que não te afeta em nada.",
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
      "**Thunder Storm** com um ponto é um passivo grátis que acerta um inimigo próximo aleatório num cronômetro. Não faz nada pela sua velocidade de limpeza e ocasionalmente te salva de algo fora da tela.",
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
      nova: "No caminho até o Lightning, e um botão de pânico aceitável à queima-roupa.",
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
      "charged-bolt": "Pré-requisito do Static Field.",
      "frozen-armor": "Defesa grátis e chance de congelar o que te acerta.",
      "frost-nova":
        "Um botão de pânico à queima-roupa que também congela. Seguro barato num personagem sem bloqueio.",
    },
    immunityPlan:
      "Fogo é o elemento mais resistido do Hell, e **a Fire Mastery não ajuda** — ela dá 30% de dano no nível 1 e +7% por nível, aumentando a sua saída em vez de baixar a resistência deles. Existem três respostas honestas e você deve escolher uma antes do Ato 3, não durante. **Um sunder charm Flame Rift** quebra imunidade a fogo diretamente e custa de 70 a 90 pontos da sua própria resistência a fogo, o que numa dificuldade que já aplica −100 é um preço sério. **Infinity no mercenário** quebra muitas imunidades a fogo via Conviction sem penalidade para você, e custa uma Ber e uma Jah. **Escolher zonas** é legítimo e de graça: Stony Tomb, Ancient Tunnels e Mephisto são todos leves em imunidade a fogo, e a lista de farming acima está ordenada de acordo. O **Static Field** não é resposta para imunidade, mas é resposta para boss — ele tira um quarto da vida atual independentemente do que o alvo resiste.",
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
        "Nível de área 85 e cheia de imunes a frio, o que não te afeta em nada.",
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
      "Os Ancient Tunnels, uma das melhores zonas de nível 85, são cheios de imunes a frio",
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
        "Congela um grupo inteiro por um instante. Um ponto é uma ferramenta defensiva de verdade num personagem sem bloqueio.",
    },
    immunityPlan:
      "Builds de frio encontram menos paredes que as de fogo ou raio, e vale entender por quê. **A Cold Mastery reduz a resistência a frio do inimigo em 20% no nível 1 e mais 5% por nível**, enquanto as masteries de fogo e raio aumentam o seu próprio dano. Contra qualquer coisa que não seja de fato imune, isso significa que o seu dano continua acertando bem dentro do Hell sem um único item comprado para isso. **Mas ela não quebra imunidade verdadeira**: redução de resistência é aplicada com um quinto da eficácia contra um monstro já imune, então uma Cold Mastery maximizada vale cerca de −20% contra algo em 110%, o que está longe de bastar. As respostas contra imunes a frio de verdade são um sunder charm **Cold Rupture** ao custo de 70 a 90 pontos da sua própria resistência a frio, **o dano físico do seu mercenário**, ou **pular** — que numa build de farm costuma ser o certo. Os Ancient Tunnels são o único lugar em que essa escolha realmente custa caro, e a lista de farming acima está avaliada de acordo.",
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
        "Nível de área 85 e uma das melhores zonas do jogo — mas muito imune a frio. Só vale com um charm Cold Rupture ou um mercenário que consiga carregar.",
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
          "Facets de frio em todo socket, e um charm Cold Rupture se os Ancient Tunnels forem o que você quer farmar.",
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
};
