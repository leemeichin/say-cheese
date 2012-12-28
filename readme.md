Say Cheese!
===========
A minimal library for integrating webcam snapshots into your app. It uses `getUserMedia`, a recent API for
accessing audio and video in the browser.

[**Demo**](http://leemachin.github.com/say-cheese)

Setup
-----
Grab the JS, host it, and add it to your page. For example:

```html
<script src='/assets/js/say-cheese.js'></script>
```

### Note about jQuery

Previously, jQuery was used to handle the events Say Cheese
triggers. This has been removed so as to remove the dependency on
external code.

**If you've used earlier versions of SayCheese, or link to it direct
  from the repo, be aware that triggered events are no longer passed
  an event object as the first argument.**

Usage
-----

Say Cheese exposes a minimal, event based API:

```javascript
var sayCheese = new SayCheese('#container-element', { snapshots: true });

sayCheese.on('start', function() {
 // do something when started
 this.takeSnapshot();
});

sayCheese.on('error', function(error) {
 // handle errors, such as when a user denies the request to use the webcam,
 // or when the getUserMedia API isn't supported
});

sayCheese.on('snapshot', function(snapshot) {
  // do something with a snapshot canvas element, when taken
});

sayCheese.start();
```

Taking snapshots
----------------

You can take a snapshot at any time after initialisation, by calling
`takeSnapshot()`:

```javascript
sayCheese.on('snapshot', function(snapshot) {
  // do something with the snapshot
});

sayCheese.takeSnapshot();
```

If you need to change the size of the snapshot created, pass in the new width and height as arguments:

```javascript
var width = 640, height = 480;
sayCheese.takeSnapshot(width, height);
```

It defaults to the full size of the video (generally `640x480`) if the arguments are omitted.

I don't want snapshots; just give me the video!
-----------------------------------------------

No problem. Just disable it when you first create the instance:

```javascript
var sayCheese = new SayCheese('#container-element', { snapshots: false });
```

Note that when you do this, `takeSnapshot()` will not do anything.

Stopping the show
-----------------

There's also a function to stop the webcam after loading it up:

```javascript
sayCheese.on('stop', function() {
  // do something when it's stopped
});

sayCheese.stop();
```

What, no audio support?
-----------------------

Support for piping audio back into the browser, is currently restricted to Chrome. Support
will be added when the WebAudio API is implemented in the other browsers.

Either way, audio can be enabled by setting the flag to true when setting up the webcam:

```javascript
  var sayCheese = new SayCheese('#container-element', { audio: true });
```

This will request the user's microphone as well as the webcam, but it won't
actually do anything else. It does, however, allow you to experiment with
possible (vendor specific) solutions yourself.

Resources, things using Say Cheese, etc.
----------------------------------------

[getUserMedia on the server, with Sinatra and Say Cheese](http://blog.new-bamboo.co.uk/2012/11/23/getusermedia-on-the-server-with-sinatra-and-say-cheese)

If you have any useful resources, or things you did with Say Cheese
that you think should be shown off, by all means open a pull request
or an issue or whatever.


Tests
-----

Some basic tests cover the callback functionality. They were written
to be run in a browser that supports the `getUserMedia` API. Due to
the nature of that API, there is no automation for allowing or denying
the request, so it has to be done manually for each one.

Compatibility
-------------

**Tested and verified to work in:**

- Firefox Nightly, Aurora, Beta
- Google Chrome
- Opera

#### Firefox caveats

- The beta release of Firefox supports a lower resolution compared to Opera and Chrome.
  This has been improved in Aurora and Nightly and may hopefully work its way into stable
  in the next version or two.

License
-------

> Copyright (C) 2012 Lee Machin
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
