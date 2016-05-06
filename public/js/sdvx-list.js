'use strict';

window.addEventListener('load', function() {
  l = new List('body', {
    valueNames: [
      'list-title', 'list-artist', 'list-level', 'list-played',
      'list-clear', 'list-rank', 'list-score', 'list-clearrate'
    ],
    count: 5000
  })
})
