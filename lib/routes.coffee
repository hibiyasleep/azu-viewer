request     = require 'request'
#filters     = require './filters.coffee'
config      = require '../config.json'
reassemble  = require './reassemble.coffee'

NICK_REGEX  = /\/basic_json\/(.*?)\.json/

module.exports = (app, views) ->

  app.get '/:name', (req, res) ->

    name = req.params.name

    if name is '�' then name = ''

    # resolve name case

    request config.sdvx.baseuri + '/' + name, (e, r, d) ->
      if e or r.statuscode is not 200
        res.status 500
           .render views.error,
                   code: 500
                   error: e
        res.end()
        return e

      if NICK_REGEX.test d
        realname = /\/basic_json\/(.*?)\.json/.exec(d)[1]
      else
        res.status 404
           .render views.error,
                   code: 404
                   reason: '존재하지 않는 아이디입니다.'

      # retrieve basic_json

      request config.sdvx.baseuri + config.sdvx.basic_json + '/' + name + '.json',
        (e, r, basic_d) ->
          if e or r.statuscode is not 200
            res.status 500
               .render views.error,
                       code: 500
                       error: e
            res.end()
            return e

          # retrieve rest of data

          request config.sdvx.baseuri + config.sdvx.json + '/' + name + '.json',
            (e, r, d) ->
              if e or r.statuscode is not 200
                res.status 500
                   .render views.error,
                           code: 500
                           error: e
                res.end()
                return e

              [d, stat] = reassemble.sdvx JSON.parse d

              res.json
                meta: JSON.parse basic_d
                songs: d
                stat: stat
