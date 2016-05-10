config  = require '../config.json'
azuinfo = require '../lib/api.coffee'

compare = (a, b) ->
  if a < b
    1
  else if a is 0 and b is 0
    2
  else if a is b
    0
  else
    -1

module.exports = (app) ->

  app.get '/sdvx/:name', (req, res) ->

    name = req.params.name

    if name is '�' then name = ''

    azuinfo.get config.sdvx.json, name, (e, d) ->

      if e
        switch e.resCode
          when -5, -6, -7, -8
            res.render '404'
          else
            res.render 'error', e

      else
        d = d.data

        songs = {}

        stat = Array.apply null, new Array 17
                    .map () ->
          totalcount: 0
          count: 0
          total: 0
          rank: [0, 0, 0, 0, 0, 0, 0]
          clear: [0, 0, 0, 0, 0]

        for id of d.song
          cdb = d.db[id]    # current db
          song = d.song[id]

          ns =
            title: cdb.title
            artist: cdb.artist
            isGravity: not not cdb.grv

          for fumen in ['nov', 'adv', 'exh', 'inf']

            stat[0].totalcount += 1
            if cdb[fumen]
              stat[cdb[fumen]].totalcount += 1

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

              level = cdb[fumen]

              stat[0].count += 1
              stat[level].count += 1

              stat[0].total += cf.score
              stat[level].total += cf.score

              if cf.score >= 9900000
                stat[0].rank[6] += 1
                stat[level].rank[6] += 1
              else
                stat[0].rank[cf.rank] += 1
                stat[level].rank[cf.rank] += 1

              stat[0].clear[cf.clear] += 1
              stat[level].clear[cf.clear] += 1

            else
              ns[fumen] = {}

          songs[id] = ns

        d.user.nickname = name

        res.set 'Etag', d.api.etag
        res.render 'sdvx',
          api: d.api,
          meta: d.user,
          stat: stat,
          songs: songs

  app.get '/sdvx/:name1/vs/:name2', (req, res) ->

    name1 = req.params.name1
    name2 = req.params.name2

    if name1 is '�' then name1 = ''
    if name2 is '�' then name2 = ''

    if name1 is name2
      res.redirect '../'
      return

    azuinfo.get config.sdvx.json, name1, (e, d1) ->

      if e
        switch e.resCode
          when -5, -6, -7, -8
            res.render '404'
          else
            res.render 'error', e
        return

      azuinfo.get config.sdvx.json, name2, (e, d2) ->
        if e
          switch e.resCode
            when -5, -6, -7, -8
              res.render '404'
            else
              res.render 'error', e
          return

        d1 = d1.data
        d2 = d2.data

        songs = {}

        id1 = Object.keys d1.song
        id2 = Object.keys d2.song

        ids = Array.from new Set [].concat id1, id2

        stat = Array.apply null, new Array 17
                    .map () ->
          count: 0
          total: 0
          vs: [0, 0, 0, 0]
          vslength: 0

        stat2 = Array.apply null, new Array 17
                    .map () ->
          count: 0
          total: 0

        for id in ids

          cdb = d1.db[id] or d2.db[id]    # current db
          song1 = d1.song[id]
          song2 = d2.song[id]

          ns =
            title: cdb.title
            artist: cdb.artist
            isGravity: not not cdb.grv

          for fumen in ['nov', 'adv', 'exh', 'inf']

            if song1 and song1[fumen].cnt?.play or song2 and song2[fumen].cnt?.play
              cf1 = song1?[fumen] or { score: 0 }
              cf2 = song2?[fumen] or { score: 0 }

              ns[fumen] =
                id: id
                level: cdb[fumen]
                illust: cdb['albumart_' + fumen]
                score: cf1.score or 0
                clear: cf1.clear or 0
                rank: cf1.rank or 0
                score2: cf2.score or 0
                clear2: cf2.clear or 0
                rank2: cf2.rank or 0
                vs: compare cf1.score or 0, cf2.score or 0

              level = cdb[fumen]

              # stat
              if cf1.cnt?.play > 0
                stat[0].count += 1
                stat[level].count += 1

                stat[0].total += cf1.score
                stat[level].total += cf1.score

              # stat2
              if cf2.cnt?.play > 0
                stat2[0].count += 1
                stat2[level].count += 1

                stat2[0].total += cf2.score
                stat2[level].total += cf2.score

              # vs
              stat[0].vs[1 + compare cf1.score or 0, cf2.score or 0] += 1
              stat[level].vs[1 + compare cf1.score or 0, cf2.score or 0] += 1

              stat[0].vslength += 1
              stat[level].vslength += 1

            else
              ns[fumen] = {}

          songs[id] = ns

        d1.user.nickname = name1
        d2.user.nickname = name2

        res.set 'Etag', d2.api.etag
        res.render 'sdvx',
          api: d1.api,
          meta: d1.user,
          meta2: d2.user,
          stat: stat,
          stat2: stat2
          songs: songs
