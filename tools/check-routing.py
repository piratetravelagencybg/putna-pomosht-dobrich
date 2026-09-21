#!/usr/bin/env python3
"""Read-only HTTP release checks against Vercel dev or an approved preview URL.

Run: python3 tools/check-routing.py --base-url http://127.0.0.1:8770
Use --json for an evidence report on stdout. Never deploys or follows off-site links.
Query preservation is a strict requirement, including on a local server: failures
are reported, not silently waived. Vercel dev 59.16.0 currently fails those checks.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
from urllib.error import HTTPError
from urllib.parse import parse_qsl, quote, urljoin, urlsplit
from urllib.request import build_opener, HTTPRedirectHandler, Request

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('seo_checks', ROOT/'tools/check-seo.py')
seo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seo)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(url, method):
    try:
        response = build_opener(NoRedirect).open(
            Request(url, method=method, headers={'User-Agent':'SISI-Phase1-ReadOnly-QA/1.0'}), timeout=20)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers.get('Location'), response.read()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', required=True)
    parser.add_argument('--json', action='store_true')
    parser.add_argument('--assets-only', action='store_true', help='Only fetch unchanged CSS, JS and image resources for a baseline comparison')
    args = parser.parse_args()
    origin = urlsplit(args.base_url)
    if origin.scheme not in ('http','https') or not origin.netloc or origin.path not in ('','/') or origin.query or origin.fragment or origin.username:
        parser.error('--base-url must be an HTTP(S) origin with no credentials, path or query')
    base = args.base_url.rstrip('/')
    cases = []
    for name in sorted(seo.PAGES):
        path = '/' if name == 'index.html' else '/'+name
        cases.append({'method':'GET', 'path':path, 'status':200, 'file':name})
    resources = set()
    for name in seo.PAGES:
        page = seo.Page((ROOT/name).read_text())
        for node in page.nodes:
            attrs, tag = node['attrs'], node['tag']
            ref = attrs.get('src') if tag in ('img','script') else attrs.get('href') if tag=='link' and attrs.get('rel')=='stylesheet' else None
            target = seo.target_of(ref, name) if ref else None
            if target and target[0] not in seo.PAGES:
                resources.add(target[0])
    for name in sorted(resources | {'sitemap.xml','robots.txt','llms.txt'}):
        cases.append({'method':'GET', 'path':'/'+quote(name, safe='/'), 'status':200, 'file':name})
    queries = ['', '?utm_source=phase1&utm_medium=qa&x=1&x=2',
               '?q=%D0%94%D0%BE%D0%B1%D1%80%D0%B8%D1%87&empty=&plus=a%2Bb']
    for source, destination in [('/index.html','/'),('/en/','/en/index.html')]:
        for query in queries:
            for method in ('GET','HEAD'):
                cases.append({'method':method, 'path':source+query, 'status':301,
                              'destination':destination, 'query':query.lstrip('?')})
    for path in ('/','/en/index.html','/patna-pomosht-dobrich.html'):
        cases.append({'method':'HEAD','path':path,'status':200})
    for path in ('/phase1-missing-page.html','/patna-pomosht-dobrich','/indexXhtml','/en/indexXhtml'):
        cases.append({'method':'GET','path':path,'status':404})
    if args.assets_only:
        cases = [case for case in cases if case.get('file') in resources]

    def check(case):
        result = dict(case)
        result['errors'] = []
        try:
            status, location, body = request(base+case['path'], case['method'])
            result.update(actual_status=status, location=location)
            if status != case['status']:
                result['errors'].append(f'expected HTTP {case["status"]}, got {status}')
            if 'destination' in case:
                dest = urlsplit(urljoin(base+case['path'],location or ''))
                if dest.netloc != origin.netloc or dest.path != case['destination'] or dest.fragment:
                    result['errors'].append('wrong redirect destination/host')
                if parse_qsl(dest.query, keep_blank_values=True) != parse_qsl(case['query'], keep_blank_values=True):
                    result['errors'].append('query parameters not preserved')
                if dest.netloc == origin.netloc and dest.path == case['destination']:
                    final_status, final_location, _ = request(base+dest.path+('?' + dest.query if dest.query else ''), case['method'])
                    result['target_status'] = final_status
                    if final_status != 200 or final_location:
                        result['errors'].append('redirect target not direct 200 (chain/loop)')
            elif location:
                result['errors'].append('unexpected redirect/location')
            if 'file' in case:
                expected = (ROOT/case['file']).read_bytes()
                result['sha256'] = hashlib.sha256(body).hexdigest()
                if body != expected:
                    result['errors'].append('served body differs from local candidate')
        except Exception as error:
            result['errors'].append(f'{type(error).__name__}: {error}')
        return result

    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check,cases))
    failures = [r for r in results if r['errors']]
    report = {'checked_at':datetime.now(timezone.utc).isoformat(), 'base_url':base,
              'checks':len(results), 'passed':len(results)-len(failures), 'failed':len(failures),
              'note':'Local Vercel dev is not production edge. Do not treat known local failures as a release PASS.',
              'results':results}
    if args.json:
        print(json.dumps(report,ensure_ascii=False,indent=2))
    else:
        for row in failures:
            print(f'FAIL: {row["method"]} {row["path"]}: '+ '; '.join(row['errors']))
        print(f'{"FAIL" if failures else "PASS"}: {report["passed"]}/{report["checks"]} HTTP checks; {len(failures)} failures.')
    return bool(failures)


if __name__ == '__main__':
    sys.exit(main())
