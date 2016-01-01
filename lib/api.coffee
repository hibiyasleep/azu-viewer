request = require 'request'
config  = require '../config.json'

module.exports =
  get: (uri, session, callback) ->
    request config.baseuri + uri + '/' + session + '.json',
            (e, r, d) ->
      if e
        callback e, null
      else
        callback null, JSON.parse d

  post: (uri, form, session, callback) ->
    request.post config.baseuri + uri + '/' + session + '.json',
                 form,
                 (e, r, d) ->
      if e
        callback e, null
      else
        callback null, JSON.parse d
