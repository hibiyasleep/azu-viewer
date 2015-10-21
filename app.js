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
illust = require('./json/illust.json')
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
  request('http://sdvx.azu.kr/json/' + name + '.json', function(e, d){
    if(e || d.statusCode !== 200 && d.statusCode !== 404){
      res.sendFile(__dirname + '/public/error.html')
      res.end()
      return
    } else if(d.statusCode === 404){
      res.sendFile(__dirname + '/public/404.html')
      return
    }
    request('http://sdvx.azu.kr/basic_json/' + name + '.json', function(e, d_basic){
      if(e || d.statusCode !== 200 && d.statusCode !== 404){
        res.sendFile(__dirname + '/public/error.html')
        res.end()
        return
      }
      try {
        var j = JSON.parse(d.body)
        var j_basic = JSON.parse(d_basic.body)
      } catch(e) {
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
      res.send(index({
        body: j.map(function(o){
          var r = {
            d: [{}, {}, {}],
            title: o.song.name,
            artist: o.song.artist,
          }
          // song data
          // NOV
          if(o.nov_basic.play){
            overview[o.nov_detail.level-1].count += 1
            overview[o.nov_detail.level-1].leveltotal += parseInt(o.nov_detail.score)
            overview[o.nov_detail.level-1].lamp[5 - o.nov_basic.rank] += 1
            overview[o.nov_detail.level-1].lamp[6 + o.nov_basic.clear] += 1
            r.d[0] = o.nov_detail
            r.d[0].cleartype = o.nov_basic.clear
            r.d[0].rank = o.nov_basic.rank
          }
          // ADV
          if(o.adv_basic.play){
            overview[o.adv_detail.level-1].count += 1
            overview[o.adv_detail.level-1].leveltotal += parseInt(o.adv_detail.score)
            overview[o.adv_detail.level-1].lamp[5 - o.adv_basic.rank] += 1
            overview[o.adv_detail.level-1].lamp[6 + o.adv_basic.clear] += 1
            r.d[1] = o.adv_detail
            r.d[1].cleartype = o.adv_basic.clear
            r.d[1].rank = o.adv_basic.rank
          }
          // EXH
          if(o.exh_basic.play){
            overview[o.exh_detail.level-1].count += 1
            overview[o.exh_detail.level-1].leveltotal += parseInt(o.exh_detail.score)
            overview[o.exh_detail.level-1].lamp[5 - o.exh_basic.rank] += 1
            overview[o.exh_detail.level-1].lamp[6 + o.exh_basic.clear] += 1
            r.d[2] = o.exh_detail
            r.d[2].cleartype = o.exh_basic.clear
            r.d[2].rank = o.exh_basic.rank
          }
          // INF
          if(o.inf_basic && o.inf_basic.play){
            overview[o.inf_detail.level-1].count += 1
            overview[o.inf_detail.level-1].leveltotal += parseInt(o.inf_detail.score)
            overview[o.inf_detail.level-1].lamp[5 - o.inf_basic.rank] += 1
            overview[o.inf_detail.level-1].lamp[6 + o.inf_basic.clear] += 1
            r.last = 'inf'
            r.d[3] = o.inf_detail
            r.d[3].cleartype = o.inf_basic.clear
            r.d[3].rank = o.inf_basic.rank
          // GRV (oh mom please)
          } else if(o.grv_basic && o.grv_basic.play){
            overview[o.grv_detail.level-1].count += 1
            overview[o.grv_detail.level-1].leveltotal += parseInt(o.grv_detail.score)
            overview[o.grv_detail.level-1].lamp[5 - o.grv_basic.rank] += 1
            overview[o.grv_detail.level-1].lamp[6 + o.grv_basic.clear] += 1
            r.last = 'grv'
            r.d[3] = o.grv_detail
            r.d[3].cleartype = o.grv_basic.clear
            r.d[3].rank = o.grv_basic.rank
          }
          if(r.title in illust){
            r.d[0].illust = illust[r.title][0]
            r.d[1].illust = illust[r.title][1]
            r.d[2].illust = illust[r.title][2]
            if(!r.d[3] && illust[r.title].length == 4){
              r.d[3] = {}
              r.last = 'inf'
            }
            if(r.d[3]){
              r.d[3].illust = illust[r.title][3] || undefined
            }
          }
          return r
        }),
        name: name,
        basic: j_basic,
        overview: overview,
        fn: fnSet
      }))
      res.end()
    })
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
