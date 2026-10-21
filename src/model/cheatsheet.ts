// GM cheat sheet: the rules a GM looks up at the table, condensed from the core rulebook
// (The Witcher TRPG v1.35, third printing, which already includes the core errata v4).
// Every entry carries its page so the GM can check it against the book. `reading` marks where the
// line is our interpretation rather than the book's words; the UI shows it as unverified.
// This file is reference text only: nothing in the app's rules code reads it.

export interface CheatTable {
  cols: string[]
  rows: string[][]
}

export interface CheatItem {
  head: string
  lines: string[]
}

export interface CheatEntry {
  title: string
  page: string
  lines?: string[]
  table?: CheatTable
  items?: CheatItem[]
  // Our own reading where the book is silent or ambiguous. Shown as "Unverified".
  reading?: string
  // Where the errata changed this rule. The v1.35 text already reads the corrected way.
  errata?: string
}

export interface CheatTopic {
  id: string
  title: string
  blurb: string
  entries: CheatEntry[]
}

const combat: CheatTopic = {
  id: 'combat',
  title: 'Combat',
  blurb: 'Rounds, actions, attacks, defenses, damage, effects',
  entries: [
    {
      title: 'Round order and initiative',
      page: 'p. 151, 153-154',
      lines: [
        'A round is about 3 seconds. Everyone acts once, highest initiative first.',
        'Initiative = REF + 1d10, kept for the whole fight.',
        'Tied players roll again: they keep the first number but go in order of the second roll.',
        'Party initiative (optional): one leader rolls 1d10 and each player adds it to their own REF. Works for enemy groups too.',
        'Fast Draw: declare at round start for +3 initiative that round, but −3 to the attack, you must attack and cannot aim. Draw included.',
        'Holding: you can act later, before or after anyone below you. Held to the end of the round, use it or lose it; it never carries over.',
      ],
    },
    {
      title: 'Ambush',
      page: 'p. 153, 164',
      lines: [
        'Only the side that starts the fight can ambush. Stealth beats the target’s Awareness to stay unnoticed.',
        '+5 to attacks against anyone unaware of you, for the first round.',
        'Unaware targets still get to defend.',
        'The ambush attack sits outside initiative. Afterwards everyone rolls initiative.',
      ],
    },
    {
      title: 'Your turn',
      page: 'p. 151, 164',
      lines: [
        'Move up to SPD in metres plus one action.',
        'Actions: attack, start Verbal Combat, cast magic, use a skill, pick up or draw an item.',
        'Talking is free, except during Verbal Combat.',
        'Changing facing during movement is free.',
      ],
      table: {
        cols: ['Full-round action', 'Effect'],
        rows: [
          ['Run', 'Move up to SPD × 3 m'],
          ['Actively dodge', '−2 to every melee attack on you this round'],
          ['Aim', '+1 to the ranged attack per round, up to +3'],
          ['Recover', 'Regain STA equal to REC'],
        ],
      },
      errata: 'Errata p. 151 split Actions from Full Round Actions.',
    },
    {
      title: 'Extra actions and extra defenses',
      page: 'p. 151',
      lines: [
        'Extra action: spend 3 STA to take one more action at −3, any time on your turn.',
        'Forced into more than one defense in a round (block, reposition…): each one costs 1 STA.',
        'If you spent your action actively dodging, defending costs no STA.',
        'Defending is still allowed after a full-round action, for example after running (p. 164).',
      ],
      reading: 'The book doesn’t say whether the first defense of the round is free once you make a second. The usual reading is that the first is free and each one after it costs 1 STA.',
      errata: 'Errata p. 151 replaced the old Extra Attacks & Defense sidebar.',
    },
    {
      title: 'Attack rolls',
      page: 'p. 57, 163-164, 166',
      lines: [
        'Melee: REF + weapon skill + modifiers + 1d10.',
        'Ranged: DEX + weapon skill + range modifier + 1d10, and it must be higher than the defense.',
        'Magic: WILL + Spell Casting + 1d10.',
        'On any opposed roll a tie goes to the defender.',
        'Unaware or inanimate target: beat the range DC below, adjusted for size.',
        'A skill you don’t have: roll the stat alone (p. 57).',
      ],
      errata: 'Errata p. 164: a ranged attack must beat the defense, not just equal it.',
    },
    {
      title: 'Fast and strong strikes',
      page: 'p. 153, 163',
      lines: [
        'Fast strike: two attacks, no penalty. They can hit two targets if both are in range.',
        'Strong strike: one attack at −3, double damage.',
        'Bows fire once even on a fast strike. A strong strike with a bow is a full draw for double damage.',
        'Crossbows: no fast or strong strikes, and reloading takes 1 action (p. 164).',
        'Dual wielding: a Joint Attack replaces a fast or strong strike. Roll two attacks, both at −3. Blocking or parrying both takes two weapons, or a weapon and a shield.',
        'Monsters and mooks use ROF (attacks per round per weapon) and can’t make fast or strong strikes.',
      ],
    },
    {
      title: 'Defenses',
      page: 'p. 164',
      lines: [
        'Dodge: Dodge/Escape against the attack roll.',
        'Reposition: Athletics against the attack. On a win you also move up to half your SPD.',
        'Block: weapon skill, or Melee with a shield. Only shields block ranged attacks. The blocking item takes 1 damage.',
        'Block with your arm: Brawling. You take the hit on that arm, minus armor.',
        'Parry: −3 to the block roll. It negates the hit without damaging your weapon and staggers the attacker. You can’t parry bows or crossbows; thrown weapons at −5.',
        'All of these work against ranged attacks too, except where noted.',
      ],
    },
    {
      title: 'Ganging up',
      page: 'p. 153',
      lines: [
        '−1 to defense for every melee attacker past the first (adjacent, or within 2 m with a reach weapon).',
        'Four nekkers around you means −3 to your defense.',
      ],
      errata: 'Errata p. 153 added Ganging Up.',
    },
    {
      title: 'Attack modifiers',
      page: 'p. 151-152, 163, 165',
      table: {
        cols: ['Situation', 'Mod'],
        rows: [
          ['Target pinned', '+4'],
          ['Target actively dodging', '−2'],
          ['Moving target with REF over 10', '−3'],
          ['Fast draw', '−3'],
          ['Ambush', '+5'],
          ['Ricochet shot', '−5'],
          ['Blinded by light or dust', '−3'],
          ['Target silhouetted', '+2'],
          ['Aiming, per round', '+1'],
          ['Target outside your vision cone (no aiming)', '−3'],
          ['Attacker outside your vision cone', '+3 to them'],
          ['Prone, attack and defense, until you stand', '−2'],
          ['Darkness, attack and defense (Awareness −4)', '−2'],
          ['Glaring light facing the sun, attack and defense (Awareness −3)', '−3'],
        ],
      },
      lines: ['Dim light: −2 Awareness only.'],
    },
    {
      title: 'Range and target DC',
      page: 'p. 152, 164',
      table: {
        cols: ['Range', 'Distance', 'DC', 'Mod'],
        rows: [
          ['Point blank', '≤ ½ m or touching', '10', '+5'],
          ['Close', '¼ listed range', '15', '+0'],
          ['Medium', '½ listed range', '20', '−2'],
          ['Long', 'Listed range', '25', '−4'],
          ['Extreme', '2× listed range', '30', '−6'],
        ],
      },
      lines: ['Target size: small (cat, nekker) +2, medium 0, large (troll, horse) −2, huge (fiend) −4.'],
    },
    {
      title: 'Hit location',
      page: 'p. 152-154',
      lines: ['Roll 1d10, or aim and take the penalty. Multiply the damage that gets past armor by the location’s multiplier.'],
      items: [
        { head: 'Humanoid', lines: ['1 Head −6 ×3', '2-4 Torso −1 ×1', '5 R. arm −3 ×½ · 6 L. arm −3 ×½', '7-8 R. leg −2 ×½ · 9-10 L. leg −2 ×½'] },
        { head: 'Monster', lines: ['1 Head −6 ×3', '2-5 Torso −1 ×1', '6-7 R. limb −3 ×½ · 8-9 L. limb −3 ×½', '10 Tail or wing −2 ×½'] },
      ],
      errata: 'Errata p. 152: monster torso 2-5, right limb 6-7, Special renamed Tail or Wing.',
    },
    {
      title: 'Working out damage',
      page: 'p. 153-155, 161-162',
      lines: [
        '1. Roll damage (doubled on a strong strike).',
        '2. Behind cover, the hit must beat the cover’s SP first. The rest carries on.',
        '3. Subtract the SP at that location.',
        '4. Multiply what gets through by the location multiplier.',
        '5. Resistant: halve, after armor. Susceptible: double.',
        '6. If it got through and did damage, that armor loses 1 SP. At 0 SP it’s broken.',
        'Armor piercing ignores damage resistance. Improved AP also halves the SP.',
        'Bombs and explosive traps hit every location; roll damage for each one.',
      ],
      reading: 'The book doesn’t give the order of the location multiplier and the resistance halving. Both come after armor, so the result is the same either way, apart from rounding.',
      errata: 'Errata p. 154: resistance halves damage after armor, not before.',
    },
    {
      title: 'Monsters and silver',
      page: 'p. 161-162',
      lines: [
        'Every monster except beasts resists non-silver weapons (half damage).',
        'All monsters are susceptible to silver. A silver weapon adds its listed silver damage; a silver object that isn’t a weapon adds 1d6.',
        'Silver lodged in a monster hurts it like poison until it takes an action to pull it out.',
        'Fire is not halved by the non-silver resistance.',
        'Resistant to an effect: half damage from it and +2 to resist it. Immune: it does nothing.',
        'Susceptible: double damage. Non-damage spells of that type get −2 to resist and last twice as long.',
      ],
      errata: 'Errata p. 162 added the beast exception and the Fire Damage sidebar.',
    },
    {
      title: 'Lethal, non-lethal and wound threshold',
      page: 'p. 153, 156',
      lines: [
        'Lethal damage that reaches your HP puts you in Death State (see Saves).',
        'Non-lethal damage equal to your current STA knocks you out. You count as stunned until you recover 20 STA with Recover actions and pass a Stun save.',
        'Below your wound threshold: halve REF, DEX, INT and WILL.',
        'Wound threshold = max HP ÷ 5 (15 HP → 3, 40 → 8, 70 → 14).',
        'Brawling and pommel strikes do non-lethal damage.',
      ],
      errata: 'Errata p. 153 rewrote the Damage section.',
    },
    {
      title: 'Cover and human shields',
      page: 'p. 152, 155',
      table: {
        cols: ['Cover', 'SP'],
        rows: [
          ['Stone wall, large tree', '30'],
          ['Brick wall', '25'],
          ['Steel door', '20'],
          ['Heavy wooden door', '15'],
          ['Wooden wall, cart, barrel', '10'],
          ['Thatch roof, brambles', '7'],
          ['Tent', '5'],
        ],
      },
      lines: [
        'Human shield: Brawling or Physique against their Physique or Dodge/Escape. If you’re already grappling or pinning them, no roll is needed.',
        'Shooting through a shield: the hit must beat the shield’s BODY + armor; whatever is left hits your torso.',
      ],
    },
    {
      title: 'Brawling and special attacks',
      page: 'p. 163',
      lines: [
        'Punch and kick: non-lethal damage, and you can make fast or strong strikes with them.',
        'Grapple: target can’t move away, −2 to physical actions; Dodge/Escape vs your Brawling to slip free each turn. Needed for pin, choke and throw.',
        'Pin: the target can’t move or act until they escape.',
        'Choke: the target is suffocating. Throw: prone, Punch damage, Stun save at −1.',
        'Trip: prone. Push kick: back BODY÷3 m, half damage, always to the torso.',
        'Disarm: weapon flies 1d6 m (bare-handed: 1d6÷2 m, or grab it at −3).',
        'Charge: full round, move up to Run, then a strong strike at −3. If it’s blocked, Physique vs Physique to knock them prone.',
        'Pommel strike: half damage, non-lethal.',
        'Feint: Deceit in place of the first fast strike. If they fail Awareness against it, your second attack is +3.',
        'Shield bash: Melee, lethal Punch damage (medium shield 2 rows up, heavy 4 rows up, p. 164).',
        'Prone: −2 to attack and defense until you use your move to stand.',
      ],
      errata: 'Errata p. 163: a Joint Attack replaces a fast or strong strike.',
    },
    {
      title: 'Criticals and fumbles on the die',
      page: 'p. 57, 156-157',
      lines: [
        'Natural 10: roll again and add it. Keep going while you roll 10s.',
        'Natural 1: roll again and subtract it from your base (never below 0). A 10 on that roll keeps going down.',
        'In combat, look up the subtracted amount on the fumble table:',
      ],
      items: [
        { head: 'Melee attack', lines: ['6 staggered · 7 weapon stuck for 1 round · 8 weapon −1d10 reliability', '9 you wound yourself · >9 you hit a nearby ally'] },
        { head: 'Armed defense', lines: ['6 −1d6 reliability · 7 weapon flies 1d6 m · 8 prone + Stun save', '9 −2d6 reliability · >9 your own weapon hits you'] },
        { head: 'Ranged attack', lines: ['6-7 ammo breaks · 8-9 string, jam or drop, 1 round to fix', '>9 ricochet hits an ally'] },
        { head: 'Unarmed attack or defense', lines: ['6 staggered · 7 prone · 8 prone + Stun save', '9 prone, 1d6 non-lethal to the head + Stun save · >9 prone, 1d6 lethal to the head + Stun save'] },
      ],
      errata: 'Errata p. 157 corrected the row labels and the unarmed rows.',
    },
    {
      title: 'Effects',
      page: 'p. 161',
      lines: ['You can’t have the same effect twice at once.'],
      items: [
        { head: 'Fire', lines: ['5 damage to every location per turn, armor soaks it, and armor and weapons lose 1 per turn.', 'Spend a turn on water or stop, drop and roll to put it out.'] },
        { head: 'Stun', lines: ['No actions, and attackers only need to beat DC 10.', 'A Stun save ends it and takes the whole turn. Getting hit ends it at once.'] },
        { head: 'Poison', lines: ['3 damage per turn, armor doesn’t help. DC 15 Endurance (1 action) ends it.'] },
        { head: 'Bleed', lines: ['2 damage per turn. DC 15 First Aid (1 action) or a Healing spell stops it.'] },
        { head: 'Freeze', lines: ['−3 SPD and −1 REF. DC 16 Physique (1 action) breaks free.'] },
        { head: 'Staggered', lines: ['−2 to attack and defense until the start of your next turn.'] },
        { head: 'Blinded', lines: ['−3 to attack and defense, −5 sight Awareness, until you spend a turn clearing your eyes.'] },
        { head: 'Suffocation', lines: ['3 damage per round, armor doesn’t help, until the air comes back.'] },
        { head: 'Intoxication', lines: ['−2 REF, DEX and INT, −3 Verbal Combat, 25% chance of a blackout.'] },
        { head: 'Nausea', lines: ['Every 3 rounds roll under BODY or lose the round heaving.'] },
        { head: 'Hallucination', lines: ['DC 15 Deduction to see through each false image.'] },
      ],
      errata: 'Errata p. 161 updated the Effects text and Staggered.',
    },
  ],
}

