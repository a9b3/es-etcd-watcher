# ES-ETCD Watcher

Purpose: Run arbitrary set of commands in sequence upon a key change in etcd data store.

```
npm i -g es-etcd-watcher
```

## Example

Create a config file

```js
/* /opt/es-etcd-watcher-config */
module.exports = {
	etcd: {
		schema: 'https',
		host: '0.0.0.0',
		port: 2379,
		agentOpts: {
			ca: './ca.pem',
			key: './etcd.key',
			cert: './etcd.crt',
		},
	},
	keys: [
		{
			key: 'foo/keys',
			commands: [
				// you can pass async functions, which will be passed these args
				async ({ root, changed, api }) => api.template({ 
					src: './foo.lodash_template',
					dest: './foo.rendered',
					data: { root, changed },
				}),
				// or you can simply pass a string to be ran as a command
				'nginx reload',
			]
		}
	]
}
```

Run the watcher

```
es-etcd-watcher --config /opt/es-etcd-watcher-config
```

### Command Arguments

- root

Root will be the entire data structure stored in etcd

- changed

This will be just the changed data from etcd

- api

Currently provides the template function. Which will render a lodash template, you can pass in the root or changed data to the template to render a template based on etcd key changes.