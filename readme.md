Say Cheese!
===========
A minimal library for integrating webcam snapshots into your app.

Setup
-----
Grab the JS, host it, and add it to your page. For example:

```html
<script src='/assets/js/say-cheese.js'></script>
```

It also requires jQuery (for events), so make sure to include that before this.

Usage
-----

Say Cheese exposes a minimal, event based API:

```javascript
var sayCheese = new SayCheese('#element', { snapshots: true });

sayCheese.on('start', function() {
 // do something when started
 this.takeSnapshot();
});

sayCheese.on('error', function(evt, error) {
 // handle errors, such as when a user denies the request to use the webcam,
 // or when the getUserMedia API isn't supported
});

sayCheese.on('snapshot', function(evt, snapshot) {
  // do something with a snapshot canvas element, when taken
});

sayCheese.start();
```

Taking snapshots
----------------

You can take a snapshot at any time after initialisation, by calling
`takeSnapshot()`:

```javascript
sayCheese.on('snapshot', function(evt, snapshot) {
  // do something with the snapshot
});

sayCheese.takeSnapshot();
```

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
sayCheese.on('stop', function(evt) {
  // do something when it's stopped
});

sayCheese.stop();
```

Tests
-----

Some basic tests cover the callback functionality. They were written
to be run in a browser that supports the `getUserMedia` API. Due to
the nature of that API, there is no automation for allowing or denying
the request, so it has to be done manually for each one.

Compatibility
-------------

**Tested and verified to work in:**

- Firefox Nightly and Aurora *§
- Google Chrome
- Opera

\* The webcam functionality itself works in stable Firefox, however a [bug in
the browser](https://bugzilla.mozilla.org/show_bug.cgi?id=771833)
prevents the snapshot feature from working correctly. The fix is now in the Beta
channel.

§ Firefox on the stable channel also only supports a smaller webcam resolution, though
this has been upped to 640x480 in Aurora and Nightly, to match Chrome and Opera.

#### Firefox caveats

- A [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=771833) in the Firefox stable 
  channel prevents the snapshot function from behaving correctly. This has been fixed
  upstream and, as of 21st November 2012, is now in the Beta channel.

- The stable release of Firefox also supports a lower resolution compared to Opera and Chrome.
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
