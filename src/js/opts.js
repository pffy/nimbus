/**
 * name     : opts.js
 * task     : manages ui and conversions
 * git      : https://github.com/pffy/nimbus
 * author   : The Pffy Authors https://pffy.dev
 * license  : https://opensource.org/licenses/MIT
 */


// Saves options to chrome.storage
function save_options() {

  const pinyin = document.getElementById('pinyin').value;
  const tin = document.getElementById('tinput').value;

  chrome.storage.sync.set({
    prefsPinyin: pinyin,
    prefsInput: tin
  }, function() {
    // visibile update

  });
}

// restores options from chrome.storage
function restore_options() {

  chrome.storage.sync.get({

    // default values
    prefsPinyin: 'hp',
    prefsInput: '你好'

  }, function(items) {
    document.getElementById('pinyin').value = items.prefsPinyin;
    document.getElementById('tinput').value = items.prefsInput;
  });
}


// converts input text based on preferences

function convert_text() {
  save_options();

  var tin = document.getElementById('tinput');
  var ptone = document.getElementById('pinyin').value;
  var str = tin.value;
  console.log(str);

  // loads big idx file into memory, just in time
  fetch('/idx/IdxHanyuPinyin.json')
    .then(response => response.json())
    .then((hpdx) => {

      for (var h in hpdx) {
        str = str.replace((new RegExp(h, 'g')),
          ' ' + hpdx[h] + ' ');
      }

      str = str.replace((new RegExp('[^\\S\\n]{2,}', 'g')),
        ' ').trim();

      // done with idx file
      hpdx = null;

      console.log(ptone);
      switch(ptone) {

        case 'hpt':
          hpt(str);
          break;

        case 'hpti':
          hpti(str);
          break;

        case 'hpn':
          hpn(str);
          break;

        default:
          finish(str);
          break;
      }

    });
}

// removes tone numbers from toned phonemes
function hpn(str) {
  fetch('/idx/IdxToneRemoval.json')
    .then(response => response.json())
    .then((trdx) => {

      for (var t in trdx) {
        str = str.replace((new RegExp(t, 'g')),
          '' + trdx[t] + '');
      }

      trdx = null;

      finish(str);
    });
}

// removes the fifth tone from toned phonemes
function hpf(str) {
  fetch('/idx/IdxToneFive.json')
    .then(response => response.json())
    .then((tfdx) => {

      for (var f in tfdx) {
        str = str.replace((new RegExp(f, 'g')),
          '' + tfdx[f] + '');
      }

      tfdx = null;

      finish(str);
    });
}

// converts tone numbers to tone marks
function hpt(str) {
  fetch('/idx/IdxToneMarks.json')
    .then(response => response.json())
    .then((tmdx) => {

      for (var t in tmdx) {
        str = str.replace((new RegExp(t, 'g')),
          '' + tmdx[t] + '');
      }

      tmdx = null;

      hpf(str);
    });
}

// converts tone numbers to ISO-compliant tone marks
function hpti(str) {
  fetch('/idx/IdxToneMarksIso.json')
    .then(response => response.json())
    .then((tmidx) => {

      for (var t in tmidx) {
        str = str.replace((new RegExp(t, 'g')),
          '' + tmidx[t] + '');
      }

      tmidx = null;

      hpf(str);
    });
}

// pushes finished text to output box
function tout(str) {
  document.getElementById('toutput').value = str;
}

// formats texts for output
function finish(str) {
  tout(clean(str));
}

function clean(str) {
  str = str.replace((new RegExp('[^\\S\\n]{2,}', 'g')),
    ' ').trim();
  str = str.split('\n').map((s) => s.trim()).join('\n');
  return str;
}

// exports output box to a plain text file
function download_as_text() {

  console.log('download!-sayshello');

  const outdata = document.getElementById('toutput').value

  //
  const str = outdata + '\n';

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

// copies output box text to clipboard
function copy_text(){
  const yep = document.execCommand('copy');
  const msg = yep ? 'copied.' : 'oops! not copied.';
  const mbox = document.getElementById('msgbox');
  mbox.innerHTML = msg;
  mbox.style.display = 'block';
    setTimeout(function(){
        mbox.style.display = 'none';
    },1000);
}

function insert_sample_text() {
  const str = sample_text_shi();
  document.getElementById('tinput').value = clean(str);
  convert_text();
}

function sample_text_shi() {
  return `
《施氏食獅史》
石室詩士施氏，嗜獅，誓食十獅。
氏時時適市視獅。
十時，適十獅適市。
是時，適施氏適市。
氏視是十獅，恃矢勢，使是十獅逝世。
氏拾是十獅屍，適石室。
石室濕，氏使侍拭石室。
石室拭，氏始試食是十獅。
食時，始識是十獅屍，實十石獅屍。
試釋是事。
  `;
}


/**
 * listeners
 */

document.addEventListener('DOMContentLoaded', function(){
  restore_options();
  setTimeout(convert_text, 100);
});


// replaced click-save with auto-save
// document.getElementById('save').addEventListener('click', save_options);

document.getElementById('pinyin').addEventListener('change',
    function(){
      convert_text();
      console.log('%s has changed', this.id);
      console.log('tone: %s', this.value);
    });

document.getElementById('download').addEventListener('click',
    download_as_text);


// replace with auto-convert paradigm
// document.getElementById('convert').addEventListener('click', convert_text);

document.getElementById('sample_text').addEventListener('click',
    insert_sample_text);

document.getElementById('toutput').addEventListener('click',
    copy_text);

document.getElementById('tinput').addEventListener('change',
    convert_text);
document.getElementById('tinput').addEventListener('click',
    convert_text);
document.getElementById('tinput').addEventListener('keyup',
    convert_text);
