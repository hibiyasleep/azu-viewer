class module.exports
  sdvx: (d) ->
    nd = []
    # for 16 levels
    stat = Array.apply null, new Array 16
                .map () ->
      count: 0
      leveltotal: 0
      lamp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


    for song in d

      ns =
        title: song.title,
        artist: song.artist

      for fumen in ['nov', 'adv', 'exh', 'inf']

        if song[fumen + '_basic']?.play

          cf = song[fumen + '_detail']

          ns[diff] =
            count: [
              cf.play, cf.clear, cf.ultimate, cf.perfect
            ]
            level: cf.level
            score: cf.score
            illust: cf.illust
            clear: song[fumen + '_basic'].clear
            rank: song[fumen + '_basic'].rank

          stat[cf.level].count += 1
          stat[cf.level].leveltotal += cf.score
          stat[cf.level].lamp[song[fumen + '_basic'].rank] += 1
          stat[cf.level].lamp[song[fumen + '_basic'].clear + 6] += 1

        else
          ns[fumen] = {}

    return nd
