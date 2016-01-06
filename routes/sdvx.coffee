config  = require '../config.json'
azuinfo = require '../lib/api.coffee'

module.exports = (app) ->

  app.get '/sdvx/:name', (req, res) ->

    name = req.params.name

    if name is '�' then name = ''

    azuinfo.get '/playdata/sdvx', name, (e, d) ->

      if e
        switch e.resCode
          when -5, -6, -7, -8
            res.render '404'
          else
            res.render 'error', e

      else
        d = d.data

        songs = []

        stat = Array.apply null, new Array 16
                    .map () ->
          count: 0
          leveltotal: 0
          lamp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        for id of d.song
          cdb = d.db[id]    # current db
          song = d.song[id]

          ns =
            title: cdb.title
            artist: cdb.artist
            isGravity: not not cdb.grv

          for fumen in ['nov', 'adv', 'exh', 'inf']

            if song[fumen].cnt?.play
              cf = song[fumen]

              ns[fumen] =
                id: id
                count: [
                  cf.cnt.play, cf.cnt.clear, cf.cnt.ultimate, cf.cnt.perfect
                ]
                level: cdb[fumen]
                score: cf.score
                illust: cdb['albumart_' + fumen]
                clear: cf.clear
                rank: cf.rank

              stat[cdb[fumen] - 1].count += 1
              stat[cdb[fumen] - 1].leveltotal += cf.score
              stat[cdb[fumen] - 1].lamp[cf.rank] += 1
              stat[cdb[fumen] - 1].lamp[cf.clear + 6] += 1

            else
              ns[fumen] = {}

          songs.push ns

        d.user.nickname = name

        res.set 'Etag', d.api.etag
        res.render 'sdvx',
          api: d.api,
          meta: d.user,
          stat: stat,
          songs: songs
