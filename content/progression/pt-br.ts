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
          "**The Golden Bird** dá +20 de vida permanente. **Lam Esen's Tome** dá um ponto de skill. Os dois são rápidos.",
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
          { why: "−15-20% de resistência a raio do inimigo, aplicados antes da checagem de imunidade." },
          { why: "Uma aura de Fanaticism num arco — velocidade de ataque, attack rating e dano de uma vez." },
        ],
        exitCriteria:
          "Farmando com constância uma zona de nível de área 85 no Hell, resistências em 75%, e uma resposta em mãos para a única imunidade pela qual a sua build não passa.",
      },
    },
  },
};
