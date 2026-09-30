// Generated from npc-pack-1.json (original NPCs and monsters). Edit the generator, not this file.
export const NPC_PACK_DATA: unknown = {
  "app": "witcher-ttrpg",
  "schema": 1,
  "characters": [
    {
      "id": "npc-pack1-ostrid-vell",
      "schema": 1,
      "kind": "npc",
      "name": "Sergeant Ostrid Vell",
      "player": "",
      "race": "Human",
      "profession": "Man-At-Arms",
      "definingSkill": "Tough As Nails",
      "definingSkillValue": 4,
      "school": "",
      "age": "41",
      "gender": "Male",
      "homeland": "Temeria (Mayena toll road)",
      "stats": {
        "INT": 4,
        "REF": 7,
        "DEX": 5,
        "BODY": 7,
        "SPD": 5,
        "EMP": 3,
        "CRA": 4,
        "WILL": 6,
        "LUCK": 2
      },
      "skills": {
        "awareness": 4,
        "melee": 5,
        "staff-spear": 4,
        "dodge-escape": 3,
        "athletics": 3,
        "physique": 3,
        "endurance": 4,
        "intimidation": 4,
        "courage": 4,
        "tactics": 2,
        "riding": 2,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 30,
        "maxOverride": null
      },
      "sta": {
        "current": 30,
        "maxOverride": null
      },
      "luckCurrent": 2,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Kettle helm",
          "sp": 8,
          "maxSp": 8
        },
        "torso": {
          "piece": "Brigandine",
          "sp": 10,
          "maxSp": 10
        },
        "rArm": {
          "piece": "Brigandine",
          "sp": 10,
          "maxSp": 10
        },
        "lArm": {
          "piece": "Brigandine",
          "sp": 10,
          "maxSp": 10
        },
        "rLeg": {
          "piece": "Leather trousers",
          "sp": 3,
          "maxSp": 3
        },
        "lLeg": {
          "piece": "Leather trousers",
          "sp": 3,
          "maxSp": 3
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-ostrid-vell-w0",
          "name": "Halberd",
          "skillId": "staff-spear",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 10,
          "hands": 2,
          "range": "",
          "effect": "Long reach, can hit 2m away",
          "notes": ""
        },
        {
          "id": "npc-pack1-ostrid-vell-w1",
          "name": "Arming sword",
          "skillId": "melee",
          "accuracy": 0,
          "damage": "2d6+2",
          "reliability": 10,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-ostrid-vell-i0",
          "name": "Toll ledger",
          "qty": 1,
          "weight": 0.5,
          "notes": "Half the entries are invented"
        },
        {
          "id": "npc-pack1-ostrid-vell-i1",
          "name": "Whistle",
          "qty": 1,
          "weight": 0.1,
          "notes": "Summons 1d6 militia in 3 rounds"
        }
      ],
      "crowns": 60,
      "spells": [],
      "perks": "",
      "background": "Runs the toll post on the Mayena road with six bored militiamen. Charges whatever he thinks a traveller can bear and pockets the difference.",
      "notes": "Human soldier · Threat: Medium\n\nHooks: will waive the toll for anyone who deals with the thing stealing his horses at night. Backs down if outnumbered and out-talked (Persuasion or Intimidation DC 16). Fights with 2-4 militia (use Road bandit stats with spears).",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-casimir-hollen",
      "schema": 1,
      "kind": "npc",
      "name": "Brother Casimir Hollen",
      "player": "",
      "race": "Human",
      "profession": "Priest",
      "definingSkill": "Initiate of the Gods",
      "definingSkillValue": 5,
      "school": "",
      "age": "36",
      "gender": "Male",
      "homeland": "Redania (Oxenfurt)",
      "stats": {
        "INT": 6,
        "REF": 5,
        "DEX": 4,
        "BODY": 5,
        "SPD": 5,
        "EMP": 6,
        "CRA": 3,
        "WILL": 8,
        "LUCK": 3
      },
      "skills": {
        "awareness": 3,
        "education": 5,
        "human-perception": 4,
        "leadership": 6,
        "persuasion": 5,
        "charisma": 4,
        "intimidation": 5,
        "courage": 6,
        "resist-coercion": 6,
        "resist-magic": 4,
        "spell-casting": 4,
        "melee": 3,
        "dodge-escape": 2,
        "language-common-speech": 7
      },
      "customSkills": [],
      "hp": {
        "current": 30,
        "maxOverride": null
      },
      "sta": {
        "current": 30,
        "maxOverride": null
      },
      "luckCurrent": 3,
      "vigor": 2,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Padded cassock",
          "sp": 3,
          "maxSp": 3
        },
        "rArm": {
          "piece": "Padded cassock",
          "sp": 3,
          "maxSp": 3
        },
        "lArm": {
          "piece": "Padded cassock",
          "sp": 3,
          "maxSp": 3
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-casimir-hollen-w0",
          "name": "Iron-shod mace",
          "skillId": "melee",
          "accuracy": 0,
          "damage": "3d6",
          "reliability": 12,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-casimir-hollen-i0",
          "name": "Eternal Fire censer",
          "qty": 1,
          "weight": 1.5,
          "notes": ""
        },
        {
          "id": "npc-pack1-casimir-hollen-i1",
          "name": "Writ of the Church",
          "qty": 1,
          "weight": 0,
          "notes": "Grants him the right to search any house"
        }
      ],
      "crowns": 40,
      "spells": [
        {
          "name": "Purifying Flame",
          "kind": "Invocation",
          "staCost": "5",
          "range": "8m",
          "duration": "Immediate",
          "defense": "Dodge",
          "effect": "3d6 fire, 50% to ignite; +2d6 vs specters and cursed ones",
          "id": "npc-pack1-casimir-hollen-s0"
        },
        {
          "name": "Word of Resolve",
          "kind": "Invocation",
          "staCost": "3",
          "range": "10m radius",
          "duration": "5 rounds",
          "defense": "None",
          "effect": "Followers ignore fear and gain +2 to Courage",
          "id": "npc-pack1-casimir-hollen-s1"
        }
      ],
      "perks": "Crowd: always accompanied by 2d6 devout townsfolk who will riot at his word.",
      "background": "A fiery preacher of the Eternal Fire who arrived in town the same week the burnings began. Genuinely believes he is saving souls.",
      "notes": "Human zealot · Threat: Medium\n\nHooks: hunting a \"sorceress\" who is really the village herbwife (see Maud Kessel). Can be discredited publicly with evidence (Persuasion DC 18 before the crowd).",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-maud-kessel",
      "schema": 1,
      "kind": "npc",
      "name": "Maud Kessel",
      "player": "",
      "race": "Human",
      "profession": "Doctor",
      "definingSkill": "Healing Hands",
      "definingSkillValue": 5,
      "school": "",
      "age": "58",
      "gender": "Female",
      "homeland": "Temeria (Ellander)",
      "stats": {
        "INT": 7,
        "REF": 4,
        "DEX": 6,
        "BODY": 4,
        "SPD": 4,
        "EMP": 7,
        "CRA": 7,
        "WILL": 6,
        "LUCK": 4
      },
      "skills": {
        "awareness": 4,
        "wilderness-survival": 5,
        "education": 3,
        "first-aid": 6,
        "alchemy": 5,
        "human-perception": 5,
        "persuasion": 3,
        "deceit": 3,
        "monster-lore": 3,
        "dodge-escape": 2,
        "small-blades": 2,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 25,
        "maxOverride": null
      },
      "sta": {
        "current": 25,
        "maxOverride": null
      },
      "luckCurrent": 4,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-maud-kessel-w0",
          "name": "Sickle",
          "skillId": "small-blades",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 8,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-maud-kessel-i0",
          "name": "Herbal remedies",
          "qty": 6,
          "weight": 0.1,
          "notes": "Heal 1d6 HP, or +2 to a Healing Hands check"
        },
        {
          "id": "npc-pack1-maud-kessel-i1",
          "name": "Nightshade tincture",
          "qty": 2,
          "weight": 0.1,
          "notes": "Poison (DC 15 Endurance)"
        },
        {
          "id": "npc-pack1-maud-kessel-i2",
          "name": "Bundle of wolfsbane",
          "qty": 3,
          "weight": 0.1,
          "notes": "Werewolves avoid her cottage"
        }
      ],
      "crowns": 12,
      "spells": [],
      "perks": "",
      "background": "Has patched up half the county, delivered the other half, and knows exactly who in the village is lying about what.",
      "notes": "Human herbwife · Threat: Easy (non-combatant)\n\nHooks: knows the truth about the Mill Wolf (Aldo Grieg) and has been keeping him chained on full moons. Offers free healing to anyone who protects her from Brother Casimir.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-jorund-pike",
      "schema": 1,
      "kind": "npc",
      "name": "Jorund \"Magpie\" Pike",
      "player": "",
      "race": "Human",
      "profession": "Criminal",
      "definingSkill": "Practiced Paranoia",
      "definingSkillValue": 5,
      "school": "",
      "age": "33",
      "gender": "Male",
      "homeland": "Redania (Novigrad, Bits)",
      "stats": {
        "INT": 6,
        "REF": 6,
        "DEX": 7,
        "BODY": 4,
        "SPD": 6,
        "EMP": 5,
        "CRA": 5,
        "WILL": 4,
        "LUCK": 5
      },
      "skills": {
        "awareness": 5,
        "streetwise": 6,
        "business": 5,
        "deceit": 6,
        "human-perception": 4,
        "sleight-of-hand": 5,
        "pick-lock": 4,
        "stealth": 4,
        "small-blades": 4,
        "dodge-escape": 5,
        "gambling": 3,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 20,
        "maxOverride": null
      },
      "sta": {
        "current": 20,
        "maxOverride": null
      },
      "luckCurrent": 5,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Hidden leather vest",
          "sp": 4,
          "maxSp": 4
        },
        "rArm": {
          "piece": "Hidden leather vest",
          "sp": 4,
          "maxSp": 4
        },
        "lArm": {
          "piece": "Hidden leather vest",
          "sp": 4,
          "maxSp": 4
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-jorund-pike-w0",
          "name": "Stiletto",
          "skillId": "small-blades",
          "accuracy": 1,
          "damage": "1d6+2",
          "reliability": 10,
          "hands": 1,
          "range": "",
          "effect": "Armor piercing",
          "notes": ""
        },
        {
          "id": "npc-pack1-jorund-pike-w1",
          "name": "Throwing knives",
          "skillId": "athletics",
          "accuracy": 0,
          "damage": "1d6",
          "reliability": 8,
          "hands": 1,
          "range": "10m",
          "effect": "Thrown",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-jorund-pike-i0",
          "name": "Hot goods",
          "qty": 1,
          "weight": 2,
          "notes": "Rotating stock: jewellery, a silver dagger, a witcher medallion of unknown school"
        },
        {
          "id": "npc-pack1-jorund-pike-i1",
          "name": "Smoke bomb",
          "qty": 2,
          "weight": 0.5,
          "notes": "Fills a 4m area, obscures sight for 3 rounds"
        }
      ],
      "crowns": 350,
      "spells": [],
      "perks": "Always has an exit: first round of any fight he flees with a smoke bomb.",
      "background": "Buys anything, asks nothing, and sells to anyone. Pays about a third of what goods are worth.",
      "notes": "Human fence · Threat: Easy\n\nHooks: the medallion in his stock belonged to a dead witcher; whoever sold it knows where the body is. Will sell out the party to the Guild for 200 crowns.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-sabina-aerdt",
      "schema": 1,
      "kind": "npc",
      "name": "Sabina Aerdt",
      "player": "",
      "race": "Human",
      "profession": "Mage",
      "definingSkill": "Magical Training",
      "definingSkillValue": 6,
      "school": "",
      "age": "64 (looks 30)",
      "gender": "Female",
      "homeland": "Kaedwen (Ban Ard, expelled)",
      "stats": {
        "INT": 9,
        "REF": 6,
        "DEX": 5,
        "BODY": 4,
        "SPD": 5,
        "EMP": 6,
        "CRA": 5,
        "WILL": 9,
        "LUCK": 4
      },
      "skills": {
        "awareness": 5,
        "education": 7,
        "monster-lore": 4,
        "deduction": 5,
        "spell-casting": 7,
        "resist-magic": 6,
        "ritual-crafting": 5,
        "hex-weaving": 4,
        "courage": 5,
        "deceit": 5,
        "human-perception": 5,
        "social-etiquette": 5,
        "staff-spear": 3,
        "dodge-escape": 4,
        "language-common-speech": 8,
        "language-elder-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 30,
        "maxOverride": null
      },
      "sta": {
        "current": 45,
        "maxOverride": 45
      },
      "luckCurrent": 4,
      "vigor": 5,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Enchanted robes",
          "sp": 5,
          "maxSp": 5
        },
        "rArm": {
          "piece": "Enchanted robes",
          "sp": 5,
          "maxSp": 5
        },
        "lArm": {
          "piece": "Enchanted robes",
          "sp": 5,
          "maxSp": 5
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-sabina-aerdt-w0",
          "name": "Ivory staff",
          "skillId": "staff-spear",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 15,
          "hands": 2,
          "range": "",
          "effect": "Focus (2): reduces spell STA cost",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-sabina-aerdt-i0",
          "name": "Dimeritium-free amulet",
          "qty": 1,
          "weight": 0,
          "notes": ""
        },
        {
          "id": "npc-pack1-sabina-aerdt-i1",
          "name": "Research journal",
          "qty": 1,
          "weight": 1,
          "notes": "Notes on grafting relict hearts into living hosts"
        },
        {
          "id": "npc-pack1-sabina-aerdt-i2",
          "name": "Megascope shard",
          "qty": 1,
          "weight": 0.5,
          "notes": "Lets her project an illusion of herself once per day"
        }
      ],
      "crowns": 900,
      "spells": [
        {
          "name": "Lightning Bolt",
          "kind": "Spell",
          "staCost": "5",
          "range": "10m",
          "duration": "Immediate",
          "defense": "Dodge",
          "effect": "5d6 electrical, 25% stun",
          "id": "npc-pack1-sabina-aerdt-s0"
        },
        {
          "name": "Telekinetic Shove",
          "kind": "Spell",
          "staCost": "3",
          "range": "8m",
          "duration": "Immediate",
          "defense": "Dodge/Block",
          "effect": "Knockdown and push 4m",
          "id": "npc-pack1-sabina-aerdt-s1"
        },
        {
          "name": "Mirror Image",
          "kind": "Spell",
          "staCost": "4",
          "range": "Self",
          "duration": "1d6 rounds",
          "defense": "None",
          "effect": "2 illusory copies; attacks have 1 in 3 to hit her",
          "id": "npc-pack1-sabina-aerdt-s2"
        },
        {
          "name": "Rot of the Bones",
          "kind": "Hex",
          "staCost": "8",
          "range": "Touch",
          "duration": "Until lifted",
          "defense": "Resist Magic DC 18",
          "effect": "-2 BODY; lifted by a vial of the victim's blood burned at noon",
          "id": "npc-pack1-sabina-aerdt-s3"
        }
      ],
      "perks": "Portal: can escape through a prepared portal (1 round, 10 STA) if reduced below 15 HP. Vulnerable to dimeritium (no spells while shackled).",
      "background": "Expelled from Ban Ard for experimenting on patients. Now a well-paid \"court physician\" to a minor Kaedweni baron who does not ask questions.",
      "notes": "Human renegade mage · Threat: Hard\n\nHooks: created the Thorn Stag. Negotiates first, fights from range, always leaves a way out.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-emeric-thrane",
      "schema": 1,
      "kind": "npc",
      "name": "Captain Emeric aep Thrane",
      "player": "",
      "race": "Human",
      "profession": "Man-At-Arms",
      "definingSkill": "Tough As Nails",
      "definingSkillValue": 6,
      "school": "",
      "age": "39",
      "gender": "Male",
      "homeland": "Nilfgaard (Vicovaro)",
      "stats": {
        "INT": 6,
        "REF": 8,
        "DEX": 6,
        "BODY": 7,
        "SPD": 6,
        "EMP": 4,
        "CRA": 4,
        "WILL": 7,
        "LUCK": 3
      },
      "skills": {
        "awareness": 5,
        "tactics": 6,
        "leadership": 5,
        "swordsmanship": 7,
        "dodge-escape": 5,
        "riding": 5,
        "athletics": 4,
        "crossbow": 4,
        "courage": 6,
        "intimidation": 4,
        "resist-coercion": 5,
        "social-etiquette": 4,
        "language-common-speech": 5,
        "language-elder-speech": 4
      },
      "customSkills": [],
      "hp": {
        "current": 35,
        "maxOverride": null
      },
      "sta": {
        "current": 35,
        "maxOverride": null
      },
      "luckCurrent": 3,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Nilfgaardian helm",
          "sp": 12,
          "maxSp": 12
        },
        "torso": {
          "piece": "Black plate cuirass",
          "sp": 16,
          "maxSp": 16
        },
        "rArm": {
          "piece": "Black plate cuirass",
          "sp": 16,
          "maxSp": 16
        },
        "lArm": {
          "piece": "Black plate cuirass",
          "sp": 16,
          "maxSp": 16
        },
        "rLeg": {
          "piece": "Armored greaves",
          "sp": 12,
          "maxSp": 12
        },
        "lLeg": {
          "piece": "Armored greaves",
          "sp": 12,
          "maxSp": 12
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-emeric-thrane-w0",
          "name": "Nilfgaardian longsword",
          "skillId": "swordsmanship",
          "accuracy": 1,
          "damage": "2d6+4",
          "reliability": 15,
          "hands": 1,
          "range": "",
          "effect": "Balanced",
          "notes": ""
        },
        {
          "id": "npc-pack1-emeric-thrane-w1",
          "name": "Hand crossbow",
          "skillId": "crossbow",
          "accuracy": 0,
          "damage": "2d6+2",
          "reliability": 10,
          "hands": 1,
          "range": "50m",
          "effect": "Reload 1 action",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-emeric-thrane-i0",
          "name": "Sealed dispatches",
          "qty": 1,
          "weight": 0.1,
          "notes": "Troop movements along the Yaruga"
        },
        {
          "id": "npc-pack1-emeric-thrane-i1",
          "name": "Signet of the Imperial Army",
          "qty": 1,
          "weight": 0,
          "notes": ""
        }
      ],
      "crowns": 220,
      "spells": [],
      "perks": "Commander: allies who can hear him get +2 initiative. Rides a warhorse (Riding checks at +2).",
      "background": "A scout captain operating behind Northern lines. Honourable by his own lights, ruthless by anyone else's.",
      "notes": "Human Nilfgaardian officer · Threat: Hard\n\nHooks: will trade safe passage for the dispatches his courier lost. Travels with 4-6 scouts (use Road bandit stats with crossbows and SP 8 armor).",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-hubert-dall",
      "schema": 1,
      "kind": "npc",
      "name": "Hubert \"Crow\" Dall",
      "player": "",
      "race": "Human",
      "profession": "Man-At-Arms",
      "definingSkill": "Tough As Nails",
      "definingSkillValue": 5,
      "school": "",
      "age": "45",
      "gender": "Male",
      "homeland": "Aedirn (Vengerberg)",
      "stats": {
        "INT": 6,
        "REF": 7,
        "DEX": 8,
        "BODY": 6,
        "SPD": 6,
        "EMP": 3,
        "CRA": 5,
        "WILL": 6,
        "LUCK": 3
      },
      "skills": {
        "awareness": 6,
        "wilderness-survival": 5,
        "monster-lore": 3,
        "streetwise": 4,
        "crossbow": 7,
        "swordsmanship": 5,
        "dodge-escape": 5,
        "athletics": 4,
        "stealth": 4,
        "trap-crafting": 4,
        "intimidation": 5,
        "courage": 5,
        "riding": 4,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 30,
        "maxOverride": null
      },
      "sta": {
        "current": 30,
        "maxOverride": null
      },
      "luckCurrent": 3,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Leather hood",
          "sp": 4,
          "maxSp": 4
        },
        "torso": {
          "piece": "Studded brigandine",
          "sp": 12,
          "maxSp": 12
        },
        "rArm": {
          "piece": "Studded brigandine",
          "sp": 12,
          "maxSp": 12
        },
        "lArm": {
          "piece": "Studded brigandine",
          "sp": 12,
          "maxSp": 12
        },
        "rLeg": {
          "piece": "Heavy leather trousers",
          "sp": 6,
          "maxSp": 6
        },
        "lLeg": {
          "piece": "Heavy leather trousers",
          "sp": 6,
          "maxSp": 6
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-hubert-dall-w0",
          "name": "Heavy crossbow",
          "skillId": "crossbow",
          "accuracy": 1,
          "damage": "4d6",
          "reliability": 10,
          "hands": 2,
          "range": "150m",
          "effect": "Reload 1 action; bolts can be silver (+monster damage)",
          "notes": ""
        },
        {
          "id": "npc-pack1-hubert-dall-w1",
          "name": "Sabre",
          "skillId": "swordsmanship",
          "accuracy": 0,
          "damage": "2d6+2",
          "reliability": 10,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (25%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-hubert-dall-w2",
          "name": "Bear trap",
          "skillId": "trap-crafting",
          "accuracy": 0,
          "damage": "3d6",
          "reliability": 10,
          "hands": 2,
          "range": "",
          "effect": "Holds a leg; DC 16 Physique to escape",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-hubert-dall-i0",
          "name": "Wanted posters",
          "qty": 5,
          "weight": 0,
          "notes": "One of them looks a lot like a party member"
        },
        {
          "id": "npc-pack1-hubert-dall-i1",
          "name": "Silver bolts",
          "qty": 6,
          "weight": 0.1,
          "notes": ""
        },
        {
          "id": "npc-pack1-hubert-dall-i2",
          "name": "Manacles (dimeritium)",
          "qty": 1,
          "weight": 1,
          "notes": "Block magic"
        }
      ],
      "crowns": 180,
      "spells": [],
      "perks": "Ambusher: gets +3 to hit a target that has not noticed him. Prefers to fight from cover.",
      "background": "Wears a crow feather on his hat for every mark brought in. The hat is getting crowded.",
      "notes": "Human bounty hunter · Threat: Hard\n\nHooks: has a contract on someone the party is protecting, but can be bought off (double the bounty) or persuaded the contract is a lie (Human Perception reveals he half suspects it already).",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-lesko-ferryman",
      "schema": 1,
      "kind": "npc",
      "name": "Old Lesko",
      "player": "",
      "race": "Human",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "70",
      "gender": "Male",
      "homeland": "Kaedwen (Pontar ford)",
      "stats": {
        "INT": 6,
        "REF": 4,
        "DEX": 5,
        "BODY": 5,
        "SPD": 3,
        "EMP": 5,
        "CRA": 5,
        "WILL": 5,
        "LUCK": 6
      },
      "skills": {
        "awareness": 6,
        "wilderness-survival": 5,
        "monster-lore": 4,
        "sailing": 6,
        "streetwise": 3,
        "staff-spear": 3,
        "human-perception": 5,
        "gambling": 4,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 25,
        "maxOverride": null
      },
      "sta": {
        "current": 25,
        "maxOverride": null
      },
      "luckCurrent": 6,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-lesko-ferryman-w0",
          "name": "Ferry pole",
          "skillId": "staff-spear",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 6,
          "hands": 2,
          "range": "",
          "effect": "Can push a target into the river",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-lesko-ferryman-i0",
          "name": "Ferry",
          "qty": 1,
          "weight": 0,
          "notes": "Carries 6 people and a horse"
        },
        {
          "id": "npc-pack1-lesko-ferryman-i1",
          "name": "Jar of plum brandy",
          "qty": 1,
          "weight": 1,
          "notes": ""
        }
      ],
      "crowns": 30,
      "spells": [],
      "perks": "",
      "background": "Has poled the ferry for fifty years and has seen every drowner, smuggler and dead body the Pontar ever carried.",
      "notes": "Human ferryman · Threat: Easy (non-combatant)\n\nHooks: knows the river as well as anyone living. Trades rumours for brandy. Will not cross after dark: \"the Grey Widow walks the water then\".",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-wendeline-faerber",
      "schema": 1,
      "kind": "npc",
      "name": "Wendeline Faerber",
      "player": "",
      "race": "Human",
      "profession": "Merchant",
      "definingSkill": "Well Traveled",
      "definingSkillValue": 5,
      "school": "",
      "age": "48",
      "gender": "Female",
      "homeland": "Redania (Tretogor)",
      "stats": {
        "INT": 8,
        "REF": 4,
        "DEX": 4,
        "BODY": 4,
        "SPD": 4,
        "EMP": 7,
        "CRA": 5,
        "WILL": 6,
        "LUCK": 5
      },
      "skills": {
        "awareness": 4,
        "business": 7,
        "education": 5,
        "streetwise": 4,
        "social-etiquette": 5,
        "persuasion": 6,
        "charisma": 5,
        "human-perception": 6,
        "deceit": 4,
        "gambling": 3,
        "resist-coercion": 5,
        "language-common-speech": 7,
        "language-dwarven": 3
      },
      "customSkills": [],
      "hp": {
        "current": 25,
        "maxOverride": null
      },
      "sta": {
        "current": 25,
        "maxOverride": null
      },
      "luckCurrent": 5,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Fine doublet",
          "sp": 1,
          "maxSp": 1
        },
        "rArm": {
          "piece": "Fine doublet",
          "sp": 1,
          "maxSp": 1
        },
        "lArm": {
          "piece": "Fine doublet",
          "sp": 1,
          "maxSp": 1
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-wendeline-faerber-w0",
          "name": "Jeweled dagger",
          "skillId": "small-blades",
          "accuracy": 0,
          "damage": "1d6",
          "reliability": 6,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-wendeline-faerber-i0",
          "name": "Letters of credit (Vivaldi Bank)",
          "qty": 1,
          "weight": 0,
          "notes": "Worth 2,000 crowns at any branch"
        },
        {
          "id": "npc-pack1-wendeline-faerber-i1",
          "name": "Sample bolts of dyed cloth",
          "qty": 3,
          "weight": 1,
          "notes": ""
        }
      ],
      "crowns": 500,
      "spells": [],
      "perks": "Connected: can call on 2 hired guards (Road bandit stats) and a line of credit in every city with a Vivaldi branch.",
      "background": "Factor for a dye-works guild in Tretogor. Hires adventurers the way other people hire carters.",
      "notes": "Human merchant · Threat: Easy (non-combatant)\n\nHooks: pays 300 crowns to escort a wagon of indigo through Scoia'tael country, and does not mention that a Nilfgaardian buyer is waiting at the other end.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-tamsin-reed",
      "schema": 1,
      "kind": "npc",
      "name": "Tamsin Reed",
      "player": "",
      "race": "Human",
      "profession": "Bard",
      "definingSkill": "Busking",
      "definingSkillValue": 5,
      "school": "",
      "age": "26",
      "gender": "Female",
      "homeland": "Kovir (Lan Exeter)",
      "stats": {
        "INT": 6,
        "REF": 6,
        "DEX": 6,
        "BODY": 4,
        "SPD": 6,
        "EMP": 8,
        "CRA": 4,
        "WILL": 5,
        "LUCK": 6
      },
      "skills": {
        "awareness": 4,
        "streetwise": 5,
        "social-etiquette": 4,
        "performance": 7,
        "fine-arts": 5,
        "charisma": 6,
        "persuasion": 5,
        "seduction": 5,
        "deceit": 4,
        "human-perception": 5,
        "small-blades": 3,
        "dodge-escape": 4,
        "language-common-speech": 6,
        "language-elder-speech": 3
      },
      "customSkills": [],
      "hp": {
        "current": 20,
        "maxOverride": null
      },
      "sta": {
        "current": 20,
        "maxOverride": null
      },
      "luckCurrent": 6,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-tamsin-reed-w0",
          "name": "Lute-case knife",
          "skillId": "small-blades",
          "accuracy": 0,
          "damage": "1d6+1",
          "reliability": 8,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-tamsin-reed-i0",
          "name": "Lute",
          "qty": 1,
          "weight": 2,
          "notes": ""
        },
        {
          "id": "npc-pack1-tamsin-reed-i1",
          "name": "Songbook",
          "qty": 1,
          "weight": 0.5,
          "notes": "Half of it is thinly veiled gossip about Kovirian nobles"
        }
      ],
      "crowns": 45,
      "spells": [],
      "perks": "",
      "background": "Travels ahead of the gossip and sings it before anyone can deny it. Half the courts in the North want her at their feasts; the other half want her hanged.",
      "notes": "Human bard · Threat: Easy\n\nHooks: will write a ballad about the party, flattering or ruinous depending on how they treat her. Knows who hired Crow Dall.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-aelirenn-vaen",
      "schema": 1,
      "kind": "npc",
      "name": "Aelirenn Vaen",
      "player": "",
      "race": "Elf",
      "profession": "Man-At-Arms",
      "definingSkill": "Tough As Nails",
      "definingSkillValue": 4,
      "school": "",
      "age": "112",
      "gender": "Female",
      "homeland": "Dol Blathanna (Blue Mountains)",
      "stats": {
        "INT": 6,
        "REF": 8,
        "DEX": 9,
        "BODY": 5,
        "SPD": 7,
        "EMP": 4,
        "CRA": 5,
        "WILL": 6,
        "LUCK": 3
      },
      "skills": {
        "awareness": 6,
        "wilderness-survival": 6,
        "archery": 7,
        "stealth": 6,
        "swordsmanship": 4,
        "dodge-escape": 5,
        "athletics": 5,
        "courage": 4,
        "intimidation": 3,
        "language-elder-speech": 8,
        "language-common-speech": 4
      },
      "customSkills": [],
      "hp": {
        "current": 25,
        "maxOverride": null
      },
      "sta": {
        "current": 25,
        "maxOverride": null
      },
      "luckCurrent": 3,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Hood",
          "sp": 2,
          "maxSp": 2
        },
        "torso": {
          "piece": "Elven leather",
          "sp": 8,
          "maxSp": 8
        },
        "rArm": {
          "piece": "Elven leather",
          "sp": 8,
          "maxSp": 8
        },
        "lArm": {
          "piece": "Elven leather",
          "sp": 8,
          "maxSp": 8
        },
        "rLeg": {
          "piece": "Elven trousers",
          "sp": 5,
          "maxSp": 5
        },
        "lLeg": {
          "piece": "Elven trousers",
          "sp": 5,
          "maxSp": 5
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-aelirenn-vaen-w0",
          "name": "Elven longbow",
          "skillId": "archery",
          "accuracy": 2,
          "damage": "4d6",
          "reliability": 10,
          "hands": 2,
          "range": "200m",
          "effect": "Focused; two shots per turn at -3 each",
          "notes": ""
        },
        {
          "id": "npc-pack1-aelirenn-vaen-w1",
          "name": "Elven short sword",
          "skillId": "swordsmanship",
          "accuracy": 1,
          "damage": "2d6",
          "reliability": 12,
          "hands": 1,
          "range": "",
          "effect": "Balanced",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-aelirenn-vaen-i0",
          "name": "Squirrel-tail trophy",
          "qty": 1,
          "weight": 0,
          "notes": ""
        },
        {
          "id": "npc-pack1-aelirenn-vaen-i1",
          "name": "Arrows (bodkin)",
          "qty": 20,
          "weight": 0.05,
          "notes": "Armor piercing"
        }
      ],
      "crowns": 10,
      "spells": [],
      "perks": "Elven artistry and marksman: +1 to Archery shots from cover. Forest: +2 Stealth in woodland.",
      "background": "Leads a commando of five in the woods above the dye-merchants' road. Lost her family in the Kaedweni pogroms.",
      "notes": "Elf Scoia'tael archer · Threat: Medium\n\nHooks: will let travellers pass if they carry no Kaedweni goods. Can be negotiated with in Elder Speech; insults her if the party speaks only Common. Commandos: 4 elves (Road bandit stats, longbows 2d6+2).",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-siana-dhuanne",
      "schema": 1,
      "kind": "npc",
      "name": "Síana aep Dhuanne",
      "player": "",
      "race": "Elf",
      "profession": "Mage",
      "definingSkill": "Magical Training",
      "definingSkillValue": 7,
      "school": "",
      "age": "340",
      "gender": "Female",
      "homeland": "Brokilon edge (hermitage)",
      "stats": {
        "INT": 9,
        "REF": 6,
        "DEX": 6,
        "BODY": 4,
        "SPD": 6,
        "EMP": 7,
        "CRA": 6,
        "WILL": 9,
        "LUCK": 5
      },
      "skills": {
        "awareness": 7,
        "education": 8,
        "monster-lore": 6,
        "wilderness-survival": 6,
        "deduction": 5,
        "spell-casting": 7,
        "ritual-crafting": 8,
        "resist-magic": 7,
        "courage": 5,
        "human-perception": 6,
        "persuasion": 4,
        "language-elder-speech": 10,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 30,
        "maxOverride": null
      },
      "sta": {
        "current": 50,
        "maxOverride": 50
      },
      "luckCurrent": 5,
      "vigor": 5,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Woven bark robe",
          "sp": 4,
          "maxSp": 4
        },
        "rArm": {
          "piece": "Woven bark robe",
          "sp": 4,
          "maxSp": 4
        },
        "lArm": {
          "piece": "Woven bark robe",
          "sp": 4,
          "maxSp": 4
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-siana-dhuanne-w0",
          "name": "Rowan staff",
          "skillId": "staff-spear",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 12,
          "hands": 2,
          "range": "",
          "effect": "Focus (2)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-siana-dhuanne-i0",
          "name": "Seer's bowl",
          "qty": 1,
          "weight": 1,
          "notes": ""
        },
        {
          "id": "npc-pack1-siana-dhuanne-i1",
          "name": "Mandrake root",
          "qty": 3,
          "weight": 0.1,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Entangling Roots",
          "kind": "Spell",
          "staCost": "4",
          "range": "12m",
          "duration": "1d6 rounds",
          "defense": "Dodge",
          "effect": "Target is held; DC 16 Physique to break free",
          "id": "npc-pack1-siana-dhuanne-s0"
        },
        {
          "name": "Nature's Rebuke",
          "kind": "Spell",
          "staCost": "6",
          "range": "10m",
          "duration": "Immediate",
          "defense": "Dodge",
          "effect": "4d6 piercing (thorns), knockdown",
          "id": "npc-pack1-siana-dhuanne-s1"
        },
        {
          "name": "Scrying Pool",
          "kind": "Ritual",
          "staCost": "10",
          "range": "Any",
          "duration": "10 minutes",
          "defense": "None",
          "effect": "Sees a named person's surroundings",
          "id": "npc-pack1-siana-dhuanne-s2"
        }
      ],
      "perks": "Sanctuary: the grove heals her 5 HP per round while she stands in it. Dryads answer her call (1d3 dryad archers).",
      "background": "Has watched humans cut back the forest for three centuries. Her visions are accurate and never comforting.",
      "notes": "Elf seer · Threat: Hard (rarely fights)\n\nHooks: she can scry the Thorn Stag's maker, but her price is a promise to replant what was burned. Does not fight unless the grove is threatened.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-brokk-hammelmann",
      "schema": 1,
      "kind": "npc",
      "name": "Brokk Hammelmann",
      "player": "",
      "race": "Dwarf",
      "profession": "Craftsman",
      "definingSkill": "Patch Job",
      "definingSkillValue": 6,
      "school": "",
      "age": "94",
      "gender": "Male",
      "homeland": "Mahakam",
      "stats": {
        "INT": 6,
        "REF": 5,
        "DEX": 6,
        "BODY": 8,
        "SPD": 4,
        "EMP": 4,
        "CRA": 9,
        "WILL": 6,
        "LUCK": 4
      },
      "skills": {
        "awareness": 3,
        "business": 5,
        "crafting": 8,
        "alchemy": 3,
        "melee": 5,
        "brawling": 4,
        "physique": 5,
        "endurance": 5,
        "courage": 4,
        "intimidation": 3,
        "gambling": 4,
        "language-dwarven": 8,
        "language-common-speech": 5
      },
      "customSkills": [],
      "hp": {
        "current": 35,
        "maxOverride": null
      },
      "sta": {
        "current": 35,
        "maxOverride": null
      },
      "luckCurrent": 4,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Smith's leather apron",
          "sp": 6,
          "maxSp": 6
        },
        "rArm": {
          "piece": "Heavy gloves",
          "sp": 3,
          "maxSp": 3
        },
        "lArm": {
          "piece": "Heavy gloves",
          "sp": 3,
          "maxSp": 3
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-brokk-hammelmann-w0",
          "name": "Forge hammer",
          "skillId": "melee",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 15,
          "hands": 2,
          "range": "",
          "effect": "Can ablate 2 SP per hit",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-brokk-hammelmann-i0",
          "name": "Mahakamite steel ingot",
          "qty": 2,
          "weight": 1,
          "notes": "Needed to forge relic-grade swords"
        },
        {
          "id": "npc-pack1-brokk-hammelmann-i1",
          "name": "Smithing tools",
          "qty": 1,
          "weight": 5,
          "notes": ""
        }
      ],
      "crowns": 280,
      "spells": [],
      "perks": "Tough and stubborn: +2 to resist Intimidation and Persuasion from humans. Crafts silver weapons at a 20% discount for friends.",
      "background": "Runs the only forge in three valleys that can work silver properly. Owes a debt to the Vivaldi bank and a grudge to everyone else.",
      "notes": "Dwarf smith · Threat: Medium\n\nHooks: will reforge a broken witcher blade if the party recovers his stolen ingot from Jorund Pike.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-gudrun-stahlfaust",
      "schema": 1,
      "kind": "npc",
      "name": "Gudrun Stahlfaust",
      "player": "",
      "race": "Dwarf",
      "profession": "Man-At-Arms",
      "definingSkill": "Tough As Nails",
      "definingSkillValue": 6,
      "school": "",
      "age": "71",
      "gender": "Female",
      "homeland": "Mahakam (Carbon)",
      "stats": {
        "INT": 5,
        "REF": 7,
        "DEX": 5,
        "BODY": 9,
        "SPD": 5,
        "EMP": 4,
        "CRA": 5,
        "WILL": 8,
        "LUCK": 3
      },
      "skills": {
        "awareness": 4,
        "tactics": 4,
        "melee": 7,
        "brawling": 5,
        "dodge-escape": 3,
        "athletics": 3,
        "physique": 6,
        "endurance": 6,
        "courage": 7,
        "intimidation": 5,
        "resist-coercion": 5,
        "gambling": 4,
        "language-dwarven": 7,
        "language-common-speech": 5
      },
      "customSkills": [],
      "hp": {
        "current": 40,
        "maxOverride": null
      },
      "sta": {
        "current": 40,
        "maxOverride": null
      },
      "luckCurrent": 3,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Dwarven helm",
          "sp": 14,
          "maxSp": 14
        },
        "torso": {
          "piece": "Mahakamite mail",
          "sp": 18,
          "maxSp": 18
        },
        "rArm": {
          "piece": "Mail sleeves",
          "sp": 12,
          "maxSp": 12
        },
        "lArm": {
          "piece": "Mail sleeves",
          "sp": 12,
          "maxSp": 12
        },
        "rLeg": {
          "piece": "Mail chausses",
          "sp": 12,
          "maxSp": 12
        },
        "lLeg": {
          "piece": "Mail chausses",
          "sp": 12,
          "maxSp": 12
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-gudrun-stahlfaust-w0",
          "name": "Mahakam battle axe",
          "skillId": "melee",
          "accuracy": 0,
          "damage": "5d6",
          "reliability": 15,
          "hands": 2,
          "range": "",
          "effect": "Bleeding (25%), ablating",
          "notes": ""
        },
        {
          "id": "npc-pack1-gudrun-stahlfaust-w1",
          "name": "Throwing axes",
          "skillId": "athletics",
          "accuracy": 0,
          "damage": "2d6+2",
          "reliability": 10,
          "hands": 1,
          "range": "15m",
          "effect": "Thrown",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-gudrun-stahlfaust-i0",
          "name": "Contract with the Free Company",
          "qty": 1,
          "weight": 0,
          "notes": ""
        },
        {
          "id": "npc-pack1-gudrun-stahlfaust-i1",
          "name": "Flask of spirytus",
          "qty": 1,
          "weight": 0.5,
          "notes": ""
        }
      ],
      "crowns": 150,
      "spells": [],
      "perks": "Bulwark: allies adjacent to her gain +2 to Block. Immune to knockdown while standing on solid ground.",
      "background": "Sergeant of a dwarven free company that has fought for four kings and been paid by two of them.",
      "notes": "Dwarf mercenary · Threat: Hard\n\nHooks: her company is owed back-pay by the baron who employs Sabina Aerdt. She will help storm his keep for a share of the treasury.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-pip-dewberry",
      "schema": 1,
      "kind": "npc",
      "name": "Pip Dewberry",
      "player": "",
      "race": "Other",
      "profession": "Criminal",
      "definingSkill": "Practiced Paranoia",
      "definingSkillValue": 5,
      "school": "",
      "age": "52",
      "gender": "Male",
      "homeland": "Ellander (halfling quarter)",
      "stats": {
        "INT": 7,
        "REF": 7,
        "DEX": 8,
        "BODY": 3,
        "SPD": 6,
        "EMP": 6,
        "CRA": 5,
        "WILL": 5,
        "LUCK": 7
      },
      "skills": {
        "awareness": 6,
        "streetwise": 6,
        "business": 4,
        "deceit": 6,
        "charisma": 4,
        "sleight-of-hand": 6,
        "stealth": 7,
        "pick-lock": 5,
        "dodge-escape": 6,
        "small-blades": 3,
        "athletics": 4,
        "language-common-speech": 6
      },
      "customSkills": [],
      "hp": {
        "current": 20,
        "maxOverride": null
      },
      "sta": {
        "current": 20,
        "maxOverride": null
      },
      "luckCurrent": 7,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "Quilted jacket",
          "sp": 2,
          "maxSp": 2
        },
        "rArm": {
          "piece": "Quilted jacket",
          "sp": 2,
          "maxSp": 2
        },
        "lArm": {
          "piece": "Quilted jacket",
          "sp": 2,
          "maxSp": 2
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-pip-dewberry-w0",
          "name": "Slingshot",
          "skillId": "athletics",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 10,
          "hands": 2,
          "range": "20m",
          "effect": "",
          "notes": ""
        },
        {
          "id": "npc-pack1-pip-dewberry-w1",
          "name": "Paring knife",
          "skillId": "small-blades",
          "accuracy": 0,
          "damage": "1d6",
          "reliability": 6,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-pip-dewberry-i0",
          "name": "False-bottomed pie cart",
          "qty": 1,
          "weight": 20,
          "notes": "Carries 20 kg of contraband"
        },
        {
          "id": "npc-pack1-pip-dewberry-i1",
          "name": "Fisstech",
          "qty": 3,
          "weight": 0.1,
          "notes": ""
        }
      ],
      "crowns": 90,
      "spells": [],
      "perks": "Halfling: tiny and quick (+2 Dodge vs larger foes), gets +1 Stealth when others are around to hide behind.",
      "background": "Sells meat pies by day and smuggles fisstech and fugitive elves by night. Considers both public services.",
      "notes": "Halfling smuggler · Threat: Easy\n\nHooks: can sneak the party into any town. Will absolutely eat all their rations on the way.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-nimb-gnome",
      "schema": 1,
      "kind": "npc",
      "name": "Nimb Fellwhistle",
      "player": "",
      "race": "Other",
      "profession": "Craftsman",
      "definingSkill": "Patch Job",
      "definingSkillValue": 6,
      "school": "",
      "age": "160",
      "gender": "Male",
      "homeland": "Mahakam (gnome warren)",
      "stats": {
        "INT": 9,
        "REF": 5,
        "DEX": 8,
        "BODY": 3,
        "SPD": 4,
        "EMP": 5,
        "CRA": 9,
        "WILL": 5,
        "LUCK": 4
      },
      "skills": {
        "awareness": 5,
        "education": 6,
        "deduction": 5,
        "business": 3,
        "crafting": 8,
        "trap-crafting": 6,
        "alchemy": 5,
        "pick-lock": 6,
        "sleight-of-hand": 3,
        "dodge-escape": 4,
        "language-dwarven": 6,
        "language-common-speech": 4,
        "language-elder-speech": 3
      },
      "customSkills": [],
      "hp": {
        "current": 20,
        "maxOverride": null
      },
      "sta": {
        "current": 20,
        "maxOverride": null
      },
      "luckCurrent": 4,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-nimb-gnome-w0",
          "name": "Spring-loaded gnomish dart",
          "skillId": "crossbow",
          "accuracy": 0,
          "damage": "2d6",
          "reliability": 8,
          "hands": 1,
          "range": "20m",
          "effect": "Poison (DC 14 Endurance)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-nimb-gnome-i0",
          "name": "Gnomish lockpicks",
          "qty": 1,
          "weight": 0.1,
          "notes": "+2 to Pick Lock"
        },
        {
          "id": "npc-pack1-nimb-gnome-i1",
          "name": "Clockwork songbird",
          "qty": 1,
          "weight": 0.5,
          "notes": "Records and repeats 1 minute of speech"
        }
      ],
      "crowns": 140,
      "spells": [],
      "perks": "Gnomish craft: his weapons and tools are +1 accuracy and never break on a fumble.",
      "background": "Insists every gnome forged sword is better than any dwarven one, and is usually right.",
      "notes": "Gnome tinker · Threat: Easy (non-combatant)\n\nHooks: will build nearly anything if the design is interesting enough; payment in rare components rather than coin.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-radek-viper",
      "schema": 1,
      "kind": "npc",
      "name": "Radek of Ban Glean",
      "player": "",
      "race": "Witcher",
      "profession": "Witcher",
      "definingSkill": "Witcher Training",
      "definingSkillValue": 6,
      "school": "Viper",
      "age": "88",
      "gender": "Male",
      "homeland": "Nilfgaard (Gorthur Gvaed)",
      "stats": {
        "INT": 6,
        "REF": 9,
        "DEX": 8,
        "BODY": 8,
        "SPD": 7,
        "EMP": 2,
        "CRA": 5,
        "WILL": 7,
        "LUCK": 3
      },
      "skills": {
        "awareness": 7,
        "monster-lore": 6,
        "wilderness-survival": 5,
        "deduction": 4,
        "swordsmanship": 8,
        "small-blades": 6,
        "dodge-escape": 7,
        "athletics": 6,
        "riding": 5,
        "stealth": 5,
        "endurance": 5,
        "alchemy": 6,
        "courage": 6,
        "intimidation": 5,
        "spell-casting": 4,
        "resist-magic": 4,
        "language-common-speech": 5,
        "language-elder-speech": 5
      },
      "customSkills": [],
      "hp": {
        "current": 35,
        "maxOverride": null
      },
      "sta": {
        "current": 35,
        "maxOverride": null
      },
      "luckCurrent": 3,
      "vigor": 2,
      "armor": {
        "head": {
          "piece": "Viper hood",
          "sp": 6,
          "maxSp": 6
        },
        "torso": {
          "piece": "Viper school jacket",
          "sp": 14,
          "maxSp": 14
        },
        "rArm": {
          "piece": "Viper sleeves",
          "sp": 10,
          "maxSp": 10
        },
        "lArm": {
          "piece": "Viper sleeves",
          "sp": 10,
          "maxSp": 10
        },
        "rLeg": {
          "piece": "Viper trousers",
          "sp": 10,
          "maxSp": 10
        },
        "lLeg": {
          "piece": "Viper trousers",
          "sp": 10,
          "maxSp": 10
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-radek-viper-w0",
          "name": "Viper steel sword",
          "skillId": "swordsmanship",
          "accuracy": 1,
          "damage": "3d6+2",
          "reliability": 15,
          "hands": 2,
          "range": "",
          "effect": "Poison-coated (Poison 50%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-radek-viper-w1",
          "name": "Viper silver sword",
          "skillId": "swordsmanship",
          "accuracy": 1,
          "damage": "1d6+4 (4d6+2 vs monsters)",
          "reliability": 15,
          "hands": 2,
          "range": "",
          "effect": "Silver",
          "notes": ""
        },
        {
          "id": "npc-pack1-radek-viper-w2",
          "name": "Poisoned throwing knives",
          "skillId": "athletics",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 8,
          "hands": 1,
          "range": "10m",
          "effect": "Poison (75%)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-radek-viper-i0",
          "name": "Black Blood potion",
          "qty": 1,
          "weight": 0.1,
          "notes": "Vampires that drink his blood take 2d6"
        },
        {
          "id": "npc-pack1-radek-viper-i1",
          "name": "Viper medallion",
          "qty": 1,
          "weight": 0.1,
          "notes": ""
        },
        {
          "id": "npc-pack1-radek-viper-i2",
          "name": "Blade oil (Hanged Man's Venom)",
          "qty": 2,
          "weight": 0.1,
          "notes": ""
        }
      ],
      "crowns": 400,
      "spells": [
        {
          "name": "Aard",
          "kind": "Sign",
          "staCost": "1-5",
          "range": "8m cone",
          "duration": "Immediate",
          "defense": "Physique/Block",
          "effect": "Knockdown, push, 1d6 per STA spent",
          "id": "npc-pack1-radek-viper-s0"
        },
        {
          "name": "Axii",
          "kind": "Sign",
          "staCost": "1-5",
          "range": "8m",
          "duration": "1 round per STA",
          "defense": "Resist Magic",
          "effect": "Stagger or calm; a human target may be swayed",
          "id": "npc-pack1-radek-viper-s1"
        },
        {
          "name": "Quen",
          "kind": "Sign",
          "staCost": "1-5",
          "range": "Self",
          "duration": "Active",
          "defense": "None",
          "effect": "Shield of 5 SP per STA spent",
          "id": "npc-pack1-radek-viper-s2"
        }
      ],
      "perks": "Witcher mutations: enhanced senses, poison immunity, night vision. Viper: whirl strike hits all adjacent enemies (-3 to hit).",
      "background": "A Viper who took Nilfgaardian coin for \"contracts\" that were not always monsters. Cold, polite, and professional.",
      "notes": "Witcher rival · Threat: Deadly\n\nHooks: has been hired to kill whatever the party is hunting first, and to make sure no one else collects the fee. Won't fight a witcher party member unless paid extra.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-rotfen-drowners",
      "schema": 1,
      "kind": "npc",
      "name": "Rotfen Drowner",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Rotfen marshes",
      "stats": {
        "INT": 2,
        "REF": 6,
        "DEX": 5,
        "BODY": 6,
        "SPD": 6,
        "EMP": 1,
        "CRA": 1,
        "WILL": 4,
        "LUCK": 0
      },
      "skills": {
        "awareness": 4,
        "brawling": 5,
        "dodge-escape": 4,
        "athletics": 4,
        "stealth": 4
      },
      "customSkills": [],
      "hp": {
        "current": 25,
        "maxOverride": 25
      },
      "sta": {
        "current": 25,
        "maxOverride": 25
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Slimy hide",
          "sp": 2,
          "maxSp": 2
        },
        "torso": {
          "piece": "Slimy hide",
          "sp": 2,
          "maxSp": 2
        },
        "rArm": {
          "piece": "Slimy hide",
          "sp": 2,
          "maxSp": 2
        },
        "lArm": {
          "piece": "Slimy hide",
          "sp": 2,
          "maxSp": 2
        },
        "rLeg": {
          "piece": "Slimy hide",
          "sp": 2,
          "maxSp": 2
        },
        "lLeg": {
          "piece": "Slimy hide",
          "sp": 2,
          "maxSp": 2
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-rotfen-drowners-w0",
          "name": "Claws",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "2d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (25%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-rotfen-drowners-w1",
          "name": "Bite",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Disease (rot fever, 25%)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-rotfen-drowners-i0",
          "name": "Drowner brain",
          "qty": 1,
          "weight": 0.5,
          "notes": "Alchemy ingredient"
        },
        {
          "id": "npc-pack1-rotfen-drowners-i1",
          "name": "Drowner tongue",
          "qty": 1,
          "weight": 0.1,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Aquatic: +3 to Stealth underwater, drags a grappled target underwater (Endurance DC 14 each round or drown). Vulnerable: silver, Necrophage oil, Dancing Star. Fears fire.",
      "background": "Swollen, grey-green corpses that crawl out of the peat at dusk.",
      "notes": "Monster · Necrophage · Threat: Easy (use 3-6)\n\nTactics: rush the weakest target in packs, retreat into water when below half HP.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-ghoul-alpha",
      "schema": 1,
      "kind": "npc",
      "name": "Gravepit Ghoul Matriarch",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Battlefield graves along the Yaruga",
      "stats": {
        "INT": 2,
        "REF": 7,
        "DEX": 6,
        "BODY": 8,
        "SPD": 7,
        "EMP": 1,
        "CRA": 1,
        "WILL": 6,
        "LUCK": 0
      },
      "skills": {
        "awareness": 6,
        "brawling": 6,
        "dodge-escape": 5,
        "athletics": 5,
        "stealth": 3,
        "physique": 4
      },
      "customSkills": [],
      "hp": {
        "current": 45,
        "maxOverride": 45
      },
      "sta": {
        "current": 35,
        "maxOverride": 35
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Leathery hide",
          "sp": 4,
          "maxSp": 4
        },
        "torso": {
          "piece": "Leathery hide",
          "sp": 4,
          "maxSp": 4
        },
        "rArm": {
          "piece": "Leathery hide",
          "sp": 4,
          "maxSp": 4
        },
        "lArm": {
          "piece": "Leathery hide",
          "sp": 4,
          "maxSp": 4
        },
        "rLeg": {
          "piece": "Leathery hide",
          "sp": 4,
          "maxSp": 4
        },
        "lLeg": {
          "piece": "Leathery hide",
          "sp": 4,
          "maxSp": 4
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-ghoul-alpha-w0",
          "name": "Claws",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "3d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (25%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-ghoul-alpha-w1",
          "name": "Rending bite",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "3d6+2",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Disease (grave fever, 25%)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-ghoul-alpha-i0",
          "name": "Ghoul blood",
          "qty": 2,
          "weight": 0.1,
          "notes": "Alchemy ingredient"
        },
        {
          "id": "npc-pack1-ghoul-alpha-i1",
          "name": "Ghoul marrow",
          "qty": 1,
          "weight": 0.5,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Frenzy: below 20 HP she gains +2 to attack and ignores Stun. Call the pack: summons 1d3 ghouls (use Rotfen Drowner stats, no aquatic) once per fight. Vulnerable: silver, Necrophage oil, Moon Dust bombs.",
      "background": "An old ghoul grown fat on a battlefield no one bothered to burn.",
      "notes": "Monster · Necrophage · Threat: Medium (with 3-4 ghouls)\n\nTactics: sends the pack in first, flanks, drags a body off and retreats to feed. Burning the battlefield stops the infestation.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-nekker-warband",
      "schema": 1,
      "kind": "npc",
      "name": "Hollowbank Nekker",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "River banks and old burrows",
      "stats": {
        "INT": 2,
        "REF": 7,
        "DEX": 6,
        "BODY": 3,
        "SPD": 8,
        "EMP": 1,
        "CRA": 3,
        "WILL": 3,
        "LUCK": 0
      },
      "skills": {
        "awareness": 4,
        "brawling": 4,
        "dodge-escape": 5,
        "athletics": 5,
        "stealth": 5
      },
      "customSkills": [],
      "hp": {
        "current": 12,
        "maxOverride": 12
      },
      "sta": {
        "current": 15,
        "maxOverride": 15
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Tough skin",
          "sp": 1,
          "maxSp": 1
        },
        "torso": {
          "piece": "Tough skin",
          "sp": 1,
          "maxSp": 1
        },
        "rArm": {
          "piece": "Tough skin",
          "sp": 1,
          "maxSp": 1
        },
        "lArm": {
          "piece": "Tough skin",
          "sp": 1,
          "maxSp": 1
        },
        "rLeg": {
          "piece": "Tough skin",
          "sp": 1,
          "maxSp": 1
        },
        "lLeg": {
          "piece": "Tough skin",
          "sp": 1,
          "maxSp": 1
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-nekker-warband-w0",
          "name": "Claws",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "1d6+2",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-nekker-warband-i0",
          "name": "Nekker heart",
          "qty": 1,
          "weight": 0.1,
          "notes": "Alchemy ingredient"
        },
        {
          "id": "npc-pack1-nekker-warband-i1",
          "name": "Nekker eye",
          "qty": 2,
          "weight": 0.1,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Burrow: nekkers can dive into their tunnels and emerge anywhere within 10m next round. Collapsing the burrow (Grapeshot or Dragon's Dream) kills all nekkers inside. Vulnerable: Ogroid oil.",
      "background": "Squabbling little ogroids that dig warrens in riverbanks and swarm anything smaller than a cart.",
      "notes": "Monster · Ogroid · Threat: Easy (use 6-10)\n\nTactics: swarm, grab weapons and run off with shiny things. They flee when half the band is dead.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-starving-wolf",
      "schema": 1,
      "kind": "npc",
      "name": "Starving Winter Wolf",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Kaedweni forests",
      "stats": {
        "INT": 1,
        "REF": 7,
        "DEX": 1,
        "BODY": 5,
        "SPD": 9,
        "EMP": 1,
        "CRA": 1,
        "WILL": 4,
        "LUCK": 0
      },
      "skills": {
        "awareness": 6,
        "brawling": 5,
        "dodge-escape": 4,
        "athletics": 6,
        "stealth": 5,
        "wilderness-survival": 6
      },
      "customSkills": [],
      "hp": {
        "current": 22,
        "maxOverride": 22
      },
      "sta": {
        "current": 25,
        "maxOverride": 25
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Thick winter fur",
          "sp": 2,
          "maxSp": 2
        },
        "torso": {
          "piece": "Thick winter fur",
          "sp": 2,
          "maxSp": 2
        },
        "rArm": {
          "piece": "Thick winter fur",
          "sp": 2,
          "maxSp": 2
        },
        "lArm": {
          "piece": "Thick winter fur",
          "sp": 2,
          "maxSp": 2
        },
        "rLeg": {
          "piece": "Thick winter fur",
          "sp": 2,
          "maxSp": 2
        },
        "lLeg": {
          "piece": "Thick winter fur",
          "sp": 2,
          "maxSp": 2
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-starving-wolf-w0",
          "name": "Bite",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "2d6+1",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Knockdown on a hit of 5+ over defense",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-starving-wolf-i0",
          "name": "Wolf pelt",
          "qty": 1,
          "weight": 2,
          "notes": "Sells for 20 crowns"
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Pack hunter: +2 to hit a target another wolf is already adjacent to. Flees if the pack leader dies or at 5 HP.",
      "background": "Hungry wolves that have lost their fear of people this winter.",
      "notes": "Beast · Threat: Easy (packs of 4-8)\n\nTactics: circle, test the edges of the group, go for the horses first.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-grey-widow",
      "schema": 1,
      "kind": "npc",
      "name": "The Grey Widow",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "Female (spirit)",
      "homeland": "Pontar ford (the old ferry crossing)",
      "stats": {
        "INT": 5,
        "REF": 9,
        "DEX": 7,
        "BODY": 5,
        "SPD": 9,
        "EMP": 2,
        "CRA": 2,
        "WILL": 9,
        "LUCK": 0
      },
      "skills": {
        "awareness": 7,
        "brawling": 6,
        "dodge-escape": 7,
        "stealth": 7,
        "intimidation": 7,
        "courage": 10,
        "spell-casting": 5
      },
      "customSkills": [],
      "hp": {
        "current": 50,
        "maxOverride": 50
      },
      "sta": {
        "current": 60,
        "maxOverride": 60
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-grey-widow-w0",
          "name": "Drowning touch",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "3d6+2",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Target makes Endurance DC 15 or loses 1d6 STA as their lungs fill with water",
          "notes": ""
        },
        {
          "id": "npc-pack1-grey-widow-w1",
          "name": "Wailing grasp",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "2d6",
          "reliability": 99,
          "hands": 2,
          "range": "5m",
          "effect": "Pulls target 4m toward the river",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-grey-widow-i0",
          "name": "Bride's wedding ring",
          "qty": 1,
          "weight": 0,
          "notes": "Her anchor; destroy or return it to her groom's grave to lay her to rest"
        },
        {
          "id": "npc-pack1-grey-widow-i1",
          "name": "Essence of wraith",
          "qty": 1,
          "weight": 0.1,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Mournful Wail",
          "kind": "Spell",
          "staCost": "5",
          "range": "10m radius",
          "duration": "Immediate",
          "defense": "Courage DC 16",
          "effect": "Fail: stunned for 1 round; living water nearby rises to knee height",
          "id": "npc-pack1-grey-widow-s0"
        },
        {
          "name": "Mist Form",
          "kind": "Spell",
          "staCost": "3",
          "range": "Self",
          "duration": "2 rounds",
          "defense": "None",
          "effect": "Incorporeal; only silver, magic, and Moon Dust can harm her",
          "id": "npc-pack1-grey-widow-s1"
        }
      ],
      "perks": "Specter: immune to non-silver, non-magical damage, bleeding, poison, and disease. Returns next night unless her anchor is dealt with. Vulnerable: silver, Specter oil, Yrden traps her corporeal.",
      "background": "A bride who drowned at the ford on her wedding night when the ferry capsized. Her groom was the only one who swam to shore, and he never went back for her.",
      "notes": "Monster · Specter · Threat: Hard\n\nHooks: Old Lesko was that groom's younger brother and knows where he is buried. She only appears after dusk in fog.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-cemetery-mother",
      "schema": 1,
      "kind": "npc",
      "name": "Mother Harrow, Grave Hag",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "Female",
      "homeland": "Harrow's Hill cemetery",
      "stats": {
        "INT": 6,
        "REF": 7,
        "DEX": 6,
        "BODY": 7,
        "SPD": 6,
        "EMP": 2,
        "CRA": 3,
        "WILL": 7,
        "LUCK": 0
      },
      "skills": {
        "awareness": 7,
        "brawling": 6,
        "melee": 6,
        "dodge-escape": 5,
        "stealth": 6,
        "deceit": 6,
        "athletics": 4,
        "courage": 6
      },
      "customSkills": [],
      "hp": {
        "current": 55,
        "maxOverride": 55
      },
      "sta": {
        "current": 45,
        "maxOverride": 45
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Grave-hardened skin",
          "sp": 5,
          "maxSp": 5
        },
        "torso": {
          "piece": "Grave-hardened skin",
          "sp": 5,
          "maxSp": 5
        },
        "rArm": {
          "piece": "Grave-hardened skin",
          "sp": 5,
          "maxSp": 5
        },
        "lArm": {
          "piece": "Grave-hardened skin",
          "sp": 5,
          "maxSp": 5
        },
        "rLeg": {
          "piece": "Grave-hardened skin",
          "sp": 5,
          "maxSp": 5
        },
        "lLeg": {
          "piece": "Grave-hardened skin",
          "sp": 5,
          "maxSp": 5
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-cemetery-mother-w0",
          "name": "Barbed tongue",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "3d6",
          "reliability": 99,
          "hands": 1,
          "range": "6m",
          "effect": "Pulls target adjacent; Poison (25%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-cemetery-mother-w1",
          "name": "Grave claws",
          "skillId": "melee",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (50%)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-cemetery-mother-i0",
          "name": "Grave hag ear",
          "qty": 1,
          "weight": 0.1,
          "notes": "Trophy, proof of kill"
        },
        {
          "id": "npc-pack1-cemetery-mother-i1",
          "name": "Hag's grave-dirt",
          "qty": 1,
          "weight": 0.5,
          "notes": "Alchemy ingredient"
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Old Woman's Guise",
          "kind": "Spell",
          "staCost": "4",
          "range": "Self",
          "duration": "1 hour",
          "defense": "Human Perception DC 18",
          "effect": "Appears as a harmless old widow tending graves",
          "id": "npc-pack1-cemetery-mother-s0"
        }
      ],
      "perks": "Burrow among graves: disappears underground in 1 round and resurfaces within 10m. Heals 10 HP by feeding on a corpse (1 round). Vulnerable: silver, Necrophage oil.",
      "background": "The village thinks the lonely old woman at the cemetery is its gravedigger's mother. The gravedigger has been dead for two years.",
      "notes": "Monster · Necrophage · Threat: Hard\n\nTactics: separate one victim with her guise, then attack underground from behind. Fights at night in the graveyard; flees into her barrow below 15 HP.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-mossback-troll",
      "schema": 1,
      "kind": "npc",
      "name": "Mossback, Bridge Troll",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "Male",
      "homeland": "The old stone bridge at Kettle Creek",
      "stats": {
        "INT": 3,
        "REF": 5,
        "DEX": 4,
        "BODY": 13,
        "SPD": 4,
        "EMP": 3,
        "CRA": 5,
        "WILL": 7,
        "LUCK": 2
      },
      "skills": {
        "awareness": 3,
        "brawling": 6,
        "melee": 5,
        "athletics": 4,
        "dodge-escape": 2,
        "physique": 8,
        "endurance": 6,
        "courage": 6,
        "crafting": 4,
        "language-common-speech": 2
      },
      "customSkills": [],
      "hp": {
        "current": 80,
        "maxOverride": 80
      },
      "sta": {
        "current": 60,
        "maxOverride": 60
      },
      "luckCurrent": 2,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Rock-hard hide",
          "sp": 12,
          "maxSp": 12
        },
        "torso": {
          "piece": "Rock-hard hide",
          "sp": 12,
          "maxSp": 12
        },
        "rArm": {
          "piece": "Rock-hard hide",
          "sp": 12,
          "maxSp": 12
        },
        "lArm": {
          "piece": "Rock-hard hide",
          "sp": 12,
          "maxSp": 12
        },
        "rLeg": {
          "piece": "Rock-hard hide",
          "sp": 12,
          "maxSp": 12
        },
        "lLeg": {
          "piece": "Rock-hard hide",
          "sp": 12,
          "maxSp": 12
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-mossback-troll-w0",
          "name": "Fists like boulders",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "5d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Knockdown",
          "notes": ""
        },
        {
          "id": "npc-pack1-mossback-troll-w1",
          "name": "Hurled stone",
          "skillId": "athletics",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 99,
          "hands": 2,
          "range": "15m",
          "effect": "Knockdown",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-mossback-troll-i0",
          "name": "Collection of \"shinies\"",
          "qty": 1,
          "weight": 10,
          "notes": "Spoons, buckles, a noble's signet ring, a silver locket"
        },
        {
          "id": "npc-pack1-mossback-troll-i1",
          "name": "Troll tongue",
          "qty": 1,
          "weight": 1,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Rock hide: halves damage from blunt weapons. Slow-witted: -3 to resist Deceit and Persuasion. Vulnerable: Ogroid oil, Dancing Star bombs.",
      "background": "Built the bridge himself, block by block, and wants a toll in anything shiny. Likes riddles, beer, and being complimented on his masonry.",
      "notes": "Monster · Ogroid · Threat: Hard (often talkable)\n\nHooks: the noble's signet in his hoard proves who the \"missing heir\" really is. Can be won over with a gift and flattery (Persuasion DC 12). Beating him is hard and pointless.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-aldo-grieg",
      "schema": 1,
      "kind": "npc",
      "name": "Aldo Grieg, the Mill Wolf",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "30",
      "gender": "Male",
      "homeland": "Ellander (the old mill)",
      "stats": {
        "INT": 4,
        "REF": 8,
        "DEX": 6,
        "BODY": 9,
        "SPD": 9,
        "EMP": 2,
        "CRA": 3,
        "WILL": 7,
        "LUCK": 1
      },
      "skills": {
        "awareness": 8,
        "brawling": 7,
        "dodge-escape": 6,
        "athletics": 7,
        "stealth": 5,
        "wilderness-survival": 6,
        "intimidation": 6,
        "physique": 5
      },
      "customSkills": [],
      "hp": {
        "current": 70,
        "maxOverride": 70
      },
      "sta": {
        "current": 60,
        "maxOverride": 60
      },
      "luckCurrent": 1,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Thick fur",
          "sp": 5,
          "maxSp": 5
        },
        "torso": {
          "piece": "Thick fur",
          "sp": 5,
          "maxSp": 5
        },
        "rArm": {
          "piece": "Thick fur",
          "sp": 5,
          "maxSp": 5
        },
        "lArm": {
          "piece": "Thick fur",
          "sp": 5,
          "maxSp": 5
        },
        "rLeg": {
          "piece": "Thick fur",
          "sp": 5,
          "maxSp": 5
        },
        "lLeg": {
          "piece": "Thick fur",
          "sp": 5,
          "maxSp": 5
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-aldo-grieg-w0",
          "name": "Claws",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (50%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-aldo-grieg-w1",
          "name": "Maul",
          "skillId": "brawling",
          "accuracy": -2,
          "damage": "5d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Knockdown; Bleeding (25%)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-aldo-grieg-i0",
          "name": "Iron chain (snapped)",
          "qty": 1,
          "weight": 3,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Regeneration: heals 5 HP a round unless the damage was silver or fire. Keen nose: cannot be surprised by anyone downwind. Vulnerable: silver, Cursed oil, Moon Dust (stops his regeneration and transformation).",
      "background": "The miller's son, cursed by a wronged hedge witch after he left her daughter pregnant and ran. He does not remember what he does on full moon nights.",
      "notes": "Monster · Cursed one (werewolf) · Threat: Hard\n\nHooks: Maud Kessel has been chaining him. The curse can be lifted: bring the witch's daughter and child to him at moonrise, and he must name the child as his own. Human form: use Road bandit stats.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-thorn-stag",
      "schema": 1,
      "kind": "npc",
      "name": "The Thorn Stag",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Wittering Wood (Kaedwen)",
      "stats": {
        "INT": 4,
        "REF": 8,
        "DEX": 5,
        "BODY": 11,
        "SPD": 10,
        "EMP": 1,
        "CRA": 1,
        "WILL": 9,
        "LUCK": 0
      },
      "skills": {
        "awareness": 8,
        "brawling": 8,
        "dodge-escape": 5,
        "athletics": 7,
        "stealth": 6,
        "physique": 7,
        "courage": 10,
        "resist-magic": 6
      },
      "customSkills": [],
      "hp": {
        "current": 90,
        "maxOverride": 90
      },
      "sta": {
        "current": 80,
        "maxOverride": 80
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Bone and briar crown",
          "sp": 14,
          "maxSp": 14
        },
        "torso": {
          "piece": "Bark hide",
          "sp": 10,
          "maxSp": 10
        },
        "rArm": {
          "piece": "Bark hide",
          "sp": 10,
          "maxSp": 10
        },
        "lArm": {
          "piece": "Bark hide",
          "sp": 10,
          "maxSp": 10
        },
        "rLeg": {
          "piece": "Bark hide",
          "sp": 10,
          "maxSp": 10
        },
        "lLeg": {
          "piece": "Bark hide",
          "sp": 10,
          "maxSp": 10
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-thorn-stag-w0",
          "name": "Antler charge",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "6d6",
          "reliability": 99,
          "hands": 2,
          "range": "",
          "effect": "Must move 5m+ first; Knockdown, Bleeding (50%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-thorn-stag-w1",
          "name": "Hooves",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-thorn-stag-i0",
          "name": "Grafted heart (leshen)",
          "qty": 1,
          "weight": 2,
          "notes": "Worth 1,000 crowns to a mage; Sabina Aerdt wants it back"
        },
        {
          "id": "npc-pack1-thorn-stag-i1",
          "name": "Thorn antler",
          "qty": 1,
          "weight": 5,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Briar Spread",
          "kind": "Spell",
          "staCost": "6",
          "range": "12m radius",
          "duration": "3 rounds",
          "defense": "Dodge",
          "effect": "2d6 piercing per round to anyone in the area; difficult terrain",
          "id": "npc-pack1-thorn-stag-s0"
        },
        {
          "name": "Call the Wood",
          "kind": "Spell",
          "staCost": "8",
          "range": "30m",
          "duration": "Scene",
          "defense": "None",
          "effect": "Summons 1d6 wolves (Starving Winter Wolf) with thorns growing from their backs",
          "id": "npc-pack1-thorn-stag-s1"
        }
      ],
      "perks": "Heart-bound: while its grafted heart beats it regains 10 HP per round in the forest. The heart can be cut out by a called shot to the torso (-3) after 30+ damage. Vulnerable: silver, Relict oil, fire (double damage), Dragon's Dream.",
      "background": "A giant red stag into which Sabina Aerdt grafted the heart of a slain leshen. The experiment escaped. Now the wood itself follows it.",
      "notes": "Monster · Relict (magical graft) · Threat: Deadly\n\nTactics: stalks through fog, charges the most isolated target, then retreats into the briar. Villagers leave offerings at the tree line.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-lady-ysolde",
      "schema": 1,
      "kind": "npc",
      "name": "Lady Ysolde",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "Ancient (looks 25)",
      "gender": "Female",
      "homeland": "Toussaint-bordered estates (claims noble birth)",
      "stats": {
        "INT": 8,
        "REF": 10,
        "DEX": 8,
        "BODY": 9,
        "SPD": 10,
        "EMP": 6,
        "CRA": 4,
        "WILL": 9,
        "LUCK": 3
      },
      "skills": {
        "awareness": 8,
        "social-etiquette": 7,
        "human-perception": 7,
        "brawling": 8,
        "dodge-escape": 8,
        "athletics": 7,
        "stealth": 8,
        "seduction": 7,
        "deceit": 7,
        "charisma": 6,
        "intimidation": 7,
        "courage": 8,
        "resist-magic": 6,
        "language-common-speech": 8,
        "language-elder-speech": 7
      },
      "customSkills": [],
      "hp": {
        "current": 100,
        "maxOverride": 100
      },
      "sta": {
        "current": 80,
        "maxOverride": 80
      },
      "luckCurrent": 3,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "torso": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lArm": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "rLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        },
        "lLeg": {
          "piece": "",
          "sp": 0,
          "maxSp": 0
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-lady-ysolde-w0",
          "name": "Talons",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "5d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (50%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-lady-ysolde-w1",
          "name": "Blood-drinking bite",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "3d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Heals her for damage dealt",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-lady-ysolde-i0",
          "name": "Signet ring of a dead house",
          "qty": 1,
          "weight": 0,
          "notes": ""
        },
        {
          "id": "npc-pack1-lady-ysolde-i1",
          "name": "Bruxa's blood",
          "qty": 1,
          "weight": 0.1,
          "notes": "Alchemy ingredient; used for Black Blood"
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Sonic Scream",
          "kind": "Spell",
          "staCost": "6",
          "range": "10m cone",
          "duration": "Immediate",
          "defense": "Endurance DC 18",
          "effect": "Fail: stunned 1 round and knocked prone",
          "id": "npc-pack1-lady-ysolde-s0"
        },
        {
          "name": "Invisibility",
          "kind": "Spell",
          "staCost": "4",
          "range": "Self",
          "duration": "3 rounds",
          "defense": "Awareness DC 20 to track",
          "effect": "Invisible; her next attack is +3",
          "id": "npc-pack1-lady-ysolde-s1"
        }
      ],
      "perks": "Regeneration: heals 10 HP per round unless hit with silver, Vampire oil, or Moon Dust. Only truly dies if her remains are burned. Vulnerable: silver, Vampire oil, Black Blood, Moon Dust.",
      "background": "Plays at being a widowed baroness hosting evenings of wine and music. Her guests have a habit of leaving pale and returning as her servants.",
      "notes": "Monster · Higher vampire (bruxa) · Threat: Deadly\n\nTactics: toys with victims socially first. In combat: invisibility, then scream, then talons on whoever is stunned. Radek of Ban Glean has a contract on her and will not share it.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-arachas-broodmother",
      "schema": 1,
      "kind": "npc",
      "name": "Silkhollow Broodmother",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Silkhollow caves",
      "stats": {
        "INT": 2,
        "REF": 7,
        "DEX": 5,
        "BODY": 12,
        "SPD": 6,
        "EMP": 1,
        "CRA": 1,
        "WILL": 7,
        "LUCK": 0
      },
      "skills": {
        "awareness": 6,
        "brawling": 7,
        "dodge-escape": 3,
        "athletics": 4,
        "stealth": 4,
        "physique": 7,
        "courage": 8
      },
      "customSkills": [],
      "hp": {
        "current": 85,
        "maxOverride": 85
      },
      "sta": {
        "current": 60,
        "maxOverride": 60
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Chitin",
          "sp": 14,
          "maxSp": 14
        },
        "torso": {
          "piece": "Carapace",
          "sp": 16,
          "maxSp": 16
        },
        "rArm": {
          "piece": "Chitin legs",
          "sp": 10,
          "maxSp": 10
        },
        "lArm": {
          "piece": "Chitin legs",
          "sp": 10,
          "maxSp": 10
        },
        "rLeg": {
          "piece": "Chitin legs",
          "sp": 10,
          "maxSp": 10
        },
        "lLeg": {
          "piece": "Chitin legs",
          "sp": 10,
          "maxSp": 10
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-arachas-broodmother-w0",
          "name": "Mandibles",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "5d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Poison (50%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-arachas-broodmother-w1",
          "name": "Web spit",
          "skillId": "athletics",
          "accuracy": 0,
          "damage": "0",
          "reliability": 99,
          "hands": 1,
          "range": "12m",
          "effect": "Entangled; DC 16 Physique to break free",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-arachas-broodmother-i0",
          "name": "Arachas eyes",
          "qty": 2,
          "weight": 0.1,
          "notes": "Alchemy ingredient"
        },
        {
          "id": "npc-pack1-arachas-broodmother-i1",
          "name": "Arachas venom sac",
          "qty": 1,
          "weight": 0.5,
          "notes": ""
        },
        {
          "id": "npc-pack1-arachas-broodmother-i2",
          "name": "Web-wrapped caravan goods",
          "qty": 1,
          "weight": 15,
          "notes": "200 crowns of silk and spices"
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Venom Cloud",
          "kind": "Spell",
          "staCost": "5",
          "range": "6m radius",
          "duration": "3 rounds",
          "defense": "Endurance DC 16",
          "effect": "Fail: poisoned and -2 to all actions",
          "id": "npc-pack1-arachas-broodmother-s0"
        }
      ],
      "perks": "Brood: 1d3 young arachas (use Hollowbank Nekker stats with Poison 25%) hatch each round she spends not attacking. Armored: only called shots to the head (-6) bypass her carapace easily. Vulnerable: Insectoid oil, fire, Northern Wind.",
      "background": "A giant arachas that has laired in the caves above the trade road and is filling them with eggs.",
      "notes": "Monster · Insectoid · Threat: Hard\n\nTactics: webs the front line, lets the young swarm, pins a victim and poisons it. Burning the egg chamber ends the threat for good.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-redcrest-wyvern",
      "schema": 1,
      "kind": "npc",
      "name": "Redcrest",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Crags above the Mayena road",
      "stats": {
        "INT": 3,
        "REF": 8,
        "DEX": 5,
        "BODY": 11,
        "SPD": 8,
        "EMP": 1,
        "CRA": 1,
        "WILL": 7,
        "LUCK": 0
      },
      "skills": {
        "awareness": 7,
        "brawling": 7,
        "dodge-escape": 6,
        "athletics": 7,
        "physique": 6,
        "courage": 8
      },
      "customSkills": [],
      "hp": {
        "current": 90,
        "maxOverride": 90
      },
      "sta": {
        "current": 70,
        "maxOverride": 70
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Scaled crest",
          "sp": 10,
          "maxSp": 10
        },
        "torso": {
          "piece": "Scales",
          "sp": 12,
          "maxSp": 12
        },
        "rArm": {
          "piece": "Wing membrane",
          "sp": 4,
          "maxSp": 4
        },
        "lArm": {
          "piece": "Wing membrane",
          "sp": 4,
          "maxSp": 4
        },
        "rLeg": {
          "piece": "Scaled legs",
          "sp": 10,
          "maxSp": 10
        },
        "lLeg": {
          "piece": "Scaled legs",
          "sp": 10,
          "maxSp": 10
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-redcrest-wyvern-w0",
          "name": "Tail stinger",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "4d6",
          "reliability": 99,
          "hands": 1,
          "range": "4m",
          "effect": "Poison (75%)",
          "notes": ""
        },
        {
          "id": "npc-pack1-redcrest-wyvern-w1",
          "name": "Diving bite",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "5d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Must dive from flight; Knockdown",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-redcrest-wyvern-i0",
          "name": "Wyvern egg",
          "qty": 1,
          "weight": 3,
          "notes": "Worth 400 crowns to a Kovirian collector"
        },
        {
          "id": "npc-pack1-redcrest-wyvern-i1",
          "name": "Wyvern venom gland",
          "qty": 1,
          "weight": 0.5,
          "notes": ""
        }
      ],
      "crowns": 0,
      "spells": [],
      "perks": "Flight: out of melee reach while airborne; ranged attacks at -2. Grounding it (Aard, Northern Wind, or wings hit for 20+ total) removes flight. Vulnerable: Draconid oil, Grapeshot when grounded.",
      "background": "A red-crested wyvern nesting in the crags above the toll road. It has taken three of Sergeant Vell's horses this month.",
      "notes": "Monster · Draconid (wyvern) · Threat: Hard\n\nTactics: dives, stings, climbs back out of reach. Defends its egg to the death if the nest is threatened.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    },
    {
      "id": "npc-pack1-marsh-foglet",
      "schema": 1,
      "kind": "npc",
      "name": "The Rotfen Foglet",
      "player": "",
      "race": "Monster",
      "profession": "",
      "definingSkill": "",
      "definingSkillValue": 0,
      "school": "",
      "age": "",
      "gender": "—",
      "homeland": "Rotfen marshes",
      "stats": {
        "INT": 6,
        "REF": 8,
        "DEX": 6,
        "BODY": 5,
        "SPD": 8,
        "EMP": 3,
        "CRA": 2,
        "WILL": 7,
        "LUCK": 0
      },
      "skills": {
        "awareness": 7,
        "brawling": 6,
        "dodge-escape": 7,
        "stealth": 8,
        "deceit": 5,
        "athletics": 5
      },
      "customSkills": [],
      "hp": {
        "current": 40,
        "maxOverride": 40
      },
      "sta": {
        "current": 50,
        "maxOverride": 50
      },
      "luckCurrent": 0,
      "vigor": 0,
      "armor": {
        "head": {
          "piece": "Wet grey skin",
          "sp": 2,
          "maxSp": 2
        },
        "torso": {
          "piece": "Wet grey skin",
          "sp": 2,
          "maxSp": 2
        },
        "rArm": {
          "piece": "Wet grey skin",
          "sp": 2,
          "maxSp": 2
        },
        "lArm": {
          "piece": "Wet grey skin",
          "sp": 2,
          "maxSp": 2
        },
        "rLeg": {
          "piece": "Wet grey skin",
          "sp": 2,
          "maxSp": 2
        },
        "lLeg": {
          "piece": "Wet grey skin",
          "sp": 2,
          "maxSp": 2
        }
      },
      "weapons": [
        {
          "id": "npc-pack1-marsh-foglet-w0",
          "name": "Long claws",
          "skillId": "brawling",
          "accuracy": 0,
          "damage": "3d6",
          "reliability": 99,
          "hands": 1,
          "range": "",
          "effect": "Bleeding (25%)",
          "notes": ""
        }
      ],
      "crits": [],
      "lifeEvents": [],
      "conditions": "",
      "items": [
        {
          "id": "npc-pack1-marsh-foglet-i0",
          "name": "Foglet teeth",
          "qty": 1,
          "weight": 0.1,
          "notes": "Alchemy ingredient"
        }
      ],
      "crowns": 0,
      "spells": [
        {
          "name": "Fog",
          "kind": "Spell",
          "staCost": "5",
          "range": "30m radius",
          "duration": "Scene",
          "defense": "None",
          "effect": "Thick fog: -4 to Awareness and ranged attacks for everyone but the foglet",
          "id": "npc-pack1-marsh-foglet-s0"
        },
        {
          "name": "Lantern Lure",
          "kind": "Spell",
          "staCost": "3",
          "range": "40m",
          "duration": "1 round",
          "defense": "Resist Magic DC 14",
          "effect": "A ghost-light draws the target 5m toward it",
          "id": "npc-pack1-marsh-foglet-s1"
        }
      ],
      "perks": "Fog-shifter: while its fog is up it can turn incorporeal for 1 round (3 STA) and reappear up to 10m away. Destroying the fog (Aard, Northern Wind) makes it lose this. Vulnerable: silver, Necrophage oil, Aard dispersing the fog.",
      "background": "A marsh ghost that leads travellers off the causeway with lantern lights, then feeds on the drowned. The Rotfen drowners follow it like crows follow a wolf.",
      "notes": "Monster · Necrophage · Threat: Medium\n\nTactics: fog first, lure the weakest target off the path into drowner-infested water, strike from behind.",
      "ip": 0,
      "createdAt": 1790748446494,
      "updatedAt": 1790748446494
    }
  ]
}
