/**
 * name     : bg.js
 * task     : service worker
 * git      : https://github.com/pffy/nimbus
 * author   : The Pffy Authors https://pffy.dev
 * license  : https://opensource.org/licenses/MIT
 */

console.log('bg-js-sayinghello');

chrome.action.onClicked.addListener(function(){
	console.log('bg-js-clicked');

  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('html/opts.html'));
  }
});
