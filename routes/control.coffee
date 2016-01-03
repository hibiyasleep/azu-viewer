express = require 'express'
control = express()

request = require 'request'
azuinfo = require '../lib/api.coffee'

config = require '../config.json'
error = require '../lib/error.coffee'

handle = (res, name, callback) ->

  if not callback

    callback = (d) ->
      res.render name,
        baseuri: config.baseuri,
        d: d || {}

  else if typeof callback is 'string'

    target = callback

    callback = (d) ->
      res.redirect target

  return (e, d) ->

    if e
      res.render 'error', e

    else if d.resCode? < 0
      res.render name
        baseuri: config.baseuri,
        error: error[d.resCode] || '알 수 없는 에러. (' + d.resCode + ')'

    else
      callback d

checkLogin = (req, res, next) ->

  unless req.session.sess
    res.redirect './login#not-logged-in'
    res.end()

  else
    next()

control.get '/', checkLogin, (req, res) ->
  azuinfo.get '/userdata', req.session.sess, handle res, 'control/index'

control.get '/login', (req, res) ->

  if req.query.session
    unless /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test req.query.session
      res.render 'control/login',
        baseuri: config.baseuri,
        error: '잘못된 값입니다.'

    else
      azuinfo.get '/userdata/konami', req.query.session, handle res, 'control/login', (d) ->

        req.session.sess = d.session

        azuinfo.get '/userdata', d.session, handle res, 'control/login', (d) ->

          if d.nickname is null
            res.redirect './nickname#register'

          else
            res.redirect '.'

  else
    res.render 'control/login',
      baseuri: config.baseuri

control.get '/nickname', checkLogin, (req, res) ->

  if req.query.nickname
    unless /^[0-9a-zA-Z_]{2,16}$/.test req.query.nickname
      res.render 'nickname',
        baseuri: config.baseuri,
        error: '허용되지 않는 닉네임입니다.'

    else unless req.session.sess
      res.redirect './login'

    else
      azuinfo.post '/userdata/nickname',
                   nickname: req.query.nickname,
                   req.session.sess,
                   handle res, 'control/nickname', './#nickname'

control.get '/logout', checkLogin, (req, res) ->

  if req.session.sess
    req.session.destroy()

  res.redirect './login#logged-out'

module.exports = (app) ->
  app.use '/control', control