const social: CheatTopic = {
  id: 'social',
  title: 'Social combat',
  blurb: 'Verbal Combat, Resolve, attacks, defenses, tools',
  entries: [
    {
      title: 'Plain social checks',
      page: 'p. 57-58',
      lines: [
        'Most persuasion is a single opposed roll: STAT + skill + 1d10 each, higher wins, ties go to the defender.',
        'Against a set DC: Easy 10, Average 14, Challenging 18, Difficult 20, Nearly impossible 30. You must roll above it.',
        'Some abilities roll against a stat × 3 (for example WILL × 3).',
        'Modifiers raise the DC: distracting place +3, under attack +5, drunk +3, sleep-deprived +3, hostile surroundings +4.',
      ],
    },
    {
      title: 'Starting Verbal Combat',
      page: 'p. 151, 175-176',
      lines: [
        'Verbal Combat is an optional rule. It’s for arguments that deserve a fight.',
        'Starting it takes an action. Each side says what it wants out of the argument.',
        'Resolve = ((WILL + INT) ÷ 2) × 5. It works like HP for the argument.',
        'Run it in rounds like a fight. Talking counts as an action here.',
      ],
    },
    {
      title: 'How an exchange resolves',
      page: 'p. 176',
      lines: [
        'The attacker rolls a verbal attack and the target rolls a verbal defense.',
        'Whoever rolls higher deals their damage to the other’s Resolve.',
        'A defender who wins damages the attacker.',
        'Whoever hits 0 Resolve first loses, and is convinced of what the other side argued.',
        'Any number can join in. You can aim an attack at one opponent or at all of them, and each of them defends.',
        'Tools take a full turn instead of an attack.',
      ],
    },
    {
      title: 'Empathetic attacks',
      page: 'p. 176',
      items: [
        { head: 'Seduce · Seduction · 1d6+EMP', lines: ['Target takes a cumulative +2 from each Seduction this combat.'] },
        { head: 'Persuade · Persuasion · 1d6÷2+EMP', lines: ['End on a successful Persuasion and they agree with you.'] },
        { head: 'Appeal · Leadership · 1d10+EMP', lines: ['Cumulative +1 damage from your empathetic attacks for each Appeal that lands.'] },
        { head: 'Befriend · Charisma · 1d6+EMP', lines: ['End on a successful Befriend and they become a friend. The first time makes an Acquaintance, the second a good friend, the third a “blood-brother”.'] },
      ],
    },
    {
      title: 'Antagonistic attacks',
      page: 'p. 176',
      lines: ['These are stronger, but the loser tends to avoid you or turn against you afterwards.'],
      items: [
        { head: 'Deceive · Deceit · 1d6+INT', lines: ['End on a successful Deceit and they believe the lie.'] },
        { head: 'Ridicule · Social Etiquette · 1d6+WILL', lines: ['Done in public, each success costs them 2 Reputation with the onlookers for a day.'] },
        { head: 'Intimidate · Intimidation · 1d10+WILL', lines: ['They fear you. Cumulative +4 from Intimidation this combat.'] },
      ],
    },
    {
      title: 'Defenses',
      page: 'p. 177',
      items: [
        { head: 'Ignore · Resist Coercion · 1d10+EMP', lines: ['No extra effect.'] },
        { head: 'Counterargue · the attack’s skill', lines: ['Attack instead of defending. Beat their roll and their attack is cancelled while yours lands.'] },
        { head: 'Change the Subject · Persuasion · 1d6+INT', lines: ['No extra effect.'] },
        { head: 'Disengage · Resist Coercion · no damage', lines: ['Ends the argument.'] },
      ],
    },
    {
      title: 'Tools (full turn)',
      page: 'p. 177',
      items: [
        { head: 'Romance · Charisma', lines: ['They fall for you: −3 against you while it lasts. If it ends badly, they get a permanent +3 against your empathetic attacks.'] },
        { head: 'Study · Human Perception vs INT × 3', lines: ['+2 to your Verbal Combat for one round.'] },
        { head: 'Imply · Persuasion or Deceit', lines: ['−4 to their defenses. Once per combat.'] },
        { head: 'Bribe · Gambling', lines: ['+1 to empathetic rolls for the rest of the fight for every 50 crowns offered, if the Gambling roll succeeds.'] },
      ],
      reading: 'The extracted text doesn’t make clear which tools are listed as empathetic and which as antagonistic. Check p. 177 if that matters at your table.',
    },
    {
      title: 'Torture and modifiers',
      page: 'p. 177',
      lines: [
        'Harming a target at your mercy: −3 to empathetic attacks, +3 to Intimidation.',
        'Bringing them to their wound threshold: −10 empathetic, +10 Intimidation.',
        'Situational modifiers are up to the GM: mild 1, moderate 3, major 5.',
        'Wounds matter too: a cracked jaw, lost teeth or a disfiguring scar give penalties to Verbal Combat (see Criticals).',
      ],
      errata: 'Errata p. 177 added the Modifiers in Verbal Combat sidebar.',
    },
  ],
}

