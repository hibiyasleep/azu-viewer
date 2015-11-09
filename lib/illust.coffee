config  = require '../config.json'
request = require 'request'

last = 0
cache = {}

module.exports = (callback) ->

  now = Date.now()

  if now - last > (4 * 60 * 60 * 1000)

    request config.sdvx.baseuri + config.sdvx.basic_json + '/system.json',
      (error, responce, data) ->
        if error or responce.statuscode is not 200
          callback error
        else
          d = JSON.parse data
          r = {}

          for id in d
            i = d[id]
            r[i.name] = [
              i.nov_illust
              i.adv_illust
              i.exh_illust
            ]
            if i.inf_illust
              r[i.name][3] = i.inf_illust

          cache = r
          last = new Date

          callback null, r
