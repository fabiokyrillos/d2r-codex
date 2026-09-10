import type { Dictionary } from "./en-us";

/**
 * Dicionário pt-BR.
 *
 * Tipado como `Dictionary`, que é a estrutura de chaves do en-US com os valores
 * alargados para `string`. Adicionar uma chave no en-US sem traduzir aqui é
 * erro de compilação — é assim que a garantia de "zero chaves ausentes" é
 * cumprida, pelo `tsc` e não por teste.
 *
 * Convenção editorial: nomes próprios do jogo (skills, runewords, itens, áreas,
 * runas, auras) ficam em inglês, porque é o que aparece nas bases de dados, nos
 * canais de troca e na comunidade — e porque as strings oficiais em português
 * do D2R não foram verificadas contra fonte primária. Ver ADR 0003.
 */
export const ptBR: Dictionary = {
  meta: {
    siteName: "D2 Codex",
    siteTagline: "Guia de progressão de Diablo II: Resurrected",
    defaultTitle: "D2 Codex — Guia de progressão de Diablo II: Resurrected",
    titleTemplate: "%s · D2 Codex",
    defaultDescription:
      "Um companheiro de Diablo II: Resurrected focado em progressão. Guias de evolução, progressão de equipamento do nível 1 ao best-in-slot, rotas de farm, runewords e mecânicas verificadas.",
    ogDescription:
      "Cada build documentada em seis níveis de equipamento, para que a página seja útil independentemente do que você já tem. Verificado no Patch {patch}.",
  },

  nav: {
    primary: "Principal",
    reference: "Referência",
    menu: "Menu",
    classes: "Classes",
    builds: "Builds",
    leveling: "Evolução",
    farming: "Farm",
    runewords: "Runewords",
    runes: "Runas",
    items: "Itens",
    breakpoints: "Breakpoints",
    mercenaries: "Mercenários",
    mechanics: "Mecânicas",
    sources: "Fontes e pesquisa",
    skipToContent: "Pular para o conteúdo",
  },

  localeSwitcher: {
    label: "Idioma",
    ariaLabel: "Mudar idioma",
    switchTo: "Mudar para {language}",
  },

  footer: {
    blurb:
      "Um companheiro de Diablo II: Resurrected focado em progressão. Feito para responder “o que eu faço agora?” em qualquer nível de equipamento.",
    columnProgression: "Progressão",
    columnReference: "Referência",
    columnAbout: "Sobre",
    mechanicsLink: "Mecânicas do jogo",
    writtenFor: "Escrito para",
    patchSeason: "Patch {patch} · Ladder Temporada {season}",
    verifiedOn: "Verificado em {date}.",
    trademark:
      "Diablo II: Resurrected é marca registrada da Blizzard Entertainment. Esta é uma referência não oficial feita por fãs.",
  },

  search: {
    button: "Buscar",
    ariaLabel: "Buscar no site",
    dialogLabel: "Busca",
    closeLabel: "Fechar busca",
    queryLabel: "Termo de busca",
    placeholder: "Busque itens, runewords, builds, mecânicas…",
    minChars: "Digite pelo menos dois caracteres.",
    nicknamesHint: "Apelidos funcionam: {examples}.",
    loading: "Carregando índice…",
    failed: "Falha ao carregar o índice de busca. Use a navegação.",
    noResults: "Nada corresponde a “{query}”.",
    noResultsHint: "Nem todo item do jogo está catalogado ainda — veja a {link}.",
    coverageLink: "cobertura",
    navigate: "navegar",
    open: "abrir",
    close: "fechar",
    entriesIndexed: "{count} entradas indexadas",
  },

  searchKinds: {
    class: "Classe",
    build: "Build",
    leveling: "Evolução",
    runeword: "Runeword",
    rune: "Runa",
    item: "Item",
    area: "Farm",
    skill: "Skill",
    mechanic: "Mecânica",
    mercenary: "Mercenário",
    breakpoints: "Breakpoints",
    page: "Página",
  },

  home: {
    badge: "Patch {patch} · Temporada {season}",
    headlineA: "Todo guia começa no",
    headlineHighlight: "melhor equipamento do jogo",
    headlineB: "Este começa onde você está.",
    lede: "Um companheiro de Diablo II: Resurrected construído em torno de uma pergunta: {strong} Nível 1 sem nada, nível 70 com um Spirit e um Stealth, ou nível 95 atrás de um roll perfeito — a resposta precisa ser útil em qualquer ponto.",
    ledeStrong: "o que eu faço agora?",
    ctaStart: "Começar um personagem",
    ctaBuilds: "Ver as builds",
    tiersEyebrow: "Progressão, não lista de compras",
    tiersLede:
      "Toda build deste site é documentada em seis níveis de equipamento. Você acha o que corresponde ao que realmente tem, e ele diz o que melhorar em seguida.",
    classesTitle: "Classes",
    classesAll: "Todas as oito →",
    dlcBadge: "DLC",
    buildsDocumented: "{count} build documentada",
    buildsDocumentedPlural: "{count} builds documentadas",
    overviewAvailable: "Visão geral disponível",
    featureLevelingEyebrow: "Evolução",
    featureLevelingTitle: "Um passo a passo, do nível 1 ao Hell",
    featureLevelingBody:
      "Em que skill colocar o próximo ponto, para onde vão os atributos, quando fazer respec, qual runeword montar e quando você está pronto para a próxima dificuldade.",
    featureFarmingEyebrow: "Farm",
    featureFarmingTitle: "Onde ir, e por quê",
    featureFarmingBody:
      "Níveis de área tirados dos próprios arquivos de dados do jogo. {alvl85} das {total} áreas documentadas atingem o limiar de nível 85, onde os melhores drops são liberados.",
    featureRunewordsEyebrow: "Runewords",
    featureRunewordsTitle: "Regras de base impossíveis de ler errado",
    featureRunewordsBody:
      "{count} runewords com contagem de sockets, ordem exata das runas e exclusões explícitas. Insight vai em polearm, não em spear — e a página diz isso.",
    /*
     * Os cinco cartões de referência de R-NAV-4. Curtos de propósito: a
     * `indexDescription` de cada seção tem cerca de quarenta palavras porque é
     * copy de cabeçalho de página. Os títulos não estão aqui — são as strings
     * `nav.*` que o cabeçalho e o rodapé já usam, para que os lugares que
     * nomeiam uma seção não possam divergir.
     */
    refRunesBody:
      "As 33 runas, o que cada uma faz em arma, armadura e escudo, e as receitas do Cubo que as sobem de nível.",
    refItemsBody:
      "Únicos e peças de set com os valores escritos como faixas, porque um Nightwing's Veil é uma faixa, não uma média.",
    refBreakpointsBody:
      "As animações correm a 25 quadros por segundo, e um atributo de velocidade não faz nada até tirar um quadro inteiro. Estes são os números onde parar.",
    refMercenariesBody:
      "Qual mercenário contratar, por que a dificuldade em que você o contrata é permanente, e o que vestir nele depois disso.",
    refMechanicsBody:
      "Imunidades, resistências, magic find e o resto dos sistemas em que os guias se apoiam — com as partes não confirmadas marcadas como não confirmadas.",
    accuracyTitle: "Sobre precisão",
    accuracyBodyA:
      "Os números deste site vêm de fontes primárias: os arquivos de dados do próprio jogo para níveis de área, o material oficial da Blizzard para mudanças de patch e bases de dados da comunidade cruzadas entre si para estatísticas de itens. Quando fontes confiáveis discordam, ou quando algo não foi confirmado, a página diz isso em vez de escolher um número e soar segura.",
    accuracyBodyB:
      "Diablo II agora tem {strong} classes jogáveis, não sete — o Warlock chegou com {expansion} em 2026. Se um guia que você está lendo lista sete, ele é anterior à expansão, e todo o resto dele também pode estar desatualizado.",
    accuracyEight: "oito",
    accuracyLink: "Como pesquisamos isso →",
  },

  classes: {
    indexTitle: "As oito classes",
    indexDescription:
      "Diablo II teve sete classes jogáveis por vinte e cinco anos. Agora tem oito.",
    warningTitle: "Se um guia lista sete classes, ele está desatualizado",
    warningBody:
      "O {warlock} chegou com a expansão {expansion} em fevereiro de 2026 — a primeira classe nova de Diablo II em um quarto de século. Exige compra paga além do D2R base. Qualquer guia que ainda liste sete classes é anterior à expansão, o que significa que as informações de patch dele também estão velhas.",
    bestFor: "Indicado para:",
    beginnerFriendliness: "Facilidade para iniciantes {value}/5",
    requiresDlc: "Exige DLC",
    buildsCount: "{count} build",
    buildsCountPlural: "{count} builds",
    levelingGuide: "Guia de evolução",
    coverageTitle: "Cobertura",
    coverageBody:
      "Contado a partir do catálogo: páginas de skill para {skills} das {total} classes, jornada completa de evolução para {leveling}, e progressão de equipamento completa para {builds} — {buildCount} no total. A profundidade é adicionada classe a classe, em vez de publicar guias rasos de todas ao mesmo tempo.",
    coverageLink: "Ver a implementação de referência →",

    dlcCalloutTitle: "Expansão paga necessária",
    dlcCalloutBody:
      "O {class} só é jogável se você tiver {dlc}. Não está incluído no Diablo II: Resurrected base.",
    startHere: "Comece por aqui",
    levelingEyebrow: "Evolução",
    levelingCardTitle: "Do nível 1 ao farm no Hell",
    endgameEyebrow: "Build de endgame",
    strengthsWeaknesses: "Pontos fortes e fracos",
    coreMechanics: "Mecânicas centrais",
    coreMechanicsDescription:
      "O que é genuinamente específico desta classe, e que conselhos genéricos costumam errar.",
    attributes: "Atributos",
    attributesDescription:
      "Valores iniciais, e o que cada ponto de Vitality ou Energy realmente compra.",
    attrStrength: "Strength",
    attrDexterity: "Dexterity",
    attrVitality: "Vitality",
    attrEnergy: "Energy",
    gainHeader: "Ganho",
    perPoint: "Por ponto",
    perLevel: "Por nível",
    life: "Vida",
    mana: "Mana",
    perVitality: "{value} por Vitality",
    perEnergy: "{value} por Energy",
    attributesCaption:
      "Algumas bases de dados publicam esses valores em quartos de unidade, onde 8 significa 2 de vida por ponto. Os valores aqui são os que o jogador vê.",
    skillTrees: "Árvores de skills",
    skillsCount: "{count} skills",
    treeNotDocumented: "Ainda não documentada",
    classItems: "Itens específicos da classe",
    breakpointsTitle: "Breakpoints",
    breakpointsDescription:
      "Limiares de frames de animação. Atributos de velocidade não fazem nada até cruzar um deles.",
    allBreakpointsLink: "Todas as tabelas de breakpoints →",
    noBuildsTitle: "Guias de build em andamento",
    noBuildsBody:
      "Esta classe tem visão geral, mas ainda não tem guias de build. A Sorceress é a implementação de referência — a estrutura dela é a que todas as outras classes vão seguir.",
    noBuildsLink: "Ver builds documentadas →",
  },

  builds: {
    indexTitle: "Guias de build",
    indexDescription:
      "Toda build aqui é documentada em seis níveis de equipamento, do personagem recém-criado ao best in slot — para que a página seja útil independentemente do que você tem agora.",
    awaitingTitle: "Classes aguardando guias de build",

    howItPlays: "Como se joga",
    atAGlance: "Resumo",
    capability: "Capacidade",
    content: "Conteúdo",
    ratingsNote:
      "As notas são grosseiras de propósito — 1 é {low}, 5 é {high}. Uma escala mais fina sugeriria uma precisão que estes dados não têm.",
    clearSpeed: "Velocidade de limpeza",
    bossing: "Contra bosses",
    survivability: "Sobrevivência",
    magicFind: "Magic find",
    terrorZones: "Terror Zones",
    ubers: "Ubers",
    soloSelfFound: "Solo self-found",
    players8: "Partidas de 8 jogadores",
    gettingThere: "Como chegar lá",
    doNotLevelAs: "Não evolua com esta build",
    respecAt: "Respec em:",
    fullLevelingLink: "Passo a passo completo de evolução →",
    skills: "Skills",
    skillsDescription:
      "A ordem de maximização importa mais que os totais finais — é ela que define como a build se sente nos cinquenta níveis antes de ficar pronta.",
    maxInOrder: "Maximize estas, nesta ordem",
    onePointEach: "Um ponto em cada",
    remainingPoints: "Pontos restantes",
    packages: "Escolhendo o resto do plano",
    packagesDescription:
      "O núcleo acima é obrigatório. O que vem a seguir gasta os pontos que ele deixa — com custo fechado, e com as alternativas marcadas como alternativas.",
    packageChooseOne: "Escolha exatamente 1 de {total}",
    packageChooseAny: "Pegue quantos quiser de {total}",
    packageOptionOf: "Opção {index} de {total}",
    packageCost: { one: "{points} ponto", other: "{points} pontos" },
    packageArithmetic: "{core} do núcleo + {cost} do pacote = {total} de {cap}.",
    packageFree: "Sobram {points}.",
    packageFromTo: "{from} → {to}",
    packageDelta: "+{points}",
    packageColCost: "Custo",
    packageRoleMain: "Principal",
    packageWhen: "Escolha este quando",
    packageTradeoff: "Do que você abre mão",
    packageRotation: "O que você aperta",
    packageGear: "O que muda no equipamento",
    packageStats: "O que muda nos atributos",
    packageContent: "Para que serve",
    packageRemainder: "Pontos que ainda sobram",
    packageTableCaption:
      "Pontos é o total com que você termina em cada skill. Custo é o que esta rota acrescenta ao núcleo, então uma skill que o núcleo já abriu é cobrada só pela diferença.",
    colOrder: "#",
    colSkill: "Skill",
    colPoints: "Pontos",
    colWhy: "Por quê",
    colRole: "Papel",
    stats: "Atributos",
    colAttribute: "Atributo",
    colAllocation: "Distribuição",
    breakpointsDescription:
      "Atributos de velocidade não fazem nada até cruzar um limiar. Estes são os que importam para esta build.",
    colStat: "Atributo",
    colTarget: "Meta",
    colFrames: "Frames",
    colPriority: "Prioridade",
    immunities: "Lidando com imunidades",
    immunitiesCalloutTitle: "A verdadeira limitação da build",
    gearProgression: "Progressão de equipamento",
    gearProgressionDescription:
      "Seis níveis. Ache o que corresponde ao que você realmente tem e leia a caixa “o que melhorar em seguida” no fim dele.",
    gearTiersNav: "Níveis de equipamento",
    tierPicker: {
      legend: "Onde você está?",
      myTier: "Meu tier: {tier} · Níveis {from}–{to}",
      announce: "Meu tier: {tier}, níveis {from}–{to}.",
      goToGear: "Ir para o equipamento",
      clear: "Limpar",
      clearLabel: "Limpar meu tier",
      expand: "Expandir",
      collapse: "Recolher",
    },
    levelsRange: "Níveis {from}–{to}",
    whatToFixNext: "O que melhorar em seguida",
    /*
     * Vocabulário da comparação da Fase 2. Quatro estados, fechado: todo
     * marcador da página é uma destas palavras. "Mantido" existe só para o
     * leitor de tela, e qualquer um dos três desaparece nas linhas cobertas
     * pela linha de maioria do tier — ver `components/game/tier-markers.tsx`.
     *
     * "slots" fica em inglês por ser o termo do jogo, como manda o ADR 0003; a
     * frase inteira difere do inglês, portanto nenhuma destas chaves é
     * coincidência EN/PT.
     */
    markerNew: "Novo",
    markerKept: "Mantido",
    markerAlternative: "Alternativa",
    markerRemoved: "Removido",
    removedTitle: "Não se usa mais",
    majorityNew: "Quase tudo novo aqui: {count} de {total} slots",
    majorityKept: "Quase tudo mantido aqui: {count} de {total} slots",
    majorityAlternative: "Quase tudo alternativa aqui: {count} de {total} slots",
    /* `bis` é terminal: não tem tier seguinte, logo nunca ganha um "próximo". */
    finalSetup: "Configuração final",
    /* A ponte de R-BUILD-7, no tier compacto seguinte ao expandido. */
    nextShort: "Próximo:",
    /*
     * O sumário de R-BUILD-8. `trigger` é o texto do próprio `<summary>`, que
     * abaixo de 640 px é o botão "Seções"; `label` nomeia o landmark e a sheet;
     * `close` nomeia o controle de fechar. Os rótulos das entradas não estão
     * aqui de propósito — são os próprios cabeçalhos de seção, para que entrada
     * e cabeçalho não possam divergir.
     */
    sections: {
      label: "Seções desta página",
      trigger: "Seções",
      close: "Fechar",
    },
    charmsInventory: "Charms e inventário",
    weaponSwap: "Troca de arma",
    lookFor: "Procure por:",
    sockets: "Sockets:",
    orAlternative: "ou",
    tradeOnly: "Só por troca",
    mercenary: "Mercenário",
    mercGear: "Equipamento",
    fullMercLink: "Guia completo de mercenários →",
    whereToFarm: "Onde farmar",
    whereToFarmDescription:
      "Ordenado por quão bem esta build específica lida com a área, com o nível de equipamento necessário para que seja realista.",
    selfFound: "Solo self-found",
    hardcore: "Hardcore",
    roleMain: "Principal",
    roleSynergy: "Sinergia",
    roleUtility: "Utilidade",
    rolePrerequisite: "Pré-requisito",
    roleFlex: "Flexível",
    priorityRequired: "obrigatório",
    priorityRecommended: "recomendado",
    priorityLuxury: "luxo",

    filters: {
      regionLabel: "Filtrar builds",
      searchLabel: "Buscar builds",
      searchPlaceholder: "Nome, classe ou apelido…",
      resultsOne: "{count} build",
      resultsMany: "{count} builds",
      activeLabel: "Filtrando por",
      removeOne: "Remover filtro: {filter}",
      clearAll: "Limpar tudo",
      emptyTitle: "Nenhuma build corresponde a estes filtros",
      emptyBody:
        "Tente remover um filtro, ou limpar todos. Toda build do site é documentada em seis níveis de equipamento, então quanto mais estreita a pergunta, menos respostas existem.",
      showFilters: "Filtros",
      searchChipPrefix: "Busca:",
      sheetTitle: "Filtrar builds",
      sheetClose: "Fechar filtros",
      sheetCancel: "Cancelar",
      sheetClear: "Limpar filtros",
      showResultsOne: "Mostrar {count} build",
      showResultsMany: "Mostrar {count} builds",
      groupClass: "Classe",
      groupDamage: "Tipo de dano",
      groupDifficulty: "Dificuldade",
      groupBudget: "Orçamento",
      groupGoodAt: "Boa para",
      goodAtNote:
        "“Boa para” significa {threshold} de 5 ou mais naquele eixo — o ponto em que a própria escala deste site começa a chamar uma nota de {label}.",
    },
  },

  leveling: {
    indexTitle: "Do nível 1 ao Hell",
    indexDescription:
      "Passo a passo organizado por etapas, não por nível. Noventa e nove páginas seriam ilegíveis; as decisões que realmente importam se concentram nos desbloqueios de skill, nas recompensas de quest e nas transições de dificuldade.",
    guides: "Guias",
    stagesCount: "{count} etapas · do nível 1 ao farm no Hell",
    transitionsTitle: "Transições de dificuldade",
    transitionsDescription:
      "São recomendações, não exigências. Você pode entrar no Nightmare no nível 30 — só vai ser desagradável, e mais lento do que subir um pouco antes.",
    colMilestone: "Marco",
    colRecommendedLevel: "Nível recomendado",
    colWhy: "Por quê",
    resistancePenaltyTitle: "A penalidade de resistências",
    resistanceCalloutTitle: "Planeje antes de chegar, não depois",
    resistanceBodyA:
      "O Nightmare aplica {nm} em todas as suas resistências. O Hell aplica {hell}. São subtrações diretas do seu total, e são o motivo mais comum de um personagem que ia bem começar a morrer do nada.",
    resistanceBodyB:
      "Um personagem que termina o Normal com 75% de resistência a fogo começa o Nightmare com 35%, e começaria o Hell com −25%. A meta é chegar em cada dificuldade já conseguindo 75% {after} a penalidade.",
    resistanceAfter: "depois",
    colDifficulty: "Dificuldade",
    colResistancePenalty: "Penalidade de resistência",
    colDeathPenalty: "Penalidade de XP por morte",
    resistanceCaption:
      "Recuperar o cadáver devolve 75% da experiência perdida. Verificado no The Arreat Summit.",
    questsTitle: "Recompensas de quest que valem o desvio",
    questsDescription:
      "Cada uma é repetível uma vez por dificuldade, então os totais abaixo são por dificuldade — três vezes ao longo da vida do personagem.",
    colQuest: "Quest",
    colAct: "Ato",
    colReward: "Recompensa",
    questsCaption:
      "4 pontos de skill e 5 de atributo por dificuldade. Nas três dificuldades: 12 pontos de skill, 15 de atributo, +30 em todas as resistências e +60 de vida.",
    imbueTitle: "Guarde o imbue da Charsi",
    imbueBody:
      "O imbue gera um item raro com afixos de nível alto, baseado no nível do item. Gastar num item de nível 11 desperdiça. A maioria guarda os três até ter um bom circlet, amuleto ou base de classe lá pelos 60.",
    awaitingTitle: "Classes aguardando guias de evolução",

    pageTitle: "{class} — do nível 1 ao Hell",
    stagesBadge: "{count} etapas",
    leadsTo: "Leva à {build}",
    beforeYouStart: "Antes de começar",
    stagesNav: "Etapas",
    goal: "Objetivo",
    killingWith: "Matando com",
    skillPoints: "Pontos de skill",
    statPoints: "Pontos de atributo",
    whatToDo: "O que fazer",
    gearToHunt: "Equipamento para caçar nesta etapa",
    readyWhen: "Pronto para seguir quando",
    respecPlanning: "Planejamento de respec",
    respecPlanningDescription:
      "Você ganha um respec grátis por dificuldade na quest Den of Evil — três por personagem. Gaste com intenção.",
    whereThisLeads: "Aonde isso leva",
    whereThisLeadsBody: "Esta jornada evolui até a {build}. A progressão de equipamento dela começa exatamente onde este guia termina.",
    atLevel: "Nível {level}",
    optional: "Opcional",
  },

  levelingTables: {
    transitions: [
      {
        milestone: "Normal Ato 5 / The Ancients",
        level: "30+",
        why: "Os Ancients não podem ser pulados nem ultrapassados com Teleport, e batem forte para o Normal.",
      },
      {
        milestone: "Entrar no Nightmare",
        level: "38–42",
        why: "Dá para ir antes, mas é lento. A experiência do Nightmare é muito melhor que a do Normal, então enrolar depois do 45 desperdiça tempo.",
      },
      {
        milestone: "Nightmare Ato 4–5",
        level: "50+",
        why: "Os níveis de monstro sobem bruscamente aqui. Se estiver sofrendo, farme a Countess ou o Mephisto do Nightmare em vez de forçar.",
      },
      {
        milestone: "Entrar no Hell",
        level: "60–65",
        why: "Abaixo de 60 a diferença de nível de monstro prejudica tanto o seu dano quanto a sua defesa. É a transição que as pessoas apressam e se arrependem.",
      },
      {
        milestone: "Hell Ato 3 / runs de Mephisto",
        level: "70+",
        why: "Assim que você consegue rodar o Mephisto de forma consistente, dá para parar de progredir e começar a farmar. Limpar o Hell inteiro é opcional.",
      },
    ],
    penalties: [
      { difficulty: "Normal", resistance: "Nenhuma", death: "Nenhuma" },
      {
        difficulty: "Nightmare",
        resistance: "−40% em todas as resistências",
        death: "5% da experiência do nível atual",
      },
      {
        difficulty: "Hell",
        resistance: "−100% em todas as resistências",
        death: "10% da experiência do nível atual",
      },
    ],
    quests: [
      { quest: "Den of Evil", act: "1", reward: "+1 ponto de skill, e um respec completo grátis" },
      { quest: "Radament's Lair", act: "2", reward: "+1 ponto de skill (Book of Skills)" },
      { quest: "The Fallen Angel (Izual)", act: "4", reward: "+2 pontos de skill" },
      { quest: "Lam Esen's Tome", act: "3", reward: "+5 pontos de atributo" },
      {
        quest: "The Golden Bird",
        act: "3",
        reward: "Potion of Life — +20 de vida máxima permanente",
      },
      {
        quest: "Prison of Ice (Anya)",
        act: "5",
        reward: "Scroll of Resistance — +10 em todas as resistências, permanente",
      },
      {
        quest: "Tools of the Trade",
        act: "1",
        reward: "Imbue da Charsi — transforma um item num raro de afixos altos",
      },
      {
        quest: "Hellforge",
        act: "4",
        reward: "Runas e gemas; a versão do Hell pode dropar uma runa alta",
      },
    ],
  },

  farming: {
    indexTitle: "Onde farmar",
    indexDescription:
      "Os níveis de área aqui vêm do próprio levels.txt do jogo, usando as colunas de Expansion. Essa distinção importa — as colunas de Classic na mesma tabela dão números bem diferentes.",
    alvl85Badge: "{count} zonas de área nível 85",
    areasDocumented: "{count} áreas documentadas",
    whyTitle: "Por que o nível de área 85 importa",
    whyBodyA:
      "As treasure classes são limitadas pelo nível do monstro. No nível de área 85 as treasure classes mais altas são liberadas, o que significa que {strong} a partir de um monstro comum. Abaixo de 85, camadas inteiras de itens simplesmente não podem cair, por mais que você farme ou carregue magic find.",
    whyStrong: "qualquer item do jogo se torna possível",
    whyBodyB:
      "A exceção são os bosses de ato e alguns super uniques, cujo nível de monstro é maior que o da zona onde estão. O Mephisto no Hell é monstro nível 87 numa zona de nível de área 83, e é exatamente por isso que vale rodar nele.",
    alvl85Title: "Zonas de área nível 85",
    alvl85Description: "A camada mais alta. Qualquer coisa do jogo pode cair aqui.",
    bossRunsTitle: "Runs de boss e alvos específicos",
    bossRunsDescription:
      "Níveis de área menores, mas com um boss cujo nível de monstro, tabela de drop ou velocidade pura compensa a run.",
    immunitiesLabel: "Imunidades:",
    noneNotable: "Nenhuma relevante",
    act: "Ato {act}",
    topTc: "TC alta",

    areaLevels: "Níveis de área",
    normal: "Normal",
    nightmare: "Nightmare",
    hell: "Hell",
    topTreasureClasses: "Treasure classes mais altas",
    levelsSource: "Do {file} do jogo, colunas de Expansion.",
    whyRunIt: "Por que rodar aqui",
    gettingThere: "Como chegar",
    whatToExpect: "O que esperar",
    characteristics: "Características",
    monsterDensity: "Densidade de monstros",
    danger: "Perigo",
    runLength: "Duração da run:",
    commonImmunitiesHell: "Imunidades comuns no Hell",
    goodFor: "Bom para",
    bossesTitle: "Bosses e super uniques",
    colName: "Nome",
    colType: "Tipo",
    colNotes: "Observações",
    notableTargets: "Alvos notáveis",
    buildsThatFarm: "Builds que farmam aqui",
    buildsThatFarmDescription:
      "Derivado dos dados das builds — uma build que recomenda esta área aparece automaticamente.",
    notForEveryBuild: "Não é para toda build",
    worthKnowing: "Vale saber",
    classesThatHandle: "Classes que se dão bem aqui",
    terrorZoneRotation: "Rotação de Terror Zone",
    runLengthVeryShort: "muito curta",
    runLengthShort: "curta",
    runLengthMedium: "média",
    runLengthLong: "longa",
    targetRunes: "runas",
    targetUniques: "únicos",
    targetSets: "conjuntos",
    targetBases: "bases",
    targetCharms: "charms",
    targetJewels: "joias",
    targetGems: "gemas",
    targetExperience: "experiência",
    targetGold: "ouro",
    targetKeys: "chaves",
    targetEssences: "essências",
    bossKindActBoss: "boss de ato",
    bossKindSuperUnique: "super unique",
    bossKindUniquePack: "grupo unique",
    bossKindEvent: "evento",
  },

  runewords: {
    indexTitle: "Runewords",
    indexDescription:
      "Agrupadas por quando realmente passam a importar para um personagem, não em ordem alfabética. Cada entrada informa a contagem exata de sockets, a ordem das runas e em quais tipos de base funciona ou não.",
    documented: "{count} documentadas",
    verifiedStats: "Estatísticas verificadas",
    baseRequired: "Base necessária",
    socketsLabel: "Sockets",
    levelLabel: "Nível",
    runesInOrder: "Runas, na ordem dos sockets",
    orderWarning:
      "Encaixe da esquerda para a direita exatamente nesta ordem. Uma runeword montada fora de ordem não produz nada — as runas ficam no item como preenchimento comum, e você precisa de uma runa Hel e um Scroll of Town Portal para recuperar a base.",
    statistics: "Estatísticas",
    statisticsDescription:
      "Como aparecem no item pronto, já incluindo a contribuição de cada runa.",
    statisticsUnverified:
      "Não publicadas pela Blizzard e ainda não confirmadas em jogo. Deixadas em branco em vez de adivinhadas.",
    whichBase: "Qual base usar",
    commonMistakes: "Erros comuns",
    whoWantsThis: "Quem quer isso",
    worthKnowing: "Vale saber",
    buildsThatUse: "Builds que usam",
    buildsThatUseDescription:
      "Gerado a partir dos dados das builds, então esta lista nunca fica desatualizada.",
    theRunes: "As runas",
    noLevelReq: "sem nível mínimo",
    levelShort: "nv {level}",
  },

  runes: {
    indexTitle: "Runas",
    indexDescription:
      "Todas as 33 runas. O modificador depende do que você encaixa a runa, e escudos costumam diferir de armaduras — as colunas abaixo mantêm os dois separados.",
    verifiedAgainst: "Verificado no The Arreat Summit",
    readingTitle: "Como ler a tabela",
    readingBody:
      "Elmos usam o modificador de armadura. Escudos aparecem separados porque cerca de um terço das runas se comporta de forma diferente neles — Shael dá 20% de Faster Hit Recovery em elmo ou armadura, mas 20% de Faster Block Rate em escudo.",
    groupLow: "Runas baixas",
    groupLowNote: "De El a Amn. A Countess dropa essas à vontade no Normal.",
    groupMid: "Runas médias",
    groupMidNote: "De Sol a Lem. Countess no Nightmare e Hell, baús de Lower Kurast.",
    groupMidHigh: "Runas médias-altas",
    groupMidHighNote: "De Pul a Gul. Travincal, The Pit, zonas de área nível 85.",
    groupHigh: "Runas altas",
    groupHighNote:
      "De Vex a Zod. Travincal, Chaos Sanctuary, Worldstone Keep, Terror Zones altas.",
    colRune: "Runa",
    colLvl: "Nv",
    colWeapon: "Arma",
    colArmorHelm: "Armadura / Elmo",
    colShield: "Escudo",
    upgradingTitle: "Fazendo upgrade de runas",
    upgradingDescription:
      "As runas de El a Ort combinam três para uma sem gema. A partir de Thul é preciso uma gema, e a partir de Pul a proporção melhora para duas para uma.",
    colRecipe: "Receita",
    colResult: "Resultado",
    colRunewordsNeeding: "Runewords que precisam dela",
    upgradingCaption:
      "Fonte: lista de receitas do Horadric Cube do The Arreat Summit. Repare nos níveis de gema — Chipped nos primeiros passos, Flawed no meio, depois gemas normais e Flawless para as runas altas.",
    runeNumber: "Runa {number}",
    ofTotal: "#{number} de 33",
    requiredLevel: "Nível mínimo {level}",
    noLevelRequirement: "Sem nível mínimo",
    socketedModifiers: "Modificadores por tipo de item",
    colItemType: "Tipo de item",
    colModifier: "Modificador",
    itemWeapon: "Arma",
    itemBodyArmor: "Armadura",
    itemHelm: "Elmo",
    itemShield: "Escudo",
    whereItComesFrom: "De onde vem",
    upgradeRecipe: "Receita de upgrade",
    upgradeRecipeBody:
      "Combine no Horadric Cube. Fazer upgrade costuma ser mais rápido que farmar a runa maior direto, principalmente na faixa de El a Lem, onde a proporção é três para uma.",
    runewordsUsing: "Runewords que usam {rune}",
    runewordsUsingDescription:
      "Derivado dos dados das runewords — esta lista se atualiza sozinha.",
  },

  items: {
    indexTitle: "Itens",
    indexDescription:
      "As estatísticas são escritas como o jogo as gera, com os intervalos preservados — saber que o Nightwing's Veil rola de 8 a 15% de dano de frio diz muito mais que uma média.",
    count: "{count} itens",
    whyShortTitle: "Por que esta lista é curta",
    whyShortBody:
      "Itens são catalogados quando um guia precisa deles, e cada entrada foi verificada contra uma base de dados. Transcrever centenas de uniques de memória encheria a página mais rápido e erraria números, que é a única coisa que este projeto não pode se dar ao luxo de fazer.",
    groupHelms: "Elmos",
    groupBodyArmor: "Armaduras",
    groupWeapons: "Armas e orbs",
    groupShields: "Escudos",
    groupGlovesBeltsBoots: "Luvas, cintos e botas",
    groupJewellery: "Joias",
    groupCharms: "Charms",
    related: "Relacionado",
    statistics: "Estatísticas",
    statisticsNote:
      "Os intervalos são a faixa de roll. Itens marcados com um ponto são o motivo de querer o item.",
    requirements: "Requisitos",
    colRequirement: "Requisito",
    colValue: "Valor",
    requiredLevel: "Nível mínimo",
    requiredStrength: "Strength mínima",
    requiredDexterity: "Dexterity mínima",
    maxSockets: "Sockets máximos",
    whereItDrops: "Onde dropa",
    needsMonsterLevel: "Exige monstro nível {level}+",
    tradeAvailability: "Disponibilidade em troca: {value}",
    gamblable: "Dá para apostar",
    shoppable: "Dá para comprar",
    craftable: "Dá para craftar",
    areasToFarm: "Áreas para farmar",
    worthKnowing: "Vale saber",
    alternatives: "Alternativas",
    alternativesDescription:
      "Itens que cumprem papel parecido em outro preço ou nível.",
    buildsThatUse: "Builds que usam",
    buildsThatUseDescription:
      "Gerado a partir dos dados das builds, então nunca fica desatualizado.",
    maxSocketsLabel: "sockets máx.",
    levelBadge: "Nível {level}",
    tradeAbundant: "abundante",
    tradeCommon: "comum",
    tradeUncommon: "incomum",
    tradeRare: "raro",
    tradeVeryRare: "muito raro",
  },

  skills: {
    treeLabel: "Árvore de skills — {tree}",
    treeHint: "Use as setas para navegar pelas skills. Enter abre o painel de detalhes.",
    rowLabel: "Nível {level}",
    emptyCell: "Sem skill",
    panelHeading: "Detalhes da skill",
    panelEmpty: "Selecione uma skill para ver o que ela faz, o que exige e onde fica.",
    closePanel: "Fechar detalhes",
    fullPage: "Ver a página completa da skill",
    ariaNoBuild: "{skill}, nível {level}, {tree}.",
    ariaBuild: "{skill}, nível {level}, {tree}, {points}, {classification}.",
    ariaBuildUnused: "{skill}, nível {level}, {tree}, {classification}.",
    classMaxed: "maximizada e obrigatória",
    classInvested: "obrigatória",
    classOnePoint: "obrigatória",
    classPrerequisite: "pré-requisito",
    classSynergy: "sinergia, obrigatória",
    classUtility: "obrigatória",
    classFlex: "opcional",
    classUnused: "não usada",
    points: { one: "{points} ponto", other: "{points} pontos" },
    noPoints: "não usada",
    stateMaxed: "Maximizada",
    stateInvested: "Investida",
    stateOnePoint: "Obrigatória",
    statePrerequisite: "Pré-requisito",
    stateSynergy: "Sinergia",
    stateUtility: "Utilidade",
    stateFlex: "Opcional",
    stateUnused: "Não usada",
    legendTitle: "Como ler esta árvore",
    legendHardPoints: "Somente pontos duros. Equipamento que dá +skills não está contado.",
    legendMandatory: "{points} de {cap} pontos duros obrigatórios",
    legendFlex: { one: "mais {points} opcional", other: "mais {points} opcionais" },
    eyebrow: "Skill",
    atAGlance: "Resumo",
    colProperty: "Propriedade",
    colValue: "Valor",
    tree: "Árvore",
    unlocks: "Abre em",
    unlocksValue: "Nível {level}",
    cap: "Teto de pontos",
    type: "Tipo",
    element: "Elemento",
    manaCost: "Custo de mana",
    mechanicsTitle: "Como funciona",
    prerequisitesTitle: "Pré-requisitos",
    prerequisitesNone: "Nenhum. O nível do personagem é a única exigência.",
    prerequisitesBody: "Você precisa de pelo menos um ponto em cada uma destas antes de poder alocar esta skill.",
    unlocksTitle: "Destrava",
    unlocksBody: "Skills que exigem esta.",
    synergiesTitle: "Sinergias recebidas",
    synergiesBody:
      "Skills que aumentam os números desta quando você coloca pontos nelas. Só pontos fixos — ao contrário dos valores acima, equipamento que soma níveis de skill não alimenta uma sinergia, então uma linha que diz \"por nível\" quer dizer por ponto fixo.",
    synergiesNote:
      "A identidade das sinergias é extraída das próprias fórmulas de skill do jogo, não de consenso da comunidade. As magnitudes, quando informadas, são verificadas à parte.",
    feedsTitle: "Skills que esta alimenta",
    feedsBody: "Skills cujos números esta aumenta. As mesmas arestas, lidas na outra direção.",
    missileSynergiesTitle: "Sinergias recebidas pelos projéteis dela",
    missileSynergiesBody:
      "Pontos duros nestas aumentam parte do que esta skill faz, e não tudo — o jogo guarda o bônus num projétil que a skill cria, não na skill.",
    missileSynergiesNote:
      "Um componente, não a skill inteira. O Fist of the Heavens causa dano de raio e lança bolts mágicos; o Holy Bolt aumenta os bolts e mais nada.",
    missileFeedsTitle: "Projéteis que esta alimenta",
    missileFeedsBody:
      "Skills cujos projéteis esta aumenta. As mesmas arestas, lidas na outra direção.",
    missileSynergyLine: "+{magnitude}% de {element} por ponto duro",
    synergyKindDamage: "dano",
    synergyKindArmor: "defesa",
    synergyKindHealing: "cura",
    synergyKindDuration: "duração",
    synergyKindShots: "tiros disparados",
    synergyKindFindChance: "chance de achar",
    synergyKindExplodeChance: "chance de explodir",
    synergyKindSteal: "roubo de vida e mana",
    synergyKindFreeze: "tempo de congelamento",
    synergyKindHp: "vida",
    synergyKindAbsorb: "absorção de dano",
    synergyKindPhysical: "dano físico",
    synergyKindFire: "dano de fogo",
    synergyKindAttackRating: "chance de acerto",
    synergyKindJoin: "e",
    effectsTitle: "Valores por nível",
    effectsBody: "Só pontos fixos. Equipamento que soma níveis de skill também aumenta estes valores.",
    effectChance: "Chance",
    effectAttackRating: "Attack rating",
    effectArrows: "Flechas disparadas",
    effectShots: "Tiros por ataque",
    effectBolts: "Raios liberados",
    effectJumps: "Alvos atingidos",
    effectConverted: "Dano convertido",
    effectRadius: "Raio",
    effectRadiusHalfSquares: "Raio (meios quadrados)",
    effectDuration: "Duração",
    effectFreezeLength: "Duração do congelamento (Normal)",
    effectMana: "Mana",
    effectMissiles: "Projéteis",
    effectAbsorbed: "Dano absorvido",
    effectMinions: "Lacaios simultâneos",
    effectMinionLife: "Vida por lacaio",
    effectMinionDamage: "Dano por lacaio",
    effectDamageDealt: "Dano causado",
    effectDamageReturned: "Dano devolvido",
    effectResistReduction: "Resistência reduzida",
    effectWallLife: "Bônus de vida da parede",
    effectWallSegments: "Segmentos da parede",
    effectSlow: "Lentidão no alvo",
    effectGolemLife: "Vida do golem",
    effectGolemAttackRating: "Chance de acerto do golem",
    effectGolemSpeed: "Velocidade do golem",
    effectLifeSteal: "Vida roubada",
    effectMinionResist: "Resistência dos lacaios",
    effectFireAbsorb: "Fogo absorvido",
    effectAuraLevel: "Nível da aura",
    colPhysical: "Físico",
    effectAttackSpeed: "Velocidade de ataque",
    effectLifeBonus: "Bônus de vida",
    effectDefenseBonus: "Bônus de defesa",
    effectMoveSpeed: "Velocidade de movimento",
    effectCharges: "Cargas máximas",
    effectStun: "Atordoamento",
    effectHits: "Golpes por ataque",
    effectManaSteal: "Mana roubada",
    effectPartyLife: "Bônus de vida do grupo",
    effectSummonHits: "Golpes antes de partir",
    effectMinionDamageBonus: "Bônus de dano dos servos",
    effectRangeFrom: "{value}% no nível 1",
    effectRangeTo: "até {value}%",
    effectRangeNote:
      "O jogo informa onde isto começa e o teto para o qual sobe, mas não a curva entre os dois — ela fica no motor do jogo, e não nos arquivos de dados que este site lê, então nenhuma tabela por nível é publicada para isso.",
    progressionTitle: "Dano por nível",
    progressionBody: "Dano base antes das sinergias, antes da Mastery e antes de qualquer +skills. Somente pontos duros.",
    colLevel: "Nível",
    colDamage: "Dano",
    buildsTitle: "Builds que usam esta skill",
    buildsBody: "Quanto cada build documentada investe.",
    buildsNone: "Nenhuma build documentada aloca esta skill.",
    noProgressionWeapon:
      "Esta skill causa dano sim — ele vem da sua arma, modificado pelo bônus de dano da própria skill, então não há tabela intrínseca à skill para publicar. Attack rating, o dano da arma e os seus outros modificadores é que decidem o número.",
    noProgressionShield:
      "O Smite causa dano sim. A base dele é o Smite Damage impresso no seu escudo, e não o dano da arma, e o Smite não usa Attack Rating: ele não tem como errar. Os modificadores de dano aplicáveis e o bônus da própria skill elevam o resultado a partir daí. Nada disso é dano elemental da própria skill, então não existe tabela elemental por nível para ela nos dados que este site extrai — o que a skill faz está descrito em {mechanics}.",
    noProgressionProportional:
      "Esta skill causa dano como uma proporção da vida atual do alvo, e não como um intervalo mínimo–máximo, então uma tabela por nível não diria nada. Os limites por dificuldade e a questão da resistência estão em {mechanics}.",
    noProgressionNone: "Esta skill não tem tabela de dano direto. Seus efeitos estão descritos em {mechanics}.",
    damageWithWeapon:
      "A tabela é o dano elemental da própria skill. O dano da sua arma também acontece, no mesmo golpe.",
    damageConverted:
      "A tabela é o dano elemental da própria skill. O dano da arma também é carregado, mas uma parte dele é convertida neste elemento em vez de somada a ele.",
    damageElementOnly:
      "A tabela é o dano próprio desta skill. Ao contrário dos outros ataques da árvore dela, não contribui com nada do dano físico base da sua arma — o golpe ainda rola contra o attack rating, e os projéteis secundários são criados à parte.",
    noProgressionConverted:
      "O dano desta skill é o da sua arma. Parte dele acontece como o elemento da skill em vez de dano físico, e essa parcela cresce com o nível — é o valor convertido na tabela acima. A skill não tem alcance elemental próprio para publicar.",
    noProgressionKick:
      "O dano desta skill vem das suas **botas**, não da sua arma. As garras nas suas mãos somam os níveis de skill delas e nada mais, e é por isso que uma build de chute procura botas e as melhora em vez de caçar uma arma. Não há faixa para publicar aqui: a skill multiplica o chute, e o chute é das botas. O Crushing Blow é sorteado uma vez por chute, que é por que essas builds matam bosses muito acima do dano listado.",
    damageOverTime:
      "O veneno acontece ao longo do tempo, e não no impacto. A tabela dá o total durante a duração ao lado.",
    noProgressionCorpse:
      "Esta skill causa dano de verdade e nada dele pertence a ela. É uma fatia da vida base do **tipo** de monstro explodido — recalculada a partir da tabela do próprio jogo no nível e na dificuldade daquele monstro, e não lida do cadáver — então não há faixa por nível para publicar. Os pontos compram raio. O que aumenta o dano é o nível do seu personagem, e o que morreu. Veja {mechanics}.",
    damageOverTimeFixed:
      "A duração não muda com o nível da skill — só o dano concentrado nela cresce.",
    seconds: "{seconds}s",
    colDuration: "Duração",
    backToTree: "← Todas as skills de {class}",
  },
  breakpoints: {
    title: "Breakpoints",
    description:
      "As animações de Diablo II rodam a 25 frames por segundo, e atributos de velocidade não fazem absolutamente nada até cruzar um limiar que remove um frame inteiro.",
    includesWarlock: "Inclui as tabelas do Warlock",
    warningTitle: "104% de Faster Cast Rate vale exatamente o mesmo que 63%",
    warningBodyA:
      "Atributos de velocidade não são contínuos. Uma Sorceress com 63% de Faster Cast Rate conjura em 9 frames. Com 104% ela ainda conjura em 9 frames. Com 105% ela conjura em 8. Cada ponto entre 63 e 104 faz {nothing}.",
    warningNothing: "nada",
    warningBodyB:
      "É por isso que o planejamento de equipamento trabalha de trás para frente a partir de um breakpoint, em vez de maximizar um atributo. Depois de bater a meta, Faster Cast Rate adicional é orçamento desperdiçado que poderia ter sido resistência ou vida.",
    multipleTablesTitle: "Algumas classes têm mais de uma tabela",
    multipleTablesBody:
      "Lightning e Chain Lightning da Sorceress usam uma animação de conjuração mais lenta, com limiares completamente diferentes — todo o resto que ela conjura, incluindo Teleport, usa a tabela padrão. O Druid tem tabelas separadas para forma humana, Werewolf e Werebear. Planejar equipamento pela tabela errada é um erro comum e caro.",
    fcrTitle: "Faster Cast Rate",
    fcrDescription:
      "Quão rápido você conjura — e, para a Sorceress, quão rápido você usa Teleport. O atributo mais importante da maioria dos casters.",
    fhrTitle: "Faster Hit Recovery",
    fhrDescription:
      "Quanto tempo você fica travado na animação de dano depois de levar um golpe. Ficar preso em stun mata mais personagens que dano bruto.",
    fbrTitle: "Faster Block Rate",
    fbrDescription:
      "Quão rápido você se recupera de um bloqueio bem-sucedido. Só importa se você realmente montar para bloquear.",
    colRequired: "Necessário",
    statNeeded: "{stat} necessário",
    tableCaption:
      "Frames por animação no topo; a porcentagem necessária para alcançar cada um abaixo.",
    iasTitle: "Increased Attack Speed",
    iasCalloutTitle: "Deliberadamente não tabulado aqui",
    iasBodyA:
      "Increased Attack Speed é genuinamente mais complicado que os outros três. Os frames que você obtém dependem da {weaponSpeed}, da {skill} que você usa e, em alguns casos, da {class} — uma única tabela não consegue expressar isso, e todo site que publica uma está simplificando a ponto de ficar errado na maioria dos casos.",
    iasWeaponSpeed: "velocidade base da própria arma",
    iasSkill: "skill de ataque específica",
    iasClass: "classe",
    iasBodyB:
      "Em vez de publicar uma tabela que enganaria, esta página vai ganhar cobertura por arma quando os dados subjacentes forem verificados. Até lá, use uma calculadora de velocidade de ataque que receba a sua arma e a sua skill como entrada.",
  },

  mercenaries: {
    title: "Mercenários",
    description:
      "Um mercenário bem equipado vale mais que a maioria dos seus próprios slots. Um mal equipado morre o tempo todo e não contribui com nada.",
    hireWarningTitle: "A dificuldade em que você contrata é permanente",
    hireWarningBodyA:
      "A aura ou skill de um mercenário é definida pela {strong}, e nunca muda. Eles sobem de nível junto com você de qualquer forma, então contratar no Hell não compra nada além de um preço mais alto.",
    hireWarningStrong: "dificuldade em que você o contratou",
    hireWarningBodyB:
      "{strong} É lá que a seleção de auras é melhor para a maioria das builds, e o mercenário alcança o seu nível em um ou dois atos.",
    hireWarningStrongB: "Contrate no Nightmare.",
    whichOne: "Qual deles?",
    whichOneDescription:
      "Para a esmagadora maioria das builds a resposta é o Act 2 Desert Mercenary, e não é nem perto.",
    colMercenary: "Mercenário",
    colGivesYou: "Dá a você",
    colUses: "Usa",
    colVerdict: "Veredito",
    twoItemsTitle: "Os dois itens que mais importam",
    whenToHire: "Quando contratar",
    aurasAbilities: "Auras e habilidades",
    colAbility: "Habilidade",
    colDifficulty: "Dificuldade",
    colEffect: "Efeito",
    gear: "Equipamento",
    keepingAlive: "Mantendo ele vivo",
    bestFor: "Indicado para:",
    anyDifficulty: "qualquer",
    actBadge: "Ato {act}",
    tierBudget: "econômico",
    tierMid: "intermediário",
    tierEndgame: "fim de jogo",
  },

  mechanics: {
    indexTitle: "Mecânicas do jogo",
    indexDescription:
      "Os sistemas por trás dos guias. Onde as fontes discordam ou um valor não foi confirmado, estas páginas dizem isso em vez de escolher um número e soar certas.",
    articlesCount: "{count} artigos",
    formulasTitle: "Fórmulas, não achismo",
    formulasBody:
      "Quando uma mecânica tem uma fórmula que muda como você se equipa, ela está escrita. A curva de retornos decrescentes do Magic Find é o exemplo mais claro — saber que uniques usam fator 250 explica na hora por que empilhar além de 300% é um mau negócio.",
    alsoReference: "Também consulte",
    shortVersion: "A versão curta",
    related: "Relacionado",
    categoryLoot: "Loot e drops",
    categoryCombat: "Combate",
    categoryDefense: "Defesa",
    categoryCharacter: "Personagem",
    categoryEndgame: "Fim de jogo",
    categoryItems: "Itens",
    referenceRunes: "Runas e receitas do cubo",
    referenceSources: "Como pesquisamos isso",
  },

  sources: {
    title: "Fontes e pesquisa",
    description:
      "Precisão importa mais que cobertura aqui. Esta página explica como o conteúdo é verificado e registra o que ainda não foi confirmado.",
    verifiedOn: "Verificado em {date}",
    versionTitle: "A versão que este site documenta",
    colFact: "Fato",
    colValue: "Valor",
    factPatch: "Versão",
    factSeason: "Temporada da ladder",
    factSeasonStart: "Início da temporada",
    factExpansion: "Expansão mais recente",
    factClasses: "Classes jogáveis",
    factClassesValue: "8 — incluindo o Warlock",
    patchValue: "{patch} (build de cliente {build})",
    seasonValue: "Temporada {season}",
    hierarchyTitle: "Hierarquia de fontes",
    hierarchyLede:
      "Nem toda fonte tem o mesmo peso. O conteúdo é verificado contra a camada mais alta disponível para a afirmação em questão.",
    colTier: "Camada",
    colSource: "Fonte",
    colUsedFor: "Usada para",
    tier1Source: "Os próprios arquivos de dados do jogo",
    tier1Used:
      "Níveis de área, níveis de monstro, estatísticas de itens base. Extraídos do levels.txt e tabelas relacionadas — isto é o jogo em si, não uma descrição dele.",
    tier2Source: "Material oficial da Blizzard",
    tier2Used:
      "Notas de patch, anúncios de expansão, The Arreat Summit. Autoridade sobre o que mudou e quando, embora o Arreat Summit seja anterior ao D2R e precise de checagem cruzada para qualquer coisa alterada depois.",
    tier3Source: "Bases de dados estruturadas da comunidade",
    tier3Used:
      "D2Runewizard e equivalentes, para estatísticas de itens e tabelas de breakpoint. Cruzadas entre si e contra a camada 1 quando possível.",
    tier4Source: "Guias de build atuais",
    tier4Used:
      "Maxroll, Icy Veins, DiabloBytes e similares, para consenso de build e estilo de jogo. Usados para julgamento, nunca como fonte única de um número.",
    mistakesTitle: "Dois erros que este site foi feito para evitar",
    mistake1Title: "Misturar dados de Classic e Lord of Destruction",
    mistake1Body:
      "O levels.txt do jogo tem dois conjuntos paralelos de colunas de nível de monstro — um para o Diablo II Classic, outro para a expansão Lord of Destruction. O D2R usa as colunas de Expansion. Ler as erradas dá ao Ancient Tunnels nível de área 67 no Hell em vez de 85, o que inverte completamente a conclusão sobre se a área vale a pena. Todo nível de área aqui vem das colunas de Expansion.",
    mistake2Title: "Presumir que Diablo II ainda tem sete classes",
    mistake2Body:
      "O Warlock chegou com o Reign of the Warlock em fevereiro de 2026, a primeira classe nova em vinte e cinco anos. Qualquer fonte que liste sete classes é anterior à expansão — o que também significa que é anterior à reformulação das Terror Zones, aos Colossal Ancients, aos Grimoires, ao filtro de loot e às novas runewords. A contagem de classes é um bom teste de atualidade para qualquer guia de D2 que você ler.",
    disagreementsTitle: "Como discordâncias são tratadas",
    disagreementsCalloutTitle: "Documentadas, não resolvidas em silêncio",
    disagreementsLede:
      "Quando fontes confiáveis se contradizem, a página diz isso e explica o conflito, em vez de escolher uma e soar segura. Dois exemplos atuais:",
    disagreement1:
      "{strong} O Diablo Wiki afirma que a resistência a raio do inimigo reduz o efeito; alguns guias de build afirmam que ele ignora resistência por completo. A entrada de Static Field registra as duas posições em vez de afirmar uma.",
    disagreement1Strong: "Static Field e resistência a raio.",
    disagreement2:
      "{strong} O próprio anúncio da Blizzard se contradiz, dizendo tanto “todas as outras cinco estátuas” quanto “todas as cinco estátuas”. A {link} cita os dois trechos e evita afirmar um número.",
    disagreement2Strong: "A contagem de estátuas dos Colossal Ancients.",
    disagreement2Link: "página de Terror Zones",
    confidenceTitle: "Rótulos de confiança",
    confidenceLede:
      "O conteúdo carrega um nível de confiança. Verificado é o padrão e não é exibido — mostrar um selo em toda afirmação verificada só treinaria o leitor a ignorá-lo. Qualquer coisa abaixo de verificado é rotulada.",
    colLevel: "Nível",
    colMeaning: "Significado",
    colShownInUi: "Aparece na interface",
    confVerified: "Verificado",
    confVerifiedMeaning:
      "Checado contra duas ou mais fontes confiáveis, ou trivialmente estabelecido",
    confVerifiedShown: "Não — este é o padrão",
    confSingle: "Fonte única",
    confSingleMeaning: "Uma fonte confiável, sem contradição em outro lugar",
    confCommunity: "Consenso da comunidade",
    confCommunityMeaning: "Amplamente aceito entre jogadores, sem confirmação oficial",
    confUnverified: "Não verificado",
    confUnverifiedMeaning: "Acreditamos estar certo, mas não foi confirmado",
    shownYes: "Sim",
    shownYesProminently: "Sim, com destaque",
    gapsTitle: "Lacunas conhecidas",
    gapsLede:
      "Registradas para que nada seja escrito sobre terreno não verificado. São acompanhadas em {file} no repositório.",
    gap1: "Tabelas de skills do Warlock — nomes, níveis de desbloqueio, sinergias e valores numéricos.",
    gap2: "As duas jewels únicas do Madawc nos Colossal Ancients.",
    gap3: "A contagem exata de estátuas na receita dos Colossal Ancients.",
    gap4: "O que os Latent Sunder Charms fazem, e como diferem dos Sunder Charms originais.",
    gap5: "Para que servem os Worldstone Shards.",
    gap6: "Itens de set: existem 140 deles em 35 sets no jogo, e nenhum está catalogado aqui.",
    gap7: "A lista completa dos grupos de rotação das Terror Zones.",
    gap8: "Tabelas de Increased Attack Speed, que dependem da velocidade base da arma e da skill específica.",
    originalTitle: "Sobre texto original",
    originalBody:
      "As fontes são pesquisadas, reconciliadas e então escritas do zero. Nada aqui é copiado de outro guia. Quando um número específico vem de um lugar específico — um modificador de runa do The Arreat Summit, um nível de área dos arquivos do jogo — a página nomeia a fonte para que o leitor possa conferir.",
    languageTitle: "Sobre idioma",
    languageBody:
      "Este site é escrito em inglês e traduzido para português do Brasil. Nomes de itens, skills, runewords e áreas são mantidos em inglês nas duas versões, porque é o que a comunidade, os canais de troca e todas as bases de dados principais usam — e porque as strings oficiais em português dentro do jogo não foram verificadas contra fonte primária. Inventar traduções para elas quebraria a própria regra de precisão do projeto.",
  },

  notFound: {
    title: "Página não encontrada",
    description: "Esta página pode ter mudado de endereço ou não existir mais.",
    browseBuilds: "Ver builds",
    returnHome: "Voltar ao início",
  },

  common: {
    strengths: "Pontos fortes",
    weaknesses: "Pontos fracos",
    outOfFive: "{value} de 5",
    notDocumented: "Ainda não documentado",
    or: "ou",
  },

  ratings: {
    poor: "Fraco",
    weak: "Limitado",
    average: "Médio",
    good: "Bom",
    excellent: "Excelente",
  },

  tiers: {
    starterLabel: "Início",
    starterShort: "Início",
    starterQuestion: "Acabei de criar o personagem. O que eu visto?",
    starterContext: "Dificuldade Normal, níveis 1-30. Tudo aqui é grátis ou quase.",
    nightmareLabel: "Nightmare",
    nightmareShort: "NM",
    nightmareQuestion: "Estou no Nightmare e está ficando difícil.",
    nightmareContext: "Níveis 30-60. Resistência começa a importar mais que dano.",
    earlyHellLabel: "Início do Hell",
    earlyHellShort: "Hell",
    earlyHellQuestion: "Cheguei no Hell e estou morrendo. E agora?",
    earlyHellContext: "Níveis 60-75. A transição mais difícil do jogo.",
    budgetLabel: "Econômico",
    budgetShort: "Econômico",
    budgetQuestion: "Consigo farmar o Hell. Qual é o próximo upgrade de verdade?",
    budgetContext: "Níveis 75-85. Um conjunto completo, self-found, que funciona em tudo.",
    optimizedLabel: "Otimizado",
    optimizedShort: "Otimizado",
    optimizedQuestion: "Tenho equipamento bom. Como deixo ele ótimo?",
    optimizedContext: "Nível 85+. Itens fortes, quase todos obteníveis solo com paciência.",
    bisLabel: "Best in Slot",
    bisShort: "BiS",
    bisQuestion: "Como é o personagem finalizado?",
    bisContext: "O teto. Espere troca, rolls perfeitos e runas altas.",
  },

  difficulty: {
    normal: "Normal",
    nightmare: "Nightmare",
    hell: "Hell",
  },

  skillKinds: {
    attack: "Ataque",
    spell: "Magia",
    passive: "Passiva",
    aura: "Aura",
    summon: "Invocação",
    curse: "Maldição",
    buff: "Buff",
    shapeshift: "Transformação",
  },
  elements: {
    physical: "Físico",
    magic: "Mágico",
    fire: "Fogo",
    cold: "Frio",
    lightning: "Raio",
    poison: "Veneno",
  },

  budget: {
    low: "Orçamento baixo",
    medium: "Orçamento médio",
    high: "Orçamento alto",
    extreme: "Orçamento extremo",
  },

  playDifficulty: {
    beginner: "Amigável para iniciantes",
    moderate: "Moderada",
    advanced: "Avançada",
    expert: "Especialista",
  },

  release: {
    classic: "Diablo II",
    lod: "Lord of Destruction",
    d2r: "Resurrected",
    reignOfTheWarlock: "Reign of the Warlock",
  },

  confidence: {
    single: "Fonte única",
    community: "Consenso da comunidade",
    unverified: "Não verificado",
  },

  gearSlots: {
    helm: "Elmo",
    amulet: "Amuleto",
    weapon: "Arma",
    offhand: "Mão secundária",
    body: "Armadura",
    gloves: "Luvas",
    belt: "Cinto",
    boots: "Botas",
    ring1: "Anel",
    ring2: "Anel",
  },

  availability: {
    title: "Onde dá para conseguir, e onde só dá para usar",
    description:
      "Fabricar uma coisa, conseguir uma e usá-la são três permissões diferentes, e para uma runeword do jogo as três hoje divergem. Esta tabela responde às três em todo modo, em vez de escolher um lado — porque um modo onde o item funciona não é automaticamente um modo onde dá para obter um.",
    modeLadder: "Ladder",
    modeNonLadderOnline: "Non-Ladder, online",
    modeOffline: "Offline",
    statusCraftable: "Pode ser fabricada",
    statusUsable: "Pode ser usada, não fabricada",
    statusUnobtainable: "Funcionaria, mas não há como obter",
    statusDisabled: "Indisponível",
    statusUnknown: "Não estabelecido",
    sourceLabel: "Lido de",
    checkedLabel: "Verificado em",
    baselineLabel: "Versão base",
    historyLabel: "O que já foi",
    consequenceLabel: "O que isso significa para esta build",
    gateTitle: "Antes de começar: {item}",
  },

  actionKinds: {
    skill: "Skill",
    stat: "Atributos",
    gear: "Equipamento",
    runeword: "Runeword",
    quest: "Quest",
    shop: "Compra",
    gamble: "Aposta",
    mercenary: "Mercenário",
    respec: "Respec",
    farm: "Farm",
    transition: "Dificuldade",
    warning: "Atenção",
    tip: "Dica",
  },
};