const saves: CheatTopic = {
  id: 'saves',
  title: 'Saves',
  blurb: 'Stun and Death saves, stabilizing, resisting, Luck',
  entries: [
    {
      title: 'Stun save',
      page: 'p. 47-48, 161',
      lines: [
        'Roll 1d10 under your Stun score, or be stunned.',
        'Stun = (BODY + WILL) ÷ 2, rounded down, maximum 10.',
        'Stunned: no actions, attackers only need to beat DC 10. Trying to shake it off takes your whole turn. Any hit snaps you out.',
      ],
      reading: 'The book says “roll under”. The app treats rolling your Stun exactly as a failure.',
      errata: 'Errata p. 47-48: Stun is rolled under, and the Physical table’s Stun column was divided by 10.',
    },
    {
      title: 'When to call for a Stun save',
      page: 'see each page',
      lines: [
        'Every critical wound you take (p. 158).',
        'To wake from being out of STA or knocked out, after recovering 20 STA (p. 153, 166).',
        'Being thrown: Stun save at −1 (p. 163).',
        'Fumbles: armed defense 8, unarmed 8, 9 and >9 (p. 157).',
        'Concussion: every 1d6 rounds. Ruptured spleen: every 5 rounds, every 10 once stabilized (p. 159).',
        'Dimeritium contact, on a result of 10-11: every round (p. 167).',
        'Plus whatever a monster ability or spell says.',
      ],
    },
    {
      title: 'Death State and Death saves',
      page: 'p. 162',
      lines: [
        'Below 0 HP you’re in Death State: every stat, primary and derived, drops to a third.',
        'At once, roll a Death save against your unmodified Stun. Fail and you die, beyond any magic.',
        'Every round after: another save at a cumulative −1.',
        'Every time you’re hurt in Death State: another save at a further −1.',
        'Heart Damage (Deadly critical) calls for an immediate Death save (p. 160).',
      ],
      reading: 'p. 153 says Death State starts when lethal damage equals your HP, which is 0. p. 162 says below 0. We treat 0 HP as Death State, the same as the app.',
      errata: 'Errata p. 162: stats both primary and derived, and the save is against the unmodified Stun.',
    },
    {
      title: 'Stabilizing the dying',
      page: 'p. 162',
      lines: [
        'First Aid against a DC equal to how far below 0 HP they are.',
        'Success: they go back to 1 HP and leave Death State. Failure: they keep dying.',
        'Healing yourself is allowed, but harder because of your wound threshold penalties.',
      ],
    },
    {
      title: 'Luck',
      page: 'p. 47',
      lines: [
        'Add Luck points to any skill roll, a defense, or a Death save: +1 per point.',
        'Choose how many before you roll.',
        'On a Death save, Luck raises the number you must roll under.',
        'The pool refills each session.',
      ],
      errata: 'Errata p. 47 rewrote Luck and added Cheating Death.',
    },
    {
      title: 'Resisting magic and pressure',
      page: 'p. 56-57, 99, 161',
      lines: [
        'Resist Magic (WILL): against spells whose Defense says Resist Magic.',
        'Resist Coercion (WILL): against intimidation and pressure, and the Ignore and Disengage defenses in Verbal Combat.',
        'STAT × 3: some magic and abilities must beat the target’s stat × 3, so the target doesn’t roll.',
        'Resistant to an effect: +2 to resist it. Susceptible: −2.',
      ],
    },
    {
      title: 'Other common checks',
      page: 'p. 161, 173',
      table: {
        cols: ['Against', 'Check'],
        rows: [
          ['Poison', 'DC 15 Endurance, 1 action'],
          ['Bleeding', 'DC 15 First Aid, 1 action'],
          ['Freeze', 'DC 16 Physique, 1 action'],
          ['Nausea', 'Roll under BODY every 3 rounds'],
          ['Hallucination', 'DC 15 Deduction for each image'],
          ['Non-witcher drinks Swallow', 'DC 18 Endurance or poisoned'],
          ['Start natural healing', 'DC 14 First Aid or Healing Hands'],
        ],
      },
    },
  ],
}

