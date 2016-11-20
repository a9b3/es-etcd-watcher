import CommanderShepard from 'commander-shepard'
import changeHandler from './change-handler.js'

const pkg = require('../package.json')
const binName = Object.keys(pkg.bin)[0]
const commander = new CommanderShepard({
  pkg,
  usage: `${binName} [command] [flags]`,
  description: '',
  globalOptions: {
    config: {
      name: '--config',
      help: 'file path of the configuration',
      required: true,
    },
  },
  command: changeHandler,
})

commander.start()
