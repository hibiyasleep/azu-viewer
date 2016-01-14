request = require 'request'
config  = require '../config.json'

preserved = (callback) ->
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
    request config.baseuri + uri + '/' + session + '.json', preserved callback

  post: (uri, form, session, callback) ->
    request.post
      url: config.baseuri + uri + '/' + session + '.json'
      form: form,
      preserved callback
