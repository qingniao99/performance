// https://caniuse.com/#feat=resource-timing
//performance polyfill, fuck!
const userTiming = require("usertiming");
const cookieTool = require("js-cookie");

const performanceConfig = require("../config");
