fumens = ['nov', 'adv', 'exh', 'inf']

module.exports = (d) ->

    # song: [
    #   {
    #     title:
    #     artist:
    #     nov: {
    #       count: [ play / clear / uc / puc ]
    #       rank: 0-5 from D to AAA
    #       clear: 0-4 from F to PUC
    #       score:
    #

    nd = []
    # for 16 levels
    stat = Array.apply null, new Array 16
                .map () ->
      count: 0
      leveltotal: 0
      lamp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    db = d.db
    dt = d.song

    for id of dt

      cdb = db[id]
      song = dt[id]

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

      nd.push ns

    return nd
