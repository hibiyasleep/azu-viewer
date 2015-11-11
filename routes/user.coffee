request     = require 'request'
#filters     = require './filters.coffee'
config      = require '../config.json'
fetch       = require '../lib/fetch.coffee'
reassemble  = require '../lib/reassemble.coffee'
illust      = require '../lib/illust.coffee'

module.exports = (app, views) ->

  app.get '/:name', (req, res) ->

    name = req.params.name

    if name is '�' then name = ''

    fetch name, (e, d) ->

      unless error?

        res.send views.user d
