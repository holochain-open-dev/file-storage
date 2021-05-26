(function (window) {
  "use strict";

  var _context = window.__mocha_context__ = {
    runnable: null,
    index: 0,
  };

  var Runnable = window.Mocha.Runnable;
  var _run = Runnable.prototype.run;
  Runnable.prototype.run = function () {
    _context.runnable = this;
    _context.index = 0;
    return _run.apply(this, arguments);
  };
})(window);
