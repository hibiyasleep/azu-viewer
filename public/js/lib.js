'use strict'

var $ = function $(selector) {
  'This is not jQuery, just shortcut for `document.querySelectorAll`.'
  if(/^#[0-9a-z_\-]+?$/.test(selector))
    return document.getElementById(selector.slice(1))
  else
    return document.querySelectorAll(selector)
}

var animateNumber = function animateNumber(element, to, timeout, float) {
  var from = float? parseFloat(element.textContent) : parseInt(element.textContent)
  var step = (from - to) / (timeout / 10)
  var current = from

  var set = function(v) {
    element.textContent = float? v.toFixed(1) : ~~v
  }

  var interval = setInterval(function() {
    current -= step
    set(current)
    if(current == to) {
      clearInterval(interval)
    }
  }, 10)

  setTimeout(function() {
    clearInterval(interval)
    set(to)
  }, timeout)
}
