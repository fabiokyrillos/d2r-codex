import type { BuildCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR das quatro builds de Warlock.
 *
 * Nomes próprios do jogo — skills, itens, runewords, runas, áreas — ficam em
 * inglês (ADR 0003). Os arrays `lookFor` são texto de afixo do jogo e por isso
 * não são traduzidos em nenhuma build deste site.
 *
 * Termos de mecânica mantidos em inglês por serem nomes próprios: hard points,
 * Crushing Blow, Deadly Strike, Open Wounds, Amplify Damage, Life Tap, Faster
 * Cast Rate, sunder charm, oskill, staffmods.
 */
export const warlockBuildsPtBr: Overlay<BuildCopy> = {
  // =========================================================================
  "apocalypse-warlock": {
    summary:
      "A maior magia de fogo única do jogo, largada num raio que nada mais da classe cobre, com uma quebra de resistência embutida na própria skill.",
    playstyle:
      "Você lança uma magia enorme e anda. O Apocalypse cobre um raio de 13 com um ponto e 17 com vinte, que é maior que qualquer outra coisa que o Warlock põe no chão, e ele arranca resistência a fogo de tudo que fica dentro enquanto queima. Ring of Fire é o botão de pânico para o que encostou — dezesseis projéteis abaixo de dez hard points e trinta e dois acima — e Flame Wave é a ferramenta de corredor. Sigil: Death desce uma vez por grupo e executa qualquer coisa que caia abaixo de um décimo da vida, que é a diferença entre limpar uma sala e terminá-la. Não existe problema de mira nem canalização; a decisão é onde ficar de pé.",
    strengths: [
      "A base de 80-100 do Apocalypse é a maior tabela de dano da classe por um fator de quatro",
      "Um raio de 13 a 17 — a coisa mais larga que o Warlock consegue pôr no chão",
      "A única quebra de resistência em qualquer skill de Warlock, até 40 pontos de resistência a fogo do inimigo",
      "O núcleo fecha em 63 de 110 pontos, então o personagem fica pronto cedo e ainda tem uma segunda metade para gastar",
      "Barato de começar: Ring of Fire está disponível no nível 6 e carrega quase todo o Normal",
    ],
    weaknesses: [
      "Fogo é o elemento mais resistido no Hell — os dados de área deste próprio site registram imunidade a fogo em doze de dezoito áreas catalogadas",
      "A quebra da própria skill não vale absolutamente nada contra um monstro que continua imune",
      "O Apocalypse só abre no nível 30 e só fica pronto lá pelos oitenta e tantos",
      "Sem skill de movimento fora um Enigma; cada ponto do plano está numa árvore só",
      "A classe não tem skill de mastery elemental, então o dano vem de hard points e equipamento apenas",
    ],
    skillPackages: {
      "the-second-half": {
        name: "A segunda metade",
        intro:
          "O núcleo são 63 pontos e toda sinergia dele já está maximizada. Quarenta e sete pontos não é arredondamento — é um segundo personagem, e as duas coisas úteis a fazer com eles levam a lugares diferentes. Escolha uma.",
        packages: {
          "void-answer": {
            name: "A resposta do vazio",
            when: "Você pretende jogar Hell com este personagem e não quer doze das dezoito áreas catalogadas do site fechadas. Miasma Chain é dano mágico, e uma área do catálogo inteiro registra imunidade a isso.",
            tradeoff:
              "Quarenta pontos que poderiam ter sido demônios. Você ganha um segundo tipo de dano e absolutamente nenhuma sobrevivência a mais — esta rota é um canhão de vidro com dois canos.",
            skillNotes: {
              "miasma-chain": "A segunda barra. 6-9 mágico e de três a doze projéteis por lançamento.",
              "miasma-bolt": "+10% de dano do Miasma Chain por nível.",
            },
            rotationNote:
              "Apocalypse em tudo, e Miasma Chain no que o fogo não moveu. Você não está trocando de build no meio da luta — está trocando de elemento, que é uma tecla.",
            contentNote:
              "Chaos Sanctuary, Travincal, os Kurast Temples e o River of Flame registram imunidade a fogo. É este pacote que permite rodá-los.",
            remainderNote:
              "Sete pontos sobrando, em 103 de 110. Os dois destinos restantes sobem em degraus nos hard points dez e vinte, e sete não alcança nenhum dos dois a partir de um — então ponha em Sigil: Death e pegue o raio nos três próximos níveis.",
          },
          "demon-wall": {
            name: "O muro de demônios",
            when: "Você está jogando Hardcore, ou está jogando sozinho e preferiria não ser a única coisa na sala. Três demônios com Blood Oath atrás deles absorvem o que de outro modo chegaria num caster com 3 de vida por ponto de Vitality.",
            tradeoff:
              "Você não fica com nenhuma resposta a um imune a fogo além de um Flame Rift, e até um cair você pula esses grupos. Isso é um custo real e esta página não vai fingir o contrário.",
            skillNotes: {
              "summon-goatman": "Um ponto invoca; quantos você tem quem decide é Demonic Mastery, não esta skill.",
              "demonic-mastery":
                "Cinco hard points levam o teto de um demônio para dois e dez levam para três. Nada mais no jogo mexe nesse número, e +skills de equipamento não mexem — os dois limiares leem hard points.",
              "blood-oath":
                "Manda até 30% do dano que você toma para um demônio, e sobe a vida deles em 50% mais 35% por nível para que sobrevivam a receber isso.",
            },
            statNote:
              "Vitality importa um pouco menos aqui, porque uma parte do dano nunca chega em você. Ainda leva tudo que sobra.",
            rotationNote:
              "Invoque três antes do grupo e depois lance exatamente como antes. Os demônios não são fonte de dano e não devem ser esperados.",
            remainderNote: "Seis pontos sobrando, em 104 de 110. Sigil: Lethargy os leva rumo ao degrau de raio dos dez pontos.",
          },
        },
      },
    },
    statPlan: {
      strength: "O suficiente para a sua mão secundária, e leia a nota — esta é a stat em que a classe quebra o conselho de sempre.",
      dexterity: "Base. Nada no plano lê Dexterity e um Grimoire bloqueia sem ela.",
      vitality: "Tudo o que sobrar, em todo nível.",
      energy: "Nenhuma. A mana vem do equipamento e do Insight no mercenário.",
      notes: [
        "**O requisito de Strength é o plano de atributos.** A melhor mão secundária da classe, um Blasphemous Grimoire, pede **106 de Strength** contra uma base de 15. Todo outro caster deste site é orientado a não tocar em Strength, e esse conselho está errado aqui.",
        "Por isso os tiers abaixo de `bis` são deliberadamente montados em bases mais leves. Um **Burnt Text pede 38** e um **Occult Tome pede 82** — o mesmo slot por um terço e por quatro quintos do custo. Escolha a mão secundária primeiro e deixe ela definir o número de Strength, e não o contrário.",
        "**Levitation Mastery reduz requisitos de item em 2% por nível até um piso de −50%**, e se isso valer para armadura além de arma, cortaria o número acima pela metade. A passiva depende de segurar exatamente uma arma, e nada do que foi consultado estabelece se a redução vale só para armas. Aqui não se assume nada, e nenhum ponto é orçado para isso.",
        "Dexterity fica na base mesmo que um Grimoire possa bloquear. Um caster que está apanhando já cometeu o erro que importa, e 12 pontos de chance de bloqueio não é a correção.",
      ],
    },
    breakpointWhy: {
      "fcr-75": "O alvo padrão, e o Warlock divide a tabela com o Paladin e o Necromancer em vez de ter uma própria. Alcançável com um Spirit e um anel de cast rate.",
      "fcr-125": "O último breakpoint da tabela. Um frame por cinquenta por cento a mais de Faster Cast Rate, o que só compensa depois que o resto do equipamento está pronto.",
      "fhr-56": "O alvo de sempre na tabela de Necromancer/Druid/Warlock. Um caster que está sendo interrompido não está lançando.",
    },
    breakpointNotes:
      "Não existe linha de velocidade de ataque aqui e não existe em lugar nenhum deste site: nenhuma tabela de Increased Attack Speed é publicada para nenhuma classe, porque a velocidade de arma depende da arma base e da animação, e não do personagem sozinho. Nada nesta build balança uma arma, então nada se perde com a ausência.",
    skillNotes: {
      apocalypse: "A build inteira. 80-100 no nível 1, e o raio sobe em degraus nos hard points dez e vinte — 13, depois 15, depois 17.",
      "flame-wave": "+10% de dano do Apocalypse por nível, e uma magia de corredor utilizável por si só, com 13-17 de fogo.",
      "ring-of-fire":
        "+10% de dano do Apocalypse por nível. Também dobra a própria contagem de projéteis de dezesseis para trinta e dois no décimo hard point, então continua na barra.",
      "sigil-death":
        "Um ponto é a skill inteira. Os limiares de execução são 13% de vida fixos para um monstro normal e 10% para champion, unique ou superunique, e nenhum dos dois sobe com o nível — pontos compram raio e mais nada.",
    },
    immunityPlan:
      "**Fogo é o pior elemento em que se construir no Hell, e os dados de área deste próprio site são o argumento.** Doze das dezoito áreas catalogadas registram imunidade a fogo — Chaos Sanctuary, Travincal, os Kurast Temples, River of Flame, os Ancient Tunnels, o templo do Nihlathak, Stony Tomb, o Maggot Lair, Lower Kurast, Mephisto, a Countess e o Worldstone Keep. Esse é o custo da maior tabela de dano da classe e precisa ser entendido antes de o personagem ser criado.\n\n**A quebra do próprio Apocalypse não resolve isso.** A skill reduz a resistência a fogo do inimigo em 5 pontos mais 1 por nível, até um teto de 40. Isso é uma linha de −% de Resistência a Fogo do Inimigo, e contra um monstro cuja imunidade continua de pé ela é ignorada por completo em vez de reduzida — não vale nada ali, nem uma fração. A quebra é o que amolece um monstro resistente; não é o que torna matável um imune.\n\nEntão existem exatamente duas respostas e a build tem que pegar uma.\n\n**Um Flame Rift.** O sunder charm de fogo põe monstros imunes a fogo numa resistência que dá para reduzir de verdade, ao custo de 70 a 90 pontos da sua própria resistência a fogo. É por isso que Mara's Kaleidoscope e Chains of Honor aparecem nos tiers em que aparecem, e é um drop de nível 75 — ou seja, um plano de Hell, não de Nightmare.\n\n**O pacote do vazio.** Quarenta pontos em Miasma Chain e Miasma Bolt compram um segundo tipo de dano na mesma barra. Imunidade a mágico é registrada em exatamente uma das dezoito áreas catalogadas — o Arcane Sanctuary — então o segundo elemento fecha quase tudo que o primeiro deixa aberto, e faz isso sem depender de um drop.\n\nUm personagem que não pegar nenhuma das duas é um personagem de Normal e Nightmare. Essa é uma forma legítima de jogar e esta página não vai fingir que é um plano de Hell.",
    mercenaryNotes:
      "Act 2, Nightmare, Might para dano ou Holy Freeze para controle — Holy Freeze é a melhor resposta para um caster sem skill de movimento, porque tudo chega mais devagar. Insight na polearm é o plano de mana da build inteira: o Apocalypse custa 32 de mana na base mais 1 por nível, e nada neste plano gasta um ponto em Energy.",
    farmingWhy: {
      "mausoleum-hell":
        "Área de nível 85 a duas telas do waypoint das Cold Plains, e as imunidades registradas dela são veneno e frio — nenhuma das quais esta build causa. A melhor área do jogo para um caster de fogo, e quase ninguém a roda.",
      "pindleskin-hell":
        "Trinta segundos por run, imunidade a frio e veneno registrada, e um grupo só parado dentro de um raio. O Apocalypse aqui é uma magia que você lança uma vez.",
      "pit-hell":
        "Área de nível 85 com imunidade a físico, frio e raio registrada, e nenhuma imunidade a fogo. O tipo de dano da build é justamente o que a zona não responde.",
      "andariel-hell":
        "Só imunidade a veneno, run curta, e uma chefe que fica parada dentro de um raio de 17. Vale rodar muito depois do nível que os drops dela sugerem.",
      "chaos-sanctuary-hell":
        "A zona mais densa do jogo e exatamente o formato que uma magia de raio 17 quer. Imunidade a fogo, raio e físico são todas registradas aqui, então isto exige um Flame Rift ou o pacote do vazio antes de valer a viagem.",
      "travincal-hell":
        "O Council fica todo amontoado, o que é um lançamento. Imunidade a fogo e raio são registradas e o próprio Council não é imune a fogo, então o Flame Rift importa pelo lixo e não pelo alvo.",
    },
    levelingPath: {
      summary:
        "Ring of Fire no nível 6 limpa o Normal sozinho. Flame Wave no 18 o substitui em corredores e o Apocalypse no 30 substitui os dois. Nada no plano é desperdiçado e nenhum respec é necessário: cada ponto gasto no caminho é um ponto que a build pronta quer.",
    },
    selfFoundNotes:
      "Spirit são quatro runas comuns da Countess e Coven precisa de uma Ist, então o plano de cast rate é alcançável sem trocar com ninguém. O problema é a mão secundária: um Grimoire com +2 Warlock skills é alvo de gamble e não drop que se espera, e Measured Wrath no nível 52 é o primeiro que vale caçar. Até lá, qualquer Grimoire com a aba de Chaos ganha de um melhor rolado sem ela.",
    hardcoreNotes:
      "Pegue o muro de demônios. Três demônios com Blood Oath atrás mandam até 30% do dano recebido para um lugar que não é você, e um Warlock tem 3 de vida por ponto de Vitality em vez dos 2 da Sorceress — a classe é mais dura do que o papel sugere e o pacote se apoia nisso. O custo é ficar sem resposta a um imune a fogo até um Flame Rift cair, o que no Hardcore já é argumento para rodar o Mausoleum e o Pindleskin em vez do Chaos Sanctuary de qualquer forma.",
    gearSets: {
      starter: {
        goal: "Ring of Fire a partir do nível 6, e resistência suficiente para chegar ao Nightmare.",
        nextUpgrade: "Um Spirit em qualquer espada de 4 sockets assim que tiver Tal, Thul, Ort e Amn.",
        picks: {
          "weapon-0": {
            label: "Qualquer staff, wand ou sceptre com +Warlock skills",
            why: "O Warlock levita a arma, então um staff de duas mãos não custa nada na mão secundária. Esta é a única classe que pega o maior pedaço de pau com +skills que encontrar e ainda segura um Grimoire.",
            lookFor: ["+1-3 to Warlock Skills", "+to Ring of Fire", "Faster Cast Rate"],
          },
          "offhand-0": {
            label: "Qualquer Grimoire com +Warlock skills",
            why: "Grimoires são a mão secundária da própria classe — um equivalente a escudo restrito ao Warlock que rola staffmods. Bases de tier normal pedem entre 12 e 25 de Strength, então qualquer uma é de graça neste nível.",
            lookFor: ["+2 to Warlock Skills", "+to Ring of Fire", "2 sockets"],
          },
          "body-0": { why: "Faster cast rate, recuperação de golpe e velocidade de corrida por duas runas da Countess." },
          "helm-0": { why: "+1 em Todas as Skills por duas runas, que é um nível de Ring of Fire que você ainda não ganhou." },
          "belt-0": { label: "Qualquer cinto com vida e resistência", why: "Nada esperto. Quatro fileiras e a resistência que vier junto." },
          "boots-0": { label: "Quaisquer botas com Faster Run/Walk e resistência", why: "Movimento é sobrevivência numa build sem skill de movimento." },
        },
      },
      nightmare: {
        goal: "Flame Wave ativo, 75% de Faster Cast Rate, e resistências que sobrevivam à penalidade do Nightmare.",
        nextUpgrade: "O runeword Coven no momento em que um elmo de três sockets e uma runa Ist se encontrarem.",
        picks: {
          "weapon-0": {
            why: "+2 em Todas as Skills e 25-35% de Faster Cast Rate numa espada de quatro sockets. Um Warlock segura espada como qualquer outro, e este é o +2 skills mais barato do jogo.",
            sockets: "Tal Thul Ort Amn numa Crystal Sword de quatro sockets.",
          },
          "offhand-0": {
            label: "Qualquer Grimoire com +2 Warlock skills e a aba de Chaos",
            why: "As abas de skill do Warlock são 21, 22 e 23 — demon, eldritch e chaos. Um +2 na aba de Chaos num Grimoire vale dois níveis de Apocalypse antes de você poder lançá-lo.",
            lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills", "Faster Cast Rate"],
          },
          "offhand-0-alt0": {
            why: "Duas runas, todas as resistências e não pode ser congelado. Cabe num Grimoire porque um Grimoire é escudo por tipo — e porque são duas runas, que é o truque inteiro.",
          },
          "body-0": {
            why: "+1 em Todas as Skills, 30% de Faster Cast Rate e 20-35% de resistência total numa armadura barata. A body padrão de Nightmare de todo caster, e aqui não é diferente.",
          },
          "helm-0": { why: "+1 em Todas as Skills e magic find enquanto não existir nada melhor." },
          "helm-1": { why: "O mesmo +1 skills por menos, se o Tarnhelm não tiver caído." },
          "gloves-0": { why: "+1 em Fire Skills e 20% de Faster Cast Rate. O único par de luvas do catálogo que sobe o dano desta build." },
          "belt-0": { why: "Faster cast não está nele, mas 50% do dano recebido vai para a mana e as resistências são de graça." },
          "boots-0": { why: "Vida, Dexterity e um bom estoque de stamina para uma build que anda a pé o tempo todo." },
          "amulet-0": { label: "Qualquer amuleto com +2 Warlock skills", why: "Dois níveis de tudo. Um amuleto raro ou mágico faz isso por quase nada e vale gamble." },
          "ring1-0": { why: "Magic find enquanto os anéis são só espaço reservado." },
        },
      },
      "early-hell": {
        goal: "Apocalypse sendo lançado, 75% de Faster Cast Rate mantidos, e resistências de volta ao máximo depois da penalidade do Hell.",
        nextUpgrade: "Harlequin Crest, e então a decisão sobre pagar ou não 106 de Strength.",
        picks: {
          "helm-0": {
            why: "Ist, Ral e Io num elmo de três sockets: +1 em Todas as Skills, 20% de Faster Cast Rate e 26-40% de magic find quando se conta o modificador de elmo da própria Ist. Um runeword da expansão e um dos elmos de +1 skills mais baratos do jogo.",
            sockets: "Ist Ral Io em qualquer elmo de três sockets. Um Circlet mantém o requisito de Strength perto de zero.",
          },
          "weapon-0": { why: "Continua a melhor arma de cast rate neste tier, e continua +2 skills." },
          "offhand-0": {
            label: "Measured Wrath",
            why: "Um Burnt Text no nível 52: +1 em Warlock skills, +1-3 Ring of Fire, +1-3 Flame Wave, 25% de Faster Cast Rate e +20-30 de resistência total. Pede 38 de Strength, que é justamente o ponto — é o trabalho da mão secundária elite feito por um terço do custo em atributos.",
            lookFor: ["+3 Ring of Fire", "+3 Flame Wave", "+30 all resistance"],
          },
          "offhand-0-alt0": {
            why: "Dol e Gul num Grimoire — todas as resistências, vida, mana e um bônus grande de defesa. É Grimoire em primeiro lugar por tipo e são duas runas, que é a única contagem de runas que um Grimoire aceita.",
          },
          "body-0": { why: "Sem mudança. Nada neste tier ganha de +1 skills e 30% de Faster Cast Rate pelo preço." },
          "gloves-0": { why: "Sem mudança, e ainda as únicas luvas de fogo." },
          "belt-0": { why: "+1 em Todas as Skills e 20% de Faster Cast Rate. O maior item isolado de cast rate do jogo fora uma arma." },
          "boots-0": { why: "Strength, Vitality, redução de duração de veneno, e é a bota que ajuda a pagar a conta de Strength do Grimoire." },
          "amulet-0": { why: "30% de Faster Run/Walk e 20% de Increased Attack Speed que você não vai usar — pego pela velocidade e pela Dexterity, e trocado pelo Mara's assim que um cair." },
          "ring1-0": { why: "+1 em Todas as Skills e a reserva de mana que permite continuar lançando." },
          "ring2-0": { label: "Qualquer anel raro com 10% de Faster Cast Rate e resistência", why: "Os dez pontos de cast rate mais baratos do personagem, e o slot onde o breakpoint de 75 costuma fechar." },
        },
        charms: [
          {
            why: "Quebra imunidade a fogo ao custo de 70 a 90 pontos da sua própria resistência a fogo. É o item que abre doze das dezoito áreas catalogadas para esta build, e vale reorganizar o resto do equipamento em volta dele.",
          },
        ],
      },
      budget: {
        goal: "Todas as áreas abertas, e o personagem pronto fora os dois slots caros.",
        nextUpgrade: "Heart of the Oak, e a Strength para vestir um Blasphemous Grimoire por baixo dele.",
        picks: {
          "helm-0": { why: "+2 em Todas as Skills, vida e mana por nível, 10% de redução de dano e 50% de magic find. Dois níveis de Apocalypse e um quinto de um plano de sobrevivência num slot só." },
          "helm-1": { why: "Fique com o Coven se for o cast rate que fecha o seu breakpoint. O Shako dá mais skills; o Coven dá mais velocidade." },
          "weapon-0": { why: "Mantido até o Heart of the Oak. Não existe +2 skills com 35% de cast rate mais barato no jogo." },
          "offhand-0": {
            label: "Ars Dul'Mephistos",
            why: "Um Occult Tome no nível 78: +2 em Warlock skills, 20-30% de Faster Cast Rate e 10-20% de Resistência Mágica do Inimigo a menos. A quebra de mágico é peso morto nesta build — ele está aqui pelos dois níveis de skill e pelo cast rate, e por pedir 82 de Strength em vez de 106.",
            lookFor: ["+2 Warlock Skills", "30% Faster Cast Rate"],
          },
          "offhand-0-alt0": {
            label: "Measured Wrath",
            why: "Fique com o Burnt Text se 82 de Strength for mais do que você quer pagar. Três níveis de Ring of Fire e Flame Wave contra dois de tudo é mais próximo do que parece.",
          },
          "body-0": {
            why: "Hel, Shael e Ral numa armadura de três sockets: +2 em Warlock skills, 40-60% de defesa aumentada e uma chance de lançar Miasma Chains ao ser atingido. Um runeword da expansão que faz pelo slot de corpo o que o Spirit faz pela arma.",
          },
          "body-1": { why: "Se o cast rate for mais necessário que o segundo nível de skill." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Magic find e Strength, e esta build quer as duas coisas por motivos diferentes." },
          "amulet-0": { why: "+2 em Todas as Skills e +20-30 em todas as resistências, que é boa parte do custo de um Flame Rift devolvido." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { label: "Qualquer anel raro com 10% de Faster Cast Rate, resistência e vida", why: "Continua sendo onde o breakpoint fecha." },
        },
        charms: [{ why: "Agora obrigatório e não mais um luxo. Doze de dezoito áreas registram imunidade a fogo e esta build não tem outra resposta." }],
        weaponSwap: [
          { why: "Battle Orders num personagem com 3 de vida por ponto de Vitality é um ganho percentual maior do que é para qualquer outro." },
          { why: "A outra metade da troca." },
        ],
      },
      optimized: {
        goal: "125% de Faster Cast Rate, e o loadout que é a assinatura da classe: uma arma de duas mãos e uma mão secundária ao mesmo tempo.",
        nextUpgrade: "Nada estrutural. Facets no elmo e no corpo, e rolagens melhores nos mesmos itens.",
        picks: {
          "weapon-0": {
            why: "+3 em Todas as Skills e 40% de Faster Cast Rate num staff de quatro sockets. **Um staff é de duas mãos e o Warlock o levita**, então esta é a única classe do jogo que veste a melhor arma de caster e mantém a mão secundária. Nenhum outro personagem consegue isso e nenhum guia genérico de equipamento vai te dizer para fazer.",
            sockets: "Ko Vex Pul Thul num staff de quatro sockets. Um Warlock não tem motivo para usar a versão em maça.",
          },
          "offhand-0": {
            label: "Ars Al'Diablolos",
            why: "Um Blasphemous Grimoire no nível 80: **+2 em Chaos Skills, +3-5 em Apocalypse, +15-25% de Dano de Skills de Fogo**, 25% de Faster Cast Rate e +20-30 de resistência a fogo. É o único item do jogo que sobe o dano desta build duas vezes — uma por níveis de skill e outra por um multiplicador de dano para o qual a classe não tem skill nenhuma.",
            lookFor: ["+5 to Apocalypse", "+25% to Fire Skill Damage", "+30 Fire Resist"],
          },
          "offhand-0-alt0": {
            label: "Ars Dul'Mephistos",
            why: "82 de Strength em vez de 106, e nenhum Dano de Skills de Fogo. A diferença de Strength é cerca de vinte pontos de atributo, que são 60 de vida.",
          },
          "helm-0": { why: "Sem mudança, e com um facet ou um rubi perfeito no socket." },
          "body-0": { why: "Teleport. A build não tem skill de movimento própria e esta é a única disponível para ela." },
          "body-1": { why: "Se uma Jah estiver fora de alcance: +2 skills, +65 em todas as resistências e 8% de redução de dano." },
          "body-2": { why: "A mais barata das três e ainda +2 em Warlock skills." },
          "gloves-0": { why: "Sem mudança. Continua não existindo mais nada com +Fire Skills." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança, e a Strength dela agora está sustentando o plano." },
          "amulet-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "Um segundo, depois que o breakpoint de cast rate estiver fechado em outro lugar." },
        },
        charms: [
          { why: "Sem mudança e continua obrigatório." },
          { why: "A aba de Chaos é a 23 e o charm existe. Nove deles são nove níveis de Apocalypse, que é o dano mais barato do personagem." },
        ],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
      bis: {
        goal: "Nada mais a mudar.",
        notes:
          "Não existe elmo de fogo, armadura de fogo nem amuleto de fogo no catálogo que um Warlock possa vestir — os três orbs que carregam +% de Dano de Skills de Fogo são restritos à Sorceress. O Ars Al'Diablolos é o plano de equipamento de dano de fogo inteiro, e é por isso que a mão secundária vale 106 de Strength.",
        picks: {
          "weapon-0": { why: "De duas mãos e sem custo nenhum, o que continua sendo a melhor coisa de jogar esta classe." },
          "offhand-0": { label: "Ars Al'Diablolos", why: "Rolado com +5 de Apocalypse e +25% de Dano de Skills de Fogo. Não existe segundo candidato.", lookFor: ["+5 to Apocalypse", "+25% to Fire Skill Damage"] },
          "helm-0": { why: "Com um Rainbow Facet de fogo no socket." },
          "body-0": { why: "Teleport vale mais que qualquer linha de status que o substituísse." },
          "gloves-0": { why: "Sem mudança, e o ponto em que o catálogo fica sem equipamento de fogo." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança." },
          "amulet-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "Sem mudança." },
        },
        charms: [
          { why: "Sem mudança." },
          { why: "Os últimos nove níveis de Apocalypse que alguém vai te dar." },
        ],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
    },
  },

  // =========================================================================
  "abyss-warlock": {
    summary:
      "Dano mágico, que uma das dezoito áreas catalogadas resiste — e a primeira build do jogo com equipamento que sobe dano mágico e baixa resistência mágica.",
    playstyle:
      "Miasma Chain é o que você segura apertado: gera três projéteis na base e até doze, todos mágicos, no alcance de um arco. Abyss é a resposta ao que a corrente não matou — um colapso num raio de 6 que deixa fogo queimando no chão. Sigil: Death desce sob um grupo uma vez e executa qualquer coisa que caia abaixo de um décimo da vida, o que numa build cujo dano chega em muitos pedaços pequenos é a maior parte do grupo. O ritmo é mais lento que o da página de fogo e há muito menos em que pensar: quase nada resiste a você, então quase nada exige decisão.",
    strengths: [
      "Mágico é o tipo de dano menos resistido do jogo — uma área catalogada registra imunidade a ele",
      "A única build deste site com acesso a +% de Dano de Skills Mágicas e −% de Resistência Mágica do Inimigo",
      "Miasma Chain alcança 50 unidades, o maior alcance da classe",
      "Um triângulo fechado de sinergias: todo ponto no ramo sobe as outras duas skills dele",
      "Não precisa de sunder charm nem de lista de compras de resistência, o que a torna a mais barata das quatro de terminar",
    ],
    weaknesses: [
      "Não existe sunder charm de mágico, então a única área que de fato resiste a você não pode ser aberta a preço nenhum",
      "Abyss é 20-40 no nível 1 contra os 80-100 do Apocalypse — o dano chega em pedaços em vez de num golpe só",
      "Oitenta de 110 pontos vão para quatro skills maximizadas, então o personagem só fica pronto lá pelos oitenta e tantos",
      "Miasma Chain roda na animação de ataque e não na de conjuração, e o que isso significa para um breakpoint de cast rate não está estabelecido",
      "Sem skill de movimento fora um Enigma",
    ],
    skillPackages: {
      "the-last-27": {
        name: "Os últimos vinte e sete",
        intro:
          "O núcleo são 83 pontos e fecha o ramo do vazio por completo. O que sobra é uma escolha entre cobrir a única coisa que resiste a você e sobreviver às que não resistem.",
        packages: {
          "fire-answer": {
            name: "A resposta do fogo",
            when: "Você quer rodar o Arcane Sanctuary, ou preferiria nunca mais pensar em imunidade. Ring of Fire não tem pré-requisito, abre no nível 6 e dobra a própria contagem de projéteis no décimo hard point.",
            tradeoff:
              "Vinte pontos numa skill sem nenhuma sinergia atrás dela. Ring of Fire no 20 sem nada alimentando é uma magia modesta, e este pacote compra cobertura, não dano.",
            skillNotes: {
              "ring-of-fire": "Dezesseis projéteis abaixo de dez hard points e trinta e dois com dez ou mais. Esse único limiar é a maior parte da skill.",
            },
            rotationNote: "Nada muda até algo resistir a você. Ring of Fire é uma segunda tecla, não uma segunda rotação.",
            contentNote: "O Arcane Sanctuary é a única área catalogada que registra imunidade a mágico. Este pacote é o que a torna farmável.",
            remainderNote:
              "Sete pontos sobrando, em 103 de 110. Toda sinergia já está maximizada e os dois sigils restantes sobem em degraus nos hard points dez e vinte, que sete não alcança a partir de um — então vão para Sigil: Death e o anel alarga três níveis depois.",
          },
          "the-ward": {
            name: "O ward",
            when: "Você está jogando Hardcore, ou em partidas de oito jogadores em que as coisas te alcançam. Psychic Ward absorve 15 de dano mais 10 por nível e atordoa o que te acerta em corpo a corpo enquanto aguenta.",
            tradeoff:
              "O Arcane Sanctuary continua fechado e nada mais fica. É um custo menor do que parece — uma área de dezoito — mas é a única área em que esta build não tem resposta nenhuma.",
            skillNotes: {
              "psychic-ward":
                "A reserva é 15 mais 10 por nível, e mais 15 por hard point de Levitation Mastery e de Cleave — então os dois pontos de pré-requisito valem 30 de absorção além de destravar a skill.",
            },
            gearNote:
              "Levitation Mastery só paga enquanto exatamente uma arma estiver equipada, o que um Warlock sempre tem. O dano e a attack rating dela são inúteis aqui; o ponto é comprado pelo ward e pelo pré-requisito.",
            rotationNote: "Relance o ward antes de um grupo, não durante. Ele atordoa atacantes de corpo a corpo enquanto aguenta, o que compra o relançamento.",
            remainderNote: "Cinco pontos sobrando, em 105 de 110. Sigil: Lethargy os leva rumo ao degrau de raio dos dez pontos.",
          },
        },
      },
    },
    statPlan: {
      strength: "O suficiente para a mão secundária que você escolheu, e nada além. Veja a nota.",
      dexterity: "Base.",
      vitality: "Todo o resto.",
      energy: "Nenhuma.",
      notes: [
        "**A mão secundária define o número de Strength e a faixa é enorme.** Um Occult Tome pede 82 de Strength e um Blasphemous Grimoire pede 106, contra uma base de classe de 15. A melhor mão secundária desta build é o Occult Tome, então 82 é o número — e um Burnt Text com 38 é a resposta até lá.",
        "Nada mais no personagem lê Strength. Void é uma adaga e adagas quase não pedem nada.",
        "**Levitation Mastery corta requisitos de item em 2% por nível até um piso de −50%.** Se isso alcança armadura ou só arma não está estabelecido, e o ponto único do pacote do ward não é orçado como desconto.",
        "Energy fica na base em toda build de Warlock deste site. Insight no mercenário é uma reserva de mana maior que qualquer quantidade de pontos aqui, e os pontos valem mais como vida.",
      ],
    },
    breakpointWhy: {
      "fcr-75": "O alvo padrão na tabela de Paladin/Necromancer/Warlock, e só o Void já carrega 40% dele.",
      "fcr-125": "Mais fácil de alcançar nesta build que na maioria, porque o Void é uma arma de 40% e o Ars Dul'Mephistos é uma mão secundária de 20-30%.",
      "fhr-56": "O alvo de sempre. Miasma Chain é interrompido como qualquer outra coisa.",
    },
    breakpointNotes:
      "Uma ressalva que a página de fogo não precisa. **Miasma Chain marca `UseAttackRate`, e nenhuma outra skill de Chaos faz isso** — a animação dela segue a velocidade de ataque e não a de conjuração. O que isso significa para um breakpoint de Faster Cast Rate naquela skill específica não está estabelecido, e nenhuma tabela de velocidade de ataque é publicada para nenhuma classe deste site, então nada é afirmado em nenhuma direção. Os alvos de cast rate acima valem para o Abyss, que é uma conjuração comum.",
    skillNotes: {
      abyss: "20-40 mágico num raio de 6, e a mana é cobrada quando ele resolve, não quando começa.",
      "miasma-chain": "+10% de dano do Abyss por nível, e a skill que você de fato segura apertada: três projéteis subindo rumo a um teto de doze.",
      "miasma-bolt": "+10% de dano do Abyss por nível. Ninguém a lança depois do primeiro ato, e ela é maximizada mesmo assim.",
      "enhanced-entropy":
        "Uma passiva e não uma sinergia — o graph não desenha aresta a partir dela, porque o jogo não rotula os parâmetros dela como sinergia. Ela dá ao Abyss +2% de dano com mais 3% por nível, que é a linha mais íngreme da skill, além de dano, alcance e duração de miasma.",
      "sigil-death":
        "O melhor ponto único da classe. 13% de vida fixos para um monstro normal e 10% para champion, unique ou superunique, e nenhum dos dois sobe com o nível.",
      "sigil-lethargy":
        "Também um efeito fixo: −50% de movimento e −50% de attack rate dentro dele, com um ponto. Pontos compram raio e mais nada.",
    },
    immunityPlan:
      "**Uma área em dezoito resiste a esta build, e esse é o plano inteiro.** O Arcane Sanctuary registra imunidade a raio e a mágico; as outras dezessete áreas catalogadas não registram nenhuma das duas. Doze delas registram fogo, dez veneno, oito raio e oito físico. Construir em cima de mágico é a maior decisão de imunidade disponível neste jogo e é por isso que esta página existe ao lado da de fogo.\n\n**O equipamento agora ajuda, o que não acontecia antes desta expansão.** Ars Dul'Mephistos tira 10-20% da resistência mágica do inimigo, Gheed's Wager mais 3-7% e Sling mais 3-5% — até 32 pontos entre os três — e Void e o Entropy Locket somam até 25% de Dano de Skills Mágicas por cima. Nenhum outro personagem do jogo monta qualquer um desses dois conjuntos.\n\n**Nada disso quebra uma imunidade.** Uma linha de −% de Resistência Mágica do Inimigo é ignorada por completo enquanto a imunidade estiver de pé, em vez de ser reduzida a uma fração de si mesma; é o que amolece um monstro resistente, não o que torna matável um imune. E **não existe sunder charm de mágico** — os cinco que existem cobrem fogo, frio, raio, veneno e físico, e mágico é o único elemento sem equivalente.\n\nEntão, contra um monstro genuinamente imune a mágico as opções são o pacote de fogo, o mercenário, ou passar direto. No Arcane Sanctuary especificamente, passar direto costuma ser o certo: a zona não é área de nível 85 e não há nada nela que valha a discussão.",
    mercenaryNotes:
      "Act 2, Nightmare, Holy Freeze. Insight na polearm é o plano de mana — o Abyss custa 23 de mana na base mais 1 por nível e cobra quando resolve em vez de quando começa, então uma conjuração interrompida não custa nada. Might é a alternativa se a expectativa for que o mercenário mate a única coisa que você não consegue.",
    farmingWhy: {
      "mausoleum-hell":
        "Área de nível 85 com imunidade a veneno e frio registrada, e nenhuma delas é mágico. Uma caminhada curta do waypoint das Cold Plains e um dos poucos lugares em que um personagem recém-chegado ao Hell pode farmar com segurança.",
      "chaos-sanctuary-hell":
        "Imunidade a fogo, raio e físico são todas registradas aqui e nenhuma delas é mágico. A zona mais densa do jogo, rodada por uma build que não precisa de charm nenhum para estar lá.",
      "travincal-hell": "Imunidade a fogo e raio registrada, o Council amontoado, e drops de runas altas. Nada aqui resiste a mágico.",
      "worldstone-keep-hell":
        "Imunidade a físico, fogo, raio e frio são todas registradas — quatro dos cinco elementos, e não o que esta build causa. O argumento mais claro do site para construir em cima de mágico.",
      "pit-hell": "Área de nível 85 com imunidade a físico, frio e raio registrada. Mágico atravessa tudo isso.",
      "lower-kurast-hell": "Imunidade a fogo e veneno registrada, e os baús não ligam para o elemento que você causa. Uma run curta por runas.",
    },
    levelingPath: {
      summary:
        "Miasma Bolt está na barra desde o nível 1 e Miasma Chain o substitui no 12. Abyss chega no 30 e nada antes dele é desperdiçado — cada ponto gasto na subida é uma sinergia que a build pronta quer maximizada. Esta é a única build de Warlock sem um trecho ingrato.",
    },
    selfFoundNotes:
      "A mais barata das quatro para levar ao Hell. Spirit são quatro runas da Countess, Coven precisa de uma Ist e Vigilance é Dol e Gul — nada disso é troca. O que não dá para achar é o Void, que precisa de uma Zod; até lá o Spirit fica só 15% de cast rate atrás dele e nenhum dos equipamentos de dano mágico é obrigatório para a build funcionar. Entropy Locket no nível 54 e Sling no 50 são drops realistas em solo e valem mais aqui do que em qualquer outro personagem.",
    hardcoreNotes:
      "A melhor das quatro builds de Warlock para Hardcore, e não é perto. O tipo de dano é o que nada resiste, o alcance é o maior da classe, e Sigil: Lethargy corta pela metade o movimento e a velocidade de ataque de tudo que estiver dentro dele com um único hard point. Pegue o pacote do ward: 15 de absorção mais 10 por nível, e atacantes de corpo a corpo ficam atordoados enquanto ele aguenta. A única coisa a respeitar é que o Abyss cobra a mana quando resolve, então uma conjuração interrompida na hora errada deixa você sem a magia e sem a fuga.",
    gearSets: {
      starter: {
        goal: "Miasma Bolt desde o nível 1 e Miasma Chain a partir do 12. Nada mais importa ainda.",
        nextUpgrade: "Spirit, assim que quatro runas da Countess se juntarem.",
        picks: {
          "weapon-0": {
            label: "Qualquer wand, staff ou adaga com +Warlock skills",
            why: "Um staff de duas mãos é de graça nesta classe — o Warlock o levita e a mão secundária continua livre. Pegue o maior pedaço de pau com +skills que encontrar.",
            lookFor: ["+1-3 to Warlock Skills", "Faster Cast Rate"],
          },
          "offhand-0": {
            label: "Qualquer Grimoire com +Warlock skills",
            why: "Grimoires de tier normal pedem de 12 a 25 de Strength, então é de graça.",
            lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills"],
          },
          "body-0": { why: "Duas runas da Countess por cast rate, recuperação de golpe e velocidade de corrida." },
          "helm-0": { why: "+1 em Todas as Skills por duas runas." },
          "boots-0": { label: "Quaisquer botas com Faster Run/Walk", why: "Não existe skill de movimento nesta build até um Enigma." },
        },
      },
      nightmare: {
        goal: "75% de Faster Cast Rate e resistências que aguentem a penalidade do Nightmare.",
        nextUpgrade: "Coven num circlet de três sockets.",
        picks: {
          "weapon-0": { why: "+2 em Todas as Skills e 25-35% de Faster Cast Rate numa espada de quatro sockets. Mantido até o Void.", sockets: "Tal Thul Ort Amn." },
          "offhand-0": {
            label: "Qualquer Grimoire com +2 Warlock skills e a aba de Chaos",
            why: "A aba de Chaos é o índice 23. Dois níveis de Abyss antes de você poder lançá-lo.",
            lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills"],
          },
          "offhand-0-alt0": { why: "Duas runas, todas as resistências, não pode ser congelado — e duas runas é a única contagem que os sockets de um Grimoire permitem." },
          "body-0": { why: "+1 skills, 30% de Faster Cast Rate, 20-35% de resistência total." },
          "helm-0": { why: "+1 em Todas as Skills e magic find." },
          "belt-0": { why: "Resistências e dano-para-mana enquanto o slot de cinto é espaço reservado." },
          "boots-0": { why: "Vida e stamina para uma build que anda a pé." },
          "amulet-0": { label: "Qualquer amuleto com +2 Warlock skills", why: "Dois níveis de tudo, obtidos por gamble e não por farm." },
          "ring1-0": { why: "Magic find num slot que ainda não tem nada melhor." },
        },
      },
      "early-hell": {
        goal: "Abyss sendo lançado, resistências de volta ao máximo, e o primeiro item que sobe dano mágico.",
        nextUpgrade: "Uma runa Zod, e então o Void.",
        picks: {
          "helm-0": {
            why: "+1 em Todas as Skills, 20% de Faster Cast Rate e 26-40% de magic find quando se conta o modificador de elmo da Ist.",
            sockets: "Ist Ral Io num circlet de três sockets.",
          },
          "weapon-0": { why: "Mantido até uma Zod. Void é um runeword de nível 69 e uma Zod não é runa de começo de Hell." },
          "offhand-0": {
            label: "Measured Wrath",
            why: "Um Burnt Text no nível 52 com +1 em Warlock skills, 25% de Faster Cast Rate e +20-30 de resistência total. Pede 38 de Strength, que é o motivo de usá-lo em vez do Occult Tome por enquanto.",
          },
          "offhand-0-alt0": { why: "Dol e Gul num Grimoire — resistências, vida, mana e defesa, por duas runas que caem o tempo todo." },
          "body-0": { why: "Sem mudança." },
          "amulet-0": {
            label: "Entropy Locket",
            why: "**+5-10% de Dano de Skills Mágicas** e 4-19% de chance de lançar Miasma Chains ao golpear. O primeiro item do jogo que multiplica dano mágico, e é um amuleto de nível 54.",
            lookFor: ["+10% to Magic Skill Damage", "+40 Lightning Resist"],
          },
          "gloves-0": { why: "A reserva de mana, que é a única coisa que luvas oferecem a esta build — nada no catálogo carrega +Magic Skills." },
          "belt-0": { why: "+1 em Todas as Skills e 20% de Faster Cast Rate." },
          "boots-0": { why: "Magic find e a Strength que ajuda a pagar a mão secundária." },
          "ring1-0": { why: "+1 em Todas as Skills e a mana para continuar lançando." },
          "ring2-0": {
            label: "Sling",
            why: "**−3-5% de Resistência Mágica do Inimigo**, 10% de Faster Cast Rate e um oskill de Town Portal. Um anel de nível 50 e a quebra de mágico mais barata do jogo.",
          },
        },
      },
      budget: {
        goal: "Tudo menos o Void, e todas as áreas menos uma abertas.",
        nextUpgrade: "Void, que é a maior melhoria isolada do personagem.",
        picks: {
          "helm-0": { why: "+2 em Todas as Skills, vida e mana por nível e 10% de redução de dano." },
          "helm-1": { why: "Mantido no lugar dele se o breakpoint de 125% de cast rate estiver mais perto assim." },
          "weapon-0": { why: "Ainda +2 skills e 35% de cast rate. O Void o substitui e mais nada." },
          "offhand-0": {
            label: "Ars Dul'Mephistos",
            why: "Um Occult Tome no nível 78: **+2 em Warlock skills, 20-30% de Faster Cast Rate e −10-20% de Resistência Mágica do Inimigo**. A maior quebra de mágico em qualquer item do jogo, no slot que só esta classe tem.",
            lookFor: ["+2 Warlock Skills", "−20% to Enemy Magic Resistance", "30% Faster Cast Rate"],
          },
          "body-0": {
            why: "Hel Shael Ral: +2 em Warlock skills e uma chance de lançar Miasma Chains ao ser atingido, o que nesta build é o seu próprio tipo de dano voltando no que te acertou.",
          },
          "amulet-0": { label: "Entropy Locket", why: "Sem mudança. Nada mais no jogo carrega +% de Dano de Skills Mágicas neste slot." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { label: "Sling", why: "Sem mudança, e agora somando com a quebra da mão secundária." },
        },
        weaponSwap: [
          { why: "Battle Orders. Um Warlock ganha 3 de vida por ponto de Vitality, então a porcentagem cai sobre um número maior do que cairia numa Sorceress." },
          { why: "A outra metade." },
        ],
      },
      optimized: {
        goal: "Void na mão, o conjunto completo de quebra de mágico, e 125% de Faster Cast Rate.",
        nextUpgrade: "Rolagens melhores, e uma decisão sobre se o skill do Arachnid Mesh ganha da quebra do Gheed's Wager.",
        picks: {
          "weapon-0": {
            why: "Thul Zod Ist numa adaga de três sockets: **+2 em Todas as Skills, 40% de Faster Cast Rate, +10-15% de Dano de Skills Mágicas, +8-12 em todos os atributos**, e ainda concede Abyss 1-3 por cima dos vinte que você já tem. A expansão construiu este runeword para esta build.",
            sockets: "Thul Zod Ist. A Zod é o custo inteiro e não existe substituto.",
          },
          "offhand-0": { label: "Ars Dul'Mephistos", why: "Sem mudança, e agora é a segunda metade de um conjunto de quebra em vez da única metade.", lookFor: ["−20% to Enemy Magic Resistance"] },
          "helm-0": { why: "Sem mudança." },
          "body-0": { why: "Teleport, para o qual esta build não tem outro caminho." },
          "body-1": { why: "Se uma Jah estiver fora de alcance — +2 skills e +65 em todas as resistências." },
          "amulet-0": { label: "Entropy Locket", why: "Sem mudança." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": {
            label: "Gheed's Wager",
            why: "Um Troll Belt no nível 71: **−3-7% de Resistência Mágica do Inimigo**, 10-20% de Faster Cast Rate, 10-20% de Faster Run/Walk e 44-75% de gold find. A terceira peça do conjunto de quebra.",
          },
          "belt-0-alt0": { why: "+1 skills contra a quebra. O nível de skill costuma valer mais até o conjunto de quebra estar completo." },
          "boots-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { label: "Sling", why: "Sem mudança." },
        },
        charms: [{ why: "A aba de Chaos é o índice 23. Nove charms são nove níveis no Abyss e nas duas skills de miasma ao mesmo tempo." }],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
      bis: {
        goal: "Até 32 pontos de resistência mágica do inimigo removidos, e 25% mais dano mágico do que as skills sozinhas dão.",
        notes:
          "Três itens e até 32 pontos de resistência mágica do inimigo removidos, mais 25% a mais de dano mágico entre o Void e o Locket. Nenhum outro personagem do jogo monta qualquer um dos dois conjuntos, porque até a expansão nenhum dos dois existia.",
        picks: {
          "weapon-0": { why: "Com +15% de Dano de Skills Mágicas." },
          "offhand-0": { label: "Ars Dul'Mephistos", why: "Com −20% de Resistência Mágica do Inimigo." },
          "helm-0": { why: "Com um Rainbow Facet no socket — não existe facet de mágico, então leve uma jóia defensiva ou uma gema perfeita." },
          "body-0": { why: "Sem mudança." },
          "amulet-0": { label: "Entropy Locket", why: "Com +10% de Dano de Skills Mágicas." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": { label: "Gheed's Wager", why: "Com −7% de Resistência Mágica do Inimigo." },
          "boots-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { label: "Sling", why: "Com −5% de Resistência Mágica do Inimigo." },
        },
        charms: [{ why: "Sem mudança." }],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
    },
  },

  // =========================================================================
  "cleave-warlock": {
    summary:
      "Um arco de 240 graus carregando o dano cheio de uma arma de duas mãos, com um Grimoire ainda na mão secundária e três hexes pegando carona em cada golpe.",
    playstyle:
      "Você segura um botão. Cleave varre onze de trinta fatias de um círculo com um ponto e vinte com vinte — algo como 132 graus abrindo para 240 — carrega o dano cheio da arma, custa 3 de mana fixos que nunca crescem, e golpeia mesmo sem mana nenhuma. Mirrored Blades é o botão de chefe: duas duplicatas etéreas com um ponto e cinco com quinze, cada uma um golpe cheio de arma. Os hexes são aplicados batendo em coisas, não conjurando, então eles caem enquanto você já está fazendo o que ia fazer — Hex: Bane arranca defesa e escreve dano mágico na arma, Hex: Purge detona em cerca de sete acertos em dez. É a build de corpo a corpo menos chata deste site e a única que nunca fica sem mana.",
    strengths: [
      "+600% de dano de arma vindo de três sinergias, o maior multiplicador disponível a qualquer skill de Warlock",
      "Uma arma de duas mãos e uma mão secundária ao mesmo tempo — nenhuma outra classe do jogo faz isso",
      "Cleave custa 3 de mana fixos em todo nível e golpeia sem mana nenhuma",
      "Físico e mágico ao mesmo tempo: imunidade a físico é registrada em oito áreas catalogadas e a mágico em uma",
      "Levitation Mastery corta requisitos de item em até metade, o que paga a arma que ela mesma quer",
    ],
    weaknesses: [
      "104 de 110 pontos, então quase nada é opcional e um erro é um respec",
      "Nenhum item do jogo carrega +2 em Eldritch Skills — esta árvore recebe +Warlock skills genérico e nada dedicado",
      "Mirrored Blades divide o Crushing Blow entre as duplicatas, então a contagem de golpes vale menos do que parece",
      "Alcance de corpo a corpo numa classe com 3 de vida por Vitality e sem transformação",
      "Nenhuma tabela de breakpoint de velocidade de ataque existe neste site para nenhuma classe, então a velocidade de arma tem que ser julgada em vez de consultada",
    ],
    flexPoints: [
      "**Seis pontos, e o plano são 104 de 110.** É o mais apertado das quatro builds de Warlock e não existe grupo de pacotes aqui porque não há espaço para um.",
      "**Um em Hex: Siphon.** Ele precisa de Hex: Purge, que já está maximizado. O hex corta em 33% fixos o que o alvo causa e devolve 1 de vida e 1 de mana por abate, aumentado ainda pelo Engorge — que esta build não tem, então pegue pela redução de dano e não pela sustentação.",
      "**Os outros cinco em Psychic Ward.** A reserva de absorção é 15 mais 10 por nível, e mais 15 por hard point de Levitation Mastery e de Cleave — dos quais esta build tem quarenta. Cinco pontos são mais 50 de absorção em cima dos cerca de 600 que as duas skills maximizadas já fornecem.",
      "Se preferir não gastá-los, guarde. Nada neste plano melhora com investimento parcial, e o personagem no nível 99 tem exatamente seis sobrando.",
    ],
    statPlan: {
      strength: "O suficiente para a arma e o Grimoire, e Levitation Mastery deixa esse número menor do que parece.",
      dexterity: "O suficiente para a arma. Nada aqui é construído em cima de bloqueio.",
      vitality: "Todo o resto, em todo nível.",
      energy: "Nenhuma. Cleave custa 3 de mana fixos e a build rouba o resto.",
      notes: [
        "**Levitation Mastery reduz requisitos de item em 2% com um ponto e mais 2% por nível, até um piso de −50%.** Com vinte hard points isso é −40%, e alguns +skills chegam ao piso. Numa build que quer uma arma pesada de duas mãos e um Blasphemous Grimoire, metade do preço é um monte de pontos de atributo.",
        "Está estabelecido que a redução vale para a arma. **Se ela alcança armadura e a mão secundária não está estabelecido** — a passiva depende de segurar exatamente uma arma, o que é uma condição sobre quando ela paga e não sobre o que ela desconta, e nada do que foi consultado resolve isso. Planeje a Strength do Grimoire pelo preço cheio e trate qualquer desconto como reembolso.",
        "Os preços dos Grimoires, sem redução: um **Burnt Text pede 38**, um **Occult Tome 82**, um **Blasphemous Compendium 95** e um **Blasphemous Grimoire 106**. Um Warlock de corpo a corpo já está pagando Strength de qualquer jeito, e é por isso que esta é a build que consegue bancar as bases elite.",
        "Dexterity até o requisito da arma e nada além. Um Grimoire bloqueia, mas 12% de chance de bloqueio não é um plano defensivo e os pontos valem mais como vida.",
      ],
    },
    breakpointWhy: {
      "fhr-56": "A tabela de Necromancer/Druid/Warlock. Um personagem de corpo a corpo que está sendo sacudido não está golpeando.",
      "fhr-86": "Vale pegar se o slot for barato, o que numa build sem exigência de cast rate ele costuma ser.",
      "fcr-75": "Só para o Blade Warp. A build não conjura mais nada, então este é um alvo de mobilidade e não de dano.",
    },
    breakpointNotes:
      "**Não existe linha de velocidade de ataque aqui e isso não é uma omissão desta página.** Este site não publica nenhuma tabela de Increased Attack Speed para nenhuma classe, porque a velocidade de arma depende da velocidade da arma base e da animação de ataque, e não do personagem sozinho, e nenhum dado de animação do Warlock foi estabelecido num nível de fonte que este projeto aceita. O bônus do próprio Cleave — de 10% rumo a 30% — e os 10% mais 1% por nível do Hex: Purge são reais e estão nas notas de skill; o que não é publicado é a contagem de frames que eles compram. Julgue a arma pelo tato e prefira mais velocidade de ataque a menos, que é a versão honesta do conselho.",
    skillNotes: {
      cleave:
        "Onze de trinta fatias com um ponto, mais uma por nível, limitado a vinte. O dano cheio da arma mais 20% e mais 5% por nível, e um bônus de velocidade de ataque subindo de 10% rumo a 30%.",
      "mirrored-blades":
        "+10% de dano do Cleave por nível, e o botão de chefe por si só: dois ataques com um ponto, três no 5, quatro no 10 e cinco no 15. Tudo depois do quinze é dano em golpes que você já tinha.",
      "hex-purge": "+10% de dano do Cleave por nível. Ele também dá +10% de velocidade de ataque com mais 1% por nível, que é a velocidade de ataque mais barata da classe.",
      "eldritch-blast":
        "+10% de dano do Cleave por nível, e é a sustentação: 5% de roubo de vida e 5% de mana com mais 1% de cada por nível, enquanto uma nova a cada 30 frames reaplica a marca do Hex: Bane de graça.",
      "levitation-mastery":
        "A mastery da classe. +25% de dano com mais 4% por nível, +40% de attack rating com mais 5% por nível, uma chance crítica subindo rumo a 35%, e −2% de requisitos de item com mais 2% por nível até um piso de −50%. Não é uma sinergia de Cleave no graph e não é rotulada como tal aqui.",
      "hex-bane":
        "Um ponto, e ele se paga: a skill escreve o próprio dano mágico rolado no seu personagem como dano mágico fixo de arma, então cada golpe de Cleave carrega mágico além de físico.",
      "blade-warp":
        "A única skill de movimento da classe sem um Enigma — você arremessa a arma e teleporta até ela. Um ponto é tudo o que o plano pode bancar e tudo de que ele precisa.",
    },
    immunityPlan:
      "**Esta build causa dois tipos de dano no mesmo golpe e esse é o plano.** Cleave carrega o dano físico cheio da arma, e um hard point em Hex: Bane escreve a faixa mágica rolada daquela skill no seu personagem como dano mágico fixo de arma — então ele cai em cada acerto, incluindo o arco do Cleave e cada duplicata do Mirrored Blades.\n\nOs números por trás disso: **imunidade a físico é registrada em oito das dezoito áreas catalogadas e imunidade a mágico em uma.** Um monstro que para a metade física quase nunca para a metade mágica, e o contrário é ainda mais raro.\n\n**Contra as oito, a resposta é Amplify Damage.** Dreadfang o lança em 33% dos acertos, o que numa build que varre um arco de 240 graus significa que ele fica praticamente sempre ativo. A maldição baixa a resistência física em 100 pontos, e contra um monstro que continua imune a físico ela cai com um quinto da força — 20 pontos — que é exatamente suficiente para quebrar um que esteja em 100% e insuficiente acima de 120%. Esse é o limite honesto e é onde um sunder charm Bone Break assume, se você tiver um.\n\n**Contra a uma, nada.** Não existe sunder charm de mágico e nenhuma maldição baixa resistência mágica. O Arcane Sanctuary é a área, e a metade física do seu dano é a resposta ali — o que é a imagem espelhada de todo o resto, e a razão de carregar as duas valer um hard point.",
    mercenaryNotes:
      "Act 2, Nightmare, Might. O dano desta build é majoritariamente o da arma, e Might multiplica exatamente isso. Insight não é necessário aqui — Cleave custa 3 de mana fixos e Eldritch Blast rouba 5% mais 1% por nível de vida e de mana — então a polearm do mercenário fica livre para Pride ou Infinity. A Concentration do Pride é a aura de dano maior; Infinity só compensa se o grupo tiver um personagem elemental nele.",
    farmingWhy: {
      "mausoleum-hell":
        "Área de nível 85 com imunidade a veneno e frio registrada e nenhuma delas é físico nem mágico. Mortos-vivos, denso o bastante para um arco de 240 graus, e a duas telas de um waypoint.",
      "ancient-tunnels-hell":
        "Área de nível 85 com imunidade a fogo e veneno registrada — nenhuma das quais esta build causa. Uma das poucas zonas em que um personagem físico não tem nada a contornar.",
      "travincal-hell":
        "Imunidade a fogo e raio registrada, o Council de pé num amontoado, e Mirrored Blades colocando cinco golpes cheios de arma num deles por vez.",
      "mephisto-hell": "Imunidade a fogo e raio registrada e nenhuma delas toca nesta build. Um chefe sozinho, que é para o que o Mirrored Blades serve.",
      "pit-hell":
        "Área de nível 85 e os melhores drops do Act 1, mas imunidade a físico é registrada aqui — é onde o dano mágico do Hex: Bane e o Amplify Damage do Dreadfang deixam de ser nota de rodapé.",
      "chaos-sanctuary-hell":
        "A zona mais densa do jogo e exatamente o formato que um arco de 240 graus quer. Imunidade a físico é registrada, então leve a arma de Amplify Damage e não a de dano bruto.",
    },
    levelingPath: {
      summary:
        "Cleave chega no nível 6 e é o personagem inteiro até o 30. Custa 3 de mana em todo nível e golpeia sem mana, o que faz dele a skill de nível baixo mais tolerante da classe. Mirrored Blades no 30 muda a build de um arco para um arco mais um botão de chefe, e nada antes dele é desperdiçado — cada ponto na subida é uma das cinco que o plano pronto maximiza.",
    },
    selfFoundNotes:
      "A mais dependente de equipamento das quatro e a primeira a evitar em solo. Cleave carrega o dano da arma, então uma arma ruim é uma build ruim de um jeito que não vale para um caster — e as duas armas em torno das quais esta página é construída são um unique de nível 61 e um runeword que precisa de uma Ohm. Passion são quatro runas comuns e aguenta surpreendentemente bem. A mão secundária é mais fácil: qualquer Grimoire com +2 Warlock skills é alvo de gamble, e Measured Wrath no nível 52 é um drop realista.",
    hardcoreNotes:
      "A mais difícil das quatro de levar ao Hardcore, porque o alcance é zero e a classe não tem transformação atrás da qual se esconder. O que a torna sobrevivível é acumulado e vale listar em ordem: Dracul's Grasp lançando Life Tap, Eldritch Blast roubando 5% mais 1% por nível de vida numa nova que se mantém sozinha, Psychic Ward absorvendo 15 mais 10 por nível mais 15 por cada um dos quarenta hard points em Levitation Mastery e Cleave, e Vampire Gaze ou Crown of Ages por redução de dano fixa. Ponha os cinco pontos livres em Psychic Ward em vez de Hex: Siphon e relance antes de cada grupo.",
    gearSets: {
      starter: {
        goal: "Cleave no nível 6, e uma arma grande o bastante para que o dano cheio dela valha a pena.",
        nextUpgrade: "Um Steel ou um Edge em algo com sockets, e depois uma arma de verdade.",
        picks: {
          "weapon-0": {
            label: "A maior arma de duas mãos que você conseguir vestir",
            why: "Cleave carrega o dano **cheio** da arma, então a base importa mais que em qualquer caster. Uma de duas mãos não custa nada aqui — o Warlock a levita e a mão secundária continua livre, o que não vale para nenhuma outra classe do jogo.",
            lookFor: ["High two-handed damage", "+to Warlock Skills", "Increased Attack Speed"],
          },
          "offhand-0": {
            label: "Qualquer Grimoire com +Warlock skills",
            why: "Grimoires de tier normal pedem de 12 a 25 de Strength. De graça, e o slot só existe por causa da passiva da classe.",
            lookFor: ["+2 to Warlock Skills", "+to Cleave"],
          },
          "body-0": { why: "Recuperação de golpe e velocidade de corrida por duas runas da Countess." },
          "helm-0": { why: "+1 em Todas as Skills, que numa build com cinco skills maximizadas vale cinco níveis de nada em especial e um de tudo." },
          "gloves-0": { label: "Quaisquer luvas com Increased Attack Speed", why: "A única stat que esta build quer e que nada mais no tier fornece." },
        },
      },
      nightmare: {
        goal: "Mirrored Blades ainda está dez níveis longe, então este tier é sobre a arma e sobre continuar vivo até chegar lá.",
        nextUpgrade: "Mirrored Blades no nível 30, e depois uma base elite de arma que valha as runas.",
        picks: {
          "weapon-0": {
            why: "Dol Ort Eth Lem: 160-210% de dano aumentado e 25% de Increased Attack Speed em qualquer coisa com quatro sockets. Barato, e aguenta até uma base elite valer os sockets.",
            sockets: "Dol Ort Eth Lem numa arma de duas mãos com quatro sockets.",
          },
          "weapon-1": { why: "Se houver uma Mal e uma Um disponíveis: mais dano, Crushing Blow e Open Wounds — embora valha ler a nota do Mirrored Blades sobre Crushing Blow." },
          "offhand-0": {
            label: "Qualquer Grimoire com +2 Warlock skills",
            why: "Não existe aba de Eldritch em nenhum item do jogo, então +Warlock skills genérico é o melhor que este slot consegue até um unique elite.",
            lookFor: ["+2 to Warlock Skills", "+3 to Cleave"],
          },
          "offhand-0-alt0": { why: "Duas runas e todas as resistências. Cabe porque um Grimoire é escudo por tipo e porque duas é a única contagem de runas que os sockets dele permitem." },
          "body-0": { why: "Hel Lum Fal: +25 em todos os atributos e 15-20% de dano aumentado, e a Hel reduz requisitos por cima do Levitation Mastery." },
          "helm-0": { why: "Roubo de vida e mana antes de o Eldritch Blast fornecê-los, e 15-20% de redução de dano que esta build vai continuar querendo." },
          "belt-0": { why: "Roubo de vida e 10-15% de redução de dano." },
          "boots-0": { why: "Crushing Blow, Open Wounds e Deadly Strike, todos os quais caem no primeiro golpe de uma salva de Mirrored Blades com valor cheio." },
          "ring1-0": { why: "Não pode ser congelado, e a Dexterity paga parte do requisito da arma." },
        },
      },
      "early-hell": {
        goal: "As cinco skills centrais destravadas, os hexes caindo, e roubo suficiente para ficar em alcance de corpo a corpo no Hell.",
        nextUpgrade: "Dreadfang, que é a única arma do jogo com +Mirrored Blades.",
        picks: {
          "weapon-0": { why: "Mantido. Cada runa gasta aqui é uma runa não gasta na arma que o substitui." },
          "weapon-1": {
            why: "Amn Shael Ohm numa adaga de três sockets: 250-320% de dano aumentado, 200-260% de attack rating, 40% de Increased Attack Speed e 150-250% de dano contra demônios, além de uma chance de lançar Sigil: Death ao ser atingido. Um runeword da expansão, e a linha de dano contra demônios vale mais no Act 4 e 5 do que o número sugere.",
          },
          "offhand-0": {
            label: "Measured Wrath",
            why: "Um Burnt Text no nível 52. +1 em Warlock skills, +20-30 de resistência total e 25% de Faster Cast Rate para o Blade Warp, com 38 de Strength. As skills de fogo nele são peso morto e ele ainda é o melhor Grimoire que esta build veste neste nível.",
          },
          "body-0": { why: "Shael Um Thul: 15% de Crushing Blow, 33% de Open Wounds e 150-200% de defesa aumentada, e o dano de frio é uma lentidão que uma build de corpo a corpo sente." },
          "helm-0": { why: "Sem mudança, e a redução de dano agora está fazendo mais que o roubo." },
          "gloves-0": { why: "Roubo de vida, chance de lançar Life Tap ao golpear, e Open Wounds. Life Tap numa build que golpeia com esta frequência é a maior parte de um plano de sobrevivência." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança." },
          "amulet-0": { label: "Qualquer amuleto com +2 Warlock skills e vida", why: "Dois níveis em cinco skills maximizadas. Não existe amuleto específico de Eldritch no jogo." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { label: "Qualquer anel raro com vida, resistência e attack rating", why: "Attack rating é a stat que falta a esta build antes de o Levitation Mastery estar maximizado." },
        },
      },
      budget: {
        goal: "A arma em torno da qual a build foi construída, e redução de dano suficiente para segurar alcance de corpo a corpo numa zona de nível 85.",
        nextUpgrade: "Crown of Ages, e os 106 de Strength para um Blasphemous Grimoire.",
        picks: {
          "weapon-0": {
            label: "Dreadfang",
            why: "Uma Legend Sword no nível 61: **+3 em Mirrored Blades**, 133-166% de dano aumentado, 33% de Increased Attack Speed, 33% de Deadly Strike, 33% de chance de lançar Amplify Damage ao golpear, e −33% de requisitos. É a única arma do jogo que sobe uma skill de Eldritch, e o Amplify Damage responde às oito áreas que registram imunidade a físico.",
            lookFor: ["+3 to Mirrored Blades", "166% Enhanced Damage", "33% Deadly Strike"],
          },
          "weapon-1": { why: "Mais dano bruto e 40% de velocidade de ataque contra três níveis de Mirrored Blades e um Amplify Damage de graça. O Amplify costuma ganhar." },
          "offhand-0": {
            label: "Ars Dul'Mephistos",
            why: "Um Occult Tome no nível 78: **+2 em Warlock skills, 70-115% de dano aumentado e 50-70% de attack rating**, mais 20-30% de Faster Cast Rate. O único Grimoire do jogo que sobe dano de arma, e pede 82 de Strength em vez de 106.",
            lookFor: ["+2 Warlock Skills", "115% Enhanced Damage", "70% Attack Rating"],
          },
          "body-0": { why: "El Sol Dol Lo: 300% de dano aumentado e +15 em todas as resistências. O maior item de dano isolado disponível a um personagem de corpo a corpo." },
          "body-1": { why: "Se uma Lo estiver fora de alcance — o Crushing Blow vale a pena manter." },
          "helm-0": { why: "Mantido pela redução de dano até o Crown of Ages." },
          "gloves-0": { why: "Sem mudança. Life Tap é o motivo." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança." },
          "amulet-0": { why: "+1 em Todas as Skills, 20% de Increased Attack Speed e Deadly Strike que escala com o nível." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "+1 em Todas as Skills e a reserva de mana para o Blade Warp." },
        },
        weaponSwap: [
          { why: "Battle Orders em 3 de vida por ponto de Vitality vale mais aqui do que em qualquer caster." },
          { why: "A outra metade da troca." },
        ],
      },
      optimized: {
        goal: "O multiplicador completo de 600% de sinergia atrás de uma arma de verdade, e redução de dano suficiente para ignorar o que revida.",
        nextUpgrade: "Rolagens melhores nos mesmos itens. O plano não muda de novo.",
        picks: {
          "weapon-0": { label: "Dreadfang", why: "Sem mudança. Nada substitui +3 Mirrored Blades e um Amplify Damage de graça.", lookFor: ["+3 to Mirrored Blades", "166% Enhanced Damage"] },
          "weapon-1": {
            why: "O dano fixo do Grief é somado depois do dano aumentado em vez de multiplicado por ele, o que numa build com três sinergias de 10% por nível atrás da arma é uma fatia menor que o normal. Vale testar contra o Dreadfang em vez de assumir que ganha.",
          },
          "offhand-0": {
            label: "Ars Al'Diablolos",
            why: "Um Blasphemous Grimoire com 106 de Strength. A aba de Chaos e o +Apocalypse dele são inúteis nesta build, e os 170-200% de defesa aumentada e 25% de Faster Cast Rate não são. **Pegue o Ars Dul'Mephistos no lugar dele a menos que você já esteja pagando a Strength** — o dano de arma do Occult Tome vale mais aqui do que qualquer coisa no Grimoire.",
          },
          "offhand-0-alt0": { label: "Ars Dul'Mephistos", why: "A resposta correta para esta build, e não é perto. +2 Warlock skills, 115% de dano aumentado e 70% de attack rating." },
          "helm-0": { why: "Redução de dano, todas as resistências e dois sockets no elmo mais duro do jogo." },
          "body-0": { why: "Sem mudança. 300% de dano aumentado." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança." },
          "amulet-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "Sem mudança." },
        },
        charms: [
          { why: "O charm existe mesmo que nenhum unique exista — a aba de Eldritch é o índice 22. Nove deles são nove níveis em todas as cinco skills maximizadas, e são os únicos itens específicos de Eldritch do jogo." },
        ],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
      bis: {
        goal: "Nada mais sobre o que discutir.",
        notes:
          "O personagem pronto veste uma arma de duas mãos e uma mão secundária ao mesmo tempo, que é a única coisa desta classe que nenhuma quantidade de equipamento em nenhum outro personagem imita. Todo guia genérico de corpo a corpo que você vai ler assume que você abriu mão de um escudo por aquela arma. Você não abriu.",
        picks: {
          "weapon-0": { label: "Dreadfang", why: "Com +3 Mirrored Blades e 166% de dano aumentado." },
          "offhand-0": { label: "Ars Dul'Mephistos", why: "Com 115% de dano aumentado e 70% de attack rating. O Blasphemous Grimoire é o item melhor no papel e o pior aqui." },
          "helm-0": { why: "Dois sockets, e os dois com jóias de dano aumentado e velocidade de ataque." },
          "body-0": { why: "Sem mudança." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança." },
          "amulet-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "Sem mudança." },
        },
        charms: [{ why: "Sem mudança, e ainda os únicos itens específicos de Eldritch do jogo." }],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
    },
  },

  // =========================================================================
  "blood-boil-warlock": {
    summary:
      "Detona os próprios demônios causando fogo e físico ao mesmo tempo, e os reabastece a partir de cadáveres. Dois tipos de dano num lançamento, vindos de uma árvore que nunca segura mais de três lacaios.",
    playstyle:
      "Invoque três demônios, marque algo, e ferva. Death Mark é o que faz a árvore funcionar à distância — os seus demônios teleportam até o que você marcou, o que transforma três lacaios lentos de corpo a corpo em três que chegam — e ele arranca defesa e redução de dano do alvo enquanto isso. Blood Boil então detona um demônio num raio que sobe de 6 para 12, causando fogo e físico ao mesmo tempo. Engorge devolve um cadáver aos sobreviventes, que é a recarga. É um ciclo e não uma rotação, e o ritmo é ditado por quantos cadáveres o último grupo deixou.",
    strengths: [
      "Dois tipos de dano num único lançamento — fogo e físico, com sinergias separadas de 20% por nível cada",
      "Só seis das dezoito áreas catalogadas registram imunidade às duas metades ao mesmo tempo",
      "Blood Oath manda até 30% do dano que você toma para um demônio, numa classe que já tem 3 de vida por Vitality",
      "O custo em demônio por lançamento cai dois terços quando há três em campo em vez de um",
      "Ars Tor'Baalos sobe quatro das seis skills da build a partir de um item só",
    ],
    weaknesses: [
      "Três demônios é o teto, e dois limiares de hard point — não +skills — são a única coisa que o levanta",
      "O ciclo para sem cadáveres: sem cadáver não há Engorge, e sem demônio não há Blood Boil",
      "Blood Boil é uma detonação de alvo com raio de 6 a 12, não uma magia que limpa a tela",
      "Nada existe antes do nível 18, e o ciclo só fecha no 24",
      "A melhor mão secundária pede 95 de Strength e a base da classe é 15",
    ],
    skillPackages: {
      "the-other-38": {
        name: "Os outros trinta e oito",
        intro:
          "O núcleo são 72 pontos e o ciclo está completo nesse número. O que sobra decide se os três demônios são munição que também luta, ou se você vai tomar um quarto do mundo.",
        packages: {
          "three-goatmen": {
            name: "Três Goatmen",
            when: "Você quer que os demônios valham alguma coisa entre as detonações. Vinte pontos de Demonic Mastery são +200% de dano e +475% de attack rating em cada um deles, e vinte em Summon Goatman são mais +200% de dano, +900 de attack rating e quatro habilidades que o lacaio aprende sozinho.",
            tradeoff:
              "Sem Bind Demon, ou seja, sem quarto demônio e sem um monstro Aura Enchanted capturado lutando por você. Esta é a build mais simples e a que funciona sem depender de um grupo específico à sua frente.",
            skillNotes: {
              "summon-goatman":
                "Ele aprende Stun no 2, Berserk no 3, Frenzy no 4 e Cleave no 5 — os cinco primeiros pontos compram comportamento em vez de números, e os quinze seguintes compram dano e defesa.",
            },
            rotationNote:
              "Marque, deixe os três chegarem, e ferva o que estiver mais longe de você para que os outros dois continuem lutando. Os demônios são fonte de dano neste pacote e não devem ser gastos todos de uma vez.",
            remainderNote: "Nove pontos sobrando, em 101 de 110. Death Mark os leva — cada ponto lá é 1% a mais de Crushing Blow nos três Goatmen e uma marca mais longa.",
          },
          "bound-demon": {
            name: "O demônio vinculado",
            when: "Você quer um quarto demônio que não conta no teto. Bind Demon usa um pet type diferente com máximo de um, então um Warlock com dez pontos em Demonic Mastery segura três demônios invocados e um capturado ao mesmo tempo.",
            tradeoff:
              "Os três Goatmen ficam com um hard point e são munição em vez de lutadores. Você está trocando uma linha de frente confiável por um monstro muito melhor que precisa ser encontrado e capturado antes.",
            skillNotes: {
              "death-mark": "Ele aumenta a chance de vincular além de marcar o alvo.",
              "bind-demon":
                "Os afixos são a progressão, não os números: Extra Strong com 5 hard points, Extra Fast com 10, Spectral Hit com 15 e Aura Enchanted com 20. Por cima disso o demônio vinculado ganha +75% de dano com mais 5% por nível e +100% de vida com mais 5% por nível.",
              consume:
                "Destrói um demônio de vez por +5% de vida máxima mais 1% por nível e velocidade de movimento rumo a um teto de 46%, por 40 segundos. Um ponto, usado antes de um chefe.",
            },
            gearNote: "Ars Tor'Baalos fica ainda melhor aqui — ele carrega +2-3 em Consume além das três skills que este pacote já queria.",
            rotationNote:
              "Vincule algo perigoso antes da luta, não durante. Um monstro Aura Enchanted vinculado com vinte hard points é o lacaio isolado mais forte que a classe consegue pôr em campo, e vale voltar para pegar.",
            contentNote: "Melhor em áreas com demônios grandes e lentos que valem a captura — Act 4 e Act 5 em vez das selvas de Kurast.",
            remainderNote: "Cinco pontos sobrando, em 105 de 110. Vão para Death Mark, que alonga a marca e sobe a chance de vínculo ao mesmo tempo.",
          },
        },
      },
    },
    statPlan: {
      strength: "O suficiente para a mão secundária, e o número é 95 se você quiser o Compendium elite.",
      dexterity: "Base.",
      vitality: "Todo o resto, e vale mais aqui do que nas builds de caster porque o Blood Oath já está mandando parte do dano para outro lugar.",
      energy: "Nenhuma.",
      notes: [
        "**A mão secundária é o plano de Strength.** Ars Tor'Baalos fica num Blasphemous Compendium, que pede **95 de Strength** contra uma base de classe de 15. Um Possessed Compendium pede 50 e um Burnt Text 38, e os dois são respostas legítimas até o elite valer o pagamento.",
        "**Levitation Mastery reduz requisitos de item em 2% por nível até um piso de −50%.** Esta build não gasta ponto nela e não orça o desconto; se a redução alcança armadura não está estabelecido.",
        "Vitality trabalha mais aqui do que em qualquer outra build de Warlock. Blood Oath manda até 30% do dano recebido para um demônio, o que é um multiplicador sobre a vida que você já tem, e não um substituto dela.",
        "A mana do Blood Boil é 15 mais 1 por nível e a do Engorge é 12 mais 1. O ciclo é barato; as invocações não, com 30, 50 e 70. Insight no mercenário cobre a diferença.",
      ],
    },
    breakpointWhy: {
      "fcr-75": "Blood Boil, Engorge e Death Mark são todos conjurações, e o ciclo são três delas por grupo. Este é um breakpoint de dano nesta build, e não de conveniência.",
      "fhr-56": "A tabela de Necromancer/Druid/Warlock. Você fica mais perto que um caster e mais longe que um personagem de corpo a corpo.",
      "fcr-125": "Alcançável assim que os 30% do Bloodpact Shard estiverem na mão, e o ciclo é curto o bastante para o frame ser sentido.",
    },
    skillNotes: {
      "blood-boil":
        "Duas tabelas ao mesmo tempo — 10-20 de fogo e 10-20 de físico no nível 1, crescendo de forma idêntica. O raio sobe em degraus nos hard points 5 e 10: 6, depois 9, depois 12.",
      "blood-oath":
        "+20% na metade de fogo do Blood Boil por nível, e separadamente o plano de sobrevivência: até 30% do dano que você toma vai para um demônio, e a vida deles sobe 50% mais 35% por nível para que sobrevivam a receber isso.",
      engorge:
        "+20% na metade física do Blood Boil por nível, e a recarga: dá um cadáver aos demônios por 30% da vida deles mais 1% por nível, com 5% de redução de dano e roubo de vida por cima.",
      "demonic-mastery":
        "**Dez hard points são a razão inteira desta alocação.** Cinco levam o teto de demônios de um para dois e dez levam para três. Os dois limiares leem hard points, então +skills de equipamento não os movem — este é o único número em qualquer build de Warlock que equipamento não compra.",
      "summon-goatman": "Um ponto invoca. Quantos você tem é assunto do Demonic Mastery, não desta skill.",
      "death-mark":
        "A skill que torna a árvore jogável à distância: alvos marcados puxam os seus demônios até eles através de 38 unidades. Ela também corta 5 da redução de dano do alvo e 50 da defesa dele, e dá aos seus Goatmen 5% de Crushing Blow mais 1% por nível desta skill.",
    },
    immunityPlan:
      "**Blood Boil causa fogo e físico no mesmo lançamento, e os dois têm sinergias separadas.** Isso não é detalhe de sabor — é a razão de esta build ter a segunda melhor cobertura de imunidade das quatro, atrás apenas da mágica.\n\nDas dezoito áreas catalogadas, doze registram imunidade a fogo e oito registram físico. **Seis registram as duas**: o Chaos Sanctuary, o Worldstone Keep, os Kurast Temples, o River of Flame, o templo do Nihlathak e a Stony Tomb. Em todo o resto, pelo menos uma metade do lançamento cai com força total. Os Ancient Tunnels param o fogo e não o físico; o Pit para o físico e não o fogo; o Mausoleum e o Pindleskin não param nenhum dos dois.\n\n**Contra as seis, há duas respostas e as duas são charms.** Um Flame Rift quebra imunidade a fogo ao custo de 70 a 90 pontos da sua própria resistência a fogo, e um Bone Break faz o mesmo pelo físico. Qualquer um dos dois converte uma área duplamente imune numa área simplesmente imune, o que basta — você não precisa dos dois, porque não está tentando fazer as duas metades caírem.\n\nO que esta build **não** tem é uma quebra de resistência própria. Nenhuma skill de Warlock fora da árvore Chaos baixa resistência nenhuma, Death Mark baixa redução de dano e defesa em vez de resistência elemental, e não há nada na árvore Demon que se comporte como Amplify Damage. Os dois sunder charms são a resposta inteira e a página não vai inventar uma terceira.",
    mercenaryNotes:
      "Act 2, Nightmare, Might — ele sobe o dano físico dos demônios além do do mercenário, e o Blood Oath já fez dos demônios parte da sua defesa. Insight na polearm é o plano de mana: três invocações custam 30, 50 e 70, e o ciclo por cima disso são mais 27 por grupo. O mercenário também é um segundo corpo para o Blood Oath usar, o que importa mais aqui do que nas builds de caster.",
    farmingWhy: {
      "mausoleum-hell":
        "Área de nível 85 com imunidade a veneno e frio registrada — nenhuma das duas metades do dano desta build é tocada. Mortos-vivos e denso, o que significa cadáveres, o que significa que o Engorge nunca para.",
      "pindleskin-hell":
        "Imunidade a frio e veneno registrada, uma run de trinta segundos, e um grupo apertado o bastante para uma fervura cobrir. Os lacaios dele também são os cadáveres da próxima.",
      "andariel-hell": "Só imunidade a veneno. Uma chefe sozinha e parada, que é o que uma detonação de alvo quer, e uma run curta.",
      "mephisto-hell":
        "Imunidade a fogo e raio registrada — a metade de fogo fica cega aqui e a física não, que é o argumento inteiro para carregar as duas.",
      "pit-hell": "Imunidade a físico, frio e raio registrada, e nada de fogo. A imagem espelhada dos Ancient Tunnels, e a outra metade do mesmo argumento.",
      "ancient-tunnels-hell":
        "Área de nível 85 com imunidade a fogo e veneno registrada e nada de físico — então a metade de fogo do Blood Boil é parada e a física não. Denso, e os cadáveres ficam próximos uns dos outros.",
    },
    levelingPath: {
      summary:
        "A ingrata das quatro. Summon Goatman e Death Mark carregam os primeiros dezoito níveis sozinhos e a build só existe de verdade com o Blood Boil no 18, com o ciclo só fechando quando o Engorge chega no 24. Nada é desperdiçado — Demonic Mastery e Blood Oath são ambos maximizados pelo plano pronto — mas espere que os demônios façam a matança durante todo o Act 1 e o Act 2.",
      respecAt: "Nenhum respec é necessário. Cada ponto gasto na subida é um que o plano de nível 99 quer.",
    },
    selfFoundNotes:
      "Razoável em solo, e melhor que a página do Cleave. O ciclo central não precisa de item nenhum específico: dez hard points em Demonic Mastery são a melhoria mais importante da build e não custam nada. Spirit são quatro runas da Countess e Coven precisa de uma Ist. O que você não vai achar é o Ars Tor'Baalos, e até lá o Measured Wrath no nível 52 ou qualquer Grimoire com +2 na aba de Demon faz a maior parte do trabalho dele — a aba vale dois níveis em quatro das suas seis skills ao mesmo tempo, que é o mesmo formato do unique elite em miniatura.",
    hardcoreNotes:
      "A mais dura das quatro, e o Blood Oath é a razão. Até 30% do que te acerta é mandado para um demônio, numa classe que já ganha 3 de vida por ponto de Vitality — e a mesma passiva sobe a vida dos demônios em 50% mais 35% por nível e as resistências deles rumo a um teto de 79%, então a coisa que absorve o dano sobrevive a absorvê-lo. Pegue o pacote dos Três Goatmen em vez do demônio vinculado: um monstro capturado precisa ser encontrado, e um personagem de Hardcore não deveria estar entrando num grupo para adquirir a própria defesa. Mantenha os 5% de redução de dano do Engorge ativos, e lembre que o ciclo precisa de cadáveres — a luta perigosa é aquela em que nada morreu ainda.",
    gearSets: {
      starter: {
        goal: "Um Goatman desde o nível 1, e Death Mark no 6 para que ele chegue onde você quer.",
        nextUpgrade: "Dez hard points em Demonic Mastery, que valem mais que qualquer item deste tier.",
        picks: {
          "weapon-0": {
            label: "Qualquer wand, staff ou adaga com +Warlock skills",
            why: "Um staff de duas mãos não custa nada nesta classe — a arma levita e a mão secundária continua livre.",
            lookFor: ["+1-3 to Warlock Skills", "+to Summon Goatman", "Faster Cast Rate"],
          },
          "offhand-0": {
            label: "Qualquer Grimoire com +Warlock skills",
            why: "Bases de tier normal pedem de 12 a 25 de Strength.",
            lookFor: ["+2 to Warlock Skills", "+2 to Demon Skills"],
          },
          "body-0": { why: "Cast rate e recuperação de golpe por duas runas da Countess." },
          "helm-0": { why: "+1 em Todas as Skills, que neste nível é um segundo Goatman cinco níveis antes da hora." },
        },
      },
      nightmare: {
        goal: "Blood Boil no 18 e Engorge no 24 — o ciclo fechando pela primeira vez.",
        nextUpgrade: "Bloodpact Shard no nível 67, que é a maior melhoria isolada do personagem.",
        picks: {
          "weapon-0": { why: "+2 em Todas as Skills e 25-35% de Faster Cast Rate. Dois níveis de Blood Boil e dois de Blood Oath por quatro runas da Countess." },
          "offhand-0": {
            label: "Qualquer Grimoire com +2 Warlock skills e a aba de Demon",
            why: "A aba de Demon é o índice 21. Um +2 ali são dois níveis em todas as skills do plano de uma vez.",
            lookFor: ["+2 to Warlock Skills", "+2 to Demon Skills"],
          },
          "offhand-0-alt0": {
            why: "Dol e Gul num Grimoire: todas as resistências, vida, mana e defesa, por duas runas que caem o tempo todo. Duas runas também é a única contagem que os sockets de um Grimoire permitem.",
          },
          "body-0": { why: "+1 skills, 30% de cast rate e resistências." },
          "helm-0": { why: "+1 em Todas as Skills e magic find." },
          "belt-0": { why: "Resistências e dano-para-mana." },
          "boots-0": { why: "Vida e stamina." },
          "ring1-0": { why: "Magic find num slot reservado." },
        },
      },
      "early-hell": {
        goal: "O ciclo rodando no Hell, com resistência suficiente para que um grupo fervido não leve você junto.",
        nextUpgrade: "Bloodpact Shard, e depois Ars Tor'Baalos.",
        picks: {
          "helm-0": {
            why: "Ist Ral Io: +1 em Todas as Skills, 20% de Faster Cast Rate e 26-40% de magic find quando se conta o modificador de elmo da Ist.",
            sockets: "Ist Ral Io num circlet de três sockets.",
          },
          "weapon-0": { why: "Mantido até o Bloodpact Shard." },
          "offhand-0": {
            label: "Measured Wrath",
            why: "Um Burnt Text no nível 52 com +1 em Warlock skills, +20-30 de resistência total e 25% de Faster Cast Rate, com 38 de Strength. As skills de fogo dele são peso morto; as resistências e o cast rate não.",
          },
          "offhand-0-alt0": { why: "Se as resistências importarem mais que o nível de skill." },
          "body-0": { why: "Sem mudança." },
          "belt-0": { why: "+1 em Todas as Skills e 20% de Faster Cast Rate — o ciclo são três conjurações por grupo e isso encurta as três." },
          "boots-0": { why: "Strength e Vitality, e a Strength está indo em direção a uma conta de 95 pontos." },
          "amulet-0": { label: "Qualquer amuleto com +2 Warlock skills", why: "Dois níveis no plano inteiro." },
          "ring1-0": { why: "+1 em Todas as Skills e a mana para três invocações." },
          "ring2-0": { label: "Qualquer anel raro com 10% de Faster Cast Rate e resistência", why: "Onde o breakpoint de 75% costuma fechar." },
        },
      },
      budget: {
        goal: "Os dois itens de classe que foram feitos para esta build.",
        nextUpgrade: "Enigma, ou um segundo Stone of Jordan.",
        picks: {
          "weapon-0": {
            label: "Bloodpact Shard",
            why: "Um Mithril Point no nível 67: **+1 em Todas as Skills, +2-3 Blood Oath, +2-3 Blood Boil, +1-3 Bind Demon, 30% de Faster Cast Rate e +10-15% de vida máxima**, com 25% de lentidão por cima. Ele sobe as duas skills de que a build inteira é feita e paga um breakpoint de cast rate ao mesmo tempo.",
            lookFor: ["+3 to Blood Boil", "+3 to Blood Oath", "+15% Maximum Life"],
          },
          "offhand-0": {
            label: "Ars Tor'Baalos",
            why: "Um Blasphemous Compendium no nível 73: **+2 em Demon Skills, +2-3 Demonic Mastery, +2-4 Blood Boil, +2-3 Engorge, +2-3 Consume**, 12 de vida por nível de personagem e 5-10% de redução de dano. Ele sobe quatro das seis skills desta build a partir de um slot só e não existe nada igual no jogo. Pede 95 de Strength.",
            lookFor: ["+4 to Blood Boil", "+3 to Engorge", "+3 to Demonic Mastery"],
          },
          "offhand-0-alt0": {
            label: "Measured Wrath",
            why: "Se 95 de Strength for mais do que você quer pagar ainda. Ele pede 38, e a diferença são cerca de quarenta pontos de atributo.",
          },
          "helm-0": { why: "+2 em Todas as Skills, vida e mana por nível, e 10% de redução de dano." },
          "body-0": { why: "Hel Shael Ral: +2 em Warlock skills e 40-60% de defesa aumentada, e a Hel dá uma mordida naquele requisito de Strength." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { why: "Sem mudança, e a Strength está sustentando o plano." },
          "amulet-0": { why: "+2 em Todas as Skills e +20-30 em todas as resistências." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": {
            label: "Opalvein",
            why: "Um anel de nível 50: 2-15% de chance de lançar Flame Wave ao atacar, 10% de Faster Cast Rate, +6-8 em todas as resistências e vida e mana por abate. As linhas de por-abate combinam com uma build que mata em rajadas.",
          },
        },
        weaponSwap: [
          { why: "Battle Orders sobe a vida dos demônios além da sua, e o Blood Oath já fez da vida deles a sua defesa." },
          { why: "A outra metade." },
        ],
      },
      optimized: {
        goal: "Os dois itens de classe bem rolados, e Teleport para que os demônios sigam você em vez do contrário.",
        nextUpgrade: "Rolagens melhores. O plano não muda de novo.",
        picks: {
          "weapon-0": { label: "Bloodpact Shard", why: "Sem mudança. Nada mais no jogo carrega +Blood Boil e +Blood Oath juntos." },
          "offhand-0": { label: "Ars Tor'Baalos", why: "Sem mudança, e agora vale os 95 de Strength.", lookFor: ["+4 to Blood Boil", "+3 to Engorge"] },
          "helm-0": { why: "Sem mudança." },
          "body-0": {
            why: "Teleport. Death Mark puxa os demônios até um alvo marcado através de 38 unidades, então um Warlock que teleporta e três demônios chegam juntos — esta é a build em que o Enigma muda a rotação e não só o tempo de deslocamento.",
          },
          "body-1": { why: "Se uma Jah estiver fora de alcance." },
          "gloves-0": { why: "+1 em Fire Skills sobe a metade de fogo do Blood Boil e não a metade física — meio item, e ainda as melhores luvas disponíveis à build." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": {
            label: "Wraithstep",
            why: "Mirrored Boots no nível 67: **+1 numa aba de skills do Warlock**, 30% de Faster Run/Walk, 20% de Faster Hit Recovery e +10-15 de Dexterity e Energy. As únicas botas do jogo que carregam uma aba de Warlock.",
          },
          "boots-0-alt0": { why: "Se a Strength ainda for necessária para o Compendium." },
          "amulet-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "Um segundo." },
        },
        charms: [{ why: "A aba de Demon é o índice 21, e é uma das duas únicas abas de Warlock que aparecem em qualquer item do jogo." }],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
      bis: {
        goal: "Nada mais a mudar.",
        notes:
          "Dois dos dez slots do personagem pronto são itens que só existem porque esta classe existe, e os dois foram feitos para esta build especificamente. Isso não vale para nenhuma outra página de Warlock.",
        picks: {
          "weapon-0": { label: "Bloodpact Shard", why: "Com +3 Blood Boil, +3 Blood Oath e +15% de vida máxima." },
          "offhand-0": { label: "Ars Tor'Baalos", why: "Com +4 Blood Boil e +3 tanto em Engorge quanto em Demonic Mastery." },
          "helm-0": { why: "Com um Rainbow Facet de fogo no socket — metade do dano é fogo e o facet só lê essa metade." },
          "body-0": { why: "Sem mudança." },
          "gloves-0": { why: "Sem mudança." },
          "belt-0": { why: "Sem mudança." },
          "boots-0": { label: "Wraithstep", why: "Com +1 na aba de Demon, se a rolagem colaborar — a aba que ele concede é aleatória." },
          "amulet-0": { why: "Sem mudança." },
          "ring1-0": { why: "Sem mudança." },
          "ring2-0": { why: "Sem mudança." },
        },
        charms: [{ why: "Nove níveis em Blood Boil, Blood Oath e Engorge de uma vez." }],
        weaponSwap: [{ why: "Sem mudança." }, { why: "Sem mudança." }],
      },
    },
  },
};
