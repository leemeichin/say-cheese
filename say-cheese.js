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

var SayCheese = (function () {

  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia ||
                            false);

  window.AudioContext = (window.AudioContext ||
                         window.webkitAudioContext);

  window.URL = (window.URL ||
                window.webkitURL);

  return function SayCheese (element, options) {
    this.video = null,
    this.events = {},
    this.stream = null,
    this.options = {
      audio: false
    };

    this.setOptions(options);
    this.element = document.querySelector(element);
    return this;
  };

  SayCheese.prototype.on = function (evt, handler) {
    if (this.events.hasOwnProperty(evt) === false) {
      this.events[evt] = [];
    }

    this.events[evt].push(handler)
  };

  SayCheese.prototype.off = function (evt, handler) {
    this.events[evt] = this.events[evt].filter(function(h) {
      return h !== handler;
    });
  };

  SayCheese.prototype.trigger = function (evt, data) {
    if (this.events.hasOwnProperty(evt) === false) {
      return;
    }

    this.events[evt].forEach(function (handler) {
      handler.call(this, data);
    }.bind(this));
  };

  SayCheese.prototype.setOptions = function (options) {
    // just use naïve, shallow cloning
    for (var opt in options) {
      this.options[opt] = options[opt];
    }
  }

  SayCheese.prototype.getStreamUrl = function () {
    if (window.URL && window.URL.createObjectURL) {
      return window.URL.createObjectURL(this.stream);
    } else {
      return this.stream;
    }
  };

  SayCheese.prototype.createVideo = function () {
    var width     = 320,
        height    = 0,
        streaming = false;

    this.video = document.createElement('video');

    this.video.addEventListener('canplay', function () {
      if (!streaming) {
        height = this.video.videoHeight / (this.video.videoWidth / width);
        this.video.style.width = width;
        this.video.style.height = height;
        streaming = true;
        this.trigger('start');
      }
    }.bind(this), false);
  };

  SayCheese.prototype.linkAudio = function () {
    this.audioCtx = new window.AudioContext();
    this.audioStream = this.audioCtx.createMediaStreamSource(this.stream);

    var biquadFilter = this.audioCtx.createBiquadFilter();

    this.audioStream.connect(biquadFilter);
    biquadFilter.connect(this.audioCtx.destination);
  };

  /* Start up the stream, if possible */
  SayCheese.prototype.start = function () {

    // fail fast and softly if browser not supported
    if (navigator.getUserMedia === false) {
      this.trigger('error', 'NOT_SUPPORTED');
      return false;
    }

    var success = function (stream) {
      this.stream = stream;
      this.createVideo();

      if (navigator.mozGetUserMedia) {
        this.video.mozSrcObject = stream;
      } else {
        this.video.src = this.getStreamUrl();
      }

      if (this.options.audio === true) {
        try {
          this.linkAudio();
        } catch(e) {
          this.trigger('error', 'AUDIO_NOT_SUPPORTED');
        }
      }

      this.element.appendChild(this.video);
      this.video.play();
    }.bind(this);

    /* error is also called when someone denies access */
    var error = function (error) {
      this.trigger('error', error);
    }.bind(this);

    return navigator.getUserMedia({ video: true, audio: this.options.audio }, success, error);
  };

  SayCheese.prototype.stop = function () {
    this.stream.stop();

    if (window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(this.video.src);
    }

    return this.trigger('stop');
  };

})();
