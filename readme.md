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
				async ({ data, api }) => api.template({ 
					src: './foo.lodash_template',
					dest: './foo.rendered',
					data,
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