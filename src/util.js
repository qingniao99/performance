function sub(s) {
  if (/=/.test(s) && s.lastIndexOf('=')) {
    return s.substring(s.lastIndexOf('=') + 1);
  }
  if (s.lastIndexOf('/')) {
    return s.substring(s.lastIndexOf('/') + 1);
  }
}

function sub2(s) {
  if (/com/.test(s) && s.lastIndexOf('.com')) {
    s = s.substring(s.lastIndexOf('.com') + 4);
  } else {
    s = s;
  }
  if (/\?/.test(s) && s.indexOf("?")) {
    return s.substring(0, s.indexOf("?"));
  } else {
    return s;
  }
}

function json2url(json) { //json转url参数
  var a = [];
  for (var i in json) {
    var v = json[i] + '';
    v = v.replace(/\n/g, '<br/>');
    v = encodeURIComponent(v);
    a.push(i + '=' + v);
  }
  return a.join('&');
}

function jsonConcat(object1, object2) { //简易合并
  for (var key in object2) {
    object1[key] = object2[key];
  }
  return object1;
}

function rndNum() {
  return (new Date().getTime() + parseInt(20121221 * Math.random(0, 1))).toString(36);
}

function hashCode(str) { //s to n
  var h = 0;
  var len = str.length;
  var t = 2147483648;
  for (var i = 0; i < len; i++) {
    h = 31 * h + str.charCodeAt(i);
    if (h > 2147483647) h %= t;
  }
  return h;
}

function emitHttp(json, url) { //发送信息到http服务器  里面要追加信息标识 比如info error等
  var n = 'tmp_' + this.rndNum(),
    img = window[n] = new Image();
  img.onload = img.onerror = function () {
    window[n] = null;
  };
  if (json) {
    img.src = url + '?' + json2url(json);
  }
}

module.exports = {
  sub: sub,
  sub2: sub2,
  json2url: json2url,
  jsonConcat: jsonConcat,
  rndNum: rndNum,
  hashCode: hashCode,
  emitHttp: emitHttp
}
