'use strict'

window.addEventListener('load', function() {
  var e = $('#error')
  var s = $('#loading')

  var error = function(string) {
    s.className = 'hidden'
    e.className = ''
    e.textContent = string
  }

  var loadState = function(state) {
    if(!state) {
      s.className = 'hidden'
    } else {
      s.className = ''
      e.className = 'hidden'
    }
  }

  $('#card').addEventListener('click', function() {
    var card = $('#card')
    card.removeEventListener('click', this)

    var xhr = new XMLHttpRequest()

    xhr.open('GET', BaseURI + '/userdata/card/' + session + '.json', true)

    xhr.onload = function() {
      if(xhr.readyState === 4) {
        if(xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          if(res.resCode === -2) {
            location.reload()
            return
          }
          if(res.card) {
            card.value = res.card
          } else {
            card.className += ' input-error'
            card.value = res.res
          }
        }
      }
    }

    xhr.send(null)
  })

  $('#request').addEventListener('click', function() {
    var card = $('#card')
    var password = $('#password')
    var swap = $('#swap')
    var devices = $('.input-devices:checked')
    var device = 0

    for(var i=0; i<devices.length; i++) {
      device += parseInt(devices[i].value)
    }

    if(/^[0-9A-Z]{16}$/.test(card.value) === false
      || /^[0-9]{4}$/.test(password.value) === false
      || device === 0) {
      error('요청이 완전하지 않습니다. 내용을 확인 후 다시 시도해 주세요.')
    } else {
      loadState(true)

      var data = 'card=' + card.value +
                 '&password=' + password.value +
                 '&device=' + device +
                 '&swap=1'

      var xhr = new XMLHttpRequest()
      xhr.open('POST', BaseURI + '/userdata/refresh/' + session + '.json', true)

      xhr.onload = function() {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            var res = JSON.parse(xhr.responseText)
            switch(res.resCode) {
              case 0:
                alert('갱신이 요청되었습니다!')
                location.reload()
                break;
              case -2:
                location.reload()
                break;
              default:
                error('문제가 발생했습니다: ' + res.res)
            }
          }
        }
      }

      xhr.onerror = function(e) {
        error(xhr.statusText)
      }

      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send(data)
    }
  })
})
