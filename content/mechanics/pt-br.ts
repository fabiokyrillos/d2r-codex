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
          "Nomes dos charms e a penalidade de cada um, vinda dos dados de item do jogo. A penalidade se aplica a você, permanentemente, enquanto o charm estiver no seu inventário.",
        headers: ["Tipo de dano", "Charm", "O que custa a você"],
        rows: [
          ["Fogo", "Flame Rift", "-70 a -90% na sua própria resistência a fogo"],
          ["Frio", "Cold Rupture", "-70 a -90% na sua própria resistência a frio"],
          ["Raio", "Crack of the Heavens", "-70 a -90% na sua própria resistência a raio"],
          ["Veneno", "Rotting Fissure", "-70 a -90% na sua própria resistência a veneno"],
          ["Mágico", "Black Cleft", "-70 a -90% na sua própria resistência a mágico"],
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
};
