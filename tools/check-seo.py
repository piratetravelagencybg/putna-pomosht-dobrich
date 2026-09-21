#!/usr/bin/env python3
"""Dependency-free source SEO checks. Does not edit or publish the site.

Run: python3 tools/check-seo.py
During Phase 1 also run: python3 tools/check-seo.py --phase1-baseline <git-ref>
--files limits page checks while editing one reviewed batch (no sitemap/pair checks).
"""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.putnapomoshtsisi.com'
PAIRS = [('index.html', 'en/index.html'), ('repatrirane.html', 'en/towing.html')] + [
    (f'patna-pomosht-{city}.html', f'en/roadside-assistance-{city}.html')
    for city in ('dobrich', 'varna', 'balchik', 'kavarna', 'albena', 'kranevo')
]
PAGES = {'index.html', 'en/index.html', 'en/contact.html', 'en/towing.html',
    'repatrirane.html', 'kran-uslugi.html', 'podavane-na-tok.html', 'smqna-na-guma.html',
    'avto-klyuchar.html', 'transportni-uslugi.html', 'transport-konteineri-jelqzo.html',
    'transport-zemedelska-tehnika.html', 'dopalnitelna-usluga-kombi.html',
    'patna-pomosht-avtobusi.html', 'patna-pomosht-kamioni.html', 'patna-pomosht-mikrobusi.html',
    'patna-pomosht-general-toshevo.html', 'patna-pomosht-silistra.html'}
PAGES.update(name for pair in PAIRS for name in pair)
KNOWN_ANCHORS = {('index.html', 'TODO-GBP-LINK'), ('en/index.html', 'TODO-GBP-LINK')}
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

def canonical(name):
    return ORIGIN + ('/' if name == 'index.html' else '/' + name)

def normalized_urls(text):
    if not isinstance(text, str):
        return text
    text = re.sub(r'https?://(?:www\.)?putnapomoshtsisi\.com(?=[/\s"\'<>]|$)', ORIGIN, text)
    text = re.sub(re.escape(ORIGIN)+r'/index\.html(?=[?#\s"\'<>]|$)', ORIGIN+'/', text)
    return re.sub(re.escape(ORIGIN)+r'(?=[\s"\'<>]|$)', ORIGIN+'/', text)

