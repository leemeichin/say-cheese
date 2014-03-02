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
                            navigator.msGetUserMedia)

  window.AudioContext = (window.AudioContext ||
                         window.webkitAudioContext)

  window.URL = (window.URL ||
                window.webkitURL)

  function slice (obj /*, ... */) {
    var keys = Array.prototype.slice.call(arguments, 1)

    return keys.reduce(function (memo, key) {
      memo[key] = obj[key]
      return memo
    }, {})
  }

  function setOptions (options, newOptions) {
    for (var opt in newOptions) {
      options[opt] = newOptions[opt];
    }
  }

  function streamURL (stream) {
    if (window.URL && window.URL.createObjectURL) {
      return window.URL.createObjectURL(stream)
    }

    return stream
  }

  function initVideo (stream, onSuccess, onError) {
    var video = document.createElement('video'),
        width     = 320,
        height    = 240,
        streaming = false

    video.addEventListener('canplay', function () {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width)

        video.style.width = width
        video.style.height = height

        streaming = true

        onSuccess({ video: video })
      }
    }, false)

    if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream
    } else {
        video.src = streamURL(stream)
    }

    video.play()

    return video
  }

  function initAudio (stream, onSuccess, onError) {
    try {
      var audioCtx = new window.AudioContext(),
          audioStream = audioCtx.createMediaStreamSource(stream),
          biquadFilter = audioCtx.createBiquadFilter(),
          audioComponents = { context: audioCtx, stream: audioStream }

      audioStream.connect(biquadFilter)
      biquadFilter.connect(audioCtx.destination)

      onSuccess(audioComponents)

      return audioComponents

    } catch(e) {
      return onError(e)
    }
  }


  return function SayCheese (element, options) {
    this.video = null,
    this.audio = null,
    this.stream = null,
    this.events = {},
    this.options = setOptions({ audio: false, video: true }, options)

    this.element = document.querySelector(element)

    return this
  }

  SayCheese.prototype.on = function (evt, handler) {
    if (this.events.hasOwnProperty(evt) === false) {
      this.events[evt] = []
    }

    this.events[evt].push(handler)
  }

  SayCheese.prototype.off = function (evt, handler) {
    this.events[evt] = this.events[evt].filter(function (h) {
      return h !== handler
    })
  }

  SayCheese.prototype.trigger = function (evt, data) {
    if (this.events.hasOwnProperty(evt)) {
      this.events[evt].forEach(function (handler) {
        handler.call(this, data)
      }.bind(this))
    }
  }

  /* Start up the stream, if possible */
  SayCheese.prototype.start = function () {

    var error = this.trigger.bind(this, 'error')
    var start = this.trigger.bind(this, 'start')

    var success = function (stream) {
      this.stream = stream
      this.video = initVideo(stream, start, error)
      this.audio = initAudio(stream, start, error)

      this.element.appendChild(this.video)

    }.bind(this)

    // fail fast and softly if browser not supported
    if (!navigator.getUserMedia) return error('NOT_SUPPORTED');

    return navigator.getUserMedia(slice(this.options, 'video', 'audio'), success, error)
  }

  SayCheese.prototype.stop = function () {
    this.stream.stop()

    if (window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(this.video.src)
    }

    this.trigger('stop')
  }

})();
