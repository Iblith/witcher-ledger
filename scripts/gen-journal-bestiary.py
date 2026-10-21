"""Generates src/model/journalBestiary.data.ts from the text of A Witcher's Journal.

Usage: python3 -I scripts/gen-journal-bestiary.py <A_Witchers_Journal.txt> src/model/journalBestiary.data.ts

The text file is in the project's shared rules folder, not in this repo. Exceptional monsters
(true dragons, higher vampires) are skipped: the book builds those from tables.
"""
import re, json, sys
lines = [l.rstrip() for l in open(sys.argv[1], encoding='utf-8')]
sup = [i for i, l in enumerate(lines) if l.startswith('Commoner Superstition (Education DC')]
CATS = ['Necrophage']*3 + ['Specter']*3 + ['Beast']*3 + ['Cursed One']*3 + ['Hybrid']*3 + ['Insectoid']*3 + ['Elementa']*3 + ['Relict']*3 + ['Ogroid']*3 + ['Draconid']*3 + ['Vampire']*3
STATS = ['INT','REF','DEX','BODY','SPD','EMP','CRA','WILL','STUN','RUN','LEAP','STA','ENC','REC','HP']
out = []
for n, s in enumerate(sup):
    end = sup[n+1] if n+1 < len(sup) else len(lines)
    # name: line after the nearest preceding page-number line
    j = s
    while not re.fullmatch(r'\d+', lines[j]): j -= 1
    page, name = int(lines[j]), lines[j+1].strip()
    blk = lines[s:end]
    def after(label, stop):
        i = blk.index(label) + 1; vals = []
        while not stop(blk[i]): vals.append(blk[i].strip()); i += 1
        return vals
    m = {}
    m['name'] = name; m['page'] = page; m['category'] = CATS[n] if n < len(CATS) else '?'
    m['susceptibilities'] = ' '.join(after('Susceptibilities', lambda l: l == 'Skill Base')).replace(' ,', ',')
    sk = after('Skill Base', lambda l: l.startswith('Dodge Base'))
    m['skills'] = []
    for x in sk:
        mm = re.match(r'(.+?) ?(\d+)$', x)
        if not mm: continue
        m['skills'].append((mm.group(1), int(mm.group(2))))
    def num(prefix):
        for l in blk:
            mm = re.match(re.escape(prefix) + r'\s+(\d+)', l)
            if mm: return int(mm.group(1))
        return None
    m['dodge'] = num('Dodge Base'); m['reposition'] = num('Reposition Base'); m['block'] = num('Block Base')
    bi = blk.index('Bounty'); m['bounty'] = blk[bi+1].strip()
    m['armor'] = num('Armor')
    rg = next(l for l in blk if l.startswith('Regeneration')); m['regeneration'] = rg.split(' ', 1)[1].strip()
    m['resistances'] = ' '.join(after('Resistances', lambda l: l == 'Immunities'))
    m['immunities'] = ' '.join(after('Immunities', lambda l: l.strip() in ('Easy', 'Medium', 'Hard', 'Exceptional') or l.strip()=='Intelligence'))
    di = next(i for i, l in enumerate(blk) if l.strip() in ('Easy', 'Medium', 'Hard', 'Exceptional'))
    m['threat'] = blk[di] + ', ' + blk[di+1]
    m['intelligence'] = blk[blk.index('Intelligence') + 1]
    m['senses'] = ', '.join(x for x in ' '.join(after('Senses', lambda l: l.startswith('INT '))).replace('Superior Night Vision','SNV').replace('Night Vision','NV').replace('Scent Tracking','ST').split(' ') if x != '—').replace('SNV','Superior Night Vision').replace('NV','Night Vision').replace('ST','Scent Tracking')
    for k in STATS:
        v = num(k)
        m[k] = v
    for k in ['Height', 'Weight', 'Environment', 'Organization']:
        hit = [re.search(k + r' (.+)$', l) for l in blk]
        hit = [h.group(1) for h in hit if h]
        m[k.lower()] = hit[0] if hit else ''
    ai = next(i for i, l in enumerate(blk) if l.startswith('Base Type DMG'))
    atks = []; i = ai + 1
    head = re.compile(r'^(.+?) (\d+) ([A-Z]+(?:/[A-Z]+)*) (\S*\d*d\d+\S*|\S+) (\d+|—) ?(.*)$')
    while i < len(blk):
        l = blk[i].strip(); mm = head.match(l)
        if not mm or len(l) > 120: break
        k = 1
        while not re.search(r' (\d+|—)$', l) and k < 3:
            l = l + ' ' + blk[i+k].strip(); k += 1
        mm = head.match(l)
        nm, atk, typ, dmg, rel, rest = mm.groups()
        toks = rest.split(' ')
        rof = toks.pop() if toks and re.fullmatch(r'\d+|—', toks[-1]) else ''
        rng = toks.pop(0) if toks and re.fullmatch(r'—|[\d.]+m', toks[0]) else '—'
        eff = ' '.join(toks) or '—'
        atks.append(dict(name=nm, atk=int(atk), type=typ, dmg=dmg, rel=rel, rng=rng, effect=eff, rof=rof))
        i += k
    m['attacks'] = atks
    m['unparsed_after_attacks'] = blk[i][:80]
    m['abilities'] = [l.split(':', 1)[1].strip() for l in blk if re.match(r'^(Ability|Alternate Form): ', l)]
    m['lore_dc'] = next((l for l in blk if l.startswith('Lore & Behavior')), '')
    out.append(m)

