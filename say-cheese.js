/*
 * Say Cheese!
 * Lee Machin, 2012
 * http://leemach.in, http://new-bamboo.co.uk
 * 
 * Minimal javascript library for integrating a webcam and snapshots into your app.
 *
 * Handles starting up the webcam and rendering the element, and also capturing shots
 * in a separate canvas element.
 *
 * Depends on video and canvas, and of course, getUserMedia. It's unlikely to work
 * on anything but the newest browsers.
 */
(function() {

  var sayCheese;

  function userMediaFeatureExists() {
    return 'webkitGetUserMedia' in navigator ||  'getUserMedia' in navigator;
  };

  sayCheese = function sayCheese() {
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