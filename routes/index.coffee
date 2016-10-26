control = require './control.coffee'
sdvx = require './sdvx.coffee'
popn = require './popn.coffee'

module.exports = (app) ->
  sdvx app
  popn app
  control app
