Sound And Vision
================

A little library for integrating webcam video and microphone audio into your app.

[**Demo**](http://leemachin.github.com/sound-and-vision)

Setup
-----

Grab the JS, host it, and add it to your page. For example:

```html
<script src='/assets/js/sound-and-vision.js'></script>
```

Usage
-----

Say Cheese exposes a minimal, Promise based API:

```javascript
var soundAndVision = new SoundAndVision('#container-element', { audio: true, video: true });

soundAndVision.start()
  .then(doSomethingWithCameraOrMic)
  .catch(handleErrors)
```

If all goes well, and the camera or mic are enabled, you're given direct access to the video and audio streams:

```javascript
soundAndVision.start().then(function (media) {
  media.video         // do something with the video element
  media.audio.stream  // do something with the audio stream
  media.audio.context // do something with the audio context
})
```

From here you're free to do whatever you like. You can take snapshots by rendering a frame of the video to a canvas, record clips of video or audio and save them to disk, or go crazy and explore all the other things you can do with a canvas, webGL, and the WebAudio API.

Stopping the show
-----------------

There's also a function to stop the webcam after loading it up:

```javascript
soundAndVision.stop()
```

Audio support
-------------

Audio's disabled by default, because it doesn't have full browser support. You can still enable it for browsers that do support it, though. Just set `audio` to true when setting up.

```javascript
var soundAndVision = new SoundAndVision('#container-element', { audio: true })
```

This will request access to the microphone, and will pipe the audio through to your output device.

This is supported in:

- Google Chrome
- Firefox 25+
- Latest Opera


Tests
-----

Some basic tests cover the callback functionality. They were written to be run in a browser that supports the `getUserMedia` API. Due to the nature of that API, there is no automation for allowing or denying the request, so it has to be done manually for each one.

Compatibility
-------------

**Tested and verified to work in:**

- Firefox
- Google Chrome
- Opera

License
-------

> Copyright (C) 2012-2014 Lee Machin
>
> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> "Software"), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
> LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
> OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
> WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
