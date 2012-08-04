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

  /* Check for the existence of the userMedia feature. */
  function userMediaFeatureExists() {
    return 'getUserMedia' in navigator ||  'webkitGetUserMedia' in navigator;
  };

  var SayCheese = (function() {

    function SayCheese() {
      if (userMediaFeatureExists()) {
        // do something
      } else {
        // should make this more graceful in future
        throw new Error("getUserMedia() is not supported in this browser");
      }

      return this;
    };

    // the getUserMedia function is different on Webkit browsers, so we have to
    // do a bit of faffing about to make sure we call the right one.
    SayCheese.prototype.getUserMedia = function getUserMedia(success, error) {
      userMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia);
      userMedia.call({ video: true }, success, error).apply(this);
    };

    /* The viewfinder is the element we use to preview the webcam stream */
    SayCheese.prototype.createVideo = function() {
      element = document.createElement('video');
      element.autoplay = true;
      return element;
    };

    /* The canvas is used for taking 'photos' */
    SayCheese.prototype.createCanvas = function() {
      element = document.createElement('canvas');
      return element;
    };

    SayCheese.prototype.start = function start() {

      var success = function userMediaSuccess(stream) {
        console.log('woop woop', stream);
      };

      var error = function userMediaError() {
        console.log('nooooooooo');
      };

      this.getUserMedia(success, error);
    };

    SayCheese.prototype.stop = function stop() {

    };

    SayCheese.prototype.takeSnapshot = function takeSnapshot() {

    };

    return SayCheese;

  })();

}).call(this);