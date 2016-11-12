# ES-ETCD Watcher

Purpose: Run arbitrary set of commands in sequence upon a key change in etcd data store.

Example:

```js
/* /opt/es-etcd-watcher-config */
function createTemplate({ api, changed }) {
	return api.templateFile({
		src: '/opt/nginx.tpl',
		dest: '/nginx/nginx.tpl',
		args: changed,
	})
}

module.exports = {
	keys: [
		{
			key: 'foo/keys',
			commands: [
				'./script.sh',
				createTemplate,
				'nginx reload',
			]
		}
	]
}
```

```
es-etcd-watcher --config /opt/es-etcd-watcher-config
```