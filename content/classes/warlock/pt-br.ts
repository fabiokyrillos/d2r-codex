import type { Overlay, SkillCopy, SkillTreeCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR das skills e das árvores do Warlock.
 *
 * Os **nomes** das skills e das árvores permanecem em inglês (dados
 * invariantes) — é assim que aparecem em toda base de dados, em todo guia e em
 * toda conversa da comunidade brasileira. Só as descrições são traduzidas.
 * Ver ADR 0003.
 *
 * Termos do jogo que ficam em inglês por serem nomes próprios de mecânica:
 * hard points, Crushing Blow, frames, pet type, sigil. Números e ressalvas
 * acompanham a fonte em inglês exatamente — a contagem de bullets de
 * `mechanics` é verificada pelo `check:content` e não pode divergir.
 */

export const warlockTreesPtBr: Overlay<SkillTreeCopy> = {
  demon: {
    name: "Demon",
    summary: "Demônios escravizados, as passivas que os mantêm de pé, e as skills que os gastam.",
    theme:
      "A árvore é uma economia, não um exército. Você segura no máximo três demônios, e metade da árvore existe para convertê-los em outra coisa — Blood Boil detona um, Engorge alimenta um com um cadáver, Consume destrói um de vez por um buff em você. Demonic Mastery é o que sobe o teto de um demônio para três, então é a primeira decisão de verdade que a classe pede.",
  },
  eldritch: {
    name: "Eldritch",
    summary: "A árvore da arma: uma mastery, quatro jeitos de golpear ou arremessar, e três hexes carregados no acerto.",
    theme:
      "Tudo aqui exige uma arma na mão. Levitation Mastery é a passiva de dano da classe, as quatro skills de ataque são formatos diferentes do mesmo golpe — um arco, um arremesso, um arremesso que te move, e uma salva de duplicatas — e os hexes pegam carona em qualquer uma delas. É a única árvore em que escolher equipamento e escolher skill é a mesma escolha.",
  },
  chaos: {
    name: "Chaos",
    summary: "Dano de fogo e de vazio à distância, mais três sigils postos no chão.",
    theme:
      "Duas escolas de dano e um ramo de controle entre elas. O fogo vai de Ring of Fire para Flame Wave para Apocalypse; o vazio vai de Miasma Bolt para Miasma Chain para Abyss, tudo dano mágico que pouquíssima coisa resiste. Os sigils não são nem um nem outro — são objetos postos no chão que seguram terreno, e o último deles executa qualquer coisa que caia abaixo de um décimo da vida dentro do anel.",
  },
};

export const warlockSkillsPtBr: Overlay<SkillCopy> = {
  // -------------------------------------------------------------------------
  // Demon
  // -------------------------------------------------------------------------
  "summon-goatman": {
    summary: "Um demônio corpo a corpo que aprende quatro habilidades próprias conforme a skill cresce.",
    mechanics: [
      "Ele ganha uma skill própria em cada um dos cinco primeiros hard points: **Stun no 2, Berserk no 3, Frenzy no 4 e Cleave no 5**. Os quatro primeiros pontos compram comportamento em vez de números, o que os torna baratos e torna os seguintes comuns.",
      "O dano dele começa em **+10% e sobe 10% por nível**, a attack rating em **140 com mais 40 por nível**, e a defesa em **100 com mais 20 por nível**. Demonic Mastery soma aos dois primeiros por cima disso.",
      "**Quantos você tem não se decide aqui.** Os três summons compartilham o pet type `demon` e o mesmo teto — um, subindo para dois com 5 hard points em Demonic Mastery e três com 10 — então o limite é o total entre todo tipo de demônio, não um de cada.",
      "Pontos em **Death Mark** dão Crushing Blow a ele: **5% com um ponto, mais 1% por nível de Death Mark**.",
    ],
  },
  "demonic-mastery": {
    summary: "Sobe dano, attack rating e velocidade de todo demônio — e é a única coisa que sobe quantos você tem.",
    mechanics: [
      "**Cinco hard points levam o teto de demônios de um para dois, e dez levam para três.** Nada mais no jogo mexe nesse número, e `+skills` de equipamento não mexem: os dois limiares leem apenas hard points.",
      "Cada demônio ganha **+10% de dano com mais 10% por nível**, **+25% de attack rating com mais 25% por nível**, e **+5% de velocidade de ataque com mais 1% por nível**.",
      "Velocidade de movimento é a exceção ao padrão — sobe numa curva decrescente de **+5% rumo a um teto de 39%**, então o primeiro ponto vale muito mais que o vigésimo.",
      "A skill não tem efeito próprio. Ela escreve um estado que a linha de cada demônio lê, e é por isso que nada aparece na sua própria ficha.",
    ],
  },
  "death-mark": {
    summary: "Marca um monstro: seus demônios teleportam até ele, e ele passa a receber mais dano de tudo.",
    mechanics: [
      "A marca corta a redução de dano do alvo em **5, e mais 2 por nível**, e a defesa dele em **50, e mais 35 por nível**. Os dois são grandes cedo e a linha de defesa continua grande.",
      "Seus demônios **teleportam até o alvo marcado** — a linha carrega uma distância de warp de 38 — que é o que transforma três minions lentos de corpo a corpo em algo que chega. Esta é a skill que torna a árvore Demon jogável à distância.",
      "Ela **exige um demônio em campo**. Sem pet, a skill não tem o que comandar.",
      "Ela também limpa parte do controle de grupo do pet que envia, e alimenta duas outras skills: o Crushing Blow do Summon Goatman, e a chance de captura do Bind Demon.",
      "A duração é de **125 frames com mais 13 por nível** — cerca de cinco segundos com um ponto, e a ideia é reconjurar no próximo alvo em vez de manter.",
    ],
  },
  "summon-tainted": {
    summary: "Um demônio à distância que arremessa fogo e carrega o seu Blood Boil.",
    mechanics: [
      "Ele conjura **Fire Ball no seu nível nesta skill**, e resiste a fogo por conta própria — um nível de Resist Fire por ponto, limitado a 30.",
      "Ele conhece **Blood Boil no seu nível de hard points naquela skill**, que é o único caso da árvore em que um summon carrega uma das suas skills em vez de uma versão dela.",
      "Defesa de **75 com mais 20 por nível**, vida **+35% por nível**, o mesmo crescimento que todo demônio ganha.",
      "Ele divide o teto `demon` com Goatmen e Defilers. Conjurar um não soma ao seu total, preenche um espaço.",
    ],
  },
  "summon-defiler": {
    summary: "O demônio resistente. Carrega Health Link, e é a coisa mais dura que a árvore conjura.",
    mechanics: [
      "Defesa de **125 com mais 20 por nível**, a maior base dos três, e o dano dele cresce **10% por nível desta skill e por nível de Demonic Mastery** — o único summon cujo dano lê os hard points da mastery diretamente.",
      "Ele carrega **Health Link**, uma skill própria que os outros dois demônios não têm.",
      "Mesmo teto compartilhado dos outros dois, e é o mais caro dos três para conjurar, com 70 de mana.",
    ],
  },
  "blood-oath": {
    summary: "Redireciona o dano que você toma para os seus demônios, e os endurece para que sobrevivam a ele.",
    mechanics: [
      "A parcela de dano enviada a um demônio sobe numa curva decrescente **rumo a 30%**, então os primeiros pontos compram quase tudo.",
      "Demônios ganham resistência no mesmo formato de curva — de **3% rumo a 79%** — e redução de dano físico de **1 rumo a 12**. Juntos, é o que permite a um demônio absorver um golpe que era para você.",
      "Sobe a vida dos demônios em **50% com um ponto e mais 35% por nível**, que é por que os summons da árvore Demon escalam com uma passiva em vez de com as próprias skills de summon.",
      "Alimenta o **Engorge** duas vezes: +25 de defesa e +5 de regeneração de vida por hard point desta skill, os dois aplicados pela aura do Engorge.",
      "A linha também carrega um bônus de vida, mana e stamina para o Warlock — 10% com mais 1% por nível — que nenhuma expressão das tabelas lê. Ele é presumivelmente aplicado pela função de servidor da skill, e nenhum número para isso é publicado aqui.",
    ],
  },
  "blood-boil": {
    summary: "Detona um dos seus demônios. Metade fogo, metade físico, pago com a vida do demônio.",
    mechanics: [
      "O dano são **duas tabelas, não uma**: 10-20 de fogo e 10-20 de físico no nível 1, com crescimento idêntico. Elas têm sinergias separadas — Blood Oath sobe o fogo e Engorge sobe o físico — que é a evidência de serem duas metades em vez de um número escrito duas vezes.",
      "Ela **custa vida do demônio, e o custo cai conforme você gasta mais demônios**: 15% da vida de um demônio no nível 1, dividido pela metade com dois em campo e por três com três em campo, nunca abaixo de 5%.",
      "O raio da explosão sobe em degraus por hard point: **6 no nível 1, 9 no 5 e 12 no 10**.",
      "Ela precisa de um demônio em campo. Sem nenhum, não há o que ferver.",
    ],
    synergyBonuses: ["+20% na metade física por nível", "+20% na metade de fogo por nível"],
  },
  engorge: {
    summary: "Dá um cadáver aos seus demônios. Cura, e dá roubo de vida, velocidade e redução de dano a eles.",
    mechanics: [
      "Ela mira num **cadáver**, o que a torna a única skill da árvore com uma economia fora dos seus próprios demônios.",
      "A cura é de **30% da vida do demônio com mais 1% por nível**, e o buff que vem junto dá **5% de redução de dano**, roubo de vida, e attack rate subindo rumo a um **teto de 35%**.",
      "A duração é de **125 frames com mais 75 por nível** — cinco segundos com um ponto, e cerca de um minuto com vinte.",
      "Duas das linhas da aura vêm do **Blood Oath**, não desta skill: +25 de defesa e +5 de regeneração de vida por hard point lá.",
      "Ela também é a sinergia de dano físico do **Blood Boil**, então as duas costumam ser pegas juntas em vez de qualquer uma sozinha.",
    ],
  },
  consume: {
    summary: "Destrói um dos seus próprios demônios de vez e toma a força vital dele como vida máxima e velocidade.",
    mechanics: [
      "O demônio é consumido por inteiro — a linha gasta **100% da vida dele** — então é uma conversão de mão única, não um dreno.",
      "Você ganha **+5% de vida máxima com mais 1% por nível**, e velocidade de movimento numa curva decrescente de **+10% rumo a um teto de 46%**.",
      "A duração é de **1000 frames com mais 500 por nível**: quarenta segundos com um ponto, vinte segundos a mais para cada seguinte.",
      "É um efeito **periódico** que limpa a própria aura quando acaba, então o buff termina de forma limpa em vez de ser renovado ao consumir de novo no meio da duração.",
      "Ela também alimenta o dano do **Hex: Bane**, que é a única ligação da árvore com a árvore Eldritch e a razão de uma build de hex às vezes gastar um ponto aqui.",
    ],
  },
  "bind-demon": {
    summary: "Escraviza um demônio que você encontra pelo mundo. Ele não conta no teto de summons.",
    mechanics: [
      "O demônio vinculado usa um **pet type diferente dos três summons, com máximo de um**. Um Warlock com dez pontos em Demonic Mastery segura três demônios conjurados *e* um vinculado — esta é de longe a maior razão para pegar a skill.",
      "Ele ganha **afixos de monstro em hard points**: Extra Strong no 5, Extra Fast no 10, Spectral Hit no 15 e Aura Enchanted no 20. Esses quatro limiares são a progressão real da skill.",
      "Ele recebe **+75% de dano com mais 5% por nível**, **+100% de vida com mais 5% por nível**, e dano fixo de **50 com mais 25 por nível**.",
      "**Death Mark aumenta a chance de vincular.** A chance de captura em si começa em 12 e é limitada a 64, mas a curva entre os dois é resolvida num arquivo fora desta extração, então nenhuma chance por nível é publicada.",
      "Diferente de um summon comum, ele regenera vida, e a linha diz isso explicitamente em vez de deixar para o padrão de monstros elite.",
    ],
  },

  // -------------------------------------------------------------------------
  // Eldritch
  // -------------------------------------------------------------------------
  "levitation-mastery": {
    summary: "A weapon mastery da classe. Conta armas, não mãos — que é o ponto inteiro da classe.",
    mechanics: [
      "Ela paga enquanto **exatamente uma arma estiver equipada**, e a linha é indiferente a se essa arma é de uma ou de duas mãos. É a regra da levitação como as tabelas a expressam, e é por isso que a discussão usual de uma mão contra duas mãos não vale para esta classe.",
      "**+25% de dano com mais 4% por nível**, e **+40% de attack rating com mais 5% por nível**. Os dois são números comuns de mastery; a classe os recebe sem abrir mão da off-hand.",
      "Ela também dá uma chance de acerto crítico que sobe numa curva decrescente de **0 rumo a 35%**.",
      "A linha que vale planejar: **−2% nos requisitos da arma com mais 2% por nível, até um piso de −50%**. Um Warlock com muitos pontos aqui paga metade da Strength e da Dexterity listadas na arma, o que muda a distribuição de atributos mais do que o dano muda.",
    ],
  },
  cleave: {
    summary: "Um arco largo de corpo a corpo que golpeia mais rápido que um ataque normal e custa quase nada de mana.",
    mechanics: [
      "O arco é medido em fatias de um círculo dividido em trinta: **onze no nível 1, mais uma por nível, limitado a vinte**. É algo em torno de 132° abrindo para 240° — quase toda a volta em torno de você.",
      "Ela carrega o **dano cheio da arma**, e soma **20% com mais 5% por nível** por cima. A velocidade de ataque sobe numa curva de **+10% rumo a 30%**.",
      "Custa **3 de mana fixos que não crescem com o nível**, e a linha permite golpear mesmo sem mana nenhuma. É a skill que você segura apertada.",
      "É pré-requisito do Psychic Ward e sinergia dele, então as duas costumam ser compradas juntas.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível", "+10% de dano por nível"],
  },
  "echoing-strike": {
    summary: "Arremessa a arma de corpo a corpo levitada à distância e mantém a maior parte do dano dela.",
    mechanics: [
      "O arremesso carrega **116/128 — cerca de 91% — do dano da arma**, mais uma tabela física própria começando em 8-12. A parcela da arma é a metade maior disso, e é por isso que a skill quer uma arma pesada em vez de uma rápida.",
      "**+30% de dano com mais 5% por nível**, e **+10% de attack rating por nível**.",
      "**Mirrored Blades soma arremessos**: um na base, e mais um a cada cinco hard points lá, até cinco. Sem Mirrored Blades, ela arremessa uma vez.",
      "A arma **volta**, e o projétil carrega uma chance de puxar alvos junto na viagem de volta. A chance em si é uma coluna que o jogo deixa vazia, então nenhum número para isso é publicado.",
      "Ela consome durabilidade da arma. Só arma de corpo a corpo — a linha restringe de um jeito que Mirrored Blades não restringe.",
    ],
    synergyBonuses: ["+5% de dano por nível", "+5% de dano por nível"],
  },
  "blade-warp": {
    summary: "Lança a arma, teleporta você até onde ela cai, e a detona causando dano mágico.",
    mechanics: [
      "**A tabela mágica é o dano inteiro.** Diferente de Echoing Strike e Mirrored Blades, que rodam na mesma função de servidor e ambas declaram uma parcela da arma, esta linha não declara nenhuma e zera as colunas de dano e de dano fixo. Se uma extração futura der a ela uma parcela de arma, é esta frase que muda.",
      "É a **skill de movimento** da classe: o warp é o ponto, e a explosão mágica de 8-10 num raio de 4 é o que você ganha por usá-la ofensivamente.",
      "Custa **15 de mana fixos em todo nível**, o que a torna barata para repetir tarde e cara cedo.",
      "A sinergia dela é a maior da árvore, com **24% por nível**, vinda de duas skills que uma build de arma já quer.",
    ],
    synergyBonuses: ["+24% de dano por nível", "+24% de dano por nível"],
  },
  "mirrored-blades": {
    summary: "Ataca com duplicatas etéreas da arma. Duas na base, cinco com quinze pontos.",
    mechanics: [
      "**Dois ataques com um ponto, três no 5, quatro no 10 e cinco no 15.** A contagem é a skill; tudo depois de quinze pontos é dano em ataques que você já tinha.",
      "Cada ataque carrega o **dano cheio da arma**. As duplicatas depois da primeira caem com uma parcela reduzida que sobe numa curva de **50% rumo a 120%** — acima de 100% em níveis altos, o que é incomum e é por que a skill escala além da própria contagem.",
      "**Crushing Blow é dividido nas duplicatas**, e o quanto depende do nível: por 8 abaixo de 5 pontos, 12 abaixo de 10, 16 abaixo de 15 e 20 acima disso. Uma build de Crushing Blow ganha menos com os golpes extras do que a contagem de golpes sugere.",
      "Funciona com **qualquer arma**, não só corpo a corpo — a única da árvore assim — e alimenta Cleave, Echoing Strike e Blade Warp como sinergia.",
      "A própria expressão de sinergia de dano da linha lê um parâmetro que a linha não tem, então o graph não emite sinergia nenhuma para dentro desta skill. Nada é publicado sobre uma, em nenhuma direção.",
    ],
  },
  "hex-bane": {
    summary: "Um golpe de arma que soma dano mágico e deixa o alvo mais fácil de acertar e de machucar.",
    mechanics: [
      "O dano cheio da arma cai e a tabela mágica cai junto — **9-16 no nível 1**. A mesma faixa sorteada também é escrita no seu personagem como dano mágico fixo de arma, então a skill é um imbue além de um ataque.",
      "O hex tira **30% da defesa do alvo com mais 1% por nível, até um teto de 50%**, e **25% da attack rating dele**.",
      "Dura **3600 frames com mais 300 por nível** — cerca de dois minutos e meio com um ponto. É um debuff que você aplica uma vez por grupo, não um que você mantém.",
      "Ela **não pode ser usada com armas de mão a mão**. Todo outro tipo de arma funciona.",
      "Consume, Hex: Purge e Mirrored Blades sobem o dano dela nas tabelas do próprio jogo, mas por um parâmetro que o graph não lê atualmente; a relação é real e nenhuma magnitude para ela é publicada aqui.",
    ],
    synergyBonuses: ["+5 frames de duração do hex por nível"],
  },
  "hex-purge": {
    summary: "Um hex que detona. A maioria dos acertos explode, e a explosão tem cargas.",
    mechanics: [
      "O dano da arma cai com uma tabela mágica de **10-15 no nível 1** por cima.",
      "A explosão dispara em cerca de **69% dos acertos na base**, e **Sigil: Death sobe isso em 1% por nível** — a única ligação da árvore com a árvore Chaos.",
      "Ela carrega **cargas**: uma explosão na base, duas com 10 hard points e três com 20. O raio é fixo em 4. A linha também nomeia um crescimento de raio por nível que nenhuma expressão lê, então nenhum é publicado.",
      "Dá **+10% de velocidade de ataque com mais 1% por nível** enquanto ativa, o que a torna a fonte de velocidade de ataque mais barata que a classe tem.",
      "Eldritch Blast alonga o debuff dela e Hex: Bane sobe o dano dela. As duas relações estão nas tabelas; o graph ainda não carrega a segunda, então nenhuma magnitude para elas é publicada aqui.",
      "Como os outros dois hexes, ela precisa de uma arma, e não de uma de mão a mão.",
    ],
  },
  "hex-siphon": {
    summary: "Um hex que corta o que o alvo causa e devolve vida e mana a cada abate.",
    mechanics: [
      "O hex corta o dano do alvo em **33%**. A linha também carrega um aumento por nível dessa cifra que nenhuma expressão lê, então **se ela cresce além de 33% não está estabelecido** e só o valor fixo é publicado.",
      "Dá **cura por abate e mana por abate de 1, com mais 1 por nível**, os dois aumentados ainda mais por hard points em **Engorge**. Numa build limpando grupos, é a sustentação da classe.",
      "Ela **não carrega tabela de dano própria** — a arma é o dano inteiro, diferente dos outros dois hexes.",
      "A duração acompanha o resto da família em **3600 frames com mais 300 por nível**, e Eldritch Blast a alonga.",
    ],
  },
  "psychic-ward": {
    summary: "Uma reserva que absorve dano e atordoa o que te acerta em corpo a corpo enquanto ela aguenta.",
    mechanics: [
      "A reserva absorve **15 de dano no nível 1 com mais 10 por nível**, mais **15 por hard point de Levitation Mastery e de Cleave** — o que significa que as duas skills que uma build de arma já maximiza são a maior parte do ward.",
      "Qualquer coisa que te acerte em corpo a corpo enquanto ele está de pé é **atordoada**, por um tempo que sobe numa curva de **37 frames rumo a 85**.",
      "A mana é **20 com mais 2 por nível**, o crescimento de mana por nível mais íngreme da árvore.",
      "É o pré-requisito do Eldritch Blast e o alonga, então as duas skills sem arma da árvore Eldritch são compradas como par.",
    ],
    synergyBonuses: ["+15 de dano absorvido por nível", "+15 de dano absorvido por nível"],
  },
  "eldritch-blast": {
    summary: "Uma nova mágica repetida que reaplica a marca do Hex: Bane e rouba vida e mana enquanto roda.",
    mechanics: [
      "Ela dispara **a cada 30 frames sozinha** depois de conjurada, em vez de por ativação, e cada nova **reaplica o debuff do Hex: Bane** no que ela toca. É a única skill da classe que mantém um hex sem golpear.",
      "Enquanto roda, você ganha **5% de roubo de vida e 5% de roubo de mana, com mais 1% de cada por nível**.",
      "O dano próprio dela é pequeno — **2-6 mágico no nível 1** — e é aumentado por Blade Warp e Hex: Purge. A relação está nas tabelas; o graph ainda não a carrega, então nenhuma magnitude é publicada aqui.",
      "A duração base é de **1000 frames**, com **mais 50 por hard point de Psychic Ward** — o pré-requisito paga duas vezes.",
      "Ela também é pré-requisito do Mirrored Blades, e é por isso que uma build de arma pura ainda gasta um ponto aqui.",
    ],
  },

  // -------------------------------------------------------------------------
  // Chaos
  // -------------------------------------------------------------------------
  "miasma-bolt": {
    summary: "O projétil inicial, e dano mágico que quase nada no jogo resiste.",
    mechanics: [
      "**2-4 mágico no nível 1** e 4 de mana, o que a torna a coisa mais barata na barra da classe.",
      "Mágico é o elemento sem mastery de monstro para aumentá-lo e com pouquíssimas imunidades para pará-lo — a razão de este ramo continuar útil no Hell sem sunder charm.",
      "O alcance dela é 50, o maior da árvore.",
      "Ela é alimentada em **10% por nível por Miasma Chain e Abyss**, e é por isso que uma build de vazio a maximiza mesmo depois que ela deixa de ser a skill que você conjura.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
  },
  "ring-of-fire": {
    summary: "Um anel de projéteis de fogo lançados para fora de você. Dobra a contagem de projéteis com dez pontos.",
    mechanics: [
      "**Dezesseis projéteis abaixo de dez hard points e trinta e dois com dez ou mais.** Esse único limiar praticamente dobra a skill e é o único degrau dela.",
      "**6-10 de fogo no nível 1** por projétil, e os projéteis viajam para fora, então o dano que um único monstro toma depende de quão perto ele está.",
      "É a porta de entrada do ramo de fogo e a sinergia mais barata dele: Flame Wave e Apocalypse alimentam a skill em 10% por nível cada, e ela alimenta as duas de volta.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
  },
  "sigil-lethargy": {
    summary: "Um sigil posto no chão que corta pela metade a velocidade de movimento e de ataque dentro dele.",
    mechanics: [
      "**−50% de movimento e −50% de attack rate**, os dois fixos: a linha os aplica de um par de parâmetros sem crescimento por nível, então um hard point compra a lentidão inteira.",
      "O que os pontos compram é **tamanho**. O sigil sobe em degraus nos hard points 10 e 20 — raio 4, depois 6, depois 8 — e desenha uma marca maior a cada degrau. Nada entre os limiares muda isso.",
      "Custa **4 de mana fixos em todo nível**, o sigil mais barato.",
      "Uma terceira linha lê a defesa do alvo a partir de um parâmetro que a linha rotula como dano causado. O stat e o rótulo discordam e nada resolve, então **esse efeito não é quantificado aqui**.",
    ],
  },
  "miasma-chain": {
    summary: "Gera uma rajada de miasma bolts. Três na base, subindo rumo a doze.",
    mechanics: [
      "A contagem de projéteis sobe numa curva decrescente de **3 rumo a um teto de 12**, então pontos cedo somam projéteis rápido e pontos tarde mal mexem nisso.",
      "**6-9 mágico no nível 1** por corrente, além do que os próprios projéteis fazem.",
      "**A cadência dela segue a animação de ataque, não a de conjuração** — a linha marca `UseAttackRate`, e nenhuma outra skill de Chaos faz isso. O que isso significa para um breakpoint de Faster Cast Rate nesta única skill não está estabelecido e nenhum breakpoint é publicado para ela.",
      "**Enhanced Entropy** sobe o dano, o alcance e a duração dela como passiva, por cima das duas sinergias.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
  },
  "sigil-rancor": {
    summary: "Um sigil que vira um grupo contra si mesmo — e faz ele bater mais forte enquanto isso.",
    mechanics: [
      "**75% de chance de confundir a IA** de um monstro pego por ele. Essa cifra é fixa e não cresce com o nível.",
      "O sigil carrega **+50% de dano com mais 5% por nível** e **+5% de velocidade de ataque com mais 1% por nível**. Nada na linha nomeia quem recebe isso, e esta página não adivinha: as magnitudes são publicadas e o destinatário fica em aberto.",
      "O tamanho sobe em degraus nos hard points 10 e 20 como nos outros dois sigils — raio 4, depois 6, depois 8.",
      "A mana é **12 fixos em todo nível**.",
    ],
  },
  "flame-wave": {
    summary: "Uma parede de fogo que rola para longe de você por um corredor.",
    mechanics: [
      "**13-17 de fogo no nível 1**, o maior dano base da árvore até o Apocalypse.",
      "A onda tem **quatro projéteis de largura e corre sete comprimentos**, com um atraso de 17 frames entre os passos — então ela limpa um corredor em vez de uma sala, e ficar na boca de um é como a skill é usada.",
      "As sinergias dela são as mais íngremes do ramo de fogo, com **15% por nível** cada, vindas das duas skills de cada lado dela.",
    ],
    synergyBonuses: ["+15% de dano por nível", "+15% de dano por nível"],
  },
  "sigil-death": {
    summary: "Um anel de execução. Qualquer coisa dentro dele que caia abaixo de um décimo da vida morre e explode.",
    mechanics: [
      "Um monstro dentro do sigil que caia abaixo de **13% da vida morre na hora**, e um champion, unique ou superunique abaixo de **10%** faz o mesmo. Os dois limiares são fixos — pontos não os aumentam.",
      "O que morre **explode**, que é o que transforma a skill de uma execução em velocidade de limpeza.",
      "O tamanho sobe em degraus nos hard points 10 e 20 como nos outros dois sigils.",
      "Ela também é a razão de uma build de hex olhar para esta árvore: **a chance de explodir do Hex: Purge sobe 1% por hard point aqui**.",
      "A linha carrega fogo como elemento mas não publica tabela de dano própria — a execução é um limiar de vida, não dano.",
    ],
  },
  "enhanced-entropy": {
    summary: "Uma passiva que sobe dano, alcance e duração do ramo de vazio ao mesmo tempo.",
    mechanics: [
      "**Miasma: +2% de dano com mais 2% por nível, +5% de alcance com mais 1% por nível, +2% de duração com mais 2% por nível.**",
      "**Abyss: +2% de dano com mais 3% por nível** — a linha mais íngreme da skill — **e +2% de duração com mais 2% por nível.**",
      "É o pré-requisito do Abyss, então uma build de vazio chega ao capstone por aqui em vez de pelos projéteis.",
      "Nada aqui toca no ramo de fogo. É uma passiva exclusiva do vazio e uma build de fogo não deve pegá-la.",
    ],
  },
  apocalypse: {
    summary: "O capstone de fogo. Dano enorme numa área enorme, e tira resistência a fogo enquanto queima.",
    mechanics: [
      "**80-100 de fogo no nível 1**, várias vezes qualquer outra coisa da árvore, e cresce cerca de 25 por faixa de nível.",
      "Ela **corta a resistência a fogo do alvo em 5, com mais 1 por nível, até um teto de 40 pontos** — a única quebra de resistência da classe, e a razão de o ramo de fogo funcionar no Hell sem ajuda de fora.",
      "O raio sobe em degraus nos hard points 10 e 20: **13, depois 15, depois 17**. Até o menor é maior que qualquer outra coisa que a classe conjura.",
      "Chegar nela custa um ponto em Sigil: Death além da cadeia de fogo, que é o único cruzamento obrigatório da árvore.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
  },
  abyss: {
    summary: "O capstone de vazio. Colapsa uma área causando dano mágico e deixa o chão queimando.",
    mechanics: [
      "**20-40 mágico no nível 1** num **raio de 6**, e mágico é o elemento que menos monstros resistem — então esta é a resposta da classe a um grupo que para todo o resto.",
      "Ela deixa fogo no chão depois. A linha dá a isso uma duração de **2 sem unidade nomeada**, então nada é publicado sobre quanto tempo dura.",
      "**A mana é cobrada quando a skill resolve, não quando ela começa**, o que importa para interrompê-la.",
      "Ela alimenta Miasma Bolt e Miasma Chain além de ser alimentada por elas, então o ramo de vazio é um triângulo fechado: todo ponto nele sobe as outras duas.",
      "**Enhanced Entropy** soma dano e duração por cima das sinergias, a uma taxa mais íngreme do que dá às skills de miasma.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
  },
};
