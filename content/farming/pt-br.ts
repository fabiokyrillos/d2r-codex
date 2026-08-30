import type { FarmingAreaCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR das áreas de farm.
 *
 * Nomes de área, boss e waypoint permanecem em inglês: é assim que aparecem no
 * jogo em qualquer idioma de interface que o jogador brasileiro use na prática,
 * e é como a comunidade se refere a eles. Ver ADR 0003.
 */
export const areasPtBr: Overlay<FarmingAreaCopy> = {
  countess: {
    summary:
      "Uma run curta e segura por runas baixas e médias. A melhor fonte de runas para um personagem abaixo do nível 50.",
    access:
      "Waypoint do Black Marsh → Forgotten Tower → cinco níveis de Tower Cellar. A Countess fica no quinto.",
    why: "Ela tem uma tabela de drop de runas dedicada, além do loot normal, então cada morte produz runas. O nível de área 79 no Hell limita os drops de runa dela em Ist — ela não consegue dropar nada acima disso.",
    route: [
      "Pegue o waypoint do Black Marsh e ache a Forgotten Tower (é um prédio fixo, mas a posição dele no Marsh é aleatória).",
      "Desça cinco níveis de Tower Cellar. Os níveis 1 a 4 podem ser atravessados correndo — não há nada que valha matar.",
      "No nível 5, a Countess está sempre na sala do canto mais distante, com um super chest garantido ao lado.",
      "Mate, pegue o drop, saia e refaça a partida. A run deve levar menos de dois minutos.",
    ],
    bosses: [
      {
        name: "The Countess",
        notes:
          "Drop de runa garantido, vindo de uma treasure class especial de runas, além dos drops normais dela.",
      },
    ],
    notes:
      "Rode no Normal pelas runas de Stealth e Ancient's Pledge, no Nightmare pelas de Spirit e Insight, e no Hell de Um até Ist. Assim que você precisar de runas acima de Ist, ela acabou — vá para Travincal ou Terror Zones altas.",
  },

  andariel: {
    summary:
      "A run de boss mais rápida do jogo. Uma caminhada curta a partir de um waypoint, e uma tabela de drop bem generosa para o nível dela.",
    access:
      "Waypoint do Catacombs Level 2 → Catacombs Level 3 → Level 4. Cerca de 30 segundos com Teleport.",
    why: "O drop de quest da Andariel é famosamente generoso, e mesmo em mortes repetidas ela tem uma tabela melhor do que o nível de área dela sugere. Combinado com o menor trajeto de qualquer boss, ela dá o melhor drop por minuto de qualquer alvo inicial.",
    route: [
      "Pegue o waypoint do Catacombs Level 2.",
      "Teleporte ou corra até as escadas do Level 3, e depois para o Level 4.",
      "A Andariel está sempre na mesma sala do Level 4.",
      "Beba uma antidote potion antes de engajar — ela eleva sua resistência máxima a veneno bem acima do teto usual de 75%.",
    ],
    bosses: [
      {
        name: "Andariel",
        notes:
          "O ataque de veneno dela é o principal perigo. Antidote potions elevam sua resistência máxima a veneno temporariamente e tornam a luta trivial.",
      },
    ],
    notes:
      "O nível de área 73 dela no Hell limita o item level do que pode cair, então ela não produz os itens de nível mais alto. Ela é um alvo de volume, não de jackpot.",
  },

  mephisto: {
    summary:
      "A run clássica de magic find. Tabela de drop de alto valor, trajeto de 20 segundos, e um truque que o impede de alcançar você.",
    access: "Waypoint do Durance of Hate Level 2 → Level 3. O Mephisto está logo à frente.",
    why: "O Mephisto é monstro nível 87 no Hell apesar de ficar numa zona de nível de área 83, o que coloca quase todo item desejável na tabela de drop dele. O trajeto do waypoint até o boss é de uns vinte segundos, e o truque do fosso elimina quase todo o risco.",
    route: [
      "Pegue o waypoint do Durance of Hate Level 2.",
      "Ache as escadas para o Level 3 — o layout é aleatório, mas pequeno.",
      "No Level 3, o Mephisto fica do outro lado de um fosso de sangue.",
      "O truque do fosso: fique do lado de cá. O corpo a corpo dele não alcança você, e os ataques à distância podem ser desviados saindo atrás do segmento de parede. Ataque através do vão.",
      "Os membros do Council guardam a aproximação. Dá para ignorá-los por completo se você se posicionar com cuidado.",
    ],
    bosses: [
      {
        name: "Mephisto",
        notes:
          "O nível de monstro dele no Hell é 87, maior que o nível de área 83, e é por isso que a tabela de drop dele é tão melhor que a da zona ao redor.",
      },
    ],
    notes:
      "Ele é imune a raio e a fogo no Hell, o que exclui Lightning e Fire Sorceresses sem ajuda. Builds de frio e físicas não têm esse problema — é grande parte do motivo de a Blizzard Sorceress ser o personagem de referência para magic find.",
  },

  "ancient-tunnels": {
    summary:
      "Uma zona de nível de área 85 com quase nenhum imune a frio. A melhor área geral de magic find para uma build de frio.",
    access:
      "Waypoint da Lost City → a entrada do túnel é um alçapão na Lost City, com posição aleatória.",
    why: "Uma das pouquíssimas zonas de nível de área 85 sem imunidade a frio entre a população regular, o que a torna a casa natural de uma Blizzard Sorceress. Densa, fechada em si mesma, e cada drop rola das treasure classes mais altas.",
    route: [
      "Pegue o waypoint da Lost City.",
      "Vasculhe a Lost City atrás do alçapão. Ele é colocado aleatoriamente, e esse é o principal custo de tempo da run.",
      "Os Tunnels em si são um único nível pequeno — limpe e saia.",
    ],
    bosses: [
      {
        name: "Various unique packs",
        notes:
          "Não há super unique fixo, mas a zona gera de forma confiável vários grupos de champions e uniques.",
      },
    ],
    notes:
      "A população regular — Sand Maggots e monstros do tipo Ghoul — não é imune a frio. Grupos unique ainda podem rolar um modificador de imunidade a frio, então 'sem imunes a frio' se refere aos monstros base, não literalmente a tudo.",
  },

  pit: {
    summary:
      "Nível de área 85, alta densidade, e nenhum boss para enfrentar. A melhor área de caça pura a itens do Ato 1.",
    access:
      "Waypoint do Black Marsh → Tamoe Highland → a entrada do Pit fica na área do muro externo do Monastery.",
    why: "Os dois níveis do Pit são nível de área 85 no Hell, a densidade de monstros é alta, e não há um boss barrando o caminho — você entra e começa a matar coisas que podem dropar qualquer item do jogo.",
    route: [
      "Pegue o waypoint do Black Marsh e siga para o Tamoe Highland.",
      "A entrada do Pit fica no Tamoe Highland, perto do portão do Monastery.",
      "O Level 2 é o mais denso dos dois e tem o baú fixo. Muitos jogadores limpam só o Level 2.",
    ],
    poorlySuitedTo:
      "Builds só de frio sofrem aqui — a população do Pit inclui imunes a frio, ao contrário dos Ancient Tunnels.",
  },

  travincal: {
    summary:
      "O grupo do Council é a maior concentração de potencial de runas altas do jogo, e fica a quinze segundos do waypoint.",
    access: "Waypoint de Travincal. O Council está logo à frente.",
    why: "Um número muito grande de monstros de nível alto numa área minúscula, imediatamente ao lado de um waypoint. Os membros do Council rolam de treasure classes boas e podem dropar qualquer runa do jogo, o que faz de Travincal o alvo padrão para runas altas.",
    route: [
      "Pegue o waypoint de Travincal.",
      "O Council está reunido na plataforma elevada logo em frente.",
      "Mate, saqueie, saia. Não siga para a Durance a menos que você também vá rodar o Mephisto.",
      "Um Barbarian com Find Item rerola loot de cada cadáver, e é por isso que Travincal é a farm clássica de Barbarian.",
    ],
    bosses: [
      {
        name: "Council Members (Ismail Vilehand, Geleb Flamefinger, Toorc Icefist)",
        notes:
          "Três membros nomeados do Council mais o Council regular. Eles batem extremamente forte no Hell e conjuram Charged Bolt e Hydra.",
      },
    ],
    poorlySuitedTo: "Builds de fogo e de raio — o Council é imune aos dois no Hell.",
    notes:
      "Genuinamente perigoso. Membros do Council causam muito dano físico e elemental e matam rápido um personagem mal equipado. Não é uma run de iniciante no Hardcore.",
  },

  "chaos-sanctuary": {
    summary:
      "Nível de área 85, extremamente densa, e termina com o Diablo. A melhor área de experiência por hora do jogo fora das runs de Baal.",
    access: "Waypoint do River of Flame → uma caminhada curta até a entrada do Chaos Sanctuary.",
    why: "Nível de área 85, densidade muito alta, três super uniques e um boss de ato, tudo num espaço fechado. É simultaneamente uma área de topo para itens e uma área de topo para experiência.",
    route: [
      "Pegue o waypoint do River of Flame e corra até a entrada do Chaos Sanctuary.",
      "O layout é fixo: cinco selos, três dos quais invocam um boss.",
      "Limpe a área da estrela no centro primeiro, depois trabalhe para fora em direção aos selos.",
      "Abra os dois selos da esquerda antes do par da direita — o De Seis aparece de um dos dois da esquerda, e é com ele que você quer lutar com atenção total.",
      "Fique atento a Oblivion Knights conjurando Iron Maiden. Para um personagem de dano físico isso é letal; para um caster é inofensivo.",
    ],
    bosses: [
      { name: "Diablo", notes: "Aparece depois que os três bosses de selo são mortos." },
      {
        name: "Grand Vizier of Chaos, Lord De Seis, Infector of Souls",
        notes:
          "Os três bosses de selo. O De Seis é o perigoso — ele lidera um grupo de Oblivion Knights que conjuram Iron Maiden e Bone Prison.",
      },
    ],
    notes:
      "Imunes a fogo e a raio são extremamente comuns aqui. Uma Blizzard Sorceress lida com isso confortavelmente; uma Fire Sorceress não.",
  },

  "worldstone-keep": {
    summary:
      "Três andares consecutivos de nível de área 85 levando ao Throne of Destruction e ao Baal.",
    access: "Waypoint do Worldstone Keep Level 2.",
    why: "Os três andares do Keep, o Throne of Destruction e a Worldstone Chamber são todos nível de área 85 no Hell — o maior bloco contíguo de espaço de farm de topo do jogo, e o lugar padrão para subir do nível 90 ao 99.",
    route: [
      "Pegue o waypoint do Worldstone Keep Level 2.",
      "Limpe os Levels 2 e 3, depois desça para o Throne of Destruction.",
      "O Baal manda cinco ondas de minions antes de ficar atacável. As ondas dão bastante experiência.",
      "Partidas públicas de run de Baal são a forma padrão de subir além do nível 90.",
    ],
    bosses: [
      {
        name: "Baal",
        notes: "Alcançado pelo Throne of Destruction, depois de cinco ondas de minions.",
      },
    ],
    notes:
      "Todos os tipos de imunidade aparecem aqui. É onde uma build de elemento único finalmente fica sem saída sem um Sunder Charm ou um mercenário com Infinity.",
  },

  mausoleum: {
    summary:
      "Uma zona de nível de área 85 ignorada no Ato 1, ao lado da Blood Raven, com população majoritariamente undead.",
    access: "Waypoint das Cold Plains → Burial Grounds → a entrada do Mausoleum.",
    why: "Nível de área 85 no Hell apesar de ser uma zona do Ato 1 alcançável em segundos. Bem mais segura que o Pit ou Travincal, ao custo de densidade um pouco menor.",
    route: [
      "Pegue o waypoint das Cold Plains e siga para os Burial Grounds.",
      "A entrada do Mausoleum fica no lado oposto dos Burial Grounds, perto de onde a Blood Raven aparece.",
      "É um único nível fechado.",
    ],
    notes:
      "Frequentemente ignorada por jogadores novos, que presumem que zonas do Ato 1 são de nível baixo. O nível de área dela no Hell é idêntico ao do Chaos Sanctuary.",
  },

  pindleskin: {
    summary:
      "A run mais curta do jogo. Dez segundos do portal até um super unique com boa tabela de drop.",
    access:
      "Pegue o portal vermelho em Harrogath até o Nihlathak's Temple. O Pindleskin está a alguns passos.",
    why: "O Pindleskin é monstro nível 86 no Hell, mas fica a dez segundos de um portal na cidade. Nada mais no jogo oferece essa proporção entre qualidade de drop e tempo gasto.",
    route: [
      "Complete a quest da Anya para o portal vermelho aparecer em Harrogath.",
      "Pegue o portal, mate o Pindleskin e os dois Defiled Warriors dele, saqueie e saia.",
      "Como você nunca sai das imediações do portal, a run reinicia quase instantaneamente.",
    ],
    bosses: [
      {
        name: "Pindleskin",
        notes:
          "O nível de monstro dele no Hell é 86, acima do nível 83 da área, e é por isso que ele dropa tão acima do entorno.",
      },
    ],
    notes:
      "Ele é imune a frio no Hell, o que é inconveniente para uma Blizzard Sorceress — esta é uma run em que o mercenário faz o trabalho, ou em que você leva um Cold Rupture sunder charm.",
  },

  "lower-kurast": {
    summary:
      "Não se trata dos monstros. Os super chests nas cabanas são uma das melhores fontes de runa do jogo.",
    access: "Waypoint de Lower Kurast. As cabanas ficam ao redor dele.",
    why: "Lower Kurast contém vários 'super chests' fixos dentro das cabanas, que rolam de uma boa treasure class independentemente dos monstros. Dá para rodar com equipamento baixo porque você está saqueando baús, não lutando.",
    route: [
      "Pegue o waypoint de Lower Kurast.",
      "Três ou quatro cabanas ficam perto do waypoint, cada uma com baús e frequentemente um weapon rack.",
      "Abra os baús, ignore os monstros, saia.",
      "Esta run é segura o bastante para personagens mal equipados usarem para viabilizar as primeiras runewords.",
    ],
    notes:
      "O conteúdo dos baús não liga para quanto magic find você tem — drops de baú usam um mecanismo diferente do de monstros. Rode com equipamento barato.",
  },

  "kurast-temples": {
    summary:
      "Seis masmorras pequenas espalhadas por Kurast, todas nível de área 85 no Hell, todas a poucos passos de um waypoint.",
    access:
      "Waypoints de Kurast Bazaar, Upper Kurast e Kurast Causeway. Cada um tem uma ou duas entradas de templo por perto.",
    why: "Seis masmorras separadas de nível de área 85 — Ruined Temple, Disused Fane, Forgotten Reliquary, Forgotten Temple, Ruined Fane e Disused Reliquary — agrupadas em torno de três waypoints. Cada uma é pequena e fechada em si mesma, então um circuito por várias é rápido, e cada morte rola das treasure classes de topo.",
    route: [
      "Pegue o waypoint do Kurast Bazaar e procure entradas de templo por perto.",
      "Siga para Upper Kurast e para o Causeway, limpando cada templo que encontrar.",
      "Cada templo é um único nível pequeno. Limpe e vá para o próximo.",
      "Zealots e Fanatics lá dentro rolam imunidades com frequência — confira um grupo antes de se comprometer com ele.",
    ],
    notes:
      "Consistentemente ignorados, porque os nomes são esquecíveis e nenhum deles tem boss. Só pelo nível de área, eles equivalem ao Chaos Sanctuary, e são consideravelmente mais seguros.",
  },

  "secret-cow-level": {
    summary:
      "Densidade enorme num único mapa plano e aberto. A melhor experiência por minuto do jogo fora de uma run de Baal.",
    access:
      "Cube a Wirt's Leg com um Tome of Town Portal no Rogue Encampment, depois de matar o boss de ato daquela dificuldade.",
    why: "A maior densidade de monstros do jogo, num único mapa plano sem custo de navegação. As Hell Cows são nível 81, o que coloca a maioria das bases úteis e das runas médias ao alcance, e o número absoluto de mortes a torna excelente para experiência pelos 70 e 80.",
    route: [
      "Mate o boss de ato da dificuldade em que você quer abrir.",
      "Volte ao Rogue Encampment e cube a **Wirt's Leg** com um **Tome of Town Portal**. A perna vem do cadáver do Wirt em Tristram.",
      "Um portal vermelho abre, válido só para aquela partida.",
      "**Não mate o Cow King.** Fazer isso fecha o Cow Level permanentemente para aquele personagem naquela dificuldade.",
      "Limpe em espiral, saindo do portal para fora. O mapa é plano e aberto, então skills de movimento compensam muito.",
    ],
    bosses: [
      {
        name: "The Cow King",
        notes:
          "Matá-lo fecha o Cow Level permanentemente para aquele personagem naquela dificuldade. Não há como desfazer.",
      },
    ],
    poorlySuitedTo:
      "Qualquer coisa lenta ou frágil. As Hell Cows batem forte e chegam em números avassaladores — o perigo aqui é o volume, não algum monstro específico.",
    notes:
      "Um portal por partida, então você precisa de uma Wirt's Leg nova a cada vez. Guarde várias no baú se pretende rodar repetidamente.",
  },

  "river-of-flame": {
    summary:
      "Nível de área 85 imediatamente ao lado de um waypoint, e casa do Hephasto e da Hellforge.",
    access: "Waypoint do River of Flame. Você já chega dentro dela.",
    why: "Nível de área 85 com zero deslocamento a partir do waypoint, e fica diretamente na rota para o Chaos Sanctuary — então limpar custa quase nada no caminho. A quest da Hellforge do Hephasto dá uma runa garantida uma vez por dificuldade.",
    route: [
      "Pegue o waypoint do River of Flame e limpe em direção à entrada do Chaos Sanctuary.",
      "O Hephasto patrulha perto da Hellforge. Ele é **sempre imune a físico** — isso é fixo, não um modificador aleatório.",
      "A maioria dos jogadores limpa o River a caminho do Chaos Sanctuary, em vez de tratar como uma run própria.",
    ],
    bosses: [
      {
        name: "Hephasto the Armorer",
        notes:
          "Guarda a Hellforge. Sempre imune a físico, e bate extremamente forte no Hell.",
      },
    ],
    poorlySuitedTo:
      "Builds puramente físicas não conseguem matar o Hephasto de jeito nenhum, o que bloqueia a quest da Hellforge sem uma segunda fonte de dano.",
  },

  nihlathak: {
    summary:
      "Uma run curta até um super unique numa das zonas de nível mais alto do Ato 5. Perigosa por um motivo específico.",
    access: "Waypoint dos Halls of Pain → Halls of Vaught. O Nihlathak fica no fundo.",
    why: "Nível de área 84 no Hell — pouco abaixo do topo, mas perto o bastante para que a maioria dos itens desejáveis esteja ao alcance. O trajeto do waypoint até o boss é curto e a run é previsível assim que você respeita o Corpse Explosion.",
    route: [
      "Pegue o waypoint dos Halls of Pain.",
      "As escadas para os Halls of Vaught normalmente ficam perto.",
      "O Nihlathak fica no fundo do Vaught.",
      "**Mate-o à distância, ou limpe os cadáveres antes.** O Corpse Explosion dele escala com os cadáveres disponíveis — uma sala cheia de Vipers mortas é sentença de morte.",
    ],
    bosses: [
      {
        name: "Nihlathak",
        notes:
          "Conjura Corpse Explosion sem parar. Numa tela cheia de cadáveres isso é genuinamente letal, e é o motivo inteiro de a run ser classificada como perigosa.",
      },
    ],
    notes:
      "Matar o Nihlathak também completa a quest Betrayal of Harrogath, que libera o portal vermelho usado nas runs de Pindleskin. Vale fazer uma vez por dificuldade de qualquer forma.",
  },

  "stony-tomb": {
    summary: "Uma zona de nível de área 85 no Ato 2, com um super unique, que quase ninguém roda.",
    access: "Waypoint das Dry Hills → de volta ao Rocky Waste → a entrada do Stony Tomb.",
    why: "Os dois níveis são nível de área 85 no Hell, o que é fácil de passar batido numa zona do Ato 2. Pequena, rápida, e contém um super unique com tabela de drop melhorada.",
    route: [
      "Pegue o waypoint das Dry Hills e volte para o Rocky Waste.",
      "A entrada do Stony Tomb está em algum lugar do Rocky Waste — a posição é aleatória, e esse é o principal custo de tempo da run.",
      "Dois níveis pequenos. O Creeping Feature fica no segundo.",
    ],
    bosses: [
      {
        name: "Creeping Feature",
        notes: "Um super unique do tipo Sand Maggot, no segundo nível.",
      },
    ],
  },

  "maggot-lair": {
    summary:
      "Nível de área 85 com boa densidade, num layout de corredores que castiga bastante o corpo a corpo.",
    access: "Waypoint do Far Oasis → a entrada do Maggot Lair.",
    why: "O Level 3 é nível de área 85 com boa densidade, e o Coldworm fica numa posição fixa, então a run é previsível.",
    route: [
      "Pegue o waypoint do Far Oasis e ache a entrada do Maggot Lair.",
      "Três níveis, mas **só o terceiro é nível de área 85** — os dois primeiros não valem limpar.",
      "Os túneis têm a largura de uma tela em vários trechos. Personagens à distância e com Teleport têm grande vantagem.",
    ],
    bosses: [
      {
        name: "Coldworm the Burrower",
        notes:
          "Estático, no terceiro nível, cercado por casulos que geram maggots continuamente.",
      },
    ],
    poorlySuitedTo:
      "Builds corpo a corpo. Os corredores são estreitos demais para recuar assim que os maggots se fecham atrás de você.",
  },

  "arcane-sanctuary": {
    summary:
      "O Summoner, e a rota para as tumbas do Tal Rasha. Plataformas estreitas que favorecem builds à distância.",
    access: "Waypoint do Arcane Sanctuary. Quatro braços de plataforma partem do centro.",
    why: "Uma run rápida e de baixo risco num nível de área razoável, e a rota obrigatória até o Duriel. Mais útil dentro de um ciclo de progressão do Nightmare do que como farm dedicado no Hell.",
    route: [
      "Pegue o waypoint do Arcane Sanctuary.",
      "Quatro braços partem da plataforma central. O Summoner fica no fim de um deles, escolhido aleatoriamente.",
      "As plataformas são estreitas e sem cobertura, então builds à distância têm grande vantagem e builds corpo a corpo ficam afuniladas.",
    ],
    bosses: [
      {
        name: "The Summoner",
        notes:
          "Guarda o diário Horadric que revela qual das tumbas do Tal Rasha é a verdadeira. Caster rápido, com pouca vida.",
      },
    ],
    poorlySuitedTo:
      "Builds corpo a corpo e — de forma incomum — builds de dano mágico: os Ghosts aqui costumam ser imunes a mágico, um dos pouquíssimos lugares em que um Hammerdin encontra uma parede.",
  },
  "uber-tristram": {
    summary:
      "O Pandemonium Event. Três bosses de nível 110 ao mesmo tempo, e a única fonte do Hellfire Torch.",
    access:
      "Não é uma zona onde você entra andando. Mate os três mini-Ubers para juntar Diablo's Horn, Mephisto's Brain e Baal's Eye, e então cube os três órgãos em Harrogath para abrir o portal vermelho.",
    why: "O Hellfire Torch cai aqui e em nenhum outro lugar. +3 nas skills de uma classe aleatória, +10-20 em todos os atributos e +10-20 em todas as resistências num slot de charm é o maior upgrade isolado que a maioria dos personagens já faz.",
    route: [
      "Farme as três chaves no Hell: Key of Terror com a Countess, Key of Hate com o Summoner, Key of Destruction com o Nihlathak.",
      "Cube três chaves do mesmo tipo para abrir um portal de mini-Uber. Cada um dos três portais leva a uma luta diferente e dropa um órgão.",
      "Cube Diablo's Horn, Mephisto's Brain e Baal's Eye juntos para abrir o portal para Uber Tristram.",
      "Lá dentro os três Ubers aparecem juntos. Quase toda run bem-sucedida separa eles em vez de encarar os três de uma vez.",
    ],
    bosses: [
      {
        name: "Uber Mephisto",
        notes:
          "Mantém uma aura de Conviction permanente, e é por isso que as resistências desabam no instante em que você entra. Ele é o motivo de uma fonte de Life Tap não ser opcional.",
      },
      {
        name: "Uber Baal",
        notes:
          "Lança Decrepify, cortando seu dano pela metade e te desacelerando. A abertura padrão é puxar ele para longe dos outros dois.",
      },
      {
        name: "Uber Diablo",
        notes:
          "O que bate mais forte dos três, e o que mata de imediato quem chega despreparado.",
      },
    ],
    poorlySuitedTo:
      "Casters. Os três Ubers têm resistências altíssimas, a aura de Conviction do Uber Mephisto arranca as suas, e os minions punem qualquer coisa que precise ficar parada para causar dano. Esta é uma luta de dano físico.",
    notes:
      "Os três Ubers são monstros de nível 110 — mais alto que qualquer coisa no jogo, e bem acima do nível 83 da própria área. Essa diferença é o motivo de um equipamento que te carrega pelo Hell não ser automaticamente suficiente aqui. O Torch exige nível 75 para equipar.",
  },
};
