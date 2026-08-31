/**
 * The en-US dictionary. This is the editorial source.
 *
 * `pt-br.ts` is typed as `Dictionary`, which is `typeof enUS` — so adding a key
 * here and forgetting to translate it is a compile error, not a runtime
 * fallback. That is the whole "zero missing translation keys" guarantee, and it
 * is enforced by `tsc` rather than by a test.
 */
export const enUS = {
  meta: {
    siteName: "D2 Codex",
    siteTagline: "Diablo II: Resurrected progression guide",
    defaultTitle: "D2 Codex — Diablo II: Resurrected progression guide",
    titleTemplate: "%s · D2 Codex",
    defaultDescription:
      "A progression-first Diablo II: Resurrected companion. Leveling walkthroughs, gear progression from level 1 to best-in-slot, farming routes, runewords and verified game mechanics.",
    ogDescription:
      "Every build documented at six gear tiers, so the page is useful whatever you currently own. Verified against Patch {patch}.",
  },

  nav: {
    primary: "Primary",
    reference: "Reference",
    menu: "Menu",
    classes: "Classes",
    builds: "Builds",
    leveling: "Leveling",
    farming: "Farming",
    runewords: "Runewords",
    runes: "Runes",
    items: "Items",
    breakpoints: "Breakpoints",
    mercenaries: "Mercenaries",
    mechanics: "Mechanics",
    sources: "Sources & research",
    skipToContent: "Skip to content",
  },

  localeSwitcher: {
    label: "Language",
    ariaLabel: "Change language",
    switchTo: "Switch to {language}",
  },

  footer: {
    blurb:
      "A progression-first Diablo II: Resurrected companion. Built to answer “what should I do next?” at every gear level.",
    columnProgression: "Progression",
    columnReference: "Reference",
    columnAbout: "About",
    mechanicsLink: "Game mechanics",
    writtenFor: "Written for",
    patchSeason: "Patch {patch} · Ladder Season {season}",
    verifiedOn: "Verified {date}.",
    trademark:
      "Diablo II: Resurrected is a trademark of Blizzard Entertainment. This is an unofficial fan reference.",
  },

  search: {
    button: "Search",
    ariaLabel: "Search the site",
    dialogLabel: "Search",
    closeLabel: "Close search",
    queryLabel: "Search query",
    placeholder: "Search items, runewords, builds, mechanics…",
    minChars: "Type at least two characters.",
    nicknamesHint: "Nicknames work: {examples}.",
    loading: "Loading index…",
    failed: "Search index failed to load. Use the navigation instead.",
    noResults: "Nothing matches “{query}”.",
    noResultsHint: "Not every item in the game is catalogued yet — see {link}.",
    coverageLink: "coverage",
    navigate: "navigate",
    open: "open",
    close: "close",
    entriesIndexed: "{count} entries indexed",
  },

  searchKinds: {
    class: "Class",
    build: "Build",
    leveling: "Leveling",
    runeword: "Runeword",
    rune: "Rune",
    item: "Item",
    area: "Farming",
    skill: "Skill",
    mechanic: "Mechanic",
    mercenary: "Mercenary",
    breakpoints: "Breakpoints",
    page: "Page",
  },

  home: {
    badge: "Patch {patch} · Season {season}",
    headlineA: "Every guide starts at",
    headlineHighlight: "best in slot",
    headlineB: "This one starts where you are.",
    lede: "A Diablo II: Resurrected companion built around one question: {strong} Level 1 with nothing, level 70 with a Spirit and a Stealth, or level 95 chasing a perfect roll — the answer should be useful at every point.",
    ledeStrong: "what should I do next?",
    ctaStart: "Start a character",
    ctaBuilds: "Browse builds",
    tiersEyebrow: "Progression, not a shopping list",
    tiersLede:
      "Every build on this site is documented at six gear tiers. You find the one that matches what you actually own, and it tells you what to fix next.",
    classesTitle: "Classes",
    classesAll: "All eight →",
    dlcBadge: "DLC",
    buildsDocumented: "{count} build documented",
    buildsDocumentedPlural: "{count} builds documented",
    overviewAvailable: "Overview available",
    featureLevelingEyebrow: "Leveling",
    featureLevelingTitle: "A walkthrough, level 1 to Hell",
    featureLevelingBody:
      "Which skill takes your next point, where your stats go, when to respec, which runeword to make, and when you are ready for the next difficulty.",
    featureFarmingEyebrow: "Farming",
    featureFarmingTitle: "Where to go, and why",
    featureFarmingBody:
      "Area levels straight from the game's own data files. {alvl85} of the {total} documented areas hit the level 85 threshold where the best drops unlock.",
    featureRunewordsEyebrow: "Runewords",
    featureRunewordsTitle: "Base rules you cannot misread",
    featureRunewordsBody:
      "{count} runewords with socket counts, exact rune order and explicit exclusions. Insight goes in a polearm, not a spear — and the page says so.",
    accuracyTitle: "On accuracy",
    accuracyBodyA:
      "Numbers on this site come from primary sources: the game's own data files for area levels, Blizzard's official material for patch changes, and cross-checked community databases for item statistics. Where reputable sources disagree, or where something has not been confirmed, the page says so rather than picking a number and sounding confident.",
    accuracyBodyB:
      "Diablo II now has {strong} playable classes, not seven — the Warlock arrived with {expansion} in 2026. If a guide you are reading lists seven, it predates the expansion, and everything else on it may be stale too.",
    accuracyEight: "eight",
    accuracyLink: "How we research this →",
  },

  classes: {
    indexTitle: "The eight classes",
    indexDescription:
      "Diablo II had seven playable classes for twenty-five years. It now has eight.",
    warningTitle: "If a guide lists seven classes, it is out of date",
    warningBody:
      "The {warlock} arrived with the {expansion} expansion in February 2026 — the first new Diablo II class in a quarter of a century. It requires a paid purchase beyond base D2R. Any guide still listing seven classes predates the expansion, which means its patch information is stale too.",
    bestFor: "Best for:",
    beginnerFriendliness: "Beginner friendliness {value}/5",
    requiresDlc: "Requires DLC",
    buildsCount: "{count} build",
    buildsCountPlural: "{count} builds",
    levelingGuide: "Leveling guide",
    coverageTitle: "Coverage",
    coverageBody:
      "The Sorceress and Paladin are fully documented — skills, complete leveling journeys and endgame builds with six-tier gear progression. The other six classes currently have overview pages. Depth is being added one class at a time rather than publishing six shallow guides at once.",
    coverageLink: "See the reference implementation →",

    dlcCalloutTitle: "Paid expansion required",
    dlcCalloutBody:
      "The {class} is only playable if you own {dlc}. It is not included with base Diablo II: Resurrected.",
    startHere: "Start here",
    levelingEyebrow: "Leveling",
    levelingCardTitle: "Level 1 to Hell farming",
    endgameEyebrow: "Endgame build",
    strengthsWeaknesses: "Strengths and weaknesses",
    coreMechanics: "Core mechanics",
    coreMechanicsDescription:
      "The things that are genuinely specific to this class, and that generic advice tends to get wrong.",
    attributes: "Attributes",
    attributesDescription:
      "Starting values, and what each point of Vitality or Energy actually buys.",
    attrStrength: "Strength",
    attrDexterity: "Dexterity",
    attrVitality: "Vitality",
    attrEnergy: "Energy",
    gainHeader: "Gain",
    perPoint: "Per point",
    perLevel: "Per level",
    life: "Life",
    mana: "Mana",
    perVitality: "{value} per Vitality",
    perEnergy: "{value} per Energy",
    attributesCaption:
      "Some databases publish these in quarter-units, where 8 means 2 life per point. The values here are the player-facing numbers.",
    skillTrees: "Skill trees",
    skillsCount: "{count} skills",
    treeNotDocumented: "Not yet documented",
    classItems: "Class-specific items",
    breakpointsTitle: "Breakpoints",
    breakpointsDescription:
      "Animation frame thresholds. Speed stats do nothing until they cross one.",
    allBreakpointsLink: "All breakpoint tables →",
    noBuildsTitle: "Build guides in progress",
    noBuildsBody:
      "This class has an overview but no build guides yet. The Sorceress is the reference implementation — its structure is what every other class will follow.",
    noBuildsLink: "See documented builds →",
  },

  builds: {
    indexTitle: "Build guides",
    indexDescription:
      "Every build here is documented at six gear tiers, from a fresh character to best in slot — so the page is useful whatever you currently own.",
    whyFewTitle: "Why so few builds?",
    whyFewBody:
      "One deeply researched, fully verified build is worth more than twelve shallow ones. The Blizzard Sorceress and the Hammerdin exercise the entire schema — six gear tiers with alternatives per slot, breakpoint targets with reasoning, immunity planning, self-found and Hardcore notes — and every number on them has been checked against multiple sources. Additional builds follow that template rather than lowering the bar.",
    awaitingTitle: "Classes awaiting build guides",

    howItPlays: "How it plays",
    atAGlance: "At a glance",
    capability: "Capability",
    content: "Content",
    ratingsNote:
      "Ratings are coarse on purpose — 1 is {low}, 5 is {high}. A finer scale would imply a precision this data does not have.",
    clearSpeed: "Clear speed",
    bossing: "Bossing",
    survivability: "Survivability",
    magicFind: "Magic find",
    terrorZones: "Terror Zones",
    ubers: "Ubers",
    soloSelfFound: "Solo self-found",
    players8: "8-player games",
    gettingThere: "Getting there",
    doNotLevelAs: "Do not level as this build",
    respecAt: "Respec at:",
    fullLevelingLink: "Full leveling walkthrough →",
    skills: "Skills",
    skillsDescription:
      "Maxing order matters more than the final totals — it determines how the build feels for the fifty levels before it is finished.",
    maxInOrder: "Max these, in this order",
    onePointEach: "One point each",
    remainingPoints: "Remaining points",
    colOrder: "#",
    colSkill: "Skill",
    colPoints: "Points",
    colWhy: "Why",
    colRole: "Role",
    stats: "Stats",
    colAttribute: "Attribute",
    colAllocation: "Allocation",
    breakpointsDescription:
      "Speed stats do nothing until they cross a threshold. These are the ones that matter for this build.",
    colStat: "Stat",
    colTarget: "Target",
    colFrames: "Frames",
    colPriority: "Priority",
    immunities: "Dealing with immunities",
    immunitiesCalloutTitle: "The build's real constraint",
    gearProgression: "Gear progression",
    gearProgressionDescription:
      "Six tiers. Find the one that matches what you actually own, then read the “what to fix next” box at the bottom of it.",
    gearTiersNav: "Gear tiers",
    levelsRange: "Levels {from}–{to}",
    whatToFixNext: "What to fix next",
    charmsInventory: "Charms & inventory",
    weaponSwap: "Weapon swap",
    lookFor: "Look for:",
    sockets: "Sockets:",
    orAlternative: "or",
    tradeOnly: "Trade only",
    mercenary: "Mercenary",
    mercGear: "Gear",
    fullMercLink: "Full mercenary guide →",
    whereToFarm: "Where to farm",
    whereToFarmDescription:
      "Ordered by how well this specific build handles the area, with the gear tier you need before it is realistic.",
    selfFound: "Solo self-found",
    hardcore: "Hardcore",
    roleMain: "Core",
    roleSynergy: "Synergy",
    roleUtility: "Utility",
    rolePrerequisite: "Prerequisite",
    roleFlex: "Flexible",
    priorityRequired: "required",
    priorityRecommended: "recommended",
    priorityLuxury: "luxury",
  },

  leveling: {
    indexTitle: "Level 1 to Hell",
    indexDescription:
      "Walkthroughs organised by stage rather than by level. Ninety-nine pages would be unreadable; the decisions that actually matter cluster around skill unlocks, quest rewards and difficulty transitions.",
    guides: "Guides",
    stagesCount: "{count} stages · level 1 to Hell farming",
    transitionsTitle: "Difficulty transitions",
    transitionsDescription:
      "These are recommendations, not requirements. You can enter Nightmare at level 30 — it will just be unpleasant, and slower than levelling a little first.",
    colMilestone: "Milestone",
    colRecommendedLevel: "Recommended level",
    colWhy: "Why",
    resistancePenaltyTitle: "The resistance penalty",
    resistanceCalloutTitle: "Plan for it before you arrive, not after",
    resistanceBodyA:
      "Nightmare applies {nm} to all your resistances. Hell applies {hell}. These are flat subtractions from your total, and they are the single most common reason a character that felt fine suddenly starts dying.",
    resistanceBodyB:
      "A character finishing Normal at 75% fire resistance begins Nightmare at 35%, and would begin Hell at −25%. Aim to arrive in each difficulty already able to reach 75% {after} the penalty.",
    resistanceAfter: "after",
    colDifficulty: "Difficulty",
    colResistancePenalty: "Resistance penalty",
    colDeathPenalty: "Death XP penalty",
    resistanceCaption:
      "Recovering your corpse returns 75% of the experience lost. Verified against The Arreat Summit.",
    questsTitle: "Quest rewards worth going out of your way for",
    questsDescription:
      "Each is repeatable once per difficulty, so the totals below are per difficulty — three times over a character's life.",
    colQuest: "Quest",
    colAct: "Act",
    colReward: "Reward",
    questsCaption:
      "4 skill points and 5 stat points per difficulty. Across three difficulties: 12 skill points, 15 stat points, +30 all resistances and +60 life.",
    imbueTitle: "Save the Charsi imbue",
    imbueBody:
      "The imbue rolls a rare item with high-tier affixes based on the item's level. Spending it on a level 11 item wastes it. Most players hold all three until they have a good circlet, amulet or class-specific base in the 60s.",
    awaitingTitle: "Classes awaiting leveling guides",

    pageTitle: "{class} — level 1 to Hell",
    stagesBadge: "{count} stages",
    leadsTo: "Leads to {build}",
    beforeYouStart: "Before you start",
    stagesNav: "Stages",
    goal: "Goal",
    killingWith: "Killing with",
    skillPoints: "Skill points",
    statPoints: "Stat points",
    whatToDo: "What to do",
    gearToHunt: "Gear to hunt during this stage",
    readyWhen: "Ready to move on when",
    respecPlanning: "Respec planning",
    respecPlanningDescription:
      "You get one free respec per difficulty from the Den of Evil quest — three per character. Spend them deliberately.",
    whereThisLeads: "Where this leads",
    whereThisLeadsBody: "This journey levels into the {build}. Its gear progression picks up exactly where this guide leaves off.",
    atLevel: "Level {level}",
    optional: "Optional",
  },

  levelingTables: {
    transitions: [
      {
        milestone: "Normal Act 5 / The Ancients",
        level: "30+",
        why: "The Ancients cannot be skipped or teleported past, and they hit hard for Normal.",
      },
      {
        milestone: "Enter Nightmare",
        level: "38–42",
        why: "Earlier is possible but slow going. Nightmare experience is far better than Normal's, so lingering past 45 wastes time.",
      },
      {
        milestone: "Nightmare Act 4–5",
        level: "50+",
        why: "Monster levels climb steeply here. If you are struggling, farm Nightmare Countess or Mephisto instead of pushing.",
      },
      {
        milestone: "Enter Hell",
        level: "60–65",
        why: "Below 60 the monster level gap hurts both your damage and your defence. This is the transition people rush and regret.",
      },
      {
        milestone: "Hell Act 3 / Mephisto runs",
        level: "70+",
        why: "Once you can run Mephisto reliably you can stop progressing and start farming. Clearing all of Hell is optional.",
      },
    ],
    penalties: [
      { difficulty: "Normal", resistance: "None", death: "None" },
      {
        difficulty: "Nightmare",
        resistance: "−40% to all resistances",
        death: "5% of the current level's experience",
      },
      {
        difficulty: "Hell",
        resistance: "−100% to all resistances",
        death: "10% of the current level's experience",
      },
    ],
    quests: [
      { quest: "Den of Evil", act: "1", reward: "+1 skill point, and a free full respec" },
      { quest: "Radament's Lair", act: "2", reward: "+1 skill point (Book of Skills)" },
      { quest: "The Fallen Angel (Izual)", act: "4", reward: "+2 skill points" },
      { quest: "Lam Esen's Tome", act: "3", reward: "+5 stat points" },
      {
        quest: "The Golden Bird",
        act: "3",
        reward: "Potion of Life — permanent +20 maximum life",
      },
      {
        quest: "Prison of Ice (Anya)",
        act: "5",
        reward: "Scroll of Resistance — permanent +10 all resistances",
      },
      {
        quest: "Tools of the Trade",
        act: "1",
        reward: "Charsi imbue — turns an item into a high-tier rare",
      },
      {
        quest: "Hellforge",
        act: "4",
        reward: "Runes and gems; the Hell version can drop a high rune",
      },
    ],
  },

  farming: {
    indexTitle: "Where to farm",
    indexDescription:
      "Area levels here come from the game's own levels.txt, using the Expansion columns. That distinction matters — the Classic columns in the same table give very different numbers.",
    alvl85Badge: "{count} area level 85 zones",
    areasDocumented: "{count} areas documented",
    whyTitle: "Why area level 85 matters",
    whyBodyA:
      "Treasure classes are gated by monster level. At area level 85 the highest treasure classes unlock, which means {strong} from an ordinary monster. Below 85, entire item tiers simply cannot drop no matter how long you farm or how much magic find you carry.",
    whyStrong: "every item in the game becomes possible",
    whyBodyB:
      "The exception is act bosses and some super uniques, whose own monster level is higher than the zone they stand in. Hell Mephisto is monster level 87 in an area level 83 zone, which is exactly why he is worth running.",
    alvl85Title: "Area level 85 zones",
    alvl85Description: "The top tier. Anything in the game can drop here.",
    bossRunsTitle: "Boss and target runs",
    bossRunsDescription:
      "Lower area levels, but a boss whose own monster level, drop table or sheer speed makes the run worth it.",
    immunitiesLabel: "Immunities:",
    noneNotable: "None notable",
    act: "Act {act}",
    topTc: "top TC",

    areaLevels: "Area levels",
    normal: "Normal",
    nightmare: "Nightmare",
    hell: "Hell",
    topTreasureClasses: "Top treasure classes",
    levelsSource: "From the game's {file}, Expansion columns.",
    whyRunIt: "Why run it",
    gettingThere: "Getting there",
    whatToExpect: "What to expect",
    characteristics: "Characteristics",
    monsterDensity: "Monster density",
    danger: "Danger",
    runLength: "Run length:",
    commonImmunitiesHell: "Common immunities in Hell",
    goodFor: "Good for",
    bossesTitle: "Bosses and super uniques",
    colName: "Name",
    colType: "Type",
    colNotes: "Notes",
    notableTargets: "Notable targets",
    buildsThatFarm: "Builds that farm here",
    buildsThatFarmDescription:
      "Derived from the build data — a build recommending this area appears automatically.",
    notForEveryBuild: "Not for every build",
    worthKnowing: "Worth knowing",
    classesThatHandle: "Classes that handle it well",
    terrorZoneRotation: "Terror Zone rotation",
    runLengthVeryShort: "very short",
    runLengthShort: "short",
    runLengthMedium: "medium",
    runLengthLong: "long",
    targetRunes: "runes",
    targetUniques: "uniques",
    targetSets: "sets",
    targetBases: "bases",
    targetCharms: "charms",
    targetJewels: "jewels",
    targetGems: "gems",
    targetExperience: "experience",
    targetGold: "gold",
    targetKeys: "keys",
    targetEssences: "essences",
    bossKindActBoss: "act boss",
    bossKindSuperUnique: "super unique",
    bossKindUniquePack: "unique pack",
    bossKindEvent: "event",
  },

  runewords: {
    indexTitle: "Runewords",
    indexDescription:
      "Grouped by when they actually become relevant to a character, not alphabetically. Every entry states its exact socket count, rune order and which base types it will and will not work in.",
    documented: "{count} documented",
    verifiedStats: "Verified stat lines",
    baseRequired: "Base required",
    socketsLabel: "Sockets",
    levelLabel: "Level",
    runesInOrder: "Runes, in socket order",
    orderWarning:
      "Socket left to right in exactly this order. A runeword socketed out of order produces nothing — the runes stay in the item as ordinary socket fillers, and you need a Hel rune and a Scroll of Town Portal to get the base back.",
    statistics: "Statistics",
    statisticsDescription:
      "As they appear on the finished item, including the individual rune contributions.",
    statisticsUnverified:
      "Not published by Blizzard and not yet confirmed in game. Left blank rather than guessed.",
    whichBase: "Which base to use",
    commonMistakes: "Common mistakes",
    whoWantsThis: "Who wants this",
    worthKnowing: "Worth knowing",
    buildsThatUse: "Builds that use it",
    buildsThatUseDescription:
      "Generated from the build data, so this list can never drift out of date.",
    theRunes: "The runes",
    noLevelReq: "no level req",
    levelShort: "lvl {level}",
  },

  runes: {
    indexTitle: "Runes",
    indexDescription:
      "All 33 runes. The socketed modifier depends on what you put the rune into, and shields frequently differ from body armor — the columns below keep them separate.",
    verifiedAgainst: "Verified against The Arreat Summit",
    readingTitle: "Reading the table",
    readingBody:
      "Helms use the armor modifier. Shields are broken out separately because roughly a third of runes behave differently there — Shael gives 20% Faster Hit Recovery in a helm or body armor, but 20% Faster Block Rate in a shield.",
    groupLow: "Low runes",
    groupLowNote: "El through Amn. Countess drops these freely in Normal.",
    groupMid: "Mid runes",
    groupMidNote: "Sol through Lem. Nightmare and Hell Countess, Lower Kurast chests.",
    groupMidHigh: "Mid-high runes",
    groupMidHighNote: "Pul through Gul. Travincal, The Pit, area level 85 zones.",
    groupHigh: "High runes",
    groupHighNote:
      "Vex through Zod. Travincal, Chaos Sanctuary, Worldstone Keep, high Terror Zones.",
    colRune: "Rune",
    colLvl: "Lvl",
    colWeapon: "Weapon",
    colArmorHelm: "Armor / Helm",
    colShield: "Shield",
    upgradingTitle: "Upgrading runes",
    upgradingDescription:
      "Runes El through Ort combine three-to-one with no gem. From Thul upward a gem is required, and from Pul upward the ratio improves to two-to-one.",
    colRecipe: "Recipe",
    colResult: "Result",
    colRunewordsNeeding: "Runewords needing it",
    upgradingCaption:
      "Source: The Arreat Summit Horadric Cube recipe list. Note the gem tiers — Chipped for the early steps, Flawed in the middle, then standard and Flawless gems for the high runes.",
    runeNumber: "Rune {number}",
    ofTotal: "#{number} of 33",
    requiredLevel: "Required level {level}",
    noLevelRequirement: "No level requirement",
    socketedModifiers: "Socketed modifiers",
    colItemType: "Item type",
    colModifier: "Modifier",
    itemWeapon: "Weapon",
    itemBodyArmor: "Body Armor",
    itemHelm: "Helm",
    itemShield: "Shield",
    whereItComesFrom: "Where it comes from",
    upgradeRecipe: "Upgrade recipe",
    upgradeRecipeBody:
      "Combine in the Horadric Cube. Upgrading is often faster than farming the higher rune directly, especially in the El-to-Lem range where the ratio is three-to-one.",
    runewordsUsing: "Runewords using {rune}",
    runewordsUsingDescription:
      "Derived from the runeword data — this list updates itself.",
  },

  items: {
    indexTitle: "Items",
    indexDescription:
      "Statistics are written as the game rolls them, with ranges intact — knowing a Nightwing's Veil rolls 8-15% cold damage tells you far more than an average would.",
    count: "{count} items",
    whyShortTitle: "Why this list is short",
    whyShortBody:
      "Items get catalogued when a guide needs them, and every entry has been verified against an item database. Transcribing several hundred uniques from memory would fill the page faster and get numbers wrong, which is the one thing this project cannot afford.",
    groupHelms: "Helms",
    groupBodyArmor: "Body armor",
    groupWeapons: "Weapons & orbs",
    groupShields: "Shields",
    groupGlovesBeltsBoots: "Gloves, belts & boots",
    groupJewellery: "Jewellery",
    related: "Related",
    statistics: "Statistics",
    statisticsNote:
      "Ranges are the roll range. Items marked with a bullet are the reason to want the item.",
    requirements: "Requirements",
    colRequirement: "Requirement",
    colValue: "Value",
    requiredLevel: "Required level",
    requiredStrength: "Required strength",
    requiredDexterity: "Required dexterity",
    maxSockets: "Max sockets",
    whereItDrops: "Where it drops",
    needsMonsterLevel: "Needs monster level {level}+",
    tradeAvailability: "Trade availability: {value}",
    gamblable: "Gamblable",
    shoppable: "Shoppable",
    craftable: "Craftable",
    areasToFarm: "Areas to farm it",
    worthKnowing: "Worth knowing",
    alternatives: "Alternatives",
    alternativesDescription:
      "Items that fill a similar role at a different price or tier.",
    buildsThatUse: "Builds that use it",
    buildsThatUseDescription:
      "Generated from the build data, so it can never drift out of date.",
    maxSocketsLabel: "max sockets",
    levelBadge: "Level {level}",
    tradeAbundant: "abundant",
    tradeCommon: "common",
    tradeUncommon: "uncommon",
    tradeRare: "rare",
    tradeVeryRare: "very rare",
  },

  skills: {
    // ---- tree ----
    treeLabel: "{tree} skill tree",
    treeHint: "Use arrow keys to navigate skills. Enter opens the details panel.",
    rowLabel: "Level {level}",
    emptyCell: "No skill",
    panelHeading: "Skill details",
    panelEmpty: "Select a skill to see what it does, what it needs, and where it sits.",
    closePanel: "Close details",
    fullPage: "View full skill page",
    // ---- tile ----
    // One composition, four shapes. The classification is a single phrase, so
    // no word the template already said gets repeated: an earlier version
    // announced "20 points, Optional, optional".
    ariaNoBuild: "{skill}, level {level}, {tree}.",
    // `{points}` arrives already worded by `formatPoints`, so there is one
    // build template rather than a second key existing only to say "1 point".
    ariaBuild: "{skill}, level {level}, {tree}, {points}, {classification}.",
    ariaBuildUnused: "{skill}, level {level}, {tree}, {classification}.",
    classMaxed: "maxed and mandatory",
    classInvested: "mandatory",
    classOnePoint: "mandatory",
    classPrerequisite: "prerequisite",
    classSynergy: "synergy, mandatory",
    classUtility: "mandatory",
    classFlex: "optional",
    classUnused: "not used",
    // The one point-count string. Read through `formatPoints`, never `fmt`.
    points: { one: "{points} point", other: "{points} points" },
    noPoints: "not used",
    // ---- states ----
    stateMaxed: "Maxed",
    stateInvested: "Invested",
    // Not "One point": the tile prints the count beside it, so that read
    // "One point / 1 point". This says what the point is, not how many.
    stateOnePoint: "Mandatory",
    statePrerequisite: "Prerequisite",
    stateSynergy: "Synergy",
    stateUtility: "Utility",
    stateFlex: "Optional",
    stateUnused: "Not used",
    // ---- legend ----
    legendTitle: "Reading this tree",
    legendHardPoints: "Hard points only. Gear that grants +skills is not counted.",
    legendMandatory: "{points} of {cap} mandatory hard points",
    legendFlex: { one: "plus {points} optional", other: "plus {points} optional" },
    // ---- skill page ----
    eyebrow: "Skill",
    atAGlance: "At a glance",
    colProperty: "Property",
    colValue: "Value",
    tree: "Tree",
    unlocks: "Unlocks at",
    unlocksValue: "Level {level}",
    cap: "Hard cap",
    type: "Type",
    element: "Element",
    manaCost: "Mana cost",
    mechanicsTitle: "How it works",
    prerequisitesTitle: "Prerequisites",
    prerequisitesNone: "None. Character level is the only gate.",
    prerequisitesBody: "You must put at least one point in each of these before this skill can be allocated.",
    unlocksTitle: "Unlocks",
    unlocksBody: "Skills that require this one.",
    synergiesTitle: "Synergies received",
    synergiesBody: "Skills that raise this one's numbers when you put points in them.",
    synergiesNote:
      "Synergy identities are extracted from the game's own skill formulas, not from community consensus. Magnitudes, where given, are verified separately.",
    feedsTitle: "Skills this feeds",
    feedsBody: "Skills whose numbers this one raises. The same edges, read the other way.",
    synergyKindDamage: "damage",
    synergyKindArmor: "defence",
    synergyKindHealing: "healing",
    synergyKindDuration: "duration",
    synergyKindFreeze: "freeze length",
    synergyKindJoin: "and",
    progressionTitle: "Damage by level",
    progressionBody: "Base damage before synergies, before Mastery, and before any +skills. Hard points only.",
    colLevel: "Level",
    colDamage: "Damage",
    buildsTitle: "Builds using this skill",
    buildsBody: "How much each documented build invests.",
    buildsNone: "No documented build allocates this skill.",
    /*
     * Three messages, because "no damage table" has three different causes and
     * one sentence covering all of them was false for seven skills. The
     * extracted columns carry a skill's *own* elemental damage; a weapon attack
     * has none because its damage is the weapon's, and Static Field has none
     * because its damage is a proportion rather than a range.
     */
    noProgressionWeapon:
      "This skill does deal damage — it comes from your weapon, modified by the skill's own damage bonus, so there is no table intrinsic to the skill to publish. Attack rating, weapon damage and your other modifiers decide the number.",
    /*
     * Smite only. Deliberately not the weapon sentence: Smite's base damage is
     * the shield's, and it never rolls against Attack Rating — the weapon
     * wording was wrong on both counts, on the page whose own mechanics section
     * already said so. No formula is given, because the multipliers that act on
     * shield damage are not modelled here and half a formula is worse than none.
     */
    noProgressionShield:
      "Smite does deal damage. Its base is the Smite Damage printed on your shield, not the weapon's damage, and Smite does not use Attack Rating: it cannot miss. Applicable damage modifiers and the skill's own bonus raise the result from there. None of that is elemental damage belonging to the skill itself, so there is no per-level elemental table for it in the data this site extracts — what the skill does is described under {mechanics}.",
    noProgressionProportional:
      "This skill deals damage as a proportion of the target's current life rather than as a minimum–maximum range, so a level table would say nothing. The difficulty floors and the resistance question are covered under {mechanics}.",
    noProgressionNone: "This skill has no direct damage table. Its effects are described under {mechanics}.",
    backToTree: "← All {class} skills",
  },
  breakpoints: {
    title: "Breakpoints",
    description:
      "Diablo II animations run at 25 frames per second, and speed stats do nothing at all until they cross a threshold that removes a whole frame.",
    includesWarlock: "Includes Warlock tables",
    warningTitle: "104% Faster Cast Rate is worth exactly as much as 63%",
    warningBodyA:
      "Speed stats are not continuous. A Sorceress at 63% Faster Cast Rate casts in 9 frames. At 104% she still casts in 9 frames. At 105% she casts in 8. Every point between 63 and 104 does {nothing}.",
    warningNothing: "nothing",
    warningBodyB:
      "This is why gear planning works backwards from a breakpoint rather than maximising a stat. Once you have hit your target, further Faster Cast Rate is wasted budget that could have been resistances or life.",
    multipleTablesTitle: "Some classes have more than one table",
    multipleTablesBody:
      "The Sorceress's Lightning and Chain Lightning use a slower cast animation with entirely different thresholds — everything else she casts, including Teleport, uses the standard table. The Druid has separate tables for human, Werewolf and Werebear form. Planning gear against the wrong table is a common and expensive mistake.",
    fcrTitle: "Faster Cast Rate",
    fcrDescription:
      "How quickly you cast — and, for a Sorceress, how quickly you Teleport. The single most important stat on most casters.",
    fhrTitle: "Faster Hit Recovery",
    fhrDescription:
      "How long you are stuck in the flinch animation after taking a hit. Being stun-locked kills more characters than raw damage does.",
    fbrTitle: "Faster Block Rate",
    fbrDescription:
      "How quickly you recover from a successful block. Only relevant if you are actually building for block.",
    colRequired: "Required",
    statNeeded: "{stat} needed",
    tableCaption:
      "Frames per animation across the top; the percentage needed to reach each one below.",
    iasTitle: "Increased Attack Speed",
    iasCalloutTitle: "Deliberately not tabulated here",
    iasBodyA:
      "Increased Attack Speed is genuinely more complicated than the other three. The frames you get depend on the {weaponSpeed}, the {skill} you are using, and in some cases the {class} — a single table cannot express it, and every site that publishes one is simplifying to the point of being wrong for most setups.",
    iasWeaponSpeed: "weapon's own base speed",
    iasSkill: "specific attack skill",
    iasClass: "class",
    iasBodyB:
      "Rather than publish a table that would mislead, this page will get proper per-weapon coverage when the underlying data has been verified. Until then, use an attack-speed calculator that takes your specific weapon and skill as inputs.",
  },

  mercenaries: {
    title: "Mercenaries",
    description:
      "A well-geared mercenary is worth more than most of your own gear slots. A badly geared one dies constantly and contributes nothing.",
    hireWarningTitle: "The difficulty you hire in is permanent",
    hireWarningBodyA:
      "A mercenary's aura or skill is fixed by {strong}, and it never changes. They level up with you regardless, so hiring in Hell buys you nothing but a higher price.",
    hireWarningStrong: "the difficulty you hired them in",
    hireWarningBodyB:
      "{strong} That is where the aura selection is best for most builds, and the mercenary catches up to your level within an act or two.",
    hireWarningStrongB: "Hire in Nightmare.",
    whichOne: "Which one?",
    whichOneDescription:
      "For the overwhelming majority of builds the answer is the Act 2 Desert Mercenary, and it is not close.",
    colMercenary: "Mercenary",
    colGivesYou: "Gives you",
    colUses: "Uses",
    colVerdict: "Verdict",
    twoItemsTitle: "The two items that matter most",
    whenToHire: "When to hire",
    aurasAbilities: "Auras and abilities",
    colAbility: "Ability",
    colDifficulty: "Difficulty",
    colEffect: "Effect",
    gear: "Gear",
    keepingAlive: "Keeping them alive",
    bestFor: "Best for:",
    anyDifficulty: "any",
    actBadge: "Act {act}",
    tierBudget: "budget",
    tierMid: "mid",
    tierEndgame: "endgame",
  },

  mechanics: {
    indexTitle: "Game mechanics",
    indexDescription:
      "The systems underneath the guides. Where sources disagree or a value is unconfirmed, these pages say so rather than picking a number and sounding certain.",
    articlesCount: "{count} articles",
    formulasTitle: "Formulas, not vibes",
    formulasBody:
      "Where a mechanic has a formula that changes how you gear, it is written out. Magic Find's diminishing returns curve is the clearest example — knowing that uniques use a factor of 250 tells you immediately why stacking past 300% is a losing trade.",
    alsoReference: "Also reference",
    shortVersion: "The short version",
    related: "Related",
    categoryLoot: "Loot & drops",
    categoryCombat: "Combat",
    categoryDefense: "Defence",
    categoryCharacter: "Character",
    categoryEndgame: "Endgame",
    categoryItems: "Items",
    referenceRunes: "Runes & cube recipes",
    referenceSources: "How we research this",
  },

  sources: {
    title: "Sources & research",
    description:
      "Accuracy matters more than coverage here. This page explains how content gets verified, and records what has not been confirmed yet.",
    verifiedOn: "Verified {date}",
    versionTitle: "The version this site documents",
    colFact: "Fact",
    colValue: "Value",
    factPatch: "Patch",
    factSeason: "Ladder season",
    factSeasonStart: "Season start",
    factExpansion: "Latest expansion",
    factClasses: "Playable classes",
    factClassesValue: "8 — including the Warlock",
    patchValue: "{patch} (client build {build})",
    seasonValue: "Season {season}",
    hierarchyTitle: "Source hierarchy",
    hierarchyLede:
      "Not all sources are equal. Content is verified against the highest tier available for the claim in question.",
    colTier: "Tier",
    colSource: "Source",
    colUsedFor: "Used for",
    tier1Source: "The game's own data files",
    tier1Used:
      "Area levels, monster levels, item base statistics. Extracted from levels.txt and related tables — this is the game itself, not a description of it.",
    tier2Source: "Blizzard official material",
    tier2Used:
      "Patch notes, expansion announcements, The Arreat Summit. Authoritative for what changed and when, though The Arreat Summit predates D2R and needs cross-checking for anything patched since.",
    tier3Source: "Structured community databases",
    tier3Used:
      "D2Runewizard and equivalents, for item statistics and breakpoint tables. Cross-checked against each other and against tier 1 where possible.",
    tier4Source: "Current build guides",
    tier4Used:
      "Maxroll, Icy Veins, DiabloBytes and similar, for build consensus and playstyle. Used for judgement, never as the sole source for a number.",
    mistakesTitle: "Two mistakes this site is built to avoid",
    mistake1Title: "Mixing Classic and Lord of Destruction data",
    mistake1Body:
      "The game's levels.txt holds two parallel sets of monster-level columns — one for Classic Diablo II, one for the Lord of Destruction expansion. D2R uses the Expansion columns. Reading the wrong ones gives Ancient Tunnels a Hell area level of 67 instead of 85, which completely inverts the conclusion about whether the area is worth farming. Every area level here comes from the Expansion columns.",
    mistake2Title: "Assuming Diablo II still has seven classes",
    mistake2Body:
      "The Warlock shipped with Reign of the Warlock in February 2026, the first new class in twenty-five years. Any source listing seven classes predates the expansion — which also means it predates the Terror Zone rework, the Colossal Ancients, Grimoires, the loot filter and the new runewords. Class count is a useful freshness test for any D2 guide you read.",
    disagreementsTitle: "How disagreements are handled",
    disagreementsCalloutTitle: "Documented, not resolved silently",
    disagreementsLede:
      "When reputable sources conflict, the page says so and explains the conflict rather than picking one and sounding confident. Two current examples:",
    disagreement1:
      "{strong} The Diablo Wiki states enemy Lightning Resistance reduces its effect; some build guides state it ignores resistance entirely. The Static Field entry records both positions rather than asserting one.",
    disagreement1Strong: "Static Field and lightning resistance.",
    disagreement2:
      "{strong} Blizzard's own announcement contradicts itself, saying both “all five other statues” and “all five statues”. The {link} quotes both and avoids stating a number.",
    disagreement2Strong: "The Colossal Ancients statue count.",
    disagreement2Link: "Terror Zones page",
    confidenceTitle: "Confidence labels",
    confidenceLede:
      "Content carries a confidence level. Verified is the baseline and is not displayed — surfacing a badge on every verified claim would just train readers to ignore it. Anything below verified is labelled.",
    colLevel: "Level",
    colMeaning: "Meaning",
    colShownInUi: "Shown in UI",
    confVerified: "Verified",
    confVerifiedMeaning:
      "Cross-checked against two or more reputable sources, or trivially established",
    confVerifiedShown: "No — this is the baseline",
    confSingle: "Single source",
    confSingleMeaning: "One reputable source, not contradicted anywhere",
    confCommunity: "Community consensus",
    confCommunityMeaning: "Widely agreed among players, no authoritative confirmation",
    confUnverified: "Unverified",
    confUnverifiedMeaning: "Believed correct but not confirmed",
    shownYes: "Yes",
    shownYesProminently: "Yes, prominently",
    gapsTitle: "Known gaps",
    gapsLede:
      "Recorded so nothing gets written on unverified ground. These are tracked in {file} in the repository.",
    gap1: "Warlock skill tables — names, unlock levels, synergies and numeric values.",
    gap2: "Madawc's two unique jewels from the Colossal Ancients.",
    gap3: "The exact statue count for the Colossal Ancients recipe.",
    gap4: "What Latent Sunder Charms do, and how they differ from the original Sunder Charms.",
    gap5: "What Worldstone Shards are used for.",
    gap6: "Stat lines for the expansion runewords: Authority, Coven, Void, Vigilence and Ritual.",
    gap7: "The complete Terror Zone rotation group list.",
    gap8: "Increased Attack Speed tables, which depend on weapon base speed and specific skill.",
    originalTitle: "On original writing",
    originalBody:
      "Sources are researched, reconciled and then written from scratch. Nothing here is copied from another guide. Where a specific number comes from a specific place — a rune modifier from The Arreat Summit, an area level from the game files — the page names the source so a reader can check it themselves.",
    languageTitle: "On language",
    languageBody:
      "This site is written in English and translated into Brazilian Portuguese. Item, skill, runeword and area names are kept in English in both versions, because that is what the community, trade channels and every major database use — and because the official Portuguese in-game strings have not been verified against a primary source. Inventing translations for them would break the project's own accuracy rule.",
  },

  common: {
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    outOfFive: "{value} out of 5",
    notDocumented: "Not yet documented",
    or: "or",
  },

  ratings: {
    poor: "Poor",
    weak: "Weak",
    average: "Average",
    good: "Good",
    excellent: "Excellent",
  },

  tiers: {
    starterLabel: "Starter",
    starterShort: "Start",
    starterQuestion: "I just made this character. What do I wear?",
    starterContext: "Normal difficulty, levels 1-30. Everything here is free or nearly free.",
    nightmareLabel: "Nightmare",
    nightmareShort: "NM",
    nightmareQuestion: "I'm in Nightmare and things are getting harder.",
    nightmareContext: "Levels 30-60. Resistances start to matter more than damage.",
    earlyHellLabel: "Early Hell",
    earlyHellShort: "Hell",
    earlyHellQuestion: "I've reached Hell and I'm dying. What now?",
    earlyHellContext: "Levels 60-75. The hardest transition in the game.",
    budgetLabel: "Budget",
    budgetShort: "Budget",
    budgetQuestion: "I can farm Hell. What's my next real upgrade?",
    budgetContext: "Levels 75-85. A complete, self-found setup that works everywhere.",
    optimizedLabel: "Optimized",
    optimizedShort: "Optimized",
    optimizedQuestion: "I have good gear. How do I make it great?",
    optimizedContext: "Levels 85+. Strong items, mostly obtainable solo with patience.",
    bisLabel: "Best in Slot",
    bisShort: "BiS",
    bisQuestion: "What does the finished character look like?",
    bisContext: "The ceiling. Expect trading, perfect rolls, and high runes.",
  },

  difficulty: {
    normal: "Normal",
    nightmare: "Nightmare",
    hell: "Hell",
  },

  skillKinds: {
    attack: "Attack",
    spell: "Spell",
    passive: "Passive",
    aura: "Aura",
    summon: "Summon",
    curse: "Curse",
    buff: "Buff",
    shapeshift: "Shapeshift",
  },
  elements: {
    physical: "Physical",
    magic: "Magic",
    fire: "Fire",
    cold: "Cold",
    lightning: "Lightning",
    poison: "Poison",
  },

  budget: {
    low: "Low budget",
    medium: "Medium budget",
    high: "High budget",
    extreme: "Extreme budget",
  },

  playDifficulty: {
    beginner: "Beginner friendly",
    moderate: "Moderate",
    advanced: "Advanced",
    expert: "Expert",
  },

  release: {
    classic: "Diablo II",
    lod: "Lord of Destruction",
    d2r: "Resurrected",
    reignOfTheWarlock: "Reign of the Warlock",
  },

  confidence: {
    single: "Single source",
    community: "Community consensus",
    unverified: "Unverified",
  },

  gearSlots: {
    helm: "Helm",
    amulet: "Amulet",
    weapon: "Weapon",
    offhand: "Off-hand",
    body: "Body Armor",
    gloves: "Gloves",
    belt: "Belt",
    boots: "Boots",
    ring1: "Ring",
    ring2: "Ring",
  },

  actionKinds: {
    skill: "Skill",
    stat: "Stats",
    gear: "Gear",
    runeword: "Runeword",
    quest: "Quest",
    shop: "Shop",
    gamble: "Gamble",
    mercenary: "Mercenary",
    respec: "Respec",
    farm: "Farm",
    transition: "Difficulty",
    warning: "Warning",
    tip: "Tip",
  },
} as const;

/**
 * Widens the literal string types produced by `as const` back to `string`,
 * while preserving the exact key structure.
 *
 * Without this, `Dictionary` would demand that pt-BR contain the *English
 * text*, which is obviously wrong. With it, pt-BR must contain exactly the same
 * keys — no more, no fewer — with any string values. Adding a key here and
 * forgetting it in pt-BR fails `tsc`.
 */
type Widen<T> = T extends string
  ? string
  : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof enUS>;
