import type { JourneyCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR das jornadas de evolução, com chave pelo slug da classe.
 *
 * As ações de cada etapa são posicionais: são uma lista autoral fixa, não dados
 * editáveis pelo usuário, então a correspondência por índice é segura aqui. Os
 * refs de item de cada ação continuam invariantes e são resolvidos pelo
 * registry, o que é o que mantém os links corretos nos dois idiomas.
 */
export const journeysPtBr: Overlay<JourneyCopy> = {
  sorceress: {
    summary:
      "Evolua com Fogo, faça respec para Blizzard por volta do nível 30, e esteja farmando o Mephisto no Hell até o nível 70 com equipamento que você mesmo encontrou.",
    overview: [
      "A coisa mais importante de entender: **você não evolui como Blizzard Sorceress**. O Blizzard só abre no nível 24, e continua fraco até as três sinergias estarem maximizadas — cerca de sessenta pontos de skill a mais. Tentar jogar com ele a partir do 24 é o motivo mais comum de jogadores novos acharem que a build é ruim.",
      "Em vez disso, evolua com Fogo. O Fire Bolt te leva até o 12, o Fire Ball te leva até o Nightmare, e os dois estão disponíveis de imediato. Depois faça respec para Blizzard quando tiver pontos suficientes para ele funcionar. A quest Den of Evil dá um respec grátis em toda dificuldade, então isso não custa nada.",
      "A outra coisa para internalizar cedo: **o que te trava são as resistências, não o dano**. O Nightmare aplica -40% em todas as suas resistências e o Hell aplica -100%. Um personagem com 75% de resistência a fogo no Normal entra no Hell com -25%. Planeje para isso antes de chegar lá, não depois.",
      "Tudo nesta jornada é alcançável sozinho e self-found. Nenhum item abaixo é algo pelo qual você precise trocar.",
    ],
    respecPlan: [
      {
        at: "Nível 24-30, Normal",
        why: "O respec principal, da sua build de evolução para Blizzard. Use o token da Den of Evil do Normal. Aos 30 você tem pontos suficientes para o Blizzard mais uma parte relevante de uma sinergia.",
      },
      {
        at: "Opcional — início do Nightmare",
        why: "Se o respec do nível 30 te deixou dividido de forma estranha, o token da Den of Evil do Nightmare dá uma segunda tentativa limpa. Guarde o do Hell de reserva.",
      },
      {
        at: "Mantenha pelo menos um token permanentemente",
        why: "Um respec sobrando é genuinamente valioso. Permite experimentar Frozen Orb, Energy Shield ou uma variante de magic find sem consequência.",
      },
    ],
    stages: {
      "act-1-normal-start": {
        name: "A primeira hora",
        summary:
          "Níveis 1-5. Den of Evil, seus primeiros pontos de skill, e o respec grátis que torna todo o resto possível.",
        location: "Ato 1 — Rogue Encampment, Blood Moor, Cold Plains",
        goal: "Limpar a Den of Evil e chegar ao nível 5 sem morrer.",
        killingWith: "Fire Bolt. É o único dano de verdade que você tem, e basta.",
        skillPoints: [
          "Nível 1: **Fire Bolt**. É o seu ataque pelos próximos onze níveis.",
          "Nível 2: **Warmth**. Regeneração de mana desde o começo — custa um ponto e se paga imediatamente.",
          "Níveis 3-5: mais pontos em **Fire Bolt**.",
        ],
        statPoints: [
          "Tudo em **Vitality**.",
          "Não toque em Energy. Warmth e poções de mana dão conta. Pontos de Energy são vida que você vai querer ter no Nightmare.",
          "Não toque em Strength nem Dexterity ainda — você não tem equipamento que precise deles.",
        ],
        actions: [
          "Limpe a **Den of Evil** por completo — todo monstro, incluindo champions e uniques. A Akara recompensa com **+1 ponto de skill**.",
          "Completar a Den of Evil também concede um **respec completo grátis**. É isso que permite evoluir como Fogo e trocar para Blizzard depois. Não gaste agora.",
          "Fale com a Akara depois de terminar a Den. O ponto de skill não é automático.",
          "Compre uma staff da Akara com qualquer bônus a Fire Bolt ou Warmth. O estoque dos vendedores é renovado toda vez que você volta à cidade, então confira sempre — é dano de graça.",
          "Mate a **Blood Raven** nos Burial Grounds. A Kashya então oferece uma mercenária Rogue Scout de graça.",
          "Pegue a Rogue Scout. Um corpo grátis que atira em coisas vale a pena, mesmo que você vá substituí-la por um mercenário do Ato 2 depois.",
        ],
        gearTargets: [
          {
            label: "Qualquer staff com +Fire Bolt",
            why: "Staves de vendedor são o upgrade de dano mais barato do jogo neste nível. Confira o estoque da Akara toda vez que voltar à cidade.",
          },
          {
            label: "Um cinto com mais de 8 espaços de poção",
            why: "O Sash inicial tem 8. Um Belt tem 16. Isso importa mais que qualquer atributo agora.",
          },
        ],
        exitCriteria:
          "Den of Evil limpa, nível 5, e você tem uma staff com bônus a Fire Bolt.",
      },
      "act-1-normal-tristram": {
        name: "Se firmando",
        summary:
          "Níveis 6-11. O Static Field chega, a Countess começa a te dar runas, e a sua primeira runeword fica ao alcance.",
        location: "Ato 1 — Stony Field, Tristram, o Monastery",
        goal: "Chegar ao nível 12 e limpar o Ato 1.",
        killingWith: "Fire Bolt, com Static Field para amolecer o que for duro.",
        skillPoints: [
          "Nível 6: **Static Field**. Reduz a vida atual do inimigo por porcentagem e ignora resistências por completo — é a sua resposta a qualquer coisa que você não consiga ferir.",
          "Nível 6: **Charged Bolt** (1 ponto) como pré-requisito do Static Field. Também é genuinamente bom à queima-roupa.",
          "Todo o resto em **Fire Bolt**.",
        ],
        statPoints: ["Tudo em **Vitality**. Ainda nada de Energy."],
        actions: [
          "Rode a **Countess** (waypoint do Black Marsh → Forgotten Tower → cinco níveis de Tower Cellar). Ela tem uma tabela de drop de runas dedicada e é a fonte de toda runeword inicial.",
          "Junte **Tal** e **Eth** para um Stealth. Você só pode usar no nível 17, mas comece a caçar uma armadura de 2 sockets agora.",
          "Guarde qualquer armadura de 2 sockets que cair. Uma Breast Plate é a base ideal para o Stealth — leve o bastante para manter a velocidade de corrida Fast, com só 30 de Strength.",
          "Faça o resgate do **Cain** (Tristram). Identificação gratuita de itens pelo resto do jogo compensa genuinamente o desvio.",
          "A quest da **Forgotten Tower** e a **Tools of the Trade** (Horadric Malus) dão valor permanente — o Malus permite à Charsi transformar um item num raro com afixos de nível alto.",
          "Guarde o imbue da Charsi. Não gaste num item de nível 11. A maioria segura para um circlet ou amuleto lá pelos 60.",
        ],
        exitCriteria: "Andariel morta, nível 12+, e Tal e Eth no seu baú.",
      },
      "act-2-normal-fireball": {
        name: "O Fire Ball muda tudo",
        summary:
          "Níveis 12-17. Seu primeiro dano em área de verdade, sua primeira runeword, e o mercenário do Ato 2.",
        location: "Ato 2 — Lut Gholein, os desertos, as tumbas",
        goal: "Chegar ao nível 18 e limpar o Ato 2.",
        killingWith: "Fire Ball. É um salto real em relação ao Fire Bolt.",
        skillPoints: [
          "Nível 12: **Fire Ball**. Coloque todo ponto aqui de agora até o nível 18.",
          "O Fire Bolt é sinergia do Fire Ball, então os pontos que você já gastou não foram desperdiçados.",
        ],
        statPoints: [
          "Majoritariamente **Vitality**.",
          "Adicione só a **Strength** necessária para vestir a armadura que você realmente tem. Não invista antecipadamente.",
        ],
        actions: [
          "Mate o **Radament** nos Sewers. Ele dropa um **Book of Skills** — **+1 ponto de skill**. Fácil de perder, porque os Sewers são opcionais.",
          "No nível 17, faça o **Stealth** numa armadura de 2 sockets. 25% de Faster Cast Rate, 25% de Faster Run/Walk e 25% de Faster Hit Recovery por duas das runas mais comuns do jogo.",
          "Depois da quest do **Radament**, contrate um **mercenário do Ato 2** com o Greiz. Pegue um com aura ofensiva por enquanto — você vai recontratar no Nightmare pela aura que realmente importa.",
          "Comece a caçar uma **Crystal Sword de 4 sockets** para um Spirit no nível 25. A Charsi e a Fara vendem, e apostar produz elas barato. Precisa ter exatamente 4 sockets.",
          "Compre do **Drognan** e da **Fara** com frequência. O Drognan vende staves e orbs, e uma staff com +3 numa skill que você usa vale mais que a maioria dos drops.",
          "O **Duriel** no fim do Ato 2 é um pico de dificuldade real, e não há waypoint perto dele. Leve poções cheias e considere chegar ao nível 20 antes de encarar.",
        ],
        gearTargets: [
          { why: "Sua primeira runeword, e ela continua relevante por mais uns vinte níveis." },
          { why: "20% de Faster Cast Rate no nível 23. Vale apostar por luvas." },
        ],
        exitCriteria: "Duriel morto, Stealth feito, nível 18.",
      },
      "act-3-normal-teleport": {
        name: "Teleport",
        summary:
          "Níveis 18-23. O ponto de skill mais importante que você vai gastar, e o Spirit no 25.",
        location: "Ato 3 — Kurast, os templos, Travincal",
        goal: "Conseguir o Teleport, conseguir o Spirit, chegar ao nível 24.",
        killingWith: "Fire Ball, e agora você escolhe as suas lutas.",
        skillPoints: [
          "Nível 18: **Telekinesis** (1 ponto) e depois **Teleport** (1 ponto). Os dois, imediatamente.",
          "**Um ponto no Teleport é tudo de que você precisa, para sempre.** Pontos extras só reduzem o custo de mana.",
          "Todo o resto em **Fire Ball**.",
        ],
        statPoints: [
          "**Vitality**, mais a **Strength** necessária para a sua armadura.",
          "Se você pretende um Spirit *shield* depois, saiba desde já que um Monarch exige 156 de Strength. A maioria adia essa decisão — veja a página da build.",
        ],
        actions: [
          "**Pegue o Teleport no instante em que chegar ao 18.** É o motivo de a Sorceress ser a classe que farma mais rápido do jogo. Toda outra classe precisa de uma runeword Enigma para fazer isso.",
          "**Lam Esen's Tome** (o Ruined Temple no Kurast Bazaar) recompensa **+5 pontos de atributo**. Muito comumente ignorada, e é Vitality de graça.",
          "**The Golden Bird** recompensa uma **Potion of Life** — **+20 de vida máxima** permanente. Também fácil de perder.",
          "No nível 25, faça o **Spirit** numa Crystal Sword de 4 sockets: **Tal, Thul, Ort, Amn**, nessa ordem. +2 skills e até 35% de Faster Cast Rate. É o maior salto de poder disponível para um personagem novo.",
          "Junte também **Ral, Tir, Tal, Sol** e uma **polearm de 4 sockets** para um Insight no seu mercenário. O Meditation encerra os seus problemas de mana de vez.",
          "O Insight vai numa **polearm**, não numa spear. São classes de item diferentes e este é o erro mais comum que existe com o Insight.",
          "O Teleport tem um custo de mana que parece alto no nível 18. Ele cai conforme a sua reserva de mana cresce. Não coloque pontos em Energy para resolver isso.",
        ],
        gearTargets: [
          {
            why: "+2 skills e 35% de Faster Cast Rate no nível 25, com quatro runas do Normal.",
          },
          { why: "Meditation no seu mercenário. Você nunca mais vai beber uma poção de mana." },
        ],
        exitCriteria:
          "Teleport aprendido, Mephisto morto, Spirit sword equipada, nível 24+.",
      },
      "act-4-normal-respec": {
        name: "O respec",
        summary:
          "Níveis 24-30. O Blizzard abre, o Izual dá dois pontos de skill, e você se compromete com a build de endgame.",
        location: "Ato 4 — a Pandemonium Fortress, River of Flame, Chaos Sanctuary",
        goal: "Chegar ao nível 30, fazer respec para Blizzard, e matar o Diablo.",
        killingWith: "Fire Ball até o respec, depois Blizzard e Glacial Spike.",
        skillPoints: [
          "**Faça o respec no 30, não no 24.** No 24 você consegue colocar um ponto no Blizzard e ele será fraco. No 30, com os pontos de quest, você tem o suficiente para ele funcionar.",
          "Depois do respec: **Blizzard** primeiro, depois **Glacial Spike**, depois **Ice Blast**, depois **Ice Bolt**.",
          "Um ponto em cada: Teleport, Telekinesis, Charged Bolt, Static Field, Frozen Armor, Warmth, Frost Nova e os pré-requisitos do Ice Bolt.",
          "**Um ponto na Cold Mastery** no 30. É um multiplicador enorme mesmo no nível 1.",
        ],
        statPoints: ["**Vitality**, mais Strength para equipamento. Nada além disso."],
        actions: [
          "Mate o **Izual** nas Plains of Despair. Ele recompensa **+2 pontos de skill** — a maior recompensa isolada de quest do jogo.",
          "Fale com a **Akara** e use o seu **respec da Den of Evil** para converter de Fogo para Blizzard. Faça isso no nível 30, quando a Cold Mastery estiver disponível.",
          "**Hellforge**: o Hephasto dropa o Hellforge Hammer, e quebrar a Soulstone do Mephisto na bigorna dropa runas e gemas. No Normal espere runas baixas; as versões do Nightmare e do Hell são bem mais valiosas.",
          "Não pule a Hellforge. É uma vez por dificuldade por personagem, e a do Hell pode dropar uma runa genuinamente alta.",
          "Faça o **Lore** (Ort + Sol) num elmo de 2 sockets no 27, por +1 em Todas as Skills, e o **Ancient's Pledge** (Ral + Ort + Tal) num escudo de 3 sockets por resistências quase no máximo.",
          "O Blizzard tem um cooldown que nada reduz. Conjure Glacial Spike durante ele — esse é o ritmo pretendido da build, não uma gambiarra.",
        ],
        gearTargets: [
          { why: "+1 em Todas as Skills por duas runas comuns." },
          {
            why: "Resistências quase no máximo por três runas da Countess. É isso que te leva através da penalidade do Nightmare.",
          },
        ],
        exitCriteria: "Diablo morto, respec feito para Blizzard, nível 30+.",
      },
      "act-5-normal-to-nightmare": {
        name: "Ato 5 e o salto para o Nightmare",
        summary:
          "Níveis 30-40. Termine o Normal, pegue o pergaminho de resistência da Anya, e entenda a penalidade que te espera.",
        location: "Ato 5 — Harrogath, as terras altas, Worldstone Keep",
        goal: "Matar o Baal, e então entrar no Nightmare num nível sensato.",
        killingWith: "Blizzard, com Glacial Spike cobrindo o cooldown.",
        skillPoints: ["Continue maximizando **Blizzard**, depois **Glacial Spike**."],
        statPoints: ["**Vitality**. Strength só para equipamento que você realmente tem."],
        actions: [
          "Resgate a **Anya** (Frozen River). Ela dá um **Scroll of Resistance**: **+10 em todas as resistências**, permanente. Repetível uma vez por dificuldade, então são +30 ao longo da vida do personagem.",
          "Matar o **Nihlathak** libera o portal vermelho para o templo dele em Harrogath — é isso que torna as runs de Pindleskin possíveis depois.",
          "**Os Ancients** precisam ser vencidos para chegar ao Baal. Não dá para passar por eles com Teleport e é uma luta de verdade. Chegue ao nível 30+ antes de tentar.",
          "**Entre no Nightmare entre os níveis 38 e 42.** Ir antes é possível, mas desagradável; ir muito depois é tempo desperdiçado — a experiência do Nightmare é muito melhor que a do Normal.",
          "O Nightmare aplica **-40% em todas as suas resistências**. Se você terminar o Normal com 75% de resistência a fogo, começa o Nightmare com 35%. Resolva isso antes do Ato 2, não depois de começar a morrer.",
          "Se o Ato 1 do Nightmare parecer perigoso, rode o **Baal do Normal** ou a **Countess do Normal** por alguns níveis, em vez de forçar e morrer repetidamente.",
        ],
        exitCriteria: "Baal do Normal morto, nível 38+, e um plano para as resistências.",
      },
      nightmare: {
        name: "Nightmare",
        summary:
          "Níveis 40-60. A build se junta: as sinergias entram, as resistências são resolvidas, e o Hell começa a parecer possível.",
        location: "Nightmare — Atos 1 ao 5",
        goal: "Limpar o Nightmare e chegar ao Hell com 75% de resistências e um Blizzard funcional.",
        killingWith: "Blizzard, agora com investimento real de sinergia por trás.",
        skillPoints: [
          "Termine o **Blizzard** (20), depois o **Glacial Spike** (20), e comece o **Ice Blast**.",
          "Mantenha a **Cold Mastery** em 1 ponto por enquanto — as sinergias valem mais por ponto nesta altura.",
        ],
        statPoints: [
          "**Vitality**, e Strength suficiente para um Spirit Monarch, se você se comprometeu com esse plano.",
        ],
        actions: [
          "Repita toda quest de bônus permanente: **Den of Evil** (+1 skill), **Radament** (+1 skill), **Izual** (+2 skills), **Lam Esen's Tome** (+5 atributos), **Golden Bird** (+20 de vida), **Anya** (+10 em todas as resistências).",
          "**Recontrate o seu mercenário do Ato 2 no Nightmare** e pegue **Might**. A aura que você recebe é fixada pela dificuldade em que você contrata, e o Might é o que mata os imunes a frio em que você não encosta.",
          "Faça o **Insight** para o mercenário, se ainda não fez. O Meditation é a maior mudança de qualidade de vida de toda a jornada.",
          "**Skin of the Vipermagi** (nível 29) é um upgrade grande sobre o Stealth: +1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências com apenas 43 de Strength.",
          "Faça um **segundo Spirit** num Monarch de 4 sockets quando puder pagar os 156 de Strength. +4 skills somando os dois slots é enorme.",
          "**Mephisto no Nightmare** é o farm padrão aqui — um trajeto de vinte segundos, e ele não é imune a frio.",
          "**Countess no Nightmare** pelas runas do Insight, de um segundo Spirit e do Lore.",
          "**Entre no Hell entre os níveis 60 e 65**, não antes. Abaixo de 60 a diferença de nível de monstro derruba tanto o seu dano quanto a sua defesa.",
          "**Coloque as quatro resistências em 75% antes de entrar no Hell.** O Hell aplica -100%. Chegar com 40% de resistência a fogo significa estar de fato em -60% e morrer para coisas que deveriam ser inofensivas.",
          "Se estiver com pouca resistência, Ancient's Pledge, Rhyme e Smoke são todos consertos baratos. Uma fileira de small charms de resistência também.",
        ],
        gearTargets: [
          {
            why: "A melhor armadura econômica de caster do jogo, e encontrada com confiabilidade nesta dificuldade.",
          },
          { why: "Um segundo Spirit num escudo Monarch." },
          { why: "No mercenário. Inegociável." },
        ],
        exitCriteria:
          "Baal do Nightmare morto, nível 60+, as quatro resistências em 75%, Blizzard e Glacial Spike maximizados, Insight no mercenário.",
      },
      "hell-progression": {
        name: "Hell",
        summary:
          "Níveis 60-80. Avance com cuidado, respeite as imunidades, e troque progressão por farm assim que fizer sentido.",
        location: "Hell — Atos 1 ao 5",
        goal:
          "Chegar ao Ato 3 do Hell e começar a farmar o Mephisto. Tudo depois disso é otimização.",
        killingWith:
          "Blizzard, com Static Field e um mercenário com Might lidando com qualquer coisa imune a frio.",
        skillPoints: [
          "Termine o **Ice Blast** (20), depois o **Ice Bolt** (20).",
          "Todo ponto depois disso vai para a **Cold Mastery**.",
        ],
        statPoints: ["**Vitality**. Strength só para um item específico que você tenha."],
        actions: [
          "**Você não precisa limpar o Hell.** O objetivo é chegar ao waypoint do Ato 3 e começar a rodar o Mephisto. Avançar além disso é opcional e frequentemente mais lento que farmar.",
          "**Pular é estratégia, não fracasso.** Teleporte por cima de grupos imunes a frio. Você não é obrigado a matar nada que seja inconveniente.",
          "Repita as quests de bônus permanente uma última vez: **+4 pontos de skill**, **+5 de atributo**, **+10 em todas as resistências**, **+20 de vida**.",
          "A **Hellforge do Hell** vale a pena fazer com atenção — ela dropa de um nível alto de runa e pode viabilizar uma runeword séria.",
          "**Mephisto no Hell** é o alvo. Waypoint do Durance of Hate Level 2, ache as escadas, use o truque do fosso. Ele é monstro nível 87 e não é imune a frio.",
          "**Ancient Tunnels** assim que você der conta — nível de área 85 com praticamente nenhum imune a frio. É onde a build fica mais confortável.",
          "**Lower Kurast**, rodando baús, não exige equipamento nem dano. Uma forma completamente legítima de viabilizar um personagem que ainda não consegue lutar no Hell.",
          "Cace um **Harlequin Crest** (Shako) e um **The Oculus**. Os dois são comumente encontrados e os dois são upgrades grandes.",
          "Mire no breakpoint de **105% de Faster Cast Rate**. Ele governa a velocidade do Teleport tanto quanto a de conjuração, então é a diferença entre farmar e se arrastar.",
          "Um sunder charm **Cold Rupture** remove a única fraqueza real da build, colocando monstros imunes a frio em 95% de resistência a frio. O Patch 3.3 subiu o nível mínimo de drop dele para 75 e restringiu drops via magic find à dificuldade Hell.",
          "Mantenha o mercenário vivo: armadura **Treachery** pelo proc de Fade, **Vampire Gaze** por roubo de vida e redução de dano. Os dois são baratos.",
        ],
        gearTargets: [
          { why: "+2 skills, vida, 50% de magic find, 10% de redução de dano." },
          {
            why: "+3 skills de Sorceress, 30% de FCR, +20 em todas as resistências, 50% de magic find.",
          },
          { why: "Faster Hit Recovery e a Strength para pagar um Monarch." },
        ],
        exitCriteria:
          "Farmando Mephisto no Hell ou Ancient Tunnels de forma confiável, 105% de Faster Cast Rate, 75% de resistências. A esta altura você terminou a jornada e começou o jogo.",
      },
    },
  },

  paladin: {
    summary:
      "Evolua com Blessed Hammer a partir do 18 — sem respec — e esteja farmando o Chaos Sanctuary do Hell até o nível 75.",
    overview: [
      "A vantagem do Paladin sobre a maioria das classes é que **você nunca precisa mudar de build**. O Blessed Hammer abre no 18 e já é forte; a partir dali você está apenas despejando pontos no personagem que já tem. Compare com a Sorceress, que precisa evoluir como Fogo e fazer respec no 30.",
      "Antes do 18, a classe é um personagem corpo a corpo. Zeal com qualquer arma decente e uma aura Might levam os dois primeiros atos com conforto, e o Holy Fire adiciona dano que não depende da sua arma.",
      "A única coisa que esta jornada pede que você pense com cuidado é a **Dexterity**. Bloqueio máximo é a sobrevivência do Hammerdin, e o Holy Shield fornece boa parte da chance de bloqueio — então a quantidade de Dexterity de que você precisa depende de uma skill que você ainda não subiu. Investir demais cedo desperdiça cinquenta pontos que você nunca recupera sem respec.",
      "Resistências continuam importando tanto quanto para qualquer classe. O Nightmare aplica -40 em todas e o Hell aplica -100. Planeje para o destino antes de chegar.",
    ],
    respecPlan: [
      {
        at: "Normalmente nunca",
        why: "Diferente da maioria das builds, o Hammerdin evolui como ele mesmo. Guarde os três tokens da Den of Evil de reserva.",
      },
      {
        at: "Se você investiu Dexterity demais",
        why: "O erro mais comum de Paladin é empilhar Dexterity antes de subir o Holy Shield, e depois descobrir que passou vinte pontos do bloqueio máximo. Um respec recupera esses pontos como Vitality.",
      },
      {
        at: "Se você quiser testar um Smiter para Ubers",
        why: "Um Smiter usa equipamento e skills completamente diferentes. Um token sobrando permite testar no mesmo personagem, em vez de subir um segundo Paladin.",
      },
    ],
    stages: {
      "pal-act-1-normal": {
        name: "Abertura corpo a corpo",
        summary:
          "Níveis 1-11. Você é um personagem corpo a corpo por enquanto. Might e uma arma fazem o trabalho.",
        location: "Ato 1 — Rogue Encampment até o Monastery",
        goal: "Limpar a Den of Evil, chegar ao nível 12, e matar a Andariel.",
        killingWith:
          "Ataques normais com a aura Might ativa. Sacrifice se você quiser mais dano e puder pagar o dano em si mesmo.",
        skillPoints: [
          "Nível 1: **Might**. Aumenta o seu dano de imediato e é pré-requisito do Blessed Aim mais tarde.",
          "Níveis 2-5: **Sacrifice**, ou espalhe em **Holy Fire** se você preferir não levar o dano próprio.",
          "Nível 6: **Holy Fire** é uma aura genuinamente forte no começo — adiciona dano que não depende da sua arma.",
          "Não invista pesado em lugar nenhum. Estes pontos são efetivamente temporários e você tem muitos vindo.",
        ],
        statPoints: [
          "**Strength** para segurar uma arma e escudo decentes, depois **Vitality**.",
          "**Não toque em Dexterity ainda.** Você vai precisar de alguma eventualmente, mas quanto depende do Holy Shield, que está vinte e quatro níveis à frente.",
          "Nada de Energy.",
        ],
        actions: [
          "Limpe a **Den of Evil** por completo. A Akara dá **+1 ponto de skill** e um **respec completo grátis**.",
          "Guarde o respec. Você quase certamente não vai precisar, mas é o seguro mais barato do jogo.",
          "Compre scepters da **Charsi** e da **Akara**. Scepters de Paladin rolam +skills de Combat Skills — um scepter com +3 numa skill que você usa vale mais que a maioria dos drops neste nível.",
          "Mate a **Blood Raven** por uma mercenária Rogue Scout grátis. Pegue — ela é de graça e atira em coisas.",
          "Guarde qualquer armadura de 2 sockets para um **Stealth** no nível 17.",
          "**Tools of the Trade** dá o imbue da Charsi. Guarde — a maioria segura os três até ter um bom circlet ou amuleto lá pelos 60.",
        ],
        exitCriteria: "Andariel morta, nível 12+, Tal e Eth no seu baú.",
      },
      "pal-act-2-normal": {
        name: "Zeal e o caminho até o 18",
        summary:
          "Níveis 12-17. O Zeal acelera a limpeza, o Stealth chega no 17, e o Blessed Hammer está perto.",
        location: "Ato 2 — Lut Gholein, os desertos e tumbas",
        goal: "Chegar ao nível 18 e matar o Duriel.",
        killingWith: "Zeal com Might, ou Holy Fire se a sua arma for ruim.",
        skillPoints: [
          "Nível 12: **Zeal**. Uma sequência de ataques rápidos — um salto grande em relação a ataques únicos.",
          "Mantenha alguns pontos indo para **Might** ou **Holy Fire**.",
          "**Não invista demais.** Tudo aqui é temporário; do 18 em diante todo ponto vai para o núcleo do Hammerdin.",
        ],
        statPoints: [
          "**Strength** para equipamento, todo o resto em **Vitality**. Ainda nada de Dexterity.",
        ],
        actions: [
          "Mate o **Radament** nos Sewers por um **Book of Skills** — **+1 ponto de skill**. Fácil de perder, porque os Sewers são opcionais.",
          "No nível 17, faça o **Stealth** numa armadura de 2 sockets. Tal e depois Eth.",
          "Contrate um **mercenário do Ato 2** com o Greiz depois da quest do Radament. Qualquer aura serve por enquanto — você vai recontratar no Nightmare pela que importa.",
          "Comece a juntar **Tal, Thul, Ort, Amn** e uma **Crystal Sword de 4 sockets** para um Spirit no 25.",
          "O **Duriel** é um pico de dificuldade real, sem waypoint por perto. Leve poções cheias e considere chegar ao nível 20 primeiro.",
        ],
        exitCriteria: "Duriel morto, Stealth feito, nível 18.",
      },
      "pal-blessed-hammer": {
        name: "Blessed Hammer",
        summary:
          "Níveis 18-30. A build chega, e você passa um tempo aprendendo a mirar.",
        location: "Ato 3 e Ato 4 — Kurast, Travincal, a Pandemonium Fortress",
        goal: "Colocar Blessed Hammer e Concentration em funcionamento, e matar o Diablo.",
        killingWith: "Blessed Hammer com a Concentration ativa.",
        skillPoints: [
          "Nível 18: **Blessed Hammer**. Coloque todo ponto aqui de agora em diante.",
          "Nível 18: **Concentration** assim que tiver os pré-requisitos. Ela multiplica o dano do hammer diretamente e precisa ser a sua aura **ativa**.",
          "Depois **Vigor**, depois **Blessed Aim** — as duas dão +14% de dano mágico por nível.",
          "Um ponto em **Holy Shield** no 24. Seu equipamento com +skills leva bem além disso.",
        ],
        statPoints: [
          "**Strength** para equipamento, o resto em **Vitality**.",
          "Ainda segure a **Dexterity**. Assim que o Holy Shield estiver ativo e você souber qual escudo vai usar no endgame, calcule o requisito exato então.",
        ],
        actions: [
          "**O Blessed Hammer gira, não voa reto.** Os hammers viajam numa espiral horária que se expande, começando por volta das 9 horas. Se a build parecer fraca, você está errando — posicione-se para que a espiral passe pelo grupo, em vez de mirar nele.",
          "**A Concentration precisa ser a aura ativa.** Ela é um multiplicador ao vivo, não uma sinergia — rodar Might no lugar custa a maior parte do seu dano.",
          "**Lam Esen's Tome** (Ruined Temple, Kurast Bazaar) recompensa **+5 pontos de atributo**. Comumente ignorada.",
          "**The Golden Bird** recompensa uma **Potion of Life** — **+20 de vida máxima** permanente.",
          "Mate o **Izual** nas Plains of Despair por **+2 pontos de skill**, a maior recompensa isolada de quest do jogo.",
          "No 25, faça o **Spirit** numa Crystal Sword de 4 sockets. No 27, faça o **Lore** (Ort + Sol) num elmo de 2 sockets.",
          "Faça o **Insight** (Ral + Tir + Tal + Sol) numa **polearm** de 4 sockets para o seu mercenário. Hammers custam mana e você não tem Energy — o Meditation resolve isso de vez.",
          "O Insight vai numa **polearm**, não numa spear. Classes de item diferentes, e o erro mais comum com o Insight.",
          "Faça a **Hellforge** — uma vez por dificuldade, e a do Hell pode dropar uma runa genuinamente alta.",
        ],
        gearTargets: [
          { why: "+2 skills e até 35% de Faster Cast Rate no nível 25." },
          { why: "Meditation no seu mercenário. Encerra os problemas de mana de vez." },
        ],
        exitCriteria:
          "Diablo morto, nível 30+, Blessed Hammer e Concentration investidos, Insight no mercenário.",
      },
      "pal-act-5-to-nightmare": {
        name: "Ato 5 e a entrada no Nightmare",
        summary:
          "Níveis 30-42. Termine o Normal, pegue o pergaminho de resistência da Anya, e comece a planejar a Dexterity.",
        location: "Ato 5 — Harrogath até o Worldstone Keep",
        goal: "Matar o Baal e entrar no Nightmare num nível sensato.",
        killingWith: "Blessed Hammer, agora com investimento real de sinergia.",
        skillPoints: [
          "Continue maximizando **Blessed Hammer**, depois **Vigor**, depois **Concentration**.",
        ],
        statPoints: [
          "**Strength** para o escudo que você realmente pretende usar. Decida agora: um Spirit numa Sacred Targe precisa de muito menos que num Monarch.",
          "Comece a adicionar **Dexterity** em direção ao bloqueio máximo **com o Holy Shield ativo**. Confira a tela de personagem com o buff ligado, não desligado.",
          "Todo o resto em **Vitality**.",
        ],
        actions: [
          "**Confira a sua porcentagem de bloqueio com o Holy Shield rodando.** O Holy Shield contribui com boa parte dela, e as pessoas rotineiramente investem cinquenta pontos a mais em Dexterity porque conferiram com o buff desligado.",
          "Resgate a **Anya** por um **Scroll of Resistance** — **+10 em todas as resistências**, permanente, uma vez por dificuldade.",
          "Matar o **Nihlathak** libera o portal vermelho em Harrogath, que é o que torna as runs de Pindleskin possíveis depois.",
          "**Os Ancients** não podem ser pulados nem ultrapassados com Teleport. É uma luta de verdade — esteja no nível 30+ antes de tentar.",
          "**Entre no Nightmare entre os níveis 38 e 42.** A experiência do Nightmare é muito melhor que a do Normal, então enrolar depois do 45 desperdiça tempo.",
          "O Nightmare aplica **-40% em todas as resistências**. Resolva isso antes do Ato 2, não depois de começar a morrer.",
        ],
        exitCriteria:
          "Baal do Normal morto, nível 38+, bloqueio planejado, resistências consideradas.",
      },
      "pal-nightmare": {
        name: "Nightmare",
        summary:
          "Níveis 42-62. As skills centrais terminam, os 75% de Faster Cast Rate ficam ao alcance, e você começa a juntar para o Enigma.",
        location: "Nightmare — Atos 1 ao 5",
        goal:
          "Limpar o Nightmare e chegar ao Hell com 75% de resistências e 75% de Faster Cast Rate.",
        killingWith:
          "Blessed Hammer com Concentration. No fim desta etapa ele mata quase tudo instantaneamente.",
        skillPoints: [
          "Termine **Blessed Hammer**, **Vigor**, **Concentration**, e então **Blessed Aim**.",
          "Um ponto em **Redemption** assim que os pré-requisitos permitirem — ele reabastece vida e mana com cadáveres e substitui a maior parte do uso de poções.",
        ],
        statPoints: [
          "**Dexterity** até o bloqueio máximo com o Holy Shield ativo, **Strength** para o seu escudo, o resto em **Vitality**.",
        ],
        actions: [
          "Repita toda quest de bônus permanente: **Den of Evil** (+1 skill), **Radament** (+1 skill), **Izual** (+2 skills), **Lam Esen's Tome** (+5 atributos), **Golden Bird** (+20 de vida), **Anya** (+10 em todas as resistências).",
          "**Recontrate o seu mercenário do Ato 2 no Nightmare** e pegue **Holy Freeze**. O seu dano não precisa de ajuda — desacelerar tudo facilita muito o posicionamento dos hammers.",
          "Faça um **segundo Spirit** num escudo. Dois Spirits mais Magefist são 90% de Faster Cast Rate, bem além do breakpoint de 75%.",
          "Um **Herald of Zakarum** é um upgrade grande: +2 skills de Paladin e +2 Combat skills, +50 em todas as resistências, +20 de Strength e 30% de chance de bloqueio. Ele não tem Faster Cast Rate, então confira o seu breakpoint antes de trocar.",
          "**Skin of the Vipermagi**, com 43 de Strength, dá +1 skills, 30% de Faster Cast Rate e até +35 em todas as resistências.",
          "**Countess no Nightmare** pelas runas, e **Mephisto no Nightmare** ou **Travincal** assim que você der conta.",
          "**Entre no Hell entre os níveis 60 e 65.** Abaixo de 60 a diferença de nível de monstro prejudica tanto o dano quanto a defesa.",
          "**As quatro resistências em 75% antes do Hell.** O Hell aplica -100%.",
          "Comece a juntar para o **Enigma** agora. Jah, Ith e Ber é um projeto longo, e o Teleport é o maior upgrade que esta build já recebe.",
        ],
        gearTargets: [
          {
            why: "+4 skills efetivos, +50 em todas as resistências e muito bloqueio num slot só.",
          },
          { why: "Um segundo Spirit para o breakpoint de Faster Cast Rate." },
        ],
        exitCriteria:
          "Baal do Nightmare morto, nível 60+, 75% de resistências, 75% de Faster Cast Rate, bloqueio máximo com o Holy Shield.",
      },
      "pal-hell": {
        name: "Hell",
        summary:
          "Níveis 62-85. Dano mágico significa que quase nada te para. Chegue ao Chaos Sanctuary e comece a farmar.",
        location: "Hell — Atos 1 ao 5",
        goal:
          "Chegar ao Ato 4 do Hell e farmar o Chaos Sanctuary. Tudo depois disso é otimização.",
        killingWith:
          "Blessed Hammer. Só um punhado de monstros no jogo inteiro resiste a dano mágico.",
        skillPoints: [
          "Termine o **Blessed Aim**, depois coloque os pontos que sobrarem no **Holy Shield** por bloqueio e defesa.",
          "**Resist Lightning** só vale maximizar se o Uber Tristram for o plano. Vinte pontos duros sobem a sua resistência máxima a raio em 10% enquanto a Concentration está rodando, ou 20% se você trocar para Resist Lightning e abrir mão dela. Fora daquela luta, os pontos rendem mais em outro lugar.",
          "Pontos sobrando vão para o **Holy Shield**, por mais bloqueio e defesa.",
        ],
        statPoints: [
          "**Vitality**, assim que os requisitos de Strength e Dexterity estiverem atendidos exatamente.",
        ],
        actions: [
          "**É aqui que a classe compensa.** Dano mágico significa nenhuma parede de imunidade, nenhum Sunder Charm para caçar, nenhum Infinity para juntar. O punhado de monstros imunes a mágico nos Atos 2 e 3 é problema do seu mercenário.",
          "Repita as quests de bônus permanente uma última vez: **+4 pontos de skill**, **+5 de atributo**, **+10 em todas as resistências**, **+20 de vida**.",
          "**Chaos Sanctuary** é o destino. Nível de área 85, muito denso, e o bônus de 150% contra Undead e Demons se aplica a quase tudo lá dentro.",
          "**Travincal** — o Council é imune a fogo e a raio, o que trava a maioria dos casters e não você. O agrupamento apertado combina perfeitamente com a espiral do hammer.",
          "**O Iron Maiden dos Oblivion Knights no Chaos Sanctuary** reflete dano físico. Seus hammers são mágicos e não são afetados, mas os ataques do seu mercenário são — é assim que Paladins de Hardcore perdem mercenários, e ocasionalmente a si mesmos.",
          "O **Enigma** é o objetivo. O Teleport muda a velocidade de limpeza mais que qualquer item de dano, e o +0,75 de Strength por nível dele paga pelo seu escudo.",
          "**Heart of the Oak** numa Flail: +3 skills, 40% de Faster Cast Rate e até +40 em todas as resistências. A arma definitiva de endgame.",
          "Mire no breakpoint de **125% de Faster Cast Rate** assim que tiver o Heart of the Oak em mãos.",
        ],
        gearTargets: [
          { why: "Teleport. O maior upgrade que a build recebe." },
          { why: "+2 skills, vida, magic find e redução de dano." },
          { why: "+3 skills, 40% de FCR e até +40 em todas as resistências." },
        ],
        exitCriteria:
          "Farmando Chaos Sanctuary ou Travincal de forma confiável, 125% de Faster Cast Rate, 75% de resistências, bloqueio máximo. A jornada acabou e o jogo começou.",
      },
    },
  },

  amazon: {
    summary:
      "Evolua com o arco, porque o Multiple Shot funciona no nível 6. Decida no 30 — é ali que Lightning Fury, Freezing Arrow e Valkyrie abrem todos de uma vez.",
    overview: [
      "**O problema inteiro de evolução da Amazon é o nível 30.** Lightning Fury, Lightning Strike, Freezing Arrow, Valkyrie e Pierce abrem todos ali, e cada um deles é a skill de endgame de alguém. Antes do 30 você está jogando outra coisa, e a pergunta é qual.",
      "A resposta que esta jornada dá é **a árvore de arco**, por um motivo que não tem nada a ver com gosto: o Multiple Shot está disponível no nível 6, custa quatro de mana, e dispara um leque de flechas que limpa o Normal inteiro. O Guided Arrow no 18 mata o que sobreviver. Nada mais que a classe tenha chega tão cedo nem funciona tão bem sem apoio.",
      "**Se você faz respec no 30 depende inteiramente de para qual build você vai.** As três builds de arco e as duas físicas de lança não precisam de respec nenhum — você joga com elas desde o nível 6. As de javelin precisam, e a de veneno fica no meio do caminho. O plano de respec abaixo diz qual é qual, e a quest Den of Evil dá um token grátis por dificuldade, então nada disso custa nada.",
      "Resistências importam para esta classe tanto quanto para qualquer outra. O Nightmare aplica −40 em todas e o Hell aplica −100. A Amazon consegue carregar escudo, o que torna o conserto mais barato para ela que para uma Sorceress — um Ancient's Pledge são três runas da Countess.",
    ],
    respecPlan: [
      {
        at: "Nunca, se você vai para uma build de arco",
        why: "Multiple Shot, Guided Arrow, Strafe, Freezing Arrow e Exploding Arrow são todos alcançáveis sem desaprender nada. Você vem evoluindo o personagem pronto desde o nível 6.",
      },
      {
        at: "Nunca, se você vai para Jab e Fend",
        why: "O Jab está disponível no nível 1 e o Fend no 24. Esta build não tem sinergias para arranjar nem nada para desfazer.",
      },
      {
        at: "Nível 30, se você vai para uma build de javelin",
        why: "Lightning Fury e Lightning Strike abrem os dois no 30 e os dois querem quatro skills maximizadas embaixo. Pontos gastos na árvore de arco enquanto você esperava não fazem parte desse plano, e é para isso que o token da Den of Evil do Normal existe.",
      },
      {
        at: "Guarde ao menos um token para sempre",
        why: "A Amazon tem mais builds de endgame genuinamente diferentes que qualquer classe deste site, e elas compartilham muito equipamento. Um token sobrando é o que te deixa experimentar a outra no personagem que você já tem.",
      },
    ],
    stages: {
      "ama-act-1-normal": {
        name: "Arco desde a primeira hora",
        summary: "Níveis 1-11. O Multiple Shot no 6 é todo o começo de jogo, e custa quatro de mana.",
        location: "Ato 1 — Rogue Encampment até o Monastery",
        goal: "Limpar a Den of Evil, chegar ao nível 12 e matar a Andariel.",
        killingWith: "Magic Arrow até o nível 6, e depois Multiple Shot em tudo.",
        skillPoints: [
          "Nível 1: **Magic Arrow**. Ele cria a própria flecha, então nunca esvazia uma aljava — o que importa quando flechas custam ouro que você não tem.",
          "Nível 6: **Multiple Shot**. Duas flechas mais uma por nível, quatro de mana, e ele limpa o resto do Normal sozinho.",
          "Gaste os sobrando em **Critical Strike**. É uma porcentagem que funciona desde o primeiro ponto e nenhuma build daqui se arrepende.",
          "**Não coloque pontos em Jab ou Power Strike a menos que você saiba que vai de javelin.** São skills boas; só não são as que te levam ao 30.",
        ],
        statPoints: [
          "**Dexterity** para segurar o melhor arco que encontrar, e depois **Vitality**.",
          "Um pouco de Strength para a armadura, e nada além do que a armadura exigir.",
          "Nenhum Energy. O Multiple Shot são quatro de mana.",
        ],
        actions: [
          "Limpe a **Den of Evil** por completo. A Akara dá **+1 ponto de skill** e um **respec completo grátis**.",
          "Guarde o token de respec. Se você acabar indo de javelin no 30, é este que você vai gastar.",
          "Compre com a **Charsi** e a **Akara** por arcos. Um arco mágico com +2 ou +3 numa skill de Bow and Crossbow vale mais que qualquer drop que você vá ver antes do Ato 3.",
          "Mate a **Blood Raven** por uma Rogue Scout grátis. Pegue a variante Cold — o chill é defesa de verdade neste nível, e ela é a mercenária que duas das oito builds de Amazon mantêm para sempre.",
          "Guarde qualquer armadura de 2 sockets para um **Stealth** no nível 17.",
          "Pegue toda javelin e spear que encontrar, seja lá o que você pretenda jogar. Elas empilham, elas vendem, e uma mágica com +Javelin and Spear Skills é a arma inicial inteira de três das oito builds.",
        ],
        exitCriteria: "Andariel morta, nível 12+, e um arco do qual você não tenha vergonha.",
      },
      "ama-act-2-normal": {
        name: "A bifurcação elemental",
        summary:
          "Níveis 12-17. O Exploding Arrow no 12 é a primeira escolha de verdade, e o Stealth chega no 17.",
        location: "Ato 2 — Lut Gholein, os desertos e as tumbas",
        goal: "Chegar ao nível 18 e matar o Duriel.",
        killingWith: "Multiple Shot, e Exploding Arrow a partir do 12 se você pegou.",
        skillPoints: [
          "Nível 12: **Exploding Arrow** se você estiver indo para a build de fogo, ou **Impale** se estiver indo para a de lança — 300% de dano de arma por um único ponto é a melhor taxa que a classe tem.",
          "Caso contrário, continue alimentando **Multiple Shot** e **Critical Strike**.",
          "**Cold Arrow** vale um ponto de qualquer forma. Ele aplica chill, que é defesa para a qual você não tem outra fonte, e é pré-requisito do Guided Arrow.",
        ],
        statPoints: [
          "Dexterity para o arco, Vitality para todo o resto.",
          "**Decida agora se você quer escudo.** Se quiser, Strength e Dexterity passam a importar mais daqui em diante, e um Ancient's Pledge no nível 21 são três runas da Countess.",
        ],
        actions: [
          "Faça um **Stealth** no instante em que chegar ao 17. Recuperação de golpe e velocidade de corrida são o que falta a uma Amazon e o que a mantém viva.",
          "O **Radament** dá um ponto de skill grátis. Não pule.",
          "Se você preferir um mercenário do Ato 2, é aqui que se contrata um. **Might** por dano, **Holy Freeze** por segurança. A aura é fixada pela dificuldade em que você contrata e nunca muda.",
          "Farme a **Countess** por runas. Toda runeword de Amazon deste site — Edge, Peace, Melody, Ancient's Pledge, Spirit, Insight — é feita com o que ela derruba.",
        ],
        exitCriteria: "Duriel morto, nível 18, e um Stealth nas costas.",
      },
      "ama-act-3-4-normal": {
        name: "Guided Arrow e a cadeia da Valkyrie",
        summary:
          "Níveis 18-24. O Guided Arrow não pode errar, e os sete pontos rumo à Valkyrie começam a pagar de imediato.",
        location: "Ato 3 e Ato 4 — Kurast até o River of Flame",
        goal: "Matar o Diablo e chegar ao nível 24.",
        killingWith: "Multiple Shot para grupos, Guided Arrow para o que sobreviver.",
        skillPoints: [
          "Nível 18: **Guided Arrow**. Ele persegue o alvo e não pode errar, e é isso que torna os grupos à distância do Ato 3 e os bosses do Ato 4 administráveis.",
          "**Comece a cadeia da Valkyrie agora.** São sete pontos em dois ramos que se encontram no 30: Inner Sight (1) → Slow Missiles (12) → **Decoy** (24), e Dodge (6) → Avoid (12) → **Evade** (24). A Valkyrie exige Decoy *e* Evade, então os dois ramos precisam ser terminados — e cada ponto do caminho vale por si só.",
          "**Slow Missiles é o ponto mais subestimado da classe.** Um ponto, e os grupos de arremessadores do Ato 3 deixam de ser perigosos.",
        ],
        statPoints: [
          "Dexterity e Vitality. Se você estiver usando escudo, Dexterity suficiente para a chance de bloqueio valer a pena.",
        ],
        actions: [
          "**The Golden Bird** dá +20 de vida permanente. **Lam Esen's Tome** dá +5 pontos de atributo, e não um ponto de skill. Os dois são rápidos.",
          "Faça um **Edge** se encontrar um arco de 3 sockets no 25 — Tir, Tal, Amn, e ele te carrega até a Melody no 39.",
          "Um **Peace** no 29 são +2 skills de Amazon por três runas baratas, e é a melhor armadura que a maioria das Amazons vai usar antes do Hell.",
          "**Não gaste o respec da Den of Evil ainda.** Se você for de javelin, o nível 30 é onde você vai querer, e o token do Normal é o mais barato dos três.",
          "A **Hellforge** do Ato 4 dá uma runa. No Normal é uma baixa; pegue e siga em frente.",
        ],
        exitCriteria: "Diablo morto, nível 24, e Decoy disponível.",
      },
      "ama-act-5-normal": {
        name: "Nível 30, e a decisão",
        summary:
          "Níveis 24-32. Fend, Strafe e Immolation Arrow no 24; Lightning Fury, Lightning Strike, Freezing Arrow, Valkyrie e Pierce todos no 30.",
        location: "Ato 5 — Harrogath até a Worldstone Chamber",
        goal: "Matar o Baal, chegar ao nível 30, e escolher a build que você está de fato jogando.",
        killingWith: "Multiple Shot e Guided Arrow, ou Strafe a partir do 24 se for para lá que você vai.",
        skillPoints: [
          "Nível 24: **Strafe**, **Fend** ou **Immolation Arrow**, conforme a build. Os tiros do Strafe travam em dez no nível 7 da skill, então não despeje pontos nele esperando mais.",
          "**O nível 30 é a bifurcação.** Lightning Fury, Lightning Strike, Freezing Arrow, Valkyrie e Pierce abrem todos aqui.",
          "**Se você vai de javelin, gaste o respec da Den of Evil agora** e reconstrua em Power Strike, Lightning Bolt, Charged Strike e a skill que dá nome ao personagem.",
          "**Se você vai de arco ou de lança, não gaste nada.** Pegue a Valkyrie, pegue Pierce se a sua build quiser, e siga.",
        ],
        statPoints: [
          "Strength e Dexterity suficientes para a arma de endgame que você escolheu — um Hydra Bow são 134 e 167, um Ward Bow são 72 e 146, e uma javelin não é nem um nem outro.",
          "Todo o resto em Vitality. O Nightmare é o próximo e aplica −40 em cada resistência que você tiver.",
        ],
        actions: [
          "**Rescue on Mount Arreat** dá um ponto de skill. **Prison of Ice** dá um respec completo grátis — um segundo token, e o motivo de você poder experimentar no 30.",
          "**Builds de javelin fazem respec aqui.** Tudo que você gastou na árvore de arco volta, e Power Strike, Lightning Bolt e Charged Strike são para onde vai.",
          "Ancient's Pledge se você estiver carregando escudo. Três runas, e é o que torna os −40 do Nightmare sobrevivíveis.",
          "**O Nightmare aplica −40 em todas as resistências no instante em que você entra.** Conserte no Normal, e não no Ato 2 do Nightmare quando as coisas começarem a te matar.",
          "Rode o **Baal** no fim do Normal pelos níveis. Chegar ao 30 antes do Nightmare deixa a dificuldade inteira mais fácil.",
        ],
        exitCriteria: "Baal morto, nível 30+, resistências rumo aos 75%, e a build decidida.",
      },
      "ama-nightmare": {
        name: "Nightmare, e o primeiro equipamento de verdade",
        summary:
          "Níveis 32-60. Titan's Revenge, Melody e uma Valkyrie que sobrevive. As resistências são a dificuldade inteira.",
        location: "Nightmare, Ato 1 até o Ato 5",
        goal: "Chegar ao nível 60 com 75% de resistências e as skills centrais da build maximizadas.",
        killingWith: "A skill principal que você escolheu no 30, com a primeira sinergia subindo.",
        skillPoints: [
          "**Maximize a skill principal primeiro, depois a sinergia dela.** Qual sinergia é essa depende da build, e cada página de build nomeia isso na ordem de maximização — Cold Arrow para o Freezing Arrow, Fire Arrow para o Exploding Arrow, Lightning Bolt para as de javelin, Guided Arrow para o Strafe.",
          "**Um ponto na Valkyrie basta** nesta etapa; os +skills do equipamento aumentam ela. Pontos no Decoy aumentam a vida dela, e esse é o motivo para gastar mais de um.",
          "Continue alimentando **Critical Strike** se o seu dano for físico, e **Penetrate** se você estiver errando.",
        ],
        statPoints: [
          "Strength suficiente para o escudo ou o cinto rumo aos quais você está indo — um Thundergod's Vigor são 110 e um Stormshield são 156.",
          "Dexterity para bloqueio máximo se você carregar escudo. A Amazon divide a tabela de bloqueio com o Paladin, então sai mais barato para ela do que para qualquer um exceto ele.",
          "Todo o resto em Vitality.",
        ],
        actions: [
          "**Titan's Revenge** é a javelin que as duas builds de javelin e a de veneno querem. Ela se repõe sozinha, e é isso que torna uma build de arremesso jogável.",
          "A **Melody** no nível 39 são +3 na aba inteira de Bow and Crossbow mais +3 em cada um de Critical Strike, Dodge e Slow Missiles, por três runas baixas. Doze níveis de skill.",
          "O **Razortail** são 33% de Piercing Attack por 20 de Strength — e não vale absolutamente nada para Charged Strike, Lightning Strike, Jab ou Fend, que nunca disparam um projétil.",
          "Um **Insight** no mercenário. O Freezing Arrow custa 36 de mana e sobe; toda outra skill de Amazon é mais barata, mas nenhuma é de graça.",
          "**Countess** e **Andariel** no Nightmare. As runas fazem tudo que está acima e a Andariel é a run de boss mais curta do jogo.",
          "**O Hell aplica −100 em todas as resistências.** Ficar exatamente em 75% no Nightmare significa −25% no Hell. Estoure o teto antes de atravessar.",
        ],
        gearTargets: [
          { why: "+2 skills de Amazon por três runas baratas, e 20% de Faster Hit Recovery." },
          { why: "Cannot Be Frozen, attack rating e Dexterity — três coisas que toda build de Amazon quer." },
          { why: "33% de pierce, para as builds que disparam um projétil." },
        ],
        exitCriteria:
          "Nível 60, skill principal e primeira sinergia maximizadas, resistências acima de 75% no Nightmare.",
      },
      "ama-hell": {
        name: "Hell, e a imunidade que você precisa responder",
        summary:
          "Níveis 60-85. Toda build de Amazon encontra uma parede no Hell, e cada uma responde de um jeito.",
        location: "Hell, Ato 1 até o Ato 5",
        goal: "Farmar o Hell com constância, e comprar a única coisa sem a qual a sua build não vive.",
        killingWith: "A build pronta, mais o que ela carregar para as coisas que não consegue ferir.",
        skillPoints: [
          "Termine a ordem de maximização na página da sua build. Todo plano de Amazon deste site gasta 108 ou 109 dos 110 pontos fixos que um personagem nível 99 tem, então os últimos são os flexíveis.",
          "**As passivas são onde um personagem em dificuldade encontra sobrevivência.** Dodge, Avoid e Evade têm curvas decrescentes, então os primeiros pontos extras neles valem muito mais que os últimos.",
        ],
        statPoints: [
          "O que a arma e o escudo de endgame exigirem, e Vitality com o resto.",
          "**Pare de somar Dexterity quando o bloqueio máximo for alcançado.** Além disso ela compra attack rating e dano de arma, o que é real mas muito mais barato em outro lugar.",
        ],
        actions: [
          "**Cada build de Amazon tem exatamente uma parede.** As de raio não têm mastery, então precisam de Griffon's Eye, Thunderstroke ou um Infinity. As físicas precisam de Amplify Damage, Decrepify ou um Bone Break. As de fogo são as mais resistidas de todas e se apoiam no Guided Arrow.",
          "O **Fortitude** é o maior upgrade único para toda build física e para o Lightning Strike, cuja metade de arma gasta Enhanced Damage. Ele não faz absolutamente nada pelos raios do Lightning Fury.",
          "**Dracul's Grasp** para qualquer coisa em alcance corpo a corpo, e **Atma's Scarab** para qualquer coisa física. Os dois são baratos e os dois mudam o que a build consegue enfrentar.",
          "**The Pit, os Ancient Tunnels e o Mausoleum** são as três zonas de nível de área 85 que uma Amazon alcança cedo. Qual delas te serve depende do seu tipo de dano — a lista de imunidades na página de cada área é o que se deve ler.",
          "Um **Sunder Charm** é a resposta direta à imunidade da sua build, e cada um deles te custa alguma coisa. Leia a página do próprio charm antes de pegar um.",
          "**Uma segunda build de Amazon sai mais barato que um segundo personagem.** Titan's Revenge, Raven Frost, Fortitude e um Peace cobrem metade do equipamento de seis das oito builds, e um token de respec sobrando cobre o resto.",
        ],
        gearTargets: [
          { why: "+300% de Enhanced Damage para toda build cujo dano seja o da arma." },
          { why: "−15-20% de resistência a raio do inimigo, aplicados só a alvos que não são imunes." },
          { why: "Uma aura de Fanaticism num arco — velocidade de ataque, attack rating e dano de uma vez." },
        ],
        exitCriteria:
          "Farmando com constância uma zona de nível de área 85 no Hell, resistências em 75%, e uma resposta em mãos para a única imunidade pela qual a sua build não passa.",
      },
    },
  },

  necromancer: {
    summary:
      "Uma rota, sem respec, sem bifurcação. Raise Skeleton no nível 1, Corpse Explosion até o 8, e o mesmo personagem no 99 — a única coisa a decidir é o que fazer com os pontos que sobram.",
    overview: [
      "**Esta é a única jornada de classe do site sem decisão dentro dela.** O núcleo do Summoner (o invocador; o termo fica em inglês por ser o nome comunitário da build) é Raise Skeleton, Skeleton Mastery e Corpse Explosion. As três estão nas suas mãos até o oitavo nível ganho, e as três continuam sendo o que você maximiza no 99. Não existe nível em que você deixa de ser o que era.",
      "**O primeiro cadáver é o único problema da rota.** O Raise Skeleton precisa de um corpo e não consegue produzir um, então no nível 1 você mata o primeiro monstro pessoalmente, com uma wand. Dali em diante o exército se alimenta sozinho: esqueletos matam, corpos caem, o Corpse Explosion transforma corpos em mais corpos. Um mercenário do Ato 2 contratado no meio do segundo ato resolve o problema de vez, e até lá é você quem abre cada luta.",
      "**O Decrepify é destravado no nível 24, não no 30.** O Summon Resist também, e os dois são skills de um ponto — pegue um no 24 e o outro no 25 em vez de tentar os dois de uma vez. **Nenhum ponto de quest precisa ser guardado para nenhum dos dois**: os quatro que esta rota ganha no Normal são gastos no caminho até lá, no Teeth, no Corpse Explosion e duas vezes na Skeleton Mastery. O Lower Resist é a skill que chega no 30, e esta rota não a pega.",
      "**Criaturas invocadas não sofrem a penalidade de resistência por dificuldade.** Você perde 40 de resistência no Nightmare e 100 no Hell; o seu mercenário perde o mesmo; o exército não perde nada. Isso muda o que você equipa em cada transição — os charms de resistência são para você e para ele, e o exército só precisa ser levantado de novo.",
      "Se você quiser experimentar as builds de Poison Nova ou Bone Spear depois, a Den of Evil dá um token de respec grátis por dificuldade e você não vai ter usado nenhum. **Leia o aviso sobre o Iron Golem no plano de respec antes de gastar um.**",
    ],
    respecPlan: [
      {
        at: "Nunca, para esta rota",
        why: "Todo ponto do plano abaixo é um ponto do Summoner final. Não há nível desperdiçado e não há transição — e é por isso que esta é a classe mais recomendada para quem está jogando pela primeira vez.",
      },
      {
        at: "Uma vez, se você for para o Poison Nova",
        why: "O Poison Nova é destravado no nível 30 e as duas sinergias dele são quarenta pontos sozinhas, então não existe jeito de subir de nível dentro dele. Jogue esta rota e gaste o token do Normal no 30 ou depois. A página da build de Poison Nova começa exatamente dessa posição.",
      },
      {
        at: "Opcional, se você for para o Bone Spear",
        why: "O Bone Spear dá para subir com ele mesmo — o Teeth é um ataque de verdade no Normal e sinergia depois — então isso é preferência e não exigência. Muitos jogadores ainda sobem como Summoner porque um exército é mais rápido pelo Normal do que uma lança com sinergias pela metade, e fazem respec depois.",
      },
      {
        at: "Antes de qualquer uma delas: desfaça o seu Iron Golem",
        why: "**Um respec que remova o seu ponto em Iron Golem destrói o golem e o item do qual ele foi feito.** O item não é devolvido. Se você construiu um em algum momento desta rota, dispense-o de propósito — invoque um Clay Golem por cima dele — antes de gastar um token. É o único erro irreversível que a jornada consegue cometer.",
      },
    ],
    stages: {
      "nec-act-1-normal": {
        name: "O primeiro cadáver é seu",
        summary: "Níveis 1-11. Você mata o primeiro monstro pessoalmente, e depois nunca mais precisa.",
        location: "Ato 1 — Rogue Encampment até o Monastery",
        goal: "Limpar a Den of Evil, deixar o Corpse Explosion funcionando, e matar a Andariel.",
        killingWith: "A sua wand para exatamente um monstro, e depois oito esqueletos e uma explosão.",
        skillPoints: [
          "Nível 1: **Raise Skeleton**. Ele precisa de um cadáver, e ainda não existe um — mate o primeiro Fallen com a sua wand, e então levante-o.",
          "Nível 2: **Skeleton Mastery**. Cada ponto são +8 de vida e +2 de dano em cada esqueleto que você levantar depois.",
          "Nível 3: **Amplify Damage**. Um ponto, e é o maior multiplicador de dano físico do jogo — ele dobra o que o exército inteiro causa.",
          "Níveis 4-5: de volta para **Raise Skeleton** e **Skeleton Mastery**. Mais corpos, e cada um valendo mais.",
          "**O ponto da Den of Evil vai para o Teeth**, que você vai conjurar por uns quatro níveis e nunca mais. É o único pré-requisito do Corpse Explosion.",
          "Nível 6: **Clay Golem**. Ele desacelera o que acerta e é a linha de frente enquanto os esqueletos alcançam.",
          "Nível 7 mais ou menos: **Corpse Explosion**, assim que o Teeth estiver gasto e você tiver chegado ao nível 6. É o momento em que a classe começa a funcionar.",
          "Níveis 8-11: **Raise Skeleton**, **Skeleton Mastery**, e um ponto em **Weaken** por volta do nível 10 — é uma maldição de verdade contra um grupo corpo a corpo e é o primeiro elo em direção ao Decrepify.",
        ],
        statPoints: [
          "**Vitality primeiro, e quase só Vitality.** Você está atrás de um exército, mas o Normal é onde um Fallen Shaman perdido te encontra.",
          "**Strength** suficiente para a armadura que você está usando, e nada além.",
          "Nenhum Energy. Levantar um exército custa mana, e a resposta são poções agora e um mercenário com Insight depois.",
        ],
        actions: [
          "**Mate o primeiro monstro você mesmo.** O Raise Skeleton exige um cadáver e não consegue criar um — no nível 1 você não tem exército, nem golem, nem mercenário, então a wand na sua mão é todo o seu dano por uns trinta segundos.",
          "Limpe a **Den of Evil** por completo. A Akara dá **+1 ponto de skill** e um **respec completo grátis**. Coloque o ponto de skill no **Teeth** para o Corpse Explosion abrir no nível 6.",
          "Guarde o token de respec. Esta rota nunca precisa dele, e é ele que permite experimentar Poison Nova ou Bone Spear no mesmo personagem depois.",
          "Compre wands com a **Charsi** e a **Akara**. Uma wand mágica com +2 ou +3 em Raise Skeleton ou Skeleton Mastery vale mais que qualquer drop antes do Ato 3 — a contagem e a mastery leem o nível efetivo, então equipamento as aumenta exatamente como pontos.",
          "**Levante o exército de novo depois de cada nível ganho e de cada troca de wand.** A vida e o dano de um lacaio são gravados quando ele é criado e nunca recalculados, então oito esqueletos levantados antes de uma wand nova são oito esqueletos nos valores da wand antiga.",
          "Mate a **Blood Raven** por uma Rogue Scout grátis. Ela é um segundo corpo que produz cadáveres, o que neste nível é exatamente o que você precisa.",
          "Guarde qualquer armadura de corpo de 2 sockets para um **Stealth** no nível 17, e qualquer Bone Wand ou Grim Wand de 2 sockets para um **White** no 35.",
          "**A Andariel morre para o exército com Amplify Damage nela.** Levante um conjunto completo de esqueletos na sala anterior, entre, amaldiçoe-a, e detone os lacaios dela conforme caírem. Ela é cheia de veneno, então uma poção de antídoto importa mais do que qualquer coisa sobre a sua build.",
        ],
        exitCriteria: "Andariel morta, nível 12+, oito esqueletos de pé, e o Corpse Explosion encadeando.",
      },
      "nec-act-2-normal": {
        name: "O mercenário que abre a luta",
        summary: "Níveis 12-17. Golem Mastery no 12, e um mercenário do Ato 2 que resolve o problema do primeiro cadáver de vez.",
        location: "Ato 2 — Lut Gholein, os desertos e as tumbas",
        goal: "Contratar um mercenário do Ato 2, chegar ao nível 18, e matar o Duriel.",
        killingWith: "O exército, Amplify Damage, e correntes de Corpse Explosion pelos corredores das tumbas.",
        skillPoints: [
          "Nível 12: **Golem Mastery**. +20% de vida do golem e +25 de chance de acerto por nível, e é pré-requisito do Summon Resist.",
          "O **Raise Skeletal Mage** fica disponível no nível 12 e vale exatamente um ponto aqui. Os magos têm limite próprio, separado do dos esqueletos, então são corpos adicionais em vez de escolha — mas esta rota não faz deles um foco.",
          "Todo o resto vai para **Raise Skeleton**, **Skeleton Mastery** e **Corpse Explosion**, nessa ordem de preferência.",
          "**O ponto da quest do Radament vai para o Corpse Explosion.** Raio é tudo o que pontos compram ali, e raio é o que transforma uma explosão numa corrente.",
        ],
        statPoints: [
          "**Vitality**, com Strength apenas o suficiente para a sua armadura.",
          "Ainda nenhum Energy. O Insight do mercenário está chegando.",
        ],
        actions: [
          "**Contrate um Desert Mercenary do Ato 2 com o Greiz depois da quest do Radament, e pegue Might.** É a contratação mais importante da rota: ele produz o primeiro cadáver em cada sala nova, e a aura Might aumenta o dano físico do exército além do dele.",
          "Até agora *você* era quem abria cada luta. Daqui em diante é ele, e o seu trabalho passa a ser amaldiçoar e detonar em vez de atacar.",
          "O **Radament** dá +1 ponto de skill. Gaste no Corpse Explosion.",
          "Faça um **Stealth** no nível 17. Taxa de conjuração importa mais aqui do que parece — levantar dezesseis lacaios são dezesseis conjurações.",
          "**Fara** e **Drognan** vendem wands. Continue melhorando: dois níveis de skill a mais são dois esqueletos a mais e oito de vida a mais em cada um.",
          "**Entre no Duriel com o exército já levantado.** Não há cadáveres na sala dele e nada de onde levantar depois que a porta fecha — o que você levou é com o que você luta. Levante um conjunto completo no corredor de fora, coloque Amplify Damage nele, e deixe o mercenário e os esqueletos trabalharem.",
          "**O Decrepify seria a melhor maldição para o Duriel e você ainda não a tem** — ela corta pela metade o movimento e a velocidade de ataque dele, e é destravada no nível 24. O Amplify Damage é a resposta neste nível, e reconjurar o **Clay Golem** em cima dele é uma distração de verdade: o novo golem aparece onde você mira e compra alguns segundos para o exército. Custa mana que você pode querer para reinvocar, então é ferramenta e não plano.",
        ],
        exitCriteria: "Duriel morto, nível 18+, um mercenário do Ato 2 com Might, e um Stealth.",
      },
      "nec-act-3-4-normal": {
        name: "Selva, e a primeira decisão de maldição de verdade",
        summary: "Níveis 18-23. O Terror abre o caminho para o Decrepify, e o Izual paga dois pontos a mais.",
        location: "Ato 3 e Ato 4 — Kurast até o Chaos Sanctuary",
        goal: "Chegar ao nível 24 e matar o Diablo.",
        killingWith: "O exército, com o Corpse Explosion fazendo a maior parte da limpeza de verdade.",
        skillPoints: [
          "Um ponto em **Terror** assim que você passar do nível 12. É pré-requisito do Decrepify e você quer ele gasto antes do 24, e não no 24.",
          "**O Blood Golem fica disponível no nível 18, e esta rota só o pega como pré-requisito.** Ele divide vida com você nos dois sentidos, o que é passivo em vez de benefício — não o invoque de propósito. Pegue o ponto só se você pretende construir um Iron Golem depois.",
          "Todo o resto: **Raise Skeleton**, **Skeleton Mastery**, **Corpse Explosion**.",
          "**Os dois pontos do Izual vão para a Skeleton Mastery.** É a skill que decide se o exército sobrevive ao Nightmare, e ela alcança revives e magos além dos esqueletos.",
        ],
        statPoints: [
          "**Vitality.** O Ato 3 é onde um Necromancer descobre que Flesh Beasts não ligam para o exército.",
          "Strength só para o que você está usando.",
        ],
        actions: [
          "O **Izual** dá +2 pontos de skill. Skeleton Mastery.",
          "Dê ao mercenário um **Insight** assim que uma Ral, uma Tir, uma Tal e uma Sol estiverem juntas. O Meditation encerra o seu problema de mana de vez, e reconstruir um exército é a coisa mais cara que você faz.",
          "**O Corpse Explosion está fazendo a maior parte da limpeza a esta altura, e vale entender por que ele não escala como você espera.** O dano dele é 70-120% da vida base do tipo de monstro explodido, então ele cresce quando você enfrenta coisas mais duras e quando você muda de dificuldade — nunca porque você colocou outro ponto nele. Os pontos compram raio.",
          "**O fosso do Mephisto não é o truque desta build.** O exército precisa alcançá-lo, e ficar do outro lado da água enquanto os esqueletos se recusam a nadar é uma viagem desperdiçada. Entre, amaldiçoe, e lute com ele na sala.",
          "O Chaos Sanctuary é o lugar mais denso em que você esteve e a primeira vez que o Corpse Explosion encadeia por uma sala inteira. Também é cheio de Doom Knights, que são exatamente o tipo de cadáver que vale explodir.",
        ],
        exitCriteria: "Diablo morto, nível 24+, Terror gasto, e um Insight no mercenário.",
      },
      "nec-act-5-normal": {
        name: "Vinte e quatro e vinte e cinco, uma skill em cada",
        summary: "Níveis 24-29. Summon Resist e Decrepify destravam os dois aqui, e um level-up para cada é tudo de que precisam.",
        location: "Ato 5 — Harrogath até a Worldstone Chamber",
        goal: "Terminar o Normal, e entrar no Nightmare com a árvore de maldições aberta.",
        killingWith: "O exército, Decrepify em qualquer coisa perigosa, e Corpse Explosion em todo o resto.",
        skillPoints: [
          "Nível 24: **Summon Resist**. Um ponto, e um ponto é quase a skill inteira — a curva vai de 20% em direção a um teto de 75% e achata na hora. Ela aumenta resistência a fogo, raio, frio e veneno em esqueletos, magos e golens, e não alcança nem físico nem mágico.",
          "Nível 25: **Decrepify**. Ele é destravado no nível 24 junto com o Summon Resist, e um dos dois espera um nível. **Você não precisa dos dois no mesmo instante e nenhum ponto de quest está sendo guardado para nenhum deles** — os quatro que esta rota ganha no Normal já foram gastos antes de você chegar aqui, no Teeth, no Corpse Explosion e duas vezes na Skeleton Mastery. Dois level-ups seguidos compram os dois, e a ordem é a única decisão: **Summon Resist primeiro se quem morre é o exército, Decrepify primeiro se é você.** O Decrepify são −50% de movimento, velocidade de ataque, dano causado e resistência física, tudo de uma vez.",
          "**O Iron Golem fica disponível no nível 24 e é opcional.** Leia o aviso abaixo antes de gastar o ponto.",
          "Todo o resto: **Raise Skeleton**, **Skeleton Mastery**, **Corpse Explosion**.",
        ],
        statPoints: [
          "**Vitality**, e comece a pensar na Strength para uma Heirophant Trophy — 58 — se um Homunculus estiver no seu futuro.",
        ],
        actions: [
          "**O Summon Resist não está compensando penalidade nenhuma.** Criaturas invocadas não sofrem as perdas de −40 e −100 de resistência que você e o seu mercenário sofrem no Nightmare e no Hell — as colunas de resistência de cada lacaio trazem o mesmo valor nas três dificuldades. Então este ponto é adição pura em vez de conserto, e é exatamente por isso que um basta e vinte não é plano.",
          "**O Decrepify agora é a sua maldição de boss e o Amplify Damage continua sendo a de limpeza.** Só uma maldição pode estar num monstro por vez, então lançar uma substitui a outra — a pergunta nunca é qual é mais forte, e sim qual você está abrindo mão.",
          "**Se você construir um Iron Golem, use algo cuja perda não te incomode.** Ele é o único lacaio que sobrevive a você sair de uma partida, e é destruído por morrer, pelo seu personagem morrer, por qualquer outro golem que você invoque, e por um respec que remova a skill. O item é consumido no instante da conjuração e nunca é devolvido. Um raro sobrando ou uma runeword barata — nunca um Pride, um Insight, um Beast ou um Infinity.",
          "**O Larzuk socketa um item de graça.** Uma wand de 2 sockets para um White no nível 35 é o melhor uso dele nesta rota.",
          "**Não corra para os Ancients.** Eles batem forte o bastante para apagar um exército, não há cadáveres na arena, e você não pode sair para buscar mais. Leve um conjunto completo, amaldiçoe com Decrepify em vez de Amplify Damage, e esteja pronto para levantar de novo a partir do primeiro que morrer.",
          "A sala do trono do Baal é o melhor lugar do Normal para praticar o ritmo que você vai usar pelo resto do jogo: levantar antes da onda, amaldiçoar a onda, detonar o primeiro corpo.",
        ],
        exitCriteria: "Baal morto, nível 30+, Summon Resist e Decrepify os dois gastos.",
      },
      "nec-nightmare": {
        name: "Nightmare, e o exército que não percebe",
        summary: "Níveis 30-50. As suas resistências caem 40 e as do exército não caem nada. O Arm of King Leoric no 36 muda tudo.",
        location: "Nightmare, do Ato 1 ao Ato 5",
        goal: "Chegar ao nível 50, colocar as suas resistências no teto, e pegar a wand que carrega o resto do Nightmare.",
        killingWith: "Um exército maior, Corpse Explosion com raio de verdade, e Decrepify em qualquer coisa com nome.",
        skillPoints: [
          "**Raise Skeleton e Skeleton Mastery até vinte, nessa ordem**, e depois Corpse Explosion até vinte. É esse o plano inteiro daqui até uns nível 75.",
          "**O Revive fica disponível no nível 30 e esta rota o trata como opcional.** Ele custa três pontos que você não gastaria de outro jeito — Raise Skeletal Mage, Blood Golem e Iron Golem — em cima do Raise Skeleton e do Clay Golem que o plano central já tem. Cada revive dura três minutos fixos, não pode ser renovado, e não recebe Summon Resist. É uma leva de corpos para uma sala difícil, não um exército.",
          "Não pegue o **Lower Resist**, que é destravado no nível 30. O que ele reduz é resistência elemental; o que este exército causa é dano físico, e o único dano elemental do plano é metade de uma skill. Seis pontos de maldição para melhorar essa metade é a pior troca da árvore para esta build.",
        ],
        statPoints: [
          "**Vitality**, e a Strength para o que você realmente está usando.",
          "A Heirophant Trophy em que um Homunculus fica pede 58 de Strength, e ele chega no nível 42.",
        ],
        actions: [
          "**Você perde 40 de cada resistência aqui. O seu exército não perde nada.** Os charms de resistência e o equipamento são para você e para o mercenário — as resistências de um lacaio são o mesmo número no Nightmare que eram no Normal, e não existe isso de equipar as invocações para resistência.",
          "**O Arm of King Leoric no nível 36 é a maior melhoria isolada da rota.** +2 em Summoning e +2 em Poison and Bone, mais +3 em Raise Skeleton e +3 em Skeleton Mastery — as duas metades da build numa wand que cai aqui e não custa nada.",
          "Um **White** no nível 35 é a alternativa e vale a pena guardar os dois. +3 em Poison and Bone e +4 em Skeleton Mastery — mais raio de explosão e esqueletos mais fortes, e nada para a contagem.",
          "**Homunculus no nível 42.** +2 skills de Necromancer, +2 em Curses, All Resistances +40 e +40% de bloqueio, que é quase um plano de resistência inteiro num slot.",
          "Um **Bone** no nível 47 por +2 skills de Necromancer e +100-150 de mana, ou um **Splendor** numa shrunken head de 2 sockets no 37 se duas runas Um não forem acontecer.",
          "**Levante o exército de novo depois de cada um desses.** Uma wand nova melhora o próximo esqueleto e nenhum dos oito já de pé — é o erro mais comum de um Summoner em evolução, e custa um terço da força do exército por todo o tempo em que passar despercebido.",
          "**Imunes a físico começam a aparecer aqui, e o Amplify Damage é a resposta.** Ele corta 100 pontos de resistência a dano físico, e contra um imune a regra de um quinto deixa −20 — o bastante para quebrar qualquer coisa até 119%. Os −50 do Decrepify viram −10, que quebram o mesmo monstro em 100% mas param em 109%. Puxe o Amplify Damage num imune porque ele vai o dobro de fundo; o Decrepify simplesmente acaba antes.",
        ],
        exitCriteria: "Baal do Nightmare morto, nível 50+, resistências no teto, e uma wand desta etapa em mãos.",
      },
      "nec-hell": {
        name: "Hell, com o mesmo exército",
        summary: "Níveis 50-99. Menos 100 nas suas resistências e nenhuma nas deles, e a segunda metade do Corpse Explosion começa a valer os pontos.",
        location: "Hell, do Ato 1 em diante",
        goal: "Terminar o plano central, e escolher a rota de farm na página da build Summoner.",
        killingWith: "Dezesseis lacaios, um golem, Amplify Damage, e correntes de Corpse Explosion.",
        skillPoints: [
          "Termine **Raise Skeleton**, **Skeleton Mastery** e **Corpse Explosion** com vinte cada. Com os pré-requisitos e a cadeia do Decrepify isso são 68 pontos, e é o plano obrigatório inteiro.",
          "**Os pontos restantes são genuinamente abertos**, e a página da build Summoner lista os destinos em vez de escolher um: Raise Skeletal Mage por um segundo exército, Golem Mastery se o golem viver morrendo, **Bone Wall** para transformar o Bone Armor num escudo de verdade, ou o raio do Amplify Damage. **O Bone Prison é o que custa mais do que parece**: ele exige Bone Spear além de Bone Wall e Bone Armor, embora o Teeth e o Corpse Explosion por baixo dele já estejam no plano central.",
        ],
        statPoints: [
          "**Vitality**, e Strength suficiente para a armadura de endgame que você está mirando.",
          "Com Battle Orders de um Call to Arms, 1000-1500 de vida é um número confortável no Hell para um personagem que raramente é o alvo.",
        ],
        actions: [
          "**Menos 100 em todas as suas resistências, e ainda nada nas do exército.** Coloque as suas no teto antes de levar o Hell a sério, equipe o mercenário para as dele — ele sofre a penalidade inteira exatamente como você — e pare de pensar nas resistências dos lacaios por completo. O ponto único de Summon Resist é tudo que eles vão ganhar e tudo de que precisam.",
          "**A imunidade física é o problema e você tem duas respostas para ela.** O Amplify Damage a quebra para os esqueletos em qualquer valor abaixo de 120%; a metade de fogo do Corpse Explosion entra num imune a físico independentemente de qualquer maldição. O Decrepify alcança metade disso — o corte dele já é metade e depois é reduzido a um quinto contra um imune, sobrando 10 pontos — então ele quebra um imune entre 100% e 109% e nada mais fundo. Ele continua sendo a maldição de sobrevivência, e o Amplify Damage continua sendo a resposta à imunidade.",
          "**Os magos esqueletos são a terceira resposta** e os pontos flexíveis mais baratos que você pode gastar. O dano deles é elemental e sorteado da skill, não da linha de monstro, então continuam funcionando onde os esqueletos pararam.",
          "**Chefes de ato machucam o exército muito mais do que qualquer coisa antes deles.** Andariel, Duriel, Mephisto, Diablo e Baal carregam todos uma marcação de Prime Evil que aumenta o dano que eles causam especificamente a invocações. Espere reinvocar no meio da luta, e leve cadáveres para dentro da sala quando der.",
          "**Skin of the Vipermagi ou Chains of Honor** pelas suas resistências, um **Harlequin Crest**, e por fim um **Enigma** — o Teleport chama o exército inteiro na hora, e é o único item que muda como esta build é jogada.",
          "**O Mausoleum é o melhor primeiro farm de Hell para esta build**: área de nível 85, denso, morto-vivo, e as imunidades registradas dele são veneno e frio em vez de qualquer coisa que você cause.",
          "Daqui em diante a página da build **Summoner Necromancer** assume — tiers de equipamento, rotas de farm e os pontos flexíveis. Nada no personagem muda.",
          "**Se você for trocar para Poison Nova ou Bone Spear, desfaça qualquer Iron Golem primeiro.** Um respec remove a skill e destrói o golem e o item dentro dele. Invoque um Clay Golem por cima, e então gaste o token.",
        ],
        exitCriteria: "68 pontos centrais gastos, resistências do Hell no teto, e uma rota de farm escolhida.",
      },
    },
  },
  druid: {
    summary:
      "Suba de nível no fogo, faça um respec no Ato 3 do Nightmare, e termine no vento. As duas metades da árvore elemental não compartilham sinergia nenhuma, então isso é uma mudança real de personagem e não um regasto.",
    overview: [
      "**Você não evolui como Wind Druid.** O Tornado abre no 24 e o Hurricane no 30, e nenhum dos dois vale nada até Cyclone Armor e Twister estarem atrás deles — sessenta pontos depois. Tentar jogar a árvore do vento a partir do nível 24 é o motivo mais comum de um Druid novo concluir que a classe é fraca.",
      "Suba de nível no fogo. O Firestorm funciona desde o nível 1, o Molten Boulder no 6, e o Fissure no 12 carrega o personagem até o meio do Nightmare sem equipamento além de um cajado de duas runas. Depois faça respec, uma vez, para a árvore do vento — a Den of Evil dá um token grátis em toda dificuldade, então não custa nada.",
      "**O respec é no Ato 3 do Nightmare, antes do Mephisto, por volta do nível 38.** Isso não é intuição: 43 pontos é exatamente o que a abertura do vento custa, e 43 é exatamente o que um personagem de nível 38 com as recompensas da Den of Evil e do Radament do Nightmare tem. Faça antes e o Hurricane não fica maximizado; faça depois e você gastou níveis numa árvore que está prestes a abandonar.",
      "Se você preferir ficar no fogo, essa é uma escolha real e este site a documenta como build. Ela custa um Sunder Charm Flame Rift ou um Infinity, porque fogo é o elemento mais resistido no Hell. A rota do vento não custa nenhum dos dois, e é por isso que ela é o padrão aqui.",
      "A outra coisa para internalizar cedo: **o que te trava são as resistências, não o dano**. O Nightmare aplica -40% em todas as suas e o Hell aplica -100%. Planeje para isso antes do Ato 5 do Nightmare, não depois.",
    ],
    respecPlan: [
      {
        at: "Ato 3 do Nightmare, por volta do nível 38 — o token da Den of Evil",
        why: "O único respec de que a rota precisa. Fogo para fora, vento para dentro, e o total de pontos cai exatamente em Tornado 20 mais Hurricane 20 mais três pré-requisitos.",
      },
      {
        at: "Opcional — Ato 1 do Hell",
        why: "Guarde o token da Den of Evil do Hell de reserva. Se o respec do nível 38 te deixou dividido de forma estranha, esta é uma segunda tentativa limpa, e o token do Normal continua intocado.",
      },
    ],
    stages: {
      "druid-act-1-normal": {
        name: "Três ondas de fogo",
        summary: "Níveis 1-13. Firestorm desde o primeiro ponto, e Fissure até o fim do ato.",
        location: "Ato 1 — Blood Moor até as Catacombs",
        goal: "Limpar a Den of Evil, comprar um cajado Leaf, e chegar ao Fissure no 12.",
        killingWith: "Firestorm, conjurado por um corredor e deixado rastejando.",
        skillPoints: [
          "**Firestorm até 10** — um ponto por nível do 2 ao 11, mais a recompensa da Den of Evil.",
          "**Molten Boulder 1** no nível 6. Só um ponto. Ele é pré-requisito e empurrão, não dano.",
          "**Fissure 2** nos níveis 12 e 13. Tudo daqui em diante vai para ele.",
          "São 13 pontos: 12 dos níveis 2-13, e 1 da Den of Evil.",
        ],
        statPoints: [
          "Tudo em **Vitality** até que algo que você queira vestir diga o contrário.",
          "Nada de Energy. O Druid não tem Warmth e poções de mana são de graça.",
        ],
        actions: [
          "Limpe a **Den of Evil** pelo ponto de skill e pelo token de respec grátis. Guarde o token.",
          "Compre um cajado de 2 soquetes da Akara e faça **Leaf** nele: +3 em Fire Skills por duas runas comuns. Nesta build são +3 Fissure, +3 Firestorm e +3 Molten Boulder de uma vez. Faça assim que as runas caírem, mas note que você só consegue empunhar no nível 19.",
          "Corra **a Countess** por Tal, Eth, Ith, Ral, Ort e Sol. Elas constroem Leaf, Stealth, Lore e, mais adiante, Ancients' Pledge.",
          "O empurrão do Molten Boulder vale mais que o dano dele neste nível. Use-o para comprar a distância de continuar conjurando.",
          "Não gaste um ponto em Werewolf ou Werebear \"por precaução\". Um único ponto numa forma que você não está construindo é um ponto de que o Fissure precisava.",
        ],
        gearTargets: [
          {
            why: "O item mais eficiente que este personagem veste na vida, e ele está disponível no nível 19 num cajado que você compra.",
          },
          {
            why: "Velocidade de conjuração, recuperação e corrida a partir do nível 17, por duas runas da Countess.",
          },
        ],
        exitCriteria: "A Andariel está morta e o Fissure está na barra.",
      },
      "druid-acts-2-5-normal": {
        name: "O chão faz o trabalho",
        summary: "Níveis 13-26. Fissure até 18, e o Normal terminado com ele.",
        location: "Atos 2 a 5 — Lut Gholein até a Worldstone Keep",
        goal: "Maximizar o Fissure até onde o nível permite, e contratar o mercenário que você vai manter.",
        killingWith: "Fissure em cada porta, e Firestorm no que sobreviver.",
        skillPoints: [
          "**Tudo no Fissure**, de 2 até 18.",
          "São 16 pontos: 13 dos níveis 14-26, mais Radament e Izual.",
          "Nada vai para o Volcano ainda — ele abre no 24, e o Fissure continua sendo o ponto melhor até estar maximizado.",
        ],
        statPoints: [
          "**Vitality**, com apenas a Strength necessária para a armadura que você está de fato usando.",
          "Dexterity fica na base.",
        ],
        actions: [
          "Contrate o **Desert Mercenary do Ato 2** com a aura Defiance no Normal. É ele que você mantém pelo resto do jogo.",
          "**Radament** no Ato 2 e **Izual** no Ato 4 são mais três pontos de skill. Não pule.",
          "**Lam Esen's Tome** no Ato 3 são cinco pontos de atributo, em toda dificuldade.",
          "Faça **Lore** num elmo de 2 soquetes assim que uma Ort e uma Sol existirem. Num pelt de Druid ele soma com o +skills do próprio pelt.",
          "O Fissure abre fendas num raio de 7 e elas disparam em intervalos. Coloque onde um grupo precisa passar, não onde o grupo está parado.",
        ],
        exitCriteria: "O Baal está morto e o Fissure está em 18.",
      },
      "druid-nightmare-early": {
        name: "Volcano, e o último do fogo",
        summary: "Níveis 26-38. Fissure maximizado, Volcano até 12, e o respec esperando no fim.",
        location: "Atos 1 a 3 do Nightmare — até os portões de Travincal",
        goal: "Chegar ao nível 38 com as resistências firmes, e parar antes do Mephisto.",
        killingWith: "Fissure, com Volcano embaixo do que ficar parado.",
        skillPoints: [
          "**Fissure de 18 para 20** — dois pontos.",
          "**Volcano até 12** com os doze restantes.",
          "São 14 pontos: 12 dos níveis 27-38, mais a Den of Evil e o Radament do Nightmare.",
          "Não faz muita diferença onde eles caem, porque todos os 43 voltam na etapa seguinte. O Volcano é simplesmente a coisa mais forte para se estar segurando quando isso acontecer.",
        ],
        statPoints: [
          "**Vitality**, e Strength suficiente para uma Monarch se você pretende usar dois Spirits depois do respec — 156 é uma conta grande e é mais barato começar a pagá-la agora.",
        ],
        actions: [
          "**O Nightmare aplica -40% em todas as suas resistências.** Resolva isso no Ato 1, não no Ato 5. Ancients' Pledge num escudo são +50% em todas as resistências por três runas da Countess.",
          "Faça **Spirit** numa espada de 4 soquetes no momento em que Tal, Thul, Ort e Amn existirem. 35% de velocidade de conjuração e +2 em todas as skills é o item sobre o qual toda a segunda metade desta jornada é construída.",
          "Depois do nível 30, use o **Imbue da Charsi num pelt branco de Druid**. É o elmo +2 em skills de Druid mais confiável que um personagem self-found vai ver.",
          "Pegue a recompensa da **Den of Evil do Nightmare** mas guarde o token de respec — você está prestes a precisar dele.",
          "Não lute contra o Mephisto ainda. A próxima etapa é um personagem diferente.",
        ],
        exitCriteria:
          "Nível 38, parado em Kurast, com o token de respec da Den of Evil do Nightmare por gastar.",
      },
      "druid-the-respec": {
        name: "O respec",
        summary: "Nível 38. Quarenta e três pontos saem da árvore de fogo e entram na do vento.",
        location: "Ato 3 do Nightmare — as Docas de Kurast, antes do Mephisto",
        goal: "Gastar todos os 43 pontos na abertura do vento, exatamente.",
        killingWith: "Tornado, desde a primeira conjuração.",
        skillPoints: [
          "**Arctic Blast 1** — o pré-requisito do Cyclone Armor, e 2 quadros de atordoamento no Twister.",
          "**Cyclone Armor 1** — o pré-requisito do Twister.",
          "**Twister 1** — o pré-requisito do Tornado.",
          "**Tornado 20** — todo o dano físico da build.",
          "**Hurricane 20** — o dano de frio dela, e uma sinergia de 9% por ponto para o Tornado.",
          "1 + 1 + 1 + 20 + 20 = **43**, que é exatamente o que um personagem de nível 38 com as quests do Normal e as recompensas da Den of Evil e do Radament do Nightmare tem. Não sobra nada.",
        ],
        statPoints: [
          "Nada muda. Atributos não são devolvidos por um token de respec e não precisavam ser.",
        ],
        actions: [
          "Use o **token da Den of Evil do Nightmare**. O do Normal fica no baú, e o do Hell também quando você o receber.",
          "Não espalhe os 43 pontos. Hurricane em 20 e Tornado em 20 é o plano inteiro; um Wind Druid com 10 em cada não mata nada.",
          "O Hurricane dura dez segundos no nível duro 20 e no nível duro 1 igualmente — o próprio nível dele não compra duração. Até o Cyclone Armor estar maximizado você vai reconjurar sem parar, e isso está certo.",
          "Mate o Mephisto agora. Ele é imune a frio no Hell mas não no Nightmare, e o dano físico do Tornado não se importa de todo jeito.",
        ],
        exitCriteria: "Mephisto no chão, e o personagem matando mais rápido do que matava uma hora atrás.",
      },
      "druid-nightmare-late-hell-early": {
        name: "O Cyclone Armor paga pela tempestade",
        summary:
          "Níveis 38-60. Cyclone Armor maximizado, que é o que transforma o Hurricane num buff em vez de uma obrigação.",
        location: "Atos 4 e 5 do Nightmare, depois Atos 1 e 2 do Hell",
        goal: "Maximizar o Cyclone Armor, fechar as resistências, e entrar no Hell.",
        killingWith: "Tornado, com o Hurricane no ar por quarenta segundos de cada vez.",
        skillPoints: [
          "**Cyclone Armor de 1 para 20** — dezenove pontos, e o trecho mais valioso da jornada. Cada um são cinquenta quadros a mais de Hurricane e 9% a mais de dano de Tornado.",
          "**Oak Sage 1** e **Raven 1** — dois pontos de utilidade que nunca precisam de mais.",
          "**Twister de 1 para 6** com os últimos cinco.",
          "São 26 pontos: 22 dos níveis 39-60, mais o Izual do Nightmare e a Den of Evil e o Radament do Hell.",
        ],
        statPoints: [
          "**Vitality** com tudo que não estiver pagando por uma Monarch.",
          "Mire em 1000 de vida ou mais antes do Ato 3 do Hell.",
        ],
        actions: [
          "**O Hell aplica -100% em todas as suas resistências.** Feche fogo, frio e raio antes do Ato 3, não durante.",
          "Um segundo **Spirit** numa Monarch de 4 soquetes. O par são 60% de velocidade de conjuração e +4 em todas as skills.",
          "**Skin of the Vipermagi** se uma cair: +1 skills, 30% de velocidade de conjuração e até 35 de todas as resistências fica perto de ser o melhor do slot até um Enigma.",
          "**Insight** para o mercenário. O Tornado é conjurado sem parar e o Druid não tem Warmth; Meditation é a diferença entre conjurar e beber.",
          "A recompensa da Anya no Ato 5 são +10 em todas as resistências por dificuldade. Pegue as três.",
        ],
        exitCriteria:
          "Ato 2 do Hell limpo, resistências em 75, e o Hurricane se segurando por quarenta segundos.",
      },
      "druid-hell-late": {
        name: "Twister, e um urso atrás de quem se esconder",
        summary: "Níveis 60-75. A última sinergia maximizada, e a linha de invocação pega por um ponto cada.",
        location: "Atos 3 a 5 do Hell",
        goal: "Terminar as quatro skills maximizadas e chegar ao nível 75.",
        killingWith: "Tornado dentro dos grupos, com um Grizzly segurando a porta.",
        skillPoints: [
          "**Twister de 6 para 20** — catorze pontos, a última sinergia de 9% do Tornado.",
          "**Summon Spirit Wolf 1**, **Summon Dire Wolf 1**, **Summon Grizzly 1** — três pontos por um urso que provoca.",
          "São 17 pontos: 15 dos níveis 61-75, mais o Izual do Hell.",
          "No nível 75 você gastou 86 dos 110 que um personagem de nível 99 terá, e as quatro skills que importam estão todas em 20.",
        ],
        statPoints: ["**Vitality**, tudo. 1400 de vida com Battle Orders é o número a mirar."],
        actions: [
          "**Arachnid Mesh** leva a velocidade de conjuração além do breakpoint de 99%. Até ela existir, dois anéis de 10% e um Magefist chegam perto.",
          "**Raven Frost** para não poder ser congelado. Numa build que fica parada conjurando, esta é uma linha de sobrevivência e não uma conveniência.",
          "Corra **o Pit** e o **Mausoleum** no Hell. Os dois são de nível de área 85, os dois são densos, e nenhum tem uma imunidade que barre físico e frio ao mesmo tempo.",
          "O Grizzly não pode ser reinvocado enquanto vive. Perdê-lo no meio da luta custa uma conjuração inteira de 40 de mana, então invoque antes da porta e não depois.",
        ],
        exitCriteria: "Nível 75, Baal morto no Hell, e toda área de nível 85 farmável.",
      },
      "druid-endgame": {
        name: "Vinte e quatro pontos e um Sunder Charm",
        summary: "Níveis 75-99. A build está pronta; o que resta é equipamento e os últimos pontos livres.",
        location: "Terror Zones, o Pit, o Chaos Sanctuary e a Worldstone Keep",
        goal: "Alcançar o breakpoint de 99% de velocidade de conjuração, e então gastar os pontos restantes.",
        killingWith: "Tornado e Hurricane, e por fim Teleport entre os grupos.",
        skillPoints: [
          "**Heart of Wolverine 1** se você for Softcore — +20% de dano para o mercenário e para o urso.",
          "**Todo o resto no Oak Sage.** O bônus de vida do grupo continua crescendo e a build não tem mais nada para comprar.",
          "São os últimos 24 pontos: 110 no total no nível 99, dos quais 86 já tinham sido gastos no nível 75.",
        ],
        statPoints: [
          "**Vitality**, menos o que os requisitos de uma Monarch e de um Enigma ainda quiserem.",
        ],
        actions: [
          "**Heart of the Oak** substitui o Spirit de arma: +3 skills, 40% de velocidade de conjuração e 40 de todas as resistências numa mão só.",
          "**Enigma** é a maior mudança que o personagem faz na vida. O Druid não tem skill de movimento, e o Teleport praticamente dobra a velocidade de limpeza.",
          "**Bone Break** é o acabamento opcional: um Sunder Charm físico para o grupo raro que o Hurricane sozinho demoraria demais para matar de frio.",
          "**Call to Arms** num swap de arma. Battle Orders é um terço a mais de vida numa classe com 2 de vida por Vitality.",
          "O personagem agora é a build Wind Druid por completo. Nada mais nesta jornada muda o plano de skills.",
        ],
        exitCriteria:
          "99% de velocidade de conjuração, resistências no teto, e Terror Zones em players 8.",
      },
    },
  },
  assassin: {
    summary:
      "Evolua com fogo desde o primeiro ponto, faça um respec no Ato 4 do Nightmare por volta do nível 45, e termine com traps de raio. As duas metades da árvore de traps não compartilham sinergia nenhuma, então isso é uma troca de personagem de verdade, e não um re-gasto.",
    overview: [
      "**Você não evolui como Lightning Trapsin.** O Lightning Sentry só abre no 24 e o Death Sentry no 30, e os dois são quase inúteis enquanto Shock Web e Charged Bolt Sentry não estiverem atrás deles — quarenta pontos depois. Toda trap de raio tem dano mínimo 1 em todo nível, então uma trap com metade do investimento não dá metade do dano; ela dá um número entre 1 e alguma coisa, quase sempre mais perto de 1.",
      "Evolua com fogo. O Fire Blast funciona desde o nível 1 e é pré-requisito dos dois ramos de qualquer forma, então os onze primeiros pontos são obrigatórios, não uma escolha. O Wake of Fire chega no 12 e **o Fire Blast alimenta ele em 10% por ponto duro**, o que significa que nada do que você já gastou é desperdiçado no momento em que você troca.",
      "**O respec é no Ato 4 do Nightmare, depois do Izual, no nível 45.** Isso não é intuição. Cinquenta e dois pontos é exatamente o que a abertura de raio custa, e cinquenta e dois é exatamente o que um personagem nível 45 com todas as recompensas de quest do Normal e do Nightmare tem. Respec antes e o Charged Bolt Sentry não fica maximizado; respec depois e você gastou níveis numa árvore que está prestes a abandonar.",
      "A coisa a internalizar sobre o personagem pronto: **cinco traps, no total, compartilhadas entre todas as skills de sentry que você tem.** Não são cinco de cada. Uma barra rodando Lightning Sentry e Death Sentry juntos está dividindo as mesmas cinco, e é por isso que a rotação de endgame é quatro e uma, e não cinco e cinco.",
      "A outra coisa: **o que te trava são as resistências, não o dano.** O Nightmare aplica -40% em todas as suas e o Hell aplica -100%. O Fade é a resposta da Assassin e nesta rota ele fica em um ponto durante quase todo o jogo — mas Fade e Burst of Speed não podem estar ativos juntos, então a partir do momento em que você pega o Fade você escolhe um por luta.",
    ],
    respecPlan: [
      {
        at: "Ato 4 do Nightmare, nível 45 — depois do Izual, usando o token da Den of Evil do Nightmare",
        why: "O único respec de que a rota precisa, e a aritmética é a razão do nível. Voltam 52 pontos e a abertura de raio custa exatamente 52: Charged Bolt Sentry 20, Lightning Sentry 20, três pontos de corrente e o conjunto de nove pontos da Shadow.",
      },
      {
        at: "Guarde o token do Normal sem gastar",
        why: "Nada nesta rota precisa dele, e um respec sobrando vale mais do que qualquer coisa que você faria com ele no nível 20. Ele também é a rede de segurança se você levar a rota de fogo mais longe do que o planejado e quiser corrigir no Hell em vez de no Nightmare.",
      },
      {
        at: "Opcional — Ato 1 do Hell",
        why: "O token da Den of Evil do Hell é a segunda tentativa se o respec do nível 45 te deixou dividido de forma estranha. Aí você já sabe se quer Fade, Shadow Master ou Fire Blast nos últimos vinte pontos, e é aqui que dá para mudar essa resposta de graça.",
      },
    ],
    stages: {
      "ass-act-1-normal": {
        name: "Uma bomba em cada mão",
        summary:
          "Níveis 1-13. Fire Blast desde o primeiro ponto, e os dois pré-requisitos da Shadow em que tudo depois se apoia.",
        location: "Ato 1 — Blood Moor até as Catacombs",
        goal: "Limpar a Den of Evil, chegar a Fire Blast 11, e guardar o token de respec.",
        killingWith: "Fire Blast, jogado no meio de um grupo.",
        skillPoints: [
          "**Fire Blast até 11** — um ponto no nível 1, um por nível até o 11, mais a recompensa da Den of Evil.",
          "**Claw Mastery 1** e **Burst of Speed 1** nos níveis 6 e 7. Dois pontos, e eles não são opcionais: o Claw Mastery é o portão de tudo que você vai querer na árvore Shadow, e o Burst of Speed é o pré-requisito do Fade — que substitui ele, porque conjurar um derruba o outro.",
          "São 13 pontos: 12 dos níveis 2-13, e 1 da Den of Evil.",
          "**Não coloque ponto no Shock Web no 6.** Ele é do ramo de raio, e o respec do 45 é onde esse ramo começa.",
        ],
        statPoints: [
          "Tudo em **Vitality**. A Assassin começa com 20 de Strength, Dexterity e Vitality e 25 de Energy, e ganha 3 de vida por ponto de Vitality.",
          "Nada de Energy. O Fire Blast custa quase nada e poções de mana são de graça.",
          "Strength só quando uma peça específica de armadura pedir, e só o exato necessário.",
        ],
        actions: [
          "Limpe a **Den of Evil** por completo pelo ponto de skill e pelo token de respec grátis. Fale com a Akara depois — o ponto não é automático.",
          "**O Fire Blast é arremessado, não colocado.** Ele faz um arco até onde você mira e explode num raio de 5, então é uma granada e não uma trap. Jogue no meio do grupo, não no bicho mais perto.",
          "**O Burst of Speed são 15% de velocidade de corrida com um ponto**, e uma Assassin que arremessa em vez de lutar passa quase todo o Ato 1 andando. Ele também é pré-requisito do Fade, que é o motivo real de comprar agora e não no 18.",
          "Qualquer garra com **+ em Traps** ou **+ em Fire Blast** ganha de qualquer garra com dano melhor. Charsi e Gheed renovam o estoque toda vez que você volta à cidade, e uma garra mágica com +2 Traps é um resultado comum cedo.",
          "Rode a **Countess** por Tal, Eth, Ral e Ort. Elas montam Stealth e Leaf, que são os dois itens que carregam este personagem pelo Normal.",
          "Mate a **Blood Raven** e pegue a Rogue Scout grátis da Kashya. Um corpo à distância que atira em coisas vale a pena mesmo que o mercenário do Ato 2 substitua ela depois.",
          "Não gaste ponto em Tiger Strike, Dragon Talon nem em nada da árvore Martial Arts \"por via das dúvidas\". Nada nesta rota usa isso, e o respec do 45 está calculado no ponto.",
        ],
        gearTargets: [
          {
            why: "25% de corrida, conjuração e recuperação a partir do nível 17, por duas runas da Countess. A recuperação é a metade que te mantém vivo.",
          },
          {
            why: "**+3 em Fire Skills** numa staff de dois sockets no nível 19 — isto é, +3 Fire Blast e, a partir do nível 12, +3 Wake of Fire, por uma Tir e uma Ral.",
          },
        ],
        exitCriteria: "A Andariel está morta, o Fire Blast está em 11, e você tem um token de respec sem gastar.",
      },
      "ass-acts-2-5-normal": {
        name: "O chão pega fogo",
        summary: "Níveis 13-26. Wake of Fire a partir do 12, e o Normal terminado nele.",
        location: "Atos 2 a 5 — Lut Gholein até a Worldstone Keep",
        goal: "Levar o Wake of Fire a 16, contratar o mercenário que você vai manter, e terminar o Normal.",
        killingWith: "Wake of Fire colocado em corredores, e Fire Blast no que andar em volta.",
        skillPoints: [
          "**Tudo no Wake of Fire**, de 1 no nível 12 até 16 no nível 26.",
          "São 29 pontos gastos no total: 25 dos níveis, mais Den of Evil, Radament e Izual. Fire Blast 11, Claw Mastery 1, Burst of Speed 1, Wake of Fire 16.",
          "**O Fire Blast fica em 11 por enquanto.** Ele alimenta o Wake of Fire em 10% por ponto duro e o Wake of Fire devolve na mesma taxa, então os dois sobem juntos depois — mas o Wake of Fire é o que luta por você, e é uma trap.",
        ],
        statPoints: [
          "**Vitality**, ainda. A única exceção é Strength suficiente para uma armadura de corpo que você realmente queira usar.",
          "**O Lam Esen's Tome no Ato 3 dá 5 pontos de atributo** e é fácil de perder. Faça o desvio.",
          "Nada de Dexterity. O Weapon Block não lê Dexterity, e nada neste plano precisa acertar nada com arma.",
        ],
        actions: [
          "**O Wake of Fire é uma trap, e o Fire Blast não é.** Daqui em diante seu dano é colocado no chão com antecedência e disparado pelo que passar por cima, o que é um jeito completamente diferente de jogar em relação aos doze primeiros níveis. Coloque primeiro, puxe depois.",
          "**Cinco traps por vez, compartilhadas entre todas as skills de sentry.** Nesta altura isso quer dizer cinco Wake of Fire e mais nada, que é exatamente o que você quer: elas se somam, então cinco num corredor é cinco vezes o fogo.",
          "Contrate um **Desert Mercenary do Ato 2** no Nightmare quando chegar lá, ou o do Normal agora se preferir. Pegue a variante com aura **Defiance** — o mercenário de uma trapper é uma parede, não fonte de dano.",
          "Faça o **Radament** no Ato 2 e o **Izual** no Ato 4. São três dos quatro pontos de skill que esta dificuldade te deve, e a aritmética da rota assume os quatro.",
          "Faça o **Leaf** numa staff de dois sockets assim que tiver uma Tir e uma Ral. +3 em Fire Skills é +3 Wake of Fire e +3 Fire Blast ao mesmo tempo, e é o maior upgrade único que este personagem recebe antes do Nightmare.",
          "Uma staff te custa o **Weapon Block**, que exige uma garra em cada mão. Nesta rota essa troca é a certa — você não está em corpo a corpo e +3 em Fire Skills vale mais do que uma chance de bloqueio que você não vai usar — mas é uma troca, não algo de graça.",
          "**Ancients' Pledge** num escudo de três sockets se você preferir resistências às skills da staff. A Assassin pode usar escudo; ela só não consegue bloquear com garras enquanto faz isso.",
        ],
        gearTargets: [
          {
            why: "+1 em All Skills num elmo de dois sockets por uma Ort e uma Sol. Barato, e nunca deixa de valer a pena até um Shako.",
          },
          {
            why: "**+2 em All Skills e até 35% de conjuração** num escudo de quatro sockets no nível 25. Os +2 skills são o dano; a conjuração acelera o Mind Blast e o Cloak of Shadows, e não faz nada pela velocidade com que uma trap desce.",
          },
        ],
        exitCriteria: "O Baal está morto, o Wake of Fire está em 16, e os quatro pontos de quest do Normal estão gastos.",
      },
      "ass-nightmare-early": {
        name: "As duas metades do fogo",
        summary: "Níveis 26-40. Fire Blast e Wake of Fire os dois em 20, e os últimos três pré-requisitos da Shadow.",
        location: "Nightmare, Atos 1 a 3 — Rogue Encampment até Travincal",
        goal: "Maximizar o par de fogo, pegar os três pontos de Shadow que o respec vai precisar de qualquer jeito, e subir resistência antes do Ato 4.",
        killingWith: "Cinco Wake of Fire empilhados num corredor, com Fire Blast para o que não quiser entrar neles.",
        skillPoints: [
          "**Wake of Fire 16 → 20** (+4), depois **Fire Blast 11 → 20** (+9). Treze pontos, e eles se multiplicam: cada um alimenta o outro em 10% por ponto duro, então o par maximizado vale muito mais do que qualquer um dos dois sozinho.",
          "**Psychic Hammer 1, Cloak of Shadows 1, Weapon Block 1** — três pontos. Todos eles são pré-requisitos que o plano pós-respec paga de qualquer forma, então pegá-los agora não custa nada à rota.",
          "São 45 pontos no nível 40: 39 dos níveis, mais 4 pontos de quest do Normal e a Den of Evil e o Radament do Nightmare.",
          "**Não gaste o token de respec da Den of Evil do Nightmare aqui.** É o que o plano usa no 45.",
        ],
        statPoints: [
          "**Vitality**, e agora importa. O Nightmare aplica -40% em toda resistência que você tem.",
          "Strength suficiente para uma base de **Treachery** se você estiver indo atrás de uma — uma armadura de corpo de três sockets, e o Treachery chega no nível 43.",
          "Lam Esen's Tome de novo no Ato 3 do Nightmare: mais 5 pontos de atributo.",
        ],
        actions: [
          "**O Cloak of Shadows cega uma tela inteira e corta a defesa dela.** Um ponto, e é o botão que torna o Ato 3 do Nightmare sobrevivível para um personagem sem roubo de vida e sem bloqueio.",
          "**-40% em todas as resistências no momento em que você entra no Nightmare.** Um personagem com 75% de resistência a fogo no Normal entra com 35%. Resolva isso com charms e um Ancients' Pledge antes do Ato 3, não depois.",
          "Faça o **Treachery** numa armadura de corpo de três sockets quando tiver Shael, Thul e Lem. **+2 em Assassin Skill Levels**, 45% de velocidade de ataque, e 5% de chance de conjurar Fade nível 15 ao ser atingida — que é Fade sem você ter que apertar.",
          "**Countess no Nightmare** pelas runas médias, e **Lower Kurast** assim que conseguir limpar. As duas são rodadas baratas para um personagem cujo dano é colocado e não mirado.",
          "O Wake of Fire lança uma **linha** de ondas de fogo saindo da trap, não uma poça. Aponte para o corredor de onde o grupo vem; uma trap virada para a parede não faz nada.",
          "Coloque **Insight** no mercenário do Ato 2 se ainda não colocou. A Meditation resolve a mana da Assassin por completo, e são quatro runas baixas numa polearm de quatro sockets.",
        ],
        gearTargets: [
          {
            why: "+2 em Assassin Skill Levels por três runas médias, e um proc de Fade de graça. A armadura de melhor custo-benefício que esta classe já vestiu, e ela chega dois níveis antes do respec.",
          },
          {
            why: "+1 em skills, 30% de conjuração e até +35 em todas as resistências se as runas do Treachery ainda não apareceram.",
          },
        ],
        exitCriteria: "Fire Blast e Wake of Fire os dois em 20, Travincal limpo, e o token da Den do Nightmare sem gastar.",
      },
      "ass-the-respec": {
        name: "Cinquenta e dois pontos, exatos",
        summary: "Nível 45, Ato 4 do Nightmare. Fogo fora, raio dentro, e o total cai na conta certa.",
        location: "Ato 4 do Nightmare — Outer Steppes até o Chaos Sanctuary",
        goal: "Matar o Izual, pegar os dois pontos de skill, e fazer o respec com exatamente 52.",
        killingWith: "Fogo, até o instante em que você fala com a Akara. Depois, cinco Charged Bolt Sentries.",
        skillPoints: [
          "**Mate o Izual primeiro.** Ele dá 2 pontos de skill e o plano precisa deles: 44 dos níveis mais 8 das quests dá 52, e 52 é o que a abertura custa.",
          "**Faça o respec com o token da Den of Evil do Nightmare.** Os 52 voltam inteiros.",
          "Gaste assim: **Charged Bolt Sentry 20, Lightning Sentry 20**, depois **Fire Blast 1, Shock Web 1, Death Sentry 1** — essa é a corrente, um ponto por degrau, 43 no total.",
          "Depois o conjunto Shadow, um ponto em cada: **Claw Mastery, Burst of Speed, Fade, Weapon Block, Psychic Hammer, Cloak of Shadows, Shadow Warrior, Mind Blast, Shadow Master**. Nove pontos. 43 + 9 = 52. O Burst of Speed é comprado como pré-requisito do Fade e não para usar — conjurar um derruba o outro.",
          "**Charged Bolt Sentry antes de Shock Web**, mesmo os dois alimentando o Lightning Sentry em 18% por ponto. O Charged Bolt Sentry é uma trap que dispara sozinha enquanto você coloca Lightning Sentries; o Shock Web só faz algo se você apertar.",
        ],
        statPoints: [
          "Sem mudança — um token de respec devolve pontos de skill e de atributo juntos, então dá para regastar os dois. Devolva para Vitality e para o tanto de Strength que sua armadura pedir.",
          "Se você pegou Strength por causa de uma base pesada que não quer mais, este é o momento de tirar de volta.",
        ],
        actions: [
          "**Fale com a Akara no Ato 1 do Nightmare** depois de limpar a Den of Evil de lá. O token é dela, e funciona de qualquer lugar da dificuldade assim que a quest estiver feita.",
          "**O personagem que você está jogando agora não é o de antes.** O Fire Blast era uma granada que você mirava; o Lightning Sentry é uma torre que você coloca e abandona. A primeira hora depois do respec parece pior do que a hora antes dele, e isso é esperado.",
          "**O Mind Blast é o botão que faz isso funcionar.** Ele atordoa tudo num raio de 4 por 50 frames com um ponto, que é exatamente o tempo de colocar cinco traps num grupo que não pode se mexer.",
          "**Fade e Burst of Speed não podem estar ativos juntos.** Daqui em diante o Fade é o que você usa — resistências, redução de duração de maldição e 1% de redução de dano físico por nível. O Burst of Speed é para as builds de chute, não para esta.",
          "**O Charged Bolt Sentry são vinte pontos que você vai acabar deixando de conjurar.** Agora ele é dano de verdade; no fim do Hell o teto de cinco traps pertence a Lightning e Death Sentry e ele vira sinergia pura. Isso não é desperdício — 20 pontos de Charged Bolt Sentry são +360% de dano no Lightning Sentry — mas vale saber antes de acontecer.",
          "Troque a staff Leaf por **garras**. Daqui em diante nada do que você conjura é fogo, o +3 não faz nada, e uma garra com **+3 Lightning Sentry** ou **+2 Traps** é o item para caçar.",
        ],
        gearTargets: [
          {
            why: "Num escudo de quatro sockets: +2 em todas as skills e até 35% de conjuração. **Conjuração é Mind Blast, não colocação de trap** — colocar uma trap roda na velocidade de ataque e na garra que você segura. 65% ainda vale, pelo atordoamento que abre todo grupo.",
          },
          {
            label: "Garra mágica ou rara: +3 Lightning Sentry, +2 Traps",
            why: "Os afixos de skill em garra são a maior fonte de níveis de Lightning Sentry do jogo e são baratos. Uma garra com +3 Lightning Sentry / +3 Death Sentry vale mais do que qualquer unique do tier.",
            lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps"],
          },
        ],
        exitCriteria: "A tela de skills mostra 52 gastos, 0 livres, Lightning Sentry 20, e você já colocou cinco deles em cima de alguma coisa.",
      },
      "ass-nightmare-late-hell-early": {
        name: "A segunda sinergia, e os cadáveres",
        summary: "Níveis 45-70. Shock Web até 20, Death Sentry até 9, e o Hell até Travincal.",
        location: "Ato 5 do Nightmare até o Ato 3 do Hell",
        goal: "Terminar a segunda sinergia do Lightning Sentry, colocar o Death Sentry para rodar, e chegar a 75% de resistência.",
        killingWith: "Quatro Lightning Sentries e um Death Sentry, com Mind Blast para segurar o grupo parado.",
        skillPoints: [
          "**Shock Web 1 → 20** (+19). A segunda sinergia de 18% por ponto. Com as duas maximizadas o Lightning Sentry fica em +720%, que é a diferença entre 4-1500 por raio e 8-2574.",
          "**Death Sentry 1 → 9** (+8). Vinte e sete pontos no total, e 52 + 27 = 79 — que é o que um personagem nível 70 com a Den of Evil e o Radament do Hell tem.",
          "**A explosão de cadáver do Death Sentry já estava na força máxima com um ponto.** Ela causa 40-80% da vida base do tipo de monstro e não escala com a skill. O que estes oito pontos compram é raio de alcance e a metade de raio.",
        ],
        statPoints: [
          "**Vitality com tudo** que o equipamento não exigir.",
          "O Hell aplica **-100%** em todas as resistências. O Lam Esen's Tome no Ato 3 do Hell dá mais 5 pontos de atributo e é o terceiro e último.",
          "Strength suficiente para uma base de **Chains of Honor** se for para lá que você vai; nada mais nesta rota precisa.",
        ],
        actions: [
          "**O Hell aplica -100% em toda resistência.** Um personagem no teto de 75% no Nightmare entra no Hell com -25%. Este é o motivo mais comum de uma trapper morrer no Ato 1 do Hell, e o Fade com um ponto vale só 10%.",
          "**Os raios do Lightning Sentry perfuram.** É por isso que cinco sentries vão no mesmo ponto em vez de espalhados pela sala, e por que um corredor mata mais rápido que uma caverna aberta.",
          "**Um Death Sentry, não cinco.** A explosão de cadáver dele encadeia por uma sala inteira a partir de uma morte, e as outras quatro vagas valem mais como Lightning Sentry. Esta é a rotação que o resto do jogo usa.",
          "**Imunes a raio são uma parede, não uma luta lenta.** Não existe maestria de raio nesta classe e os raios do Death Sentry também são raio. Até você ter uma resposta, a atitude honesta no Hell é passar direto — e a metade de explosão de cadáver do Death Sentry continua funcionando, porque aquilo é fogo e físico.",
          "**Countess, Lower Kurast e Travincal** no Hell. Travincal é área de trapper: densa, fechada, e tudo entra num corredor.",
          "Mantenha o **Insight** no mercenário do Ato 2 e acrescente um corpo de **Treachery** ou **Fortitude** quando puder. O trabalho dele é segurar um corredor enquanto as traps trabalham.",
        ],
        gearTargets: [
          {
            why: "+2 em todas as skills, vida, mana e redução de dano. O melhor elmo que esta build já usou até um Griffon's, e ele cai do Mephisto e do Pit.",
          },
          {
            label: "Small charms: dano de raio e resistências",
            why: "O caminho mais barato até 75% no Hell, e os de raio sobem o dano das traps direto.",
          },
        ],
        exitCriteria: "Shock Web em 20, Death Sentry em 9, resistências em 75%, e Travincal no Hell virou rotina.",
      },
      "ass-hell-late": {
        name: "Noventa pontos, e uma decisão",
        summary: "Níveis 70-85. Death Sentry até 20, o núcleo fechado, e os seis primeiros pontos do pacote que termina o personagem.",
        location: "Ato 4 do Hell até a Worldstone Keep",
        goal: "Fechar o núcleo de noventa pontos e começar os vinte que sobram.",
        killingWith: "Quatro Lightning Sentries, um Death Sentry, Mind Blast entre as colocações, e Fade rodando o tempo todo.",
        skillPoints: [
          "**Death Sentry 9 → 20** (+11). Isso fecha o núcleo: Fire Blast 1, Shock Web 20, Charged Bolt Sentry 20, Lightning Sentry 20, Death Sentry 20, mais nove pontos de Shadow. **Noventa.**",
          "**Mate o Izual no Hell** pelos últimos 2 pontos de quest. Um personagem nível 85 com os doze tem 96, então seis dos vinte que sobram já estão na mão.",
          "**Sobram vinte pontos e eles são uma decisão de verdade.** Três rotas valem o orçamento inteiro e nenhuma vale pela metade: **Fade até 20** por resistência, duração de maldição e 1% de redução de dano físico por nível; **Fire Blast até 20** por um segundo tipo de dano que responde a imunes a raio; **Shadow Master até 20** por um corpo que luta na sua frente com resistência acima do teto do jogador. Dezenove pontos cada, e um sobrando.",
        ],
        statPoints: [
          "Vitality, ainda. Não existe breakpoint de dexterity nesta build e nenhum bloqueio que valha financiar.",
          "O único Strength que vale acrescentar agora é o que uma base de **Chains of Honor** ou **Enigma** pedir.",
        ],
        actions: [
          "**A redução de dano físico do Fade é 1% por nível**, em cima de resistências que sobem em direção a 75% e duração de maldição cortada em até 90%. Mais dezenove pontos nele é a razão de trappers de Hardcore chegarem ao nível 95.",
          "**Fire Blast até 20 é a resposta para imunidade a raio.** Ele recebe 11% por ponto duro de todas as cinco traps e esta build maximiza três delas, então dezenove pontos ali compram uma bomba arremessada causando 646-859 — um segundo tipo de dano sem pré-requisito novo e sem trocar equipamento.",
          "**O Pit, o Chaos Sanctuary e a Worldstone Keep.** Os três são fechados o bastante para sentries empilhadas, e os três dropam o que a build ainda quer.",
          "**Não espalhe os vinte pontos entre as três.** Cada uma das três rotas vale pega inteira; um personagem com sete pontos em cada não tem nenhuma delas.",
        ],
        gearTargets: [
          {
            why: "+2 em todas as skills e +65 em todas as resistências. Numa build cuja única fraqueza real é morrer para o que ela não consegue matar, esta é a armadura.",
          },
          {
            why: "Teleport, que transforma uma trapper de uma build que caminha até corredores numa que chega neles.",
          },
        ],
        exitCriteria: "Noventa pontos de núcleo gastos, o pacote escolhido, e o Baal no Hell virou morte de rotina.",
      },
      "ass-endgame": {
        name: "Cento e dez",
        summary: "Níveis 85-99. O pacote terminado, e o personagem fechado em exatamente 110.",
        location: "Terror Zones, o Pit, o Chaos Sanctuary, o Throne of Destruction",
        goal: "Terminar os vinte, e parar.",
        killingWith: "A rotação pronta. Nada nela muda daqui em diante.",
        skillPoints: [
          "**Dezenove pontos no pacote que você escolheu**, e um sobrando. 90 + 19 + 1 = 110, que é o que um personagem nível 99 com todas as recompensas de quest tem.",
          "**O último ponto vai para um lugar diferente em cada rota.** Na rota do Fade ele é um segundo ponto de Shadow Master, que vale mais do que um vigésimo primeiro ponto de qualquer coisa. Na rota do Fire Blast ele é Wake of Fire, que alimenta o Fire Blast em mais 10%. Na rota do Shadow Master ele é Fade, porque essa rota comprou um guarda-costas e não uma resistência.",
          "**Não existe nada depois de 110.** Níveis além do 99 não existem e o plano não finge que existem; daqui em diante é tudo equipamento.",
        ],
        statPoints: [
          "Vitality. Não sobrou breakpoint de atributo para alcançar.",
          "Se um Enigma está no plano, os +0,75 de Strength por nível de personagem pagam por uma base mais pesada do que os seus pontos jamais pagariam.",
        ],
        actions: [
          "**Uma garra com +3 Lightning Sentry, +3 Death Sentry e +2 Traps** continua sendo o maior item de dano do jogo para esta build, e é um item mágico ou raro, não uma runeword.",
          "**Griffon's Eye** e facetas de raio são a pilha de redução de resistência inimiga. Facetas no elmo e no escudo, e os -20% de resistência a raio inimiga do Griffon's, se somam a todo o resto.",
          "**Terror Zones e o Throne of Destruction.** A velocidade de limpeza da build em terreno fechado é para isso que serve.",
          "O teto de cinco traps nunca muda. Se uma rodada parece lenta, a resposta quase sempre é que você está colocando trap onde as coisas não vão passar, e não que faltam pontos.",
        ],
        exitCriteria: "110 de 110, com o pacote terminado em vez de dividido em três.",
      },
    },
  },
};
