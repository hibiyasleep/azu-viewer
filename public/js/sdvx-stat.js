'use strict'

window.statSwitch = function statSwitch(v) {

  var timeout = 300

  var val = typeof v === 'number'? v : parseInt(this.value)

  var row = statdata[val]
  var segment

  animateNumber('#v_count',       row.count                 , timeout)
  animateNumber('#v_totalcount',  row.totalcount            , timeout)
  animateNumber('#v_average',     ~~(row.total / row.count) , timeout)

  for(var i=0; i<=6; i++) {
    segment = $('.segment.rank-' + i, 0)

    segment.style.width = (row.rank[i] / row.count * 100) + '%'
    animateNumber(segment, row.rank[i], timeout)

    animateNumber('#p_rank' + i     , row.rank[i] / row.count * 100 , timeout, true)
    animateNumber('.value.rank-' + i, row.rank[i]                   , timeout)

    if(row.rank[i] == 0) {
      $('.summary.rank-' + i, 0).classList.add('text-muted')
    } else {
      $('.summary.rank-' + i, 0).classList.remove('text-muted')
    }
  }

  for(var i=0; i<=4; i++) {
    segment = $('.segment.clear-' + i, 0)

    segment.style.width = (row.clear[i] / row.count * 100) + '%'
    animateNumber(segment, row.clear[i], timeout)

    animateNumber('#p_clear' + i     , row.clear[i] / row.count * 100, timeout, true)
    animateNumber('.value.clear-' + i, row.clear[i]                  , timeout)
  }

  if(row.count === 0) {
    var segments = $('.segment')
    var summaries = $('.summary')

    // same length
    for(var i=0; i<segments.length; i++) {
      segments[i].style.width = '0'
      summaries[i].classList.add('text-muted')
    }

    $('.segment.clear-0', 0).style.width = '100%'
    $('.segment.rank-0', 0).style.width = '100%'

  } else if(row.count === row.clear[4] && val >= 12) {
    $('div.stat', 0).classList.add('banseong')

  } else {
    $('.stat', 0).classList.remove('banseong')
  }

}

window.vsSwitch = function(v) {

  var timeout = 300

  var val = typeof v === 'number'? v : this.value

  var row1 = statdata[val]
  var row2 = statdata2[val]
  var segment

  animateNumber('#v1_average', ~~(row1.total / row1.count) , timeout)
  animateNumber('#v2_average', ~~(row2.total / row2.count) , timeout)

  for(var i=0; i<=2; i++) {
    segment = $('.segment.vs-' + i, 0)


    segment.style.width = (row1.vs[i] / row1.vslength * 100) + '%'
    animateNumber(segment, row1.vs[i], timeout)

    animateNumber('#p_vs' + i     , row1.vs[i] / row1.count * 100, timeout, true)
    animateNumber('.value.vs-' + i, row1.vs[i]                      , timeout)

    if(row1.vs[i] == 0) {
      $('.summary.vs-' + i, 0).classList.add('text-muted')
    } else {
      $('.summary.vs-' + i, 0).classList.remove('text-muted')
    }
  }

  if(row1.vslength === 0) {
    var segments = $('.segment')
    var summaries = $('.summary')

    // same length
    for(var i=0; i<segments.length; i++) {
      segments[i].style.width = '0'
      summaries[i].classList.add('text-muted')
    }

    $('.segment.vs-1', 0).style.width = '100%'

  } else if(row1.vs[1] === 0 && row1.vs[2] === 0) {
    $('.stat', 0).classList.add('banseong')

  } else {
    $('.stat', 0).classList.remove('banseong')
  }
}

window.addEventListener('load', function() {

  if(!window.statdata2) {
    $('#stat_level').addEventListener('change', statSwitch)
    $('#stat_level').addEventListener('onkeyup', statSwitch)
  } else {
    $('#vs_level').addEventListener('change', vsSwitch)
    $('#vs_level').addEventListener('onkeyup', vsSwitch)
  }
})
