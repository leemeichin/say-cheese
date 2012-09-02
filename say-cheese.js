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

  SayCheese = function SayCheese(element) {
    if (userMediaFeatureExists()) {
      // do something
      this.element = document.querySelectorAll(element)[0];
      this.element.style.position = 'relative';

      this.readyEvent = new CustomEvent('saycheese:ready', true, false);
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
    this.video = document.createElement('video');
    this.video.autoplay = true;
  };

  SayCheese.prototype.setupCanvas = function setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.videoWidth = this.video.offsetWidth;
    this.canvas.height = this.videoHeight = this.video.offsetHeight;

    this.canvas.style.position = 'absolute';
    this.canvas.style.top = this.video.offsetTop;
    this.canvas.style.left = this.video.offsetLeft;

    this.context = this.canvas.getContext('2d');

    this.element.appendChild(this.canvas);
    this.watermark();

    // we're now all set up, so dispatch the ready event
    document.dispatchEvent(this.readyEvent);
  };

  SayCheese.prototype.watermark = function watermark() {
    this.context.fillStyle = '#ee5f00';
    this.context.font = 'bold 32px Helvetica';

    x = this.video.offsetWidth - 100;
    y = this.video.offsetHeight - 15;

    this.context.fillText('demo', x, y);
  };

  /* The viewfinder is a region within the canvas that can be used to
   * take snapshots of just part of the video stream.
   */
  SayCheese.prototype.viewfinder = function() {

  };

  /* Take a snapshot of the current state of the stream */
  SayCheese.prototype.takeSnapshot = function takeSnapshot() {
    this.context.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
  };

  /* Start up the stream, if possible */
  SayCheese.prototype.start = function start(callback) {
    var success = function success(stream) {
      this.createVideo();

      // it'd be easier to do this inline, but we don't get the size of the video
      // until the metadata's loaded :/
      this.video.addEventListener('loadedmetadata', this.setupCanvas.bind(this), false);

      this.video.src = this.getStreamUrl(stream);
      this.element.appendChild(this.video);
    }.bind(this);

    /* error is also called when someone denies access */
    var error = function error(callback) {
      console.log('nooooooooo');
      return callback();
    }.bind(this);

    // fire off the callback when we're all set up
    document.addEventListener('saycheese:ready', callback.bind(this), false);

    this.getUserMedia(success, error);
  };

  /* Stop it - TODO: figure out how to actually disable the stream */
  SayCheese.prototype.stop = function stop() {
    console.log(video);
    document.body.removeChild(video);
  };

  return SayCheese;

}).call(this);
