import type { Overlay, SkillCopy, SkillTreeCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR das skills e das árvores do Barbarian.
 *
 * Os **nomes** das skills e das árvores permanecem em inglês (dados
 * invariantes) — é assim que aparecem em toda base de dados, em todo guia e em
 * toda conversa da comunidade brasileira. Só as descrições são traduzidas. Ver
 * ADR 0003.
 *
 * `mechanics` é posicional: cada array aqui tem exatamente o mesmo número de
 * itens que o array em `skills.ts`, e `synergyBonuses` sobrepõe `synergies` na
 * mesma ordem. `check:content` falha se qualquer um dos dois divergir.
 */

export const barbarianTreesPtBr: Overlay<SkillTreeCopy> = {
  warcries: {
    name: "Warcries",
    summary: "Gritos que buffam o grupo, debuffs que quebram uma sala e as duas skills de loot da classe.",
    theme:
      "A árvore que toda outra classe acaba pegando emprestada por uma Call to Arms. Battle Orders é o maior buff de vida do jogo e Battle Command dá um nível de skill para todo mundo, mas a árvore também é de onde vem o dano do Barbarian: Berserk, Concentrate e Frenzy tiram daqui a maior sinergia de cada um.",
  },
  "combat-masteries": {
    name: "Combat Masteries",
    summary: "Seis passivas de arma e quatro que mantêm você vivo, todas sempre ativas.",
    theme:
      "Uma mastery por família de arma, e escolher a errada é o erro mais caro da classe — uma mastery não vale absolutamente nada com a coisa errada na mão. As outras quatro são porcentagem pura: defesa, resistências, stamina e velocidade de corrida.",
  },
  "barbarian-combat-skills": {
    name: "Combat Skills",
    summary: "Todo ataque que a classe tem, do knockback de nível 1 até o giro.",
    theme:
      "Duas correntes que nunca se encontram. Uma vai de Bash para Stun para Concentrate para Berserk e termina num único golpe enorme; a outra vai de Double Swing para Double Throw para Frenzy e termina no ataque mais rápido do jogo. Whirlwind fica no fim das duas e não pertence a nenhuma.",
  },
};

export const barbarianSkillsPtBr: Overlay<SkillCopy> = {
  // -- Warcries ------------------------------------------------------------
  howl: {
    summary:
      "Faz os monstros próximos saírem correndo. Um botão de pânico de um ponto que acaba sendo a sinergia do Berserk.",
    mechanics: [
      "Os monstros fogem por 3 segundos com um ponto e mais um segundo por nível, correndo 24 unidades e mais 5 por nível antes de parar.",
      "**Vale pontos por um motivo que não tem nada a ver com medo.** Howl dá +10% de dano ao Berserk por ponto duro e +6% ao War Cry, então um Berserker maximiza uma skill utilitária de nível 1 e nunca a aperta.",
      "Custa 4 de mana e esvazia uma sala sem matar nada, o que num personagem corpo a corpo sem fuga às vezes é o plano inteiro.",
    ],
  },
  "find-potion": {
    summary:
      "Tira uma poção de um cadáver. A porta de entrada do Find Item e, discretamente, a escala por trás do Grim Ward.",
    mechanics: [
      "A chance vai de 0% a 100% numa curva decrescente. Do que encontra, 30% é poção de mana e 10% é rejuvenescimento; o resto é cura.",
      "**É a única sinergia que o Find Item tem** — +1% de chance por ponto duro — e é por isso que uma build de hork não para em um ponto aqui.",
      "**E escala o debuff do Grim Ward**, +5% de dano recebido pelos inimigos por ponto duro, além dos 20% de base. Essa relação é real e não é desenhada como sinergia: o jogo não rotula o parâmetro como uma, então não existe aresta para o grafo carregar.",
      "Ela mira um cadáver, então é apertada depois da luta e não durante.",
    ],
  },
  taunt: {
    summary:
      "Puxa um monstro para cima de você e o enfraquece. A sinergia do Frenzy Barbarian, e um puxador à distância para todo mundo.",
    mechanics: [
      "Corta o attack rating do alvo em 5% e mais 2% por nível, e o dano dele na mesma medida, e então faz ele largar o que estava fazendo e vir até você.",
      "**Dá +8% de dano ao Frenzy por ponto duro**, que é a razão de uma barra de Frenzy carregar uma skill que puxa um monstro por vez.",
      "Puxar um único monstro de um grupo é como um personagem corpo a corpo enfrenta um grupo dentro do qual não sobreviveria, e funciona em qualquer coisa que não seja um boss.",
      "3 de mana, conjurada à distância.",
    ],
  },
  shout: {
    summary:
      "Um buff de defesa para o grupo cujo trabalho de verdade é fazer o Battle Orders durar. Um dos três gritos que se estendem mutuamente.",
    mechanics: [
      "+100% de defesa e mais 10% por nível, para o grupo inteiro dentro do raio 19.",
      "**A duração é o motivo de ela ser maximizada, não a defesa.** Shout, Battle Orders e Battle Command somam 5 segundos por ponto duro aos outros dois, então pontos aqui são o que impede um Barbarian de rebuffar a cada trinta segundos.",
      "30 segundos com um ponto e mais 10 por nível, antes desse bônus mútuo.",
      "6 de mana, e defesa é a stat que menos importa no Hell — é por isso que o grito é mantido pela duração e pelo grupo.",
    ],
    synergyBonuses: ["+5 segundos de duração por nível", "+5 segundos de duração por nível"],
  },
  "find-item": {
    summary:
      "Tira um segundo drop de um cadáver já saqueado. A única skill do tipo no jogo.",
    mechanics: [
      "**Ela gera loot que não existia.** O cadáver já dropou o que ia dropar; isto rola a tabela de novo, e essa é a base inteira do runner de Travincal.",
      "A chance vai de 5% a 60% numa curva decrescente, mais 1% por ponto duro de Find Potion — a única skill que a alimenta.",
      "Do que encontra, 30% é de alta qualidade e 5% é mágico ou melhor.",
      "Precisa de um cadáver, então não funciona em nada que não deixe um, e custa 7 de mana por tentativa.",
    ],
    synergyBonuses: ["+1% de chance de achar por nível"],
  },
  "battle-cry": {
    summary:
      "Arranca defesa e dano dos inimigos num raio. O Amplify Damage do Barbarian, e a sinergia do War Cry.",
    mechanics: [
      "A defesa inimiga cai 50% e mais 2% por nível; o dano inimigo, 25% e mais 1% por nível. Os dois pegam tudo dentro do raio 5.",
      "Cortar a defesa de um monstro pela metade vale mais para um Barbarian do que qualquer equipamento de attack rating, porque attack rating é conferido contra a defesa e não contra um limiar.",
      "Dura 12 segundos com um ponto e mais 2,4 por nível.",
      "Dá +6% de dano ao War Cry por ponto duro, junto com Howl e Taunt.",
      "5 de mana, e o corte de defesa é a metade que importa — o corte de dano é bônus.",
    ],
  },
  "battle-orders": {
    summary:
      "Aumenta vida, mana e stamina máximas do grupo inteiro. O buff mais valioso do jogo.",
    mechanics: [
      "**+35% de vida máxima com um ponto e mais 3% por nível**, e o número idêntico vale para mana e para stamina. Com vinte pontos duros são +92% de vida em todo mundo dentro do raio 19.",
      "É por isso que toda classe acaba carregando uma Call to Arms: a runeword concede esta skill, e uma Sorceress com ela tem metade a mais da vida com que foi construída.",
      "**Conjure antes dos outros buffs, sempre.** Ela aumenta a vida máxima por porcentagem, e a vida que você tem quando ela entra não é escalada junto com o máximo — então um Barbarian grita, depois se cura, depois luta.",
      "30 segundos com um ponto e mais 10 por nível, estendida em mais 5 segundos por ponto duro de Shout e de Battle Command.",
      "Dá +10% de dano ao Concentrate e ao Berserk por ponto duro, o que a torna uma skill de dano em duas builds que não apertam grito nenhum pela vida.",
      "7 de mana.",
    ],
    synergyBonuses: ["+5 segundos de duração por nível", "+5 segundos de duração por nível"],
  },
  "grim-ward": {
    summary:
      "Planta um totem num cadáver que apavora, desacelera e amolece tudo por perto. Muito mais forte do que a fama dela.",
    mechanics: [
      "**Faz os inimigos receberem mais dano** — +20% com um ponto e mais 5% por ponto duro de *Find Potion*, então um Find Potion maximizado dobra o dano que tudo no campo recebe.",
      "Também desacelera o que apavora, de 0% a 75% numa curva decrescente, aplicado a movimento, velocidade de ataque e taxa de animação ao mesmo tempo.",
      "O totem fica de pé por 40 segundos e esse número não se mexe com pontos; o raio é 6 e cresce 1 por nível.",
      "**A relação com Find Potion não é uma sinergia** e a página não desenha aresta para ela: o jogo rotula aquele parâmetro como dano recebido por nível e não como sinergia, então o grafo corretamente não carrega nada. O número é real de qualquer forma.",
      "Precisa de um cadáver e custa 4 de mana.",
    ],
  },
  "war-cry": {
    summary:
      "Causa dano e atordoa tudo à sua volta. A única skill da classe que mata sem arma.",
    mechanics: [
      "**Não carrega dano de arma nenhum.** A faixa publicada é tudo — 30-40 com um ponto, 198-208 com vinte — o que faz dela a única skill de Barbarian cujo dano não liga para o que está na sua mão.",
      "Atordoa por 25 frames com um ponto e mais 5 por nível, dentro do raio 7, e é isso que deixa o Singer seguro, não o que faz ele matar.",
      "Howl, Taunt e Battle Cry somam 6% cada por ponto duro, então o dano da build fica espalhado por três skills que ninguém maximizaria de outro jeito.",
      "**Custa 10 de mana, não 40.** A linha é deslocada por 6, e o custo sobe para cerca de 24 no nível 20.",
      "O dano dela é físico, então o Singer bate exatamente no muro em que todo outro Barbarian bate.",
    ],
    synergyBonuses: [
      "+6% de dano por nível",
      "+6% de dano por nível",
      "+6% de dano por nível",
    ],
  },
  "battle-command": {
    summary:
      "Dá +1 em todas as skills para você e para o grupo. Um ponto, e nunca mais de um pelo bônus.",
    mechanics: [
      "**O +1 não escala.** A linha lê o valor direto de um parâmetro que é 1 em todo nível, então o vigésimo ponto duro concede exatamente o que o primeiro concedeu.",
      "Pontos aqui compram duração e mais nada — 30 segundos com um ponto, mais 10 por nível, mais 5 segundos por ponto duro de Shout e de Battle Orders.",
      "**Conjure antes do Battle Orders.** O nível de skill extra aumenta o nível do próprio Battle Orders, então o buff de vida que vem depois é maior; na ordem inversa, não é.",
      "11 de mana, raio 19, e alcança o grupo inteiro.",
    ],
    synergyBonuses: ["+5 segundos de duração por nível", "+5 segundos de duração por nível"],
  },

  // -- Combat Masteries ----------------------------------------------------
  "blade-mastery": {
    summary:
      "Aumenta dano, attack rating e chance de crítico com espadas e adagas. A mastery em que a maioria das builds acaba.",
    mechanics: [
      "**Não é só espada.** A linha é presa ao tipo de item que o jogo chama de \"Swords and Knives\", então adagas contam e, pela mesma corrente, facas de arremesso também.",
      "+28% de dano e mais 5% por nível; +40% de attack rating e mais 8% por nível; crítico subindo de 0% em direção a 35%.",
      "Crítico dobra o dano físico, e 35% é dez pontos acima do que a Claw Mastery da Assassin alcança.",
      "Vale para o que estiver na sua mão na hora, então um Barbarian que troca de família de arma não comprou nada.",
    ],
  },
  "axe-mastery": {
    summary: "A mesma passiva, para machados — e ela alcança machados de arremesso também.",
    mechanics: [
      "+28% de dano e mais 5% por nível; +40% de attack rating e mais 8% por nível; crítico subindo de 0% em direção a 35%.",
      "A corrente de tipos de item alcança machados de arremesso, o que vale saber antes de uma build de arremesso escolher a mastery: as duas concedem stats diferentes, e só a Throwing Mastery concede as que foram escritas para um arremesso.",
      "Machados carregam o maior dano de uma mão do jogo, e é para isso que esta mastery costuma ser pega.",
    ],
  },
  "mace-mastery": {
    summary:
      "A mesma passiva, para maças — e o tipo de item dela cobre discretamente cetros, cajados e varinhas.",
    mechanics: [
      "+28% de dano e mais 5% por nível; +40% de attack rating e mais 8% por nível; crítico subindo de 0% em direção a 35%.",
      "**O tipo a que ela está presa é \"Blunt\", não \"Mace\"**, e a corrente de equivalência passa por clavas e martelos até cetros, cajados e varinhas. É uma rede mais ampla do que o nome sugere.",
      "Maças e martelos carregam as bases de Crushing Blow do jogo, e é isso que faz desta a mastery de matar boss.",
    ],
  },
  "polearm-mastery": {
    summary: "A mesma passiva, só para polearms. A mais estreita das seis.",
    mechanics: [
      "+28% de dano e mais 5% por nível; +44% de attack rating e mais 8% por nível; crítico subindo de 0% em direção a 35%.",
      "**Polearms e spears são duas masteries diferentes.** Os tipos de item são irmãos e não pai e filho, então nenhuma das duas cobre as armas da outra.",
      "A base de attack rating dela é 44% em vez dos 40% com que Blade, Axe e Mace começam — as três masteries de nível 6 carregam o número maior.",
      "Polearms são de duas mãos, o que descarta esta mastery para qualquer build que queira empunhar duas armas ou segurar um escudo.",
    ],
  },
  "throwing-mastery": {
    summary:
      "A única mastery que resolve um problema em vez de aumentar um número. É ela que torna o arremesso jogável.",
    mechanics: [
      "**Dois terços dos seus arremessos não consomem nada.** A linha carrega uma chance de não consumir subindo de 0% em direção a 66%, e uma flag separada que repõe a arma arremessada num acerto crítico. Munição deixa de ser o motivo de a build falhar.",
      "Ela também concede perfuração, de 0% subindo em direção a 55% — o arremesso atravessa o que acerta e segue em frente.",
      "Os números comuns de mastery também estão lá: +28% de dano e mais 5% por nível, +44% de attack rating e mais 8% por nível, crítico em direção a 35%.",
      "É a única mastery com mais de três stats passivas, e as três extras são o motivo de guias escritos antes desta baseline chamarem o arremesso de injogável depois do Normal.",
      "O tipo de item dela cobre machados de arremesso, facas de arremesso, dardos e poções arremessáveis.",
    ],
  },
  "spear-mastery": {
    summary: "A mesma passiva, para lanças — e o tipo de item dela alcança dardos.",
    mechanics: [
      "+28% de dano e mais 5% por nível; +44% de attack rating e mais 8% por nível; crítico subindo de 0% em direção a 35%.",
      "**Dardos são lanças no que diz respeito a esta linha**, e são armas de arremesso no que diz respeito à Throwing Mastery. As duas os cobrem, e as stats que cada uma concede foram escritas para tipos de golpe diferentes.",
      "Lanças são de duas mãos e longas, o que troca o escudo por alcance.",
      "É a mastery menos pega da classe, porque as armas que ela cobre são as da Amazon.",
    ],
  },
  "increased-stamina": {
    summary:
      "Mais stamina e — para uma build — mais Frenzy. Um pré-requisito que acaba importando.",
    mechanics: [
      "+30% de stamina e mais 15% por nível, o que deixa de importar no instante em que dá para bancar um ponto de Vitality ou uma poção de stamina.",
      "**Ela estende o Frenzy em 10 frames por ponto duro.** A duração própria do Frenzy é de 6 segundos; vinte pontos aqui a levam além de 14, que é a diferença entre um buff que você mantém e um que você persegue.",
      "Essa relação é real e não é desenhada como sinergia: a linha do Frenzy escala isso com um número puro em vez de um parâmetro rotulado como sinergia, então o grafo não carrega aresta.",
      "É também o único caminho para o Increased Speed.",
    ],
  },
  "iron-skin": {
    summary: "Uma porcentagem seca de defesa. Na maior parte das vezes, a porta do Natural Resistance.",
    mechanics: [
      "+30% de defesa e mais 10% por nível, sempre ativa.",
      "Defesa é a stat defensiva mais fraca no Hell — os attack ratings dos monstros são grandes o bastante para que reduzir sua chance de ser acertado pela metade custe muito mais defesa do que qualquer Barbarian tem — então ela raramente é maximizada por si só.",
      "É o único pré-requisito do Natural Resistance, que é o motivo de a maioria das builds colocar um ponto aqui.",
    ],
  },
  "increased-speed": {
    summary: "Velocidade de corrida e caminhada permanente. A resposta da classe para não ter skill de movimento.",
    mechanics: [
      "Velocidade de corrida e caminhada de 7% a 50% numa curva decrescente — os primeiros pontos valem várias vezes o que valem os últimos.",
      "**Ela é sempre ativa**, o que nenhum bônus de movimento de outra classe é: Burst of Speed e Vigor precisam estar ligados.",
      "Ela soma com Faster Run/Walk no equipamento, e um Barbarian sem Enigma vai a pé para todo lugar.",
      "Um ponto já é uma fração grande do total; a curva faz de vinte uma compra ruim, a menos que nada mais os queira.",
    ],
  },
  "natural-resistance": {
    summary:
      "As quatro resistências, permanentemente, sem buff para manter. A melhor passiva defensiva da classe.",
    mechanics: [
      "Resistência a fogo, frio, raio e veneno juntas, de 0% subindo em direção a 80% numa curva decrescente.",
      "**Ela é somada antes do teto, não depois**, então é exatamente a resposta para a penalidade de −100 do Hell, e é livre da manutenção que toda outra classe paga pela mesma coisa.",
      "A curva faz dos primeiros pontos os valiosos: um punhado leva o Barbarian quase até o fim e os últimos valem uma fração cada.",
      "É o motivo de um Barbarian conseguir vestir equipamento de dano onde outro personagem corpo a corpo veste resistência.",
    ],
  },

  // -- Combat Skills -------------------------------------------------------
  bash: {
    summary:
      "Um golpe com knockback que bate mais forte que o normal. O primeiro ponto de todo Barbarian, e sinergia de três skills.",
    mechanics: [
      "+50% de dano e mais 5% por nível, mais um ponto seco de dano por nível, e derruba o alvo para trás.",
      "**Ela é mantida pelo que dá, não pelo que faz.** Bash alimenta Double Swing a 10% por ponto duro, Stun a 8% e Concentrate a 5%, então fica numa barra maximizada em que nunca é apertada.",
      "O attack rating dela é incomum: 15% e mais 5% por nível, *mais* 5% por ponto duro de Concentrate. **Concentrate é a única sinergia de attack rating do jogo fora dos golens do Necromancer** — existem cinco arestas dessas na extração inteira, e as outras três vêm todas do Clay Golem.",
      "2 de mana, e o knockback é uma ferramenta defensiva de verdade no nível 1.",
    ],
    synergyBonuses: ["+5% de dano por nível", "+5% de attack rating por nível"],
  },
  leap: {
    summary:
      "Pula um vão e derruba tudo ao aterrissar. Movimento, fuga, e a única sinergia do Leap Attack.",
    mechanics: [
      "**Ela não rola attack rating e não causa dano.** A linha não carrega nenhum dos dois, e é por isso que é modelada como magia e não como ataque — o knockback é o efeito inteiro.",
      "Raio de knockback 4 e mais 1 por nível; o pulo em si cobre entre 8 e 30 unidades, dependendo de onde você clicou.",
      "Ela passa por cima de paredes e por cima de um grupo, o que faz dela a coisa mais próxima de uma fuga que a classe tem antes da Enigma.",
      "Dá +10% de dano ao Leap Attack por ponto duro, a única sinergia dele.",
      "2 de mana.",
    ],
  },
  "double-swing": {
    summary:
      "Um aperto, as duas armas. Ela não tem dano próprio — cada ponto dele é do Bash.",
    mechanics: [
      "**O bônus de dano dela é inteiramente do Bash.** A expressão de dano da linha é o nível do Bash vezes 10 e mais nada, então um ponto gasto aqui aumenta a skill em zero — só Bash a aumenta.",
      "Ela gira as duas armas num ataque, acertando dois alvos se houver dois e um alvo duas vezes se não houver. Duas armas são obrigatórias para isso.",
      "+50% de velocidade de ataque enquanto gira, e é por isso que ela é o ataque de leveling preferido de um Barbarian de duas armas.",
      "**Ela fica de graça.** O custo começa em 1 de mana e cai com o nível; a partir do nível 9 a conta chega a zero e fica lá.",
      "Dá +8% de dano ao Double Throw e ao Frenzy por ponto duro.",
    ],
    synergyBonuses: ["+10% de dano por nível"],
  },
  stun: {
    summary:
      "Um golpe que para o que acerta. Controle de grupo numa classe que não tem nenhum outro no corpo a corpo.",
    mechanics: [
      "O atordoamento dura 30 frames com um ponto e cresce com o nível, estendido em mais 5 frames por ponto duro de War Cry. A exibição do próprio jogo trava em 10 segundos.",
      "**Um monstro atordoado não está atacando**, o que num personagem parado dentro do grupo vale mais que o dano — e o dano aqui é do Bash, não dela.",
      "O attack rating dela carrega o mesmo bônus de Concentrate que o do Bash, 5% por ponto duro.",
      "Dá +5% de dano ao Bash por ponto duro e é o único caminho para o Concentrate.",
      "2 de mana.",
    ],
    synergyBonuses: [
      "+8% de dano por nível",
      "+5% de attack rating por nível",
      "+5 frames de atordoamento por nível",
    ],
  },
  "double-throw": {
    summary:
      "Arremessa as duas armas de uma vez. O único ataque à distância da classe, e a razão de a Throwing Mastery existir.",
    mechanics: [
      "+16% de dano e mais 8% por nível — a inclinação de dano por nível mais íngreme da árvore.",
      "**Ela exige duas armas de arremesso**, uma em cada mão, e elas não precisam ser a mesma arma.",
      "Munição é o problema inteiro da build e a Throwing Mastery é a resposta inteira: dois terços dos arremessos não consomem nada e um acerto crítico repõe um.",
      "1 de mana, e acerta à distância, que é a única hora em que um Barbarian não está parado dentro do que está matando.",
      "É o pré-requisito do Frenzy, e é por isso que um Barbarian de Frenzy atravessa a árvore de arremesso sem nunca arremessar nada.",
    ],
    synergyBonuses: ["+8% de dano por nível"],
  },
  "leap-attack": {
    summary:
      "Pula em cima de um alvo e cai nele. O maior multiplicador de dano da classe, e o único fecha-distância dela.",
    mechanics: [
      "**+200% de dano e mais 30% por nível** — 770% com vinte, o maior multiplicador de arma que o Barbarian tem e mais ou menos seis vezes o que o bônus por golpe do Whirlwind alcança.",
      "O dano cheio da arma entra, e a faixa física publicada entra por cima dele: 10-20 com um ponto, 150-300 com vinte.",
      "Ela causa dano em tudo dentro do raio 7 de onde aterrissa, e o bônus de attack rating dela é +100% e mais 20% por nível, então acerta coisas que um golpe normal erraria.",
      "Ela viaja por cima de paredes e por cima do grupo que estiver entre você e o alvo, o que faz dela um fecha-distância além de um ataque.",
      "Ela é lenta, e é um aperto por aterrissagem, e é por isso que é uma skill de mobilidade na maioria das barras e ataque principal em poucas.",
      "10 de mana.",
    ],
    synergyBonuses: ["+10% de dano por nível"],
  },
  concentrate: {
    summary:
      "Um ataque que não pode ser interrompido e dobra sua defesa enquanto golpeia. A resposta do Barbarian de Hardcore.",
    mechanics: [
      "**Ela não pode ser interrompida.** O texto do próprio jogo diz isso, e a extração concorda — `interrupt` está em branco em onze skills de jogador no jogo inteiro e esta é uma delas. Levar dano não interrompe o golpe.",
      "+100% de defesa e mais 10% por nível *enquanto ela está atacando*, que é o oposto do que o Berserk faz e é por isso que as duas pontas desta corrente servem a jogadores opostos.",
      "+70% de dano e mais 5% por nível, mais 5% por ponto duro de Bash e **10% por ponto duro de Battle Orders** — a maior sinergia dela fica em outra árvore.",
      "**Berserk transforma parte dela em mágico.** Cada ponto duro em Berserk converte 1% do dano do Concentrate em mágico, que é o único jeito de esta build encostar num imune a físico. Berserk não dá aresta de sinergia para isso; a linha lê o nível do Berserk diretamente.",
      "2 de mana.",
    ],
    synergyBonuses: ["+5% de dano por nível", "+10% de dano por nível"],
  },
  frenzy: {
    summary:
      "Cada acerto deixa o próximo mais rápido. O ataque mais rápido do jogo, e ele precisa de duas armas para funcionar.",
    mechanics: [
      "**Ela se constrói sozinha.** Acertar golpes empilha velocidade de corrida e caminhada de 20% em direção a 200% e velocidade de ataque de 0% em direção a 50%, e a pilha cai se você parar de acertar coisas.",
      "O buff dura 6 segundos, **estendido em 10 frames por ponto duro de Increased Stamina** — vinte pontos lá o levam além de 14 segundos, que é a diferença entre manter a pilha e persegui-la. Isso não é uma sinergia e a página não desenha aresta para ela; a linha escala isso com um número puro.",
      "+90% de dano e mais 5% por nível, mais 8% por ponto duro de Double Swing e 8% por ponto duro de **Taunt**, que fica em outra árvore.",
      "Ela exige duas armas — a descrição do próprio jogo diz isso — e gira as duas.",
      "Ela não pode ser interrompida, e a velocidade de corrida dela faz dela o jeito mais rápido de um Barbarian atravessar um mapa sem Enigma.",
      "Berserk converte 1% do dano dela em mágico por ponto duro, igual ao que faz com o Concentrate.",
      "1,5 de mana.",
    ],
    synergyBonuses: ["+8% de dano por nível", "+8% de dano por nível"],
  },
  whirlwind: {
    summary:
      "Gira por dentro de um grupo acertando tudo no caminho. A skill símbolo da classe, e a única que não alimenta nada.",
    mechanics: [
      "**Ela não tem sinergia em nenhuma direção.** Nada a aumenta e ela não aumenta nada — o único ataque da classe com as duas listas vazias, sendo que as outras onze skills nessa posição são passivas e o Grim Ward. É por isso que os quarenta e poucos pontos sobrando de uma build de Whirlwind vão para uma mastery e para os gritos.",
      "+30% de dano e mais 5% por nível, que é um multiplicador pequeno; o dano da skill vem da quantidade de acertos e da arma, não do bônus.",
      "**Ela tem um modo de seleção de arma só dela**, não compartilhado com nenhuma outra skill do jogo. Double Swing, Double Throw e Frenzy compartilham um modo diferente, e a diferença é real mesmo que a extração não diga o que cada modo faz.",
      "Ela não pode ser interrompida, e você não consegue mudar a direção depois que começa — o caminho é fixado no momento do aperto.",
      "**Custa 12,5 de mana, não 25.** A linha é deslocada por 7, e o custo sobe para 22 no nível 20.",
      "O bônus de attack rating dela é +50% e mais 5% por nível, o menor de qualquer ataque de Barbarian, e é por isso que attack rating é a restrição real da build.",
    ],
  },
  berserk: {
    summary:
      "Converte o golpe inteiro em dano mágico e derruba sua defesa a zero. A resposta da classe para imunidade física.",
    mechanics: [
      "**Todo o dano vira mágico, não parte dele.** A linha converte 100%, o que significa que o dano físico da arma é carregado e entregue como mágico — então um imune a físico o recebe inteiro e só um monstro resistente a mágico resiste.",
      "+150% de dano e mais 15% por nível, mais 10% por ponto duro de **Howl** e 10% por ponto duro de **Battle Orders**. As duas sinergias ficam na árvore de Warcries, então um Berserker maximiza dois gritos que nunca aperta.",
      "**Sua defesa vira zero** enquanto o estado está ativo, e a duração desse estado *encolhe* conforme a skill sobe de nível — mais ou menos 2,7 segundos com um ponto caindo para perto de 1,3 com vinte. Mais pontos significam menos tempo indefeso.",
      "O bônus de attack rating dela é +100% e mais 15% por nível, o maior da classe depois do Leap Attack.",
      "**Ela não concede redução de dano.** A linha tem uma stat de resistência a dano e o parâmetro que a alimenta é zero em todo nível, então qualquer guia que credite redução de dano ao Berserk está descrevendo outra versão.",
      "4 de mana, e um ponto dela em qualquer barra de Barbarian é a resposta mais barata do jogo para imunidade.",
    ],
    synergyBonuses: ["+10% de dano por nível", "+10% de dano por nível"],
  },
};
