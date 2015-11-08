config  = require '../config.json'
request = require 'request'

module.exports =
  # callback: basic, main, error
  sdvx: (name, callback) ->

    r = {}

    request config.sdvx.baseuri + '/' + name, (e, r, d) ->
      if e or r.statuscode is not 200
        callback null, null,
                 code: 500
                 error: e

      else

        if NICK_REGEX.test d
          realname = /\/basic_json\/(.*?)\.json/.exec(d)[1]
        else
          callback null, null,
                   code: 404
                   reason: '존재하지 않는 아이디입니다.'

        # retrieve basic_json

        request config.sdvx.baseuri + config.sdvx.basic_json + '/' + name + '.json',
          (e, r, basic_d) ->
            if e or r.statuscode is not 200
              callback null, null,
                       code: 500
                       error: e

            # retrieve rest of data

            else request config.sdvx.baseuri + config.sdvx.json + '/' + name + '.json',
              (e, r, d) ->
                if e or r.statuscode is not 200
                  callback null, null,
                           code: 500
                           error: e
                else
                  [d, stat] = reassemble.sdvx JSON.parse d

                  callback JSON.parse(basic_d), d, stat
