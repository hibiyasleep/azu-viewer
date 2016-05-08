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

  var filterLevel = function() {
    var val = typeof v === 'number'? v : parseInt(this.value) + 1

    if(val == 17) {
      l.filter(function() { return true })
    } else {
      l.filter(function(item) { return parseInt(item.values()['list-level']) == val })
    }
  }

  $('#stat_level').addEventListener('change', filterLevel)
  $('#stat_level').addEventListener('onkeyup', filterLevel)

})
