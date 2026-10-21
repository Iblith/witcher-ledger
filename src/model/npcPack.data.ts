// Generated from npc-pack-1.json (original NPCs and monsters): only the ones the campaign uses.
// Edit the generator, not this file.
export const NPC_PACK_DATA: unknown = {
  "app": "witcher-ttrpg",
  "schema": 1,
  "characters": [
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
      "createdAt": 1792554726563,
      "updatedAt": 1792554726563
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
      "createdAt": 1792554726563,
      "updatedAt": 1792554726563
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
      "createdAt": 1792554726563,
      "updatedAt": 1792554726563
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
      "createdAt": 1792554726563,
      "updatedAt": 1792554726563
    }
  ]
}