def target_of(ref, name):
    url = urlsplit(urljoin(canonical(name), ref))
    if url.scheme not in ('http', 'https') or url.hostname not in ('www.putnapomoshtsisi.com','putnapomoshtsisi.com'):
        return None
    name = unquote(url.path).lstrip('/') or 'index.html'
    if name.endswith('/'):
        name += 'index.html'
    return name, unquote(url.fragment)

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.source, self.nodes, self.stack = text, [], []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        node = {'tag':tag, 'attrs':dict(attrs), 'line':self.getpos()[0], 'text':'', 'parents':[n['tag'] for n in self.stack]}
        self.nodes.append(node)
        if tag not in VOID:
            self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]['tag'] == tag:
                del self.stack[i:]
                break
    def handle_data(self, text):
        for node in self.stack:
            node['text'] += text
    def select(self, tag):
        return [n for n in self.nodes if n['tag'] == tag]
    def alternates(self):
        return {n['attrs']['hreflang']:n['attrs'].get('href') for n in self.select('link')
                if n['attrs'].get('rel') == 'alternate' and 'hreflang' in n['attrs']}
    def schemas(self):
        return [json.loads(n['text']) for n in self.select('script') if n['attrs'].get('type') == 'application/ld+json']

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--files', nargs='+')
    parser.add_argument('--phase1-baseline', metavar='GIT_REF')
    args = parser.parse_args()
    errors, warnings = [], []
    def require(condition, message):
        if not condition:
            errors.append(message)
    pages = {p.relative_to(ROOT).as_posix():Page(p.read_text()) for p in list(ROOT.glob('*.html'))+list((ROOT/'en').glob('*.html'))}
    selected = args.files or sorted(pages)
    require(set(pages) == PAGES, 'Page inventory changed: '+repr(set(pages)^PAGES))
    for name in selected:
        if name not in pages:
            errors.append('Missing page '+name)
            continue
        page = pages[name]
        nodes = page.nodes
        meta = {n['attrs'].get('name', n['attrs'].get('property')):n['attrs'].get('content') for n in page.select('meta')}
        canons = [n['attrs'].get('href') for n in page.select('link') if n['attrs'].get('rel')=='canonical']
        require(canons == [canonical(name)], f'{name}: canonical is {canons}')
        require(len(page.select('h1'))==1 and len(page.select('main'))==1, f'{name}: H1/main count')
        require(len(page.select('title'))==1 and bool(meta.get('description')), f'{name}: title/description missing')
        require(meta.get('robots') == 'index, follow', f'{name}: robots changed')
        require(not re.search(r'https?://putnapomoshtsisi\.com', page.source), f'{name}: non-www absolute URL')
        require(ORIGIN+'/index.html' not in page.source, f'{name}: old homepage absolute URL')
        if 'og:url' in meta:
            require(meta['og:url']==canonical(name), f'{name}: OG URL mismatch')
        ids = [n['attrs']['id'] for n in nodes if 'id' in n['attrs']]
        require(len(ids)==len(set(ids)), f'{name}: duplicate HTML IDs')
        try:
            schemas = page.schemas()
        except ValueError as e:
            errors.append(f'{name}: invalid JSON-LD: {e}')
            schemas = []
        if sum(s.get('@type')=='FAQPage' for s in schemas)>1:
            warnings.append(f'{name}: existing duplicate FAQPage (Phase 3/4)')
        for n in nodes:
            a, tag = n['attrs'], n['tag']
            ref = a.get('href') if tag in ('a','link') else a.get('src') if tag in ('img','script') else None
            if ref is None or not ref:
                continue
            target = target_of(ref,name)
            if target is None:
                continue
            dest, fragment = target
            require((ROOT/dest).is_file(), f'{name}:{n["line"]}: missing {ref}')
            if tag=='a':
                resolved = urlsplit(urljoin(canonical(name),ref))
                require(resolved.path != '/index.html', f'{name}:{n["line"]}: internal homepage alias {ref}')
                if fragment and dest in pages:
                    valid = fragment in {x['attrs'].get('id') for x in pages[dest].nodes}
                    if not valid and (dest,fragment) in KNOWN_ANCHORS:
                        warnings.append(f'{name}: existing Google review placeholder (owner verification / Phase 2/5)')
                    else:
                        require(valid, f'{name}:{n["line"]}: broken anchor {ref}')
        if args.phase1_baseline:
            original_text = subprocess.check_output(['git','show',f'{args.phase1_baseline}:{name}'],cwd=ROOT,text=True)
            original = Page(original_text)
            # All body markup/text/styles and runtime scripts must remain identical except href URLs.
            def body_signature(text):
                body = re.search(r'<body\b[^>]*>([\s\S]*?)</body>',text)[1]
                return re.sub(r'\bhref="[^"]*"','href="URL"',body)
            require(body_signature(original_text)==body_signature(page.source), f'{name}: non-URL body change')
            old_meta = {n['attrs'].get('name',n['attrs'].get('property')):n['attrs'].get('content') for n in original.select('meta')}
            require({k:normalized_urls(v) for k,v in old_meta.items()} == meta, f'{name}: non-URL meta change')
            require(original.select('title')[0]['text']==page.select('title')[0]['text'], f'{name}: title changed in Phase 1')
            require(json.loads(normalized_urls(json.dumps(original.schemas(),ensure_ascii=False)))==schemas, f'{name}: schema changed beyond URLs')
            def destinations(p):
                result=[]
                for n in p.select('a'):
                    ref=n['attrs'].get('href','')
                    target=target_of(ref,name)
                    query=urlsplit(urljoin(canonical(name),ref)).query
                    result.append((*target,query) if target else ref)
                return result
            require(destinations(original)==destinations(page), f'{name}: link target/fragment/external ID changed')
    if not args.files:
        require(len({p.select('title')[0]['text'] for p in pages.values()})==len(pages), 'Duplicate titles')
        sm = ET.parse(ROOT/'sitemap.xml')
        entries = sm.findall('{*}url')
        locations = [e.find('{*}loc').text for e in entries]
        require(set(locations)=={canonical(n) for n in pages} and len(locations)==len(pages), 'Sitemap inventory/canonical mismatch')
        xml_alts={e.find('{*}loc').text:{n.attrib['hreflang']:n.attrib['href'] for n in e.findall('{http://www.w3.org/1999/xhtml}link')} for e in entries}
        for name,page in pages.items():
            alternates = [n for n in page.select('link') if n['attrs'].get('rel')=='alternate' and 'hreflang' in n['attrs']]
            require(len(alternates)==len(page.alternates()), f'{name}: duplicate hreflang declarations')
            lang='en' if name.startswith('en/') else 'bg'
            expected={lang:canonical(name)}
            for bg,en in PAIRS:
                if name in (bg,en): expected={'bg':canonical(bg),'en':canonical(en)}
            if name in ('index.html','en/index.html'): expected['x-default']=ORIGIN+'/'
            require(page.alternates()==expected, f'{name}: hreflang not the real translation set')
            require(xml_alts.get(canonical(name))==expected, f'{name}: sitemap hreflang mismatch')
        robots=(ROOT/'robots.txt').read_text()
        require('Sitemap: '+ORIGIN+'/sitemap.xml' in robots, 'Robots sitemap mismatch')
        require(not re.search(r'^\s*Disallow:\s*\S',robots,re.M), 'Unexpected robots disallow')
        for name in ('robots.txt','sitemap.xml','llms.txt'):
            text=(ROOT/name).read_text()
            require(not re.search(r'https?://putnapomoshtsisi\.com',text), name+': old host')
            require(ORIGIN+'/index.html' not in text,name+': old homepage')
        config=json.loads((ROOT/'vercel.json').read_text())
        require(set(config)=={'$schema','redirects'}, 'Unexpected deployment override (DNS/build/framework/cleanUrls must stay unchanged)')
        require(config['redirects']==[
            {'source':'/index.html','destination':'/','statusCode':301},
            {'source':'/en/','destination':'/en/index.html','statusCode':301}
        ], 'Redirect scope changed')
        if args.phase1_baseline:
            tracked=subprocess.check_output(['git','ls-tree','-rz','--name-only',args.phase1_baseline],cwd=ROOT,text=True).strip('\0').split('\0')
            exempt=PAGES|{'robots.txt','sitemap.xml','llms.txt','tools/generate-site.mjs'}
            for name in tracked:
                if name in exempt: continue
                old=subprocess.check_output(['git','show',f'{args.phase1_baseline}:{name}'],cwd=ROOT)
                require((ROOT/name).is_file() and (ROOT/name).read_bytes()==old, f'{name}: protected original changed')
    for error in errors: print('FAIL:',error)
    for warning in sorted(set(warnings)): print('KNOWN:',warning)
    print(f'{"PASS" if not errors else "FAIL"}: {len(selected)} pages; {len(errors)} new errors; {len(set(warnings))} known deferred findings.')
    return bool(errors)

if __name__=='__main__':
    sys.exit(main())
