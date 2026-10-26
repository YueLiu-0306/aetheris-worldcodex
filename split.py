# -*- coding: utf-8 -*-
"""将单文件 index.html 拆分为多页面 + 共享 css/js"""
import re, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('index.html', encoding='utf-8').read()

css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
js = re.search(r'<script>(.*?)</script>', src, re.S).group(1)
header = re.search(r'<header id="top">.*?</header>', src, re.S).group(0)
footer = re.search(r'<footer>.*?</footer>', src, re.S).group(0)
sections = dict(re.findall(r'<section id="(\w+)".*?</section>', src, re.S) and
                [(m.group(1), m.group(0)) for m in re.finditer(r'<section id="(\w+)".*?</section>', src, re.S)])

# nav active style
css += """
nav .links a.on{color:var(--glow)}
nav .links a.on::after{width:100%}
"""

# ---- split JS into modules and guard ----
markers = ['// clickable profile map', '// erosion simulator',
           "// ---------- event calendar ----------", "// ---------- faction graph ----------",
           "// ---------- surface overview map ----------", "// nav shrink"]
idx = [js.index(m) for m in markers]
head = js[:idx[0]]
prof, ero = js[idx[0]:idx[1]], js[idx[1]:idx[2]]
cal, fac, smap = js[idx[2]:idx[3]], js[idx[3]:idx[4]], js[idx[4]:idx[5]]
tail = js[idx[5]:]

def guard(code, cond):
    body = '\n'.join('  ' + l if l.strip() else l for l in code.splitlines())
    return f'if ({cond}) {{\n{body}\n}}\n'

main_js = (head
    + guard(prof, "document.getElementById('pdetail')")
    + guard(ero, "document.getElementById('erFill')")
    + guard(cal, "document.getElementById('calGrid')")
    + guard(fac, "document.getElementById('fgraph')")
    + guard(smap, "document.getElementById('smap')")
    + tail)
os.makedirs('css', exist_ok=True); os.makedirs('js', exist_ok=True)
open('css/style.css', 'w', encoding='utf-8').write(css)
open('js/main.js', 'w', encoding='utf-8').write(main_js)

# ---- nav template ----
LINKS = [('index.html#ether', '以太'), ('index.html#history', '观测史'), ('index.html#am001', 'AM-001'),
         ('regions.html', '区域与地图'), ('factions.html', '势力'), ('powers.html', '异能'),
         ('bestiary.html', '异构体'), ('economy.html', '结晶经济')]

def nav(page):
    items = []
    for href, name in LINKS:
        active = ' class="on"' if href.startswith(page) else ''
        items.append(f'<a href="{href}"{active}>{name}</a>')
    return f'''<nav id="nav">
  <a class="logo" href="index.html"><b>Æ</b>THERIS</a>
  <div class="links">{''.join(items)}</div>
</nav>'''

def page(fname, title, body, act):
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} · AETHERIS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;500;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<div id="veil"></div><div id="grain"></div>
<canvas id="particles"></canvas>
<div class="sigil a"></div><div class="sigil b"></div>
<div id="progress"></div>
{nav(act)}
{body}
{footer}
<script src="js/main.js"></script>
</body>
</html>'''
    open(fname, 'w', encoding='utf-8').write(html)

SEC = lambda i: sections[i]

# page bodies
open('_body_index.html','w',encoding='utf-8').write(header + SEC('ether') + SEC('history') + SEC('am001'))
open('_body_regions.html','w',encoding='utf-8').write(SEC('regions'))
open('_body_factions.html','w',encoding='utf-8').write(SEC('factions'))
open('_body_powers.html','w',encoding='utf-8').write(SEC('powers'))
open('_body_bestiary.html','w',encoding='utf-8').write(SEC('bestiary'))
open('_body_economy.html','w',encoding='utf-8').write(SEC('crystal') + SEC('gloss'))

def headblock(title):
    return f'<div class="sec-tag">Aetheris Codex</div><h2 style="padding-top:2rem">{title}</h2>'

def full(fname, title, act, body, sub=None):
    lead = f'<section>{headblock(title)}<p class="sec-intro">{sub}</p></section>' if sub else ''
    page(fname, title, lead + body, act)

full('index.html', 'AETHERIS', 'index.html',
     header + SEC('ether') + SEC('history') + SEC('am001'))
full('regions.html', '区域与地图', 'regions.html', SEC('regions'),
     '越深入，以太越浓；越浓，越危险——但回报也越丰厚。没有免费的午餐。')
full('factions.html', '势力', 'factions.html', SEC('factions'),
     'AM-001 的存在催生了前所未有的组织。它们立场各异、使命不同，围绕探索、研究与定居织成一张复杂的网。')
full('powers.html', '适格者与异能', 'powers.html', SEC('powers'),
     '长期居住于褶皱点附近的个体，有概率发展出以太交互能力——从初级的被动感知，到高级的主动干涉。但每一次使用，都在透支你自己。')
full('bestiary.html', '异构体图鉴', 'bestiary.html', SEC('bestiary'),
     '以太凝聚而成的半自主异常实体。密度越高的区域，它们越多、越大、越强。')
full('economy.html', '结晶与经济', 'economy.html', SEC('crystal') + SEC('gloss'),
     '以太结晶是一切以太科技的能量来源，也是定居者间的非官方硬通货。消耗后不可再生——除非深入更危险的区域。')

for f in os.listdir('.'):
    if f.startswith('_body_'): os.remove(f)
print('done:', sorted(f for f in os.listdir('.') if f.endswith('.html')))
