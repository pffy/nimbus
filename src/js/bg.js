console.log('bg-js-sayinghello');



chrome.action.onClicked.addListener(function(){
	console.log('bg-js-clicked');
 
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('html/opts.html'));
  }
});
