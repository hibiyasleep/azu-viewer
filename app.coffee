#!/usr/bin/env coffee

require 'dot'
        .process path: './views'

sassMiddleware  = require 'node-sass-middleware'
serveStatic     = require 'serve-static'
express         = require 'express'
fs              = require 'fs'

config          = require './config.json'
routes          = require './lib/routes.coffee'
views =
  user: require './views/user.js'

app = express()

app.use sassMiddleware
  src: __dirname
  dest: __dirname
  indentedSyntax: true

app.use '/!/public', serveStatic __dirname + 'public/'

routes app, views

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
