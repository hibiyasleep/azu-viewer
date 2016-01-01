express = require 'express'
control = express()

request = require 'request'
azuinfo = require '../lib/api.coffee'

config = require '../config.json'
error = require '../lib/error.coffee'

handle = (name, callback) ->
  (e, d) ->
    if e
      res.render 'error', e

    else if d.resCode? < 0
      res.render name
        baseuri: config.baseuri,
        error: error[d.resCode] || '알 수 없는 에러. (' + d.resCode + ')'

    else
      callback d

control.get '/', (req, res) ->
  unless req.session.id
    res.redirect './login'

  else
    azuinfo.get '/userdata', req.session.id, handle 'control', (d) ->
      res.render 'control',
        baseuri: config.baseuri
        d: d

control.get '/login', (req, res) ->
  if req.query.session
    unless /[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/i.test req.query.session
      res.render 'login',
        baseuri: config.baseuri,
        error: '잘못된 값입니다.'

    else
      azuinfo.get '/userdata/konami', req.query.session, handle 'login', (d) ->
        req.session.id = d.session

        azuinfo.get '/userdata', d.session, handle 'login', (d) ->
          if d.nickname is null
            res.redirect './nickname#register'
          else
            res.redirect '.'

  else
    res.render 'login',
      baseuri: config.baseuri

module.exports = (app) ->
  app.use '/control', control
