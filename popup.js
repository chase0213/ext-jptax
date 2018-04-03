
// the number of results to be shown
const MAX_RESULT_COUNT = 5;

// base url to nta website
const BASE_URL = 'https://www.nta.go.jp/';

// threshold of search score
const MIN_SCORE = 1;

// error messages
const ERROR_REDIRECTION_NOT_FOUND = '新しいサイトが見つかりませんでした。';
const ERROR_KEYWORD_TOO_SHORT = 'キーワードが短すぎます。';
const ERROR_SEARCH_RESULT_NOT_FOUND = '一致するサイトが見つかりませんでした。';

// DOMs
let redirector = document.getElementById('redirector');
let redirectorError = document.getElementById('redirector-alert');
let oldURLInput = document.getElementById('old-url-input');
let searchButton = document.getElementById('search-button');
let searchResultContainer = document.getElementById('search-result__container');
let searcherError = document.getElementById('searcher-alert');

// set url to input form
chrome.storage.sync.get(['requestURL'], function(data) {
  let url = data.requestURL;
  oldURLInput.value = url;
});

// utility to calculate ngram
let ngram = function(words, n) {
  let grams = [];
  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.substr(i, n));
  }
  return grams;
}

// search result handler
let handleClickSearchResult = function(event) {
  let url = event.target.getAttribute('data-href');
  chrome.tabs.update(null, {url: url});
}

// search result embedder
let embedResult = function(results, limit) {
  let removeNodes = searchResultContainer.getElementsByTagName('div');
  if (removeNodes.length > 0) {
    searchResultContainer.removeChild(removeNodes);
  }

  for (let i = 0; i < limit; i++) {
    if (results.length >= i + 1) {
      let div = document.createElement('div');
      div.className = 'result-item';
      div.setAttribute('data-href', BASE_URL + results[i].url);
      div.onclick = handleClickSearchResult;
      div.innerText = results[i].url + ' (score: ' + results[i].score + ')';
      searchResultContainer.appendChild(div);
    }
  }
}

// handle onclick event of redirect button
redirector.onclick = function(element) {

  // clear error message
  redirectorError.innerText = '';

  chrome.storage.sync.get(['requestURL'], function(data) {
    let url = data.requestURL;
    if (!redirectToNewPage(url)) {
      redirectorError.innerText = ERROR_REDIRECTION_NOT_FOUND;
    }
  });
}

// handle onclick event of search button
searchButton.onclick = function(element) {
  // clear searcher error
  searcherError.innerText = '';

  // get keyword string
  let keywordStr = document.getElementById('search-input').value;

  // if no keywords given, return nothing
  if (keywordStr.length == 0) {
    searcherError.innerText = ERROR_KEYWORD_TOO_SHORT;
    return;
  }

  // if only a letter is given, add whitespace to the last of keyword
  if (keywordStr.length == 1) {
    keywordStr = keywordStr + ' ';
  }

  resultHash = {};

  // split keywords by separator
  let keywords = keywordStr.split(new RegExp('[\,|\、|\t| |　|\s]'));

  // calculate search results by ngram and inverted index algorithm
  for (let kw of keywords) {
    let grams = ngram(kw, 2);
    for (let gram of grams) {
      let result = scores[gram];
      for (let url in result) {
        if (!resultHash[url]) {
          resultHash[url] = 0;
        }
        resultHash[url] += result[url];
      }
    }
  }

  // reshape results from object into array
  let searchResults = [];
  for (let key in resultHash) {
    searchResults.push({url: key, score: resultHash[key]});
  }

  // sort results with scores of them
  searchResults = searchResults.sort(function(a, b) {
    return b.score - a.score;
  })

  if (searchResults.length <= 0 || searchResults[0].score < MIN_SCORE) {
    searcherError.innerText = ERROR_SEARCH_RESULT_NOT_FOUND;
    return;
  }

  // embed results into the popup
  embedResult(searchResults, MAX_RESULT_COUNT);
}

