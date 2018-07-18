// https://caniuse.com/#feat=resource-timing
//performance polyfill, fuck!
var userTiming = require("usertiming");
var util = require("./util");
var performanceConfig = require("../config");

util.emitHttp({
  a: 666
}, performanceConfig.imgUrl)
