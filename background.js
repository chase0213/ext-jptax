// listen to be listened
let eventList = [
  'onBeforeNavigate',
  'onCompleted',
  'onErrorOccurred',
  'onHistoryStateUpdated',
];

// regular expression to detect if the given url is a target or not
const jptaxRegexp = new RegExp('https:\/\/www\.nta\.go\.jp');

// url to show renewal
const URL_RENEWAL = 'https://www.nta.go.jp/renewal';

// listen events to store a url one recently visited
eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(data) {
    handleNavigation(data);
  });
});

// handle navigation
let handleNavigation = function(data) {
  if (data.url.match(jptaxRegexp)) {
    const regexp = new RegExp(URL_RENEWAL);
    if (data.url.match(regexp)) {
      chrome.storage.sync.get(['requestURL'], function(data) {
        let url = data.requestURL;
        redirectToNewPage(url);
      });
    } else {
      // store url to storage
      chrome.storage.sync.set({'requestURL': data.url}, function() {});
    }
  }
}
