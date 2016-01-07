express = require 'express'
control = express()

request = require 'request'
moment  = require 'moment'
azuinfo = require '../lib/api.coffee'

config = require '../config.json'
error = require '../lib/error.coffee'

moment.locale 'ko'

control.locals =
  moment: moment
  static: config.static
  baseuri: config.baseuri

handle = (res, name, callback) ->

  if not callback
    callback = (d) ->
      res.render name,
        d: d || {}

  else if typeof callback is 'string'
    target = callback

    callback = (d) ->
      res.redirect target

  return (e, d) ->

    if e and e.resCode < 0
      res.render name || error,
        login_uri: res.login_uri || ''
        error: error[e.resCode] || '알 수 없는 에러. (' + d.resCode + ')'

    else if e and not e.resCode
      res.render 'error', e

    else
      callback d

checkLogin = (req, res, next) ->

  unless req.session.sess
    res.redirect './login#not-logged-in'
    res.end()

  else
    next()

control.get '/', checkLogin, (req, res) ->

  azuinfo.get '/userdata', req.session.sess, (e, d) ->

    if e
      if e.resCode is -2
        res.redirect './login#not-logged-in'
      else
        res.render 'error', e

    else unless d.nickname
      res.redirect './nickname#register'

    else
      azuinfo.get '/userdata/refresh', req.session.sess, handle res, null, (refresh) ->
        res.locals =
          session: req.session.sess

        res.render 'control/index',
          user: d,
          refresh: refresh.data

control.get '/login', (req, res) ->

  res.login_uri = req.protocol + '://' + req.get('X-Forwarded-Host') or req.get('Host') + config.login

  if req.session.sess
    res.redirect './'

  else if req.query.session
    unless /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test req.query.session
      res.render 'control/login',
        login_uri: res.login_uri
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
      login_uri: res.login_uri

control.get '/nickname', checkLogin, (req, res) ->

  if req.query.nickname
    unless /^[0-9a-zA-Z_]{2,16}$/.test req.query.nickname
      res.render 'control/nickname',
        error: '허용되지 않는 닉네임입니다.'

    else unless req.session.sess
      res.redirect './login'

    else
      res.locals =
        session: req.session.sess

      azuinfo.post '/userdata/nickname',
                   nickname: req.query.nickname,
                   req.session.sess,
                   handle res, 'control/nickname', ->
                     res.redirect './#nickname'

  else
    res.render 'nickname'

control.get '/logout', checkLogin, (req, res) ->

  if req.session.sess
    req.session.destroy()

  res.redirect './login#logged-out'

module.exports = (app) ->
  app.use '/control', control
