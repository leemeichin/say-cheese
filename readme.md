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
Say Cheese exposes a minimal, callback based API, as well as some events to hook into,
if you're bored of spaghetti.

```javascript
var sayCheese = new SayCheese('#element');

// callback based
sayCheese.start(function() {
  this.takeSnapshot(function(evt, snapshot) {
    // do something with the snapshot
  });
});

// event based
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

Dynamic viewfinder
------------------
Suppose you don't want to take a picture of the entire video, when you're only interested in a small part of it. You can simply click and drag a rectangle over the video to select the area of interest.

To enable this, just set `dynamicViewfinder` to `true` when starting up:

```javascript
var sayCheese = new SayCheese('#element', { dynamicViewfinder: true });
```

To integrate with this, an event is triggered when the user stops interacting with the canvas (mouse and experimental touch events supported).

```javascript
sayCheese.on('change', function(evt) {
  // do something in reaction to the viewfinder being resized
});
```


Taking snapshots
----------------
You can take a snapshot at any time after initialisation, by calling `takeSnapshot()`. It respects the state of the viewfinder at the time of calling, whether or not it has been cropped with the dynamic viewfinder.

When taking a snapshot, you can again optionally supply a callback or listen for an event:

```javascript
// using events
sayCheese.on('snapshot', function(evt, snapshot) {
  // do something with the snapshot
});

sayCheese.takeSnapshot();

// using callbacks
sayCheese.takeSnapshot(function(snapshot) {
  // do something with the snapshot
});
```

In both cases, the `snapshot` is a `canvas` element, and it maintains the exact size
and dimensions of the viewfinder at the time it was taken.

Resetting the viewfinder
------------------------
You can reset to default with `resetViewfinder`.

Stopping the show
-----------------
The ability to stop a stream, and turn off the webcam, is still a WIP.

Gotchas
-------
Things aren't exactly robust. It works in most cases but is still mostly just a proof of concept.

 - Full sized snapshots both do and don't work, for reasons unknown as yet.
 - Related to above, the snapshot might be blank.
 - Trying to place the viewfinder off the edge of the video will get you a blank shot.

Also, no tests. *sob*.

Compatibility
-------------
Uses the new `getUserMedia` API, which works in recent versions of Chrome and Opera.
