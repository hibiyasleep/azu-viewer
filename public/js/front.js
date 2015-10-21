var gl;

listInit = function(){
  return gl = new List('body', {
    valueNames: ['title', 'artist', 'song-level', 'song-clear', 'song-rank',
                 'list-nov-level', 'list-nov-score', 'list-nov-clear', 'list-nov-rank',
                 'list-nov-played', 'list-nov-cleared', 'list-nov-uc', 'list-nov-perfect', 'list-nov-clearrate',
                 'list-adv-level', 'list-adv-score', 'list-adv-clear', 'list-adv-rank',
                 'list-adv-played', 'list-adv-cleared', 'list-adv-uc', 'list-adv-perfect', 'list-adv-clearrate',
                 'list-exh-level', 'list-exh-score', 'list-exh-clear', 'list-exh-rank',
                 'list-exh-played', 'list-exh-cleared', 'list-exh-uc', 'list-exh-perfect', 'list-exh-clearrate',
                 'list-ext-level', 'list-ext-score', 'list-ext-clear', 'list-ext-rank',
                 'list-ext-played', 'list-ext-cleared', 'list-ext-uc', 'list-ext-perfect', 'list-ext-clearrate']
  })
}

sort = function(col, type){
  var nov = document.getElementById('sort-nov')
  var adv = document.getElementById('sort-adv')
  var exh = document.getElementById('sort-exh')
  var ext = document.getElementById('sort-ext')
  if(col == 'nov'){
    adv.value = 'default'
    exh.value = 'default'
    ext.value = 'default'
  } else if(col == 'adv'){
    nov.value = 'default'
    exh.value = 'default'
    ext.value = 'default'
  } else if(col == 'exh'){
    nov.value = 'default'
    adv.value = 'default'
    ext.value = 'default'
  } else if(col == 'ext'){
    nov.value = 'default'
    adv.value = 'default'
    exh.value = 'default'
  }
  var c = type.split('/')
  gl.sort('list-' + col + '-' + c[0], { order: c[1] })
}

filter = function(){
  var level = document.getElementById('find-level').value
  var rank = document.getElementById('find-rank').value
  var clear = document.getElementById('find-clear').value
  console.log(level, rank, clear, !!level, !!rank, !!clear)
  gl.filter(function(o) {
    var v = o.values()
    return (
           (!level || v['list-nov-level'] == level)
        && (!rank || v['list-nov-rank'] == rank)
        && (!clear || v['list-nov-clear'] == clear)
//        && (!!clear && clear === 0 && v['list-nov-clear'] === 0)
//        && (!!clear && clear !== 0 && v['list-nov-clear'] >= parseInt(clear))
      ) || (
           (!level || v['list-adv-level'] == level)
        && (!rank || v['list-adv-rank'] == rank)
        && (!clear || v['list-adv-clear'] == clear)
//        && (!!clear && clear === 0 && v['list-adv-clear'] === 0)
//        && (!!clear && clear !== 0 && v['list-adv-clear'] >= clear)
      ) || (
           (!level || v['list-exh-level'] == level)
        && (!rank || v['list-exh-rank'] == rank)
        && (!clear || v['list-exh-clear'] == clear)
//        && (!!clear && clear === 0 && v['list-exh-clear'] === ' 0 ')
//        && (!!clear && clear !== 0 && v['list-exh-clear'] >= clear)
      ) || (
           (!level || v['list-ext-level'] == level)
        && (!rank || v['list-ext-rank'] == rank)
        && (!clear || v['list-ext-clear'] == clear)
//        && (!!clear && clear === 0 && v['list-ext-clear'] === 0)
//        && (!!clear && clear !== 0 && v['list-ext-clear'] >= clear)
      )
  })
}

resetNav = function(){
  document.getElementById('sort-nov').value = 'default'
  document.getElementById('sort-adv').value = 'default'
  document.getElementById('sort-exh').value = 'default'
  document.getElementById('sort-ext').value = 'default'
  document.getElementById('find-level').value = ''
  document.getElementById('find-rank').value = ''
  document.getElementById('find-clear').value = ''
  gl.filter(function(){return true;})
}

document.addEventListener('DOMContentLoaded', function(e){
  listInit()

  var nav = document.getElementsByTagName('nav')[0]
  var header = document.getElementsByTagName('header')[0]
  var headerHeight = parseInt(getComputedStyle(header).height)

  window.addEventListener('resize', function(e){
    headerHeight = parseInt(getComputedStyle(header).height)
  })
  document.getElementsByClassName('overview-header')[0].addEventListener('click', function(e){
    var timer = setInterval(function(){
      headerHeight = parseInt(getComputedStyle(header).height)
    }, 50)
    setTimeout(function(){
      clearInterval(timer)
    }, 500)
  })

  window.addEventListener('scroll', function(e){
    if(window.scrollY > headerHeight){
      nav.className = 'fixed'
    } else {
      nav.className = ''
    }
  })
})
