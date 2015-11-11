config      = require '../config.json'
reassemble  = require './reassemble.coffee'
request     = require 'request'

NICK_REGEX  = /\/basic_json\/(.*?)\.json/

module.exports = (name, callback) ->

    r = {}

    request config.sdvx.baseuri + '/' + name, (e, r, d) ->
      if e or r.statuscode is not 200
        callback null,
                 code: 500
                 error: e

      else

        if NICK_REGEX.test d
          realname = /\/basic_json\/(.*?)\.json/.exec(d)[1]
        else
          callback
            code: 404
            reason: '존재하지 않는 아이디입니다.'

        # retrieve basic_json

        request config.sdvx.baseuri + config.sdvx.basic_json + '/' + name + '.json',
          (e, r, basic_d) ->
            if e or r.statuscode is not 200
              callback
                code: 500
                error: e

            # retrieve rest of data

            else request config.sdvx.baseuri + config.sdvx.json + '/' + name + '.json',
              (e, r, d) ->
                if e or r.statuscode is not 200
                  callback
                    code: 500
                    error: e
                else
                  [d, stat] = reassemble JSON.parse d

                  callback null,
                    meta: JSON.parse(basic_d)
                    songs: d
                    stat: stat
