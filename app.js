doT = require('dot').process({
  path: './views'
})
// doT template
index = require('./views/index')

request = require('request')
express = require('express')
serveStatic = require('serve-static')

fs = require('fs')
app = express()

config = require('./package.json').config

fnSet = { // Functions for in-template use
  score: function(n){
    if(!n)
      return ''
    else if(typeof n === 'number')
      n = n + ''
    if(n.length > 4)
      return n.substr(0, n.length-4) + '<span>' + n.slice(n.length-4) + '</span>'
    else
      return '<span>' + n + '</span>'
  },
  zfill: function(n){
    if(!n)
      return '000.000000'
    else
      return ('00' + n.toFixed(6)).substr(-10)
  }
}

app.use(serveStatic('./public'))
app.use(function(err, res, req, next){
  res.sendFile(__dirname + '/public/error.html')
  res.end()
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/:nickname', function(req, res){
  var name = req.params.nickname
  if(name === '�'){
    name = ''
  }
  request('http://api.kano.kr/playdata/sdvx/' + name + '.json', function(e, d){
    if(e){
      res.sendFile(__dirname + '/public/error.html')
      return
    }
    try {
      var j = JSON.parse(d.body)
    } catch(e) {
      res.sendFile(__dirname + '/public/error.html')
      return
    }

    if(j.resCode && j.resCode == -6){
      res.sendFile(__dirname + '/public/404.html')
      return
    } else if(j.resCode && j.resCode != 0) {
      res.sendFile(__dirname + '/public/error.html')
      return
    }

    var overview = Array.apply(null, new Array(16)).map(function(){
      return {
        'count': 0,
        'leveltotal': 0,
        'lamp': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // AAA AA A B C D c C C U P
      }
    })

    var body = []
    var db = j.data.db

    for(var i in j.data.song) {
      var o = j.data.song[i]
      var r = {
        d: [{
          level: db[i].nov,
          illust: db[i].albumart_nov,
          cnt: {}
        }, {
          level: db[i].adv,
          illust: db[i].albumart_adv,
          cnt: {}
        }, {
          level: db[i].exh,
          illust: db[i].albumart_exh,
          cnt: {}
        }, (db[i].grv || db[i].inf) && {
          level: db[i].inf,
          illust: db[i].albumart_inf,
          cnt: {}
        } || undefined ],
        title: db[i].title,
        artist: db[i].artist,
      }
      // song data
      // NOV
      if(Object.keys(o.nov).length && o.nov.cnt.play){
        var levelindex = db[i].nov - 1
        overview[levelindex].count += 1
        overview[levelindex].leveltotal += o.nov.score || 0
        overview[levelindex].lamp[5 - o.nov.rank] += 1
        overview[levelindex].lamp[6 + o.nov.clear] += 1
        r.d[0].cnt = o.nov.cnt
        r.d[0].score = o.nov.score
        r.d[0].cleartype = o.nov.clear
        r.d[0].rank = o.nov.rank
      }
      // ADV
      if(Object.keys(o.adv).length && o.adv.cnt.play){
        var levelindex = db[i].adv - 1
        overview[levelindex].count += 1
        overview[levelindex].leveltotal += o.adv.score || 0
        overview[levelindex].lamp[5 - o.adv.rank] += 1
        overview[levelindex].lamp[6 + o.adv.clear] += 1
        r.d[1].cnt = o.adv.cnt
        r.d[1].score = o.adv.score
        r.d[1].cleartype = o.adv.clear
        r.d[1].rank = o.adv.rank
      }
      // EXH
      if(Object.keys(o.exh).length && o.exh.cnt.play){
        var levelindex = db[i].exh - 1
        overview[levelindex].count += 1
        overview[levelindex].leveltotal += o.exh.score || 0
        overview[levelindex].lamp[5 - o.exh.rank] += 1
        overview[levelindex].lamp[6 + o.exh.clear] += 1
        r.d[2].cnt = o.exh.cnt
        r.d[2].score = o.exh.score
        r.d[2].cleartype = o.exh.clear
        r.d[2].rank = o.exh.rank
      }
      // INF, o.inf.cnt)
      if(db[i].inf && Object.keys(o.inf).length && o.inf.cnt.play){
        var levelindex = db[i].inf - 1
        overview[levelindex].count += 1
        overview[levelindex].leveltotal += o.inf.score || 0
        overview[levelindex].lamp[5 - o.inf.rank] += 1
        overview[levelindex].lamp[6 + o.inf.clear] += 1
        r.d[3].cnt = o.inf.cnt

        r.d[3].score = o.inf.score
        r.d[3].cleartype = o.inf.clear
        r.d[3].rank = o.inf.rank
      }

      if(db[i].grv) {
        r.last = 'grv'
      } else if(db[i].inf) {
        r.last = 'inf'
      }

      body.push(r)
    }

    res.send(index({
      cdn: j.data.api.cdn,
      body: body,
      name: name,
      basic: j.data.user,
      overview: overview,
      fn: fnSet
    }))
    res.end()
  })
})

if(typeof config.listen === 'string'){
  var c = function(){
    app.listen(config.listen)
    fs.chmod(config.listen, '777', function(){
      console.log('Now listening on ' + config.listen)
    })
  }

  fs.access(config.listen, function(error){
    if(!error)
      fs.unlink(config.listen, c)
    else
      c()
  })
} else {
  app.listen(config.listen)
  console.log('Now listening on ' + config.listen)
}
