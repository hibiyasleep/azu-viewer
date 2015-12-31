"use strict"

var JSONPRequest = function(uri, form, callbackName) {

  if(arguments.length === 2) {
    callbackName = form
    form = ''
  }

  this.script = document.createElement('script')
  this.script.setAttribute('type', 'text/javascript')
  this.script.setAttribute('src', uri + '?callback=' + callbackName)
}
