import type { JourneyCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR da jornada de nível do Warlock.
 *
 * Nomes próprios do jogo — skills, itens, runewords, runas, quests, áreas —
 * ficam em inglês (ADR 0003). A aritmética é a mesma nos dois idiomas: as somas
 * escritas aqui são verificadas pelo mesmo `checkJourney` que verifica a fonte,
 * então "83 + 20 = 103" precisa continuar fechando em português.
 */
export const warlockJourneyPtBr: Overlay<JourneyCopy> = {
  warlock: {
    summary:
      "Uma rota única de dano mágico do nível 1 ao 99 que vira a build Abyss sem respec, a build Apocalypse sem respec, e qualquer uma das outras duas com um dos três tokens gratuitos que o jogo entrega.",
    overview: [
      "**Miasma Bolt a partir do nível 1, Miasma Chain a partir do 12, e é esse o personagem até o 30.** Dano mágico é registrado como imunidade em uma das vinte áreas catalogadas deste site; fogo é registrado em doze. Um Warlock subindo de nível não tem sunder charm nenhum e não tem quebra de resistência, então o elemento que quase nada resiste é o que nunca o deixa preso numa porta.",
      "**Um ponto em Summon Goatman no nível 2 e nunca mais.** Ele é um corpo entre você e a sala, e é o único ponto que esta rota gasta e que o núcleo do Abyss não lista — embora nem assim seja desperdiçado: o plano do Blood Boil carrega o mesmo ponto no núcleo dele, e o pacote do muro de demônios do Apocalypse também. Quantos demônios você tem é decidido pelo quinto e pelo décimo hard point de Demonic Mastery e por mais nada — o que é uma decisão de Blood Boil, não de subida de nível.",
      "**A passiva da classe muda o planejamento de equipamento em todos os estágios.** A arma levita, então um staff de duas mãos deixa a mão secundária livre. Você nunca está escolhendo entre um pedaço de pau grande e um Grimoire, que é uma escolha que todo outro caster do jogo precisa fazer.",
      "**Nada aqui depende de um item que ainda não existe.** Os uniques do próprio Warlock começam no nível 52 e os três melhores no 73 ou acima, então esta rota é staff de vendedor, Grimoire genérico e runewords feitas com runas da Countess. Diga isso em voz alta, porque um guia que assume os itens de assinatura da classe é inútil para quem está jogando a classe agora.",
      "**Três respecs gratuitos, e no máximo um é necessário.** A recompensa da Akara por limpar a Den of Evil é um respec completo em cada dificuldade. Duas das quatro builds não querem nenhum deles.",
    ],
    respecPlan: [
      {
        at: "Nunca, se você vai virar o Abyss Warlock",
        why: "A rota e a build são os mesmos 83 pontos. Não existe transição nem nada a desfazer — o único ponto gasto que o plano pronto não lista é um em Summon Goatman, e ele é um dos sete que sobram.",
      },
      {
        at: "Nunca, se você vai virar o Apocalypse Warlock",
        why: "Vire para fogo no nível 30 e continue gastando. Sessenta pontos em Ring of Fire, Flame Wave e Apocalypse, mais os quarenta já em miasma e os três nos sigils, são o núcleo daquela build com o pacote do vazio anexado — e o pacote do vazio é exatamente o que responde às doze áreas catalogadas que registram imunidade a fogo.",
      },
      {
        at: "Uma vez, no nível 30, para o Cleave Warlock",
        why: "Nada da árvore Eldritch está nesta rota e o plano dela são 104 de 110, então não existe versão parcial para crescer dentro. Gaste o token de Normal da Akara no momento em que o Mirrored Blades abrir e guarde os outros dois.",
      },
      {
        at: "Uma vez, no nível 30, para o Blood Boil Warlock",
        why: "A árvore Demon compartilha só o Goatman com esta rota, e os limiares de verdade da árvore são o quinto e o décimo hard points de Demonic Mastery — cinco levam o teto de demônios de um para dois e dez levam de dois para três, e nada mais no jogo move nenhum dos dois. Faça o respec quando puder pagar por ele, em vez de pingar pontos aos poucos.",
      },
      {
        at: "Existem três tokens e no máximo um é necessário",
        why: "A Akara dá um respec completo pela Den of Evil em cada dificuldade. Duas das quatro builds não querem nenhum, e as duas que querem, querem um — então todo Warlock termina esta jornada com pelo menos dois tokens no baú e a liberdade de testar uma segunda build no mesmo personagem.",
      },
    ],
    stages: {
      "war-act-1-normal": {
        name: "Um projétil e um corpo",
        summary: "Níveis 1-11. Escolha a única skill de nível um que ainda está na sua barra no 99.",
        location: "Act 1 — Rogue Encampment até o Monastery",
        goal: "Limpar a Den of Evil, pôr um demônio na sua frente, e matar a Andariel.",
        killingWith: "Miasma Bolt, com um Goatman entre você e o que estiver vindo.",
        skillPoints: [
          "Nível 2, com o seu primeiro ponto: **Miasma Bolt**. Cinco skills abrem no nível 1 e esta é a que ainda vale pontos no 99 — 4 de mana, o maior alcance da árvore, e dano mágico que quase nada no jogo resiste. (Um personagem não tem ponto de skill no nível 1; o primeiro chega com o nível 2.)",
          "Nível 2: **Summon Goatman**, um ponto. Ele é um corpo, não uma fonte de dano, e um ponto é tudo o que ele vai receber nesta rota.",
          "Níveis 3-5: de volta para **Miasma Bolt**.",
          "**O ponto da Den of Evil também vai para Miasma Bolt.** Ele é sinergia de tudo o que este personagem vai lançar, então não existe hora errada de gastá-lo aqui.",
          "Nível 6: **Ring of Fire**, um ponto. Um segundo elemento para o punhado de coisas que ignoram mágico, e o primeiro degrau da escada se você virar para fogo no 30.",
          "Níveis 7-11: **Miasma Bolt** até nove.",
          "São 11 pontos no nível 11 — dez dos níveis 2 a 11, mais o da Den of Evil — e dez deles estão em skills que o personagem pronto ainda tem.",
        ],
        statPoints: [
          "**Vitality, e quase nada mais.** Um Warlock ganha 3 de vida por ponto onde a Sorceress ganha 2, então o mesmo investimento compra metade a mais.",
          "**Strength só para vestir o que você está de fato vestindo.** Ela vira a stat mais importante da classe depois — um Blasphemous Grimoire pede 106 — mas isso é um problema de nível 80 e pagá-lo agora não compra nada.",
          "Nada de Energy, nesta rota nem em nenhuma. A mana vem de um mercenário com Insight no Act 2, e de poções até lá.",
        ],
        actions: [
          "**Ponha um staff na mão e um Grimoire na mão secundária, e entenda por que dá.** O Warlock levita a arma em vez de segurá-la, então um staff de duas mãos ocupa só o slot de arma. Todo outro caster deste jogo troca a mão secundária por uma arma grande. Você não, em nível nenhum, nunca.",
          "Limpe a **Den of Evil** por completo. A Akara dá **+1 ponto de skill** e um **respec completo grátis**. Gaste o ponto em Miasma Bolt e ponha o respec no baú — esta rota pode nunca precisar dele, e é ele que permite virar um Cleave ou um Blood Boil Warlock no 30 sem recomeçar.",
          "Compre da **Charsi e da Akara toda vez que passar**. Um staff mágico com +2 ou +3 em Warlock skills vale mais que qualquer coisa que caia antes do Act 3, e Grimoires estão nas listas delas também — um Grimoire de tier normal pede entre 12 e 25 de Strength, então qualquer um serve.",
          "**Grimoires são a mão secundária da própria classe e rolam staffmods.** Procure +2 em Warlock Skills, e melhor ainda um +2 na aba de Chaos — as três abas são demon, eldritch e chaos, e dois níveis na aba em que você está de fato gastando são dois níveis grátis de Miasma Bolt.",
          "Mate a **Blood Raven** pela Rogue Scout grátis. Um segundo corpo importa mais aqui do que as flechas dela.",
          "O seu Goatman não escala com equipamento do jeito que você escala, e não é para escalar. Reinvoque quando ele morrer e siga em frente; custa 30 de mana e uns dois segundos.",
          "A Andariel é veneno. Compre antídotos da Akara antes de descer, e fique no alcance do Miasma Bolt em vez de no do Goatman.",
        ],
        gearTargets: [
          { label: "Qualquer staff com +2 ou +3 em Warlock Skills", why: "De duas mãos e sem custo nenhum nesta classe. Compre todos que os vendedores rolarem até um prestar.", lookFor: ["+2-3 to Warlock Skills", "+to Miasma Bolt", "Faster Cast Rate"] },
          { label: "Qualquer Grimoire com +2 em Warlock Skills", why: "A mão secundária só existe por causa da passiva da classe, e neste tier custa de 12 a 25 de Strength.", lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills"] },
          { why: "Guarde toda Tal, Eth, Ith, Ral e Ort que a Countess soltar. Stealth e Leaf são duas runas cada e as duas são a próxima melhoria de verdade." },
        ],
        exitCriteria: "A Andariel está morta, o Miasma Bolt está em dez, e você tem um Goatman que reinvoca sem pensar.",
      },
      "war-act-2-3-normal": {
        name: "A corrente substitui o projétil",
        summary: "Níveis 12-20. Uma skill chega e faz o resto do Normal por você.",
        location: "Act 2 e Act 3 — Lut Gholein até Travincal",
        goal: "Pôr o Miasma Chain no ar, contratar um mercenário do Act 2, e pôr Insight na polearm dele.",
        killingWith: "Miasma Chain — três projéteis mágicos no nível 12, e mais a cada ponto.",
        skillPoints: [
          "Nível 12: **Miasma Chain**. É a skill que limpa o Normal. Ela gera três projéteis com um ponto e sobe rumo a doze, todos mágicos, no alcance de um arco.",
          "**O ponto de skill do Radament vai para Miasma Chain.** É a única quest do Act 2 que dá um.",
          "Níveis 13-20: **Miasma Chain** até dez. Cada ponto é mais uma fração de projétil e não há nada competindo por eles ainda.",
          "**Não encoste no Flame Wave quando ele abrir no 18.** É uma skill de fogo numa rota mágica, e se você virar para fogo no 30 vai querer o Ring of Fire maximizado antes dele de qualquer jeito.",
          "São 21 pontos no nível 20 — dezenove dos níveis, mais o da Den of Evil e o do Radament. Miasma Bolt nove, Miasma Chain dez, e um em cada um de Summon Goatman e Ring of Fire.",
        ],
        statPoints: [
          "**Ainda Vitality.** O Act 2 é onde um Warlock que economizou descobre.",
          "**Strength** o suficiente para um staff de dois sockets e para a armadura que você estiver usando. Leaf precisa de um staff e staves pedem muito pouco.",
          "**O Lam Esen's Tome no Act 3 dá +5 pontos de atributo, não um ponto de skill.** Pegue assim que o bazar de Kurast abrir.",
        ],
        actions: [
          "**Contrate um mercenário do Act 2 com o Greiz.** Holy Freeze de Nightmare é onde você quer terminar, mas no Normal pegue o que aparecer — o ponto agora é que alguma outra coisa esteja apanhando.",
          "No nível 27, faça **Insight** numa polearm de quatro sockets para o mercenário. A aura Meditation dele é o plano de mana deste personagem daqui até o 99, e é por isso que nenhum ponto desta jornada vai para Energy.",
          "No nível 17, faça **Stealth** em qualquer armadura de dois sockets. Faster cast rate, faster hit recovery e corrida mais rápida — três coisas para as quais esta classe não tem outra fonte cedo.",
          "No nível 19, faça **Leaf** num staff de dois sockets se você tiver qualquer intenção de virar para fogo no 30. Tir e Ral dão **+3 em Fire Skills**, e como o Warlock levita o staff você fica com o Grimoire também. Para todo outro caster do jogo isso é uma troca; aqui não é.",
          "Faça o **Lam Esen's Tome** no Act 3. A recompensa do Alkor são pontos de atributo em vez de um ponto de skill, e cinco deles neste nível são mais ou menos quinze de vida.",
          "O Duriel é rápido e bate forte, e este personagem não tem como fugir dele. Leve poções de descongelamento, mantenha o mercenário vivo, e lance do mais longe que o Miasma Chain permitir.",
          "O Horadric Cube é um baú que viaja. Também é como você vai fazer toda runa acima da Ral pelo resto do jogo.",
        ],
        gearTargets: [
          { why: "Duas runas da Countess, e o primeiro item que faz o personagem parecer responsivo." },
          { why: "Duas runas por +3 em Fire Skills num staff que você segura junto com um Grimoire. Só vale fazer se fogo for o destino." },
          { why: "Para o mercenário, no nível 27. O problema de mana que esta classe tem é resolvido aqui e não volta mais." },
        ],
        exitCriteria: "O Mephisto está morto, o Miasma Chain está em nove, e o seu mercenário está carregando um Insight ou está prestes a.",
      },
      "war-act-4-5-normal": {
        name: "Os sigils, e a virada no trinta",
        summary: "Níveis 21-30. Três pontos baratos compram uma execução, e então a rota se divide.",
        location: "Act 4 e Act 5 — a Pandemonium Fortress até a Worldstone",
        goal: "Maximizar o Miasma Chain, abrir o Sigil: Death, e decidir qual das quatro builds você é.",
        killingWith: "Miasma Chain, com um sigil embaixo do grupo terminando o que sobrou de pé.",
        skillPoints: [
          "**O Izual dá +2 pontos de skill** — a maior concessão isolada do jogo. Os dois vão para Miasma Chain.",
          "Níveis 21-23 mais os dois do Izual: **Miasma Chain** de dez para quinze. Ele não fica pronto aqui e não tem como — cinco pontos é o que esses três níveis e aquela quest de fato fornecem.",
          "Nível 24: a cadeia de sigils, um ponto em cada. Sigil Lethargy e Sigil Rancor são pré-requisitos e Sigil Death é o motivo — a execução dele são 13% fixos da vida de um monstro normal e 10% da de um champion, e **nenhum dos dois números sobe com o nível**. Um ponto é a skill inteira fora o raio, o que faz dele o melhor ponto único disponível a esta classe.",
          "O nível 24 também abre o **Enhanced Entropy**. Um ponto agora porque o Abyss não pode ser pego sem ele; os outros dezenove vêm muito depois.",
          "Níveis 25-30: **Miasma Chain** o resto do caminho até dezoito. Os dois últimos chegam no começo do Nightmare.",
          "São 33 pontos no nível 30 — vinte e nove dos níveis e os quatro pontos de quest do Normal — e trinta e dois deles estão na build Abyss pronta.",
        ],
        statPoints: [
          "**Vitality.** O Hell está a dois atos de distância e a penalidade de resistência dele está prestes a fazer tudo bater mais forte.",
          "**Strength** o suficiente para uma espada de quatro sockets se você for fazer o Spirit no 25. Uma Crystal Sword pede **43**, e não os 25 que o requisito da runeword sugere — os dois números não têm relação, e orçar o errado deixa a espada investível.",
          "**Lam Esen's Tome de novo no Nightmare e no Hell.** Quinze pontos de atributo nas três dificuldades.",
        ],
        actions: [
          "Mate o **Izual** no Act 4. Ele dá **+2 pontos de skill**, e é a única quest do jogo que dá dois.",
          "No nível 25, faça **Spirit** numa espada de quatro sockets. +2 em Todas as Skills e 25-35% de Faster Cast Rate por quatro runas da Countess, e uma espada é de uma mão — o que nesta classe não significa absolutamente nada, porque a mão secundária nunca esteve em jogo.",
          "No nível 27, faça **Lore** em qualquer elmo de dois sockets. +1 em Todas as Skills por uma Ort e uma Sol.",
          "No nível 29, o **Rhyme** vai num Grimoire. Duas runas por todas as resistências e não-pode-ser-congelado — e duas é a única contagem de runas que um Grimoire aceita, porque toda base de Grimoire do jogo tem exatamente dois sockets. É o mesmo motivo de Spirit e Ancients' Pledge nunca caberem num.",
          "**O nível 30 é onde as quatro builds se separam, e duas delas se separam sem respec.** Continue gastando em miasma e você já está construindo o Abyss Warlock. Comece a gastar em Ring of Fire, Flame Wave e Apocalypse e tudo o que você tem vira o pacote do vazio daquela build — 60 pontos na cadeia de fogo, 40 já em miasma, 3 nos sigils, e nenhum ponto desperdiçado.",
          "**As builds Cleave e Blood Boil precisam de um respec aqui, e você tem três.** Nada da árvore Eldritch e quase nada da árvore Demon está nesta rota, então use o token de Normal da Akara no 30 e guarde os de Nightmare e Hell.",
          "Faça o resgate da **Anya** no Act 5 em todas as dificuldades. O Scroll of Resistance dela é um bônus permanente em todas as resistências e é a resistência mais barata que este personagem vai conseguir.",
          "Os Ancients não podem ser pulados nem abandonados por town portal. Limpe o nível ao redor antes, beba tudo, e deixe o sigil trabalhar — um Ancient abaixo de um décimo da vida dentro do Sigil: Death simplesmente morre.",
        ],
        gearTargets: [
          { why: "A maior melhoria isolada de subida de nível do jogo para qualquer caster, e quatro runas comuns." },
          { why: "Para o Grimoire, no nível 29. Dois sockets é tudo o que um Grimoire tem e o Rhyme é uma runeword de duas runas." },
          { why: "+1 em Todas as Skills num elmo, por duas runas." },
        ],
        exitCriteria: "O Baal está morto, Miasma Chain e Miasma Bolt estão perto de vinte, e você sabe qual das quatro você é.",
      },
      "war-nightmare": {
        name: "Abyss, e as primeiras resistências de verdade",
        summary: "Níveis 30-48. O capstone chega e o personagem deixa de ser um projeto.",
        location: "Nightmare — Act 1 até Act 5",
        goal: "Maximizar o Abyss, recolocar as resistências no máximo, e chegar ao portão do Hell.",
        killingWith: "Miasma Chain seguido de Abyss, com Sigil: Death embaixo do que sobreviver à primeira passada.",
        skillPoints: [
          "Nível 30: **Abyss**. Vinte a quarenta de mágico num raio de 6, e a mana é cobrada quando ele resolve em vez de quando começa — uma conjuração interrompida não custa nada.",
          "Níveis 31-48: **Abyss** até vinte, e os dois últimos no **Miasma Chain** para fechá-lo.",
          "**Os pontos de quest do Nightmare — Den of Evil, Radament e Izual — são mais quatro**, e os quatro vão pelo mesmo caminho.",
          "São 55 pontos no nível 48 — quarenta e sete dos níveis e oito pontos de quest, todos os do Normal e do Nightmare.",
          "Se você virou para fogo no 30: Ring of Fire até vinte primeiro, depois Flame Wave, depois Apocalypse. A ordem importa porque o Ring of Fire alimenta os outros dois e é o mais barato dos três de terminar.",
        ],
        statPoints: [
          "**Vitality, ainda.** Os −40 em todas as resistências do Nightmare são sobrevividos tanto com vida quanto com resistência.",
          "**Strength rumo a 38.** É o que um Burnt Text pede, e o Measured Wrath fica num deles no nível 52 — o primeiro unique de Warlock que qualquer personagem consegue de fato vestir.",
          "Nada em Dexterity. Um Grimoire bloqueia, mas um caster que está bloqueando já cometeu o erro que importava.",
        ],
        actions: [
          "No nível 37, o **Splendor** é a outra opção de Grimoire de duas runas — +1 em Todas as Skills e 10% de faster cast contra as resistências do Rhyme. Faça o que as suas resistências permitirem.",
          "No nível 41, **Lionheart** numa armadura de três sockets: +25 em todos os atributos, que são 75 de vida e uma mordida de verdade na conta de Strength ao mesmo tempo.",
          "**Den of Evil, Radament e The Fallen Angel de novo.** Mais quatro pontos de skill, e um segundo respec grátis que você também não deveria gastar.",
          "**Rode a Countess sempre que passar pelo Black Marsh.** Toda runeword que esta rota usa é feita do que ela solta, e a versão do Hell dela é onde Ist e acima começam a aparecer.",
          "**O Sigil: Death não liga para o Nightmare.** Os limiares dele são porcentagens da vida do próprio monstro, então ele executa exatamente tão bem no nível 48 quanto executava no 24 — e continua parado em um ponto.",
          "Os Ancients do Nightmare e o Baal do Nightmare são as duas paredes. As duas se respondem com mais vida em vez de mais dano, que é o argumento a favor do Lionheart contra mais um item de skill.",
        ],
        gearTargets: [
          { why: "A segunda runeword de Grimoire, no 37. Ainda duas runas, porque um Grimoire ainda tem dois sockets." },
          { why: "+25 em todos os atributos são 75 de vida e parte do requisito de Strength de um Grimoire num item só." },
          { label: "Qualquer amuleto ou anel raro com +Warlock skills e resistência", why: "Dois slots que esta rota nunca planeja e sempre aproveita." },
        ],
        exitCriteria: "O Baal do Nightmare está morto, o Abyss está em vinte, e as suas resistências estão no cap ou perto dele.",
      },
      "war-hell": {
        name: "Onde a escolha de elemento se paga",
        summary: "Níveis 48-70. Treze de vinte áreas resistem a fogo. Uma resiste a você.",
        location: "Hell — Act 1 até Act 4",
        goal: "Terminar o Enhanced Entropy, conseguir o primeiro unique de Warlock, e limpar até o Chaos Sanctuary.",
        killingWith: "Miasma Chain e Abyss, e o sigil embaixo de todo grupo que valer os quatro segundos.",
        skillPoints: [
          "Níveis 49-70: **Enhanced Entropy** de um até vinte, depois **Miasma Bolt** de nove a dezesseis com o resto. O Enhanced Entropy dá ao Abyss +2% de dano com mais 3% por nível, que é a linha isolada mais íngreme da skill e a razão de ele valer vinte pontos em vez de um.",
          "**Os pontos de quest do Hell são mais quatro** e vão pelo mesmo caminho.",
          "São 81 pontos no nível 70 — sessenta e nove dos níveis e todos os doze pontos de quest — contra um núcleo pronto do Abyss de 83.",
          "A rota de fogo alcança o núcleo do Apocalypse quase exatamente no mesmo nível, porque os dois planos são sessenta pontos de cadeia de capstone mais um punhado de uns.",
        ],
        statPoints: [
          "**Strength até 38 se ainda não estiver**, para o Measured Wrath no 52.",
          "**Todo o resto em Vitality.** Os −100 em todas as resistências do Hell são o maior degrau isolado de dificuldade do jogo.",
          "Se o destino for o Occult Tome depois, 82 é o número — mas é um item de nível 78 e não há razão para pré-pagar.",
        ],
        actions: [
          "No nível 52, o **Measured Wrath** fica vestível — um Burnt Text com +1 em Warlock skills, 25% de Faster Cast Rate e +20-30 em todas as resistências, com 38 de Strength. É o primeiro item do jogo feito para esta classe que um personagem consegue realisticamente ter.",
          "No nível 51, **Coven** num elmo de três sockets: +1 em Todas as Skills, 20% de Faster Cast Rate e 26-40% de magic find quando se conta o modificador de elmo da própria Ist.",
          "No nível 53, **Vigilance** é Dol e Gul num Grimoire — todas as resistências, vida, mana e um bônus grande de defesa. É a única runeword do jogo cujo primeiro tipo de item listado é o Grimoire, e são duas runas porque é só isso que cabe num Grimoire.",
          "No nível 49, um Cleave Warlock quer **Oath** numa espada ou machado de quatro sockets — ela publica 50% de Increased Attack Speed depois de contar a Shael, e é aqui que aquela build para de tomar emprestado e começa a bater.",
          "**É aqui que a escolha de elemento aparece.** Imunidade a fogo é registrada em treze das vinte áreas catalogadas deste site e imunidade a mágico em uma — o Arcane Sanctuary. Um Warlock de fogo precisa de um Flame Rift, que é drop de nível 75; um de mágico não precisa de nada.",
          "**O Mausoleum é a área a aprender.** Nível de área 85, a duas telas do waypoint das Cold Plains, e as imunidades registradas dele são veneno e frio — nenhuma das quais esta rota causa.",
          "**Den of Evil, Radament e The Fallen Angel uma última vez.** Os últimos quatro pontos de skill, levando o total de quest a doze.",
        ],
        gearTargets: [
          { why: "Uma Ist e duas runas comuns por +1 skills e 20% de cast rate." },
          { why: "A runeword de Grimoire, no 53. Duas runas, porque dois sockets." },
          { why: "O primeiro unique de Warlock que não é item de endgame. Nível 52, 38 de Strength." },
        ],
        exitCriteria: "O Mephisto e o Diablo do Hell estão mortos, o Enhanced Entropy está em vinte, e você tem um item de Warlock na mão secundária.",
      },
      "war-endgame": {
        name: "Os últimos trinta pontos, e qual build você já é",
        summary: "Níveis 70-99. O plano fecha, e a rota acaba tendo sido uma build o tempo todo.",
        location: "Hell — a Worldstone Keep, Terror Zones, e o que você farmar",
        goal: "Terminar o núcleo, escolher um pacote, e parar de subir de nível como projeto.",
        killingWith: "A build pronta, seja qual das quatro você virou.",
        skillPoints: [
          "Níveis 71-99: vinte e nove pontos, e os últimos deles são os que decidem o personagem em vez de construí-lo.",
          "**Miasma Bolt de dezesseis a vinte** fecha o núcleo do Abyss em 83 de 110.",
          "**Depois o pacote.** Ring of Fire até vinte é a resposta de fogo para a única área que resiste a você; Psychic Ward com os dois pré-requisitos dele é o ward. Pegue um, não os dois — 110 não comporta os dois.",
          "**Um ponto em Summon Goatman é o único ponto que esta rota gasta e que o núcleo do Abyss não lista.** Ele é um dos sete que o pacote de fogo deixa sobrando, comprou o Act 1 inteiro para você, e duas das outras três builds o mantêm assim mesmo — o Blood Boil no núcleo e o Apocalypse no pacote do muro de demônios.",
          "83 + 20 = 103, com o Goatman fazendo 104 e seis genuinamente livres.",
        ],
        statPoints: [
          "**Strength por último, e só até a mão secundária que você realmente quer.** 82 para um Occult Tome, 95 para um Blasphemous Compendium, 106 para um Blasphemous Grimoire — contra uma base de classe de 15.",
          "**Todo o resto é Vitality, pelos trinta níveis inteiros.** A 3 de vida por ponto é a melhor conversão disponível a qualquer caster do jogo.",
          "Energy continua zero, e o Insight continua sendo o motivo.",
        ],
        actions: [
          "**Você já é um Abyss Warlock.** Não 'pronto para virar um' — a tela de skills mostra o núcleo daquela build sem nada a desfazer. Esta é a única classe do site em que a rota de subida e uma build pronta são os mesmos 83 pontos.",
          "**Ou um Apocalypse Warlock, também sem respec**, se você virou para fogo no 30. Sessenta pontos em Ring of Fire, Flame Wave e Apocalypse, quarenta já gastos em miasma, três nos sigils — que é o núcleo daquela build mais o pacote do vazio exatamente, e a metade do vazio é o que responde às doze áreas imunes a fogo.",
          "**Ou gaste um token.** Cleave e Blood Boil são transições de um respec só a partir daqui e você ainda deveria estar com os três tokens. O plano do Cleave são 104 de 110 e o mais apertado dos quatro; o do Blood Boil são 72 com um pacote por cima.",
          "Nos níveis 73, 78 e 80 os três grimoires **Ars** ficam vestíveis — Tor'Baalos para o Blood Boil, Dul'Mephistos para o Cleave e o Abyss, Al'Diablolos para o Apocalypse. Cada um sobe várias das skills da sua build a partir de um slot só, e cada um é a razão de o número de Strength daquela build ser o que é.",
          "**As Terror Zones giram a cada trinta minutos e são a experiência mais rápida do jogo depois do nível 90.** No Hell elas também geram Heralds of Terror, cada um mais perigoso que o anterior — uma build mágica com 50 de alcance está excepcionalmente bem posicionada para enfrentá-los e excepcionalmente mal posicionada para ser alcançada por um.",
          "**Não faça respec para perseguir um pacote.** Os dois estão dentro do mesmo núcleo, e a diferença entre eles são vinte pontos que dá para reconquistar subindo de nível em vez de gastando um token que você pode querer para outra build depois.",
        ],
        gearTargets: [
          { why: "Um Occult Tome no nível 78 com +2 em Warlock skills e −10-20% de Resistência Mágica do Inimigo. A maior quebra de mágico em qualquer item do jogo." },
          { label: "Entropy Locket", why: "Um amuleto de nível 54 com +5-10% de Dano de Skills Mágicas. Vestível muito antes deste estágio e digno de ser usado desde a hora em que cai." },
          { why: "+2 em Todas as Skills, vida e mana por nível, e 10% de redução de dano — o melhor elmo geral para qualquer uma das quatro." },
        ],
        exitCriteria: "O núcleo está fechado, um pacote foi escolhido, e a página da build em que você virou assume daqui em diante.",
      },
    },
  },
};
