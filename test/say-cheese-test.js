function equals(obj1, obj2) {
  for (var prop in obj1) {
    if (obj1[prop] !== obj2[prop] || obj2.hasOwnProperty(prop) === false) {
      return false;
    }
  }

  return true;
}

test("options are set correctly", function() {
  var options   = { snapshots: false, audio: false, width: 480 },
      sayCheese = new SayCheese('#camera-test', options);

  ok(equals(sayCheese.options, options), "options correctly set");

  options.audio = true
  sayCheese.setOptions(options);

  ok(equals(sayCheese.options, options), "options correctly updated");
});

asyncTest("triggers 'start' event when access permitted (click Allow)", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.on('start', function() {
    ok(true, "start event triggered");
    start();
    this.stop();
  });

  sayCheese.start();
});

asyncTest("triggers 'snapshot' event when taking a snapshot", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.on('start', function() {
    this.takeSnapshot();
  });

  sayCheese.on('snapshot', function(snapshot) {
    ok(snapshot.tagName === 'CANVAS', "snapshot event triggered");
    start();
    this.stop();
  });

  sayCheese.start();
});


asyncTest("triggers 'stop' event and successfully cleans up when stopping", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.on('stop', function() {
    ok(true, "stop event triggered");
    start();
  });

  sayCheese.on('start', function() {
    this.stop();
  });

  sayCheese.start();
});

asyncTest("snapshot feature does nothing when disabled", function() {
  var sayCheese = new SayCheese('#camera-test', { snapshots: false });

  sayCheese.on('start', function() {
    ok(this.takeSnapshot() === false, "can't take snapshot");
    start();
    this.stop();
  });

  sayCheese.start();
});

asyncTest("triggers 'error' event when not supported", function() {
  var sayCheese = new SayCheese('#camera-test');

  // store correct property so we can switch it back after following test
  var origGetUserMedia = navigator.getUserMedia;

  // simulate the lack of functionality
  navigator.getUserMedia = false;

  sayCheese.on('error', function(err) {
    navigator.getUserMedia = origGetUserMedia;
    ok(err === "NOT_SUPPORTED", "not supported event triggered");
    start();
  });

  sayCheese.start();
});

asyncTest("triggers 'error' event when access denied (click Deny)", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.on('error', function(err) {
    ok(true, "access denied event triggered");
    start();
  });

  sayCheese.start();
});

asyncTest("width is setted correctly", function() {
  var width = 480;
  var sayCheese = new SayCheese('#camera-test',{width:width});
  sayCheese.on('start', function() {
        ok(equals(sayCheese.video.width, width));
  });
  sayCheese.start();
  
});
