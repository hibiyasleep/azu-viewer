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
          [cdn, user, songs] = reassemble JSON.parse(d).data

          callback null,
            cdn: cdn
            meta: user
            songs: songs

        catch e
          callback
            code: 500
            error: e,
            stack: e.stack
