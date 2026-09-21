import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../assets/js/home.js', import.meta.url), 'utf8');
class Element {
  listeners = {}; value = ''; hidden = true; disabled = false; open = false; textContent = '';
  classList = {add() {}, remove() {}, contains() {return false;}};
  addEventListener(name, fn) {this.listeners[name] = fn;}
  click() {return this.listeners.click?.();}
  focus() {this.focused = true;}
  select() {this.selected = true;}
  removeAttribute(name) {delete this[name];}
  showModal() {this.open = true;}
  close() {this.open = false; this.listeners.close?.();}
}
function setup(lang = 'bg', ios = false, geo = true) {
  const selectors = ['#location-dialog', '[data-locate]', '[data-home-location-status]', '[data-location-result]', '#location-map-link', '[data-location-sms]', '[data-location-close]', '[data-location-copy]'];
  const nodes = Object.fromEntries(selectors.map(key => [key, new Element()]));
  const dialog = nodes['#location-dialog'];
  dialog.querySelector = key => nodes[key];
  const opener = new Element();
  let success, error, calls = 0, copied;
  const navigator = {
    userAgent: ios ? 'iPhone' : 'Android', platform: '', maxTouchPoints: 0,
    clipboard: {async writeText(text) {copied = text;}},
    ...(geo ? {geolocation: {getCurrentPosition(s, e, options) {calls++; success=s; error=e; assert.equal(options.timeout,12000);}}} : {})
  };
  vm.runInNewContext(source, {
    document: {querySelector:key=>nodes[key], querySelectorAll:()=>[opener], body:new Element(), documentElement:{lang}, addEventListener(){}},
    navigator, window: {isSecureContext:true}
  });
  return {nodes, dialog, opener, navigator, success:p=>success(p), error:e=>error(e), calls:()=>calls, copied:()=>copied};
}
for (const lang of ['bg','en']) for (const ios of [false,true]) {
  const t=setup(lang,ios), n=t.nodes;
  t.opener.click(); assert.equal(t.calls(),0);
  n['[data-locate]'].click(); assert.equal(t.calls(),1); assert.equal(n['[data-locate]'].disabled,true);
  t.success({coords:{latitude:43,longitude:27}});
  assert.equal(n['[data-location-result]'].hidden,false);
  assert.ok(n['[data-location-sms]'].href.startsWith('sms:+359896661319'+(ios?'&':'?')+'body='));
  await n['[data-location-copy]'].click(); assert.equal(t.copied(),'https://www.google.com/maps?q=43,27');
  t.navigator.clipboard.writeText=async()=>{throw Error('denied');};
  await n['[data-location-copy]'].click(); assert.equal(n['#location-map-link'].selected,true);
  t.dialog.close(); assert.equal(n['#location-map-link'].value,''); assert.equal(n['[data-location-sms]'].href,undefined);
  assert.equal(t.opener.focused,true);
  for (const code of [1,2,3]) {t.opener.click(); n['[data-locate]'].click(); t.error({code}); assert.equal(n['[data-locate]'].disabled,false); assert.equal(n['[data-location-result]'].hidden,true);}
  t.opener.click(); n['[data-locate]'].click(); t.dialog.close(); t.success({coords:{latitude:43,longitude:27}}); assert.equal(n['#location-map-link'].value,'');
}
const unavailable=setup('bg',false,false);
unavailable.opener.click(); unavailable.nodes['[data-locate]'].click();
assert.ok(unavailable.nodes['[data-home-location-status]'].textContent.includes('не е достъпна'));
console.log('PASS: BG/EN × iOS/Android; explicit permission step, SMS preparation, clipboard success/fallback, permission/timeout/unavailable errors, close/reset and late callbacks. No real location or messages used.');
