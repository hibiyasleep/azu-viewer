request = require 'request'
#filters = require './filters.coffee'
config = require '../config.json'

NICK_REGEX = /\/basic_json\/(.*?)\.json/

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
        (e, r, d) ->
          if e or r.statuscode is not 200
            res.status 500
               .render views.error,
                       code: 500
                       error: e

          # retrieve rest of data

          request config.sdvx.baseuri + config.sdvx.json + '/' + name + '.json',
            (e, r, d) ->
              if e or r.statuscode is not 200
                res.status 500
                   .render views.error,
                           code: 500
                           error: e

              # song: [
              #   {
              #     title:
              #     artist:
              #     nov: {
              #       count: { play / clear / uc / puc }
              #       rank: 0-5 from D to AAA
              #       clear: 0-4 from F to PUC
              #       score:
              #


              d = JSON.parse d

              reassemble.sdvx(d)
