
const spawnSync = require('child_process').spawnSync
const execa = require('execa')
const retry = require('bluebird-flexible-retry')

const gmDefaults = {
  adb: `${process.env['ANDROID_HOME']}/platform-tools/adb`,
  gmapp: '/Applications/Genymotion.app/Contents/MacOS/player.app/Contents/MacOS/player'
}

class Genylauncher {
  constructor (opts) {
    this.opts = Object.assign({}, gmDefaults, opts)
  }
  doctor () {
    const lsApp = spawnSync('ls', [this.opts.gmapp]).stdout
    if (!lsApp) {
      throw new Error(`Doctor: no genymotion app installed at ${this.opts.gmapp}`)
    }
    const lsAdb = spawnSync('ls', [this.opts.adb]).stdout
    if (!lsAdb) {
      throw new Error(`Doctor: no adb installed at ${this.opts.adb}\nDid you set ANDROID_HOME?`)
    }
  }
  launch (info) {
    if (!info.name) {
      return Promise.resolve().throw('No emulator name given')
    }

    execa.shell(`${this.opts.gmapp} --vm-name '${info.name}' > /dev/null 2>&1`)
          .catch(err => console.log('gm-shell', err))

    const findGm = () => execa.shell(`${this.opts.adb} devices -l`)
                    .then(res => { console.log(res.stdout); return res })
                    .then(res => res.stdout.split('\n').find(ln => ln.match(`model:${info.name.replace(/[^a-zA-~0-9]/g, '_')}`)))
                    .then(found => { if (!found) { throw new Error('no device found') } })

    return retry(findGm, {interval: 1000, timeout: 30000})
  }
}

module.exports = Genylauncher
