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

        if e
          res.render 'error', e

        else if d.resCode? is -1
          res.render 'login',
            baseuri: config.baseuri,
            error: '잘못된 쿠키입니다. e-AMUSEMENT 페이지를 새로고침 후 다시 시도해 보세요.'

        else
          req.session.id = d.session

          azuinfo.get '/userdata', d.session, (e, d) ->

            if e
              res.render 'error', e

            else if d.resCode? is -2
              res.render 'login',
                baseuri: config.baseuri,
                error: '세션이 잘못되었습니다. e-AMUSEMENT 페이지를 새로고침 후 다시 시도해 보세요.'

            else
              if d.nickname is null
                res.redirect './nickname#register'
              else
                res.redirect '.'

  else
    res.render 'login',
      baseuri: config.baseuri

module.exports = (app) ->
  app.use '/control', control
