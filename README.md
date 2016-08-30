# Appium Solo

Having one Appium server for a device farm, on some occasions, may result
in flaky tests, non-responding Appium (resulting with various bash scripts to kill it),
and other problems that stem from the fact that one Appium server is very
stateful.

In fact: why not bring up an Appium, run one test session, and kill it when
done?


This is Appium Solo.

## Quick Start

In your CI system, you should use one Appium port per job, and fix a device,
iOS sim, or Emulator to your capabilities.

This is a *simple* approach to E2E CI.


```javascript
const Solo = require('appium-solo')

// somewhere in your before() block:
  const solo = new Solo()
  solo.doctor()
  solo.start(desired, ()=>driver.init(desired))
      .then(()=>done())
      .catch((err)=>driver.quit())
```

## Options

There are various knobs you can use, such as to specify locations of binaries,
timeouts, ports, Genymotion emulator (see below) and others. See [index.js](index.js) for more.


## Android Emulators

Appium launches an iOS simulator when its needed. However, it doesn't do so
for Android.

If you install Genymotion, Appium-Solo will launch a Genymotion
simulator for you the same way Appium does for iOS.




# Contributing

Fork, implement, add tests, pull request, get my everlasting thanks and a respectable place here :).


### Thanks:

To all [Contributors](https://github.com/jondot/rn-snoopy/graphs/contributors) - you make this happen, thanks!



# Copyright

Copyright (c) 2016 [Dotan Nahum](http://gplus.to/dotan) [@jondot](http://twitter.com/jondot). See [LICENSE](LICENSE.txt) for further details.
