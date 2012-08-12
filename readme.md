Say Cheese!
===========
A minimal library for integrating webcam snapshots into your app.

** work in progress **

Ideal Features
--------------
The things I am aiming to implement for a 1.0 release: 

 - Full-on snapshot (take a picture of your entire stream)
 - Selective snapshot (take a picture of only a certain portion of your feed)
 - Delayed snapshot (take a picture after *X* amount of time)
 - Potential uploading, for avatar creation?


Setup
-----
Add the script to your page:

```html
<script src='say-cheese.js'></script>
```

Usage
-----
This is probs subject to change, given how early it is.

```javascript
var sayCheese = new SayCheese('#container-element');

sayCheese.start(function(e) {
  // want to take a snapshot?
  this.takeSnapshot();
});
```

This bad boy becomes usable once it triggers its own `saycheese:ready` event (subject
to change).

Compatibility
-------------
Uses the new `getUserMedia` API, which works in recent versions of Chrome and Opera.
