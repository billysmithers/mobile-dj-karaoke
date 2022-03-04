import { CDGPlayer, CDGControls } from 'cdgplayer';

let playlistElem;
const playlistBuffer = [];
let player;

function loadPlayer() {
  player = new CDGPlayer('#cdg_wrapper');
  new CDGControls('#cdg_controls', player);
  let trackLength;
  player.props.on('trackLength', (val) => {
    trackLength = val;
  });
  player.props.on('status', (val) => {
    console.log('Status: ', val);
    if (val === 'File Loaded') {
      player.start();
    }
  });
  player.props.on('timePlayed', (val) => {
    if (val === trackLength) {
      playlistBuffer.shift();

      if (playlistBuffer.length > 0) {
        player.load(playlistBuffer[0]);
      }

      if (playlistElem.children.length > 0) {
        playlistElem.firstChild.remove();
      }
    }
  });
}

function loadMusic() {
  player.load(playlistBuffer[0]);
}

function addFiles(files) {
  return Promise.all([].map.call(files, function (file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve({ result: reader.result, file: file });
      };
      reader.readAsArrayBuffer(file);
    });
  })).then(function (results) {
    results.forEach(function (result) {
      const displayName = result.file.name.replaceAll('_', ' ').replace('.zip', '');

      const item = document.createElement('li');
      item.appendChild(document.createTextNode(displayName));
      playlistElem.appendChild(item);

      playlistBuffer.push(result.result);
    });

    loadMusic();
  });
}

// @TODO - reorder playlist use drag and drop and slice playlistBuffer based on data attribute index - same as reward ordering

(function () {
  playlistElem = document.querySelector('#playlist');

  document.querySelector('#file-select').addEventListener('change', (event) => {
    addFiles(event.target.files);
  });

  loadPlayer();
})();
