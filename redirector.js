// upper is higher in priority
const replacer = {
  'www\.nta\.go\.jp\/tetsuzuki\/shinkoku\/shotoku\/kakutei\.htm': 'www.nta.go.jp/taxes/shiraberu/shinkoku/kakutei.htm',
  'www\.nta\.go\.jp\/taxanswer\/sozoku\/souzo[0-9]+\.htm': 'www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/souzoku.htm',
  'www\.nta\.go\.jp\/taxanswer\/zoyo\/zouyo[0-9]+\.htm': 'www.nta.go.jp/taxes/shiraberu/taxanswer/zoyo/zouyo.htm',
  'www\.nta\.go\.jp\/shiraberu\/zeiho-kaishaku\/tsutatsu\/kihon\/sisan\/hyoka\/[0-9]+\.htm': 'www.nta.go.jp/taxes/shiraberu/taxanswer/hyoka/zaisan.htm',
  'www\.nta\.go\.jp\/tetsuzuki\/shinsei\/annai\/hojin\/shinkoku\/[0-9]+\.htm': 'www.nta.go.jp/taxes/tetsuzuki/shinsei/shinkoku/hojin/hojin.htm',
  'www\.nta\.go\.jp\/taxanswer\/hotei\/houtei[0-9]+\.htm': 'www.nta.go.jp/taxes/shiraberu/taxanswer/hotei/houtei.htm',
  'www\.nta\.go\.jp\/taxanswer\/inshi\/inshi[0-9]+\.htm': 'www.nta.go.jp/taxes/shiraberu/taxanswer/inshi/inshi.htm',
  'www\.nta\.go\.jp\/shiraberu\/ippanjoho\/pamph\/.+\.htm': 'www.nta.go.jp/publication/pamph/01.htm',
  'www\.nta\.go\.jp\/taxanswer\/': 'www.nta.go.jp/taxes/shiraberu/taxanswer/',
  'www\.nta\.go\.jp\/zeimokubetsu\/': 'www.nta.go.jp/taxes/shiraberu/zeimokubetsu/',
  'www\.nta\.go\.jp\/tetsuzuki\/shinkoku\/': 'www.nta.go.jp/taxes/tetsuzuki/shinsei/shinkoku/',
};

// replace url from the old nta website with the new one
let getReplaceURL = function(oldURL) {
  for (url in replacer) {
    let regexp = new RegExp(url);
    if (oldURL.match(regexp)) {
      return oldURL.replace(regexp, replacer[url]);
    }
  }

  return null;
}

let redirectToNewPage = function(oldURL) {
  let newURL = getReplaceURL(oldURL);

  if (newURL) {
    chrome.tabs.update(null, {url: newURL});
    return true;
  }

  return false;
}