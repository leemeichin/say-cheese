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

var SayCheese = (function() {

  var SayCheese,
      viewfinder,
      canvas,
      context;
  
  /* Check for the existence of the userMedia feature. */
  function userMediaFeatureExists() {
    return 'getUserMedia' in navigator ||  'webkitGetUserMedia' in navigator;
  };

  SayCheese = function SayCheese() {
    if (userMediaFeatureExists()) {
      // do something
    } else {
      // should make this more graceful in future
      throw new Error("getUserMedia() is not supported in this browser");
    }

    return this;
  };

  /* the getUserMedia function is different on Webkit browsers, so we have to
   * do a bit of faffing about to make sure we call the right one.
   */
  SayCheese.prototype.getUserMedia = function getUserMedia(success, error) {
    return (function() {
      // have to re-bind navigator because the context will be lost, and
      // we'll get illegal invocation errors.
      return (navigator.getUserMedia || navigator.webkitGetUserMedia).bind(navigator);
    })().call(this, { video: true }, success, error);
  };

  /* Webkit behaves differently as regards getting a proper video URL. So we have
   * to have another check for it.
   */
  SayCheese.prototype.getStreamUrl = function getStreamUrl(stream) {
    url = (function() {
      return (window.URL || window.webkitURL);
    })();
    
    return (url && url.createObjectURL) ? url.createObjectURL(stream) : stream;
  };

  /* The viewfinder is the element we use to preview the webcam stream */
  SayCheese.prototype.createVideo = function createVideo() {
    element = document.createElement('video');
    element.autoplay = true;
    return element;
  };

  /* The canvas is used for taking 'photos' */
  SayCheese.prototype.createCanvas = function createCanvas() {
    element = document.createElement('canvas');
    return element;
  };

  SayCheese.prototype.setupCanvas = function setupCanvas(canvas) {
    canvas.width = viewfinder.width;
    canvas.height = viewfinder.height;
    context = canvas.getContext('2d');
  };

  /* Start up the stream, if possible */
  SayCheese.prototype.start = function start() {
    var success = function success(stream) {
      viewfinder = this.createVideo();
      viewfinder.src = this.getStreamUrl(stream);
      
      canvas = this.createCanvas();
      this.setupCanvas(canvas);

      document.body.appendChild(viewfinder);
    }.bind(this);

    /* error is also called when someone denies access */
    var error = function error() {
      console.log('nooooooooo');
    }.bind(this);

    this.getUserMedia(success, error);
  };

  /* Stop it - TODO: figure out how to actually disable the stream */
  SayCheese.prototype.stop = function stop() {
    console.log(viewfinder);
    document.body.removeChild(viewfinder);
  };

  /* Take a snapshot of the current state of the stream */
  SayCheese.prototype.takeSnapshot = function takeSnapshot() {

  };

  return SayCheese;

}).call(this);