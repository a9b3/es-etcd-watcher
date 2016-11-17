import path from 'path'
import invariant from 'invariant'
import fs from 'fs'
import EsEtcd from 'es-etcd'
import _ from 'lodash'
import * as toolkit from '@esayemm/toolkit'

const api = {
  async template({ src, dest, data }) {
    invariant(toolkit.fileExists(src), `'src' must be a valid filepath`)

    const compiled = _.template(fs.readFileSync(src, { encoding: 'utf8' }), {
      imports: {
        '_': _,
      },
    })
    const rendered = compiled(data)
    console.log(data)
    fs.writeFileSync(dest, rendered, { encoding: 'utf8' })
  },
}

function verifyConfig(config) {
  invariant(config.keys.constructor === Array, `'keys' must be an Array`)
  for (let i = 0; i < config.keys.length; i++) {
    invariant(typeof config.keys[i].key === 'string', `'key' must be String`)
    invariant(config.keys[i].commands, `'commands' must be provided`)
    invariant(config.keys[i].commands.constructor === Array, `'commands' must be an Array`)
    for (let j = 0; j < config.keys[i].commands; j++) {
      invariant(typeof config.keys[i].commands[j] === 'string', `'commands' element must be a String or Function`)
      invariant(typeof config.keys[i].commands[j] === 'function', `'commands' element must be a String or Function`)
    }
  }
}

export default async function changeHandler({ options }) {
  const configFilepath = path.resolve(options.config)
  const config = require(configFilepath).default || require(configFilepath)
  verifyConfig(config)

  const defaultEtcdConfigs = {
    scheme: 'http',
    host: '0.0.0.0',
    port: 2379,
  }
  const etcdConfigs = Object.assign({}, defaultEtcdConfigs, config.etcd)
  const agentOpts = {}
  if (config.etcd && config.etcd.agentOpts) {
    Object.keys(config.etcd.agentOpts).forEach(key => {
      const filepath = config.etcd.agentOpts[key]
      agentOpts[key] = fs.readFileSync(path.resolve(filepath))
    })
  }
  etcdConfigs.agentOpts = agentOpts
  const esEtcd = new EsEtcd(etcdConfigs)

  config.keys.forEach(({ key, commands }) => {
    esEtcd.watch(key, async (data) => {
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].constructor === Function) {
          await commands[i]({ root: await esEtcd.get('/', { recursive: true }), data, api })
        } else if (commands[i].constructor === String) {
          await toolkit.execPromise(commands[i], { log: true })
        }
      }
    })
  })
}
