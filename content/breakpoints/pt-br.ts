import type { BreakpointTableCopy, Overlay } from "@/lib/types/copy";

/** Copy pt-BR das tabelas de breakpoint. Os números são invariantes. */
export const breakpointsPtBr: Overlay<BreakpointTableCopy> = {
  "fcr-sorceress": {
    name: "Sorceress — Faster Cast Rate",
    summary:
      "A animação padrão de conjuração da Sorceress. Vale para o Teleport também.",
    guidance: [
      "**105% é a meta.** É alcançável com orçamento baixo e governa a velocidade do Teleport, que é o que realmente determina o ritmo do seu farm.",
      "**63%** é uma meta intermediária sensata durante a evolução. Spirit sword (35) + Magefist (20) + um anel de 10% já chega lá.",
      "**200%** exige abrir mão de coisa demais na maioria dos conjuntos, e não existe nada acima disso.",
      "Um conjunto típico de 105%: Spirit sword 35 + Spirit shield 35 + Magefist 20 + um anel de 10% + Arachnid Mesh 20 = 120%.",
    ],
  },
  "fcr-sorceress-lightning": {
    name: "Sorceress — Faster Cast Rate (Lightning)",
    variant: "Só Lightning / Chain Lightning",
    summary:
      "Lightning e Chain Lightning usam uma animação diferente, mais lenta, com limiares totalmente distintos.",
    guidance: [
      "**Esta tabela vale só para Lightning e Chain Lightning.** Todo o resto que a Sorceress conjura — inclusive Teleport — usa a tabela padrão.",
      "Uma Lightning Sorceress tem portanto duas metas: **117%** para as skills de dano e **105%** para o Teleport. Na prática, 117% atende as duas.",
      "Planejar uma Lightning Sorceress em cima do breakpoint padrão de 105% deixa ela conjurando Chain Lightning em 13 frames em vez de 12.",
    ],
  },
  "fcr-paladin-necromancer-warlock": {
    name: "Paladin, Necromancer e Warlock — Faster Cast Rate",
    summary: "Estas três classes compartilham a mesma tabela de Faster Cast Rate.",
    guidance: [
      "**75%** é a meta padrão para o Hammerdin e para a maioria dos Necromancers — bom equilíbrio entre custo e benefício.",
      "**125%** é o último breakpoint e vale a pena em um caster dedicado.",
      "O **Warlock** compartilha esta tabela, o que torna os conselhos de equipamento de Paladin e Necromancer amplamente transferíveis para a classe nova.",
    ],
  },
  "fcr-assassin": {
    name: "Assassin — Faster Cast Rate",
    variant: "Apenas a animação de conjuração",
    summary:
      "Mind Blast, Cloak of Shadows, Venom, as sombras, o Teleport, e o Fade ou o Burst of Speed que estiver ativo — nunca os dois. Não governa a colocação de armadilhas.",
    guidance: [
      "**Esta tabela não cobre a colocação de armadilhas**, e esse é o erro mais comum feito sobre a classe. Uma armadilha usa a animação `S2` da Assassin, que está no cálculo de *velocidade de ataque* — velocidade base da arma, Increased Attack Speed e Burst of Speed. A animação de conjuração que esta tabela descreve é outra animação, de outro comprimento, então os números daqui não são apenas inaplicáveis às armadilhas: são a tabela errada.",
      "**65%** ainda é uma meta sensata para uma Trapsin, mas pelo **Mind Blast**, que é o botão que abre todo grupo: 16 frames viram 11.",
      "Veja a nota de Increased Attack Speed abaixo para entender por que a colocação de armadilhas não pode ser tabelada como esta.",
    ],
  },
  "fcr-druid": {
    name: "Druid — Faster Cast Rate",
    variant: "Forma humana",
    summary: "Forma humana. Werewolf e Werebear usam tabelas separadas.",
    guidance: [
      "**99%** é a meta do Wind Druid.",
      "A forma Werewolf usa 0/7/15/26/40/63/99/163 e a Werebear 0/6/14/26/40/60/95/157 — **equipamento planejado para uma forma está errado para outra**.",
    ],
  },
  "fcr-amazon": {
    name: "Amazon — Faster Cast Rate",
    summary: "Relevante principalmente para o Teleport vindo de um Enigma.",
  },
  "fcr-barbarian": {
    name: "Barbarian — Faster Cast Rate",
    summary:
      "Compartilha a tabela da Sorceress. Importa para teleportar com Enigma e para a velocidade dos shouts.",
  },
  "fhr-sorceress": {
    name: "Sorceress — Faster Hit Recovery",
    summary:
      "A Sorceress tem a tabela de recuperação mais dura do jogo, e a menor reserva de vida para absorver as consequências.",
    guidance: [
      "**60%** é a meta prática. Ficar preso em stun é uma das principais formas de a Sorceress morrer, e 15 frames de recuperação é mais de meio segundo parada.",
      "**30%** é um mínimo razoável durante a evolução — só o Stealth já dá 25%.",
      "Fontes baratas: Stealth (25), Spirit (55), Sandstorm Trek (20), anéis e cintos raros.",
    ],
  },
  "fhr-necromancer-druid-warlock": {
    name: "Necromancer, Druid e Warlock — Faster Hit Recovery",
    summary: "Estes três compartilham uma tabela.",
    guidance: ["**56%** é a meta usual; **86%** se o slot for barato."],
  },
  "fhr-paladin-assassin-barbarian": {
    name: "Paladin, Assassin e Barbarian — Faster Hit Recovery",
    summary: "Estes três compartilham uma tabela.",
    guidance: [
      "**48%** é a meta padrão. **86%** vale a pena num personagem de corpo a corpo que espera apanhar o tempo todo.",
      "Repare que a tabela do Barbarian também varia por tipo de arma em algumas situações — este é o caso geral.",
    ],
  },
  "fhr-amazon": {
    name: "Amazon — Faster Hit Recovery",
    summary: "Uma das tabelas mais generosas.",
  },
  "fhr-mercenary": {
    name: "Act 2 Desert Mercenary — Faster Hit Recovery",
    variant: "Act 2 Desert Mercenary",
    summary:
      "O mercenário tem tabela própria, idêntica à da Sorceress. Vale planejar se ele vive morrendo.",
    guidance: [
      "O Treachery já dá 20% sozinho, o que normalmente basta junto do proc de Fade.",
    ],
  },
  "fbr-sorceress": {
    name: "Sorceress — Faster Block Rate",
    summary:
      "Só importa se você estiver montando deliberadamente para bloqueio, o que a maioria das Sorceresses não faz.",
    guidance: [
      "Ignore isto a menos que você esteja rodando uma Sorceress de max block com Stormshield e investimento pesado em Dexterity. Para a maioria das builds, essa Dexterity rende mais em Vitality.",
    ],
  },
  "fbr-paladin-amazon-assassin": {
    name: "Paladin, Amazon e Assassin — Faster Block Rate",
    summary:
      "As três classes com o melhor bloqueio natural. Compartilham uma tabela.",
    guidance: [
      "**32%** é a meta padrão de um Paladin de bloqueio. Estas classes alcançam taxas úteis de bloqueio bem mais barato que qualquer outra.",
    ],
  },
  "fbr-necromancer-druid-warlock": {
    name: "Necromancer, Druid e Warlock — Faster Block Rate",
    summary: "Estes três compartilham uma tabela.",
  },
  "fbr-barbarian": {
    name: "Barbarian — Faster Block Rate",
    summary: "Entre a tabela dos casters e a dos bloqueadores.",
  },
};
