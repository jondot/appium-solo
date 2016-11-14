
const Solo = require('./index')

class WdioService{
  onPrepare(config) {
    const solo = new Solo()
    solo.doctor()
    return solo.start({host: config.host, port: config.port}, ()=>{})
      .catch((err)=>{ console.log("error", err)})
  }

  onComplete() {
    //node or jenkins will clean our shit up
  }
}


module.exports = new WdioService()

