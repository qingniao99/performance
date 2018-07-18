//  usertiming.js is alternative for safari
/**
 * 0 浏览器相关加载
 * 1 资源加载
 * 3 接口时段。其中ajax成功的随机数当中有_3_   失败的随机数当中有_4_
 * 4 报错信息
 * 5_1 网络状态
 * 6 link引入的css缺失
 * 7 用户页面停留时间
 * 8 点击区域
 * 9 try cathc 捕捉到的错误
 * **/
(function (win, doc, undefined) {

  fireTrack = {
    URL: "../public/images/0.gif", //预定义配置
    performance: win.performance || win.webkitPerformance || win.msPerformance,
    init: function (options) {
      fireTrack.URL = options.URL || fireTrack.URL;
      this.strategy(this.action());
      if (!this.util.storage.getStorage("freshNum")) {
        this.util.storage.setStorage("freshNum", 0);
      }
      if (!this.util.storage.getStorage("freshNum2")) {
        this.util.storage.setStorage("freshNum2", 0);
      }
    },
    util: { //工具集合
      sub: function (s) {
        if (/=/.test(s) && s.lastIndexOf('=')) {
          return s.substring(s.lastIndexOf('=') + 1);
        }
        if (s.lastIndexOf('/')) {
          return s.substring(s.lastIndexOf('/') + 1);
        }
      },
      sub2: function (s) {
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
      },
      json2url: function (json) { //json转url参数
        var a = [];
        for (var i in json) {
          var v = json[i] + '';
          v = v.replace(/\n/g, '<br/>');
          v = encodeURIComponent(v);
          a.push(i + '=' + v);
        }
        return a.join('&');
      },
      jsonConcat: function (object1, object2) { //简易合并
        for (var key in object2) {
          object1[key] = object2[key];
        }
        return object1;
      },
      cookie: {
        getCookie: function (name) {
          var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
          if (arr != null) {
            return win.unescape(arr[2]);
          }
          return "";
        },
        setCookie: function (name, value, iDay) {
          if (iDay !== false) {
            var oDate = new Date();
            oDate.setTime(oDate.getTime() + iDay * 24 * 3600 * 1000);
            document.cookie = name + '=' + value + ';expires=' + oDate.toGMTString();
          } else {
            document.cookie = name + '=' + value;
          }
        },
        removeCookie: function (name) {
          setCookie(name, 'a', -1);
        }
      },
      storage: {
        getStorage: function (a) {
          if (window.localStorage.getItem(a)) {
            return window.localStorage.getItem(a);
          } else {
            return "";
          }
        },
        setStorage: function (a, b) {
          if (window.localStorage) {
            window.localStorage.setItem(a, b);
          }
        }
      },
      rndNum: function () { //就不信还能重复
        return (new Date().getTime() + parseInt(20121221 * Math.random(0, 1))).toString(36);
      },
      hashCode: function (str) { //s to n
        var h = 0;
        var len = str.length;
        var t = 2147483648;
        for (var i = 0; i < len; i++) {
          h = 31 * h + str.charCodeAt(i);
          if (h > 2147483647) h %= t;
        }
        return h;
      },
      emitHttp: function (json) { //发送信息到http服务器  里面要追加信息标识 比如info error等
        var n = 'tmp_' + this.rndNum(),
          img = win[n] = new Image();
        img.onload = img.onerror = function () {
          win[n] = null;
        };
        if (json) {
          img.src = fireTrack.URL + '?' + this.json2url(json);
        }
      },
      styleLoad: function (node, cb) {
        var load;
        return
        if (/webkit|micromessenger/i.test(win.navigator.userAgent)) { //webkit
          if (node['sheet'] && node['sheet'].cssRules && node['sheet'].cssRules.length > 0) {
            load = true;
          } else {
            load = false;
          }
          cb(load, node);
        }
      },
      jsLoad: function (node, cb) { //方法有瑕疵，只能用动态插入的办法来弄，暂时搁置
        var load;
        if (node.src) {
          if ((node.readyState == 'loaded' || node.readyState == 'complete')) {
            load = true;
          } else {
            load = false;
          }
          cb(load, node);
        }
      }
    },
    action: function () {
      var that = this;
      that.info = { //信息集合
        "cookieLength": doc.cookie.length,
        'language': win.navigator.language,
        'width': win.screen.width,
        "height": win.screen.height,
        'clientWidth': win.screen.availWidth || win.innerWidth,
        'clientHeight': win.screen.availHeight || win.innerHeight,
        'platform': win.navigator.platform,
        "client": that.util.cookie.getCookie("client"),
        "entity_id": that.util.cookie.getCookie("entity_id"),
        "qr_code": that.util.cookie.getCookie("qr_code"),
        "seat_code": that.util.cookie.getCookie("seat_code"),
        "seat_id": that.util.cookie.getCookie("seat_id"),
        "shop_id": that.util.cookie.getCookie("shop_id"),
        "shop_name": that.util.cookie.getCookie("shop_name"),
        "uid": that.util.cookie.getCookie("uid")
      }
      return {
        ready: function () {
          //这里可以写ready后续的动作
          var styles = doc.getElementsByTagName("link");
          var scripts = document.getElementsByTagName("script");
          for (var i = 0; i < styles.length; i++) {
            var node = styles[i];
            that.util.styleLoad(node, function (load, node) {
              if (!load) {
                var freshNum = that.util.storage.getStorage("freshNum");
                that.util.emitHttp({
                  'name': that.util.sub(node.href || ""),
                  'type': "6"
                });
                if (freshNum < 2) {
                  freshNum = freshNum - 0 + 1;
                  that.util.storage.setStorage("freshNum", freshNum);
                  window.location.reload();
                } else {
                  that.util.storage.setStorage("freshNum", 0);
                }
              }
            })
          }
          /*for (var i = 0; i < scripts.length; i++) {
           var currentScript = scripts[i];
           that.util.jsLoad(currentScript, function (load, currentScript) {
           if (!load) {
           var freshNum2 = that.util.storage.getStorage("freshNum2");
           that.util.emitHttp({
           'name': that.util.sub(node.src || ""),
           'type': "js_visible"
           });
           if (freshNum2 < 3) {
           freshNum2 = freshNum2 - 0 + 1;
           that.util.storage.setStorage("freshNum2", freshNum2);
           window.location.reload();
           } else {
           that.util.storage.setStorage("freshNum2", 0);
           }
           }
           });
           }*/

          doc.addEventListener("click", function (e) {
            if (e.clientX >= that.info.clientWidth || e.clientY >= that.info.clientY) {
              return;
            }
            var json = {
              "type": 8
            };
            that.util.emitHttp(that.util.jsonConcat({
              x: e.pageX,
              y: e.pageY,
              t: e.target.className || ""
            }, that.info));
          }, false)

        }.bind(that),
        load: function () {
          var timing = that.performance.timing;
          if (!timing) {
            return
          }
          var loadTime = timing.loadEventEnd - timing.navigationStart;
          if (loadTime <= 0) {
            setTimeout(function () {
              that.action().load();
            }, 200);
            return;
          }
          that.stay1 = that.performance.now();
          var readyStart = timing.fetchStart - timing.navigationStart; //浏览器准备时间
          var redirectTime = timing.redirectEnd - timing.redirectStart; //重定向时间
          var appcacheTime = timing.domainLookupStart - timing.fetchStart; //dns缓存时间
          var lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart; //dns查询时间
          var connectTime = timing.connectEnd - timing.connectStart; //连接建立时间
          var requestTime = timing.responseEnd - timing.requestStart; //http响应时间
          var domReadyTime = timing.domComplete - timing.responseEnd; //dom准备时间
          var loadEventTime = timing.loadEventEnd - timing.navigationStart; //页面加载的大致时间
          var times = {
            'readyStart': readyStart,
            'redirectTime': redirectTime,
            'appcacheTime': appcacheTime,
            'lookupDomainTime': lookupDomainTime,
            'connectTime': connectTime,
            'requestTime': requestTime,
            'domReadyTime': domReadyTime,
            'loadEventTime': loadEventTime,
            'type': "0"
          }
          that.util.emitHttp(that.util.jsonConcat(times, that.info));

          var json = {
            "type": "1"
          }; //资源加载时间，如果wxready了 可以尝试获取网络状况和经纬度。
          that.performance.getEntriesByType('resource').forEach(function (r) {
            if ((/js|css|png|jpg|gif/).test(that.util.sub(r.name))) {
              if (r.duration >= 1) {
                json['rs_' + that.util.sub(r.name)] = r.duration.toFixed(3);
              }
            }
          });
          that.util.emitHttp(that.util.jsonConcat(json, that.info));
          setTimeout(function () {
            if (win.wx) {
              wx.ready(function () {
                wx.getNetworkType({
                  success: function (res) {
                    var json = {};
                    var networkType = res.networkType; // 利用微信返回网络类型2g，3g，4g，wifi
                    json['networkType'] = networkType;
                    json["type"] = "5_1";
                    that.util.emitHttp(that.util.jsonConcat(json, that.info));
                  }
                });
              })
            }
          }, 500);
          //这里可以写后续的动作

        }.bind(that),
        error: function (a, b, c, d) {
          if (a) {
            var error = {
              'filename': a.filename,
              'message': a.message || (a.error ? a.error.message : ""),
              'line': a.lineno,
              'col': a.colno,
              'type': "4"
            }
          }
          that.util.emitHttp(that.util.jsonConcat(error, that.info));
          //这里可以写后续的动作
        }.bind(that),
        beforeunload: function () {
          that.util.emitHttp(that.util.jsonConcat({
            "type": "7",
            "time": that.performance.now() - that.stay1,
            "p": win.location.pathname
          }, that.info));
        }.bind(that)
      }
    },
    strategy: function (action) { //执行策略
      //documentReady之后的
      doc.addEventListener('DOMContentLoaded', function () { //高级浏览器 支持
        action.ready && action.ready();
      }, false);

      win.addEventListener('load', function () {
        //发送performance当中所记载的各项时间
        action.load && action.load();
      }, false);

      win.addEventListener('error', function (a, b, c, d) {
        //发送onerror信息
        //如果跨域了，请确保同源或者配置可跨域并附加crossorigin(2dfire项目的js并无外部的)
        action.error && action.error(a, b, c, d);
        //setTimeout(function(){win.location.reload()},5000);
      }, false);

      win.addEventListener('beforeunload', function (e) {
        action.beforeunload && action.beforeunload();
      }, false);

    },
    outside: function () { //暴露的api
      var that = this;
      return {
        mark: function (s) {
          that.performance.mark(s);
        },
        measure: function (a, b, c) { //使用前请埋好mark标记 b是发送之前，c是之后
          try { //偶尔会丢失报错
            that.performance.measure(a, b, c);
            var json = {
              "type": "3"
            };
            that.performance.getEntriesByType('measure').forEach(function (r) {
              if (r.name == a) {
                json[r.name] = r.duration;
              }
              that.util.emitHttp(json);
              that.performance.clearMarks(b);
              that.performance.clearMarks(c);
              that.performance.clearMeasures(a);
            })
          } catch (e) {
            this.error(e);
          }
        },
        error: function (e) { //外部手动调用的error上传
          that.util.emitHttp(that.util.jsonConcat({
            "type": "9",
            "error": e
          }, that.info));
          console.error && console.error(e);
        },
        interval: function (fn, t) { //要定时发送的东西,内容待定,缺省值为5
          if (t) {
            timer = function () {
              setTimeout(function () {
                fn && fn();
                timer();
              }, t);
            }
            timer();
          } else {
            timer2 = function () {
              setTimeout(function () {
                fn && fn();
                timer2();
              }, 5000);
            }
            timer2();
          }
        },
        condition: function (arr, fn) {
          if (Object.prototype.toString.call(arr) === '[object Array]') {
            timer = function () {
              setTimeout(function () {
                var a = 0;
                for (var i = 0; i < arr.length; i++) {
                  if (arr[i]) {
                    a++;
                  }
                }
                if (a == arr.length) {
                  fn && fn();
                  return;
                }
                timer();
              }, 380)
            }
            timer();
          } else {
            timer2 = function () {
              setTimeout(function () {
                if (arr) {
                  fn && fn();
                  return;
                  timer2();
                }
              }, 380)
            }
            timer2();
          }

        }
      }
    }
  };
  win.fireTrack = fireTrack;
  fireTrack.init({});
})(window, document);
