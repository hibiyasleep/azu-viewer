'use strict'

window.addEventListener('load', function() {
  if(bowser.chrome && !(bowser.android || bowser.ios)) {
    [].forEach.call($('.opt-chrome'), function(o) {
      o.className = o.className.replace('hidden', '')
    })
  } else if(bowser.firefox) {
    [].forEach.call($('.opt-firefox'), function(o) {
      o.className = o.className.replace('hidden', '')
    })
  }
})
