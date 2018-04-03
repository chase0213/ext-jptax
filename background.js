// listen to be listened
let eventList = [
  'onBeforeNavigate',
  'onCompleted',
  'onErrorOccurred',
  'onHistoryStateUpdated',
];

// regular expression to detect if the given url is a target or not
const jptaxRegexp = new RegExp('https:\/\/www\.nta\.go\.jp');

// listen events to store a url one recently visited
eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(data) {
    handleNavigation(data);
  });
});

// handle navigation
let handleNavigation = function(data) {
  if (data.url.match(jptaxRegexp)) {
    // ignore if the given url matches the following regexp
    const ignoreRegexp = new RegExp('https:\/\/www\.nta\.go\.jp\/(renewal|index)');
    if (data.url.match(ignoreRegexp)) {
      return;
    } else {
      // store url to chrome storage
      chrome.storage.sync.set({'currentRequestURL': data.url});
    }
  }
}
