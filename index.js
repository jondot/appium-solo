const Promise = require('bluebird')

const { spawn, spawnSync } = require('child_process')
const rp = require('request-promise')
const retry = require('bluebird-flexible-retry')
const Genylauncher = require('./geny-launcher')

const soloDefaults = {

}

class Solo {
  constructor (opts) {
    this.opts = Object.assign({}, soloDefaults, opts)
    this.gmLauncher = new Genylauncher(opts)
  }

  doctor () {
    this.gmLauncher.doctor()

    const appiumV = spawnSync('appium', ['-v'], {env: process.env}).stdout
    if (!appiumV) {
      throw new Error('Doctor: No appium found.')
    }
    // execsync
  }

  start (caps, wdcb) {
    const capabilities = Object.assign({}, {port: 4723}, caps)

    let chain = Promise.resolve()
    if (caps.genymotion) {
      chain = chain.then(() => this.gmLauncher.launch(caps.genymotion))
    }

    const { port } = capabilities
    spawn('appium', ['-p', port, '-bp', port + 1], { env: Object.assign({}, {AP_SOLO_TAG: port}, process.env) })

    return chain.then(() => retry(this._checkAppium(`http://localhost:${port}/wd/hub/status`), {interval: 1000, timeout: 20000}))
                .then(wdcb)
  }

  stop () {
    // not sure there's value to stop an emu.
    // either way, jenkins would kill it if started under a job.
  }

  _checkAppium (url) {
    return () => rp({uri: url, timeout: 500})
  }
}

module.exports = Solo