out = [m for m in out if m['category'] != '?']
assert len(out) == 33, len(out)
def ts(v): return json.dumps(v, ensure_ascii=False)
rows = []
for m in out:
    stats = [m[k] for k in ['INT','REF','DEX','BODY','SPD','EMP','CRA','WILL']]
    atks = ', '.join('{ name: %s, base: %d, type: %s, damage: %s, reliability: %s, range: %s, effect: %s, rof: %s }' % (
        ts(a['name']), a['atk'], ts(a['type']), ts(a['dmg']), a['rel'] if a['rel'].isdigit() else 0,
        ts('' if a['rng'] == '—' else a['rng']), ts('' if a['effect'] == '—' else a['effect']), a['rof'] if a['rof'].isdigit() else 1) for a in m['attacks'])
    dash = lambda x: '' if x in ('—', '') else x
    rows.append(f"""  {{
    name: {ts(m['name'])},
    page: {m['page']},
    category: {ts(m['category'])},
    threat: {ts(m['threat'])},
    intelligence: {ts(m['intelligence'])},
    senses: {ts(m['senses'])},
    stats: {ts(stats)},
    hp: {m['HP']},
    sta: {m['STA']},
    armor: {m['armor']},
    regeneration: {ts(dash(m['regeneration']))},
    resistances: {ts(dash(m['resistances']))},
    immunities: {ts(dash(m['immunities']))},
    susceptibilities: {ts(dash(m['susceptibilities']))},
    skills: {{ {', '.join(f'{ts(k)}: {v}' for k, v in m['skills'])} }},
    dodge: {m['dodge']},
    reposition: {m['reposition'] if m['reposition'] is not None else 'null'},
    block: {m['block']},
    attacks: [{atks}],
    abilities: {ts(m['abilities'])},
    bounty: {ts(m['bounty'].replace(' Crowns', ''))},
    environment: {ts(m['environment'])},
    organization: {ts(m['organization'])},
  }}""")
hdr = """// Generated by scripts/gen-journal-bestiary.py from A Witcher's Journal (R. Talsorian, 2020).
// Edit the generator, not this file. Skill values are the book's skill bases (stat included);
// attack bases are the book's ATK base. Ability names only: read the book for their rules.
import type { JournalMonster } from './journalBestiary'

export const JOURNAL_MONSTERS: JournalMonster[] = [
"""
open(sys.argv[2], 'w').write(hdr + ',\n'.join(rows) + ',\n]\n')
print('wrote', len(rows))