const W = (roll: string, name: string, effect: string, stabilized: string, treated: string): CheatItem => ({
  head: `${roll} · ${name}`,
  lines: [effect, `Stabilized: ${stabilized}`, `Treated: ${treated}`],
})

const criticals: CheatTopic = {
  id: 'criticals',
  title: 'Criticals',
  blurb: 'Critical wounds by severity, effects, stabilizing, healing',
  entries: [
    {
      title: 'Scoring a critical wound',
      page: 'p. 152, 158',
      table: {
        cols: ['Beat defense by', 'Level', 'Bonus dmg'],
        rows: [
          ['7+', 'Simple', '+3'],
          ['10+', 'Complex', '+5'],
          ['13+', 'Difficult', '+8'],
          ['15+', 'Deadly', '+10'],
        ],
      },
      lines: [
        'Armor doesn’t stop the bonus damage.',
        'Every critical wound forces a Stun save.',
        'Roll 2d6 on that level’s table. The roll also gives the location: 12 head (worse), 11 head, 9-10 torso (worse), 6-8 torso, 4-5 arm, 2-3 leg.',
        'Aimed shot: no roll, use that location’s wound. For the head or torso roll 1d6: 1-4 the lesser wound, 5-6 the greater.',
        'Spells that hit with physical force (a rock, ice, a blast of air) can crit like weapons (p. 166).',
      ],
      reading: 'The location for each 2d6 roll is read from the table layout and the Aimed Criticals sidebar.',
      errata: 'Errata p. 158: bonus damage ignores armor, and the Aimed Criticals sidebar was added.',
    },
    {
      title: 'Simple',
      page: 'p. 158',
      items: [
        W('12', 'Cracked Jaw', '−2 to magic skills and Verbal Combat.', '−1 to magic skills and Verbal Combat.', '−1 to magic skills.'),
        W('11', 'Disfiguring Scar', '−3 to empathic Verbal Combat.', '−1 to empathic Verbal Combat.', '−1 Seduction.'),
        W('9-10', 'Cracked Ribs', '−2 BODY (HP unchanged).', '−1 BODY.', '−10 Encumbrance.'),
        W('6-8', 'Foreign Object', 'Recovery and critical healing quartered.', 'Recovery and critical healing halved.', '−2 Recovery, −1 critical healing.'),
        W('4-5', 'Sprained Arm', '−2 to actions with that arm.', '−1 with that arm.', '−1 Physique.'),
        W('2-3', 'Sprained Leg', '−2 SPD, Dodge/Escape and Athletics.', '−1 SPD, Dodge/Escape and Athletics.', '−1 SPD.'),
      ],
    },
    {
      title: 'Complex',
      page: 'p. 159',
      items: [
        W('12', 'Minor Head Wound', '−1 INT, WILL and Stun.', '−1 INT and WILL.', '−1 WILL.'),
        W('11', 'Lost Teeth', '1d10 teeth gone. −3 to magic skills and Verbal Combat.', '−2 to magic skills and Verbal Combat.', '−1 to magic skills and Verbal Combat.'),
        W('9-10', 'Ruptured Spleen', 'Stun save every 5 rounds. Bleeding.', 'Stun save every 10 rounds.', '−2 Stun.'),
        W('6-8', 'Broken Ribs', '−2 BODY, −1 REF and DEX.', '−1 BODY and REF.', '−1 BODY.'),
        W('4-5', 'Fractured Arm', '−3 to actions with that arm.', '−2 with that arm.', '−1 with that arm.'),
        W('2-3', 'Fractured Leg', '−3 SPD, Dodge/Escape and Athletics.', '−2 to those.', '−1 to those.'),
      ],
      reading: 'In the extracted text the Complex and Difficult tables come out with their headings swapped. These are sorted by wound name.',
    },
    {
      title: 'Difficult',
      page: 'p. 159-160',
      items: [
        W('12', 'Skull Fracture', '−1 INT and DEX, quadruple damage from head hits. Bleeding.', '−1 INT and DEX, quadruple head damage.', 'Quadruple head damage.'),
        W('11', 'Concussion', 'Stun save every 1d6 rounds, −2 INT, REF and DEX.', '−1 INT, REF and DEX.', '−1 INT and DEX.'),
        W('9-10', 'Torn Stomach', '−2 to all actions, 4 acid damage per round.', '−2 to all actions.', '−1 to all actions.'),
        W('6-8', 'Sucking Chest Wound', '−3 BODY and SPD, and suffocating.', '−2 BODY and SPD.', '−1 BODY and SPD.'),
        W('4-5', 'Compound Arm Fracture', 'Arm useless, bleeding.', 'Arm useless.', 'Arm in a sling, but it can hold things.'),
        W('2-3', 'Compound Leg Fracture', 'SPD, Dodge/Escape and Athletics quartered. Bleeding.', 'Those halved.', '−2 to those.'),
      ],
    },
    {
      title: 'Deadly',
      page: 'p. 160',
      items: [
        W('12', 'Separated Spine / Decapitated', 'Dead.', 'Can’t be stabilized.', 'Can’t be treated.'),
        W('11', 'Damaged Eye', '−5 sight Awareness, −4 DEX. Bleeding.', '−3 sight Awareness, −2 DEX.', 'Permanent −1 sight Awareness and DEX.'),
        W('9-10', 'Heart Damage', 'Immediate Death save. If you live: bleeding, and STA, SPD and BODY quartered.', 'STA, SPD and BODY halved.', 'Bleeding does +2 per round to you, for good.'),
        W('6-8', 'Septic Shock', 'STA quartered, −3 INT, WILL, REF and DEX. Poisoned.', 'STA halved, −1 INT, WILL, REF and DEX.', 'Permanent −5 STA.'),
        W('4-5', 'Dismembered Arm', 'Arm gone, bleeding.', 'Arm useless.', 'Can be replaced with a prosthetic.'),
        W('2-3', 'Dismembered Leg', 'SPD, Dodge/Escape and Athletics quartered. Bleeding.', 'Those still quartered.', 'Can be replaced with a prosthetic.'),
      ],
      errata: 'Errata p. 160 changed Heart Damage’s treated effect.',
    },
    {
      title: 'Monsters without anatomy',
      page: 'p. 159',
      lines: [
        'Elementa and specters ignore Foreign Object, Ruptured Spleen, Torn Stomach, Sucking Chest Wound and Septic Shock.',
        'Those rolls deal bonus damage instead: Simple +5, Complex +10, Difficult +15, Deadly +20.',
        'Specters have no legs: re-roll leg hits.',
      ],
    },
    {
      title: 'Stabilizing a critical wound',
      page: 'p. 158, 162',
      lines: [
        'One First Aid check: Simple DC 12, Complex 14, Difficult 16, Deadly 18.',
        'The wound drops to its Stabilized effect and stops getting worse, but it isn’t healing yet.',
        'Healing only starts once someone uses Healing Hands or healing spells on it.',
      ],
    },
    {
      title: 'Treating a critical wound',
      page: 'p. 173-174',
      table: {
        cols: ['Level', 'Doctor: rounds, then Healing Hands DC', 'Mage: Healing spell casts, each beating DC'],
        rows: [
          ['Simple', '2 rounds, DC 12', '4 casts, DC 14'],
          ['Complex', '4 rounds, DC 14', '6 casts, DC 16'],
          ['Difficult', '6 rounds, DC 16', '8 casts, DC 18'],
          ['Deadly', '8 rounds, DC 18', '10 casts, DC 20'],
        ],
      },
      lines: [
        'Healing spells used on a critical wound don’t restore HP.',
        'Once treated, the Treated penalty lasts a number of days set by BODY:',
        'BODY 3: 5 / 9 / 12 days (Simple / Complex / Difficult). BODY 5: 3 / 7 / 10. BODY 7: 1 / 5 / 8. BODY 10: 1 / 2 / 5. BODY 13: 1 / 1 / 2.',
        'Deadly has no healing time, so its Treated effect stays.',
      ],
      reading: 'The last line is our reading. The errata removed the Deadly column without saying what replaces it.',
      errata: 'Errata p. 173-174 rewrote Healing Critical Wounds and removed the Deadly column from the Critical Healing table.',
    },
    {
      title: 'Healing HP',
      page: 'p. 48, 173',
      lines: [
        'Healing starts after a DC 14 First Aid or Healing Hands check.',
        'Then you regain REC HP per day of rest, or half that if you don’t rest. Healing Hands adds 3 HP a day.',
        'Ritual of Life heals at once. Swallow heals, but a non-witcher must pass DC 18 Endurance or be poisoned.',
      ],
      errata: 'Errata p. 173: starting to heal needs a DC 14 check.',
    },
  ],
}

