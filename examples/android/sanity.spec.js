/* eslint-disable */

"use strict";

const Solo = require('appium-solo')


const wd = require("wd")
const caps = {
  browserName: '',
  'appium-version': '1.3',
  platformName: 'Android',
  platformVersion: '5.0',
  deviceName: 'Android Emulator',
  fullReset: false,
  noReset:true,
  app: "http://appium.github.io/appium/assets/ApiDemos-debug.apk",
  genymotion: {
    name: 'emu-5.0.0'
  }
}

describe("android sanity", function () {
  this.timeout(300000)
  var driver

  before(function (done) {
    const appiumsrv ={host: 'localhost', port: 4723}
    Object.assign(caps, appiumsrv)

    driver = wd.promiseChainRemote(appiumsrv);

    driver.on('status', function(info) {
      console.log(info);
    });
    driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth, path, data || '');
    });
    driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth, path, data || '');
    });
    const solo = new Solo()
    solo.doctor()
    solo.start(caps, ()=>driver.init(caps))
        .then(()=>done())
        .catch((err)=>driver.quit())
  })

  after(function () {
    return driver.quit()
  })

  it("should dump a page", function () {
    return driver.elementsByXPath('//*')
            .then(elems=>console.log("elements", elems.map(e=>e.toJSON())))
  })

})
/* eslint-enable  */
