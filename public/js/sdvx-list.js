'use strict';

var l
var filters = []

window.addEventListener('load', function() {
  l = new List('body', {
    valueNames: [
      'list-title',
      'list-artist',
      'list-level',
      'count-play',
      { data: [
        'clear',
        'rank',
        'score',
        'clearrate'
      ] }
    ],
    page: 5000
  })
})
