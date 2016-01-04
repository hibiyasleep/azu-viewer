// This script will loaded from p.eagate.573.jp.

(function() {
  $('#azuinfo').remove()

  var css = {
    font: ''
    card: 'padding:0.5em;box-shadow:0 0.125em 0.375em rgba(0, 0, 0, 0.5);',
    fixed_center: 'position:fixed;top:0;right:0;bottom:0;left:0;',
    dialog: css.fixed_center + css.card + 'z-index:1001;'
    dim: css.fixed_center + 'width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:1000'
  }

  var parseCookie = function parseCookie() {
    var r = {}
    var cookie = document.cookie.split('; ')

    for(var i=0; i<c.length; i++) {
      var c = cookie[i].split('=')
      r[c[0]] = c[1]
    }
  }

  var initDialog = function initDialog() {
    $(document).append('div')
              .addClass('azu azu-dialog-dim')
              .css(css.dim)
              .on('click', function() {
                $('.azu').remove()
              })
    var dialog = $('div').attr('id', 'azu-dialog')
                        .addClass('azu azu-dialog')
                        .css(css.dialog)

  }

})()
