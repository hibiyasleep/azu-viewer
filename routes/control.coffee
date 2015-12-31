express = require 'express'
control = express()

request = require 'request'
azuinfo = require '../lib/api.coffee'

config = require '../config.json'

control.get '/refresh', (req, res) ->

  res.render 'refresh',
    api: config.api

control.get '/login', (req, res) ->

  if req.query.session

    unless /[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/i.test req.query.session
      res.render 'login',
        baseuri: config.baseuri,
        error: '잘못된 값입니다.'
    else
      azuinfo.get '/userdata/konami', req.query.session, (e, d) ->


  else
    res.render 'login',
      baseuri: config.baseuri

module.exports = (app) ->
  app.use '/control', control
