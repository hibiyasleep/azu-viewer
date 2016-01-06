#!/usr/bin/env coffee

sassMiddleware  = require 'node-sass-middleware'
serveStatic     = require 'serve-static'
session         = require 'express-session'
express         = require 'express'
moment          = require 'moment'
ejs             = require 'ejs'
fs              = require 'fs'

config          = require './config.json'
routes          = require './routes'

app = express()

app.get '/*', (req, res, next) ->
  res.set 'X-XSS-Protection', 0
  res.set 'Cache-Control', 'max-age=0'

  next()

app.set 'view engine', 'ejs'

app.use sassMiddleware
  src: __dirname
  dest: __dirname
  indentedSyntax: true
  sourceMap: true
  prefix: '/!'

app.use session
  secret: '64KY64qUIOywqe2VmOuLpAo='

app.use '/!/public', serveStatic __dirname + '/public'

app.get '/', (req, res) -> res.render 'index'

routes app

# listen

if typeof config.listen is 'string'
  c = () ->
    app.listen config.listen
    fs.chmod config.listen, '777', () ->
      console.log 'Now listening on ' + config.listen

  fs.access config.listen, (error) ->
    if error
      c()
    else
      fs.unlink config.listen, c

else
  app.listen config.listen
  console.log 'Now listening on ' + config.listen
