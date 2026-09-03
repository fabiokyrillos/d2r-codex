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
      "**Nível da skill, raio e dano percentual são três coisas diferentes.** Pontos e +skills aumentam o nível; o nível aumenta o raio; nada nesse caminho mexe na faixa de 70–120%.",
      "Amplify Damage ajuda a metade física. Lower Resist, e qualquer coisa que reduza a resistência a fogo do alvo, ajuda a metade de fogo.",
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
          ["Lower Resist no alvo", "A metade de fogo bate mais forte. O mesmo vale para um Sunder Charm, para a Conviction de um mercenário, ou para qualquer −% to Enemy Fire Resistance que você carregue."],
        ],
      },
      { type: "heading", text: "Três números que as pessoas misturam" },
      {
        type: "paragraph",
        text: "Quase toda afirmação errada sobre esta skill nasce de tratar o **nível da skill**, o **raio** e o **dano percentual** como uma coisa só. São três, e apenas duas delas estão ligadas:",
      },
      {
        type: "table",
        headers: ["Grandeza", "O que a move", "O que não a move"],
        rows: [
          [
            "Nível da skill",
            "Pontos duros, +Necromancer Skills, +Poison and Bone Skills — e **+to Fire Skills**, porque o jogo marca o elemento desta skill como fogo, então um item que soma níveis a skills de fogo soma aqui também.",
            "Nada relacionado ao cadáver.",
          ],
          [
            "Raio",
            "O nível da skill, e só ele: 8 meios quadrados no nível 1 mais 1 por nível.",
            "O cadáver, a dificuldade, o seu nível de personagem.",
          ],
          [
            "Dano percentual",
            "Nada. A faixa de 70–120% são dois parâmetros fixos.",
            "**Nível da skill, +skills de qualquer tipo, e todo item que soma níveis.** Levar a skill até vinte não faz uma explosão bater mais forte; faz ela alcançar mais longe.",
          ],
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Então +to Fire Skills faz algo, e não é o que parece",
        text: "O elemento da skill é fogo nas tabelas do próprio jogo, então uma wand ou um amuleto com **+to Fire Skills** aumenta o nível efetivo dela exatamente como +Necromancer Skills aumenta — e o que um nível mais alto compra aqui é **raio**. Isso é uma melhoria real para uma skill cujo trabalho inteiro é alcançar o próximo cadáver. O que isso não é: mais dano por cadáver. Um item escolhido pela marcação de fogo na teoria de que ela aumenta o dano da explosão foi escolhido pelo motivo errado.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "O que este site continua não afirmando",
        text: "Se **+% Fire Skill Damage** aumenta a metade de fogo não é afirmado aqui, em nenhuma direção. A divisão é calculada dentro da skill a partir da vida do cadáver, antes de o pipeline comum de dano de magia rodar, e esta etapa não rastreou onde o dano de fogo resultante volta a entrar nele. Fire Mastery é outro assunto, e mais simples: é uma passiva de Sorceress, e um Necromancer não pode tê-la — então não é um modificador que se aplique a esta skill nesta classe, faça o pipeline o que fizer. Nenhum dos dois entra numa recomendação de equipamento como aumento direto de dano sem uma evidência que ainda não existe.",
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
      "**A regra de um quinto é estreita.** Vale para as três maldições que reduzem uma resistência, e só contra um alvo já imune à resistência que está sendo reduzida.",
      "**Amplify Damage e Decrepify não são dois graus da mesma maldição.** Contra um imune a físico só Amplify Damage quebra a imunidade, e nenhuma quantidade de Decrepify substitui.",
      "Dim Vision e Terror são as duas únicas maldições cuja duração é dividida pela dificuldade — por 2 no Nightmare e por 4 no Hell.",
      "Curse Resistance é um atributo real no motor, e **nada no baseline atual dá esse atributo a coisa alguma**. Bosses não resistem a maldições por padrão.",
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
      { type: "heading", text: "A regra de um quinto, e exatamente onde ela vale" },
      {
        type: "paragraph",
        text: "Três maldições reduzem uma resistência: Amplify Damage e Decrepify reduzem a resistência a dano físico, e Lower Resist reduz as quatro elementais. **Para essas três, e só contra um alvo cujo valor base da resistência que está sendo reduzida já seja 100 ou mais, o jogo divide o efeito da maldição por cinco.** É a mesma regra de um quinto que as masteries da Sorceress encontram, e ela é aplicada por atributo, não por skill.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "O que a regra não diz",
        text: "Não é uma penalidade geral contra monstros duros, não é uma regra de boss, e não toca nas outras sete maldições. Terror num imune a fogo dura exatamente o mesmo que Terror em qualquer outra coisa, porque Terror não reduz resistência nenhuma. Lower Resist num monstro imune a fogo mas não a frio é cortado contra o fogo dele e funciona inteiro contra o frio — uma maldição, uma conjuração, dois resultados diferentes no mesmo alvo.",
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
        text: "Contra um imune a físico, o Amplify Damage quebra a imunidade e o Decrepify não — 20 pontos contra um monstro parado em 100 bastam, e 10 não bastam. **Os dois não são intercambiáveis, e nenhum é uma versão estritamente melhor do outro.** Em todo o resto eles são uma troca de verdade: o Amplify dobra o seu dano contra um alvo que não resiste, enquanto o Decrepify o multiplica por 1,5 e ainda desacelera, enfraquece e trava o alvo. Uma página que trate o Decrepify como \"Amplify Damage com utilidade\" está errada exatamente na situação em que a diferença decide a luta.",
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
      { type: "heading", text: "Curse Resistance, e o que de fato a carrega" },
      {
        type: "paragraph",
        text: "O motor tem um atributo de Curse Resistance. Onde o alvo o tem, a duração da maldição é reduzida na proporção dele, e a partir de 100 a maldição não entra de jeito nenhum. Esse é o mecanismo, e vale conhecê-lo porque é o formato que um patch futuro usaria.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Nada no baseline atual preenche esse atributo",
        text: "Verificado em vez de suposto: o atributo existe na tabela de atributos do jogo, **nenhuma propriedade da tabela de propriedades escreve nele**, e a tabela de propriedades de monstro — treze linhas no jogo inteiro — concede dano de fogo extra, crushing blow, conjuração mais rápida, knockback, thorns e fade, e nenhuma resistência a maldição a coisa alguma. Então um boss neste baseline não está silenciosamente resistindo às suas maldições. Se o Amplify Damage parece pouco confiável no Mephisto, a explicação está em outro lugar — na regra de um quinto, se ele for imune ao que você está reduzindo, ou numa segunda maldição sua sobrescrevendo a primeira.",
      },
      {
        type: "paragraph",
        text: "Este site, portanto, **não** publica a afirmação comum de que maldições são genericamente mais fracas contra chefes. É uma afirmação sobre um atributo que hoje vale zero em toda parte, e repeti-la faria o leitor abrir mão do maior multiplicador de dano físico do jogo justamente nas lutas em que ele funciona.",
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
          "**Estar sendo prensado como Summoner** (o invocador; o termo fica em inglês por ser o nome comunitário da build) — Dim Vision. Um grupo cegado para de atirar e para de perseguir, o que vale mais que qualquer quantidade de dano enquanto o exército chega.",
          "**Algo com muita vida batendo corpo a corpo em algo seu** — Iron Maiden, que devolve um múltiplo do dano causado a quem o causou. Leia a ressalva abaixo antes de planejar uma luta em torno disso.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Iron Maiden não é um plano de Uber Tristram neste site",
        text: "O Iron Maiden devolver várias vezes o dano causado é real, e \"amaldiçoe o boss e deixe ele se matar\" é a afirmação mais repetida sobre o Necromancer que existe. Se isso funciona no **Uber Tristram** depende do que aqueles três chefes de fato fazem contra um alvo amaldiçoado e contra as invocações paradas na frente deles, e este site não pesquisou essa luta. Então a maldição é descrita pelo que ela faz, e nenhuma página aqui a apresenta como estratégia de Uber, sozinha ou junto de Life Tap.",
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
        text: "Os raios, durações e magnitudes são as colunas das próprias maldições na extração fixada de dados do jogo. A regra do espaço único, a exceção do Attract, o divisor de um quinto por imunidade, o comportamento de renovar-mas-não-rebaixar e o corte por Curse Resistance vêm da implementação de referência do motor antigo — o Diablo II anterior ao Resurrected. O divisor por dificuldade vem da própria tabela de dificuldades do jogo. Que **nada preencha a Curse Resistance** é um fato sobre este baseline, e não sobre o motor, e foi estabelecido lendo a tabela de atributos, a tabela de propriedades e a tabela de propriedades de monstro da extração fixada; se um patch futuro adicionar um portador, é essa frase que precisa ser revisitada.",
      },
    ],
  },
  minions: {
    name: "Lacaios e invocações",
    summary:
      "O que é fixado no momento da invocação, quantos você tem, por que a penalidade de resistência por dificuldade não é problema deles, e o que faz um Iron Golem se perder.",
    keyFacts: [
      "Os atributos de um lacaio são gravados nele no momento da invocação. Aumentar uma skill ou vestir +skills muda o próximo que você levantar, não os que já estão de pé.",
      "**Criaturas invocadas não sofrem a penalidade de resistência de −40 / −100 por dificuldade.** As colunas de resistência de cada lacaio trazem o mesmo número no Normal, no Nightmare e no Hell. O seu mercenário sofre.",
      "Esqueletos e magos esqueletos têm limites **separados**: oito de cada com vinte pontos duros, e mais com +skills.",
      "O Summon Resist aumenta fogo, raio, frio e veneno. Não alcança nem físico nem mágico, e não alcança os revives.",
      "Só existe um golem por vez, e o Iron Golem é o único lacaio que sobrevive a você sair de uma partida — ele é reconstruído quando você entra na próxima.",
      "Um revive dura três minutos, não pode ser renovado, e tira a vida da tabela do tipo de monstro em vez de do cadáver.",
    ],
    body: [
      { type: "heading", text: "Os atributos são fixados na invocação" },
      {
        type: "paragraph",
        text: "Esta é de longe a coisa mais consequente da classe, e ela é invisível enquanto você joga. Quando um lacaio é criado, o jogo grava nele a vida, o dano, a chance de acerto, a defesa e as resistências — uma vez só. Nada disso é recalculado depois. **Trocar de equipamento não atualiza um lacaio que já está de pé.** Um esqueleto levantado antes de você vestir um elmo com +3 em Skeleton Mastery continua exatamente tão forte quanto era antes do elmo, e tirar o elmo de novo também não o enfraquece.",
      },
      {
        type: "callout",
        variant: "info",
        title: "O que fazer a respeito",
        text: "Levantar de novo. Desinvoque o exército e reconstrua depois de qualquer mudança nos seus níveis de skill — um nível novo em Skeleton Mastery, um elmo novo, uma wand nova na troca. É a diferença entre um exército construído com os seus +skills atuais e um construído com o que você estava usando da última vez que achou um cadáver.",
      },
      {
        type: "callout",
        variant: "success",
        title: "Um Skill Shrine é uma janela, não um buff",
        text: "O santuário aumenta os seus níveis de skill enquanto dura, e é a fixação na invocação que torna isso digno de ação: **um lacaio invocado durante o santuário mantém os valores mais altos depois que ele acaba**, porque os valores foram gravados na criação e nunca são recalculados. Um exército já de pé quando você toca o santuário não ganha nada. A jogada é desinvocar e reconstruir dentro da janela, em cadáveres separados de antemão.",
      },
      { type: "heading", text: "Quantos de cada" },
      {
        type: "table",
        headers: ["Lacaio", "Quantos", "Com 20 pontos duros"],
        rows: [
          ["Esqueletos", "Um por nível até o terceiro, depois dois mais um a cada três níveis", "8"],
          ["Magos esqueletos", "A mesma fórmula, contada à parte", "8"],
          ["Golens", "Um, dividido entre as quatro skills de golem", "1"],
          ["Revives", "O nível efetivo da skill", "20"],
        ],
      },
      {
        type: "paragraph",
        text: "As quatro contagens leem o nível **efetivo** da skill, e não os pontos duros, então +skills do equipamento as aumentam diretamente. Os limites de esqueletos e de magos são independentes, e é por isso que um Summoner — o invocador, e o nome fica em inglês por ser como a comunidade chama a build — mantém os dois exércitos ao mesmo tempo em vez de escolher entre eles.",
      },
      { type: "heading", text: "Vida e dano, por dificuldade" },
      {
        type: "paragraph",
        text: "Toda criatura invocada é um monstro, e o jogo guarda a vida, o dano e a defesa dela na tabela de monstros com uma coluna separada por dificuldade. Essas colunas são a base sobre a qual o resto é construído, e são a única parte da força de um lacaio que este site publica como número.",
      },
      {
        type: "table",
        caption: "Vida e dano corpo a corpo base, da própria tabela de monstros do jogo. Níveis de skill, as masteries e Battle Orders constroem por cima disso.",
        headers: ["Lacaio", "Vida (N / NM / H)", "Dano corpo a corpo (N / NM / H)", "Defesa (N / NM / H)"],
        rows: [
          ["Esqueleto", "21 / 30 / 42", "1–2 / 1–2 / 1–2", "5 / 5 / 6"],
          ["Mago esqueleto", "61 / 88 / 123", "1–2 / 1–2 / 1–2", "24 / 26 / 28"],
          ["Clay Golem", "100 / 175 / 275", "2–5 / 2–6 / 3–7", "100 / 100 / 100"],
          ["Blood Golem", "201 / 388 / 637", "7–20 / 11–28 / 12–33", "120 / 120 / 120"],
          ["Iron Golem", "306 / 595 / 980", "7–19 / 11–30 / 12–33", "140 / 140 / 140"],
          ["Fire Golem", "313 / 613 / 1013", "10–27 / 15–39 / 18–47", "200 / 200 / 200"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Isto é uma base, não um número final",
        text: "Um esqueleto no Hell não tem 42 de vida. Tem 42 mais o que a Skeleton Mastery acrescenta, escalado pelo nível em que a skill foi conjurada, e aumentado de novo por qualquer Battle Orders em cima dele. Essas camadas seguintes são calculadas dentro do motor a partir de colunas que este site não publica como fórmula, e uma página que as multiplicasse estaria apresentando uma reconstrução do motor antigo como se fosse uma interface documentada da build atual. O que a tabela base estabelece é o formato: um mago começa com cerca de três vezes a vida de um esqueleto, um golem com cinco a quinze vezes, e cada um deles mais ou menos dobra do Normal ao Hell enquanto os monstros ao redor crescem muito mais que isso.",
      },
      {
        type: "paragraph",
        text: "A coluna de dano corpo a corpo do mago esqueleto é 1–2, e não é o motivo de levantar um. O dano de um mago é o projétil elemental que ele atira, sorteado a partir da skill e não da linha de monstro, e é por isso que um exército de magos responde à imunidade física onde um exército de esqueletos não responde.",
      },
      { type: "heading", text: "A penalidade por dificuldade não é problema do exército" },
      {
        type: "paragraph",
        text: "Um jogador perde 40 pontos de cada resistência no Nightmare e 100 no Hell. **Uma criatura invocada não perde nada.** A tabela de monstros carrega uma coluna de resistência separada por dificuldade para cada lacaio da classe, e em todos os casos os três valores são idênticos — um Clay Golem tem 50% de resistência a frio no Normal, no Nightmare e no Hell igualmente. A penalidade é uma propriedade do personagem do jogador, e um lacaio não é um.",
      },
      {
        type: "table",
        caption: "Resistências base. Cada uma delas é o mesmo número nas três dificuldades.",
        headers: ["Lacaio", "Física", "Mágica", "Fogo", "Raio", "Frio", "Veneno"],
        rows: [
          ["Esqueleto", "0%", "0%", "0%", "0%", "0%", "0%"],
          ["Mago esqueleto", "0%", "0%", "0%", "0%", "0%", "0%"],
          ["Clay Golem", "25%", "0%", "0%", "20%", "50%", "0%"],
          ["Blood Golem", "0%", "20%", "0%", "0%", "0%", "20%"],
          ["Iron Golem", "0%", "0%", "0%", "50%", "0%", "100%"],
          ["Fire Golem", "0%", "0%", "100%", "0%", "0%", "0%"],
        ],
      },
      {
        type: "callout",
        variant: "danger",
        title: "O seu mercenário não é uma criatura invocada",
        text: "O mercenário é um contratado com as regras de resistência de um jogador, e **ele sofre os −40 e os −100 inteiros**. Equipar resistência nele no Hell é necessário, e equipar o exército para isso é um problema diferente com outra resposta. Confundir os dois é a forma mais comum de uma página de Necromancer errar isso: ela recomenda charms de resistência \"para as invocações\", coisa que não existe, e deixa em −100 o único membro do grupo que realmente precisa deles.",
      },
      { type: "heading", text: "O que o Summon Resist cobre de verdade" },
      {
        type: "paragraph",
        text: "O Summon Resist concede um único valor passivo, numa curva de retornos decrescentes que começa em 20% e sobe em direção a um teto de 75%. O que esse valor atinge é mais estreito do que o nome sugere:",
      },
      {
        type: "list",
        items: [
          "**Aumenta resistência a fogo, raio, frio e veneno.** Essas quatro, e nenhuma outra.",
          "**Não aumenta resistência física nem mágica.** Um esqueleto com vinte pontos de Summon Resist continua levando dano físico cheio, e é por isso que os 25% de físico próprios do Clay Golem não são algo que a skill consiga reproduzir em outro lugar.",
          "**Alcança esqueletos, magos esqueletos e golens.** No caminho que este site conseguiu verificar, ele não alcança os revives, então um revive entra no Hell com o que quer que o monstro de origem carregasse.",
          "**O teto de resistência de um lacaio é 100**, e não os 75 do jogador. O Summon Resist somando aos 100% de fogo próprios de um Fire Golem não consegue passar disso, e não passa disso com nada.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "O primeiro ponto é quase a skill inteira",
        text: "A curva é íngreme no começo e plana depois: um ponto duro já compra a maior parte do que vinte compram. E como criaturas invocadas não sofrem penalidade de dificuldade, o Summon Resist não está compensando nada — é uma adição direta a um exército que já estava nos valores da tabela no Hell. É esse o argumento inteiro para um ponto em vez de vinte, e ele é o oposto do que costuma ser dito a favor da skill.",
      },
      { type: "heading", text: "O que as duas masteries dão de verdade" },
      {
        type: "table",
        headers: ["Skill", "Por nível", "Alcança"],
        rows: [
          ["Skeleton Mastery", "+8 de vida e +2 de dano", "Esqueletos, magos esqueletos e revives"],
          ["Skeleton Mastery (só revives)", "+5% de vida e +10% de dano", "Revives"],
          ["Golem Mastery", "+20% de vida e +25 de chance de acerto", "O golem que estiver ativo"],
          ["Golem Mastery (movimento)", "0% subindo em direção a 40%", "O golem que estiver ativo"],
          ["Summon Resist", "20% subindo em direção a 75%", "Fogo, raio, frio e veneno, em esqueletos, magos e golens"],
        ],
      },
      {
        type: "paragraph",
        text: "Nenhuma delas é uma sinergia no sentido do jogo. Uma sinergia lê apenas pontos duros; as três leem o nível efetivo, então equipamento com +skills as aumenta — e as três continuam sujeitas à fixação na invocação, então aumentá-las não faz nada por um exército já de pé.",
      },
      { type: "heading", text: "A perfuração de imunidade acompanha o exército" },
      {
        type: "paragraph",
        text: "Cada um destes lacaios tem uma passiva que lê os atributos de perfuração de imunidade do conjurador — o efeito que um Sunder Charm concede. Quais imunidades cada um perfura não é uniforme, e o padrão está nas tabelas do próprio jogo:",
      },
      {
        type: "table",
        headers: ["Lacaio", "Imunidades que perfura"],
        rows: [
          ["Esqueletos", "Física"],
          ["Magos esqueletos", "Frio, fogo, raio, veneno"],
          ["Clay e Blood Golem", "Física"],
          ["Fire Golem", "Fogo"],
          ["Iron Golem e revives", "Todas as seis"],
        ],
      },
      { type: "heading", text: "O golem, e o item que você não recupera" },
      {
        type: "paragraph",
        text: "Um golem por vez, entre as quatro skills. Invocar um Clay Golem com um Iron Golem de pé substitui o Iron Golem, e o item do qual ele foi feito já era — foi consumido quando o golem foi criado, não guardado em algum lugar e devolvido.",
      },
      { type: "heading", text: "O que persiste entre partidas, e o que não persiste", level: 3 },
      {
        type: "paragraph",
        text: "Esqueletos, magos esqueletos, revives e os três golens comuns não sobrevivem a você sair de uma partida. Você chega na próxima sozinho e reconstrói a partir do primeiro cadáver. **O Iron Golem é a exceção**: na expansão ele é guardado com o personagem e reconstruído quando você entra na partida seguinte, o que torna o item gasto nele um investimento em vez de um custo de sessão — e o que torna perdê-lo caro.",
      },
      {
        type: "table",
        caption: "Todas as formas de um Iron Golem, e com ele o item dentro dele, se perder de vez.",
        headers: ["O que acontece", "Resultado"],
        rows: [
          ["O golem morre", "Perdido. O item não cai no chão e não é devolvido."],
          ["O seu personagem morre", "Perdido."],
          ["Você invoca qualquer outro golem", "Perdido — o novo golem substitui o antigo, e só existe um espaço."],
          ["Um respec remove o seu ponto em Iron Golem", "Perdido. A skill deixa de existir no personagem, e o golem também."],
          ["Você sai da partida", "Mantido. Reconstruído quando você entra na próxima."],
        ],
      },
      {
        type: "callout",
        variant: "danger",
        title: "Use algo cuja perda não te incomode",
        text: "Quatro das cinco linhas acima destroem o item em definitivo, e uma delas é morrer, que não é um plano sob o seu controle. Este site, portanto, recomenda um Iron Golem apenas a partir de um **item barato e substituível**, e nunca sugere entregar a ele um Pride, um Insight, um Beast ou um Infinity — a recomendação padrão em guias que não enumeram antes as formas de perda. Se a perda te incomodaria, não é candidato. E confira os seus planos de respec antes de conjurar: um token gasto para rearranjar a árvore leva o golem junto.",
      },
      { type: "heading", text: "Revive é uma leva, não um exército" },
      {
        type: "list",
        items: [
          "Três minutos, fixos, em qualquer nível de skill, e **não pode ser renovado**. O relógio começa quando o monstro se levanta.",
          "A vida do revive é **sorteada de novo a partir da faixa de vida base daquele tipo de monstro** no nível e na dificuldade dele. Um Champion revive com a vida comum da espécie dele.",
          "Se o nível do monstro estiver acima do nível do seu personagem, a vida dele é reduzida nessa proporção.",
          "Só monstros que o jogo marca como revivíveis podem ser levantados, e é por isso que alguns grupos nunca rendem um.",
          "**O Summon Resist não alcança um revive.** Esqueletos, magos e golens recebem; o revive fica com as resistências do próprio tipo de monstro dele, o que para a maioria das escolhas populares é nada.",
        ],
      },
      { type: "heading", text: "Mantendo o exército junto de você" },
      {
        type: "paragraph",
        text: "Lacaios deixados longe o bastante podem parar de seguir, e às vezes somem. Um Town Portal, um waypoint ou uma escada de masmorra os recolhe; o Teleport também, e ele os chama de volta na hora. Isso é comportamento documentado, não bug, e é a razão prática de um Summoner percorrer o caminho em vez de correr à frente dele.",
      },
      { type: "heading", text: "Os chefes que batem mais forte nas invocações" },
      {
        type: "paragraph",
        text: "A tabela de monstros carrega uma marcação de **Prime Evil**, e o motor a usa para aumentar o dano que esses monstros causam especificamente às invocações de um jogador. Quinze monstros a carregam: Andariel, Duriel, Mephisto, Diablo, Baal e as formas clone e Uber deles, mais os três Colossal Ancients. É por isso que um exército que atravessa uma zona do Hell sem se abalar pode ser apagado pelo chefe de ato no fim dela.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "A marcação está declarada; o multiplicador não",
        text: "Que esses quinze causem dano extra a invocações está na tabela do próprio jogo. **Quanto extra não está**, e esta etapa não encontrou um número que pudesse sustentar, então nenhum é publicado — um número inventado para preencher a lacuna seria a frase mais citável da página e a menos sustentada. Jogue com isso como direção, não como aritmética: espere que o exército morra mais rápido para um chefe do que para tudo que veio antes dele, espere ter que reinvocar no meio da luta, e leve cadáveres.",
      },
      { type: "heading", text: "O que este site ainda não conseguiu resolver" },
      {
        type: "paragraph",
        text: "Mais curta do que era. A penalidade por dificuldade, o Skill Shrine, a persistência do Iron Golem e as tabelas base por dificuldade estão todas respondidas acima. O que sobra é:",
      },
      {
        type: "list",
        items: [
          "**O multiplicador de dano dos Prime Evil contra invocações.** A marcação é Tier 1; o número não está estabelecido aqui.",
          "**Como as camadas acima da tabela base se combinam.** Nível da skill, Skeleton Mastery, Golem Mastery e Battle Orders todos aumentam um lacaio, e a composição exata é comportamento do motor, não uma coluna publicada — então este site dá a base e descreve o resto qualitativamente, em vez de imprimir uma fórmula.",
          "**O Uber Tristram especificamente.** Três dos quinze Prime Evils ficam numa sala só ali; se um exército é resposta viável para eles é uma pergunta sobre uma luta que esta etapa não pesquisou, e nenhuma página de Necromancer deste site afirma que é.",
        ],
      },
      { type: "heading", text: "De onde isto vem" },
      {
        type: "paragraph",
        text: "As contagens, os números das masteries, o limite de golens, a duração do revive, a tabela de perfuração de imunidade, **as colunas de vida, dano e resistência por dificuldade** e a marcação de Prime Evil são todas colunas da extração fixada de dados do jogo; a contagem de lacaios é corroborada nível a nível pela documentação de 1.11. A fixação na invocação, a vida re-sorteada do revive, a penalidade por nível de personagem, o alcance do Summon Resist e a persistência do Iron Golem entre partidas vêm da implementação de referência do motor antigo — o Diablo II anterior ao Resurrected, nomeado assim porque não é prova sobre a build atual.",
      },
    ],
  },
};
