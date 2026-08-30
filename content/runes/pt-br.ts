import type { Overlay, RuneCopy } from "@/lib/types/copy";

/**
 * Copy pt-BR das runas.
 *
 * Os modificadores (weaponMod, armorMod, helmMod, shieldMod) NÃO estão aqui:
 * são strings do jogo e permanecem em inglês nos dois idiomas, junto dos dados
 * invariantes. Ver ADR 0003.
 */
export const runesPtBr: Overlay<RuneCopy> = {
  el: {
    summary: "A runa mais baixa. Attack rating e raio de luz.",
    farmNotes: "Cai em todo lugar a partir do Normal. Nunca vale caçar.",
  },
  eld: {
    summary: "Dano contra undead; bloqueio em escudos.",
    farmNotes: "Extremamente comum. Usada em Stealth e Steel.",
  },
  tir: {
    summary: "Mana por abate — a runa de sustentação do caster inicial.",
    farmNotes: "Muito comum. Metade do Stealth.",
  },
  nef: {
    summary: "Knockback em armas, defesa contra projéteis em armaduras.",
    farmNotes: "Muito comum. A outra metade do Stealth.",
  },
  eth: {
    summary: "Redução da defesa do alvo; regeneração de mana em armaduras.",
    farmNotes: "Muito comum. Usada em Insight e Spirit.",
  },
  ith: {
    summary: "Dano máximo; dano convertido em mana nas armaduras.",
    farmNotes: "Muito comum. Usada em Insight e Malice.",
  },
  tal: {
    summary: "Dano de veneno; resistência a veneno em armaduras.",
    farmNotes: "Comum. Primeira runa de Stealth e Ancient's Pledge.",
  },
  ral: {
    summary:
      "Dano de fogo; resistência a fogo em armaduras. Também repara armaduras no cubo.",
    farmNotes:
      "Comum. A Countess dropa com facilidade. Cubada com uma peça de armadura, repara ela por completo.",
  },
  ort: {
    summary:
      "Dano de raio; resistência a raio em armaduras. Repara armas no cubo.",
    farmNotes:
      "Comum. Usada em Lore e Ancient's Pledge. Cubada com uma arma, repara ela por completo.",
  },
  thul: {
    summary: "Dano de frio; resistência a frio em armaduras.",
    farmNotes: "Comum na Countess no Normal. Usada em Ancient's Pledge.",
  },
  amn: {
    summary: "Roubo de vida — a runa baixa mais importante para o corpo a corpo.",
    farmNotes:
      "Countess no Nightmare, e qualquer área de nível 25+. O roubo de vida a torna desproporcionalmente valiosa cedo.",
  },
  sol: {
    summary: "Dano mínimo; redução de dano fixa em armaduras.",
    farmNotes: "Countess no Nightmare. Usada em Insight e Rhyme.",
  },
  shael: {
    summary:
      "20 de IAS em armas, 20 de FHR em armaduras, 20 de FBR em escudos. Três funções diferentes.",
    farmNotes:
      "Countess no Nightmare. Sempre guarde sobras — ela afeta três tabelas de breakpoint diferentes.",
  },
  dol: {
    summary: "Faz monstros fugirem; regeneração de vida em armaduras.",
    farmNotes:
      "Countess no Nightmare. A fuga costuma ser desvantagem — leia a runeword antes de encaixar.",
  },
  hel: {
    summary:
      "Redução de requisitos, e a única runa sem nível mínimo. Também remove sockets.",
    farmNotes:
      "Cube uma runa Hel com um Scroll of Town Portal para esvaziar os sockets de um item. O que estava encaixado é destruído; a base sobrevive.",
  },
  io: {
    summary: "+10 de Vitality em qualquer slot.",
    farmNotes: "Countess no Hell, ou qualquer área de nível 35+.",
  },
  lum: {
    summary: "+10 de Energy em qualquer slot.",
    farmNotes: "Countess no Hell. Usada em Smoke e Wealth.",
  },
  ko: {
    summary: "+10 de Dexterity em qualquer slot.",
    farmNotes: "Countess no Hell. Usada em Lionheart e Duress.",
  },
  fal: {
    summary: "+10 de Strength em qualquer slot.",
    farmNotes: "Countess no Hell. Usada em Lionheart e Chains of Honor.",
  },
  lem: {
    summary: "Ouro extra. A runa do Wealth.",
    farmNotes:
      "Countess no Hell. A última runa da cadeia barata de upgrade 3-para-1 — de Pul em diante a proporção melhora para 2-para-1.",
  },
  pul: {
    summary: "Dano contra demônios; defesa aumentada em armaduras.",
    farmNotes:
      "Countess no Hell, baús de Lower Kurast, Travincal. A primeira das runas médias.",
  },
  um: {
    summary: "Open Wounds; +15 em todas as resistências em armaduras, +22 em escudos.",
    farmNotes:
      "Countess no Hell, Lower Kurast, Travincal, The Pit. Genuinamente útil como preenchimento de socket por si só.",
  },
  mal: {
    summary: "Prevent Monster Heal; redução de dano mágico em armaduras.",
    farmNotes:
      "Countess no Hell é a runa mais alta que ela pode dropar. Também Travincal e The Pit.",
  },
  ist: {
    summary: "A runa de magic find. 30% de MF em armas, 25% no resto.",
    farmNotes:
      "Acima do teto da Countess. Travincal, The Pit, Ancient Tunnels, Chaos Sanctuary, Terror Zones.",
  },
  gul: {
    summary: "Attack rating; +5% de resistência máxima a veneno em armaduras.",
    farmNotes: "Travincal, The Pit, Chaos Sanctuary, Terror Zones altas.",
  },
  vex: {
    summary: "Roubo de mana; +5% de resistência máxima a fogo em armaduras.",
    farmNotes:
      "Território de runa alta. Travincal, Chaos Sanctuary, Worldstone Keep, Terror Zones.",
  },
  ohm: {
    summary: "+50% de dano aumentado; +5% de resistência máxima a frio em armaduras.",
    farmNotes: "Runa alta. Travincal, Chaos Sanctuary, Worldstone Keep, Terror Zones.",
  },
  lo: {
    summary: "Deadly Strike; +5% de resistência máxima a raio em armaduras.",
    farmNotes: "Runa alta. Necessária para Grief, Fortitude e Infinity.",
  },
  sur: {
    summary: "Cega o alvo; mana máxima em armaduras, +50 de mana em escudos.",
    farmNotes: "Runa alta. Necessária para Infinity e Heart of the Oak.",
  },
  ber: {
    summary:
      "Crushing Blow em armas e 8% de redução de dano em armaduras — a runa defensiva por excelência.",
    farmNotes:
      "Topo da lista. Necessária para Infinity, Enigma, Call to Arms e Fortitude. Uma das duas runas mais disputadas do jogo.",
  },
  jah: {
    summary:
      "Ignore Target's Defense; +5% de vida máxima em armaduras, +50 de vida em escudos.",
    farmNotes: "Topo da lista. Necessária para Enigma e Call to Arms.",
  },
  cham: {
    summary: "Congela o alvo; Cannot Be Frozen em armaduras.",
    farmNotes:
      "Cannot Be Frozen num elmo é uma solução real quando o slot de armadura está ocupado por uma runeword que não tem isso.",
  },
  zod: {
    summary: "Indestructible. A runa mais rara do jogo.",
    farmNotes:
      "O drop mais raro do D2. O uso prático principal é tornar um item ethereal permanente — mas veja antes se não existe opção de reparo mais barata.",
  },
};
