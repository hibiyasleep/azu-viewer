'use strict';

var l

window.addEventListener('load', function() {
  l = new List('body', {
    valueNames: [
      'list-title',
      'list-artist',
      'list-level',
      'count-play',
      { data: [
        'both',
        'diff',
        'rank',
        'clear',
        'score',
        'clearrate'
      ] }
    ],
    indexAsync: true,
    page: 500
  })

  var postFilter = function() {
    $('#list_display').textContent = l.visibleItems.length
    bLazy.revalidate()
  }

  var filterLevel = function() {
    var val = typeof v === 'number'? v : parseInt(this.value)

    if(val == 0) {
      l.filter(function() { return true })
    } else {
      l.filter(function(item) { return parseInt(item.values()['list-level']) == val })
    }

    postFilter()
  }



  window.filterBorder = function(score, rank) {
    l.filter(function(item) {
      var v = item.values()
      return parseInt(v['score']) >= score && parseInt(v['rank']) == rank
    })
    postFilter()
  }

  window.filterBoth = function() {
    l.filter(function(item) {
      return item.values().both == 'true'
    })
    postFilter()
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
    postFilter()
  }

  l.sort('diff', { order: 'desc' })

  $('.filter-level', 0).addEventListener('change', filterLevel)
  $('.filter-level', 0).addEventListener('onkeyup', filterLevel)



})
