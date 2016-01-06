'use strict'

var $ = function(selector) {
  'This is not jQuery, just shortcut for `document.querySelectorAll`.'
  if(/^#[0-9a-z_\-]+?$/.test(selector))
    return document.getElementById(selector.slice(1))
  else
    return document.querySelectorAll(selector)
}
