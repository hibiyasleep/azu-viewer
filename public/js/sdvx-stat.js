'use strict'

window.addEventListener('load', function() {

  // THIS IS NOT jQUERY

  var timeout = 300

  var statSwitch = function(v) {
    var val = typeof v === 'number'? v : this.value

    var row = statdata[val]
    var segment

    animateNumber('#v_count',       row.count                 , timeout)
    animateNumber('#v_totalcount',  row.totalcount            , timeout)
    animateNumber('#v_average',     ~~(row.total / row.count) , timeout)

    for(var i=0; i<=6; i++) {
      segment = $('.segment.rank-' + i)[0]

      segment.style.width = (row.rank[i] / row.count * 100) + '%'
      animateNumber(segment, row.rank[i], timeout)

      animateNumber('#p_rank' + i     , row.rank[i] / row.count * 100 , timeout, true)
      animateNumber('.value.rank-' + i, row.rank[i]                   , timeout)
    }

    for(var i=0; i<=4; i++) {
      segment = $('.segment.clear-' + i)[0]

      segment.style.width = (row.clear[i] / row.count * 100) + '%'
      animateNumber(segment, row.clear[i], timeout)

      animateNumber('#p_clear' + i     , row.clear[i] / row.count * 100, timeout, true)
      animateNumber('.value.clear-' + i, row.clear[i]                  , timeout)
    }
  }

  $('#stat_level').addEventListener('change', statSwitch)
  $('#stat_level').addEventListener('onkeyup', statSwitch)

})
