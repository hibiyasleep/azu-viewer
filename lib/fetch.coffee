config      = require '../config.json'
reassemble  = require './reassemble.coffee'
request     = require 'request'

NICK_REGEX  = /\/basic_json\/(.*?)\.json/

module.exports = (name, callback) ->

    r = {}

    request config.baseuri + '/' + name, (e, r, d) ->
      if e or r.statuscode is not 200
        callback
          code: 500
          error: e

      else

        if NICK_REGEX.test d
          realname = /\/basic_json\/(.*?)\.json/.exec(d)[1]
        else
          ###
          console.log d
          callback
            code: 404
            reason: '존재하지 않는 아이디입니다.'
          ###
          realname = name

        # retrieve basic_json

        request config.baseuri + config.basic_json + name + '.json',
          (e, r, basic_d) ->
            if e or r.statuscode is not 200
              callback
                code: 500
                error: e

            # retrieve rest of data

            else request config.baseuri + config.json + name + '.json',
              (e, r, d) ->
                if e or r.statuscode is not 200
                  callback
                    code: 500
                    error: e
                else
                  try
                    [d, stat] = reassemble JSON.parse d

                    callback null,
                      meta: JSON.parse basic_d
                      songs: d
                      stat: stat

                  catch e
                    callback
                      code: 500
                      error: e
