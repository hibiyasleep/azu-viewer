control = require './control.coffee'
sdvx = require './sdvx.coffee'

module.exports = (app) ->
  sdvx app
  control app
