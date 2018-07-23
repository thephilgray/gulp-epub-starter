(function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = 'function' == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = 'MODULE_NOT_FOUND'), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function(r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = 'function' == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function(require, module, exports) {
        'use strict';

        function checkReadingSystemSupport() {
          var neededFeatures = [
            'mouse-events',
            'spine-scripting',
            'dom-manipulation'
          ];
          var support = typeof navigator.epubReadingSystem != 'undefined';

          if (support) {
            for (var i = 0; i < neededFeatures.length; i++) {
              if (!navigator.epubReadingSystem.hasFeature(neededFeatures[i])) {
                return false;
              }
            }
          }

          return support;
        }

        function togglePlay() {
          var video = document.getElementsByTagName('video')[0];

          if (video.ended || video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }

        function toggleControls() {
          var video = document.getElementsByTagName('video')[0];

          if (video.controls) {
            video.removeAttribute('controls', 0);
          } else {
            video.controls = 'controls';
          }
        }
      },
      {}
    ]
  },
  {},
  [1]
);
