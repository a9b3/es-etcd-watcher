const argv = require('yargs').argv
import CommanderShepard from 'commander-shepard'
import path from 'path'

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
  command: ({ args, options }) => {
    const config = path.resolve(options.config)
    console.log(`hi`, config)
  },
})

commander.start()
