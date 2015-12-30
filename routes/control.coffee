express = require 'express'
control = express()

config = require '../config.json'

control.get '/refresh', (req, res) ->
  res.render 'refresh',
    api: config.api

module.exports = (app) ->
  app.use '/control', control
