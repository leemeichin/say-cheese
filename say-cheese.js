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

  var SayCheese;
  
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

  /* Start up the stream, if possible */
  SayCheese.prototype.start = function start() {
    var success = function userMediaSuccess(stream) {
     this.viewfinder = this.createVideo();
     this.viewfinder.src = this.getStreamUrl(stream);
     document.appendChild(this.viewfinder);
    }.bind(this);

    /* error is also called when someone denies access */
    var error = function userMediaError() {
      console.log('nooooooooo');
    }.bind(this);

    this.getUserMedia(success, error);
  };

  /* Stop it */
  SayCheese.prototype.stop = function stop() {

  };

  /* Take a snapshot of the current state of the stream */
  SayCheese.prototype.takeSnapshot = function takeSnapshot() {

  };

  return SayCheese;

}).call(this);