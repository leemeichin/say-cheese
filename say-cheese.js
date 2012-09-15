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

var SayCheese = (function($) {

  var SayCheese;

  /* Check for the existence of the userMedia feature. */
  function userMediaFeatureExists() {
    return 'getUserMedia' in navigator ||  'webkitGetUserMedia' in navigator;
  };

  function eventCoords(evt) {
     return { x: evt.offsetX || evt.layerX, y: evt.offsetY || evt.layerY };
  };

  SayCheese = function SayCheese(element) {
    if (userMediaFeatureExists()) {

      this.viewfinder = {},
      this.snapshots = [],
      this.canvas = null,
      this.context = null,
      this.video = null,
      this.events = {};

      this.element = document.querySelectorAll(element)[0];
      this.element.style.position = 'relative';
    } else {
      // should make this more graceful in future
      throw new Error("getUserMedia() is not supported in this browser");
    }

    return this;
  };


  /**
   * Reimplementing events? No. This is intended to make it easier to
   * replace jQuery with a different solution in future, should that
   * become necessary, and also minimises the impact of the framework
   * on the rest of the code.
   */
  SayCheese.prototype.on = function on(evt, handler) {
    return $(this).on(evt, handler);
  };

  SayCheese.prototype.off = function off(evt, handler) {
    return $(this).off(evt, handler);
  };

  SayCheese.prototype.trigger = function trigger(evt, data) {
    // bubbling up the DOM makes things go a bit crazy. This assumes
    // preventDefault
    return $(this).triggerHandler(evt, data);
  };

  /*
   * the getUserMedia function is different on Webkit browsers, so we have to
   * do a bit of faffing about to make sure we call the right one.
   */
  SayCheese.prototype.getUserMedia = function getUserMedia(success, error) {
    return (function() {
      // have to re-bind navigator because the context will be lost, and
      // we'll get illegal invocation errors.
      return (navigator.getUserMedia || navigator.webkitGetUserMedia).bind(navigator);
    })().call(this, { video: true }, success, error);
  };

  /*
   * Webkit behaves differently as regards getting a proper video URL. So we have
   * to have another check for it.
   */
  SayCheese.prototype.getStreamUrl = function getStreamUrl(stream) {
    url = (function() {
      return (window.URL || window.webkitURL);
    })();

    return (url && url.createObjectURL) ? url.createObjectURL(stream) : stream;
  };

  SayCheese.prototype.createVideo = function createVideo() {
    this.video = document.createElement('video');
    this.video.autoplay = true;
  };

  SayCheese.prototype.setupCanvas = function setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.video.offsetWidth;
    this.canvas.height = this.video.offsetHeight;

    this.canvas.style.position = 'absolute';
    this.canvas.style.top = this.video.offsetTop;
    this.canvas.style.left = this.video.offsetLeft;

    this.context = this.canvas.getContext('2d');

    this.element.appendChild(this.canvas);
    this.initDefaultViewfinder();
    this.initDynamicViewfinder();

    // we're now all set up, so dispatch the ready event
    return this.trigger('start');
  };

  SayCheese.prototype.watermark = function watermark() {
    this.context.fillStyle = '#ee5f00';
    this.context.font = 'bold 32px Helvetica';

    x = this.video.offsetWidth - 100;
    y = this.video.offsetHeight - 15;

    this.context.fillText('demo', x, y);
  };


  /*
   * The default viewfinder is just the exact size of the video
   */
  SayCheese.prototype.initDefaultViewfinder = function initDefaultViewfinder() {
    return this.viewfinder = {
      startX: 0,
      startY: 0,
      width: this.video.offsetWidth,
      height: this.video.offsetHeight
    };
  };

  /*
   *  This viewfinder can be resized to capture select portions of the video stream
   */
  SayCheese.prototype.initDynamicViewfinder = function initDynamicViewfinder() {
    // track the dragging status when events are fired
    var isDragging = false,
        box = {};

    var start = function start(evt) {
      evt.preventDefault();
      var coords = eventCoords(evt);
      box.startX = coords.x;
      box.startY = coords.y;
      isDragging = true;
    }.bind(this);

    var stop = function stop(evt) {
      evt.preventDefault();
      isDragging = false;
      this.viewfinder = box;
    }.bind(this);

    var draw = function draw(evt) {
      evt.preventDefault();
      var coords = eventCoords(evt);
      if (isDragging) {
        box.width = coords.x - box.startX;
        box.height = coords.y - box.startY;

        // draw the shade
        this.context.globalCompositeOperation = 'xor';
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'rgba(0, 0, 0, .8)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw the window
        this.context.strokeStyle = 'rgba(255, 255, 255, .5)';
        this.context.lineWidth = 2;
        this.context.strokeRect(box.startX, box.startY, box.width, box.height);
        this.context.fillRect(box.startX, box.startY, box.width, box.height);
      }
    }.bind(this);

    this.canvas.addEventListener('mousedown', start, true);
    this.canvas.addEventListener('mouseup', stop, true);
    this.canvas.addEventListener('mousemove', draw, true);

    // add touch events if they're there
    if ('ontouchstart' in window) {
      this.canvas.addEventListener('touchstart', start, true);
      this.canvas.addEventListener('touchend', stop, true);
      this.canvas.addEventListener('touchmove', draw, true);
    }

    // make the cursor a crosshair to make it more clear what can be done
    this.canvas.style.cursor = 'crosshair';
  };

  /* Take a snapshot of the current state of the stream */
  SayCheese.prototype.takeSnapshot = function takeSnapshot(callback) {
    var snapshot = document.createElement('canvas'),
        ctx      = snapshot.getContext('2d');


    snapshot.width = this.viewfinder.width,
    snapshot.height = this.viewfinder.height;

    ctx.drawImage(this.video,
                       this.viewfinder.startX,
                       this.viewfinder.startY,
                       this.viewfinder.width,
                       this.viewfinder.height,
                       0,
                       0,
                       this.viewfinder.width,
                       this.viewfinder.height);

    this.snapshots.push(snapshot);
    this.trigger('snapshot', snapshot);

    if (callback) {
      callback.call(this, snapshot);
    }

    ctx = null;
  };

  /* Start up the stream, if possible */
  SayCheese.prototype.start = function start(callback) {
    var success = function success(stream) {
      this.createVideo();

      // video width and height don't exist until metadata is loaded
      this.video.addEventListener('loadedmetadata', this.setupCanvas.bind(this), false);

      this.video.src = this.getStreamUrl(stream);
      this.element.appendChild(this.video);
    }.bind(this);

    /* error is also called when someone denies access */
    var error = function error(callback) {
      this.trigger('error');
    }.bind(this);

    // add the callback to the start event if one is supplied.
    if (callback) {
      this.on('start', callback);
    }

    this.getUserMedia(success, error);
  };

  /* Stop it - TODO: figure out how to actually disable the stream */
  SayCheese.prototype.stop = function stop() {
    this.video = null;
    document.body.removeChild(video);
  };

  return SayCheese;

})($);
