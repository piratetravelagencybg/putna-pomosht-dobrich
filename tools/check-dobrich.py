#!/usr/bin/env python3
"""Phase 4 source, schema-content, scope and optional HTTP checks; no site writes."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import tarfile
import sys
from urllib.request import urlopen
from urllib.error import HTTPError
import runpy
seo = runpy.run_path(str(Path(__file__).with_name('check-seo.py')))
Page, ROOT, VOID, PAGES = (seo[key] for key in ('Page','ROOT','VOID','PAGES'))

class Strict(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.stack = []; self.feed(text)
        assert not self.stack, ('unclosed tags', self.stack)
    def handle_starttag(self, tag, attrs):
        if tag not in VOID: self.stack.append(tag)
    def handle_startendtag(self, tag, attrs): pass
    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1] == tag, (self.getpos(), tag, self.stack[-5:])
        self.stack.pop()

bg = Page((ROOT/'patna-pomosht-dobrich.html').read_text())
en = Page((ROOT/'en/roadside-assistance-dobrich.html').read_text())
for page in (bg, en):
    Strict(page.source)
    graph = page.schemas()[0]['@graph']
    assert len([n for n in graph if n['@type'] == 'FAQPage']) == 1
    assert not any(n['@type'] in ('LocalBusiness','AutomotiveBusiness') for n in graph)
    service = next(n for n in graph if n['@type'] == 'Service')
    assert service['provider']['@id'] == 'https://www.putnapomoshtsisi.com/#business'
    faq = next(n for n in graph if n['@type'] == 'FAQPage')
    visible = '\n'.join(n['text'] for n in page.select('main'))
    for question in faq['mainEntity']:
        assert question['name'] in visible
        assert question['acceptedAnswer']['text'] in visible
    for forbidden in ('30 минути','30 minutes','5400','5,400','Е70','E70','Локална SEO страница','Не начисляваме'):
        assert forbidden not in page.source, forbidden
    for n in page.select('img'):
        assert n['attrs'].get('alt') and n['attrs'].get('width') and n['attrs'].get('height')
    assert all(n['attrs']['href'] == 'tel:+359896661319' for n in page.select('a') if n['attrs'].get('href','').startswith('tel:'))
assert not [n for n in bg.select('section') if 'footer' in n['parents']]
assert len([n for n in bg.select('button') if 'data-home-location' in n['attrs']]) == 2
assert len([n for n in bg.select('button') if 'data-faq-button' in n['attrs']]) == 8
assert len(bg.select('dialog')) == 1
assert 'https://share.google/nfyszpwGISBmeHkoz' in bg.source
home = Page((ROOT/'index.html').read_text())
assert home.schemas()[0]['@id'] == 'https://www.putnapomoshtsisi.com/#business'
assert 'Пътна помощ Добрич 24/7' in home.source
assert json.loads((ROOT/'tools/cases/dobrich.json').read_text())['cases'] == []

snapshot = ROOT.parent/'seo-phase4-before-2026-09-21.tgz'
allowed = {'patna-pomosht-dobrich.html','en/roadside-assistance-dobrich.html','index.html','SEO_REBUILD_PROGRESS.md','.vercelignore'}
unchanged = 0
with tarfile.open(snapshot) as archive:
    for member in archive.getmembers():
        name = member.name.removeprefix('./')
        if not member.isfile() or any(p.startswith('._') for p in Path(name).parts) or name in allowed: continue
        assert (ROOT/name).read_bytes() == archive.extractfile(member).read(), 'Out-of-scope change: '+name
        unchanged += 1
    before_home = archive.extractfile('./index.html').read().decode()
    expected = before_home.replace('"@type": "AutomotiveBusiness",','"@type": "AutomotiveBusiness",\n  "@id": "https://www.putnapomoshtsisi.com/#business",').replace('<span>Пътна помощ Добрич</span>','<span>Пътна помощ Добрич 24/7</span>')
    assert home.source == expected, 'Homepage changed beyond ID and anchor'
print(f'PASS: strict tag nesting BG/EN, FAQ 8 BG/4 EN matches visible text, provider, CTA, assets, footer cleanup; {unchanged} pre-existing files unchanged; homepage only ID/anchor.')
if len(sys.argv) > 1:
    base = sys.argv[1].rstrip('/')
    for name in sorted(PAGES):
        with urlopen(base+'/'+name, timeout=10) as response:
            assert response.status == 200
            assert response.read() == (ROOT/name).read_bytes()
    try:
        urlopen(base+'/phase4-missing-check.html', timeout=10)
        raise AssertionError('Missing URL should be 404')
    except HTTPError as error:
        assert error.code == 404
    print('PASS: 30/30 HTML HTTP 200 and byte match; missing URL 404. Static server does not test Vercel redirects.')
