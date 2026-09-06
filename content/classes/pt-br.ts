import type { ClassCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR das classes.
 *
 * Nomes de classe, skills, itens e atributos (Strength, Vitality…) ficam em
 * inglês: é o vocabulário que a comunidade brasileira usa e o que aparece nas
 * bases de dados. Ver ADR 0003.
 */
export const classesPtBr: Overlay<ClassCopy> = {
  sorceress: {
    summary:
      "A caster elemental. O Teleport nativo faz dela a farmadora mais rápida do jogo e o primeiro personagem padrão.",
    overview:
      "A Sorceress é construída em torno de três árvores elementais e, de forma única, uma skill de movimento que ela ganha de graça. O Teleport no nível 18 muda o que o personagem é: ela não atravessa a masmorra andando, ela pula direto para a parte que tem loot. Essa skill sozinha é o motivo de ela ser o personagem inicial mais recomendado em toda temporada de ladder, e de continuar sendo uma das melhores farmadoras de magic find nos níveis mais altos de equipamento. Em troca, ela é a classe mais frágil do jogo, com a menor vida por ponto de Vitality de todos, e sobrevive inteiramente à custa de não apanhar.",
    strengths: [
      "Teleport nativo — sem precisar de Enigma, a partir do nível 18",
      "Maior dano explosivo em alvo único e em área no início do jogo",
      "Endgame mais barato de todas as classes; um Spirit sword e um Stealth já bastam para farmar o Hell",
      "A melhor farmadora de magic find do jogo",
      "Três árvores de dano independentes, então um respec pode mudar totalmente o papel dela",
    ],
    weaknesses: [
      "Menor reserva de vida do jogo (2 de vida por ponto de Vitality)",
      "Imunidades elementais no Hell travam de vez uma build de um único elemento",
      "Nenhum dano físico próprio — imunes a frio precisam de uma resposta",
      "Muito punitiva se jogada mal; um Teleport errado encerra um personagem de Hardcore",
    ],
    coreMechanics: [
      {
        title: "Masteries não quebram imunidade",
        body: "Só a Cold Mastery reduz resistência do inimigo — a Fire e a Lightning Mastery aumentam o seu próprio dano. E contra um monstro *imune* (100%+ de resistência) a Cold Mastery não se aplica de forma alguma: ela não é cortada para uma fração, ela é ignorada, e nível nenhum dela quebra a imunidade. Outra coisa precisa quebrá-la antes — um Sunder Charm, a Conviction de um mercenário, o Lower Resist de um Necromancer — e só então a mastery entra, com um quinto do valor. Esta é a coisa mais importante de entender antes de se comprometer com uma build de Sorceress no Hell.",
      },
      {
        title: "Teleport é a build",
        body: "O Teleport custa um ponto de skill e um pré-requisito (Telekinesis). Toda Sorceress pega. Não é opcional, não é luxo, e é o motivo de a velocidade de limpeza dela superar a de classes com muito mais dano.",
      },
      {
        title: "Static Field amolece, não mata",
        body: "O Static Field remove 25% da vida **atual** do monstro por conjuração — não da vida máxima — então o efeito cai rápido com conjurações repetidas. Ele também tem um piso rígido: não reduz um monstro abaixo de **33% de vida no Nightmare** ou **50% no Hell**. É uma ferramenta para amolecer um alvo para o seu mercenário terminar, nunca uma condição de morte por si só.",
      },
      {
        title: "Duas animações de conjuração",
        body: "A maioria das magias da Sorceress usa a animação padrão de caster, com breakpoints em 0/9/20/37/63/105/200. Lightning e Chain Lightning usam uma animação *diferente e mais lenta*, com tabela própria. Planejar Faster Cast Rate de uma Lightning Sorceress pela tabela padrão é um erro comum e caro.",
      },
    ],
    bestFor:
      "Seu primeiro personagem da temporada, e qualquer um que queira farmar com eficiência sem um grande orçamento de itens.",
    classItems: [
      "Sorceress Orbs (Eagle Orb, Sacred Globe, Smoked Sphere, Clasped Orb, Jared's Stone)",
    ],
  },

  amazon: {
    summary:
      "Especialista em arcos e lanças. Casa da Lightning Fury, uma das skills de limpeza mais rápidas do jogo.",
    overview:
      "A Amazon se divide entre arcos, javelins e spears. O lado de javelin (Lightning Fury e Charged Strike) produz uma das maiores velocidades de limpeza e um dos maiores danos em alvo único do jogo depois de equipado, enquanto o lado de arco oferece um personagem à distância mais seguro e mais tolerante. Os dois precisam de investimento considerável em equipamento antes de funcionar, o que faz dela um segundo personagem melhor que um primeiro.",
    strengths: [
      "Lightning Fury limpa áreas cheias mais rápido que quase qualquer coisa",
      "Charged Strike está entre as skills de alvo único mais fortes do jogo",
      "Dano físico e de raio no mesmo personagem cobrem a maioria das imunidades",
      "Excelente com escudo — chance de bloqueio de verdade, ao contrário da maioria dos casters",
    ],
    weaknesses: [
      "Muito dependente de equipamento; a build de javelin é fraca até ter redução de resistência a raio do inimigo",
      "Sem skill de movimento sem Enigma",
      "Divide os pontos de atributo entre Strength, Dexterity e Vitality",
    ],
    coreMechanics: [
      {
        title: "Skills de javelin escalam com pontos e com equipamento",
        body: "Lightning Fury e Charged Strike escalam bastante com +skills, então equipamento específico de Amazon (Titan's Revenge, Griffon's Eye, Thunderstroke) vale muito mais que dano bruto em outro lugar.",
      },
    ],
    bestFor:
      "Quem quer a maior velocidade de limpeza e está disposto a se equipar para isso.",
    classItems: ["Arcos, javelins e spears exclusivos de Amazon"],
  },

  assassin: {
    summary:
      "Artes marciais e armadilhas. A Trapsin é uma das builds mais seguras e fortes do jogo.",
    overview:
      "Adicionada no Lord of Destruction, a Assassin joga como armadilheira — plantando Lightning Sentries que matam fora da tela — ou como artista marcial acumulando cargas e liberando golpes finalizadores. A build de armadilhas é excepcionalmente segura, escala bem, dá conta tanto de Ubers quanto de farm geral, e é uma das poucas builds genuinamente fortes em qualquer nível de equipamento.",
    strengths: [
      "Armadilhas matam de longe e continuam funcionando enquanto você se reposiciona",
      "Excelente capacidade em Uber Tristram",
      "Fade ou Burst of Speed — dois buffs próprios fortes, e você escolhe um, porque conjurar qualquer um derruba o outro",
      "Shadow Master é um minion genuinamente útil",
    ],
    weaknesses: [
      "Dano só de raio na build de armadilhas esbarra em imunes a raio",
      "Builds de artes marciais são difíceis e famintas por equipamento",
      "Sem skill de movimento sem Enigma",
    ],
    coreMechanics: [
      {
        title: "Cargas e golpes finalizadores",
        body: "As skills de artes marciais acumulam cargas que um golpe finalizador consome. O sistema é incomum, recompensa prática, e é o motivo principal de o lado corpo a corpo da classe ser considerado avançado.",
      },
    ],
    bestFor:
      "Quem quer um personagem seguro e flexível, que dá conta bem dos bosses de endgame.",
    classItems: ["Assassin Claws (katars e suas evoluções)"],
  },

  barbarian: {
    summary:
      "Corpo a corpo puro, com a maior reserva de vida do jogo e o Battle Orders que define grupos inteiros.",
    overview:
      "O Barbarian é a âncora corpo a corpo do jogo: a maior vida por ponto de Vitality, passivas de maestria de arma, e a árvore de Warcry que toda outra classe acaba pegando emprestada através de uma runeword Call to Arms. Ele também tem o Find Item, que permite rerolar loot de cadáveres — a base do farmador dedicado de ouro e itens em Travincal.",
    strengths: [
      "Maior reserva de vida do jogo (4 de vida por ponto de Vitality)",
      "Battle Orders é um buff grande de vida e mana para o grupo inteiro",
      "Find Item gera loot extra de cada cadáver",
      "Empunhar duas armas e maestrias dão dano físico de verdade",
    ],
    weaknesses: [
      "Dano puramente físico esbarra direto em imunes físicos",
      "Precisa estar em alcance corpo a corpo de tudo que mata",
      "Sem skill de movimento sem Enigma",
    ],
    coreMechanics: [
      {
        title: "Find Item",
        body: "Depois do Find Potion, o Find Item permite ao Barbarian rerolar um drop novo de um cadáver já saqueado. É o motor por trás das runs de Travincal e é exclusivo da classe.",
      },
    ],
    bestFor: "Quem quer lutar corpo a corpo e dar suporte a um grupo.",
    classItems: ["Barbarian Helms (elmos primais e suas evoluções)"],
  },

  druid: {
    summary:
      "Transformação, tempestades elementais e invocações. A classe mais variada mecanicamente do jogo.",
    overview:
      "O Druid cobre três estilos completamente diferentes: um brigador corpo a corpo em forma de lobo ou urso, um caster elemental jogando Tornados e Fissures, e um invocador comandando lobos e um urso. O Wind Druid (Tornado e Hurricane) é o destaque, oferecendo dano físico e de frio num mesmo personagem — o que lida com as imunidades do Hell melhor que a maioria dos casters de elemento único.",
    strengths: [
      "O Wind Druid causa dano físico e de frio, cobrindo a maioria das imunidades",
      "Oak Sage é um bônus grande de vida para o grupo",
      "As formas transformadas têm breakpoints próprios fortes e boa sobrevivência",
      "Cyclone Armor absorve dano elemental",
    ],
    weaknesses: [
      "O comportamento do Tornado é errático e exige prática para mirar",
      "Transformar-se impede conjurar magias",
      "Tabelas de breakpoint separadas por forma tornam o planejamento chato",
    ],
    coreMechanics: [
      {
        title: "Breakpoints por forma",
        body: "Humano, Werewolf e Werebear usam tabelas diferentes de Faster Cast Rate e Faster Hit Recovery. Equipamento planejado para uma forma está errado para outra.",
      },
    ],
    bestFor:
      "Quem quer variedade, ou um caster que não é travado por uma única imunidade.",
    classItems: ["Druid Pelts"],
  },

  necromancer: {
    summary:
      "Invocações, maldições e magia óssea. O Summoner é o personagem mais tolerante do jogo.",
    overview:
      "O Necromancer luta através de um exército. Um Summoner ergue esqueletos, um golem e revives, amaldiçoa tudo por perto e deixa o exército trabalhar — o que o torna extraordinariamente seguro e uma escolha comum no Hardcore. O lado Bone oferece dano mágico, ao qual quase nada no jogo é imune, ao custo de números brutos bem menores. Os dois lados vivem de cadáveres, e do fato de que um monstro carrega exatamente uma maldição.",
    strengths: [
      "O exército de esqueletos absorve praticamente todo o dano recebido",
      "Maldições (Amplify Damage, Decrepify, Lower Resist) são poderosas e ajudam o grupo inteiro",
      "Bone Spear e Bone Spirit causam dano mágico — quase nada é imune",
      "Corpse Explosion limpa telas inteiras assim que o primeiro monstro morre, e não liga para o seu equipamento",
    ],
    weaknesses: [
      "O dano do Summoner é baixo; as limpezas são seguras, mas lentas",
      "O pathing dos minions é frequentemente frustrante",
      "Precisa de cadáveres, então a primeira morte de cada grupo é sempre a mais lenta",
      "As criaturas invocadas não se atualizam quando o seu equipamento ou as suas skills mudam — o exército precisa ser levantado de novo",
    ],
    coreMechanics: [
      {
        title: "O Corpse Explosion não lê o cadáver",
        body: "Ele consulta quanto aquele **tipo** de monstro vale no nível e na dificuldade dele e tira 70–120% disso. Então um grupo de Champions explode exatamente pelo mesmo valor que o lixo ao lado, um jogo cheio não muda nada, e os pontos de skill compram raio em vez de dano. Metade do resultado é físico e metade é fogo. Existe um artigo inteiro sobre isso — veja Corpse Explosion em Mecânicas do jogo.",
      },
      {
        title: "Uma maldição por alvo, e é isso que define a árvore",
        body: "Lançar uma maldição substitui a que já estava no monstro. Dez maldições, um espaço só, e o Attract nem sequer permite a substituição enquanto dura. A pergunta nunca é qual maldição é a mais forte, e sim qual você está abrindo mão de usar — o Amplify Damage dobra o dano físico contra um alvo que não resiste, o Decrepify faz menos disso e ainda desacelera, enfraquece e trava.",
      },
      {
        title: "Os atributos dos lacaios são fixados no momento da invocação",
        body: "Vida, dano, chance de acerto e resistências de um esqueleto são gravados nele quando ele é criado e não são recalculados. Aumentar o Skeleton Mastery, ou vestir um elmo com +3 na árvore, muda o próximo esqueleto que você levantar e nenhum dos que já estão de pé. O exército precisa ser levantado de novo para receber qualquer coisa.",
      },
      {
        title: "Um golem, seja ele qual for",
        body: "As quatro skills de golem dividem um único tipo de criatura invocada com máximo de um, então invocar o segundo substitui o primeiro. Isso pesa mais no Iron Golem, que consumiu um item para existir: substituí-lo não devolve o item.",
      },
      {
        title: "Dano mágico de um lado, nenhuma Mastery do outro",
        body: "Bone Spear e Bone Spirit causam dano mágico, que só um punhado de monstros do jogo resiste — o mesmo motivo pelo qual o Hammerdin é considerado um faz-tudo seguro. Veneno não tem Mastery nenhuma: o Lower Resist é a única coisa da classe que reduz resistência a veneno, e contra um imune a veneno ele entra com um quinto da força, como toda maldição de resistência.",
      },
    ],
    bestFor: "Jogadores de Hardcore, e qualquer um que queira um primeiro personagem bem seguro.",
    classItems: ["Necromancer Shrunken Heads"],
  },

  paladin: {
    summary:
      "Auras e dano sagrado. O Hammerdin é amplamente considerado a build mais forte do jogo.",
    overview:
      "A mecânica que define o Paladin é a aura: um efeito permanente para o grupo inteiro, escolhido de uma lista grande. O Blessed Hammer, apoiado pela aura Concentration, causa dano mágico que praticamente nada no jogo resiste — e é por isso que o Hammerdin é a build de referência “faz tudo” há duas décadas. Ele também tem as melhores auras defensivas e a maior chance realista de bloqueio do jogo.",
    strengths: [
      "Blessed Hammer causa dano mágico ao qual quase nada é imune",
      "Auras beneficiam o grupo inteiro de forma permanente",
      "Maior chance de bloqueio alcançável e excelente sobrevivência",
      "Forte em qualquer nível de equipamento, do Spirit-e-Stealth ao best-in-slot completo",
    ],
    weaknesses: [
      "O padrão em espiral do Blessed Hammer é genuinamente difícil de mirar no começo",
      "Sem skill de movimento sem Enigma — e o Enigma é quase obrigatório",
      "O dano do hammer não escala com equipamento de +dano, só com +skills",
    ],
    coreMechanics: [
      {
        title: "Os hammers giram, não voam reto",
        body: "O Blessed Hammer viaja numa espiral que se expande no sentido horário ao redor do conjurador. Acertar um alvo significa se posicionar de forma que a espiral passe por ele, e é por isso que Hammerdins novos acham a build fraca — eles estão errando.",
      },
    ],
    bestFor: "Quem quer um personagem só que consiga fazer absolutamente tudo.",
    classItems: ["Paladin Shields (escudos áuricos, com resistências inerentes)"],
  },

  warlock: {
    summary:
      "A primeira classe nova de Diablo II em 25 anos. Escraviza demônios, encanta armas e é a única classe que empunha uma arma de duas mãos junto de uma mão secundária.",
    overview:
      "Adicionado pela expansão Reign of the Warlock em fevereiro de 2026, o Warlock é um erudito sombrio da magia proibida dos Vizjerei. Ele levita a arma em vez de segurá-la, o que permite equipar uma arma de duas mãos numa mão e ainda usar um Grimoire na outra — uma regra de equipamento que não vale para nenhuma outra classe e que invalida o raciocínio habitual de uma mão versus duas mãos. As três árvores dele escravizam demônios como minions, encantam armas com magia mental, ou chovem fogo do inferno e dano de vazio à distância.",
    strengths: [
      "A única classe que empunha uma arma de duas mãos e uma mão secundária ao mesmo tempo",
      "Três estilos genuinamente distintos: minions, hexes de arma, elemental à distância",
      "Pode escravizar demônios encontrados no mundo, não apenas invocar minions fixos",
      "Mais vida por ponto de Vitality que a Sorceress (3 contra 2)",
    ],
    weaknesses: [
      "Exige uma expansão paga — não está disponível para quem tem só o D2R base",
      "Muito menos conhecimento da comunidade que as classes de 25 anos",
      "Está sendo balanceado ativamente; o dano do Bind Demon foi reescrito tão recentemente quanto o Patch 3.3",
    ],
    coreMechanics: [
      {
        title: "Arma levitada",
        body: "A passiva de classe do Warlock levita a arma na mão direita. Na prática isso significa que uma arma de duas mãos ocupa apenas o slot de arma, deixando a mão secundária livre para um Grimoire. Nenhuma outra classe consegue isso.",
      },
      {
        title: "Grimoires",
        body: "A classe de item de mão secundária do Warlock. Grimoires rolam staff-mods de Warlock e um afixo inerente aleatório de dano de arma de Fogo ou Mágico, do mesmo jeito que uma Shrunken Head de Necromancer rola dano de veneno inerente. Existem cinco variantes por nível de qualidade.",
      },
      {
        title: "Escravizar em vez de invocar",
        body: "Onde um Necromancer ergue esqueletos de cadáveres, o Warlock escraviza demônios vivos — Goatmen, Tainted e Defilers — e mais tarde pode escravizar qualquer demônio que encontrar, ou consumir um demônio escravizado para drenar a força vital dele para si.",
      },
    ],
    bestFor:
      "Quem tem a expansão e quer algo genuinamente novo, em vez de uma build de 25 anos já resolvida.",
    classItems: [
      "Grimoires (Old Book, Tome, Codex, Compendium, Grimoire — com níveis Exceptional e Elite)",
    ],
    requiresDlc: "Reign of the Warlock",
  },
};
