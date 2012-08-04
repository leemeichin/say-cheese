(function() {

  var sayCheese;

  function userMediaFeatureExists() {
    return 'webkitGetUserMedia' in navigator ||  'getUserMedia' in navigator;
  };

  sayCheese = function sayCheese(options) {
    if (userMediaFeatureExists()) {
      // do something
    } else {
      // should make this more graceful in future
      throw new Error("getUserMedia() is not supported in this browser");
    }
  };

  /* The viewfinder is the element we use to preview the webcam stream */
  sayCheese.prototype.viewfinder =  document.createElement('video');

  /* The canvas is used for taking 'photos' */
  sayCheese.prototype.canvas = document.createElement('canvas');

  sayCheese.prototype.start = function start() {

  };

  sayCheese.prototype.stop = function stop() {

  };

  sayCheese.prototype.takeSnapshot = function takeSnapshot() {

  };

}).call(this);