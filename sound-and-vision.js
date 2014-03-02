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

var SoundAndVision = (function () {

  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia)

  window.AudioContext = (window.AudioContext || window.webkitAudioContext)

  window.URL = (window.URL || window.webkitURL)

  function slice (obj /*, ... */) {
    var keys = Array.prototype.slice.call(arguments, 1)

    return keys.reduce(function (memo, key) {
      memo[key] = obj[key]
      return memo
    }, {})
  }

  function setOptions (options, newOptions) {
    for (var opt in newOptions || {}) {
      options[opt] = newOptions[opt];
    }

    return options
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

    return new Promise(function (resolve, reject) {
      video.addEventListener('canplay', function () {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width)

          video.style.width = width
          video.style.height = height

          streaming = true

          resolve(video)
        }
      }, false)

      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream
      } else {
        video.src = streamURL(stream)
      }

      video.play()
    })
  }

  function initAudio (stream) {
    return new Promise(function (resolve, reject) {
      try {
        var audioCtx = new window.AudioContext(),
            audioStream = audioCtx.createMediaStreamSource(stream),
            biquadFilter = audioCtx.createBiquadFilter(),
            audioComponents = { context: audioCtx, stream: audioStream }

        audioStream.connect(biquadFilter)
        biquadFilter.connect(audioCtx.destination)

        resolve(audioComponents)
      } catch(e) {
        reject(e)
      }
    })
  }

  function SoundAndVision (element, options) {
    this.video = null,
    this.audio = null,
    this.stream = null,
    this.options = setOptions({ audio: false, video: true }, options)

    this.element = document.querySelector(element)

    return this
  }

  /* Start up the stream, if possible */
  SoundAndVision.prototype.start = function () {
    return new Promise(function (resolve, reject) {
      var enabledFeatures = slice(this.options, 'video', 'audio')

      var error = function (reason) {
        reject(Error(reason))
      }

      var success = function (stream) {
        this.stream = stream

        var setup = Promise.all([initVideo(stream), initAudio(stream)])

        setup.then(function (results) {
          this.video = results[0]
          this.audio = results[1]
          this.element.appendChild(this.video)

          resolve(this)
        }.bind(this)).catch(error)

      }.bind(this)


      try {
        navigator.getUserMedia(enabledFeatures, success, error)
      } catch(e) {
        reject(e)
      }
    }.bind(this))
  }

  SoundAndVision.prototype.stop = function () {
    this.stream.stop()

    if (window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(this.video.src)
    }
  }

  return SoundAndVision

})();
