config      = require '../config.json'
reassemble  = require './reassemble.coffee'
request     = require 'request'

NICK_REGEX  = /\/basic_json\/(.*?)\.json/

module.exports = (name, callback) ->

  request config.baseuri + config.json + name + '.json',
    (e, r, d) ->
      if e or r.statuscode is not 200
        callback
          code: 500
          error: e
          stack: e.stack
      else
        try
          data = JSON.parse(d).data
          songs = reassemble data

          callback null,
            api: data.api
            meta: data.user
            songs: songs

        catch e
          callback
            code: 500
            error: e,
            stack: e.stack
