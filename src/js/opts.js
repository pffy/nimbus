// Saves options to chrome.storage
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    console.log('opts-saved');
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

function convert_text() {
  console.log('convert!-sayshello');
}

function download_as_text() {

  console.log('download!-sayshello');

  const str = document.getElementById('toutput').innerHTML;

  console.log(str);

  const blob = new Blob([str], {
    type: 'text/plain'
  });

  const url = URL.createObjectURL(blob);
  const now = Date.now();

  chrome.downloads.download({
    url: url,
    filename: 'text-' + now + '.txt',
    saveAs: true
  });
}

document.addEventListener('DOMContentLoaded', restore_options);

/*
// autosave preferences instead of click-save?
document.getElementById('save').addEventListener('click',
    save_options);
*/

document.getElementById('like').addEventListener('change',
    function(){
      save_options();
      console.log(this.id + ' changed');
    });

document.getElementById('color').addEventListener('change',
    function(){
      save_options();
      console.log(this.id + ' changed');
    });


document.getElementById('download').addEventListener('click',
    download_as_text);

document.getElementById('convert').addEventListener('click',
    convert_text);
