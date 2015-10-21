system = require('./json/system.json')
r = {}
for(var id in system){
  var i = system[id]
  r[i.name] = [
    i.nov_illust,
    i.adv_illust,
    i.exh_illust
  ]
  if(i.inf_illust){
    r[i.name][3] = i.inf_illust
  }
  console.error(i.name, i.inf?'(with inf)':'')
}

console.log(JSON.stringify(r))
