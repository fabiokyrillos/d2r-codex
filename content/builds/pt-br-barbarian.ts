import type { BuildCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR das builds de Barbarian.
 *
 * Nomes de skill, de item e de runeword permanecem em inglês (dados
 * invariantes, ADR 0003). As listas de `strengths`, `weaknesses`, `flexPoints`
 * e `statPlan.notes` são posicionais; `skillNotes`, `farmingWhy`,
 * `breakpointWhy` e as picks de equipamento são endereçadas por chave estável,
 * nunca por posição.
 */
export const barbarianBuildsPtBr: Overlay<BuildCopy> = {
  "frenzy-barbarian": {
    summary:
      "Duas armas, e cada acerto deixa o próximo mais rápido. O personagem corpo a corpo mais veloz do jogo, e o Barbarian que mata os Ubers.",
    playstyle:
      "Você começa devagar e termina rápido, e a luta acaba antes de você notar a mudança. Cada Frenzy que acerta empilha velocidade de corrida em direção a +200% e velocidade de ataque em direção a +50%, e a pilha cai se você parar de acertar coisas — então o ritmo é nunca parar. Você abre no lixo mais próximo em vez de na coisa perigosa, monta três ou quatro pilhas nele, e chega no alvo de verdade já em velocidade máxima. Entre grupos você mantém a pilha viva em qualquer coisa que se mexa. O Berserk fica no outro botão para imunes a físico, e diferente do Whirlwind Barbarian você não precisa parar e reposicionar para usá-lo — a velocidade de corrida do Frenzy é o que te leva pelo mapa, e é mais rápida que andar com uma Enigma.",
    strengths: [
      "O ataque mais rápido do jogo depois que a pilha sobe, e a velocidade de corrida vem junto",
      "Não pode ser interrompido, então a pilha não quebra quando algo te acerta",
      "Duas sinergias de dano a 8% por ponto cada, onde a maioria dos ataques de Barbarian tem uma ou nenhuma",
      "A build de Uber da classe: Crushing Blow de vários slots num ataque que encaixa o tempo todo",
      "O +5 em Frenzy da Fury é a única stat de item restrita a classe neste site que cai justamente na build que ela nomeia",
    ],
    weaknesses: [
      "**Duas armas são obrigatórias** — sem escudo, sem bloqueio, e sem linha de Faster Block Rate nesta página",
      "A pilha decai, então a primeira luta depois de um portal é sempre a lenta",
      "As duas mãos precisam de velocidade de ataque e dano, o que é dois de tudo para achar em vez de um",
      "Dano físico contra um imune a físico, e a resposta custa os mesmos dezoito pontos da segunda sinergia",
      "Attack rating em duas armas ao mesmo tempo, contra os valores de defesa do Hell",
    ],
    flexPoints: [
      "**Não há nenhum.** O núcleo é 92 e qualquer um dos pacotes é exatamente 18, então uma tela de nível 99 mostra 110 gastos e nada sem destino.",
      "Abaixo do 99 a ordem é Frenzy, Double Swing, a mastery, Battle Orders, depois o pacote. O ponto único de Berserk do núcleo deve vir cedo de qualquer forma — é a diferença entre abandonar um grupo imune e matá-lo devagar.",
      "Se você achar uma Fury antes de terminar a mastery, reveja qual mastery quer: o +5 em Frenzy dela vale seja qual for a base, mas a mastery só vale para uma família de arma e esta build segura duas.",
    ],
    skillPackages: {
      "the-last-eighteen": {
        name: "Os últimos dezoito pontos",
        intro:
          "O núcleo é 92 e fecha todos os pré-requisitos. O que sobra é exatamente dezoito, e as duas coisas em que vale gastar custam precisamente o mesmo: a segunda sinergia de dano do Frenzy, ou a conversão que permite a ele ferir um imune a físico. Esta é a decisão real da página e nenhum equipamento a resolve.",
        packages: {
          taunt: {
            name: "Taunt — a segunda sinergia",
            when: "Você tem um Sunder Charm físico, um mercenário com Infinity, ou simplesmente não roda áreas onde imunes a físico aparecem.",
            tradeoff: "O Berserk fica em um ponto, o que significa que um imune a físico é algo de que você se afasta em vez de algo que você mata devagar.",
            skillNotes: {
              taunt: "+8% de dano do Frenzy por ponto duro — +144% com dezoito, em cima dos +90% e dos +160% que a Double Swing já dá. Ela também puxa um monstro isolado de um grupo e corta o attack rating e o dano dele em 5% e 2% por nível, o que é um botão de verdade num personagem sem controle de grupo.",
            },
            rotationNote: "Inalterada, exceto que agora vale apertar o Taunt: puxe a coisa perigosa para fora do grupo, monte a pilha no lixo em volta, e então mate.",
            contentNote: "Ubers, os níveis da Worldstone, Terror Zones — qualquer lugar onde a densidade é alta e as imunidades são resolvidas por outra coisa que não a sua árvore de skills.",
            remainderNote: "Não sobra nada. 92 + 18 = 110.",
          },
          berserk: {
            name: "Berserk — a resposta para imunidade",
            when: "Você joga sozinho, não tem Sunder Charm, e prefere nunca encontrar um monstro que não consegue ferir.",
            tradeoff: "O Taunt fica em nada, então o Frenzy roda com uma sinergia em vez de duas e abre mão de +144% de dano contra tudo que nunca foi imune.",
            skillNotes: {
              berserk: "Um segundo ataque cujo dano é entregue inteiramente como mágico, então um imune a físico recebe tudo — e, separadamente, **19% do dano do próprio Frenzy também vira mágico**, porque o Frenzy lê o nível de pontos duros do Berserk diretamente. Você está comprando um ataque e uma conversão, que é por que isso compete com uma sinergia de 144% de dano. Sua defesa é zero enquanto o Berserk golpeia, por cerca de 1,3 segundo neste nível.",
            },
            rotationNote: "Frenzy em tudo, Berserk mantido nos imunes. Mantenha a pilha do Frenzy viva em outra coisa antes — o Berserk não a constrói e você não quer chegar no grupo imune frio.",
            contentNote: "The Pit, Chaos Sanctuary, Ancient Tunnels, e qualquer run solo de Hell sem um Sunder Charm no inventário.",
            remainderNote: "Não sobra nada. 92 + 18 = 110.",
          },
        },
      },
    },
    statPlan: {
      strength: "O suficiente para as duas armas e para a armadura de corpo, e isso são de fato dois requisitos e não um — uma Grief Phase Blade pede 25 e uma Fury numa Berserker Axe pede 138.",
      dexterity: "O suficiente para as duas armas. **Nada além disso**: esta build não consegue segurar escudo, então nunca bloqueia, e cada ponto além do requisito é um ponto de vida que você não pegou.",
      vitality: "Todo o resto. Quatro de vida por ponto, e o Battle Orders quase dobra isso.",
      energy: "Nenhum. O Frenzy custa 1,5 de mana e o roubo de vida cobre o resto.",
      notes: [
        "**Duas armas significam dois conjuntos de requisitos**, e a mão secundária é a que as pessoas esquecem. Calcule a mais pesada das duas antes de gastar qualquer coisa.",
        "Não existe bloqueio nesta build em nenhum tier, então Dexterity é uma stat de requisito puro. Essa é a maior diferença entre este plano de atributos e o do Whirlwind.",
        "Roubo de vida importa mais aqui que em qualquer outra página de Barbarian, porque a taxa de ataque é o que o faz funcionar — 6% numa Fury é um número diferente a 4 ataques por segundo e a 2.",
      ],
    },
    breakpointWhy: {
      "fhr-48": "Cinco frames na tabela que o Barbarian divide com o Paladin e a Assassin. O próprio Frenzy não pode ser interrompido, mas o momento entre dois Frenzy pode, e perder a pilha é pior que perder o acerto.",
      "fhr-86": "Quatro frames. Alcançável com os 30% do Arreat's e os 10% do Verdungo's, e vale a pena numa build que fica parada.",
      "fcr-63": "Só com uma Enigma. Vale notar que a velocidade de corrida do próprio Frenzy torna o Teleport menos essencial aqui do que em qualquer outra build corpo a corpo — este é o único Barbarian que já é rápido.",
    },
    breakpointNotes:
      "**Sem linha de velocidade de ataque, e sem linha de bloqueio.** Sem velocidade de ataque porque os frames dependem da velocidade base da arma e da skill, então nenhuma porcentagem única está correta para uma classe — e nesta build é pior que o normal, porque o patch 2.4.3 estabeleceu que ao empunhar duas armas o frame de ataque de cada uma é a **média, arredondada para cima**. Duas armas idênticas portanto se comportam de forma diferente de uma arma rápida com uma lenta, e a lenta arrasta. Persiga velocidade de ataque continuamente e prefira pares iguais. Sem linha de bloqueio porque o Frenzy exige duas armas: não existe escudo em nenhum tier desta build, então Faster Block Rate não é uma stat que ela possa ter.",
    skillNotes: {
      frenzy:
        "+90% de dano com um ponto e mais 5% por nível, antes de qualquer sinergia. Cada acerto empilha velocidade de corrida de 20% em direção a 200% e velocidade de ataque de 0% em direção a 50%, as duas em curva decrescente, e o buff dura 6 segundos. **Ele exige duas armas** — a linha carrega um requisito de item para a mão secundária e a descrição do próprio jogo diz isso — e gira as duas. Não pode ser interrompido, e custa 1,5 de mana.",
      "double-swing":
        "+8% de dano do Frenzy por ponto duro, e ela é a corrente de pré-requisito também, então estes vinte pontos são gastos duas vezes. Apertada sozinha ela não tem dano próprio nenhum — o bônus dela é o nível do Bash vezes dez — mas como sinergia do Frenzy é a primeira coisa que você maximiza depois do Frenzy.",
      "blade-mastery":
        "+28% de dano e 5% por nível, +40% de attack rating e 8% por nível, crítico em direção a 35%. **Troque pela mastery que as suas armas de fato são** — e nesta build isso significa *as duas*, então misturar uma espada e um machado deixa uma mão sem mastery. Duas Griefs em Phase Blades mantêm isso simples.",
      "battle-orders":
        "+92% de vida máxima com vinte pontos duros. Não é sinergia do Frenzy — está aqui porque depois de Frenzy, Double Swing e a mastery não há mais nada que valha vinte pontos, e vida é o que torna as runs de Uber sobrevivíveis.",
      bash: "Pré-requisito da Double Swing, e o topo da corrente por onde esta build evolui.",
      "double-throw": "O único pré-requisito do Frenzy. Um Barbarian de Frenzy atravessa a árvore de arremesso sem nunca arremessar nada.",
      stun: "Pré-requisito do Concentrate, que é do Berserk.",
      concentrate: "Pré-requisito do Berserk, e o ataque ininterrompível que dobra sua defesa quando a defesa zero do Berserk não cabe.",
      berserk:
        "Um ponto no núcleo e dezenove no pacote dele. **Cada ponto duro também converte 1% do dano do próprio Frenzy em mágico** — a linha do Frenzy lê o nível do Berserk diretamente, sob uma coluna que o jogo não rotula como sinergia, então a página da skill não desenha aresta para isso. Um ponto é um por cento e um botão de emergência; dezenove é uma resposta de verdade para imunidade física.",
      howl: "Pré-requisito do Shout, e sinergia do Berserk a 10% por ponto se você algum dia o subir mais.",
      shout: "Defesa para o grupo, e 5 segundos por ponto duro na duração do Battle Orders.",
      "battle-command": "+1 em todas as skills, fixo em todo nível. Conjure primeiro — a ordem é Battle Command, Battle Orders, Shout, depois a cura.",
      "increased-stamina":
        "Pré-requisito do Increased Speed, e **ela estende o buff do Frenzy em 10 frames por ponto duro** — seis segundos com um ponto, passando de catorze com vinte. A linha escala isso com um número puro em vez de um parâmetro de sinergia, então nenhuma aresta é desenhada. Um ponto está certo de qualquer forma: você renova a pilha acertando coisas, não esperando.",
      "increased-speed": "Velocidade de corrida sempre ativa por baixo da do próprio Frenzy. A curva é íngreme no começo, então um ponto é quase tudo que ela dá.",
      "iron-skin": "Pré-requisito do Natural Resistance.",
      "natural-resistance": "As quatro resistências, somadas antes do teto, sem buff para manter.",
    },
    immunityPlan:
      "**Imunidade física, e a decisão central da página é o que você gasta nela.** O pacote de Berserk converte o dano do Frenzy em mágico a 1% por ponto duro e ainda adiciona um segundo ataque que é inteiramente mágico — dezenove pontos compram os dois. A alternativa é responder à imunidade com um item e gastar os dezoito pontos no Taunt: uma Bone Break torna imunes a físico meramente resistentes, e um mercenário com Infinity faz o mesmo para o grupo. O Atma's Scarab não é uma terceira resposta: Amplify Damage não quebra uma imunidade sozinho, só reduz uma resistência física que já esteja abaixo de 100%. Nesta taxa de ataque o uptime dele é quase permanente, o que o torna excelente contra tudo que nunca foi imune e irrelevante para a única coisa de que esta seção trata. Imunidade a mágico é rara, e o Concentrate fica no núcleo com um ponto como a resposta física para ela.",
    mercenaryNotes:
      "**Ato 2, Nightmare, Might**, pelo mesmo motivo de todo Barbarian físico: a aura dele multiplica o dano que você já causa. A Insight encerra a questão da mana cedo e a aura de Meditation dela vale mais que qualquer arma que ele possa segurar até a Infinity, cuja Conviction corta defesa inimiga além de resistência — e defesa é o que uma build de duas armas mais enfrenta. A The Reaper's Toll é a outra opção real e é forte aqui: Decrepify ao golpear é −50% de resistência física inimiga e uma lentidão, e nos Ubers um boss lento é um boss que te acerta menos. Mantenha-o vivo com uma Fortitude e um Vampire Gaze; **não pegue Defiance**, porque uma aura de defesa não faz nada por um personagem cujo problema é acertar com duas armas ao mesmo tempo.",
    farmingWhy: {
      "uber-tristram-hell": "Esta é a manchete da build. Crushing Blow das botas e do elmo, Open Wounds da Fury, Life Tap da Dracul's, e uma taxa de ataque que aplica os três o tempo todo. O Barbarian que mata os três bosses é este.",
      "worldstone-keep-hell": "Área de nível 85 e densa, e a pilha nunca tem tempo de cair. A velocidade de corrida do Frenzy torna o trajeto entre grupos rápido sem Teleport.",
      "chaos-sanctuary-hell": "Denso e lucrativo, e os bosses dos selos morrem para Crushing Blow. Os Oblivion Knights são o perigo — as maldições deles caem num personagem que fica parado por design.",
      "pit-hell": "Área de nível 85 com a melhor relação densidade-perigo do jogo. Leve o pacote de Berserk ou uma Bone Break, porque os imunes a físico daqui são o único muro real da build.",
      "travincal-hell": "Três alvos de alto valor parados juntos e nada imune a físico entre eles. Curto, e a pilha já está de pé quando você chega.",
      "mausoleum-hell": "Área de nível 85 com quase nada imune a físico dentro, o que faz dela a zona 85 mais amigável para o pacote de Taunt.",
    },
    levelingPath: {
      summary:
        "**Esta build não precisa de respec nenhum**, e é uma das duas da classe que não precisa. O Bash alimenta a Double Swing a 10% por ponto duro, a Double Swing é pré-requisito do Frenzy *e* sinergia dele a 8%, e o Double Throw fica entre os dois como a porta — então a corrente de evolução e a corrente de endgame são a mesma corrente. A única coisa a redecidir é a mastery, e só se as armas com que você termina forem de família diferente das com que você evoluiu.",
      respecAt: "Nenhum necessário. Guarde os tokens para uma troca de mastery se as suas armas mudarem de família.",
    },
    selfFoundNotes:
      "Melhor self-found que o Whirlwind Barbarian, porque um par igual de armas comuns bate uma única ótima aqui e a Passion é uma runeword de nível 43 feita de runas comuns. Arreat's Face, Gore Rider, String of Ears, Raven Frost e Atma's Scarab dropam com facilidade. A build só para de verdade na Grief e na Fury, e a Jah e a Ber da Fury estão tão fora de alcance quanto qualquer runa do jogo — mas um Frenzy Barbarian self-found com duas Passion ou duas Oath limpa o Hell perfeitamente bem, porque o dano é a taxa de ataque e as somas secas em vez de uma arma enorme.",
    hardcoreNotes:
      "A pilha é o perigo. Um Frenzy Barbarian está no mais frágil nos dois primeiros segundos de uma luta e no mais seguro dez segundos depois, que é o oposto de como a maioria dos personagens morre — então as mortes vêm de abrir no alvo errado, não de ser sobrepujado no fim. Abra no lixo, sempre. Pegue o pacote de Berserk em vez do Taunt: um grupo imune que você não consegue ferir é um grupo do qual você tem que sair andando, e andar é exatamente o que esta build faz mal com a pilha fria. Alcance 86% de recuperação em vez de 48%, trate Cannot Be Frozen como obrigatório — um Frenzy resfriado perde a pilha — e consiga a Dracul's Grasp antes do que o tier sugere, porque Life Tap vale mais que qualquer redução de dano num personagem que está sempre em contato.",
    gearSets: {
      starter: {
        goal: "Duas armas na mão e o Frenzy na barra. Todo o resto é o que te mantiver vivo enquanto a pilha te ensina o ritmo.",
        nextUpgrade: "Arreat's Face no 42, e um par igual de armas de verdade.",
        picks: {
          "weapon-0": { why: "+25% de velocidade de ataque e 50% de Open Wounds por duas runas da Countess, em qualquer espada, machado ou maça. Velocidade de ataque é a stat que esta build converte em todo o resto.", sockets: "Tir + El numa base de 2 sockets." },
          "offhand-0": { why: "A segunda, e ela deve ser a **mesma base da primeira**. O frame de ataque é a média entre as duas mãos, então um par igual bate uma arma melhor pareada com uma pior." },
          "helm-0": { why: "+1 em todas as skills em qualquer elmo de 2 sockets.", sockets: "Ort + Sol." },
          "body-0": { why: "Velocidade de corrida e recuperação. A corrida é redundante depois que a pilha sobe e essencial antes disso." },
          "belt-0": { why: "10% de velocidade de ataque no nível 27, que é a única fonte acessível dela neste tier." },
          "boots-0": { label: "Qualquer bota rara ou mágica com Faster Run/Walk e resistências", why: "Você não é rápido até a pilha subir, e a primeira luta de toda run começa fria." },
          "gloves-0": { label: "Luvas raras ou mágicas com 20% de Increased Attack Speed", why: "Velocidade de ataque vale mais que qualquer outra coisa que uma luva role aqui, porque a pilha sobe mais rápido e a pilha é a build." },
          "ring1-0": { why: "Attack rating, que falha antes do dano num personagem corpo a corpo de nível baixo." },
          "ring2-0": { label: "Um anel raro com attack rating e vida", why: "Duas armas significam duas chances de errar." },
          "amulet-0": { label: "Um amuleto raro ou mágico com +2 Barbarian skills", why: "+2 skills bate qualquer linha de atributo neste nível." },
        },
        charms: [{ label: "Small charms com vida e resistências", why: "Nada exótico existe ainda." }],
      },
      nightmare: {
        goal: "Um par igual com velocidade de ataque de verdade, o Arreat's Face, e resistência o bastante para entrar no Hell.",
        nextUpgrade: "A Grief, e depois a decisão sobre o que vai na outra mão.",
        picks: {
          "weapon-0": { why: "Nível 43 em qualquer arma de 4 sockets: +25% de velocidade de ataque e +1 em Berserk, que nesta build é +1% do dano do Frenzy convertido em mágico além de um botão de emergência melhor." },
          "weapon-0-alt0": { why: "Nível 53, e os −25% de defesa do alvo respondem ao problema de attack rating desta build a partir do slot da arma." },
          "weapon-0-alt1": { label: "Oath (`oath`) numa espada de 4 sockets — Balrog Blade ou Cryptic Sword", why: "Nível 49: +210-340% de dano aprimorado e 50% de velocidade de ataque contada a contribuição da Shael. Legal em machados e maças também; os guias colocam em espada e pegam Blade Mastery para ela." },
          "offhand-0": { why: "Uma segunda igual. Duas da mesma base resultam na melhor média de frame; duas bases diferentes resultam em algo pior que a mais rápida delas." },
          "helm-0": { why: "+2 Barbarian skills e +2 Combat Skills são +4 Frenzy vindos de um slot, com 30% de recuperação, +30 em todas as resistências e 3-6% de roubo de vida em cima. Nada o desloca por cinco tiers." },
          "body-0": { why: "+45% de velocidade de ataque no nível 43, e nesta build velocidade de ataque se acumula em velocidade de corrida e na pilha. Costuma estar certo por cima da Lionheart aqui." },
          "body-0-alt0": { why: "+30 em todas as resistências e +25 de Strength no lugar, se o Strength for o que está travando a sua mão secundária." },
          "belt-0": { why: "Redução de dano e roubo de vida, e ele dropa o tempo todo." },
          "boots-0": { why: "Crushing Blow num ataque que encaixa várias vezes por segundo. É aqui que a capacidade de Uber começa." },
          "gloves-0": { label: "Luvas craftadas Blood com 20% de Increased Attack Speed e roubo de vida", why: "As duas stats se acumulam com a pilha." },
          "ring1-0": { why: "Cannot Be Frozen, e attack rating para duas armas." },
          "ring2-0": { label: "Um anel raro com attack rating, vida e resistências", why: "Continua sendo a restrição." },
          "amulet-0": { why: "Amplify Damage ao golpear é −100% de resistência física, e nesta taxa de ataque tem uptime quase permanente." },
        },
        charms: [{ label: "Grand charms de Combat Skills, e small charms de vida/resistência", why: "Um skiller é +1 Frenzy e +1 Double Swing ao mesmo tempo, então vale mais aqui que numa build com uma sinergia só." }],
        weaponSwap: [{ why: "Battle Orders acima do seu próprio nível. Troque, grite, troque de volta — você não luta num swap de uma mão." }],
      },
      "early-hell": {
        goal: "Grief numa mão, algo de verdade na outra, e resistências no teto.",
        nextUpgrade: "Enigma, ou o equipamento de Uber — e nesta build esses são objetivos genuinamente diferentes.",
        picks: {
          "weapon-0": { why: "**A mão principal.** Os +340-400 de dano dela são somados depois de cada multiplicador percentual do jogo, e o Frenzy os aplica em cada acerto de um ataque muito rápido.", sockets: "Eth + Tir + Lo + Mal + Ral numa Phase Blade." },
          "offhand-0": { why: "**+5 em Frenzy, e é a única stat de item restrita a classe neste site que cai na build que ela nomeia.** Nível 65 em qualquer arma corpo a corpo de 3 sockets: +209% de dano aprimorado, 66% de Open Wounds, 33% de Deadly Strike, +40% de velocidade de ataque, Ignore Target's Defense e −25% de defesa do alvo. A linha de Ignore Target's Defense vale tanto quanto o dano numa build cujo attack rating está dividido entre duas mãos." },
          "offhand-0-alt0": { label: "Uma segunda Grief Phase Blade", why: "Um par igual resulta no melhor frame possível, e duas linhas de dano seco é muito dano. A Fury geralmente ganha nesta build por causa do +5 Frenzy e das linhas de defesa." },
          "helm-0": { why: "Continua sendo +4 Frenzy vindos de um slot." },
          "body-0": { why: "+300% de dano aprimorado, aplicado às duas armas." },
          "body-1": { why: "A velocidade de ataque no lugar, se você estiver com pouca. Num ataque que empilha isso é uma escolha defensável e não uma de orçamento." },
          "belt-0": { why: "Redução de dano, Vitality, e os 10% de recuperação que costumam alcançar o breakpoint de cinco frames." },
          "boots-0": { why: "Crushing Blow, Deadly Strike e Open Wounds, e os três escalam com a frequência com que você acerta." },
          "gloves-0": { why: "Life Tap ao golpear. Nesta taxa de ataque é efetivamente permanente, e é a maior linha de sobrevivência que um personagem corpo a corpo tem." },
          "ring1-0": { why: "Cannot Be Frozen — e congelar é pior aqui que em outros lugares, porque um ataque desacelerado perde a pilha." },
          "ring2-0": { why: "Um segundo. Duas armas precisam do dobro de attack rating." },
          "ring2-1": { why: "O +1 skill no lugar, quando o attack rating estiver resolvido." },
          "amulet-0": { why: "+1 em todas as skills, 20% de velocidade de ataque, e Deadly Strike que cresce com o seu nível." },
        },
        charms: [
          { why: "Magic find e ouro num slot de grand charm." },
          { label: "Skillers de Combat Skills e small charms de vida/resistência", why: "Cada skiller aumenta o Frenzy e a sinergia dele juntos." },
        ],
        weaponSwap: [{ why: "Os gritos, a partir de um slot em que você não luta." }],
      },
      budget: {
        goal: "Um personagem de Hell pronto, e o ponto em que a Uber Tristram vira algo que você pode tentar.",
        nextUpgrade: "O loadout de Uber propriamente dito, e o resto do attack rating.",
        picks: {
          "weapon-0": { why: "Inalterada." },
          "offhand-0": { why: "+5 Frenzy, Open Wounds e Ignore Target's Defense. Nos Ubers esta é a mão que importa, porque Open Wounds é uma das poucas coisas que funciona neles." },
          "helm-0": { why: "+4 Frenzy, resistências e roubo de vida." },
          "helm-1": { label: "Guillaume's Face (item de set, usado sozinho)", why: "15% de Crushing Blow, 35% de Deadly Strike e 30% de recuperação. **Um label em vez de um link porque este site não tem registro de sets** — é uma peça do Orphan's Call, usada sozinha pelo Crushing Blow, e é o elmo padrão de Uber." },
          "body-0": { why: "+300% de dano aprimorado nas duas armas ao mesmo tempo." },
          "body-1": { why: "Teleport. Menos transformador aqui que em qualquer outra build corpo a corpo, porque a velocidade de corrida do Frenzy já atravessa mapas — pegue pelo +1 skills e pelo Strength, se pegar.", sockets: "Jah + Ith + Ber." },
          "belt-0": { why: "Redução de dano e o frame de recuperação." },
          "boots-0": { why: "Crushing Blow, e nos Ubers Crushing Blow é a maior parte do seu dano." },
          "gloves-0": { why: "Life Tap, que é como um personagem corpo a corpo sobrevive parado ao lado de três bosses de Uber." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "Attack rating para a segunda mão." },
          "amulet-0": { why: "Skills, velocidade e Deadly Strike." },
          "amulet-1": { why: "+400-450 de attack rating e +25-35 em todas as resistências, no nível 81." },
        },
        charms: [
          { why: "Ouro e magic find." },
          { why: "O Sunder Charm físico, e nesta página é o que torna o pacote de Taunt viável — ele responde à imunidade sem gastar os dezoito pontos." },
          { label: "Skillers de Combat Skills, Annihilus, Hellfire Torch", why: "A Torch é +3 Barbarian skills, o que aumenta Frenzy, Double Swing e a mastery juntos." },
        ],
        weaponSwap: [{ why: "Battle Orders antes do portal, não depois." }],
      },
      optimized: {
        goal: "Ubers a qualquer hora, e um personagem de Hell que não para para nada que não seja imune.",
        nextUpgrade: "Bases etéreas, e rolagens perfeitas.",
        picks: {
          "weapon-0": { why: "O dano seco depois dos multiplicadores, no ataque mais rápido do jogo." },
          "offhand-0": { why: "+5 Frenzy, 66% de Open Wounds, 33% de Deadly Strike e Ignore Target's Defense." },
          "helm-0": { label: "Guillaume's Face (item de set, usado sozinho)", why: "O elmo de Uber: 15% de Crushing Blow e 35% de Deadly Strike. Um label porque o site não tem registro de sets." },
          "helm-1": { why: "O elmo de uso geral, e o correto fora dos Ubers." },
          "body-0": { why: "A armadura de dano, e esta build a aplica duas vezes." },
          "belt-0": { why: "15% de redução de dano na rolagem máxima." },
          "boots-0": { why: "Upgradeadas. Crushing Blow não melhora além disso em botas." },
          "gloves-0": { why: "Life Tap." },
          "ring1-0": { why: "Cannot Be Frozen, 250 de attack rating." },
          "ring2-0": { why: "O segundo." },
          "amulet-0": { why: "Attack rating e resistências, que são as duas carências estruturais desta build." },
          "amulet-1": { why: "Skills e velocidade no lugar, quando o attack rating já estiver lá." },
        },
        charms: [
          { why: "Ouro e magic find." },
          { why: "O Sunder, que é o que permite a esta build pegar Taunt em vez de Berserk." },
          { label: "Skillers de Combat Skills, Annihilus, Hellfire Torch", why: "Cada +1 aumenta duas skills neste plano em vez de uma." },
        ],
        weaponSwap: [{ why: "Os gritos." }],
      },
      bis: {
        goal: "Nada mais para comprar. Duas runewords elite, Ubers a qualquer hora, e attack rating que deixou de ser o limite.",
        notes: "Guillaume's Face e todas as peças do Immortal King são picks por label em vez de links: são itens de set, e este site não tem registro de sets. O Guillaume's é o elmo padrão de Uber nesta build e é usado sozinho, pelo Crushing Blow e pelo Deadly Strike e não por qualquer bônus de set.",
        picks: {
          "weapon-0": { why: "Numa Phase Blade etérea — Phase Blades são indestrutíveis, então etéreo é de graça." },
          "offhand-0": { why: "Numa Berserker Axe etérea, com o Strength pago. +5 Frenzy em cima de tudo o mais que ela faz." },
          "helm-0": { label: "Guillaume's Face (item de set, usado sozinho) para Ubers; Arreat's Face para o resto", why: "Os dois elmos entre os quais esta build alterna, e o motivo de alternar: um é Crushing Blow para três bosses, o outro é +4 Frenzy e resistências para todo o resto. O Guillaume's é um label porque o site não tem registro de sets." },
          "body-0": { why: "O dano, numa base etérea." },
          "belt-0": { why: "15% de redução de dano, 40 de Vitality." },
          "boots-0": { why: "Upgradeadas, perfeitas." },
          "gloves-0": { why: "Life Tap, permanentemente, a quatro ataques por segundo." },
          "ring1-0": { why: "250 de attack rating e imunidade a congelamento." },
          "ring2-0": { why: "Os segundos 250." },
          "amulet-0": { why: "O attack rating e as resistências no topo das duas rolagens." },
        },
        charms: [
          { why: "40% de magic find na rolagem máxima." },
          { why: "O Sunder Charm físico." },
          { label: "Skillers de Combat Skills, um Annihilus máximo, uma Hellfire Torch máxima", why: "Duas skills aumentadas por ponto de +skills, porque o Frenzy e a sinergia dele estão os dois nesta árvore." },
        ],
        weaponSwap: [{ why: "Um Battle Orders de nível 6, que é mais vida que qualquer armadura." }],
      },
    },
  },
  "whirlwind-barbarian": {
    summary:
      "O giro que define a classe: dano físico mantido através de um grupo, no único ataque do jogo que não alimenta sinergia nenhuma nem recebe nenhuma.",
    playstyle:
      "Você segura o botão e atravessa as coisas em vez de clicar nelas. O Whirlwind percorre um caminho que você fixa no momento do aperto — não dá para mudar de direção no meio e não dá para ser interrompido, o que junto faz dele a skill corpo a corpo menos reativa do jogo e a mais segura de se comprometer. O ritmo é Battle Cry no grupo para cortar a defesa pela metade, um giro atravessando o meio, e um segundo de volta pelo que ainda estiver de pé. O Berserk fica no outro botão do mouse para qualquer coisa imune a físico, e ele é um personagem diferente enquanto está ativo: todo o dano mágico, e defesa zero. Contra um boss você para de girar e fica parado com o Berserk, porque um giro que atravessa um alvo só desperdiça a maior parte dos acertos.",
    strengths: [
      "Não pode ser interrompido: levar dano não para o giro, então não existe espiral de recuperação para cair dentro",
      "Acerta tudo no caminho em vez de um alvo, e o caminho pode ser escolhido para cruzar um grupo inteiro",
      "O plano de equipamento mais simples da classe — não há sinergia para financiar, então cada ponto além do núcleo compra vida ou mastery",
      "Um escudo bloqueia com efetividade total enquanto você gira; é a velocidade de corrida que a skill corta, não o bloqueio",
      "Battle Orders faz dele a coisa mais resistente de um grupo e buffa todo mundo junto",
    ],
    weaknesses: [
      "O Whirlwind não tem sinergia em nenhuma direção, então o dano dele não pode ser aumentado por pontos de skill de forma alguma",
      "Attack rating é a restrição real — os +50% e 5% por nível dele são o menor bônus de qualquer ataque de Barbarian",
      "Dano físico contra um imune a físico, e a resposta custa um pacote inteiro",
      "Não existe tabela publicada de velocidade de ataque para uma classe cujos frames dependem da arma",
      "Alvo único é o pior caso dele: um giro que atravessa um boss desperdiça a maior parte dos acertos",
    ],
    flexPoints: [
      "**Não há nenhum, e isso é o plano.** O núcleo é 77 e qualquer um dos pacotes custa exatamente 33, então a tela de skills mostra 110 gastos e nada sem destino no nível 99.",
      "Abaixo do 99 a ordem é: Whirlwind primeiro, depois a mastery, depois Battle Orders, depois o pacote. Os pontos únicos podem esperar — nenhum deles está causando dano.",
      "Se você fizer respec para cá vindo da rota de evolução, a mastery é o ponto a redecidir. Ela é presa a um tipo de item e a arma com que você termina raramente é a com que você evoluiu.",
    ],
    skillPackages: {
      "the-last-thirty-three": {
        name: "Os últimos trinta e três pontos",
        intro:
          "O núcleo é 77 pontos e fecha todos os pré-requisitos. O Whirlwind não tem sinergia para financiar, então o que sobra é uma escolha de verdade e não uma ordem de maximização: ou você compra uma resposta para imunes a físico, ou compra um debuff que faz tudo que você já mata morrer mais rápido. Os dois custam exatamente 33 e só um cabe.",
        packages: {
          berserk: {
            name: "Berserk — a resposta para imunidade",
            when: "Você joga sozinho, roda áreas com imunes a físico dentro, e prefere ter um segundo ataque a ter um primeiro mais forte.",
            tradeoff: "Você abre mão do debuff do Grim Ward, o que significa mortes mais lentas em tudo que não é imune, e menos para um grupo.",
            skillNotes: {
              berserk:
                "**Todo o dano dele é entregue como mágico, não parte dele.** O dano físico da arma é carregado e convertido a 100%, então um imune a físico recebe inteiro e só um monstro resistente a mágico resiste. +150% de dano e 15% por nível em cima. O custo é que sua defesa vira zero enquanto o estado dura — cerca de 2,7 segundos com um ponto, *encolhendo* para perto de 1,3 com vinte, então mais pontos significam menos tempo exposto.",
              howl:
                "A sinergia do Berserk, 10% de dano por ponto duro. Howl é uma skill de nível 1 que ninguém aperta, e neste pacote são catorze pontos do dano do Berserk.",
            },
            rotationNote:
              "Whirlwind para tudo que morre com ele, Berserk mantido em qualquer coisa imune a físico e em bosses, onde um giro através de um alvo só desperdiça a maior parte dos acertos.",
            contentNote: "The Pit, Ancient Tunnels, Chaos Sanctuary — qualquer lugar onde um imune a físico possa aparecer e você não tenha ninguém para quebrá-lo.",
            remainderNote: "Não sobra nada. 77 + 33 = 110, que é todo ponto que um personagem de nível 99 tem.",
          },
          "grim-ward": {
            name: "Grim Ward — o debuff de dano recebido",
            when: "Você joga em grupo, ou farma áreas densas onde um mercenário e um totem fazem mais que um segundo botão de ataque.",
            tradeoff: "O Berserk fica em catorze pontos em vez de vinte, então um imune a físico é uma luta mais lenta do que precisaria ser.",
            skillNotes: {
              "find-potion":
                "**Vinte pontos numa skill de nível 1, e não é pelas poções.** Find Potion soma 5% ao debuff de dano recebido do Grim Ward por ponto duro, então uma maximizada leva o totem de +20% para +120%. Ela também soma 1% por ponto à chance do Find Item, que é o segundo motivo. O jogo não rotula nenhum dos dois parâmetros como sinergia, então a página da skill não desenha aresta para nenhum.",
              berserk: "Continua sendo a resposta para imunidade, só que catorze pontos dela em vez de vinte.",
            },
            rotationNote:
              "Plante o Grim Ward no primeiro cadáver e gire dentro dele. Tudo no campo recebe mais que o dobro do dano e se move a um quarto da velocidade, o que vale mais que os seis pontos de Berserk que você abriu mão.",
            contentNote: "Travincal, os níveis da Worldstone Keep, Terror Zones — qualquer lugar onde o grupo é grande o bastante para um campo bater um segundo botão.",
            remainderNote: "Não sobra nada. 77 + 33 = 110.",
          },
        },
      },
    },
    statPlan: {
      strength: "O suficiente para o seu equipamento e nem um ponto a mais. Uma Grief Phase Blade pede 25; a armadura de corpo é o que de fato define o número, e uma Lionheart ou uma Fortitude numa base mais leve muda isso.",
      dexterity: "O suficiente para a sua arma, mais o suficiente para bloqueio máximo **só se você estiver com escudo**. Um Barbarian de duas armas nunca bloqueia e cada ponto além do requisito da arma é desperdiçado nele.",
      vitality: "Todo o resto. Quatro de vida por ponto é o maior do jogo, e o Battle Orders multiplica o que você tiver por quase dois.",
      energy: "Nenhum. O Whirlwind custa 12,5 de mana e a Insight no mercenário resolve isso para sempre.",
      notes: [
        "**Calcule o requisito de Strength antes do respec, não depois.** O token de respec devolve pontos de skill e nunca pontos de atributo, então uma armadura de corpo que você não planejou são vinte pontos que não voltam.",
        "A decisão entre duas armas e escudo é tanto de atributo quanto de equipamento: o escudo custa Dexterity para bloqueio e devolve um slot inteiro de resistência e redução de dano.",
        "Vida é a stat que decide o Hell. Um Barbarian com 3000 de vida e 50% de resistência sobrevive a coisas que matam um com 2000 de vida e 75%.",
      ],
    },
    breakpointWhy: {
      "fhr-48": "O Barbarian divide a tabela de Faster Hit Recovery com o Paladin e a Assassin. 48% são cinco frames, e é o único breakpoint de que esta build realmente precisa — um giro não pode ser interrompido, mas tudo entre os giros pode.",
      "fhr-86": "Quatro frames, e alcançável quando Fortitude e Verdungo's estão os dois equipados. Vale no Hardcore e é opcional fora dele.",
      "fcr-63": "Só depois que uma Enigma estiver equipada. Teleport é uma conjuração, então usa a tabela de cast rate, e 63% é onde o teleport de um Barbarian deixa de parecer um risco.",
      "fbr-42": "Só na variante com escudo. Um escudo bloqueia com efetividade total enquanto você gira — é a velocidade de corrida que a skill corta, não o bloqueio — então a taxa de bloqueio vale ser alcançada se você estiver segurando um.",
    },
    breakpointNotes:
      "**Não existe linha de velocidade de ataque aqui e não vai existir.** Os frames de Increased Attack Speed dependem da velocidade base da arma e da skill, então nenhuma porcentagem única está correta para uma classe — este site diz isso na página de breakpoints e faz valer. O que é seguro afirmar: o patch 2.4.3 estabeleceu que o **Whirlwind incorpora velocidade de ataque de todo o equipamento**, não só do que está socketado na arma, e que ao empunhar duas armas o frame de ataque de cada uma é a média, arredondada para cima. A afirmação antiga de que só conta velocidade socketada na arma está errada e continua sendo repetida por toda parte. Persiga velocidade de ataque continuamente em vez de mirar um limiar, e prefira a mais rápida entre duas bases equivalentes.",
    skillNotes: {
      whirlwind:
        "+30% de dano com um ponto e mais 5% por nível — 125% com vinte, o que é um multiplicador pequeno para os padrões desta classe. O dano vem da arma e da quantidade de acertos, não do bônus. **Ele não tem sinergia em nenhuma direção**: nada no jogo o aumenta e ele não aumenta nada, e é por isso que este plano não tem nenhuma skill marcada como sinergia dele. Attack rating é +50% e 5% por nível, o menor de qualquer ataque de Barbarian. Custa 12,5 de mana em vez dos 25 que a coluna crua mostra, subindo para 22 com vinte.",
      "blade-mastery":
        "+28% de dano e 5% por nível, +40% de attack rating e 8% por nível, e uma chance de crítico subindo em direção a 35% — dez pontos acima do que a Claw Mastery da Assassin alcança. **Troque por qual mastery a sua arma de fato é.** Ela é presa ao tipo de item que o jogo chama de Swords and Knives; uma Grief Phase Blade é espada e serve, uma Grief Berserker Axe não é e pede Axe Mastery.",
      "battle-orders":
        "+35% de vida máxima com um ponto e mais 3% por nível — +92% com vinte, em você, no mercenário e no grupo. É a maior compra isolada disponível a qualquer personagem do jogo e não é sinergia do Whirlwind; está aqui porque não há mais nada que valha vinte pontos.",
      bash: "Pré-requisito do Stun, e através dele do Concentrate e do Whirlwind.",
      stun: "Pré-requisito do Concentrate. Nunca apertado nesta barra.",
      concentrate:
        "Um dos dois pré-requisitos do Whirlwind, e um botão realmente útil: dobra sua defesa enquanto golpeia e não pode ser interrompido, que é a resposta mais segura quando algo bate forte o bastante para a defesa zero do Berserk não caber.",
      leap: "Pré-requisito do Leap Attack. Também passa por cima de paredes, o que já vale o botão.",
      "leap-attack": "O outro pré-requisito do Whirlwind, e o único fecha-distância da classe antes da Enigma.",
      howl: "Pré-requisito do Shout, e sinergia do Berserk a 10% por ponto se o pacote de Berserk for escolhido.",
      shout: "+100% de defesa para o grupo, e soma 5 segundos por ponto duro à duração do Battle Orders. Um ponto basta para as duas funções.",
      "battle-command": "+1 em todas as skills, e não escala — o parâmetro é 1 em todo nível. Conjure antes do Battle Orders para que o buff de vida saia um nível mais alto.",
      taunt: "Pré-requisito do Battle Cry.",
      "battle-cry":
        "Defesa inimiga −50% e mais 2% por nível. Cortar a defesa de um monstro pela metade vale mais para esta build que qualquer item de attack rating, porque attack rating é conferido contra a defesa e não contra um limiar.",
      "find-potion":
        "Um ponto aqui no núcleo, e vinte no pacote de Grim Ward — **porque ela escala o debuff do Grim Ward, não por causa das poções**. O Grim Ward faz tudo dentro dele receber +20% mais dano e mais 5% por ponto duro de Find Potion. O jogo não rotula isso como sinergia, então nenhuma aresta é desenhada, e o número é real do mesmo jeito.",
      "find-item": "Uma segunda rolagem de drop num cadáver, e pré-requisito do Grim Ward. Um ponto vale ter em qualquer barra de Barbarian.",
      "grim-ward":
        "Um totem que apavora e desacelera até 75%, e aumenta o dano que tudo lá dentro recebe. Ele fica de pé por 40 segundos e esse número não se mexe com pontos — o raio e o debuff se mexem.",
      "increased-stamina": "Pré-requisito do Increased Speed.",
      "increased-speed": "Velocidade de corrida sempre ativa numa classe sem skill de movimento. A curva é íngreme no começo: um ponto é uma fração grande do que vinte dão.",
      "iron-skin": "Pré-requisito do Natural Resistance.",
      "natural-resistance":
        "As quatro resistências de uma vez, somadas antes do teto. Esta é a resposta mais barata para o −100 do Hell que qualquer classe tem, e não precisa de buff mantido.",
    },
    immunityPlan:
      "**Imunidade física é a única coisa que trava esta build, e ela tem três respostas.** A mais barata é o Berserk: o dano dele é convertido para mágico a 100%, então um imune a físico recebe o todo, e um ponto basta para tornar a luta possível mesmo que o pacote de Grim Ward o deixe em catorze. A segunda é uma Bone Break — o Sunder Charm físico — que torna um imune apenas resistente e custa um slot de charm em vez de um pacote. A terceira é o Atma's Scarab, cujo Amplify Damage ao golpear é −100% de resistência física e, numa skill que acerta tanto, praticamente permanente; repare que Amplify Damage não quebra uma imunidade sozinho, só reduz uma resistência que já esteja abaixo de 100%. Imunidade a mágico existe e é rara; Concentrate é a resposta física para ela e já está no núcleo com um ponto.",
    mercenaryNotes:
      "**Ato 2, Nightmare, Might.** A aura dele aumenta dano físico, que é todo o dano desta build no plano do núcleo. Insight numa polearm resolve o problema de mana em definitivo e a aura de Meditation dela vale mais que qualquer arma que ele pudesse segurar, até dar para bancar uma Infinity — cuja Conviction reduz defesa inimiga além de resistência, e defesa é o que esta build de fato enfrenta. Equipe-o para sobreviver primeiro: uma Fortitude ou uma Treachery, um Andariel's Visage ou um Vampire Gaze, e a The Reaper's Toll se você preferir Decrepify ao golpear em vez da mana. **Não pegue Defiance**; a aura de defesa não faz nada por um personagem cujo problema é acertar.",
    farmingWhy: {
      "pit-hell": "Área de nível 85, curta, densa, e os grupos dela são exatamente para o que o Whirlwind foi feito. Os imunes a físico aqui são o motivo de o pacote de Berserk ou um Sunder Charm existirem.",
      "travincal-hell": "O Council são três alvos de alto valor parados juntos, que é exatamente um giro. O debuff do Grim Ward está no melhor dele aqui e o Find Item tira uma segunda rolagem de cada cadáver.",
      "worldstone-keep-hell": "Denso, área de nível 85, e a corrida até o Baal é o loop padrão de endgame. Um giro atravessando um grupo da Worldstone é a build no melhor dela.",
      "chaos-sanctuary-hell": "Denso e lucrativo, mas os bosses dos selos e os Oblivion Knights punem um personagem que precisa ficar parado no corpo a corpo. Leve o pacote de Berserk.",
      "mausoleum-hell": "Área de nível 85 com quase nada imune a físico dentro, o que faz dela a zona 85 mais amigável que esta build tem.",
      "pindleskin-hell": "Área de nível 83 e a corrida mais curta do jogo. Um alvo só, então o Whirlwind está no pior dele — o botão aqui é o Berserk, não o giro.",
    },
    levelingPath: {
      summary:
        "Evolua com Bash e Double Swing usando uma mastery que combine com a arma que dá para comprar de verdade, pegue a espinha de Warcries conforme ela abre, e faça um respec no nível 40 para este plano. O respec é por causa da mastery e não do ataque: uma mastery é presa a um tipo de item e a arma com que você evolui não é a com que você termina.",
      respecAt: "Nightmare Ato 4, nível 40, depois do The Fallen Angel — voltam 47 pontos e a abertura de Whirlwind custa exatamente 47.",
    },
    selfFoundNotes:
      "O núcleo desta build é alcançável sozinho e o topo dela não é. Arreat's Face, Gore Rider, String of Ears, Raven Frost e Atma's Scarab dropam com facilidade; Steel, Lore, Lionheart, Treachery e Passion são todas runas que a Countess entrega. A Grief pede uma Lo e a Enigma pede uma Jah e uma Ber, que é onde um personagem sem trocas para. Um Whirlwind Barbarian self-found é perfeitamente viável com Oath ou Passion numa boa base elite — o dano da build é a arma e a quantidade de acertos, e nenhum dos dois exige runa alta para ser respeitável.",
    hardcoreNotes:
      "O Whirlwind é excepcionalmente bom no Hardcore para uma skill corpo a corpo porque não pode ser interrompido, e excepcionalmente perigoso porque você não pode cancelá-lo: o caminho é fixado no momento do aperto e você não consegue beber poção até acabar. Mantenha os giros curtos. Pegue o pacote de Berserk em vez do Grim Ward, porque um imune a físico que você não consegue ferir é uma luta da qual você não consegue sair. Alcance o breakpoint de 86% de recuperação em vez do de 48%, segure um escudo em vez de uma segunda arma — ele bloqueia com efetividade total enquanto você gira — e trate Cannot Be Frozen como obrigatório e não como uma linha simpática no Raven Frost.",
    gearSets: {
      starter: {
        goal: "O personagem que sai da rota de evolução: uma mastery que combina com a arma, Battle Orders na barra, e resistência o bastante para entrar no Hell.",
        nextUpgrade: "Arreat's Face no nível 42, e uma arma de verdade.",
        picks: {
          "weapon-0": { why: "Duas delas, uma em cada mão. +25% de velocidade de ataque e 50% de Open Wounds por duas runas que a Countess dropa, e serve em qualquer espada, machado ou maça, então a escolha da mastery é sua.", sockets: "Tir + El numa base de 2 sockets." },
          "offhand-0": { why: "A segunda. O Whirlwind alterna pelas duas mãos." },
          "offhand-1": { why: "A linha de escudo no lugar: +43-48% em cada resistência no nível 21 por três runas, que é quase toda a penalidade do Nightmare resolvida antes de você encontrá-la." },
          "helm-0": { why: "+1 em todas as skills em qualquer elmo de 2 sockets, incluindo elmo de Barbarian.", sockets: "Ort + Sol." },
          "body-0": { why: "+25% de velocidade de corrida e +25% de recuperação numa classe sem skill de movimento." },
          "belt-0": { why: "Disponível no 27, e os 10% de velocidade de ataque são a parte que importa aqui — o ouro é bônus enquanto você ainda está comprando cetros." },
          "boots-0": { label: "Qualquer bota rara ou mágica com Faster Run/Walk e resistências", why: "Velocidade de corrida é a stat que torna a evolução tolerável, e nenhuma única vale ser caçada ainda." },
          "gloves-0": { why: "Nível 15, 200% de ouro extra e 25-40% de magic find. Não existe luva de dano que valha a pena neste tier e o loot acumula." },
          "ring1-0": { why: "Nível 7, attack rating e magic find, e dois deles são uma quantidade real dos dois." },
          "ring2-0": { label: "Um anel raro com attack rating e resistências", why: "Attack rating é o que falha primeiro num personagem corpo a corpo de nível baixo." },
          "amulet-0": { label: "Um amuleto raro ou mágico com +2 Barbarian skills", why: "+2 skills vale mais que qualquer linha de atributo que um amuleto consiga rolar neste nível." },
        },
        charms: [{ label: "Small charms com vida e resistências", why: "Nada mais exótico existe ainda, e vida é a stat que te carrega." }],
      },
      nightmare: {
        goal: "Whirlwind em vinte com uma mastery que combina com a arma, e as resistências para entrar no Hell sem morrer para a penalidade.",
        nextUpgrade: "Grief e Fortitude, as duas no nível 59, e as duas uma mudança de patamar.",
        picks: {
          "weapon-0": { label: "Oath (`oath`) numa espada de 4 sockets — Balrog Blade, Highland Blade ou Cryptic Sword", why: "Shael Pul Mal Lum no nível 49: +210-340% de dano aprimorado, 50% de velocidade de ataque uma vez contada a contribuição da Shael, e Prevent Monster Heal. Ela é legal em machados e maças também e ninguém joga assim — os guias colocam em espada e pegam Blade Mastery para ela." },
          "weapon-0-alt0": { why: "Nível 43, quatro sockets, +1 em Berserk e +25% de velocidade de ataque — o substituto mais barato, e serve para qualquer mastery em que você tenha parado." },
          "weapon-0-alt1": { why: "Nível 53, e os −25% de defesa do alvo fazem o mesmo trabalho do Battle Cry a partir do slot da arma." },
          "offhand-0": { label: "Uma segunda Oath, ou uma espada rara com +3 Whirlwind", why: "O Whirlwind alterna pelas duas mãos e o frame de ataque é a média entre elas, então a arma mais lenta arrasta a mais rápida." },
          "offhand-1": { why: "A linha de escudo: não pode ser congelado, +25 em todas as resistências e 25% de magic find no nível 29. Cannot Be Frozen importa mais do que parece numa skill com que você se compromete." },
          "helm-0": { why: "**O elmo que define a classe.** +2 Barbarian skills, +2 Combat Skills em cima disso, 30% de recuperação, +30 em todas as resistências e 3-6% de vida roubada por golpe. Nível 42, e nada o desloca até uma Enigma mudar a conta." },
          "body-0": { why: "+25 de Strength, +20 de Vitality, +50 de vida e +30 em todas as resistências no nível 41. Só o Strength já costuma pagar o requisito da próxima arma." },
          "body-1": { why: "+45% de velocidade de ataque no lugar, se as suas resistências já estiverem resolvidas. No Whirlwind isso é dano de verdade, porque o dano é função de quantas vezes ele acerta." },
          "belt-0": { why: "Redução de dano físico e roubo de vida num cinto só, e ele dropa o tempo todo." },
          "boots-0": { why: "Nível 47, e o motivo de um Barbarian matar coisas acima do dano listado dele: Crushing Blow é uma parcela da vida atual do alvo, e o Whirlwind rola isso em cada acerto que encaixa." },
          "boots-1": { why: "Magic find e dano seco no lugar, no nível 42." },
          "gloves-0": { label: "Luvas raras ou craftadas com 20% de velocidade de ataque", why: "Velocidade de ataque numa skill cujo dano é contagem de acertos. Luvas de craft Blood somam roubo de vida em cima." },
          "ring1-0": { why: "Cannot Be Frozen, +150-250 de attack rating e +15-20 de Dexterity. Imunidade a congelamento não é opcional numa skill que você não consegue cancelar." },
          "ring2-0": { label: "Um anel raro com attack rating, vida e resistências", why: "Attack rating continua sendo a restrição neste tier." },
          "amulet-0": { why: "Nível 60, e o Amplify Damage ao golpear dele é −100% de resistência física no que ele pegar. Numa skill que acerta tanto, é quase permanente." },
        },
        charms: [{ label: "Grand charms de Combat Skills, e small charms com vida e resistências", why: "Um skiller de Combat Skills é +1 Whirlwind, que vale mais que qualquer small charm." }],
        weaponSwap: [{ why: "Nível 57. Battle Orders e Battle Command a partir da troca, num nível maior do que seus próprios pontos compram — grite, troque de volta, lute." }],
      },
      "early-hell": {
        goal: "Um personagem capaz de Hell: Grief na mão, resistências no teto, e vida o bastante para um grupo ser um incômodo em vez de uma morte.",
        nextUpgrade: "Enigma, que muda como a build se move mais do que qualquer item de dano muda como ela mata.",
        picks: {
          "weapon-0": { why: "**A arma em torno da qual esta build é construída.** Os +340-400 de dano dela são somados depois de cada multiplicador percentual do jogo, e é por isso que ela bate armas com linhas de dano aprimorado muito maiores numa skill que acerta muitas vezes.", sockets: "Eth + Tir + Lo + Mal + Ral numa Phase Blade — uma espada, então a Blade Mastery se aplica." },
          "offhand-0": { label: "Uma segunda Grief, ou uma espada rara com +3 Whirlwind e 40% de velocidade de ataque", why: "A segunda Grief é a maior melhoria isolada que resta. Até lá a mão secundária deve ser a mais rápida que você tiver, porque o frame de ataque é a média entre as duas." },
          "offhand-1": { why: "A linha de escudo: 35% de redução de dano e o maior bloqueio do jogo. Nível 73." },
          "helm-0": { why: "Continua imbatível. +2 Barbarian skills e +2 Combat Skills são +4 no Whirlwind vindos de um slot." },
          "body-0": { why: "+300% de dano aprimorado e +200% de defesa aprimorada, e é a maior armadura de dano do jogo para um personagem corpo a corpo físico." },
          "belt-0": { why: "Nível 63: 10-15% de redução de dano, +30-40 de Vitality e 10% de recuperação. A recuperação costuma ser o que alcança o breakpoint de cinco frames." },
          "boots-0": { why: "Crushing Blow, Deadly Strike e Open Wounds. Os três escalam com contagem de acertos e o Whirlwind é contagem de acertos." },
          "gloves-0": { label: "Luvas craftadas Blood com 20% de velocidade de ataque e roubo de vida", why: "Roubo de vida é como um personagem corpo a corpo sobrevive ao Hell, e a velocidade de ataque é dano." },
          "ring1-0": { why: "Cannot Be Frozen não é negociável num ataque com que você se compromete." },
          "ring2-0": { why: "+1 em todas as skills e a mana para usá-las." },
          "ring2-1": { label: "Um anel raro com vida, resistências e attack rating", why: "Mais barato e frequentemente melhor que uma segunda única." },
          "amulet-0": { why: "Nível 65: +1 em todas as skills, 20% de velocidade de ataque, e Deadly Strike que cresce com o seu nível." },
        },
        charms: [
          { why: "Nível 62, e é o magic find e o gold find de três small charms num slot de grand charm." },
          { label: "Skillers de Combat Skills e small charms de vida/resistência", why: "Skillers são o único charm que aumenta o Whirlwind, já que nenhum ponto de skill consegue." },
        ],
        weaponSwap: [{ why: "Battle Orders num nível que os seus próprios pontos não alcançam." }],
      },
      budget: {
        goal: "Um personagem de Hell pronto, com Teleport. É aqui que a build deixa de ser um corpo a corpo que anda e passa a ser um que chega.",
        nextUpgrade: "Fury na mão secundária, e a decisão de amuleto entre skills e attack rating.",
        picks: {
          "weapon-0": { why: "Continua sendo a arma. Nada a desloca da mão principal." },
          "offhand-0": { label: "Uma segunda Grief Phase Blade", why: "Duas Griefs é o teto de duas armas até a Fury, e o frame de ataque médio está no melhor dele quando as duas armas são idênticas." },
          "helm-0": { why: "+4 no Whirlwind vindos de um slot, mais as resistências que deixam o resto do equipamento perseguir dano." },
          "body-0": { why: "**Teleport.** O Barbarian não tem skill de movimento, e este é o item que decide se ele percorre um mapa ou o atravessa. O +1 em todas as skills e o Strength são o que tornam o resto do plano viável.", sockets: "Jah + Ith + Ber numa armadura de corpo de 3 sockets — uma Mage Plate ou Archon Plate pelo peso." },
          "body-1": { why: "Se você não tiver as runas: muito mais dano, e você anda." },
          "belt-0": { why: "Redução de dano, Vitality e a recuperação que alcança cinco frames." },
          "boots-0": { why: "Crushing Blow em cada acerto de uma skill que acerta o tempo todo." },
          "gloves-0": { why: "Nível 76: 7-10% de vida roubada por golpe e um Life Tap ao golpear. Life Tap é a maior linha de sobrevivência disponível a um personagem corpo a corpo." },
          "ring1-0": { why: "Cannot Be Frozen." },
          "ring2-0": { why: "+1 skills e a mana que o Teleport da Enigma gasta." },
          "amulet-0": { why: "Skills, velocidade de ataque e Deadly Strike." },
          "amulet-1": { why: "Nível 81, e +400-450 de attack rating com +25-35 em todas as resistências resolve os dois problemas reais desta build num slot." },
        },
        charms: [
          { why: "Magic find e gold find num grand charm." },
          { why: "Nível 75. Um Sunder Charm físico: ele torna imunes a físico meramente resistentes, que é a alternativa a gastar um pacote no Berserk." },
          { label: "Skillers de Combat Skills, Annihilus, Hellfire Torch", why: "A Torch é +3 Barbarian skills, que são +3 Whirlwind e +3 mastery ao mesmo tempo." },
        ],
        weaponSwap: [{ why: "Battle Orders acima do seu próprio nível." }],
      },
      optimized: {
        goal: "A build com força total: Teleport, duas armas elite, e attack rating o bastante para os valores de defesa do Hell deixarem de importar.",
        nextUpgrade: "Bases etéreas, e os últimos pontos de attack rating.",
        picks: {
          "weapon-0": { why: "O dano seco depois dos multiplicadores continua incomparável numa skill de muitos acertos." },
          "offhand-0": { why: "Nível 65 em qualquer arma corpo a corpo de 3 sockets: +209% de dano aprimorado, 66% de Open Wounds, 33% de Deadly Strike e +40% de velocidade de ataque. O **+5 em Frenzy dela é uma linha morta nesta build** e viva na página do Frenzy — ela está aqui pela velocidade e pelo Deadly Strike." },
          "offhand-1": { label: "Uma segunda Grief Phase Blade", why: "Armas idênticas resultam na melhor média de frame, o que às vezes bate os números maiores da Fury." },
          "helm-0": { why: "Nada a deslocou em cinco tiers." },
          "helm-1": { why: "Nível 82: dois sockets, 30% de redução de dano e +1 em todas as skills. A troca são os +2 Combat Skills do Arreat's por um elmo socketável e muita mitigação." },
          "body-0": { why: "Teleport, e ele não se torna opcional em nenhum tier acima deste." },
          "belt-0": { why: "Redução de dano e o frame de recuperação." },
          "boots-0": { why: "Crushing Blow." },
          "gloves-0": { why: "Life Tap ao golpear, que nesta taxa de ataque é efetivamente permanente." },
          "ring1-0": { why: "Cannot Be Frozen, mais o attack rating." },
          "ring2-0": { why: "Um segundo, por mais 150-250 de attack rating — a stat que falta a esta build." },
          "ring2-1": { why: "O +1 skill no lugar, se o seu attack rating já for suficiente." },
          "amulet-0": { why: "+400-450 de attack rating e +25-35 em todas as resistências. Numa build cujo bônus de ataque é o menor da classe, este costuma ser o amuleto certo." },
        },
        charms: [
          { why: "O ouro e o magic find." },
          { why: "O Sunder físico, se você pegou o pacote de Grim Ward e não tem Berserk para recorrer." },
          { label: "Skillers de Combat Skills, Annihilus, Hellfire Torch", why: "Cada +1 no Whirlwind aqui é um ponto que a árvore de skills não pode dar, porque o Whirlwind não tem sinergia para comprar." },
        ],
        weaponSwap: [{ why: "Shout, Battle Orders, troca." }],
      },
      bis: {
        goal: "Nada mais para comprar. Duas runewords elite, Teleport, e attack rating alto o bastante para a chance de acerto deixar de ser o limite.",
        notes: "Guillaume's Face e o set Immortal King valem consideração aqui e nenhum dos dois pode ser linkado: são itens de set, e este site ainda não tem registro de sets. O Guillaume's são 15% de Crushing Blow e 35% de Deadly Strike num elmo, usado sozinho; o Immortal King é o loadout clássico e barato de Whirlwind que uniques e runewords superam.",
        picks: {
          "weapon-0": { why: "Numa Phase Blade etérea se você achar uma — Phase Blades são indestrutíveis, então etéreo não custa nada." },
          "offhand-0": { why: "A segunda. Duas armas idênticas dão a melhor média de frame e o dano seco se aplica a partir das duas." },
          "offhand-1": { why: "Open Wounds e Deadly Strike no lugar, se você preferir a sustentação à segunda linha de dano seco." },
          "helm-0": { why: "Upgradeado e com rolagem perfeita de roubo de vida. Os +2 Combat Skills não estão disponíveis em nenhum outro lugar da classe." },
          "body-0": { why: "Teleport, na base mais leve que o seu Strength permitir." },
          "belt-0": { why: "15% de redução de dano e 40 de Vitality na rolagem máxima." },
          "boots-0": { why: "Upgradeadas. Crushing Blow não fica melhor que isso em botas." },
          "gloves-0": { why: "Life Tap, permanentemente, numa skill que golpeia várias vezes por segundo." },
          "ring1-0": { why: "Uma rolagem de 250 de attack rating." },
          "ring2-0": { why: "Um segundo, pelo attack rating que falta estruturalmente a esta build." },
          "amulet-0": { why: "O attack rating e as resistências, os dois no topo da rolagem." },
        },
        charms: [
          { why: "40% de magic find e 160% de ouro na rolagem máxima." },
          { why: "O Sunder Charm físico, que transforma a única coisa que esta build não consegue matar em algo que ela mata devagar." },
          { label: "Skillers de Combat Skills, um Annihilus máximo, uma Hellfire Torch máxima", why: "Skills são a única rota para um Whirlwind maior, porque a árvore de skills não oferece nenhuma." },
        ],
        weaponSwap: [{ why: "Um Battle Orders de nível 6 vindo da troca vale mais vida que qualquer armadura de corpo." }],
      },
    },
  },
};
