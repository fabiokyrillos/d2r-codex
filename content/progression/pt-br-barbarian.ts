import type { JourneyCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR da jornada do Barbarian.
 *
 * As listas de `skillPoints`, `statPoints` e `actions` são posicionais — a
 * mesma quantidade de itens, na mesma ordem, que em `barbarian-journey.ts`. Os
 * refs de item continuam invariantes e são resolvidos pelo registry.
 *
 * **Toda conta aritmética é retraduzida, não recalculada.** `leveling.test.ts`
 * confere as somas nos dois idiomas justamente porque um tradutor redigitando
 * "13 + 8 + 12 + 14 = 47" como "= 48" é uma falha que a paridade de tradução do
 * `check:content` não pegaria: as duas strings diferem do inglês e as duas
 * existem.
 */
export const barbarianJourneyPtBr: JourneyCopy = {
  summary:
    "Evolua com Bash usando um cetro e Mace Mastery, pegue os gritos conforme eles abrem, e faça um respec no nível 40 para a arma que realmente dropou. O respec é por causa da mastery, não do ataque.",
  overview: [
    "**O problema de evolução do Barbarian não é dano, é ter que apostar vinte pontos num palpite.** Uma mastery só funciona com uma família de arma, existem seis delas, e a arma que dá para comprar no nível 3 não é a arma que você vai estar segurando no Nightmare. Quando outra classe deste site faz respec, é porque a skill de evolução não é a skill de endgame — e várias não fazem respec nenhum. Esta faz respec por um motivo que nenhuma outra rota tem: a *arma* de evolução não é a arma de endgame.",
    "Então os primeiros pontos vão onde não podem ser desperdiçados. **Bash é a skill em que você gasta e Double Swing é a que você aperta** — Double Swing não tem dano próprio nenhum, o bônus de dano dela inteiro é 10% por ponto duro de Bash, então pontos na própria Double Swing não compram nada.",
    "A mastery que você pega no nível 3 é a **Mace Mastery**, e isso não é preferência. A Akara vende cetros desde a primeira visita à cidade, e o tipo de item a que a Mace Mastery está presa é o que o jogo chama de Blunt — cuja corrente de equivalência alcança clavas, martelos e maças, e através do `rod` alcança também **cetros, cajados e varinhas**. Blade Mastery num cetro não faz nada.",
    "**Battle Orders no 24 é a maior compra isolada do jogo.** +35% de vida máxima com um ponto e mais 3% por nível, em você, no seu mercenário e no seu grupo. Conjure antes de se curar, nunca depois: ela aumenta o seu máximo e não escala junto a vida que você já está carregando.",
    "A outra coisa para internalizar: **o que te trava são as resistências, não o dano.** O Nightmare aplica −40% em todas as suas e o Hell aplica −100%. Natural Resistance é a resposta do Barbarian e ela é somada antes do teto, que é o motivo de ele conseguir vestir equipamento de dano onde outro personagem corpo a corpo veste resistência — mas ela abre no 30 e precisa de Iron Skin antes.",
    "Tudo abaixo é alcançável sozinho e self-found. Nenhum item aqui é algo pelo qual você precise trocar.",
  ],
  respecPlan: [
    {
      at: "Nightmare Ato 4, nível 40 — depois do The Fallen Angel, usando o token da Den of Evil do Nightmare",
      why: "O único respec de que a rota precisa, e o nível é aritmética e não intuição. Voltam 47 pontos e a abertura de Whirlwind custa exatamente 47: Whirlwind 20, seis na mastery que a sua arma de fato é, Battle Orders 11, e dez pontos únicos de pré-requisito e utilidade. Faça respec antes e o Whirlwind não fica maximizado; depois e você gastou níveis subindo uma mastery que está prestes a abandonar.",
    },
    {
      at: "Guarde o token do Normal sem gastar",
      why: "Nada nesta rota precisa dele. Um respec de reserva vale mais que qualquer coisa que você poderia fazer com ele no nível 20, e é a rede de segurança se você achar no Normal uma arma que mude a resposta da mastery mais cedo.",
    },
    {
      at: "Opcional — Hell Ato 1, e é este que escolhe a sua build",
      why: "O token da Den of Evil do Hell é onde um personagem de Whirlwind vira um de Frenzy, Berserk, Double Throw ou Leap Attack. No nível 75 você já sabe quais armas realmente tem, e quatro das seis builds estão a um token de distância uma da outra.",
    },
  ],
  stages: {
    "bar-act-1-normal": {
      name: "Um cetro, e a única mastery que serve para ele",
      summary: "Níveis 1-13. Bash, um cetro comprado, e a mastery cujo tipo de item o cobre.",
      location: "Ato 1 — Blood Moor até as Catacumbas",
      goal: "Limpar a Den of Evil, chegar a Bash 8, e guardar o token de respec.",
      killingWith: "Bash, e ataque normal contra qualquer coisa que não precise dele.",
      skillPoints: [
        "**Bash 8.** São +50% de dano e mais 5% por nível, além de um ponto seco por nível, e ele empurra as coisas para trás — o que num personagem sem fuga é defesa além de dano.",
        "**Mace Mastery 3.** +28% de dano e 5% por nível, +40% de attack rating e 8% por nível, e uma chance de crítico subindo em direção a 35%. O que falha de verdade no Ato 1 é attack rating, não dano.",
        "**Double Swing, um ponto** no nível 6, e nunca um segundo. O bônus de dano dela é o nível do Bash vezes dez e mais nada — um ponto gasto aqui aumenta a skill em zero.",
        "**Leap, um ponto** no nível 6. Ela passa por cima de paredes e derruba tudo onde aterrissa, e é o único pré-requisito que o Leap Attack tem.",
        "São 13 pontos: 12 dos níveis 2-13, e 1 da Den of Evil.",
      ],
      statPoints: [
        "Tudo em **Vitality**. O Barbarian começa com 30 de Strength, 20 de Dexterity, 25 de Vitality e 10 de Energy, e ganha **4 de vida por ponto de Vitality** — o maior do jogo.",
        "**Nada de Energy, nunca.** Bash custa 2 de mana e Double Swing custa 1 e cai para zero no nível 9. Mana não é o problema desta classe no Normal e não é o problema dela no Hell.",
        "Strength só quando uma peça específica de armadura pedir, e então exatamente o suficiente e nem um ponto a mais.",
      ],
      actions: [
        "Limpe a **Den of Evil** por completo pelo ponto de skill e pelo token de respec grátis. Fale com a **Akara** depois — o ponto não é automático.",
        "**Compre um cetro com a Akara** assim que puder pagar, e confira o estoque dela a cada alguns níveis. Um cetro é uma arma da classe Blunt, que é a que a Mace Mastery cobre, e é a única arma decente à venda tão cedo.",
        "**Não pegue Blade Mastery para um cetro.** Blade Mastery cobre o tipo de item que o jogo chama de Swords and Knives; um cetro não está nele, e os vinte pontos não fariam absolutamente nada. As masteries são presas a tipos de item, não à aparência da arma.",
        "**Double Swing precisa de duas armas para fazer o que promete** — ela gira as duas, acertando dois alvos se houver dois e um alvo duas vezes se não houver. Com cetro e escudo ela ainda funciona e ainda dá os +50% de velocidade de ataque, mas metade dela fica ociosa.",
        "Contrate a **Act 1 Rogue Scout** depois da Blood Raven e mantenha um arco na mão dela. Ela é o único dano à distância que este personagem tem pelos próximos vinte níveis.",
      ],
      exitCriteria: "Andariel está morta, Bash está em 8, e o token de respec do Normal continua guardado.",
    },
    "bar-act-2-normal": {
      name: "Dois Steel",
      summary: "Níveis 14-20. As primeiras runewords, empunhadura dupla de verdade, e os gritos começam.",
      location: "Ato 2 — Lut Gholein até as Tumbas de Tal Rasha",
      goal: "Colocar duas armas Steel nas mãos e o Shout na barra.",
      killingWith: "Double Swing com duas maças Steel, e Bash no que sobreviver.",
      skillPoints: [
        "**Bash até 12.** Continua sendo a única coisa que aumenta a Double Swing.",
        "**Mace Mastery até 5.**",
        "**Howl, um ponto.** É uma skill de nível 1 e está aqui porque é o único pré-requisito do Shout — e porque vai acabar sendo a maior sinergia do Berserk, a 10% por ponto duro.",
        "**Shout, um ponto** no nível 6. +100% de defesa para você e o grupo, e o valor real dela é estender o Battle Orders em 5 segundos por ponto duro mais adiante.",
        "São 21 pontos: 19 dos níveis, e 2 da Den of Evil e do Radament.",
      ],
      statPoints: [
        "**Vitality**, com Strength apenas o bastante para a armadura que você está de fato vestindo.",
        "Dexterity só se estiver com escudo e quiser a chance de bloqueio. Um Barbarian de duas armas não bloqueia nada, então nesta rota Dexterity é sempre e só requisito de arma.",
      ],
      actions: [
        "**Radament**, nos Halls of the Dead, dá um ponto de skill. Ele é fácil de perder — a entrada fica nos esgotos debaixo de Lut Gholein.",
        "**Faça duas armas Steel**, uma para cada mão. Tir + El em qualquer espada, machado ou maça de 2 sockets: +25% de velocidade de ataque, +20% de dano aprimorado, +50 de attack rating e 50% de Open Wounds. Ela está disponível a partir do nível 13, então se você chegou neste ato com as runas dá para fazer as duas de imediato — e duas delas são o dano inteiro desta etapa.",
        "**Steel não entra em cetro.** As bases dela são espadas, machados e maças, e a entrada exclui martelos e cetros explicitamente. Coloque num mangual ou numa maça da classe Blunt parecida e a Mace Mastery continua valendo para as duas mãos — que é exatamente o motivo de ela ter sido escolhida no nível 3.",
        "**Stealth no nível 17** em qualquer armadura de corpo de 2 sockets. Tal + Eth, e +25% de velocidade de corrida numa classe sem skill de movimento vale mais aqui do que qualquer número de defesa.",
        "**Troque para o Act 2 Desert Mercenary** no fim do ato e pegue um de **Might**. A aura dele aumenta o seu dano físico, que é todo o seu dano, e ele vai segurar a Insight mais adiante.",
      ],
      gearTargets: [
        { why: "Duas delas. Disponível no 13, e a velocidade de ataque importa mais que o dano numa skill que gira as duas mãos." },
        { why: "Velocidade de corrida e recuperação a partir do nível 17, por duas runas que a Countess dropa." },
      ],
      exitCriteria: "Duriel está morto, duas Steel equipadas, e o Shout na barra.",
    },
    "bar-acts-3-5-normal": {
      name: "Os gritos, e a corrente até o trinta",
      summary: "Níveis 21-30. O Battle Orders chega, e as duas correntes de pré-requisito que o Whirlwind precisa ganham seus pontos únicos.",
      location: "Atos 3, 4 e 5 — Kurast até os Ancients",
      goal: "Battle Orders na barra, as duas correntes do Whirlwind abertas, e o nível 30 alcançado.",
      killingWith: "Double Swing, com Battle Orders ativo antes de toda luta.",
      skillPoints: [
        "**Battle Orders 6** no nível 24. Esta é a maior melhoria isolada que o personagem recebe: +35% de vida máxima com um ponto e mais 3% por nível, em você e no mercenário.",
        "**Stun, um ponto** no nível 12, e **Concentrate, um ponto** no nível 18. Nenhum dos dois é apertado. Eles são a corrente de que o Whirlwind precisa, e o Concentrate também é a resposta para qualquer coisa que resista a mágico mais tarde.",
        "**Leap Attack, um ponto** no nível 18 — a outra metade dos pré-requisitos do Whirlwind, e um fecha-distância que vale ter na barra por si só.",
        "**Increased Stamina, um ponto** no nível 12 e **Iron Skin, um ponto** no nível 18. Os dois são portas: Increased Stamina abre a Increased Speed e Iron Skin abre a Natural Resistance, e essas são as duas passivas que importam no Hell.",
        "**Mace Mastery até 6.**",
        "São 33 pontos: 29 dos níveis, e 4 das três quests do Normal.",
      ],
      statPoints: [
        "**Vitality**, ainda. A vida de um Barbarian é a mitigação de dano dele.",
        "Strength o bastante para a armadura de corpo que você pretende usar no Nightmare, calculado agora em vez de descoberto depois.",
      ],
      actions: [
        "**The Fallen Angel** — matar o Izual no Ato 4 — dá dois pontos de skill, e é a única quest do jogo que dá mais de um.",
        "**Conjure Battle Orders antes de beber, não depois.** Ela aumenta sua vida máxima por porcentagem e não escala junto a vida que você está carregando, então gritar com vida cheia e gritar com metade deixam você em lugares muito diferentes.",
        "**Spirit no nível 25** numa espada de 4 sockets é +2 em todas as skills, e uma Crystal Sword é barata. O detalhe é que ela é uma espada e a sua mastery é de maça — então é uma arma de troca pelo buff em vez de algo para lutar, até o respec decidir o contrário.",
        "**Insight no nível 27** para o mercenário, numa polearm de 4 sockets. A aura de Meditation dela é o que faz você parar de beber poção de mana pelo resto do jogo. **Não é lança** — polearms e lanças são classes de item diferentes e este é o erro mais comum que existe com Insight.",
        "**Lore no nível 27** em qualquer elmo de 2 sockets, incluindo elmo de Barbarian. Ort + Sol para +1 em todas as skills.",
        "**Ainda não coloque pontos no Whirlwind**, mesmo ele abrindo no 30. Ele não tem sinergia em nenhuma direção — nada o aumenta e ele não aumenta nada — então um Whirlwind pela metade é só um ataque lento, e o respec do 40 é onde os vinte pontos entram de uma vez.",
      ],
      gearTargets: [
        { why: "No mercenário. Acaba com o problema de mana em definitivo e custa quatro runas comuns." },
        { why: "+1 em todas as skills num elmo que você provavelmente já achou." },
        { why: "Se estiver com escudo: +43-48% em cada resistência no nível 21, o que é quase toda a penalidade do Nightmare resolvida por três runas." },
      ],
      exitCriteria: "Baal está morto, Battle Orders em 6, e Stun, Concentrate, Leap e Leap Attack com um ponto cada.",
    },
    "bar-nightmare-1-4": {
      name: "O Berserk carrega o Nightmare",
      summary: "Níveis 31-40. A resposta que independe de arma, e o respec no fim dela.",
      location: "Nightmare Atos 1 a 4 — da Den of Evil até o Izual",
      goal: "Chegar ao nível 40 com os oito pontos de quest do Normal e do Nightmare, e então fazer respec.",
      killingWith: "Berserk, que não liga para qual arma você está segurando nem para o que é imune a físico.",
      skillPoints: [
        "**Berserk 10** no nível 30. Todo o dano dele é entregue como mágico, não parte dele, então um imune a físico o recebe inteiro — e as sinergias dele são Howl e Battle Orders a 10% por ponto duro cada, e você já tem pontos nos dois.",
        "**Battle Command, um ponto** no nível 30. +1 em todas as skills para você e o grupo, e não escala — o vigésimo ponto concede exatamente o que o primeiro concede. Conjure antes do Battle Orders, para que o grito seguinte saia um nível mais alto.",
        "**Battle Orders até 9.**",
        "São 47 pontos no nível 40: 39 dos níveis, e 8 de todas as quests do Normal e do Nightmare.",
        "**E então faça respec.** Os 47 voltam inteiros e a abertura de Whirlwind custa exatamente 47.",
      ],
      statPoints: [
        "**Vitality**, menos o que o equipamento de Nightmare que você realmente está usando exigir de Strength.",
        "Esta é a etapa em que um requisito de Strength que você não planejou vira vinte pontos que não voltam — o token de respec devolve pontos de skill, não de atributo.",
      ],
      actions: [
        "**Sua defesa é zero enquanto o Berserk está golpeando.** O estado dura cerca de 2,7 segundos com um ponto e *encolhe* conforme a skill sobe, até cerca de 1,3 com vinte — então mais pontos significam menos tempo exposto, não mais. Use Concentrate quando algo estiver batendo forte e não puder ser morto rápido; ele dobra sua defesa e não pode ser interrompido.",
        "Limpe a **Den of Evil** do Nightmare pelo ponto de skill e, mais importante, pelo segundo token de respec. **Radament** e **The Fallen Angel** dão os outros três.",
        "**No nível 40, depois do Izual, faça respec.** Whirlwind 20, seis pontos na mastery que corresponde à arma que você agora de fato tem, Battle Orders 11, e então um ponto em cada: Bash, Stun, Concentrate, Leap, Leap Attack, Howl, Shout, Battle Command, Increased Stamina e Iron Skin. Isso é 37 + 5 + 3 + 2 = 47, e 47 é o que você tem.",
        "**Decida a mastery pela arma, não o contrário.** Se a sua melhor arma for uma espada, pegue Blade Mastery; um machado, Axe Mastery; uma maça, martelo, clava ou cetro, Mace Mastery. Polearms e lanças são masteries separadas e nenhuma cobre a outra.",
        "Farme **a Countess** no Nightmare pelas runas de que os próximos vinte níveis precisam. Ela é a única fonte confiável de Ral, Ort, Tal, Thul e Amn a esta altura, e tudo abaixo é feito delas.",
      ],
      gearTargets: [
        { why: "+50 em todas as resistências no nível 37 numa armadura de corpo de 2 sockets, o que é a penalidade do Nightmare cancelada por duas runas." },
        { why: "Se estiver com escudo: não pode ser congelado, +25 em todas as resistências, e 25% de magic find no nível 29." },
      ],
      exitCriteria: "Nível 40, Izual morto, e o respec gasto — Whirlwind em 20 com uma mastery que corresponde à arma nas suas mãos.",
    },
    "bar-nightmare-5": {
      name: "A mastery que você de fato tem",
      summary: "Níveis 41-55. O Whirlwind está na barra e as duas compras de vinte pontos são terminadas.",
      location: "Nightmare Ato 5 — dos Bloody Foothills até o Baal",
      goal: "Battle Orders maximizado, a mastery em doze, e o Hell aberto.",
      killingWith: "Whirlwind, mantido através de um grupo em vez de mirado numa coisa só.",
      skillPoints: [
        "**Battle Orders até 20.** +92% de vida máxima com vinte pontos duros, e é a última coisa que você ainda deveria estar subindo enquanto o seu total de vida é o que decide se o Hell é sobrevivível.",
        "**A mastery até 12.**",
        "São 62 pontos no nível 55: 54 dos níveis, e 8 das quests.",
      ],
      statPoints: [
        "**Vitality**, e Strength o bastante para a armadura de corpo que você está mirando, não para a que está vestindo.",
        "Faster Hit Recovery passa a importar mais que vida bruta aqui. O Barbarian divide a tabela de recuperação com o Paladin e a Assassin, e este site a publica.",
      ],
      actions: [
        "**Whirlwind não pode ser interrompido e não pode ser conduzido.** O caminho é fixado no momento do aperto, e levar dano não o interrompe — que é por isso que ele é mantido atravessando um grupo em vez de clicado num monstro.",
        "**Ele custa 12,5 de mana, não 25.** A coluna de mana é deslocada, e o custo sobe para 22 no vigésimo ponto. Com Insight no mercenário você nunca vai reparar em nenhum dos dois números.",
        "**Lionheart no nível 41** numa armadura de corpo de 3 sockets: +25 de Strength, +20 de Vitality, +50 de vida e +30 em todas as resistências. Só o Strength já costuma pagar o requisito da próxima arma.",
        "**Treachery no nível 43** se você preferir +45% de velocidade de ataque às resistências. No Whirlwind isso é uma quantidade real de dano extra, porque o dano do giro vem de quantas vezes ele acerta.",
      ],
      gearTargets: [
        { why: "A melhor armadura de corpo geral que um Barbarian em evolução consegue fazer, e o bônus de Strength dela compra requisitos de arma." },
        { why: "Uma runeword de arma de nível 43 com +1 em Berserk e +25% de velocidade de ataque, e entra em qualquer arma de 4 sockets — então serve para qualquer mastery em que você tenha parado." },
      ],
      exitCriteria: "O Baal do Nightmare está morto, Battle Orders em 20, e você tem um plano para as resistências do Hell.",
    },
    "bar-hell": {
      name: "Resistências, e as seis portas",
      summary: "Níveis 56-75. Natural Resistance, Berserk para os imunes, e a transição para qual das seis builds você vai de fato jogar.",
      location: "Hell — Ato 1 até o Throne of Destruction",
      goal: "Um personagem de nível 75 pronto, com 86 pontos gastos e uma build escolhida.",
      killingWith: "Whirlwind, com Berserk no segundo botão para qualquer coisa imune a físico.",
      skillPoints: [
        "**A mastery até 20.** Os últimos oito pontos dela são a maior compra de dano que ainda resta.",
        "**Berserk 9.** Este é o plano de imunidade. O dano dele é inteiramente mágico, então um imune a físico vira uma luta mais lenta em vez de uma luta impossível.",
        "**Natural Resistance, um ponto** no nível 30. Ela dá as quatro resistências de uma vez e é somada antes do teto, que é o que faz dela a resposta para o −100 do Hell em vez de uma resposta parcial. A curva dela é íngreme no começo: o primeiro ponto vale vários dos últimos.",
        "**Increased Speed, um ponto** no nível 24, e pontos únicos em **Taunt** no 6, **Battle Cry** no 18, **Grim Ward** no 24, **Find Potion** e **Find Item** no 12.",
        "São 86 pontos no nível 75: 74 dos níveis, e todos os 12 das quests.",
        "Os 24 restantes até o nível 99 pertencem à página de build para onde você está indo, não a esta rota.",
      ],
      statPoints: [
        "**Vitality com tudo que não for requisito**, e os requisitos agora são conhecidos em vez de adivinhados.",
        "Dexterity o bastante para bloqueio máximo se e somente se você segurar um escudo. Um Barbarian de duas armas nunca bloqueia e cada ponto ali é desperdiçado.",
        "Ainda nada de Energy.",
      ],
      actions: [
        "**O Hell aplica −100% em cada resistência.** Natural Resistance, uma Lionheart ou Smoke, e um escudo de resistência são as três respostas baratas, e você quer as três antes do Ato 1 e não depois do Ato 2 ter ensinado o porquê.",
        "**Battle Cry corta a defesa do monstro pela metade**, o que vale mais para um Barbarian que qualquer item de attack rating — attack rating é conferido contra a defesa do alvo, não contra um limiar. Um ponto é −50% e cresce 2% por nível.",
        "**Grim Ward é muito melhor que a fama dela.** Ela faz tudo dentro do raio receber +20% mais dano, e mais 5% por ponto duro de Find Potion em cima — então o ponto único aqui vira um debuff de verdade no momento em que a página de build mandar subir Find Potion.",
        "**Farme o Pit e o Pindleskin** neste nível em vez de bosses de ato. O Pit é área de nível 85 no Hell e o Pindleskin é 83 — não é a mesma coisa, e este site publica os dois números. De qualquer forma os dois são curtos, e um Barbarian com Find Item tira uma segunda rolagem de cada cadáver deles.",
        "**O Whirlwind não precisa de respec, porque esta rota *é* o plano dele.** No nível 75 você está segurando exatamente o núcleo de 77 pontos daquela página de build — as mesmas vinte skills nos mesmos valores — mais nove pontos em Berserk. 110 − 86 = 24, e qualquer um dos dois pacotes da página custa precisamente 24 a partir daqui. Os nove pontos de Berserk também não ficam perdidos: os dois pacotes carregam Berserk, com vinte e com catorze.",
        "**Frenzy e Double Throw precisam do token da Den of Evil do Hell**, e vale deixar claro por quê, porque a corrente de pré-requisito delas é de fato a que você evoluiu por dentro. O respec do nível 40 comprou essa corrente de volta: o plano que você roda desde então não tem Double Swing nem Double Throw nenhum, então no 75 os dois estão em zero. Se você já sabe que vai para uma dessas duas, **pule o respec do nível 40 por completo** — as páginas delas evoluem para si mesmas sem respec, e o desvio de mastery desta rota é a única coisa que você estaria abrindo mão.",
        "**Berserk e Leap Attack também precisam do token.** O Berserk quer Howl e Find Potion maximizados e não tem uso nenhum para os vinte pontos parados no Whirlwind — embora os nove já em Berserk sejam a parte que passa direto. O Leap Attack quer Leap maximizado, a única sinergia dele, e esta rota só deu um ponto a ele.",
        "**War Cry é o único destino que esta rota não serve de forma alguma.** As sinergias dele são Howl, Taunt e Battle Cry a 6% por ponto cada, e ele não precisa de arma e portanto de mastery nenhuma — então todo o desenho desta rota, que existe para acertar a mastery, é desperdiçado nele. Quem for para lá deveria fazer respec ainda no Nightmare em vez de seguir o plano de mastery acima.",
      ],
      gearTargets: [
        { why: "Ainda no mercenário, e ainda o motivo de você não estar bebendo poção de mana." },
        { why: "Redução de dano físico e roubo de vida num cinto, e é um drop comum." },
        { why: "Crushing Blow, Deadly Strike e Open Wounds nas botas. Crushing Blow é uma parcela da vida atual do alvo, que é o que permite a um Barbarian matar coisas muito acima do dano listado dele." },
        { why: "Só se você pretende a rota de gold find na página do Berserk: 300% de ouro extra numa armadura de corpo de 3 sockets no nível 43." },
      ],
      exitCriteria: "Nível 75, 86 pontos gastos, Baal do Hell morto, e uma página de build aberta na outra aba.",
    },
  },
};
