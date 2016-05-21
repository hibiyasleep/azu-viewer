'use strict'

var $ = function $(selector, index) {
  'This is not jQuery, just shortcut for `document.querySelectorAll`.'
  if(/^#[0-9a-z_\-]+?$/.test(selector))
    return document.getElementById(selector.slice(1))
  else if(index != undefined)
    if(index == 0)
      return document.querySelector(selector)
    else
      return document.querySelectorAll(selector)[index]
  else
    return document.querySelectorAll(selector)
}

var animateNumber = function animateNumber(element, to, timeout, float) {
  if(typeof element === 'string') {
    element = $(element)
    if(element[0]) {
      element = element[0]
    }
  }

  var from = float? parseFloat(element.textContent) : parseInt(element.textContent)
  var step = (from - to) / (timeout / 20)
  var current = from - step

  var set = function(v) {
    element.textContent = float? v.toFixed(1) : ~~v
  }

  var interval = setInterval(function() {
    current -= step
    set(current)
    if(current == to) {
      clearInterval(interval)
    }
  }, 20)

  setTimeout(function() {
    clearInterval(interval)
    set(to)
  }, timeout)
}
