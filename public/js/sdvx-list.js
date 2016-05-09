'use strict';

var l

window.addEventListener('load', function() {
  l = new List('body', {
    valueNames: [
      'list-title',
      'list-artist',
      'list-level',
      'count-play',
      'diff',
      { data: [
        'rank',
        'clear',
        'score',
        'clearrate'
      ] }
    ],
    page: 5000
  })

  var filterLevel = function() {
    var val = typeof v === 'number'? v : parseInt(this.value)

    if(val == 0) {
      l.filter(function() { return true })
    } else {
      l.filter(function(item) { return parseInt(item.values()['list-level']) == val })
    }
  }

  window.clearFilter = function() {
    l.filter(function() { return true })
    var select = $('#stat_level') || $('#vs_level')

    select.value = 0
    if(!window.statdata2) {
      statSwitch(0)
    } else {
      vsSwitch(0)
    }


  }
  window.filterBorder = function(score, rank) {
    l.filter(function(item) {
      var v = item.values()
      return parseInt(v['score']) >= score && parseInt(v['rank']) == rank
    })
  }

  $('.filter-level')[0].addEventListener('change', filterLevel)
  $('.filter-level')[0].addEventListener('onkeyup', filterLevel)

})
