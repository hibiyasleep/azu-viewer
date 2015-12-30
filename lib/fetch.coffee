config      = require '../config.json'
request     = require 'request'

NICK_REGEX  = /\/basic_json\/(.*?)\.json/

module.exports = (name, device, callback) ->

  request config.baseuri + config[device].json + name + '.json',
    (e, r, d) ->
      if e or r.statuscode is not 200
        callback
          code: 500
          error: e
          stack: e.stack
      else
        try
          data = JSON.parse(d).data

          callback null, data

        catch e
          callback
            code: 500
            error: e,
            stack: e.stack
