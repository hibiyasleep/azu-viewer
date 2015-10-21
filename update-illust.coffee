#!/usr/bin/coffee
request = require 'request'
r = {}
for i in system
  r[i.name] = [
    i.nov_illust,
    i.adv_illust,
    i.exh_illust
  ]
  if i.inf_illust
    r[i.name][3] = i.inf_illust
  console.error i.name, i.inf?'(with inf)':''

console.log(JSON.stringify(r))
