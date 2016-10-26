request = require 'request'
config  = require '../config.json'

wrap = (callback) ->
  (e, r, d) ->
    if e
      callback e, null

    else if r.statusCode isnt 200
      callback
        code: r.statusCode,
        stack: 'API Server has responded with status code ' + r.statusCode + '.'
      , null

    else
      j = JSON.parse d

      if j.resCode < 0
        callback j, null
      else
        callback null, j

module.exports =
  get: (uri, session, callback) ->
    request config.baseuri + uri + '/' + session + '.json', wrap callback

  post: (uri, form, session, callback) ->
    request.post
      url: config.baseuri + uri + '/' + session + '.json'
      form: form,
      wrap callback

  mergeDB: (song, db, option) ->
    ###
    option:
      copy: copy db[key] to song[level][value].
      edit: move song[level][key] to song[level][value].
      enum: move song[level][key] to song[level][key]: [value[0], value[1]]...
        ex) cnt: ['clear', 'fc', 'perfect', 'highlight']
      prefixCopy: copy db[prefix+key] to song[level][value].
        prefix: ''
        copy: =../copy
      levels: [] ex) 'nov', 'adv', 'exh'. Used to copy level information.
      optionalLevels: [] ex) ['inf'], ['easy', 'ex']
      playFilter: (fumen) -> should return 'this fumen was played?'. default: fumen.score==0 || fumen.cnt.play==0
      stat:
        maxLevel: 0 ex) 16, 50

        count: [] count values, store to array (of level).
        total: [] sum values, store to total value (of level).
    ###

    result = {}

    if option.stat
      stat_o =
        count: 0

      if option.stat.total
        for i in option.stat.total
          stat_o[i] = 0

      if option.stat.count
        for i in option.stat.count
          stat_o[i] = []

      console.log stat_o
      stat = new Array option.stat.maxLevel + 1
                  .fill stat_o

    key1 = Object.keys song
    key2 = Object.keys db

    keys = Array.from new Set key1.concat key2

    for id in keys
      csong = song[id]
      cdb = db[id]

      for f in option.levels

        cfumen = csong[f]

        unless cfumen then continue

        for from, to of option.copy
          cfumen[to] = cdb[from]

        for from, en of option.enum
          r = []
          for k, i in en
            r[i] = cfumen[from][k]
          cfumen[from] = r

        for from, to of option.edit
          cfumen[to] = cfumen[from]
          delete cfumen[from]

        if option.stat
          clv = cdb[f]

          stat[0].count += 1
          stat[clv].count += 1

          if option.stat.total
            for i in option.stat.total
              v = cfumen[i]
              stat[0][i] = if stat[0][i] then stat[0][i] + v else v
              stat[clv][i] = if stat[clv][i] then stat[clv][i] + v else v

          if option.stat.count
            for i in option.stat.count
              v = cfumen[i]
              console.log clv, i, v, stat[0], stat[clv]
              stat[0][i][v] = if stat[0][i][v] then stat[0][i][v] + 1 else 1
              stat[clv][i][v] = if stat[clv][i][v] then stat[clv][i][v] + 1 else 1

        result[id] ?= {}
        result[id][f] = cfumen

    stat: stat or false
    song: result
