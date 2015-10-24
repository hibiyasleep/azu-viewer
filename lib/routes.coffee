request = require 'request'
config = require '../config.json'
filters = require './filters.coffee'

module.exports = (app) ->

  app.get '/:username', (req, res) ->

    name = req.params.name

    if name is '�' then name = ''

    # resolve name case

    request config.sdvx.baseuri + '/' + name, (e, r, d) ->
      unless error or r.statuscode is not 200
        console.error e
      else
        realname = /\/basic_json\/(.*?)\.json/.exec(d)[1]
        console.log realname

        request config.sdvx.baseuri + config.sdvx.basic_json + '/' + name,
                (e, r, d) ->
          unless error or r.statuscode is not 200
            console.error e
          else
            req.jsonp d
