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
      res.end()
      return
    }
    try {
      var j = JSON.parse(d.body)
    } catch(e) {
      res.sendFile(__dirname + '/public/error.html')
      return
    }

    if(j.resCode!=0){
      res.sendFile(__dirname + '/public/error.html')
      return;
    }

    var j_basic = {"play": j.data.user.play, "name": j.data.user.name, "packet": j.data.user.packet, "error": 0, "skill_name": j.data.user.skill_name, "block": j.data.user.block, "skill_no": j.data.user.skill_no};

    j = (function(data){
      var convert = [];
      var diff_db = ["nov","adv","exh","inf"];

      for(var target in data["data"]["song"]){
        var output = {};

        for(var i=0;i<diff_db.length;i++){
          var diff = diff_db[i];

          if(data["data"]["song"][target][diff]["cnt"]){
            if(data["data"]["song"][target][diff]["cnt"]["play"]==0)
              output[diff+"_basic"] = {"play": false};
            else{
              output[diff+"_basic"] = {"play": true, "clear": data["data"]["song"][target][diff]["clear"], "rank": data["data"]["song"][target][diff]["rank"]};
              output[diff+"_detail"] = {"perfect": data["data"]["song"][target][diff]["cnt"]["perfect"], "play": data["data"]["song"][target][diff]["cnt"]["play"], "level": data["data"]["db"][target][diff], "clear": data["data"]["song"][target][diff]["cnt"]["clear"], "score": data["data"]["song"][target][diff]["score"], "ultimate": data["data"]["song"][target][diff]["cnt"]["ultimate"], "illust": data["data"]["db"][target]["albumart_"+diff]};
            }
          }
          else
            output[diff+"_basic"] = {"play": false};
        }

        output["song"] = {"name": data["data"]["db"][target]["title"], "artist": data["data"]["db"][target]["artist"]};

        convert.push(output);
      }
      return convert;
    })(j);

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
          r.d[0].illust = "http://cdn.azu.kr"+o.nov_detail.illust
        }
        else
          r.d[0].illust = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
        // ADV
        if(o.adv_basic.play){
          overview[o.adv_detail.level-1].count += 1
          overview[o.adv_detail.level-1].leveltotal += parseInt(o.adv_detail.score)
          overview[o.adv_detail.level-1].lamp[5 - o.adv_basic.rank] += 1
          overview[o.adv_detail.level-1].lamp[6 + o.adv_basic.clear] += 1
          r.d[1] = o.adv_detail
          r.d[1].cleartype = o.adv_basic.clear
          r.d[1].rank = o.adv_basic.rank
          r.d[1].illust = "http://cdn.azu.kr"+o.adv_detail.illust
        }
        else
          r.d[1].illust = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
        // EXH
        if(o.exh_basic.play){
          overview[o.exh_detail.level-1].count += 1
          overview[o.exh_detail.level-1].leveltotal += parseInt(o.exh_detail.score)
          overview[o.exh_detail.level-1].lamp[5 - o.exh_basic.rank] += 1
          overview[o.exh_detail.level-1].lamp[6 + o.exh_basic.clear] += 1
          r.d[2] = o.exh_detail
          r.d[2].cleartype = o.exh_basic.clear
          r.d[2].rank = o.exh_basic.rank
          r.d[2].illust = "http://cdn.azu.kr"+o.exh_detail.illust
        }
        else
          r.d[2].illust = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
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
          r.d[3].illust = "http://cdn.azu.kr"+o.inf_detail.illust
        // GRV (oh mom please)
        }
        else
          r.d[3] = {illust: "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="};
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
