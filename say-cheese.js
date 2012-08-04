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

  /* Check for the existence of the userMedia feature. */
  function userMediaFeatureExists() {
    return 'getUserMedia' in navigator ||  'webkitGetUserMedia' in navigator;
  };

  sayCheese = function sayCheese() {
    if (userMediaFeatureExists()) {
      // do something
    } else {
      // should make this more graceful in future
      throw new Error("getUserMedia() is not supported in this browser");
    }
  };

  // the getUserMedia function is different on Webkit browsers, so we have to
  // do a bit of faffing about to make sure we call the right one.
  sayCheese.prototype.getUserMedia = function getUserMedia(success, error) {
    userMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia);
    userMedia.call({ video: true }, success, error).apply(this);
  }

  /* The viewfinder is the element we use to preview the webcam stream */
  sayCheese.prototype.createVideo = function() {
    element = document.createElement('video');
    element.autoplay = true;
    return element;
  }

  /* The canvas is used for taking 'photos' */
  sayCheese.prototype.createCanvas = function() {
    element = document.createElement('canvas');
    return element;
  }

  sayCheese.prototype.start = function start() {

    var success = function userMediaSuccess(stream) {
      console.log('woop woop', stream);
    }

    var error = function userMediaError() {
      console.log('nooooooooo');
    }

    this.getUserMedia(success, error);
  };

  sayCheese.prototype.stop = function stop() {

  };

  sayCheese.prototype.takeSnapshot = function takeSnapshot() {

  };

}).call(this);