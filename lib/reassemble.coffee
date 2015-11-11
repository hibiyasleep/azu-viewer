fumens = ['nov', 'adv', 'exh', 'inf']

module.exports = (d, illust) ->

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

    nd = []
    # for 16 levels
    stat = Array.apply null, new Array 16
                .map () ->
      count: 0
      leveltotal: 0
      lamp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


    for song in d

      ns =
        title: song.song?.name,
        artist: song.song?.artist

      for fumen in [0..3]
        current = fumens[fumen]

        if song[current + '_basic'].play

          cf = song[current + '_detail']

          ns[fumen] =
            count: [
              cf.play, cf.clear, cf.ultimate, cf.perfect
            ]
            level: cf.level
            score: cf.score
            illust: cf.illust
            clear: song[current + '_basic'].clear
            rank: song[current + '_basic'].rank

          stat[cf.level - 1].count += 1
          stat[cf.level - 1].leveltotal += parseInt(cf.score)
          stat[cf.level - 1].lamp[song[current + '_basic'].rank] += 1
          stat[cf.level - 1].lamp[song[current + '_basic'].clear + 6] += 1

        else
          ns[fumen] = {}

      nd.push ns

    return [nd, stat]