const magic: CheatTopic = {
  id: 'magic',
  title: 'Magic',
  blurb: 'Casting, Stamina cost, Vigor, overexertion, fumbles',
  entries: [
    {
      title: 'Casting a spell',
      page: 'p. 99, 166, 168',
      lines: [
        'Roll WILL + Spell Casting + 1d10. Signs and invocations work the same way.',
        'Casting takes your action (or starts it, if the casting time is longer).',
        'Direct: works like a ranged attack. A willing target only needs you to cast without fumbling.',
        'Area: everyone inside makes their defense against your roll.',
        'Self, or a spell with no defense: just don’t fumble.',
      ],
      table: {
        cols: ['Spell’s Defense', 'Target rolls'],
        rows: [
          ['Block', 'A block, as against a normal attack'],
          ['Dodge', 'Dodge/Escape or Athletics, as the spell says'],
          ['Resist Magic', 'A Resist Magic check'],
          ['STAT × 3', 'Nothing. You beat their stat × 3'],
          ['None', 'Only Dispel or Heliotrope can stop it'],
        ],
      },
      errata: 'Errata p. 99 and p. 168 added Defending Against Magic and rewrote targeting.',
    },
    {
      title: 'Stamina cost and Vigor',
      page: 'p. 47, 166',
      lines: [
        'Every spell, invocation and Sign costs STA. Subtract it when you cast.',
        'Vigor Threshold: the most STA you can spend on magic in one round without hurting yourself.',
        'Cast as many spells as your actions allow, as long as the round’s total cost stays at or below your Vigor.',
        'Out of STA: you’re stunned. Recover 20 STA with Recover actions, then pass a Stun save.',
      ],
      reading: 'The book doesn’t say whether a spell that misses or fails still costs its STA. Most tables charge it anyway.',
      errata: 'Errata: Vigor Points / Vigor Cost became Stamina Points / Stamina Cost, and p. 166 was rewritten.',
    },
    {
      title: 'Overexertion',
      page: 'p. 166',
      lines: [
        'You can push past your Vigor Threshold for a bigger spell.',
        'Pay 5 HP for every point of STA cost over your Vigor.',
        'You also take an elemental fumble effect (below).',
      ],
      errata: 'Errata p. 166: magic users who overexert suffer the elemental fumble effect as well as the damage.',
    },
    {
      title: 'Fumbling a spell',
      page: 'p. 166',
      lines: ['A natural 1, then roll again and look up the amount you fumbled by:'],
      table: {
        cols: ['Fumbled by', 'Result'],
        rows: [
          ['1-6', '1 damage per point fumbled. The spell still works.'],
          ['7-9', 'The spell fails, and you take an elemental fumble effect.'],
          ['10+', 'Elemental fumble effect, and any focus you carry explodes like a bomb: 1d10 damage, 2 m radius.'],
        ],
      },
    },
    {
      title: 'Elemental fumble effects',
      page: 'p. 166',
      lines: ['Each one deals 1 damage per point fumbled, plus:'],
      table: {
        cols: ['Element', 'Plus'],
        rows: [
          ['Earth', 'Stunned'],
          ['Air', 'Thrown back 2 m'],
          ['Fire', 'Set on fire'],
          ['Water', 'Frozen'],
          ['Mixed', 'One of the four, the GM picks at random'],
        ],
      },
      reading: 'For overexertion, which has no fumble roll, the book doesn’t say how much damage the effect itself deals beyond the 5 HP per point.',
      items: [{ head: 'Priests', lines: ['Always use the Mixed result when they overexert or fumble.'] }],
    },
    {
      title: 'Focuses, armor and dimeritium',
      page: 'p. 78, 167',
      lines: [
        'Staff or amulet: lowers the STA cost by its value, never below 1. It must be in hand, and only one works at a time.',
        'Armor EV comes off Spell Casting, Hex Weaving and Ritual Crafting, as well as REF and DEX (p. 78).',
        'Dimeritium within 5 m: −1 Vigor per unit.',
        'Touching it: Vigor drops to 0, and a DC 16 Endurance check every half hour decides how bad it gets. Results run from 18+ itchy, down to 10 or less taking 1d6 damage per round.',
        'Spell Casting 7-8 needs gestures only, no words. 9-10 needs only small gestures, which any part of the body can make.',
      ],
      errata: 'Errata p. 78 added EV & Magic.',
    },
    {
      title: 'Rituals and hexes',
      page: 'p. 168',
      lines: [
        'Ritual: spend the listed time, then Ritual Crafting against the ritual’s DC.',
        'Failure: no effect, and the components are used up. Fumble: 1 damage per STA spent.',
        'Interrupted: shaken or yelled at, DC 15 to keep going. Hurt, DC 18. Moved out of the circle, get back within 1 round and pass DC 16.',
        'Helpers, up to 4, lower the DC by 1 each. They don’t need magic.',
        'Hex: a failed hex does nothing. On a fumble there’s a 50% chance it hits you, instead of the normal fumble.',
      ],
      errata: 'Errata p. 168 rewrote the last line on hexes.',
    },
    {
      title: 'Who counts as a magic user',
      page: 'p. 166-167',
      lines: [
        '“Magic users” means mages and priests, not witchers.',
        'Every rule for mages applies to priests too.',
        'Witchers cast Signs. Signs have STA costs and follow the same Vigor rules.',
      ],
      errata: 'Errata p. 166-167 added the “Magic Users” sidebar and extended the mage rules to priests.',
    },
  ],
}

export const CHEAT_SHEET: CheatTopic[] = [combat, social, saves, criticals, magic]

// Lower-cased text of an entry for the search box.
export function entryText(e: CheatEntry): string {
  return [
    e.title,
    ...(e.lines ?? []),
    ...(e.table ? [...e.table.cols, ...e.table.rows.flat()] : []),
    ...(e.items ?? []).flatMap((i) => [i.head, ...i.lines]),
    e.reading ?? '',
  ]
    .join(' ')
    .toLowerCase()
}

export function searchCheatSheet(query: string): Array<{ topic: CheatTopic; entries: CheatEntry[] }> {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  return CHEAT_SHEET.map((topic) => ({
    topic,
    entries: words.length ? topic.entries.filter((e) => words.every((w) => entryText(e).includes(w))) : topic.entries,
  })).filter((r) => r.entries.length > 0)
}
