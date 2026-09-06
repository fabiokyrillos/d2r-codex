import type { BuildCopy, Overlay } from "@/lib/types/copy";

/**
 * pt-BR copy for the Assassin build pages that ship after `pt-br.ts` was
 * closed.
 *
 * A separate file rather than an append, because `content/builds/pt-br.ts` is
 * shared across every class and this cycle's page is the Assassin's alone. The
 * registry spreads this overlay into `buildsPtBr`; the contract is otherwise
 * identical — same keys, same shape, same "zero missing translation keys"
 * guarantee that `npm run check:content` enforces.
 */
export const assassinBuildsPtBr: Overlay<BuildCopy> = {
  "whirlwind-assassin": {
    summary:
      "A Assassin toma emprestado o giro do Bárbaro de uma runeword de garra, no nível de skill um, e gasta cada ponto próprio no que uma arma não compra. A única Assassin corpo a corpo que não é uma build de cargas.",
    playstyle:
      "Você segura o botão e atravessa o grupo. Não há rotação, não há carga para construir e não há finisher para liberar — o Whirlwind não carrega a flag `finishing`, então a árvore de artes marciais inteira fica inerte e a coisa que você aperta é a única coisa que você aperta. O que você de fato administra é onde o giro começa e onde ele termina, porque desde o patch 2.4.3 ele vai até onde o alvo estava em vez de segui-lo, e você pode começar um novo no instante em que o último acaba. O Venom sobe antes do grupo e o Fade ou o Burst of Speed fica de pé o tempo todo. O personagem por baixo está fazendo o trabalho que a garra não faz: o Claw Mastery são +220% de Attack Rating e +111% de Enhanced Damage em cada acerto, o Weapon Block é 65% de chance de bloqueio que continua valendo integralmente enquanto você gira, e o Venom é o dano que um imune a físico não para.",
    strengths: [
      "**Duas armas, as duas lidas.** Desde o 2.4.3 empunhar duas garras faz a média do frame de ataque de cada uma em vez de ignorar a secundária, e cada ataque escolhe dois alvos — então a segunda garra é metade da build e não um bastão de `+skills`",
      "**O Claw Mastery finalmente vale vinte pontos**: +220% de Attack Rating, +111% de Enhanced Damage e uma chance de acerto crítico subindo em direção a `Param6 = 25`. Ele é um ponto em toda outra página desta classe e nada nas duas páginas de chute",
      "**Deadly Strike funciona aqui.** O Highlord's Wrath e a Gore Rider são comprados pelo motivo pelo qual costumam ser comprados, o que não é verdade em nenhuma das duas chutadoras",
      "**O Weapon Block é uma exceção nominal nas regras de bloqueio** — girando você bloqueia integralmente, onde correndo o valor cai a um terço",
      "Os 216–471 de dano mágico do Chaos não são físicos, então os imunes a físico que fecham o Dragon Tail inteiro não fecham esta build",
      "Increased Attack Speed de qualquer slot conta, o que devolve vida a luvas, elmo e joias",
      "Sem problema de mana: `AttackNoMana = 1`, então o custo é pago para iniciar o giro e não por acerto",
    ],
    weaknesses: [
      "**O botão não existe enquanto o Chaos não existir.** A Ohm é nível 57 e a runeword só entra em garra. Não há versão inicial desta build e não há como evoluir com ela",
      "**+2 em skills de Assassin e +3 em Martial Arts não fazem nada pela skill de dano.** Só +All Skills alcança um oskill, o que apaga a maior parte dos afixos pelos quais o resto da classe faz compras",
      "**Sem cargas.** O Whirlwind não carrega a flag `finishing`, então os maiores multiplicadores da árvore de Martial Arts ficam indisponíveis — esta build não tem Tiger Strike",
      "Fraca em alvo único: o bônus da própria skill são +30% no nível 1, não há multiplicador para empilhar, e empunhar duas garras gasta as duas escolhas em dois alvos",
      "**Se os procs de Frozen Orb e Charged Bolt do próprio Chaos disparam durante o giro não está estabelecido**, então as duas linhas que parecem melhores no item são as duas com que você não pode contar",
      "Não existe tabela de frames publicada para garra, então planejar velocidade de ataque é direcional e não exato",
      "Uma Assassin não tem mastery, não tem Battle Orders e não tem Berserk — um Bárbaro fazendo a mesma coisa está fazendo melhor",
    ],
    flexPoints: [
      "Não existem. Sessenta e sete no núcleo, quarenta e três em exatamente um pacote, e 110 é o total.",
      "**Não gaste em Tiger Strike nem em nenhuma outra carga.** O Whirlwind não carrega a flag `finishing`, então uma carga de pé na frente de um giro nunca é liberada. É o erro mais caro disponível nesta página.",
      "**Não gaste no Whirlwind.** Não há o que gastar: ele é um oskill de item e a tela de skills não tem entrada para ele.",
    ],
    skillPackages: {
      "whirlwind-43": {
        name: "Os últimos quarenta e três pontos",
        intro:
          "O núcleo são 67 de 110 e ele fecha de um jeito incomum: **a skill de dano não leva ponto nenhum**, Claw Mastery, Venom e Weapon Block estão cada um em vinte, e nada no grafo alimenta nenhum dos três. Então os quarenta e três restantes não compram dano — compram o formato do personagem em volta de um botão que já está tão bom quanto vai ficar. **Pegue exatamente um.** Cada um custa exatamente quarenta e três e fecha em 110. Os dois primeiros são opostos por mecânica além de por orçamento: Fade e Burst of Speed escrevem o mesmo tipo de estado próprio e conjurar um derruba o outro.",
        packages: {
          stand: {
            name: "Fade e Blade Shield — ficar dentro",
            when: "**Pegue para o Hell e para o Hardcore.** O giro estaciona você dentro do grupo, então torne o dentro seguro e torne o dentro doloroso. O Fade leva a resistência elemental em direção a `Param2 = 75`, adiciona redução de dano físico com `Param7/8 = 1` de base e por nível, e corta duração de maldição em direção a 90% — que é a resposta ao Iron Maiden, e o Iron Maiden é pior para esta build do que para qualquer outra da classe porque reflexão é cobrada por acerto e este ataque é só acertos.",
            tradeoff: "Você abre mão do Burst of Speed, e com ele da maior fonte de velocidade de ataque da classe. O giro fica mais lento e o personagem para de morrer.",
            skillNotes: {
              fade: "Resistências, redução de dano físico, e a linha de duração de maldição. Ele exclui o Burst of Speed, e é essa a troca inteira.",
              "fire-blast": "O primeiro elo da cadeia de Traps. Ele está aqui para ser atravessado, não apertado.",
              "blade-sentinel": "O segundo elo, e um dos dois pré-requisitos do Blade Fury.",
              "wake-of-fire": "O outro pré-requisito do Blade Fury.",
              "blade-fury": "Pré-requisito do Blade Shield. Um ponto, e é uma resposta à distância perfeitamente boa no grupo raro em que você prefere não entrar.",
              "blade-shield": "**`SrcDam = 96` — três quartos do mesmo dano de arma que o giro usa**, aplicado a tudo dentro de `Param4 = 6` a cada `Param3 = 25` frames, enquanto estiver de pé. É a única forma de esta build causar dano sem apontar, e ela roda enquanto você gira.",
            },
            gearNote: "Resistência chega do Fade, então anéis e charms viram Attack Rating e vida. O Blade Shield lê o mesmo dano de garra que o giro lê, o que é um segundo motivo para comprar a maior rolagem de Enhanced Damage que você encontrar.",
            contentNote: "Chaos Sanctuary, Worldstone Keep, Hardcore, e qualquer lugar onde o Iron Maiden esteja na lista de maldições.",
            remainderNote: "Nenhum. Quarenta e três pontos, e o plano fecha em 110.",
          },
          speed: {
            name: "Burst of Speed e Cloak of Shadows — girar mais rápido",
            when: "**Pegue para limpar, e note que o 2.4.3 é por que isto é uma escolha de verdade.** Antes daquele patch o Whirlwind lia velocidade de ataque só da arma; agora ele lê de todo o equipamento, e o `Param3/4 = 15 → 60` do Burst of Speed vem de skill e não sofre diminuição — o maior número isolado de velocidade disponível a esta classe. O Cloak of Shadows é o que transforma golpes a mais em golpes que entram.",
            tradeoff: "Você abre mão do Fade, e portanto das resistências, da redução de dano físico e da redução de duração de maldição. No Chaos Sanctuary essa é a troca errada.",
            skillNotes: {
              "burst-of-speed": "**Até 60% de velocidade de ataque, sem diminuição, mais velocidade de corrida.** Ele não passa pelo retorno decrescente da fórmula de item, e desde o 2.4.3 o giro o lê.",
              "cloak-of-shadows": "Uma cegueira longa e uma redução de defesa que chega a `Param5 + 19 × Param6` em tudo dentro do raio. Mais acertos só são mais dano se eles entrarem.",
              "mind-blast": "Os últimos cinco pontos. `Param1 = 50` de base e `Param2 = 5` por nível, então seis são 75 frames de atordoamento em vez de 55 — três segundos em vez de pouco mais de dois, no botão que compra espaço para um personagem corpo a corpo começar o próximo giro.",
            },
            gearNote: "Increased Attack Speed em qualquer das duas garras conta, e Increased Attack Speed em qualquer outro lugar também — o oposto do que as páginas de chute dizem. Cannot Be Frozen importa: estar gelada deixa a mesma animação mais lenta.",
            rotationNote: "Cloak primeiro, depois o giro. A cegueira entra antes do primeiro acerto e não depois dele.",
            contentNote: "Terror Zones, o Cow Level, Travincal, e qualquer lugar onde o problema é uma sala e não um monstro.",
            remainderNote: "Nenhum. Quarenta e três pontos exatos.",
          },
          shadow: {
            name: "Fade e Shadow Master — colocar outra coisa na frente",
            when: "**Pegue se o problema é ser o único alvo.** Uma sombra de vinte pontos carrega resistências em direção a `Param4 = 90`, tem vida escalando com `Param1 = 15` por nível e usa as suas skills, e é o mais perto que esta classe chega dos Battle Orders que ela não ganha. O Fade está aqui também porque um personagem corpo a corpo cujo plano é 'estar em outro lugar' ainda precisa sobreviver aos momentos em que não está.",
            tradeoff: "Você abre mão do Burst of Speed e do Blade Shield ao mesmo tempo — nada de velocidade sem diminuição, e nada de dano que você não mirou.",
            skillNotes: {
              fade: "Resistências, redução de dano físico e a linha de duração de maldição.",
              "shadow-master": "Ela substitui o Shadow Warrior em vez de se somar a ele — um slot de `pettype` entre os dois. O que ela compra é um segundo corpo num grupo que de outra forma seria inteiramente seu.",
              "mind-blast": "Os últimos cinco pontos, em duração de atordoamento e numa chance de conversão maior. Monstros convertidos são mais corpos, que é o mesmo plano da sombra.",
            },
            gearNote: "A Faster Cast Rate finalmente faz alguma coisa — pelo Mind Blast, e por nada com que você ataque.",
            contentNote: "Jogos em players 8, Terror Zones densas, e o Hell inteiro antes de a segunda garra estar pronta.",
            remainderNote: "Nenhum. Quarenta e três pontos exatos.",
          },
        },
      },
    },
    statPlan: {
      strength: "**O que as garras pedirem, e elas pedem muito.** Runic Talons querem 115 e Feral Claws 113, e você precisa de duas. É o maior requisito de força de qualquer página de Assassin e é a razão de as bases elite chegarem tarde.",
      dexterity: "**O mesmo número de novo, e essa é a armadilha.** Garras são a única família de armas que pede tanta dexterity quanto força — Runic Talons querem 115 de cada. Attack Rating não é o motivo para comprar; os +220% do Claw Mastery cobrem isso. O requisito da base é.",
      vitality: "Todo o resto, que não será tanto quanto você gostaria.",
      energy: "Nenhum. `AttackNoMana = 1` significa que o giro custa mana para começar e não por acerto.",
      notes: [
        "**Duas garras elite são cerca de 230 pontos de requisito divididos entre dois atributos.** Planeje a base em que vai terminar antes de gastar qualquer coisa: Greater Talons pedem 79/79 e Runic Talons 115/115 pela mesma velocidade −30.",
        "O requisito de nível de uma garra com Chaos é 57, vindo da Ohm. Nada nesta build acontece antes disso.",
        "Se você pegar o pacote do Fade, os slots de resistência liberam, e esses pontos vão para vitality em vez de mais Attack Rating.",
      ],
    },
    breakpointWhy: {
      "fhr-48":
        "**Obrigatório.** Um giro interrompido é um giro que precisa ser recomeçado, e você só pode começar um novo depois que o último terminou.",
      "fbr-86":
        "O Weapon Block são vinte pontos do núcleo e bloqueia integralmente enquanto você gira, então a recuperação é o que decide se o bloqueio valeu a pena.",
      "fcr-65":
        "**Só para o Mind Blast e os buffs.** A taxa de conjuração encurta a animação `SC` da Assassin de 16 frames para 11 e não toca em nada com que você ataque.",
    },
    breakpointNotes:
      "**Não há linha de Increased Attack Speed, e por um motivo diferente do resto desta classe.** O patch 2.4.3 reescreveu como a cadência do giro é calculada e disse isso com todas as letras: \"o Whirlwind agora incorpora Increased Attack Speed (IAS) de todo o equipamento. Os frames entre cada ataque do Whirlwind são iguais ao frame de ataque de um ataque básico daquele personagem (modificado por increased attack speed). Empunhando duas armas, o frame de ataque de cada arma será promediado (arredondando para cima).\" Três consequências, e as três contradizem conselhos que ainda se repetem em todo lugar. **Increased Attack Speed em luvas, elmo e joias conta**, onde a regra de 2011 que todo mundo cita diz que só a arma conta. **A garra da mão secundária não é ignorada** — o frame de ataque dela é metade da média, então a base dela e o afixo dela importam, o inverso da regra que este site publica nas páginas de chute. E **as garras lentas foram as que mais ganharam**, porque o patch termina dizendo que \"armas mais lentas atacarão notavelmente mais rápido\". O que não é publicado aqui é uma tabela. A única matriz de D2R publicada de forma independente cobre o Bárbaro, ela se reproduz exatamente a partir de uma fórmula arredondada para baixo com uma constante por classe de arma, e essa constante não é derivável para garra: o ataque de garra da Assassin são 11 frames em velocidade de animação 208, uma velocidade de animação que nenhuma linha de Bárbaro usa. Compre as bases de garra mais rápidas que você conseguir usar — Runic Talons e Greater Talons são −30 e Hatchet Hands e Fascia são +10, quarenta pontos de diferença antes de um único afixo —, pegue Increased Attack Speed onde for de graça, e use uma calculadora de velocidade de ataque para um par específico.",
    skillNotes: {
      "claw-mastery":
        "**O dano próprio da build, e o achado sobre o qual a página se apoia.** `ln12` são +30% de Attack Rating de base e +10% por nível; `ln34` são +35% de Enhanced Damage de base e +4% por nível; `dm56` é uma chance de acerto crítico subindo em direção a `Param6 = 25`. Vinte pontos são +220% de Attack Rating e +111% de Enhanced Damage em cada acerto do giro. Ele é `itypea1 = h2h` e um giro é um ataque corpo a corpo de garra, então ao contrário do que acontece num chute ele se aplica inteiro.",
      venom:
        "**O dano que um imune a físico não para.** Ele escreve `poisonmindam` e `poisonmaxdam` no personagem através do `aurastate = venomclaws` em vez de numa arma, então não fica restrito a uma garra e pega carona em cada acerto das duas. A duração dele é fixada em dez frames e sobrescreve em vez de acumular, o que combina com um ataque que acerta muitas vezes.",
      "weapon-block":
        "**Até 65% de bloqueio, e ele continua valendo enquanto você gira.** `Param2 = 65` é o teto, e é o teto da própria skill e não os 75 de um escudo. Ele precisa de `itypea1 = h2h` e `itypeb1 = h2h` — uma garra em cada mão, que esta build tem porque as duas mãos são a arma. O Whirlwind é nomeado como estado de bloqueio integral nas regras, onde correr corta o valor a um terço.",
      "burst-of-speed":
        "Pré-requisito do Fade, e o Claw Mastery é o pré-requisito dele — já pago. Um ponto, a menos que você pegue o pacote de velocidade, que é onde o caso pelos vinte é feito e onde o 2.4.3 mudou a resposta.",
      fade: "Pré-requisito do Venom. Um ponto, a menos que você pegue um pacote que o suba. Ele e o Burst of Speed se sobrescrevem, então os dois nunca podem estar de pé juntos.",
      "psychic-hammer":
        "Pré-requisito do Cloak of Shadows, e ele também alimenta a chance de conversão do Mind Blast através de `skill('Psychic Hammer'.blvl)`.",
      "cloak-of-shadows":
        "Cega o grupo e corta a defesa dele em `Param5 = 15` de base e `Param6 = 3` por nível. Numa build que rola acerto muitas vezes por segundo, redução de defesa é atributo de ataque.",
      "shadow-warrior":
        "Pré-requisito do Shadow Master, e substituído por ele — dividem um `pettype` com espaço para um.",
      "shadow-master":
        "Um ponto é uma sombra, e um corpo entre você e o grupo vale mais aqui do que numa página à distância. Mais dezenove é um pacote.",
      "mind-blast":
        "`Param1 = 50` de atordoamento de base e `Param2 = 5` por nível, mais uma chance de conversão. A única skill desta página que a Faster Cast Rate toca.",
    },
    immunityPlan:
      "**Esta build responde à imunidade a físico duas vezes, e é esse o argumento a favor dela contra as duas páginas de chute.** O dano do próprio giro é o da garra, então um imune a físico leva quase nada dele — mas duas das três coisas que este personagem causa não são físicas. **Os 216–471 de dano mágico do Chaos** são um tipo de dano separado com resistência separada, e o censo deste site lista mágico entre as imunidades comuns em exatamente uma das suas vinte áreas. O **Venom** são vinte pontos de núcleo de veneno que pegam carona em cada acerto das duas garras, porque ele escreve os atributos no personagem e não numa arma. Então um grupo imune a físico é uma luta mais lenta e não uma parede, o que é o oposto do Dragon Tail — lá o segundo tipo de dano é calculado *a partir* do físico, então um imune a físico fecha as duas metades de uma vez. Onde o giro bate numa parede é no mesmo lugar em que toda build física bate: um **sunder charm Bone Break** coloca um imune a físico em 95% de resistência a físico e restaura o maior dos três números. Vale ter e não é obrigatório, que é uma frase que pouquíssimas páginas corpo a corpo deste site conseguem escrever. Duas ressalvas. **O Crushing Blow é físico**, então ele não faz absolutamente nada através de uma imunidade a físico, e é a linha mais vendida além da conta em equipamento corpo a corpo. E o **Venom é peso morto no Mausoleum, no Pindleskin e contra a Andariel**, que listam veneno — o veneno é resposta a um problema específico, não um piso.",
    mercenaryNotes:
      "**Um mercenário com Might, e é nele que vai todo proc com que você quer contar.** Might sobe dano físico e o maior número desta build é físico, então a aura é a escolha direta. A metade menos óbvia é a interessante: como não está estabelecido se um efeito de conjurar ao golpear dispara durante o Whirlwind, qualquer coisa que você realmente queira que aconteça — um Decrepify para quebrar imunidade a físico, um Amplify Damage, um Life Tap — pertence à arma do mercenário e não à sua. Um Reaper's Toll num mercenário do Ato 2 é a resposta padrão e é padrão exatamente por isso: ele golpeia normalmente, então os procs dele não estão em dúvida. O **Insight** é a alternativa se você quiser a mana em vez do dano, embora uma skill que paga o custo na ativação e não por acerto raramente precise.",
    farmingWhy: {
      "travincal-hell":
        "**A melhor run da página.** Fogo e raio são as imunidades comuns e físico não é, então o giro entra inteiro — e o Conselho fica perto o bastante para um ataque que escolhe dois alvos por golpe estar escolhendo dois dos três pelos quais você veio. Curta, repetível, e larga as runas altas de que a segunda garra precisa.",
      "mausoleum-hell":
        "Veneno e frio são as imunidades comuns, então o Venom é peso morto e todo o resto entra. A densidade é para o que serve um ataque móvel de múltiplos acertos, e não há nada aqui que puna ficar no meio.",
      "pindleskin-hell":
        "Frio e veneno, um superunique fixo e um corredor curto. O Venom não faz nada e as garras fazem tudo, o que é uma demonstração limpa de que o veneno é resposta a um problema específico e não o dano da build.",
      "pit-hell":
        "**Nível de área 85, e a história de imunidade aqui é o que separa esta página das de chute.** Físico é uma das imunidades comuns, e onde o Dragon Tail perde as duas metades do dano dele para isso, esta build mantém duas — o dano mágico do Chaos não é físico e o veneno do Venom também não. Mais lenta naqueles grupos, não parada por eles.",
      "secret-cow-level-hell":
        "Físico é a imunidade listada e a densidade é exatamente o que o giro quer. Traga um charm Bone Break se tiver um; sem ele o dano mágico e o veneno carregam os grupos imunes num ritmo mais lento.",
      "lower-kurast-hell":
        "Fogo e veneno são as imunidades comuns e os baús é que são o ponto, não os monstros, o que combina com um ataque que atravessa uma tela e continua.",
      "countess-hell":
        "Fogo é a imunidade comum, os grupos da torre são apertados, e as runas são a razão de vir — esta build gasta mais runas que qualquer outra página da classe.",
      "mephisto-hell":
        "Fogo e raio, então nada aqui resiste ao que você faz. Ele é alvo único, que é o formato em que esta build é pior — o bônus da própria skill são +30% e não há carga para empilhar por cima — mas os drops valem uma luta lenta.",
      "chaos-sanctuary-hell":
        "**O único lugar desta lista em que é preciso cuidado.** Fogo, raio e físico são todos imunidades comuns aqui, e a sala é a casa do Iron Maiden — que é pior para esta build do que para qualquer outra da classe, porque reflexão é cobrada por acerto e este ataque é feito só de acertos. Pegue o pacote do Fade antes de vir, pela linha de duração de maldição e não pelas resistências.",
    },
    levelingPath: {
      summary:
        "**Não se evolui com o Whirlwind, porque não há Whirlwind antes do nível 57 na melhor das hipóteses.** Evolua como Kicksin: o dano é uma bota, funciona do nível 1, e ela compartilha as garras do Claw Mastery, o Venom, o Fade e a suíte Shadow inteira com este plano. Guarde as garras de três sockets que aparecerem. Quando o primeiro Chaos ficar pronto, faça respec, tire vinte pontos do Dragon Talon e coloque no Claw Mastery, e o personagem que você vinha jogando vira este com o mesmo equipamento em oito dos dez slots.",
      respecAt:
        "No instante em que o Chaos ficar pronto. Antes disso não há para o que fazer respec.",
    },
    selfFoundNotes:
      "**Honestamente: esta é a página menos amigável a self-found da classe.** A build não existe enquanto você não tiver uma **Ohm**, e não vira ela mesma enquanto você não tiver uma segunda garra de três sockets que mereça runas — uma **Jah** se a resposta for Fury, outra Ohm se for um segundo Chaos. Nada mais na página é difícil: Gore Rider, Vampire Gaze, String of Ears e Raven Frost são todos comuns, a armadura é uma runeword média, e o plano de skills inteiro é pontos e não drops. Mas as duas garras são a build, e não há item substituto nem versão barata do botão. **O conselho honesto é evoluir como Kicksin**, que precisa de uma bota e não de uma runa, farmar Travincal e Terror Zones atrás das runas com esse personagem, e fazer respec no momento em que o primeiro Chaos ficar pronto. Claw Mastery, Venom e Weapon Block são todos úteis no caminho, o que suaviza o respec — os vinte pontos no Dragon Talon são os únicos que você perde.",
    hardcoreNotes:
      "**Pegue o pacote do Fade, e leia a linha de maldição antes das resistências.** O Iron Maiden é o perigo específico desta página e é pior aqui do que em qualquer outro lugar da classe: dano refletido é cobrado por acerto, e este ataque dá mais acertos por segundo que qualquer outro ataque de Assassin. A redução de duração de maldição do Fade chega em direção a `Param4 = 90`, que é a diferença entre uma maldição da qual você sai girando e uma que te mata no meio do giro. Fora isso a build é incomumente sólida para um personagem corpo a corpo de Hardcore: **o Weapon Block bloqueia integralmente enquanto você gira** — ele é nomeado como exceção nas regras de bloqueio, onde correr corta o valor a um terço — então um personagem com duas garras e 65% de bloqueio passa a luta inteira nesse número. A Faster Hit Recovery está marcada como obrigatória porque um giro interrompido precisa ser recomeçado, e Cannot Be Frozen importa porque uma animação gelada é uma animação lenta. As duas salas a evitar são o Chaos Sanctuary, pela maldição, e qualquer grupo que seja ao mesmo tempo imune a físico e perigoso, porque a luta ali é longa.",
    gearSets: {
      starter: {
        goal: "Você ainda não é esta build e não tem como ser. Evolua uma Assassin, coloque os primeiros pontos onde este plano quer, e mate com um golpe comum — que o Claw Mastery sobe inteiro.",
        nextUpgrade: "Qualquer garra de três sockets que você consiga guardar, e o Venom no nível 30.",
        picks: {
          "weapon-0": {
            label: "Qualquer garra, e guarde as bases de três sockets",
            why: "**O Chaos precisa de três sockets e só entra em garra.** Entre as bases de garra, Blade Talons, Claws e Scissors Katar aceitam três em qualidade normal e Katar, Cestus, Wrist Blade, Fascia e Hatchet Hands não. Nada que você achar agora vai ser a definitiva, mas o hábito de conferir é o plano de equipamento inteiro mais tarde.",
            lookFor: ["Três sockets", "+skills", "Increased Attack Speed"],
          },
          "offhand-0": { label: "Uma segunda garra", why: "O Weapon Block precisa de `itypea1 = h2h` e `itypeb1 = h2h` — uma garra em cada mão — a partir do nível 12, e esta build nunca coloca outra coisa em nenhum dos dois slots." },
          "body-0": { why: "Duas runas, e a Faster Hit Recovery é o atributo em que esta build está marcada como obrigatória." },
          "helm-0": { why: "+1 em All Skills, que é o tipo de `+skills` que ainda vai estar funcionando quando o Whirlwind chegar." },
          "ring1-0": { why: "Attack Rating e magic find, a partir do nível 7." },
          "belt-0": { label: "O maior cinto que você conseguir usar", why: "Poções. Não há leech no plano até uma arma fornecer." },
        },
      },
      nightmare: {
        goal: "Terminar o núcleo. Claw Mastery, Venom a partir do nível 30 e Weapon Block são o personagem inteiro, e nenhum dos três precisa da runeword.",
        nextUpgrade: "Uma Ohm, e uma garra exceptional que mereça recebê-la.",
        picks: {
          "weapon-0": {
            label: "Uma garra exceptional de três sockets, guardada vazia",
            why: "**Greater Talons (base −30 de velocidade), Greater Claws (−20), Quhab e Scissors Quhab (0) aceitam três sockets**; a Hand Scythe aceita dois e nunca poderá receber o Chaos. Greater Talons pedem 79 de força e 79 de dexterity, que é o número a planejar. Ethereal serve — uma garra com runeword não é consertada, e o dano extra é de graça.",
            lookFor: ["Três sockets", "Qualidade superior", "Ethereal"],
          },
          "offhand-0": { label: "Uma segunda garra com +Shadow Disciplines", why: "Os `+skills` das duas garras são lidos, e Shadow Disciplines é a árvore em que esta build maximiza três skills." },
          "body-0": { why: "45% de Increased Attack Speed que — ao contrário das páginas de chute — conta inteiro assim que o Whirlwind chegar, mais uma chance de conjurar Fade ao ser atingida." },
          "helm-0": { why: "Roubo de vida e redução de dano a partir do nível 41. Leech é `damagerelated`, e um elmo não é arma, então ele se aplica a cada acerto e não aos de uma garra só." },
          "gloves-0": { label: "Luvas raras com 20% de Increased Attack Speed", why: "Desde o 2.4.3 isto conta. Antes não contava, e a maioria dos guias ainda diz que não conta." },
          "belt-0": { why: "Redução de dano e roubo de vida, num personagem parado no meio de tudo." },
          "boots-0": { why: "**Crushing Blow, Open Wounds e Deadly Strike, e aqui os três funcionam.** As páginas de chute compram isto por dois dos três; um giro golpeia com a garra, então o Deadly Strike está vivo." },
          "ring1-0": { why: "Cannot Be Frozen e Attack Rating. Estar gelada deixa a animação do giro mais lenta como qualquer outra." },
        },
      },
      "early-hell": {
        goal: "**Chaos.** A Ohm é nível 57, então este é o primeiro tier em que a build pode existir. Uma garra já basta para começar.",
        nextUpgrade: "Uma segunda garra com runeword, e a força para uma base elite.",
        picks: {
          "weapon-0": {
            label: "Chaos — Fal Ohm Um, numa garra de três sockets",
            why: "**A build.** `oskill Whirlwind` no nível 1, 240–290% de Enhanced Damage, 216–471 de dano mágico, 35% de Increased Attack Speed e dois procs ao golpear. O `itype1 = \"h2h\"` a torna exclusiva de garra, e a Ohm fixa o requisito de nível em 57. Faça na base de três sockets mais rápida que você conseguir usar — Greater Talons a −30 se as bases elite ainda estiverem fora de alcance, e qualidade superior pelo Enhanced Damage extra por baixo do da própria runeword.",
            lookFor: ["Garra de três sockets", "A base mais rápida possível", "Qualidade superior"],
          },
          "offhand-0": { label: "Uma garra com +Shadow Disciplines e Increased Attack Speed", why: "O frame de ataque dela é promediado com o da primeira, então a base dela e o Increased Attack Speed dela contam os dois. Isso é específico do Whirlwind e específico do 2.4.3." },
          "body-0": { why: "15% de Crushing Blow, Enhanced Damage e Faster Hit Recovery por três runas médias." },
          "body-0-alt0": { why: "+50 em todas as resistências se a penalidade do Hell for o problema imediato." },
          "helm-0": { why: "Leech e redução de dano, com sockets para resistências.", sockets: "Dois — Um e Um, ou joias de velocidade de ataque." },
          "gloves-0": { label: "Luvas de sangue craftadas com Increased Attack Speed", why: "Vida, leech e velocidade. Os três agora alcançam o giro." },
          "belt-0": { why: "Redução de dano e leech." },
          "boots-0": { why: "Crushing Blow, Open Wounds e Deadly Strike, os três lidos por um giro." },
          "ring1-0": { why: "Cannot Be Frozen, e 150–250 de Attack Rating." },
          "ring2-0": { why: "**+1 em All Skills, que é o tipo que alcança o Whirlwind.** Um anel raro com +2 em skills de Assassin não existiria, e se existisse não ajudaria o giro." },
          "amulet-0": { why: "+1 em All Skills, 20% de Increased Attack Speed e Deadly Strike que escala com o seu nível — e nesta página as três linhas fazem alguma coisa." },
        },
      },
      budget: {
        goal: "A segunda garra, e a escolha que define o personagem: outro Chaos, ou Fury.",
        nextUpgrade: "Bases de garra elite, e a força e a dexterity para segurar duas.",
        picks: {
          "weapon-0": { label: "Chaos na melhor garra de três sockets que você conseguir usar", why: "O Enhanced Damage e o dano mágico são lidos da garra que deu o acerto, então a base sob a runeword é o número que se move." },
          "offhand-0": {
            label: "Fury — Jah Gul Eth, numa segunda garra de três sockets",
            why: "**`itype1 = \"mele\"`, e o `itemtypes.json` dá a `h2h` o pai `mele`, então uma garra aceita.** 209% de Enhanced Damage, 40% de Increased Attack Speed, 66% de Open Wounds, 33% de Deadly Strike e 6% de roubo de vida. Todos são `damagerelated`, então valem para os acertos que *esta* garra dá — que num ataque que alterna são cerca de metade deles. A Jah é nível 65.",
            lookFor: ["Garra de três sockets", "A base mais rápida possível"],
          },
          "offhand-0-alt0": { label: "Um segundo Chaos", why: "Duas garras com Chaos colocam os 216–471 de dano mágico em cada acerto em vez de metade deles. O Fury traz leech e Open Wounds que o Chaos não tem. Dano contra sustentação, e a mecânica é a mesma dos dois lados." },
          "body-0": { why: "300% de Enhanced Damage, e Enhanced Damage de armadura não é restrito a uma arma — ele alcança os acertos das duas garras." },
          "body-0-alt0": { why: "Crushing Blow e recuperação se as runas ainda não estiverem lá." },
          "helm-0": { why: "Leech e redução de dano, ainda a resposta mais barata do slot.", sockets: "Dois — Um e Um." },
          "gloves-0": { why: "**Pelos 7–10% de roubo de vida e pelos 25% de Open Wounds, não pelo Life Tap.** O Life Tap é `hit-skill` — chance de conjurar ao golpear — que é a única coisa desta página que não está estabelecida como funcionando durante o giro. As duas linhas acima dele estão, e elas bastam." },
          "belt-0": { why: "Redução de dano e leech." },
          "boots-0": { why: "Crushing Blow, Open Wounds e Deadly Strike." },
          "ring1-0": { why: "Cannot Be Frozen e Attack Rating." },
          "ring2-0": { why: "+1 em All Skills." },
          "amulet-0": { why: "+1 em All Skills, velocidade de ataque e Deadly Strike." },
        },
        charms: [{ label: "Annihilus, grand charms com +1 Shadow Disciplines, e um sunder charm Bone Break", why: "**O Annihilus é +1 em All Skills e portanto o único charm do jogo que sobe o giro.** Os grand charms sobem Claw Mastery, Venom e Weapon Block, que é onde os números próprios do personagem moram. O Bone Break abre os imunes a físico — embora esta build já responda a eles duas vezes, com dano mágico e com veneno." }],
        weaponSwap: [{ why: "Battle Orders, no nível 57. A Assassin não tem skill de vida própria e este é um personagem corpo a corpo." }],
      },
      optimized: {
        goal: "Bases elite sob as duas runewords, e a força e a dexterity para usá-las.",
        nextUpgrade: "Os últimos pontos de Enhanced Damage, e um elmo que não custe resistência.",
        picks: {
          "weapon-0": { label: "Chaos em Runic Talons ou Feral Claws", why: "**−30 e −20 de velocidade base, três sockets cada, requisitos 115/115 e 113/113.** A velocidade da base vale mais que o afixo e o requisito é o preço." },
          "offhand-0": { label: "Fury ou um segundo Chaos em Runic Talons", why: "Os frames de ataque das duas garras são promediados, então uma garra secundária lenta deixa o giro inteiro lento — que é a parte do 2.4.3 que a maioria dos conselhos de equipamento ainda não alcançou." },
          "body-0": { why: "300% de Enhanced Damage num personagem cujo dano é todo de arma." },
          "body-0-alt0": { why: "+2 em All Skills e +65 em todas as resistências — os +2 alcançam o Whirlwind, o que quase nada mais faz." },
          "helm-0": { why: "+2 em skills de Assassin, 20% de Increased Attack Speed e 8–10% de roubo de vida. Os +2 não fazem nada pelo Whirlwind e muito por Claw Mastery, Venom e Weapon Block — é o item mais claro da página para essa divisão.", sockets: "Um — um Um, ou um rubi pelos −30% de resistência a fogo." },
          "gloves-0": { why: "Roubo de vida e Open Wounds. O Life Tap é um bônus com o qual você não pode contar." },
          "belt-0": { why: "+1 em All Skills, que nesta página é uma linha de dano para o giro além de tudo o mais." },
          "boots-0": { why: "Crushing Blow, Open Wounds e Deadly Strike — os três lidos por um golpe de garra." },
          "ring1-0": { why: "Cannot Be Frozen e Attack Rating." },
          "ring2-0": { why: "+1 em All Skills." },
          "amulet-0": { why: "+2 em All Skills e +30 em todas as resistências. O único amuleto que sobe as duas metades deste personagem ao mesmo tempo." },
          "amulet-0-alt0": { why: "Se a velocidade de ataque e o Deadly Strike valerem mais que as resistências." },
        },
        charms: [{ label: "Annihilus, Hellfire Torch, grand charms com +1 Shadow Disciplines, Bone Break", why: "**O Annihilus sobe o giro e a Torch não** — os +3 da Torch são de classe, e o Whirlwind não é uma skill de Assassin. Ela continua valendo pelo Claw Mastery, pelo Venom e pelo Weapon Block." }],
        weaponSwap: [{ why: "Battle Orders." }],
      },
      bis: {
        goal: "O teto: duas garras elite com runeword, cada ponto de +All Skills que o jogo oferece, e bloqueio e redução de dano suficientes para ficar dentro do grupo.",
        nextUpgrade: "Nada.",
        picks: {
          "weapon-0": { label: "Chaos em Runic Talons superiores", why: "−30 de velocidade base e a maior rolagem de Enhanced Damage que a base consegue carregar sob os 240–290% da própria runeword." },
          "offhand-0": { label: "Um segundo Chaos em Runic Talons superiores", why: "**Duas garras com Chaos colocam 216–471 de dano mágico em cada acerto em vez de metade deles**, e mágico é o único tipo que o censo deste site registra como imunidade comum numa única área. O Fury continua sendo a resposta se o problema for leech e não dano." },
          "body-0": { why: "+2 em All Skills, +65 em todas as resistências e 8% de redução de dano. Os +2 valem +10% de dano de giro e 10% de Attack Rating além de tudo o mais." },
          "helm-0": { why: "Redução de dano, resistências e dois sockets sem a penalidade de fogo do Andariel's, num personagem que está sempre cercado.", sockets: "Dois — Um e Um, ou joias de 15% de Increased Attack Speed." },
          "gloves-0": { why: "Roubo de vida e Open Wounds." },
          "belt-0": { why: "+1 em All Skills." },
          "boots-0": { why: "Crushing Blow, Open Wounds e Deadly Strike, os três vivos." },
          "ring1-0": { why: "Cannot Be Frozen e Attack Rating." },
          "ring2-0": { why: "+1 em All Skills." },
          "amulet-0": { why: "+2 em All Skills e resistências." },
        },
        charms: [{ label: "Annihilus, Hellfire Torch, grand charms com +1 Shadow Disciplines, Bone Break", why: "Todo +1 em All Skills são +5% de dano de giro e +5% de Attack Rating; todo +1 em Shadow Disciplines são Claw Mastery, Venom e Weapon Block." }],
        weaponSwap: [{ why: "Battle Orders." }],
      },
    },
  },
};
