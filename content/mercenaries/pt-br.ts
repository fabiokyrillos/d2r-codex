import type { MercenaryCopy, Overlay } from "@/lib/types/copy";

/** Copy pt-BR dos mercenários. Nomes de auras e runewords ficam em inglês. */
export const mercenariesPtBr: Overlay<MercenaryCopy> = {
  "act-2-desert-mercenary": {
    summary:
      "A escolha padrão para quase toda build. Carrega uma aura, usa polearms e spears, e é o motivo de Insight e Infinity existirem.",
    hireAdvice:
      "Contrate no Nightmare. É lá que a seleção de auras é melhor para a maioria das builds, e o mercenário sobe de nível junto com você independentemente de quando foi contratado. Contratar no Hell é mais caro sem nenhum benefício duradouro.",
    abilities: [
      {
        name: "Might",
        description:
          "Aumenta o dano físico do mercenário e de todos por perto. A escolha padrão para builds de caster que precisam de algo capaz de matar monstros imunes.",
      },
      {
        name: "Holy Freeze",
        description:
          "Congela tudo em volta do mercenário, reduzindo ataque e movimento. A aura defensiva mais forte do jogo e escolha comum no Hardcore.",
      },
      {
        name: "Defiance",
        description:
          "Aumenta a defesa. Raramente escolhida — defesa escala mal no Hell comparada a simplesmente não apanhar.",
      },
      {
        name: "Blessed Aim",
        description:
          "Aumenta o attack rating. Útil para builds físicas que têm dificuldade de acertar, dispensável no resto.",
      },
      {
        name: "Prayer / Thorns",
        description:
          "Prayer regenera vida do grupo. Nicho, mas é uma opção real para um Hardcore de orçamento muito baixo.",
      },
    ],
    weaponTypes: ["Polearms", "Spears", "Javelins"],
    strengths: [
      "A aura vale para você também, não só para ele",
      "Polearms e spears carregam Insight, Infinity, Fortitude e Pride",
      "Maior dano de todos os mercenários depois de equipado",
      "Meditation do Insight resolve a mana do caster de vez",
    ],
    weaknesses: [
      "Só corpo a corpo — ele precisa alcançar o que vai matar",
      "Morre fácil no Hell sem roubo de vida e resistências",
      "Demora a te alcançar quando você atravessa a zona de Teleport",
    ],
    bestFor:
      "Quase toda build. Um caster quer Insight pelo Meditation e Might para matar imunes; uma build física quer Might; um personagem de Hardcore quer Holy Freeze.",
    gear: [
      {
        why: "Meditation tira as poções de mana da sua vida. Faça assim que tiver quatro runas comuns e uma polearm de 4 sockets — é o item de maior impacto de todo o conjunto do mercenário.",
      },
      {
        why: "Conviction reduz as resistências inimigas para você, e a linha de -45 a 55% de resistência a raio quebra imunidade a raio direto. Define a build para casters de raio, e é forte para todo mundo.",
      },
      {
        why: "Os 5% de chance de conjurar Fade ao ser atingido são o melhor efeito de sobrevivência disponível numa armadura barata de mercenário. Fade dá um bônus grande de resistências e redução de dano.",
      },
      {
        why: "+200% de defesa aumentada e um bônus grande de vida por nível. A armadura padrão de endgame do mercenário assim que você puder pagar uma runa Lo.",
      },
      {
        why: "Roubo de vida mantém ele vivo, e 15-20% de redução de dano físico soma com todo o resto. Barato e disponível desde o Nightmare.",
      },
      {
        label: "Andariel's Visage",
        why: "+2 em todas as skills, muita velocidade de ataque e roubo de vida forte. A penalidade de -30% de resistência a fogo é real — encaixe uma runa Ral para compensar.",
      },
    ],
    survivability:
      "Roubo de vida não é opcional no Hell — sem ele o mercenário morre repetidamente, não importa a defesa. Busque roubo de vida no elmo, Fade ou resistências na armadura, e aceite que ele é fonte de dano, não tanque.",
    notes: [
      "Reviver um mercenário morto custa ouro proporcional ao seu nível. Fica caro, mas nunca proibitivo.",
      "Ele mantém a aura da dificuldade em que foi contratado, para sempre. Não dá para mudar depois sem recontratar.",
      "Armas ethereal são ideais: mercenários não gastam durabilidade, então uma Giant Thresher ethereal dura para sempre com dano maior.",
    ],
  },

  "act-1-rogue-scout": {
    summary:
      "Uma mercenária à distância que aplica flechas de Cold ou Fire. Posicionamento mais seguro, dano bem menor.",
    hireAdvice:
      "Contrate no Nightmare se quiser uma. Cold Arrow é a variante mais útil, porque o chill que ela aplica é controle de verdade.",
    abilities: [
      {
        name: "Cold Arrow",
        description:
          "Adiciona dano de frio e aplica chill. O chill vale mais que o dano — desacelera tudo que ela acerta.",
      },
      {
        name: "Fire Arrow",
        description: "Adiciona dano de fogo. Simplesmente pior que Cold Arrow na maioria das builds.",
      },
    ],
    weaponTypes: ["Bows"],
    strengths: [
      "Ataca à distância, então sobrevive sem investimento em equipamento",
      "Cold Arrow aplica chill, o que ajuda qualquer build",
      "Pode usar runewords de arco como Faith e Harmony",
    ],
    weaknesses: [
      "Dano muito baixo comparado ao mercenário do Ato 2",
      "Sem aura — ela não contribui em nada para o seu personagem",
      "Arcos têm muito menos opções boas de runeword que polearms",
    ],
    bestFor:
      "Builds que querem um corpo seguro e autossuficiente em vez de uma fonte de dano. Escolha razoável no início do jogo, raramente correta no endgame.",
    gear: [
      {
        label: "Qualquer arco de dano alto",
        why: "O dano dela é baixo de qualquer forma, então um arco barato com boa base de dano serve.",
      },
      {
        why: "Mesmo raciocínio do mercenário do Ato 2 — o proc de Fade é o que importa.",
      },
      {
        why: "Redução de dano. Ela rouba menos utilmente que um mercenário corpo a corpo porque raramente apanha.",
      },
    ],
    survivability:
      "Naturalmente boa — ela fica à distância e raramente leva golpes. É o principal argumento a favor dela.",
  },

  "act-3-iron-wolf": {
    summary:
      "Um mercenário conjurador que usa arma e escudo. Amplamente considerado a opção mais fraca.",
    hireAdvice:
      "Em geral, não contrate. Se quiser um, a variante Cold oferece algum controle com Glacial Spike.",
    abilities: [
      { name: "Fire", description: "Conjura Fire Ball e Inferno." },
      {
        name: "Cold",
        description: "Conjura Glacial Spike e Frozen Armor. A mais útil das três.",
      },
      { name: "Lightning", description: "Conjura Lightning e Charged Bolt." },
    ],
    weaponTypes: ["Swords", "Shields"],
    strengths: [
      "O único mercenário que pode usar escudo, então pode carregar um Spirit ou um escudo de resistência",
      "O dano de magia dele ignora imunidade física",
    ],
    weaknesses: [
      "Dano muito baixo; as magias dele não escalam de forma significativa com o seu equipamento",
      "Sem aura",
      "Frágil, e ele se aproxima a uma distância perigosa para conjurar",
    ],
    bestFor:
      "Quase nada no endgame. Existe principalmente como curiosidade e para quem quer um slot de escudo onde guardar um item.",
    gear: [
      {
        label: "Qualquer sword com +skills",
        why: "O dano dele vem dos próprios níveis de magia, então +skills importa mais que o dano da arma.",
      },
    ],
    survivability: "Ruim. É um caster com instintos de posicionamento de corpo a corpo.",
  },

  "act-5-barbarian": {
    summary:
      "Um brigador puramente corpo a corpo com reserva de vida enorme. Sem aura, mas ele empunha duas armas e não morre.",
    hireAdvice: "Contrate no Nightmare. É uma escolha de durabilidade, não de dano.",
    abilities: [
      {
        name: "Bash / Stun",
        description:
          "Ele ataca com Bash e pode aplicar stun. Nas versões atuais consegue empunhar duas armas, o que aumenta bastante o teto de dano dele.",
      },
    ],
    weaponTypes: ["Swords", "Axes", "Maces"],
    strengths: [
      "De longe a maior reserva de vida entre os mercenários",
      "Empunha duas armas de uma mão",
      "Sobrevive a conteúdo que mata um mercenário do Ato 2 na hora",
    ],
    weaknesses: [
      "Nenhuma aura — ele não dá nada ao seu personagem",
      "Não usa polearms, então nada de Insight e nada de Infinity",
      "Dano mediano sem armas caras",
    ],
    bestFor:
      "Builds que precisam de um corpo para absorver golpes em vez de uma aura. Escolha defensável no Hardcore, e razoável para um personagem que já tem toda a mana e as resistências de que precisa.",
    gear: [
      {
        label: "Duas armas de uma mão com roubo de vida",
        why: "Empunhar duas armas praticamente dobra os ataques dele. Roubo de vida mantém ele de pé.",
      },
      { why: "O proc de Fade, como em todo mercenário." },
      { why: "Roubo de vida e redução de dano." },
    ],
    survivability:
      "A melhor entre os mercenários. Se o seu problema é “meu mercenário vive morrendo”, ele é a resposta — desde que você consiga viver sem uma aura.",
    notes: [
      "Abrir mão do Insight é o custo real. Se você é um caster que depende do Meditation, essa troca costuma ser errada.",
    ],
  },
};
