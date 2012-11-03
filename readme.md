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

Say Cheese exposes a minimal, callback based API, as well as some
events to hook into, if you're bored of spaghetti.

```javascript
var sayCheese = new SayCheese('#element');

sayCheese.on('start', function() {
 // do something when started
 this.takeSnapshot();
});

sayCheese.on('error', function() {
 // handle errors, such as when a user denies the request to use the webcam
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

Stopping the show
-----------------

The ability to stop a stream, and turn off the webcam, is still a WIP.

Compatibility
-------------

This'll work great in recent versions of Chrome and Opera. It's not in
Firefox or IE yet, however, although support is included in the
library.
