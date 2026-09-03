import type { MechanicCopy, Overlay } from "@/lib/types/copy";

/**
 * Copy pt-BR dos artigos de mecânicas.
 *
 * O corpo é traduzido bloco a bloco, preservando a estrutura tipada: fórmulas
 * continuam sendo blocos `formula`, tabelas continuam tabelas. As fórmulas em
 * si são invariantes — matemática não se traduz — mas as legendas sim.
 */
export const mechanicsPtBr: Overlay<MechanicCopy> = {
  "magic-find": {
    name: "Magic Find",
    summary:
      "Como o Better Chance of Getting Magic Items funciona de verdade, por que ele tem retornos decrescentes, e por que mais nem sempre é melhor.",
    keyFacts: [
      "O Magic Find melhora a chance de um item que já caiu ser promovido a uma qualidade maior.",
      "Tem retornos decrescentes severos para itens unique, set e raros — mas nenhum para itens mágicos.",
      "Não aumenta a quantidade de itens que caem, e não afeta drops de runa.",
      "Drops de baús e recipientes não usam o seu Magic Find de forma alguma.",
    ],
    body: [
      { type: "heading", text: "O que ele faz de verdade" },
      {
        type: "paragraph",
        text: "O Magic Find não faz cair mais itens, e não faz cair bases melhores. Quando o jogo já decidiu que um item vai cair, o Magic Find melhora a rolagem que define a qualidade dele — empurrando o item escada acima, de normal para mágico, raro, set e unique.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Não ajuda com runas",
        text: "Runas não são afetadas por Magic Find de forma alguma. Se você está farmando a Countess ou Travincal por runas, o seu equipamento de Magic Find não está fazendo nada — use sobrevivência no lugar.",
      },
      { type: "heading", text: "Retornos decrescentes" },
      {
        type: "paragraph",
        text: "Esta é a parte que surpreende as pessoas. O Magic Find é reduzido antes de ser aplicado, e a redução é agressiva. O seu Magic Find efetivo para cada nível de qualidade é:",
      },
      {
        type: "formula",
        expression: "MF efetivo (unique) = (MF x 250) / (MF + 250)",
        caption: "Uniques usam fator 250 — a curva mais dura do jogo.",
      },
      { type: "formula", expression: "MF efetivo (set) = (MF x 500) / (MF + 500)" },
      { type: "formula", expression: "MF efetivo (raro) = (MF x 600) / (MF + 600)" },
      {
        type: "paragraph",
        text: "Itens mágicos não têm retornos decrescentes — o Magic Find deles se aplica integralmente.",
      },
      {
        type: "table",
        headers: ["Seu MF", "Efetivo (unique)", "Efetivo (set)", "Efetivo (raro)"],
        rows: [
          ["0%", "0%", "0%", "0%"],
          ["100%", "71%", "83%", "86%"],
          ["200%", "111%", "143%", "150%"],
          ["300%", "136%", "188%", "200%"],
          ["500%", "167%", "250%", "273%"],
          ["1000%", "200%", "333%", "375%"],
        ],
        caption:
          "Dobrar o seu Magic Find de 100% para 200% ganha 40 pontos efetivos para uniques. Dobrar de novo, de 200% para 400%, ganha só uns 40 a mais.",
      },
      {
        type: "callout",
        variant: "info",
        title: "A conclusão prática",
        text: "Em algum ponto entre 200% e 400% de Magic Find, pontos adicionais deixam de valer o que você abre mão para consegui-los. Matar duas vezes mais rápido com 200% de Magic Find supera matar na metade da velocidade com 500%. É por isso que os melhores conjuntos de magic find são os que mantêm dano e sobrevivência suficientes para limpar rápido.",
      },
      { type: "heading", text: "Onde o Magic Find não se aplica" },
      {
        type: "list",
        items: [
          "Runas — completamente sem efeito.",
          "Baús, cadáveres, urnas e outros recipientes usam um mecanismo separado que ignora o seu Magic Find. É por isso que as runs de baú em Lower Kurast podem ser feitas com equipamento barato.",
          "Drops de quest, como a primeira morte da Andariel, seguem regras próprias.",
          "Ouro. Extra Gold from Monsters é um atributo separado.",
        ],
      },
      { type: "heading", text: "Contagem de jogadores importa mais do que parece" },
      {
        type: "paragraph",
        text: "Aumentar a contagem de jogadores (no single player, o comando /players) eleva a vida e a experiência dos monstros, e aumenta o número de itens que caem. Diferente do Magic Find, isso não tem retornos decrescentes — e é por isso que farmadores experientes sobem a contagem de jogadores antes de empilhar mais Magic Find.",
      },
    ],
  },

  "area-levels-and-treasure-classes": {
    name: "Níveis de Área e Treasure Classes",
    summary:
      "Por que o nível de área 85 é o número que todo guia de farm persegue, e por que alguns bosses dropam acima da própria zona.",
    keyFacts: [
      "Toda área tem três níveis separados — um por dificuldade.",
      "O nível do monstro determina em qual treasure class o jogo rola, e portanto quais itens podem cair.",
      "O nível de área 85 libera as treasure classes mais altas; abaixo dele, camadas inteiras de item são impossíveis.",
      "Bosses de ato e alguns super uniques têm nível de monstro próprio, maior que o da zona onde estão.",
    ],
    body: [
      { type: "heading", text: "Três números, não um" },
      {
        type: "paragraph",
        text: "Cada área de Diablo II tem um nível separado para Normal, Nightmare e Hell. Os Ancient Tunnels são nível 17 no Normal, 46 no Nightmare e 85 no Hell. Normalmente só o número do Hell interessa, porque só no Hell as áreas alcançam o topo da tabela.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Uma armadilha para quem escreve guias",
        text: "O levels.txt do jogo tem dois conjuntos de colunas: um para o Diablo II Classic e outro para a expansão Lord of Destruction. O D2R usa as colunas de Expansion. Ler as de Classic dá aos Ancient Tunnels um nível de Hell de 67 em vez de 85 — uma conclusão completamente diferente sobre se a área vale a pena. Todo nível de área deste site vem das colunas de Expansion.",
      },
      { type: "heading", text: "Por que 85" },
      {
        type: "paragraph",
        text: "Quando um monstro morre, o jogo escolhe uma treasure class com base no nível dele e então rola dentro dela. As treasure classes são escalonadas, e as mais altas — as que contêm as bases unique elite e os melhores itens do jogo — exigem nível de monstro 85. Abaixo desse limiar, nenhuma quantidade de Magic Find ou de paciência produz esses itens a partir de monstros comuns. Este é o fato mais consequente sobre qualquer área de farm.",
      },
      { type: "heading", text: "Bosses quebram a regra" },
      {
        type: "paragraph",
        text: "Bosses de ato e vários super uniques carregam nível de monstro próprio, independente da zona que ocupam. O Mephisto no Hell fica numa área nível 83, mas ele mesmo é monstro nível 87. O Pindleskin fica numa área nível 83, mas é monstro nível 86. É exatamente por isso que vale rodar os dois apesar de as zonas ficarem abaixo de 85 — e por que 'esta área é nível 85?' é a pergunta errada para uma run de boss.",
      },
      {
        type: "table",
        headers: ["Alvo", "Nível de área (Hell)", "Nível de monstro (Hell)"],
        rows: [
          ["Mephisto", "83", "87"],
          ["Pindleskin", "83", "86"],
          ["Ancient Tunnels", "85", "85"],
          ["Chaos Sanctuary", "85", "85"],
          ["Worldstone Keep", "85", "85"],
          ["The Countess", "79", "79"],
        ],
        caption:
          "A Countess é limitada pelo nível da área dela, e é por isso que não consegue dropar runas acima de Ist, por mais que você a rode.",
      },
      { type: "heading", text: "Item level e o que isso significa para você" },
      {
        type: "paragraph",
        text: "Um item que cai é marcado com um item level derivado do monstro que o dropou. Esse item level então restringe quais afixos podem rolar nele. Um circlet raro vindo de um monstro nível 40 simplesmente não pode rolar os afixos de nível alto que o circlet de um monstro nível 85 pode. É por isso que o local de farm importa para raros e crafts, não só para uniques.",
      },
    ],
  },

  "resistances-and-immunities": {
    name: "Resistências e Imunidades",
    summary:
      "As penalidades de dificuldade que pegam todo jogador novo, e por que uma mastery não quebra imunidade.",
    keyFacts: [
      "O Nightmare aplica −40 em todas as suas resistências. O Hell aplica −100.",
      "Suas resistências têm teto em 75% por padrão; alguns itens elevam esse teto.",
      "Um monstro é imune com 100% de resistência ou mais.",
      "Redução de resistência contra um monstro imune funciona com um quinto da eficácia — e normalmente não quebra a imunidade.",
    ],
    body: [
      { type: "heading", text: "A penalidade de dificuldade" },
      {
        type: "paragraph",
        text: "É a mecânica que mata mais personagens que qualquer outra, porque se aplica silenciosamente no instante em que você troca de dificuldade.",
      },
      {
        type: "table",
        headers: ["Dificuldade", "Penalidade de resistência", "Experiência perdida ao morrer"],
        rows: [
          ["Normal", "Nenhuma", "Nenhuma"],
          ["Nightmare", "−40 em todas as resistências", "5% do nível atual"],
          ["Hell", "−100 em todas as resistências", "10% do nível atual"],
        ],
        caption:
          "Recuperar o cadáver devolve 75% da experiência perdida. Verificado no The Arreat Summit.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Planeje para o destino, não para onde você está",
        text: "Um personagem que termina o Normal confortavelmente com 75% de resistência a fogo começa o Nightmare com 35%, e começaria o Hell com −25%. Resistência negativa significa levar *mais* que o dano completo. Ajuste as resistências antes de trocar de dificuldade, não depois de começar a morrer.",
      },
      { type: "heading", text: "O teto de 75%" },
      {
        type: "paragraph",
        text: "Suas resistências têm teto em 75% por padrão. Pontos acima do teto não são desperdiçados, porém — são reserva contra a penalidade da próxima dificuldade, e contra monstros que aplicam redução de resistência, como a Conviction. Um personagem com 175% de resistência a fogo no Nightmare ainda estará com 75% no Hell.",
      },
      {
        type: "paragraph",
        text: "Alguns itens elevam o próprio teto. As runas de resistência máxima (Gul, Vex, Ohm, Lo) dão cada uma +5% a uma resistência máxima em armaduras, e vários uniques fazem o mesmo.",
      },
      { type: "heading", text: "Imunidade" },
      {
        type: "paragraph",
        text: "Um monstro com 100% ou mais de resistência a um elemento é imune a ele e não recebe dano daquele elemento. No Hell, imunidades são comuns e específicas: uma build com um único tipo de dano vai acabar encontrando coisas que simplesmente não consegue ferir.",
      },
      {
        type: "callout",
        variant: "danger",
        title: "Masteries não quebram imunidade",
        text: "Cold Mastery, Lightning Mastery e equivalentes reduzem a resistência do inimigo — mas contra um monstro já imune, toda redução de resistência é aplicada com um quinto da eficácia. Uma Cold Mastery nível 20, nominalmente valendo −100% de resistência a frio, vale só −20% contra um alvo imune a frio, o que está longe de bastar para levar 110% de resistência abaixo de 100%.",
      },
      { type: "heading", text: "O que realmente quebra imunidade" },
      {
        type: "list",
        items: [
          "Sunder Charms — colocam a resistência de um monstro imune em 95%, convertendo imunidade numa resistência grande, mas finita. A resposta mais confiável nos patches atuais.",
          "Conviction (de uma runeword Infinity num mercenário) — redução grande o bastante para quebrar muitas imunidades, embora não todas.",
          "Lower Resist (maldição de Necromancer, ou uma wand com cargas) — efeito parecido.",
          "Amplify Damage e Decrepify — quebram imunidade física especificamente.",
          "Um segundo tipo de dano. A resposta mais barata de todas: um mercenário de dano físico lida com o que o seu elemento não alcança.",
        ],
      },
      {
        type: "heading",
        text: "Os seis Sunder Charms, e o que eles te custam",
      },
      {
        type: "paragraph",
        text: "Existe um Sunder Charm por tipo de dano, e eles têm nome em vez de número. Cada um exige nível de personagem 75.",
      },
      {
        type: "table",
        caption:
          "Nomes dos charms e a penalidade de cada um, vinda dos dados de item do jogo. A penalidade se aplica a você, permanentemente, enquanto o charm estiver no seu inventário. O Black Cleft é o fora da curva, com -45 a -65%, e o Bone Break não mexe em resistência nenhuma.",
        headers: ["Tipo de dano", "Charm", "O que custa a você"],
        rows: [
          ["Fogo", "Flame Rift", "-70 a -90% na sua própria resistência a fogo"],
          ["Frio", "Cold Rupture", "-70 a -90% na sua própria resistência a frio"],
          ["Raio", "Crack of the Heavens", "-70 a -90% na sua própria resistência a raio"],
          ["Veneno", "Rotting Fissure", "-70 a -90% na sua própria resistência a veneno"],
          ["Mágico", "Black Cleft", "-45 a -65% na sua própria resistência a mágico"],
          ["Físico", "Bone Break", "-10 a -20% de redução de dano físico"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "A penalidade é a decisão real",
        text: "Um Sunder Charm não simplesmente quebra imunidade — ele troca a sua própria resistência pela capacidade de ferir alguma coisa. Carregar um Flame Rift significa andar pelo Hell com a resistência a fogo de 70 a 90 pontos abaixo de onde estava, numa dificuldade que já aplica -100. Faça essa conta antes de pegar um, não depois.",
      },
      {
        type: "callout",
        variant: "info",
        title: "O Patch 3.3 mudou como se obtêm Sunder Charms",
        text: "Os Latent Sunder Charms agora exigem nível mínimo de drop 75 (subiu de 69), a taxa de drop deles com Magic Find foi reduzida, e drops via Magic Find ficam restritos à dificuldade Hell. A taxa de drop pelos Heralds não foi afetada.",
      },
    ],
  },

  "terror-zones": {
    name: "Terror Zones",
    summary:
      "Substancialmente reformuladas pelo Reign of the Warlock: rotação de 30 minutos, consumíveis de terror por ato, Heralds of Terror e os Colossal Ancients.",
    keyFacts: [
      "As Terror Zones giram a cada 30 minutos, em grupos de áreas em vez de zonas isoladas.",
      "Consumíveis permitem escolher qual Ato fica aterrorizado, melhorando todas as zonas dele.",
      "Heralds of Terror caçam você na dificuldade Hell, cada um mais letal que o anterior.",
      "Matar um boss de ato aterrorizado pode dropar uma estátua usada para abrir a luta contra os Colossal Ancients.",
    ],
    body: [
      { type: "heading", text: "O básico" },
      {
        type: "paragraph",
        text: "Áreas aterrorizadas têm o nível dos monstros elevado, o que puxa zonas de nível baixo para dentro das treasure classes altas e torna áreas antes inúteis dignas de farm. A rotação é global no servidor e compartilhada por todo mundo.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Este sistema foi reformulado em 2026",
        text: "O Reign of the Warlock mudou as Terror Zones substancialmente, e o Patch 3.3 as ajustou de novo. Guias escritos antes de fevereiro de 2026 descrevem uma rotação de uma zona por hora, sem Heralds, sem consumíveis de terror por ato e sem os Colossal Ancients. Tudo isso está desatualizado.",
      },
      { type: "heading", text: "Rotação" },
      {
        type: "list",
        items: [
          "A rotação é a cada 30 minutos, encurtada da hora anterior.",
          "As zonas giram em grupos, em vez de individualmente — por exemplo 'Burial Grounds, The Crypt e The Mausoleum' juntas, ou 'Worldstone Keep, Throne of Destruction e Worldstone Chamber'.",
          "É possível obter consumíveis que aterrorizam um Ato inteiro. Todas as zonas dentro dele ficam melhoradas enquanto durar.",
        ],
      },
      { type: "heading", text: "Heralds of Terror" },
      {
        type: "paragraph",
        text: "Apenas na dificuldade Hell, as Terror Zones geram Heralds of Terror — caçadores que perseguem ativamente o jogador em vez de esperar serem encontrados. Cada Herald sucessivo que te alcança é descrito pela Blizzard como exponencialmente mais perigoso que o anterior. Os Heralds têm níveis, e o Patch 3.3 aumentou a chance de drops raros ou melhores a partir do Nível 3.",
      },
      { type: "heading", text: "Os Colossal Ancients" },
      {
        type: "paragraph",
        text: "Matar um boss de ato aterrorizado no fim de uma run de Terror Zone tem chance de dropar uma estátua. As estátuas são combinadas no Horadric Cube para abrir um novo encontro de pináculo contra os Colossal Ancients — uma gincana em que matar um Ancient deixa os sobreviventes mais fortes e libera habilidades adicionais neles.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "A contagem de estátuas não está resolvida",
        text: "O próprio anúncio da Blizzard se contradiz, descrevendo uma estátua como usável \"em combinação com todas as outras cinco estátuas\" num trecho (o que sugere seis) e mandando o jogador \"combinar todas as cinco estátuas no Horadric Cube\" em outro. Até isso ser confirmado em jogo, trate como \"uma estátua de cada boss de ato aterrorizado\" e não confie num número específico.",
      },
      {
        type: "paragraph",
        text: "Derrubar um Colossal Ancient recompensa uma Jewel única determinada por qual Ancient você matou por último; cada um pode dropar uma de duas. Todas essas jewels exigem nível 75 e — como o Gheed's Fortune — só uma pode estar equipada em todos os seus itens ao mesmo tempo.",
      },
      {
        type: "table",
        headers: ["Ancient", "Jewels"],
        rows: [
          ["Talic", "Defender's Fire, Defender's Bile"],
          ["Korlic", "Protector's Frost, Protector's Stone"],
          ["Madawc", "Não capturado no anúncio — não verificado"],
        ],
        caption:
          "As duas jewels do Madawc não foram listadas no material consultado. Deixadas em branco em vez de adivinhadas.",
      },
      { type: "heading", text: "Mudanças do Patch 3.3" },
      {
        type: "list",
        items: [
          "Aumento da chance de itens raros ou melhores a partir do Herald Nível 3.",
          "Nível mínimo de drop dos Latent Sunder Charms subiu de 69 para 75.",
          "Taxa de drop dos Latent Sunder Charms reduzida ao usar Magic Find; a taxa pelos Heralds não foi afetada.",
          "Latent Sunder Charms obtidos via Magic Find agora caem apenas na dificuldade Hell.",
          "Um item adicional agora cai junto de um Worldstone Shard, mas a taxa de drop dos Worldstone Shards foi reduzida.",
          "Taxa de drop das Ancient Statues reduzida.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Perguntas em aberto",
        text: "O que os Latent Sunder Charms e os Worldstone Shards realmente fazem ainda não foi verificado contra fonte primária, e eles são claramente distintos dos Sunder Charms originais. Em vez de adivinhar, esta página registra as mudanças de taxa de drop e deixa os efeitos sem afirmação.",
      },
    ],
  },

  sockets: {
    name: "Sockets",
    summary:
      "Quantos sockets um item pode ter, as três formas de adicioná-los, e por que você quase nunca deve apostar numa base boa.",
    keyFacts: [
      "A recompensa de quest do Larzuk dá o máximo de sockets daquele tipo de item, num item comum.",
      "A receita do Horadric Cube dá um número aleatório de sockets.",
      "Uma runa Hel mais um Scroll of Town Portal esvazia os sockets, destruindo o que estava neles.",
      "A contagem de sockets é limitada pelo tipo de item e pelo item level.",
    ],
    body: [
      { type: "heading", text: "Três formas de conseguir sockets" },
      {
        type: "table",
        headers: ["Método", "Resultado", "Quando usar"],
        rows: [
          [
            "Larzuk (quest Siege on Harrogath)",
            "O máximo de sockets daquele tipo de item, se o item for de qualidade comum",
            "Sempre, para uma base que você realmente pretende usar. Um uso por dificuldade.",
          ],
          [
            "Receita do Horadric Cube",
            "Um número aleatório de sockets dentro do intervalo permitido pelo item",
            "Quando os usos do Larzuk acabaram e você pode se dar ao luxo de apostar.",
          ],
          [
            "Encontrado já com sockets",
            "O que tiver rolado",
            "Confira todo item branco que cair — uma Crystal Sword de 4 sockets é um Spirit.",
          ],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "O Larzuk se comporta de forma diferente em itens mágicos e raros",
        text: "Num item comum (branco ou cinza), o Larzuk dá o máximo de sockets que aquele tipo de item permite. Em itens mágicos e raros o comportamento dele é bem menos generoso e frequentemente resulta em um socket só. Entregue a ele apenas itens comuns quando você precisar de uma contagem específica.",
      },
      { type: "heading", text: "As receitas do cubo" },
      {
        type: "table",
        headers: ["Receita", "Resultado"],
        rows: [
          ["Tal + Thul + Perfect Topaz + Armadura comum", "1–4 sockets, aleatório"],
          ["Ral + Amn + Perfect Amethyst + Arma comum", "1–6 sockets, aleatório"],
          ["Ral + Thul + Perfect Sapphire + Elmo comum", "1–3 sockets, aleatório"],
          ["Tal + Amn + Perfect Ruby + Escudo comum", "1–4 sockets, aleatório"],
        ],
        caption:
          "Fonte: The Arreat Summit. O item precisa ser de qualidade comum e sem sockets. Itens de baixa qualidade e superiores não funcionam.",
      },
      { type: "heading", text: "Removendo sockets" },
      {
        type: "paragraph",
        text: "Uma runa Hel mais um Scroll of Town Portal, cubados com um item com sockets, esvaziam todos os sockets. O item base sobrevive; as runas, gemas ou jewels que estavam nele são destruídas. É a única forma de recuperar uma base de um erro — e é por isso que encaixar na ordem errada sai tão caro.",
      },
      {
        type: "callout",
        variant: "info",
        title: "O teto de sockets é por tipo de item e por item level",
        text: "Uma Crystal Sword pode chegar a 6 sockets em princípio, mas o máximo real depende do item level dela. Uma base de nível baixo pode ter teto abaixo do máximo teórico do tipo, e é por isso que uma Crystal Sword encontrada cedo às vezes não aceita 4 sockets. Verifique o item level antes de gastar um uso do Larzuk.",
      },
    ],
  },

  pierce: {
    name: "Pierce",
    summary:
      "Por que um único atributo multiplica quatro builds de Amazon e não faz absolutamente nada por outras três, e por que ninguém publica uma tabela por nível para ele.",
    keyFacts: [
      "Pierce permite que um projétil siga adiante depois de acertar um alvo e continue viajando.",
      "A skill e todas as fontes de equipamento são um pool só, e as colunas do próprio jogo dão a ele um piso de 10% e um teto de 100%.",
      "Vale só para projéteis. Um ataque corpo a corpo não perfura, não importa o que o seu total diga.",
      "No Lightning Fury ele multiplica em vez de somar: cada inimigo que a javelin atravessa libera uma nova rajada de raios.",
      "Guided Arrow não perfura. Ele persegue um alvo único e para nele.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Pierce é o multiplicador de força da Amazon e o número mais mal compreendido da ficha dela. Duas coisas confundem: ele é ao mesmo tempo uma skill e um atributo de item com um total compartilhado, e o valor dele oscila entre *definir a build* e ser *literalmente zero*, dependendo de qual botão você está apertando.",
      },
      { type: "heading", text: "O que dizem as colunas do próprio jogo" },
      {
        type: "paragraph",
        text: "A skill Pierce é uma passiva cujos dois parâmetros o jogo rotula como **Min % Chance** e **Max % Chance**, definidos em 10 e 100. A curva entre eles é um cálculo de retornos decrescentes que vive no motor, e não em nenhuma coluna que uma extração consiga ler — e é por isso que este site publica o piso e o teto e se recusa a traçar uma reta entre os dois. Uma tabela de Pierce por nível é uma tabela que alguém inventou.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Critical Strike funciona igual",
        text: "Critical Strike, Dodge, Avoid e Evade usam a mesma forma: uma chance inicial declarada, um teto declarado, e uma curva que as tabelas não contêm. Qualquer guia que imprima valores exatos por nível para eles está preenchendo uma lacuna, não lendo uma.",
      },
      { type: "heading", text: "A skill e o seu equipamento são um pool só" },
      {
        type: "paragraph",
        text: "Piercing Attack vindo de um item soma à chance da skill Pierce em vez de rolar separado, e é o total que o projétil consulta. É por isso que as builds declaram uma *chance a alcançar* em vez de um *número de pontos a gastar* — os pontos de que você precisa dependem inteiramente do que você está usando.",
      },
      {
        type: "table",
        headers: ["Fonte", "Piercing Attack", "Custo"],
        rows: [
          ["Razortail", "33%", "Um slot de cinto e 20 de Strength"],
          ["Demon Machine", "66%", "Um slot de arma, e 95 de Dexterity"],
          ["Buriza-Do Kyanon", "100%", "Um slot de arma, numa base de besta lenta"],
          [
            "Pierce (skill)",
            "10% no nível 1, teto de 100%",
            "Pontos de skill, mais o Penetrate como pré-requisito",
          ],
        ],
        caption:
          "Valores de item vindos da extração fixada de blizzhackers/d2data. Um Buriza já fica no teto sozinho, e é por isso que uma Amazon de Buriza não gasta ponto nenhum em Pierce.",
      },
      { type: "heading", text: "Quais skills ele realmente ajuda" },
      {
        type: "paragraph",
        text: "Esta é a parte que decide se o Razortail entra na lista de uma build. Pierce é uma propriedade de *projéteis*. Uma skill que dispara um recebe tudo dele; uma skill que balança uma arma não recebe nada.",
      },
      {
        type: "table",
        headers: ["Skill", "Pierce ajuda?", "Por quê"],
        rows: [
          [
            "Lightning Fury",
            "**Enormemente**",
            "A javelin atravessa o alvo e cada inimigo por quem ela passa libera outra rajada de raios. Isso multiplica a skill em vez de somar a ela.",
          ],
          [
            "Multiple Shot, Strafe",
            "Sim",
            "Cada flecha que perfura acerta a fileira atrás daquela em que você mirou.",
          ],
          [
            "Exploding, Immolation e Freezing Arrow",
            "Sim",
            "A flecha explode a cada impacto, então uma flecha que perfura detona mais de uma vez.",
          ],
          [
            "Poison Javelin, Plague Javelin, Lightning Bolt",
            "Sim",
            "As três são arremessadas, e as três seguem adiante depois de acertar.",
          ],
          [
            "Guided Arrow",
            "**Não**",
            "Ele persegue um alvo e termina nele. Pierce é desperdiçado numa barra de Guided Arrow.",
          ],
          [
            "Charged Strike, Lightning Strike, Jab, Fend, Impale",
            "**Não**",
            "Ataques corpo a corpo. Nada sai da arma, então não há nada para perfurar.",
          ],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Pierce não ajuda a skill pela qual ele é mais comprado",
        text: "Uma Amazon de javelin aperta Lightning Fury para limpar e Charged Strike para matar bosses. Pierce é o maior multiplicador da primeira e vale exatamente nada na segunda — então um Razortail é um item de limpeza, e trocar para um cinto defensivo num boss não te custa dano de alvo único nenhum.",
      },
      { type: "heading", text: "Onde ele deixa de pagar" },
      {
        type: "paragraph",
        text: "Pierce é checado uma vez por alvo, então o valor dele despenca em grupos ralos e sobe muito em grupos densos. No Secret Cow Level ou no Chaos Sanctuary um total alto vale mais que a mesma quantidade de dano bruto; contra um boss sozinho não vale nada. Essa assimetria é o motivo de as listas de farm das páginas de javelin e de arco serem ordenadas por densidade em vez de por nível de área.",
      },
      {
        type: "refs",
        title: "Itens que carregam Piercing Attack",
        refs: [
          { kind: "unique", slug: "razortail" },
          { kind: "unique", slug: "buriza-do-kyanon" },
          { kind: "unique", slug: "demon-machine" },
        ],
      },
    ],
  },
  "corpse-explosion": {
    name: "Corpse Explosion",
    summary:
      "De onde o dano vem de verdade, por que um Champion não explode mais forte que o lixo ao lado dele, e o que aumenta o número.",
    keyFacts: [
      "O dano é 70–120% da vida base do **tipo** de monstro explodido, recalculada a partir da tabela do próprio jogo — não da vida daquele cadáver.",
      "Quantidade de jogadores e bônus de vida de Champion, Unique e Super Unique não aumentam o número.",
      "Metade do dano é físico e metade é fogo, divididos a partir de um único total sorteado.",
      "Pontos compram raio. O que aumenta o dano é o nível do seu personagem, e o que você matou.",
      "Se o nível do seu personagem estiver abaixo do nível do monstro do cadáver, o dano é reduzido nessa proporção.",
    ],
    body: [
      { type: "heading", text: "A frase que quase acerta" },
      {
        type: "paragraph",
        text: "O Corpse Explosion costuma ser descrito como causando dano baseado na vida máxima do cadáver. Isso é próximo o bastante para ser útil e errado justamente nos pontos que decidem como você joga. A skill não lê o cadáver. Ela consulta **quanto aquele tipo de monstro vale** no nível e na dificuldade dele, na mesma tabela que o jogo usou para criá-lo, e tira a média da faixa de vida que encontra ali.",
      },
      {
        type: "paragraph",
        text: "Tudo abaixo decorre dessa única substituição, e cada consequência é algo sobre o que dá para agir.",
      },
      { type: "heading", text: "O que não aumenta o dano" },
      {
        type: "list",
        items: [
          "**Quantidade de jogadores.** Monstros têm mais vida num jogo cheio; a tabela que a skill lê não muda, então a explosão também não.",
          "**Bônus de Champion, Unique e Super Unique.** Um grupo de Champions tem várias vezes a vida dos monstros ao lado e explode pelo mesmo valor. Não há motivo para guardar o chefe do grupo para o final.",
          "**O nível da própria skill.** Os pontos compram raio e nada mais. A faixa de 70–120% não se mexe.",
        ],
      },
      { type: "heading", text: "O que aumenta o dano" },
      {
        type: "list",
        items: [
          "**Matar algo mais duro.** Um lacaio de run de Baal vale mais que uma vaca, e essa diferença é toda a escala da skill.",
          "**A dificuldade.** A consulta é por dificuldade, então o mesmo monstro explode mais forte no Hell do que no Normal.",
          "**O seu nível de personagem**, mas só como uma penalidade que deixa de valer. Se o seu nível estiver abaixo do nível do monstro, o dano é multiplicado pelo seu dividido pelo dele. Passe desse ponto e a penalidade simplesmente some; não existe bônus além disso.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "O que custa é a primeira morte",
        text: "Nada na explosão vale ser otimizado além de conseguir o primeiro cadáver. O que você matar primeiro dá a partida na corrente inteira, e o grupo que ela limpa teria explodido pelo mesmo valor qualquer que fosse o membro morto primeiro.",
      },
      { type: "heading", text: "Metade físico, metade fogo" },
      {
        type: "paragraph",
        text: "Um total é sorteado entre 70% e 120% e então dividido: metade sai como dano físico e metade como fogo. Cada metade encontra a resistência do alvo ao seu próprio tipo, e é por isso que a skill continua funcionando contra monstros que barram quase tudo.",
      },
      {
        type: "table",
        headers: ["Contra", "O que acontece"],
        rows: [
          ["Um imune a fogo", "A metade de fogo é reduzida ou barrada. A metade física entra normalmente."],
          ["Um imune a físico", "A metade física é reduzida ou barrada. A metade de fogo entra normalmente."],
          ["Imune aos dois", "Quase nada. Extremamente raro, e a razão de valer a pena ter um segundo tipo de dano."],
          ["Amplify Damage no alvo", "A metade física bate mais forte — a maldição corta 100 pontos da resistência a dano físico, como faz para qualquer outro golpe físico."],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "O que este site não afirma",
        text: "Se a metade de fogo aproveita **+Fire Skills**, uma Fire Mastery ou **+% Fire Skill Damage** é deliberadamente algo que não afirmamos aqui. A divisão é calculada dentro da skill a partir da vida do cadáver; se o dano de fogo resultante passa depois pelos modificadores por que passa o dano de uma magia de fogo é decidido mais adiante no pipeline de dano, que esta etapa não rastreou de ponta a ponta. Uma resposta confiante em qualquer direção seria um palpite vestido de fato.",
      },
      { type: "heading", text: "Raio, e o problema da unidade" },
      {
        type: "paragraph",
        text: "O jogo declara o raio numa unidade que ele mesmo nomeia: **meios quadrados**, começando em 8 e subindo 1 por nível de skill. O motor divide esse número por dois antes de usá-lo, então o raio efetivo vai de cerca de 4 no nível 1 a cerca de 13 no nível 20. É isso que os pontos compram, e vale comprar — um Corpse Explosion que alcança o próximo cadáver é uma corrente, e um que não alcança é uma conjuração só.",
      },
      {
        type: "paragraph",
        text: "O raio publicado neste site é o parâmetro do próprio jogo, com a divisão por dois declarada em vez de aplicada. Documentação mais antiga converte o mesmo parâmetro para jardas dividindo por três, o que dá 2,6 no nível 1 e 9 no nível 20. Nenhuma das duas convenções deriva da outra, e este site não escolhe uma e a chama de distância em jardas. O que é certo é o parâmetro e o que o motor faz com ele.",
      },
      {
        type: "callout",
        variant: "info",
        title: "O raio das maldições é outra unidade",
        text: "Os parâmetros de raio de uma maldição se chamam apenas \"Radius\", e o motor os usa como estão — sem dividir. Aplicar a conversão do Corpse Explosion a uma maldição, ou o contrário, erraria por um fator de dois numa direção ou na outra.",
      },
      { type: "heading", text: "De onde isto vem" },
      {
        type: "paragraph",
        text: "Os 70%, os 120%, a divisão de 50% e os parâmetros de raio são as colunas da própria skill na extração fixada de dados do jogo que este site lê. A substituição da vida do cadáver pela vida de tabela do tipo de monstro, a divisão do raio por dois e a penalidade por nível de personagem vêm da implementação de referência do motor antigo — que é o Diablo II anterior ao Resurrected, e é assim que ele é nomeado aqui em vez de ser apresentado como a build atual. Nada aqui depende de uma afirmação em que as duas fontes discordem.",
      },
    ],
  },
  curses: {
    name: "Curses",
    summary:
      "Uma maldição por monstro, o que cada uma das dez faz de verdade, e por que a discussão nunca é qual delas é a mais forte.",
    keyFacts: [
      "Um monstro carrega exatamente uma maldição. Lançar a segunda substitui a primeira.",
      "O Attract é a exceção: enquanto ele dura, **nenhuma** maldição pode ser aplicada àquele alvo.",
      "Contra um monstro imune à resistência que a maldição reduz, ela entra com **um quinto** da força.",
      "Dim Vision e Terror são as duas únicas maldições cuja duração é dividida pela dificuldade — por 2 no Nightmare e por 4 no Hell.",
      "A Curse Resistance do monstro encurta a duração na proporção dela, e a partir de 100 a maldição simplesmente não entra.",
    ],
    body: [
      { type: "heading", text: "Um espaço só" },
      {
        type: "paragraph",
        text: "Toda maldição escreve no mesmo lugar do monstro. Lançar Decrepify por cima de Amplify Damage não soma; substitui. Essa regra única é o formato inteiro da árvore — dez skills disputando um espaço — e é por isso que a pergunta útil nunca é qual maldição é a mais forte, e sim qual você está abrindo mão de usar para lançar esta.",
      },
      {
        type: "list",
        items: [
          "Relançar **a mesma** maldição no mesmo nível efetivo renova a duração.",
          "Lançá-la num nível efetivo **menor** que o da que já está no alvo não faz absolutamente nada — um Necromancer cujo nível de maldição caiu ao trocar de equipamento não consegue sobrescrever a própria maldição melhor.",
          "**O Attract tranca o espaço.** Enquanto ele está num monstro, nenhuma maldição pode ser aplicada — nem Amplify Damage, nem outro Attract.",
        ],
      },
      { type: "heading", text: "Imunidade corta a maldição para um quinto" },
      {
        type: "paragraph",
        text: "Quando uma maldição reduz uma resistência e o valor **base** dessa resistência no alvo é 100 ou mais, o jogo divide o efeito da maldição por cinco. É a mesma regra de um quinto que as masteries da Sorceress encontram, e ela vale por atributo, não por skill.",
      },
      {
        type: "table",
        headers: ["Maldição", "Efeito cheio", "Contra algo imune àquele atributo"],
        rows: [
          ["Amplify Damage", "−100 de resistência a dano físico", "−20, o que quebra um monstro parado em exatamente 100%"],
          ["Decrepify", "−50 de resistência a dano físico", "−10, o que não quebra uma imunidade de 100%"],
          ["Lower Resist", "−25% até −70% de resistência a fogo, frio, raio e veneno", "Um quinto disso, contra o elemento ao qual o monstro é imune"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "É o único lugar onde a escolha não é questão de gosto",
        text: "Contra um imune a físico, o Amplify Damage quebra a imunidade e o Decrepify não. Em todo o resto os dois são uma troca de verdade — o Amplify dobra o seu dano contra um alvo que não resiste, enquanto o Decrepify o multiplica por 1,5 e ainda desacelera, enfraquece e trava o alvo.",
      },
      { type: "heading", text: "As dez, com os números delas" },
      {
        type: "paragraph",
        text: "Raio e duração com um ponto duro e com vinte. As durações são as do Normal; Dim Vision e Terror são mais curtas nas outras dificuldades, e mais nada é.",
      },
      {
        type: "table",
        headers: ["Maldição", "Raio", "Duração", "O que faz"],
        rows: [
          ["Amplify Damage", "3 → 22", "8s → 65s", "−100 de resistência a dano físico"],
          ["Dim Vision", "4 → 23", "7s → 45s", "Cega: o monstro para de perseguir e para de atirar"],
          ["Weaken", "9 → 28", "14s → 59,6s", "−33% → −52% de dano físico causado"],
          ["Iron Maiden", "7", "12s → 57,6s", "Devolve 200% → 675% do dano corpo a corpo ao atacante"],
          ["Terror", "4", "8s → 27s", "O monstro foge"],
          ["Confuse", "6 → 25", "10s → 48s", "O monstro ataca o que estiver mais perto, inclusive o próprio grupo"],
          ["Life Tap", "4 → 23", "16s → 61,6s", "50% do dano físico causado a ele volta como vida"],
          ["Attract", "9", "12s → 80,4s", "Tudo por perto ataca o monstro amaldiçoado"],
          ["Decrepify", "6", "4s → 15,4s", "−50% de movimento, velocidade de ataque, dano causado e resistência física"],
          ["Lower Resist", "7 → 26", "20s → 58s", "−25% até −70% de resistência a fogo, frio, raio e veneno"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "O raio está na unidade do próprio jogo, e não é a do Corpse Explosion",
        text: "Os parâmetros de raio de uma maldição se chamam apenas \"Radius\" e o motor os usa exatamente como estão. Os do Corpse Explosion se chamam \"meios quadrados\" e o motor os divide por dois antes. São unidades diferentes com números parecidos, então nenhuma conversão comum para jardas é aplicada a nenhuma das duas.",
      },
      { type: "heading", text: "A dificuldade, e as duas maldições que ela encurta" },
      {
        type: "paragraph",
        text: "Dim Vision e Terror funcionam mudando o que a IA do monstro está fazendo, e as duas têm a duração dividida pelo divisor de maldição da dificuldade: 1 no Normal, 2 no Nightmare, 4 no Hell. Dim Vision com um ponto dura 7 segundos no Normal e menos de 2 no Hell. Todas as outras maldições da árvore duram o mesmo em qualquer lugar.",
      },
      { type: "heading", text: "Chefes" },
      {
        type: "paragraph",
        text: "Um monstro pode carregar um atributo de Curse Resistance. Onde ele existe, a duração da maldição é reduzida na proporção dele, e a partir de 100 a maldição não entra de jeito nenhum. É esse o mecanismo por trás da sensação de que as maldições são pouco confiáveis exatamente nas coisas em que você mais as quer, e é uma propriedade do monstro, não da maldição.",
      },
      { type: "heading", text: "Qual delas, e quando" },
      {
        type: "paragraph",
        text: "Não existe maldição mais forte, e um guia que aponte uma está respondendo a uma pergunta diferente da que o espaço único propõe. O que existe é uma lista curta por situação:",
      },
      {
        type: "list",
        items: [
          "**Limpando com dano físico** — Amplify Damage. É o maior multiplicador físico do jogo e um ponto basta.",
          "**Algo perigoso** — Decrepify. Mais lento, mais fraco e mais fácil de acertar vale mais que um número maior num monstro que está prestes a te matar.",
          "**Um imune a físico** — Amplify Damage, e só ele. O corte do Decrepify vira 10 pontos e não quebra a imunidade.",
          "**Uma build elemental, ou qualquer build de veneno** — Lower Resist. É a única coisa da classe que reduz resistência a veneno, e veneno não tem Mastery.",
          "**Um grupo corpo a corpo** — Life Tap. Metade do dano causado volta como vida, para todo mundo que estiver batendo no alvo.",
          "**Uber Tristram** — Iron Maiden, que mata coisas muito acima do seu próprio dano.",
          "**Estar sendo prensado como Summoner** — Dim Vision. Um grupo cegado para de atirar e para de perseguir, o que vale mais que qualquer quantidade de dano enquanto o exército chega.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Maldições chegam de fora da classe também",
        text: "Um Reaper's Toll conjura Decrepify ao acertar e um Dracul's Grasp conjura Life Tap, e é por isso que os dois aparecem em personagens sem nenhum Necromancer por perto. A regra do espaço único continua valendo: o Decrepify de um mercenário sobrescreve o seu Amplify Damage exatamente como o de outro Necromancer sobrescreveria.",
      },
      { type: "heading", text: "De onde isto vem" },
      {
        type: "paragraph",
        text: "Os raios, durações e magnitudes são as colunas das próprias maldições na extração fixada de dados do jogo. A regra do espaço único, a exceção do Attract, o divisor de um quinto por imunidade, o comportamento de renovar-mas-não-rebaixar e o corte por Curse Resistance vêm da implementação de referência do motor antigo — o Diablo II anterior ao Resurrected. O divisor por dificuldade vem da própria tabela de dificuldades do jogo.",
      },
    ],
  },
};
