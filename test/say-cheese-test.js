function equals (obj1, obj2) {
  for (var prop in obj1) {
    if (obj1[prop] !== obj2[prop] || obj2.hasOwnProperty(prop) === false) {
      return false;
    }
  }

  return true;
}

test("options are set correctly", function () {
  var options   = { video: false, audio: false },
      sayCheese = new SayCheese('#camera-test', options);

  ok(equals(sayCheese.options, options), "options correctly set");
});

asyncTest("triggers 'start' event when access permitted (click Allow)", function () {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.start().then(function (camera) {
    ok(true, "start event triggered");
    start();
    camera.stop();
  })

});

asyncTest("triggers 'error' event when not supported", function() {
  var sayCheese = new SayCheese('#camera-test');

  // store correct property so we can switch it back after following test
  var origGetUserMedia = navigator.getUserMedia;

  // simulate the lack of functionality
  navigator.getUserMedia = false;

  sayCheese.start().catch(function (err) {
    navigator.getUserMedia = origGetUserMedia;
    ok(err === "NOT_SUPPORTED", "not supported event triggered");
    start();
  })

});

asyncTest("triggers 'error' event when access denied (click Deny)", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.start().catch(function (err) {
    ok(true, "access denied event triggered");
  })
});
